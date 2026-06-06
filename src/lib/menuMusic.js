const MENU_MUSIC_URL = 'https://raw.githubusercontent.com/itisnotmac/Chess-Audio-Assets/main/ReelChessMenuMusicFinal.mp3';

let audio = null;
let stopped = false;
let touchHandler = null;
let clickHandler = null;

export function startMenuMusic() {
  if (audio) return;
  stopped = false;

  audio = new Audio(MENU_MUSIC_URL);
  audio.loop = true;
  audio.volume = 0.5;

  const tryPlay = () => {
    if (stopped || !audio) return;
    audio.play().catch(() => {});
  };

  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      // Autoplay blocked — wait for first user interaction
      touchHandler = tryPlay;
      clickHandler = tryPlay;
      document.addEventListener('touchstart', touchHandler, { once: true });
      document.addEventListener('click', clickHandler, { once: true });
    });
  }
}

export function stopMenuMusic() {
  stopped = true;

  // Remove fallback listeners so they can never re-trigger playback
  if (touchHandler) {
    document.removeEventListener('touchstart', touchHandler);
    touchHandler = null;
  }
  if (clickHandler) {
    document.removeEventListener('click', clickHandler);
    clickHandler = null;
  }

  if (audio) {
    audio.pause();
    audio.src = '';
    audio = null;
  }
}