import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';

export default function PageNotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-6">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="text-6xl mb-4 inline-block opacity-30">♚</span>
        <h1 className="text-2xl font-bold tracking-wider text-white mb-2">Page Not Found</h1>
        <p className="text-white/30 text-sm mb-8">This square is empty.</p>
        <button
          onClick={() => navigate(createPageUrl('Lobby'))}
          className="px-6 py-3 rounded-xl bg-[#D4AF37] text-[#0a0a0f] text-xs font-bold tracking-wider hover:bg-[#C4A030] transition-colors"
        >
          BACK TO LOBBY
        </button>
      </motion.div>
    </div>
  );
}