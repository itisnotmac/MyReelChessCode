import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';

const AD_REWARD_TEMPO = 25;
const COOLDOWN_MS = 12 * 60 * 60 * 1000;

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const checkOnly = body?.check_only === true;

    const accounts = await base44.asServiceRole.entities.PlayerAccount.filter({ user_id: user.id });
    const account = Array.isArray(accounts) ? accounts[0] : accounts.items?.[0];
    if (!account) {
      return Response.json({ error: 'PlayerAccount not found' }, { status: 404 });
    }

    const now = Date.now();
    const last = account.last_ad_reward_at ? new Date(account.last_ad_reward_at).getTime() : null;
    const cooldownEnds = last ? last + COOLDOWN_MS : null;
    const onCooldown = Boolean(cooldownEnds && now < cooldownEnds);

    if (checkOnly) {
      return onCooldown
        ? Response.json({ success: false, next_available_at: new Date(cooldownEnds).toISOString() })
        : Response.json({ success: true });
    }

    if (onCooldown) {
      return Response.json({
        success: false,
        error: 'Cooldown active',
        next_available_at: new Date(cooldownEnds).toISOString(),
      });
    }

    const newBalance = (account.currency_balance || 0) + AD_REWARD_TEMPO;
    const nowIso = new Date(now).toISOString();
    await base44.asServiceRole.entities.PlayerAccount.update(account.id, {
      currency_balance: newBalance,
      last_ad_reward_at: nowIso,
    });

    return Response.json({
      success: true,
      new_balance: newBalance,
      next_available_at: new Date(now + COOLDOWN_MS).toISOString(),
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}