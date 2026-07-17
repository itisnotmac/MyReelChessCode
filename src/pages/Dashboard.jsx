import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, BarChart2, Clock, Swords, Trophy, Bot, Users, TrendingUp, RefreshCw } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import { HERO_BACKDROPS } from '@/lib/heroBackdrops';

function formatDuration(secs) {
  if (!secs) return '—';
  const m = Math.floor(secs / 60);
  const s = Math.round(secs % 60);
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function StatCard({ icon: Icon, label, value, sub, color = '#3AAFA9', delay = 0 }) {
  return (
    <motion.div
      className="rounded-2xl bg-white/5 border border-white/5 p-4 flex flex-col gap-2"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: color + '18', border: `1px solid ${color}30` }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        <span className="text-xs text-white/30 tracking-wider uppercase">{label}</span>
      </div>
      <p className="text-2xl font-black text-white leading-none">{value}</p>
      {sub && <p className="text-xs text-white/30">{sub}</p>}
    </motion.div>
  );
}

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg bg-[#1a1a24] border border-white/10 px-3 py-2 text-xs text-white">
        <p className="font-bold">{payload[0].payload.name}</p>
        <p className="text-white/50">{payload[0].value} games</p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    const [data, accounts] = await Promise.all([
      base44.entities.GameHistory.list('-created_date', 200),
      base44.entities.PlayerAccount.list().catch(() => []),
    ]);
    setHistory(data);
    setAccount(accounts[0] || null);
  }, []);

  useEffect(() => {
    fetchData().finally(() => setLoading(false));
  }, []);

  const { refreshing, pullProgress, containerProps } = usePullToRefresh(fetchData);

  const completed = history.filter(r => r.result !== 'in_progress');
  const total = history.length;
  const wins = history.filter(r => r.result === 'white_wins').length;
  const losses = history.filter(r => r.result === 'black_wins').length;
  const draws = history.filter(r => r.result === 'draw').length;
  const winRate = completed.length > 0 ? Math.round((wins / completed.length) * 100) : 0;

  const durGames = history.filter(r => r.duration_seconds > 0);
  const avgDuration = durGames.length > 0
    ? durGames.reduce((a, b) => a + b.duration_seconds, 0) / durGames.length
    : 0;

  const avgMoves = completed.length > 0
    ? Math.round(completed.reduce((a, b) => a + (b.moves_count || 0), 0) / completed.length)
    : 0;

  const aiGames = history.filter(r => r.mode === 'ai').length;
  const pvpGames = history.filter(r => r.mode === 'local').length;

  const activityData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const label = d.toLocaleDateString(undefined, { weekday: 'short' });
    const count = history.filter(r => {
      const rd = new Date(r.created_date);
      return rd.toDateString() === d.toDateString();
    }).length;
    return { name: label, count };
  });

  return (
    <div
      className="min-h-screen bg-[#0a0a0f] relative overflow-y-auto"
      style={{
        backgroundImage: `linear-gradient(rgba(10,10,15,0.45), rgba(10,10,15,0.68)), url(${HERO_BACKDROPS.warRoomHologram})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
      {...containerProps}
    >
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
          <BarChart2 className="w-4 h-4 text-[#3AAFA9]" />
          <h1 className="text-lg font-bold tracking-wider text-white">Stats</h1>
        </div>
      </div>

      <div className="relative z-10 px-5 pb-10 space-y-5">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-6 h-6 border-2 border-[#3AAFA9]/30 border-t-[#3AAFA9] rounded-full animate-spin" />
          </div>
        ) : total === 0 ? (
          <motion.div
            className="rounded-2xl bg-white/5 border border-white/5 p-12 text-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          >
            <BarChart2 className="w-10 h-10 text-white/10 mx-auto mb-3" />
            <p className="text-white/40 text-sm">No data yet.</p>
            <p className="text-white/20 text-xs mt-1">Play some games to see your stats.</p>
          </motion.div>
        ) : (
          <>
            {account?.elo != null && (
              <motion.div
                className="rounded-2xl bg-white/5 border border-white/5 p-5 flex items-center gap-4"
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: '#3AAFA918', border: '1px solid #3AAFA930' }}>
                  <Trophy className="w-6 h-6 text-[#3AAFA9]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-white/30 tracking-wider uppercase">Rating (ELO)</p>
                  <p className="text-4xl font-black text-white leading-none mt-1">{account.elo}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/30 tracking-wider uppercase">Peak</p>
                  <p className="text-lg font-bold text-[#D4AF37] mt-1">{account.peak_elo ?? account.elo}</p>
                </div>
              </motion.div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <StatCard icon={Trophy} label="Total Games" value={total} sub={`${aiGames} vs AI · ${pvpGames} PvP`} color="#D4AF37" delay={0} />
              <StatCard icon={TrendingUp} label="Win Rate" value={`${winRate}%`} sub={`${wins}W · ${losses}L · ${draws}D`} color="#3AAFA9" delay={0.05} />
              <StatCard icon={Clock} label="Avg Duration" value={formatDuration(avgDuration)} sub="per game" color="#9B59B6" delay={0.1} />
              <StatCard icon={Swords} label="Avg Moves" value={avgMoves || '—'} sub="per game" color="#E67E22" delay={0.15} />
            </div>

            <motion.div
              className="rounded-2xl bg-white/5 border border-white/5 p-4"
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            >
              <p className="text-xs text-white/30 tracking-wider uppercase mb-3">Results Breakdown</p>
              <div className="flex rounded-full overflow-hidden h-3 gap-0.5">
                {wins > 0 && <div className="bg-[#D4AF37] transition-all" style={{ flex: wins }} />}
                {losses > 0 && <div className="bg-[#9B59B6] transition-all" style={{ flex: losses }} />}
                {draws > 0 && <div className="bg-[#3AAFA9] transition-all" style={{ flex: draws }} />}
              </div>
              <div className="flex gap-4 mt-3">
                {[{ label: 'Wins', val: wins, c: '#D4AF37' }, { label: 'Losses', val: losses, c: '#9B59B6' }, { label: 'Draws', val: draws, c: '#3AAFA9' }].map(item => (
                  <div key={item.label} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: item.c }} />
                    <span className="text-xs text-white/40">{item.label} <span className="text-white/70 font-semibold">{item.val}</span></span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="rounded-2xl bg-white/5 border border-white/5 p-4"
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            >
              <p className="text-xs text-white/30 tracking-wider uppercase mb-4">Last 7 Days</p>
              <ResponsiveContainer width="100%" height={110}>
                <BarChart data={activityData} barSize={20}>
                  <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis hide allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {activityData.map((entry, i) => (
                      <Cell key={i} fill={entry.count > 0 ? '#3AAFA9' : 'rgba(255,255,255,0.06)'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div
              className="rounded-2xl bg-white/5 border border-white/5 p-4"
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            >
              <p className="text-xs text-white/30 tracking-wider uppercase mb-3">Game Mode</p>
              <div className="flex gap-3">
                <div className="flex-1 rounded-xl bg-[#3AAFA9]/10 border border-[#3AAFA9]/20 p-3 flex items-center gap-3">
                  <Bot className="w-5 h-5 text-[#3AAFA9]" />
                  <div>
                    <p className="text-lg font-black text-white">{aiGames}</p>
                    <p className="text-xs text-white/30 uppercase tracking-wider">vs AI</p>
                  </div>
                </div>
                <div className="flex-1 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 p-3 flex items-center gap-3">
                  <Users className="w-5 h-5 text-[#D4AF37]" />
                  <div>
                    <p className="text-lg font-black text-white">{pvpGames}</p>
                    <p className="text-xs text-white/30 uppercase tracking-wider">Local PvP</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}