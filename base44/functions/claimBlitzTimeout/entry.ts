import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

const BLITZ_START = 30;
const BLITZ_FLOOR = 15;

function getBlitzTimeLimit(capturedCount: number): number {
  return Math.max(BLITZ_FLOOR, BLITZ_START - Math.floor(capturedCount / 2));
}

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
    if (game.game_mode !== 'blitz') return Response.json({ error: 'Not a blitz game' }, { status: 400 });
    if (game.result && game.result !== 'in_progress') return Response.json({ claimed: false, reason: 'already_finished' });
    if (!game.turn_started_at) return Response.json({ claimed: false, reason: 'no_timer' });

    // Only the waiting player (not the active player) can claim a timeout win
    const isHost = game.host_id === user.id;
    const isGuest = game.guest_id === user.id;
    if (!isHost && !isGuest) return Response.json({ error: 'Not a player' }, { status: 403 });

    const whiteTurn = game.is_white_turn;
    const activeIsHost = whiteTurn; // host plays white
    if (activeIsHost === isHost) return Response.json({ claimed: false, reason: 'your_turn' });

    // Calculate the active player's time limit from their captured pieces
    let capturedCount = 0;
    try {
      const capturedRaw = whiteTurn ? game.captured_white : game.captured_black;
      capturedCount = JSON.parse(capturedRaw || '[]').length;
    } catch { capturedCount = 0; }
    const timeLimit = getBlitzTimeLimit(capturedCount);

    const elapsed = (Date.now() - new Date(game.turn_started_at).getTime()) / 1000;
    if (elapsed < timeLimit) return Response.json({ claimed: false, reason: 'time_not_up', elapsed, timeLimit });

    // Opponent timed out — claim the win
    const result = whiteTurn ? 'black_wins' : 'white_wins';
    await base44.asServiceRole.entities.OnlineGame.update(game.id, {
      result,
      status: 'finished',
    });

    return Response.json({ claimed: true, result });
  } catch (error) {
    console.error('claimBlitzTimeout error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});