import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';
import { CHALLENGES, formatDate, getDayIndex } from '../../shared/dailyChallenges.ts';

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    // Trust the server's current UTC date, never a client-supplied value.
    const date = formatDate(new Date());

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
      account = await base44.asServiceRole.entities.PlayerAccount.update(account.id, {
        daily_wins: 0,
        daily_ai_wins: 0,
        daily_local_wins: 0,
        daily_games_played: 0,
        claimed_today: '[]',
        last_challenge_date: date,
      });
    }

    let claimed = [];
    try { claimed = JSON.parse(account.claimed_today || '[]'); } catch { claimed = []; }

    // Only one challenge is active per day
    const todaysChallenge = CHALLENGES[getDayIndex(date)];
    let newRewards = 0;
    const newlyClaimed = [];

    if (!claimed.includes(todaysChallenge.id) && todaysChallenge.check(account)) {
      claimed.push(todaysChallenge.id);
      newRewards += todaysChallenge.reward;
      newlyClaimed.push(todaysChallenge.id);
    }

    if (newRewards > 0) {
      account = await base44.asServiceRole.entities.PlayerAccount.update(account.id, {
        currency_balance: (account.currency_balance || 0) + newRewards,
        claimed_today: JSON.stringify(claimed),
      });
    }

    return Response.json({
      account,
      newlyClaimed,
      newRewards,
    });
  } catch (error) {
    console.error('claimDailyRewards error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}