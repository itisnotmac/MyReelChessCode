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
  cosmic: {
    id: 'cosmic', name: 'Cosmic',
    light: 'rgba(30,20,60,0.55)', dark: 'rgba(10,5,25,0.75)',
    border: 'rgba(157,78,221,0.4)', glow: 'rgba(157,78,221,0.2)',
    coords: 'rgba(157,78,221,0.6)',
    animation: { type: 'stars', color: '#9D4EDD' },
    animated: true, price: 400,
  },
  lava: {
    id: 'lava', name: 'Lava',
    light: 'rgba(80,20,0,0.55)', dark: 'rgba(30,5,0,0.75)',
    border: 'rgba(255,107,53,0.4)', glow: 'rgba(255,107,53,0.2)',
    coords: 'rgba(255,107,53,0.6)',
    animation: { type: 'lava', color: '#FF6B35' },
    animated: true, price: 400,
  },
  ocean: {
    id: 'ocean', name: 'Ocean',
    light: 'rgba(0,40,80,0.5)', dark: 'rgba(0,15,40,0.7)',
    border: 'rgba(126,200,227,0.4)', glow: 'rgba(126,200,227,0.2)',
    coords: 'rgba(126,200,227,0.6)',
    animation: { type: 'waves', color: '#7EC8E3' },
    animated: true, price: 400,
  },
  neonGrid: {
    id: 'neonGrid', name: 'Neon Grid',
    light: 'rgba(0,30,30,0.4)', dark: 'rgba(0,10,10,0.6)',
    border: 'rgba(58,175,169,0.5)', glow: 'rgba(58,175,169,0.3)',
    coords: 'rgba(58,175,169,0.7)',
    animation: { type: 'pulse', color: '#3AAFA9' },
    animated: true, price: 400,
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
  { id: 'glow_crimson', name: 'Crimson',  color: '#DC143C', price: 200 },
  { id: 'glow_cyan',    name: 'Cyan',     color: '#00FFFF', price: 200 },
  { id: 'glow_lime',    name: 'Lime',     color: '#32CD32', price: 200 },
  { id: 'glow_orange',  name: 'Orange',   color: '#FF8C00', price: 200 },
];

export const MOVE_TRAIL_COLORS = [
  { id: 'trail_teal',    name: 'Teal',     color: '#3AAFA9', price: 200 },
  { id: 'trail_gold',    name: 'Gold',     color: '#FFD700', price: 200 },
  { id: 'trail_pink',    name: 'Hot Pink', color: '#FF1493', price: 200 },
  { id: 'trail_purple',  name: 'Purple',   color: '#9D4EDD', price: 200 },
  { id: 'trail_crimson', name: 'Crimson',  color: '#DC143C', price: 200 },
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

export const PARTICLE_EFFECTS = [
  { id: 'fx_sparkle',   name: 'Sparkle',   color: '#FFD700', style: 'sparkle',   price: 300 },
  { id: 'fx_ember',     name: 'Ember',     color: '#FF6B35', style: 'ember',     price: 300 },
  { id: 'fx_frost',     name: 'Frost',     color: '#7EC8E3', style: 'frost',     price: 300 },
  { id: 'fx_toxic',     name: 'Toxic',     color: '#7FFF00', style: 'toxic',     price: 300 },
  { id: 'fx_cosmic',    name: 'Cosmic',    color: '#9D4EDD', style: 'cosmic',    price: 300 },
  { id: 'fx_lightning', name: 'Lightning', color: '#FFFF00', style: 'lightning', price: 300 },
];

export const BOARD_BORDERS = [
  { id: 'border_neon',    name: 'Neon Teal',    color: '#3AAFA9', style: 'glow',   price: 250 },
  { id: 'border_gold',   name: 'Gold Trim',    color: '#FFD700', style: 'solid',  price: 250 },
  { id: 'border_crimson', name: 'Crimson Edge', color: '#DC143C', style: 'solid',  price: 250 },
  { id: 'border_purple',  name: 'Royal Purple', color: '#9D4EDD', style: 'glow',   price: 250 },
  { id: 'border_ice',     name: 'Ice Blue',     color: '#7EC8E3', style: 'glow',   price: 250 },
  { id: 'border_emerald', name: 'Emerald Vine', color: '#32CD32', style: 'glow',   price: 250 },
];

export const AVATAR_FRAMES = [
  { id: 'frame_teal',    name: 'Teal Circle',    color: '#3AAFA9', style: 'ring',    price: 250 },
  { id: 'frame_gold',    name: 'Gold Crown',    color: '#FFD700', style: 'crown',   price: 250 },
  { id: 'frame_crimson', name: 'Crimson Spike',  color: '#DC143C', style: 'spike',   price: 250 },
  { id: 'frame_purple',  name: 'Purple Mist',    color: '#9D4EDD', style: 'mist',    price: 250 },
  { id: 'frame_ice',     name: 'Ice Crystal',    color: '#7EC8E3', style: 'crystal', price: 250 },
  { id: 'frame_emerald', name: 'Emerald Leaf',   color: '#32CD32', style: 'leaf',    price: 250 },
];

export const AMBIENT_EFFECTS = [
  { id: 'amb_embers',    name: 'Floating Embers', color: '#FF6B35', style: 'embers',    price: 350 },
  { id: 'amb_snow',      name: 'Snowfall',        color: '#FFFFFF', style: 'snow',      price: 350 },
  { id: 'amb_aurora',    name: 'Aurora',          color: '#3AAFA9', style: 'aurora',    price: 350 },
  { id: 'amb_stardust',  name: 'Stardust',        color: '#9D4EDD', style: 'stardust',  price: 350 },
  { id: 'amb_rain',      name: 'Raindrops',       color: '#7EC8E3', style: 'rain',      price: 350 },
  { id: 'amb_fireflies', name: 'Fireflies',       color: '#FFD700', style: 'fireflies', price: 350 },
];

export const STORE_ITEMS = [
  ...Object.values(BOARD_SKINS).map(s => ({ ...s, category: 'board', price: s.price || 0 })),
  ...Object.values(PIECE_SETS).map(s => ({ ...s, category: 'pieces', price: 0 })),
  ...USERNAME_GLOW_COLORS.map(s => ({ ...s, category: 'username_glow' })),
  ...MOVE_TRAIL_COLORS.map(s => ({ ...s, category: 'move_trail' })),
  ...GRANDMASTER_AVATARS.map(s => ({ ...s, category: 'avatar' })),
  ...PARTICLE_EFFECTS.map(s => ({ ...s, category: 'particle_effect' })),
  ...BOARD_BORDERS.map(s => ({ ...s, category: 'board_border' })),
  ...AVATAR_FRAMES.map(s => ({ ...s, category: 'avatar_frame' })),
  ...AMBIENT_EFFECTS.map(s => ({ ...s, category: 'ambient_effect' })),
];