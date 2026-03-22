// Procedural audio for battle cutscene using Web Audio API

function getCtx() {
  if (!window._battleAudioCtx) {
    window._battleAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return window._battleAudioCtx;
}

// Metallic sword clang: sharp noise burst + high-pitched metallic ring
export function playSwordClang(delay = 0) {
  try {
    const ctx = getCtx();
    const t = ctx.currentTime + delay;

    // Noise burst (impact body)
    const bufSize = ctx.sampleRate * 0.15;
    const buffer = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufSize, 2);
    }
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = 3200;
    noiseFilter.Q.value = 0.8;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.55, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noiseSource.start(t);

    // Metallic ring (oscillator)
    const ringFreq = 1800 + Math.random() * 600;
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(ringFreq, t);
    osc.frequency.exponentialRampToValueAtTime(ringFreq * 0.6, t + 0.4);

    const ringFilter = ctx.createBiquadFilter();
    ringFilter.type = 'bandpass';
    ringFilter.frequency.value = ringFreq;
    ringFilter.Q.value = 12;

    const ringGain = ctx.createGain();
    ringGain.gain.setValueAtTime(0.3, t);
    ringGain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

    osc.connect(ringFilter);
    ringFilter.connect(ringGain);
    ringGain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.5);
  } catch (e) {
    // Audio not available, silently skip
  }
}

// Death sigh: breathy exhale — filtered noise that slowly fades
export function playDeathSigh(delay = 0) {
  try {
    const ctx = getCtx();
    const t = ctx.currentTime + delay;
    const duration = 1.6;

    const bufSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    // Low-pass for breath warmth
    const lpf = ctx.createBiquadFilter();
    lpf.type = 'lowpass';
    lpf.frequency.setValueAtTime(900, t);
    lpf.frequency.exponentialRampToValueAtTime(200, t + duration);

    // Bandpass to shape it like a vocal exhale
    const bpf = ctx.createBiquadFilter();
    bpf.type = 'bandpass';
    bpf.frequency.setValueAtTime(400, t);
    bpf.Q.value = 1.2;

    // Gain envelope: quick rise, slow fade
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.22, t + 0.18);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    source.connect(lpf);
    lpf.connect(bpf);
    bpf.connect(gain);
    gain.connect(ctx.destination);
    source.start(t);

    // Low groan undertone
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + duration);

    const oscGain = ctx.createGain();
    oscGain.gain.setValueAtTime(0.001, t);
    oscGain.gain.linearRampToValueAtTime(0.12, t + 0.2);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + duration);
  } catch (e) {
    // Audio not available, silently skip
  }
}

// Play 3 staggered sword clangs
export function playClangs() {
  playSwordClang(0);
  playSwordClang(0.28);
  playSwordClang(0.52);
}