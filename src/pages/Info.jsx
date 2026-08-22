import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Settings } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import ThemePicker from '@/components/ThemePicker';
import { base44 } from '@/api/base44Client';

export default function InfoPage() {
  const navigate = useNavigate();

  const [soundEnabled, setSoundEnabled] = useState(() => localStorage.getItem('chessSound') !== 'off');
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    localStorage.setItem('chessSound', next ? 'on' : 'off');
    base44.functions.invoke('logActivity', { type: 'settings', label: `Sound: ${next ? 'On' : 'Off'}` }).catch(() => {});
  };

  const [coordsEnabled, setCoordsEnabled] = useState(() => localStorage.getItem('chessCoords') !== 'off');
  const toggleCoords = () => {
    const next = !coordsEnabled;
    setCoordsEnabled(next);
    localStorage.setItem('chessCoords', next ? 'on' : 'off');
    base44.functions.invoke('logActivity', { type: 'settings', label: `Coords: ${next ? 'On' : 'Off'}` }).catch(() => {});
  };

  const [lastMoveEnabled, setLastMoveEnabled] = useState(() => localStorage.getItem('chessLastMove') !== 'off');
  const toggleLastMove = () => {
    const next = !lastMoveEnabled;
    setLastMoveEnabled(next);
    localStorage.setItem('chessLastMove', next ? 'on' : 'off');
    base44.functions.invoke('logActivity', { type: 'settings', label: `LastMove: ${next ? 'On' : 'Off'}` }).catch(() => {});
  };

  const [moveAnimEnabled, setMoveAnimEnabled] = useState(() => localStorage.getItem('chessMoveAnim') !== 'off');
  const toggleMoveAnim = () => {
    const next = !moveAnimEnabled;
    setMoveAnimEnabled(next);
    localStorage.setItem('chessMoveAnim', next ? 'on' : 'off');
    base44.functions.invoke('logActivity', { type: 'settings', label: `MoveAnim: ${next ? 'On' : 'Off'}` }).catch(() => {});
  };

  const [hapticsEnabled, setHapticsEnabled] = useState(() => localStorage.getItem('chessHaptics') !== 'off');
  const toggleHaptics = () => {
    const next = !hapticsEnabled;
    setHapticsEnabled(next);
    localStorage.setItem('chessHaptics', next ? 'on' : 'off');
    base44.functions.invoke('logActivity', { type: 'settings', label: `Haptics: ${next ? 'On' : 'Off'}` }).catch(() => {});
  };

  const [pingEnabled, setPingEnabled] = useState(() => localStorage.getItem('chessPingIndicator') !== 'off');
  const togglePing = () => {
    const next = !pingEnabled;
    setPingEnabled(next);
    localStorage.setItem('chessPingIndicator', next ? 'on' : 'off');
    base44.functions.invoke('logActivity', { type: 'settings', label: `Ping: ${next ? 'On' : 'Off'}` }).catch(() => {});
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative">
      {/* Cinematic backdrop — command sanctum */}
      <div className="absolute inset-0 z-0">
        <img src="https://media.base44.com/images/public/69ab30c24c8c7db2b8432adf/98ae19c90_generated_image.png" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(120% 80% at 50% 12%, rgba(10,10,15,0.18) 0%, rgba(10,10,15,0.5) 60%, rgba(10,10,15,0.82) 100%)' }} />
      </div>

      {/* Header */}
      <div
        className="relative z-10 flex items-center gap-3 px-5 pb-8"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 24px)' }}>
        <button
          onClick={() => navigate(createPageUrl('Lobby'))}
          className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-[#D4AF37]" />
          <h1 className="text-lg font-bold tracking-wider text-white">Settings</h1>
        </div>
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 px-5 pb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}>
        <div className="space-y-6">
          <ThemePicker />
          <div className="rounded-xl bg-[#3AAFA9]/10 border border-[#3AAFA9]/30 p-4 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-medium">Sound Effects</p>
                <p className="text-white/30 text-xs mt-0.5">Move sounds, check alerts, and game events</p>
              </div>
              <Switch checked={soundEnabled} onCheckedChange={toggleSound} className="data-[state=checked]:bg-[#3AAFA9]" />
            </div>
            <div className="h-px bg-white/5" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-medium">Battle Cutscenes</p>
                <p className="text-white/30 text-xs mt-0.5">Show cinematic battles on capture</p>
              </div>
              <Switch defaultChecked className="data-[state=checked]:bg-[#3AAFA9]" />
            </div>
            <div className="h-px bg-white/5" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-medium">Board Flip</p>
                <p className="text-white/30 text-xs mt-0.5">Rotate board for Player 2 in local mode</p>
              </div>
              <Switch defaultChecked className="data-[state=checked]:bg-[#3AAFA9]" />
            </div>
            <div className="h-px bg-white/5" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-medium">Move Hints</p>
                <p className="text-white/30 text-xs mt-0.5">Show legal move indicators</p>
              </div>
              <Switch defaultChecked className="data-[state=checked]:bg-[#3AAFA9]" />
            </div>
            <div className="h-px bg-white/5" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-medium">Rank &amp; File Labels</p>
                <p className="text-white/30 text-xs mt-0.5">Show a–h / 1–8 coordinates on the board edges</p>
              </div>
              <Switch checked={coordsEnabled} onCheckedChange={toggleCoords} className="data-[state=checked]:bg-[#3AAFA9]" />
            </div>
            <div className="h-px bg-white/5" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-medium">Last Move Highlight</p>
                <p className="text-white/30 text-xs mt-0.5">Glow the previous move's from and to squares</p>
              </div>
              <Switch checked={lastMoveEnabled} onCheckedChange={toggleLastMove} className="data-[state=checked]:bg-[#3AAFA9]" />
            </div>
            <div className="h-px bg-white/5" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-medium">Move Animation</p>
                <p className="text-white/30 text-xs mt-0.5">Slide pieces smoothly to their destination</p>
              </div>
              <Switch checked={moveAnimEnabled} onCheckedChange={toggleMoveAnim} className="data-[state=checked]:bg-[#3AAFA9]" />
            </div>
            <div className="h-px bg-white/5" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-medium">Haptic Feedback</p>
                <p className="text-white/30 text-xs mt-0.5">Vibrate on captures and check alerts (mobile)</p>
              </div>
              <Switch checked={hapticsEnabled} onCheckedChange={toggleHaptics} className="data-[state=checked]:bg-[#3AAFA9]" />
            </div>
          </div>

          {/* Stuff for Nerds */}
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#3AAFA9]/50 font-medium mb-2 px-1">Stuff for Nerds</p>
            <div className="rounded-xl bg-white/5 border border-white/10 p-4 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-medium">Network Ping Indicator</p>
                  <p className="text-white/30 text-xs mt-0.5">Show live latency badge in the lobby corner</p>
                </div>
                <Switch checked={pingEnabled} onCheckedChange={togglePing} className="data-[state=checked]:bg-[#3AAFA9]" />
              </div>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}