import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// Server-side source of truth for cosmetics purchasable with Tempo. Never
// trust client-supplied name/type — this prevents purchasing forged item ids.
const COSMETIC_CATALOG = {
  // Board skins (free)
  wood:       { name: 'Wood',            item_type: 'board',         price: 0 },
  glass:      { name: 'Glass',           item_type: 'board',         price: 0 },
  marble:     { name: 'Marble',          item_type: 'board',         price: 0 },
  obsidian:   { name: 'Obsidian',        item_type: 'board',         price: 0 },
  emerald:    { name: 'Emerald',         item_type: 'board',         price: 0 },
  // Piece sets (free)
  minimalist: { name: 'Minimalist',      item_type: 'pieces',        price: 0 },
  futuristic: { name: 'Futuristic',      item_type: 'pieces',        price: 0 },
  roman:      { name: 'Roman Soldiers',  item_type: 'pieces',        price: 0 },
  greek:      { name: 'Greek Soldiers',  item_type: 'pieces',        price: 0 },
  modern:     { name: 'Modern Combat',   item_type: 'pieces',        price: 0 },
  // Username glow colors
  glow_teal:    { name: 'Teal',     item_type: 'username_glow', price: 200 },
  glow_gold:    { name: 'Gold',     item_type: 'username_glow', price: 200 },
  glow_pink:    { name: 'Hot Pink', item_type: 'username_glow', price: 200 },
  glow_purple:  { name: 'Purple',   item_type: 'username_glow', price: 200 },
  glow_crimson: { name: 'Crimson',  item_type: 'username_glow', price: 200 },
  glow_cyan:    { name: 'Cyan',     item_type: 'username_glow', price: 200 },
  glow_lime:    { name: 'Lime',     item_type: 'username_glow', price: 200 },
  glow_orange:  { name: 'Orange',   item_type: 'username_glow', price: 200 },
  // Move trail colors
  trail_teal:    { name: 'Teal',     item_type: 'move_trail', price: 200 },
  trail_gold:    { name: 'Gold',     item_type: 'move_trail', price: 200 },
  trail_pink:    { name: 'Hot Pink', item_type: 'move_trail', price: 200 },
  trail_purple:  { name: 'Purple',   item_type: 'move_trail', price: 200 },
  trail_crimson: { name: 'Crimson', item_type: 'move_trail', price: 200 },
  trail_cyan:    { name: 'Cyan',     item_type: 'move_trail', price: 200 },
  trail_lime:    { name: 'Lime',     item_type: 'move_trail', price: 200 },
  trail_orange:  { name: 'Orange',   item_type: 'move_trail', price: 200 },
  // Grandmaster avatars
  gm_alekhine:   { name: 'Alekhine',    item_type: 'avatar', price: 500 },
  gm_fischer:    { name: 'Fischer',     item_type: 'avatar', price: 500 },
  gm_capablanca: { name: 'Capablanca',  item_type: 'avatar', price: 500 },
  gm_karpov:     { name: 'Karpov',      item_type: 'avatar', price: 500 },
  gm_carlsen:    { name: 'Carlsen',     item_type: 'avatar', price: 500 },
  gm_morphy:     { name: 'Morphy',      item_type: 'avatar', price: 500 },
  gm_nakamura:   { name: 'Nakamura',    item_type: 'avatar', price: 500 },
  gm_pillsbury:  { name: 'Pillsbury',   item_type: 'avatar', price: 500 },
  gm_timman:     { name: 'Timman',      item_type: 'avatar', price: 500 },
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
    const { name: item_name, item_type, price } = item;

    // Check if already purchased
    const existing = await base44.asServiceRole.entities.UserPurchase.filter({
      user_id: user.id,
      item_id,
    });
    if (existing.length > 0) {
      return Response.json({ error: 'Already purchased' }, { status: 400 });
    }

    // Get account
    let accounts = await base44.asServiceRole.entities.PlayerAccount.filter({ user_id: user.id });
    let account = accounts[0];

    // Free items: record purchase without deducting balance
    if (price === 0) {
      await base44.asServiceRole.entities.UserPurchase.create({
        user_id: user.id,
        item_id,
        item_type,
        item_name,
      });
      return Response.json({ success: true, new_balance: account?.currency_balance || 0 });
    }

    // Check Tempo balance
    if (!account || (account.currency_balance || 0) < price) {
      return Response.json({ error: 'Insufficient Tempo' }, { status: 400 });
    }

    // Deduct Tempo and record purchase
    account = await base44.asServiceRole.entities.PlayerAccount.update(account.id, {
      currency_balance: account.currency_balance - price,
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