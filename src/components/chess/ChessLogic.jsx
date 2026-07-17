// Chess game logic engine
const PIECES = {
  K: 'king', Q: 'queen', R: 'rook', B: 'bishop', N: 'knight', P: 'pawn',
  k: 'king', q: 'queen', r: 'rook', b: 'bishop', n: 'knight', p: 'pawn'
};

const PIECE_VALUES = { pawn: 1, knight: 3, bishop: 3, rook: 5, queen: 9, king: 100 };

export function createInitialBoard() {
  return [
    ['r','n','b','q','k','b','n','r'],
    ['p','p','p','p','p','p','p','p'],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    ['P','P','P','P','P','P','P','P'],
    ['R','N','B','Q','K','B','N','R'],
  ];
}

export function isWhite(piece) {
  return piece && piece === piece.toUpperCase();
}

export function isBlack(piece) {
  return piece && piece === piece.toLowerCase();
}

export function getPieceColor(piece) {
  if (!piece) return null;
  return isWhite(piece) ? 'white' : 'black';
}

export function getPieceName(piece) {
  if (!piece) return null;
  return PIECES[piece];
}

export function getPieceValue(piece) {
  return PIECE_VALUES[getPieceName(piece)] || 0;
}

function isInBounds(r, c) {
  return r >= 0 && r < 8 && c >= 0 && c < 8;
}

function isEnemy(piece, targetPiece) {
  if (!piece || !targetPiece) return false;
  return isWhite(piece) !== isWhite(targetPiece);
}

function isFriendly(piece, targetPiece) {
  if (!piece || !targetPiece) return false;
  return isWhite(piece) === isWhite(targetPiece);
}

function getRawMoves(board, row, col, enPassantTarget, castlingRights) {
  const piece = board[row][col];
  if (!piece) return [];
  const moves = [];
  const name = getPieceName(piece);
  const white = isWhite(piece);
  const dir = white ? -1 : 1;

  if (name === 'pawn') {
    const startRow = white ? 6 : 1;
    // Forward
    if (isInBounds(row + dir, col) && !board[row + dir][col]) {
      moves.push([row + dir, col]);
      if (row === startRow && !board[row + 2 * dir][col]) {
        moves.push([row + 2 * dir, col]);
      }
    }
    // Captures
    for (const dc of [-1, 1]) {
      const nr = row + dir, nc = col + dc;
      if (isInBounds(nr, nc)) {
        if (board[nr][nc] && isEnemy(piece, board[nr][nc])) {
          moves.push([nr, nc]);
        }
        // En passant
        if (enPassantTarget && enPassantTarget[0] === nr && enPassantTarget[1] === nc) {
          moves.push([nr, nc]);
        }
      }
    }
  } else if (name === 'knight') {
    const offsets = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
    for (const [dr, dc] of offsets) {
      const nr = row + dr, nc = col + dc;
      if (isInBounds(nr, nc) && !isFriendly(piece, board[nr][nc])) {
        moves.push([nr, nc]);
      }
    }
  } else if (name === 'bishop' || name === 'rook' || name === 'queen') {
    const dirs = [];
    if (name === 'bishop' || name === 'queen') dirs.push([-1,-1],[-1,1],[1,-1],[1,1]);
    if (name === 'rook' || name === 'queen') dirs.push([-1,0],[1,0],[0,-1],[0,1]);
    for (const [dr, dc] of dirs) {
      let nr = row + dr, nc = col + dc;
      while (isInBounds(nr, nc)) {
        if (board[nr][nc]) {
          if (isEnemy(piece, board[nr][nc])) moves.push([nr, nc]);
          break;
        }
        moves.push([nr, nc]);
        nr += dr; nc += dc;
      }
    }
  } else if (name === 'king') {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const nr = row + dr, nc = col + dc;
        if (isInBounds(nr, nc) && !isFriendly(piece, board[nr][nc])) {
          moves.push([nr, nc]);
        }
      }
    }
    // Castling
    if (castlingRights) {
      const color = white ? 'white' : 'black';
      const homeRow = white ? 7 : 0;
      if (row === homeRow && col === 4) {
        // Kingside
        if (castlingRights[color + 'Kingside'] && !board[homeRow][5] && !board[homeRow][6] && board[homeRow][7]) {
          if (!isSquareAttacked(board, homeRow, 4, !white) && !isSquareAttacked(board, homeRow, 5, !white) && !isSquareAttacked(board, homeRow, 6, !white)) {
            moves.push([homeRow, 6]);
          }
        }
        // Queenside
        if (castlingRights[color + 'Queenside'] && !board[homeRow][3] && !board[homeRow][2] && !board[homeRow][1] && board[homeRow][0]) {
          if (!isSquareAttacked(board, homeRow, 4, !white) && !isSquareAttacked(board, homeRow, 3, !white) && !isSquareAttacked(board, homeRow, 2, !white)) {
            moves.push([homeRow, 2]);
          }
        }
      }
    }
  }
  return moves;
}

export function isSquareAttacked(board, row, col, byWhite) {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (!p) continue;
      if (isWhite(p) !== byWhite) continue;
      const moves = getRawMoves(board, r, c, null, null);
      if (moves.some(([mr, mc]) => mr === row && mc === col)) return true;
    }
  }
  return false;
}

function findKing(board, white) {
  const king = white ? 'K' : 'k';
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c] === king) return [r, c];
    }
  }
  return null;
}

export function isInCheck(board, white) {
  const kp = findKing(board, white);
  if (!kp) return false;
  return isSquareAttacked(board, kp[0], kp[1], !white);
}

function simulateMove(board, fromR, fromC, toR, toC) {
  const newBoard = board.map(row => [...row]);
  newBoard[toR][toC] = newBoard[fromR][fromC];
  newBoard[fromR][fromC] = null;
  return newBoard;
}

export function getLegalMoves(board, row, col, enPassantTarget, castlingRights) {
  const piece = board[row][col];
  if (!piece) return [];
  const white = isWhite(piece);
  const rawMoves = getRawMoves(board, row, col, enPassantTarget, castlingRights);
  
  return rawMoves.filter(([toR, toC]) => {
    const simBoard = simulateMove(board, row, col, toR, toC);
    // Handle en passant capture removal
    if (getPieceName(piece) === 'pawn' && enPassantTarget && toR === enPassantTarget[0] && toC === enPassantTarget[1]) {
      simBoard[row][toC] = null;
    }
    return !isInCheck(simBoard, white);
  });
}

export function getAllLegalMoves(board, white, enPassantTarget, castlingRights) {
  const moves = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece) continue;
      if (isWhite(piece) !== white) continue;
      const legalMoves = getLegalMoves(board, r, c, enPassantTarget, castlingRights);
      for (const [toR, toC] of legalMoves) {
        moves.push({ from: [r, c], to: [toR, toC] });
      }
    }
  }
  return moves;
}

export function isCheckmate(board, white, enPassantTarget, castlingRights) {
  return isInCheck(board, white) && getAllLegalMoves(board, white, enPassantTarget, castlingRights).length === 0;
}

export function isStalemate(board, white, enPassantTarget, castlingRights) {
  return !isInCheck(board, white) && getAllLegalMoves(board, white, enPassantTarget, castlingRights).length === 0;
}

export function makeMove(board, fromR, fromC, toR, toC, enPassantTarget, castlingRights) {
  const newBoard = board.map(row => [...row]);
  const piece = newBoard[fromR][fromC];
  const captured = newBoard[toR][toC];
  const white = isWhite(piece);
  let newEnPassant = null;
  const newCastling = { ...castlingRights };
  let capturedPiece = captured;

  // En passant capture
  if (getPieceName(piece) === 'pawn' && enPassantTarget && toR === enPassantTarget[0] && toC === enPassantTarget[1]) {
    capturedPiece = newBoard[fromR][toC];
    newBoard[fromR][toC] = null;
  }

  // Pawn double move - set en passant target
  if (getPieceName(piece) === 'pawn' && Math.abs(toR - fromR) === 2) {
    newEnPassant = [(fromR + toR) / 2, fromC];
  }

  // Castling move
  if (getPieceName(piece) === 'king' && Math.abs(toC - fromC) === 2) {
    const homeRow = white ? 7 : 0;
    if (toC === 6) { // Kingside
      newBoard[homeRow][5] = newBoard[homeRow][7];
      newBoard[homeRow][7] = null;
    } else if (toC === 2) { // Queenside
      newBoard[homeRow][3] = newBoard[homeRow][0];
      newBoard[homeRow][0] = null;
    }
  }

  // Update castling rights
  if (getPieceName(piece) === 'king') {
    if (white) { newCastling.whiteKingside = false; newCastling.whiteQueenside = false; }
    else { newCastling.blackKingside = false; newCastling.blackQueenside = false; }
  }
  if (getPieceName(piece) === 'rook') {
    if (fromR === 7 && fromC === 0) newCastling.whiteQueenside = false;
    if (fromR === 7 && fromC === 7) newCastling.whiteKingside = false;
    if (fromR === 0 && fromC === 0) newCastling.blackQueenside = false;
    if (fromR === 0 && fromC === 7) newCastling.blackKingside = false;
  }

  // Move piece
  newBoard[toR][toC] = piece;
  newBoard[fromR][fromC] = null;

  // Pawn promotion (auto-queen)
  if (getPieceName(piece) === 'pawn') {
    if ((white && toR === 0) || (!white && toR === 7)) {
      newBoard[toR][toC] = white ? 'Q' : 'q';
    }
  }

  return { board: newBoard, captured: capturedPiece, enPassant: newEnPassant, castling: newCastling };
}

// Simple AI using minimax with alpha-beta pruning
function evaluateBoard(board) {
  let score = 0;
  const centerBonus = [[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0.1,0.15,0.15,0.1,0,0],[0,0,0.15,0.25,0.25,0.15,0,0],[0,0,0.15,0.25,0.25,0.15,0,0],[0,0,0.1,0.15,0.15,0.1,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0]];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece) continue;
      const val = getPieceValue(piece) + centerBonus[r][c];
      score += isWhite(piece) ? val : -val;
    }
  }
  return score;
}

function minimax(board, depth, alpha, beta, maximizing, enPassant, castling) {
  if (depth === 0) return evaluateBoard(board);
  
  const moves = getAllLegalMoves(board, maximizing, enPassant, castling);
  if (moves.length === 0) {
    if (isInCheck(board, maximizing)) return maximizing ? -1000 : 1000;
    return 0;
  }

  if (maximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      const result = makeMove(board, move.from[0], move.from[1], move.to[0], move.to[1], enPassant, castling);
      const eval_ = minimax(result.board, depth - 1, alpha, beta, false, result.enPassant, result.castling);
      maxEval = Math.max(maxEval, eval_);
      alpha = Math.max(alpha, eval_);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      const result = makeMove(board, move.from[0], move.from[1], move.to[0], move.to[1], enPassant, castling);
      const eval_ = minimax(result.board, depth - 1, alpha, beta, true, result.enPassant, result.castling);
      minEval = Math.min(minEval, eval_);
      beta = Math.min(beta, eval_);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

function isSquareAttackedByWhite(board, row, col) {
  return isSquareAttacked(board, row, col, true);
}

export function getAIMove(board, enPassant, castling, difficulty = 2) {
  const moves = getAllLegalMoves(board, false, enPassant, castling);
  if (moves.length === 0) return null;

  // Novice mode: deliberately play badly - move pieces to squares where they can be captured
  if (difficulty === 0) {
    // Shuffle moves for randomness
    const shuffled = [...moves].sort(() => Math.random() - 0.5);

    // Tier 1: Move a valuable piece to a square where it can be captured (sacrifice)
    const sacrificeMoves = shuffled.filter(move => {
      const result = makeMove(board, move.from[0], move.from[1], move.to[0], move.to[1], enPassant, castling);
      const pieceValue = getPieceValue(board[move.from[0]][move.from[1]]);
      return isSquareAttackedByWhite(result.board, move.to[0], move.to[1]) && pieceValue >= 3;
    });
    if (sacrificeMoves.length > 0) return sacrificeMoves[0];

    // Tier 2: Move ANY piece to a square where it can be captured
    const blunderMoves = shuffled.filter(move => {
      const result = makeMove(board, move.from[0], move.from[1], move.to[0], move.to[1], enPassant, castling);
      return isSquareAttackedByWhite(result.board, move.to[0], move.to[1]);
    });
    if (blunderMoves.length > 0) return blunderMoves[0];

    // Tier 3: Just pick a random move
    return shuffled[0];
  }

  let bestMove = moves[0];
  let bestEval = Infinity;

  for (const move of moves) {
    const result = makeMove(board, move.from[0], move.from[1], move.to[0], move.to[1], enPassant, castling);
    const eval_ = minimax(result.board, difficulty, -Infinity, Infinity, true, result.enPassant, result.castling);
    if (eval_ < bestEval) {
      bestEval = eval_;
      bestMove = move;
    }
  }

  // Low difficulties sometimes skip the best move and play a random legal
  // move instead — simulates a weak human who doesn't always grab material.
  const blunderChance = difficulty === 1 ? 0.5 : difficulty === 2 ? 0.2 : 0;
  if (blunderChance > 0 && Math.random() < blunderChance && moves.length > 1) {
    const random = moves[Math.floor(Math.random() * moves.length)];
    return random;
  }

  return bestMove;
}

export const INITIAL_CASTLING = {
  whiteKingside: true, whiteQueenside: true,
  blackKingside: true, blackQueenside: true
};