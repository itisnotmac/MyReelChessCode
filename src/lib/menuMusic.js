const MENU_MUSIC_URL = 'https://raw.githubusercontent.com/itisnotmac/Chess-Audio-Assets/main/ReelChessMenuMusicFinal.mp3';

let audio = null;
let started = false;

export function startMenuMusic() {
  if (audio) return; // already running
  audio = new Audio(MENU_MUSIC_URL);
  audio.loop = true;
  audio.volume = 0.5;
  started = false;

  const tryPlay = () => {
    if (!audio || started) return;
    audio.play().then(() => { started = true; }).catch(() => {});
  };

  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise
      .then(() => { started = true; })
      .catch(() => {
        document.addEventListener('touchstart', tryPlay, { once: true });
        document.addEventListener('click', tryPlay, { once: true });
      });
  }
}

export function stopMenuMusic() {
  if (!audio) return;
  audio.pause();
  audio.src = '';
  audio = null;
  started = false;
}