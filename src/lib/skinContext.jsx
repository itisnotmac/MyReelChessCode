import React, { createContext, useContext, useState, useEffect } from 'react';

const SkinContext = createContext({
  boardSkin: 'classic',
  pieceSet: 'classic',
  usernameGlow: '',
  moveTrailColor: '',
  boardBorder: '',
  particleEffect: '',
  avatarFrame: '',
  ambientEffect: '',
  setBoardSkin: () => {},
  setPieceSet: () => {},
  setUsernameGlow: () => {},
  setMoveTrailColor: () => {},
  setBoardBorder: () => {},
  setParticleEffect: () => {},
  setAvatarFrame: () => {},
  setAmbientEffect: () => {},
});

export function SkinProvider({ children }) {
  const [boardSkin, setBoardSkinState] = useState(() => localStorage.getItem('boardSkin') || 'classic');
  const [pieceSet, setPieceSetState] = useState(() => localStorage.getItem('pieceSet') || 'classic');
  const [usernameGlow, setUsernameGlowState] = useState(() => localStorage.getItem('usernameGlow') || '');
  const [moveTrailColor, setMoveTrailColorState] = useState(() => localStorage.getItem('moveTrailColor') || '');
  const [boardBorder, setBoardBorderState] = useState(() => localStorage.getItem('boardBorder') || '');
  const [particleEffect, setParticleEffectState] = useState(() => localStorage.getItem('particleEffect') || '');
  const [avatarFrame, setAvatarFrameState] = useState(() => localStorage.getItem('avatarFrame') || '');
  const [ambientEffect, setAmbientEffectState] = useState(() => localStorage.getItem('ambientEffect') || '');

  const setBoardSkin = (skin) => { localStorage.setItem('boardSkin', skin); setBoardSkinState(skin); };
  const setPieceSet = (set) => { localStorage.setItem('pieceSet', set); setPieceSetState(set); };
  const setUsernameGlow = (color) => { localStorage.setItem('usernameGlow', color); setUsernameGlowState(color); };
  const setMoveTrailColor = (color) => { localStorage.setItem('moveTrailColor', color); setMoveTrailColorState(color); };
  const setBoardBorder = (id) => { localStorage.setItem('boardBorder', id); setBoardBorderState(id); };
  const setParticleEffect = (id) => { localStorage.setItem('particleEffect', id); setParticleEffectState(id); };
  const setAvatarFrame = (id) => { localStorage.setItem('avatarFrame', id); setAvatarFrameState(id); };
  const setAmbientEffect = (id) => { localStorage.setItem('ambientEffect', id); setAmbientEffectState(id); };

  return (
    <SkinContext.Provider value={{ boardSkin, pieceSet, usernameGlow, moveTrailColor, boardBorder, particleEffect, avatarFrame, ambientEffect, setBoardSkin, setPieceSet, setUsernameGlow, setMoveTrailColor, setBoardBorder, setParticleEffect, setAvatarFrame, setAmbientEffect }}>
      {children}
    </SkinContext.Provider>
  );
}

export function useSkin() {
  return useContext(SkinContext);
}