import React from 'react';

export default function Layout({ children, currentPageName }) {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <style>{`
        :root {
          --background: 0 0% 4%;
          --foreground: 0 0% 95%;
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
      {children}
    </div>
  );
}