import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Crown, Wifi, Users, Check, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';

export default function PremiumBanner({ isPremium }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubscribe = async () => {
    if (window.self !== window.top) {
      alert('Checkout is only available from the published app.');
      return;
    }
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await base44.functions.invoke('createCheckoutSession', {});
      if (res?.url) {
        window.location.href = res.url;
      } else {
        setError('Could not start checkout. Please try again.');
      }
    } catch (e) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (isPremium) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl p-5 mb-6"
        style={{
          background: 'linear-gradient(135deg, rgba(58,175,169,0.18) 0%, rgba(58,175,169,0.06) 100%)',
          border: '1px solid rgba(58,175,169,0.4)',
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-[#3AAFA9]/20 flex items-center justify-center">
            <Crown className="w-5 h-5 text-[#3AAFA9]" />
          </div>
          <div>
            <p className="text-sm font-black tracking-wider text-[#3AAFA9]">PREMIUM ACTIVE</p>
            <p className="text-[11px] text-[#3AAFA9]/60">Online PVP &amp; 2v2 unlocked</p>
          </div>
          <Check className="w-5 h-5 text-[#3AAFA9] ml-auto" />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl p-5 mb-6"
      style={{
        background: 'linear-gradient(135deg, rgba(58,175,169,0.18) 0%, rgba(58,175,169,0.06) 100%)',
        border: '1px solid rgba(58,175,169,0.4)',
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Crown className="w-4 h-4 text-[#3AAFA9]" />
        <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-[#3AAFA9]/80">Reel Chess Premium</span>
      </div>

      <h2 className="text-lg font-black tracking-wider text-white mb-1">Unlock Online Play</h2>
      <p className="text-xs text-white/40 mb-4">Subscribe to access competitive multiplayer modes.</p>

      <div className="space-y-2 mb-4">
        {[
          { icon: Wifi, label: 'Online PVP — Challenge anyone worldwide' },
          { icon: Users, label: '2v2 Team Mode — 4 players, 2 teams' },
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2.5">
            <Icon className="w-3.5 h-3.5 shrink-0 text-[#3AAFA9]" />
            <span className="text-[11px] text-white/70 tracking-wide">{label}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div>
          <span className="text-2xl font-black text-white">$4.99</span>
          <span className="text-white/40 text-xs ml-1">/ month</span>
        </div>
        <button
          onClick={handleSubscribe}
          disabled={loading}
          className="px-5 py-2.5 rounded-xl font-black text-[11px] tracking-[0.15em] uppercase text-[#0a0a0f] disabled:opacity-60 transition-opacity"
          style={{ background: 'linear-gradient(135deg, #3AAFA9, #5ECFCA)' }}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Subscribe'}
        </button>
      </div>

      {error && <p className="text-red-400 text-[11px] mt-2">{error}</p>}
      <p className="text-white/20 text-[9px] tracking-wider mt-3">Cancel anytime · Billed monthly</p>
    </motion.div>
  );
}