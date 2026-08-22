import React, { useState, useEffect, useRef } from 'react';

// Thunderstorm overlay — rainfall streaks + periodic lightning flashes.
// Sits above the lobby backdrop and 3D pieces, below the UI controls.
export default function StormOverlay() {
  const [flashOpacity, setFlashOpacity] = useState(0);
  const timeoutRef = useRef();

  useEffect(() => {
    let cancelled = false;

    const scheduleFlash = () => {
      const delay = 4000 + Math.random() * 10000; // 4–14 s between strikes
      timeoutRef.current = setTimeout(() => {
        if (cancelled) return;
        // Quick double-flicker — a bright flash, brief dark, second dimmer flash
        setFlashOpacity(0.14);
        setTimeout(() => { if (!cancelled) setFlashOpacity(0); }, 70);
        setTimeout(() => { if (!cancelled) setFlashOpacity(0.09); }, 140);
        setTimeout(() => { if (!cancelled) setFlashOpacity(0); }, 230);
        scheduleFlash();
      }, delay);
    };
    scheduleFlash();

    return () => { cancelled = true; clearTimeout(timeoutRef.current); };
  }, []);

  // Pre-generate rain drops with randomized properties
  const drops = Array.from({ length: 80 }, () => ({
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 0.5 + Math.random() * 0.5,
    opacity: 0.08 + Math.random() * 0.22,
    height: 25 + Math.random() * 35,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none z-[2] overflow-hidden">
      {/* Rain streaks */}
      {drops.map((d, i) => (
        <div
          key={i}
          className="absolute top-0 w-px"
          style={{
            left: `${d.left}%`,
            height: `${d.height}px`,
            background: 'linear-gradient(to bottom, transparent, rgba(168,230,227,0.45), transparent)',
            opacity: d.opacity,
            animation: `rain-fall ${d.duration}s linear infinite`,
            animationDelay: `${d.delay}s`,
          }}
        />
      ))}

      {/* Lightning flash — radial glow from upper sky */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 25%, rgba(200,225,255,0.55), transparent 70%)',
          opacity: flashOpacity,
          transition: flashOpacity > 0 ? 'opacity 0.03s' : 'opacity 0.4s',
        }}
      />
    </div>
  );
}