import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import ChessBoard from '../components/chess/ChessBoard';
import CapturedPieces from '../components/chess/CapturedPieces';
import BattleCutscene from '../components/chess/BattleCutscene';
import GameOverModal from '../components/chess/GameOverModal';
import TurnIndicator from '../components/chess/TurnIndicator';
import {
  createInitialBoard,
  getLegalMoves,
  makeMove,
  isInCheck,
  isCheckmate,
  isStalemate,
  getAIMove,
  getPieceColor,
  isWhite as isWhitePiece,
  INITIAL_CASTLING
} from '../components/chess/ChessLogic';

export default function Game() {
  const navigate = useNavigate();
  // Store mode in a ref so screen rotation / re-renders don't re-read it
  const modeRef = useRef(new URLSearchParams(window.location.search).get('mode') || 'ai');
  const mode = modeRef.current;

  const [board, setBoard] = useState(createInitialBoard());
  const [isWhiteTurn, setIsWhiteTurn] = useState(true);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [legalMoves, setLegalMoves] = useState([]);
  const [enPassant, setEnPassant] = useState(null);
  const [castling, setCastling] = useState({ ...INITIAL_CASTLING });
  const [capturedWhite, setCapturedWhite] = useState([]);
  const [capturedBlack, setCapturedBlack] = useState([]);
  const [lastMove, setLastMove] = useState(null);
  const [gameOver, setGameOver] = useState(null);
  const [isThinking, setIsThinking] = useState(false);
  const [moveCount, setMoveCount] = useState(0);

  // Battle cutscene state
  const [battleInfo, setBattleInfo] = useState(null);
  const pendingMoveRef = useRef(null);
  // Guard to prevent AI from firing multiple times
  const aiRunningRef = useRef(false);

  const findKingPosition = useCallback((boardState, white) => {
    const king = white ? 'K' : 'k';
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (boardState[r][c] === king) return [r, c];
      }
    }
    return null;
  }, []);

  const checkSquare = isInCheck(board, isWhiteTurn) ? findKingPosition(board, isWhiteTurn) : null;

  const executeMove = useCallback((fromR, fromC, toR, toC, currentBoard, currentEnPassant, currentCastling) => {
    const piece = currentBoard[fromR][fromC];
    const targetPiece = currentBoard[toR][toC];
    
    // Check for en passant capture
    const pieceName = piece?.toLowerCase();
    const isEnPassantCapture = pieceName === 'p' && currentEnPassant && 
      toR === currentEnPassant[0] && toC === currentEnPassant[1];
    const capturedByEnPassant = isEnPassantCapture ? currentBoard[fromR][toC] : null;
    const captured = targetPiece || capturedByEnPassant;

    if (captured) {
      // Store pending move data and trigger cutscene
      pendingMoveRef.current = { fromR, fromC, toR, toC, currentBoard, currentEnPassant, currentCastling, captured };
      setBattleInfo({ attacker: piece, defender: captured });
      return;
    }

    // No capture, just make the move
    finishMove(fromR, fromC, toR, toC, currentBoard, currentEnPassant, currentCastling, null);
  }, []);

  const finishMove = useCallback((fromR, fromC, toR, toC, currentBoard, currentEnPassant, currentCastling, captured) => {
    const movingPiece = currentBoard[fromR][fromC];
    const movedByWhite = isWhitePiece(movingPiece);
    const nextWhite = !movedByWhite;

    const result = makeMove(currentBoard, fromR, fromC, toR, toC, currentEnPassant, currentCastling);
    
    if (captured) {
      if (isWhitePiece(captured)) {
        setCapturedWhite(prev => [...prev, captured]);
      } else {
        setCapturedBlack(prev => [...prev, captured]);
      }
    }

    setBoard(result.board);
    setEnPassant(result.enPassant);
    setCastling(result.castling);
    setLastMove({ from: [fromR, fromC], to: [toR, toC] });
    setSelectedSquare(null);
    setLegalMoves([]);
    setMoveCount(prev => prev + 1);
    setIsWhiteTurn(nextWhite);

    // Check game end
    if (isCheckmate(result.board, nextWhite, result.enPassant, result.castling)) {
      setGameOver(nextWhite ? 'black_wins' : 'white_wins');
    } else if (isStalemate(result.board, nextWhite, result.enPassant, result.castling)) {
      setGameOver('draw');
    }
  }, []);

  const handleBattleComplete = useCallback(() => {
    const pending = pendingMoveRef.current;
    if (pending) {
      finishMove(
        pending.fromR, pending.fromC, pending.toR, pending.toC,
        pending.currentBoard, pending.currentEnPassant, pending.currentCastling,
        pending.captured
      );
      pendingMoveRef.current = null;
    }
    setBattleInfo(null);
  }, [finishMove]);

  const handleSquareClick = useCallback((row, col) => {
    if (gameOver || battleInfo || isThinking) return;

    const piece = board[row][col];

    // If we already have a piece selected
    if (selectedSquare) {
      const [selR, selC] = selectedSquare;
      
      // Check if this is a legal move
      if (legalMoves.some(([r, c]) => r === row && c === col)) {
        executeMove(selR, selC, row, col, board, enPassant, castling);
        return;
      }
      
      // Click on own piece - reselect
      if (piece && getPieceColor(piece) === (isWhiteTurn ? 'white' : 'black')) {
        const moves = getLegalMoves(board, row, col, enPassant, castling);
        setSelectedSquare([row, col]);
        setLegalMoves(moves);
        return;
      }

      // Click on empty/enemy without legal move - deselect
      setSelectedSquare(null);
      setLegalMoves([]);
      return;
    }

    // No piece selected - select own piece
    if (piece && getPieceColor(piece) === (isWhiteTurn ? 'white' : 'black')) {
      // In AI mode, only allow selecting white pieces
      if (mode === 'ai' && !isWhitePiece(piece)) return;
      
      const moves = getLegalMoves(board, row, col, enPassant, castling);
      setSelectedSquare([row, col]);
      setLegalMoves(moves);
    }
  }, [board, selectedSquare, legalMoves, isWhiteTurn, gameOver, battleInfo, isThinking, enPassant, castling, mode, executeMove]);

  // AI move — only depend on isWhiteTurn/gameOver/battleInfo to avoid re-firing on board state changes
  useEffect(() => {
    if (mode !== 'ai' || isWhiteTurn || gameOver || battleInfo) return;
    if (aiRunningRef.current) return;

    aiRunningRef.current = true;
    setIsThinking(true);

    // Capture current state values in local variables so the timeout closure is stable
    const currentBoard = board;
    const currentEnPassant = enPassant;
    const currentCastling = castling;

    const timer = setTimeout(() => {
      const aiMove = getAIMove(currentBoard, currentEnPassant, currentCastling, 2);
      setIsThinking(false);
      aiRunningRef.current = false;
      if (aiMove) {
        executeMove(aiMove.from[0], aiMove.from[1], aiMove.to[0], aiMove.to[1], currentBoard, currentEnPassant, currentCastling);
      }
    }, 600);

    return () => {
      clearTimeout(timer);
      aiRunningRef.current = false;
      setIsThinking(false);
    };
  }, [isWhiteTurn, gameOver, battleInfo]); // eslint-disable-line react-hooks/exhaustive-deps

  const resetGame = () => {
    setBoard(createInitialBoard());
    setIsWhiteTurn(true);
    setSelectedSquare(null);
    setLegalMoves([]);
    setEnPassant(null);
    setCastling({ ...INITIAL_CASTLING });
    setCapturedWhite([]);
    setCapturedBlack([]);
    setLastMove(null);
    setGameOver(null);
    setIsThinking(false);
    setBattleInfo(null);
    pendingMoveRef.current = null;
    aiRunningRef.current = false;
    setMoveCount(0);
  };

  const shouldFlip = mode === 'local' && !isWhiteTurn;

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <button
          onClick={() => navigate(createPageUrl('Lobby'))}
          className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/60"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="text-center">
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37]/60 font-medium">
            {mode === 'ai' ? 'VS AI' : 'LOCAL'}
          </p>
          <p className="text-[10px] text-white/20">Move {moveCount}</p>
        </div>
        <button
          onClick={resetGame}
          className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/60"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Black captured pieces (top) */}
      <div className="px-4 py-1">
        <CapturedPieces pieces={shouldFlip ? capturedBlack : capturedWhite} color={shouldFlip ? 'black' : 'white'} />
      </div>

      {/* Turn indicator */}
      <div className="px-4 py-2">
        <TurnIndicator
          isWhiteTurn={isWhiteTurn}
          isCheck={isInCheck(board, isWhiteTurn)}
          mode={mode}
          isThinking={isThinking}
        />
      </div>

      {/* Chess Board */}
      <div className="flex-1 flex items-center justify-center px-4 py-2">
        <div className="w-full max-w-[400px]">
          <ChessBoard
            board={board}
            selectedSquare={selectedSquare}
            legalMoves={legalMoves}
            onSquareClick={handleSquareClick}
            lastMove={lastMove}
            isCheck={isInCheck(board, isWhiteTurn)}
            checkSquare={checkSquare}
            flipped={shouldFlip}
          />
        </div>
      </div>

      {/* White captured pieces (bottom) */}
      <div className="px-4 py-1">
        <CapturedPieces pieces={shouldFlip ? capturedWhite : capturedBlack} color={shouldFlip ? 'white' : 'black'} />
      </div>

      {/* Bottom padding */}
      <div className="h-6" />

      {/* Battle Cutscene */}
      <AnimatePresence>
        {battleInfo && (
          <BattleCutscene
            attacker={battleInfo.attacker}
            defender={battleInfo.defender}
            onComplete={handleBattleComplete}
          />
        )}
      </AnimatePresence>

      {/* Game Over Modal */}
      {gameOver && (
        <GameOverModal
          result={gameOver}
          onRematch={resetGame}
          onHome={() => navigate(createPageUrl('Lobby'))}
        />
      )}
    </div>
  );
}