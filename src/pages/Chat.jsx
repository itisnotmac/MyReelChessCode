import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import ChatRoom from '@/components/chat/ChatRoom';

export default function Chat() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col relative">
      {/* Cinematic backdrop — teal-cracks obsidian throne hall */}
      <div className="absolute inset-0 z-0">
        <img src="https://media.base44.com/images/public/69ab30c24c8c7db2b8432adf/c75d09be6_generated_image.png" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(120% 80% at 50% 12%, rgba(10,10,15,0.18) 0%, rgba(10,10,15,0.5) 60%, rgba(10,10,15,0.82) 100%)' }} />
      </div>

      {/* Header */}
      <div
        className="relative z-10 flex items-center gap-3 px-5 pb-4 shrink-0"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 24px)' }}>
        <button
          onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/'))}
          className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg font-bold tracking-wider text-white">Community Chat</h1>
          <p className="text-xs text-[#3AAFA9]/50">Global lobby</p>
        </div>
      </div>

      {/* Chat */}
      <div className="relative z-10 flex-1 px-5 pb-4 flex flex-col min-h-0">
        {user ? (
          <ChatRoom roomId="global" user={user} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="w-6 h-6 border-2 border-[#3AAFA9]/30 border-t-[#3AAFA9] rounded-full animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}