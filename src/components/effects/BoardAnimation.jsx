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

  // Rising embers for the lava skin
  const embers = useMemo(() => {
    if (type !== 'lava') return [];
    return Array.from({ length: 20 }, (_, i) => ({
      id: `e${i}`, left: Math.random() * 100,
      size: 1.5 + Math.random() * 3,
      delay: Math.random() * 5, duration: 3 + Math.random() * 3,
      drift: (Math.random() - 0.5) * 40,
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
        {/* Deep magma base — dark molten rock that slowly breathes */}
        <motion.div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 50% 100%, #2a0a00, #0a0200 60%)' }}
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Flowing lava streams — bright blobs that drift and morph */}
        <motion.div className="absolute inset-0"
          style={{ background: `radial-gradient(circle at 25% 65%, ${color}, transparent 42%), radial-gradient(circle at 75% 45%, ${color}, transparent 42%)` }}
          animate={{ opacity: [0.75, 1, 0.75], scale: [1, 1.2, 1], x: ['-5%', '5%', '-5%'] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div className="absolute inset-0"
          style={{ background: `radial-gradient(circle at 50% 75%, ${color}, transparent 38%), radial-gradient(circle at 20% 35%, ${color}, transparent 38%)` }}
          animate={{ opacity: [0.65, 0.95, 0.65], scale: [1.15, 1, 1.15], x: ['5%', '-5%', '5%'] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div className="absolute inset-0"
          style={{ background: `radial-gradient(circle at 85% 80%, ${color}, transparent 32%)` }}
          animate={{ opacity: [0.55, 0.9, 0.55], scale: [1, 1.3, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Rising embers — glowing particles that float upward and flicker out */}
        {embers.map(e => (
          <motion.div key={e.id} className="absolute rounded-full"
            style={{ width: e.size, height: e.size, bottom: '-5%',
              backgroundColor: '#ff9500',
              boxShadow: `0 0 ${e.size * 3}px ${color}, 0 0 ${e.size * 6}px ${color}`,
              left: `${e.left}%` }}
            initial={{ opacity: 0, x: 0 }}
            animate={{ bottom: '108%', opacity: [0, 1, 1, 0], x: e.drift, scale: [0.5, 1.5, 0.3] }}
            transition={{ duration: e.duration, delay: e.delay, repeat: Infinity, ease: 'easeOut' }}
          />
        ))}

        {/* Surface heat haze — shimmering glow along the top edge */}
        <motion.div className="absolute inset-x-0 top-0 h-1/3"
          style={{ background: `linear-gradient(180deg, ${color}60, transparent)`, filter: 'blur(4px)' }}
          animate={{ opacity: [0.35, 0.7, 0.35] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
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