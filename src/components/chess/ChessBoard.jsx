import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PieceRenderer from './PieceRenderer';

export default function ChessBoard({ board, selectedSquare, legalMoves, onSquareClick, lastMove, isCheck, checkSquare, flipped = false }) {
  const boardRef = useRef(null);
  const [animPiece, setAnimPiece] = useState(null); // { piece, fromPx, toPx }
  const prevLastMove = useRef(null);

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

  // Get pixel center of a board square relative to the board container
  const getSquarePx = (row, col) => {
    if (!boardRef.current) return null;
    const rect = boardRef.current.getBoundingClientRect();
    const sqW = rect.width / 8;
    const sqH = rect.height / 8;

    const displayRow = flipped ? 7 - row : row;
    const displayCol = flipped ? 7 - col : col;

    return {
      x: displayCol * sqW + sqW / 2,
      y: displayRow * sqH + sqH / 2,
      size: sqW,
    };
  };

  useEffect(() => {
    if (!lastMove) return;
    const prev = prevLastMove.current;
    // Only animate when a new move is detected
    if (prev && prev.from[0] === lastMove.from[0] && prev.from[1] === lastMove.from[1] &&
        prev.to[0] === lastMove.to[0] && prev.to[1] === lastMove.to[1]) return;

    prevLastMove.current = lastMove;

    const from = getSquarePx(lastMove.from[0], lastMove.from[1]);
    const to = getSquarePx(lastMove.to[0], lastMove.to[1]);
    if (!from || !to) return;

    // The piece is already placed at the destination on the board, so we animate an overlay
    const piece = board[lastMove.to[0]][lastMove.to[1]];
    if (!piece) return;

    setAnimPiece({ piece, from, to });
  }, [lastMove]);

  const isAnimatingSquare = animPiece && lastMove &&
    lastMove.to[0] !== undefined; // hide destination piece while animating

  return (
    <div className="relative w-full h-full" ref={boardRef}>
      {/* Board shadow and border */}
      <div className="rounded-lg overflow-hidden shadow-2xl border-2 border-[#8B6914]/30 w-full h-full">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gridTemplateRows: 'repeat(8, 1fr)', width: '100%', height: '100%' }}>
          {displayRows.map((row) =>
            displayCols.map((col) => {
              const piece = board[row][col];
              const isLegal = legalMoves.some(([r, c]) => r === row && c === col);
              const hasCapture = isLegal && piece;
              // Hide the destination piece while slide animation is playing
              const isAnimDest = animPiece && lastMove && lastMove.to[0] === row && lastMove.to[1] === col;

              return (
                <div
                  key={`${row}-${col}`}
                  className={`relative flex items-center justify-center cursor-pointer transition-colors duration-150 ${getSquareColor(row, col)}`}
                  style={{ aspectRatio: '1 / 1' }}
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

                  {/* Piece — hidden at destination while animating */}
                  {piece && !isAnimDest && (
                    <div className="absolute inset-[6%] z-10 flex items-center justify-center">
                      <PieceRenderer piece={piece} size="fill" />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Sliding piece overlay */}
      <AnimatePresence>
        {animPiece && (
          <motion.div
            key={`${lastMove?.from}-${lastMove?.to}-${Date.now()}`}
            className="absolute pointer-events-none z-20 flex items-center justify-center"
            style={{
              width: animPiece.from.size * 0.88,
              height: animPiece.from.size * 0.88,
              top: animPiece.from.y - animPiece.from.size * 0.44,
              left: animPiece.from.x - animPiece.from.size * 0.44,
            }}
            initial={{ x: 0, y: 0 }}
            animate={{
              x: animPiece.to.x - animPiece.from.x,
              y: animPiece.to.y - animPiece.from.y,
            }}
            transition={{ type: 'spring', stiffness: 420, damping: 36, mass: 0.8 }}
            onAnimationComplete={() => setAnimPiece(null)}
          >
            <PieceRenderer piece={animPiece.piece} size="fill" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}