import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Check, Loader2, ChevronRight, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { PRESET_AVATARS, setLocalProfile, renderAvatarContent } from '@/lib/profileUtils';
import FrostedPieceTile from '@/components/FrostedPieceTile';

const HERO_BACKDROP = 'https://media.base44.com/images/public/69ab30c24c8c7db2b8432adf/3409ea109_generated_image.png';

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
    <div className="fixed inset-0 bg-[#0a0f12] z-[100] overflow-y-auto">
      {/* Cinematic 3D rook backdrop */}
      <div className="absolute inset-0">
        <img src={HERO_BACKDROP} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ backdropFilter: 'blur(2px)' }} />
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(130% 95% at 50% 42%, rgba(10,15,18,0.08) 0%, rgba(10,15,18,0.34) 58%, rgba(10,15,18,0.8) 100%)' }} />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-5 py-10"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 32px)', paddingBottom: 'calc(env(safe-area-inset-bottom) + 32px)' }}>

        {/* Floating frosted-glass card */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-sm rounded-3xl p-7 flex flex-col items-center text-center"
          style={{
            background: 'rgba(255,255,255,0.045)',
            border: '1px solid rgba(255,255,255,0.16)',
            boxShadow: '0 18px 60px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.1)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          }}
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h1 className="text-3xl font-black tracking-[0.18em] uppercase text-white mb-2"
              style={{ textShadow: '0 0 22px rgba(58,175,169,0.35)' }}>
              Welcome
            </h1>
            <p className="text-sm text-white/60 max-w-xs">
              Create your profile to start playing
            </p>
          </motion.div>

          {/* Avatar */}
          <motion.div
            className="flex flex-col items-center gap-2.5 mb-6"
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          >
            <button
              onClick={() => setShowAvatarPicker(true)}
              className="relative group"
            >
              <div className="w-24 h-24 rounded-full overflow-hidden transition-all group-active:scale-95"
                style={{
                  border: '1.5px solid rgba(58,175,169,0.55)',
                  boxShadow: '0 0 26px rgba(58,175,169,0.35), inset 0 0 18px rgba(58,175,169,0.12)',
                  background: 'rgba(255,255,255,0.04)',
                }}>
                {uploading ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-[#3AAFA9] animate-spin" />
                  </div>
                ) : renderAvatarContent(avatarUrl)}
              </div>
              <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: '#3AAFA9', border: '2px solid #0a0f12', color: '#0a0f12' }}>
                <Camera className="w-3.5 h-3.5" />
              </div>
            </button>
            <p className="text-[11px] text-white/40 tracking-wide">Tap to change avatar</p>
          </motion.div>

          {/* Username */}
          <motion.div
            className="w-full space-y-2 mb-6"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          >
            <label className="text-[11px] text-white/40 tracking-[0.18em] uppercase">Choose a Username</label>
            <input
              type="text"
              value={username}
              onChange={e => { setUsername(e.target.value); setError(''); }}
              maxLength={20}
              autoFocus
              placeholder="e.g. Grandmaster42"
              className="rc-onboard-input w-full px-4 py-3 rounded-xl text-white text-sm text-center transition-colors focus:outline-none"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.12)',
              }}
              onKeyDown={e => { if (e.key === 'Enter') handleSave(); }}
            />
            <style>{`
              .rc-onboard-input::placeholder { color: rgba(58,175,169,0.6); }
              .rc-onboard-input:focus { border-color: rgba(58,175,169,0.6) !important; box-shadow: 0 0 0 3px rgba(58,175,169,0.12); }
            `}</style>
            {error && <p className="text-xs text-red-400">{error}</p>}
          </motion.div>

          {/* CTA */}
          <motion.button
            onClick={handleSave}
            disabled={saving}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            whileTap={{ scale: 0.97 }}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full font-bold text-sm tracking-[0.16em] uppercase text-white transition-all disabled:opacity-60"
            style={{
              background: 'linear-gradient(180deg, #2d8a85 0%, #3AAFA9 100%)',
              boxShadow: '0 10px 28px rgba(58,175,169,0.35), inset 0 1px 0 rgba(255,255,255,0.25)',
            }}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4" />}
            {saving ? 'Creating...' : 'Start Playing'}
          </motion.button>
        </motion.div>
      </div>

      {/* Avatar picker modal */}
      <AnimatePresence>
        {showAvatarPicker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-black/70 backdrop-blur-md flex items-end sm:items-center justify-center"
            onClick={() => setShowAvatarPicker(false)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ type: 'spring', damping: 26, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-sm rounded-t-3xl sm:rounded-3xl p-6"
              style={{
                paddingBottom: 'calc(env(safe-area-inset-bottom) + 22px)',
                background: 'rgba(18,20,24,0.85)',
                border: '1px solid rgba(58,175,169,0.22)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
              }}
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

              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-colors mb-5"
                style={{ border: '1px solid rgba(58,175,169,0.3)', color: '#3AAFA9', background: 'rgba(58,175,169,0.08)' }}
              >
                <Camera className="w-4 h-4" />
                Upload a photo
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />

              <p className="text-[11px] text-white/40 tracking-[0.18em] uppercase mb-3 text-center">Or pick a chess piece</p>
              <div className="grid grid-cols-3 gap-3">
                {PRESET_AVATARS.map((preset, i) => {
                  const isActive = isPreset && presetChar === preset.char;
                  return (
                    <motion.button
                      key={i}
                      onClick={() => { setAvatarUrl(`preset:${preset.char}`); setShowAvatarPicker(false); }}
                      whileTap={{ scale: 0.92 }}
                      className="aspect-square rounded-xl overflow-hidden relative transition-all"
                      style={{ border: `2px solid ${isActive ? '#3AAFA9' : 'rgba(255,255,255,0.1)'}` }}
                    >
                      <FrostedPieceTile preset={preset} size="md" />
                      {isActive && (
                        <div className="absolute inset-0 flex items-center justify-center bg-[#3AAFA9]/25">
                          <Check className="w-5 h-5 text-white" />
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