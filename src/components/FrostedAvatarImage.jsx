import React from 'react';

// Renders a crystal chess-piece avatar image with a frosted glass overlay
// (sheen + teal inner glow) so the frost/teal-glow read is consistent on the
// small picker tiles as well as the large circular preview.
export default function FrostedAvatarImage({ preset }) {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <img src={preset.image} alt={preset.label} className="w-full h-full object-cover" />
      {/* frosted glass sheen */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(150deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.05) 35%, transparent 60%)',
        }}
      />
      {/* teal glow + frosted edge */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow:
            'inset 0 0 16px rgba(58,175,169,0.30), inset 0 0 0 1px rgba(255,255,255,0.14)',
        }}
      />
    </div>
  );
}