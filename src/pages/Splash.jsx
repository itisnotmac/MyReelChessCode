import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import PieceGroupDisplay from '../components/chess/PieceGroupDisplay';

export default function Splash() {
  const navigate = useNavigate();
  const navigateRef = useRef(navigate);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 500);
    const t2 = setTimeout(() => setPhase(2), 1500);
    const t3 = setTimeout(() => setPhase(3), 2800);
    const t4 = setTimeout(() => navigateRef.current(createPageUrl('Lobby')), 3600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center overflow-hidden relative">
      {/* Ambient glow */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(58,175,169,0.08) 0%, transparent 70%)',
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
          <div className="relative">
            <div style={{ filter: 'drop-shadow(0 0 20px rgba(212,175,55,0.25))' }}>
              <PieceGroupDisplay size="normal" animate={phase >= 1} />
            </div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-4xl sm:text-5xl font-black tracking-[0.22em]"
          style={{
            backgroundImage: 'linear-gradient(135deg, #3AAFA9 0%, #A8E6E3 50%, #3AAFA9 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 0 18px rgba(58,175,169,0.35))',
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          REEL CHESS
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-xs tracking-[0.4em] uppercase mt-4 text-[#3AAFA9]/40"
          initial={{ opacity: 0 }}
          animate={phase >= 2 ? { opacity: 1 } : {}}
          transition={{ duration: 1 }}
        >
          Every Piece Has A Story
        </motion.p>

        {/* Loading bar */}
        <motion.div
          className="mt-10 mx-auto h-[2px] bg-[#3AAFA9]/10 rounded-full overflow-hidden"
          style={{ width: '200px' }}
          initial={{ opacity: 0 }}
          animate={phase >= 2 ? { opacity: 1 } : {}}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #3AAFA9, #A8E6E3)' }}
            initial={{ width: '0%' }}
            animate={phase >= 2 ? { width: '100%' } : {}}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </div>
  );
}