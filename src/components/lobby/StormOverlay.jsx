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
        setFlashOpacity(0.3);
        setTimeout(() => { if (!cancelled) setFlashOpacity(0); }, 80);
        setTimeout(() => { if (!cancelled) setFlashOpacity(0.2); }, 160);
        setTimeout(() => { if (!cancelled) setFlashOpacity(0); }, 260);
        scheduleFlash();
      }, delay);
    };
    scheduleFlash();

    return () => { cancelled = true; clearTimeout(timeoutRef.current); };
  }, []);

  // Pre-generate rain drops with randomized properties
  const drops = Array.from({ length: 120 }, () => ({
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 0.4 + Math.random() * 0.4,
    opacity: 0.15 + Math.random() * 0.35,
    height: 30 + Math.random() * 40,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none z-[2] overflow-hidden">
      {/* Rain streaks */}
      {drops.map((d, i) => (
        <div
          key={i}
          className="absolute top-0"
          style={{
            left: `${d.left}%`,
            width: '2px',
            height: `${d.height}px`,
            background: 'linear-gradient(to bottom, transparent, rgba(180,210,235,0.7), transparent)',
            opacity: d.opacity,
            animation: `rain-fall ${d.duration}s linear infinite`,
            animationDelay: `${d.delay}s`,
          }}
        />
      ))}

      {/* Lightning flash — full-screen illumination */}
      <div
        className="absolute inset-0"
        style={{
          background: 'rgba(210,225,255,1)',
          opacity: flashOpacity,
          transition: flashOpacity > 0 ? 'opacity 0.03s' : 'opacity 0.5s',
        }}
      />
      {/* Lightning radial glow from upper sky */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 20%, rgba(200,225,255,0.8), transparent 65%)',
          opacity: flashOpacity * 1.5,
          transition: flashOpacity > 0 ? 'opacity 0.03s' : 'opacity 0.5s',
        }}
      />
    </div>
  );
}