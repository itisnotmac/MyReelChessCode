import React from 'react';
import BottomNav from '@/components/BottomNav';
import ConnectivityIndicator from '@/components/ConnectivityIndicator';

// Pages that should NOT show the bottom nav (immersive gameplay screens)
const HIDE_NAV_PATHS = ['/Game', '/OnlineGame', '/Tutorial'];

export default function Layout({ children, currentPageName }) {
  const shouldHideNav = HIDE_NAV_PATHS.some(p =>
    window.location.pathname.startsWith(p)
  );

  return (
    <div
      className="min-h-screen bg-[#0a0a0f] text-white"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
        overscrollBehavior: 'none',
      }}
    >
      <style>{`
        :root {
          --background: 0 0% 4%;
          --foreground: 0 0% 95%;
        }
        html, body {
          overscroll-behavior: none;
          -webkit-overflow-scrolling: touch;
        }
        body {
          background: #0a0a0f;
          overflow-x: hidden;
          -webkit-tap-highlight-color: transparent;
          user-select: none;
        }
        * {
          -webkit-user-select: none;
        }
      `}</style>
      {/* Add bottom padding so content isn't hidden behind the nav bar */}
      <div style={{ paddingBottom: shouldHideNav ? 0 : 'calc(env(safe-area-inset-bottom) + 68px)' }}>
        {children}
      </div>
      {!shouldHideNav && (
        <div className="fixed top-0 right-0 z-[60]"
          style={{ paddingTop: 'calc(env(safe-area-inset-top) + 8px)', paddingRight: 'calc(env(safe-area-inset-right) + 12px)' }}
        >
          <ConnectivityIndicator />
        </div>
      )}
      {!shouldHideNav && <BottomNav />}
    </div>
  );
}