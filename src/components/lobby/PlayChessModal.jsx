import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wifi, Bot, Users, UsersRound, Crown, QrCode, ScanLine } from 'lucide-react';

export default function PlayChessModal({ isOpen, onClose, onOnlinePvp, onVsAI, onLocalPvp, on2v2, onWifiMatch, onJoinQr, isPremium }) {
  const modes = [
    {
      id: 'online',
      label: 'Online PVP',
      icon: Wifi,
      desc: isPremium ? 'Challenge anyone, anywhere' : 'Premium feature',
      locked: !isPremium,
      onClick: onOnlinePvp
    },
    {
      id: 'wifi',
      label: 'WiFi Match',
      icon: QrCode,
      desc: 'Create a game · Share a QR code',
      onClick: onWifiMatch
    },
    {
      id: 'joinqr',
      label: 'Join via QR',
      icon: ScanLine,
      desc: 'Scan a code to join a game',
      onClick: onJoinQr
    },
    {
      id: 'ai',
      label: 'vs AI',
      icon: Bot,
      desc: 'Play against the computer',
      onClick: onVsAI
    },
    {
      id: 'local',
      label: 'Local PVP',
      icon: Users,
      desc: 'Pass and play on one device',
      onClick: onLocalPvp
    },
    {
      id: '2v2',
      label: '2v2 Team',
      icon: UsersRound,
      desc: 'Four-player chess variant',
      onClick: on2v2
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} />
          <motion.div
            className="fixed left-0 right-0 bottom-0 z-50 rounded-t-3xl border-t border-[#3AAFA9]/20 bg-gradient-to-b from-[#1a1a2e] to-[#0f0f1a] shadow-2xl"
            initial={{ y: 400 }} animate={{ y: 0 }} exit={{ y: 400 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
            <div className="p-6 pb-8 max-w-md mx-auto">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold tracking-wider text-[#3AAFA9]">PLAY CHESS</h2>
                <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                {modes.map((mode, i) => (
                  <motion.button
                    key={mode.id}
                    onClick={() => { mode.onClick(); onClose(); }}
                    whileTap={{ scale: 0.97 }}
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + i * 0.05 }}
                    className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-left">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#3AAFA9]/10">
                      <mode.icon className="w-5 h-5 text-[#3AAFA9]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold tracking-wider text-white">{mode.label}</p>
                      <p className="text-[11px] text-white/40 mt-0.5">{mode.desc}</p>
                    </div>
                    {mode.locked && <Crown className="w-4 h-4 text-[#D4AF37]" />}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}