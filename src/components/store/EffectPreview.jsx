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
    const isFalling = style === 'snow' || style === 'rain';
    const isVertical = style === 'rain';
    const isRising = style === 'embers';

    const count = style === 'rain' ? 14 : style === 'snow' ? 12 : 8;
    const dots = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: 5 + Math.random() * 90,
      delay: Math.random() * 3,
      duration: 1.8 + Math.random() * 1.8,
      size: 2.5 + Math.random() * 2.5,
    }));

    return (
      <div className="relative w-full rounded-lg overflow-hidden bg-black/60 border border-white/10" style={{ height: 90 }}>
        {/* Base glow */}
        <motion.div
          className="absolute inset-0"
          style={{ background: `radial-gradient(circle at 50% 40%, ${color}35, transparent 75%)` }}
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Aurora wave */}
        {style === 'aurora' && (
          <>
            <motion.div
              className="absolute inset-x-[-20%] top-0 h-full"
              style={{ background: `linear-gradient(120deg, transparent 20%, ${color}80 45%, ${color}40 60%, transparent 80%)`, filter: 'blur(10px)' }}
              animate={{ opacity: [0.5, 0.9, 0.5], x: [-30, 30, -30] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute inset-x-[-20%] top-0 h-full"
              style={{ background: `linear-gradient(60deg, transparent 30%, ${color}50 50%, transparent 70%)`, filter: 'blur(6px)' }}
              animate={{ opacity: [0.3, 0.6, 0.3], x: [20, -20, 20] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
            {dots.map(p => (
              <motion.div
                key={p.id}
                className="absolute rounded-full"
                style={{ width: p.size, height: p.size, backgroundColor: color, boxShadow: `0 0 ${p.size * 3}px ${color}`, left: `${p.left}%`, top: `${10 + Math.random() * 80}%` }}
                animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }}
                transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
              />
            ))}
          </>
        )}

        {/* Stardust twinkle */}
        {style === 'stardust' && dots.map(p => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{ width: p.size, height: p.size, backgroundColor: color, boxShadow: `0 0 ${p.size * 3}px ${color}`, left: `${p.left}%`, top: `${10 + Math.random() * 80}%` }}
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }}
            transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}

        {/* Falling (rain/snow) */}
        {isFalling && dots.map(p => (
          <motion.div
            key={p.id}
            className="absolute"
            style={{
              width: p.size,
              height: isVertical ? p.size * 4 : p.size,
              backgroundColor: color,
              boxShadow: `0 0 ${p.size * 1.5}px ${color}`,
              left: `${p.left}%`,
              borderRadius: isVertical ? '1px' : '50%',
            }}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 95, opacity: [0, 1, 1, 0] }}
            transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: isVertical ? 'linear' : 'easeIn' }}
          />
        ))}

        {/* Rising embers */}
        {isRising && dots.map(p => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{ width: p.size, height: p.size, backgroundColor: color, boxShadow: `0 0 ${p.size * 3}px ${color}`, left: `${p.left}%`, bottom: 0 }}
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: -90, opacity: [0, 1, 1, 0], x: [0, 8, -4, 0] }}
            transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeOut' }}
          />
        ))}

        {/* Drifting fireflies */}
        {style === 'fireflies' && dots.map(p => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{ width: p.size, height: p.size, backgroundColor: color, boxShadow: `0 0 ${p.size * 4}px ${color}`, left: `${p.left}%`, top: `${15 + Math.random() * 70}%` }}
            animate={{ x: [0, 14, -7, 0], y: [0, -8, 6, 0], opacity: [0.2, 1, 0.4, 1, 0.2] }}
            transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>
    );
  }

  return null;
}