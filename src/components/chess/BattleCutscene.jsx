import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PieceRenderer from './PieceRenderer';
import { getPieceName, isWhite } from './ChessLogic';

const CUTSCENE_VIDEOS = {
  king:   'https://github.com/itisnotmac/Cutscenes/raw/main/KingWinsNoWM.mp4',
  queen:  'https://github.com/itisnotmac/Cutscenes/raw/main/QueenWinsNoWM.mp4',
  rook:   'https://github.com/itisnotmac/Cutscenes/raw/main/RookWinsNoWM.mp4',
  bishop: 'https://github.com/itisnotmac/Cutscenes/raw/main/BishopWinsNoWM.mp4',
  knight: 'https://github.com/itisnotmac/Cutscenes/raw/main/knightwinsNoWM.mp4',
  pawn:   'https://github.com/itisnotmac/Cutscenes/raw/main/PawnWinsNoWM.mp4',
};

const PIECE_TITLES = {
  king: 'The King',
  queen: 'The Queen',
  rook: 'The Rook',
  bishop: 'The Bishop',
  knight: 'The Knight',
  pawn: 'The Pawn'
};

const BATTLE_QUOTES = {
  pawn: ["A soldier falls...", "One less foot soldier.", "The line breaks."],
  knight: ["The cavalry has fallen!", "A noble steed falls silent.", "No more galloping."],
  bishop: ["The clergy is silenced.", "Faith wavers on the field.", "A diagonal cut short."],
  rook: ["The fortress crumbles!", "A tower topples.", "The walls come down."],
  queen: ["The Queen has fallen!", "A devastating loss!", "Power overthrown!"],
  king: ["CHECKMATE!", "The King is dead!", "Long live the King!"]
};

function Particle({ delay, side }) {
  const x = side === 'left' ? -100 + Math.random() * 200 : -100 + Math.random() * 200;
  return (
    <motion.div
      className="absolute w-1 h-1 rounded-full"
      style={{
        background: side === 'left' ? '#D4AF37' : '#8B0000',
        left: side === 'left' ? '30%' : '70%',
        top: '50%'
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        scale: [0, 1.5, 1, 0],
        x: [0, x * 2],
        y: [0, -150 + Math.random() * 300],
      }}
      transition={{ duration: 1.2, delay: delay + 0.8, ease: "easeOut" }}
    />
  );
}

function LightningBolt({ delay }) {
  return (
    <motion.div
      className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[2px] h-32"
      style={{ background: 'linear-gradient(to bottom, transparent, #D4AF37, transparent)' }}
      initial={{ opacity: 0, scaleY: 0 }}
      animate={{ opacity: [0, 1, 0], scaleY: [0, 1, 0] }}
      transition={{ duration: 0.3, delay, ease: "easeInOut" }}
    />
  );
}

export default function BattleCutscene({ attacker, defender, onComplete }) {
  const [phase, setPhase] = useState('enter'); // enter, clash, victory
  const attackerName = getPieceName(attacker);
  const defenderName = getPieceName(defender);
  const attackerWhite = isWhite(attacker);
  const quote = BATTLE_QUOTES[defenderName]?.[Math.floor(Math.random() * 3)] || "A piece falls!";
  const videoUrl = CUTSCENE_VIDEOS[attackerName];

  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }

    const t1 = setTimeout(() => setPhase('clash'), 1200);
    const t2 = setTimeout(() => setPhase('victory'), 2200);
    const t3 = setTimeout(() => onComplete(), 5300);

    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
      if (videoRef.current) { videoRef.current.pause(); }
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Cinematic video background */}
      <video
        ref={videoRef}
        src={videoUrl}
        className="absolute inset-0 w-full h-full object-cover"
        playsInline
        preload="auto"
      />

      {/* Subtle dark overlay so text stays readable */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.45) 100%)'
      }} />

      {/* Cinematic bars */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-16 bg-black z-10"
        initial={{ y: -64 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4 }}
      />
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-16 bg-black z-10"
        initial={{ y: 64 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4 }}
      />

      {/* VS flash */}
      <AnimatePresence>
        {phase === 'enter' && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-20"
            initial={{ opacity: 0, scale: 3 }}
            animate={{ opacity: [0, 1, 1, 0], scale: [3, 1, 1, 0.8] }}
            transition={{ duration: 1.2, times: [0, 0.2, 0.7, 1] }}
          >
            <span className="text-5xl font-black tracking-[0.3em] text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(135deg, #D4AF37, #F5E6A3, #D4AF37)' }}>
              VS
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Attacker (winner) - left side */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-1/2 flex flex-col items-center justify-center"
        initial={{ x: -300, opacity: 0 }}
        animate={
          phase === 'enter' ? { x: -20, opacity: 1 } :
          phase === 'clash' ? { x: 20, opacity: 1, scale: 1.1 } :
          { x: 0, opacity: 1, scale: 1.15 }
        }
        transition={{ type: "spring", stiffness: 80, damping: 15 }}
      >
        <motion.div
          animate={phase === 'victory' ? { 
            filter: ['brightness(1)', 'brightness(1.5)', 'brightness(1)'],
          } : {}}
          transition={{ duration: 0.6, repeat: 2 }}
        >
          <PieceRenderer piece={attacker} size="battle" />
        </motion.div>
        <motion.p
          className="mt-4 text-xs tracking-[0.2em] uppercase font-bold"
          style={{ color: attackerWhite ? '#D4AF37' : '#9B59B6' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {PIECE_TITLES[attackerName]}
        </motion.p>
        <motion.p
          className="text-[10px] tracking-widest uppercase mt-1"
          style={{ color: 'rgba(212,175,55,0.5)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {attackerWhite ? 'WHITE' : 'BLACK'}
        </motion.p>
      </motion.div>

      {/* Defender (loser) - right side */}
      <motion.div
        className="absolute right-0 top-0 bottom-0 w-1/2 flex flex-col items-center justify-center"
        initial={{ x: 300, opacity: 0 }}
        animate={
          phase === 'enter' ? { x: 20, opacity: 1 } :
          phase === 'clash' ? { x: -20, opacity: 0.8 } :
          { x: 60, opacity: 0, y: 100, rotate: -30 }
        }
        transition={
          phase === 'victory' 
            ? { type: "spring", stiffness: 40, damping: 10 }
            : { type: "spring", stiffness: 80, damping: 15 }
        }
      >
        <PieceRenderer piece={defender} size="battle" />
        <motion.p
          className="mt-4 text-xs tracking-[0.2em] uppercase font-bold text-red-400/70"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {PIECE_TITLES[defenderName]}
        </motion.p>
        <motion.p
          className="text-[10px] tracking-widest uppercase mt-1"
          style={{ color: 'rgba(220,50,50,0.4)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {!attackerWhite ? 'WHITE' : 'BLACK'}
        </motion.p>
      </motion.div>

      {/* Clash effect particles */}
      {phase === 'clash' && (
        <>
          {Array.from({ length: 12 }).map((_, i) => (
            <Particle key={`l-${i}`} delay={i * 0.05} side="left" />
          ))}
          {Array.from({ length: 12 }).map((_, i) => (
            <Particle key={`r-${i}`} delay={i * 0.05} side="right" />
          ))}
          <LightningBolt delay={0} />
          <LightningBolt delay={0.15} />
        </>
      )}

      {/* Impact flash */}
      {phase === 'clash' && (
        <motion.div
          className="absolute inset-0 z-30 pointer-events-none"
          style={{ background: 'radial-gradient(circle at center, rgba(212,175,55,0.3) 0%, transparent 70%)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.4 }}
        />
      )}

      {/* Victory quote */}
      <AnimatePresence>
        {phase === 'victory' && (
          <motion.div
            className="absolute bottom-24 left-0 right-0 text-center z-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <p className="text-sm sm:text-base italic tracking-wide px-8"
              style={{ color: '#D4AF37', textShadow: '0 0 20px rgba(212,175,55,0.3)' }}>
              "{quote}"
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skip button */}
      <motion.button
        className="absolute bottom-20 right-4 z-30 text-[10px] tracking-widest uppercase text-white/30 hover:text-white/60 transition-colors"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        onClick={onComplete}
      >
        SKIP →
      </motion.button>
    </motion.div>
  );
}