import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Trophy, Handshake, RotateCcw, Home, Brain } from 'lucide-react';

export default function GameOverModal({ result, onRematch, onHome, onAnalysis, mode }) {
  const isCheckmate = result === 'white_wins' || result === 'black_wins';
  const winner = result === 'white_wins'
    ? (mode === '2v2' ? 'Team A' : 'White')
    : (mode === '2v2' ? 'Team B' : 'Black');

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <motion.div
        className="relative bg-gradient-to-b from-[#1a1a2e] to-[#16213e] rounded-2xl p-8 max-w-sm w-full border border-[#D4AF37]/20 shadow-2xl"
        initial={{ scale: 0.8, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #D4AF37, #F5E6A3)' }}
          >
            {isCheckmate ? (
              <Trophy className="w-8 h-8 text-[#1a1a2e]" />
            ) : (
              <Handshake className="w-8 h-8 text-[#1a1a2e]" />
            )}
          </motion.div>

          <motion.h2
            className="text-2xl font-bold text-white mb-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {isCheckmate ? 'Checkmate!' : 'Stalemate'}
          </motion.h2>

          <motion.p
            className="text-[#D4AF37] text-sm tracking-wider uppercase mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {isCheckmate ? `${winner} Wins` : "It's a Draw"}
          </motion.p>

          <div className="flex flex-col gap-3">
            <Button
              onClick={onRematch}
              className="w-full bg-[#D4AF37] hover:bg-[#C4A030] text-[#1a1a2e] font-bold tracking-wider"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              REMATCH
            </Button>
            <Button
              onClick={onAnalysis}
              variant="outline"
              className="w-full border-[#3AAFA9]/40 text-[#3AAFA9] hover:bg-[#3AAFA9]/10"
            >
              <Brain className="w-4 h-4 mr-2" />
              ANALYSIS
            </Button>
            <Button
              onClick={onHome}
              variant="outline"
              className="w-full border-white/20 text-white/70 hover:text-white hover:bg-white/10"
            >
              <Home className="w-4 h-4 mr-2" />
              LOBBY
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}