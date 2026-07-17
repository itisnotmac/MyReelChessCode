import React from 'react';
import { Moon, Sun, Contrast, Eye } from 'lucide-react';
import { useTheme } from '@/lib/themeContext';

const THEMES = [
  { id: 'dark', label: 'Dark', icon: Moon },
  { id: 'light', label: 'Light', icon: Sun },
  { id: 'high-contrast', label: 'High Contrast', icon: Contrast },
];

const CB_MODES = [
  { id: 'none', label: 'None', desc: 'Normal vision' },
  { id: 'deuteranopia', label: 'Deuteranopia', desc: 'Green-blind' },
  { id: 'protanopia', label: 'Protanopia', desc: 'Red-blind' },
  { id: 'tritanopia', label: 'Tritanopia', desc: 'Blue-blind' },
];

export default function ThemePicker() {
  const { theme, setTheme, colorBlind, setColorBlind } = useTheme();

  return (
    <div className="rounded-xl bg-[#3AAFA9]/10 border border-[#3AAFA9]/30 p-4 space-y-5">
      {/* Appearance Mode */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Sun className="w-4 h-4 text-[#3AAFA9]" />
          <p className="text-white text-sm font-medium">Appearance</p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {THEMES.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTheme(id)}
              className={`flex flex-col items-center gap-1.5 py-3 rounded-lg border backdrop-blur-md transition-all ${
                theme === id
                  ? 'border-[#3AAFA9] bg-[#3AAFA9]/25 text-white'
                  : 'border-white/15 bg-black/40 text-white/70 hover:text-white hover:bg-black/55'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="h-px bg-white/5" />

      {/* Color Blind Mode */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Eye className="w-4 h-4 text-[#3AAFA9]" />
          <p className="text-white text-sm font-medium">Color Blind Mode</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {CB_MODES.map(({ id, label, desc }) => (
            <button
              key={id}
              onClick={() => setColorBlind(id)}
              className={`flex flex-col items-center gap-0.5 py-2.5 rounded-lg border backdrop-blur-md transition-all ${
                colorBlind === id
                  ? 'border-[#3AAFA9] bg-[#3AAFA9]/25 text-white'
                  : 'border-white/15 bg-black/40 text-white/70 hover:text-white hover:bg-black/55'
              }`}
            >
              <span className="text-xs font-medium">{label}</span>
              {desc && <span className="text-[10px] opacity-60">{desc}</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}