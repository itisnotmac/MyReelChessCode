import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import ChessBoard from '../components/chess/ChessBoard';
import CapturedPieces from '../components/chess/CapturedPieces';
import BattleCutscene from '../components/chess/BattleCutscene';
import GameOverModal from '../components/chess/GameOverModal';
import TurnIndicator from '../components/chess/TurnIndicator';
import GameMenu from '../components/chess/GameMenu';
import BlitzTimer from '../components/chess/BlitzTimer';
import { stopMenuMusic } from '@/lib/menuMusic';
import { startBlitzAudio, stopBlitzAudio } from '@/lib/blitzAudio';
import { getBlitzTimeLimit } from '@/lib/blitzClock';
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
import { Zap, Wifi, Loader2 } from 'lucide-react';

function parseJSON(str, fallback) {
  try { return str ? JSON.parse(str) : fallback; } catch { return fallback; }
}

export default function BlitzSchach() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const gameIdRef = useRef(null);
  const roleRef = useRef(null);
  const queueIdRef = useRef(null);
  const pollingRef = useRef(null);
  const timeoutHandledRef = useRef(false);

  const [phase, setPhase] = useState('lobby');
  const [gameDoc, setGameDoc] = useState(null);
  const [searchSeconds, setSearchSeconds] = useState(0);
  const [loading, setLoading] = useState(false);

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
  const [eloDelta, setEloDelta] = useState(null);
  const [moveCount, setMoveCount] = useState(0);
  const [battleInfo, setBattleInfo] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(() => localStorage.getItem('chessSound') !== 'off');
  const [timeRemaining, setTimeRemaining] = useState(null);

  const isHostRef = useRef(false);
  const [isHost, setIsHost] = useState(false);

  const moveCountRef = useRef(0);
  const isWhiteTurnRef = useRef(true);
  const battleInfoRef = useRef(null);
  const pendingMoveRef = useRef(null);

  useEffect(() => { stopMenuMusic(); }, []);
  useEffect(() => { moveCountRef.current = moveCount; }, [moveCount]);
  useEffect(() => { isWhiteTurnRef.current = isWhiteTurn; }, [isWhiteTurn]);
  useEffect(() => { battleInfoRef.current = battleInfo; }, [battleInfo]);

  // Start/stop stress audio with game phase
  useEffect(() => {
    if (phase === 'playing' && !gameOver) startBlitzAudio();
    return () => stopBlitzAudio();
  }, [phase, gameOver]);

  // Cleanup audio on unmount
  useEffect(() => () => stopBlitzAudio(), []);

  // Load a blitz game directly via ?game=ID
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const gid = params.get('game');
    if (!gid || !user) return;
    let cancelled = false;
    let attempt = 0;
    const loadGame = async () => {
      try {
        const results = await base44.entities.OnlineGame.filter({ id: gid });
        const g = results[0];
        if (cancelled) return;
        if (g && g.game_mode === 'blitz' && (g.host_id === user.id || g.guest_id === user.id)) {
          gameIdRef.current = g.id;
          const host = g.host_id === user.id;
          isHostRef.current = host; setIsHost(host);
          roleRef.current = host ? 'host' : 'guest';
          setGameDoc(g);
          applyGameDoc(g);
          setPhase('playing');
          return;
        }
        if (attempt < 10 && !cancelled) { attempt++; setTimeout(loadGame, 500); }
      } catch (e) { console.error('Failed to load blitz game:', e); }
    };
    loadGame();
    return () => { cancelled = true; };
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Polling fallback for sync recovery
  useEffect(() => {
    if (phase !== 'playing' || !gameIdRef.current) return;
    const interval = setInterval(async () => {
      if (battleInfoRef.current) return;
      try {
        const results = await base44.entities.OnlineGame.filter({ id: gameIdRef.current });
        const g = results[0];
        if (!g) return;
        const serverMoves = g.move_count ?? 0;
        const localMoves = moveCountRef.current ?? 0;
        const serverTurn = g.is_white_turn ?? true;
        if (serverMoves > localMoves || (serverMoves === localMoves && serverTurn !== isWhiteTurnRef.current)) {
          setGameDoc(g);
          applyGameDoc(g);
        }
      } catch (e) { /* ignore */ }
    }, 3000);
    return () => clearInterval(interval);
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── BLITZ TIMER ──
  useEffect(() => {
    if (phase !== 'playing' || !gameDoc?.turn_started_at || gameOver || battleInfo) return;
    timeoutHandledRef.current = false;

    const turnStart = new Date(gameDoc.turn_started_at).getTime();
    const white = gameDoc.is_white_turn;
    const lostPieces = white ? capturedWhite.length : capturedBlack.length;
    const limit = getBlitzTimeLimit(lostPieces);

    const tick = () => {
      const elapsed = (Date.now() - turnStart) / 1000;
      const remaining = Math.max(0, limit - elapsed);
      setTimeRemaining(remaining);
      if (remaining <= 0 && !timeoutHandledRef.current) {
        timeoutHandledRef.current = true;
        handleTimeout();
      }
    };
    tick();
    const interval = setInterval(tick, 200);
    return () => clearInterval(interval);
  }, [phase, gameDoc?.turn_started_at, gameDoc?.is_white_turn, gameOver, battleInfo, capturedWhite.length, capturedBlack.length]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (phase !== 'searching') return;
    const t = setInterval(() => setSearchSeconds(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [phase]);

  const getMyEloDelta = (g) => {
    if (!g?.elo_deltas) return null;
    try { const d = JSON.parse(g.elo_deltas); return isHostRef.current ? d.host : d.guest; }
    catch { return null; }
  };

  function applyGameDoc(g) {
    setBoard(parseJSON(g.board, createInitialBoard()));
    setIsWhiteTurn(g.is_white_turn ?? true);
    setEnPassant(parseJSON(g.en_passant, null));
    setCastling(parseJSON(g.castling, { ...INITIAL_CASTLING }));
    setLastMove(parseJSON(g.last_move, null));
    setCapturedWhite(parseJSON(g.captured_white, []));
    setCapturedBlack(parseJSON(g.captured_black, []));
    setMoveCount(g.move_count ?? 0);
    if (g.result && g.result !== 'in_progress') {
      setGameOver(g.result);
      const d = getMyEloDelta(g);
      if (d != null) setEloDelta(d);
    }
  }

  const getRegion = () => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      if (/America\/(New_York|Chicago|Denver|Los_Angeles|Toronto|Vancouver|Phoenix|Anchorage|Honolulu)/.test(tz)) return 'north-america';
      if (/America\//.test(tz)) return 'south-america';
      if (/Europe\//.test(tz)) return 'europe';
      if (/Asia\//.test(tz)) return 'asia';
      if (/Africa\//.test(tz)) return 'africa';
      if (/Australia\/|Pacific\//.test(tz)) return 'oceania';
    } catch {}
    return 'unknown';
  };

  // ── TIMEOUT HANDLING ──
  const handleTimeout = async () => {
    if (!gameIdRef.current) return;
    const myTurn = isHostRef.current ? isWhiteTurnRef.current : !isWhiteTurnRef.current;
    stopBlitzAudio();

    if (myTurn) {
      // I timed out — push my own loss
      const result = isHostRef.current ? 'black_wins' : 'white_wins';
      try {
        await base44.entities.OnlineGame.update(gameIdRef.current, {
          result, status: 'finished',
        });
        setGameOver(result);
        await settleElo();
      } catch (e) { console.error('Self-timeout push failed:', e); }
    } else {
      // Opponent timed out — claim the win via backend
      try {
        const r = await base44.functions.invoke('claimBlitzTimeout', { game_id: gameIdRef.current });
        const d = r?.data || r || {};
        if (d.claimed) {
          setGameOver(d.result);
          await settleElo();
        }
      } catch (e) { console.error('Opponent timeout claim failed:', e); }
    }
  };

  const settleElo = async () => {
    try {
      const r = await base44.functions.invoke('settleElo', { game_id: gameIdRef.current });
      const d = r?.data || r || {};
      if (d.settled) setEloDelta(isHostRef.current ? d.host_delta : d.guest_delta);
    } catch (e) { console.error('ELO settle failed:', e); }
  };

  // ── MATCHMAKING (blitz mode) ──
  const handleFindMatch = async () => {
    if (!user) { navigate('/login'); return; }
    setLoading(true);
    setSearchSeconds(0);
    const region = getRegion();

    const stale = await base44.entities.MatchQueue.filter({ user_id: user.id, status: 'waiting', mode: 'blitz' });
    for (const s of stale) await base44.entities.MatchQueue.update(s.id, { status: 'cancelled' });

    const waiting = await base44.entities.MatchQueue.filter({ status: 'waiting', mode: 'blitz' });
    const opponent = waiting.find(q => q.user_id !== user.id);

    if (opponent) {
      const initialBoard = createInitialBoard();
      const now = new Date().toISOString();
      const game = await base44.entities.OnlineGame.create({
        host_id: opponent.user_id,
        guest_id: user.id,
        status: 'active',
        board: JSON.stringify(initialBoard),
        is_white_turn: true,
        castling: JSON.stringify({ ...INITIAL_CASTLING }),
        en_passant: null,
        last_move: null,
        captured_white: JSON.stringify([]),
        captured_black: JSON.stringify([]),
        result: 'in_progress',
        move_count: 0,
        game_mode: 'blitz',
        turn_started_at: now,
      });

      await base44.entities.MatchQueue.update(opponent.id, { status: 'matched', game_id: game.id, role: 'host' });
      const myEntry = await base44.entities.MatchQueue.create({ user_id: user.id, status: 'matched', game_id: game.id, role: 'guest', region, mode: 'blitz' });
      queueIdRef.current = myEntry.id;

      gameIdRef.current = game.id;
      roleRef.current = 'guest';
      isHostRef.current = false; setIsHost(false);
      setGameDoc(game);
      applyGameDoc(game);
      setLoading(false);
      setPhase('found');
      setTimeout(() => setPhase('playing'), 1500);
    } else {
      const entry = await base44.entities.MatchQueue.create({ user_id: user.id, status: 'waiting', region, mode: 'blitz' });
      queueIdRef.current = entry.id;
      roleRef.current = 'host';
      isHostRef.current = true; setIsHost(true);
      setLoading(false);
      setPhase('searching');
      startPolling(entry.id);
    }
  };

  const startPolling = (queueEntryId) => {
    clearInterval(pollingRef.current);
    pollingRef.current = setInterval(async () => {
      const results = await base44.entities.MatchQueue.filter({ id: queueEntryId });
      const entry = results[0];
      if (!entry) return;
      if (entry.status === 'matched' && entry.game_id) {
        clearInterval(pollingRef.current);
        gameIdRef.current = entry.game_id;
        const gameResults = await base44.entities.OnlineGame.filter({ id: entry.game_id });
        const g = gameResults[0];
        if (g) { setGameDoc(g); applyGameDoc(g); }
        setPhase('found');
        setTimeout(() => setPhase('playing'), 1500);
      }
    }, 2000);
  };

  const handleCancelSearch = async () => {
    clearInterval(pollingRef.current);
    if (queueIdRef.current) {
      await base44.entities.MatchQueue.update(queueIdRef.current, { status: 'cancelled' });
      queueIdRef.current = null;
    }
    setPhase('lobby');
  };

  useEffect(() => () => clearInterval(pollingRef.current), []);

  // Subscribe to real-time game updates
  useEffect(() => {
    if (!gameDoc?.id) return;
    const unsub = base44.entities.OnlineGame.subscribe(event => {
      if (event.id !== gameDoc.id) return;
      if (event.type === 'update' && event.data) {
        setGameDoc(event.data);
        applyGameDoc(event.data);
      }
    });
    return unsub;
  }, [gameDoc?.id]);

  // ── CHESS LOGIC ──
  const findKingPosition = useCallback((boardState, white) => {
    const king = white ? 'K' : 'k';
    for (let r = 0; r < 8; r++)
      for (let c = 0; c < 8; c++)
        if (boardState[r][c] === king) return [r, c];
    return null;
  }, []);

  const checkSquare = isInCheck(board, isWhiteTurn) ? findKingPosition(board, isWhiteTurn) : null;
  const isMyTurn = isHost ? isWhiteTurn : !isWhiteTurn;

  const pushMove = async (newBoard, newEnPassant, newCastling, newLastMove, newCapturedWhite, newCapturedBlack, newMoveCount, newIsWhiteTurn, newResult) => {
    if (!gameIdRef.current) return;
    try {
      await base44.entities.OnlineGame.update(gameIdRef.current, {
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
        turn_started_at: new Date().toISOString(),
      });

      if (newResult !== 'in_progress') {
        stopBlitzAudio();
        await settleElo();
      }
    } catch (e) {
      console.error('pushMove failed, resyncing:', e);
      try {
        const results = await base44.entities.OnlineGame.filter({ id: gameIdRef.current });
        const g = results[0];
        if (g) { setGameDoc(g); applyGameDoc(g); }
      } catch (err) { console.error('resync failed:', err); }
    }
  };

  const finishMove = useCallback((fromR, fromC, toR, toC, currentBoard, currentEnPassant, currentCastling, captured) => {
    const movingPiece = currentBoard[fromR][fromC];
    const nextWhite = !isWhitePiece(movingPiece);
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
    if (newResult !== 'in_progress') { setGameOver(newResult); stopBlitzAudio(); }

    pushMove(result.board, result.enPassant, result.castling, newLastMove, newCapturedWhite, newCapturedBlack, newMoveCount, nextWhite, newResult);
  }, [capturedWhite, capturedBlack, moveCount]);

  const executeMove = useCallback((fromR, fromC, toR, toC, currentBoard, currentEnPassant, currentCastling) => {
    const piece = currentBoard[fromR][fromC];
    const targetPiece = currentBoard[toR][toC];
    const pieceName = piece?.toLowerCase();
    const isEP = pieceName === 'p' && currentEnPassant && toR === currentEnPassant[0] && toC === currentEnPassant[1];
    const capturedByEP = isEP ? currentBoard[fromR][toC] : null;
    const captured = targetPiece || capturedByEP;

    // Cutscenes off in blitz — no time for cinematics
    const showCutscene = false;
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
    const myColor = isHost ? 'white' : 'black';

    if (selectedSquare) {
      const [selR, selC] = selectedSquare;
      if (legalMoves.some(([r, c]) => r === row && c === col)) {
        executeMove(selR, selC, row, col, board, enPassant, castling);
        return;
      }
      if (piece && getPieceColor(piece) === myColor) {
        setSelectedSquare([row, col]);
        setLegalMoves(getLegalMoves(board, row, col, enPassant, castling));
        return;
      }
      setSelectedSquare(null);
      setLegalMoves([]);
      return;
    }

    if (piece && getPieceColor(piece) === myColor) {
      setSelectedSquare([row, col]);
      setLegalMoves(getLegalMoves(board, row, col, enPassant, castling));
    }
  }, [board, selectedSquare, legalMoves, isMyTurn, gameOver, battleInfo, enPassant, castling, isHost, executeMove]);

  const shouldFlip = !isHost;
  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  // Compute timer limits for display
  const whiteLimit = getBlitzTimeLimit(capturedWhite.length);
  const blackLimit = getBlitzTimeLimit(capturedBlack.length);
  const whiteRemaining = isWhiteTurn ? (timeRemaining ?? whiteLimit) : whiteLimit;
  const blackRemaining = !isWhiteTurn ? (timeRemaining ?? blackLimit) : blackLimit;

  // ── LOBBY ──
  if (phase === 'lobby') {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center px-6">
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: `repeating-conic-gradient(#ef4444 0% 25%, transparent 0% 50%)`, backgroundSize: '44px 44px' }} />
        <motion.div className="relative z-10 w-full max-w-sm text-center space-y-8" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div>
            <div className="w-20 h-20 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center mx-auto mb-5">
              <Zap className="w-10 h-10 text-red-400" />
            </div>
            <h1 className="text-2xl font-black tracking-wider text-white mb-2">BLITZSCHACH</h1>
            <p className="text-white/30 text-sm">30 seconds per move. Lose pieces, lose time. Floor: 15s.</p>
          </div>

          <button
            onClick={handleFindMatch}
            disabled={loading}
            className="w-full py-4 rounded-2xl font-black text-base tracking-[0.15em] uppercase transition-all active:scale-95 disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: '#fff', boxShadow: '0 0 32px rgba(239,68,68,0.3)' }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Connecting…
              </span>
            ) : 'Find Match'}
          </button>

          <button onClick={() => navigate(createPageUrl('Lobby'))} className="text-white/25 text-xs hover:text-white/50 transition-colors">
            ← Back to Lobby
          </button>
        </motion.div>
      </div>
    );
  }

  // ── SEARCHING ──
  if (phase === 'searching') {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center px-6">
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: `repeating-conic-gradient(#ef4444 0% 25%, transparent 0% 50%)`, backgroundSize: '44px 44px' }} />
        <motion.div className="relative z-10 w-full max-w-sm text-center space-y-8" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="relative w-28 h-28 mx-auto">
            <motion.div className="absolute inset-0 rounded-full border-2 border-red-500/30" animate={{ scale: [1, 1.5, 1.5], opacity: [0.5, 0, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }} />
            <motion.div className="absolute inset-0 rounded-full border-2 border-red-500/50" animate={{ scale: [1, 1.35, 1.35], opacity: [0.7, 0, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 0.4 }} />
            <div className="absolute inset-0 rounded-full bg-red-500/10 border border-red-500/40 flex items-center justify-center">
              <Zap className="w-10 h-10 text-red-400" />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-black text-white mb-2">Searching for opponent…</h2>
            <p className="text-red-400 font-mono text-2xl font-bold">{formatTime(searchSeconds)}</p>
          </div>

          <button onClick={handleCancelSearch} className="w-full py-3 rounded-xl border border-white/10 bg-white/5 text-white/50 text-sm hover:text-white hover:bg-white/10 transition-all">
            Cancel
          </button>
        </motion.div>
      </div>
    );
  }

  // ── MATCH FOUND ──
  if (phase === 'found') {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center px-6">
        <motion.div className="relative z-10 text-center space-y-4" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', damping: 12 }}>
          <motion.div className="text-6xl mb-4" animate={{ rotate: [0, -10, 10, -5, 5, 0] }} transition={{ duration: 0.6, delay: 0.2 }}>⚡</motion.div>
          <h2 className="text-2xl font-black text-white tracking-wider">Match Found!</h2>
          <p className="text-red-400 text-sm">You are playing as <span className="font-bold">{isHost ? 'White' : 'Black'}</span></p>
          <p className="text-white/20 text-xs">Starting game…</p>
        </motion.div>
      </div>
    );
  }

  // ── PLAYING ──
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <GameMenu
          onHome={() => navigate(createPageUrl('Lobby'))}
          onReset={() => {}}
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled(p => { const n = !p; localStorage.setItem('chessSound', n ? 'on' : 'off'); return n; })}
        />
        <div className="text-center">
          <p className="text-[10px] tracking-[0.3em] uppercase text-red-400/60 font-medium">BLITZSCHACH</p>
          <p className="text-[10px] text-white/20">Move {moveCount}</p>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 border border-white/10">
          <Wifi className="w-3 h-3 text-red-400" />
          <span className="text-[10px] text-white/40 tracking-wider">{isHost ? 'White' : 'Black'}</span>
        </div>
      </div>

      <div className="px-4 py-1">
        <CapturedPieces pieces={shouldFlip ? capturedBlack : capturedWhite} color={shouldFlip ? 'black' : 'white'} />
      </div>

      {/* Blitz Timers */}
      <div className="px-4 pb-1 flex justify-between gap-2">
        <BlitzTimer remaining={shouldFlip ? whiteRemaining : blackRemaining} limit={shouldFlip ? whiteLimit : blackLimit} isActive={shouldFlip ? isWhiteTurn : !isWhiteTurn} label={shouldFlip ? 'White' : 'Black'} />
        <BlitzTimer remaining={shouldFlip ? blackRemaining : whiteRemaining} limit={shouldFlip ? blackLimit : whiteLimit} isActive={shouldFlip ? !isWhiteTurn : isWhiteTurn} label={shouldFlip ? 'Black' : 'White'} />
      </div>

      <div className="px-4 py-2">
        <TurnIndicator isWhiteTurn={isWhiteTurn} isCheck={isInCheck(board, isWhiteTurn)} mode="online" isThinking={!isMyTurn && !gameOver} />
      </div>

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
            tournamentMode={true}
          />
        </div>
      </div>

      <div className="px-4 py-1">
        <CapturedPieces pieces={shouldFlip ? capturedWhite : capturedBlack} color={shouldFlip ? 'white' : 'black'} />
      </div>

      <div className="h-6" />

      <AnimatePresence mode="wait">
        {battleInfo && (
          <BattleCutscene key={moveCount} attacker={battleInfo.attacker} defender={battleInfo.defender} onComplete={handleBattleComplete} />
        )}
      </AnimatePresence>

      {gameOver && (
        <GameOverModal result={gameOver} eloDelta={eloDelta} onRematch={() => navigate(createPageUrl('Lobby'))} onHome={() => navigate(createPageUrl('Lobby'))} />
      )}
    </div>
  );
}