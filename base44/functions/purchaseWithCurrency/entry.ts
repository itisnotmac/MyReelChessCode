import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const ITEM_COST = 100; // 100 coins = $1.00

// Server-side source of truth for cosmetics purchasable with coins. Mirrors the
// catalog in createCosmeticCheckout. item_id -> { name, item_type }. Never
// trust client-supplied name/type — this prevents purchasing forged item ids.
const COSMETIC_CATALOG = {
  wood:       { name: 'Wood',            item_type: 'board' },
  glass:      { name: 'Glass',           item_type: 'board' },
  marble:     { name: 'Marble',          item_type: 'board' },
  obsidian:   { name: 'Obsidian',        item_type: 'board' },
  emerald:    { name: 'Emerald',         item_type: 'board' },
  minimalist: { name: 'Minimalist',      item_type: 'pieces' },
  futuristic: { name: 'Futuristic',      item_type: 'pieces' },
  roman:      { name: 'Roman Soldiers',  item_type: 'pieces' },
  greek:      { name: 'Greek Soldiers',  item_type: 'pieces' },
  modern:     { name: 'Modern Combat',   item_type: 'pieces' },
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { item_id } = await req.json();
    if (!item_id) {
      return Response.json({ error: 'Missing item_id' }, { status: 400 });
    }

    // Resolve item details from the server-side catalog only.
    const item = COSMETIC_CATALOG[item_id];
    if (!item) {
      return Response.json({ error: 'Unknown item' }, { status: 400 });
    }
    const { name: item_name, item_type } = item;

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