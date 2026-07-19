import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Trophy, Users, DollarSign, Loader2, Crown, CheckCircle2, AlertTriangle, Swords } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';

const STATUS_LABEL = {
  draft: 'Coming Soon',
  registration: 'Open Registration',
  active: 'Live Now',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

const STATUS_COLOR = {
  draft: '#9B59B6',
  registration: '#3AAFA9',
  active: '#D4AF37',
  completed: '#64748b',
  cancelled: '#ef4444',
};

function money(cents) {
  return `$${(cents / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
}

function safeParse(str) {
  try { return str ? JSON.parse(str) : null; } catch { return null; }
}

export default function Tournament() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [tournaments, setTournaments] = useState([]);
  const [myEntries, setMyEntries] = useState({});
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(null);
  const [adminMsg, setAdminMsg] = useState(null);
  const [starting, setStarting] = useState(null);
  const [myGames, setMyGames] = useState({});
  const isAdmin = user?.role === 'admin';

  const fetchData = useCallback(async () => {
    const data = await base44.entities.Tournament.list('-created_date', 50);
    setTournaments(data);
    const mine = {};
    const activeGames = {};
    if (user?.id) {
      const my = await base44.entities.TournamentEntry.filter({ user_id: user.id });
      for (const e of my) if (e.payment_status === 'paid') mine[e.tournament_id] = e;
      // Find the user's live tournament match (host or guest, active, unsettled)
      const asHost = await base44.entities.OnlineGame.filter({ host_id: user.id, status: 'active' });
      const asGuest = await base44.entities.OnlineGame.filter({ guest_id: user.id, status: 'active' });
      for (const g of [...asHost, ...asGuest]) {
        if (g.tournament_id && !g.tournament_settled) activeGames[g.tournament_id] = g.id;
      }
    }
    setMyEntries(mine);
    setMyGames(activeGames);
  }, [user?.id]);

  useEffect(() => { fetchData().finally(() => setLoading(false)); }, [fetchData]);
  const { refreshing, pullProgress, containerProps } = usePullToRefresh(fetchData);

  const handleRegister = async (t) => {
    if (!isAuthenticated) { navigate('/login'); return; }
    // Premium subscribers register instantly via the Tournament Pass model
    if (!user?.is_premium) { navigate('/Store'); return; }
    setPaying(t.id);
    try {
      await base44.functions.invoke('registerForTournament', { tournament_id: t.id });
      fetchData();
    } catch (e) {
      alert(e.response?.data?.error || e.message || 'Failed to register');
    } finally {
      setPaying(null);
    }
  };

  const handleStart = async (t) => {
    if (!isAdmin) return;
    if (!confirm(`Start "${t.name}"? This checks turnout (min ${t.min_players}). Below the minimum, all buy-ins are refunded.`)) return;
    setStarting(t.id);
    try {
      const res = await base44.functions.invoke('processTournamentStart', { tournament_id: t.id });
      setAdminMsg(res.data?.message || 'Tournament processed.');
      fetchData();
    } catch (e) {
      setAdminMsg(e.response?.data?.error || e.message || 'Failed to process tournament.');
    } finally {
      setStarting(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-y-auto" {...containerProps}>
      {/* Cinematic backdrop — gothic cathedral */}
      <div className="absolute inset-0 z-0">
        <img src="https://media.base44.com/images/public/69ab30c24c8c7db2b8432adf/bac81919d_generated_image.png" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(120% 80% at 50% 12%, rgba(10,10,15,0.18) 0%, rgba(10,10,15,0.5) 60%, rgba(10,10,15,0.82) 100%)' }} />
      </div>

      <div className="relative z-10 flex items-center justify-center overflow-hidden transition-all duration-200"
        style={{ height: refreshing ? 48 : pullProgress * 48 }}>
        <Loader2 className="w-5 h-5 text-[#3AAFA9]" style={{ opacity: Math.max(pullProgress, refreshing ? 1 : 0), animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
      </div>

      <div className="relative z-10 flex items-center gap-3 px-5 pb-6" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 24px)' }}>
        <button onClick={() => navigate(createPageUrl('Lobby'))}
          className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-[#D4AF37]" />
          <h1 className="text-lg font-bold tracking-wider text-white">Tournaments</h1>
        </div>
      </div>

      <div className="relative z-10 px-5 pb-10 space-y-4">
        {adminMsg && (
          <div className="rounded-xl bg-[#3AAFA9]/10 border border-[#3AAFA9]/30 p-3 text-sm text-[#3AAFA9] flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{adminMsg}</span>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-6 h-6 border-2 border-[#3AAFA9]/30 border-t-[#3AAFA9] rounded-full animate-spin" />
          </div>
        ) : tournaments.length === 0 ? (
          <motion.div className="rounded-2xl bg-white/5 border border-white/5 p-12 text-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Trophy className="w-10 h-10 text-white/10 mx-auto mb-3" />
            <p className="text-white/40 text-sm">No tournaments scheduled yet.</p>
            <p className="text-white/20 text-xs mt-1">Player-funded tournaments go live at launch. Stay tuned!</p>
          </motion.div>
        ) : (
          tournaments.map((t, i) => {
            const registered = myEntries[t.id];
            const filled = t.min_players ? Math.min(100, Math.round(((t.paid_entries || 0) / t.min_players) * 100)) : 0;
            return (
              <motion.div key={t.id}
                className="rounded-2xl bg-white/5 border border-white/5 p-5 space-y-4"
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>

                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-base font-bold text-white tracking-wide">{t.name}</h2>
                    {t.description && <p className="text-xs text-white/40 mt-1">{t.description}</p>}
                  </div>
                  <span className="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase"
                    style={{ background: STATUS_COLOR[t.status] + '22', color: STATUS_COLOR[t.status], border: `1px solid ${STATUS_COLOR[t.status]}44` }}>
                    {STATUS_LABEL[t.status]}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-xl bg-white/5 p-3 text-center">
                    <DollarSign className="w-4 h-4 text-[#D4AF37] mx-auto mb-1" />
                    <p className="text-sm font-black text-white">{money(t.buy_in_amount || 1000)}</p>
                    <p className="text-[9px] text-white/30 uppercase tracking-wider">Buy-In</p>
                  </div>
                  <div className="rounded-xl bg-white/5 p-3 text-center">
                    <Users className="w-4 h-4 text-[#3AAFA9] mx-auto mb-1" />
                    <p className="text-sm font-black text-white">{t.paid_entries || 0}<span className="text-white/30 text-xs">/{t.min_players || 200}</span></p>
                    <p className="text-[9px] text-white/30 uppercase tracking-wider">Entered</p>
                  </div>
                  <div className="rounded-xl bg-white/5 p-3 text-center">
                    <Crown className="w-4 h-4 text-[#9B59B6] mx-auto mb-1" />
                    <p className="text-sm font-black text-white">{money(t.prize_pool || (t.buy_in_amount || 1000) * (t.paid_entries || 0))}</p>
                    <p className="text-[9px] text-white/30 uppercase tracking-wider">Prize Pool</p>
                  </div>
                </div>

                {/* Turnout progress bar */}
                <div>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${filled}%`, background: 'linear-gradient(90deg, #3AAFA9, #D4AF37)' }} />
                  </div>
                  <p className="text-[10px] text-white/30 mt-1">{filled}% to minimum turnout — under {t.min_players || 200} entries are fully refunded.</p>
                </div>

                {/* Competitive rules note */}
                <div className="rounded-xl bg-[#3AAFA9]/5 border border-[#3AAFA9]/15 p-3">
                  <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Tournament Rules</p>
                  <p className="text-xs text-white/60">Cutscenes, move hints, last-move indicator & 3D view are disabled for competitive play.</p>
                </div>

                {/* Payout split + finalized winners (Top 8) */}
                {(() => {
                  const split = safeParse(t.prize_structure);
                  const results = safeParse(t.results);
                  if (!split) return null;
                  const started = (t.prize_pool || 0) > 0;
                  const labels = { 1: '1st Place', 2: '2nd Place', 3: '3rd Place', 4: '4th Place' };
                  const val = (pct) => started
                    ? money(Math.round((pct / 100) * t.prize_pool))
                    : `${pct}%`;
                  const tierPct = split['5_8'] || 0;
                  const tierEach = started
                    ? money(Math.round((tierPct / 4 / 100) * t.prize_pool))
                    : `${(tierPct / 4).toFixed(tierPct % 4 ? 1 : 0)}%`;
                  const tierNames = results?.['5_8'];
                  return (
                    <div className="rounded-xl bg-[#D4AF37]/5 border border-[#D4AF37]/20 p-3 space-y-2">
                      <p className="text-[10px] text-[#D4AF37] uppercase tracking-wider">
                        {started ? 'Payouts (Top 8)' : 'Payout Split (Top 8)'}
                      </p>
                      {[1, 2, 3, 4].map(p => (
                        <div key={p} className="flex items-center justify-between text-xs">
                          <span className="text-white/60">
                            {labels[p]}{results?.[p]?.name ? <span className="text-white/40"> — {results[p].name}</span> : null}
                          </span>
                          <span className="text-[#D4AF37] font-bold">{val(split[p] || 0)}</span>
                        </div>
                      ))}
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white/60">
                          5th–8th{tierNames?.length ? <span className="text-white/40"> — {tierNames.map(n => n.name).join(', ')}</span> : null}
                        </span>
                        <span className="text-[#D4AF37] font-bold">
                          {tierEach}<span className="text-white/30 font-normal text-[10px]"> each</span>
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] pt-1.5 border-t border-white/5">
                        <span className="text-white/30">House (platform)</span>
                        <span className="text-white/40">{val(split.house || 0)}</span>
                      </div>
                      <p className="text-[10px] text-white/30 pt-0.5">
                        All non-cashing players receive 3 months of Reel Chess Premium.
                      </p>
                    </div>
                  );
                })()}

                {myGames[t.id] && (
                  <button onClick={() => navigate(`/OnlineGame?game=${myGames[t.id]}`)}
                    className="w-full py-3 rounded-xl font-black text-sm tracking-wider uppercase transition-all active:scale-95 flex items-center justify-center gap-2"
                    style={{ background: 'linear-gradient(135deg, #D4AF37, #b8932f)', color: '#1a1a0f', boxShadow: '0 0 24px rgba(212,175,55,0.35)' }}>
                    <Swords className="w-4 h-4" /> Join Your Match
                  </button>
                )}

                <div className="flex gap-2">
                  {registered ? (
                    <div className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] font-bold text-sm">
                      <CheckCircle2 className="w-4 h-4" /> Registered
                    </div>
                  ) : t.status === 'registration' ? (
                    <button onClick={() => handleRegister(t)} disabled={paying === t.id}
                      className="flex-1 py-3 rounded-xl font-black text-sm tracking-wider uppercase transition-all active:scale-95 disabled:opacity-50"
                      style={{ background: 'linear-gradient(135deg, #3AAFA9, #2d8c87)', color: '#000', boxShadow: '0 0 24px rgba(58,175,169,0.3)' }}>
                      {paying === t.id
                        ? <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                        : (user?.is_premium ? 'Enter Tournament' : 'Unlock with Premium')}
                    </button>
                  ) : (
                    <div className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-white/40 text-sm text-center">
                      {t.status === 'draft' ? 'Registration opens soon' : t.status === 'active' ? 'Tournament in progress' : 'Tournament ended'}
                    </div>
                  )}

                  {isAdmin && (t.status === 'registration' || t.status === 'active') && (
                    <button onClick={() => handleStart(t)} disabled={starting === t.id}
                      className="px-4 py-3 rounded-xl border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-bold tracking-wider uppercase active:scale-95 disabled:opacity-50">
                      {starting === t.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Start'}
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}