import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useSkin } from '@/lib/skinContext';
import { AMBIENT_EFFECTS } from '@/lib/storeCatalog';

/** Full-screen animated ambient effect layer — renders behind game content. */
export default function AmbientOverlay() {
  const { ambientEffect } = useSkin();
  const effect = AMBIENT_EFFECTS.find(e => e.id === ambientEffect);
  const style = effect?.style;

  const particles = useMemo(() => {
    if (!style) return [];
    const count = style === 'rain' ? 25 : style === 'snow' ? 20 : 15;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4,
      size: 2 + Math.random() * 3,
    }));
  }, [style]);

  if (!effect) return null;
  const { color } = effect;

  const isFalling = style === 'snow' || style === 'rain';
  const isVertical = style === 'rain';

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* Base ambient glow */}
      <motion.div
        className="absolute inset-0"
        style={{ background: `radial-gradient(circle at 50% 30%, ${color}12, transparent 60%)` }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Aurora wave */}
      {style === 'aurora' && (
        <motion.div
          className="absolute inset-x-0 top-0 h-1/2"
          style={{ background: `linear-gradient(180deg, ${color}25, transparent)`, filter: 'blur(40px)' }}
          animate={{ opacity: [0.3, 0.6, 0.3], x: [-20, 20, -20] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Particles */}
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{
            width: p.size,
            height: isVertical ? p.size * 4 : p.size,
            backgroundColor: color,
            boxShadow: `0 0 ${p.size * 2}px ${color}`,
            left: `${p.left}%`,
            borderRadius: isVertical ? '2px' : '50%',
          }}
          initial={{ y: isFalling ? -30 : '100vh', opacity: 0 }}
          animate={{
            y: isFalling ? '100vh' : -100,
            opacity: [0, 1, 1, 0],
            x: style === 'fireflies' || style === 'embers' ? [0, 20, -10, 0] : 0,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: isVertical ? 'linear' : 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}