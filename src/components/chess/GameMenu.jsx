import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, RotateCcw, Volume2, VolumeX, Menu, X } from 'lucide-react';

export default function GameMenu({ onHome, onReset, soundEnabled, onToggleSound }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="h-9 px-3 rounded-lg bg-white/5 border border-white/10 flex items-center gap-1.5 text-white/60 hover:text-white/90 transition-colors"
      >
        {open ? <X className="w-3.5 h-3.5" /> : <Menu className="w-3.5 h-3.5" />}
        <span style={{ fontSize: '11px', letterSpacing: '0.12em' }} className="uppercase font-medium text-[#D4AF37]/70">Menu</span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 top-11 z-50 w-52 rounded-xl bg-[#111118] border border-white/10 shadow-2xl overflow-hidden"
            >
              {/* Return to Lobby */}
              <button
                onClick={() => { setOpen(false); onHome(); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors border-b border-white/5"
              >
                <Home className="w-4 h-4 text-[#D4AF37]/60 flex-shrink-0" />
                <span className="text-white/80 text-sm">Return to Lobby</span>
              </button>

              {/* Give Me A Do-Over */}
              <button
                onClick={() => { setOpen(false); onReset(); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors border-b border-white/5"
              >
                <RotateCcw className="w-4 h-4 text-[#D4AF37]/60 flex-shrink-0" />
                <span className="text-white/80 text-sm">Give Me A Do-Over</span>
              </button>

              {/* Sound Toggle */}
              <button
                onClick={() => onToggleSound()}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors"
              >
                {soundEnabled
                  ? <Volume2 className="w-4 h-4 text-[#D4AF37]/60 flex-shrink-0" />
                  : <VolumeX className="w-4 h-4 text-white/30 flex-shrink-0" />
                }
                <span className={`text-sm ${soundEnabled ? 'text-white/80' : 'text-white/30'}`}>
                  Sound {soundEnabled ? 'On' : 'Off'}
                </span>
                <div className={`ml-auto w-7 h-4 rounded-full transition-colors ${soundEnabled ? 'bg-[#D4AF37]/60' : 'bg-white/10'}`}>
                  <div className={`w-3 h-3 rounded-full bg-white mt-0.5 transition-transform ${soundEnabled ? 'translate-x-3.5' : 'translate-x-0.5'}`} />
                </div>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}