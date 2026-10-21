import React, { useState, useEffect } from 'react';
import { Loader2, Tv } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { showRewardedAd } from '@/lib/adMob';
import { isAndroidApp } from '@/lib/platformDetect';
import { PLAYER_ACCOUNT_UPDATED_EVENT } from '@/components/PlayerAccountBanner';

const AD_REWARD = 25;

function getTimeRemaining(nextAvailableAt) {
  if (!nextAvailableAt) return null;
  const diff = new Date(nextAvailableAt).getTime() - Date.now();
  if (diff <= 0) return null;
  const h = Math.floor(diff / (1000 * 60 * 60));
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${h}h ${m}m`;
}

export default function AdRewardButton({ onTempoEarned }) {
  const [loading, setLoading] = useState(false);
  const [nextAvailableAt, setNextAvailableAt] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [checked, setChecked] = useState(false);

  // Check cooldown on mount
  useEffect(() => {
    async function checkCooldown() {
      try {
        const res = await base44.functions.invoke('claimAdReward', { check_only: true });
        if (res?.data?.next_available_at) {
          setNextAvailableAt(res.data.next_available_at);
        }
      } catch (e) {}
      setChecked(true);
    }
    if (isAndroidApp()) checkCooldown();
    else setChecked(true);
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!nextAvailableAt) return;
    const interval = setInterval(() => {
      const remaining = getTimeRemaining(nextAvailableAt);
      setTimeRemaining(remaining);
      if (!remaining) {
        setNextAvailableAt(null);
        clearInterval(interval);
      }
    }, 60000);
    setTimeRemaining(getTimeRemaining(nextAvailableAt));
    return () => clearInterval(interval);
  }, [nextAvailableAt]);

  if (!isAndroidApp() || !checked) return null;

  const onCooldown = !!timeRemaining;

  const handleWatch = async () => {
    if (onCooldown || loading) return;
    setLoading(true);
    try {
      const earned = await showRewardedAd();
      if (!earned) {
        setLoading(false);
        return;
      }
      const res = await base44.functions.invoke('claimAdReward', {});
      if (res?.data?.success) {
        setNextAvailableAt(res.data.next_available_at);
        setTimeRemaining(getTimeRemaining(res.data.next_available_at));
        window.dispatchEvent(new Event(PLAYER_ACCOUNT_UPDATED_EVENT));
        if (onTempoEarned) onTempoEarned(res.data.new_balance);
      } else if (res?.data?.next_available_at) {
        setNextAvailableAt(res.data.next_available_at);
      }
    } catch (e) {
      console.error('Ad reward error:', e);
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleWatch}
      disabled={onCooldown || loading}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
        onCooldown
          ? 'border-white/10 bg-white/5 opacity-60 cursor-not-allowed'
          : 'border-[#3AAFA9]/30 bg-[#3AAFA9]/10 hover:bg-[#3AAFA9]/20'
      }`}
    >
      <div className="flex items-center gap-3">
        {loading
          ? <Loader2 className="w-4 h-4 animate-spin text-[#3AAFA9]" />
          : <Tv className="w-4 h-4 text-[#3AAFA9]" />
        }
        <div className="text-left">
          <p className="text-sm font-bold text-white">Watch an Ad</p>
          <p className="text-[10px] text-white/50">
            {onCooldown ? `Next reward in ${timeRemaining}` : 'Earn free Tempo'}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/30">
        <span className="text-[#D4AF37] font-bold text-sm">+{AD_REWARD}</span>
        <span className="text-[#D4AF37]/70 text-[10px]">Tempo</span>
      </div>
    </button>
  );
}