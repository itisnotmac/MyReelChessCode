import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User as UserIcon, Camera, Check, Loader2, Trash2, AlertTriangle, Coins } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { PRESET_AVATARS, getLocalProfile, setLocalProfile, renderAvatarContent } from '@/lib/profileUtils';
import FrostedAvatarImage from '@/components/FrostedAvatarImage';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle } from "@/components/ui/alert-dialog";

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
  const [tempoBalance, setTempoBalance] = useState(0);
  const [elo, setElo] = useState(null);
  const [peakElo, setPeakElo] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteDataDialog, setShowDeleteDataDialog] = useState(false);
  const [deletingData, setDeletingData] = useState(false);
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
        setTempoBalance(accounts[0].currency_balance || 0);
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

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await base44.functions.invoke('deleteUserAccount');
    } catch (e) {
      console.error('Account deletion failed:', e);
      setDeleting(false);
      return;
    }
    await base44.auth.logout('/');
  };

  const handleDeleteData = async () => {
    setDeletingData(true);
    const history = await base44.entities.GameHistory.list('-created_date', 200);
    await Promise.all(history.map((r) => base44.entities.GameHistory.delete(r.id)));
    setDeletingData(false);
    setShowDeleteDataDialog(false);
    alert('All your game data has been deleted.');
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
      base44.functions.invoke('logActivity', { type: 'profile', label: 'Profile Updated' }).catch(() => {});
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
      {/* Cinematic backdrop — empty throne room */}
      <div className="absolute inset-0 z-0">
        <img src="https://media.base44.com/images/public/69ab30c24c8c7db2b8432adf/433a8c3e7_generated_image.png" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(120% 80% at 50% 12%, rgba(10,10,15,0.35) 0%, rgba(10,10,15,0.72) 60%, rgba(10,10,15,0.96) 100%)' }} />
      </div>

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
        {/* Consecutive days logged in */}
        {streak > 0 && (
          <motion.div
            className="flex flex-col items-center pt-2 pb-2"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-2xl font-black text-[#3AAFA9] leading-none">{streak}</p>
            <p className="text-xs text-white/40 tracking-wider mt-1">consecutive days logged in</p>
          </motion.div>
        )}

        {/* Tempo balance */}
        <motion.div
          className="flex items-center justify-between rounded-2xl px-5 py-4 border border-[#D4AF37]/30 backdrop-blur-md"
          style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.12) 0%, rgba(212,175,55,0.04) 100%)' }}
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.03 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#D4AF37]/15 flex items-center justify-center">
              <Coins className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <p className="text-xs text-white/40 tracking-wider uppercase">Tempo Balance</p>
              <p className="text-2xl font-black text-[#D4AF37] leading-none mt-0.5">{tempoBalance}</p>
            </div>
          </div>
          <button onClick={() => navigate('/Store')}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/60 text-[11px] font-bold tracking-wider hover:bg-white/10 transition-colors">
            STORE
          </button>
        </motion.div>

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
                  style={{ borderColor: isActive ? '#3AAFA9' : 'rgba(255,255,255,0.08)' }}
                >
                  <FrostedAvatarImage preset={preset} />
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

        {/* Danger zone */}
        <motion.div
          className="space-y-4 pt-6 mt-6 border-t border-white/10"
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        >
          <p className="text-xs tracking-widest uppercase text-red-400/60 font-semibold">Danger Zone</p>

          {/* Delete Data */}
          <div className="rounded-xl bg-orange-500/5 border border-orange-500/20 p-4">
            <div className="flex items-start gap-3 mb-4">
              <Trash2 className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-white text-sm font-medium">Delete My Data</p>
                <p className="text-white/30 text-xs mt-0.5 leading-relaxed">
                  Permanently delete all your game history and statistics. Your account will remain active.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowDeleteDataDialog(true)}
              className="w-full py-2.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 text-sm font-semibold tracking-wider hover:bg-orange-500/20 transition-colors">
              DELETE MY DATA
            </button>
          </div>

          {/* Delete Account */}
          <div className="rounded-xl bg-red-500/5 border border-red-500/20 p-4">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-white text-sm font-medium">Delete Account</p>
                <p className="text-white/30 text-xs mt-0.5 leading-relaxed">
                  Permanently delete your account and all associated game history. This action cannot be undone.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowDeleteDialog(true)}
              className="w-full py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-semibold tracking-wider hover:bg-red-500/20 transition-colors">
              DELETE ACCOUNT
            </button>
          </div>
        </motion.div>

        <AlertDialog open={showDeleteDataDialog} onOpenChange={setShowDeleteDataDialog}>
          <AlertDialogContent className="bg-[#12121a] border border-white/10 text-white">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">Delete Your Data?</AlertDialogTitle>
              <AlertDialogDescription className="text-white/50">
                This will permanently delete all your game history and statistics. Your account will remain active. This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deletingData} className="bg-white/5 border-white/10 text-white hover:bg-white/10">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction disabled={deletingData} onClick={handleDeleteData} className="bg-orange-600 hover:bg-orange-700 text-white border-0">
                {deletingData ? 'Deleting...' : 'Yes, Delete Data'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent className="bg-[#12121a] border border-white/10 text-white">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">Delete Account?</AlertDialogTitle>
              <AlertDialogDescription className="text-white/50">
                This will permanently delete your account and all game history. You cannot undo this action.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleting} className="bg-white/5 border-white/10 text-white hover:bg-white/10">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction disabled={deleting} onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700 text-white border-0">
                {deleting ? 'Deleting...' : 'Yes, Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}