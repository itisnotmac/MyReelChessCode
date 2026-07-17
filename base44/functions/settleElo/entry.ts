import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

// Standard ELO constants
const K = 32;
const DEFAULT_ELO = 1200;

function expectedScore(rA, rB) {
  return 1 / (1 + Math.pow(10, (rB - rA) / 400));
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
    if (!game.result || game.result === 'in_progress') {
      return Response.json({ settled: false, reason: 'in_progress' });
    }
    if (game.elo_settled) {
      return Response.json({ settled: false, reason: 'already_settled' });
    }

    const hostId = game.host_id;   // plays white
    const guestId = game.guest_id; // plays black
    if (!hostId || !guestId) return Response.json({ error: 'Missing players' }, { status: 400 });

    // Load or create each player's account
    let hostAccount = (await base44.asServiceRole.entities.PlayerAccount.filter({ user_id: hostId }))[0];
    if (!hostAccount) {
      hostAccount = await base44.asServiceRole.entities.PlayerAccount.create({
        user_id: hostId, currency_balance: 0, elo: DEFAULT_ELO, peak_elo: DEFAULT_ELO,
      });
    }
    let guestAccount = (await base44.asServiceRole.entities.PlayerAccount.filter({ user_id: guestId }))[0];
    if (!guestAccount) {
      guestAccount = await base44.asServiceRole.entities.PlayerAccount.create({
        user_id: guestId, currency_balance: 0, elo: DEFAULT_ELO, peak_elo: DEFAULT_ELO,
      });
    }

    const hostElo = hostAccount.elo ?? DEFAULT_ELO;
    const guestElo = guestAccount.elo ?? DEFAULT_ELO;

    const eHost = expectedScore(hostElo, guestElo);
    let scoreHost;
    if (game.result === 'white_wins') scoreHost = 1;
    else if (game.result === 'black_wins') scoreHost = 0;
    else scoreHost = 0.5; // draw

    const newHostElo = Math.round(hostElo + K * (scoreHost - eHost));
    const newGuestElo = Math.round(guestElo + K * ((1 - scoreHost) - (1 - eHost)));

    await base44.asServiceRole.entities.PlayerAccount.update(hostAccount.id, {
      elo: newHostElo,
      peak_elo: Math.max(hostAccount.peak_elo ?? newHostElo, newHostElo),
    });
    await base44.asServiceRole.entities.PlayerAccount.update(guestAccount.id, {
      elo: newGuestElo,
      peak_elo: Math.max(guestAccount.peak_elo ?? newGuestElo, newGuestElo),
    });

    // Mark settled so concurrent/duplicate calls don't double-apply.
    await base44.asServiceRole.entities.OnlineGame.update(game.id, { elo_settled: true });

    return Response.json({ settled: true, host_elo: newHostElo, guest_elo: newGuestElo });
  } catch (error) {
    console.error('settleElo error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});