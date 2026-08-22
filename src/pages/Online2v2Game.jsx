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
import { Button } from '@/components/ui/button';
import GameMenu from '../components/chess/GameMenu';
import { stopMenuMusic } from '@/lib/menuMusic';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import {
  createInitialBoard, getLegalMoves, makeMove,
  isInCheck, isCheckmate, isStalemate,
  getPieceColor, isWhite as isWhitePiece, INITIAL_CASTLING
} from '../components/chess/ChessLogic';
import { Users, Copy, Check, Loader2 } from 'lucide-react';

function parseJSON(str, fallback) {
  try { return str ? JSON.parse(str) : fallback; } catch { return fallback; }
}

function genCode() {
  return Math.random().toString(36).substring(2, 7).toUpperCase();
}

// Turn order: slot 0=P1(white), 1=P3(black), 2=P2(white), 3=P4(black)
const SLOT_TEAMS = [0, 1, 0, 1]; // 0=TeamA/white, 1=TeamB/black
const SLOT_LABELS = ['Player 1', 'Player 3', 'Player 2', 'Player 4'];

export default function Online2v2Game() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const gameIdRef = useRef(null);
  const mySlotRef = useRef(null);

  const [phase, setPhase] = useState('lobby'); // lobby | waiting | playing
  const [gameDoc, setGameDoc] = useState(null);
  const [inviteCode, setInviteCode] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [players, setPlayers] = useState({ p1: false, p2: false, p3: false, p4: false });

  const [board, setBoard] = useState(createInitialBoard());
  const [isWhiteTurn, setIsWhiteTurn] = useState(true);
  const [playerSlot, setPlayerSlot] = useState(0);
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

  useEffect(() => { stopMenuMusic(); }, []);

  function applyGameDoc(g) {
    setBoard(parseJSON(g.board, createInitialBoard()));
    setIsWhiteTurn(g.is_white_turn ?? true);
    setPlayerSlot(g.player_slot ?? 0);
    setEnPassant(parseJSON(g.en_passant, null));
    setCastling(parseJSON(g.castling, { ...INITIAL_CASTLING }));
    setLastMove(parseJSON(g.last_move, null));
    setCapturedWhite(parseJSON(g.captured_white, []));
    setCapturedBlack(parseJSON(g.captured_black, []));
    setMoveCount(g.move_count ?? 0);
    setPlayers({
      p1: !!g.player1_id, p2: !!g.player2_id,
      p3: !!g.player3_id, p4: !!g.player4_id,
    });
    if (g.result && g.result !== 'in_progress') setGameOver(g.result);
    if (g.status === 'active') setPhase('playing');
  }

  // ── CREATE GAME ──
  const handleCreate = async () => {
    if (!user) { navigate('/login'); return; }
    setLoading(true); setError(null);
    const code = genCode();
    const game = await base44.entities.Online2v2Game.create({
      invite_code: code,
      status: 'waiting',
      player1_id: user.id,
      board: JSON.stringify(createInitialBoard()),
      is_white_turn: true,
      player_slot: 0,
      castling: JSON.stringify({ ...INITIAL_CASTLING }),
      captured_white: JSON.stringify([]),
      captured_black: JSON.stringify([]),
      result: 'in_progress',
      move_count: 0,
    });
    gameIdRef.current = game.id;
    mySlotRef.current = 0; // P1
    setInviteCode(code);
    setGameDoc(game);
    applyGameDoc(game);
    setPhase('waiting');
    setLoading(false);
  };

  // ── JOIN GAME ──
  const handleJoin = async () => {
    if (!user) { navigate('/login'); return; }
    if (!joinCode.trim()) { setError('Enter an invite code'); return; }
    setLoading(true); setError(null);

    // Find game by invite code — search all waiting games
    const all = await base44.entities.Online2v2Game.filter({ status: 'waiting' });
    const game = all.find(g => g.invite_code === joinCode.trim().toUpperCase());
    if (!game) { setError('Game not found. Check the code.'); setLoading(false); return; }

    // Determine which slot to fill
    let slot = null;
    let updateData = {};
    if (!game.player2_id && game.player1_id !== user.id) { slot = 2; updateData = { player2_id: user.id }; }
    else if (!game.player3_id && game.player1_id !== user.id && game.player2_id !== user.id) { slot = 1; updateData = { player3_id: user.id }; }
    else if (!game.player4_id && game.player1_id !== user.id && game.player2_id !== user.id && game.player3_id !== user.id) { slot = 3; updateData = { player4_id: user.id }; }
    else { setError('Game is full or you already joined.'); setLoading(false); return; }

    // If all 4 slots filled after this join, activate
    const willBeFullP2 = updateData.player2_id ? true : !!game.player2_id;
    const willBeFullP3 = updateData.player3_id ? true : !!game.player3_id;
    const willBeFullP4 = updateData.player4_id ? true : !!game.player4_id;
    if (willBeFullP2 && willBeFullP3 && willBeFullP4) {
      updateData.status = 'active';
    }

    await base44.entities.Online2v2Game.update(game.id, updateData);
    gameIdRef.current = game.id;
    mySlotRef.current = slot;
    setGameDoc({ ...game, ...updateData });
    applyGameDoc({ ...game, ...updateData });
    setPhase(updateData.status === 'active' ? 'playing' : 'waiting');
    setLoading(false);
  };

  // ── REAL-TIME SUBSCRIPTION ──
  useEffect(() => {
    if (!gameIdRef.current) return;
    const unsub = base44.entities.Online2v2Game.subscribe(event => {
      if (event.id !== gameIdRef.current) return;
      if (event.type === 'update' && event.data) {
        setGameDoc(event.data);
        applyGameDoc(event.data);
      }
    });
    return unsub;
  }, [gameIdRef.current]);

  // ── CHESS LOGIC ──
  const isMyTurn = mySlotRef.current === playerSlot;

  const pushMove = async (newBoard, newEP, newCastling, newLastMove, newCW, newCB, newCount, newIsWhiteTurn, newSlot, newResult) => {
    if (!gameIdRef.current) return;
    await base44.entities.Online2v2Game.update(gameIdRef.current, {
      board: JSON.stringify(newBoard),
      is_white_turn: newIsWhiteTurn,
      player_slot: newSlot,
      en_passant: newEP ? JSON.stringify(newEP) : null,
      castling: JSON.stringify(newCastling),
      last_move: JSON.stringify(newLastMove),
      captured_white: JSON.stringify(newCW),
      captured_black: JSON.stringify(newCB),
      move_count: newCount,
      result: newResult,
      status: newResult !== 'in_progress' ? 'finished' : 'active',
    });
  };

  const finishMove = useCallback((fromR, fromC, toR, toC, currentBoard, currentEP, currentCastling, captured) => {
    const movingPiece = currentBoard[fromR][fromC];
    const nextWhite = !isWhitePiece(movingPiece);
    const result = makeMove(currentBoard, fromR, fromC, toR, toC, currentEP, currentCastling);

    const newCW = [...capturedWhite];
    const newCB = [...capturedBlack];
    if (captured) {
      if (isWhitePiece(captured)) newCW.push(captured);
      else newCB.push(captured);
    }

    const newCount = moveCount + 1;
    const newLastMove = { from: [fromR, fromC], to: [toR, toC] };
    const nextSlot = (playerSlot + 1) % 4;
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
    setMoveCount(newCount);
    setCapturedWhite(newCW);
    setCapturedBlack(newCB);
    setIsWhiteTurn(nextWhite);
    setPlayerSlot(nextSlot);
    if (newResult !== 'in_progress') setGameOver(newResult);

    pushMove(result.board, result.enPassant, result.castling, newLastMove, newCW, newCB, newCount, nextWhite, nextSlot, newResult);
  }, [capturedWhite, capturedBlack, moveCount, playerSlot]);

  const executeMove = useCallback((fromR, fromC, toR, toC, currentBoard, currentEP, currentCastling) => {
    const piece = currentBoard[fromR][fromC];
    const targetPiece = currentBoard[toR][toC];
    const pieceName = piece?.toLowerCase();
    const isEP = pieceName === 'p' && currentEP && toR === currentEP[0] && toC === currentEP[1];
    const captured = targetPiece || (isEP ? currentBoard[fromR][toC] : null);
    if (captured) {
      pendingMoveRef.current = { fromR, fromC, toR, toC, currentBoard, currentEP, currentCastling, captured };
      setBattleInfo({ attacker: piece, defender: captured });
      return;
    }
    finishMove(fromR, fromC, toR, toC, currentBoard, currentEP, currentCastling, null);
  }, [finishMove]);

  const handleBattleComplete = useCallback(() => {
    const p = pendingMoveRef.current;
    if (p) { finishMove(p.fromR, p.fromC, p.toR, p.toC, p.currentBoard, p.currentEP, p.currentCastling, p.captured); pendingMoveRef.current = null; }
    setBattleInfo(null);
  }, [finishMove]);

  const handleSquareClick = useCallback((row, col) => {
    if (gameOver || battleInfo || !isMyTurn) return;
    const piece = board[row][col];
    const myTeam = SLOT_TEAMS[mySlotRef.current];
    const myColor = myTeam === 0 ? 'white' : 'black';

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
      setSelectedSquare(null); setLegalMoves([]); return;
    }
    if (piece && getPieceColor(piece) === myColor) {
      setSelectedSquare([row, col]);
      setLegalMoves(getLegalMoves(board, row, col, enPassant, castling));
    }
  }, [board, selectedSquare, legalMoves, isMyTurn, gameOver, battleInfo, enPassant, castling, executeMove]);

  const copyCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const findKingPosition = useCallback((boardState, white) => {
    const king = white ? 'K' : 'k';
    for (let r = 0; r < 8; r++)
      for (let c = 0; c < 8; c++)
        if (boardState[r][c] === king) return [r, c];
    return null;
  }, []);
  const checkSquare = isInCheck(board, isWhiteTurn) ? findKingPosition(board, isWhiteTurn) : null;
  const shouldFlip = SLOT_TEAMS[playerSlot] === 1;

  // ── LOBBY ──
  if (phase === 'lobby') {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center px-6">
        <div className="absolute inset-0 opacity-[0.018]" style={{ backgroundImage: `repeating-conic-gradient(#3AAFA9 0% 25%, transparent 0% 50%)`, backgroundSize: '44px 44px' }} />
        <motion.div className="relative z-10 w-full max-w-sm space-y-6" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center">
            <div className="w-20 h-20 rounded-2xl bg-[#3AAFA9]/15 border border-[#3AAFA9]/30 flex items-center justify-center mx-auto mb-5">
              <Users className="w-10 h-10 text-[#3AAFA9]" />
            </div>
            <h1 className="text-2xl font-black tracking-wider text-white mb-2">Online 2v2</h1>
            <p className="text-white/30 text-sm">Create a room and share the code with 3 friends</p>
          </div>

          <Button
            onClick={handleCreate}
            disabled={loading}
            variant="chess-primary"
            className="w-full py-4 rounded-2xl font-black text-base tracking-[0.15em] uppercase active:scale-95 disabled:opacity-50 shadow-[0_0_32px_rgba(58,175,169,0.3)]"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Room'}
          </Button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/20 text-xs">or join</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <div className="space-y-3">
            <input
              value={joinCode}
              onChange={e => setJoinCode(e.target.value.toUpperCase())}
              placeholder="ENTER CODE"
              maxLength={5}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-center font-black tracking-[0.3em] text-lg placeholder:text-white/20 focus:outline-none focus:border-[#3AAFA9]/50"
            />
            {error && <p className="text-red-400 text-xs text-center">{error}</p>}
            <button
              onClick={handleJoin}
              disabled={loading || !joinCode.trim()}
              className="w-full py-3 rounded-xl border border-[#3AAFA9]/40 bg-[#3AAFA9]/10 text-[#3AAFA9] font-black tracking-[0.15em] uppercase text-sm transition-all active:scale-95 disabled:opacity-40"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Join Room'}
            </button>
          </div>

          <button onClick={() => navigate(createPageUrl('Lobby'))} className="w-full text-white/25 text-xs hover:text-white/50 transition-colors text-center">
            ← Back to Lobby
          </button>
        </motion.div>
      </div>
    );
  }

  // ── WAITING ROOM ──
  if (phase === 'waiting') {
    const slots = [
      { label: 'Player 1', team: 'Team A', filled: players.p1 },
      { label: 'Player 2', team: 'Team A', filled: players.p2 },
      { label: 'Player 3', team: 'Team B', filled: players.p3 },
      { label: 'Player 4', team: 'Team B', filled: players.p4 },
    ];
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center px-6">
        <div className="absolute inset-0 opacity-[0.018]" style={{ backgroundImage: `repeating-conic-gradient(#3AAFA9 0% 25%, transparent 0% 50%)`, backgroundSize: '44px 44px' }} />
        <motion.div className="relative z-10 w-full max-w-sm space-y-6" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center">
            <h2 className="text-xl font-black text-white mb-1">Waiting for players…</h2>
            <p className="text-white/30 text-sm">Share this code with your friends</p>
          </div>

          {inviteCode && (
            <button onClick={copyCode} className="w-full py-4 rounded-2xl border border-[#3AAFA9]/40 bg-[#3AAFA9]/10 flex items-center justify-center gap-3 transition-all active:scale-95">
              <span className="text-3xl font-black tracking-[0.4em] text-[#3AAFA9]">{inviteCode}</span>
              {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-4 h-4 text-[#3AAFA9]/60" />}
            </button>
          )}

          <div className="grid grid-cols-2 gap-3">
            {slots.map(s => (
              <div key={s.label} className="rounded-xl border px-3 py-3 flex items-center gap-2"
                style={{ borderColor: s.filled ? 'rgba(58,175,169,0.4)' : 'rgba(255,255,255,0.08)', background: s.filled ? 'rgba(58,175,169,0.08)' : 'rgba(255,255,255,0.03)' }}>
                <div className="w-2 h-2 rounded-full" style={{ background: s.filled ? '#3AAFA9' : 'rgba(255,255,255,0.15)' }} />
                <div>
                  <p className="text-xs font-bold text-white/80">{s.label}</p>
                  <p className="text-[10px] text-white/30">{s.team}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 justify-center">
            <Loader2 className="w-3.5 h-3.5 text-[#3AAFA9] animate-spin" />
            <p className="text-white/30 text-xs">Game starts when all 4 players have joined</p>
          </div>

          <button onClick={() => navigate(createPageUrl('Lobby'))} className="w-full text-white/25 text-xs hover:text-white/50 transition-colors text-center">
            ← Leave
          </button>
        </motion.div>
      </div>
    );
  }

  // ── PLAYING ──
  const currentPlayerName = SLOT_LABELS[playerSlot];
  const currentTeam = SLOT_TEAMS[playerSlot] === 0 ? 'Team A' : 'Team B';

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <GameMenu onHome={() => navigate(createPageUrl('Lobby'))} onReset={() => {}} soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled(p => { const n = !p; localStorage.setItem('chessSound', n ? 'on' : 'off'); return n; })} />
        <div className="text-center">
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#3AAFA9]/60 font-medium">Online 2v2</p>
          <p className="text-[10px] text-white/20">Move {moveCount}</p>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 border border-white/10">
          <Users className="w-3 h-3 text-[#3AAFA9]" />
          <span className="text-[10px] text-white/40 tracking-wider">{SLOT_LABELS[mySlotRef.current]}</span>
        </div>
      </div>

      <div className="px-4 py-1">
        <CapturedPieces pieces={shouldFlip ? capturedBlack : capturedWhite} color={shouldFlip ? 'black' : 'white'} />
      </div>
      <div className="px-4 pb-1 flex justify-between gap-2">
        <PlayerTimer isActive={!isWhiteTurn && !gameOver && !battleInfo} label="Black" />
        <PlayerTimer isActive={isWhiteTurn && !gameOver && !battleInfo} label="White" />
      </div>
      <div className="px-4 py-2">
        <TurnIndicator isWhiteTurn={isWhiteTurn} isCheck={isInCheck(board, isWhiteTurn)} mode="2v2"
          isThinking={!isMyTurn && !gameOver} playerName={currentPlayerName} teamLabel={currentTeam} />
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-2">
        <div style={{ width: 'min(92vw, 92vh, 480px)', height: 'min(92vw, 92vh, 480px)' }}>
          <ChessBoard board={board} selectedSquare={selectedSquare} legalMoves={legalMoves}
            onSquareClick={handleSquareClick} lastMove={lastMove}
            isCheck={isInCheck(board, isWhiteTurn)} checkSquare={checkSquare} flipped={shouldFlip} />
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
        <GameOverModal result={gameOver} mode="2v2" onRematch={() => navigate(createPageUrl('Lobby'))} onHome={() => navigate(createPageUrl('Lobby'))} />
      )}
    </div>
  );
}