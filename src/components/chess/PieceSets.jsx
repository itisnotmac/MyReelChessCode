import React from 'react';

const SIZE_PX = { tiny: 24, small: 36, normal: 62, large: 88, huge: 120, battle: 160 };

// === MINIMALIST SET ===
function MinimalistSet({ piece, isWhite }) {
  const fill = isWhite ? '#f5f5f0' : '#252535';
  const stroke = isWhite ? '#888' : '#666';
  const sw = 1.5;
  const type = piece.toUpperCase();

  const Base = () => <rect x="18" y="50" width="24" height="6" rx="2" fill={fill} stroke={stroke} strokeWidth={sw} />;

  let body;
  switch (type) {
    case 'P':
      body = (<><Base /><rect x="27" y="30" width="6" height="20" fill={fill} stroke={stroke} strokeWidth={sw} /><circle cx="30" cy="22" r="8" fill={fill} stroke={stroke} strokeWidth={sw} /></>);
      break;
    case 'R':
      body = (<><Base /><rect x="22" y="22" width="16" height="28" rx="1" fill={fill} stroke={stroke} strokeWidth={sw} /><rect x="20" y="14" width="6" height="10" rx="1" fill={fill} stroke={stroke} strokeWidth={sw} /><rect x="27" y="14" width="6" height="10" rx="1" fill={fill} stroke={stroke} strokeWidth={sw} /><rect x="34" y="14" width="6" height="10" rx="1" fill={fill} stroke={stroke} strokeWidth={sw} /></>);
      break;
    case 'N':
      body = (<><Base /><path d="M22 48 L22 36 Q22 26 28 20 Q34 14 38 18 L38 30 Q38 38 34 42 L32 48 Z" fill={fill} stroke={stroke} strokeWidth={sw} /><circle cx="34" cy="24" r="1.5" fill={stroke} /></>);
      break;
    case 'B':
      body = (<><Base /><path d="M30 14 Q24 20 24 30 Q24 40 26 48 L34 48 Q36 40 36 30 Q36 20 30 14 Z" fill={fill} stroke={stroke} strokeWidth={sw} /><line x1="27" y1="32" x2="33" y2="32" stroke={stroke} strokeWidth={sw} /></>);
      break;
    case 'Q':
      body = (<><Base /><path d="M22 48 Q22 34 26 28 L30 16 L34 28 Q38 34 38 48 Z" fill={fill} stroke={stroke} strokeWidth={sw} /><circle cx="30" cy="16" r="3" fill={fill} stroke={stroke} strokeWidth={sw} /></>);
      break;
    case 'K':
      body = (<><Base /><path d="M22 48 Q22 34 26 28 L30 20 L34 28 Q38 34 38 48 Z" fill={fill} stroke={stroke} strokeWidth={sw} /><rect x="28" y="8" width="4" height="12" rx="1" fill={fill} stroke={stroke} strokeWidth={sw} /><rect x="25" y="11" width="10" height="4" rx="1" fill={fill} stroke={stroke} strokeWidth={sw} /></>);
      break;
    default:
      body = <Base />;
  }

  return (
    <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      {body}
    </svg>
  );
}

// === FUTURISTIC SET ===
function FuturisticSet({ piece, isWhite }) {
  const gid = `fut-${piece}-${isWhite ? 'w' : 'b'}`;
  const c1 = isWhite ? '#ffffff' : '#0d0d1a';
  const c2 = isWhite ? '#88ccff' : '#003344';
  const stroke = isWhite ? '#00ffff' : '#00ffaa';
  const sw = 1;
  const type = piece.toUpperCase();

  const Base = () => (
    <>
      <rect x="18" y="50" width="24" height="6" rx="1" fill={`url(#${gid})`} stroke={stroke} strokeWidth={sw} />
      <line x1="18" y1="53" x2="42" y2="53" stroke={stroke} strokeWidth="0.5" opacity="0.6" />
    </>
  );

  let body;
  switch (type) {
    case 'P':
      body = (<><Base /><polygon points="30,14 38,26 34,50 26,50 22,26" fill={`url(#${gid})`} stroke={stroke} strokeWidth={sw} /><line x1="30" y1="20" x2="30" y2="46" stroke={stroke} strokeWidth="0.5" opacity="0.5" /></>);
      break;
    case 'R':
      body = (<><Base /><polygon points="22,50 22,22 20,14 26,14 26,20 28,20 28,14 32,14 32,20 34,20 34,14 40,14 38,22 38,50" fill={`url(#${gid})`} stroke={stroke} strokeWidth={sw} /><line x1="22" y1="30" x2="38" y2="30" stroke={stroke} strokeWidth="0.5" opacity="0.4" /></>);
      break;
    case 'N':
      body = (<><Base /><polygon points="22,50 22,34 24,26 30,18 38,16 38,28 34,34 32,50" fill={`url(#${gid})`} stroke={stroke} strokeWidth={sw} /><circle cx="33" cy="24" r="1.5" fill={stroke} /><line x1="24" y1="34" x2="32" y2="34" stroke={stroke} strokeWidth="0.5" opacity="0.4" /></>);
      break;
    case 'B':
      body = (<><Base /><polygon points="30,12 24,20 24,36 26,50 34,50 36,36 36,20" fill={`url(#${gid})`} stroke={stroke} strokeWidth={sw} /><line x1="27" y1="30" x2="33" y2="30" stroke={stroke} strokeWidth="0.5" opacity="0.5" /></>);
      break;
    case 'Q':
      body = (<><Base /><polygon points="22,50 20,34 26,28 24,16 30,22 36,16 34,28 40,34 38,50" fill={`url(#${gid})`} stroke={stroke} strokeWidth={sw} /><circle cx="30" cy="18" r="2" fill={stroke} opacity="0.8" /></>);
      break;
    case 'K':
      body = (<><Base /><polygon points="22,50 20,34 26,28 24,20 30,24 36,20 34,28 40,34 38,50" fill={`url(#${gid})`} stroke={stroke} strokeWidth={sw} /><rect x="28" y="8" width="4" height="12" fill={`url(#${gid})`} stroke={stroke} strokeWidth={sw} /><rect x="25" y="11" width="10" height="3" fill={`url(#${gid})`} stroke={stroke} strokeWidth={sw} /></>);
      break;
    default:
      body = <Base />;
  }

  return (
    <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor={c1} />
          <stop offset="100%" stopColor={c2} />
        </linearGradient>
      </defs>
      {body}
    </svg>
  );
}

// === THEMED SET (Roman, Greek, Modern Combat) ===
const UNICODE_FILLED = { K: '\u265A', Q: '\u265B', R: '\u265C', B: '\u265D', N: '\u265E', P: '\u265F' };

const THEMES = {
  roman: {
    white: '#d4a44a', black: '#8b4513',
    whiteGlow: 'rgba(212,164,74,0.8)', blackGlow: 'rgba(139,69,19,0.7)',
    fontFamily: "'Cinzel', 'Trajan Pro', Georgia, serif",
  },
  greek: {
    white: '#f5f5f0', black: '#7a8b99',
    whiteGlow: 'rgba(245,245,240,0.7)', blackGlow: 'rgba(122,139,153,0.7)',
    fontFamily: "'Georgia', 'Times New Roman', serif",
  },
  modern: {
    white: '#9ba86b', black: '#3a4a3a',
    whiteGlow: 'rgba(155,168,107,0.7)', blackGlow: 'rgba(58,74,58,0.7)',
    fontFamily: "'Arial Black', 'Impact', sans-serif",
  },
};

function ThemedSet({ piece, isWhite, theme, fontSize }) {
  const t = THEMES[theme] || THEMES.roman;
  const color = isWhite ? t.white : t.black;
  const glow = isWhite ? t.whiteGlow : t.blackGlow;
  const char = UNICODE_FILLED[piece.toUpperCase()] || UNICODE_FILLED.P;

  return (
    <span style={{
      fontSize: `${fontSize}px`,
      lineHeight: 1,
      color,
      fontFamily: t.fontFamily,
      textShadow: `0 0 8px ${glow}, 0 0 3px ${glow}, 0 1px 2px rgba(0,0,0,0.8)`,
      fontWeight: 700,
      display: 'inline-block',
    }}>
      {char}
    </span>
  );
}

// === DISPATCHER ===
export function renderPieceSet(setId, { piece, isWhite, size }) {
  const isFill = size === 'fill';
  const px = isFill ? null : (SIZE_PX[size] ?? 62);

  let content;
  switch (setId) {
    case 'minimalist':
      content = <MinimalistSet piece={piece} isWhite={isWhite} />;
      break;
    case 'futuristic':
      content = <FuturisticSet piece={piece} isWhite={isWhite} />;
      break;
    case 'roman':
    case 'greek':
    case 'modern':
      content = <ThemedSet piece={piece} isWhite={isWhite} theme={setId} fontSize={isFill ? 42 : Math.round(px * 0.62)} />;
      break;
    default:
      content = <MinimalistSet piece={piece} isWhite={isWhite} />;
  }

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
      {content}
    </span>
  );
}