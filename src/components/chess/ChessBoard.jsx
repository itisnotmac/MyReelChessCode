import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PieceRenderer from './PieceRenderer';

// Returns the squares a piece travels through between from→to (exclusive of endpoints)
function getPathSquares(from, to) {
  const [fr, fc] = from;
  const [tr, tc] = to;
  const dr = tr - fr;
  const dc = tc - fc;
  const steps = Math.max(Math.abs(dr), Math.abs(dc));
  if (steps <= 1) return []; // adjacent or same — no intermediate squares
  const squares = [];
  for (let i = 1; i < steps; i++) {
    const r = fr + Math.round((dr / steps) * i);
    const c = fc + Math.round((dc / steps) * i);
    squares.push([r, c]);
  }
  return squares;
}

export default function ChessBoard({ board, selectedSquare, legalMoves, onSquareClick, lastMove, isCheck, checkSquare, flipped = false }) {
  const boardRef = useRef(null);
  const [animPiece, setAnimPiece] = useState(null);
  const [pulseKey, setPulseKey] = useState(0); // increment to re-trigger pulse animations
  const prevLastMove = useRef(null);

  const pathSquares = lastMove ? getPathSquares(lastMove.from, lastMove.to) : [];
  const pathSet = new Set(pathSquares.map(([r, c]) => `${r}-${c}`));

  const getSquareColor = (row, col) => {
    const isLight = (row + col) % 2 === 0;
    const isSelected = selectedSquare && selectedSquare[0] === row && selectedSquare[1] === col;
    const isCheckSq = isCheck && checkSquare && checkSquare[0] === row && checkSquare[1] === col;

    if (isCheckSq) return isLight ? 'bg-red-500/50' : 'bg-red-700/60';
    if (isSelected) return 'bg-[#3AAFA9]/40';
    return isLight ? 'bg-[#2e2e4e]' : 'bg-[#1a1a2e]';
  };

  const getSquareStyle = (row, col) => {
    const isSelected = selectedSquare && selectedSquare[0] === row && selectedSquare[1] === col;
    const isCheckSq = isCheck && checkSquare && checkSquare[0] === row && checkSquare[1] === col;
    if (isCheckSq) return { boxShadow: 'inset 0 0 18px rgba(239,68,68,0.7)' };
    if (isSelected) return { boxShadow: 'inset 0 0 18px rgba(58,175,169,0.65)' };
    return {};
  };

  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  const displayRows = flipped ? [...Array(8).keys()].reverse() : [...Array(8).keys()];
  const displayCols = flipped ? [...Array(8).keys()].reverse() : [...Array(8).keys()];

  const getSquarePx = (row, col) => {
    if (!boardRef.current) return null;
    const rect = boardRef.current.getBoundingClientRect();
    const sqW = rect.width / 8;
    const sqH = rect.height / 8;
    const displayRow = flipped ? 7 - row : row;
    const displayCol = flipped ? 7 - col : col;
    return { x: displayCol * sqW + sqW / 2, y: displayRow * sqH + sqH / 2, size: sqW };
  };

  useEffect(() => {
    if (!lastMove) return;
    const prev = prevLastMove.current;
    if (prev && prev.from[0] === lastMove.from[0] && prev.from[1] === lastMove.from[1] &&
        prev.to[0] === lastMove.to[0] && prev.to[1] === lastMove.to[1]) return;

    prevLastMove.current = lastMove;
    setPulseKey(k => k + 1);

    const from = getSquarePx(lastMove.from[0], lastMove.from[1]);
    const to = getSquarePx(lastMove.to[0], lastMove.to[1]);
    if (!from || !to) return;

    const piece = board[lastMove.to[0]][lastMove.to[1]];
    if (!piece) return;

    setAnimPiece({ piece, from, to });
  }, [lastMove]);

  const isFromSq = (row, col) => lastMove && lastMove.from[0] === row && lastMove.from[1] === col;
  const isToSq = (row, col) => lastMove && lastMove.to[0] === row && lastMove.to[1] === col;
  const isPathSq = (row, col) => pathSet.has(`${row}-${col}`);

  return (
    <div className="relative w-full h-full" ref={boardRef}>
      <div className="rounded-lg overflow-hidden w-full h-full" style={{ boxShadow: '0 0 40px rgba(58,175,169,0.15), 0 8px 32px rgba(0,0,0,0.7)', border: '1px solid rgba(58,175,169,0.25)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gridTemplateRows: 'repeat(8, 1fr)', width: '100%', height: '100%' }}>
          {displayRows.map((row) =>
            displayCols.map((col) => {
              const piece = board[row][col];
              const isLegal = legalMoves.some(([r, c]) => r === row && c === col);
              const hasCapture = isLegal && piece;
              const isAnimDest = animPiece && lastMove && lastMove.to[0] === row && lastMove.to[1] === col;
              const fromSq = isFromSq(row, col);
              const toSq = isToSq(row, col);
              const pathSq = isPathSq(row, col);

              return (
                <div
                  key={`${row}-${col}`}
                  className={`relative flex items-center justify-center cursor-pointer transition-all duration-150 ${getSquareColor(row, col)}`}
                  style={{ aspectRatio: '1 / 1', ...getSquareStyle(row, col) }}
                  onClick={() => onSquareClick(row, col)}
                >
                  {/* Coordinates */}
                  {col === (flipped ? 7 : 0) && (
                    <span className="absolute top-0.5 left-0.5 font-bold select-none text-[#3AAFA9]/50" style={{ fontSize: 10, textShadow: '0 0 6px rgba(58,175,169,0.4)' }}>
                      {ranks[row]}
                    </span>
                  )}
                  {row === (flipped ? 0 : 7) && (
                    <span className="absolute bottom-0.5 right-0.5 font-bold select-none text-[#3AAFA9]/50" style={{ fontSize: 10, textShadow: '0 0 6px rgba(58,175,169,0.4)' }}>
                      {files[col]}
                    </span>
                  )}

                  {/* LAST MOVE TRAIL OVERLAYS */}

                  {/* Origin square — soft pulse */}
                  {fromSq && (
                    <motion.div
                      key={`from-${pulseKey}`}
                      className="absolute inset-0 pointer-events-none"
                      style={{ background: 'rgba(212,175,55,0.18)', boxShadow: 'inset 0 0 14px rgba(212,175,55,0.35)' }}
                      animate={{ opacity: [0.7, 0.35, 0.7] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  )}

                  {/* Path squares — faint footprint dots */}
                  {pathSq && (
                    <motion.div
                      key={`path-${pulseKey}-${row}-${col}`}
                      className="absolute inset-0 flex items-center justify-center pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.6, 0.25] }}
                      transition={{ duration: 1.0, ease: 'easeOut' }}
                    >
                      <div
                        className="rounded-full"
                        style={{
                          width: '30%',
                          height: '30%',
                          background: 'rgba(212,175,55,0.45)',
                          boxShadow: '0 0 8px rgba(212,175,55,0.6)',
                        }}
                      />
                    </motion.div>
                  )}

                  {/* Destination square — heavy pulse */}
                  {toSq && (
                    <motion.div
                      key={`to-${pulseKey}`}
                      className="absolute inset-0 pointer-events-none"
                      style={{ background: 'rgba(212,175,55,0.22)' }}
                      animate={{
                        boxShadow: [
                          'inset 0 0 20px rgba(212,175,55,0.55), 0 0 12px rgba(212,175,55,0.3)',
                          'inset 0 0 36px rgba(212,175,55,0.85), 0 0 24px rgba(212,175,55,0.55)',
                          'inset 0 0 20px rgba(212,175,55,0.55), 0 0 12px rgba(212,175,55,0.3)',
                        ],
                      }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  )}

                  {/* Legal move indicator */}
                  {isLegal && !hasCapture && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-[28%] h-[28%] rounded-full"
                        style={{ background: 'rgba(58,175,169,0.55)', boxShadow: '0 0 10px rgba(58,175,169,0.8), 0 0 20px rgba(58,175,169,0.3)' }} />
                    </div>
                  )}

                  {/* Capture indicator */}
                  {hasCapture && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="absolute inset-0 rounded-none"
                        style={{ boxShadow: 'inset 0 0 0 3px rgba(58,175,169,0.7), inset 0 0 16px rgba(58,175,169,0.25)' }} />
                    </div>
                  )}

                  {/* Piece */}
                  {piece && !isAnimDest && (
                    <div className="absolute inset-[2%] z-10 flex items-center justify-center">
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