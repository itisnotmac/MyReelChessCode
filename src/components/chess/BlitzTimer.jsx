import React from 'react';

export default function BlitzTimer({ remaining, limit, isActive, label }) {
  const seconds = Math.max(0, Math.ceil(remaining));
  const isLow = seconds <= 10;
  const isCritical = seconds <= 5;

  const color = isCritical ? '#ef4444' : isLow ? '#f59e0b' : '#3AAFA9';
  const pct = Math.max(0, Math.min(100, (remaining / limit) * 100));

  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${isActive ? 'bg-white/5' : 'bg-white/3 border-white/5'}`}
      style={isActive ? { borderColor: color + '60', boxShadow: isCritical ? `0 0 12px ${color}40` : undefined } : {}}
    >
      <span
        className={`text-[10px] tracking-widest uppercase font-medium ${isActive ? '' : 'text-white/30'}`}
        style={isActive ? { color } : {}}
      >
        {label}
      </span>
      <span
        className={`text-2xl font-mono font-black tabular-nums ${isActive ? '' : 'text-white/30'}`}
        style={isActive ? { color, textShadow: isCritical ? `0 0 12px ${color}` : undefined } : {}}
      >
        {String(seconds).padStart(2, '0')}
      </span>
      {isActive && (
        <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden ml-1">
          <div className="h-full rounded-full transition-all duration-200" style={{ width: pct + '%', background: color }} />
        </div>
      )}
    </div>
  );
}