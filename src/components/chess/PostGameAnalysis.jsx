import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Loader2, Brain, TrendingUp } from 'lucide-react';
import AnalysisBoard from './AnalysisBoard';
import { analyzeMove } from '@/lib/chessAnalysis';

const DEPTH = 3;

const CLASSIFICATION = {
  best:       { label: 'Best',       color: '#22c55e', bg: 'rgba(34,197,94,0.15)' },
  excellent:  { label: 'Excellent',  color: '#4ade80', bg: 'rgba(74,222,128,0.15)' },
  inaccuracy: { label: 'Inaccuracy', color: '#eab308', bg: 'rgba(234,179,8,0.15)' },
  mistake:    { label: 'Mistake',    color: '#f97316', bg: 'rgba(249,115,22,0.15)' },
  blunder:    { label: 'Blunder',    color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
};

function formatEval(eval_) {
  if (Math.abs(eval_) >= 900) return eval_ > 0 ? '+M' : '\u2212M';
  const clamped = Math.max(-99, Math.min(99, eval_));
  const val = clamped.toFixed(1);
  return clamped > 0 ? `+${val}` : (clamped < 0 ? `\u2212${Math.abs(val)}` : '0.0');
}

const RESULT_LABELS = {
  white_wins: 'White Wins',
  black_wins: 'Black Wins',
  draw: 'Draw',
};

const PROGRESSION_MESSAGES = {
  'novice':          "You've got the basics down now! Ready to see if you can handle a little resistance with the Yellow Belt?",
  'yellow-belt':     "Impressive focus. You're starting to control the board. Think you can hold your own against a Tough Guy?",
  'tough-guy':       "You're really separating yourself from the pack. It's time to see how you fare when the AI starts Getting Serious.",
  'getting-serious': "Strong play! Your tactical awareness is growing fast. Ready to test yourself against the Brick Top?",
  'brick-top':       "Masterful execution. You've conquered the ranks, but the Final Boss is a different beast entirely. Are you ready?",
};

export default function PostGameAnalysis({ moveData, result, mode, onClose }) {
  const [analysis, setAnalysis] = useState([]);
  const [analyzing, setAnalyzing] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    if (!moveData || moveData.length === 0) {
      setAnalyzing(false);
      return;
    }
    let cancelled = false;
    let idx = 0;
    setAnalyzing(true);
    setAnalysis([]);

    function analyzeNext() {
      if (cancelled || idx >= moveData.length) {
        setAnalyzing(false);
        return;
      }
      const res = analyzeMove(moveData[idx], idx, DEPTH);
      setAnalysis(prev => [...prev, res]);
      setProgress(idx + 1);
      idx++;
      setTimeout(analyzeNext, 0);
    }

    const timer = setTimeout(analyzeNext, 100);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [moveData]);

  const current = analysis[currentIdx];
  const currentMove = moveData[currentIdx];

  const blunders = analysis.filter(a => a.classification === 'blunder').length;
  const mistakes = analysis.filter(a => a.classification === 'mistake').length;
  const inaccuracies = analysis.filter(a => a.classification === 'inaccuracy').length;

  if (analyzing && analysis.length === 0) {
    return (
      <motion.div
        className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-[#0a0a0f]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Loader2 className="w-8 h-8 text-[#3AAFA9] animate-spin mb-4" />
        <p className="text-sm text-white/60 tracking-wider">ANALYZING GAME...</p>
        {moveData && (
          <p className="text-xs text-white/30 mt-1">{progress} / {moveData.length} moves</p>
        )}
      </motion.div>
    );
  }

  if (analysis.length === 0) {
    return (
      <motion.div
        className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-[#0a0a0f]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Brain className="w-10 h-10 text-white/20 mb-3" />
        <p className="text-sm text-white/40">No moves to analyze</p>
        <button
          onClick={onClose}
          className="mt-6 px-6 py-2 rounded-lg bg-white/5 border border-white/10 text-white/60 text-sm"
        >
          Close
        </button>
      </motion.div>
    );
  }

  const evalPercent = Math.max(5, Math.min(95, 50 + (current.playedEval / 5) * 50));
  const cls = CLASSIFICATION[current.classification];

  return (
    <motion.div
      className="fixed inset-0 z-[90] flex flex-col bg-[#0a0a0f]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-[#3AAFA9]" />
          <div>
            <h2 className="text-sm font-bold tracking-wider text-white">POST-GAME ANALYSIS</h2>
            {result && <p className="text-[10px] text-white/40">{RESULT_LABELS[result] || result}</p>}
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-white/50 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress bar while analyzing */}
      {analyzing && (
        <div className="px-4 py-1.5 bg-[#3AAFA9]/5 flex items-center gap-2">
          <Loader2 className="w-3 h-3 animate-spin text-[#3AAFA9]" />
          <span className="text-[11px] text-[#3AAFA9]/70">Analyzing... {progress}/{moveData.length}</span>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {/* Board */}
        <div className="flex justify-center py-4">
          <AnalysisBoard
            board={currentMove.boardBefore}
            playedMove={{ from: currentMove.from, to: currentMove.to }}
            bestMove={current.bestMove}
            showBest={!current.isBestMove}
          />
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-4 px-4 mb-3">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-[#3AAFA9]/40" />
            <span className="text-[10px] text-white/40">Played</span>
          </div>
          {!current.isBestMove && (
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-[#D4AF37]/40" />
              <span className="text-[10px] text-white/40">Best Move</span>
            </div>
          )}
        </div>

        {/* Eval bar */}
        <div className="px-4 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-white/30 w-8">EVAL</span>
            <div className="flex-1 h-5 rounded-full overflow-hidden bg-[#1a1a2e] flex">
              <div className="bg-[#2a2a3e] transition-all duration-300" style={{ width: `${100 - evalPercent}%` }} />
              <div className="bg-white/80 transition-all duration-300" style={{ width: `${evalPercent}%` }} />
            </div>
            <span className="text-xs font-mono font-bold text-white/80 w-12 text-right">{formatEval(current.playedEval)}</span>
          </div>
        </div>

        {/* Move info card */}
        <div className="px-4 mb-3">
          <div className="rounded-xl p-3" style={{ background: cls.bg }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white/70">
                <span className="text-white/40">{Math.floor(currentIdx / 2) + 1}{current.movedByWhite ? '.' : '...'}</span>{' '}
                <span className="font-mono font-bold text-white">{current.notation}</span>
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ color: cls.color, background: cls.bg, border: `1px solid ${cls.color}40` }}>
                {cls.label}
              </span>
            </div>
            {current.isBestMove ? (
              <p className="text-xs" style={{ color: '#22c55e' }}>&#10003; This matches the engine's best move</p>
            ) : (
              <p className="text-xs text-white/50">
                Engine suggests:{' '}
                <span className="font-mono font-bold" style={{ color: '#D4AF37' }}>{current.bestNotation}</span>
              </p>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-3 py-3 px-4">
          <button
            onClick={() => setCurrentIdx(0)}
            disabled={currentIdx === 0}
            className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/60 disabled:opacity-30 hover:bg-white/10 transition-colors"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentIdx(i => Math.max(0, i - 1))}
            disabled={currentIdx === 0}
            className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/60 disabled:opacity-30 hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs text-white/40 tabular-nums w-14 text-center">{currentIdx + 1} / {analysis.length}</span>
          <button
            onClick={() => setCurrentIdx(i => Math.min(analysis.length - 1, i + 1))}
            disabled={currentIdx >= analysis.length - 1}
            className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/60 disabled:opacity-30 hover:bg-white/10 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentIdx(analysis.length - 1)}
            disabled={currentIdx >= analysis.length - 1}
            className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/60 disabled:opacity-30 hover:bg-white/10 transition-colors"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>

        {/* Summary */}
        {(blunders > 0 || mistakes > 0 || inaccuracies > 0) && (
          <div className="flex justify-center gap-3 px-4 pb-3">
            {inaccuracies > 0 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ color: '#eab308', background: 'rgba(234,179,8,0.1)' }}>
                {inaccuracies} Inaccuracy{inaccuracies > 1 ? 's' : ''}
              </span>
            )}
            {mistakes > 0 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ color: '#f97316', background: 'rgba(249,115,22,0.1)' }}>
                {mistakes} Mistake{mistakes > 1 ? 's' : ''}
              </span>
            )}
            {blunders > 0 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)' }}>
                {blunders} Blunder{blunders > 1 ? 's' : ''}
              </span>
            )}
          </div>
        )}

        {/* Difficulty progression message (AI wins only) */}
        {mode === 'ai' && result === 'white_wins' && (() => {
          const currentDiff = localStorage.getItem('chessDifficulty') || 'tough-guy';
          const msg = PROGRESSION_MESSAGES[currentDiff];
          if (!msg) return null;
          return (
            <div className="px-4 pb-4">
              <div className="rounded-xl p-4 border border-[#3AAFA9]/30"
                style={{ background: 'linear-gradient(135deg, rgba(58,175,169,0.12) 0%, rgba(58,175,169,0.03) 100%)' }}>
                <div className="flex items-start gap-2.5">
                  <TrendingUp className="w-4 h-4 text-[#3AAFA9] mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-white/80 leading-relaxed">{msg}</p>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Move list */}
        <div className="px-4 pb-8">
          <p className="text-[10px] text-white/30 mb-2 tracking-wider">ALL MOVES</p>
          <div className="space-y-0.5">
            {analysis.map((a, i) => {
              const c = CLASSIFICATION[a.classification];
              return (
                <button
                  key={i}
                  onClick={() => setCurrentIdx(i)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                    i === currentIdx ? 'bg-white/10' : 'hover:bg-white/5'
                  }`}
                >
                  <span className="text-xs text-white/50">
                    {Math.floor(i / 2) + 1}{a.movedByWhite ? '.' : '...'}{' '}
                    <span className="font-mono text-white/80">{a.notation}</span>
                  </span>
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                    style={{ color: c.color, background: c.bg }}
                  >
                    {c.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}