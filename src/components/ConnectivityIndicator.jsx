import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff } from 'lucide-react';

export default function ConnectivityIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [latency, setLatency] = useState(null);
  const [pinging, setPinging] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Ping loop — measures latency to the app origin
  useEffect(() => {
    if (!isOnline) return;
    let cancelled = false;

    const ping = async () => {
      if (cancelled) return;
      setPinging(true);
      try {
        const start = performance.now();
        await fetch(window.location.origin, {
          method: 'HEAD',
          cache: 'no-store',
          mode: 'no-cors',
        });
        if (!cancelled) {
          const ms = Math.round(performance.now() - start);
          setLatency(ms);
        }
      } catch {
        if (!cancelled) setLatency(null);
      } finally {
        if (!cancelled) setPinging(false);
      }
    };

    ping();
    const interval = setInterval(ping, 15000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [isOnline]);

  const getStatusColor = () => {
    if (!isOnline) return '#ef4444';
    if (latency === null) return '#f59e0b';
    if (latency < 100) return '#22c55e';
    if (latency < 300) return '#eab308';
    return '#ef4444';
  };

  const getStatusLabel = () => {
    if (!isOnline) return 'Offline';
    if (latency === null) return 'Connecting…';
    return `${latency}ms`;
  };

  const Icon = isOnline ? Wifi : WifiOff;

  // Respect the "Stuff for Nerds" ping toggle in Settings
  if (localStorage.getItem('chessPingIndicator') === 'off') return null;

  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
      title={`Network: ${getStatusLabel()}`}
    >
      <div className="relative flex items-center justify-center">
        <Icon className="w-3 h-3" style={{ color: getStatusColor() }} />
        {isOnline && !pinging && (
          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: getStatusColor() }} />
        )}
      </div>
      <AnimatePresence mode="wait">
        <motion.span
          key={getStatusLabel()}
          initial={{ opacity: 0, y: -2 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 2 }}
          transition={{ duration: 0.15 }}
          className="text-[10px] font-medium tabular-nums"
          style={{ color: getStatusColor() }}
        >
          {getStatusLabel()}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}