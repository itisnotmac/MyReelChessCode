import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const ITEM_COST = 100; // 100 coins = $1.00

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

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

    // Check coin balance
    let accounts = await base44.asServiceRole.entities.PlayerAccount.filter({ user_id: user.id });
    let account = accounts[0];
    if (!account || (account.currency_balance || 0) < ITEM_COST) {
      return Response.json({ error: 'Insufficient coins' }, { status: 400 });
    }

    // Deduct coins and record purchase
    account = await base44.asServiceRole.entities.PlayerAccount.update(account.id, {
      currency_balance: account.currency_balance - ITEM_COST,
    });

    await base44.asServiceRole.entities.UserPurchase.create({
      user_id: user.id,
      item_id,
      item_type,
      item_name,
    });

    return Response.json({
      success: true,
      new_balance: account.currency_balance,
    });
  } catch (error) {
    console.error('purchaseWithCurrency error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});