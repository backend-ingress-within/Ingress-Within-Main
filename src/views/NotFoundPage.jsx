import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Compass, RefreshCw } from 'lucide-react';

export default function NotFoundPage({ user, profile }) {
  const isAuthenticated = !!user;

  const handleGoBack = () => {
    // Attempt to go back, fallback to dashboard/home if no history exists
    if (typeof window !== 'undefined') {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.navigateTo(isAuthenticated ? '/dashboard' : '/');
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
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative z-10 max-w-[540px] mx-auto text-center space-y-8">
        
        {/* Animated 404 Visual Treatment */}
        <div className="relative w-full max-w-[280px] h-[160px] flex items-center justify-center mb-2">
          {/* Background blurred radial shadow */}
          <div className="absolute w-[200px] h-[100px] rounded-full bg-secondary/15 blur-2xl pointer-events-none" />

          {/* Large Serif '404' Text embedded in path */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 0.08, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="absolute font-serif text-[100px] md:text-[120px] font-normal tracking-wide text-primary select-none pointer-events-none"
          >
            404
          </motion.div>

          {/* Floating vector SVG with winding thread loops */}
          <svg className="w-full h-full overflow-visible z-20 pointer-events-none" viewBox="0 0 280 160" fill="none">
            {/* Thread Path 1: Loop and drift */}
            <motion.path
              d="M 20 80 Q 80 20, 140 80 T 260 80"
              stroke="#8DBFB4"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="4, 4"
              animate={{
                d: [
                  "M 20 80 Q 80 20, 140 80 T 260 80",
                  "M 20 82 Q 78 30, 142 78 T 260 82",
                  "M 20 80 Q 82 10, 138 82 T 260 80"
                ]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut'
              }}
            />

            {/* Thread Path 2: Winding loop that seems to temporarily disconnect then rejoin */}
            <motion.path
              d="M 40 100 Q 110 140, 140 70 Q 170 0, 240 60"
              stroke="#E0A898"
              strokeWidth="2"
              strokeLinecap="round"
              animate={{
                d: [
                  "M 40 100 Q 110 140, 140 70 Q 170 0, 240 60",
                  "M 40 98 Q 112 135, 138 75 Q 168 10, 240 58",
                  "M 40 102 Q 108 145, 142 65 Q 172 -10, 240 62"
                ]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut'
              }}
            />

            {/* Pulsing focal point (where path connects or disconnects) */}
            <motion.circle
              cx="140"
              cy="70"
              r="4"
              fill="#E0A898"
              animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0.9, 0.6] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
          </svg>
        </div>

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

          {/* Secondary Action */}
          <button
            onClick={handleGoDashboard}
            className="w-full bg-transparent border border-primary/10 text-primary hover:border-primary/25 hover:bg-white/40 px-8 py-3.5 rounded font-sans text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
          >
            <Compass size={14} className="text-secondary" />
            <span>{isAuthenticated ? 'Go to Dashboard' : 'Go to Sign In'}</span>
          </button>

          {/* Subtle Auxiliary Option */}
          {isAuthenticated && (
            <button
              onClick={handleStartFresh}
              className="mt-2 text-[11px] font-sans font-medium text-accent hover:text-accent/85 hover:underline border-none bg-transparent cursor-pointer py-1"
            >
              Start fresh with a new entry &rarr;
            </button>
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
