import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings, HelpCircle, Mail, Info, Trophy } from 'lucide-react';

export default function MenuDrawer({ isOpen, onClose, onNavigate }) {
  const menuItems = [
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
    { id: 'history', label: 'Game History', icon: Trophy },
    { id: 'contact', label: 'Contact Us', icon: Mail },
    { id: 'about', label: 'About', icon: Info },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed right-0 top-0 bottom-0 w-72 bg-gradient-to-b from-[#1a1a2e] to-[#0f0f1a] z-50 shadow-2xl border-l border-[#D4AF37]/10"
            initial={{ x: 300 }}
            animate={{ x: 0 }}
            exit={{ x: 300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-lg font-bold tracking-wider text-[#D4AF37]">MENU</h2>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                {menuItems.map((item, i) => (
                  <motion.button
                    key={item.id}
                    onClick={() => { onNavigate(item.id); onClose(); }}
                    className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-all group"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                  >
                    <div className="w-9 h-9 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center group-hover:bg-[#D4AF37]/20 transition-colors">
                      <item.icon className="w-4 h-4 text-[#D4AF37]" />
                    </div>
                    <span className="text-sm tracking-wider font-medium">{item.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Bottom branding */}
            <div className="absolute bottom-8 left-0 right-0 text-center">
              <p className="text-[10px] tracking-[0.3em] uppercase text-white/15">Battle Chess v1.0</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}