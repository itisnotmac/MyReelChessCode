import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Trophy, Trash2, Bot, Users, Clock, Swords, RefreshCw, CheckSquare, Square, Filter, ChevronDown } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';

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
  const [selected, setSelected] = useState(new Set());
  const [selectMode, setSelectMode] = useState(false);
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'ai' | 'local'
  const [filterResult, setFilterResult] = useState('all'); // 'all' | 'white_wins' | 'black_wins' | 'draw'
  const [filterDate, setFilterDate] = useState('all'); // 'all' | 'today' | 'week' | 'month'
  const [showFilters, setShowFilters] = useState(false);

  const fetchHistory = useCallback(async () => {
    const data = await base44.entities.GameHistory.list('-created_date', 200);
    setHistory(data);
  }, []);

  useEffect(() => {
    fetchHistory().finally(() => setLoading(false));
  }, []);

  const { refreshing, pullProgress, containerProps } = usePullToRefresh(fetchHistory);

  const deleteRecord = async (id) => {
    await base44.entities.GameHistory.delete(id);
    setHistory(prev => prev.filter(r => r.id !== id));
  };

  const deleteBatch = async () => {
    const ids = [...selected];
    await Promise.all(ids.map(id => base44.entities.GameHistory.delete(id)));
    setHistory(prev => prev.filter(r => !selected.has(r.id)));
    setSelected(new Set());
    setSelectMode(false);
  };

  const toggleSelect = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map(r => r.id)));
    }
  };

  const filtered = useMemo(() => {
    const now = new Date();
    return history.filter(r => {
      if (filterMode !== 'all' && r.mode !== filterMode) return false;
      if (filterResult !== 'all' && r.result !== filterResult) return false;
      if (filterDate !== 'all') {
        const d = new Date(r.created_date);
        if (filterDate === 'today') {
          if (d.toDateString() !== now.toDateString()) return false;
        } else if (filterDate === 'week') {
          const weekAgo = new Date(now); weekAgo.setDate(now.getDate() - 7);
          if (d < weekAgo) return false;
        } else if (filterDate === 'month') {
          const monthAgo = new Date(now); monthAgo.setMonth(now.getMonth() - 1);
          if (d < monthAgo) return false;
        }
      }
      return true;
    });
  }, [history, filterMode, filterResult, filterDate]);

  const activeFilterCount = [filterMode, filterResult, filterDate].filter(f => f !== 'all').length;

  const stats = {
    total: history.length,
    wins: history.filter(r => r.result === 'white_wins').length,
    losses: history.filter(r => r.result === 'black_wins').length,
    draws: history.filter(r => r.result === 'draw').length,
  };

  const completed = history.filter(r => r.result !== 'in_progress');
  const winRate = completed.length > 0 ? Math.round((stats.wins / completed.length) * 100) : 0;

  return (
    <div
      className="min-h-screen bg-[#0a0a0f] relative overflow-y-auto"
      {...containerProps}
    >
      {/* Subtle grid background */}
      <div className="absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage: `repeating-conic-gradient(#3AAFA9 0% 25%, transparent 0% 50%)`,
          backgroundSize: '44px 44px'
        }}
      />

      {/* Pull-to-refresh indicator */}
      <div
        className="relative z-10 flex items-center justify-center overflow-hidden transition-all duration-200"
        style={{ height: refreshing ? 48 : pullProgress * 48 }}
      >
        <RefreshCw
          className="w-5 h-5 text-[#3AAFA9]"
          style={{
            opacity: Math.max(pullProgress, refreshing ? 1 : 0),
            transform: `rotate(${refreshing ? 'none' : pullProgress * 180 + 'deg'})`,
            animation: refreshing ? 'spin 1s linear infinite' : 'none',
          }}
        />
      </div>

      {/* Header */}
      <div
        className="relative z-10 flex items-center gap-3 px-5 pb-6"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 24px)' }}
      >
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
                <p className="text-xs text-white/50 tracking-wider uppercase mb-2">Total Games Played</p>
                <p className="text-3xl font-black text-white">{stats.total}</p>
              </div>
              <div>
                <p className="text-xs text-white/50 tracking-wider uppercase mb-2">Win Rate</p>
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
                <p className="text-xs text-white/30 tracking-wider uppercase mt-0.5">{s.label}</p>
              </div>
            ))}
          </motion.div>
        )}

        {/* Filter + Select toolbar */}
        {!loading && history.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(v => !v)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-colors flex-1 ${showFilters ? 'bg-[#3AAFA9]/20 border-[#3AAFA9]/40 text-[#3AAFA9]' : 'bg-white/5 border-white/10 text-white/60'}`}
              >
                <Filter className="w-4 h-4" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="ml-auto bg-[#3AAFA9] text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{activeFilterCount}</span>
                )}
                <ChevronDown className={`w-4 h-4 ml-auto transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
              <button
                onClick={() => { setSelectMode(v => !v); setSelected(new Set()); }}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-colors ${selectMode ? 'bg-red-500/20 border-red-500/40 text-red-400' : 'bg-white/5 border-white/10 text-white/60'}`}
              >
                <CheckSquare className="w-4 h-4" />
                Select
              </button>
            </div>

            {/* Filter dropdowns */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-3 gap-2 pb-1">
                    {/* Game Type */}
                    <div className="space-y-1">
                      <p className="text-xs text-white/30 tracking-wider uppercase px-1">Type</p>
                      {[['all', 'All'], ['ai', 'vs AI'], ['local', 'Local']].map(([val, label]) => (
                        <button key={val} onClick={() => setFilterMode(val)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${filterMode === val ? 'bg-[#3AAFA9]/20 text-[#3AAFA9] border border-[#3AAFA9]/30' : 'bg-white/5 text-white/50 border border-transparent'}`}>
                          {label}
                        </button>
                      ))}
                    </div>
                    {/* Result */}
                    <div className="space-y-1">
                      <p className="text-xs text-white/30 tracking-wider uppercase px-1">Result</p>
                      {[['all', 'All'], ['white_wins', 'Won'], ['black_wins', 'Lost'], ['draw', 'Draw']].map(([val, label]) => (
                        <button key={val} onClick={() => setFilterResult(val)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${filterResult === val ? 'bg-[#3AAFA9]/20 text-[#3AAFA9] border border-[#3AAFA9]/30' : 'bg-white/5 text-white/50 border border-transparent'}`}>
                          {label}
                        </button>
                      ))}
                    </div>
                    {/* Date */}
                    <div className="space-y-1">
                      <p className="text-xs text-white/30 tracking-wider uppercase px-1">Date</p>
                      {[['all', 'All Time'], ['today', 'Today'], ['week', 'This Week'], ['month', 'This Month']].map(([val, label]) => (
                        <button key={val} onClick={() => setFilterDate(val)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${filterDate === val ? 'bg-[#3AAFA9]/20 text-[#3AAFA9] border border-[#3AAFA9]/30' : 'bg-white/5 text-white/50 border border-transparent'}`}>
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Batch select bar */}
            {selectMode && (
              <div className="flex items-center gap-2">
                <button onClick={toggleSelectAll} className="flex items-center gap-2 text-xs text-white/50 hover:text-white transition-colors">
                  {selected.size === filtered.length && filtered.length > 0
                    ? <CheckSquare className="w-4 h-4 text-[#3AAFA9]" />
                    : <Square className="w-4 h-4" />
                  }
                  {selected.size === filtered.length && filtered.length > 0 ? 'Deselect All' : 'Select All'}
                </button>
                {selected.size > 0 && (
                  <button onClick={deleteBatch}
                    className="ml-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 text-sm font-medium hover:bg-red-500/30 transition-colors">
                    <Trash2 className="w-4 h-4" />
                    Delete {selected.size} game{selected.size > 1 ? 's' : ''}
                  </button>
                )}
              </div>
            )}
          </div>
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
        ) : filtered.length === 0 ? (
          <motion.div
            className="rounded-2xl bg-white/5 border border-white/5 p-12 text-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          >
            <Filter className="w-10 h-10 text-white/10 mx-auto mb-3" />
            <p className="text-white/40 text-sm">No games match your filters.</p>
          </motion.div>
        ) : (
          <AnimatePresence>
            {filtered.map((record, i) => (
              <motion.div
                key={record.id}
                className={`rounded-2xl border p-4 transition-colors ${selected.has(record.id) ? 'bg-[#3AAFA9]/10 border-[#3AAFA9]/30' : 'bg-white/5 border-white/5'}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ delay: i * 0.03 }}
                onClick={selectMode ? () => toggleSelect(record.id) : undefined}
              >
                <div className="flex items-start justify-between gap-3">
                  {selectMode && (
                    <div className="flex items-center mt-1 flex-shrink-0">
                      {selected.has(record.id)
                        ? <CheckSquare className="w-5 h-5 text-[#3AAFA9]" />
                        : <Square className="w-5 h-5 text-white/20" />
                      }
                    </div>
                  )}
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
                        <span className="flex items-center gap-1 text-xs text-white/30">
                          <Swords className="w-3 h-3" />
                          {record.moves_count || 0} moves
                        </span>
                        <span className="flex items-center gap-1 text-xs text-white/30">
                          <Clock className="w-3 h-3" />
                          {formatDuration(record.duration_seconds)}
                        </span>
                        <span className="text-xs text-white/20">
                          {formatDate(record.created_date)} · {formatTime(record.created_date)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {!selectMode && (
                    <button
                      onClick={() => deleteRecord(record.id)}
                      className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-colors flex-shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}