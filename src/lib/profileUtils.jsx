import React from 'react';
import FrostedAvatarImage from '@/components/FrostedAvatarImage';

const PROFILE_KEY = 'reelchess_profile';

// Preset avatars: AI-rendered crystal chess pieces with a teal glow + frost overlay.
export const PRESET_AVATARS = [
  { label: 'King',   char: '♔', image: 'https://media.base44.com/images/public/69ab30c24c8c7db2b8432adf/4ec93d6eb_generated_image.png' },
  { label: 'Queen',  char: '♕', image: 'https://media.base44.com/images/public/69ab30c24c8c7db2b8432adf/adbaa2538_generated_image.png' },
  { label: 'Rook',   char: '♖', image: 'https://media.base44.com/images/public/69ab30c24c8c7db2b8432adf/e44ddc9ea_generated_image.png' },
  { label: 'Bishop', char: '♗', image: 'https://media.base44.com/images/public/69ab30c24c8c7db2b8432adf/712dc68a1_generated_image.png' },
  { label: 'Knight', char: '♘', image: 'https://media.base44.com/images/public/69ab30c24c8c7db2b8432adf/3ffa66ff3_generated_image.png' },
  { label: 'Pawn',   char: '♙', image: 'https://media.base44.com/images/public/69ab30c24c8c7db2b8432adf/ae22eb8b3_generated_image.png' },
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
  return <FrostedAvatarImage preset={preset} />;
}