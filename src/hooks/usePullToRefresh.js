import { useState, useRef, useEffect } from 'react';

/**
 * Pull-to-refresh hook for mobile WebView.
 * Returns { refreshing, pullProgress, containerProps }
 * Wrap your scrollable container with containerProps.
 */
export function usePullToRefresh(onRefresh) {
  const [refreshing, setRefreshing] = useState(false);
  const [pullProgress, setPullProgress] = useState(0); // 0–1
  const startY = useRef(null);
  const containerRef = useRef(null);
  const THRESHOLD = 64;

  const handleTouchStart = (e) => {
    const el = containerRef.current;
    if (el && el.scrollTop === 0) {
      startY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e) => {
    if (startY.current === null || refreshing) return;
    const delta = e.touches[0].clientY - startY.current;
    if (delta > 0) {
      setPullProgress(Math.min(delta / THRESHOLD, 1));
    }
  };

  const handleTouchEnd = async () => {
    if (pullProgress >= 1 && !refreshing) {
      setRefreshing(true);
      await onRefresh();
      setRefreshing(false);
    }
    startY.current = null;
    setPullProgress(0);
  };

  const containerProps = {
    ref: containerRef,
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };

  return { refreshing, pullProgress, containerProps };
}