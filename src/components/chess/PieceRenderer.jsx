import React from 'react';

const PIECE_UNICODE = {
  K: '♔', Q: '♕', R: '♖', B: '♗', N: '♘', P: '♙',
  k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟'
};

export default function PieceRenderer({ piece, size = 'normal' }) {
  if (!piece) return null;
  const isWhitePiece = piece === piece.toUpperCase();
  const sizeClasses = {
    tiny: 'text-xl',
    small: 'text-2xl',
    normal: 'text-3xl sm:text-4xl',
    large: 'text-5xl sm:text-6xl',
    huge: 'text-7xl sm:text-8xl',
    battle: 'text-[80px] sm:text-[120px]'
  };

  return (
    <span
      className={`${sizeClasses[size]} leading-none select-none`}
      style={{
        filter: isWhitePiece
          ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))'
          : 'drop-shadow(0 2px 4px rgba(0,0,0,0.6))',
        color: isWhitePiece ? '#F5F0E8' : '#1a1a2e'
      }}
    >
      {PIECE_UNICODE[piece]}
    </span>
  );
}