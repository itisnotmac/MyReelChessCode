import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useSeo } from '@/lib/useSeo';
import { HERO_BACKDROPS } from '@/lib/heroBackdrops';

const BACKDROP_OPTIONS = [
  { key: 'cinematic3dHero', label: '1. Cinematic 3D Hero' },
  { key: 'cinematicVideoLoop', label: '2. Cinematic Video Loop' },
  { key: 'glassCommandCenter', label: '3. Glass Command Center' },
  { key: 'cutsceneTitleSequence', label: '4. Cutscene Title Sequence' },
];

export default function About() {
  const navigate = useNavigate();
  useSeo(
    'About Reel Chess – Immersive Browser Chess with AI & Tutorials',
    'Learn about Reel Chess — a free browser-based chess game with cinematic battle cutscenes, AI opponents at multiple difficulty levels, local PvP and 2v2 multiplayer, and built-in interactive tutorials.'
  );

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 px-5 pt-6 pb-4 border-b border-[#3AAFA9]/10">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-[#3AAFA9] hover:bg-[#3AAFA9]/15 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="text-xs tracking-[0.3em] uppercase text-[#3AAFA9]/60 font-medium">Reel Chess</span>
      </div>

      {/* Backdrop preview gallery (temporary — for picking the About background) */}
      <div className="max-w-2xl mx-auto px-6 pt-8 w-full">
        <p className="text-[#3AAFA9]/60 text-xs tracking-widest uppercase mb-3">Pick a backdrop — tell me the number</p>
        <div className="grid grid-cols-2 gap-3">
          {BACKDROP_OPTIONS.map((opt) => (
            <div key={opt.key} className="rounded-xl overflow-hidden border border-[#3AAFA9]/20">
              <img src={HERO_BACKDROPS[opt.key]} alt={opt.label} className="w-full h-32 object-cover" />
              <div className="bg-white/5 px-2 py-1 text-[10px] tracking-widest uppercase text-[#3AAFA9]/70">{opt.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-2xl mx-auto px-6 py-10 w-full">
        <h1 className="text-3xl font-black tracking-[0.15em] uppercase mb-2"
          style={{
            backgroundImage: 'linear-gradient(135deg, #3AAFA9 0%, #A8E6E3 60%, #3AAFA9 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 14px rgba(58,175,169,0.3))',
          }}
        >
          About Reel Chess
        </h1>
        <p className="text-[#3AAFA9]/40 text-xs tracking-widest uppercase mb-8">The chess experience reimagined</p>

        <div className="space-y-5 text-white/70 text-sm leading-relaxed">
          <p>
            Reel Chess is a browser-based chess game built for players who want more than just a board — it's a
            fully immersive chess experience complete with cinematic battle cutscenes, animated piece captures,
            and a dynamic audio-visual presentation that makes every move feel like an event.
          </p>
          <p>
            Whether you're a brand-new player still learning how the pieces move or a seasoned club player
            looking for a quick casual match, Reel Chess has a mode for you. Jump into a game against our
            AI opponent — choose Novice for a forgiving intro, Arrogant for a balanced challenge, or
            Grandmaster when you're ready to test your limits. Prefer playing with a friend? Local PvP lets
            two players go head-to-head on the same device.
          </p>
          <p>
            Learning the game is built right in. The interactive Tutorial section walks you through every piece,
            explains check and checkmate, and lets you practice moves on a live board — so you're never stuck
            watching a video when you could be playing.
          </p>
          <p>
            Reel Chess is developed and maintained by an independent creator passionate about making classic
            strategy games accessible, beautiful, and fun for everyone. The app is constantly evolving, with
            new features, visual improvements, and gameplay refinements rolled out regularly based on community
            feedback.
          </p>
          <p>
            We believe great chess doesn't need a complicated interface. Reel Chess keeps things clean,
            fast, and focused — so you can spend less time navigating menus and more time enjoying the game.
          </p>
        </div>

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