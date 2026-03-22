// Procedural audio for battle cutscene using Web Audio API

function getCtx() {
  if (!window._battleAudioCtx) {
    window._battleAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (window._battleAudioCtx.state === 'suspended') {
    window._battleAudioCtx.resume();
  }
  return window._battleAudioCtx;
}

// Sword clang: sharp bright metallic impact
// Key insight: real sword clang = very fast attack, bright shimmer, quick decay
export function playSwordClang(delay = 0) {
  try {
    const ctx = getCtx();
    const t = ctx.currentTime + delay;

    // Sharp percussive click at the moment of impact
    const clickOsc = ctx.createOscillator();
    clickOsc.type = 'square';
    clickOsc.frequency.setValueAtTime(800, t);
    clickOsc.frequency.exponentialRampToValueAtTime(200, t + 0.02);
    const clickGain = ctx.createGain();
    clickGain.gain.setValueAtTime(0.8, t);
    clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.025);
    clickOsc.connect(clickGain);
    clickGain.connect(ctx.destination);
    clickOsc.start(t);
    clickOsc.stop(t + 0.03);

    // High bright shimmer — the singing steel ring
    // Multiple sine waves tuned to inharmonic ratios (real metal bell physics)
    const shimmerPartials = [
      { freq: 3500, amp: 0.22, decay: 0.35 },
      { freq: 5200, amp: 0.18, decay: 0.28 },
      { freq: 7800, amp: 0.12, decay: 0.20 },
      { freq: 2100, amp: 0.20, decay: 0.45 },
      { freq: 9500, amp: 0.08, decay: 0.15 },
    ];

    shimmerPartials.forEach(({ freq, amp, decay }) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      // Slight random detune for realism
      osc.frequency.value = freq * (1 + (Math.random() - 0.5) * 0.03);
      const g = ctx.createGain();
      g.gain.setValueAtTime(amp, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + decay);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + decay + 0.05);
    });

    // Mid-range metallic body — wide bandpass noise for the "slam" body
    const bufLen = Math.floor(ctx.sampleRate * 0.08);
    const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) {
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufLen, 0.6);
    }
    const noiseSrc = ctx.createBufferSource();
    noiseSrc.buffer = buf;

    const bp1 = ctx.createBiquadFilter();
    bp1.type = 'bandpass';
    bp1.frequency.value = 1800;
    bp1.Q.value = 1.5;

    const hp1 = ctx.createBiquadFilter();
    hp1.type = 'highpass';
    hp1.frequency.value = 800;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(1.0, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    noiseSrc.connect(bp1);
    bp1.connect(hp1);
    hp1.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noiseSrc.start(t);

  } catch (e) {}
}

// Death groan: "Aaaugh" — a convincing human pain sound
// Approach: AM modulation of a mid-frequency tone creates vocal "waver"
// + pitch envelope that rises then falls (like a pained exhale/groan)
export function playDeathSigh(delay = 0) {
  try {
    const ctx = getCtx();
    const t = ctx.currentTime + delay;

    // --- Carrier: the voice tone ---
    const carrier = ctx.createOscillator();
    carrier.type = 'sawtooth';
    // Pitch arc: neutral -> slight rise (pain) -> fall (dying out)
    carrier.frequency.setValueAtTime(130, t);
    carrier.frequency.linearRampToValueAtTime(170, t + 0.12);  // pain spike up
    carrier.frequency.linearRampToValueAtTime(145, t + 0.35);
    carrier.frequency.linearRampToValueAtTime(95, t + 0.9);
    carrier.frequency.linearRampToValueAtTime(65, t + 1.5);

    // --- Formant shaping: carve out the vowel sounds ---
    // "Ah" vowel: F1=800, F2=1200
    const filt1 = ctx.createBiquadFilter();
    filt1.type = 'peaking';
    filt1.frequency.value = 800;
    filt1.gain.value = 18;
    filt1.Q.value = 2;

    const filt2 = ctx.createBiquadFilter();
    filt2.type = 'peaking';
    filt2.frequency.value = 1200;
    filt2.gain.value = 12;
    filt2.Q.value = 3;

    // Low-pass to kill harsh highs — voice shouldn't sound buzzy
    const lpf = ctx.createBiquadFilter();
    lpf.type = 'lowpass';
    lpf.frequency.setValueAtTime(2200, t);
    lpf.frequency.linearRampToValueAtTime(800, t + 1.5);
    lpf.Q.value = 0.7;

    // High-pass to remove sub-bass rumble
    const hpf = ctx.createBiquadFilter();
    hpf.type = 'highpass';
    hpf.frequency.value = 100;

    // Amplitude envelope: punchy attack, sustain, fade
    const voiceGain = ctx.createGain();
    voiceGain.gain.setValueAtTime(0.001, t);
    voiceGain.gain.linearRampToValueAtTime(0.45, t + 0.06);   // fast attack
    voiceGain.gain.setValueAtTime(0.45, t + 0.25);
    voiceGain.gain.linearRampToValueAtTime(0.25, t + 0.8);
    voiceGain.gain.exponentialRampToValueAtTime(0.001, t + 1.6);

    carrier.connect(filt1);
    filt1.connect(filt2);
    filt2.connect(lpf);
    lpf.connect(hpf);
    hpf.connect(voiceGain);
    voiceGain.connect(ctx.destination);
    carrier.start(t);
    carrier.stop(t + 1.7);

    // --- Tremolo / vocal flutter (LFO on amplitude for human waver) ---
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 5.5; // ~natural vocal tremor rate
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.08; // subtle modulation depth
    lfo.connect(lfoGain);
    lfoGain.connect(voiceGain.gain);
    lfo.start(t);
    lfo.stop(t + 1.7);

    // --- Breath layer: adds human air/rasp texture ---
    const breathLen = Math.floor(ctx.sampleRate * 1.4);
    const breathBuf = ctx.createBuffer(1, breathLen, ctx.sampleRate);
    const bd = breathBuf.getChannelData(0);
    for (let i = 0; i < breathLen; i++) {
      bd[i] = Math.random() * 2 - 1;
    }
    const breathSrc = ctx.createBufferSource();
    breathSrc.buffer = breathBuf;

    const breathBPF = ctx.createBiquadFilter();
    breathBPF.type = 'bandpass';
    breathBPF.frequency.value = 3000;
    breathBPF.Q.value = 0.5;

    const breathGain = ctx.createGain();
    breathGain.gain.setValueAtTime(0.001, t);
    breathGain.gain.linearRampToValueAtTime(0.05, t + 0.1);
    breathGain.gain.setValueAtTime(0.05, t + 0.5);
    breathGain.gain.exponentialRampToValueAtTime(0.001, t + 1.4);

    breathSrc.connect(breathBPF);
    breathBPF.connect(breathGain);
    breathGain.connect(ctx.destination);
    breathSrc.start(t);

  } catch (e) {}
}

// Play 3 staggered sword clangs
export function playClangs() {
  playSwordClang(0);
  playSwordClang(0.35);
  playSwordClang(0.62);
}