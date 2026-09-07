import React from 'react';

export default function GlowingUsername({ children, glow = '', className = '', align = 'left' }) {
  const glowStyle = glow
    ? { color: glow, textShadow: `0 0 5px ${glow}, 0 0 12px ${glow}, 0 0 22px ${glow}99` }
    : undefined;

  return (
    <span
      className={`block truncate font-bold ${className}`}
      style={{ ...glowStyle, textAlign: align }}
      title={typeof children === 'string' ? children : undefined}
    >
      {children}
    </span>
  );
}
