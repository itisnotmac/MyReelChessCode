import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

function getStreakReward(streak) {
  if (streak <= 0 || streak % 7 !== 0) return 0;
  if (streak % 28 === 0) return 100;
  return 25;
}

function formatDate(d) {
  // Use UTC so day boundaries are deterministic regardless of the runtime's
  // local timezone (Deno Deploy runs in UTC). The date must NEVER be taken
  // from the client — a trusted server date prevents users from forging
  // consecutive days to inflate their streak and farm coins.
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function getYesterday(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() - 1);
  return formatDate(d);
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    // Trust the server's current UTC date, never a client-supplied value.
    const date = formatDate(new Date());
    const yesterday = getYesterday(date);

    let accounts = await base44.asServiceRole.entities.PlayerAccount.filter({ user_id: user.id });
    let account = accounts[0];

    // Create account if this is the user's first interaction
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
        login_streak: 1,
        last_login_date: date,
      });
      return Response.json({
        streak: 1,
        previousStreak: 0,
        isNewDay: true,
        rewardAwarded: 0,
        account,
      });
    }

    const previousStreak = account.login_streak || 0;
    const lastLogin = account.last_login_date || null;

    let newStreak = previousStreak;
    let isNewDay = false;

    if (lastLogin === date) {
      // Already processed today — no change
      newStreak = previousStreak;
      isNewDay = false;
    } else if (lastLogin === yesterday) {
      // Consecutive day — increment streak
      newStreak = previousStreak + 1;
      isNewDay = true;
    } else {
      // Streak broken or first-ever login
      newStreak = 1;
      isNewDay = true;
    }

    const reward = isNewDay ? getStreakReward(newStreak) : 0;

    if (isNewDay) {
      const updateData = {
        login_streak: newStreak,
        last_login_date: date,
      };
      if (reward > 0) {
        updateData.currency_balance = (account.currency_balance || 0) + reward;
      }
      account = await base44.asServiceRole.entities.PlayerAccount.update(account.id, updateData);
    }

    return Response.json({
      streak: newStreak,
      previousStreak,
      isNewDay,
      rewardAwarded: reward,
      account,
    });
  } catch (error) {
    console.error('processLoginStreak error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});