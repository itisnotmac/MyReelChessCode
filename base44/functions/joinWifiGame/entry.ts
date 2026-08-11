import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const inviteCode = (body.invite_code || '').toString().trim().toUpperCase();
    if (!inviteCode) return Response.json({ error: 'Invite code required' }, { status: 400 });

    // Find the waiting game by invite code (service role to read all games)
    const games = await base44.asServiceRole.entities.OnlineGame.filter({
      invite_code: inviteCode,
      status: 'waiting'
    });
    const game = games[0];
    if (!game) return Response.json({ error: 'Game not found or already started' }, { status: 404 });

    if (game.host_id === user.id) {
      return Response.json({ error: 'You cannot join your own game' }, { status: 400 });
    }

    // Atomically claim the guest slot and activate the game
    const updated = await base44.asServiceRole.entities.OnlineGame.update(game.id, {
      guest_id: user.id,
      status: 'active'
    });

    return Response.json({ game_id: game.id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}