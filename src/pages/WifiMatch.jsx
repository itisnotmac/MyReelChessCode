import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import {
  createInitialBoard,
  INITIAL_CASTLING
} from '../components/chess/ChessLogic';
import { stopMenuMusic } from '@/lib/menuMusic';
import { X, Wifi, Loader2, QrCode, Copy, Check, ChevronLeft } from 'lucide-react';

const INVITE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function generateInviteCode() {
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += INVITE_CHARS[Math.floor(Math.random() * INVITE_CHARS.length)];
  }
  return code;
}

function buildJoinUrl(code) {
  return `https://reelchess.org/?join=${code}`;
}

export default function WifiMatch() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [phase, setPhase] = useState('creating'); // creating | waiting | error
  const [inviteCode, setInviteCode] = useState('');
  const [gameId, setGameId] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const pollingRef = useRef(null);

  useEffect(() => {
    stopMenuMusic();
    if (!user) return;
    let cancelled = false;

    (async () => {
      try {
        const code = generateInviteCode();
        const game = await base44.entities.OnlineGame.create({
          host_id: user.id,
          status: 'waiting',
          invite_code: code,
          board: JSON.stringify(createInitialBoard()),
          is_white_turn: true,
          castling: JSON.stringify({ ...INITIAL_CASTLING }),
          en_passant: null,
          last_move: null,
          captured_white: JSON.stringify([]),
          captured_black: JSON.stringify([]),
          result: 'in_progress',
          move_count: 0,
        });

        if (cancelled) return;
        setInviteCode(code);
        setGameId(game.id);
        setPhase('waiting');
      } catch (e) {
        if (!cancelled) {
          setError(e.message || 'Failed to create game');
          setPhase('error');
        }
      }
    })();

    return () => {
      cancelled = true;
      clearInterval(pollingRef.current);
    };
  }, [user?.id]);

  // Poll for guest joining
  useEffect(() => {
    if (phase !== 'waiting' || !gameId) return;
    pollingRef.current = setInterval(async () => {
      try {
        const results = await base44.entities.OnlineGame.filter({ id: gameId });
        const g = results[0];
        if (!g) return;
        if (g.status === 'active' && g.guest_id) {
          clearInterval(pollingRef.current);
          navigate(createPageUrl('OnlineGame') + `?game=${gameId}`);
        }
      } catch {}
    }, 2000);
    return () => clearInterval(pollingRef.current);
  }, [phase, gameId]);

  // Cleanup: cancel the game if host leaves while still waiting
  useEffect(() => {
    return () => {
      clearInterval(pollingRef.current);
      if (gameId && phase === 'waiting') {
        base44.entities.OnlineGame.delete(gameId).catch(() => {});
      }
    };
  }, [gameId, phase]);

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCancel = async () => {
    clearInterval(pollingRef.current);
    if (gameId) {
      try { await base44.entities.OnlineGame.delete(gameId); } catch {}
    }
    navigate(createPageUrl('Lobby'));
  };

  const qrUrl = inviteCode
    ? `https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=2&data=${encodeURIComponent(buildJoinUrl(inviteCode))}`
    : '';

  if (phase === 'creating') {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#3AAFA9] animate-spin" />
        <p className="text-white/40 text-sm mt-4 tracking-wider">Creating game…</p>
      </div>
    );
  }

  if (phase === 'error') {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center px-6 text-center">
        <p className="text-red-400 text-sm mb-4">{error}</p>
        <button onClick={() => navigate(createPageUrl('Lobby'))}
          className="px-6 py-3 rounded-xl border border-white/15 bg-white/5 text-white/70 text-sm hover:bg-white/10 transition-colors">
          Back to Lobby
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-6 pb-2 shrink-0">
        <button onClick={handleCancel}
          className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 text-center">
          <h1 className="text-sm tracking-[0.2em] uppercase font-bold text-[#3AAFA9]">WiFi Match</h1>
        </div>
        <div className="w-9" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8">
        <motion.div
          className="w-full max-w-sm text-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}>

          {/* Pulsing wifi icon */}
          <div className="relative w-20 h-20 mx-auto mb-6">
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-[#3AAFA9]/30"
              animate={{ scale: [1, 1.4, 1.4], opacity: [0.5, 0, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
            />
            <div className="absolute inset-0 rounded-full bg-[#3AAFA9]/10 border border-[#3AAFA9]/30 flex items-center justify-center">
              <Wifi className="w-9 h-9 text-[#3AAFA9]" />
            </div>
          </div>

          <h2 className="text-xl font-black text-white mb-1">Waiting for opponent</h2>
          <p className="text-white/30 text-xs mb-6">
            Have them scan this code or enter the code manually
          </p>

          {/* QR Code */}
          <div className="inline-block p-4 rounded-2xl bg-white mb-5 shadow-xl">
            {qrUrl && (
              <img src={qrUrl} alt="QR code to join game" className="w-56 h-56" />
            )}
          </div>

          {/* Invite code */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-white/25 text-xs tracking-wider uppercase">Code</span>
            <button onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/15 hover:bg-white/10 transition-colors">
              <span className="text-[#3AAFA9] font-mono font-bold text-xl tracking-[0.2em]">{inviteCode}</span>
              {copied ? <Check className="w-4 h-4 text-[#3AAFA9]" /> : <Copy className="w-3.5 h-3.5 text-white/30" />}
            </button>
          </div>

          <p className="text-white/15 text-[10px] tracking-wider uppercase mb-8">
            Or share the link from the QR code
          </p>

          {/* Hint for joining */}
          <div className="flex items-center justify-center gap-2 text-white/20 text-xs">
            <QrCode className="w-3.5 h-3.5" />
            <span>Join via QR in Play Chess → Join via QR</span>
          </div>

          <button onClick={handleCancel}
            className="mt-8 w-full py-3 rounded-xl border border-white/10 bg-white/5 text-white/50 text-sm hover:text-white hover:bg-white/10 transition-all">
            Cancel
          </button>
        </motion.div>
      </div>
    </div>
  );
}