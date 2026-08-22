import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useSeo } from '@/lib/useSeo';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQS = [
  { q: "How do the battle cutscenes work?", a: "When a piece captures another piece, the game transitions to a cinematic battle scene showing the capturing piece defeating the captured piece in an animated showdown. You can skip these by tapping 'SKIP' or disable them in Settings." },
  { q: "How does Player vs AI work?", a: "You play as White and the AI plays as Black. The AI uses a minimax algorithm with alpha-beta pruning to calculate its moves. You can adjust difficulty in Settings." },
  { q: "How does Player vs Player work?", a: "Both players share the same device. After each move, the board flips so each player sees from their perspective. This is a 'pass and play' style local multiplayer.Alternatively one can find a match and play someone somewhere else in the world via the matchmaking pvp move. " },
  { q: "What are the chess rules?", a: "Standard chess rules apply including castling, en passant, and pawn promotion (auto-promotes to Queen). The game detects checkmate and stalemate automatically." },
  { q: "Can I undo a move?", a: "Currently there is no undo feature. Think carefully before making your move!" },
  { q: "What is Tempo?", a: "Tempo is the in-game currency of Reel Chess. You earn Tempo by completing daily challenges, maintaining login streaks, and winning games. You can spend it in the Store on board skins and piece sets." },
  { q: "How do I earn Tempo?", a: "You earn Tempo automatically by playing the game — winning matches, completing daily challenges, and logging in on consecutive days all reward Tempo. Visit your Profile to see your current balance." },
  { q: "What is the Daily Report Card?", a: "The Daily Report Card (formerly 'Claim Rewards') is your daily activity log. It tracks the games you played, challenges you completed, and Tempo you earned each day. Open it from the home screen to review your progress." },
  { q: "What are Daily Challenges?", a: "Each day you receive a fresh set of challenges like winning a game against the AI or finishing a local match. Completing them earns you Tempo and contributes to your daily activity report." },
  { q: "How does the login streak work?", a: "Your streak counts consecutive days you open Reel Chess. Log in every day to keep your streak alive — longer streaks can unlock better daily rewards. Your current streak is displayed at the top of your Profile page." },
  { q: "What is ELO and how is it calculated?", a: "ELO is a competitive rating that reflects your skill level. You start at 1200. When you finish a ranked online 1v1 game, your rating goes up after a win and down after a loss based on your opponent's rating. Your peak ELO is also tracked on your Profile." },
  { q: "What do the one-time unlocks include?", a: "Online PVP is free for everyone. Hosting WiFi matches and 2v2 team matches each require a small one-time unlock ($1.99) — pay once, keep it forever. Joining a match is always free, so your friends can play without paying. Cosmetics (board skins and piece sets) are currently free for everyone." },
  { q: "How does online matchmaking work?", a: "When you queue for an online match, the system pairs you with another player based on approximate region. You'll be assigned White or Black and play in real time against your opponent." },
  { q: "What is 2v2 Team Mode?", a: "In 2v2, two teams of two players share a single board and take turns making moves. You play on one side with a teammate against two opponents, alternating moves between all four players." },
  { q: "How do tournaments work?", a: "Tournaments are coming soon! We're crafting a competitive experience worthy of Reel Chess. Check the Tournaments page for updates." },
  { q: "Can I play in 3D?", a: "Yes! simply by clicking the "switch to 3d mode" button in the upper right corner of the screen while in-game. You can also toggle back to 2-d by clicking the samebutton one more time. It's really quite simple to switch between the two views, possibly giving you an advantage and possibly seeing a move you couldn't have seen before because of the new 3-d perspective. Definitely give it a try while you are playing a match! The 3D board renders with Three.js, giving you an immersive, tilted perspective of the board and pieces. You can still rotate and interact the same way as 2D." },
  { q: "What themes and accessibility options are available?", a: "In Settings you can switch between dark, light, and high-contrast themes. Colorblind modes (deuteranopia, protanopia, tritanopia) are also available to adjust the board colors for better visibility." },
  { q: "How do I customize my board and pieces?", a: "Visit the Store from the home screen or Profile to browse board skins and piece sets. All items are currently free — just tap one to equip it and it will apply across all your games instantly." },
  { q: "How do I delete my account or data?", a: "Go to your Profile page and scroll to the Danger Zone. You can delete your game data (history and stats, keeping your account) or permanently delete your entire account. Both actions are irreversible." },
];

export default function FAQ() {
  const navigate = useNavigate();
  useSeo(
    'Reel Chess FAQ – Frequently Asked Questions',
    'Answers to common questions about Reel Chess: how battle cutscenes work, playing vs AI and local multiplayer, chess rules, undo, and more.'
  );

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col relative">
      {/* Cinematic backdrop — mystic hall of knowledge */}
      <div className="absolute inset-0 z-0">
        <img src="https://media.base44.com/images/public/69ab30c24c8c7db2b8432adf/5cf0fd154_generated_image.png" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(120% 80% at 50% 12%, rgba(10,10,15,0.18) 0%, rgba(10,10,15,0.5) 60%, rgba(10,10,15,0.82) 100%)' }} />
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center gap-4 px-5 pt-6 pb-4 border-b border-[#3AAFA9]/10">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-[#3AAFA9] hover:bg-[#3AAFA9]/15 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="text-xs tracking-[0.3em] uppercase text-[#3AAFA9]/60 font-medium">Reel Chess</span>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 max-w-2xl mx-auto px-6 py-10 w-full">
        <h1 className="text-3xl font-black tracking-[0.15em] uppercase mb-2"
          style={{
            backgroundImage: 'linear-gradient(135deg, #3AAFA9 0%, #A8E6E3 60%, #3AAFA9 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 14px rgba(58,175,169,0.3))',
          }}
        >
          FAQ
        </h1>
        <p className="text-[#3AAFA9]/40 text-xs tracking-widest uppercase mb-8">Frequently asked questions</p>

        <Accordion type="single" collapsible className="space-y-3">
          {FAQS.map((item, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="rounded-xl bg-white/5 border border-white/10 px-5 overflow-hidden"
            >
              <AccordionTrigger className="text-white text-sm font-medium py-4 hover:no-underline">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-white/50 text-sm leading-relaxed pb-4">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Footer links */}
        <div className="mt-10 pt-6 border-t border-[#3AAFA9]/10 flex gap-6">
          <button
            onClick={() => navigate('/Contact')}
            className="text-xs tracking-widest uppercase text-[#3AAFA9]/60 hover:text-[#3AAFA9] transition-colors"
          >
            Contact Us
          </button>
          <button
            onClick={() => navigate('/')}
            className="text-xs tracking-widest uppercase text-[#3AAFA9]/60 hover:text-[#3AAFA9] transition-colors"
          >
            Play Now
          </button>
        </div>
      </div>
    </div>
  );
}