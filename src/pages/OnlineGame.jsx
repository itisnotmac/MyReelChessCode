import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import ChessBoard from '../components/chess/ChessBoard';
import CapturedPieces from '../components/chess/CapturedPieces';
import BattleCutscene from '../components/chess/BattleCutscene';
import GameOverModal from '../components/chess/GameOverModal';
import TurnIndicator from '../components/chess/TurnIndicator';
import PlayerTimer from '../components/chess/PlayerTimer';
import GameMenu from '../components/chess/GameMenu';
import { stopMenuMusic } from '@/lib/menuMusic';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import {
  createInitialBoard,
  getLegalMoves,
  makeMove,
  isInCheck,
  isCheckmate,
  isStalemate,
  getPieceColor,
  isWhite as isWhitePiece,
  INITIAL_CASTLING
} from '../components/chess/ChessLogic';
import { Copy, Check, Users, Clock, Wifi } from 'lucide-react';

function generateInviteCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function parseJSON(str, fallback) {
  try { return str ? JSON.parse(str) : fallback; } catch { return fallback; }
}

export default function OnlineGame() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const gameIdRef = useRef(new URLSearchParams(window.location.search).get('game') || null);
  const roleRef = useRef(new URLSearchParams(window.location.search).get('role') || null);
  // 'host' = white, 'guest' = black

  const [phase, setPhase] = useState('lobby'); // lobby | waiting | playing
  const [gameDoc, setGameDoc] = useState(null);
  const [inviteCode, setInviteCode] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [joinError, setJoinError] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  // Local chess state — synced from DB
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
  const [moveCount, setMoveCount] = useState(0);
  const [battleInfo, setBattleInfo] = useState(null);
  const pendingMoveRef = useRef(null);
  const [soundEnabled, setSoundEnabled] = useState(() => localStorage.getItem('chessSound') !== 'off');

  const isHost = roleRef.current === 'host';
  const isMyTurn = isHost ? isWhiteTurn : !isWhiteTurn;

  useEffect(() => { stopMenuMusic(); }, []);

  // If we arrived with a ?game= param, rejoin directly
  useEffect(() => {
    if (gameIdRef.current && roleRef.current && user) {
      setLoading(true);
      base44.entities.OnlineGame.filter({ id: gameIdRef.current })
        .then(results => {
          const g = results[0];
          if (!g) return;
          setGameDoc(g);
          applyGameDoc(g);
          setPhase(g.status === 'waiting' ? 'waiting' : 'playing');
        })
        .finally(() => setLoading(false));
    }
  }, [user]);

  function applyGameDoc(g) {
    setBoard(parseJSON(g.board, createInitialBoard()));
    setIsWhiteTurn(g.is_white_turn ?? true);
    setEnPassant(parseJSON(g.en_passant, null));
    setCastling(parseJSON(g.castling, { ...INITIAL_CASTLING }));
    setLastMove(parseJSON(g.last_move, null));
    setCapturedWhite(parseJSON(g.captured_white, []));
    setCapturedBlack(parseJSON(g.captured_black, []));
    setMoveCount(g.move_count ?? 0);
    if (g.result && g.result !== 'in_progress') setGameOver(g.result);
  }

  // Subscribe to real-time updates once we have a game
  useEffect(() => {
    if (!gameDoc?.id) return;
    const unsub = base44.entities.OnlineGame.subscribe(event => {
      if (event.id !== gameDoc.id) return;
      if (event.type === 'update' && event.data) {
        const g = event.data;
        setGameDoc(g);
        applyGameDoc(g);
        if (g.status === 'active' && phase !== 'playing') {
          setPhase('playing');
        }
      }
    });
    return unsub;
  }, [gameDoc?.id, phase]);

  const handleCreateGame = async () => {
    if (!user) { navigate('/login'); return; }
    setLoading(true);
    const code = generateInviteCode();
    const initialBoard = createInitialBoard();
    const g = await base44.entities.OnlineGame.create({
      host_id: user.id,
      status: 'waiting',
      board: JSON.stringify(initialBoard),
      is_white_turn: true,
      castling: JSON.stringify({ ...INITIAL_CASTLING }),
      en_passant: null,
      last_move: null,
      captured_white: JSON.stringify([]),
      captured_black: JSON.stringify([]),
      result: 'in_progress',
      move_count: 0,
      invite_code: code,
    });
    gameIdRef.current = g.id;
    roleRef.current = 'host';
    setGameDoc(g);
    setInviteCode(code);
    setPhase('waiting');
    setLoading(false);
    // Update URL without reload
    window.history.replaceState(null, '', `?game=${g.id}&role=host`);
  };

  const handleJoinGame = async () => {
    if (!user) { navigate('/login'); return; }
    setJoinError('');
    setLoading(true);
    const results = await base44.entities.OnlineGame.filter({ invite_code: joinCode.trim().toUpperCase() });
    const g = results[0];
    if (!g || g.status !== 'waiting') {
      setJoinError('Game not found or already started.');
      setLoading(false);
      return;
    }
    if (g.host_id === user.id) {
      setJoinError("That's your own game — share the code with a friend!");
      setLoading(false);
      return;
    }
    const updated = await base44.entities.OnlineGame.update(g.id, {
      guest_id: user.id,
      status: 'active',
    });
    gameIdRef.current = g.id;
    roleRef.current = 'guest';
    setGameDoc(updated);
    applyGameDoc(updated);
    setPhase('playing');
    setLoading(false);
    window.history.replaceState(null, '', `?game=${g.id}&role=guest`);
  };

  const findKingPosition = useCallback((boardState, white) => {
    const king = white ? 'K' : 'k';
    for (let r = 0; r < 8; r++)
      for (let c = 0; c < 8; c++)
        if (boardState[r][c] === king) return [r, c];
    return null;
  }, []);

  const checkSquare = isInCheck(board, isWhiteTurn) ? findKingPosition(board, isWhiteTurn) : null;

  const pushMove = async (newBoard, newEnPassant, newCastling, newLastMove, newCapturedWhite, newCapturedBlack, newMoveCount, newIsWhiteTurn, newResult) => {
    if (!gameDoc?.id) return;
    await base44.entities.OnlineGame.update(gameDoc.id, {
      board: JSON.stringify(newBoard),
      is_white_turn: newIsWhiteTurn,
      en_passant: newEnPassant ? JSON.stringify(newEnPassant) : null,
      castling: JSON.stringify(newCastling),
      last_move: JSON.stringify(newLastMove),
      captured_white: JSON.stringify(newCapturedWhite),
      captured_black: JSON.stringify(newCapturedBlack),
      move_count: newMoveCount,
      result: newResult,
      status: newResult !== 'in_progress' ? 'finished' : 'active',
    });
  };

  const finishMove = useCallback((fromR, fromC, toR, toC, currentBoard, currentEnPassant, currentCastling, captured) => {
    const movingPiece = currentBoard[fromR][fromC];
    const movedByWhite = isWhitePiece(movingPiece);
    const nextWhite = !movedByWhite;
    const result = makeMove(currentBoard, fromR, fromC, toR, toC, currentEnPassant, currentCastling);

    const newCapturedWhite = [...capturedWhite];
    const newCapturedBlack = [...capturedBlack];
    if (captured) {
      if (isWhitePiece(captured)) newCapturedWhite.push(captured);
      else newCapturedBlack.push(captured);
    }

    const newMoveCount = moveCount + 1;
    const newLastMove = { from: [fromR, fromC], to: [toR, toC] };
    let newResult = 'in_progress';
    if (isCheckmate(result.board, nextWhite, result.enPassant, result.castling)) {
      newResult = nextWhite ? 'black_wins' : 'white_wins';
    } else if (isStalemate(result.board, nextWhite, result.enPassant, result.castling)) {
      newResult = 'draw';
    }

    setBoard(result.board);
    setEnPassant(result.enPassant);
    setCastling(result.castling);
    setLastMove(newLastMove);
    setSelectedSquare(null);
    setLegalMoves([]);
    setMoveCount(newMoveCount);
    setCapturedWhite(newCapturedWhite);
    setCapturedBlack(newCapturedBlack);
    setIsWhiteTurn(nextWhite);
    if (newResult !== 'in_progress') setGameOver(newResult);

    pushMove(result.board, result.enPassant, result.castling, newLastMove, newCapturedWhite, newCapturedBlack, newMoveCount, nextWhite, newResult);
  }, [capturedWhite, capturedBlack, moveCount, gameDoc]);

  const executeMove = useCallback((fromR, fromC, toR, toC, currentBoard, currentEnPassant, currentCastling) => {
    const piece = currentBoard[fromR][fromC];
    const targetPiece = currentBoard[toR][toC];
    const pieceName = piece?.toLowerCase();
    const isEP = pieceName === 'p' && currentEnPassant && toR === currentEnPassant[0] && toC === currentEnPassant[1];
    const capturedByEP = isEP ? currentBoard[fromR][toC] : null;
    const captured = targetPiece || capturedByEP;

    const showCutscene = localStorage.getItem('chessBattleCutscene') !== 'off';
    if (captured && showCutscene) {
      pendingMoveRef.current = { fromR, fromC, toR, toC, currentBoard, currentEnPassant, currentCastling, captured };
      setBattleInfo({ attacker: piece, defender: captured });
      return;
    }
    finishMove(fromR, fromC, toR, toC, currentBoard, currentEnPassant, currentCastling, captured);
  }, [finishMove]);

  const handleBattleComplete = useCallback(() => {
    const pending = pendingMoveRef.current;
    if (pending) {
      finishMove(pending.fromR, pending.fromC, pending.toR, pending.toC, pending.currentBoard, pending.currentEnPassant, pending.currentCastling, pending.captured);
      pendingMoveRef.current = null;
    }
    setBattleInfo(null);
  }, [finishMove]);

  const handleSquareClick = useCallback((row, col) => {
    if (gameOver || battleInfo || !isMyTurn) return;
    const piece = board[row][col];

    if (selectedSquare) {
      const [selR, selC] = selectedSquare;
      if (legalMoves.some(([r, c]) => r === row && c === col)) {
        executeMove(selR, selC, row, col, board, enPassant, castling);
        return;
      }
      const myColor = isHost ? 'white' : 'black';
      if (piece && getPieceColor(piece) === myColor) {
        setSelectedSquare([row, col]);
        setLegalMoves(getLegalMoves(board, row, col, enPassant, castling));
        return;
      }
      setSelectedSquare(null); setLegalMoves([]);
      return;
    }

    const myColor = isHost ? 'white' : 'black';
    if (piece && getPieceColor(piece) === myColor) {
      setSelectedSquare([row, col]);
      setLegalMoves(getLegalMoves(board, row, col, enPassant, castling));
    }
  }, [board, selectedSquare, legalMoves, isMyTurn, gameOver, battleInfo, enPassant, castling, isHost, executeMove]);

  const copyCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shouldFlip = !isHost;

  // ── LOBBY PHASE ──
  if (phase === 'lobby') {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center px-6">
        <div className="absolute inset-0 opacity-[0.018]" style={{ backgroundImage: `repeating-conic-gradient(#3AAFA9 0% 25%, transparent 0% 50%)`, backgroundSize: '44px 44px' }} />
        <motion.div className="relative z-10 w-full max-w-sm space-y-6" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-2">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Wifi className="w-5 h-5 text-[#3AAFA9]" />
              <h1 className="text-xl font-black tracking-wider text-white">Online PVP</h1>
            </div>
            <p className="text-white/30 text-xs">Challenge anyone, anywhere in the world</p>
          </div>

          {/* Create */}
          <div className="rounded-2xl bg-white/5 border border-white/8 p-5 space-y-3">
            <p className="text-sm font-semibold text-white">Host a Game</p>
            <p className="text-xs text-white/30">Create a game and share your code with a friend.</p>
            <button
              onClick={handleCreateGame}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#3AAFA9] text-black font-bold text-sm tracking-wider hover:bg-[#3AAFA9]/90 active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Game'}
            </button>
          </div>

          {/* Join */}
          <div className="rounded-2xl bg-white/5 border border-white/8 p-5 space-y-3">
            <p className="text-sm font-semibold text-white">Join a Game</p>
            <p className="text-xs text-white/30">Enter the 6-character code your friend shared.</p>
            <input
              value={joinCode}
              onChange={e => { setJoinCode(e.target.value.toUpperCase()); setJoinError(''); }}
              placeholder="ENTER CODE"
              maxLength={6}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-center tracking-[0.4em] font-bold text-lg placeholder:text-white/20 focus:outline-none focus:border-[#3AAFA9]/50"
            />
            {joinError && <p className="text-red-400 text-xs text-center">{joinError}</p>}
            <button
              onClick={handleJoinGame}
              disabled={loading || joinCode.length < 6}
              className="w-full py-3 rounded-xl bg-white/10 border border-white/10 text-white font-bold text-sm tracking-wider hover:bg-white/15 active:scale-95 transition-all disabled:opacity-40"
            >
              {loading ? 'Joining...' : 'Join Game'}
            </button>
          </div>

          <button onClick={() => navigate(createPageUrl('Lobby'))} className="w-full text-center text-white/30 text-xs hover:text-white/50 transition-colors py-2">
            ← Back to Lobby
          </button>
        </motion.div>
      </div>
    );
  }

  // ── WAITING PHASE ──
  if (phase === 'waiting') {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center px-6">
        <div className="absolute inset-0 opacity-[0.018]" style={{ backgroundImage: `repeating-conic-gradient(#3AAFA9 0% 25%, transparent 0% 50%)`, backgroundSize: '44px 44px' }} />
        <motion.div className="relative z-10 w-full max-w-sm text-center space-y-6" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="w-16 h-16 rounded-2xl bg-[#3AAFA9]/15 border border-[#3AAFA9]/30 flex items-center justify-center mx-auto">
            <Users className="w-8 h-8 text-[#3AAFA9]" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white mb-2">Waiting for opponent…</h2>
            <p className="text-white/30 text-sm">Share this code with your friend</p>
          </div>

          <div className="rounded-2xl bg-white/5 border border-[#3AAFA9]/30 p-6">
            <p className="text-4xl font-black tracking-[0.4em] text-[#3AAFA9] mb-4">{inviteCode}</p>
            <button onClick={copyCode} className="flex items-center gap-2 mx-auto text-white/40 hover:text-white text-xs transition-colors">
              {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy code'}
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-white/20 text-xs">
            <div className="w-1.5 h-1.5 rounded-full bg-[#3AAFA9] animate-pulse" />
            Waiting for connection
          </div>

          <button onClick={() => navigate(createPageUrl('Lobby'))} className="text-white/30 text-xs hover:text-white/50 transition-colors">
            Cancel
          </button>
        </motion.div>
      </div>
    );
  }

  // ── PLAYING PHASE ──
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <GameMenu
          onHome={() => navigate(createPageUrl('Lobby'))}
          onReset={() => {}}
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled(p => { const n = !p; localStorage.setItem('chessSound', n ? 'on' : 'off'); return n; })}
        />
        <div className="text-center">
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#3AAFA9]/60 font-medium">Online PVP</p>
          <p className="text-[10px] text-white/20">Move {moveCount}</p>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 border border-white/10">
          <Wifi className="w-3 h-3 text-[#3AAFA9]" />
          <span className="text-[10px] text-white/40 tracking-wider">{isHost ? 'White' : 'Black'}</span>
        </div>
      </div>

      {/* Captured pieces top */}
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
        <TurnIndicator isWhiteTurn={isWhiteTurn} isCheck={isInCheck(board, isWhiteTurn)} mode="online" isThinking={!isMyTurn && !gameOver} />
      </div>

      {/* Board */}
      <div className="flex-1 flex items-center justify-center px-4 py-2">
        <div style={{ width: 'min(92vw, 92vh, 480px)', height: 'min(92vw, 92vh, 480px)' }}>
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

      {/* Captured pieces bottom */}
      <div className="px-4 py-1">
        <CapturedPieces pieces={shouldFlip ? capturedWhite : capturedBlack} color={shouldFlip ? 'white' : 'black'} />
      </div>

      <div className="h-6" />

      {/* Battle Cutscene */}
      <AnimatePresence mode="wait">
        {battleInfo && (
          <BattleCutscene key={moveCount} attacker={battleInfo.attacker} defender={battleInfo.defender} onComplete={handleBattleComplete} />
        )}
      </AnimatePresence>

      {/* Game Over */}
      {gameOver && (
        <GameOverModal result={gameOver} onRematch={() => navigate(createPageUrl('Lobby'))} onHome={() => navigate(createPageUrl('Lobby'))} />
      )}
    </div>
  );
}