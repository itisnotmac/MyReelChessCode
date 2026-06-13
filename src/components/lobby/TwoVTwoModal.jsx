import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Wifi, Monitor, Crown } from 'lucide-react';

export default function TwoVTwoModal({ isOpen, onClose, onLocal, onOnline, isAuthenticated, isPremium }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-x-4 bottom-0 z-50 rounded-t-3xl overflow-hidden"
            style={{ background: 'linear-gradient(160deg, #0d1f1f 0%, #0a0a0f 100%)', border: '1px solid rgba(58,175,169,0.2)', borderBottom: 'none', maxWidth: 480, margin: '0 auto' }}
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 280, damping: 30 }}
          >
            <div className="p-6 pb-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#3AAFA9]" />
                  <span className="font-black tracking-[0.2em] uppercase text-sm text-[#3AAFA9]">2v2 Mode</span>
                </div>
                <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-white/40 text-xs tracking-wider text-center mb-6">
                4 players · 2 teams · P1→P3→P2→P4 turn order
              </p>

              <div className="space-y-3">
                <button
                  onClick={onLocal}
                  className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl border border-[#3AAFA9]/30 bg-[#3AAFA9]/08 hover:bg-[#3AAFA9]/15 active:scale-95 transition-all text-left"
                  style={{ background: 'rgba(58,175,169,0.06)' }}
                >
                  <div className="w-10 h-10 rounded-xl bg-[#3AAFA9]/15 border border-[#3AAFA9]/30 flex items-center justify-center shrink-0">
                    <Monitor className="w-5 h-5 text-[#3AAFA9]" />
                  </div>
                  <div>
                    <p className="text-white font-bold tracking-wider text-sm">Local 2v2</p>
                    <p className="text-white/35 text-xs mt-0.5">Pass the device, play on one screen</p>
                  </div>
                </button>

                <button
                  onClick={onOnline}
                  className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl border border-[#3AAFA9]/30 hover:bg-[#3AAFA9]/15 active:scale-95 transition-all text-left"
                  style={{ background: 'rgba(58,175,169,0.06)' }}
                >
                  <div className="w-10 h-10 rounded-xl bg-[#3AAFA9]/15 border border-[#3AAFA9]/30 flex items-center justify-center shrink-0">
                    <Wifi className="w-5 h-5 text-[#3AAFA9]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-white font-bold tracking-wider text-sm">Online 2v2</p>
                      {!isPremium && <Crown className="w-3 h-3 text-[#3AAFA9]" />}
                    </div>
                    <p className="text-white/35 text-xs mt-0.5">
                      {isPremium ? 'Create a room · Invite 3 friends with a code' : 'Premium feature · $4.99/mo'}
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}