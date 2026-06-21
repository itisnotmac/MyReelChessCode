/**
 * Chess Sound Engine — procedural Web Audio API sounds.
 * No external files needed. Each piece has a distinct character.
 */

let ctx = null;

function getCtx() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return ctx;
}

function resume() {
  const c = getCtx();
  if (c.state === 'suspended') c.resume();
  return c;
}

// Call this on first user interaction to unlock the AudioContext
export function unlockAudio() {
  resume();
}

// ── helpers ──────────────────────────────────────────────────────────────────

function playTone({ freq = 440, type = 'sine', gain = 0.18, attack = 0.005, decay = 0.08, sustain = 0.6, release = 0.25, duration = 0.4, detune = 0 } = {}) {
  const c = resume();
  const osc = c.createOscillator();
  const env = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  osc.detune.value = detune;
  env.gain.setValueAtTime(0, c.currentTime);
  env.gain.linearRampToValueAtTime(gain, c.currentTime + attack);
  env.gain.linearRampToValueAtTime(gain * sustain, c.currentTime + attack + decay);
  env.gain.setValueAtTime(gain * sustain, c.currentTime + duration - release);
  env.gain.linearRampToValueAtTime(0, c.currentTime + duration);
  osc.connect(env);
  env.connect(c.destination);
  osc.start(c.currentTime);
  osc.stop(c.currentTime + duration);
}

function playNoise({ gain = 0.12, duration = 0.15, highpass = 200 } = {}) {
  const c = resume();
  const bufSize = c.sampleRate * duration;
  const buf = c.createBuffer(1, bufSize, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource();
  src.buffer = buf;
  const filter = c.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = highpass;
  const env = c.createGain();
  env.gain.setValueAtTime(gain, c.currentTime);
  env.gain.linearRampToValueAtTime(0, c.currentTime + duration);
  src.connect(filter);
  filter.connect(env);
  env.connect(c.destination);
  src.start();
  src.stop(c.currentTime + duration);
}

// ── piece sounds ──────────────────────────────────────────────────────────────

// Pawn — light wooden tap: short mid-freq pluck
function pawnMove() {
  playTone({ freq: 320, type: 'triangle', gain: 0.22, attack: 0.002, decay: 0.04, sustain: 0.3, release: 0.1, duration: 0.18 });
  playNoise({ gain: 0.07, duration: 0.06, highpass: 800 });
}

// Knight — a quick two-tone "clip-clop" feel
function knightMove() {
  playTone({ freq: 260, type: 'square', gain: 0.12, attack: 0.002, decay: 0.05, sustain: 0.2, release: 0.08, duration: 0.14 });
  setTimeout(() => {
    playTone({ freq: 310, type: 'square', gain: 0.10, attack: 0.002, decay: 0.04, sustain: 0.15, release: 0.07, duration: 0.12 });
  }, 60);
}

// Bishop — airy, high diagonal sweep
function bishopMove() {
  playTone({ freq: 480, type: 'sine', gain: 0.14, attack: 0.01, decay: 0.12, sustain: 0.4, release: 0.18, duration: 0.32, detune: -8 });
  playTone({ freq: 720, type: 'sine', gain: 0.07, attack: 0.02, decay: 0.1, sustain: 0.2, release: 0.12, duration: 0.28 });
}

// Rook — deep resonant thud
function rookMove() {
  playTone({ freq: 90, type: 'sawtooth', gain: 0.22, attack: 0.003, decay: 0.12, sustain: 0.25, release: 0.2, duration: 0.38 });
  playNoise({ gain: 0.14, duration: 0.12, highpass: 120 });
}

// Queen — rich, multi-layered chord
function queenMove() {
  playTone({ freq: 360, type: 'sine', gain: 0.16, attack: 0.006, decay: 0.1, sustain: 0.5, release: 0.25, duration: 0.5 });
  playTone({ freq: 540, type: 'sine', gain: 0.10, attack: 0.006, decay: 0.1, sustain: 0.4, release: 0.2, duration: 0.45, detune: 5 });
  playTone({ freq: 180, type: 'triangle', gain: 0.12, attack: 0.004, decay: 0.09, sustain: 0.3, release: 0.15, duration: 0.38 });
}

// King — slow, weighty low clunk
function kingMove() {
  playTone({ freq: 110, type: 'sawtooth', gain: 0.20, attack: 0.008, decay: 0.18, sustain: 0.35, release: 0.3, duration: 0.55 });
  playTone({ freq: 220, type: 'triangle', gain: 0.08, attack: 0.01, decay: 0.12, sustain: 0.2, release: 0.2, duration: 0.45 });
  playNoise({ gain: 0.10, duration: 0.14, highpass: 200 });
}

// Check — dramatic ominous alert: low rumble + high bell
function checkAlert() {
  // Low warning rumble
  playTone({ freq: 55, type: 'sawtooth', gain: 0.25, attack: 0.005, decay: 0.2, sustain: 0.5, release: 0.4, duration: 0.8 });
  // High bell-like ping
  setTimeout(() => {
    playTone({ freq: 880, type: 'sine', gain: 0.18, attack: 0.003, decay: 0.15, sustain: 0.6, release: 0.5, duration: 0.9 });
    playTone({ freq: 1320, type: 'sine', gain: 0.08, attack: 0.003, decay: 0.1, sustain: 0.4, release: 0.4, duration: 0.7 });
  }, 120);
  // Stinger hit
  setTimeout(() => {
    playNoise({ gain: 0.18, duration: 0.15, highpass: 600 });
  }, 60);
}

// Castling — rook slide + king settle: two-part sound
function castlingSound() {
  rookMove();
  setTimeout(() => kingMove(), 160);
}

// Game over
function gameOverSound() {
  playTone({ freq: 220, type: 'sawtooth', gain: 0.2, attack: 0.01, decay: 0.3, sustain: 0.4, release: 0.5, duration: 1.0 });
  setTimeout(() => playTone({ freq: 165, type: 'sawtooth', gain: 0.18, attack: 0.01, decay: 0.3, sustain: 0.3, release: 0.5, duration: 0.9 }), 350);
  setTimeout(() => playTone({ freq: 110, type: 'sawtooth', gain: 0.22, attack: 0.01, decay: 0.4, sustain: 0.4, release: 0.6, duration: 1.2 }), 700);
}

// ── public API ────────────────────────────────────────────────────────────────

const PIECE_SOUNDS = { p: pawnMove, n: knightMove, b: bishopMove, r: rookMove, q: queenMove, k: kingMove };

export function playMoveSound(piece, isCastling) {
  if (!piece) return;
  if (isCastling) { castlingSound(); return; }
  const fn = PIECE_SOUNDS[piece.toLowerCase()];
  if (fn) fn();
}

export function playCheckSound() { checkAlert(); }
export function playGameOverSound() { gameOverSound(); }