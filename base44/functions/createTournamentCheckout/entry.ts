import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';
import Stripe from 'npm:stripe@14.21.0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { tournament_id } = await req.json();
    if (!tournament_id) return Response.json({ error: 'Missing tournament_id' }, { status: 400 });

    // Verify tournament exists and registration is open
    const tournaments = await base44.entities.Tournament.filter({ id: tournament_id });
    const tournament = tournaments[0];
    if (!tournament) return Response.json({ error: 'Tournament not found' }, { status: 404 });
    if (tournament.status !== 'registration') {
      return Response.json({ error: 'Registration is closed' }, { status: 400 });
    }

    // Cap check
    if (tournament.max_players && (tournament.paid_entries ?? 0) >= tournament.max_players) {
      return Response.json({ error: 'Tournament is full' }, { status: 400 });
    }

    // Prevent duplicate paid entries
    const existing = await base44.entities.TournamentEntry.filter({ tournament_id, user_id: user.id });
    if (existing.some(e => e.payment_status === 'paid')) {
      return Response.json({ error: 'You are already registered' }, { status: 400 });
    }

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: `${tournament.name} — Tournament Buy-In` },
          unit_amount: tournament.buy_in_amount || 1000,
        },
        quantity: 1,
      }],
      success_url: `${req.headers.get('origin') || 'https://app.base44.com'}/Tournament?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin') || 'https://app.base44.com'}/Tournament`,
      customer_email: user.email,
      metadata: {
        base44_app_id: Deno.env.get('BASE44_APP_ID'),
        user_id: user.id,
        tournament_id,
        type: 'tournament_buyin',
      },
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error('Tournament checkout error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});