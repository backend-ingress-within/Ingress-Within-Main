import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Home, 
  PenLine, 
  FileText, 
  MoreHorizontal, 
  X, 
  ChevronRight, 
  ChevronDown, 
  Search, 
  Sparkles, 
  Compass, 
  TrendingUp, 
  Smile, 
  MessageSquare, 
  BookOpen, 
  ShieldCheck, 
  Settings, 
  HeartHandshake, 
  AlertCircle, 
  Users, 
  Target,
  PhoneCall
} from 'lucide-react';
import GlobalSearchModal from './search/GlobalSearchModal';
import { SUPPORT_CONFIG } from '../config/supportConfig';

export default function DashboardNavbar({ activeTab }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  // Keyboard shortcut: Cmd+K / Ctrl+K opens search, Esc closes More menu
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isMoreOpen) {
        setIsMoreOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMoreOpen]);

  // Lock body scroll when More menu is open
  useEffect(() => {
    if (isMoreOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMoreOpen]);

  // Close More menu when activeTab changes
  useEffect(() => {
    setIsMoreOpen(false);
  }, [activeTab]);

  const handleNavigate = (path) => {
    setIsMoreOpen(false);
    if (typeof window !== 'undefined' && window.navigateTo) {
      window.navigateTo(path);
    }
  };

  // Determine if current active tab is part of the "More" extended destinations
  const isMoreActive = Boolean(
    activeTab && !['home', 'dashboard', 'write', 'reports'].includes(activeTab)
  );

  const getTabClass = (tab) => {
    const isActive = activeTab === tab;
    return `text-[12px] font-semibold uppercase tracking-wider pb-0.5 border-b-2 transition-all cursor-pointer ${
      isActive 
        ? 'text-accent border-accent font-semibold' 
        : 'text-mid hover:text-primary border-transparent hover:border-accent/30 font-medium'
    }`;
  };

  return (
    <>
      {/* DESKTOP & MOBILE TOP HEADER */}
      <header className="glass-nav border-b border-primary/5 px-3.5 sm:px-6 py-3 sm:py-3.5 sticky top-0 z-50 bg-warm-paper/90 backdrop-blur-md">
        <div className="max-w-[1140px] mx-auto w-full flex items-center justify-between gap-3 sm:gap-4">
          
          {/* Brand Logo & Name */}
          <div 
            className="flex items-center gap-2 sm:gap-2.5 font-semibold text-[15px] cursor-pointer group shrink-0 min-w-0" 
            onClick={() => handleNavigate('/dashboard')}
          >
            <img 
              src="/logo-mark-transparent.png" 
              alt="Ingress Within" 
              className="w-5.5 h-5.5 sm:w-6 sm:h-6 object-contain transition-transform duration-200 group-hover:scale-105 shrink-0" 
            />
            <span className="tracking-tight font-serif text-[15px] sm:text-[16px] text-primary truncate">
              ingress <em className="text-accent font-serif not-italic font-semibold">within</em>
            </span>
          </div>
          
          {/* Desktop Primary Navigation (Home, Write, Reports, and More) */}
          <nav 
            aria-label="Desktop primary navigation"
            className="hidden md:flex items-center gap-5 lg:gap-6 shrink-0"
          >
            <button 
              className={getTabClass('home')} 
              onClick={() => handleNavigate('/dashboard')}
              aria-current={['home', 'dashboard'].includes(activeTab) ? 'page' : undefined}
            >
              Home
            </button>
            <button 
              className={getTabClass('write')} 
              onClick={() => handleNavigate('/write')}
              aria-current={activeTab === 'write' ? 'page' : undefined}
            >
              Write
            </button>
            <button 
              className={getTabClass('reports')} 
              onClick={() => handleNavigate('/reports')}
              aria-current={activeTab === 'reports' ? 'page' : undefined}
            >
              Reports
            </button>

            {/* Desktop More Menu Trigger Button */}
            <button
              type="button"
              onClick={() => setIsMoreOpen((prev) => !prev)}
              className={`flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wider pb-0.5 border-b-2 transition-all cursor-pointer ${
                isMoreActive || isMoreOpen
                  ? 'text-accent border-accent font-semibold' 
                  : 'text-mid hover:text-primary border-transparent hover:border-accent/30 font-medium'
              }`}
              aria-expanded={isMoreOpen}
              aria-label="More navigation and features"
            >
              <span>More</span>
              <ChevronDown size={13} className={`transition-transform duration-200 ${isMoreOpen ? 'rotate-180' : ''}`} />
            </button>
          </nav>

          {/* Right Action Controls (Search, Support, Account) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Global Search Trigger (Desktop) */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="hidden sm:flex items-center gap-2 px-2.5 lg:px-3 py-1.5 rounded-full bg-white/80 hover:bg-white border border-primary/10 hover:border-accent/40 text-mid/70 hover:text-primary transition-all text-xs cursor-pointer shadow-2xs group"
              title="Search self-help resources (⌘K / Ctrl+K)"
              aria-label="Search self-help resources"
            >
              <Search size={13} className="text-mid/70 group-hover:text-accent transition-colors shrink-0" />
              <span className="font-normal text-[11.5px] text-mid/80 hidden xl:inline">Search resources...</span>
              <span className="font-normal text-[11.5px] text-mid/80 xl:hidden">Search</span>
              <kbd className="text-[10px] font-mono bg-primary/5 border border-primary/10 px-1.5 py-0.2 rounded text-mid/60 ml-0.5">
                ⌘K
              </kbd>
            </button>

            {/* Global Search Trigger (Mobile icon) */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="sm:hidden w-8 h-8 rounded-full border border-primary/10 bg-white/80 flex items-center justify-center text-mid hover:text-primary hover:border-accent/40 transition-all cursor-pointer"
              aria-label="Open self-help search"
              title="Search self-help resources"
            >
              <Search size={14} />
            </button>

            <div className="hidden sm:block h-4 w-px bg-primary/10 mx-0.5" />

            {/* Support Quick Link */}
            <button 
              type="button"
              onClick={() => handleNavigate('/support')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg border text-[10.5px] sm:text-[11px] font-bold tracking-wider uppercase transition-all cursor-pointer shrink-0 ${
                activeTab === 'support' 
                  ? 'bg-accent border-accent text-white shadow-2xs' 
                  : 'bg-supporting/20 border-supporting/40 text-primary hover:bg-supporting/30'
              }`}
              aria-label="Crisis Support and Helplines"
            >
              Support
            </button>

            {/* Account & Settings Avatar */}
            <button 
              type="button"
              onClick={() => handleNavigate('/settings')}
              className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                activeTab === 'settings' 
                  ? 'bg-accent border-accent text-white shadow-2xs' 
                  : 'bg-white-paper border-primary/10 text-mid hover:border-accent/40'
              }`}
              title="Account & Settings"
              aria-label="Account and Settings"
            >
              <User size={15} />
            </button>
          </div>
        </div>
      </header>

      {/* GLOBAL SEARCH MODAL */}
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* MOBILE BOTTOM NAVIGATION BAR (Home, Write, Reports, More) */}
      <nav 
        aria-label="Primary mobile navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-warm-paper/95 backdrop-blur-md border-t border-primary/10 grid grid-cols-4 items-center py-1 shadow-[0_-4px_24px_rgba(40,61,56,0.06)] px-1 pb-safe"
      >
        {/* 1. Home */}
        <button 
          type="button"
          onClick={() => handleNavigate('/dashboard')} 
          className={`flex flex-col items-center justify-center py-1.5 transition-all cursor-pointer border-none bg-transparent relative ${
            ['home', 'dashboard'].includes(activeTab) ? 'text-accent font-semibold' : 'text-mid/60 hover:text-primary font-medium'
          }`}
          aria-label="Home dashboard"
          aria-current={['home', 'dashboard'].includes(activeTab) ? 'page' : undefined}
        >
          <Home size={19} className={['home', 'dashboard'].includes(activeTab) ? 'text-accent mb-0.5' : 'text-mid/60 mb-0.5'} />
          <span className="text-[10px] tracking-wider uppercase">Home</span>
          {['home', 'dashboard'].includes(activeTab) && (
            <div className="absolute bottom-0 w-1.5 h-1 rounded-full bg-accent" />
          )}
        </button>

        {/* 2. Write */}
        <button 
          type="button"
          onClick={() => handleNavigate('/write')} 
          className={`flex flex-col items-center justify-center py-1.5 transition-all cursor-pointer border-none bg-transparent relative ${
            activeTab === 'write' ? 'text-accent font-semibold' : 'text-mid/60 hover:text-primary font-medium'
          }`}
          aria-label="Write journal entry"
          aria-current={activeTab === 'write' ? 'page' : undefined}
        >
          <PenLine size={19} className={activeTab === 'write' ? 'text-accent mb-0.5' : 'text-mid/60 mb-0.5'} />
          <span className="text-[10px] tracking-wider uppercase">Write</span>
          {activeTab === 'write' && (
            <div className="absolute bottom-0 w-1.5 h-1 rounded-full bg-accent" />
          )}
        </button>

        {/* 3. Reports */}
        <button 
          type="button"
          onClick={() => handleNavigate('/reports')} 
          className={`flex flex-col items-center justify-center py-1.5 transition-all cursor-pointer border-none bg-transparent relative ${
            activeTab === 'reports' ? 'text-accent font-semibold' : 'text-mid/60 hover:text-primary font-medium'
          }`}
          aria-label="Reports and reflections"
          aria-current={activeTab === 'reports' ? 'page' : undefined}
        >
          <FileText size={19} className={activeTab === 'reports' ? 'text-accent mb-0.5' : 'text-mid/60 mb-0.5'} />
          <span className="text-[10px] tracking-wider uppercase">Reports</span>
          {activeTab === 'reports' && (
            <div className="absolute bottom-0 w-1.5 h-1 rounded-full bg-accent" />
          )}
        </button>

        {/* 4. More */}
        <button 
          type="button"
          onClick={() => setIsMoreOpen((prev) => !prev)} 
          className={`flex flex-col items-center justify-center py-1.5 transition-all cursor-pointer border-none bg-transparent relative ${
            (isMoreOpen || isMoreActive) ? 'text-accent font-semibold' : 'text-mid/60 hover:text-primary font-medium'
          }`}
          aria-label="More destinations and tools"
          aria-expanded={isMoreOpen}
        >
          <MoreHorizontal size={19} className={(isMoreOpen || isMoreActive) ? 'text-accent mb-0.5' : 'text-mid/60 mb-0.5'} />
          <span className="text-[10px] tracking-wider uppercase">More</span>
          {(isMoreOpen || isMoreActive) && (
            <div className="absolute bottom-0 w-1.5 h-1 rounded-full bg-accent" />
          )}
        </button>
      </nav>

      {/* MORE MENU DRAWER / BOTTOM SHEET */}
      <AnimatePresence>
        {isMoreOpen && (
          <div className="fixed inset-0 z-[100] flex flex-col justify-end md:justify-center md:items-center">
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMoreOpen(false)}
              className="fixed inset-0 bg-[#1E2A2E]/40 backdrop-blur-sm cursor-pointer"
              aria-hidden="true"
            />

            {/* Slide-Up Panel / Modal Container */}
            <motion.div
              initial={{ y: '100%', opacity: 0.9 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="relative w-full md:max-w-[560px] max-h-[88vh] bg-warm-paper rounded-t-3xl md:rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-primary/10 z-[101]"
              role="dialog"
              aria-modal="true"
              aria-label="More navigation and features"
            >
              {/* Top Drag Handle (Mobile only) */}
              <div className="md:hidden pt-3 pb-1 flex justify-center">
                <div className="w-10 h-1 rounded-full bg-primary/20" />
              </div>

              {/* Header */}
              <div className="px-5 py-3.5 border-b border-primary/10 flex items-center justify-between gap-3 bg-white/60 shrink-0">
                <div className="text-left">
                  <h2 className="font-serif text-lg text-primary font-normal leading-tight">Explore Ingress Within</h2>
                  <p className="text-[11.5px] text-mid">All tools, practices, and settings</p>
                </div>
                
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setIsMoreOpen(false);
                      setIsSearchOpen(true);
                    }}
                    className="p-2 rounded-full hover:bg-primary/5 text-mid hover:text-primary transition-colors cursor-pointer"
                    title="Search self-help resources"
                    aria-label="Search resources"
                  >
                    <Search size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsMoreOpen(false)}
                    className="p-2 rounded-full hover:bg-primary/5 text-mid hover:text-primary transition-colors cursor-pointer"
                    aria-label="Close menu"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Scrollable Destinations Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-left">
                
                {/* 1. Self-Discovery & Reflection */}
                <div className="bg-white/70 border border-primary/8 rounded-2xl p-3 sm:p-4 space-y-1 shadow-2xs">
                  <div className="text-[9.5px] font-bold uppercase tracking-widest text-secondary px-2 pb-1.5">
                    Self-Discovery &amp; Reflection
                  </div>

                  {/* Patterns */}
                  <button
                    type="button"
                    onClick={() => handleNavigate('/patterns')}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all cursor-pointer border ${
                      activeTab === 'patterns' 
                        ? 'bg-accent/10 border-accent/20 text-accent font-semibold' 
                        : 'border-transparent hover:bg-primary/5 text-primary'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-[#8DBFB4]/15 text-[#1A5040] flex items-center justify-center shrink-0">
                        <TrendingUp size={16} />
                      </div>
                      <div className="text-left truncate">
                        <div className="text-[13px] font-medium leading-tight">Behavioral Patterns</div>
                        <div className="text-[11px] text-mid leading-snug truncate">Recurring emotional loops &amp; cognitive shifts</div>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-mid/60 shrink-0" />
                  </button>

                  {/* Guided Writing */}
                  <button
                    type="button"
                    onClick={() => handleNavigate('/write/guided')}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl border border-transparent hover:bg-primary/5 text-primary transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-[#E0A898]/15 text-[#8A3020] flex items-center justify-center shrink-0">
                        <Sparkles size={16} />
                      </div>
                      <div className="text-left truncate">
                        <div className="text-[13px] font-medium leading-tight">Guided Journaling</div>
                        <div className="text-[11px] text-mid leading-snug truncate">Structured step-by-step reflection prompts</div>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-mid/60 shrink-0" />
                  </button>

                  {/* Reflection Threads */}
                  <button
                    type="button"
                    onClick={() => handleNavigate('/threads')}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all cursor-pointer border ${
                      activeTab === 'threads' 
                        ? 'bg-accent/10 border-accent/20 text-accent font-semibold' 
                        : 'border-transparent hover:bg-primary/5 text-primary'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-[#5A4A8A]/12 text-[#5A4A8A] flex items-center justify-center shrink-0">
                        <MessageSquare size={16} />
                      </div>
                      <div className="text-left truncate">
                        <div className="text-[13px] font-medium leading-tight">Inquiry Threads</div>
                        <div className="text-[11px] text-mid leading-snug truncate">Answer deep contemplation questions</div>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-mid/60 shrink-0" />
                  </button>

                  {/* Emotional Vocabulary */}
                  <button
                    type="button"
                    onClick={() => handleNavigate('/vocab')}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all cursor-pointer border ${
                      activeTab === 'vocab' 
                        ? 'bg-accent/10 border-accent/20 text-accent font-semibold' 
                        : 'border-transparent hover:bg-primary/5 text-primary'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-[#8DBFB4]/15 text-[#1A5040] flex items-center justify-center shrink-0">
                        <Smile size={16} />
                      </div>
                      <div className="text-left truncate">
                        <div className="text-[13px] font-medium leading-tight">Emotional Vocabulary</div>
                        <div className="text-[11px] text-mid leading-snug truncate">Track nuanced feelings and words across cycles</div>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-mid/60 shrink-0" />
                  </button>
                </div>

                {/* 2. Practice & Exercises */}
                <div className="bg-white/70 border border-primary/8 rounded-2xl p-3 sm:p-4 space-y-1 shadow-2xs">
                  <div className="text-[9.5px] font-bold uppercase tracking-widest text-secondary px-2 pb-1.5">
                    Practice &amp; Interactive Tools
                  </div>

                  {/* Practice / Interventions */}
                  <button
                    type="button"
                    onClick={() => handleNavigate('/interventions')}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all cursor-pointer border ${
                      activeTab === 'interventions' 
                        ? 'bg-accent/10 border-accent/20 text-accent font-semibold' 
                        : 'border-transparent hover:bg-primary/5 text-primary'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-[#8DBFB4]/15 text-[#1A5040] flex items-center justify-center shrink-0">
                        <Compass size={16} />
                      </div>
                      <div className="text-left truncate">
                        <div className="text-[13px] font-medium leading-tight">Practice &amp; Interventions</div>
                        <div className="text-[11px] text-mid leading-snug truncate">35 somatic, grounding &amp; CBT micro-practices</div>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-mid/60 shrink-0" />
                  </button>

                  {/* Exercises & Assessment */}
                  <button
                    type="button"
                    onClick={() => handleNavigate('/exercise')}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all cursor-pointer border ${
                      activeTab === 'exercise' 
                        ? 'bg-accent/10 border-accent/20 text-accent font-semibold' 
                        : 'border-transparent hover:bg-primary/5 text-primary'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-[#E0A898]/15 text-[#8A3020] flex items-center justify-center shrink-0">
                        <Target size={16} />
                      </div>
                      <div className="text-left truncate">
                        <div className="text-[13px] font-medium leading-tight">Therapeutic Exercises</div>
                        <div className="text-[11px] text-mid leading-snug truncate">Avoidance audit, body signals, &amp; assessments</div>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-mid/60 shrink-0" />
                  </button>
                </div>

                {/* 3. Learning & Psychoeducation */}
                <div className="bg-white/70 border border-primary/8 rounded-2xl p-3 sm:p-4 space-y-1 shadow-2xs">
                  <div className="text-[9.5px] font-bold uppercase tracking-widest text-secondary px-2 pb-1.5">
                    Learning &amp; Psychoeducation
                  </div>

                  {/* Knowledge Bank */}
                  <button
                    type="button"
                    onClick={() => handleNavigate('/knowledge')}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all cursor-pointer border ${
                      activeTab === 'knowledge' 
                        ? 'bg-accent/10 border-accent/20 text-accent font-semibold' 
                        : 'border-transparent hover:bg-primary/5 text-primary'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-[#5A4A8A]/12 text-[#5A4A8A] flex items-center justify-center shrink-0">
                        <BookOpen size={16} />
                      </div>
                      <div className="text-left truncate">
                        <div className="text-[13px] font-medium leading-tight">Knowledge Bank</div>
                        <div className="text-[11px] text-mid leading-snug truncate">Clinical mental health concepts &amp; evidence guides</div>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-mid/60 shrink-0" />
                  </button>

                  {/* AI & Data Privacy */}
                  <button
                    type="button"
                    onClick={() => handleNavigate('/ai-data')}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl border border-transparent hover:bg-primary/5 text-primary transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-[#8DBFB4]/15 text-[#1A5040] flex items-center justify-center shrink-0">
                        <ShieldCheck size={16} />
                      </div>
                      <div className="text-left truncate">
                        <div className="text-[13px] font-medium leading-tight">Your Data &amp; AI Promises</div>
                        <div className="text-[11px] text-mid leading-snug truncate">Zero AI training, encrypted storage &amp; deletion</div>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-mid/60 shrink-0" />
                  </button>
                </div>

                {/* 4. Account, Care & Support */}
                <div className="bg-white/70 border border-primary/8 rounded-2xl p-3 sm:p-4 space-y-1 shadow-2xs">
                  <div className="text-[9.5px] font-bold uppercase tracking-widest text-secondary px-2 pb-1.5">
                    Account, Care &amp; Support
                  </div>

                  {/* Settings */}
                  <button
                    type="button"
                    onClick={() => handleNavigate('/settings')}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all cursor-pointer border ${
                      activeTab === 'settings' 
                        ? 'bg-accent/10 border-accent/20 text-accent font-semibold' 
                        : 'border-transparent hover:bg-primary/5 text-primary'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-primary/5 text-primary flex items-center justify-center shrink-0">
                        <Settings size={16} />
                      </div>
                      <div className="text-left truncate">
                        <div className="text-[13px] font-medium leading-tight">Settings &amp; Profile</div>
                        <div className="text-[11px] text-mid leading-snug truncate">Billing, notifications, export data &amp; preferences</div>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-mid/60 shrink-0" />
                  </button>

                  {/* Crisis Helplines */}
                  <button
                    type="button"
                    onClick={() => handleNavigate('/support')}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all cursor-pointer border ${
                      activeTab === 'support' 
                        ? 'bg-accent/10 border-accent/20 text-accent font-semibold' 
                        : 'border-transparent hover:bg-primary/5 text-primary'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-[#8A3020]/10 text-[#8A3020] flex items-center justify-center shrink-0">
                        <HeartHandshake size={16} />
                      </div>
                      <div className="text-left truncate">
                        <div className="text-[13px] font-medium leading-tight">Crisis &amp; Support Helplines</div>
                        <div className="text-[11px] text-mid leading-snug truncate">24/7 confidential helplines &amp; immediate support</div>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-mid/60 shrink-0" />
                  </button>

                  {/* Feedback & Bug Reporting */}
                  <button
                    type="button"
                    onClick={() => handleNavigate('/feedback')}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl border border-transparent hover:bg-primary/5 text-primary transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-[#5A4A8A]/12 text-[#5A4A8A] flex items-center justify-center shrink-0">
                        <AlertCircle size={16} />
                      </div>
                      <div className="text-left truncate">
                        <div className="text-[13px] font-medium leading-tight">Feedback &amp; Bug Reports</div>
                        <div className="text-[11px] text-mid leading-snug truncate">Report technical issues or suggest enhancements</div>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-mid/60 shrink-0" />
                  </button>

                  {/* Clinical Support (Therapy) */}
                  <button
                    type="button"
                    onClick={() => handleNavigate('/therapy')}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl border border-transparent hover:bg-primary/5 text-primary transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-[#8DBFB4]/15 text-[#1A5040] flex items-center justify-center shrink-0">
                        <Users size={16} />
                      </div>
                      <div className="text-left truncate">
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-medium leading-tight">1-on-1 Clinical Care</span>
                          <span className="text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.2 rounded bg-accent/15 text-accent">
                            Coming Soon
                          </span>
                        </div>
                        <div className="text-[11px] text-mid leading-snug truncate">Matched licensed therapist integration</div>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-mid/60 shrink-0" />
                  </button>
                </div>

                {/* Emergency Crisis Contact Strip */}
                <div className="bg-[#F0F3F2] border border-[#1E2A2E]/8 rounded-xl p-3.5 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-[#8A3020] flex items-center gap-1.5">
                      <PhoneCall size={12} />
                      <span>Immediate Emergency Support</span>
                    </div>
                    <div className="text-[11.5px] text-mid mt-0.5">
                      Tele-MANAS: <a href="tel:14416" className="font-semibold text-primary underline">14416</a> · Support: <a href={`tel:${SUPPORT_CONFIG.temporaryContactNumberRaw}`} className="font-semibold text-primary underline">{SUPPORT_CONFIG.temporaryContactNumber}</a>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleNavigate('/support')}
                    className="px-2.5 py-1 rounded-lg bg-white border border-[#1E2A2E]/10 text-[10.5px] font-bold uppercase tracking-wider text-primary hover:bg-[#1E2A2E]/5 shrink-0 transition-colors"
                  >
                    Helplines
                  </button>
                </div>

              </div>

              {/* Close Button Footer */}
              <div className="p-3 border-t border-primary/10 bg-white/50 shrink-0 flex justify-center">
                <button
                  type="button"
                  onClick={() => setIsMoreOpen(false)}
                  className="px-6 py-2 rounded-xl bg-primary text-white hover:bg-[#283D38] text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer shadow-xs"
                >
                  Close Menu
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
