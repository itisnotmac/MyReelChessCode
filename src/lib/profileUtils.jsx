import React from 'react';

const PROFILE_KEY = 'reelchess_profile';

export const PRESET_AVATARS = [
  { label: 'King',   char: '♔', image: 'https://media.base44.com/images/public/69ab30c24c8c7db2b8432adf/be7495e17_generated_image.png' },
  { label: 'Queen',  char: '♕', image: 'https://media.base44.com/images/public/69ab30c24c8c7db2b8432adf/31b617e5a_generated_image.png' },
  { label: 'Rook',   char: '♖', image: 'https://media.base44.com/images/public/69ab30c24c8c7db2b8432adf/00b8cb88c_generated_image.png' },
  { label: 'Bishop', char: '♗', image: 'https://media.base44.com/images/public/69ab30c24c8c7db2b8432adf/5e32f09b9_generated_image.png' },
  { label: 'Knight', char: '♘', image: 'https://media.base44.com/images/public/69ab30c24c8c7db2b8432adf/3a1042fa4_generated_image.png' },
  { label: 'Pawn',   char: '♙', image: 'https://media.base44.com/images/public/69ab30c24c8c7db2b8432adf/4c62e8ff8_generated_image.png' },
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
  return (
    <img src={preset.image} alt={preset.label} className="w-full h-full object-cover rounded-full" />
  );
}