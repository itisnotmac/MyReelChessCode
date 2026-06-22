import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User as UserIcon, Camera, Check, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const PRESET_AVATARS = [
  { label: 'White King',   char: '♔', bg: '#f5f0e8', fg: '#1a1a2e' },
  { label: 'Black King',   char: '♚', bg: '#1a1a2e', fg: '#f5f0e8' },
  { label: 'White Queen',  char: '♕', bg: '#d4af37', fg: '#1a1a2e' },
  { label: 'Black Queen',  char: '♛', bg: '#1a3a3a', fg: '#3aafa9' },
  { label: 'White Knight', char: '♘', bg: '#3aafa9', fg: '#0a0a0f' },
  { label: 'Black Knight', char: '♞', bg: '#0a0a0f', fg: '#3aafa9' },
  { label: 'White Rook',   char: '♖', bg: '#9b59b6', fg: '#f5f0e8' },
  { label: 'Black Rook',   char: '♜', bg: '#2e2e4e', fg: '#d4af37' },
  { label: 'White Bishop', char: '♗', bg: '#e67e22', fg: '#1a1a2e' },
  { label: 'Black Bishop', char: '♝', bg: '#1a1a2e', fg: '#e67e22' },
  { label: 'White Pawn',  char: '♙', bg: '#f5f0e8', fg: '#3aafa9' },
  { label: 'Black Pawn',  char: '♟', bg: '#0a0a0f', fg: '#d4af37' },
];

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      setUsername(u?.username || '');
      setAvatarUrl(u?.avatar_url || '');
    }).finally(() => setLoading(false));
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setAvatarUrl(file_url);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await base44.auth.updateMe({ username, avatar_url: avatarUrl });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const isPreset = avatarUrl?.startsWith('preset:');
  const presetChar = isPreset ? avatarUrl.slice(7) : null;
  const activePreset = presetChar ? PRESET_AVATARS.find(p => p.char === presetChar) : null;

  const renderAvatar = () => {
    if (avatarUrl && !isPreset) {
      return <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover rounded-full" />;
    }
    const preset = activePreset || PRESET_AVATARS[0];
    return (
      <div className="w-full h-full rounded-full flex items-center justify-center" style={{ background: preset.bg }}>
        <span style={{ color: preset.fg, fontSize: '3rem' }}>{preset.char}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-[#3AAFA9] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-y-auto">
      <div className="absolute inset-0 opacity-[0.018]"
        style={{ backgroundImage: `repeating-conic-gradient(#3AAFA9 0% 25%, transparent 0% 50%)`, backgroundSize: '44px 44px' }}
      />

      {/* Header */}
      <div className="relative z-10 flex items-center gap-3 px-5 pb-4"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 24px)' }}>
        <button onClick={() => navigate('/')}
          className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <UserIcon className="w-4 h-4 text-[#3AAFA9]" />
          <h1 className="text-lg font-bold tracking-wider text-white">Profile</h1>
        </div>
      </div>

      <div className="relative z-10 px-5 pb-10 space-y-6 max-w-md mx-auto">
        {/* Avatar preview */}
        <motion.div
          className="flex flex-col items-center gap-3 pt-2"
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        >
          <div className="relative">
            <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-[#3AAFA9]/40"
              style={{ boxShadow: '0 0 24px rgba(58,175,169,0.25)' }}>
              {uploading ? (
                <div className="w-full h-full flex items-center justify-center bg-[#1a1a2e]">
                  <Loader2 className="w-6 h-6 text-[#3AAFA9] animate-spin" />
                </div>
              ) : renderAvatar()}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-[#3AAFA9] border-2 border-[#0a0a0f] flex items-center justify-center text-[#0a0a0f] active:scale-90 transition-transform"
            >
              <Camera className="w-4 h-4" />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
          </div>
          {avatarUrl && (
            <button onClick={() => setAvatarUrl('')} className="text-xs text-white/30 hover:text-white/60 transition-colors">
              {isPreset ? 'Use default' : 'Remove custom avatar'}
            </button>
          )}
        </motion.div>

        {/* Username */}
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        >
          <label className="text-xs text-white/30 tracking-wider uppercase">Username</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            maxLength={20}
            placeholder="Enter your username"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#3AAFA9]/50 placeholder:text-white/20 transition-colors"
          />
          <p className="text-xs text-white/20">{username.length}/20 characters</p>
        </motion.div>

        {/* Preset avatars */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        >
          <p className="text-xs text-white/30 tracking-wider uppercase mb-3">Or pick a preset</p>
          <div className="grid grid-cols-4 gap-3">
            {PRESET_AVATARS.map((preset, i) => {
              const isActive = isPreset && presetChar === preset.char;
              return (
                <motion.button
                  key={i}
                  onClick={() => setAvatarUrl(`preset:${preset.char}`)}
                  whileTap={{ scale: 0.9 }}
                  className="aspect-square rounded-xl overflow-hidden border-2 transition-all"
                  style={{ background: preset.bg, borderColor: isActive ? '#3AAFA9' : 'transparent' }}
                >
                  <span className="flex items-center justify-center w-full h-full" style={{ color: preset.fg, fontSize: '1.8rem' }}>
                    {preset.char}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Save button */}
        <motion.button
          onClick={handleSave}
          disabled={saving}
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm tracking-wider uppercase transition-all active:scale-95 disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #3AAFA9 0%, #2d8a85 100%)', color: '#0a0a0f' }}
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : null}
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Profile'}
        </motion.button>
      </div>
    </div>
  );
}