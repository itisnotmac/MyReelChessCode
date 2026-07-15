import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swords } from 'lucide-react';

export default function ChatMessageBubble({ message, isMine }) {
  const navigate = useNavigate();
  const time = new Date(message.created_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const isChallenge = message.message_type === 'challenge';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
        isMine
          ? 'bg-[#3AAFA9]/20 border border-[#3AAFA9]/40'
          : 'bg-white/5 border border-white/10'
      }`}>
        {!isMine && (
          <p className="text-xs font-bold text-[#3AAFA9] mb-1">{message.sender_name}</p>
        )}
        {isChallenge ? (
          <div>
            <div className="flex items-center gap-2 text-sm text-white">
              <Swords className="w-4 h-4 text-[#3AAFA9] shrink-0" />
              <span>is looking for a game!</span>
            </div>
            <button
              onClick={() => navigate('/OnlineGame')}
              className="mt-2 w-full py-1.5 rounded-lg bg-[#3AAFA9]/30 border border-[#3AAFA9]/50 text-[#3AAFA9] text-xs font-bold tracking-wider uppercase hover:bg-[#3AAFA9]/40 transition-colors"
            >
              Join Game
            </button>
          </div>
        ) : (
          <p className="text-sm text-white/90 break-words whitespace-pre-wrap">{message.message}</p>
        )}
        <p className={`text-[10px] mt-1 ${isMine ? 'text-[#3AAFA9]/40 text-right' : 'text-white/30'}`}>{time}</p>
      </div>
    </motion.div>
  );
}