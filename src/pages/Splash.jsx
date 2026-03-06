import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function Splash() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 500);
    const t2 = setTimeout(() => setPhase(2), 1500);
    const t3 = setTimeout(() => setPhase(3), 2800);
    const t4 = setTimeout(() => navigate(createPageUrl('Lobby')), 3600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center overflow-hidden relative">
      {/* Ambient glow */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)',
        }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      <div className="relative text-center z-10">
        {/* Chess piece crown icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={phase >= 1 ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{ type: "spring", stiffness: 150, damping: 15 }}
          className="mb-6"
        >
          <div className="relative inline-block">
            <span className="text-8xl" style={{
              filter: 'drop-shadow(0 0 30px rgba(212,175,55,0.4))',
              color: '#D4AF37'
            }}>
              ♚
            </span>
            {/* Gold ring */}
            <motion.div
              className="absolute inset-0 rounded-full border border-[#D4AF37]/20"
              style={{ margin: '-20px' }}
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-4xl sm:text-5xl font-black tracking-[0.15em] mb-2"
          style={{
            backgroundImage: 'linear-gradient(135deg, #D4AF37 0%, #F5E6A3 40%, #D4AF37 60%, #8B6914 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          BATTLE
        </motion.h1>
        <motion.h1
          className="text-4xl sm:text-5xl font-black tracking-[0.15em]"
          style={{
            backgroundImage: 'linear-gradient(135deg, #D4AF37 0%, #F5E6A3 40%, #D4AF37 60%, #8B6914 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          CHESS
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-xs tracking-[0.4em] uppercase mt-4 text-[#D4AF37]/40"
          initial={{ opacity: 0 }}
          animate={phase >= 2 ? { opacity: 1 } : {}}
          transition={{ duration: 1 }}
        >
          Every Piece Has A Story
        </motion.p>

        {/* Loading bar */}
        <motion.div
          className="mt-10 mx-auto h-[2px] bg-[#D4AF37]/10 rounded-full overflow-hidden"
          style={{ width: '200px' }}
          initial={{ opacity: 0 }}
          animate={phase >= 2 ? { opacity: 1 } : {}}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #D4AF37, #F5E6A3)' }}
            initial={{ width: '0%' }}
            animate={phase >= 2 ? { width: '100%' } : {}}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </div>
  );
}