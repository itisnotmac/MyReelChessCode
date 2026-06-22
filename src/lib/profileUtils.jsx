import React from 'react';

const PROFILE_KEY = 'reelchess_profile';

export const PRESET_AVATARS = [
  { label: 'White King',   char: '♔', bg: '#f5f0e8', fg: '#1a1a2e' },
  { label: 'Black King',   char: '♚', bg: '#1a1a2e', fg: '#f5f0e8' },
  { label: 'White Queen',  char: '♕', bg: '#d4af37', fg: '#1a1a2e' },
  { label: 'Black Queen',  char: '♛', bg: '#1a3a3a', fg: '#3aafa9' },
  { label: 'White Knight', char: '♘', bg: '#3aafa9', fg: '#0a0a0f' },
  { label: 'Black Knight', char: '♞', bg: '#0a0a0f', fg: '#3aafa9' },
  { label: 'White Rook',   char: '♖', bg: '#9b59b6', fg: '#f5f0e8' },
  { label: 'Black Rook',   char: '♜', bg: '#2e2e4e', fg: '#d4af37' },
  { label: 'White Bishop', char: '♗', bg: '#e67e22', fg: '#1a1a2e' },
  { label: 'Black Bishop', char: '♝', bg: '#1a1a2e', fg: '#e67e22' },
  { label: 'White Pawn',   char: '♙', bg: '#f5f0e8', fg: '#3aafa9' },
  { label: 'Black Pawn',   char: '♟', bg: '#0a0a0f', fg: '#d4af37' },
];

export function getLocalProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setLocalProfile(profile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function hasProfile() {
  const p = getLocalProfile();
  return !!(p && p.username);
}

export function renderAvatarContent(avatarUrl) {
  const isPreset = avatarUrl?.startsWith('preset:');
  const presetChar = isPreset ? avatarUrl.slice(7) : null;
  const activePreset = presetChar ? PRESET_AVATARS.find(p => p.char === presetChar) : null;

  if (avatarUrl && !isPreset) {
    return <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover rounded-full" />;
  }
  const preset = activePreset || PRESET_AVATARS[0];
  return (
    <div className="w-full h-full rounded-full flex items-center justify-center" style={{ background: preset.bg }}>
      <span style={{ color: preset.fg, fontSize: '3rem' }}>{preset.char}</span>
    </div>
  );
}