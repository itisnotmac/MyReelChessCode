import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cpu, AlertCircle } from 'lucide-react';

const difficulties = [
  { id: 'novice',          label: 'Novice (Practice)', desc: 'AI intentionally loses',  icon: '♟' },
  { id: 'yellow-belt',     label: 'Yellow Belt',      desc: 'Just learning the ropes',  icon: '🥋' },
  { id: 'tough-guy',       label: 'Tough Guy',        desc: 'Knows the basics',         icon: '💪' },
  { id: 'getting-serious', label: 'Getting Serious',   desc: 'Plays with purpose',        icon: '🎯' },
  { id: 'brick-top',       label: 'Brick Top',         desc: 'Formidable opponent',      icon: '🧱' },
  { id: 'final-boss',      label: 'Final Boss',        desc: 'Shows no mercy',            icon: '👑' },
];

const VALID_IDS = difficulties.map(d => d.id);

export default function DifficultyModal({ isOpen, onClose, onConfirm }) {
  const [selected, setSelected] = useState(() => {
    const stored = localStorage.getItem('chessDifficulty');
    return VALID_IDS.includes(stored) ? stored : 'tough-guy';
  });
  const [showNoviceNotice, setShowNoviceNotice] = useState(false);

  const handleConfirm = () => {
    if (selected === 'novice') {
      setShowNoviceNotice(true);
      return;
    }
    localStorage.setItem('chessDifficulty', selected);
    onConfirm(selected);
  };

  const handleNoviceAcknowledge = () => {
    localStorage.setItem('chessDifficulty', 'novice');
    setShowNoviceNotice(false);
    onConfirm('novice');
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
            <div className="w-full max-w-sm rounded-2xl border border-[#3AAFA9]/20 overflow-hidden shadow-2xl"
            style={{ background: 'linear-gradient(160deg, #0d1f1f 0%, #0a0a0f 100%)' }}>

              {/* Header */}
              <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-[#3AAFA9]/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #3AAFA9, #1a6e6b)' }}>
                    <Cpu className="w-4 h-4 text-[#0a0a0f]" />
                  </div>
                  <div>
                    <p className="text-white font-bold tracking-wider text-sm">CHOOSE DIFFICULTY</p>
                    <p className="text-[#3AAFA9]/50 text-[10px] tracking-wider">Select your opponent's strength</p>
                  </div>
                </div>
                <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Difficulty options */}
              <div className="p-4 space-y-2.5">
                {difficulties.map((d, idx) => (
                  <React.Fragment key={d.id}>
                    <button
                      onClick={() => setSelected(d.id)}
                      className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-left transition-all border ${
                        selected === d.id
                          ? 'border-[#3AAFA9]/60 bg-[#3AAFA9]/10'
                          : 'border-white/5 bg-white/3 hover:bg-white/5'
                      }`}
                    >
                      <span className={`text-2xl ${selected === d.id ? 'text-[#3AAFA9]' : 'text-white/20'}`}>{d.icon}</span>
                      <div className="flex-1">
                        <p className={`text-xs font-bold tracking-wider ${selected === d.id ? 'text-[#3AAFA9]' : 'text-white/50'}`}>
                          {d.label.toUpperCase()}
                        </p>
                        <p className={`text-[10px] mt-0.5 ${selected === d.id ? 'text-[#3AAFA9]/60' : 'text-white/20'}`}>{d.desc}</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                        selected === d.id ? 'border-[#3AAFA9] bg-[#3AAFA9]' : 'border-white/20'
                      }`}>
                        {selected === d.id && <div className="w-1.5 h-1.5 rounded-full bg-[#0a0a0f]" />}
                      </div>
                    </button>
                    {/* Solid white line separating Novice (Practice) from real difficulties */}
                    {idx === 0 && (
                      <div className="h-0.5 bg-white/50 my-1" />
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Confirm */}
              <div className="px-4 pb-5">
                <button
                  onClick={handleConfirm}
                  className="w-full py-3.5 rounded-xl font-bold tracking-[0.15em] text-sm text-[#0a0a0f] transition-opacity hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #3AAFA9, #1a6e6b)' }}
                >
                  START BATTLE
                </button>
              </div>
            </div>
          </motion.div>

          {/* Novice practice notice popup */}
          <AnimatePresence>
            {showNoviceNotice && (
              <motion.div
                className="fixed inset-0 z-[60] flex items-center justify-center px-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
                <motion.div
                  className="relative w-full max-w-sm rounded-2xl border border-[#3AAFA9]/30 overflow-hidden shadow-2xl"
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 20 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                  style={{ background: 'linear-gradient(160deg, #0d1f1f 0%, #0a0a0f 100%)' }}
                >
                  <div className="flex flex-col items-center px-6 pt-6 pb-5">
                    <div className="w-12 h-12 rounded-xl bg-[#3AAFA9]/15 border border-[#3AAFA9]/30 flex items-center justify-center mb-4">
                      <AlertCircle className="w-6 h-6 text-[#3AAFA9]" />
                    </div>
                    <p className="text-white text-sm leading-relaxed text-center mb-5">
                      The Novice difficulty selection you have chosen was implemented as a practice space for new players of chess to be able to go hands-on, in a real game setting. The AI will intentionally move its pieces into positions where they can be easily taken by You.
                    </p>
                    <button
                      onClick={handleNoviceAcknowledge}
                      className="w-full py-3.5 rounded-xl font-bold tracking-[0.15em] text-sm text-[#0a0a0f] transition-opacity hover:opacity-90"
                      style={{ background: 'linear-gradient(135deg, #3AAFA9, #1a6e6b)' }}
                    >
                      OK
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}