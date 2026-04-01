import React from 'react';
import { motion } from 'framer-motion';
import PieceRenderer from './PieceRenderer';

// White pieces arranged like a chess lineup: R N B Q K B N R
const pieces = ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'];

// Slight height offsets to give a natural grouping feel
const offsets = [6, 2, 4, -4, -8, 4, 2, 6];

export default function PieceGroupDisplay({ size = 'small', animate = true }) {
  return (
    <div className="flex items-end justify-center gap-1">
      {pieces.map((p, i) => (
        <motion.div
          key={i}
          style={{ marginBottom: offsets[i] }}
          initial={animate ? { opacity: 0, y: 20 } : {}}
          animate={animate ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.05 * i, duration: 0.5, type: 'spring', stiffness: 120, damping: 14 }}
        >
          <PieceRenderer piece={p} size={size} />
        </motion.div>
      ))}
    </div>
  );
}