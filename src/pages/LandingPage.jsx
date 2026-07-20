import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useSeo } from '@/lib/useSeo';
import LandingHero from '@/components/landing/LandingHero';
import LandingFeatures from '@/components/landing/LandingFeatures';
import LandingModes from '@/components/landing/LandingModes';
import LandingFAQ from '@/components/landing/LandingFAQ';

export default function LandingPage() {
  useSeo(
    'Reel Chess – Play Free Online Chess with Cinematic Battle Cutscenes',
    'Play Reel Chess free online — an immersive chess game with cinematic battle cutscenes, AI opponents from Novice to Grandmaster, local PvP multiplayer, 2v2 mode, and interactive chess tutorials.'
  );
  const handlePlayNow = () => {
    base44.auth.redirectToLogin('/');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <LandingHero />
      <LandingFeatures />
      <LandingModes />
      <LandingFAQ />

      {/* Final CTA */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="py-20 px-6 text-center"
      >
        <div className="max-w-2xl mx-auto">
          <h2
            className="text-3xl sm:text-4xl font-black tracking-wide mb-4"
            style={{
              backgroundImage: 'linear-gradient(135deg, #3AAFA9 0%, #A8E6E3 60%, #3AAFA9 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Ready to Make Your First Move?
          </h2>
          <p className="text-white/60 mb-8">
            Create a free account and start playing Reel Chess today.
          </p>
          <button
            onClick={handlePlayNow}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[#3AAFA9] to-[#A8E6E3] text-[#0a0a0f] font-bold text-sm tracking-wider uppercase hover:scale-105 transition-transform shadow-lg shadow-[#3AAFA9]/30"
          >
            <Play className="w-5 h-5" /> Play Now — Free
          </button>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="border-t border-[#3AAFA9]/10 py-10 px-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[#3AAFA9]/60 text-xs tracking-[0.3em] uppercase">Reel Chess</p>
          <nav className="flex gap-6">
            <Link
              to="/About"
              className="text-xs text-white/40 hover:text-[#3AAFA9] transition-colors"
            >
              About
            </Link>
            <Link
              to="/Tutorial"
              className="text-xs text-white/40 hover:text-[#3AAFA9] transition-colors"
            >
              Tutorial
            </Link>
            <Link
              to="/Contact"
              className="text-xs text-white/40 hover:text-[#3AAFA9] transition-colors"
            >
              Contact
            </Link>
            <Link
              to="/privacy-policy"
              className="text-xs text-white/40 hover:text-[#3AAFA9] transition-colors"
            >
              Privacy
            </Link>
            <Link
              to="/terms-of-service"
              className="text-xs text-white/40 hover:text-[#3AAFA9] transition-colors"
            >
              Terms
            </Link>
          </nav>
        </div>
        <p className="text-center text-white/20 text-xs mt-6">
          © 2026 Reel Chess. All rights reserved.
        </p>
      </footer>
    </div>
  );
}