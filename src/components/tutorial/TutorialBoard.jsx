import React, { useState } from 'react';
import PieceRenderer from '../chess/PieceRenderer';
import { getLegalMoves, getPieceColor, getPieceName, isWhite } from '../chess/ChessLogic';
import { useSkin } from '@/lib/skinContext';
import { BOARD_SKINS } from '@/lib/storeCatalog';

export default function TutorialBoard({ board: initialBoard, lesson, onSuccess }) {
  const [board, setBoard] = useState(initialBoard.map(r => [...r]));
  const [selected, setSelected] = useState(null);
  const [legalMoves, setLegalMoves] = useState([]);
  const [succeeded, setSucceeded] = useState(false);

  const playerColor = lesson.playerColor || 'white';
  const enPassantTarget = lesson.enPassantTarget || null;
  const { boardSkin } = useSkin();
  const skin = BOARD_SKINS[boardSkin] || BOARD_SKINS.classic;

  const handleClick = (row, col) => {
    if (succeeded) return;

    const piece = board[row][col];

    if (selected) {
      const [selR, selC] = selected;

      // Try to make the move if it's legal
      if (legalMoves.some(([r, c]) => r === row && c === col)) {
        // Check if this satisfies the lesson
        const isCorrect = !lesson.expectedMoves ||
          lesson.expectedMoves.some(([fr, fc, tr, tc]) => fr === selR && fc === selC && tr === row && tc === col);

        if (isCorrect || !lesson.expectedMoves) {
          const newBoard = board.map(r => [...r]);
          const movingPiece = newBoard[selR][selC];
          const pieceName = getPieceName(movingPiece);
          const isWhitePiece = isWhite(movingPiece);

          newBoard[row][col] = movingPiece;
          newBoard[selR][selC] = null;

          // Castling — move the rook too
          if (pieceName === 'king' && Math.abs(col - selC) === 2) {
            const homeRow = isWhitePiece ? 7 : 0;
            if (col === 6) {
              newBoard[homeRow][5] = newBoard[homeRow][7];
              newBoard[homeRow][7] = null;
            } else if (col === 2) {
              newBoard[homeRow][3] = newBoard[homeRow][0];
              newBoard[homeRow][0] = null;
            }
          }

          // En passant — remove the captured pawn
          if (pieceName === 'pawn' && enPassantTarget &&
              row === enPassantTarget[0] && col === enPassantTarget[1]) {
            newBoard[selR][col] = null;
          }

          // Pawn promotion — auto-queen
          if (pieceName === 'pawn') {
            if ((isWhitePiece && row === 0) || (!isWhitePiece && row === 7)) {
              newBoard[row][col] = isWhitePiece ? 'Q' : 'q';
            }
          }

          setBoard(newBoard);
          setSelected(null);
          setLegalMoves([]);
          setSucceeded(true);
          setTimeout(() => onSuccess(), 900);
        } else {
          // Wrong move — deselect
          setSelected(null);
          setLegalMoves([]);
        }
        return;
      }

      // Reselect own piece
      if (piece && getPieceColor(piece) === playerColor) {
        if (lesson.movingPiece && piece.toUpperCase() !== lesson.movingPiece) {
          setSelected(null);
          setLegalMoves([]);
          return;
        }
        const moves = getLegalMoves(board, row, col, enPassantTarget, {
          whiteKingside: true, whiteQueenside: true, blackKingside: true, blackQueenside: true
        });
        setSelected([row, col]);
        setLegalMoves(moves);
        return;
      }

      setSelected(null);
      setLegalMoves([]);
      return;
    }

    // Select own piece
    if (piece && getPieceColor(piece) === playerColor) {
      if (lesson.movingPiece && piece.toUpperCase() !== lesson.movingPiece) return;
      const moves = getLegalMoves(board, row, col, enPassantTarget, {
        whiteKingside: true, whiteQueenside: true, blackKingside: true, blackQueenside: true
      });
      setSelected([row, col]);
      setLegalMoves(moves);
    }
  };

  const getSquareBg = (row, col) => {
    const isLight = (row + col) % 2 === 0;
    const isSelected = selected && selected[0] === row && selected[1] === col;
    if (isSelected) return 'rgba(58,175,169,0.4)';
    return isLight ? skin.light : skin.dark;
  };

  const getSquareStyle = (row, col) => {
    const isSelected = selected && selected[0] === row && selected[1] === col;
    if (isSelected) return { boxShadow: 'inset 0 0 18px rgba(58,175,169,0.65)' };
    return {};
  };

  return (
    <div className="relative w-full aspect-square">
      <div
        className={`rounded-lg overflow-hidden w-full h-full transition-all duration-500 ${succeeded ? 'ring-2 ring-emerald-400/60' : ''}`}
        style={{ boxShadow: `0 0 40px ${skin.glow}, 0 8px 32px rgba(0,0,0,0.7)`, border: `1px solid ${skin.border}` }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gridTemplateRows: 'repeat(8, 1fr)', width: '100%', height: '100%' }}>
          {[...Array(8).keys()].map(row =>
            [...Array(8).keys()].map(col => {
              const piece = board[row][col];
              const isLegal = legalMoves.some(([r, c]) => r === row && c === col);
              const hasCapture = isLegal && piece;

              return (
                <div
                  key={`${row}-${col}`}
                  className="relative flex items-center justify-center cursor-pointer transition-all duration-150"
                  style={{ aspectRatio: '1 / 1', backgroundColor: getSquareBg(row, col), ...getSquareStyle(row, col) }}
                  onClick={() => handleClick(row, col)}
                >
                  {/* Legal move indicator */}
                  {isLegal && !hasCapture && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-[28%] h-[28%] rounded-full"
                        style={{ background: 'rgba(58,175,169,0.55)', boxShadow: '0 0 10px rgba(58,175,169,0.8)' }} />
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
                  {piece && (
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

      {/* Success overlay */}
      {succeeded && (
        <div className="absolute inset-0 rounded-lg flex items-center justify-center pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(52,211,153,0.18) 0%, transparent 70%)' }}>
          <div className="text-4xl animate-bounce">✓</div>
        </div>
      )}
    </div>
  );
}