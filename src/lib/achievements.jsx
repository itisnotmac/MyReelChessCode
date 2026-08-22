import React from 'react';
import { motion } from 'framer-motion';
import {
  Trophy, Target, Swords, Bot, Clock, Zap, Crown, Star,
  Award, Flame, Shield, TrendingUp, Handshake, Gamepad2, BookOpen, Gauge
} from 'lucide-react';
import { LESSONS } from './tutorialLessons';

// Each achievement: id, title, description, icon, color, check(stats) -> boolean
export const ACHIEVEMENTS = [
  {
    id: 'first_game',
    title: 'First Move',
    description: 'Play your first game',
    icon: Gamepad2,
    color: '#3AAFA9',
    check: s => s.totalGames >= 1,
  },
  {
    id: 'first_win',
    title: 'Checkmate',
    description: 'Win your first game',
    icon: Trophy,
    color: '#D4AF37',
    check: s => s.wins >= 1,
  },
  {
    id: 'five_wins',
    title: 'Rising Star',
    description: 'Win 5 games',
    icon: Star,
    color: '#D4AF37',
    check: s => s.wins >= 5,
  },
  {
    id: 'ten_wins',
    title: 'Strategist',
    description: 'Win 10 games',
    icon: Target,
    color: '#E67E22',
    check: s => s.wins >= 10,
  },
  {
    id: 'twentyfive_wins',
    title: 'Grandmaster',
    description: 'Win 25 games',
    icon: Crown,
    color: '#9B59B6',
    check: s => s.wins >= 25,
  },
  {
    id: 'ai_slayer',
    title: 'AI Slayer',
    description: 'Win 5 games against the AI',
    icon: Bot,
    color: '#3AAFA9',
    check: s => s.aiWins >= 5,
  },
  {
    id: 'ten_games',
    title: 'Pawn Star',
    description: 'Play 10 games',
    icon: Award,
    color: '#3AAFA9',
    check: s => s.totalGames >= 10,
  },
  {
    id: 'twentyfive_games',
    title: 'Board Master',
    description: 'Play 25 games',
    icon: Swords,
    color: '#E67E22',
    check: s => s.totalGames >= 25,
  },
  {
    id: 'fifty_games',
    title: 'Legend',
    description: 'Play 50 games',
    icon: Flame,
    color: '#9B59B6',
    check: s => s.totalGames >= 50,
  },
  {
    id: 'quick_win',
    title: 'Blitzkrieg',
    description: 'Win a game in under 60 seconds',
    icon: Zap,
    color: '#E67E22',
    check: s => s.fastestWinSec !== null && s.fastestWinSec <= 60,
  },
  {
    id: 'marathon',
    title: 'Endurance',
    description: 'Complete a game with 40+ moves',
    icon: Clock,
    color: '#9B59B6',
    check: s => s.longestGameMoves >= 40,
  },
  {
    id: 'high_winrate',
    title: 'Perfectionist',
    description: 'Achieve a 75%+ win rate (min 5 games)',
    icon: TrendingUp,
    color: '#D4AF37',
    check: s => s.completedGames >= 5 && s.winRate >= 75,
  },
  {
    id: 'five_draws',
    title: 'Diplomat',
    description: 'Draw 5 games',
    icon: Handshake,
    color: '#3AAFA9',
    check: s => s.draws >= 5,
  },
  {
    id: 'pvp_warrior',
    title: 'Gladiator',
    description: 'Win 5 local PvP games',
    icon: Shield,
    color: '#E67E22',
    check: s => s.pvpWins >= 5,
  },
  {
    id: 'bookworm',
    title: 'Bookworm',
    description: 'Complete every lesson in Reel Chess University',
    icon: BookOpen,
    color: '#3AAFA9',
    hidden: true,
    check: s => s.tutorialCompleted >= s.tutorialTotal,
  },
  // === Achievements for content added since the trophy system ===
  {
    id: 'blitz_veteran',
    title: 'Blitz Veteran',
    description: 'Win 5 BlitzSchach games',
    icon: Zap,
    color: '#ef4444',
    check: s => s.blitzWins >= 5,
  },
  {
    id: 'blitz_master',
    title: 'Blitz Master',
    description: 'Win 15 BlitzSchach games',
    icon: Zap,
    color: '#ef4444',
    hidden: true,
    check: s => s.blitzWins >= 15,
  },
  {
    id: 'elo_riser',
    title: 'Rising Tactician',
    description: 'Reach 1300 ELO rating',
    icon: TrendingUp,
    color: '#3AAFA9',
    check: s => s.peakElo >= 1300,
  },
  {
    id: 'elo_elite',
    title: 'Tactical Elite',
    description: 'Reach 1500 ELO rating',
    icon: Crown,
    color: '#9B59B6',
    hidden: true,
    check: s => s.peakElo >= 1500,
  },
  {
    id: 'weekly_warrior',
    title: 'Weekly Warrior',
    description: 'Maintain a 7-day login streak',
    icon: Flame,
    color: '#E67E22',
    check: s => s.loginStreak >= 7,
  },
  {
    id: 'iron_will',
    title: 'Iron Will',
    description: 'Maintain a 30-day login streak',
    icon: Flame,
    color: '#9B59B6',
    hidden: true,
    check: s => s.loginStreak >= 30,
  },
  {
    id: 'speed_demon',
    title: 'Speed Demon',
    description: 'Win a game in under 30 seconds',
    icon: Gauge,
    color: '#E67E22',
    check: s => s.fastestWinSec !== null && s.fastestWinSec <= 30,
  },
  {
    id: 'centurion',
    title: 'Centurion',
    description: 'Play 100 games',
    icon: Swords,
    color: '#9B59B6',
    hidden: true,
    check: s => s.totalGames >= 100,
  },
  {
    id: 'underdog',
    title: 'Underdog',
    description: 'Win 5 local games playing as Black',
    icon: Shield,
    color: '#3AAFA9',
    hidden: true,
    check: s => s.blackWinsLocal >= 5,
  },
];

// Read tutorial completion from localStorage
function getTutorialCompletedCount() {
  try {
    const completed = JSON.parse(localStorage.getItem('tutorialCompleted') || '[]');
    return Array.isArray(completed) ? completed.length : 0;
  } catch {
    return 0;
  }
}

// Compute stats from GameHistory records
export function computeStats(history, account = null) {
  const completed = history.filter(r => r.result !== 'in_progress');
  const wins = history.filter(r => r.result === 'white_wins');
  const draws = history.filter(r => r.result === 'draw').length;

  const aiWins = history.filter(r => r.mode === 'ai' && r.result === 'white_wins').length;
  const pvpWins = history.filter(r => r.mode === 'local' && r.result === 'white_wins').length;

  // Blitz wins — player is white in AI mode, plays both sides in local mode
  const blitzWins = history.filter(r =>
    r.variant === 'blitz' &&
    ((r.mode === 'ai' && r.result === 'white_wins') ||
     (r.mode === 'local' && (r.result === 'white_wins' || r.result === 'black_wins')))
  ).length;

  // Local wins as Black (pass-and-play — the player controlling black won)
  const blackWinsLocal = history.filter(r => r.mode === 'local' && r.result === 'black_wins').length;

  const winDurations = wins
    .map(r => r.duration_seconds)
    .filter(d => d > 0);
  const fastestWinSec = winDurations.length > 0 ? Math.min(...winDurations) : null;

  const longestGameMoves = Math.max(0, ...completed.map(r => r.moves_count || 0));

  const winRate = completed.length > 0
    ? Math.round((wins.length / completed.length) * 100)
    : 0;

  return {
    totalGames: history.length,
    completedGames: completed.length,
    wins: wins.length,
    draws,
    aiWins,
    pvpWins,
    blitzWins,
    blackWinsLocal,
    fastestWinSec,
    longestGameMoves,
    winRate,
    tutorialCompleted: getTutorialCompletedCount(),
    tutorialTotal: LESSONS.length,
    elo: account?.elo ?? 1200,
    peakElo: account?.peak_elo ?? 1200,
    loginStreak: account?.login_streak ?? 0,
  };
}

export function evaluateAchievements(stats) {
  const earned = {};
  for (const ach of ACHIEVEMENTS) {
    earned[ach.id] = ach.check(stats);
  }
  return earned;
}

export function AchievementBadge({ achievement, earned, delay = 0 }) {
  const Icon = achievement.icon;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className={`relative rounded-2xl border p-4 flex flex-col items-center text-center gap-2 transition-all ${
        earned
          ? 'bg-white/5 border-white/10'
          : 'bg-white/[0.02] border-white/5 opacity-40'
      }`}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center"
        style={{
          background: earned ? achievement.color + '18' : 'rgba(255,255,255,0.03)',
          border: `1px solid ${earned ? achievement.color + '40' : 'rgba(255,255,255,0.05)'}`,
        }}
      >
        <Icon
          className="w-5 h-5"
          style={{ color: earned ? achievement.color : 'rgba(255,255,255,0.2)' }}
        />
      </div>
      <p className={`text-xs font-bold tracking-wide ${earned ? 'text-white' : 'text-white/30'}`}>
        {achievement.title}
      </p>
      <p className="text-[10px] text-white/30 leading-tight">{achievement.description}</p>
      {earned && (
        <div
          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center"
          style={{ background: achievement.color }}
        >
          <svg className="w-3 h-3 text-[#0a0a0f]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
    </motion.div>
  );
}