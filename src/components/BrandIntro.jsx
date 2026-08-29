import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const INTRO_VIDEO_URL = 'https://media.base44.com/videos/public/69ab30c24c8c7db2b8432adf/4026eb765_Good_4_Nothin_Intro.mp4';
export const INTRO_SESSION_KEY = 'reel-chess:intro-complete';
const INTRO_FAILSAFE_MS = 10000;

export function hasCompletedIntroThisSession() {
  try {
    return window.sessionStorage.getItem(INTRO_SESSION_KEY) === 'true';
  } catch {
    // Some embedded browsers can disable web storage. The intro still has a
    // timeout and media error handling, so storage must never block startup.
    return false;
  }
}

function markIntroHandledForSession() {
  try {
    // Mark at playback start, not only at the end. If Android recreates or
    // reloads the WebView mid-video, the next mount must bypass the intro.
    window.sessionStorage.setItem(INTRO_SESSION_KEY, 'true');
  } catch {
    // Startup must continue even when storage is unavailable.
  }
}

export default function BrandIntro({ onComplete }) {
  const videoRef = useRef(null);
  const completedRef = useRef(false);
  const completionTimerRef = useRef(null);
  const failsafeTimerRef = useRef(null);
  const [visible, setVisible] = useState(true);
  const [muted, setMuted] = useState(false);

  const finish = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;

    markIntroHandledForSession();

    const video = videoRef.current;
    if (video) {
      video.pause();
      video.removeAttribute('src');
      video.load();
    }

    setVisible(false);
    completionTimerRef.current = window.setTimeout(onComplete, 350);
  }, [onComplete]);

  // Try unmuted autoplay; fall back to muted if the browser blocks it
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    markIntroHandledForSession();
    v.volume = 0.7;
    v.play().catch(() => {
      v.muted = true;
      setMuted(true);
      // Setting the React prop alone does not retry playback on every Android
      // WebView, so retry explicitly after switching to muted playback.
      v.play().catch(() => {});
    });

    // A remote video can stall without firing ended/error. Never let media
    // loading prevent the application itself from opening.
    failsafeTimerRef.current = window.setTimeout(finish, INTRO_FAILSAFE_MS);

    return () => {
      window.clearTimeout(failsafeTimerRef.current);
      window.clearTimeout(completionTimerRef.current);
      v.pause();
    };
  }, [finish]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <video
            ref={videoRef}
            src={INTRO_VIDEO_URL}
            autoPlay
            playsInline
            muted={muted}
            onEnded={finish}
            onError={finish}
            onClick={finish}
            className="w-full h-full object-cover"
          />

          {/* Tap-to-unmute hint (only if muted fallback kicked in) */}
          {muted && (
            <button
              onClick={() => {
                const v = videoRef.current;
                if (v) { v.muted = false; setMuted(false); }
              }}
              className="absolute top-6 right-6 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm text-white/50 text-xs tracking-wider uppercase hover:text-white/80 hover:bg-white/20 transition-all z-10"
            >
              Tap for Sound
            </button>
          )}

          {/* Skip button */}
          <button
            onClick={finish}
            className="absolute bottom-6 right-6 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm text-white/60 text-xs tracking-wider uppercase hover:text-white/70 hover:bg-white/20 transition-all z-10"
          >
            Skip
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
