import React from 'react';
import { motion } from 'framer-motion';
import PieceRenderer from './PieceRenderer';

export default function TurnIndicator({ isWhiteTurn, isCheck, mode, isThinking, playerName, teamLabel }) {
  return (
    <div className="flex items-center justify-between px-1">
      <div className="flex items-center gap-3">
        <motion.div
          className="w-8 h-8 rounded-full flex items-center justify-center border"
          style={{
            borderColor: isWhiteTurn ? '#D4AF37' : '#9B59B6',
            background: isWhiteTurn ? 'rgba(212,175,55,0.1)' : 'rgba(155,89,182,0.1)',
          }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div
            className="w-4 h-4 rounded-full"
            style={{ background: isWhiteTurn ? '#E8D5B5' : '#2a2a3e' }}
          />
        </motion.div>
        <div>
          <p className="text-white text-xs font-bold tracking-wider">
            {mode === '2v2' ? playerName : (isWhiteTurn ? 'WHITE' : 'BLACK')}
            {isThinking && <span className="text-[#D4AF37] ml-1 font-normal">thinking...</span>}
          </p>
          <p className="text-white/30 text-[10px] tracking-wider">
            {isCheck ? '⚠ IN CHECK'
              : mode === '2v2' ? `${teamLabel} · ${isWhiteTurn ? 'White' : 'Black'}'s turn`
              : mode === 'ai' ? (isWhiteTurn ? 'Your Turn' : 'AI Turn')
              : mode === 'online' ? (isThinking ? "Opponent's Turn" : 'Your Turn')
              : 'Make your move'}
          </p>
        </div>
      </div>
    </div>
  );
}