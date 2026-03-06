import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Settings, HelpCircle, Mail, Info, Volume2, VolumeX, ChevronDown } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function InfoPage() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const section = urlParams.get('section') || 'settings';

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="rounded-xl bg-white/5 border border-white/5 p-4 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white text-sm font-medium">Battle Cutscenes</p>
            <p className="text-white/30 text-xs mt-0.5">Show cinematic battles on capture</p>
          </div>
          <Switch defaultChecked />
        </div>
        <div className="h-px bg-white/5" />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white text-sm font-medium">Board Flip</p>
            <p className="text-white/30 text-xs mt-0.5">Rotate board for Player 2 in local mode</p>
          </div>
          <Switch defaultChecked />
        </div>
        <div className="h-px bg-white/5" />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white text-sm font-medium">Move Hints</p>
            <p className="text-white/30 text-xs mt-0.5">Show legal move indicators</p>
          </div>
          <Switch defaultChecked />
        </div>
      </div>

      <div className="rounded-xl bg-white/5 border border-white/5 p-4">
        <p className="text-white text-sm font-medium mb-3">AI Difficulty</p>
        <div className="grid grid-cols-3 gap-2">
          {['Easy', 'Medium', 'Hard'].map((level) => (
            <button
              key={level}
              className={`py-2.5 rounded-lg text-xs tracking-wider font-medium transition-all ${
                level === 'Medium'
                  ? 'bg-[#D4AF37] text-[#0a0a0f]'
                  : 'bg-white/5 text-white/50 hover:bg-white/10'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderFAQ = () => (
    <Accordion type="single" collapsible className="space-y-2">
      {[
        { q: "How do the battle cutscenes work?", a: "When a piece captures another piece, the game transitions to a cinematic battle scene showing the capturing piece defeating the captured piece in an animated showdown. You can skip these by tapping 'SKIP' or disable them in Settings." },
        { q: "How does Player vs AI work?", a: "You play as White and the AI plays as Black. The AI uses a minimax algorithm with alpha-beta pruning to calculate its moves. You can adjust difficulty in Settings." },
        { q: "How does Player vs Player work?", a: "Both players share the same device. After each move, the board flips so each player sees from their perspective. This is a 'pass and play' style local multiplayer." },
        { q: "What are the chess rules?", a: "Standard chess rules apply including castling, en passant, and pawn promotion (auto-promotes to Queen). The game detects checkmate and stalemate automatically." },
        { q: "Can I undo a move?", a: "Currently there is no undo feature. Think carefully before making your move!" },
      ].map((item, i) => (
        <AccordionItem
          key={i}
          value={`faq-${i}`}
          className="rounded-xl bg-white/5 border border-white/5 px-4 overflow-hidden"
        >
          <AccordionTrigger className="text-white text-sm font-medium py-4 hover:no-underline">
            {item.q}
          </AccordionTrigger>
          <AccordionContent className="text-white/40 text-xs leading-relaxed pb-4">
            {item.a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );

  const renderContact = () => (
    <div className="space-y-6">
      <div className="rounded-xl bg-white/5 border border-white/5 p-6 text-center">
        <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #D4AF37, #8B6914)' }}>
          <Mail className="w-6 h-6 text-[#0a0a0f]" />
        </div>
        <h3 className="text-white font-bold tracking-wider text-sm mb-2">GET IN TOUCH</h3>
        <p className="text-white/30 text-xs leading-relaxed mb-6">
          Have feedback, found a bug, or want to suggest a feature? We'd love to hear from you.
        </p>
        <a
          href="mailto:support@battlechess.app"
          className="inline-block px-6 py-3 rounded-xl bg-[#D4AF37] text-[#0a0a0f] text-xs font-bold tracking-wider hover:bg-[#C4A030] transition-colors"
        >
          EMAIL US
        </a>
        <p className="text-white/20 text-[10px] mt-4 tracking-wider">support@battlechess.app</p>
      </div>
    </div>
  );

  const renderAbout = () => (
    <div className="space-y-6">
      <div className="rounded-xl bg-white/5 border border-white/5 p-6 text-center">
        <span className="text-5xl mb-4 inline-block" style={{
          color: '#D4AF37',
          filter: 'drop-shadow(0 0 20px rgba(212,175,55,0.3))',
        }}>♚</span>
        <h3 className="text-xl font-black tracking-[0.15em] mb-1"
          style={{
            backgroundImage: 'linear-gradient(135deg, #D4AF37, #F5E6A3)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
          BATTLE CHESS
        </h3>
        <p className="text-white/20 text-[10px] tracking-[0.3em] mb-6">VERSION 1.0</p>
        <p className="text-white/40 text-xs leading-relaxed max-w-xs mx-auto">
          Battle Chess reimagines the classic game with cinematic battle cutscenes. 
          Every capture becomes an epic showdown between chess pieces on the battlefield.
        </p>
      </div>

      <div className="rounded-xl bg-white/5 border border-white/5 p-4 space-y-3">
        {[
          { label: 'Engine', value: 'Custom Minimax AI' },
          { label: 'Framework', value: 'React' },
          { label: 'Animations', value: 'Framer Motion' },
          { label: 'Platform', value: 'Base44' },
        ].map((item) => (
          <div key={item.label} className="flex justify-between items-center">
            <span className="text-white/30 text-xs">{item.label}</span>
            <span className="text-white/60 text-xs font-medium">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const sections = {
    settings: { title: 'Settings', icon: Settings, render: renderSettings },
    faq: { title: 'FAQ', icon: HelpCircle, render: renderFAQ },
    contact: { title: 'Contact Us', icon: Mail, render: renderContact },
    about: { title: 'About', icon: Info, render: renderAbout },
  };

  const current = sections[section] || sections.settings;

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-6 pb-8">
        <button
          onClick={() => navigate(createPageUrl('Lobby'))}
          className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <current.icon className="w-4 h-4 text-[#D4AF37]" />
          <h1 className="text-lg font-bold tracking-wider text-white">{current.title}</h1>
        </div>
      </div>

      {/* Content */}
      <motion.div
        className="px-5 pb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        key={section}
      >
        {current.render()}
      </motion.div>
    </div>
  );
}