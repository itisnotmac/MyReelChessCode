import React, { useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Gamepad2, User, Settings, ShoppingBag } from 'lucide-react';

const NAV_ITEMS = [
{ label: 'Play', icon: Gamepad2, path: '/Lobby' },
{ label: 'Store', icon: ShoppingBag, path: '/Store' },
{ label: 'Profile', icon: User, path: '/Profile' },
{ label: 'Settings', icon: Settings, path: '/Info?section=settings' }];


// Persist scroll positions per tab path
const scrollPositions = {};

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const prevPath = useRef(location.pathname);

  const isActive = (path) => {
    const basePath = path.split('?')[0];
    if (basePath === '/') return location.pathname === '/';
    return location.pathname === basePath;
  };

  // Save scroll position of the page we're leaving
  useEffect(() => {
    const leaving = prevPath.current;
    return () => {
      scrollPositions[leaving] = window.scrollY;
    };
  }, [location.pathname]);

  // Restore scroll position when arriving at a tab
  useEffect(() => {
    const isTabPath = NAV_ITEMS.some((item) => {
      const base = item.path.split('?')[0];
      return base === location.pathname;
    });
    if (isTabPath) {
      const saved = scrollPositions[location.pathname] ?? 0;
      // Defer to let the page render first
      requestAnimationFrame(() => window.scrollTo(0, saved));
    }
    prevPath.current = location.pathname;
  }, [location.pathname]);

  const handleNav = (path) => {
    const basePath = path.split('?')[0];
    if (location.pathname === basePath) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate(path);
    }
  };

  return (
    <nav
      role="navigation"
      aria-label="Main navigation"
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around"
      style={{
        background: 'linear-gradient(to top, rgba(10,10,15,0.98) 80%, rgba(10,10,15,0.85))',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        paddingBottom: 'calc(env(safe-area-inset-bottom) + 8px)',
        paddingTop: '8px',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)'
      }}>
      
      {NAV_ITEMS.map(({ label, icon: Icon, path }) => {
        const active = isActive(path);
        return (
          <button
            key={label}
            onClick={() => handleNav(path)}
            aria-label={label}
            aria-current={active ? 'page' : undefined}
            role="tab"
            aria-selected={active}
            className="flex flex-col items-center gap-1 px-4 transition-opacity"
            style={{ minWidth: 56, minHeight: 48 }}>
            
            <Icon
              className="w-5 h-5 transition-colors text-teal-200"
              style={{ color: active ? '#3AAFA9' : 'rgba(255,255,255,0.3)' }}
              aria-hidden="true" />
            
            <span
              className="text-[11px] font-medium tracking-wider transition-colors text-teal-300"
              style={{ color: active ? '#3AAFA9' : 'rgba(255,255,255,0.25)' }}>
              
              {label}
            </span>
          </button>);

      })}
    </nav>);

}