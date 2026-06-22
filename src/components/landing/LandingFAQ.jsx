import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: 'What is Reel Chess?',
    a: 'Reel Chess is a free browser-based chess game featuring cinematic battle cutscenes when pieces are captured, AI opponents with Novice, Arrogant, and Grandmaster difficulty levels, local PvP multiplayer for two players on one device, and interactive step-by-step tutorials for learning chess.',
  },
  {
    q: 'Is Reel Chess free to play?',
    a: 'Yes, Reel Chess is free to play in your web browser. A premium subscription is available for additional features like online 2v2 multiplayer.',
  },
  {
    q: 'Can I learn chess with Reel Chess?',
    a: 'Yes, Reel Chess includes an interactive tutorial that teaches how each piece moves, special moves like castling and en passant, check, checkmate, and basic chess strategy. Lessons include hands-on practice on a live board.',
  },
  {
    q: 'What game modes does Reel Chess have?',
    a: 'Reel Chess offers vs AI mode with three difficulty levels (Novice, Arrogant, Grandmaster), local PvP multiplayer for two players on the same device, online multiplayer with invite codes, and an interactive tutorial mode.',
  },
  {
    q: 'Do I need to create an account to play Reel Chess?',
    a: 'Yes, creating a free account is required to play the game. This allows you to track your game history, statistics, achievements, and play online with others. You can browse the About, Tutorial, and Contact pages without an account.',
  },
];

export default function LandingFAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section className="py-20 px-6 max-w-3xl mx-auto">
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
          Frequently Asked Questions
        </h2>
        <p className="text-white/40 text-sm">Everything you need to know about Reel Chess</p>
      </motion.div>

      <div className="space-y-3">
        {FAQS.map((faq, i) => (
          <div
            key={i}
            className="border border-[#3AAFA9]/15 rounded-xl overflow-hidden bg-white/[0.02]"
          >
            <button
              onClick={() => setOpen(open === i ? -1 : i)}
              className="w-full flex items-center justify-between p-5 text-left"
            >
              <span className="text-sm font-medium text-white/90">{faq.q}</span>
              <ChevronDown
                className={`w-4 h-4 text-[#3AAFA9] shrink-0 ml-4 transition-transform ${
                  open === i ? 'rotate-180' : ''
                }`}
              />
            </button>
            <AnimatePresence>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 text-sm text-white/60 leading-relaxed">{faq.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}