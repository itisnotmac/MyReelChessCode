import React from 'react';
import { motion } from 'framer-motion';

/** Animated store-preview for effect-based cosmetics. */
export default function EffectPreview({ item, variant }) {
  const { color, style } = item;

  if (variant === 'particle') {
    return (
      <div className="relative w-16 h-16 flex items-center justify-center overflow-hidden rounded-lg bg-black/40">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}`, left: `${15 + i * 18}%`, top: '50%' }}
            animate={{ y: [0, -12, 0], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5 + i * 0.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'border') {
    return (
      <div className="w-16 h-16 rounded-md overflow-hidden" style={{
        border: `3px solid ${color}`,
        boxShadow: style === 'glow' ? `0 0 12px ${color}80, inset 0 0 8px ${color}40` : 'none',
      }}>
        <div className="w-full h-full grid grid-cols-2 grid-rows-2">
          {[0, 1, 2, 3].map(i => (
            <div key={i} style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.3)' }} />
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'frame') {
    return (
      <div className="relative w-16 h-16 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full" style={{
          border: `3px solid ${color}`,
          boxShadow: `0 0 12px ${color}80, inset 0 0 8px ${color}40`,
        }} />
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center">
          <span className="text-white/30 text-lg font-bold">♔</span>
        </div>
      </div>
    );
  }

  if (variant === 'ambient') {
    return (
      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-black/40">
        <motion.div
          className="absolute inset-0"
          style={{ background: `radial-gradient(circle at 50% 50%, ${color}50, transparent 70%)` }}
          animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.15, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{ backgroundColor: color, left: `${20 + i * 20}%` }}
            animate={{ y: [0, 24, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 2 + i * 0.3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}
          />
        ))}
      </div>
    );
  }

  return null;
}