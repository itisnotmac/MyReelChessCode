import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Coins, Gift, Loader2, LogIn, ShoppingBag } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { getTodaysChallenge, CHALLENGE_REWARD, ITEM_COST_COINS } from '@/lib/dailyChallenges';

export default function DailyChallenges() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [claimResult, setClaimResult] = useState(null);
  const [timeUntilReset, setTimeUntilReset] = useState('');

  const loadAccount = useCallback(async () => {
    if (!isAuthenticated) { setLoading(false); return; }
    try {
      const res = await base44.entities.PlayerAccount.list();
      setAccount(res?.[0] || null);
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

  const handleClaim = async () => {
    setClaiming(true);
    try {
      const res = await base44.functions.invoke('claimDailyRewards', {});
      if (res.data?.account) setAccount(res.data.account);
      if (res.data?.newRewards > 0) {
        setClaimResult(`+${res.data.newRewards} coins claimed!`);
      } else {
        setClaimResult('No new rewards to claim yet');
      }
      setTimeout(() => setClaimResult(null), 3000);
    } catch (e) {
      console.error('Claim failed:', e);
      setClaimResult('Failed to claim rewards');
      setTimeout(() => setClaimResult(null), 3000);
    }
    setClaiming(false);
  };

  const coinBalance = account?.currency_balance || 0;
  const todayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'UTC' });
  const todaysChallenge = getTodaysChallenge(todayStr);
  const hasUnclaimed = (() => {
    const progress = todaysChallenge.getProgress(account);
    return progress >= todaysChallenge.target && !claimedList.includes(todaysChallenge.id);
  })();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center justify-center px-6 relative">
        <div className="absolute inset-0 z-0">
          <img src="https://media.base44.com/images/public/69ab30c24c8c7db2b8432adf/574c7d4b7_generated_image.png" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0"
            style={{ background: 'radial-gradient(120% 80% at 50% 12%, rgba(10,10,15,0.2) 0%, rgba(10,10,15,0.55) 60%, rgba(10,10,15,0.88) 100%)' }} />
        </div>
        <Coins className="relative z-10 w-12 h-12 text-[#D4AF37]/40 mb-4" />
        <h1 className="relative z-10 text-xl font-bold mb-2">Daily Challenges</h1>
        <p className="relative z-10 text-sm text-white/50 text-center mb-6 max-w-xs">
          Log in to earn coins by completing daily challenges and spend them in the store.
        </p>
        <button onClick={() => navigate('/login')}
          className="relative z-10 flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#3AAFA9]/15 border border-[#3AAFA9]/60 text-[#3AAFA9] font-bold text-xs tracking-wider uppercase">
          <LogIn className="w-4 h-4" /> Login
        </button>
        <button onClick={() => navigate('/')} className="relative z-10 mt-3 text-xs text-white/40 hover:text-white/60">Back to Lobby</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pb-8 relative">
      {/* Cinematic backdrop — celestial observatory */}
      <div className="absolute inset-0 z-0">
        <img src="https://media.base44.com/images/public/69ab30c24c8c7db2b8432adf/574c7d4b7_generated_image.png" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(120% 80% at 50% 12%, rgba(10,10,15,0.2) 0%, rgba(10,10,15,0.55) 60%, rgba(10,10,15,0.88) 100%)' }} />
      </div>
      <div className="relative z-10 flex items-center gap-3 px-4 pt-6 pb-4">
        <button onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/'))}
          className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <Gift className="w-5 h-5 text-[#D4AF37]" />
          <h1 className="text-xl font-bold tracking-wider">DAILY</h1>
        </div>
      </div>

      {/* Coin Balance */}
      <div className="relative z-10 px-4 mb-4">
        <div className="rounded-xl p-4 border border-[#D4AF37]/30 backdrop-blur-md flex items-center justify-between"
          style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.10) 0%, rgba(212,175,55,0.03) 100%)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#D4AF37]/15 flex items-center justify-center">
              <Coins className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <p className="text-2xl font-black text-[#D4AF37]">{coinBalance}</p>
              <p className="text-[10px] tracking-wider text-white/40 uppercase">Coins</p>
            </div>
          </div>
          <button onClick={() => navigate('/Store')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/60 text-[11px] font-bold tracking-wider hover:bg-white/10 transition-colors">
            <ShoppingBag className="w-3.5 h-3.5" /> STORE
          </button>
        </div>
      </div>

      <div className="relative z-10 px-4 mb-4 flex items-center justify-between">
        <p className="text-[10px] tracking-[0.2em] uppercase text-white/30">1 Challenge • {CHALLENGE_REWARD} Coins</p>
        <p className="text-[10px] tracking-wider text-white/30">Resets in {timeUntilReset}</p>
      </div>

      {claimResult && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="relative z-10 mx-4 mb-4 p-3 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center gap-2">
          <Coins className="w-4 h-4 text-[#D4AF37]" />
          <span className="text-sm text-[#D4AF37]">{claimResult}</span>
        </motion.div>
      )}

      {loading ? (
        <div className="relative z-10 flex justify-center py-12">
          <Loader2 className="w-6 h-6 text-[#D4AF37]/50 animate-spin" />
        </div>
      ) : (
        <div className="relative z-10 px-4 space-y-3">
          {(() => {
            const ch = todaysChallenge;
            const progress = ch.getProgress(account);
            const isComplete = progress >= ch.target;
            const isClaimed = claimedList.includes(ch.id);
            const pct = Math.min(100, (progress / ch.target) * 100);

            return (
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
                      : 'text-white/40'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-bold text-white">{ch.title}</p>
                    <p className="text-xs text-white/40">{ch.description}</p>
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
                  <span className="text-xs font-bold text-white/50 min-w-[35px] text-right">{progress}/{ch.target}</span>
                </div>
              </motion.div>
            );
          })()}
        </div>
      )}

      {!loading && (
        <div className="relative z-10 px-4 mt-4">
          <button onClick={handleClaim} disabled={claiming || !hasUnclaimed}
            className={`w-full py-3.5 rounded-xl font-bold text-sm tracking-wider transition-all flex items-center justify-center gap-2 ${
              hasUnclaimed
                ? 'bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37]/25 active:scale-95'
                : 'bg-white/5 border border-white/10 text-white/30 cursor-not-allowed'
            }`}>
            {claiming ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <><Gift className="w-4 h-4" />{hasUnclaimed ? 'CLAIM REWARDS' : 'ALL CLAIMED'}</>
            )}
          </button>
          <p className="text-center text-[10px] text-white/20 mt-3">
            Complete today's challenge for {CHALLENGE_REWARD} coins — earn {ITEM_COST_COINS} coins over 4 days to unlock 1 store item
          </p>
        </div>
      )}
    </div>
  );
}