import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Send, Swords } from 'lucide-react';
import ChatMessageBubble from './ChatMessageBubble';

export default function ChatRoom({ roomId = 'global', user }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const msgs = await base44.entities.ChatMessage.filter({ room_id: roomId }, '-created_date', 100);
        setMessages(msgs.reverse());
      } catch (e) {
        console.error('Failed to load messages:', e);
      } finally {
        setLoading(false);
      }
    };
    loadMessages();

    const unsubscribe = base44.entities.ChatMessage.subscribe((event) => {
      if (event.type === 'create' && event.data.room_id === roomId) {
        setMessages(prev => {
          if (prev.some(m => m.id === event.data.id)) return prev;
          return [...prev, event.data];
        });
      }
    });
    return () => unsubscribe();
  }, [roomId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (type = 'text') => {
    if (type === 'text' && !input.trim()) return;
    if (sending) return;
    setSending(true);
    try {
      await base44.entities.ChatMessage.create({
        sender_id: user.id,
        sender_name: user.full_name || user.email,
        room_id: roomId,
        message: type === 'challenge' ? 'is looking for a game!' : input.trim(),
        message_type: type,
      });
      setInput('');
    } catch (e) {
      console.error('Failed to send message:', e);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 px-1 pb-4 min-h-0">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-6 h-6 border-2 border-[#3AAFA9]/30 border-t-[#3AAFA9] rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <p className="text-white/30 text-sm">No messages yet. Say hello! 👋</p>
          </div>
        ) : (
          messages.map(msg => (
            <ChatMessageBubble key={msg.id} message={msg} isMine={msg.sender_id === user.id} />
          ))
        )}
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 pt-3 border-t border-[#3AAFA9]/10">
        <button
          onClick={() => sendMessage('challenge')}
          disabled={sending}
          className="shrink-0 w-11 h-11 rounded-full bg-[#3AAFA9]/15 border border-[#3AAFA9]/40 flex items-center justify-center text-[#3AAFA9] hover:bg-[#3AAFA9]/25 active:scale-95 transition-all disabled:opacity-50"
          title="Send a game challenge"
        >
          <Swords className="w-5 h-5" />
        </button>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !sending) sendMessage('text'); }}
          placeholder="Type a message..."
          className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#3AAFA9]/50"
        />
        <button
          onClick={() => sendMessage('text')}
          disabled={sending || !input.trim()}
          className="shrink-0 w-11 h-11 rounded-full bg-[#3AAFA9] flex items-center justify-center text-[#0a0a0f] hover:bg-[#3AAFA9]/90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}