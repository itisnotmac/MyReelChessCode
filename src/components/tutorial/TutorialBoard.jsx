import React, { useState } from 'react';
import PieceRenderer from '../chess/PieceRenderer';
import { getLegalMoves, getPieceColor, getPieceName, isWhite } from '../chess/ChessLogic';

export default function TutorialBoard({ board: initialBoard, lesson, onSuccess }) {
  const [board, setBoard] = useState(initialBoard.map(r => [...r]));
  const [selected, setSelected] = useState(null);
  const [legalMoves, setLegalMoves] = useState([]);
  const [succeeded, setSucceeded] = useState(false);

  const playerColor = lesson.playerColor || 'white';
  const enPassantTarget = lesson.enPassantTarget || null;

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
        const moves = getLegalMoves(board, row, col, enPassantTarget, {
          whiteKingSide: true, whiteQueenSide: true, blackKingSide: true, blackQueenSide: true
        });
        // For free-form lessons, only allow the designated moving piece
        if (lesson.movingPiece && piece.toUpperCase() !== lesson.movingPiece) {
          setSelected(null);
          setLegalMoves([]);
          return;
        }
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
        whiteKingSide: true, whiteQueenSide: true, blackKingSide: true, blackQueenSide: true
      });
      setSelected([row, col]);
      setLegalMoves(moves);
    }
  };

  const getSquareStyle = (row, col) => {
    const isLight = (row + col) % 2 === 0;
    const isSel = selected && selected[0] === row && selected[1] === col;
    const isLegal = legalMoves.some(([r, c]) => r === row && c === col);

    if (isSel) return isLight ? 'bg-amber-300' : 'bg-amber-600';
    if (isLegal) return isLight ? 'bg-[#a8e6a3]' : 'bg-[#4a9645]';
    return isLight ? 'bg-[#F0EAD6]' : 'bg-[#355E3B]';
  };

  return (
    <div className="relative w-full aspect-square">
      <div
        className={`rounded-lg overflow-hidden shadow-2xl border-2 w-full h-full transition-all duration-500 ${succeeded ? 'border-emerald-400/60' : 'border-[#8B6914]/30'}`}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gridTemplateRows: 'repeat(8, 1fr)' }}
      >
        {[...Array(8).keys()].map(row =>
          [...Array(8).keys()].map(col => {
            const piece = board[row][col];
            const isLegal = legalMoves.some(([r, c]) => r === row && c === col);
            const hasCapture = isLegal && piece;

            return (
              <div
                key={`${row}-${col}`}
                className={`relative flex items-center justify-center cursor-pointer transition-colors duration-150 ${getSquareStyle(row, col)}`}
                onClick={() => handleClick(row, col)}
              >
                {isLegal && !hasCapture && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-[26%] h-[26%] rounded-full bg-black/20" />
                  </div>
                )}
                {hasCapture && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-full h-full rounded-full border-[3px] border-black/25" />
                  </div>
                )}
                {piece && (
                  <div className="absolute inset-[6%] z-10 flex items-center justify-center">
                    <PieceRenderer piece={piece} size="fill" />
                  </div>
                )}
              </div>
            );
          })
        )}
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