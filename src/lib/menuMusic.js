const MENU_MUSIC_URL = 'https://raw.githubusercontent.com/itisnotmac/Chess-Audio-Assets/main/ReelChessMenuMusicFinal.mp3';
const VOLUME_KEY = 'reelchess_menu_volume';
const DEFAULT_VOLUME = 0.5;

let audio = null;
let stopped = false;
let pendingHandlers = [];

export function getMenuMusicVolume() {
  const v = parseFloat(localStorage.getItem(VOLUME_KEY));
  return Number.isFinite(v) ? v : DEFAULT_VOLUME;
}

export function setMenuMusicVolume(volume) {
  const v = Math.min(1, Math.max(0, volume));
  localStorage.setItem(VOLUME_KEY, String(v));
  if (audio) audio.volume = v;
}

function clearPendingHandlers() {
  pendingHandlers.forEach(({ event, handler }) => {
    document.removeEventListener(event, handler);
  });
  pendingHandlers = [];
}

export function startMenuMusic() {
  if (audio) return;
  stopped = false;

  audio = new Audio(MENU_MUSIC_URL);
  audio.loop = true;
  audio.volume = getMenuMusicVolume();

  const tryPlay = () => {
    // By the time this fires, stopped may already be true (set by stopMenuMusic)
    if (stopped) return;
    audio.play().catch(() => {});
  };

  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      // Autoplay blocked — queue deferred play on first interaction
      const events = ['pointerdown', 'keydown'];
      events.forEach(event => {
        const handler = () => {
          clearPendingHandlers();
          tryPlay();
        };
        pendingHandlers.push({ event, handler });
        document.addEventListener(event, handler, { once: true });
      });
    });
  }
}

export function stopMenuMusic() {
  stopped = true;

  // Remove all pending interaction listeners immediately
  clearPendingHandlers();

  if (audio) {
    audio.pause();
    audio.src = '';
    audio = null;
  }
}