import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';
import Stripe from 'npm:stripe@14.21.0';

// Server-side source of truth for one-time feature unlocks.
// feature_id -> { name, price_id }. Price IDs live in app secrets so they can
// be swapped without a code change. Never trust client-supplied price data.
const FEATURE_CATALOG: Record<string, { name: string; priceEnv: string; successPath: string }> = {
  qr_host_unlock: {
    name: 'QR Host Unlock',
    priceEnv: 'STRIPE_QR_HOST_PRICE_ID',
    successPath: '/WifiMatch',
  },
  '2v2_host_unlock': {
    name: '2v2 Host Unlock',
    priceEnv: 'STRIPE_2V2_HOST_PRICE_ID',
    successPath: '/Online2v2Game',
  },
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { feature_id } = await req.json();
    if (!feature_id) {
      return Response.json({ error: 'Missing feature_id' }, { status: 400 });
    }

    const feature = FEATURE_CATALOG[feature_id];
    if (!feature) {
      return Response.json({ error: 'Unknown feature' }, { status: 400 });
    }

    const priceId = Deno.env.get(feature.priceEnv);
    if (!priceId) {
      console.error(`Missing price secret: ${feature.priceEnv}`);
      return Response.json({ error: 'Feature not configured' }, { status: 500 });
    }

    // Idempotency: refuse if already unlocked
    const existing = await base44.asServiceRole.entities.UserPurchase.filter({
      user_id: user.id,
      item_id: feature_id,
    });
    if (existing.length > 0) {
      return Response.json({ error: 'Already purchased' }, { status: 400 });
    }

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));
    const origin = req.headers.get('origin') || 'https://app.base44.com';

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}${feature.successPath}?unlocked=${feature_id}`,
      cancel_url: `${origin}/`,
      customer_email: user.email,
      metadata: {
        base44_app_id: Deno.env.get('BASE44_APP_ID'),
        user_id: user.id,
        item_id: feature_id,
        item_type: 'feature',
        item_name: feature.name,
      },
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error('Feature checkout error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});