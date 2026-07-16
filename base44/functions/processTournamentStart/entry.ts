import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';
import Stripe from 'npm:stripe@14.21.0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { tournament_id } = await req.json();
    if (!tournament_id) return Response.json({ error: 'Missing tournament_id' }, { status: 400 });

    const tournaments = await base44.asServiceRole.entities.Tournament.filter({ id: tournament_id });
    const tournament = tournaments[0];
    if (!tournament) return Response.json({ error: 'Tournament not found' }, { status: 404 });

    const entries = await base44.asServiceRole.entities.TournamentEntry.filter({
      tournament_id,
      payment_status: 'paid',
    });

    const minPlayers = tournament.min_players || 200;

    // Not enough turnout — refund every paid buy-in and cancel
    if (entries.length < minPlayers) {
      const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));
      let refundedCount = 0;
      for (const entry of entries) {
        if (!entry.stripe_payment_intent) continue;
        try {
          await stripe.refunds.create({ payment_intent: entry.stripe_payment_intent });
          await base44.asServiceRole.entities.TournamentEntry.update(entry.id, {
            payment_status: 'refunded',
            refunded: true,
          });
          refundedCount++;
        } catch (e) {
          console.error(`Refund failed for entry ${entry.id}:`, e.message);
        }
      }
      await base44.asServiceRole.entities.Tournament.update(tournament_id, {
        status: 'cancelled',
        paid_entries: 0,
      });
      return Response.json({
        success: true,
        cancelled: true,
        refunded: refundedCount,
        message: `Insufficient turnout (${entries.length}/${minPlayers}) — ${refundedCount} buy-ins refunded.`,
      });
    }

    // Enough turnout — assign bracket positions and activate
    const seeded = [...entries].sort(() => Math.random() - 0.5);
    await Promise.all(seeded.map((entry, i) =>
      base44.asServiceRole.entities.TournamentEntry.update(entry.id, { bracket_position: i + 1 })
    ));

    const prizePool = entries.length * (tournament.buy_in_amount || 1000);
    await base44.asServiceRole.entities.Tournament.update(tournament_id, {
      status: 'active',
      prize_pool: prizePool,
    });

    return Response.json({
      success: true,
      active: true,
      players: entries.length,
      prize_pool: prizePool,
    });
  } catch (error) {
    console.error('processTournamentStart error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});