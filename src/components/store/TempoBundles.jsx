import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Coins, Loader2, Zap } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { useToast } from "@/components/ui/use-toast";

// Mirror of TEMPO_CATALOG in createTempoCheckout. The backend is the source of
// truth for pricing; this is display-only.
const BUNDLES = [
  { id: 'tempo_200',  tempo: 200,  price: '$2.00', bonus: 0 },
  { id: 'tempo_500',  tempo: 500,  price: '$5.00', bonus: 0 },
  { id: 'tempo_1100', tempo: 1100, price: '$10.00', bonus: 100 },
  { id: 'tempo_2200', tempo: 2200, price: '$20.00', bonus: 200 },
];

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
      if (res?.url) {
        window.location.href = res.url;
      }
    } catch (e) {
      console.error('Tempo checkout error:', e);
      toast({ title: 'Checkout failed', description: 'Please try again.' });
    }
    setPurchasing(null);
  };

  return (
    <div>
      <h2 className="text-sm font-bold tracking-wider text-[#D4AF37]/70 mb-3 flex items-center gap-2">
        <span className="w-1 h-4 rounded-full bg-[#D4AF37]/50" />
        BUY TEMPO
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {BUNDLES.map((bundle, i) => (
          <motion.button
            key={bundle.id}
            onClick={() => handleBuy(bundle)}
            disabled={purchasing === bundle.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="relative rounded-xl p-4 border border-[#D4AF37]/30 bg-gradient-to-b from-[#D4AF37]/10 to-black/40 hover:from-[#D4AF37]/15 hover:border-[#D4AF37]/50 transition-all flex flex-col items-center justify-center gap-1.5 min-h-[150px] disabled:opacity-60"
          >
            {bundle.bonus > 0 && (
              <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-[#3AAFA9]/20 border border-[#3AAFA9]/40 text-[9px] font-bold text-[#3AAFA9] tracking-wider">
                +{bundle.bonus} BONUS
              </span>
            )}
            <div className="relative">
              <Coins className="w-8 h-8 text-[#D4AF37]" />
              {bundle.bonus > 0 && (
                <Zap className="w-4 h-4 text-[#3AAFA9] absolute -top-1 -right-1" />
              )}
            </div>
            <p className="text-xl font-bold text-white tabular-nums">{bundle.tempo.toLocaleString()}</p>
            <p className="text-[10px] text-white/50 tracking-wider uppercase">Tempo</p>
            <div className="mt-1 px-3 py-1.5 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-bold tracking-wider flex items-center justify-center min-w-[72px]">
              {purchasing === bundle.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : bundle.price}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}