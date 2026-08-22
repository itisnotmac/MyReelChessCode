import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Wifi, Users, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';

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

export default function FeatureUnlockModal({ isOpen, onClose, featureId, isAuthenticated }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const feature = FEATURES[featureId];
  const Icon = feature?.icon || Lock;

  const handleBuy = async () => {
    // Block checkout inside iframe (builder preview)
    if (window.self !== window.top) {
      alert('Checkout is only available from the published app.');
      return;
    }
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await base44.functions.invoke('createFeatureCheckout', { feature_id: featureId });
      const body = response?.data || response;
      if (body?.url) {
        window.location.href = body.url;
      } else {
        setError(body?.error || 'Could not start checkout. Please try again.');
      }
    } catch (err) {
      setError(err?.response?.data?.error || err?.data?.error || err?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && feature && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60]"
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
                <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Lock icon */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ background: 'radial-gradient(circle, rgba(58,175,169,0.2) 0%, transparent 70%)', border: '1px solid rgba(58,175,169,0.3)' }}>
                  <Lock className="w-7 h-7 text-[#3AAFA9]" />
                </div>
              </div>

              <h2 className="text-center text-xl font-black tracking-wider text-white mb-1">{feature.title}</h2>
              <p className="text-center text-white/40 text-xs tracking-wider mb-6">{feature.benefit}</p>

              {/* Benefit card */}
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl mb-6"
                style={{ background: 'rgba(58,175,169,0.06)', border: '1px solid rgba(58,175,169,0.15)' }}>
                <Icon className="w-4 h-4 shrink-0 text-[#3AAFA9]" />
                <span className="text-sm text-white/75 tracking-wide">Pay once · Keep forever · Friends always join free</span>
              </div>

              {/* Price + CTA */}
              <div className="text-center mb-4">
                <span className="text-3xl font-black text-white">$1.99</span>
                <span className="text-white/40 text-sm ml-1">one-time</span>
              </div>

              {error && <p className="text-red-400 text-xs text-center mb-3">{error}</p>}

              <Button
                onClick={handleBuy}
                disabled={loading}
                variant="chess-primary"
                className="w-full py-4 rounded-2xl font-black text-sm tracking-[0.2em] uppercase disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Loading…
                  </span>
                ) : isAuthenticated ? 'Unlock Now' : 'Sign In to Unlock'}
              </Button>

              <p className="text-center text-white/20 text-[10px] tracking-wider mt-3">One-time payment · No subscription</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}