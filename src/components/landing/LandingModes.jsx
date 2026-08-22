import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Users, Wifi, BookOpen } from 'lucide-react';

const MODES = [
  {
    icon: Bot,
    title: 'vs AI',
    desc: 'Practice against computer opponents with adjustable difficulty. Start at Novice, try Arrogant for a balanced match, or face the Grandmaster when you are ready to test your limits.',
  },
  {
    icon: Users,
    title: 'Local PvP',
    desc: 'Two players, one device. Perfect for playing with a friend at home or on the go — just pass the device back and forth after each move.',
  },
  {
    icon: Wifi,
    title: 'Online Multiplayer',
    desc: 'Create a game with a unique invite code and play chess online with friends anywhere in the world. You can also host 2v2 team chess matches with a one-time unlock.',
  },
  {
    icon: BookOpen,
    title: 'Tutorial Mode',
    desc: 'New to chess? Our interactive tutorial walks you through every piece, rule, and basic strategy with hands-on practice on a live board.',
  },
];

export default function LandingModes() {
  return (
    <section className="py-20 px-6 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2
          className="text-3xl sm:text-4xl font-black tracking-wide mb-2"
          style={{
            backgroundImage: 'linear-gradient(135deg, #3AAFA9 0%, #A8E6E3 60%, #3AAFA9 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Game Modes
        </h2>
        <p className="text-white/40 text-sm">
          However you like to play chess, Reel Chess has a mode for you.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {MODES.map((mode, i) => {
          const Icon = mode.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="p-6 rounded-2xl border border-[#3AAFA9]/15 bg-white/[0.02] hover:border-[#3AAFA9]/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#3AAFA9]/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[#3AAFA9]" />
                </div>
                <h3 className="text-lg font-bold text-white/90">{mode.title}</h3>
              </div>
              <p className="text-sm text-white/50 leading-relaxed">{mode.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}