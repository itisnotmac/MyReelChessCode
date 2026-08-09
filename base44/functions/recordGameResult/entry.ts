import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';
import { CHALLENGES, formatDate, getDayIndex } from '../../shared/dailyChallenges.ts';

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { mode, result, moves_count, duration_seconds } = await req.json();
    if (!mode || !result) {
      return Response.json({ error: 'Missing mode or result' }, { status: 400 });
    }

    // Trust the server's UTC date — never a client-supplied value.
    const date = formatDate(new Date());

    // Persist a GameHistory record.
    const historyMode = mode === 'ai' ? 'ai' : 'local';
    await base44.entities.GameHistory.create({
      mode: historyMode,
      result,
      moves_count: Number(moves_count) || 0,
      duration_seconds: Number(duration_seconds) || 0,
    }).catch(e => console.error('GameHistory create failed:', e.message));

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
        daily_activities: '[]',
      });
    }

    // Reset daily progress if new day
    if (account.last_challenge_date !== date) {
      account.daily_wins = 0;
      account.daily_ai_wins = 0;
      account.daily_local_wins = 0;
      account.daily_games_played = 0;
      account.claimed_today = '[]';
      account.daily_activities = '[]';
      account.last_challenge_date = date;
    }

    // Build activity entries for the report card
    let activities = [];
    try { activities = JSON.parse(account.daily_activities || '[]'); } catch { activities = []; }

    const isWin = result === 'white_wins' || result === 'black_wins';
    const resultLabel = isWin ? 'Victory' : result === 'draw' ? 'Draw' : 'Defeat';
    const modeLabel = mode === 'ai' ? 'AI Match' : mode === 'local' ? 'Local Match' : '2v2 Match';
    activities.push({ type: 'match', label: `${modeLabel} — ${resultLabel}`, time: new Date().toISOString() });

    // Build progress updates + activities in one write
    const updates = {
      daily_games_played: (account.daily_games_played || 0) + 1,
      last_challenge_date: date,
      daily_activities: JSON.stringify(activities.slice(-50)),
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

    // Auto-claim: if today's challenge is now complete and unclaimed, award
    // Reels immediately and log the activity.
    let autoClaimed = 0;
    const todaysChallenge = CHALLENGES[getDayIndex(date)];
    let claimed = [];
    try { claimed = JSON.parse(account.claimed_today || '[]'); } catch { claimed = []; }

    if (!claimed.includes(todaysChallenge.id) && todaysChallenge.check(account)) {
      claimed.push(todaysChallenge.id);
      autoClaimed = todaysChallenge.reward;

      // Append challenge activity
      let challengeActivities = [];
      try { challengeActivities = JSON.parse(account.daily_activities || '[]'); } catch { challengeActivities = []; }
      challengeActivities.push({ type: 'challenge', label: `Daily Challenge Complete (+${autoClaimed} Reels)`, time: new Date().toISOString() });

      account = await base44.asServiceRole.entities.PlayerAccount.update(account.id, {
        currency_balance: (account.currency_balance || 0) + autoClaimed,
        claimed_today: JSON.stringify(claimed),
        daily_activities: JSON.stringify(challengeActivities.slice(-50)),
      });
    }

    return Response.json({ success: true, account, autoClaimed });
  } catch (error) {
    console.error('recordGameResult error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}