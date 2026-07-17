import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User as UserIcon, Camera, Check, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { PRESET_AVATARS, getLocalProfile, setLocalProfile, renderAvatarContent } from '@/lib/profileUtils';
import StreakBadge from '../components/streak/StreakBadge';
import { getTierName, getStreakTier, getNextMilestone } from '@/lib/streakTiers';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [streak, setStreak] = useState(0);
  const [elo, setElo] = useState(null);
  const [peakElo, setPeakElo] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const local = getLocalProfile();
    if (local) {
      setUsername(local.username || '');
      setAvatarUrl(local.avatar_url || '');
    }
    base44.auth.me().then(u => {
      setUser(u);
      if (u?.username) setUsername(u.username);
      if (u?.avatar_url) setAvatarUrl(u.avatar_url);
    }).catch(() => {}).finally(() => setLoading(false));

    base44.entities.PlayerAccount.list().then(accounts => {
      if (accounts?.[0]) {
        setStreak(accounts[0].login_streak || 0);
        setElo(accounts[0].elo ?? 1200);
        setPeakElo(accounts[0].peak_elo ?? accounts[0].elo ?? 1200);
      }
    }).catch(() => {});
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
      setLocalProfile({ username, avatar_url: avatarUrl });
      if (user) {
        try {
          await base44.auth.updateMe({ username, avatar_url: avatarUrl });
        } catch (e) {
          console.error('Failed to sync profile to account:', e);
        }
      }
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
        <button onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/'))}
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
              ) : renderAvatarContent(avatarUrl)}
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

        {/* Streak Badge */}
        {streak > 0 && (
          <motion.div
            className="flex items-center justify-center gap-4 py-2"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
          >
            <StreakBadge streak={streak} size="md" />
            <div>
              <p className="text-sm font-bold text-[#3AAFA9]">{getTierName(getStreakTier(streak))}</p>
              <p className="text-xs text-white/40">Day {streak} • Next reward: Day {getNextMilestone(streak).day}</p>
            </div>
          </motion.div>
        )}

        {/* ELO Rating */}
        {elo != null && (
          <motion.div
            className="flex items-center justify-between rounded-2xl bg-white/5 border border-white/5 px-5 py-4"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}
          >
            <div>
              <p className="text-xs text-white/30 tracking-wider uppercase">Rating (ELO)</p>
              <p className="text-3xl font-black text-white leading-none mt-1">{elo}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/30 tracking-wider uppercase">Peak</p>
              <p className="text-lg font-bold text-[#D4AF37] mt-1">{peakElo}</p>
            </div>
          </motion.div>
        )}

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