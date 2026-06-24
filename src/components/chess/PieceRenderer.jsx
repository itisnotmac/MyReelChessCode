import React from 'react';
import { useSkin } from '@/lib/skinContext';
import { renderPieceSet } from './PieceSets';

// Solid fills instead of SVG gradients — iOS Safari breaks url() gradient
// references when a CSS filter (drop-shadow) is applied to the parent.
const WHITE_FILL = '#f5f5f5';
const BLACK_FILL = '#12121a';

function King({ isWhite }) {
  const fill   = isWhite ? WHITE_FILL : BLACK_FILL;
  const stroke = isWhite ? '#ffffff'   : '#00e5cc';
  const hiColor = isWhite ? '#ffffff'  : '#00e5cc';

  return (
    <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <ellipse cx="30" cy="55" rx="14" ry="3.5" fill={stroke} opacity="0.15"/>
      <rect x="16" y="50" width="28" height="6" rx="3" fill={fill} stroke={stroke} strokeWidth="1.2"/>
      <path d="M22 50 Q21 40 24 34 Q27 30 30 30 Q33 30 36 34 Q39 40 38 50 Z" fill={fill} stroke={stroke} strokeWidth="1.2"/>
      <ellipse cx="30" cy="30" rx="9" ry="2.5" fill={fill} stroke={hiColor} strokeWidth="1" opacity="0.9"/>
      <path d="M22 30 Q21 22 25 18 Q27 16 30 16 Q33 16 35 18 Q39 22 38 30 Z" fill={fill} stroke={stroke} strokeWidth="1.2"/>
      <rect x="28.5" y="5" width="3" height="13" rx="1.5" fill={fill} stroke={stroke} strokeWidth="1"/>
      <rect x="23" y="9" width="14" height="3" rx="1.5" fill={fill} stroke={stroke} strokeWidth="1"/>
    </svg>
  );
}

function Queen({ isWhite }) {
  const fill   = isWhite ? WHITE_FILL : BLACK_FILL;
  const stroke = isWhite ? '#ffffff'  : '#00e5cc';
  const hiColor = isWhite ? '#ffffff' : '#00e5cc';

  return (
    <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <ellipse cx="30" cy="55" rx="14" ry="3.5" fill={stroke} opacity="0.15"/>
      <rect x="16" y="50" width="28" height="6" rx="3" fill={fill} stroke={stroke} strokeWidth="1.2"/>
      <path d="M23 50 Q22 40 25 34 Q27 30 30 30 Q33 30 35 34 Q38 40 37 50 Z" fill={fill} stroke={stroke} strokeWidth="1.2"/>
      <ellipse cx="30" cy="30" rx="9" ry="2.5" fill={fill} stroke={hiColor} strokeWidth="1" opacity="0.9"/>
      <path d="M22 30 Q21 22 26 18 Q28 16 30 16 Q32 16 34 18 Q39 22 38 30 Z" fill={fill} stroke={stroke} strokeWidth="1.2"/>
      <rect x="22" y="13" width="16" height="4" rx="2" fill={fill} stroke={stroke} strokeWidth="1"/>
      {[23, 26, 30, 34, 37].map((x, i) => (
        <ellipse key={i} cx={x} cy={10} rx="2" ry="3.5" fill={fill} stroke={stroke} strokeWidth="0.9"/>
      ))}
    </svg>
  );
}

function Rook({ isWhite }) {
  const fill   = isWhite ? WHITE_FILL : BLACK_FILL;
  const stroke = isWhite ? '#ffffff'  : '#00e5cc';

  return (
    <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <ellipse cx="30" cy="55" rx="14" ry="3.5" fill={stroke} opacity="0.15"/>
      <rect x="16" y="50" width="28" height="6" rx="3" fill={fill} stroke={stroke} strokeWidth="1.2"/>
      <path d="M22 50 Q21 42 23 38 Q25 34 30 34 Q35 34 37 38 Q39 42 38 50 Z" fill={fill} stroke={stroke} strokeWidth="1.2"/>
      <rect x="21" y="20" width="18" height="18" rx="2" fill={fill} stroke={stroke} strokeWidth="1.2"/>
      <rect x="21" y="12" width="5" height="10" rx="1.5" fill={fill} stroke={stroke} strokeWidth="1"/>
      <rect x="27.5" y="12" width="5" height="10" rx="1.5" fill={fill} stroke={stroke} strokeWidth="1"/>
      <rect x="34" y="12" width="5" height="10" rx="1.5" fill={fill} stroke={stroke} strokeWidth="1"/>
    </svg>
  );
}

function Bishop({ isWhite }) {
  const fill   = isWhite ? WHITE_FILL : BLACK_FILL;
  const stroke = isWhite ? '#ffffff'  : '#00e5cc';
  const hiColor = isWhite ? '#ffffff' : '#00e5cc';

  return (
    <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <ellipse cx="30" cy="55" rx="13" ry="3.5" fill={stroke} opacity="0.15"/>
      <rect x="17" y="50" width="26" height="6" rx="3" fill={fill} stroke={stroke} strokeWidth="1.2"/>
      <path d="M24 50 Q23 42 25 36 Q27 32 30 32 Q33 32 35 36 Q37 42 36 50 Z" fill={fill} stroke={stroke} strokeWidth="1.2"/>
      <ellipse cx="30" cy="32" rx="8" ry="2.5" fill={fill} stroke={hiColor} strokeWidth="1" opacity="0.9"/>
      <path d="M24 32 Q22 24 26 18 Q28 14 30 14 Q32 14 34 18 Q38 24 36 32 Z" fill={fill} stroke={stroke} strokeWidth="1.2"/>
      <circle cx="30" cy="12" r="4" fill={fill} stroke={stroke} strokeWidth="1.2"/>
      <path d="M28 9 Q30 4 32 9" fill={fill} stroke={stroke} strokeWidth="1"/>
    </svg>
  );
}

function Knight({ isWhite }) {
  const fill   = isWhite ? WHITE_FILL : BLACK_FILL;
  const stroke = isWhite ? '#ffffff'  : '#00e5cc';
  const hiColor = isWhite ? '#ffffff' : '#00e5cc';

  return (
    <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <ellipse cx="30" cy="55" rx="13" ry="3.5" fill={stroke} opacity="0.15"/>
      <rect x="17" y="50" width="26" height="6" rx="3" fill={fill} stroke={stroke} strokeWidth="1.2"/>
      <path d="M24 50 Q22 42 24 36 Q26 32 30 32 Q34 32 36 36 Q38 42 36 50 Z" fill={fill} stroke={stroke} strokeWidth="1.2"/>
      <path d="M20 32 Q20 22 26 16 Q30 12 36 14 Q40 16 40 22 Q40 28 36 32 Q32 34 26 34 Z"
        fill={fill} stroke={stroke} strokeWidth="1.3"/>
      <path d="M18 24 Q16 28 18 32 Q22 34 26 32 Q22 30 20 26 Z"
        fill={fill} stroke={stroke} strokeWidth="1.1"/>
      {/* Eye */}
      <circle cx="32" cy="20" r="2" fill={isWhite ? '#333' : '#001a1a'} stroke={stroke} strokeWidth="0.8"/>
      <circle cx="32.6" cy="19.4" r="0.7" fill={hiColor} opacity="0.9"/>
      {/* Mane */}
      <path d="M36 14 Q40 10 38 6 Q34 10 34 14" fill={fill} stroke={stroke} strokeWidth="0.8" opacity="0.9"/>
    </svg>
  );
}

function Pawn({ isWhite }) {
  const fill   = isWhite ? WHITE_FILL : BLACK_FILL;
  const stroke = isWhite ? '#ffffff'  : '#00e5cc';

  return (
    <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <ellipse cx="30" cy="55" rx="12" ry="3.5" fill={stroke} opacity="0.15"/>
      <rect x="18" y="50" width="24" height="6" rx="3" fill={fill} stroke={stroke} strokeWidth="1.2"/>
      <path d="M25 50 Q24 42 26 38 Q27 35 30 35 Q33 35 34 38 Q36 42 35 50 Z" fill={fill} stroke={stroke} strokeWidth="1.2"/>
      <circle cx="30" cy="22" r="10" fill={fill} stroke={stroke} strokeWidth="1.3"/>
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
  const { pieceSet } = useSkin();

  if (!piece) return null;

  const isWhite = piece === piece.toUpperCase();
  const type    = piece.toUpperCase();
  const Component = PIECE_COMPONENTS[type];
  if (!Component) return null;

  if (pieceSet && pieceSet !== 'classic') {
    return renderPieceSet(pieceSet, { piece, isWhite, size });
  }

  const isFill = size === 'fill';
  const px = isFill ? null : (SIZE_PX[size] ?? 62);

  // White: soft white glow outline. Black: teal neon glow outline.
  const glowStyle = isWhite
    ? { filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.9)) drop-shadow(0 0 2px rgba(255,255,255,0.6))' }
    : { filter: 'drop-shadow(0 0 5px rgba(0,229,204,0.9)) drop-shadow(0 0 2px rgba(0,229,204,0.6))' };

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