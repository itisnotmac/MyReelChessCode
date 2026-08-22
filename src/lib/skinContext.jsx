import React, { createContext, useContext, useState, useEffect } from 'react';

const SkinContext = createContext({
  boardSkin: 'classic',
  pieceSet: 'classic',
  usernameGlow: '',
  moveTrailColor: '',
  setBoardSkin: () => {},
  setPieceSet: () => {},
  setUsernameGlow: () => {},
  setMoveTrailColor: () => {},
});

export function SkinProvider({ children }) {
  const [boardSkin, setBoardSkinState] = useState(() => localStorage.getItem('boardSkin') || 'classic');
  const [pieceSet, setPieceSetState] = useState(() => localStorage.getItem('pieceSet') || 'classic');
  const [usernameGlow, setUsernameGlowState] = useState(() => localStorage.getItem('usernameGlow') || '');
  const [moveTrailColor, setMoveTrailColorState] = useState(() => localStorage.getItem('moveTrailColor') || '');

  const setBoardSkin = (skin) => {
    localStorage.setItem('boardSkin', skin);
    setBoardSkinState(skin);
  };

  const setPieceSet = (set) => {
    localStorage.setItem('pieceSet', set);
    setPieceSetState(set);
  };

  const setUsernameGlow = (color) => {
    localStorage.setItem('usernameGlow', color);
    setUsernameGlowState(color);
  };

  const setMoveTrailColor = (color) => {
    localStorage.setItem('moveTrailColor', color);
    setMoveTrailColorState(color);
  };

  return (
    <SkinContext.Provider value={{ boardSkin, pieceSet, usernameGlow, moveTrailColor, setBoardSkin, setPieceSet, setUsernameGlow, setMoveTrailColor }}>
      {children}
    </SkinContext.Provider>
  );
}

export function useSkin() {
  return useContext(SkinContext);
}