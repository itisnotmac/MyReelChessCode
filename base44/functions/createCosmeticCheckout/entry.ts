import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';
import Stripe from 'npm:stripe@14.21.0';

// Server-side source of truth for purchasable cosmetics.
// item_id -> { name, item_type, price (cents) }. Never trust client-supplied
// name/type/price — this prevents purchasing arbitrary/forged item identifiers.
const COSMETIC_CATALOG = {
  wood:       { name: 'Wood',            item_type: 'board',  price: 99 },
  glass:      { name: 'Glass',           item_type: 'board',  price: 99 },
  marble:     { name: 'Marble',          item_type: 'board',  price: 99 },
  obsidian:   { name: 'Obsidian',        item_type: 'board',  price: 99 },
  emerald:    { name: 'Emerald',         item_type: 'board',  price: 99 },
  minimalist: { name: 'Minimalist',      item_type: 'pieces', price: 99 },
  futuristic: { name: 'Futuristic',      item_type: 'pieces', price: 99 },
  roman:      { name: 'Roman Soldiers',  item_type: 'pieces', price: 99 },
  greek:      { name: 'Greek Soldiers',  item_type: 'pieces', price: 99 },
  modern:     { name: 'Modern Combat',    item_type: 'pieces', price: 99 },
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { item_id } = await req.json();
    if (!item_id) {
      return Response.json({ error: 'Missing item_id' }, { status: 400 });
    }

    // Resolve item details from the server-side catalog only.
    const item = COSMETIC_CATALOG[item_id];
    if (!item) {
      return Response.json({ error: 'Unknown item' }, { status: 400 });
    }
    const { name: item_name, item_type, price } = item;

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
          unit_amount: price,
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