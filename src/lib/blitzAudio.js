// Stress audio manager for BlitzSchach — plays the stress track at 1/3 volume on loop.
// The URL will be set when the user uploads the stress track MP3.

export const BLITZ_AUDIO_URL = ''; // Updated when user uploads the stress track
const BLITZ_VOLUME = 0.33; // ~1/3 volume

let audioElement = null;

export function startBlitzAudio() {
  if (!BLITZ_AUDIO_URL) return; // No track uploaded yet — silent
  if (audioElement) return;
  audioElement = new Audio(BLITZ_AUDIO_URL);
  audioElement.volume = BLITZ_VOLUME;
  audioElement.loop = true;
  audioElement.play().catch(() => {});
}

export function stopBlitzAudio() {
  if (audioElement) {
    audioElement.pause();
    audioElement.currentTime = 0;
    audioElement = null;
  }
}