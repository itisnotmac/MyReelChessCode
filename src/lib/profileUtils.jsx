import React from 'react';
import FrostedPieceTile from '@/components/FrostedPieceTile';

const PROFILE_KEY = 'reelchess_profile';

// Preset avatars: frosted-glass gradient (bg) + glowing piece color (fg).
export const PRESET_AVATARS = [
  { label: 'King',   char: '♔', bg: 'linear-gradient(135deg, rgba(255,209,102,0.28), rgba(255,209,102,0.04))', fg: '#FFD166' },
  { label: 'Queen',  char: '♕', bg: 'linear-gradient(135deg, rgba(210,200,255,0.26), rgba(210,200,255,0.04))', fg: '#D8D0FF' },
  { label: 'Rook',   char: '♖', bg: 'linear-gradient(135deg, rgba(148,184,214,0.26), rgba(148,184,214,0.04))', fg: '#AFCBE8' },
  { label: 'Bishop', char: '♗', bg: 'linear-gradient(135deg, rgba(58,175,169,0.32), rgba(58,175,169,0.05))',  fg: '#3AAFA9' },
  { label: 'Knight', char: '♘', bg: 'linear-gradient(135deg, rgba(177,130,255,0.28), rgba(177,130,255,0.04))', fg: '#C9A6FF' },
  { label: 'Pawn',   char: '♙', bg: 'linear-gradient(135deg, rgba(214,158,90,0.28), rgba(214,158,90,0.04))',  fg: '#E8B07A' },
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
  if (avatarUrl && !avatarUrl.startsWith('preset:')) {
    return <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover rounded-full" />;
  }
  const presetChar = avatarUrl?.startsWith('preset:') ? avatarUrl.slice(7) : null;
  const preset = PRESET_AVATARS.find(p => p.char === presetChar) || PRESET_AVATARS[0];
  return <FrostedPieceTile preset={preset} size="lg" />;
}