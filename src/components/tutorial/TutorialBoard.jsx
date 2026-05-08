import React, { useState } from 'react';
import PieceRenderer from '../chess/PieceRenderer';
import { getLegalMoves, getPieceColor } from '../chess/ChessLogic';

export default function TutorialBoard({ board: initialBoard, lesson, onSuccess }) {
  const [board, setBoard] = useState(initialBoard.map(r => [...r]));
  const [selected, setSelected] = useState(null);
  const [legalMoves, setLegalMoves] = useState([]);
  const [succeeded, setSucceeded] = useState(false);

  const playerColor = lesson.playerColor || 'white';

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
          // Accept any legal move for free-form lessons
          const newBoard = board.map(r => [...r]);
          newBoard[row][col] = newBoard[selR][selC];
          newBoard[selR][selC] = null;
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
        const moves = getLegalMoves(board, row, col, null, {
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
      const moves = getLegalMoves(board, row, col, null, {
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