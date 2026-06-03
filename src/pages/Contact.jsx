import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail } from 'lucide-react';

export default function Contact() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 px-5 pt-6 pb-4 border-b border-[#3AAFA9]/10">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-[#3AAFA9] hover:bg-[#3AAFA9]/15 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="text-xs tracking-[0.3em] uppercase text-[#3AAFA9]/60 font-medium">Reel Chess</span>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-2xl mx-auto px-6 py-10 w-full">
        <h1 className="text-3xl font-black tracking-[0.15em] uppercase mb-2"
          style={{
            backgroundImage: 'linear-gradient(135deg, #3AAFA9 0%, #A8E6E3 60%, #3AAFA9 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 14px rgba(58,175,169,0.3))',
          }}
        >
          Contact Us
        </h1>
        <p className="text-[#3AAFA9]/40 text-xs tracking-widest uppercase mb-10">We'd love to hear from you</p>

        {/* Email card */}
        <a
          href="mailto:reelchessgame@gmail.com"
          className="flex items-center gap-5 px-6 py-5 rounded-2xl border border-[#3AAFA9]/20 bg-[#3AAFA9]/5 hover:bg-[#3AAFA9]/10 hover:border-[#3AAFA9]/40 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #3AAFA9, #1a6e6b)' }}>
            <Mail className="w-5 h-5 text-[#0a0a0f]" />
          </div>
          <div>
            <p className="text-xs tracking-widest uppercase text-[#3AAFA9]/50 mb-1">Email</p>
            <p className="text-white font-semibold text-sm group-hover:text-[#3AAFA9] transition-colors">
              reelchessgame@gmail.com
            </p>
          </div>
        </a>

        <p className="mt-6 text-white/30 text-xs leading-relaxed">
          Have a bug to report, a feature request, or just want to say hi? Send us an email and we'll
          get back to you as soon as possible.
        </p>

        {/* Footer links */}
        <div className="mt-10 pt-6 border-t border-[#3AAFA9]/10 flex gap-6">
          <button
            onClick={() => navigate('/About')}
            className="text-xs tracking-widest uppercase text-[#3AAFA9]/60 hover:text-[#3AAFA9] transition-colors"
          >
            About
          </button>
          <button
            onClick={() => navigate('/')}
            className="text-xs tracking-widest uppercase text-[#3AAFA9]/60 hover:text-[#3AAFA9] transition-colors"
          >
            Play Now
          </button>
        </div>
      </div>
    </div>
  );
}