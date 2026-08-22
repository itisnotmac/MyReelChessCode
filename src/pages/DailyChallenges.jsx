import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft, Coins, Trophy, Gamepad2, Camera, Settings as SettingsIcon,
  User as UserIcon, RefreshCw, Loader2, LogIn, ShoppingBag, ClipboardList,
  CheckCircle2,
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { getTodaysChallenge, CHALLENGE_REWARD } from '@/lib/dailyChallenges';
import { Button } from '@/components/ui/button';

const ACTIVITY_ICONS = {
  match: Gamepad2,
  challenge: Trophy,
  avatar: Camera,
  settings: SettingsIcon,
  profile: UserIcon,
};

const ACTIVITY_COLORS = {
  match: '#3AAFA9',
  challenge: '#D4AF37',
  avatar: '#3AAFA9',
  settings: '#3AAFA9',
  profile: '#3AAFA9',
};

function formatTime(iso) {
  try {
    return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  } catch { return ''; }
}

export default function DailyChallenges() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshMsg, setRefreshMsg] = useState(null);
  const [timeUntilReset, setTimeUntilReset] = useState('');

  const loadAccount = useCallback(async () => {
    if (!isAuthenticated) { setLoading(false); return; }
    try {
      const res = await base44.entities.PlayerAccount.list();
      let acct = res?.[0] || null;
      // If the daily progress hasn't been reset for today yet (e.g. the user
      // hasn't played since yesterday), sync with the server to trigger the
      // reset so stale wins/claims from a previous day don't show as completed.
      const todayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'UTC' });
      if (acct && acct.last_challenge_date !== todayStr) {
        const syncRes = await base44.functions.invoke('claimDailyRewards', {});
        const syncBody = syncRes?.data || syncRes;
        if (syncBody?.account) acct = syncBody.account;
      }
      setAccount(acct);
    } catch (e) {
      console.error('Failed to load account:', e);
    }
    setLoading(false);
  }, [isAuthenticated]);

  useEffect(() => { loadAccount(); }, [loadAccount]);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight - now;
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setTimeUntilReset(`${h}h ${m}m`);
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  const claimedList = (() => {
    try { return JSON.parse(account?.claimed_today || '[]'); } catch { return []; }
  })();

  const activities = (() => {
    try { return JSON.parse(account?.daily_activities || '[]'); } catch { return []; }
  })().reverse();

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // Safety valve: catches any rewards missed if the user dropped offline
      // at the exact moment a game ended.
      const res = await base44.functions.invoke('claimDailyRewards', {});
      const body = res?.data || res;
      if (body?.account) setAccount(body.account);
      else await loadAccount();
      if (body?.newRewards > 0) {
        setRefreshMsg(`+${body.newRewards} Tempo recovered!`);
      } else {
        setRefreshMsg('Report synced — all caught up');
      }
      setTimeout(() => setRefreshMsg(null), 3000);
    } catch (e) {
      console.error('Refresh failed:', e);
      setRefreshMsg('Failed to sync report');
      setTimeout(() => setRefreshMsg(null), 3000);
    }
    setRefreshing(false);
  };

  const coinBalance = account?.currency_balance || 0;
  const todayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'UTC' });
  const todaysChallenge = getTodaysChallenge(todayStr);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center justify-center px-6 relative">
        <div className="absolute inset-0 z-0">
          <img src="https://media.base44.com/images/public/69ab30c24c8c7db2b8432adf/574c7d4b7_generated_image.png" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0"
            style={{ background: 'radial-gradient(120% 80% at 50% 12%, rgba(10,10,15,0.2) 0%, rgba(10,10,15,0.55) 60%, rgba(10,10,15,0.88) 100%)' }} />
        </div>
        <ClipboardList className="relative z-10 w-12 h-12 text-[#3AAFA9]/60 mb-4" />
        <h1 className="relative z-10 text-xl font-bold mb-2">Daily Report Card</h1>
        <p className="relative z-10 text-sm text-white/50 text-center mb-6 max-w-xs">
          Log in to track your daily activities and earn Tempo by completing challenges.
        </p>
        <button onClick={() => navigate('/login')}
          className="relative z-10 flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#3AAFA9]/15 border border-[#3AAFA9]/60 text-[#3AAFA9] font-bold text-xs tracking-wider uppercase">
          <LogIn className="w-4 h-4" /> Login
        </button>
        <button onClick={() => navigate('/')} className="relative z-10 mt-3 text-xs text-white/60 hover:text-white/60">Back to Lobby</button>
      </div>
    );
  }

  const ch = todaysChallenge;
  const progress = ch.getProgress(account);
  const isComplete = progress >= ch.target;
  const isClaimed = claimedList.includes(ch.id);
  const pct = Math.min(100, (progress / ch.target) * 100);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pb-8 relative">
      {/* Cinematic backdrop */}
      <div className="absolute inset-0 z-0">
        <img src="https://media.base44.com/images/public/69ab30c24c8c7db2b8432adf/574c7d4b7_generated_image.png" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(120% 80% at 50% 12%, rgba(10,10,15,0.2) 0%, rgba(10,10,15,0.55) 60%, rgba(10,10,15,0.88) 100%)' }} />
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center gap-3 px-4 pt-6 pb-4">
        <button aria-label="Go back" onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/'))}
          className="w-11 h-11 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-[#3AAFA9]" />
          <h1 className="text-xl font-bold tracking-wider">REPORT CARD</h1>
        </div>
      </div>

      {/* Tempo Balance */}
      <div className="relative z-10 px-4 mb-4">
        <div className="rounded-xl p-4 border border-[#D4AF37]/30 backdrop-blur-md flex items-center justify-between"
          style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.10) 0%, rgba(212,175,55,0.03) 100%)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#D4AF37]/15 flex items-center justify-center">
              <Coins className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <p className="text-2xl font-black text-[#D4AF37] tabular-nums">{coinBalance}</p>
              <p className="text-[10px] tracking-wider text-white/60 uppercase">Tempo</p>
            </div>
          </div>
          <button onClick={() => navigate('/Store')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/60 text-[11px] font-bold tracking-wider hover:bg-white/10 transition-colors">
            <ShoppingBag className="w-3.5 h-3.5" /> STORE
          </button>
        </div>
      </div>

      {/* Today's Challenge */}
      <div className="relative z-10 px-4 mb-4">
        <p className="text-[10px] tracking-[0.2em] uppercase text-white/60 mb-2">Today's Challenge • {CHALLENGE_REWARD} Tempo</p>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className={`rounded-xl p-5 border backdrop-blur-md transition-all ${
            isClaimed ? 'border-[#3AAFA9]/40 bg-black/40'
            : isComplete ? 'border-[#D4AF37]/50 bg-black/40'
            : 'border-white/15 bg-black/40'
          }`}>
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              isClaimed ? 'bg-[#3AAFA9]/15'
              : isComplete ? 'bg-[#D4AF37]/15'
              : 'bg-white/5'
            }`}>
              <ch.Icon className={`w-6 h-6 ${
                isClaimed ? 'text-[#3AAFA9]'
                : isComplete ? 'text-[#D4AF37]'
                : 'text-white/60'
              }`} />
            </div>
            <div className="flex-1">
              <p className="text-base font-bold text-white">{ch.title}</p>
              <p className="text-xs text-white/60">{ch.description}</p>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20">
              <Coins className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="text-xs font-bold text-[#D4AF37]">{ch.reward}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2.5 rounded-full bg-white/5 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${pct}%`,
                  background: isClaimed ? '#3AAFA9' : isComplete ? '#D4AF37' : 'rgba(58,175,169,0.6)',
                }}
              />
            </div>
            <span className="text-xs font-bold text-white/50 min-w-[35px] text-right tabular-nums">{progress}/{ch.target}</span>
          </div>
          {isClaimed && (
            <div className="flex items-center gap-1.5 mt-2.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#3AAFA9]" />
              <span className="text-xs text-[#3AAFA9]/80">+{ch.reward} Tempo auto-applied</span>
            </div>
          )}
        </motion.div>
      </div>

      {/* Activity Feed */}
      <div className="relative z-10 px-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] tracking-[0.2em] uppercase text-white/60">Activity Feed</p>
          <p className="text-[10px] tracking-wider text-white/60">Resets in {timeUntilReset}</p>
        </div>
        {refreshMsg && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="mb-3 p-3 rounded-xl bg-[#3AAFA9]/10 border border-[#3AAFA9]/30 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#3AAFA9]" />
            <span className="text-sm text-[#3AAFA9]">{refreshMsg}</span>
          </motion.div>
        )}
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 text-[#3AAFA9]/50 animate-spin" />
          </div>
        ) : activities.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-black/30 p-8 text-center">
            <ClipboardList className="w-8 h-8 text-white/50 mx-auto mb-2" />
            <p className="text-sm text-white/60">No activities yet today</p>
            <p className="text-xs text-white/50 mt-1">Play a game to get started!</p>
            <Button
              onClick={() => navigate('/Lobby')}
              variant="chess-primary"
              className="mt-4 px-6 py-2.5 rounded-full font-bold text-xs tracking-wider uppercase"
            >
              <Gamepad2 className="w-4 h-4" /> Play a Game
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {activities.map((act, i) => {
              const Icon = ACTIVITY_ICONS[act.type] || ClipboardList;
              const color = ACTIVITY_COLORS[act.type] || '#3AAFA9';
              return (
                <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="rounded-lg bg-black/30 border border-white/10 p-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${color}15` }}>
                    <Icon className="w-4 h-4" style={{ color }} />
                  </div>
                  <p className="text-sm text-white/80 flex-1">{act.label}</p>
                  <span className="text-[10px] text-white/60 flex-shrink-0">{formatTime(act.time)}</span>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Refresh Report Button */}
      {!loading && (
        <div className="relative z-10 px-4 mt-4">
          <button onClick={handleRefresh} disabled={refreshing}
            className="w-full py-3.5 rounded-xl font-bold text-sm tracking-wider transition-all flex items-center justify-center gap-2 bg-[#3AAFA9]/15 border border-[#3AAFA9]/40 text-[#3AAFA9] hover:bg-[#3AAFA9]/25 active:scale-95 disabled:opacity-50">
            {refreshing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <><RefreshCw className="w-4 h-4" /> REFRESH REPORT</>
            )}
          </button>
          <p className="text-center text-[10px] text-white/50 mt-3">
            Rewards auto-apply on completion — refresh syncs if you dropped offline mid-game
          </p>
        </div>
      )}
    </div>
  );
}