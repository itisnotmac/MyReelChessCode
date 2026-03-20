import React from 'react';

// ─── PIECE SVGs ──────────────────────────────────────────────────────────────
// Each returns an <svg> sized to fill a square.
// isWhite drives colors: gold/cream vs dark/charcoal.

function King({ isWhite }) {
  const crown = isWhite ? '#D4AF37' : '#7B3FBE';
  const robe  = isWhite ? '#E8D9A0' : '#2C1A4E';
  const skin  = isWhite ? '#F5CBA7' : '#C68642';
  const outline = isWhite ? '#8B6914' : '#4A2080';
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Throne back */}
      <rect x="6" y="10" width="28" height="24" rx="3" fill={crown} stroke={outline} strokeWidth="1.2"/>
      <rect x="8" y="12" width="24" height="20" rx="2" fill={robe} stroke={outline} strokeWidth="0.8"/>
      {/* Throne armrests */}
      <rect x="5" y="22" width="5" height="8" rx="1.5" fill={crown} stroke={outline} strokeWidth="1"/>
      <rect x="30" y="22" width="5" height="8" rx="1.5" fill={crown} stroke={outline} strokeWidth="1"/>
      {/* Crown */}
      <polygon points="14,14 17,8 20,12 23,8 26,14" fill={crown} stroke={outline} strokeWidth="1"/>
      <circle cx="17" cy="8" r="1.5" fill={isWhite ? '#fff' : '#E040FB'}/>
      <circle cx="23" cy="8" r="1.5" fill={isWhite ? '#fff' : '#E040FB'}/>
      <circle cx="20" cy="12" r="1.2" fill={isWhite ? '#FFD700' : '#CE93D8'}/>
      {/* Head */}
      <ellipse cx="20" cy="19" rx="5" ry="5.5" fill={skin} stroke={outline} strokeWidth="0.8"/>
      {/* Face details */}
      <line x1="17.5" y1="18" x2="18.5" y2="18" stroke={outline} strokeWidth="0.8" strokeLinecap="round"/>
      <line x1="21.5" y1="18" x2="22.5" y2="18" stroke={outline} strokeWidth="0.8" strokeLinecap="round"/>
      <path d="M18.5 21 Q20 22.5 21.5 21" stroke={outline} strokeWidth="0.7" fill="none" strokeLinecap="round"/>
      {/* Beard */}
      <path d="M16 22 Q20 26 24 22" fill={isWhite ? '#C8A97E' : '#4A3728'} stroke={outline} strokeWidth="0.6"/>
      {/* Body / robe */}
      <path d="M13 32 Q14 25 20 24 Q26 25 27 32 Z" fill={robe} stroke={outline} strokeWidth="0.8"/>
      {/* Base */}
      <rect x="8" y="33" width="24" height="4" rx="2" fill={crown} stroke={outline} strokeWidth="1"/>
    </svg>
  );
}

function Queen({ isWhite }) {
  const crown = isWhite ? '#D4AF37' : '#7B3FBE';
  const robe  = isWhite ? '#E8D9A0' : '#2C1A4E';
  const skin  = isWhite ? '#F5CBA7' : '#C68642';
  const outline = isWhite ? '#8B6914' : '#4A2080';
  const gem   = isWhite ? '#E74C3C' : '#F06292';
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Throne back */}
      <rect x="6" y="10" width="28" height="24" rx="3" fill={crown} stroke={outline} strokeWidth="1.2"/>
      <rect x="8" y="12" width="24" height="20" rx="2" fill={robe} stroke={outline} strokeWidth="0.8"/>
      {/* Throne armrests - elegant curved */}
      <path d="M5 22 Q4 26 6 30" stroke={crown} strokeWidth="3" strokeLinecap="round" fill="none"/>
      <path d="M35 22 Q36 26 34 30" stroke={crown} strokeWidth="3" strokeLinecap="round" fill="none"/>
      {/* Queen crown - tiara style */}
      <path d="M13 15 L15 9 L18 13 L20 7 L22 13 L25 9 L27 15 Z" fill={crown} stroke={outline} strokeWidth="1"/>
      <circle cx="20" cy="7"  r="1.8" fill={gem}/>
      <circle cx="15" cy="9"  r="1.2" fill={isWhite ? '#9B59B6' : '#FFD700'}/>
      <circle cx="25" cy="9"  r="1.2" fill={isWhite ? '#9B59B6' : '#FFD700'}/>
      {/* Head */}
      <ellipse cx="20" cy="19.5" rx="4.5" ry="5" fill={skin} stroke={outline} strokeWidth="0.8"/>
      {/* Hair */}
      <path d="M15.5 17 Q16 14 20 14 Q24 14 24.5 17" fill={isWhite ? '#8B6914' : '#1a0a2e'} stroke={outline} strokeWidth="0.5"/>
      {/* Eyes */}
      <circle cx="18" cy="19" r="0.9" fill={outline}/>
      <circle cx="22" cy="19" r="0.9" fill={outline}/>
      {/* Smile */}
      <path d="M18.5 21.5 Q20 23 21.5 21.5" stroke={outline} strokeWidth="0.7" fill="none" strokeLinecap="round"/>
      {/* Body / gown */}
      <path d="M13 33 Q13 25 20 24 Q27 25 27 33 Z" fill={robe} stroke={outline} strokeWidth="0.8"/>
      {/* Gown flourish */}
      <path d="M15 29 Q20 27 25 29" stroke={crown} strokeWidth="0.8" fill="none"/>
      <path d="M14 31.5 Q20 29 26 31.5" stroke={crown} strokeWidth="0.8" fill="none"/>
      {/* Base */}
      <rect x="8" y="33" width="24" height="4" rx="2" fill={crown} stroke={outline} strokeWidth="1"/>
    </svg>
  );
}

function Knight({ isWhite }) {
  const metal  = isWhite ? '#C0C8D0' : '#4A3728';
  const accent = isWhite ? '#D4AF37' : '#8B3A3A';
  const skin   = isWhite ? '#F5CBA7' : '#C68642';
  const outline = isWhite ? '#555' : '#222';
  const horse  = isWhite ? '#8B7355' : '#3D2B1A';
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Horse head & neck */}
      <path d="M8 30 Q8 20 14 16 Q16 12 15 8 Q18 9 19 12 Q22 10 24 13 Q28 14 28 20 Q28 28 24 30 Z"
        fill={horse} stroke={outline} strokeWidth="1"/>
      {/* Horse mane */}
      <path d="M15 8 Q17 6 19 8 Q17 10 15 12 Q17 11 19 13 Q17 14 15 16"
        fill={isWhite ? '#6B5B45' : '#2A1A0A'} stroke={outline} strokeWidth="0.6"/>
      {/* Horse eye */}
      <circle cx="24" cy="16" r="1.4" fill={isWhite ? '#3D2B1A' : '#8B7355'}/>
      <circle cx="24.5" cy="15.5" r="0.4" fill="white"/>
      {/* Nostril */}
      <ellipse cx="27" cy="20" rx="1" ry="0.6" fill={isWhite ? '#6B5B45' : '#2A1A0A'}/>
      {/* Rider body / armor */}
      <ellipse cx="16" cy="20" rx="6" ry="8" fill={metal} stroke={outline} strokeWidth="1"/>
      {/* Armor plates */}
      <line x1="11" y1="18" x2="21" y2="18" stroke={accent} strokeWidth="0.8"/>
      <line x1="11" y1="21" x2="21" y2="21" stroke={accent} strokeWidth="0.8"/>
      {/* Helmet */}
      <ellipse cx="16" cy="13" rx="5" ry="4.5" fill={metal} stroke={outline} strokeWidth="1"/>
      <rect x="13" y="14" width="6" height="2" rx="0.5" fill={accent} stroke={outline} strokeWidth="0.6"/>
      {/* Visor slit */}
      <line x1="13.5" y1="15" x2="19.5" y2="15" stroke={outline} strokeWidth="1" strokeLinecap="round"/>
      {/* Helmet plume */}
      <path d="M16 9 Q14 6 12 7 Q14 8 14 10" fill={isWhite ? '#E74C3C' : '#9B59B6'} stroke={outline} strokeWidth="0.5"/>
      {/* Lance / weapon */}
      <line x1="21" y1="8" x2="30" y2="28" stroke={accent} strokeWidth="1.5" strokeLinecap="round"/>
      <polygon points="30,28 28,24 32,26" fill={metal} stroke={outline} strokeWidth="0.8"/>
      {/* Base */}
      <rect x="6" y="33" width="28" height="4" rx="2" fill={accent} stroke={outline} strokeWidth="1"/>
    </svg>
  );
}

function Bishop({ isWhite }) {
  const robe   = isWhite ? '#E8D9A0' : '#1a1a2e';
  const accent = isWhite ? '#D4AF37' : '#7B3FBE';
  const skin   = isWhite ? '#F5CBA7' : '#C68642';
  const outline = isWhite ? '#8B6914' : '#4A2080';
  const hood   = isWhite ? '#C8B870' : '#111128';
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Wide flowing robe */}
      <path d="M10 37 Q10 24 20 22 Q30 24 30 37 Z" fill={robe} stroke={outline} strokeWidth="1"/>
      {/* Robe folds */}
      <line x1="14" y1="28" x2="12" y2="37" stroke={outline} strokeWidth="0.6" opacity="0.5"/>
      <line x1="20" y1="26" x2="20" y2="37" stroke={outline} strokeWidth="0.6" opacity="0.5"/>
      <line x1="26" y1="28" x2="28" y2="37" stroke={outline} strokeWidth="0.6" opacity="0.5"/>
      {/* Belt / sash */}
      <path d="M12 30 Q20 28 28 30" stroke={accent} strokeWidth="1.5" fill="none"/>
      {/* Cross on chest */}
      <line x1="20" y1="25" x2="20" y2="31" stroke={accent} strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="17.5" y1="27.5" x2="22.5" y2="27.5" stroke={accent} strokeWidth="1.2" strokeLinecap="round"/>
      {/* Torso / robe upper */}
      <path d="M14 22 Q14 18 20 17 Q26 18 26 22 Q26 25 20 25 Q14 25 14 22Z" fill={robe} stroke={outline} strokeWidth="0.8"/>
      {/* Deep hood */}
      <path d="M11 20 Q11 8 20 6 Q29 8 29 20 Q29 24 20 25 Q11 24 11 20Z" fill={hood} stroke={outline} strokeWidth="1"/>
      {/* Hood shadow / depth */}
      <path d="M14 20 Q14 11 20 9 Q26 11 26 20 Q26 23 20 24 Q14 23 14 20Z" fill={robe} stroke="none" opacity="0.3"/>
      {/* Face peeking from hood */}
      <ellipse cx="20" cy="19" rx="4" ry="4.5" fill={skin} stroke={outline} strokeWidth="0.7"/>
      {/* Shadowed eyes under hood */}
      <ellipse cx="18" cy="18" rx="1.2" ry="0.7" fill={isWhite ? '#7B5C3E' : '#3D2B1A'}/>
      <ellipse cx="22" cy="18" rx="1.2" ry="0.7" fill={isWhite ? '#7B5C3E' : '#3D2B1A'}/>
      {/* Sinister glow eyes */}
      <circle cx="18" cy="18" r="0.6" fill={isWhite ? '#D4AF37' : '#9B59B6'} opacity="0.9"/>
      <circle cx="22" cy="18" r="0.6" fill={isWhite ? '#D4AF37' : '#9B59B6'} opacity="0.9"/>
      {/* Hood peak / pointed top */}
      <path d="M17 10 Q20 3 23 10" fill={hood} stroke={outline} strokeWidth="0.8"/>
      {/* Staff */}
      <line x1="29" y1="10" x2="32" y2="37" stroke={accent} strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="29" cy="10" r="2.5" fill={accent} stroke={outline} strokeWidth="0.8"/>
      <circle cx="29" cy="10" r="1" fill="white" opacity="0.6"/>
      {/* Base */}
      <rect x="8" y="35" width="24" height="3" rx="1.5" fill={accent} stroke={outline} strokeWidth="0.8"/>
    </svg>
  );
}

function Rook({ isWhite }) {
  const metal  = isWhite ? '#B8C0C8' : '#5C3A1E';
  const dark   = isWhite ? '#8B9099' : '#3D2510';
  const accent = isWhite ? '#D4AF37' : '#C0392B';
  const skin   = isWhite ? '#F5CBA7' : '#C68642';
  const outline = isWhite ? '#444' : '#1a0a00';
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Legs / lower body */}
      <rect x="12" y="28" width="6" height="9" rx="1" fill={metal} stroke={outline} strokeWidth="0.8"/>
      <rect x="22" y="28" width="6" height="9" rx="1" fill={metal} stroke={outline} strokeWidth="0.8"/>
      {/* Fur boots */}
      <rect x="11" y="33" width="8" height="4" rx="1.5" fill={dark} stroke={outline} strokeWidth="0.8"/>
      <rect x="21" y="33" width="8" height="4" rx="1.5" fill={dark} stroke={outline} strokeWidth="0.8"/>
      {/* Torso - barrel chested */}
      <ellipse cx="20" cy="24" rx="9" ry="8" fill={metal} stroke={outline} strokeWidth="1"/>
      {/* Fur trim on chest */}
      <path d="M11 22 Q20 19 29 22" stroke={dark} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      {/* Belt with buckle */}
      <rect x="12" y="27" width="16" height="2.5" rx="1" fill={accent} stroke={outline} strokeWidth="0.7"/>
      <rect x="18.5" y="27" width="3" height="2.5" rx="0.5" fill={isWhite ? '#FFD700' : '#E74C3C'} stroke={outline} strokeWidth="0.5"/>
      {/* Arms */}
      <ellipse cx="10" cy="22" rx="3" ry="6" fill={metal} stroke={outline} strokeWidth="0.8" transform="rotate(-15 10 22)"/>
      <ellipse cx="30" cy="22" rx="3" ry="6" fill={metal} stroke={outline} strokeWidth="0.8" transform="rotate(15 30 22)"/>
      {/* Berserker axe (left hand) */}
      <line x1="7" y1="27" x2="3" y2="15" stroke={dark} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M3 15 Q0 10 2 8 Q5 10 5 15Z" fill={metal} stroke={outline} strokeWidth="0.8"/>
      <path d="M3 15 Q1 12 3 10 Q6 12 5 15Z" fill={dark} stroke={outline} strokeWidth="0.5"/>
      {/* Shield (right hand) */}
      <path d="M33 14 Q38 14 38 20 Q38 26 33 28 Q30 24 30 20 Q30 14 33 14Z" fill={metal} stroke={outline} strokeWidth="1"/>
      <line x1="33" y1="14" x2="33" y2="28" stroke={accent} strokeWidth="0.8"/>
      <line x1="30" y1="21" x2="38" y2="21" stroke={accent} strokeWidth="0.8"/>
      {/* Head */}
      <ellipse cx="20" cy="14" rx="6" ry="6.5" fill={skin} stroke={outline} strokeWidth="0.8"/>
      {/* Viking helmet */}
      <path d="M14 14 Q14 7 20 5 Q26 7 26 14" fill={metal} stroke={outline} strokeWidth="1"/>
      {/* Nose guard */}
      <rect x="19" y="11" width="2" height="5" rx="1" fill={metal} stroke={outline} strokeWidth="0.6"/>
      {/* Horn left */}
      <path d="M14 10 Q9 6 8 10 Q10 12 14 12Z" fill={metal} stroke={outline} strokeWidth="0.8"/>
      {/* Horn right */}
      <path d="M26 10 Q31 6 32 10 Q30 12 26 12Z" fill={metal} stroke={outline} strokeWidth="0.8"/>
      {/* Angry eyes */}
      <line x1="16" y1="14" x2="18.5" y2="13" stroke={outline} strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="21.5" y1="13" x2="24" y2="14" stroke={outline} strokeWidth="1.2" strokeLinecap="round"/>
      <circle cx="17.5" cy="14.5" r="1" fill={isWhite ? '#2C3E50' : '#E74C3C'}/>
      <circle cx="22.5" cy="14.5" r="1" fill={isWhite ? '#2C3E50' : '#E74C3C'}/>
      {/* Beard */}
      <path d="M15 18 Q17 22 20 22 Q23 22 25 18" fill={isWhite ? '#A08060' : '#3D2510'} stroke={outline} strokeWidth="0.6"/>
      <line x1="17.5" y1="20" x2="17" y2="23" stroke={outline} strokeWidth="0.5"/>
      <line x1="20" y1="21" x2="20" y2="24" stroke={outline} strokeWidth="0.5"/>
      <line x1="22.5" y1="20" x2="23" y2="23" stroke={outline} strokeWidth="0.5"/>
    </svg>
  );
}

function Pawn({ isWhite }) {
  const armor  = isWhite ? '#C0C8D0' : '#4A5568';
  const accent = isWhite ? '#D4AF37' : '#8B3A3A';
  const skin   = isWhite ? '#F5CBA7' : '#C68642';
  const outline = isWhite ? '#555' : '#222';
  const cloth  = isWhite ? '#E8E0D0' : '#2D3748';
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Legs */}
      <rect x="14" y="29" width="5" height="8" rx="1" fill={armor} stroke={outline} strokeWidth="0.8"/>
      <rect x="21" y="29" width="5" height="8" rx="1" fill={armor} stroke={outline} strokeWidth="0.8"/>
      {/* Boots */}
      <rect x="13" y="33" width="7" height="4" rx="1.5" fill={cloth} stroke={outline} strokeWidth="0.7"/>
      <rect x="20" y="33" width="7" height="4" rx="1.5" fill={cloth} stroke={outline} strokeWidth="0.7"/>
      {/* Torso / chest plate */}
      <rect x="13" y="21" width="14" height="10" rx="2" fill={armor} stroke={outline} strokeWidth="1"/>
      {/* Chest plate detail */}
      <path d="M16 22 Q20 21 24 22 L24 27 Q20 28 16 27 Z" fill={isWhite ? '#D8E0E8' : '#3A4556'} stroke={outline} strokeWidth="0.5"/>
      {/* Pauldrons (shoulder guards) */}
      <ellipse cx="13" cy="22" rx="3.5" ry="2.5" fill={armor} stroke={outline} strokeWidth="0.8"/>
      <ellipse cx="27" cy="22" rx="3.5" ry="2.5" fill={armor} stroke={outline} strokeWidth="0.8"/>
      {/* Belt */}
      <rect x="13" y="29" width="14" height="2" rx="1" fill={accent} stroke={outline} strokeWidth="0.6"/>
      {/* Arms */}
      <rect x="8"  y="22" width="5" height="9" rx="2" fill={armor} stroke={outline} strokeWidth="0.8"/>
      <rect x="27" y="22" width="5" height="9" rx="2" fill={armor} stroke={outline} strokeWidth="0.8"/>
      {/* Spear (right side) */}
      <line x1="31" y1="5" x2="31" y2="37" stroke={cloth} strokeWidth="1.5" strokeLinecap="round"/>
      <polygon points="31,5 29,10 33,10" fill={armor} stroke={outline} strokeWidth="0.7"/>
      {/* Round shield (left side) */}
      <circle cx="8" cy="27" r="5" fill={armor} stroke={outline} strokeWidth="1"/>
      <circle cx="8" cy="27" r="3" fill="none" stroke={accent} strokeWidth="0.8"/>
      <circle cx="8" cy="27" r="1" fill={accent}/>
      {/* Neck */}
      <rect x="17.5" y="17" width="5" height="5" rx="1" fill={skin} stroke={outline} strokeWidth="0.6"/>
      {/* Head */}
      <ellipse cx="20" cy="14" rx="5.5" ry="5.5" fill={skin} stroke={outline} strokeWidth="0.8"/>
      {/* Helmet / kettle helm */}
      <path d="M14.5 14 Q14.5 8 20 7 Q25.5 8 25.5 14" fill={armor} stroke={outline} strokeWidth="1"/>
      {/* Helm brim */}
      <rect x="13" y="13" width="14" height="2" rx="1" fill={armor} stroke={outline} strokeWidth="0.8"/>
      {/* Face */}
      <circle cx="18" cy="15" r="0.9" fill={outline}/>
      <circle cx="22" cy="15" r="0.9" fill={outline}/>
      <path d="M18.5 17.5 Q20 18.5 21.5 17.5" stroke={outline} strokeWidth="0.7" fill="none" strokeLinecap="round"/>
      {/* Cheek guard lines */}
      <line x1="15" y1="14" x2="14.5" y2="18" stroke={outline} strokeWidth="0.6" opacity="0.5"/>
      <line x1="25" y1="14" x2="25.5" y2="18" stroke={outline} strokeWidth="0.6" opacity="0.5"/>
    </svg>
  );
}

// ─── SIZE MAP ─────────────────────────────────────────────────────────────────
const SIZE_PX = {
  tiny:   20,
  small:  28,
  normal: 42,
  large:  60,
  huge:   90,
  battle: 120,
};

const PIECE_COMPONENTS = { K: King, Q: Queen, R: Rook, B: Bishop, N: Knight, P: Pawn };

export default function PieceRenderer({ piece, size = 'normal' }) {
  if (!piece) return null;

  const isWhite = piece === piece.toUpperCase();
  const type    = piece.toUpperCase();
  const Component = PIECE_COMPONENTS[type];
  if (!Component) return null;

  const px = SIZE_PX[size] ?? 42;

  return (
    <span
      className="inline-flex items-center justify-center select-none"
      style={{
        width:  px,
        height: px,
        filter: isWhite
          ? 'drop-shadow(0 2px 6px rgba(212,175,55,0.35))'
          : 'drop-shadow(0 2px 6px rgba(0,0,0,0.7))',
      }}
    >
      <Component isWhite={isWhite} />
    </span>
  );
}