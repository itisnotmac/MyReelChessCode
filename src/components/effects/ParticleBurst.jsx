import React from 'react';
import { motion } from 'framer-motion';

/** Radial particle burst at a board position — triggered on captures. */
export default function ParticleBurst({ burst }) {
  if (!burst) return null;

  const { x, y, color, key } = burst;
  const particles = Array.from({ length: 10 }, (_, i) => ({
    angle: (i / 10) * Math.PI * 2,
    distance: 25 + Math.random() * 15,
    delay: Math.random() * 0.1,
  }));

  return (
    <div key={key} className="absolute pointer-events-none z-30" style={{ left: x, top: y }}>
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{ width: 4, height: 4, backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: Math.cos(p.angle) * p.distance,
            y: Math.sin(p.angle) * p.distance,
            opacity: 0,
            scale: 0.3,
          }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: p.delay }}
        />
      ))}
    </div>
  );
}