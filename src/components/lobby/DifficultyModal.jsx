import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cpu } from 'lucide-react';

const difficulties = [
  { id: 'novice',      label: 'Novice',      desc: 'Learning the ropes',    icon: '♟' },
  { id: 'arrogant',    label: 'Arrogant',    desc: 'Thinks it knows best',   icon: '♞' },
  { id: 'grandmaster', label: 'Grandmaster', desc: 'Merciless opponent',     icon: '♛' },
];

export default function DifficultyModal({ isOpen, onClose, onConfirm }) {
  const [selected, setSelected] = useState(
    () => localStorage.getItem('chessDifficulty') || 'arrogant'
  );

  const handleConfirm = () => {
    localStorage.setItem('chessDifficulty', selected);
    onConfirm(selected);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-5"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="w-full max-w-sm rounded-2xl border border-[#D4AF37]/20 overflow-hidden shadow-2xl"
              style={{ background: 'linear-gradient(160deg, #1a1a2e 0%, #0f0f1a 100%)' }}>

              {/* Header */}
              <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #D4AF37, #8B6914)' }}>
                    <Cpu className="w-4 h-4 text-[#0a0a0f]" />
                  </div>
                  <div>
                    <p className="text-white font-bold tracking-wider text-sm">CHOOSE DIFFICULTY</p>
                    <p className="text-white/30 text-[10px] tracking-wider">Select your opponent's strength</p>
                  </div>
                </div>
                <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Difficulty options */}
              <div className="p-4 space-y-2.5">
                {difficulties.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setSelected(d.id)}
                    className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-left transition-all border ${
                      selected === d.id
                        ? 'border-[#D4AF37]/60 bg-[#D4AF37]/10'
                        : 'border-white/5 bg-white/3 hover:bg-white/5'
                    }`}
                  >
                    <span className={`text-2xl ${selected === d.id ? 'text-[#D4AF37]' : 'text-white/20'}`}>{d.icon}</span>
                    <div className="flex-1">
                      <p className={`text-xs font-bold tracking-wider ${selected === d.id ? 'text-[#D4AF37]' : 'text-white/50'}`}>
                        {d.label.toUpperCase()}
                      </p>
                      <p className={`text-[10px] mt-0.5 ${selected === d.id ? 'text-[#D4AF37]/60' : 'text-white/20'}`}>{d.desc}</p>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                      selected === d.id ? 'border-[#D4AF37] bg-[#D4AF37]' : 'border-white/20'
                    }`}>
                      {selected === d.id && <div className="w-1.5 h-1.5 rounded-full bg-[#0a0a0f]" />}
                    </div>
                  </button>
                ))}
              </div>

              {/* Confirm */}
              <div className="px-4 pb-5">
                <button
                  onClick={handleConfirm}
                  className="w-full py-3.5 rounded-xl font-bold tracking-[0.15em] text-sm text-[#0a0a0f] transition-opacity hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #D4AF37, #8B6914)' }}
                >
                  START BATTLE
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}