import React, { useEffect, useRef, useState } from 'react';

export default function PlayerTimer({ isActive, label, color }) {
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef(null);
  const startRef = useRef(null);
  const accumulatedRef = useRef(0);

  useEffect(() => {
    if (isActive) {
      startRef.current = Date.now();
      intervalRef.current = setInterval(() => {
        setElapsed(accumulatedRef.current + Math.floor((Date.now() - startRef.current) / 1000));
      }, 500);
    } else {
      if (startRef.current !== null) {
        accumulatedRef.current += Math.floor((Date.now() - startRef.current) / 1000);
        startRef.current = null;
      }
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isActive]);

  const mins = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const secs = String(elapsed % 60).padStart(2, '0');

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${
      isActive
        ? 'border-[#3AAFA9]/60 bg-[#3AAFA9]/10'
        : 'border-white/5 bg-white/3'
    }`}>
      <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-[#3AAFA9] animate-pulse' : 'bg-white/15'}`} />
      <span className={`text-[10px] tracking-widest uppercase font-medium ${isActive ? 'text-[#3AAFA9]' : 'text-white/30'}`}>
        {label}
      </span>
      <span className={`text-sm font-mono font-bold tabular-nums ${isActive ? 'text-white' : 'text-white/30'}`}>
        {mins}:{secs}
      </span>
    </div>
  );
}