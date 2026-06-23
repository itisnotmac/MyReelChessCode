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
export const TOTAL_DAILY_REWARD = DAILY_CHALLENGES.length * CHALLENGE_REWARD;