import React from 'react';
import PieceRenderer from './PieceRenderer';

export default function ChessBoard({ board, selectedSquare, legalMoves, onSquareClick, lastMove, isCheck, checkSquare, flipped = false }) {
  const getSquareColor = (row, col) => {
    const isLight = (row + col) % 2 === 0;
    const isSelected = selectedSquare && selectedSquare[0] === row && selectedSquare[1] === col;
    const isLegal = legalMoves.some(([r, c]) => r === row && c === col);
    const isLastMove = lastMove && ((lastMove.from[0] === row && lastMove.from[1] === col) || (lastMove.to[0] === row && lastMove.to[1] === col));
    const isCheckSq = isCheck && checkSquare && checkSquare[0] === row && checkSquare[1] === col;

    if (isCheckSq) return 'bg-red-500/60';
    if (isSelected) return isLight ? 'bg-amber-300' : 'bg-amber-600';
    if (isLastMove) return isLight ? 'bg-yellow-200/60' : 'bg-yellow-700/40';
    return isLight ? 'bg-[#F0EAD6]' : 'bg-[#355E3B]';
  };

  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  const displayRows = flipped ? [...Array(8).keys()].reverse() : [...Array(8).keys()];
  const displayCols = flipped ? [...Array(8).keys()].reverse() : [...Array(8).keys()];

  return (
    <div className="relative">
      {/* Board shadow and border */}
      <div className="rounded-lg overflow-hidden shadow-2xl border-2 border-[#8B6914]/30">
        <div className="grid grid-cols-8" style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gridTemplateRows: 'repeat(8, 1fr)', width: '100%', aspectRatio: '1 / 1' }}>
          {displayRows.map((row) =>
            displayCols.map((col) => {
              const piece = board[row][col];
              const isLegal = legalMoves.some(([r, c]) => r === row && c === col);
              const hasCapture = isLegal && piece;

              return (
                <div
                  key={`${row}-${col}`}
                  className={`relative flex items-center justify-center cursor-pointer transition-colors duration-150 ${getSquareColor(row, col)}`}
                  onClick={() => onSquareClick(row, col)}
                >
                  {/* Coordinates */}
                  {col === (flipped ? 7 : 0) && (
                    <span className="absolute top-0.5 left-0.5 text-[8px] font-semibold opacity-40 select-none">
                      {ranks[row]}
                    </span>
                  )}
                  {row === (flipped ? 0 : 7) && (
                    <span className="absolute bottom-0.5 right-0.5 text-[8px] font-semibold opacity-40 select-none">
                      {files[col]}
                    </span>
                  )}

                  {/* Legal move indicator */}
                  {isLegal && !hasCapture && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-[26%] h-[26%] rounded-full bg-black/20" />
                    </div>
                  )}

                  {/* Capture indicator */}
                  {hasCapture && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-full h-full rounded-full border-[3px] border-black/25" />
                    </div>
                  )}

                  {/* Piece */}
                  {piece && (
                    <div className="relative z-10">
                      <PieceRenderer piece={piece} />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}