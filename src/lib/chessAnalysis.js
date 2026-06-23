import { getAllLegalMoves, makeMove, isWhite, getPieceValue, getPieceName, isInCheck, isCheckmate } from '../components/chess/ChessLogic';
import { toAlgebraicNotation } from './chessNotation';

const centerBonus = [
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [0,0,0.1,0.15,0.15,0.1,0,0],
  [0,0,0.15,0.25,0.25,0.15,0,0],
  [0,0,0.15,0.25,0.25,0.15,0,0],
  [0,0,0.1,0.15,0.15,0.1,0,0],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
];

function evaluateBoard(board) {
  let score = 0;
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

function getBestMove(board, isWhiteToMove, enPassant, castling, depth) {
  const moves = getAllLegalMoves(board, isWhiteToMove, enPassant, castling);
  if (moves.length === 0) return null;
  let bestMove = moves[0];
  let bestEval = isWhiteToMove ? -Infinity : Infinity;
  for (const move of moves) {
    const result = makeMove(board, move.from[0], move.from[1], move.to[0], move.to[1], enPassant, castling);
    const eval_ = minimax(result.board, depth - 1, -Infinity, Infinity, !isWhiteToMove, result.enPassant, result.castling);
    if (isWhiteToMove) {
      if (eval_ > bestEval) { bestEval = eval_; bestMove = move; }
    } else {
      if (eval_ < bestEval) { bestEval = eval_; bestMove = move; }
    }
  }
  return { bestMove, evaluation: bestEval };
}

function classifyMove(delta) {
  if (delta < 0.15) return 'best';
  if (delta < 0.5) return 'excellent';
  if (delta < 1.0) return 'inaccuracy';
  if (delta < 2.0) return 'mistake';
  return 'blunder';
}

function formatBestNotation(boardBefore, bestMove, movedByWhite, enPassant, castling) {
  const pieceName = getPieceName(boardBefore[bestMove.from[0]][bestMove.from[1]]);
  const targetPiece = boardBefore[bestMove.to[0]][bestMove.to[1]];
  const isEpCapture = pieceName === 'pawn' && enPassant &&
    bestMove.to[0] === enPassant[0] && bestMove.to[1] === enPassant[1] && !targetPiece;
  const captured = isEpCapture ? boardBefore[bestMove.from[0]][bestMove.to[1]] : targetPiece;

  const moveResult = makeMove(boardBefore, bestMove.from[0], bestMove.from[1], bestMove.to[0], bestMove.to[1], enPassant, castling);
  const isCheck = isInCheck(moveResult.board, !movedByWhite);
  const isMate = isCheckmate(moveResult.board, !movedByWhite, moveResult.enPassant, moveResult.castling);

  return toAlgebraicNotation(boardBefore, bestMove.from[0], bestMove.from[1], bestMove.to[0], bestMove.to[1], {
    captured: captured || null,
    enPassant,
    castling,
    isCheck: isCheck && !isMate,
    isCheckmate: isMate,
  });
}

export function analyzeMove(move, moveIndex, depth = 3) {
  const { boardBefore, from, to, movedByWhite, enPassantBefore, castlingBefore, notation } = move;

  const bestResult = getBestMove(boardBefore, movedByWhite, enPassantBefore, castlingBefore, depth);

  const playedResult = makeMove(boardBefore, from[0], from[1], to[0], to[1], enPassantBefore, castlingBefore);
  const playedEval = minimax(playedResult.board, depth - 1, -Infinity, Infinity, !movedByWhite, playedResult.enPassant, playedResult.castling);

  if (!bestResult) {
    return {
      moveNumber: moveIndex + 1,
      notation,
      playedEval,
      bestNotation: '',
      bestMove: null,
      isBestMove: true,
      delta: 0,
      classification: 'best',
      movedByWhite,
    };
  }

  const bestEval = bestResult.evaluation;
  const delta = Math.max(0, movedByWhite ? (bestEval - playedEval) : (playedEval - bestEval));
  const classification = classifyMove(delta);

  const bestMove = bestResult.bestMove;
  const isBestMove = bestMove.from[0] === from[0] && bestMove.from[1] === from[1] &&
                     bestMove.to[0] === to[0] && bestMove.to[1] === to[1];
  const bestNotation = isBestMove ? notation : formatBestNotation(boardBefore, bestMove, movedByWhite, enPassantBefore, castlingBefore);

  return {
    moveNumber: moveIndex + 1,
    notation,
    playedEval,
    bestNotation,
    bestMove: { from: bestMove.from, to: bestMove.to },
    isBestMove,
    delta,
    classification,
    movedByWhite,
  };
}