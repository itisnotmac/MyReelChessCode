import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const CHALLENGES = [
  { id: 'win_any', check: (a) => (a.daily_wins || 0) >= 1, reward: 25 },
  { id: 'win_ai', check: (a) => (a.daily_ai_wins || 0) >= 1, reward: 25 },
  { id: 'win_local', check: (a) => (a.daily_local_wins || 0) >= 1, reward: 25 },
  { id: 'play_3', check: (a) => (a.daily_games_played || 0) >= 3, reward: 25 },
];

// Use UTC so day boundaries are deterministic regardless of the runtime's local
// timezone. The date must NEVER be taken from the client — a forged date would
// let users reset daily progress and re-claim rewards to farm coins.
function formatDate(d) {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// Must match lib/dailyChallenges.js getDayIndex exactly
function getDayIndex(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const start = new Date(d.getFullYear(), 0, 0);
  const diff = d - start;
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return dayOfYear % CHALLENGES.length;
}

Deno.serve(async (req) => {
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
});