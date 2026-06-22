import React from 'react';
import { motion } from 'framer-motion';
import { Swords, Bot, Users, GraduationCap, BarChart3, Trophy } from 'lucide-react';

const FEATURES = [
  {
    icon: Swords,
    title: 'Cinematic Battle Cutscenes',
    desc: 'Watch every capture come alive with animated battle sequences that make each move feel epic.',
  },
  {
    icon: Bot,
    title: 'AI Opponents',
    desc: 'Challenge three difficulty levels — Novice for a gentle start, Arrogant for balance, or Grandmaster for a real test.',
  },
  {
    icon: Users,
    title: 'Local PvP Multiplayer',
    desc: 'Play head-to-head with a friend on the same device. No accounts needed, just pure chess.',
  },
  {
    icon: GraduationCap,
    title: 'Interactive Tutorials',
    desc: 'Learn chess step by step with hands-on lessons covering every piece, rule, and strategy.',
  },
  {
    icon: BarChart3,
    title: 'Statistics & History',
    desc: 'Track your games, win rates, move counts, and progress over time with detailed stats.',
  },
  {
    icon: Trophy,
    title: 'Achievements & Badges',
    desc: 'Unlock milestones and badges as you improve — from your first win to long win streaks.',
  },
];

export default function LandingFeatures() {
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
          Why Reel Chess?
        </h2>
        <p className="text-white/40 text-sm">
          More than just a board — a full chess experience built for players of all levels.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {FEATURES.map((feature, i) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="p-6 rounded-2xl border border-[#3AAFA9]/15 bg-white/[0.02] hover:border-[#3AAFA9]/30 transition-colors"
            >
              <div className="w-11 h-11 rounded-xl bg-[#3AAFA9]/10 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-[#3AAFA9]" />
              </div>
              <h3 className="text-base font-bold text-white/90 mb-2">{feature.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{feature.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}