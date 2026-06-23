import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { mode, result, date } = await req.json();
    if (!mode || !result || !date) {
      return Response.json({ error: 'Missing mode, result, or date' }, { status: 400 });
    }

    // Get or create PlayerAccount
    let accounts = await base44.asServiceRole.entities.PlayerAccount.filter({ user_id: user.id });
    let account = accounts[0];

    if (!account) {
      account = await base44.asServiceRole.entities.PlayerAccount.create({
        user_id: user.id,
        currency_balance: 0,
        last_challenge_date: date,
        daily_wins: 0,
        daily_ai_wins: 0,
        daily_local_wins: 0,
        daily_games_played: 0,
        claimed_today: '[]',
      });
    }

    // Reset daily progress if new day
    if (account.last_challenge_date !== date) {
      account.daily_wins = 0;
      account.daily_ai_wins = 0;
      account.daily_local_wins = 0;
      account.daily_games_played = 0;
      account.claimed_today = '[]';
      account.last_challenge_date = date;
    }

    // Update progress
    const isWin = result === 'white_wins' || result === 'black_wins';
    const updates = {
      daily_games_played: (account.daily_games_played || 0) + 1,
      last_challenge_date: date,
    };

    if (isWin) {
      updates.daily_wins = (account.daily_wins || 0) + 1;
      if (mode === 'ai') updates.daily_ai_wins = (account.daily_ai_wins || 0) + 1;
      if (mode === 'local') updates.daily_local_wins = (account.daily_local_wins || 0) + 1;
    } else {
      updates.daily_wins = account.daily_wins || 0;
      updates.daily_ai_wins = account.daily_ai_wins || 0;
      updates.daily_local_wins = account.daily_local_wins || 0;
    }

    updates.claimed_today = account.claimed_today || '[]';

    account = await base44.asServiceRole.entities.PlayerAccount.update(account.id, updates);

    return Response.json({ success: true, account });
  } catch (error) {
    console.error('recordGameResult error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});