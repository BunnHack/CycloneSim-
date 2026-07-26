import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

declare global {
  interface Window {
    mainMenu?: {
      showing: boolean;
      show: () => void;
      hide: () => void;
    };
    basinCreationMenu?: {
      show: () => void;
    };
    loadMenu?: {
      show: () => void;
      refresh: () => void;
    };
    settingsMenu?: {
      show: () => void;
    };
  }
}

function MainMenu() {
  const [isShowing, setIsShowing] = useState(false);

  useEffect(() => {
    let active = true;
    const checkState = () => {
      if (!active) return;
      if (window.mainMenu) {
        setIsShowing(window.mainMenu.showing);
      }
      requestAnimationFrame(checkState);
    };
    checkState();
    return () => {
      active = false;
    };
  }, []);

  if (!isShowing) return null;

  const handleNewBasin = () => {
    if (window.mainMenu && window.basinCreationMenu) {
      window.mainMenu.hide();
      window.basinCreationMenu.show();
    }
  };

  const handleLoadBasin = () => {
    if (window.mainMenu && window.loadMenu) {
      window.mainMenu.hide();
      window.loadMenu.show();
      window.loadMenu.refresh();
    }
  };

  const handleSettings = () => {
    if (window.mainMenu && window.settingsMenu) {
      window.mainMenu.hide();
      window.settingsMenu.show();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-950/50 backdrop-blur-md z-[9999] pointer-events-auto select-none">
      <div className="w-[480px] bg-slate-900/90 border border-slate-700/50 shadow-2xl rounded-2xl p-8 flex flex-col items-center text-center transition-all duration-300 transform scale-100">
        
        {/* Cyclone SVG Icon */}
        <div className="relative w-20 h-20 mb-6 text-cyan-400 flex items-center justify-center">
          <svg className="w-16 h-16 animate-[spin_10s_linear_infinite]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2c0 3 2 5 5 5" />
            <path d="M12 22c0-3-2-5-5-5" />
            <path d="M2 12c3 0 5 2 5 5" />
            <path d="M22 12c-3 0-5-2-5-5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="12" cy="12" r="9" strokeDasharray="3 3" />
          </svg>
        </div>

        {/* Title & Subtitle */}
        <h1 className="text-4xl font-extrabold text-white tracking-wider uppercase mb-2 font-sans">
          Cyclone Simulator
        </h1>
        <p className="text-sm text-slate-300 italic mb-8 max-w-[340px] font-sans">
          Simulate your own monster storms!
        </p>

        {/* Navigation Buttons */}
        <div className="w-full flex flex-col gap-4">
          <button
            onClick={handleNewBasin}
            className="group w-full py-3.5 px-7 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold text-base rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg shadow-blue-900/30 flex items-center justify-between cursor-pointer"
          >
            <span className="flex items-center gap-3">
              <svg className="w-5 h-5 opacity-80 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              New Basin
            </span>
            <span className="text-xs text-cyan-200 opacity-60 group-hover:opacity-100 transition-opacity font-normal">
              Create Custom Map
            </span>
          </button>

          <button
            onClick={handleLoadBasin}
            className="group w-full py-3.5 px-7 bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-base rounded-xl border border-slate-700/50 transition-all duration-200 transform hover:-translate-y-0.5 shadow-md flex items-center justify-between cursor-pointer"
          >
            <span className="flex items-center gap-3">
              <svg className="w-5 h-5 opacity-80 group-hover:opacity-100 transition-opacity text-slate-400 group-hover:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9l-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Load Basin
            </span>
            <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-opacity font-normal">
              Resume Simulation
            </span>
          </button>

          <button
            onClick={handleSettings}
            className="group w-full py-3.5 px-7 bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-base rounded-xl border border-slate-700/50 transition-all duration-200 transform hover:-translate-y-0.5 shadow-md flex items-center justify-between cursor-pointer"
          >
            <span className="flex items-center gap-3">
              <svg className="w-5 h-5 opacity-80 group-hover:opacity-100 transition-opacity text-slate-400 group-hover:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </span>
            <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-opacity font-normal">
              Adjust Options
            </span>
          </button>
        </div>

        {/* Footer info */}
        <div className="mt-8 text-[11px] text-slate-500 tracking-widest uppercase font-sans">
          Cyclone Engine v1.0 • React Powered
        </div>
      </div>
    </div>
  );
}

const container = document.getElementById('react-root');
if (container) {
  const root = createRoot(container);
  root.render(<MainMenu />);
}
