import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ScrollText } from 'lucide-react';

export default function MoveHistory({ moves, open, onClose }) {
  // Group into pairs: [whiteNotation, blackNotation]
  const pairs = [];
  for (let i = 0; i < moves.length; i += 2) {
    pairs.push({
      number: Math.floor(i / 2) + 1,
      white: moves[i],
      black: moves[i + 1] || null,
    });
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm"
          />
          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="fixed top-0 right-0 bottom-0 z-[81] w-72 bg-[#111118] border-l border-[#3AAFA9]/20 flex flex-col"
            style={{
              paddingTop: 'calc(env(safe-area-inset-top) + 16px)',
              paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <ScrollText className="w-4 h-4 text-[#3AAFA9]" />
                <h2 className="text-sm font-bold tracking-wider text-white">MOVE HISTORY</h2>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/50 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Move list */}
            <div className="flex-1 overflow-y-auto px-2 py-2">
              {pairs.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-white/20">
                  <ScrollText className="w-8 h-8 mb-2 opacity-30" />
                  <p className="text-xs">No moves yet</p>
                </div>
              ) : (
                <div className="space-y-0.5">
                  {pairs.map((pair) => (
                    <div
                      key={pair.number}
                      className="grid grid-cols-[2rem_1fr_1fr] items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <span className="text-[11px] text-white/25 tabular-nums">{pair.number}.</span>
                      <span className="text-[13px] text-white/80 font-medium tabular-nums font-mono">{pair.white}</span>
                      <span className="text-[13px] text-white/60 font-medium tabular-nums font-mono">
                        {pair.black || ''}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}