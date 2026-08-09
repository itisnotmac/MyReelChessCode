import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';
import { formatDate } from '../../shared/dailyChallenges.ts';

// Logs a user activity to their daily report card. Called from the frontend
// when the user changes their avatar, settings, or other tracked actions.
// Game results and challenge completions are logged directly by recordGameResult.
export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { type, label } = await req.json();
    if (!type || !label) {
      return Response.json({ error: 'Missing type or label' }, { status: 400 });
    }

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
        daily_activities: '[]',
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
        daily_activities: '[]',
        last_challenge_date: date,
      });
    }

    // Append the new activity
    let activities = [];
    try { activities = JSON.parse(account.daily_activities || '[]'); } catch { activities = []; }
    activities.push({ type, label, time: new Date().toISOString() });
    // Cap at 50 entries to prevent unbounded growth
    if (activities.length > 50) activities = activities.slice(-50);

    account = await base44.asServiceRole.entities.PlayerAccount.update(account.id, {
      daily_activities: JSON.stringify(activities),
    });

    return Response.json({ success: true, account });
  } catch (error) {
    console.error('logActivity error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}