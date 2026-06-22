import React, { createContext, useContext, useState, useEffect } from 'react';

const THEME_KEY = 'reelchess_theme';
const CB_KEY = 'reelchess_color_blind';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem(THEME_KEY) || 'dark'; } catch { return 'dark'; }
  });
  const [colorBlind, setColorBlind] = useState(() => {
    try { return localStorage.getItem(CB_KEY) || 'none'; } catch { return 'none'; }
  });

  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove('theme-dark', 'theme-light', 'theme-high-contrast');
    html.classList.add(`theme-${theme}`);
    html.classList.remove('cb-none', 'cb-deuteranopia', 'cb-protanopia', 'cb-tritanopia');
    html.classList.add(`cb-${colorBlind}`);
    try {
      localStorage.setItem(THEME_KEY, theme);
      localStorage.setItem(CB_KEY, colorBlind);
    } catch {}
  }, [theme, colorBlind]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, colorBlind, setColorBlind }}>
      {children}
      <svg style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
        <defs>
          <filter id="cb-deuteranopia">
            <feColorMatrix type="matrix" values="
              1.0  0    0    0  0
              0    0.7  0.3  0  0
              0    0.3  0.7  0  0
              0    0    0    1  0
            "/>
          </filter>
          <filter id="cb-protanopia">
            <feColorMatrix type="matrix" values="
              0.7  0.3  0    0  0
              0.3  0.7  0    0  0
              0    0    1    0  0
              0    0    0    1  0
            "/>
          </filter>
          <filter id="cb-tritanopia">
            <feColorMatrix type="matrix" values="
              0.7  0    0.3  0  0
              0    1    0    0  0
              0.3  0    0.7  0  0
              0    0    0    1  0
            "/>
          </filter>
        </defs>
      </svg>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}