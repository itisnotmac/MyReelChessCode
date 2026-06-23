import { Trophy, Cpu, Users, Flame } from 'lucide-react';

export const DAILY_CHALLENGES = [
  {
    id: 'win_any',
    title: 'First Victory',
    description: 'Win any game today',
    Icon: Trophy,
    reward: 25,
    getProgress: (a) => Math.min(a?.daily_wins || 0, 1),
    target: 1,
  },
  {
    id: 'win_ai',
    title: 'AI Slayer',
    description: 'Defeat the AI in any difficulty',
    Icon: Cpu,
    reward: 25,
    getProgress: (a) => Math.min(a?.daily_ai_wins || 0, 1),
    target: 1,
  },
  {
    id: 'win_local',
    title: 'Local Champion',
    description: 'Win a local multiplayer game',
    Icon: Users,
    reward: 25,
    getProgress: (a) => Math.min(a?.daily_local_wins || 0, 1),
    target: 1,
  },
  {
    id: 'play_3',
    title: 'Dedicated',
    description: 'Play 3 complete games today',
    Icon: Flame,
    reward: 25,
    getProgress: (a) => Math.min(a?.daily_games_played || 0, 3),
    target: 3,
  },
];

export const ITEM_COST_COINS = 100;
export const CHALLENGE_REWARD = 25;

// Deterministically pick one challenge per day so all users see the same challenge.
// Frontend and backend must compute identically.
export function getDayIndex(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const start = new Date(d.getFullYear(), 0, 0);
  const diff = d - start;
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return dayOfYear % DAILY_CHALLENGES.length;
}

export function getTodaysChallenge(dateStr) {
  return DAILY_CHALLENGES[getDayIndex(dateStr)];
}

// One challenge per day = 25 coins; 4 days = 100 coins = 1 store item
export const TOTAL_DAILY_REWARD = CHALLENGE_REWARD;