import React from 'react';

// Frosted-glass avatar tile: a translucent gradient with backdrop blur and a
// glowing chess unicode piece centered. Reused by the avatar preview and both
// preset pickers (Profile + Onboarding) so the look stays consistent.
export default function FrostedPieceTile({ preset, size = 'md' }) {
  const fontSize = size === 'lg' ? '2.6rem' : size === 'sm' ? '1.4rem' : '1.9rem';
  return (
    <div
      className="w-full h-full flex items-center justify-center relative overflow-hidden"
      style={{
        background: preset.bg,
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      {/* inner sheen / edge light */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow:
            'inset 0 1px 0 rgba(255,255,255,0.20), inset 0 0 0 1px rgba(255,255,255,0.05)',
        }}
      />
      <span
        style={{
          color: preset.fg,
          fontSize,
          lineHeight: 1,
          position: 'relative',
          filter: `drop-shadow(0 0 8px ${preset.fg}cc) drop-shadow(0 0 2px ${preset.fg})`,
        }}
      >
        {preset.char}
      </span>
    </div>
  );
}