import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { X, HelpCircle, Mail, Info, LogOut, LogIn, Gift, MessageCircle, BookOpen, ChevronLeft, Volume2, Swords } from 'lucide-react';
import DifficultyModal from '../components/lobby/DifficultyModal';
import TwoVTwoModal from '../components/lobby/TwoVTwoModal';
import PlayChessModal from '../components/lobby/PlayChessModal';
import QrScannerModal from '../components/lobby/QrScannerModal';
import FeatureUnlockModal from '../components/lobby/FeatureUnlockModal';
import { useFeatureUnlocks } from '@/hooks/useFeatureUnlocks';
import { startMenuMusic, stopMenuMusic, getMenuMusicVolume, setMenuMusicVolume } from '@/lib/menuMusic';
import { useAuth } from '@/lib/AuthContext';
import { base44 } from '@/api/base44Client';
import StreakPopup from '../components/streak/StreakPopup';
import Cinematic3DHero from '@/components/lobby/Cinematic3DHero';
import { HERO_BACKDROPS } from '@/lib/heroBackdrops';
import StormOverlay from '@/components/lobby/StormOverlay';

const PANEL_W = 288;
const TAB_W = 44;
const SPRING = { type: 'spring', stiffness: 300, damping: 32 };

function MenuDrawer({ open, setOpen, onNavigate, isAuthenticated, onLogout }) {
  const items = [
    { id: 'chat', label: 'Community Chat', icon: MessageCircle },
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
    { id: 'contact', label: 'Contact', icon: Mail },
    { id: 'about', label: 'About', icon: Info },
    ...(isAuthenticated ? [{ id: 'logout', label: 'Sign Out', icon: LogOut, isDanger: true }] : [])
  ];

  // x = how far the panel is pushed off the right edge (0 = fully open, PANEL_W = closed)
  const x = useMotionValue(PANEL_W);
  const tabX = useTransform(x, (v) => v - PANEL_W);
  const backdropOpacity = useTransform(x, [0, PANEL_W], [1, 0]);
  const shadow = useTransform(x, [0, PANEL_W], ['-12px 0 40px rgba(0,0,0,0.55)', '0 0 0 rgba(0,0,0,0)']);
  const dragRef = useRef({ active: false, startX: 0, startPos: 0, lastX: 0, lastT: 0, vel: 0, moved: false });

  // Keep the panel in sync when `open` changes (tap, backdrop, item, close button)
  useEffect(() => {
    animate(x, open ? 0 : PANEL_W, SPRING);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const onPointerDown = (e) => {
    e.currentTarget.setPointerCapture?.(e.pointerId);
    x.stop();
    dragRef.current = { active: true, startX: e.clientX, startPos: x.get(), lastX: e.clientX, lastT: performance.now(), vel: 0, moved: false };
  };

  const onPointerMove = (e) => {
    const d = dragRef.current;
    if (!d.active) return;
    const dx = e.clientX - d.startX;
    if (Math.abs(dx) > 6) d.moved = true;
    const now = performance.now();
    const dt = now - d.lastT;
    if (dt > 0) d.vel = ((e.clientX - d.lastX) / dt) * 1000;
    d.lastX = e.clientX;
    d.lastT = now;
    x.set(Math.min(PANEL_W, Math.max(0, d.startPos + dx)));
  };

  const onPointerUp = () => {
    const d = dragRef.current;
    if (!d.active) return;
    d.active = false;
    if (!d.moved) {
      setOpen(!open); // a simple tap toggles
      return;
    }
    // Flick wins; otherwise snap to whichever side is closer
    const toOpen = d.vel < -400 ? true : d.vel > 400 ? false : x.get() < PANEL_W / 2;
    setOpen(toOpen);
    animate(x, toOpen ? 0 : PANEL_W, SPRING);
  };

  return createPortal(
    <>
      {/* Dark fade behind the panel */}
      <motion.div
        className="fixed inset-0 bg-black/60 z-[80]"
        style={{ opacity: backdropOpacity, pointerEvents: open ? 'auto' : 'none' }}
        onClick={() => setOpen(false)} />

      {/* Sliding panel */}
      <motion.div
        role="dialog" aria-modal={open} aria-label="Lobby menu"
        className="fixed right-0 top-0 bottom-0 flex flex-col bg-gradient-to-b from-[#1a1a2e] to-[#0f0f1a] z-[90] border-l border-[#3AAFA9]/15"
        style={{ width: PANEL_W, x, boxShadow: shadow, paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="p-6 pb-4 flex-shrink-0">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold tracking-wider text-[#3AAFA9]">MENU</h2>
            <button onClick={() => setOpen(false)} aria-label="Close" className="w-11 h-11 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="px-6 space-y-2 overflow-y-auto flex-1 pb-6 overscroll-contain">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'logout') onLogout();
                else onNavigate(item.id);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all group ${
                item.isDanger ? 'text-red-400/70 hover:text-red-400 hover:bg-red-400/10' : 'text-white/70 hover:text-white hover:bg-white/5'}`}>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                item.isDanger ? 'bg-red-400/10 group-hover:bg-red-400/20' : 'bg-[#3AAFA9]/10 group-hover:bg-[#3AAFA9]/20'}`}>
                <item.icon className={`w-4 h-4 ${item.isDanger ? 'text-red-400' : 'text-[#3AAFA9]'}`} />
              </div>
              <span className="text-sm tracking-wider font-medium">{item.label}</span>
            </button>
          ))}
        </div>
        <div className="flex-shrink-0 p-4 text-center">
          <p className="text-[10px] tracking-[0.3em] uppercase text-white/50">Reel Chess v1.0</p>
        </div>
      </motion.div>

      {/* Drag tab, rides on the panel's left edge */}
      <motion.button
        aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClick={(e) => { if (e.detail === 0) setOpen(!open); }}
        className="fixed right-0 z-[91] flex flex-col items-center justify-center gap-2 rounded-l-2xl border border-r-0 border-[#3AAFA9]/40 bg-[#0d1f1f]/85 text-[#3AAFA9] select-none"
        style={{ width: TAB_W, height: 112, top: 'calc(env(safe-area-inset-top) + 30vh)', x: tabX, touchAction: 'none', boxShadow: '0 0 10px rgba(58,175,169,0.35)' }}>
        <ChevronLeft className="w-4 h-4" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
        <span className="text-[11px] font-bold tracking-[0.25em] uppercase" style={{ writingMode: 'vertical-rl' }}>Menu</span>
      </motion.button>
    </>,
    document.body
  );
}

export default function Lobby() {
  const navigate = useNavigate();
  const { isAuthenticated, user, navigateToLogin, logout } = useAuth();
  const { hasUnlock } = useFeatureUnlocks(user);
  const [menuOpen, setMenuOpen] = useState(false);
  const [difficultyOpen, setDifficultyOpen] = useState(false);
  const [twoVTwoOpen, setTwoVTwoOpen] = useState(false);
  const [featureUnlock, setFeatureUnlock] = useState({ open: false, id: null });
  const [playChessOpen, setPlayChessOpen] = useState(false);
  const [qrScannerOpen, setQrScannerOpen] = useState(false);
  const [streakData, setStreakData] = useState(null);
  const [showStreakPopup, setShowStreakPopup] = useState(false);
  const [volume, setVolume] = useState(() => getMenuMusicVolume());
  const rainfallEnabled = (() => {
    const stored = localStorage.getItem('chessRainfall');
    if (stored === 'off') return false;
    if (stored === 'on') return true;
    return !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  })();

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
        const body = res?.data || res;
        if (body) {
          setStreakData(body);
          if (body.isNewDay && body.rewardAwarded > 0) {
            setShowStreakPopup(true);
          }
        }
      } catch (e) {
        console.error('Streak processing failed:', e);
      }
    };
    processStreak();
  }, [isAuthenticated]);

  const handleLogout = () => {
    stopMenuMusic();
    logout('/login');
  };

  // Auto-join when arriving via ?join=CODE (e.g. from scanning the QR with a phone camera)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const joinCode = params.get('join');
    if (!joinCode) return;
    if (!isAuthenticated) {
      navigateToLogin();
      return;
    }
    (async () => {
      try {
        const res = await base44.functions.invoke('joinWifiGame', { invite_code: joinCode.toUpperCase() });
        const body = res?.data || res;
        if (body?.game_id) {
          stopMenuMusic();
          navigate(createPageUrl('OnlineGame') + `?game=${body.game_id}`);
        } else {
          // Game doesn't exist — clean the URL and inform via console
          console.warn('Join failed:', body?.error);
          window.history.replaceState({}, '', window.location.pathname);
        }
      } catch (e) {
        console.warn('Join failed:', e?.response?.data?.error || e?.data?.error || e?.message);
        window.history.replaceState({}, '', window.location.pathname);
      }
    })();
  }, [isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleNavigate = (section) => {
    if (section === 'about') {navigate('/About');return;}
    if (section === 'contact') {navigate('/Contact');return;}
    if (section === 'faq') {navigate('/FAQ');return;}
    if (section === 'chat') {navigate('/Chat');return;}
    if (section === 'history') {navigate('/GameHistory');return;}
    if (section === 'dashboard') {navigate('/Dashboard');return;}
    if (section === 'profile') {navigate('/Profile');return;}
    if (section === 'achievements') {navigate('/Achievements');return;}
    navigate(createPageUrl('Info') + `?section=${section}`);
  };

  const handleDifficultyConfirm = () => {
    stopMenuMusic();
    setDifficultyOpen(false);
    navigate(createPageUrl('Game') + `?mode=ai`);
  };

  const buttons = [
  { label: 'Learn Chess', icon: BookOpen, onClick: () => navigate('/Tutorial') },
  { label: 'Play Chess', icon: Swords, onClick: () => setPlayChessOpen(true) },
  { label: 'Earn Chess', icon: Gift, onClick: () => navigate('/DailyChallenges') }];


  return (
    <div
      className="relative bg-[#0a0a0f] text-white overflow-hidden flex flex-col items-center"
      style={{ minHeight: 'calc(100svh - env(safe-area-inset-top) - env(safe-area-inset-bottom) - 7rem)' }}
    >
      {/* Cinematic backdrop image — matches the generated graphics on every other page */}
      <div className="absolute inset-0 z-0">
        <img src={HERO_BACKDROPS.lobbySpotlightStage} alt="" className="w-full h-full object-cover" />
      </div>

      {/* 3D hero pieces composited on top of the backdrop (transparent canvas) */}
      <Cinematic3DHero />

      {/* Readability overlays */}
      <div className="pointer-events-none absolute inset-0 z-[5]"
      style={{ background: 'radial-gradient(120% 80% at 50% 16%, rgba(10,10,15,0.15) 0%, rgba(10,10,15,0.5) 58%, rgba(10,10,15,0.92) 100%)' }} />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 z-[5]"
      style={{ background: 'linear-gradient(to top, #0a0a0f 10%, rgba(10,10,15,0.55) 45%, transparent 100%)' }} />

      {/* Thunderstorm rain + lightning flash */}
      {rainfallEnabled && <StormOverlay />}

      {/* Title */}
      <motion.div
        className="relative z-10 text-center pt-9 pb-1 w-full"
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        
        <h1
          className="tracking-[0.22em] uppercase [font-family:'Old_Standard_TT',_serif] font-bold text-4xl"
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

     

      {/* Auth buttons (if not logged in) */}
      {!isAuthenticated &&
      <motion.div
        className="relative z-10 flex gap-2 px-4 pt-3 w-full justify-center"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.22 }}>
        
          <motion.button
          onClick={() => navigate('/login')}
          className="flex items-center justify-center px-8 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-white font-bold text-xs tracking-[0.18em] uppercase hover:bg-white/10 active:scale-95 transition-[background-color,transform] select-none"
          whileTap={{ scale: 0.94 }}>
          
            <LogIn className="w-3.5 h-3.5 mr-1.5" />
            Login
          </motion.button>
          <motion.button
          onClick={() => navigate('/register')}
          className="flex items-center justify-center px-8 py-2 rounded-full border border-[#3AAFA9]/60 bg-[#3AAFA9]/15 backdrop-blur-md text-[#3AAFA9] font-bold text-xs tracking-[0.18em] uppercase hover:bg-[#3AAFA9]/25 active:scale-95 transition-[background-color,transform] select-none"
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
        
        <div className="grid grid-cols-3 gap-2 w-full" style={{ maxWidth: 480 }}>
          {buttons.map((btn, i) =>
          <motion.button
            key={btn.label}
            onClick={btn.onClick}
            whileTap={{ opacity: 0.85 }}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.05 }}
            style={{ boxShadow: '0 0 8px rgba(58,175,169,0.7), 0 0 16px rgba(58,175,169,0.4), 0 0 24px rgba(58,175,169,0.15), inset 0 0 6px rgba(58,175,169,0.1)' }}
            className="flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-[#3AAFA9]/50 bg-white/5 backdrop-blur-md py-3.5 text-white/90 hover:bg-white/10 active:bg-white/10 transition-all select-none">
            
              <btn.icon className="w-4 h-4 text-[#3AAFA9]" />
              <span className="text-[10px] tracking-[0.1em] uppercase [font-family:'Old_Standard_TT',_serif] font-bold">{btn.label}</span>
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Bottom tagline */}
      <motion.div
        className="relative z-10 text-center pb-5"
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
        
        <p className="text-xs tracking-[0.45em] uppercase text-[#3AAFA9]/60 font-medium">
          Get Immersed
        </p>
      </motion.div>

      {/* Modals */}
      <MenuDrawer open={menuOpen} setOpen={setMenuOpen} onNavigate={handleNavigate} isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <PlayChessModal
        isOpen={playChessOpen}
        onClose={() => setPlayChessOpen(false)}
        onOnlinePvp={() => {stopMenuMusic();navigate('/OnlineGame');}}
        onVsAI={() => setDifficultyOpen(true)}
        onLocalPvp={() => {stopMenuMusic();navigate(createPageUrl('Game') + '?mode=local');}}
        on2v2={() => setTwoVTwoOpen(true)}
        onWifiMatch={() => {
          if (!hasUnlock('qr_host_unlock')) {
            setFeatureUnlock({ open: true, id: 'qr_host_unlock' });
            return;
          }
          stopMenuMusic();
          navigate(createPageUrl('WifiMatch'));
        }}
        onJoinQr={() => setQrScannerOpen(true)}
        onBlitzSchach={() => {stopMenuMusic();navigate('/BlitzSchach');}}
        hasQrUnlock={hasUnlock('qr_host_unlock')} />
      <TwoVTwoModal
        isOpen={twoVTwoOpen}
        onClose={() => setTwoVTwoOpen(false)}
        onLocal={() => {setTwoVTwoOpen(false);stopMenuMusic();navigate(createPageUrl('Game') + '?mode=2v2');}}
        onOnline={() => {
          setTwoVTwoOpen(false);
          if (!hasUnlock('2v2_host_unlock')) {
            setFeatureUnlock({ open: true, id: '2v2_host_unlock' });
            return;
          }
          if (!isAuthenticated) {navigate('/login');return;}
          navigate(createPageUrl('Online2v2Game'));
        }}
        has2v2Unlock={hasUnlock('2v2_host_unlock')}
        isAuthenticated={isAuthenticated} />

      <FeatureUnlockModal
        isOpen={featureUnlock.open}
        onClose={() => setFeatureUnlock({ open: false, id: null })}
        featureId={featureUnlock.id}
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

      <QrScannerModal
        isOpen={qrScannerOpen}
        onClose={() => setQrScannerOpen(false)} />
      
    </div>);

}
