import React from 'react';
import { getStreakTier } from '@/lib/streakTiers';

const SHIELD_PATH = "M28 5 L49 11 V31 C49 43 40.5 51 28 57 C15.5 51 7 43 7 31 V11 Z";

const METALS = {
  copper: {
    gradId: 'streakCopper',
    c1: '#E8A663', c2: '#B87333', c3: '#7A4A1F',
    border: '#5A3515', text: '#FFF8E7',
  },
  silver: {
    gradId: 'streakSilver',
    c1: '#F5F5F5', c2: '#C0C0C0', c3: '#8A8A8A',
    border: '#5A5A5A', text: '#2a2a3e',
  },
  gold: {
    gradId: 'streakGold',
    c1: '#FFE066', c2: '#D4AF37', c3: '#9A7810',
    border: '#6A5210', text: '#3a2a00',
  },
  diamond: {
    gradId: 'streakDiamond',
    c1: '#F0FFFF', c2: '#B9F2FF', c3: '#6FC4E8',
    border: '#3A8AB0', text: '#0a3a4a',
  },
};

// Precomputed 5-pointed star path (radius 1, centered at origin)
const UNIT_STAR = (() => {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    const r = i % 2 === 0 ? 1 : 0.42;
    pts.push(`${Math.cos(angle) * r},${Math.sin(angle) * r}`);
  }
  return 'M' + pts.join(' L') + ' Z';
})();

export default function StreakBadge({ streak, size = 'md', showNumber = true }) {
  const tier = getStreakTier(streak);
  const dims = { xs: 24, sm: 36, md: 52, lg: 120 };
  const px = typeof size === 'number' ? size : (dims[size] || 52);
  const showText = showNumber && px >= 36;
  const fontSize = streak >= 100 ? 14 : (streak >= 10 ? 16 : 18);

  // Days 1-6: simple teal circle with number
  if (!tier.hasShield) {
    const h = px * (40 / 56);
    return (
      <svg width={px} height={h} viewBox="0 0 56 40">
        <circle cx="28" cy="20" r="16" fill="rgba(58,175,169,0.12)" stroke="rgba(58,175,169,0.35)" strokeWidth="1.5" />
        {showText && (
          <text x="28" y="25" textAnchor="middle" fontSize={fontSize} fontWeight="900" fill="#3AAFA9" fontFamily="system-ui, sans-serif">
            {streak}
          </text>
        )}
      </svg>
    );
  }

  const metal = METALS[tier.metal];
  const h = px * (68 / 56);

  // Star positions (above shield)
  const starR = 3.8;
  const starSpacing = 10;
  const stars = [];
  for (let i = 0; i < tier.stars; i++) {
    const x = 28 - ((tier.stars - 1) * starSpacing) / 2 + i * starSpacing;
    stars.push({ x, y: 3.5 });
  }

  // Ribbon positions (below shield)
  const ribbonW = 7;
  const ribbonH = 11;
  const ribbonSpacing = 9;
  const ribbons = [];
  for (let i = 0; i < tier.ribbons; i++) {
    const x = 28 - ((tier.ribbons - 1) * ribbonSpacing) / 2 + i * ribbonSpacing;
    ribbons.push({ x, y: 55 });
  }

  return (
    <svg width={px} height={h} viewBox="0 0 56 68">
      <defs>
        <linearGradient id={metal.gradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={metal.c1} />
          <stop offset="50%" stopColor={metal.c2} />
          <stop offset="100%" stopColor={metal.c3} />
        </linearGradient>
      </defs>

      {/* Stars */}
      {stars.map((s, i) => (
        <path
          key={`star-${i}`}
          d={UNIT_STAR}
          fill={metal.c1}
          stroke={metal.border}
          strokeWidth="0.4"
          transform={`translate(${s.x} ${s.y}) scale(${starR})`}
        />
      ))}

      {/* Shield */}
      <path d={SHIELD_PATH} fill={`url(#${metal.gradId})`} stroke={metal.border} strokeWidth="1.5" />

      {/* Inner highlight band for depth */}
      <path d="M28 6 L48 11 V16 C48 16 28 13 8 16 V11 Z" fill={metal.c1} opacity="0.25" />

      {/* Day number */}
      {showText && (
        <text x="28" y="35" textAnchor="middle" fontSize={fontSize} fontWeight="900" fill={metal.text} fontFamily="system-ui, sans-serif">
          {streak}
        </text>
      )}

      {/* Ribbons */}
      {ribbons.map((r, i) => (
        <g key={`ribbon-${i}`}>
          <rect x={r.x - ribbonW / 2} y={r.y} width={ribbonW} height={ribbonH} rx="1" fill={`url(#${metal.gradId})`} stroke={metal.border} strokeWidth="0.5" />
          <line x1={r.x - ribbonW / 2} y1={r.y + 3.5} x2={r.x + ribbonW / 2} y2={r.y + 3.5} stroke={metal.border} strokeWidth="0.4" opacity="0.4" />
          <line x1={r.x - ribbonW / 2} y1={r.y + 7.5} x2={r.x + ribbonW / 2} y2={r.y + 7.5} stroke={metal.border} strokeWidth="0.4" opacity="0.4" />
        </g>
      ))}
    </svg>
  );
}