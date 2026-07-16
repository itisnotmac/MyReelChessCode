import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

// Comped Premium duration granted to every non-cashing entrant when a tournament ends.
const PREMIUM_COMP_DAYS = 90;

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { game_id } = await req.json();
    if (!game_id) return Response.json({ error: 'Missing game_id' }, { status: 400 });

    const games = await base44.asServiceRole.entities.OnlineGame.filter({ id: game_id });
    const game = games[0];
    if (!game) return Response.json({ error: 'Game not found' }, { status: 404 });
    if (!game.tournament_id) return Response.json({ ok: true, message: 'Not a tournament game' });

    // Only a participant may settle the bracket outcome
    if (game.host_id !== user.id && game.guest_id !== user.id) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }
    if (game.tournament_settled) return Response.json({ ok: true, message: 'Already settled' });
    if (game.result === 'in_progress' || game.status !== 'finished') {
      return Response.json({ ok: true, message: 'Game not finished' });
    }

    const tournamentId = game.tournament_id;
    const round = game.tournament_round || 0;
    const entries = await base44.asServiceRole.entities.TournamentEntry.filter({
      tournament_id: tournamentId,
      payment_status: 'paid',
    });
    const hostEntry = entries.find(e => e.user_id === game.host_id);
    const guestEntry = entries.find(e => e.user_id === game.guest_id);

    // Decide winner & loser (draw -> higher seed / lower bracket_position advances)
    let winnerId, loserId;
    if (game.result === 'white_wins') {
      winnerId = game.host_id; loserId = game.guest_id;
    } else if (game.result === 'black_wins') {
      winnerId = game.guest_id; loserId = game.host_id;
    } else {
      const hostPos = hostEntry?.bracket_position ?? Infinity;
      const guestPos = guestEntry?.bracket_position ?? Infinity;
      winnerId = hostPos <= guestPos ? game.host_id : game.guest_id;
      loserId = winnerId === game.host_id ? game.guest_id : game.host_id;
    }

    // 3rd-place playoff: winner takes 3rd, loser takes 4th. Both already eliminated.
    if (game.is_third_place) {
      const winnerEntry = entries.find(e => e.user_id === winnerId);
      const loserEntry = entries.find(e => e.user_id === loserId);
      if (winnerEntry) await base44.asServiceRole.entities.TournamentEntry.update(winnerEntry.id, { placement: 3 });
      if (loserEntry) await base44.asServiceRole.entities.TournamentEntry.update(loserEntry.id, { placement: 4 });
      await base44.asServiceRole.entities.OnlineGame.update(game_id, { tournament_settled: true });
      await updateResults(base44, tournamentId, { 3: winnerId, 4: loserId });
      return Response.json({ ok: true, settled: true, third: winnerId, fourth: loserId });
    }

    // Normal bracket game: eliminate the loser and record the round of elimination
    const loserEntry = entries.find(e => e.user_id === loserId);
    if (loserEntry && !loserEntry.eliminated) {
      await base44.asServiceRole.entities.TournamentEntry.update(loserEntry.id, {
        eliminated: true,
        eliminated_round: round,
      });
    }
    await base44.asServiceRole.entities.OnlineGame.update(game_id, { tournament_settled: true });

    const refreshed = await base44.asServiceRole.entities.TournamentEntry.filter({
      tournament_id: tournamentId,
      payment_status: 'paid',
    });
    const survivors = refreshed.filter(e => !e.eliminated);

    if (survivors.length === 1) {
      // The final just completed — resolve the full top 8.
      const finalRound = round;
      const championEntry = survivors[0];
      await base44.asServiceRole.entities.TournamentEntry.update(championEntry.id, { placement: 1 });
      if (loserEntry) await base44.asServiceRole.entities.TournamentEntry.update(loserEntry.id, { placement: 2 });

      // 5th–8th = the four quarterfinal losers (eliminated in the QF round = finalRound - 2)
      const qfRound = finalRound - 2;
      const qfLosers = refreshed.filter(e => e.eliminated && (e.eliminated_round || 0) === qfRound);
      if (qfLosers.length > 0) {
        await base44.asServiceRole.entities.TournamentEntry.bulkUpdate(
          qfLosers.map(e => ({ id: e.id, placement: 5 }))
        );
      }

      // Non-winners = everyone eliminated before the QF round. They get 3 months comped Premium.
      const nonWinners = refreshed.filter(e => e.eliminated && (e.eliminated_round || 0) < qfRound);
      let premiumGranted = 0;
      if (nonWinners.length > 0) {
        const until = new Date(Date.now() + PREMIUM_COMP_DAYS * 24 * 60 * 60 * 1000).toISOString();
        try {
          for (let i = 0; i < nonWinners.length; i += 500) {
            const batch = nonWinners.slice(i, i + 500).map(e => ({ id: e.user_id, premium_until: until }));
            await base44.asServiceRole.entities.User.bulkUpdate(batch);
          }
          premiumGranted = nonWinners.length;
          console.log(`Granted 3-month Premium to ${premiumGranted} non-winners`);
        } catch (gErr) {
          console.error('Premium grant failed:', gErr.message);
        }
      }

      await base44.asServiceRole.entities.Tournament.update(tournamentId, { status: 'completed' });
      await updateResults(base44, tournamentId, { 1: championEntry.user_id, 2: loserId });
      if (qfLosers.length > 0) {
        await updateResultsTier(base44, tournamentId, '5_8', qfLosers.map(e => e.user_id));
      }
      return Response.json({
        ok: true,
        settled: true,
        champion: championEntry.user_id,
        runner_up: loserId,
        premium_granted: premiumGranted,
      });
    }

    // Otherwise advance the bracket (pairs the next round, and stages the 3rd-place
    // match once the finalists are determined).
    try {
      await base44.functions.invoke('pairTournamentRound', { tournament_id: tournamentId });
    } catch (e) {
      console.error('pairTournamentRound invoke failed:', e.message);
    }

    return Response.json({ ok: true, settled: true, loser: loserId });
  } catch (error) {
    console.error('settleTournamentGame error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

// Merge placements into the tournament's results JSON (id + display name).
async function updateResults(base44, tournamentId, placements) {
  try {
    const t = (await base44.asServiceRole.entities.Tournament.filter({ id: tournamentId }))[0];
    let results = {};
    try { results = t?.results ? JSON.parse(t.results) : {}; } catch {}
    for (const [place, userId] of Object.entries(placements)) {
      const users = await base44.asServiceRole.entities.User.filter({ id: userId });
      const name = users[0]?.full_name || users[0]?.email || 'Player';
      results[place] = { id: userId, name };
    }
    await base44.asServiceRole.entities.Tournament.update(tournamentId, { results: JSON.stringify(results) });
  } catch (e) {
    console.error('updateResults failed:', e.message);
  }
}

// Merge a tier (e.g. 5th-8th) as an array of {id, name} into the results JSON.
async function updateResultsTier(base44, tournamentId, key, userIds) {
  try {
    const t = (await base44.asServiceRole.entities.Tournament.filter({ id: tournamentId }))[0];
    let results = {};
    try { results = t?.results ? JSON.parse(t.results) : {}; } catch {}
    const named = [];
    for (const userId of userIds) {
      const users = await base44.asServiceRole.entities.User.filter({ id: userId });
      const name = users[0]?.full_name || users[0]?.email || 'Player';
      named.push({ id: userId, name });
    }
    results[key] = named;
    await base44.asServiceRole.entities.Tournament.update(tournamentId, { results: JSON.stringify(results) });
  } catch (e) {
    console.error('updateResultsTier failed:', e.message);
  }
}