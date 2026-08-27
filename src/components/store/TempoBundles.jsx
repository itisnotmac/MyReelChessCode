import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Coins, Loader2, Zap } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { useToast } from "@/components/ui/use-toast";

// Mirror of TEMPO_CATALOG in createTempoCheckout. The backend is the source of
// truth for pricing; this is display-only.
const BUNDLES = [
  { id: 'tempo_200',  tempo: 200,  price: '$2.00',  bonus: 0 },
  { id: 'tempo_500',  tempo: 500,  price: '$5.00',  bonus: 0 },
  { id: 'tempo_1100', tempo: 1100, price: '$10.00', bonus: 100 },
  { id: 'tempo_2200', tempo: 2200, price: '$20.00', bonus: 200 },
];

// Pointy-top hexagon — bold, geometric, reads as "premium pack"
const HEX_CLIP = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)';

export default function TempoBundles() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [purchasing, setPurchasing] = useState(null);

  const handleBuy = async (bundle) => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    if (window.self !== window.top) {
      toast({ title: 'Checkout unavailable', description: 'Please open the app directly to purchase.' });
      return;
    }
    setPurchasing(bundle.id);
    try {
      const res = await base44.functions.invoke('createTempoCheckout', {
        bundle_id: bundle.id,
      });
     if (res?.data?.url) {
  window.location.href = res.data.url;
}
    } catch (e) {
      console.error('Tempo checkout error:', e);
      toast({ title: 'Checkout failed', description: 'Please try again.' });
    }
    setPurchasing(null);
  };

  return (
    <div>
      <h2 className="text-sm font-bold tracking-wider text-[#3AAFA9]/70 mb-4 flex items-center gap-2">
        <span className="w-1 h-4 rounded-full bg-[#3AAFA9]/50" />
        BUY TEMPO
      </h2>
      <div className="grid grid-cols-2 gap-2">
        {BUNDLES.map((bundle, i) => (
          <motion.div
            key={bundle.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="relative"
          >
            {bundle.bonus > 0 && (
              <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 z-10 px-2 py-0.5 rounded-full bg-[#3AAFA9]/20 border border-[#3AAFA9]/40 text-[9px] font-bold text-[#3AAFA9] tracking-wider whitespace-nowrap">
                +{bundle.bonus} BONUS
              </span>
            )}
            <button
              onClick={() => handleBuy(bundle)}
              disabled={purchasing === bundle.id}
              style={{
                clipPath: HEX_CLIP,
                filter: 'drop-shadow(0 0 8px rgba(58,175,169,0.3))',
              }}
              className="w-full aspect-[1/1.15] bg-white/5 backdrop-blur-md hover:bg-white/10 transition-colors flex flex-col items-center justify-center gap-0.5 disabled:opacity-60"
            >
              <div className="relative">
                <Coins className="w-7 h-7 text-[#3AAFA9]" />
                {bundle.bonus > 0 && (
                  <Zap className="w-3.5 h-3.5 text-[#3AAFA9] absolute -top-1 -right-1" />
                )}
              </div>
              <p className="text-lg font-bold text-white tabular-nums">{bundle.tempo.toLocaleString()}</p>
              <p className="text-[9px] text-white/50 tracking-wider uppercase">Tempo</p>
              <div className="mt-0.5 text-xs font-bold text-white/80 tracking-wider">
                {purchasing === bundle.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : bundle.price}
              </div>
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
