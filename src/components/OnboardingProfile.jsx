import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Check, Loader2, ChevronRight, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { PRESET_AVATARS, setLocalProfile, renderAvatarContent } from '@/lib/profileUtils';

export default function OnboardingProfile({ onComplete, isAuthenticated }) {
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('preset:♔');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const fileInputRef = useRef(null);

  const isPreset = avatarUrl?.startsWith('preset:');
  const presetChar = isPreset ? avatarUrl.slice(7) : null;

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setAvatarUrl(file_url);
      setShowAvatarPicker(false);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    const trimmed = username.trim();
    if (!trimmed) {
      setError('Please enter a username');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const profile = { username: trimmed, avatar_url: avatarUrl };
      setLocalProfile(profile);
      if (isAuthenticated) {
        try {
          await base44.auth.updateMe({ username: trimmed, avatar_url: avatarUrl });
        } catch (e) {
          console.error('Failed to sync profile to account:', e);
        }
      }
      onComplete(profile);
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0a0a0f] z-[100] overflow-y-auto">
      <div className="absolute inset-0 opacity-[0.018]"
        style={{ backgroundImage: `repeating-conic-gradient(#3AAFA9 0% 25%, transparent 0% 50%)`, backgroundSize: '44px 44px' }}
      />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-72 h-72 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(58,175,169,0.08) 0%, transparent 70%)' }} />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-10"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 40px)', paddingBottom: 'calc(env(safe-area-inset-bottom) + 40px)' }}>
        
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-black tracking-[0.15em] uppercase text-[#3AAFA9] mb-2">
            Welcome
          </h1>
          <p className="text-sm text-white/40 max-w-xs">
            Create your profile to start playing
          </p>
        </motion.div>

        {/* Avatar preview — tap to open picker */}
        <motion.div
          className="flex flex-col items-center gap-3 mb-6"
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        >
          <button
            onClick={() => setShowAvatarPicker(true)}
            className="relative group"
          >
            <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-[#3AAFA9]/40 transition-all group-hover:border-[#3AAFA9]/70 group-active:scale-95"
              style={{ boxShadow: '0 0 24px rgba(58,175,169,0.25)' }}>
              {uploading ? (
                <div className="w-full h-full flex items-center justify-center bg-[#1a1a2e]">
                  <Loader2 className="w-6 h-6 text-[#3AAFA9] animate-spin" />
                </div>
              ) : renderAvatarContent(avatarUrl)}
            </div>
            <div className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-[#3AAFA9] border-2 border-[#0a0a0f] flex items-center justify-center text-[#0a0a0f]">
              <Camera className="w-4 h-4" />
            </div>
          </button>
          <p className="text-xs text-white/30">Tap to change avatar</p>
        </motion.div>

        {/* Username */}
        <motion.div
          className="w-full max-w-sm space-y-2 mb-8"
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        >
          <label className="text-xs text-white/30 tracking-wider uppercase">Choose a Username</label>
          <input
            type="text"
            value={username}
            onChange={e => { setUsername(e.target.value); setError(''); }}
            maxLength={20}
            autoFocus
            placeholder="e.g. Grandmaster42"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#3AAFA9]/50 placeholder:text-white/20 transition-colors text-center"
            onKeyDown={e => { if (e.key === 'Enter') handleSave(); }}
          />
          {error && <p className="text-xs text-red-400 text-center">{error}</p>}
        </motion.div>

        {/* Continue button */}
        <motion.button
          onClick={handleSave}
          disabled={saving}
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-2 px-10 py-3.5 rounded-xl font-bold text-sm tracking-wider uppercase transition-all active:scale-95 disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #3AAFA9 0%, #2d8a85 100%)', color: '#0a0a0f' }}
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4" />}
          {saving ? 'Creating...' : 'Start Playing'}
        </motion.button>
      </div>

      {/* Avatar picker modal — only shows when user taps their avatar */}
      <AnimatePresence>
        {showAvatarPicker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center"
            onClick={() => setShowAvatarPicker(false)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-sm bg-[#111118] border border-[#3AAFA9]/20 rounded-t-3xl sm:rounded-2xl p-6"
              style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 24px)' }}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-bold text-white/90">Choose Avatar</h3>
                <button
                  onClick={() => setShowAvatarPicker(false)}
                  className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Upload option */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-[#3AAFA9]/20 text-[#3AAFA9] text-sm font-medium hover:bg-[#3AAFA9]/10 transition-colors mb-5"
              >
                <Camera className="w-4 h-4" />
                Upload a photo
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />

              <p className="text-xs text-white/30 tracking-wider uppercase mb-3 text-center">Or pick a chess piece</p>
              <div className="grid grid-cols-6 gap-2">
                {PRESET_AVATARS.map((preset, i) => {
                  const isActive = isPreset && presetChar === preset.char;
                  return (
                    <motion.button
                      key={i}
                      onClick={() => { setAvatarUrl(`preset:${preset.char}`); setShowAvatarPicker(false); }}
                      whileTap={{ scale: 0.9 }}
                      className="aspect-square rounded-lg overflow-hidden border-2 transition-all relative"
                      style={{ background: preset.bg, borderColor: isActive ? '#3AAFA9' : 'transparent' }}
                    >
                      <span className="flex items-center justify-center w-full h-full" style={{ color: preset.fg, fontSize: '1.3rem' }}>
                        {preset.char}
                      </span>
                      {isActive && (
                        <div className="absolute inset-0 flex items-center justify-center bg-[#3AAFA9]/20">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}