import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

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

    // Determine the loser (white_wins -> guest loses; black_wins -> host loses;
    // draw -> higher seed, i.e. lower bracket_position, advances)
    let loserUserId;
    if (game.result === 'white_wins') {
      loserUserId = game.guest_id;
    } else if (game.result === 'black_wins') {
      loserUserId = game.host_id;
    } else {
      const entries = await base44.asServiceRole.entities.TournamentEntry.filter({
        tournament_id: game.tournament_id,
        payment_status: 'paid',
      });
      const hostEntry = entries.find(e => e.user_id === game.host_id);
      const guestEntry = entries.find(e => e.user_id === game.guest_id);
      const hostPos = hostEntry?.bracket_position ?? Infinity;
      const guestPos = guestEntry?.bracket_position ?? Infinity;
      loserUserId = hostPos <= guestPos ? game.guest_id : game.host_id;
    }

    // Eliminate the loser
    const loserEntries = await base44.asServiceRole.entities.TournamentEntry.filter({
      tournament_id: game.tournament_id,
      user_id: loserUserId,
      payment_status: 'paid',
    });
    for (const e of loserEntries) {
      await base44.asServiceRole.entities.TournamentEntry.update(e.id, { eliminated: true });
    }

    // Mark the game settled (idempotency guard)
    await base44.asServiceRole.entities.OnlineGame.update(game_id, { tournament_settled: true });

    // Advance the bracket — pairs the next round once the current round is complete
    try {
      await base44.functions.invoke('pairTournamentRound', { tournament_id: game.tournament_id });
    } catch (e) {
      console.error('pairTournamentRound invoke failed:', e.message);
    }

    return Response.json({ ok: true, settled: true, loser: loserUserId });
  } catch (error) {
    console.error('settleTournamentGame error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});