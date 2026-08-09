// Shared daily challenge logic — imported by recordGameResult and claimDailyRewards.
// Frontend equivalent lives in src/lib/dailyChallenges.js; both must compute identically.

export const CHALLENGES = [
  { id: 'win_any', check: (a) => (a.daily_wins || 0) >= 1, reward: 25 },
  { id: 'win_ai', check: (a) => (a.daily_ai_wins || 0) >= 1, reward: 25 },
  { id: 'win_local', check: (a) => (a.daily_local_wins || 0) >= 1, reward: 25 },
  { id: 'play_3', check: (a) => (a.daily_games_played || 0) >= 3, reward: 25 },
];

// Use UTC so day boundaries are deterministic regardless of the runtime's local
// timezone (Deno Deploy runs in UTC). The date must NEVER be taken from the
// client — a forged or timezone-shifted date would desync daily progress from
// the claim function, causing resets and lost rewards.
export function formatDate(d) {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// Must match lib/dailyChallenges.js getDayIndex exactly
export function getDayIndex(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const start = new Date(d.getFullYear(), 0, 0);
  const diff = d - start;
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return dayOfYear % CHALLENGES.length;
}

export function getTodaysChallenge(dateStr) {
  return CHALLENGES[getDayIndex(dateStr)];
}