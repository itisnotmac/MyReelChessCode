import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';
import Stripe from 'npm:stripe@14.21.0';

// Server-side source of truth for Tempo bundles. bundle_id -> { name, tempo, priceEnv }.
// Price IDs live in app secrets so they can be swapped without a code change.
// Never trust client-supplied price/tempo data — resolve from this catalog only.
const TEMPO_CATALOG: Record<string, { name: string; tempo: number; priceEnv: string }> = {
  tempo_200:  { name: '200 Tempo',  tempo: 200,  priceEnv: 'STRIPE_TEMPO_200_PRICE_ID' },
  tempo_500:  { name: '500 Tempo',  tempo: 500,  priceEnv: 'STRIPE_TEMPO_500_PRICE_ID' },
  tempo_1100: { name: '1100 Tempo', tempo: 1100, priceEnv: 'STRIPE_TEMPO_1100_PRICE_ID' },
  tempo_2200: { name: '2200 Tempo', tempo: 2200, priceEnv: 'STRIPE_TEMPO_2200_PRICE_ID' },
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { bundle_id } = await req.json();
    if (!bundle_id) {
      return Response.json({ error: 'Missing bundle_id' }, { status: 400 });
    }

    const bundle = TEMPO_CATALOG[bundle_id];
    if (!bundle) {
      return Response.json({ error: 'Unknown bundle' }, { status: 400 });
    }

    const priceId = Deno.env.get(bundle.priceEnv);
    if (!priceId) {
      console.error(`Missing price secret: ${bundle.priceEnv}`);
      return Response.json({ error: 'Bundle not configured' }, { status: 500 });
    }

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));
    const origin = req.headers.get('origin') || 'https://app.base44.com';

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/Store?tempo=${bundle.tempo}`,
      cancel_url: `${origin}/Store`,
      customer_email: user.email,
      metadata: {
        base44_app_id: Deno.env.get('BASE44_APP_ID'),
        user_id: user.id,
        item_id: bundle_id,
        item_type: 'tempo',
        item_name: bundle.name,
        tempo_amount: String(bundle.tempo),
      },
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error('Tempo checkout error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});