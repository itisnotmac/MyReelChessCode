import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Trophy } from 'lucide-react';

export default function Tournament() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-y-auto">
      {/* Cinematic backdrop — gothic cathedral (preserved) */}
      <div className="absolute inset-0 z-0">
        <img src="https://media.base44.com/images/public/69ab30c24c8c7db2b8432adf/bac81919d_generated_image.png" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(120% 80% at 50% 12%, rgba(10,10,15,0.18) 0%, rgba(10,10,15,0.5) 60%, rgba(10,10,15,0.82) 100%)' }} />
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center gap-3 px-5 pb-6" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 24px)' }}>
        <button onClick={() => navigate(createPageUrl('Lobby'))}
          className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-[#D4AF37]" />
          <h1 className="text-lg font-bold tracking-wider text-white">Tournaments</h1>
        </div>
      </div>

      {/* Coming Soon placeholder */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6" style={{ minHeight: '60vh' }}>
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
            style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 70%)', border: '1px solid rgba(212,175,55,0.25)' }}>
            <Trophy className="w-9 h-9 text-[#D4AF37]/70" />
          </div>
          <h2 className="text-2xl font-black tracking-[0.15em] uppercase text-white mb-3"
            style={{ fontFamily: "'Old Standard TT', serif" }}>
            Coming Soon
          </h2>
          <p className="text-white/40 text-sm tracking-wider max-w-xs mx-auto">
            Competitive tournaments are on the way. Stay tuned.
          </p>
        </motion.div>
      </div>
    </div>
  );
}