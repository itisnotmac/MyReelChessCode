import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Crown, Wifi, Users } from 'lucide-react';

export default function PremiumSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate('/'), 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center px-6">
      <motion.div
        className="text-center max-w-sm"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Crown icon */}
        <motion.div
          className="flex justify-center mb-6"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <div className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.25) 0%, rgba(212,175,55,0.05) 100%)', border: '1px solid rgba(212,175,55,0.4)' }}>
            <Crown className="w-10 h-10" style={{ color: '#D4AF37' }} />
          </div>
        </motion.div>

        <motion.h1
          className="text-3xl font-black tracking-wider mb-2"
          style={{ color: '#D4AF37' }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        >
          WELCOME TO PREMIUM
        </motion.h1>

        <motion.p
          className="text-white/50 text-sm tracking-wider mb-8"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        >
          Your subscription is active
        </motion.p>

        <motion.div
          className="space-y-3 mb-8"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        >
          {[
            { icon: Wifi, label: 'Online PVP — Unlocked' },
            { icon: Users, label: '2v2 Mode — Coming Soon' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/5">
              <Icon className="w-4 h-4" style={{ color: '#D4AF37' }} />
              <span className="text-sm font-semibold tracking-wider text-white/80">{label}</span>
            </div>
          ))}
        </motion.div>

        <motion.button
          onClick={() => navigate('/')}
          className="px-8 py-3 rounded-full font-bold text-sm tracking-[0.2em] uppercase text-[#0a0a0f]"
          style={{ background: 'linear-gradient(135deg, #D4AF37, #F0D060)' }}
          whileTap={{ scale: 0.96 }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
        >
          Start Playing
        </motion.button>

        <p className="text-white/20 text-xs mt-4 tracking-wider">Redirecting automatically in 5s…</p>
      </motion.div>
    </div>
  );
}