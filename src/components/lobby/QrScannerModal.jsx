import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { X, Camera, Keyboard, Loader2, ScanLine } from 'lucide-react';
import jsQR from 'jsqr';

export default function QrScannerModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef = useRef(null);

  const [mode, setMode] = useState('camera'); // camera | manual
  const [error, setError] = useState('');
  const [manualCode, setManualCode] = useState('');
  const [joining, setJoining] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);

  const extractInviteCode = useCallback((value) => {
    if (!value) return null;
    // Try parsing as URL first
    try {
      const url = new URL(value);
      const join = url.searchParams.get('join');
      if (join) return join.toUpperCase();
    } catch {
      // Not a URL — treat as raw code (4-8 alphanumeric chars)
      const cleaned = value.trim().toUpperCase();
      if (/^[A-Z0-9]{4,8}$/.test(cleaned)) return cleaned;
    }
    return null;
  }, []);

  const stopCamera = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setCameraReady(false);
  }, []);

  const handleJoin = useCallback(async (code) => {
    setJoining(true);
    setError('');
    try {
      // Functions use a separate axios client with interceptResponses: false,
      // so the response is NOT unwrapped — the JSON body lives in res.data.
      const res = await base44.functions.invoke('joinWifiGame', { invite_code: code });
      const body = res?.data || res;
      if (body?.game_id) {
        stopCamera();
        onClose();
        navigate(createPageUrl('OnlineGame') + `?game=${body.game_id}`);
      } else {
        setError(body?.error || 'Failed to join game');
      }
    } catch (e) {
      setError(e?.response?.data?.error || e?.data?.error || e?.message || 'Failed to join game');
    } finally {
      setJoining(false);
    }
  }, [navigate, onClose, stopCamera]);

  // Store handleJoin in a ref so the camera effect doesn't restart when
  // onClose changes (inline fn from parent changes every render, which
  // would otherwise tear down and restart the camera endlessly).
  const handleJoinRef = useRef(handleJoin);
  useEffect(() => { handleJoinRef.current = handleJoin; }, [handleJoin]);

  // Start camera when in camera mode
  useEffect(() => {
    if (!isOpen || mode !== 'camera') return;

    if (!navigator.mediaDevices?.getUserMedia) {
      setMode('manual');
      return;
    }

    // BarcodeDetector is Chromium-only (not on iOS Safari). Fall back to
    // jsQR (pure-JS QR decoder via canvas) so the camera scanner works on
    // iPhone and every other browser.
    const useBarcodeDetector = 'BarcodeDetector' in window;
    let cancelled = false;
    let detector = null;
    let canvas = null;
    let ctx = null;

    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        });
        if (cancelled) { stream.getTracks().forEach(t => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setCameraReady(true);
        }

        if (useBarcodeDetector) {
          detector = new window.BarcodeDetector({ formats: ['qr_code'] });
        } else {
          canvas = document.createElement('canvas');
          ctx = canvas.getContext('2d', { willReadFrequently: true });
        }

        const scan = async () => {
          if (cancelled || !videoRef.current || !streamRef.current) return;
          try {
            let rawValue = null;
            if (useBarcodeDetector) {
              const codes = await detector.detect(videoRef.current);
              if (codes.length > 0) rawValue = codes[0].rawValue;
            } else {
              const video = videoRef.current;
              if (video.readyState >= 2 && video.videoWidth > 0) {
                // Downscale to max 640px for fast QR detection on mobile
                const scale = Math.min(1, 640 / Math.max(video.videoWidth, video.videoHeight));
                canvas.width = Math.floor(video.videoWidth * scale);
                canvas.height = Math.floor(video.videoHeight * scale);
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: 'dontInvert' });
                if (code) rawValue = code.data;
              }
            }
            if (rawValue) {
              const code = extractInviteCode(rawValue);
              if (code) {
                stopCamera();
                handleJoinRef.current(code);
                return;
              }
            }
          } catch {}
          rafRef.current = requestAnimationFrame(scan);
        };
        scan();
      } catch (e) {
        if (!cancelled) {
          setError('Camera unavailable. Enter the code manually below.');
          setMode('manual');
        }
      }
    };

    start();

    return () => {
      cancelled = true;
      stopCamera();
    };
  }, [isOpen, mode, extractInviteCode, stopCamera]);

  // Cleanup on close
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setError('');
      setManualCode('');
      setMode('camera');
    }
  }, [isOpen, stopCamera]);

  const handleManualSubmit = (e) => {
    e.preventDefault();
    const code = manualCode.trim().toUpperCase();
    if (code.length < 4) return;
    handleJoin(code);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-x-2 bottom-0 z-50 rounded-t-3xl overflow-hidden"
            style={{
              background: 'linear-gradient(160deg, #0d1f1f 0%, #0a0a0f 100%)',
              border: '1px solid rgba(58,175,169,0.2)',
              borderBottom: 'none',
              maxWidth: 480,
              margin: '0 auto',
            }}
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 280, damping: 30 }}
          >
            <div className="p-6" style={{ paddingBottom: 'calc(2rem + env(safe-area-inset-bottom))' }}>
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <ScanLine className="w-5 h-5 text-[#3AAFA9]" />
                  <span className="font-black tracking-[0.2em] uppercase text-sm text-[#3AAFA9]">Join via QR</span>
                </div>
                <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Mode toggle */}
              <div className="flex gap-2 mb-5">
                <button
                  onClick={() => { setMode('camera'); setError(''); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold tracking-wider transition-all ${
                    mode === 'camera'
                      ? 'bg-[#3AAFA9]/15 border border-[#3AAFA9]/40 text-[#3AAFA9]'
                      : 'bg-white/5 border border-white/10 text-white/40'
                  }`}
                >
                  <Camera className="w-4 h-4" /> Scan
                </button>
                <button
                  onClick={() => { setMode('manual'); stopCamera(); setError(''); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold tracking-wider transition-all ${
                    mode === 'manual'
                      ? 'bg-[#3AAFA9]/15 border border-[#3AAFA9]/40 text-[#3AAFA9]'
                      : 'bg-white/5 border border-white/10 text-white/40'
                  }`}
                >
                  <Keyboard className="w-4 h-4" /> Enter Code
                </button>
              </div>

              {/* Camera view */}
              {mode === 'camera' && (
                <div className="relative rounded-2xl overflow-hidden bg-black aspect-square mb-4">
                  <video
                    ref={videoRef}
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {/* Scanning frame overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-3/4 h-3/4 border-2 border-[#3AAFA9]/60 rounded-2xl relative">
                      {/* Corner brackets */}
                      <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-[#3AAFA9] rounded-tl-2xl" />
                      <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-[#3AAFA9] rounded-tr-2xl" />
                      <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-[#3AAFA9] rounded-bl-2xl" />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-[#3AAFA9] rounded-br-2xl" />
                      {/* Animated scan line */}
                      <motion.div
                        className="absolute left-2 right-2 h-0.5 bg-[#3AAFA9]"
                        style={{ boxShadow: '0 0 8px rgba(58,175,169,0.8)' }}
                        animate={{ top: ['10%', '90%', '10%'] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                      />
                    </div>
                  </div>
                  {!cameraReady && !error && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 text-[#3AAFA9] animate-spin" />
                    </div>
                  )}
                  {cameraReady && (
                    <p className="absolute bottom-3 left-0 right-0 text-center text-[10px] text-white/50 tracking-wider">
                      Point at the QR code on the other device
                    </p>
                  )}
                </div>
              )}

              {/* Manual entry */}
              {mode === 'manual' && (
                <form onSubmit={handleManualSubmit} className="space-y-3">
                  <input
                    type="text"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    placeholder="Enter 6-character code"
                    maxLength={8}
                    autoFocus
                    className="w-full text-center px-4 py-4 rounded-xl bg-white/5 border border-white/15 text-[#3AAFA9] font-mono font-bold text-2xl tracking-[0.3em] uppercase placeholder:text-white/20 placeholder:text-base placeholder:tracking-normal focus:outline-none focus:border-[#3AAFA9]/50"
                  />
                  <button
                    type="submit"
                    disabled={joining || manualCode.trim().length < 4}
                    className="w-full py-3.5 rounded-xl font-black text-sm tracking-[0.15em] uppercase transition-all active:scale-95 disabled:opacity-40"
                    style={{ background: 'linear-gradient(135deg, #3AAFA9, #2d8c87)', color: '#000' }}
                  >
                    {joining ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" /> Joining…
                      </span>
                    ) : 'Join Game'}
                  </button>
                </form>
              )}

              {/* Error */}
              {error && (
                <p className="text-red-400/80 text-xs text-center mt-3">{error}</p>
              )}

              {/* Hint */}
              <p className="text-white/20 text-[10px] text-center mt-4 tracking-wider">
                Ask the host to share their code or QR from WiFi Match
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}