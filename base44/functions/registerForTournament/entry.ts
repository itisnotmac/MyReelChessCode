import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { tournament_id } = await req.json();
    if (!tournament_id) return Response.json({ error: 'Missing tournament_id' }, { status: 400 });

    const tournaments = await base44.entities.Tournament.filter({ id: tournament_id });
    const tournament = tournaments[0];
    if (!tournament) return Response.json({ error: 'Tournament not found' }, { status: 404 });
    if (tournament.status !== 'registration') {
      return Response.json({ error: 'Registration is closed' }, { status: 400 });
    }

    // Premium subscription required — Tournament Pass model
    if (!user.data?.is_premium) {
      return Response.json({ error: 'Premium subscription required to enter tournaments' }, { status: 403 });
    }

    // Cap check
    if (tournament.max_players && (tournament.paid_entries ?? 0) >= tournament.max_players) {
      return Response.json({ error: 'Tournament is full' }, { status: 400 });
    }

    // Prevent duplicate entries
    const existing = await base44.entities.TournamentEntry.filter({ tournament_id, user_id: user.id });
    if (existing.some(e => e.payment_status === 'paid')) {
      return Response.json({ error: 'You are already registered' }, { status: 400 });
    }

    // Create the entry directly — no payment session needed for premium subscribers
    await base44.entities.TournamentEntry.create({
      tournament_id,
      user_id: user.id,
      payment_status: 'paid',
    });

    // Increment paid_entries atomically
    await base44.asServiceRole.entities.Tournament.updateMany(
      { id: tournament_id },
      { $inc: { paid_entries: 1 } }
    );

    return Response.json({ success: true });
  } catch (error) {
    console.error('Tournament registration error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});