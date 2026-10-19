import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';

const TEMPO_AMOUNTS = {
  tempo_spark_pack: 200,
  tempo_surge_pack: 500,
  tempo_overdrive_pack: 1100,
  tempo_supernova_pack: 2400,
};

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const productId = body?.product_id;
    const tempoGranted = TEMPO_AMOUNTS[productId];
    if (!tempoGranted) {
      return Response.json({ error: 'Invalid or unknown product_id' }, { status: 400 });
    }

    const accounts = await base44.asServiceRole.entities.PlayerAccount.filter({ user_id: user.id });
    const account = Array.isArray(accounts) ? accounts[0] : accounts.items?.[0];
    if (!account) {
      return Response.json({ error: 'PlayerAccount not found' }, { status: 404 });
    }

    const newBalance = (account.currency_balance || 0) + tempoGranted;
    await base44.asServiceRole.entities.PlayerAccount.update(account.id, { currency_balance: newBalance });

    return Response.json({ success: true, new_balance: newBalance, tempo_granted: tempoGranted });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}