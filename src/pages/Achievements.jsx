import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Award, Loader2, RefreshCw } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { ACHIEVEMENTS, computeStats, evaluateAchievements, AchievementBadge } from '@/lib/achievements';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';

export default function Achievements() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    const data = await base44.entities.GameHistory.list('-created_date', 200);
    setHistory(data);
  }, []);

  useEffect(() => {
    fetchData().finally(() => setLoading(false));
  }, []);

  const { refreshing, pullProgress, containerProps } = usePullToRefresh(fetchData);

  const stats = computeStats(history);
  const earned = evaluateAchievements(stats);
  const earnedCount = Object.values(earned).filter(Boolean).length;
  const totalCount = ACHIEVEMENTS.length;

  return (
    <div
      className="min-h-screen bg-[#0a0a0f] relative overflow-y-auto"
      style={{
        backgroundImage: `linear-gradient(rgba(10,10,15,0.45), rgba(10,10,15,0.68)), url(https://media.base44.com/images/public/69ab30c24c8c7db2b8432adf/af02e57a5_generated_image.png)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
      {...containerProps}
    >
      <div className="absolute inset-0 opacity-[0.018]"
        style={{ backgroundImage: `repeating-conic-gradient(#3AAFA9 0% 25%, transparent 0% 50%)`, backgroundSize: '44px 44px' }}
      />

      {/* Pull-to-refresh */}
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
      <div className="relative z-10 flex items-center gap-3 px-5 pb-4"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 24px)' }}>
        <button onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/'))}
          className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-[#3AAFA9]" />
          <h1 className="text-lg font-bold tracking-wider text-white">Achievements</h1>
        </div>
      </div>

      <div className="relative z-10 px-5 pb-10 space-y-5">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-6 h-6 text-[#3AAFA9] animate-spin" />
          </div>
        ) : (
          <>
            {/* Progress summary */}
            <motion.div
              className="rounded-2xl bg-white/5 border border-white/5 p-5"
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs text-white/30 tracking-wider uppercase">Badges Earned</p>
                  <p className="text-3xl font-black text-white">
                    {earnedCount}<span className="text-lg text-white/30">/{totalCount}</span>
                  </p>
                </div>
                <div className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ background: earnedCount > 0 ? 'rgba(212,175,55,0.1)' : 'rgba(255,255,255,0.03)', border: `1px solid ${earnedCount > 0 ? 'rgba(212,175,55,0.3)' : 'rgba(255,255,255,0.05)'}` }}>
                  <span className="text-xl font-black" style={{ color: earnedCount > 0 ? '#D4AF37' : 'rgba(255,255,255,0.2)' }}>
                    {Math.round((earnedCount / totalCount) * 100)}%
                  </span>
                </div>
              </div>
              <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, #3AAFA9, #D4AF37)' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(earnedCount / totalCount) * 100}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              </div>
            </motion.div>

            {/* Badge grid — hidden achievements only appear once earned */}
            <div className="grid grid-cols-2 gap-3">
              {ACHIEVEMENTS.filter(ach => !ach.hidden || earned[ach.id]).map((ach, i) => (
                <AchievementBadge
                  key={ach.id}
                  achievement={ach}
                  earned={earned[ach.id]}
                  delay={0.05 + i * 0.03}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}