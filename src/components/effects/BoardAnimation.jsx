import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

// 16-color cyber palette. Slot s lights quadrant (s % 4): TL, TR, BR, BL, repeating.
const CYBER = [
  '#39FF14', '#00F0FF', '#FF2E97', '#FF8A00',
  '#B026FF', '#FFE600', '#2D6BFF', '#FF3131',
  '#00FFA3', '#FF00E5', '#7DF9FF', '#C6FF00',
  '#FF6EC7', '#00BFFF', '#8A2BE2', '#FF5E00',
];
const QUAD = [{ l: 0, t: 0 }, { l: 50, t: 0 }, { l: 50, t: 50 }, { l: 0, t: 50 }];
const SLOT = 1.2;
const CYCLE = CYBER.length * SLOT;

const ROOT = { contain: 'paint', isolation: 'isolate' };
const rand = (a, b) => a + Math.random() * (b - a);

/* ---------- Lava: cracks, organic streams, pool, drips (no SVG, transform/opacity only) ---------- */

const LAVA_STREAM_COUNT = 24; // tweak: how many places lava oozes from

const CRACKS = [
  [[0, 14], [15, 21], [28, 18], [42, 31], [55, 27], [72, 38], [100, 33]],
  [[10, 52], [24, 46], [36, 52], [52, 47], [66, 56], [88, 50], [100, 54]],
  [[30, 0], [36, 10], [50, 14], [58, 22], [72, 20]],
];
const CRACK_SEGS = CRACKS.map(pts => pts.slice(1).map((p, i) => {
  const [x1, y1] = pts[i];
  const dx = p[0] - x1, dy = p[1] - y1;
  return { x: x1, y: y1, len: Math.hypot(dx, dy), ang: (Math.atan2(dy, dx) * 180) / Math.PI };
}));

/** Wobbly stream outline with a rounded head — nothing right-angled. */
function organicPolygon() {
  const steps = 10;
  const left = [], right = [];
  for (let i = 0; i <= steps; i++) {
    const y = (i / steps) * 92;
    const bulge = i > steps - 3 ? 6 : 0;
    left.push(`${(rand(-4, 16) - bulge).toFixed(1)}% ${y.toFixed(1)}%`);
    right.push(`${(rand(84, 104) + bulge).toFixed(1)}% ${y.toFixed(1)}%`);
  }
  const head = ['12% 96%', '30% 99.5%', '50% 100%', '70% 99.5%', '88% 96%'];
  return `polygon(${left.join(', ')}, ${head.join(', ')}, ${right.reverse().join(', ')})`;
}

function makeLavaStreams(n) {
  const flat = CRACK_SEGS.flat();
  const total = flat.reduce((s, g) => s + g.len, 0);
  const pick = () => {
    let r = Math.random() * total;
    for (const g of flat) { r -= g.len; if (r <= 0) return g; }
    return flat[0];
  };
  return Array.from({ length: n }, () => {
    const g = pick();
    const t = Math.random();
    const rad = (g.ang * Math.PI) / 180;
    const x = Math.min(98, Math.max(2, g.x + Math.cos(rad) * g.len * t));
    const y = Math.min(75, Math.max(0, g.y + Math.sin(rad) * g.len * t));
    const reachPool = Math.random() < 0.3;
    const endY = reachPool ? 88 : Math.min(88, y + rand(14, 38));
    return {
      x, y, w: rand(1.6, 3.0), h: Math.max(8, endY - y),
      delay: rand(1, 28), grow: rand(8, 16), flow: rand(6, 11),
      poly: organicPolygon(),
    };
  });
}

const DRIPS = [
  { left: '8%',  delay: 1,   gap: 7 },
  { left: '22%', delay: 4,   gap: 8 },
  { left: '37%', delay: 7.5, gap: 6 },
  { left: '52%', delay: 2.5, gap: 9 },
  { left: '66%', delay: 9,   gap: 7 },
  { left: '80%', delay: 5.5, gap: 8 },
  { left: '92%', delay: 10,  gap: 6 },
];

const lavaPalette = (color) => ({
  stream: `repeating-linear-gradient(180deg, ${color} 0%, #FFC26B 12%, ${color} 25%)`,
  streamOpacity: 0.85,
  pool: 'linear-gradient(180deg, #FF8A3D 0%, #D2430F 35%, #6a1a02 100%)',
  surface: '#FF8A3D', surface2: '#E0561A99', rim: '#FFD27A',
  drip: '#FFE08A', dripGlow: color,
});

/** Scalloped, scrolling pool edge from a repeating CSS gradient (seamless at -50%). */
function Surface({ fill, rim, bottom, h, size, dur, dir = 1 }) {
  return (
    <motion.div className="absolute left-0"
      style={{
        width: '200%', height: h, bottom, willChange: 'transform',
        backgroundImage: `radial-gradient(ellipse 50% 100% at 50% 100%, ${fill} 0%, ${fill} 90%, ${rim} 96%, transparent 100%)`,
        backgroundSize: `${size}% 100%`, backgroundRepeat: 'repeat-x', backgroundPosition: '0 100%',
      }}
      animate={{ x: dir > 0 ? ['0%', '-50%'] : ['-50%', '0%'] }}
      transition={{ duration: dur, repeat: Infinity, ease: 'linear' }}
    />
  );
}

function Pool({ pal }) {
  return (
    <>
      <div className="absolute inset-x-0 bottom-0" style={{ height: '22%', background: pal.pool }} />
      <Surface fill={pal.surface2} rim={pal.rim} bottom="21.5%" h="10%" size={8.333} dur={13} dir={-1} />
      <Surface fill={pal.surface} rim={pal.rim} bottom="21%" h="8%" size={6.25} dur={9} />
    </>
  );
}

/** Each stream is clipped to a wobbly outline; lava slides down inside it with a flowing texture. */
function Streams({ sources, pal }) {
  return sources.map((s, i) => (
    <div key={`st${i}`} className="absolute"
      style={{ left: `${s.x}%`, top: `${s.y}%`, width: `${s.w}%`, height: `${s.h}%`,
        marginLeft: `-${s.w / 2}%`, clipPath: s.poly, opacity: pal.streamOpacity }}>
      <motion.div style={{ height: '100%', width: '100%' }}
        initial={{ y: '-100%' }} animate={{ y: '0%' }}
        transition={{ duration: s.grow, delay: s.delay, ease: 'easeInOut' }}>
        <motion.div style={{ height: '200%', width: '100%', background: pal.stream, willChange: 'transform' }}
          animate={{ y: ['-50%', '0%'] }}
          transition={{ duration: s.flow, repeat: Infinity, ease: 'linear' }} />
      </motion.div>
    </div>
  ));
}

function Drips({ pal }) {
  return DRIPS.map((d, i) => (
    <motion.div key={`dr${i}`} className="absolute"
      style={{ left: d.left, bottom: '10%', width: 9, height: 15, transformOrigin: 'top',
        borderRadius: '50% 50% 50% 50% / 30% 30% 70% 70%', background: pal.drip,
        boxShadow: `0 0 8px ${pal.dripGlow}`, willChange: 'transform, opacity' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 1, 1], scaleY: [0.2, 1, 1.1, 1.8], y: [0, 0, 6, 420] }}
      transition={{ duration: 3.6, delay: d.delay, repeat: Infinity, repeatDelay: d.gap, ease: 'easeIn', times: [0, 0.3, 0.45, 1] }}
    />
  ));
}

/* ---------- Ocean: soft swells with faint foam arcs ---------- */

const SWELLS = [
  { top: '10%', size: 10,   dur: 22, dir: 1,  fill: '1F', rim: 0.30, bob: 3 },
  { top: '36%', size: 12.5, dur: 30, dir: -1, fill: '28', rim: 0.28, bob: 4 },
  { top: '62%', size: 6.25, dur: 26, dir: 1,  fill: '33', rim: 0.26, bob: 3 },
];

/** Animated background layer for animated board skins — renders behind the grid. */
function BoardAnimation({ animation }) {
  const { type, color } = animation || {};

  // Three depth layers: distant pinpricks, mid-field stars, hero stars
  const stars = useMemo(() => {
    if (type !== 'stars') return [];
    const pinpricks = Array.from({ length: 40 }, (_, i) => ({
      id: `p${i}`, left: Math.random() * 100, top: Math.random() * 100,
      size: 0.5 + Math.random(), delay: Math.random() * 4, duration: 2.5 + Math.random() * 3, glow: 1.5,
    }));
    const midStars = Array.from({ length: 16 }, (_, i) => ({
      id: `m${i}`, left: Math.random() * 100, top: Math.random() * 100,
      size: 1.5 + Math.random() * 2, delay: Math.random() * 3, duration: 2 + Math.random() * 2, glow: 4,
    }));
    const heroStars = Array.from({ length: 6 }, (_, i) => ({
      id: `h${i}`, left: Math.random() * 100, top: Math.random() * 100,
      size: 2.5 + Math.random() * 2, delay: Math.random() * 2, duration: 3 + Math.random() * 2, glow: 8,
    }));
    return [...pinpricks, ...midStars, ...heroStars];
  }, [type]);

  // Shooting stars that streak diagonally across the board
  const shootingStars = useMemo(() => {
    if (type !== 'stars') return [];
    return Array.from({ length: 3 }, (_, i) => ({
      id: `s${i}`, delay: i * 3.5 + Math.random() * 2, duration: 1.2 + Math.random(),
      top: Math.random() * 50, angle: 20 + Math.random() * 25,
    }));
  }, [type]);

  const lavaStreams = useMemo(
    () => (type === 'lava' ? makeLavaStreams(LAVA_STREAM_COUNT) : []),
    [type]
  );

  // Ocean bubbles — each rises with its own transform
  const bubbles = useMemo(() => {
    if (type !== 'waves') return [];
    return Array.from({ length: 45 }, (_, i) => ({
      id: `b${i}`, left: 2 + Math.random() * 96,
      size: 3 + Math.random() * 10,
      delay: Math.random() * 10, duration: 5 + Math.random() * 6,
      wobble: 5 + Math.random() * 10, wobbleDur: 2 + Math.random() * 2,
    }));
  }, [type]);

  // Neon grid: light runners + flashing cells (8x8 board, 12.5% per square)
  const neon = useMemo(() => {
    if (type !== 'pulse') return { runners: [], cells: [] };
    const runners = Array.from({ length: 8 }, (_, i) => ({
      id: `r${i}`, horizontal: i % 2 === 0,
      line: Math.floor(Math.random() * 9) * 12.5,
      delay: Math.random() * 4, duration: 1.6 + Math.random() * 1.6,
      pause: 0.5 + Math.random() * 2.5, reverse: Math.random() > 0.5,
    }));
    const cells = Array.from({ length: 10 }, (_, i) => ({
      id: `c${i}`, col: Math.floor(Math.random() * 8), row: Math.floor(Math.random() * 8),
      delay: Math.random() * 6, duration: 1.2 + Math.random() * 1.5,
    }));
    return { runners, cells };
  }, [type]);

  if (!animation) return null;

  if (type === 'stars') {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Deep-space nebula — slowly drifting purple/indigo vapor */}
        <motion.div className="absolute inset-0"
          style={{ background: `radial-gradient(ellipse at 20% 30%, ${color}30, transparent 50%), radial-gradient(ellipse at 75% 70%, #4B008230, transparent 55%), radial-gradient(ellipse at 50% 50%, ${color}15, transparent 70%)` }}
          animate={{ opacity: [0.4, 0.75, 0.4], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div className="absolute inset-0"
          style={{ background: `radial-gradient(ellipse at 70% 20%, ${color}20, transparent 45%), radial-gradient(ellipse at 25% 75%, #6A0DAD20, transparent 50%)` }}
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [1.1, 1, 1.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Star layers with depth-based glow */}
        {stars.map(s => (
          <motion.div key={s.id} className="absolute rounded-full"
            style={{ width: s.size, height: s.size, backgroundColor: '#fff',
              boxShadow: `0 0 ${s.glow}px ${color}, 0 0 ${s.glow * 2}px ${color}80`,
              left: `${s.left}%`, top: `${s.top}%` }}
            animate={{ opacity: [0.15, 1, 0.15], scale: [0.6, 1.4, 0.6] }}
            transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}

        {/* Shooting stars — streak across with a luminous tail */}
        {shootingStars.map(s => (
          <motion.div key={s.id} className="absolute"
            style={{ top: `${s.top}%`, width: 60, height: 2, borderRadius: '9999px',
              background: `linear-gradient(90deg, transparent, #fff, ${color}, transparent)`,
              boxShadow: `0 0 8px ${color}, 0 0 16px ${color}80` }}
            initial={{ left: '-15%', opacity: 0, rotate: s.angle }}
            animate={{ left: '115%', opacity: [0, 1, 1, 0] }}
            transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, repeatDelay: 4, ease: 'easeIn' }}
          />
        ))}
      </div>
    );
  }

  if (type === 'lava') {
    const pal = lavaPalette(color);
    const segs = (list, height, bg, glow) => list.map((g, j) => (
      <div key={j} className="absolute"
        style={{ left: `${g.x}%`, top: `${g.y}%`, width: `${g.len}%`, height, marginTop: -height / 2,
          transformOrigin: '0 50%', transform: `rotate(${g.ang}deg)`, background: bg, borderRadius: 9999,
          boxShadow: glow ? `0 0 10px ${glow}` : undefined }} />
    ));
    const glowSpots = ['15% 15%', '85% 20%', '20% 80%', '85% 85%', '50% 50%', '50% 100%'];
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={ROOT}>
        {/* Warm molten backdrop — never goes black, even in the corners */}
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, #4a1100 0%, #7a1e03 55%, #a52c05 100%)' }} />

        {/* Hot glows covering the whole board (opacity only) */}
        {glowSpots.map((pos, i) => (
          <motion.div key={`g${i}`} className="absolute inset-0"
            style={{ background: `radial-gradient(ellipse 45% 45% at ${pos}, #FF9A3C 0%, ${color}99 40%, ${color}00 100%)` }}
            animate={{ opacity: [0.35, 0.8, 0.35] }}
            transition={{ duration: 4 + i * 1.2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.7 }}
          />
        ))}

        {/* Cracks: orange glow always on, white-hot flash that cools to orange */}
        {CRACK_SEGS.map((list, i) => (
          <div key={`ck${i}`} className="absolute inset-0">
            <motion.div className="absolute inset-0"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}>
              {segs(list, 8, color, color)}
            </motion.div>
            <div className="absolute inset-0">{segs(list, 2.5, '#FFB347')}</div>
            <motion.div className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.9, 0, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', times: [0, 0.12, 0.3, 0.55, 1], delay: i * 3 }}>
              {segs(list, 2.5, '#FFF4D6')}
            </motion.div>
          </div>
        ))}

        {/* Lava oozing from many points along the cracks, pooling, and dripping off-screen */}
        <Streams sources={lavaStreams} pal={pal} />
        <Pool pal={pal} />
        <Drips pal={pal} />

        {/* Eruption flash */}
        <motion.div className="absolute inset-0"
          style={{ background: `radial-gradient(circle at 50% 100%, ${color}, transparent 70%)` }}
          animate={{ opacity: [0, 0, 0.5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeOut', times: [0, 0.7, 0.8, 1] }}
        />
      </div>
    );
  }

  if (type === 'waves') {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={ROOT}>
        {/* Deep water gradient */}
        <div className="absolute inset-0"
          style={{ background: `linear-gradient(180deg, ${color}30 0%, #0a3a66 55%, #031a33 100%)` }} />

        {/* Caustic light drifting through the water (opacity only) */}
        {[0, 1, 2].map(i => (
          <motion.div key={`caustic${i}`} className="absolute inset-0"
            style={{ background: `radial-gradient(ellipse at ${25 + i * 25}% ${30 + (i % 2) * 35}%, #CFF3FF80, transparent 38%)` }}
            animate={{ opacity: [0.2, 0.7, 0.2] }}
            transition={{ duration: 6 + i * 2, repeat: Infinity, ease: 'easeInOut', delay: i }}
          />
        ))}

        {/* Slow, soft swells with faint foam-edge arcs */}
        {SWELLS.map((w, i) => (
          <motion.div key={`swell${i}`} className="absolute left-0"
            style={{
              width: '200%', height: '26%', top: w.top, willChange: 'transform',
              backgroundImage:
                `radial-gradient(ellipse 50% 100% at 50% 100%, transparent 0%, transparent 90%, rgba(230,250,255,${w.rim}) 96%, transparent 100%), ` +
                `radial-gradient(ellipse 50% 100% at 50% 100%, ${color}${w.fill} 0%, ${color}00 100%)`,
              backgroundSize: `${w.size}% 100%, ${w.size}% 100%`,
              backgroundRepeat: 'repeat-x, repeat-x',
              backgroundPosition: '0 100%, 0 100%',
            }}
            animate={{ x: w.dir > 0 ? ['0%', '-50%'] : ['-50%', '0%'], y: [`-${w.bob}%`, `${w.bob}%`, `-${w.bob}%`] }}
            transition={{
              x: { duration: w.dur, repeat: Infinity, ease: 'linear' },
              y: { duration: 5 + i, repeat: Infinity, ease: 'easeInOut' },
            }}
          />
        ))}

        {/* Bubbles */}
        {bubbles.map(b => (
          <motion.div key={b.id} className="absolute rounded-full"
            style={{ left: `${b.left}%`, bottom: '-3%', width: b.size, height: b.size, willChange: 'transform',
              border: '1px solid rgba(255,255,255,0.7)',
              background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.65), rgba(255,255,255,0.08))' }}
            initial={{ opacity: 0 }}
            animate={{ y: ['0vh', '-70vh'], x: [0, b.wobble, -b.wobble, 0], opacity: [0, 0.9, 0.9, 0] }}
            transition={{
              y: { duration: b.duration, delay: b.delay, repeat: Infinity, ease: 'easeOut' },
              opacity: { duration: b.duration, delay: b.delay, repeat: Infinity, ease: 'easeOut' },
              x: { duration: b.wobbleDur, repeat: Infinity, ease: 'easeInOut' },
            }}
          />
        ))}
      </div>
    );
  }

  if (type === 'pulse') {
    const grid = (alpha) => ({
      backgroundImage: `linear-gradient(${color}${alpha} 1px, transparent 1px), linear-gradient(90deg, ${color}${alpha} 1px, transparent 1px)`,
      backgroundSize: '12.5% 12.5%',
    });
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={ROOT}>
        {/* Soft color wash that breathes */}
        <motion.div className="absolute inset-0"
          style={{ background: `radial-gradient(circle at 50% 50%, ${color}40, transparent 70%)` }}
          animate={{ opacity: [0.3, 0.9, 0.3], scale: [1, 1.15, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Quadrant color pulses: one quadrant, one cyber color at a time, moving TL → TR → BR → BL */}
        {CYBER.map((c, s) => {
          const q = QUAD[s % 4];
          const a = s / CYBER.length;
          const peak = (s + 0.5) / CYBER.length;
          const b = (s + 1) / CYBER.length;
          return (
            <motion.div key={`q${s}`} className="absolute"
              style={{ left: `${q.l}%`, top: `${q.t}%`, width: '50%', height: '50%',
                background: c, boxShadow: `inset 0 0 28px ${c}` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0, 0.65, 0, 0] }}
              transition={{ duration: CYCLE, repeat: Infinity, ease: 'linear', times: [0, a, peak, b, 1] }}
            />
          );
        })}

        {/* Glow grid (thick + blurred) and crisp grid on top */}
        <motion.div className="absolute inset-0"
          style={{ ...grid('FF'), filter: 'blur(3px)' }}
          animate={{ opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
        />
        <motion.div className="absolute inset-0"
          style={grid('FF')}
          animate={{ opacity: [0.55, 1, 0.55] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Flashing squares */}
        {neon.cells.map(c => (
          <motion.div key={c.id} className="absolute"
            style={{ width: '12.5%', height: '12.5%', left: `${c.col * 12.5}%`, top: `${c.row * 12.5}%`,
              background: color, boxShadow: `inset 0 0 12px ${color}` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.55, 0] }}
            transition={{ duration: c.duration, delay: c.delay, repeat: Infinity, repeatDelay: 1.5, ease: 'easeInOut' }}
          />
        ))}

        {/* Light pulses racing along grid lines (transform-only) */}
        {neon.runners.map(r => r.horizontal ? (
          <motion.div key={r.id} className="absolute left-0"
            style={{ top: `calc(${r.line}% - 2px)`, width: '100%', height: 4, willChange: 'transform',
              background: `linear-gradient(${r.reverse ? 270 : 90}deg, transparent 0%, ${color} 7%, #fff 10%, transparent 10.2%)` }}
            initial={{ x: r.reverse ? '12%' : '-12%' }}
            animate={{ x: r.reverse ? '-100%' : '100%' }}
            transition={{ duration: r.duration, delay: r.delay, repeat: Infinity, repeatDelay: r.pause, ease: 'linear' }}
          />
        ) : (
          <motion.div key={r.id} className="absolute top-0"
            style={{ left: `calc(${r.line}% - 2px)`, height: '100%', width: 4, willChange: 'transform',
              background: `linear-gradient(${r.reverse ? 0 : 180}deg, transparent 0%, ${color} 7%, #fff 10%, transparent 10.2%)` }}
            initial={{ y: r.reverse ? '12%' : '-12%' }}
            animate={{ y: r.reverse ? '-100%' : '100%' }}
            transition={{ duration: r.duration, delay: r.delay, repeat: Infinity, repeatDelay: r.pause, ease: 'linear' }}
          />
        ))}

        {/* Scanning sweep */}
        <motion.div className="absolute inset-x-0"
          style={{ top: '-16%', height: '16%', willChange: 'transform',
            background: `linear-gradient(180deg, transparent, ${color}90, transparent)` }}
          animate={{ y: ['0%', '800%'] }}
          transition={{ duration: 3.2, repeat: Infinity, repeatDelay: 1, ease: 'linear' }}
        />
      </div>
    );
  }

  return null;
}

// Re-render only if the skin itself changes, not on every board move.
export default React.memo(
  BoardAnimation,
  (a, b) => a.animation?.type === b.animation?.type && a.animation?.color === b.animation?.color
);