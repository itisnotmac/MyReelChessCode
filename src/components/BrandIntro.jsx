import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const INTRO_VIDEO_URL = 'https://media.base44.com/videos/public/69ab30c24c8c7db2b8432adf/4026eb765_Good_4_Nothin_Intro.mp4';

export default function BrandIntro({ onComplete }) {
  const videoRef = useRef(null);
  const [visible, setVisible] = useState(true);
  const [muted, setMuted] = useState(false);

  // Try unmuted autoplay; fall back to muted if the browser blocks it
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.volume = 0.7;
    v.play().catch(() => {
      setMuted(true);
    });
  }, []);

  const finish = () => {
    setVisible(false);
    setTimeout(onComplete, 350);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden"
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
            className="absolute bottom-6 right-6 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm text-white/40 text-xs tracking-wider uppercase hover:text-white/70 hover:bg-white/20 transition-all z-10"
          >
            Skip
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}