import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Trophy, Trash2, Bot, Users, Clock, Swords } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const resultLabel = (r) => ({ white_wins: 'White Won', black_wins: 'Black Won', draw: 'Draw', in_progress: 'Abandoned' }[r] || r);
const resultColor = (r) => ({ white_wins: '#D4AF37', black_wins: '#9B59B6', draw: '#3AAFA9', in_progress: '#555' }[r] || '#888');

function formatDuration(secs) {
  if (!secs) return '—';
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTime(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

export default function GameHistoryPage() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.GameHistory.list('-created_date', 50)
      .then(setHistory)
      .finally(() => setLoading(false));
  }, []);

  const deleteRecord = async (id) => {
    await base44.entities.GameHistory.delete(id);
    setHistory(prev => prev.filter(r => r.id !== id));
  };

  const stats = {
    total: history.length,
    wins: history.filter(r => r.result === 'white_wins').length,
    losses: history.filter(r => r.result === 'black_wins').length,
    draws: history.filter(r => r.result === 'draw').length,
  };

  const completed = history.filter(r => r.result !== 'in_progress');
  const winRate = completed.length > 0 ? Math.round((stats.wins / completed.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative">
      {/* Subtle grid background */}
      <div className="absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage: `repeating-conic-gradient(#3AAFA9 0% 25%, transparent 0% 50%)`,
          backgroundSize: '44px 44px'
        }}
      />

      {/* Header */}
      <div className="relative z-10 flex items-center gap-3 px-5 pt-6 pb-6">
        <button
          onClick={() => navigate(createPageUrl('Lobby'))}
          className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-[#D4AF37]" />
          <h1 className="text-lg font-bold tracking-wider text-white">Game History</h1>
        </div>
      </div>

      <div className="relative z-10 px-5 pb-10 space-y-5">
        {/* Summary section */}
        {!loading && history.length > 0 && (
          <motion.div
            className="rounded-2xl bg-gradient-to-br from-[#3AAFA9]/20 to-[#3AAFA9]/5 border border-[#3AAFA9]/30 p-5"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          >
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-[11px] text-white/50 tracking-wider uppercase mb-2">Total Games Played</p>
                <p className="text-3xl font-black text-white">{stats.total}</p>
              </div>
              <div>
                <p className="text-[11px] text-white/50 tracking-wider uppercase mb-2">Win Rate</p>
                <p className="text-3xl font-black text-[#D4AF37]">{winRate}%</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Stats row */}
        {!loading && history.length > 0 && (
          <motion.div
            className="grid grid-cols-4 gap-2"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          >
            {[
              { label: 'Played', value: stats.total, color: 'text-white' },
              { label: 'Won', value: stats.wins, color: 'text-[#D4AF37]' },
              { label: 'Lost', value: stats.losses, color: 'text-[#9B59B6]' },
              { label: 'Draws', value: stats.draws, color: 'text-[#3AAFA9]' },
            ].map(s => (
              <div key={s.label} className="rounded-xl bg-white/5 border border-white/5 p-3 text-center">
                <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
                <p className="text-[10px] text-white/30 tracking-wider uppercase mt-0.5">{s.label}</p>
              </div>
            ))}
          </motion.div>
        )}

        {/* Game list */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-[#3AAFA9]/30 border-t-[#3AAFA9] rounded-full animate-spin" />
          </div>
        ) : history.length === 0 ? (
          <motion.div
            className="rounded-2xl bg-white/5 border border-white/5 p-12 text-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          >
            <Trophy className="w-10 h-10 text-white/10 mx-auto mb-3" />
            <p className="text-white/40 text-sm">No games recorded yet.</p>
            <p className="text-white/20 text-xs mt-1">Play a game to see your history here.</p>
          </motion.div>
        ) : (
          <AnimatePresence>
            {history.map((record, i) => (
              <motion.div
                key={record.id}
                className="rounded-2xl bg-white/5 border border-white/5 p-4"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ delay: i * 0.04 }}
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Left: mode + result */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#3AAFA9]/10 border border-[#3AAFA9]/20 flex items-center justify-center flex-shrink-0">
                      {record.mode === 'ai'
                        ? <Bot className="w-4 h-4 text-[#3AAFA9]" />
                        : <Users className="w-4 h-4 text-[#3AAFA9]" />
                      }
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-white text-sm font-semibold">
                          {record.mode === 'ai' ? 'vs AI' : 'Local PvP'}
                        </span>
                        <span
                          className="text-xs font-bold tracking-wider px-2 py-0.5 rounded-full"
                          style={{
                            color: resultColor(record.result),
                            background: resultColor(record.result) + '20',
                          }}
                        >
                          {resultLabel(record.result)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        <span className="flex items-center gap-1 text-[11px] text-white/30">
                          <Swords className="w-3 h-3" />
                          {record.moves_count || 0} moves
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-white/30">
                          <Clock className="w-3 h-3" />
                          {formatDuration(record.duration_seconds)}
                        </span>
                        <span className="text-[11px] text-white/20">
                          {formatDate(record.created_date)} · {formatTime(record.created_date)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => deleteRecord(record.id)}
                    className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-colors flex-shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}