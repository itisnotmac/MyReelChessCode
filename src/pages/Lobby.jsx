import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { X, Settings, HelpCircle, Mail, Info, LogOut, LogIn } from 'lucide-react';
import DifficultyModal from '../components/lobby/DifficultyModal';
import { startMenuMusic, stopMenuMusic } from '@/lib/menuMusic';
import { useAuth } from '@/lib/AuthContext';
import { base44 } from '@/api/base44Client';

const PAWN_IMAGE = 'https://raw.githubusercontent.com/itisnotmac/ChessAssets/main/BackgroundEraser_20260505_224913153.png';

const TEAL_BUTTON = "flex items-center justify-center px-6 py-2.5 rounded-full border border-[#3AAFA9]/60 bg-[#3AAFA9]/15 text-[#3AAFA9] font-bold text-xs tracking-[0.18em] uppercase backdrop-blur-sm hover:bg-[#3AAFA9]/25 active:scale-95 transition-all select-none";

function MenuModal({ isOpen, onClose, onNavigate, isAuthenticated, onLogout }) {
  const [items, setItems] = useState([
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'faq',      label: 'FAQ',      icon: HelpCircle },
    { id: 'contact',  label: 'Contact',  icon: Mail },
    { id: 'about',    label: 'About',    icon: Info },
  ]);

  useEffect(() => {
    if (isAuthenticated) {
      setItems(prev => [...prev, { id: 'logout', label: 'Sign Out', icon: LogOut, isDanger: true }]);
    }
  }, [isAuthenticated]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed right-0 top-0 bottom-0 w-72 bg-gradient-to-b from-[#1a1a2e] to-[#0f0f1a] z-50 shadow-2xl border-l border-[#3AAFA9]/15"
            initial={{ x: 300 }} animate={{ x: 0 }} exit={{ x: 300 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-lg font-bold tracking-wider text-[#3AAFA9]">MENU</h2>
                <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2">
                {items.map((item, i) => (
                  <motion.button
                    key={item.id}
                    onClick={() => { 
                      if (item.id === 'logout') {
                        onLogout();
                      } else {
                        onNavigate(item.id);
                      }
                      onClose(); 
                    }}
                    className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all group ${
                      item.isDanger 
                        ? 'text-red-400/70 hover:text-red-400 hover:bg-red-400/10' 
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center group-hover:transition-colors ${
                      item.isDanger
                        ? 'bg-red-400/10 group-hover:bg-red-400/20'
                        : 'bg-[#3AAFA9]/10 group-hover:bg-[#3AAFA9]/20'
                    }`}>
                      <item.icon className={`w-4 h-4 ${item.isDanger ? 'text-red-400' : 'text-[#3AAFA9]'}`} />
                    </div>
                    <span className="text-sm tracking-wider font-medium">{item.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>
            <div className="absolute bottom-8 left-0 right-0 text-center">
              <p className="text-[10px] tracking-[0.3em] uppercase text-white/15">Reel Chess v1.0</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function Lobby() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [difficultyOpen, setDifficultyOpen] = useState(false);

  useEffect(() => {
    startMenuMusic();
    return () => stopMenuMusic();
  }, []);

  const handleLogout = async () => {
    await base44.auth.logout();
    stopMenuMusic();
  };

  const handleNavigate = (section) => {
    if (section === 'about') { navigate('/About'); return; }
    if (section === 'contact') { navigate('/Contact'); return; }
    navigate(createPageUrl('Info') + `?section=${section}`);
  };

  const handleDifficultyConfirm = () => {
    stopMenuMusic();
    setDifficultyOpen(false);
    navigate(createPageUrl('Game') + `?mode=ai`);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden flex flex-col">
      {/* Subtle background chess pattern */}
      <div className="absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage: `repeating-conic-gradient(#3AAFA9 0% 25%, transparent 0% 50%)`,
          backgroundSize: '44px 44px'
        }}
      />

      {/* Ambient glow behind pawn */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-72 h-72 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(58,175,169,0.08) 0%, transparent 70%)' }} />
      </div>

      {/* ── TOP TITLE ── */}
      <motion.div
        className="relative z-10 text-center pt-10 pb-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h1
          className="text-4xl font-black tracking-[0.22em] uppercase"
          style={{
            backgroundImage: 'linear-gradient(135deg, #3AAFA9 0%, #A8E6E3 50%, #3AAFA9 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: 'none',
            filter: 'drop-shadow(0 0 18px rgba(58,175,169,0.35))',
          }}
        >
          REEL CHESS
        </h1>
      </motion.div>

      {/* ── UPPER BUTTONS ROW ── */}
      <motion.div
        className="relative z-10 flex items-center justify-between px-6 pt-6 gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
      >
        {/* Auth buttons — top left */}
        {!isAuthenticated && (
          <div className="flex gap-2">
            <motion.button
              onClick={() => navigate('/login')}
              className="flex items-center justify-center px-4 py-2.5 rounded-full border border-white/20 bg-white/5 text-white font-bold text-xs tracking-[0.18em] uppercase backdrop-blur-sm hover:bg-white/10 active:scale-95 transition-all select-none"
              whileTap={{ scale: 0.94 }}
            >
              <LogIn className="w-3.5 h-3.5 mr-1.5" />
              Login
            </motion.button>
            <motion.button
              onClick={() => navigate('/register')}
              className="flex items-center justify-center px-4 py-2.5 rounded-full border border-[#3AAFA9]/60 bg-[#3AAFA9]/15 text-[#3AAFA9] font-bold text-xs tracking-[0.18em] uppercase backdrop-blur-sm hover:bg-[#3AAFA9]/25 active:scale-95 transition-all select-none"
              whileTap={{ scale: 0.94 }}
            >
              Register
            </motion.button>
          </div>
        )}

        {/* Player vs AI — upper left/center */}
        <motion.button
          onClick={() => setDifficultyOpen(true)}
          className={TEAL_BUTTON}
          whileTap={{ scale: 0.94 }}
        >
          Player vs AI
        </motion.button>

        {/* PVP — upper right */}
        <motion.button
          onClick={() => { stopMenuMusic(); navigate(createPageUrl('Game') + `?mode=local`); }}
          className={TEAL_BUTTON}
          whileTap={{ scale: 0.94 }}
        >
          PVP (Local)
        </motion.button>
      </motion.div>

      {/* ── PAWN IMAGE (center) ── */}
      <motion.div
        className="relative z-10 flex-1 flex items-center justify-center py-4"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15, duration: 0.6 }}
      >
        <img
          src={PAWN_IMAGE}
          alt="3D Chess Pawn"
          className="w-auto max-h-[42vh] object-contain"
          style={{ filter: 'drop-shadow(0 0 32px rgba(58,175,169,0.25)) drop-shadow(0 8px 24px rgba(0,0,0,0.6))' }}
        />
      </motion.div>

      {/* ── LOWER BUTTONS ROW ── */}
      <motion.div
        className="relative z-10 flex items-center justify-between px-6 pb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
      >
        {/* Tutorials — bottom left */}
        <motion.button
          onClick={() => navigate('/Tutorial')}
          className={TEAL_BUTTON}
          whileTap={{ scale: 0.94 }}
        >
          Tutorials
        </motion.button>

        {/* Menu — bottom right */}
        <motion.button
          onClick={() => setMenuOpen(true)}
          className={TEAL_BUTTON}
          whileTap={{ scale: 0.94 }}
        >
          Menu
        </motion.button>
      </motion.div>

      {/* ── BOTTOM TAGLINE ── */}
      <motion.div
        className="relative z-10 text-center pb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
      >
        <p className="text-xs tracking-[0.45em] uppercase text-[#3AAFA9]/40 font-medium">
          Get Immersed
        </p>
      </motion.div>

      {/* Modals */}
      <MenuModal isOpen={menuOpen} onClose={() => setMenuOpen(false)} onNavigate={handleNavigate} isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <DifficultyModal
        isOpen={difficultyOpen}
        onClose={() => setDifficultyOpen(false)}
        onConfirm={handleDifficultyConfirm}
      />
    </div>
  );
}