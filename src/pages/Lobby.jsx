import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { X, Settings, HelpCircle, Mail, Info, LogOut, LogIn, Trophy, BarChart2, Wifi, Crown, UserCircle, Award, ShoppingBag, Gift, MessageCircle, Bot, Users, UsersRound, BookOpen, Menu as MenuIcon, Volume2 } from 'lucide-react';
import DifficultyModal from '../components/lobby/DifficultyModal';
import PremiumModal from '../components/lobby/PremiumModal';
import TwoVTwoModal from '../components/lobby/TwoVTwoModal';
import { startMenuMusic, stopMenuMusic, getMenuMusicVolume, setMenuMusicVolume } from '@/lib/menuMusic';
import { useAuth } from '@/lib/AuthContext';
import { base44 } from '@/api/base44Client';
import StreakPopup from '../components/streak/StreakPopup';
import Cinematic3DHero from '@/components/lobby/Cinematic3DHero';

function MenuModal({ isOpen, onClose, onNavigate, isAuthenticated, onLogout }) {
  const [items, setItems] = useState([
  { id: 'profile', label: 'Profile', icon: UserCircle },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'chat', label: 'Community Chat', icon: MessageCircle },
  { id: 'dashboard', label: 'Stats', icon: BarChart2 },
  { id: 'achievements', label: 'Achievements', icon: Award },
  { id: 'history', label: 'Game History', icon: Trophy },
  { id: 'tournament', label: 'Tournaments', icon: Trophy },
  { id: 'faq', label: 'FAQ', icon: HelpCircle },
  { id: 'contact', label: 'Contact', icon: Mail },
  { id: 'about', label: 'About', icon: Info }]
  );

  useEffect(() => {
    if (isAuthenticated) {
      setItems((prev) => [...prev, { id: 'logout', label: 'Sign Out', icon: LogOut, isDanger: true }]);
    }
  }, [isAuthenticated]);

  return (
    <AnimatePresence>
      {isOpen &&
      <>
          <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose} />
        
          <motion.div
          className="fixed right-0 top-0 bottom-0 w-72 flex flex-col bg-gradient-to-b from-[#1a1a2e] to-[#0f0f1a] z-50 shadow-2xl border-l border-[#3AAFA9]/15"
          initial={{ x: 300 }} animate={{ x: 0 }} exit={{ x: 300 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
          
            <div className="p-6 pb-4 flex-shrink-0">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold tracking-wider text-[#3AAFA9]">MENU</h2>
                <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="px-6 space-y-2 overflow-y-auto flex-1 pb-6 overscroll-contain">
              {items.map((item, i) =>
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
              item.isDanger ?
              'text-red-400/70 hover:text-red-400 hover:bg-red-400/10' :
              'text-white/70 hover:text-white hover:bg-white/5'}`
              }
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}>
              
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center group-hover:transition-colors ${
              item.isDanger ?
              'bg-red-400/10 group-hover:bg-red-400/20' :
              'bg-[#3AAFA9]/10 group-hover:bg-[#3AAFA9]/20'}`
              }>
                    <item.icon className={`w-4 h-4 ${item.isDanger ? 'text-red-400' : 'text-[#3AAFA9]'}`} />
                  </div>
                  <span className="text-sm tracking-wider font-medium">{item.label}</span>
                </motion.button>
            )}
            </div>
            <div className="flex-shrink-0 p-4 text-center">
              <p className="text-[10px] tracking-[0.3em] uppercase text-white/15">Reel Chess v1.0</p>
            </div>
          </motion.div>
        </>
      }
    </AnimatePresence>);

}

export default function Lobby() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [difficultyOpen, setDifficultyOpen] = useState(false);
  const [premiumOpen, setPremiumOpen] = useState(false);
  const [twoVTwoOpen, setTwoVTwoOpen] = useState(false);
  const [streakData, setStreakData] = useState(null);
  const [showStreakPopup, setShowStreakPopup] = useState(false);
  const [volume, setVolume] = useState(() => getMenuMusicVolume());

  const handleVolumeChange = (e) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    setMenuMusicVolume(v);
  };

  useEffect(() => {
    startMenuMusic();
    return () => stopMenuMusic();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    const processStreak = async () => {
      try {
        const date = new Date().toLocaleDateString('en-CA');
        const res = await base44.functions.invoke('processLoginStreak', { date });
        if (res.data) {
          setStreakData(res.data);
          if (res.data.isNewDay && res.data.rewardAwarded > 0) {
            setShowStreakPopup(true);
          }
        }
      } catch (e) {
        console.error('Streak processing failed:', e);
      }
    };
    processStreak();
  }, [isAuthenticated]);

  const handleLogout = async () => {
    await base44.auth.logout();
    stopMenuMusic();
  };

  const handleNavigate = (section) => {
    if (section === 'about') {navigate('/About');return;}
    if (section === 'contact') {navigate('/Contact');return;}
    if (section === 'faq') {navigate('/FAQ');return;}
    if (section === 'chat') {navigate('/Chat');return;}
    if (section === 'history') {navigate('/GameHistory');return;}
    if (section === 'dashboard') {navigate('/Dashboard');return;}
    if (section === 'profile') {navigate('/Profile');return;}
    if (section === 'achievements') {navigate('/Achievements');return;}
    if (section === 'tournament') {navigate('/Tournament');return;}
    navigate(createPageUrl('Info') + `?section=${section}`);
  };

  const handleDifficultyConfirm = () => {
    stopMenuMusic();
    setDifficultyOpen(false);
    navigate(createPageUrl('Game') + `?mode=ai`);
  };

  const buttons = [
  { label: 'vs AI', icon: Bot, onClick: () => setDifficultyOpen(true), span: false },
  { label: 'Local PVP', icon: Users, onClick: () => {stopMenuMusic();navigate(createPageUrl('Game') + `?mode=local`);}, span: false },
  { label: '2v2', icon: UsersRound, onClick: () => setTwoVTwoOpen(true), span: false },
  { label: 'R.C.U.', icon: BookOpen, onClick: () => navigate('/Tutorial'), span: false },
  { label: 'Daily', icon: Gift, onClick: () => navigate('/DailyChallenges'), span: false },
  { label: 'Store', icon: ShoppingBag, onClick: () => navigate('/Store'), span: false },
  { label: 'Menu', icon: MenuIcon, onClick: () => setMenuOpen(true), span: true }];


  return (
    <div className="relative min-h-screen bg-[#0a0a0f] text-white overflow-hidden flex flex-col items-center">
      {/* Cinematic 3D hero backdrop */}
      <Cinematic3DHero />

      {/* Readability overlays */}
      <div className="pointer-events-none absolute inset-0 z-[1]"
      style={{ background: 'radial-gradient(120% 80% at 50% 16%, rgba(10,10,15,0.15) 0%, rgba(10,10,15,0.5) 58%, rgba(10,10,15,0.92) 100%)' }} />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 z-[1]"
      style={{ background: 'linear-gradient(to top, #0a0a0f 10%, rgba(10,10,15,0.55) 45%, transparent 100%)' }} />

      {/* Title */}
      <motion.div
        className="relative z-10 text-center pt-9 pb-1 w-full"
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        
        <h1
          className="text-4xl tracking-[0.22em] uppercase [font-family:'Old_Standard_TT',_serif] font-bold"
          style={{
            backgroundImage: 'linear-gradient(135deg, #3AAFA9 0%, #A8E6E3 50%, #3AAFA9 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 18px rgba(58,175,169,0.35))'
          }}>
          
          REEL CHESS
        </h1>
      </motion.div>

      {/* Volume control */}
      <motion.div
        className="relative z-10 flex justify-center pb-1 w-full"
        initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
        
        <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-[#3AAFA9]/20 backdrop-blur-md">
          <Volume2 className="w-3.5 h-3.5 text-[#3AAFA9] shrink-0" />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={handleVolumeChange}
            aria-label="Menu music volume"
            className="rcu-volume-slider w-28 h-1.5" />
          
          <span className="text-[10px] font-bold text-[#3AAFA9] tabular-nums w-7 text-right">{Math.round(volume * 100)}</span>
        </div>
      </motion.div>

      {/* Online PVP hero banner */}
      <motion.div
        className="relative z-10 flex justify-center pt-4 w-full px-4"
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
        
        <motion.button
          onClick={() => user?.is_premium ? (stopMenuMusic(), navigate('/OnlineGame')) : setPremiumOpen(true)}
          whileTap={{ scale: 0.97 }}
          className="relative overflow-hidden rounded-2xl px-6 py-4 text-left group w-full backdrop-blur-md"
          style={{ background: 'linear-gradient(135deg, rgba(58,175,169,0.18) 0%, rgba(58,175,169,0.06) 100%)', border: '1px solid rgba(58,175,169,0.4)', maxWidth: 480 }}>
          
          <div className="relative z-10 flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {user?.is_premium ?
                <Wifi className="w-3.5 h-3.5 text-[#3AAFA9]" /> :
                <Crown className="w-3.5 h-3.5 text-[#3AAFA9]" />}
                <span className="text-[9px] tracking-[0.3em] uppercase font-semibold text-[#3AAFA9]/70">
                  {user?.is_premium ? 'Live Match' : 'Premium Feature'}
                </span>
              </div>
              <p className="text-lg font-black tracking-wider text-[#3AAFA9]">
                Play Online PVP
              </p>
              <p className="text-[10px] mt-0.5 text-[#3AAFA9]/50">
                {user?.is_premium ? 'Challenge anyone, anywhere' : 'Subscribe for $4.99/mo to unlock'}
              </p>
            </div>
            {!user?.is_premium &&
            <div className="shrink-0 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase text-[#3AAFA9]"
            style={{ background: 'rgba(58,175,169,0.15)', border: '1px solid rgba(58,175,169,0.3)' }}>
                Unlock
              </div>
            }
          </div>
        </motion.button>
      </motion.div>

      {/* Auth buttons (if not logged in) */}
      {!isAuthenticated &&
      <motion.div
        className="relative z-10 flex gap-2 px-4 pt-3 w-full justify-center"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.22 }}>
        
          <motion.button
          onClick={() => navigate('/login')}
          className="flex items-center justify-center px-8 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-white font-bold text-xs tracking-[0.18em] uppercase hover:bg-white/10 active:scale-95 transition-all select-none"
          whileTap={{ scale: 0.94 }}>
          
            <LogIn className="w-3.5 h-3.5 mr-1.5" />
            Login
          </motion.button>
          <motion.button
          onClick={() => navigate('/register')}
          className="flex items-center justify-center px-8 py-2 rounded-full border border-[#3AAFA9]/60 bg-[#3AAFA9]/15 backdrop-blur-md text-[#3AAFA9] font-bold text-xs tracking-[0.18em] uppercase hover:bg-[#3AAFA9]/25 active:scale-95 transition-all select-none"
          whileTap={{ scale: 0.94 }}>
          
            Register
          </motion.button>
        </motion.div>
      }

      {/* Flexible spacer so the 3D scene breathes in the middle */}
      <div className="relative z-10 flex-1 min-h-[2vh]" />

      {/* Glass button grid */}
      <motion.div
        className="relative z-10 flex justify-center pb-4 px-4 w-full"
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}>
        
        <div className="grid grid-cols-2 gap-3 w-full" style={{ maxWidth: 480 }}>
          {buttons.map((btn, i) =>
          <motion.button
            key={btn.label}
            onClick={btn.onClick}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.05 }}
            className={`flex items-center justify-center gap-2.5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md py-4 text-white/90 active:bg-white/10 transition-all select-none${btn.span ? ' col-span-2' : ''}`}>
            
              <btn.icon className="w-4 h-4 text-[#3AAFA9]" />
              <span className="text-sm font-black tracking-[0.18em] uppercase">{btn.label}</span>
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Bottom tagline */}
      <motion.div
        className="relative z-10 text-center pb-5"
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
        
        <p className="text-xs tracking-[0.45em] uppercase text-[#3AAFA9]/40 font-medium">
          Get Immersed
        </p>
      </motion.div>

      {/* Modals */}
      <MenuModal isOpen={menuOpen} onClose={() => setMenuOpen(false)} onNavigate={handleNavigate} isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <PremiumModal isOpen={premiumOpen} onClose={() => setPremiumOpen(false)} isAuthenticated={isAuthenticated} />
      <TwoVTwoModal
        isOpen={twoVTwoOpen}
        onClose={() => setTwoVTwoOpen(false)}
        onLocal={() => {setTwoVTwoOpen(false);stopMenuMusic();navigate(createPageUrl('Game') + '?mode=2v2');}}
        onOnline={() => {
          setTwoVTwoOpen(false);
          if (!user?.is_premium) {setPremiumOpen(true);return;}
          if (!isAuthenticated) {navigate('/login');return;}
          navigate(createPageUrl('Online2v2Game'));
        }}
        isPremium={user?.is_premium}
        isAuthenticated={isAuthenticated} />
      
      <StreakPopup
        isOpen={showStreakPopup}
        onClose={() => setShowStreakPopup(false)}
        streak={streakData?.streak || 0}
        previousStreak={streakData?.previousStreak || 0}
        rewardAwarded={streakData?.rewardAwarded || 0} />
      
      <DifficultyModal
        isOpen={difficultyOpen}
        onClose={() => setDifficultyOpen(false)}
        onConfirm={handleDifficultyConfirm} />
      
    </div>);

}