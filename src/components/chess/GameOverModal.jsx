import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Handshake, RotateCcw, Home, Brain, Sparkles } from 'lucide-react';

export default function GameOverModal({ result, onRematch, onHome, onAnalysis, mode, eloDelta }) {
  const isCheckmate = result === 'white_wins' || result === 'black_wins';
  const winner = result === 'white_wins'
    ? (mode === '2v2' ? 'Team A' : 'White')
    : (mode === '2v2' ? 'Team B' : 'Black');

  const title = isCheckmate ? 'Checkmate' : 'Draw';
  const resultLabel = isCheckmate ? `${winner} wins` : 'The match ends level';
  const ResultIcon = isCheckmate ? Trophy : Handshake;

  const buttonMotion = {
    whileHover: { scale: 1.01 },
    whileTap: { scale: 0.98 },
  };

  return (
    <motion.div
      className="fixed inset-0 z-[90] flex items-end justify-center p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="game-over-title"
      aria-describedby="game-over-result"
    >
      <div className="absolute inset-0 bg-[#050609]/80 backdrop-blur-md" />

      <motion.div
        className="relative w-full max-w-sm overflow-hidden rounded-[1.75rem] border border-[#3AAFA9]/30 bg-[#090d12]/95 shadow-[0_24px_80px_rgba(0,0,0,0.7),0_0_45px_rgba(58,175,169,0.10)]"
        initial={{ scale: 0.92, y: 48 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 240, damping: 24 }}
      >
        {/* Subtle chess texture and cinematic teal light used throughout the refreshed app. */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: 'repeating-conic-gradient(#3AAFA9 0% 25%, transparent 0% 50%)',
            backgroundSize: '40px 40px',
          }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-48"
          style={{ background: 'radial-gradient(70% 90% at 50% 0%, rgba(58,175,169,0.24), transparent 72%)' }}
        />
        <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#A8E6E3]/80 to-transparent" />

        <div className="relative px-6 pb-6 pt-7 sm:px-7 sm:pb-7">
          <motion.div
            className="mb-5 flex items-center justify-center"
            initial={{ scale: 0, rotate: -12 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.16, type: 'spring', stiffness: 220 }}
          >
            <div className="relative flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full border border-[#3AAFA9]/40 bg-[#3AAFA9]/10 shadow-[0_0_32px_rgba(58,175,169,0.22)]">
              <div className="absolute inset-2 rounded-full border border-white/10" />
              <ResultIcon className="h-8 w-8 text-[#A8E6E3]" strokeWidth={1.7} />
              <Sparkles className="absolute -right-1 top-0 h-4 w-4 text-[#D4AF37]" />
            </div>
          </motion.div>

          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.32em] text-[#3AAFA9]">
              Match complete
            </p>
            <h2
              id="game-over-title"
              className="[font-family:'Old_Standard_TT',_serif] text-4xl font-bold uppercase tracking-[0.08em]"
              style={{
                backgroundImage: 'linear-gradient(135deg, #3AAFA9 0%, #E8FFFF 50%, #3AAFA9 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 16px rgba(58,175,169,0.22))',
              }}
            >
              {title}
            </h2>
            <p id="game-over-result" className="mt-1 text-sm font-medium tracking-[0.16em] text-white/70">
              {resultLabel}
            </p>
          </motion.div>

          {typeof eloDelta === 'number' && (
            <motion.div
              className="mx-auto mt-5 flex w-fit items-center gap-3 rounded-full border border-white/10 bg-black/30 px-4 py-2 backdrop-blur-md"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35, type: 'spring', stiffness: 200 }}
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/45">Rating</span>
              <span
                className="text-lg font-black tabular-nums"
                style={{ color: eloDelta > 0 ? '#4ADE80' : eloDelta < 0 ? '#F87171' : '#A8E6E3' }}
              >
                {eloDelta > 0 ? `+${eloDelta}` : eloDelta}
              </span>
            </motion.div>
          )}

          <motion.div
            className="mt-7 space-y-3"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {onRematch && (
              <motion.button
                type="button"
                onClick={onRematch}
                {...buttonMotion}
                className="flex min-h-12 w-full items-center justify-center gap-2.5 rounded-2xl bg-[#3AAFA9] px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-[#071312] shadow-[0_8px_26px_rgba(58,175,169,0.22)] transition-colors hover:bg-[#57c5bf]"
              >
                <RotateCcw className="h-[18px] w-[18px]" />
                Rematch
              </motion.button>
            )}

            {onAnalysis && (
              <motion.button
                type="button"
                onClick={onAnalysis}
                {...buttonMotion}
                className="flex min-h-12 w-full items-center justify-center gap-2.5 rounded-2xl border border-[#3AAFA9]/45 bg-[#3AAFA9]/10 px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-[#A8E6E3] transition-colors hover:bg-[#3AAFA9]/18"
              >
                <Brain className="h-[18px] w-[18px]" />
                Analyze match
              </motion.button>
            )}

            <motion.button
              type="button"
              onClick={onHome}
              {...buttonMotion}
              className="flex min-h-12 w-full items-center justify-center gap-2.5 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white/70 transition-colors hover:bg-white/[0.08] hover:text-white"
            >
              <Home className="h-[18px] w-[18px]" />
              Return to lobby
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
