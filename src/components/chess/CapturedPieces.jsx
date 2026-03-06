import React from 'react';
import PieceRenderer from './PieceRenderer';

export default function CapturedPieces({ pieces, color }) {
  if (!pieces || pieces.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-0.5 items-center min-h-[28px] px-2">
      <span className="text-[10px] tracking-wider uppercase text-white/30 mr-2 font-medium">
        {color === 'white' ? '⚔ Lost' : '⚔ Lost'}
      </span>
      {pieces.map((piece, i) => (
        <div key={i} className="opacity-60">
          <PieceRenderer piece={piece} size="tiny" />
        </div>
      ))}
    </div>
  );
}