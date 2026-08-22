import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

/** Animated background layer for animated board skins — renders behind the grid. */
export default function BoardAnimation({ animation }) {
  const { type, color } = animation || {};

  const stars = useMemo(() => {
    if (type !== 'stars') return [];
    return Array.from({ length: 24 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 1 + Math.random() * 2.5,
      delay: Math.random() * 3,
      duration: 2 + Math.random() * 2.5,
    }));
  }, [type]);

  if (!animation) return null;

  if (type === 'stars') {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {stars.map(s => (
          <motion.div
            key={s.id}
            className="absolute rounded-full"
            style={{
              width: s.size, height: s.size,
              backgroundColor: '#fff',
              boxShadow: `0 0 ${s.size * 2}px ${color}`,
              left: `${s.left}%`, top: `${s.top}%`,
            }}
            animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.3, 0.8] }}
            transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
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
          style={{ background: `radial-gradient(circle at 30% 40%, ${color}50, transparent 45%), radial-gradient(circle at 70% 60%, ${color}30, transparent 50%)` }}
          animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.15, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute inset-0"
          style={{ background: `radial-gradient(circle at 60% 30%, ${color}25, transparent 40%)` }}
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [1.1, 1, 1.1] }}
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
              background: `linear-gradient(180deg, transparent, ${color}25, transparent)`,
              filter: 'blur(6px)',
            }}
            animate={{ x: ['-15%', '15%', '-15%'], opacity: [0.4, 0.7, 0.4] }}
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
            backgroundImage: `linear-gradient(${color}50 1px, transparent 1px), linear-gradient(90deg, ${color}50 1px, transparent 1px)`,
            backgroundSize: '12.5% 12.5%',
          }}
          animate={{ opacity: [0.15, 0.45, 0.15] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    );
  }

  return null;
}