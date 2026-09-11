'use client';

import React, { useEffect } from 'react';
import { RotateCw, Home, ShieldAlert } from 'lucide-react';

export default function ErrorBoundary({ error, reset }) {
  useEffect(() => {
    console.error('[Ingress Within Error Boundary Caught]:', error);
    const isChunkError = 
      error?.name === 'ChunkLoadError' || 
      error?.message?.includes('Loading chunk') ||
      error?.message?.includes('Failed to fetch dynamically imported module') ||
      error?.message?.includes('dynamically imported');

    if (isChunkError && typeof window !== 'undefined') {
      const hasReloaded = sessionStorage.getItem('chunk_reload_attempted');
      if (!hasReloaded) {
        sessionStorage.setItem('chunk_reload_attempted', 'true');
        window.location.reload();
      }
    }
  }, [error]);

  const handleReload = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('chunk_reload_attempted');
      window.location.reload();
    } else if (reset) {
      reset();
    }
  };

  const handleGoHome = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-mint-grey text-primary font-sans flex flex-col justify-between relative overflow-hidden select-none">
      <header className="px-[5%] lg:px-[8%] h-[68px] flex items-center justify-between border-b border-primary/5 bg-mint-grey/40 backdrop-blur-md z-10">
        <a href="/" className="logo flex items-center gap-3 no-underline group cursor-pointer">
          <img 
            src="/logo-mark-transparent.png" 
            alt="Ingress Within Logo" 
            className="w-8 h-8 object-contain transition-transform duration-300 group-hover:scale-105 flex-shrink-0" 
          />
          <div className="flex flex-col justify-center text-left">
            <span className="logo-name font-serif text-xl font-normal text-primary tracking-[0.01em] leading-none">
              ingress <span className="font-semibold text-accent">within</span>
            </span>
          </div>
        </a>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-8 relative z-10 max-w-[520px] mx-auto text-center space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mx-auto">
          <ShieldAlert size={28} />
        </div>

        <div className="space-y-3">
          <span className="font-sans text-[11px] font-semibold tracking-[0.14em] uppercase text-accent block">
            Pause & Reset
          </span>
          <h1 className="font-serif text-[28px] md:text-[32px] font-normal leading-tight text-primary">
            Something took an unexpected turn
          </h1>
          <p className="font-sans text-[14.5px] font-light text-mid leading-relaxed max-w-[400px] mx-auto">
            A temporary connection or interface disruption occurred. Reloading usually restores everything cleanly.
          </p>
        </div>

        <div className="w-full max-w-[320px] mx-auto flex flex-col items-center gap-3 pt-2">
          <button
            onClick={handleReload}
            className="w-full bg-accent text-white hover:bg-[#654652] px-6 py-3 rounded-xl font-sans text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-xs flex items-center justify-center gap-2"
          >
            <RotateCw size={14} />
            <span>Reload Page</span>
          </button>

          <button
            onClick={handleGoHome}
            className="w-full bg-transparent border border-primary/15 text-primary hover:border-accent hover:bg-accent/5 px-6 py-3 rounded-xl font-sans text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
          >
            <Home size={14} />
            <span>Return to Home</span>
          </button>
        </div>
      </main>

      <footer className="py-6 border-t border-primary/5 text-center text-[10.5px] font-sans text-mid/60 relative z-10">
        &copy; {new Date().getFullYear()} Ingress Within. All rights reserved.
      </footer>
    </div>
  );
}
