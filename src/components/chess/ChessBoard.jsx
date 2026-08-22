import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PieceRenderer from './PieceRenderer';
import { useSkin } from '@/lib/skinContext';
import { BOARD_SKINS } from '@/lib/storeCatalog';

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

export default function ChessBoard({ board, selectedSquare, legalMoves, onSquareClick, lastMove, isCheck, checkSquare, flipped = false, tournamentMode = false }) {
  const boardRef = useRef(null);
  const [animPiece, setAnimPiece] = useState(null);
  const [pulseKey, setPulseKey] = useState(0); // increment to re-trigger pulse animations
  const prevLastMove = useRef(null);
  const prevBoardRef = useRef(board);
  const prevCheckRef = useRef(false);

  const pathSquares = lastMove ? getPathSquares(lastMove.from, lastMove.to) : [];
  const pathSet = new Set(pathSquares.map(([r, c]) => `${r}-${c}`));

  const { boardSkin } = useSkin();
  const skin = BOARD_SKINS[boardSkin] || BOARD_SKINS.classic;
  const showCoords = localStorage.getItem('chessCoords') !== 'off';
  const showLastMove = localStorage.getItem('chessLastMove') !== 'off';
  const showMoveAnim = localStorage.getItem('chessMoveAnim') !== 'off';
  const hapticsEnabled = localStorage.getItem('chessHaptics') !== 'off';

  const getSquareBg = (row, col) => {
    const isLight = (row + col) % 2 === 0;
    const isSelected = selectedSquare && selectedSquare[0] === row && selectedSquare[1] === col;
    const isCheckSq = isCheck && checkSquare && checkSquare[0] === row && checkSquare[1] === col;

    if (isCheckSq) return isLight ? 'rgba(239,68,68,0.5)' : 'rgba(185,28,28,0.6)';
    if (isSelected) return 'rgba(58,175,169,0.4)';
    return isLight ? skin.light : skin.dark;
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

    // Haptic feedback on capture
    if (hapticsEnabled) {
      const prevBoard = prevBoardRef.current;
      const [tr, tc] = lastMove.to;
      if (prevBoard[tr] && prevBoard[tc] && prevBoard[tr][tc]) {
        navigator.vibrate?.(30);
      }
    }
    prevBoardRef.current = board;

    if (!showMoveAnim) return;

    const from = getSquarePx(lastMove.from[0], lastMove.from[1]);
    const to = getSquarePx(lastMove.to[0], lastMove.to[1]);
    if (!from || !to) return;

    const piece = board[lastMove.to[0]][lastMove.to[1]];
    if (!piece) return;

    setAnimPiece({ piece, from, to });
  }, [lastMove]);

  // Haptic feedback when king enters check
  useEffect(() => {
    if (hapticsEnabled && isCheck && !prevCheckRef.current) {
      navigator.vibrate?.([40, 30, 40]);
    }
    prevCheckRef.current = isCheck;
  }, [isCheck]);

  const isFromSq = (row, col) => lastMove && lastMove.from[0] === row && lastMove.from[1] === col;
  const isToSq = (row, col) => lastMove && lastMove.to[0] === row && lastMove.to[1] === col;
  const isPathSq = (row, col) => pathSet.has(`${row}-${col}`);

  return (
    <div className="relative w-full h-full" ref={boardRef}>
      <div className="rounded-lg overflow-hidden w-full h-full" style={{ boxShadow: `0 0 40px ${skin.glow}, 0 8px 32px rgba(0,0,0,0.7)`, border: `1px solid ${skin.border}` }}>
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
                  className="relative flex items-center justify-center cursor-pointer transition-all duration-150"
                  style={{ aspectRatio: '1 / 1', backgroundColor: getSquareBg(row, col), ...getSquareStyle(row, col) }}
                  onClick={() => onSquareClick(row, col)}
                >
                  {/* Coordinates */}
                  {showCoords && col === (flipped ? 7 : 0) && (
                    <span className="absolute top-0.5 left-0.5 font-bold select-none" style={{ fontSize: 10, color: skin.coords, textShadow: `0 0 6px ${skin.glow}` }}>
                      {ranks[row]}
                    </span>
                  )}
                  {showCoords && row === (flipped ? 0 : 7) && (
                    <span className="absolute bottom-0.5 right-0.5 font-bold select-none" style={{ fontSize: 10, color: skin.coords, textShadow: `0 0 6px ${skin.glow}` }}>
                      {files[col]}
                    </span>
                  )}

                  {/* LAST MOVE TRAIL OVERLAYS */}

                  {/* Origin square — soft gold pulse */}
                  {fromSq && !tournamentMode && showLastMove && (
                    <motion.div
                      key={`from-${pulseKey}`}
                      className="absolute inset-0 pointer-events-none z-[1]"
                      initial={{ opacity: 0.8 }}
                      animate={{ opacity: [0.8, 0.35, 0.8] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                      style={{ background: 'rgba(212,175,55,0.22)', boxShadow: 'inset 0 0 14px rgba(212,175,55,0.4)' }}
                    />
                  )}

                  {/* Path squares — faint footprint dots */}
                  {pathSq && !tournamentMode && showLastMove && (
                    <motion.div
                      key={`path-${pulseKey}-${row}-${col}`}
                      className="absolute inset-0 flex items-center justify-center pointer-events-none z-[1]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.8, 0.4] }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    >
                      <div
                        className="rounded-full"
                        style={{
                          width: '28%',
                          height: '28%',
                          background: 'rgba(212,175,55,0.55)',
                          boxShadow: '0 0 10px rgba(212,175,55,0.7)',
                        }}
                      />
                    </motion.div>
                  )}

                  {/* Destination square — heavy pulsing glow */}
                  {toSq && !tournamentMode && showLastMove && (
                    <motion.div
                      key={`to-${pulseKey}`}
                      className="absolute inset-0 pointer-events-none z-[1]"
                      initial={{ opacity: 1 }}
                      animate={{
                        opacity: [1, 0.6, 1],
                        boxShadow: [
                          'inset 0 0 22px rgba(212,175,55,0.65), 0 0 14px rgba(212,175,55,0.4)',
                          'inset 0 0 40px rgba(212,175,55,0.95), 0 0 28px rgba(212,175,55,0.65)',
                          'inset 0 0 22px rgba(212,175,55,0.65), 0 0 14px rgba(212,175,55,0.4)',
                        ],
                      }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                      style={{ background: 'rgba(212,175,55,0.28)' }}
                    />
                  )}

                  {/* Legal move indicator */}
                  {isLegal && !hasCapture && !tournamentMode && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-[28%] h-[28%] rounded-full"
                        style={{ background: 'rgba(58,175,169,0.55)', boxShadow: '0 0 10px rgba(58,175,169,0.8), 0 0 20px rgba(58,175,169,0.3)' }} />
                    </div>
                  )}

                  {/* Capture indicator */}
                  {hasCapture && !tournamentMode && (
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