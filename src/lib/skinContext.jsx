import React, { createContext, useContext, useState, useEffect } from 'react';

const SkinContext = createContext({
  boardSkin: 'classic',
  pieceSet: 'classic',
  setBoardSkin: () => {},
  setPieceSet: () => {},
});

export function SkinProvider({ children }) {
  const [boardSkin, setBoardSkinState] = useState(() => localStorage.getItem('boardSkin') || 'classic');
  const [pieceSet, setPieceSetState] = useState(() => localStorage.getItem('pieceSet') || 'classic');

  const setBoardSkin = (skin) => {
    localStorage.setItem('boardSkin', skin);
    setBoardSkinState(skin);
  };

  const setPieceSet = (set) => {
    localStorage.setItem('pieceSet', set);
    setPieceSetState(set);
  };

  return (
    <SkinContext.Provider value={{ boardSkin, pieceSet, setBoardSkin, setPieceSet }}>
      {children}
    </SkinContext.Provider>
  );
}

export function useSkin() {
  return useContext(SkinContext);
}