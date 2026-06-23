import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ScrollText } from 'lucide-react';
import { createPageUrl } from '@/utils';
import GameMenu from '../components/chess/GameMenu';
import ChessBoard from '../components/chess/ChessBoard';
import ChessBoard3D from '../components/chess/ChessBoard3D';
import CapturedPieces from '../components/chess/CapturedPieces';
import BattleCutscene from '../components/chess/BattleCutscene';
import GameOverModal from '../components/chess/GameOverModal';
import TurnIndicator from '../components/chess/TurnIndicator';
import PlayerTimer from '../components/chess/PlayerTimer';
import MoveHistory from '../components/chess/MoveHistory';
import { toAlgebraicNotation } from '../lib/chessNotation';
import { stopMenuMusic } from '@/lib/menuMusic';
import { base44 } from '@/api/base44Client';
import { playMoveSound, playCheckSound, playGameOverSound, unlockAudio } from '@/lib/chessSound';
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

  // 2v2: track which sub-player within each team is active
  // Turn order: P1(white), P3(black), P2(white), P4(black), repeat
  // playerSlot cycles 0→1→2→3→0... slot 0=P1, 1=P3, 2=P2, 3=P4
  const [playerSlot, setPlayerSlot] = useState(0); // 0-indexed
  const PLAYER_NAMES = ['Player 1', 'Player 3', 'Player 2', 'Player 4'];
  const PLAYER_TEAMS = [0, 1, 0, 1]; // 0=Team A (white), 1=Team B (black)

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
  const [is3D, setIs3D] = useState(false);
  const [moveHistory, setMoveHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(() => localStorage.getItem('chessSound') !== 'off');
  const soundEnabledRef = useRef(soundEnabled);
  useEffect(() => { soundEnabledRef.current = soundEnabled; }, [soundEnabled]);

  const handleToggleSound = () => {
    setSoundEnabled(prev => {
      const next = !prev;
      localStorage.setItem('chessSound', next ? 'on' : 'off');
      return next;
    });
  };

  // Stop menu music when game starts
  useEffect(() => { stopMenuMusic(); }, []);

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

    // Detect castling (king moved 2 squares)
    const isCastling = movingPiece?.toLowerCase() === 'k' && Math.abs(toC - fromC) === 2;

    // Play move sound — skip for captures (cutscene has its own audio)
    if (soundEnabledRef.current && !captured) {
      playMoveSound(movingPiece, isCastling);
    }

    setBoard(result.board);
    setEnPassant(result.enPassant);
    setCastling(result.castling);
    setLastMove({ from: [fromR, fromC], to: [toR, toC] });
    setSelectedSquare(null);
    setLegalMoves([]);
    setMoveCount(prev => prev + 1);
    setIsWhiteTurn(nextWhite);
    if (mode === '2v2') setPlayerSlot(prev => (prev + 1) % 4);

    // Check game end
    const isMate = isCheckmate(result.board, nextWhite, result.enPassant, result.castling);
    const isStale = !isMate && isStalemate(result.board, nextWhite, result.enPassant, result.castling);
    const isCheckAfter = !isMate && !isStale && isInCheck(result.board, nextWhite);

    // Generate algebraic notation
    const notation = toAlgebraicNotation(currentBoard, fromR, fromC, toR, toC, {
      captured,
      enPassant: currentEnPassant,
      castling: currentCastling,
      isCheck: isCheckAfter,
      isCheckmate: isMate,
    });
    setMoveHistory(prev => [...prev, notation]);

    if (isMate) {
      const winner = nextWhite ? 'black_wins' : 'white_wins';
      setGameOver(winner);
      if (soundEnabledRef.current) playGameOverSound();
      base44.analytics.track({ eventName: 'game_completed', properties: { result: winner, mode, move_count: moveCount + 1 } });
      base44.analytics.track({ eventName: 'game_win', properties: { winner: nextWhite ? 'black' : 'white', mode, move_count: moveCount + 1 } });
    } else if (isStale) {
      setGameOver('draw');
      if (soundEnabledRef.current) playGameOverSound();
      base44.analytics.track({ eventName: 'game_completed', properties: { result: 'draw', mode, move_count: moveCount + 1 } });
    } else if (isCheckAfter) {
      if (soundEnabledRef.current) setTimeout(() => playCheckSound(), 120);
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
    unlockAudio(); // ensure AudioContext is running after user gesture
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
      // In 2v2 mode, only allow the current player's team color
      if (mode === '2v2' && isWhitePiece(piece) !== (PLAYER_TEAMS[playerSlot] === 0)) return;
      
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

    const difficultyDepth = { novice: 1, arrogant: 2, grandmaster: 4 };
    const storedDiff = localStorage.getItem('chessDifficulty') || 'arrogant';
    const depth = difficultyDepth[storedDiff] ?? 2;

    const timer = setTimeout(() => {
      const aiMove = getAIMove(currentBoard, currentEnPassant, currentCastling, depth);
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
    setPlayerSlot(0);
    setMoveHistory([]);
  };

  const shouldFlip = (mode === 'local' || mode === '2v2') && !isWhiteTurn;

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <GameMenu
          onHome={() => navigate(createPageUrl('Lobby'))}
          onReset={resetGame}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
        />
        <div className="text-center">
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37]/60 font-medium">
            {mode === 'ai' ? 'VS AI' : mode === '2v2' ? '2V2' : 'LOCAL'}
          </p>
          <p className="text-[10px] text-white/20">Move {moveCount}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowHistory(true)}
            className="rounded-lg bg-white/5 border border-white/10 flex items-center justify-center px-2.5 py-1.5 text-[#3AAFA9] hover:bg-[#3AAFA9]/10 transition-colors"
            title="Move History"
          >
            <ScrollText className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIs3D(v => !v)}
            className="rounded-lg bg-white/5 border border-white/10 flex flex-col items-center justify-center px-2 py-1 text-[#D4AF37]/70 hover:text-[#D4AF37] transition-colors leading-none"
            title={is3D ? 'Back to 2D' : 'Switch to 3D'}
          >
            {is3D ? (
              <>
                <span style={{ fontSize: '7px' }} className="tracking-widest uppercase text-[#D4AF37]/50">Back to</span>
                <span style={{ fontSize: '15px', fontFamily: "'Georgia', serif", fontWeight: 'bold', letterSpacing: '0.05em', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>2D</span>
              </>
            ) : (
              <>
                <span style={{ fontSize: '7px' }} className="tracking-widest uppercase text-[#D4AF37]/50">Switch to</span>
                <span style={{ fontSize: '15px', fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, serif", fontWeight: 'bold', fontStyle: 'italic', letterSpacing: '0.05em', textShadow: '1px 1px 0px #8B6914, 2px 2px 0px rgba(0,0,0,0.5)' }}>3D</span>
              </>
            )}
          </button>

        </div>
      </div>

      {/* Black captured pieces (top) */}
      <div className="px-4 py-1">
        <CapturedPieces pieces={shouldFlip ? capturedBlack : capturedWhite} color={shouldFlip ? 'black' : 'white'} />
      </div>

      {/* Timers */}
      <div className="px-4 pb-1 flex justify-between gap-2">
        <PlayerTimer isActive={!isWhiteTurn && !gameOver && !battleInfo} label="Black" />
        <PlayerTimer isActive={isWhiteTurn && !gameOver && !battleInfo} label="White" />
      </div>

      {/* Turn indicator */}
      <div className="px-4 py-2">
        <TurnIndicator
          isWhiteTurn={isWhiteTurn}
          isCheck={isInCheck(board, isWhiteTurn)}
          mode={mode}
          isThinking={isThinking}
          playerName={mode === '2v2' ? PLAYER_NAMES[playerSlot] : null}
          teamLabel={mode === '2v2' ? (PLAYER_TEAMS[playerSlot] === 0 ? 'Team A' : 'Team B') : null}
        />
      </div>

      {/* Chess Board */}
      <div className="flex-1 flex items-center justify-center px-4 py-2">
        <div style={{ width: 'min(92vw, 92vh, 480px)', height: 'min(92vw, 92vh, 480px)' }}>
          {is3D ? (
            <ChessBoard3D
              board={board}
              selectedSquare={selectedSquare}
              legalMoves={legalMoves}
              onSquareClick={handleSquareClick}
              lastMove={lastMove}
              checkSquare={checkSquare}
            />
          ) : (
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
          )}
        </div>
      </div>

      {/* White captured pieces (bottom) */}
      <div className="px-4 py-1">
        <CapturedPieces pieces={shouldFlip ? capturedWhite : capturedBlack} color={shouldFlip ? 'white' : 'black'} />
      </div>

      {/* Bottom padding */}
      <div className="h-6" />

      {/* Battle Cutscene */}
      <AnimatePresence mode="wait">
        {battleInfo && (
          <BattleCutscene
            key={moveCount}
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
          mode={mode}
        />
      )}

      {/* Move History Panel */}
      <MoveHistory moves={moveHistory} open={showHistory} onClose={() => setShowHistory(false)} />
    </div>
  );
}