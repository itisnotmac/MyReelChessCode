import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';
import Stripe from 'npm:stripe@14.21.0';

Deno.serve(async (req) => {
  try {
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

    // Refuse to process if the signing secret is missing/empty — without it,
    // signature verification cannot be trusted and the endpoint could accept
    // forged or replayed Stripe events.
    if (!stripeKey || !webhookSecret) {
      console.error('Stripe webhook secrets not configured');
      return Response.json({ error: 'Webhook not configured' }, { status: 500 });
    }

    const stripe = new Stripe(stripeKey);
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      return Response.json({ error: 'Missing signature' }, { status: 400 });
    }

    let event;
    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return Response.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const base44 = createClientFromRequest(req);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const userId = session.metadata?.user_id;

      if (userId && session.mode === 'subscription') {
        const users = await base44.asServiceRole.entities.User.filter({ id: userId });
        if (users.length > 0) {
          await base44.asServiceRole.entities.User.update(userId, { is_premium: true });
          console.log(`Upgraded user ${userId} to premium`);
        }
      }

      if (userId && session.mode === 'payment') {
        // Tournament buy-in
        if (session.metadata?.type === 'tournament_buyin') {
          const tournamentId = session.metadata?.tournament_id;
          if (tournamentId) {
            const existing = await base44.asServiceRole.entities.TournamentEntry.filter({
              tournament_id: tournamentId,
              user_id: userId,
            });
            if (!existing.some(e => e.payment_status === 'paid')) {
              await base44.asServiceRole.entities.TournamentEntry.create({
                tournament_id: tournamentId,
                user_id: userId,
                payment_status: 'paid',
                checkout_session_id: session.id,
                stripe_payment_intent: session.payment_intent,
              });
              await base44.asServiceRole.entities.Tournament.updateMany(
                { id: tournamentId },
                { $inc: { paid_entries: 1 } }
              );
              console.log(`Tournament entry: user=${userId}, tournament=${tournamentId}`);
            }
          }
        }

        // Cosmetic purchase
        const itemId = session.metadata?.item_id;
        const itemType = session.metadata?.item_type;
        const itemName = session.metadata?.item_name;
        if (itemId) {
          const existing = await base44.asServiceRole.entities.UserPurchase.filter({
            user_id: userId,
            item_id: itemId,
          });
          if (existing.length === 0) {
            await base44.asServiceRole.entities.UserPurchase.create({
              user_id: userId,
              item_id: itemId,
              item_type: itemType || '',
              item_name: itemName || '',
            });
            console.log(`Recorded cosmetic purchase: user=${userId}, item=${itemId}`);
          }
        }
      }
    }

    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object;
      const customerId = subscription.customer;

      // Find the customer to get their email, then match to user
      const customer = await stripe.customers.retrieve(customerId);
      if (customer.email) {
        const users = await base44.asServiceRole.entities.User.filter({ email: customer.email });
        if (users.length > 0) {
          await base44.asServiceRole.entities.User.update(users[0].id, { is_premium: false });
          console.log(`Downgraded user ${users[0].id} from premium`);
        }
      }
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});