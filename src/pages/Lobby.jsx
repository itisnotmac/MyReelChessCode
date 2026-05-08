import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Menu, Cpu, Users, BookOpen, ChevronRight } from 'lucide-react';
import MenuDrawer from '../components/lobby/MenuDrawer';
import PieceGroupDisplay from '../components/chess/PieceGroupDisplay';
import DifficultyModal from '../components/lobby/DifficultyModal';

export default function Lobby() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [difficultyOpen, setDifficultyOpen] = useState(false);

  const handleNavigate = (section) => {
    navigate(createPageUrl('Info') + `?section=${section}`);
  };

  const startGame = (mode) => {
    if (mode === 'ai') {
      setDifficultyOpen(true);
    } else {
      navigate(createPageUrl('Game') + `?mode=${mode}`);
    }
  };

  const handleDifficultyConfirm = () => {
    setDifficultyOpen(false);
    navigate(createPageUrl('Game') + `?mode=ai`);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden flex flex-col">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `repeating-conic-gradient(#D4AF37 0% 25%, transparent 0% 50%)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Top ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px]"
        style={{ background: 'radial-gradient(ellipse, rgba(212,175,55,0.06) 0%, transparent 70%)' }}
      />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-5 pt-6">
        <div>
          <h1 className="text-lg font-bold tracking-[0.15em]"
            style={{
              backgroundImage: 'linear-gradient(135deg, #D4AF37, #F5E6A3)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
            BATTLE CHESS
          </h1>
          <p className="text-[10px] tracking-[0.3em] text-white/20 uppercase mt-0.5">Choose Your Battle</p>
        </div>
        <button
          onClick={() => setMenuOpen(true)}
          className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#D4AF37] hover:bg-white/10 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Main content */}
      <div className="relative z-10 px-5 pt-8 flex-1 flex flex-col">
        {/* Decorative pieces */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative" style={{ filter: 'drop-shadow(0 0 24px rgba(212,175,55,0.18))' }}>
            <PieceGroupDisplay size="normal" animate={true} />
          </div>
          <motion.div
            className="mx-auto mt-3 h-[1px] w-48"
            style={{ background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)' }}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </motion.div>

        {/* Game mode cards */}
        <div className="space-y-3 max-w-sm mx-auto w-full">

          {/* VS AI */}
          <motion.button
            onClick={() => startGame('ai')}
            className="w-full text-left group"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="relative rounded-2xl p-5 border border-[#D4AF37]/15 overflow-hidden"
              style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(26,26,46,0.9) 100%)' }}>
              <div className="absolute top-0 right-0 w-32 h-32"
                style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.1) 0%, transparent 70%)' }} />
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: 'linear-gradient(135deg, #D4AF37, #8B6914)' }}>
                  <Cpu className="w-7 h-7 text-[#0a0a0f]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold tracking-wider text-sm">PLAYER vs AI</h3>
                  <p className="text-white/30 text-xs mt-1">Challenge the machine intelligence</p>
                </div>
                <ChevronRight className="w-5 h-5 text-[#D4AF37]/40 group-hover:text-[#D4AF37] transition-colors" />
              </div>
              <div className="flex gap-2 mt-4">
                {['Adaptive', 'Strategic', 'Smart'].map((level) => (
                  <span key={level} className="text-[10px] tracking-wider px-2.5 py-1 rounded-full bg-white/5 text-white/30 border border-white/5">
                    {level}
                  </span>
                ))}
              </div>
            </div>
          </motion.button>

          {/* VS Player */}
          <motion.button
            onClick={() => startGame('local')}
            className="w-full text-left group"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.42 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="relative rounded-2xl p-5 border border-[#9B59B6]/15 overflow-hidden"
              style={{ background: 'linear-gradient(135deg, rgba(155,89,182,0.08) 0%, rgba(26,26,46,0.9) 100%)' }}>
              <div className="absolute top-0 right-0 w-32 h-32"
                style={{ background: 'radial-gradient(circle, rgba(155,89,182,0.1) 0%, transparent 70%)' }} />
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: 'linear-gradient(135deg, #9B59B6, #6C3483)' }}>
                  <Users className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold tracking-wider text-sm">PLAYER vs PLAYER</h3>
                  <p className="text-white/30 text-xs mt-1">Local multiplayer on same device</p>
                </div>
                <ChevronRight className="w-5 h-5 text-[#9B59B6]/40 group-hover:text-[#9B59B6] transition-colors" />
              </div>
              <div className="flex gap-2 mt-4">
                {['Pass & Play', 'Board Flip', 'Fair'].map((feat) => (
                  <span key={feat} className="text-[10px] tracking-wider px-2.5 py-1 rounded-full bg-white/5 text-white/30 border border-white/5">
                    {feat}
                  </span>
                ))}
              </div>
            </div>
          </motion.button>

          {/* Tutorials — oval pill button */}
          <motion.div
            className="flex justify-center pt-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.56 }}
          >
            <motion.button
              onClick={() => navigate('/Tutorial')}
              whileTap={{ scale: 0.96 }}
              className="relative group flex items-center gap-2.5 px-10 py-3.5 rounded-full border border-[#3AAFA9]/40 overflow-hidden"
              style={{ background: 'linear-gradient(135deg, rgba(58,175,169,0.12) 0%, rgba(26,26,46,0.9) 100%)' }}
            >
              {/* Animated glow ring */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ background: 'radial-gradient(ellipse, rgba(58,175,169,0.15) 0%, transparent 70%)' }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
              <BookOpen className="w-4 h-4 text-[#3AAFA9] relative z-10" />
              <span className="relative z-10 text-sm font-bold tracking-[0.2em] uppercase text-[#3AAFA9]">
                Tutorials
              </span>
            </motion.button>
          </motion.div>
        </div>

        {/* Bottom decorative element */}
        <motion.div
          className="text-center mt-auto pt-8 pb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-center justify-center gap-3 text-white/10">
            <span className="text-lg">♜</span>
            <span className="text-lg">♞</span>
            <span className="text-lg">♝</span>
            <span className="text-xl text-[#D4AF37]/20">♛</span>
            <span className="text-lg">♝</span>
            <span className="text-lg">♞</span>
            <span className="text-lg">♜</span>
          </div>
          <p className="text-[10px] tracking-[0.4em] text-white/10 uppercase mt-3">
            Cinematic Battle Chess
          </p>
        </motion.div>
      </div>

      <MenuDrawer
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onNavigate={handleNavigate}
      />

      <DifficultyModal
        isOpen={difficultyOpen}
        onClose={() => setDifficultyOpen(false)}
        onConfirm={handleDifficultyConfirm}
      />
    </div>
  );
}