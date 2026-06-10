import React from 'react';

// White pieces: gold/bronze. Black pieces: bright silver/steel with neon teal edge for contrast on dark board.
// Clean, centered silhouettes that stay within their square

function King({ isWhite }) {
  const fill = isWhite ? 'url(#wgrad)' : 'url(#bgrad)';
  const stroke = isWhite ? '#8B6500' : '#1a6b68';
  const gradId = isWhite ? 'wgrad' : 'bgrad';
  const hiColor = isWhite ? '#FFE88A' : '#c8e6e5';
  const shColor = isWhite ? '#7A5A00' : '#2a5a58';

  return (
    <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={gradId} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor={isWhite ? '#FFE066' : '#e8f4f4'} />
          <stop offset="50%" stopColor={isWhite ? '#D4A820' : '#9abfbe'} />
          <stop offset="100%" stopColor={isWhite ? '#7A5A00' : '#2a5a58'} />
        </linearGradient>
      </defs>
      {/* Base */}
      <ellipse cx="30" cy="55" rx="14" ry="3.5" fill={shColor} opacity="0.5"/>
      <rect x="16" y="50" width="28" height="6" rx="3" fill={fill} stroke={stroke} strokeWidth="0.8"/>
      {/* Stem */}
      <path d="M22 50 Q21 40 24 34 Q27 30 30 30 Q33 30 36 34 Q39 40 38 50 Z" fill={fill} stroke={stroke} strokeWidth="0.8"/>
      {/* Collar ring */}
      <ellipse cx="30" cy="30" rx="9" ry="2.5" fill={hiColor} stroke={stroke} strokeWidth="0.7" opacity="0.8"/>
      {/* Upper body */}
      <path d="M22 30 Q21 22 25 18 Q27 16 30 16 Q33 16 35 18 Q39 22 38 30 Z" fill={fill} stroke={stroke} strokeWidth="0.8"/>
      {/* Cross vertical */}
      <rect x="28.5" y="5" width="3" height="13" rx="1.5" fill={fill} stroke={stroke} strokeWidth="0.7"/>
      {/* Cross horizontal */}
      <rect x="23" y="9" width="14" height="3" rx="1.5" fill={fill} stroke={stroke} strokeWidth="0.7"/>
      {/* Highlight */}
      <path d="M23 28 Q30 26 37 28" stroke={hiColor} strokeWidth="0.8" fill="none" opacity="0.6"/>
    </svg>
  );
}

function Queen({ isWhite }) {
  const fill = isWhite ? 'url(#wqgrad)' : 'url(#bqgrad)';
  const stroke = isWhite ? '#8B6500' : '#1a6b68';
  const gradId = isWhite ? 'wqgrad' : 'bqgrad';
  const hiColor = isWhite ? '#FFE88A' : '#c8e6e5';
  const shColor = isWhite ? '#7A5A00' : '#2a5a58';

  return (
    <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={gradId} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor={isWhite ? '#FFE066' : '#e8f4f4'} />
          <stop offset="50%" stopColor={isWhite ? '#D4A820' : '#9abfbe'} />
          <stop offset="100%" stopColor={isWhite ? '#7A5A00' : '#2a5a58'} />
        </linearGradient>
      </defs>
      {/* Base */}
      <ellipse cx="30" cy="55" rx="14" ry="3.5" fill={shColor} opacity="0.5"/>
      <rect x="16" y="50" width="28" height="6" rx="3" fill={fill} stroke={stroke} strokeWidth="0.8"/>
      {/* Stem */}
      <path d="M23 50 Q22 40 25 34 Q27 30 30 30 Q33 30 35 34 Q38 40 37 50 Z" fill={fill} stroke={stroke} strokeWidth="0.8"/>
      {/* Waist ring (torus) */}
      <ellipse cx="30" cy="30" rx="9" ry="2.5" fill={hiColor} stroke={stroke} strokeWidth="0.7" opacity="0.8"/>
      {/* Upper body */}
      <path d="M22 30 Q21 22 26 18 Q28 16 30 16 Q32 16 34 18 Q39 22 38 30 Z" fill={fill} stroke={stroke} strokeWidth="0.8"/>
      {/* Crown base band */}
      <rect x="22" y="13" width="16" height="4" rx="2" fill={fill} stroke={stroke} strokeWidth="0.7"/>
      {/* 5 crown spires */}
      {[23, 26, 30, 34, 37].map((x, i) => (
        <ellipse key={i} cx={x} cy={10} rx="2" ry="3.5" fill={fill} stroke={stroke} strokeWidth="0.6"/>
      ))}
      {/* Highlight */}
      <path d="M23 28 Q30 26 37 28" stroke={hiColor} strokeWidth="0.8" fill="none" opacity="0.6"/>
    </svg>
  );
}

function Rook({ isWhite }) {
  const fill = isWhite ? 'url(#wrgrad)' : 'url(#brgrad)';
  const stroke = isWhite ? '#8B6500' : '#1a6b68';
  const gradId = isWhite ? 'wrgrad' : 'brgrad';
  const hiColor = isWhite ? '#FFE88A' : '#c8e6e5';
  const shColor = isWhite ? '#7A5A00' : '#2a5a58';

  return (
    <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={gradId} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor={isWhite ? '#FFE066' : '#e8f4f4'} />
          <stop offset="50%" stopColor={isWhite ? '#D4A820' : '#9abfbe'} />
          <stop offset="100%" stopColor={isWhite ? '#7A5A00' : '#2a5a58'} />
        </linearGradient>
      </defs>
      {/* Base */}
      <ellipse cx="30" cy="55" rx="14" ry="3.5" fill={shColor} opacity="0.5"/>
      <rect x="16" y="50" width="28" height="6" rx="3" fill={fill} stroke={stroke} strokeWidth="0.8"/>
      {/* Stem */}
      <path d="M22 50 Q21 42 23 38 Q25 34 30 34 Q35 34 37 38 Q39 42 38 50 Z" fill={fill} stroke={stroke} strokeWidth="0.8"/>
      {/* Tower body */}
      <rect x="21" y="20" width="18" height="18" rx="2" fill={fill} stroke={stroke} strokeWidth="0.8"/>
      {/* Battlements - 3 merlons */}
      <rect x="21" y="12" width="5" height="10" rx="1.5" fill={fill} stroke={stroke} strokeWidth="0.7"/>
      <rect x="27.5" y="12" width="5" height="10" rx="1.5" fill={fill} stroke={stroke} strokeWidth="0.7"/>
      <rect x="34" y="12" width="5" height="10" rx="1.5" fill={fill} stroke={stroke} strokeWidth="0.7"/>
      {/* Highlight */}
      <path d="M22 36 Q30 34 38 36" stroke={hiColor} strokeWidth="0.8" fill="none" opacity="0.5"/>
    </svg>
  );
}

function Bishop({ isWhite }) {
  const fill = isWhite ? 'url(#wbgrad)' : 'url(#bbgrad)';
  const stroke = isWhite ? '#8B6500' : '#1a6b68';
  const hiColor = isWhite ? '#FFE88A' : '#c8e6e5';
  const shColor = isWhite ? '#7A5A00' : '#2a5a58';

  return (
    <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={isWhite ? 'wbgrad' : 'bbgrad'} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor={isWhite ? '#FFE066' : '#e8f4f4'} />
          <stop offset="50%" stopColor={isWhite ? '#D4A820' : '#9abfbe'} />
          <stop offset="100%" stopColor={isWhite ? '#7A5A00' : '#2a5a58'} />
        </linearGradient>
      </defs>
      {/* Base */}
      <ellipse cx="30" cy="55" rx="13" ry="3.5" fill={shColor} opacity="0.5"/>
      <rect x="17" y="50" width="26" height="6" rx="3" fill={fill} stroke={stroke} strokeWidth="0.8"/>
      {/* Stem */}
      <path d="M24 50 Q23 42 25 36 Q27 32 30 32 Q33 32 35 36 Q37 42 36 50 Z" fill={fill} stroke={stroke} strokeWidth="0.8"/>
      {/* Collar */}
      <ellipse cx="30" cy="32" rx="8" ry="2.5" fill={hiColor} stroke={stroke} strokeWidth="0.7" opacity="0.8"/>
      {/* Tapered body */}
      <path d="M24 32 Q22 24 26 18 Q28 14 30 14 Q32 14 34 18 Q38 24 36 32 Z" fill={fill} stroke={stroke} strokeWidth="0.8"/>
      {/* Ball */}
      <circle cx="30" cy="12" r="4" fill={fill} stroke={stroke} strokeWidth="0.8"/>
      {/* Point */}
      <path d="M28 9 Q30 4 32 9" fill={fill} stroke={stroke} strokeWidth="0.7"/>
      {/* Highlight */}
      <path d="M25 30 Q30 28 35 30" stroke={hiColor} strokeWidth="0.8" fill="none" opacity="0.6"/>
    </svg>
  );
}

function Knight({ isWhite }) {
  const fill = isWhite ? 'url(#wngrad)' : 'url(#bngrad)';
  const stroke = isWhite ? '#8B6500' : '#1a6b68';
  const hiColor = isWhite ? '#FFE88A' : '#c8e6e5';
  const shColor = isWhite ? '#7A5A00' : '#2a5a58';

  return (
    <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={isWhite ? 'wngrad' : 'bngrad'} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor={isWhite ? '#FFE066' : '#e8f4f4'} />
          <stop offset="50%" stopColor={isWhite ? '#D4A820' : '#9abfbe'} />
          <stop offset="100%" stopColor={isWhite ? '#7A5A00' : '#2a5a58'} />
        </linearGradient>
      </defs>
      {/* Base */}
      <ellipse cx="30" cy="55" rx="13" ry="3.5" fill={shColor} opacity="0.5"/>
      <rect x="17" y="50" width="26" height="6" rx="3" fill={fill} stroke={stroke} strokeWidth="0.8"/>
      {/* Neck / pedestal */}
      <path d="M24 50 Q22 42 24 36 Q26 32 30 32 Q34 32 36 36 Q38 42 36 50 Z" fill={fill} stroke={stroke} strokeWidth="0.8"/>
      {/* Horse head — angled box */}
      <path d="M20 32 Q20 22 26 16 Q30 12 36 14 Q40 16 40 22 Q40 28 36 32 Q32 34 26 34 Z"
        fill={fill} stroke={stroke} strokeWidth="0.9"/>
      {/* Snout */}
      <path d="M18 24 Q16 28 18 32 Q22 34 26 32 Q22 30 20 26 Z"
        fill={fill} stroke={stroke} strokeWidth="0.8"/>
      {/* Eye */}
      <circle cx="32" cy="20" r="2" fill={isWhite ? shColor : '#0d3030'} stroke={stroke} strokeWidth="0.5"/>
      <circle cx="32.6" cy="19.4" r="0.7" fill={hiColor} opacity="0.8"/>
      {/* Mane */}
      <path d="M36 14 Q40 10 38 6 Q34 10 34 14" fill={isWhite ? shColor : '#1a5a58'} stroke={stroke} strokeWidth="0.5" opacity="0.8"/>
      {/* Highlight */}
      <path d="M22 26 Q30 24 38 26" stroke={hiColor} strokeWidth="0.8" fill="none" opacity="0.5"/>
    </svg>
  );
}

function Pawn({ isWhite }) {
  const fill = isWhite ? 'url(#wpgrad)' : 'url(#bpgrad)';
  const stroke = isWhite ? '#8B6500' : '#1a6b68';
  const hiColor = isWhite ? '#FFE88A' : '#c8e6e5';
  const shColor = isWhite ? '#7A5A00' : '#2a5a58';

  return (
    <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={isWhite ? 'wpgrad' : 'bpgrad'} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor={isWhite ? '#FFE066' : '#e8f4f4'} />
          <stop offset="50%" stopColor={isWhite ? '#D4A820' : '#9abfbe'} />
          <stop offset="100%" stopColor={isWhite ? '#7A5A00' : '#2a5a58'} />
        </linearGradient>
      </defs>
      {/* Base */}
      <ellipse cx="30" cy="55" rx="12" ry="3.5" fill={shColor} opacity="0.5"/>
      <rect x="18" y="50" width="24" height="6" rx="3" fill={fill} stroke={stroke} strokeWidth="0.8"/>
      {/* Stem */}
      <path d="M25 50 Q24 42 26 38 Q27 35 30 35 Q33 35 34 38 Q36 42 35 50 Z" fill={fill} stroke={stroke} strokeWidth="0.8"/>
      {/* Head */}
      <circle cx="30" cy="22" r="10" fill={fill} stroke={stroke} strokeWidth="0.9"/>
      {/* Highlight */}
      <path d="M24 20 Q30 18 36 20" stroke={hiColor} strokeWidth="1" fill="none" opacity="0.6"/>
    </svg>
  );
}

// ─── SIZE MAP ─────────────────────────────────────────────────────────────────
const SIZE_PX = {
  tiny:   24,
  small:  36,
  normal: 62,
  large:  88,
  huge:   120,
  battle: 160,
};

const PIECE_COMPONENTS = { K: King, Q: Queen, R: Rook, B: Bishop, N: Knight, P: Pawn };

export default function PieceRenderer({ piece, size = 'normal' }) {
  if (!piece) return null;

  const isWhite = piece === piece.toUpperCase();
  const type    = piece.toUpperCase();
  const Component = PIECE_COMPONENTS[type];
  if (!Component) return null;

  const isFill = size === 'fill';
  const px = isFill ? null : (SIZE_PX[size] ?? 62);

  const glowStyle = !isWhite ? { filter: 'drop-shadow(0 0 4px rgba(58,175,169,0.7)) drop-shadow(0 1px 3px rgba(0,0,0,0.9))' } : { filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.5))' };

  return (
    <span
      className="inline-flex items-center justify-center select-none"
      style={{
        ...(isFill
          ? { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }
          : { width: px, height: px, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }),
        ...glowStyle,
      }}
    >
      <Component isWhite={isWhite} />
    </span>
  );
}