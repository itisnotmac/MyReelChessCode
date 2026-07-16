import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

// Standard chess starting position + castling rights, serialized to match the
// format the online game engine reads (see ChessLogic.createInitialBoard).
const INITIAL_BOARD = JSON.stringify([
  ['r','n','b','q','k','b','n','r'],
  ['p','p','p','p','p','p','p','p'],
  [null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null],
  ['P','P','P','P','P','P','P','P'],
  ['R','N','B','Q','K','B','N','R'],
]);
const INITIAL_CASTLING = JSON.stringify({
  whiteKingside: true,
  whiteQueenside: true,
  blackKingside: true,
  blackQueenside: true,
});

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { tournament_id } = await req.json();
    if (!tournament_id) return Response.json({ error: 'Missing tournament_id' }, { status: 400 });

    const tournaments = await base44.asServiceRole.entities.Tournament.filter({ id: tournament_id });
    const tournament = tournaments[0];
    if (!tournament) return Response.json({ error: 'Tournament not found' }, { status: 404 });
    if (tournament.status !== 'active') {
      return Response.json({ ok: true, message: 'Tournament not active' });
    }

    const games = await base44.asServiceRole.entities.OnlineGame.filter({ tournament_id });
    const entries = await base44.asServiceRole.entities.TournamentEntry.filter({
      tournament_id,
      payment_status: 'paid',
    });
    const survivors = entries
      .filter(e => !e.eliminated)
      .sort((a, b) => (a.bracket_position || 0) - (b.bracket_position || 0));

    // Champion crowned
    if (survivors.length <= 1) {
      await base44.asServiceRole.entities.Tournament.update(tournament_id, { status: 'completed' });
      return Response.json({ ok: true, completed: true });
    }

    // 3rd-place matches are staged alongside the final but don't drive advancement
    const mainGames = games.filter(g => !g.is_third_place);
    const maxRound = mainGames.reduce((m, g) => Math.max(m, g.tournament_round || 0), 0);

    if (maxRound === 0) {
      // Round 1 — pair all survivors (none eliminated yet); odd seed gets a bye
      await createRound(base44, tournament_id, 1, survivors, false);
      await base44.asServiceRole.entities.Tournament.update(tournament_id, { current_round: 1 });
      return Response.json({ ok: true, round: 1 });
    }

    // Wait for the current main-bracket round to finish before advancing
    const currentRoundGames = mainGames.filter(g => (g.tournament_round || 0) === maxRound);
    const unfinished = currentRoundGames.filter(g => g.status !== 'finished');
    if (unfinished.length > 0) {
      return Response.json({ ok: true, round: maxRound, message: 'Round in progress' });
    }

    const nextRound = maxRound + 1;
    const existingNext = mainGames.filter(g => (g.tournament_round || 0) === nextRound);
    if (existingNext.length > 0) {
      return Response.json({ ok: true, round: nextRound, message: 'Next round already created' });
    }

    // Pair the survivors into the next round
    await createRound(base44, tournament_id, nextRound, survivors, false);
    await base44.asServiceRole.entities.Tournament.update(tournament_id, { current_round: nextRound });

    // When the final is staged (exactly 2 survivors), also stage a 3rd-place match
    // between the two players eliminated in the just-completed (semifinal) round.
    if (survivors.length === 2) {
      const thirdPlaceExists = games.some(g => g.is_third_place);
      if (!thirdPlaceExists) {
        const semifinalLosers = entries
          .filter(e => e.eliminated && (e.eliminated_round || 0) === maxRound)
          .sort((a, b) => (a.bracket_position || 0) - (b.bracket_position || 0));
        if (semifinalLosers.length === 2) {
          await createRound(base44, tournament_id, nextRound, semifinalLosers, true);
        }
      }
    }

    return Response.json({ ok: true, round: nextRound });
  } catch (error) {
    console.error('pairTournamentRound error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

// Pairs players two-by-two (sequential seeding). An odd final player gets a bye
// (no game created) and automatically advances. isThirdPlace tags 3rd-place games
// so they're excluded from main-bracket advancement checks.
async function createRound(base44, tournament_id, round, players, isThirdPlace) {
  for (let i = 0; i + 1 < players.length; i += 2) {
    const host = players[i];
    const guest = players[i + 1];
    await base44.asServiceRole.entities.OnlineGame.create({
      host_id: host.user_id,
      guest_id: guest.user_id,
      status: 'active',
      board: INITIAL_BOARD,
      is_white_turn: true,
      castling: INITIAL_CASTLING,
      en_passant: null,
      last_move: null,
      captured_white: '[]',
      captured_black: '[]',
      result: 'in_progress',
      move_count: 0,
      tournament_id,
      tournament_round: round,
      tournament_settled: false,
      is_third_place: isThirdPlace,
    });
  }
}