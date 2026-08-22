export const BOARD_SKINS = {
  classic: {
    id: 'classic', name: 'Classic',
    light: '#2e2e4e', dark: '#1a1a2e',
    border: 'rgba(58,175,169,0.25)', glow: 'rgba(58,175,169,0.15)',
    coords: 'rgba(58,175,169,0.5)',
  },
  wood: {
    id: 'wood', name: 'Wood',
    light: '#d4a76a', dark: '#8b5e3c',
    border: 'rgba(139,94,60,0.6)', glow: 'rgba(212,167,106,0.2)',
    coords: 'rgba(60,40,20,0.7)',
  },
  glass: {
    id: 'glass', name: 'Glass',
    light: 'rgba(200,240,255,0.22)', dark: 'rgba(100,180,200,0.12)',
    border: 'rgba(150,220,255,0.4)', glow: 'rgba(150,220,255,0.25)',
    coords: 'rgba(150,220,255,0.6)',
  },
  marble: {
    id: 'marble', name: 'Marble',
    light: '#e8e8e8', dark: '#2d5f3e',
    border: 'rgba(45,95,62,0.5)', glow: 'rgba(232,232,232,0.2)',
    coords: 'rgba(45,95,62,0.6)',
  },
  obsidian: {
    id: 'obsidian', name: 'Obsidian',
    light: '#2a2a3a', dark: '#0d0d15',
    border: 'rgba(138,43,226,0.3)', glow: 'rgba(138,43,226,0.2)',
    coords: 'rgba(168,85,247,0.5)',
  },
  emerald: {
    id: 'emerald', name: 'Emerald',
    light: '#2d6a4f', dark: '#1b3a2e',
    border: 'rgba(52,211,153,0.3)', glow: 'rgba(52,211,153,0.2)',
    coords: 'rgba(52,211,153,0.5)',
  },
};

export const PIECE_SETS = {
  classic:    { id: 'classic',    name: 'Classic',          description: 'Original neon-glow pieces' },
  minimalist: { id: 'minimalist', name: 'Minimalist',       description: 'Clean geometric shapes' },
  futuristic: { id: 'futuristic', name: 'Futuristic',      description: 'Angular neon design' },
  roman:      { id: 'roman',      name: 'Roman Soldiers',   description: 'Bronze imperial legion' },
  greek:      { id: 'greek',      name: 'Greek Soldiers',   description: 'Marble hoplite warriors' },
  modern:     { id: 'modern',     name: 'Modern Combat',    description: 'Tactical military units' },
};

export const USERNAME_GLOW_COLORS = [
  { id: 'glow_teal',    name: 'Teal',     color: '#3AAFA9', price: 200 },
  { id: 'glow_gold',    name: 'Gold',     color: '#FFD700', price: 200 },
  { id: 'glow_pink',    name: 'Hot Pink', color: '#FF1493', price: 200 },
  { id: 'glow_purple',  name: 'Purple',   color: '#9D4EDD', price: 200 },
  { id: 'glow_crimson', name: 'Crimson',  color: '#DC143C', price: 300 },
  { id: 'glow_cyan',    name: 'Cyan',     color: '#00FFFF', price: 200 },
  { id: 'glow_lime',    name: 'Lime',     color: '#32CD32', price: 200 },
  { id: 'glow_orange',  name: 'Orange',   color: '#FF8C00', price: 200 },
];

export const MOVE_TRAIL_COLORS = [
  { id: 'trail_teal',    name: 'Teal',     color: '#3AAFA9', price: 200 },
  { id: 'trail_gold',    name: 'Gold',     color: '#FFD700', price: 200 },
  { id: 'trail_pink',    name: 'Hot Pink', color: '#FF1493', price: 200 },
  { id: 'trail_purple',  name: 'Purple',   color: '#9D4EDD', price: 200 },
  { id: 'trail_crimson', name: 'Crimson',  color: '#DC143C', price: 300 },
  { id: 'trail_cyan',    name: 'Cyan',     color: '#00FFFF', price: 200 },
  { id: 'trail_lime',    name: 'Lime',     color: '#32CD32', price: 200 },
  { id: 'trail_orange',  name: 'Orange',   color: '#FF8C00', price: 200 },
];

export const GRANDMASTER_AVATARS = [
  { id: 'gm_alekhine',    name: 'Alekhine',    image: 'https://media.base44.com/images/public/69ab30c24c8c7db2b8432adf/02c16919b_Alekhine.jpg', price: 500 },
  { id: 'gm_fischer',     name: 'Fischer',     image: 'https://media.base44.com/images/public/69ab30c24c8c7db2b8432adf/326238419_bobbyfischer.jpg', price: 500 },
  { id: 'gm_capablanca',  name: 'Capablanca',  image: 'https://media.base44.com/images/public/69ab30c24c8c7db2b8432adf/71489e4cc_Capablanca.png', price: 500 },
  { id: 'gm_karpov',      name: 'Karpov',      image: 'https://media.base44.com/images/public/69ab30c24c8c7db2b8432adf/ff6f1a039_karpov.jpg', price: 500 },
  { id: 'gm_carlsen',     name: 'Carlsen',     image: 'https://media.base44.com/images/public/69ab30c24c8c7db2b8432adf/ffd2fbc25_magnuscarlsen.jpg', price: 500 },
  { id: 'gm_morphy',      name: 'Morphy',      image: 'https://media.base44.com/images/public/69ab30c24c8c7db2b8432adf/a9ef79a15_Morphy.png', price: 500 },
  { id: 'gm_nakamura',    name: 'Nakamura',    image: 'https://media.base44.com/images/public/69ab30c24c8c7db2b8432adf/8984503ad_Nakamura.jpg', price: 500 },
  { id: 'gm_pillsbury',   name: 'Pillsbury',   image: 'https://media.base44.com/images/public/69ab30c24c8c7db2b8432adf/1d0e42eac_pillsbury.jpg', price: 500 },
  { id: 'gm_timman',      name: 'Timman',      image: 'https://media.base44.com/images/public/69ab30c24c8c7db2b8432adf/849ec4fc8_timman.jpg', price: 500 },
];

export const STORE_ITEMS = [
  ...Object.values(BOARD_SKINS).map(s => ({ ...s, category: 'board', price: 0 })),
  ...Object.values(PIECE_SETS).map(s => ({ ...s, category: 'pieces', price: 0 })),
  ...USERNAME_GLOW_COLORS.map(s => ({ ...s, category: 'username_glow' })),
  ...MOVE_TRAIL_COLORS.map(s => ({ ...s, category: 'move_trail' })),
  ...GRANDMASTER_AVATARS.map(s => ({ ...s, category: 'avatar' })),
];