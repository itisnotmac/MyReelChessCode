import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { X, Settings, HelpCircle, Mail, Info, LogOut, LogIn, Trophy, BarChart2, Wifi } from 'lucide-react';
import DifficultyModal from '../components/lobby/DifficultyModal';
import { startMenuMusic, stopMenuMusic } from '@/lib/menuMusic';
import { useAuth } from '@/lib/AuthContext';
import { base44 } from '@/api/base44Client';

const PAWN_IMAGE = 'https://raw.githubusercontent.com/itisnotmac/ChessAssets/main/BackgroundEraser_20260505_224913153.png';

const TEAL_BUTTON = "flex items-center justify-center px-6 py-2.5 rounded-full border border-[#3AAFA9]/60 bg-[#3AAFA9]/15 text-[#3AAFA9] font-bold text-xs tracking-[0.18em] uppercase backdrop-blur-sm hover:bg-[#3AAFA9]/25 active:scale-95 transition-all select-none";

function MenuModal({ isOpen, onClose, onNavigate, isAuthenticated, onLogout }) {
  const [items, setItems] = useState([
    { id: 'settings',   label: 'Settings',     icon: Settings },
    { id: 'faq',       label: 'FAQ',          icon: HelpCircle },
    { id: 'dashboard', label: 'Dashboard',    icon: BarChart2 },
    { id: 'history',   label: 'Game History', icon: Trophy },
    { id: 'contact',  label: 'Contact',      icon: Mail },
    { id: 'about',    label: 'About',        icon: Info },
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
    if (section === 'history') { navigate('/GameHistory'); return; }
    if (section === 'dashboard') { navigate('/Dashboard'); return; }
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
        className="relative z-10 text-center pt-8 pb-1"
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
            filter: 'drop-shadow(0 0 18px rgba(58,175,169,0.35))',
          }}
        >
          REEL CHESS
        </h1>
      </motion.div>

      {/* ── ONLINE PVP HERO BANNER ── */}
      <motion.div
        className="relative z-10 flex justify-center pt-4"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
      >
        <motion.button
          onClick={() => navigate('/OnlineGame')}
          whileTap={{ scale: 0.97 }}
          className="relative overflow-hidden rounded-2xl border border-[#3AAFA9]/40 px-6 py-4 text-left group"
          style={{ background: 'linear-gradient(135deg, rgba(58,175,169,0.18) 0%, rgba(58,175,169,0.06) 100%)', width: '72vw', maxWidth: 320 }}
        >
          <div className="relative z-10 flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Wifi className="w-3.5 h-3.5 text-[#3AAFA9]" />
                <span className="text-[9px] tracking-[0.3em] uppercase text-[#3AAFA9]/70 font-semibold">Live Match</span>
              </div>
              <p className="text-lg font-black text-white tracking-wider">Play Online PVP</p>
              <p className="text-[10px] text-white/35 mt-0.5">Challenge anyone, anywhere</p>
            </div>
          </div>
        </motion.button>
      </motion.div>

      {/* ── AUTH BUTTONS (if not logged in) ── */}
      {!isAuthenticated && (
        <motion.div
          className="relative z-10 flex gap-2 px-6 pt-3"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.22 }}
        >
          <motion.button
            onClick={() => navigate('/login')}
            className="flex-1 flex items-center justify-center px-4 py-2 rounded-full border border-white/20 bg-white/5 text-white font-bold text-xs tracking-[0.18em] uppercase hover:bg-white/10 active:scale-95 transition-all select-none"
            whileTap={{ scale: 0.94 }}
          >
            <LogIn className="w-3.5 h-3.5 mr-1.5" />
            Login
          </motion.button>
          <motion.button
            onClick={() => navigate('/register')}
            className="flex-1 flex items-center justify-center px-4 py-2 rounded-full border border-[#3AAFA9]/60 bg-[#3AAFA9]/15 text-[#3AAFA9] font-bold text-xs tracking-[0.18em] uppercase hover:bg-[#3AAFA9]/25 active:scale-95 transition-all select-none"
            whileTap={{ scale: 0.94 }}
          >
            Register
          </motion.button>
        </motion.div>
      )}

      {/* ── PAWN + SIDE BUTTONS ── */}
      <div className="relative z-10 flex-1 flex px-3 pb-4 gap-3 min-h-0">

        {/* LEFT COLUMN */}
        <motion.div
          className="flex flex-col gap-3"
          style={{ width: '22vw', maxWidth: 96 }}
          initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}
        >
          <motion.button
            onClick={() => setDifficultyOpen(true)}
            whileTap={{ scale: 0.95 }}
            className="flex-1 flex flex-col items-center justify-center rounded-2xl border border-[#3AAFA9]/50 bg-[#3AAFA9]/10 text-[#3AAFA9] active:bg-[#3AAFA9]/20 transition-all select-none"
          >
            <span className="text-[11px] font-black tracking-[0.12em] uppercase">vs AI</span>
          </motion.button>
          <motion.button
            onClick={() => navigate('/Tutorial')}
            whileTap={{ scale: 0.95 }}
            className="flex-1 flex flex-col items-center justify-center rounded-2xl border border-[#3AAFA9]/50 bg-[#3AAFA9]/10 text-[#3AAFA9] active:bg-[#3AAFA9]/20 transition-all select-none"
          >
            <span className="text-[11px] font-black tracking-[0.12em] uppercase">Tutorial</span>
          </motion.button>
        </motion.div>

        {/* PAWN (center) */}
        <motion.div
          className="flex-1 flex items-center justify-center min-w-0"
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.6 }}
        >
          <img
            src={PAWN_IMAGE}
            alt="3D Chess Pawn"
            className="w-full h-full object-contain"
            style={{ filter: 'drop-shadow(0 0 40px rgba(58,175,169,0.3)) drop-shadow(0 12px 32px rgba(0,0,0,0.7))' }}
          />
        </motion.div>

        {/* RIGHT COLUMN */}
        <motion.div
          className="flex flex-col gap-3"
          style={{ width: '22vw', maxWidth: 96 }}
          initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}
        >
          <motion.button
            onClick={() => { stopMenuMusic(); navigate(createPageUrl('Game') + `?mode=local`); }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 flex flex-col items-center justify-center rounded-2xl border border-[#3AAFA9]/50 bg-[#3AAFA9]/10 text-[#3AAFA9] active:bg-[#3AAFA9]/20 transition-all select-none"
          >
            <span className="text-[11px] font-black tracking-[0.12em] uppercase">Local PVP</span>
          </motion.button>
          <motion.button
            onClick={() => setMenuOpen(true)}
            whileTap={{ scale: 0.95 }}
            className="flex-1 flex flex-col items-center justify-center rounded-2xl border border-[#3AAFA9]/50 bg-[#3AAFA9]/10 text-[#3AAFA9] active:bg-[#3AAFA9]/20 transition-all select-none"
          >
            <span className="text-[11px] font-black tracking-[0.12em] uppercase">Menu</span>
          </motion.button>
        </motion.div>

      </div>

      {/* ── BOTTOM TAGLINE ── */}
      <motion.div
        className="relative z-10 text-center pb-5"
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