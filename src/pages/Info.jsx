import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Settings, Trash2, AlertTriangle } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { base44 } from '@/api/base44Client';
import ThemePicker from '@/components/ThemePicker';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle } from "@/components/ui/alert-dialog";

export default function InfoPage() {
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteDataDialog, setShowDeleteDataDialog] = useState(false);
  const [deletingData, setDeletingData] = useState(false);

  const [soundEnabled, setSoundEnabled] = useState(() => localStorage.getItem('chessSound') !== 'off');
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    localStorage.setItem('chessSound', next ? 'on' : 'off');
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    // Delete all game history, then sign out (Base44 handles account deletion via logout)
    const history = await base44.entities.GameHistory.list('-created_date', 200);
    await Promise.all(history.map((r) => base44.entities.GameHistory.delete(r.id)));
    await base44.auth.logout('/');
  };

  const handleDeleteData = async () => {
    setDeletingData(true);
    // Delete all game history data only (keeps account)
    const history = await base44.entities.GameHistory.list('-created_date', 200);
    await Promise.all(history.map((r) => base44.entities.GameHistory.delete(r.id)));
    setDeletingData(false);
    setShowDeleteDataDialog(false);
    alert('All your game data has been deleted.');
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
      </motion.div>
    </div>
  );
}