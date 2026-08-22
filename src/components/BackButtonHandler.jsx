import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

// Root screens where pressing Android back should prompt "press again to exit"
// instead of immediately closing the TWA (Trusted Web Activity / Play Store wrapper).
const ROOT_PATHS = ['/', '/Lobby'];

/**
 * Makes the Android hardware back button behave like a native app:
 * - On non-root screens: React Router navigates back normally (no interference).
 * - On the root screen: first back press shows "Press back again to exit";
 *   a second press within 2 seconds exits the app.
 *
 * This is a key Play Store TWA quality requirement — without it, the back
 * button at the home screen instantly kills the app, which Google reviewers
 * flag as a poor native-app experience.
 */
export default function BackButtonHandler() {
  const location = useLocation();
  const { toast } = useToast();
  const lastBackPress = useRef(0);

  useEffect(() => {
    const isRoot = ROOT_PATHS.includes(location.pathname);

    // Push a guard history entry at root so the back button doesn't
    // immediately exit — gives us a chance to show the "press again" prompt.
    if (isRoot) {
      window.history.pushState({ rcGuard: true }, '', window.location.href);
    }

    const handlePopState = () => {
      if (!ROOT_PATHS.includes(window.location.pathname)) return;

      const now = Date.now();
      if (now - lastBackPress.current < 2000) {
        // Second press within 2s — let the TWA exit naturally
        return;
      }
      // First press — re-push guard to prevent exit, show prompt
      lastBackPress.current = now;
      window.history.pushState({ rcGuard: true }, '', window.location.href);
      toast({ title: 'Press back again to exit', duration: 2000 });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [location.pathname, toast]);

  return null;
}