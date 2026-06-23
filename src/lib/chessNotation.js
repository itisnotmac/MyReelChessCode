import { getLegalMoves, getPieceName, isWhite } from '../components/chess/ChessLogic';

const FILES = 'abcdefgh';

export function squareName(row, col) {
  return FILES[col] + (8 - row);
}

export function toAlgebraicNotation(board, fromR, fromC, toR, toC, { captured, enPassant, castling, isCheck, isCheckmate }) {
  const piece = board[fromR][fromC];
  if (!piece) return squareName(toR, toC);

  const pieceName = getPieceName(piece);
  const white = isWhite(piece);

  // Castling
  if (pieceName === 'king' && Math.abs(toC - fromC) === 2) {
    let notation = toC === 6 ? 'O-O' : 'O-O-O';
    if (isCheckmate) notation += '#';
    else if (isCheck) notation += '+';
    return notation;
  }

  const isCapture = !!captured;
  const destSquare = squareName(toR, toC);

  let notation;

  if (pieceName === 'pawn') {
    if (isCapture) {
      notation = FILES[fromC] + 'x' + destSquare;
    } else {
      notation = destSquare;
    }
    if ((white && toR === 0) || (!white && toR === 7)) {
      notation += '=Q';
    }
  } else {
    const pieceLetter = piece.toUpperCase();

    // Disambiguation: find other pieces of the same type that can also reach the target
    const ambiguous = [];
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (r === fromR && c === fromC) continue;
        const otherPiece = board[r][c];
        if (!otherPiece) continue;
        if (isWhite(otherPiece) !== white) continue;
        if (getPieceName(otherPiece) !== pieceName) continue;
        const otherMoves = getLegalMoves(board, r, c, enPassant, castling);
        if (otherMoves.some(([mr, mc]) => mr === toR && mc === toC)) {
          ambiguous.push([r, c]);
        }
      }
    }

    let disambig = '';
    if (ambiguous.length > 0) {
      const sameFile = ambiguous.some(([, c]) => c === fromC);
      const sameRank = ambiguous.some(([r]) => r === fromR);
      if (!sameFile) {
        disambig = FILES[fromC];
      } else if (!sameRank) {
        disambig = String(8 - fromR);
      } else {
        disambig = squareName(fromR, fromC);
      }
    }

    notation = pieceLetter + disambig;
    if (isCapture) notation += 'x';
    notation += destSquare;
  }

  if (isCheckmate) notation += '#';
  else if (isCheck) notation += '+';

  return notation;
}