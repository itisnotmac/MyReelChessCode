// Procedural audio for battle cutscene using Web Audio API

function getCtx() {
  if (!window._battleAudioCtx) {
    window._battleAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  // Resume if suspended (browser autoplay policy)
  if (window._battleAudioCtx.state === 'suspended') {
    window._battleAudioCtx.resume();
  }
  return window._battleAudioCtx;
}

// Sharp metallic sword clang: hard transient + sustained ringing harmonics
export function playSwordClang(delay = 0) {
  try {
    const ctx = getCtx();
    const t = ctx.currentTime + delay;

    // --- Hard impact transient (very short noise burst) ---
    const impactBuf = ctx.createBuffer(1, ctx.sampleRate * 0.04, ctx.sampleRate);
    const impactData = impactBuf.getChannelData(0);
    for (let i = 0; i < impactData.length; i++) {
      impactData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / impactData.length, 1.5);
    }
    const impactSrc = ctx.createBufferSource();
    impactSrc.buffer = impactBuf;

    const impactHPF = ctx.createBiquadFilter();
    impactHPF.type = 'highpass';
    impactHPF.frequency.value = 4000;

    const impactGain = ctx.createGain();
    impactGain.gain.setValueAtTime(1.8, t);
    impactGain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

    impactSrc.connect(impactHPF);
    impactHPF.connect(impactGain);
    impactGain.connect(ctx.destination);
    impactSrc.start(t);

    // --- Metallic scrape (mid noise, slightly longer) ---
    const scrapeBuf = ctx.createBuffer(1, ctx.sampleRate * 0.12, ctx.sampleRate);
    const scrapeData = scrapeBuf.getChannelData(0);
    for (let i = 0; i < scrapeData.length; i++) {
      scrapeData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / scrapeData.length, 0.8);
    }
    const scrapeSrc = ctx.createBufferSource();
    scrapeSrc.buffer = scrapeBuf;

    const scrapeBPF = ctx.createBiquadFilter();
    scrapeBPF.type = 'bandpass';
    scrapeBPF.frequency.value = 2200;
    scrapeBPF.Q.value = 3;

    const scrapeGain = ctx.createGain();
    scrapeGain.gain.setValueAtTime(0.6, t);
    scrapeGain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

    scrapeSrc.connect(scrapeBPF);
    scrapeBPF.connect(scrapeGain);
    scrapeGain.connect(ctx.destination);
    scrapeSrc.start(t);

    // --- Ringing steel harmonics (multiple detuned oscillators) ---
    const ringFreqs = [
      900 + Math.random() * 200,
      1400 + Math.random() * 300,
      2100 + Math.random() * 400,
      3300 + Math.random() * 500,
    ];
    ringFreqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      // Slight pitch drop as metal vibration settles
      osc.frequency.exponentialRampToValueAtTime(freq * 0.85, t + 0.7);

      const oscGain = ctx.createGain();
      const vol = 0.18 / (i + 1);
      oscGain.gain.setValueAtTime(vol, t);
      oscGain.gain.setValueAtTime(vol, t + 0.01);
      oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.5 + i * 0.1);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.7);
    });

    // --- Low body thud (the weight of the blow) ---
    const thudOsc = ctx.createOscillator();
    thudOsc.type = 'sine';
    thudOsc.frequency.setValueAtTime(120, t);
    thudOsc.frequency.exponentialRampToValueAtTime(40, t + 0.08);

    const thudGain = ctx.createGain();
    thudGain.gain.setValueAtTime(0.7, t);
    thudGain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

    thudOsc.connect(thudGain);
    thudGain.connect(ctx.destination);
    thudOsc.start(t);
    thudOsc.stop(t + 0.12);

  } catch (e) {}
}

// Human death groan: voiced exhale with pitch-dropping formants
export function playDeathSigh(delay = 0) {
  try {
    const ctx = getCtx();
    const t = ctx.currentTime + delay;
    const duration = 2.0;

    // --- Voiced groan: sawtooth through formant filters (like a vocal tract) ---
    // Sawtooth as the "voice source"
    const voiceSrc = ctx.createOscillator();
    voiceSrc.type = 'sawtooth';
    // Pitch starts mid-low and drops — like someone losing energy
    voiceSrc.frequency.setValueAtTime(160, t);
    voiceSrc.frequency.setValueAtTime(155, t + 0.1);
    voiceSrc.frequency.linearRampToValueAtTime(90, t + 0.7);
    voiceSrc.frequency.linearRampToValueAtTime(60, t + 1.4);
    voiceSrc.frequency.linearRampToValueAtTime(40, t + duration);

    // Formant 1 — "ah" vowel low formant ~700 Hz
    const f1 = ctx.createBiquadFilter();
    f1.type = 'bandpass';
    f1.frequency.setValueAtTime(700, t);
    f1.frequency.linearRampToValueAtTime(400, t + duration);
    f1.Q.value = 4;

    // Formant 2 — "ah" vowel high formant ~1100 Hz
    const f2 = ctx.createBiquadFilter();
    f2.type = 'bandpass';
    f2.frequency.setValueAtTime(1100, t);
    f2.frequency.linearRampToValueAtTime(600, t + duration);
    f2.Q.value = 5;

    // Mix formants
    const groanGain = ctx.createGain();
    groanGain.gain.setValueAtTime(0.001, t);
    groanGain.gain.linearRampToValueAtTime(0.55, t + 0.08);  // fast attack
    groanGain.gain.setValueAtTime(0.55, t + 0.3);
    groanGain.gain.linearRampToValueAtTime(0.3, t + 1.0);
    groanGain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    // Route: voiceSrc -> f1 -> groanGain -> destination
    //                 -> f2 -> groanGain
    voiceSrc.connect(f1);
    voiceSrc.connect(f2);
    f1.connect(groanGain);
    f2.connect(groanGain);
    groanGain.connect(ctx.destination);

    voiceSrc.start(t);
    voiceSrc.stop(t + duration);

    // --- Breathy turbulence mixed in (adds human air/rasp) ---
    const breathBuf = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
    const breathData = breathBuf.getChannelData(0);
    for (let i = 0; i < breathData.length; i++) {
      breathData[i] = Math.random() * 2 - 1;
    }
    const breathSrc = ctx.createBufferSource();
    breathSrc.buffer = breathBuf;

    const breathLPF = ctx.createBiquadFilter();
    breathLPF.type = 'lowpass';
    breathLPF.frequency.setValueAtTime(1800, t);
    breathLPF.frequency.exponentialRampToValueAtTime(300, t + duration);

    const breathGain = ctx.createGain();
    breathGain.gain.setValueAtTime(0.001, t);
    breathGain.gain.linearRampToValueAtTime(0.08, t + 0.1);
    breathGain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    breathSrc.connect(breathLPF);
    breathLPF.connect(breathGain);
    breathGain.connect(ctx.destination);
    breathSrc.start(t);

    // --- Final thud (body hitting the ground) ---
    const thudOsc = ctx.createOscillator();
    thudOsc.type = 'sine';
    thudOsc.frequency.setValueAtTime(80, t + 1.5);
    thudOsc.frequency.exponentialRampToValueAtTime(25, t + 1.65);

    const thudNoiseBuf = ctx.createBuffer(1, ctx.sampleRate * 0.15, ctx.sampleRate);
    const thudNoiseData = thudNoiseBuf.getChannelData(0);
    for (let i = 0; i < thudNoiseData.length; i++) {
      thudNoiseData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / thudNoiseData.length, 1.2);
    }
    const thudNoiseSrc = ctx.createBufferSource();
    thudNoiseSrc.buffer = thudNoiseBuf;

    const thudNoiseFilter = ctx.createBiquadFilter();
    thudNoiseFilter.type = 'lowpass';
    thudNoiseFilter.frequency.value = 300;

    const thudGain = ctx.createGain();
    thudGain.gain.setValueAtTime(0.9, t + 1.5);
    thudGain.gain.exponentialRampToValueAtTime(0.001, t + 1.7);

    thudOsc.connect(thudGain);
    thudNoiseSrc.connect(thudNoiseFilter);
    thudNoiseFilter.connect(thudGain);
    thudGain.connect(ctx.destination);
    thudOsc.start(t + 1.5);
    thudOsc.stop(t + 1.75);
    thudNoiseSrc.start(t + 1.5);

  } catch (e) {}
}

// Play 3 staggered sword clangs
export function playClangs() {
  playSwordClang(0);
  playSwordClang(0.32);
  playSwordClang(0.58);
}