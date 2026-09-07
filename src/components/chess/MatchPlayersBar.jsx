import React from 'react';
import { UserRound, Bot } from 'lucide-react';
import GlowingUsername from '@/components/GlowingUsername';

export default function MatchPlayersBar({ playerName, opponentName, playerGlow = '', opponentGlow = '', opponentIsAI = false }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 px-4 py-1.5">
      <div className="min-w-0 rounded-xl border border-[#3AAFA9]/20 bg-black/25 px-3 py-2 backdrop-blur-md">
        <div className="mb-0.5 flex items-center gap-1.5 text-[#3AAFA9]"><UserRound className="h-3 w-3 shrink-0" /><span className="text-[8px] font-bold uppercase tracking-[0.18em] text-white/35">You</span></div>
        <GlowingUsername glow={playerGlow} className="text-xs text-white">{playerName || 'Player'}</GlowingUsername>
      </div>
      <span className="text-[9px] font-black uppercase tracking-[0.18em] text-white/20">vs</span>
      <div className="min-w-0 rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-right backdrop-blur-md">
        <div className="mb-0.5 flex items-center justify-end gap-1.5"><span className="text-[8px] font-bold uppercase tracking-[0.18em] text-white/35">Opponent</span>{opponentIsAI ? <Bot className="h-3 w-3 shrink-0 text-[#D4AF37]" /> : <UserRound className="h-3 w-3 shrink-0 text-white/45" />}</div>
        <GlowingUsername glow={opponentGlow} align="right" className="text-xs text-white">{opponentName || (opponentIsAI ? 'AI' : 'Opponent')}</GlowingUsername>
      </div>
    </div>
  );
}
