import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Compass, RefreshCw } from 'lucide-react';

export default function NotFoundPage({ user, profile }) {
  const isAuthenticated = !!user;

  const handleGoBack = () => {
    if (typeof window !== 'undefined') {
      if (!isAuthenticated) {
        // Unauthenticated users are taken directly to the landing page home route
        if (window.navigateTo) {
          window.navigateTo('/');
        } else {
          window.location.pathname = '/';
        }
      } else {
        // Authenticated users attempt to go back, fallback to dashboard
        if (window.history.length > 1) {
          window.history.back();
        } else {
          if (window.navigateTo) {
            window.navigateTo('/dashboard');
          } else {
            window.location.pathname = '/dashboard';
          }
        }
      }
    }
  };

  const handleGoDashboard = () => {
    if (window.navigateTo) {
      window.navigateTo(isAuthenticated ? '/dashboard' : '/auth');
    }
  };

  const handleStartFresh = () => {
    if (window.navigateTo) {
      window.navigateTo(isAuthenticated ? '/write' : '/auth');
    }
  };

  return (
    <div className="min-h-screen bg-mint-grey text-primary font-sans flex flex-col justify-between relative overflow-hidden select-none">
      {/* Minimal Header */}
      <header className="px-[5%] lg:px-[8%] h-[68px] flex items-center justify-between border-b border-primary/5 bg-mint-grey/40 backdrop-blur-md z-10">
        <a href="/" className="logo flex items-center gap-3 no-underline group cursor-pointer">
          <img 
            src="/logo-mark-transparent.png" 
            alt="Ingress Within Logo" 
            className="w-8 h-8 object-contain transition-transform duration-300 group-hover:scale-105 flex-shrink-0" 
          />
          <div className="flex flex-col justify-center text-left">
            <span className="logo-name font-serif text-xl font-normal text-primary tracking-[0.01em] leading-none">
              ingress <span className="font-semibold text-secondary">within</span>
            </span>
          </div>
        </a>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-8 relative z-10 max-w-[540px] mx-auto text-center space-y-6">
        
        {/* Animated Path Visual (Standalone) */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-[240px] h-[80px] flex items-center justify-center"
        >
          {/* Background blurred radial shadow */}
          <div className="absolute w-[160px] h-[60px] rounded-full bg-secondary/10 blur-xl pointer-events-none" />

          {/* Clean Vector SVG */}
          <svg className="w-full h-full overflow-visible z-20 pointer-events-none" viewBox="0 0 240 80" fill="none">
            {/* Thread Path 1: Sweeping dashed wave */}
            <motion.path
              d="M 20,40 Q 80,15, 120,40 T 220,40"
              stroke="#8DBFB4"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="4, 4"
              animate={{
                d: [
                  "M 20,40 Q 80,15, 120,40 T 220,40",
                  "M 20,42 Q 78,20, 122,38 T 220,42",
                  "M 20,40 Q 82,10, 118,42 T 220,40"
                ]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut'
              }}
            />

            {/* Thread Path 2: Winding solid wave */}
            <motion.path
              d="M 30,55 C 70,30 100,20 120,40 C 140,60 150,60 160,40 C 170,20 190,30 210,55"
              stroke="#E0A898"
              strokeWidth="2"
              strokeLinecap="round"
              animate={{
                d: [
                  "M 30,55 C 70,30 100,20 120,40 C 140,60 150,60 160,40 C 170,20 190,30 210,55",
                  "M 30,53 C 68,32 98,22 120,38 C 142,58 148,62 160,38 C 172,18 188,32 210,53",
                  "M 30,57 C 72,28 102,18 120,42 C 138,62 152,58 160,42 C 168,22 192,28 210,57"
                ]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut'
              }}
            />

            {/* Pulsing connection anchor node */}
            <motion.circle
              cx="120"
              cy="40"
              r="3.5"
              fill="#E0A898"
              animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0.9, 0.6] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
          </svg>
        </motion.div>

        {/* Clean, distinct 404 Text */}
        <motion.h2 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 0.85, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-[72px] md:text-[84px] font-normal tracking-[0.18em] text-primary/70 leading-none select-none pl-[0.18em] !mt-1 !mb-1"
        >
          404
        </motion.h2>

        {/* Text Copy */}
        <div className="space-y-4">
          <span className="font-sans text-[11px] font-semibold tracking-[0.14em] uppercase text-accent block">
            Path Uncharted
          </span>
          
          <h1 className="font-serif text-[28px] md:text-[34px] font-normal leading-tight text-primary px-4">
            Looks like this path leads nowhere.
          </h1>

          <p className="font-sans text-[15px] font-light text-mid leading-relaxed max-w-[420px] mx-auto px-4">
            Sometimes we take a wrong turn. This page doesn't exist, but your way back does.
          </p>
        </div>

        {/* Dynamic Microcopy */}
        <div className="pt-2">
          <p className="font-serif text-[13.5px] italic font-light text-mid/80 leading-relaxed max-w-[360px] mx-auto px-4">
            "Not every path needs to lead somewhere. This one just isn't part of your journey."
          </p>
        </div>

         {/* Action CTAs */}
        <div className="w-full max-w-[360px] mx-auto flex flex-col items-center gap-4 pt-4 px-4">
          {/* Primary Action */}
          <button
            onClick={handleGoBack}
            className="w-full bg-primary text-mint-grey hover:bg-[#2A3A3E] hover:-translate-y-0.5 active:translate-y-0 active:shadow-xs px-8 py-3.5 rounded font-sans text-xs font-semibold uppercase tracking-wider transition-all duration-200 border-none cursor-pointer shadow-xs flex items-center justify-center gap-2"
          >
            <ArrowLeft size={14} />
            <span>Take me back</span>
          </button>

          {/* Secondary and Tertiary Actions - Only render if user is authenticated */}
          {isAuthenticated && (
            <>
              {/* Secondary Action */}
              <button
                onClick={handleGoDashboard}
                className="w-full bg-transparent border border-primary/10 text-primary hover:border-primary/25 hover:bg-white/40 px-8 py-3.5 rounded font-sans text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
              >
                <Compass size={14} className="text-secondary" />
                <span>Go to Dashboard</span>
              </button>

              {/* Subtle Auxiliary Option */}
              <button
                onClick={handleStartFresh}
                className="mt-2 text-[11px] font-sans font-medium text-accent hover:text-accent/85 hover:underline border-none bg-transparent cursor-pointer py-1"
              >
                Start fresh with a new entry &rarr;
              </button>
            </>
          )}
        </div>

      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-primary/5 text-center text-[10.5px] font-sans text-mid/60 relative z-10">
        &copy; {new Date().getFullYear()} Ingress Within. All rights reserved.
      </footer>
    </div>
  );
}
