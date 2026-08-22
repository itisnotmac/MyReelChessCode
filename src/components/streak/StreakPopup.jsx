import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Coins, Sparkles } from 'lucide-react';
import StreakBadge from './StreakBadge';
import { getStreakTier, getTierName, getNextMilestone } from '@/lib/streakTiers';
import { Button } from '@/components/ui/button';

export default function StreakPopup({ isOpen, onClose, streak, previousStreak, rewardAwarded }) {
  const tier = getStreakTier(streak);
  const prevTier = getStreakTier(previousStreak);
  const visualChanged = JSON.stringify(tier) !== JSON.stringify(prevTier);
  const nextMilestone = getNextMilestone(streak);
  const tierName = getTierName(tier);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/75 backdrop-blur-md" onClick={onClose} />
          <motion.div
            initial={{ scale: 0.85, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.85, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative z-10 w-full max-w-sm rounded-3xl border border-[#3AAFA9]/30 bg-gradient-to-b from-[#1a1a2e] to-[#0f0f1a] p-8 text-center overflow-hidden"
          >
            {/* Decorative glow */}
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(circle at 50% 30%, rgba(58,175,169,0.08) 0%, transparent 60%)' }}
            />

            <button onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors z-10"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="relative z-10">
              <div className="flex items-center justify-center gap-1.5 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#3AAFA9]/60" />
                <p className="text-[10px] tracking-[0.3em] uppercase text-[#3AAFA9]/60 font-semibold">Daily Streak</p>
              </div>

              <h2 className="text-2xl font-black text-white mb-6">
                {visualChanged ? 'Badge Evolved!' : 'Streak Continued!'}
              </h2>

              <motion.div
                className="flex justify-center mb-4"
                initial={{ scale: 0, rotate: -15 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 18 }}
              >
                <StreakBadge streak={streak} size="lg" />
              </motion.div>

              <p className="text-4xl font-black text-[#3AAFA9] mb-1" style={{ filter: 'drop-shadow(0 0 12px rgba(58,175,169,0.3))' }}>
                Day {streak}
              </p>
              <p className="text-sm text-white/40 mb-6">{tierName} Tier</p>

              {rewardAwarded > 0 && (
                <motion.div
                  initial={{ scale: 0, y: 10 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ delay: 0.35, type: 'spring', stiffness: 300 }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 mb-6"
                >
                  <Coins className="w-5 h-5 text-[#D4AF37]" />
                  <span className="text-2xl font-black text-[#D4AF37]">+{rewardAwarded}</span>
                  <span className="text-sm text-[#D4AF37]/70 font-medium">coins</span>
                </motion.div>
              )}

              <p className="text-xs text-white/30 mb-6">
                Next reward: Day {nextMilestone.day} • +{nextMilestone.reward} coins
              </p>

              <Button
                onClick={onClose}
                variant="chess-primary"
                className="w-full py-3.5 rounded-xl font-bold text-sm tracking-wider uppercase active:scale-95"
              >
                Continue
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}