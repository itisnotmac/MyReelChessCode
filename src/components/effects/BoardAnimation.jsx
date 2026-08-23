import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

/** Animated background layer for animated board skins — renders behind the grid. */
export default function BoardAnimation({ animation }) {
  const { type, color } = animation || {};

  // Three depth layers: distant pinpricks, mid-field stars, hero stars
  const stars = useMemo(() => {
    if (type !== 'stars') return [];
    const pinpricks = Array.from({ length: 40 }, (_, i) => ({
      id: `p${i}`, left: Math.random() * 100, top: Math.random() * 100,
      size: 0.5 + Math.random(), delay: Math.random() * 4, duration: 2.5 + Math.random() * 3, glow: 1.5,
    }));
    const midStars = Array.from({ length: 16 }, (_, i) => ({
      id: `m${i}`, left: Math.random() * 100, top: Math.random() * 100,
      size: 1.5 + Math.random() * 2, delay: Math.random() * 3, duration: 2 + Math.random() * 2, glow: 4,
    }));
    const heroStars = Array.from({ length: 6 }, (_, i) => ({
      id: `h${i}`, left: Math.random() * 100, top: Math.random() * 100,
      size: 2.5 + Math.random() * 2, delay: Math.random() * 2, duration: 3 + Math.random() * 2, glow: 8,
    }));
    return [...pinpricks, ...midStars, ...heroStars];
  }, [type]);

  // Shooting stars that streak diagonally across the board
  const shootingStars = useMemo(() => {
    if (type !== 'stars') return [];
    return Array.from({ length: 3 }, (_, i) => ({
      id: `s${i}`, delay: i * 3.5 + Math.random() * 2, duration: 1.2 + Math.random(),
      top: Math.random() * 50, angle: 20 + Math.random() * 25,
    }));
  }, [type]);

  if (!animation) return null;

  if (type === 'stars') {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Deep-space nebula — slowly drifting purple/indigo vapor */}
        <motion.div className="absolute inset-0"
          style={{ background: `radial-gradient(ellipse at 20% 30%, ${color}30, transparent 50%), radial-gradient(ellipse at 75% 70%, #4B008230, transparent 55%), radial-gradient(ellipse at 50% 50%, ${color}15, transparent 70%)` }}
          animate={{ opacity: [0.4, 0.75, 0.4], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div className="absolute inset-0"
          style={{ background: `radial-gradient(ellipse at 70% 20%, ${color}20, transparent 45%), radial-gradient(ellipse at 25% 75%, #6A0DAD20, transparent 50%)` }}
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [1.1, 1, 1.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Star layers with depth-based glow */}
        {stars.map(s => (
          <motion.div key={s.id} className="absolute rounded-full"
            style={{ width: s.size, height: s.size, backgroundColor: '#fff',
              boxShadow: `0 0 ${s.glow}px ${color}, 0 0 ${s.glow * 2}px ${color}80`,
              left: `${s.left}%`, top: `${s.top}%` }}
            animate={{ opacity: [0.15, 1, 0.15], scale: [0.6, 1.4, 0.6] }}
            transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}

        {/* Shooting stars — streak across with a luminous tail */}
        {shootingStars.map(s => (
          <motion.div key={s.id} className="absolute"
            style={{ top: `${s.top}%`, width: 60, height: 2, borderRadius: '9999px',
              background: `linear-gradient(90deg, transparent, #fff, ${color}, transparent)`,
              boxShadow: `0 0 8px ${color}, 0 0 16px ${color}80` }}
            initial={{ left: '-15%', opacity: 0, rotate: s.angle }}
            animate={{ left: '115%', opacity: [0, 1, 1, 0] }}
            transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, repeatDelay: 4, ease: 'easeIn' }}
          />
        ))}
      </div>
    );
  }

  if (type === 'lava') {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute inset-0"
          style={{ background: `radial-gradient(circle at 30% 40%, ${color}80, transparent 45%), radial-gradient(circle at 70% 60%, ${color}60, transparent 50%)` }}
          animate={{ opacity: [0.5, 0.85, 0.5], scale: [1, 1.15, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute inset-0"
          style={{ background: `radial-gradient(circle at 60% 30%, ${color}50, transparent 40%)` }}
          animate={{ opacity: [0.4, 0.7, 0.4], scale: [1.1, 1, 1.1] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    );
  }

  if (type === 'waves') {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            className="absolute inset-x-0"
            style={{
              height: '50%',
              top: `${i * 25}%`,
              background: `linear-gradient(180deg, transparent, ${color}50, transparent)`,
              filter: 'blur(6px)',
            }}
            animate={{ x: ['-15%', '15%', '-15%'], opacity: [0.5, 0.85, 0.5] }}
            transition={{ duration: 6 + i * 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>
    );
  }

  if (type === 'pulse') {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(${color}80 1px, transparent 1px), linear-gradient(90deg, ${color}80 1px, transparent 1px)`,
            backgroundSize: '12.5% 12.5%',
          }}
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    );
  }

  return null;
}