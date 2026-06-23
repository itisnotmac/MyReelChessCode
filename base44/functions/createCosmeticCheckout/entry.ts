import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';
import Stripe from 'npm:stripe@14.21.0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { item_id, item_type, item_name } = await req.json();

    if (!item_id || !item_type || !item_name) {
      return Response.json({ error: 'Missing item details' }, { status: 400 });
    }

    // Check if already purchased
    const existing = await base44.asServiceRole.entities.UserPurchase.filter({
      user_id: user.id,
      item_id,
    });
    if (existing.length > 0) {
      return Response.json({ error: 'Already purchased' }, { status: 400 });
    }

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: item_name },
          unit_amount: 99,
        },
        quantity: 1,
      }],
      success_url: `${req.headers.get('origin') || 'https://app.base44.com'}/Store?purchased=${item_id}`,
      cancel_url: `${req.headers.get('origin') || 'https://app.base44.com'}/Store`,
      customer_email: user.email,
      metadata: {
        base44_app_id: Deno.env.get('BASE44_APP_ID'),
        user_id: user.id,
        item_id,
        item_type,
        item_name,
      },
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error('Cosmetic checkout error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});