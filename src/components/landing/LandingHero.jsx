import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play, GraduationCap, ChevronDown } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const HERO_IMAGE = 'https://media.base44.com/images/public/69ab30c24c8c7db2b8432adf/100ea7145_generated_image.png';

export default function LandingHero() {
  const handlePlayNow = () => {
    base44.auth.redirectToLogin('/');
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={HERO_IMAGE}
          alt="Reel Chess – immersive chess game with cinematic battle cutscenes"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/80 via-[#0a0a0f]/85 to-[#0a0a0f]" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-xs tracking-[0.4em] uppercase text-[#3AAFA9]/60 mb-4">
            Free to Play · Browser Chess Game
          </p>
          <h1
            className="text-5xl sm:text-7xl font-black tracking-[0.15em] mb-4"
            style={{
              backgroundImage: 'linear-gradient(135deg, #3AAFA9 0%, #A8E6E3 50%, #3AAFA9 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 24px rgba(58,175,169,0.3))',
            }}
          >
            REEL CHESS
          </h1>
          <p className="text-lg text-white/80 mb-3">Every Piece Has A Story</p>
          <p className="text-sm text-white/50 max-w-xl mx-auto mb-8 leading-relaxed">
            An immersive chess experience with cinematic battle cutscenes, AI opponents from
            Novice to Grandmaster, local and online multiplayer, and interactive tutorials.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handlePlayNow}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[#3AAFA9] to-[#A8E6E3] text-[#0a0a0f] font-bold text-sm tracking-wider uppercase hover:brightness-110 transition-all shadow-lg shadow-[#3AAFA9]/30"
            >
              <Play className="w-5 h-5" /> Play Now — Free
            </button>
            <Link
              to="/Tutorial"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-[#3AAFA9]/30 text-[#3AAFA9] font-bold text-sm tracking-wider uppercase hover:bg-[#3AAFA9]/10 transition-colors"
            >
              <GraduationCap className="w-5 h-5" /> Learn Chess
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <ChevronDown className="w-6 h-6 text-[#3AAFA9]/40" />
      </motion.div>
    </section>
  );
}