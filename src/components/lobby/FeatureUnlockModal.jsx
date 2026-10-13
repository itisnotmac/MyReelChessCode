import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, Lock, Wifi, Users, Loader2, Coins, Check } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { selectPlayerAccount } from '@/lib/playerAccount';
import { PLAYER_ACCOUNT_UPDATED_EVENT } from '@/components/PlayerAccountBanner';

// Display only. The real price is enforced by the server catalog in purchaseWithCurrency.
const FEATURE_PRICE = 200;

const FEATURES = {
  qr_host_unlock: {
    icon: Wifi,
    title: 'Host WiFi Matches',
    benefit: 'Generate a QR code — your friends join free',
  },
  '2v2_host_unlock': {
    icon: Users,
    title: 'Host 2v2 Team Matches',
    benefit: 'Create a room — invite 3 friends with a code',
  },
};

export default function FeatureUnlockModal({ isOpen, onClose, featureId, isAuthenticated, onUnlocked }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [balance, setBalance] = useState(null);
  const [unlocked, setUnlocked] = useState(false);

  const feature = FEATURES[featureId];
  const Icon = feature?.icon || Lock;
  const canAfford = balance !== null && balance >= FEATURE_PRICE;

  // Load the player's Tempo balance whenever the sheet opens
  useEffect(() => {
    if (!isOpen) {
      setError(null);
      setUnlocked(false);
      return;
    }
    if (!isAuthenticated) return;
    let cancelled = false;
    (async () => {
      try {
    const me = await base44.auth.me();
        const res = await base44.entities.PlayerAccount.filter({ user_id: me.id });
        if (!cancelled) setBalance(selectPlayerAccount(res)?.currency_balance || 0);
      } catch (e) {
        console.error('Failed to load Tempo balance:', e);
      }
    })();
    return () => { cancelled = true; };
  }, [isOpen, isAuthenticated]);

  const handleBuy = async () => {
    if (!isAuthenticated) {
      onClose();
      navigate('/login');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await base44.functions.invoke('purchaseWithCurrency', { item_id: featureId });
      const body = res?.data || res;
      if (body?.success) {
        setBalance(body.new_balance);
        window.dispatchEvent(new Event(PLAYER_ACCOUNT_UPDATED_EVENT));
        setUnlocked(true);
        onUnlocked?.();
        setTimeout(onClose, 1200);
      } else {
        setError(body?.error || 'Could not complete the purchase. Please try again.');
      }
    } catch (err) {
      setError(err?.data?.error || err?.response?.data?.error || err?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const goEarn = () => {
    onClose();
    navigate('/DailyChallenges');
  };

  return (
    <AnimatePresence>
      {isOpen && feature && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/70 z-[60]"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-x-4 bottom-0 z-[61] rounded-t-3xl overflow-hidden"
            style={{ background: 'linear-gradient(160deg, #0d1f1f 0%, #0a0a0f 100%)', border: '1px solid rgba(58,175,169,0.2)', borderBottom: 'none', maxWidth: 480, margin: '0 auto' }}
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 280, damping: 30 }}
          >
            <div className="p-6 pb-10">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Icon className="w-5 h-5 text-[#3AAFA9]" />
                  <span className="font-black tracking-[0.2em] uppercase text-sm text-[#3AAFA9]">One-Time Unlock</span>
                </div>
                <button onClick={onClose} aria-label="Close" className="w-11 h-11 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Lock icon */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ background: 'radial-gradient(circle, rgba(58,175,169,0.2) 0%, transparent 70%)', border: '1px solid rgba(58,175,169,0.3)' }}>
                  {unlocked ? <Check className="w-7 h-7 text-[#3AAFA9]" /> : <Lock className="w-7 h-7 text-[#3AAFA9]" />}
                </div>
              </div>

              <h2 className="text-center text-xl font-black tracking-wider text-white mb-1">{feature.title}</h2>
              <p className="text-center text-white/60 text-xs tracking-wider mb-6">{feature.benefit}</p>

              {/* Benefit card */}
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl mb-6"
                style={{ background: 'rgba(58,175,169,0.06)', border: '1px solid rgba(58,175,169,0.15)' }}>
                <Icon className="w-4 h-4 shrink-0 text-[#3AAFA9]" />
                <span className="text-sm text-white/75 tracking-wide">Pay once · Keep forever · Friends always join free</span>
              </div>

              {unlocked ? (
                <p className="text-center text-[#3AAFA9] font-bold tracking-wider text-sm py-3">Unlocked! Tap the button again to host.</p>
              ) : (
                <>
                  {/* Price */}
                  <div className="text-center mb-1 flex items-center justify-center gap-2">
                    <Coins className="w-6 h-6 text-[#D4AF37]" />
                    <span className="text-3xl font-black text-white">{FEATURE_PRICE}</span>
                    <span className="text-white/60 text-sm">Tempo · one-time</span>
                  </div>
                  {isAuthenticated && balance !== null && (
                    <p className="text-center text-white/60 text-xs mb-4">You have {balance} Tempo</p>
                  )}

                  {error && <p className="text-red-400 text-xs text-center mb-3">{error}</p>}

                  {isAuthenticated && balance !== null && !canAfford ? (
                    <>
                      <p className="text-center text-white/70 text-xs mb-3">
                        You need {FEATURE_PRICE - balance} more Tempo. Earn it from Daily Challenges.
                      </p>
                      <Button onClick={goEarn} variant="chess-primary"
                        className="w-full py-4 rounded-2xl font-black text-sm tracking-[0.2em] uppercase">
                        Earn Tempo
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={handleBuy}
                      disabled={loading}
                      variant="chess-primary"
                      className="w-full py-4 rounded-2xl font-black text-sm tracking-[0.2em] uppercase disabled:opacity-60"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" /> Unlocking…
                        </span>
                      ) : isAuthenticated ? `Unlock for ${FEATURE_PRICE} Tempo` : 'Sign In to Unlock'}
                    </Button>
                  )}

                  <p className="text-center text-white/50 text-[10px] tracking-wider mt-3">One-time purchase · Keep forever</p>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}