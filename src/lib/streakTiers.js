// Streak tier and reward logic for Reel Chess daily login streak

export const STREAK_REWARD_WEEKLY = 25;
export const STREAK_REWARD_MILESTONE = 100;

/**
 * Coin reward for a given streak day.
 * Every 7 days = 25 coins; every 28 days = 100 coins (replaces the 25).
 * Pattern repeats every 28 days.
 */
export function getStreakReward(streak) {
  if (streak <= 0 || streak % 7 !== 0) return 0;
  if (streak % 28 === 0) return STREAK_REWARD_MILESTONE;
  return STREAK_REWARD_WEEKLY;
}

/**
 * Visual tier info for a streak number.
 *
 * Progression (every 7 days the visual evolves):
 * - Days 1-6: No shield, just the number
 * - Weeks 1-3  (days 7-27):  Copper shield, 0→2 ribbons
 * - Weeks 4-6  (days 28-48): Silver shield, 0→2 ribbons
 * - Weeks 7-9  (days 49-69): Gold shield, 0→2 ribbons
 * - Weeks 10-12 (days 70-90): Diamond shield, 0→2 ribbons
 * - Weeks 13-15: Diamond + 1 star
 * - Weeks 16-18: Diamond + 2 stars
 * - Weeks 19-21: Diamond + 3 stars
 * - Weeks 22+:   Diamond + 4 stars (4-star general!)
 */
export function getStreakTier(streak) {
  if (streak < 7) {
    return { hasShield: false, metal: 'none', ribbons: 0, stars: 0, week: 0 };
  }

  const week = Math.floor(streak / 7);
  const ribbons = (week - 1) % 3;

  let metal, stars;

  if (week <= 3) {
    metal = 'copper';
    stars = 0;
  } else if (week <= 6) {
    metal = 'silver';
    stars = 0;
  } else if (week <= 9) {
    metal = 'gold';
    stars = 0;
  } else {
    metal = 'diamond';
    stars = Math.min(Math.floor((week - 10) / 3), 4);
  }

  return { hasShield: true, metal, ribbons, stars, week };
}

export function getTierName(tier) {
  if (!tier.hasShield) return 'Recruit';
  const metalName = tier.metal.charAt(0).toUpperCase() + tier.metal.slice(1);
  if (tier.stars > 0) {
    return `${metalName} ${'★'.repeat(tier.stars)}`;
  }
  return metalName;
}

export function getNextMilestone(streak) {
  const nextWeek = Math.ceil((streak + 1) / 7) * 7;
  return { day: nextWeek, reward: getStreakReward(nextWeek) };
}