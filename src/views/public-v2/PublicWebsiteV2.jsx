import { useState } from 'react';
import { motion } from 'framer-motion';
import WatercolorBackground from '../../components/public-v2/WatercolorBackground';
import EditorialNavbar from '../../components/public-v2/EditorialNavbar';
import ThreeWaysSection from '../../components/public-v2/ThreeWaysSection';
import AIHumanBoundaryDiagram from '../../components/public-v2/AIHumanBoundaryDiagram';
import DashboardScrollPreview from '../../components/public-v2/DashboardScrollPreview';
import PublicFooter from '../../components/public-v2/PublicFooter';
import { getCardEmergence } from '../../utils/cardEmergence';

/**
 * Ingress Within Public Website UI V2
 * Complete transformation of the source HTML content into the premium editorial /
 * watercolour / psychological self-reflection design system shown in reference screenshots.
 */
export default function PublicWebsiteV2({ initialTab = 'home', onOpenPolicy }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedChips, setSelectedChips] = useState(new Set());
  const [orientDate, setOrientDate] = useState('');
  const [orientTime, setOrientTime] = useState('10:00 AM');
  const [bookingNotice, setBookingNotice] = useState('');

  const [prevInitialTab, setPrevInitialTab] = useState(initialTab);
  if (initialTab !== prevInitialTab) {
    setPrevInitialTab(initialTab);
    setActiveTab(initialTab);
  }

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    if (typeof window !== 'undefined') {
      const urlMap = {
        home: '/',
        solution: '/solution',
        how: '/how-it-works',
        pricing: '/pricing',
        ai: '/ai-data',
        evidence: '/evidence',
        about: '/about',
        policies: '/policies',
        start: '/start',
        crisis: '/crisis'
      };
      const newPath = urlMap[tabId] || `/${tabId}`;
      window.history.pushState({}, '', newPath);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const toggleFamiliarChip = (chip) => {
    const next = new Set(selectedChips);
    if (next.has(chip)) next.delete(chip);
    else next.add(chip);
    setSelectedChips(next);
  };

  const handleAuthRedirect = (e) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  // -------------------------------------------------------------
  // TAB 1: HOME
  // -------------------------------------------------------------
  const renderHome = () => (
    <div className="space-y-0">
      
      {/* 1. HERO SECTION WITH STICKY TEXT & COVERING DASHBOARD */}
      <section className="relative w-full pb-20 sm:pb-32">
        
        {/* Sticky Hero Header Container (Stays pinned at top-20 while dashboard slides over it) */}
        <div className="sticky top-20 sm:top-24 z-10 pt-10 sm:pt-14 pb-8 px-5 sm:px-8 max-w-4xl mx-auto text-center space-y-6 pointer-events-auto">
          
          {/* Brand Eyebrow with Official Logo Mark & Tagline */}
          <div className="inline-flex items-center gap-2.5 font-mono-code text-[10.5px] sm:text-[11.5px] tracking-[0.2em] uppercase text-[#795663] font-semibold bg-[#FDFBF8] border border-[#E7DECF] shadow-xs px-4.5 py-2 rounded-full mb-1">
            <img
              src="/logo-mark-transparent.png"
              alt="Ingress Within Logo"
              className="w-4 h-4 sm:w-5 sm:h-5 object-contain"
            />
            <span>UNDERSTAND · GROW · CONTINUE</span>
          </div>

          {/* Headline matching user reference image */}
          <h1 className="font-editorial text-4xl sm:text-6xl md:text-[68px] text-[#162723] font-normal tracking-tight leading-[1.08] max-w-4xl mx-auto">
            Whatever brings you here, <br className="hidden sm:inline" />
            <span className="italic text-[#795663]">you can start there.</span>
          </h1>

          {/* Subtitle from user reference */}
          <p className="font-zen text-base sm:text-lg md:text-xl text-[#5C6873] max-w-2xl mx-auto leading-relaxed pt-2">
            A continuous psychological growth ecosystem that brings together self-guided learning, therapist support and AI guidance, all in one place.
          </p>

          {/* Dual Action CTAs */}
          <div className="pt-5 flex flex-wrap items-center justify-center gap-4">
            <a
              href="/login"
              onClick={handleAuthRedirect}
              className="inline-flex items-center gap-2 bg-[#203631] hover:bg-[#162723] text-white font-zen text-sm sm:text-[15px] font-medium px-8 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer"
            >
              <span>Take the first step</span>
              <span className="text-base">→</span>
            </a>
            <button
              type="button"
              onClick={() => handleSelectTab('how')}
              className="inline-flex items-center gap-3 bg-[#FAF7F2] hover:bg-white text-[#162723] border border-[#E7DECF] font-zen text-sm sm:text-[15px] font-medium px-6 py-3 rounded-full shadow-2xs hover:shadow-xs transition-all cursor-pointer"
            >
              <span className="w-8 h-8 rounded-full border border-[#162723]/30 flex items-center justify-center text-xs bg-white text-[#162723]">
                ▶
              </span>
              <span>See how it works</span>
            </button>
          </div>
        </div>

        {/* Dashboard Rising Up and Covering the Sticky Hero Text */}
        <div className="relative z-20 max-w-5xl lg:max-w-6xl mx-auto px-3 sm:px-6 w-full pt-8 sm:pt-14">
          <DashboardScrollPreview onActionClick={handleAuthRedirect} />
        </div>
      </section>

      {/* 2. SECTION 02: THREE WAYS TO WORK ON YOUR MENTAL HEALTH */}
      <ThreeWaysSection onSelectTab={handleSelectTab} />

      {/* 7. SOUND FAMILIAR? (With Staggered Floating Chips Scroll Reveal) */}
      <section className="py-20 md:py-24 px-5 sm:px-8 bg-[#FAF7F2] overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto text-center space-y-6"
        >
          <div className="font-mono-code text-[10.5px] sm:text-[11px] tracking-[0.18em] uppercase text-[#7D8E87] font-semibold">
            SOUND FAMILIAR?
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl text-[#162723] font-normal leading-snug">
            Most of this starts as ordinary life, not a clinical complaint.
          </h2>
          <div className="pt-4 flex flex-wrap justify-center gap-3">
            {[
              '"Log kya kahenge"',
              '"Beta, adjust kar lo"',
              'Saying yes when you mean no',
              'Being the strong one for everyone else',
              'Guilt about resting'
            ].map((chip, idx) => {
              const active = selectedChips.has(chip);
              return (
                <motion.button
                  key={chip}
                  type="button"
                  initial={{ opacity: 0, y: 20, scale: 0.92 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.06 * idx }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => toggleFamiliarChip(chip)}
                  className={`font-zen text-xs sm:text-[13.5px] px-5 py-2.5 rounded-full border transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#795663] text-white border-transparent shadow-sm'
                      : 'bg-white text-[#162723] border-[#E7DECF] hover:border-[#795663]/40'
                  }`}
                >
                  {chip}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* 8. WHY PEOPLE START HERE (3 Cards Splitting Animation) */}
      <section className="py-20 md:py-28 px-5 sm:px-8 bg-[#FDFBF8] border-t border-[#E7DECF]/80 overflow-hidden">
        <div className="max-w-5xl mx-auto space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="text-center space-y-3"
          >
            <div className="font-mono-code text-[10.5px] sm:text-[11px] tracking-[0.18em] uppercase text-[#7D8E87] font-semibold">
              WHY PEOPLE START HERE
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl text-[#162723] font-normal">
              Three common starting points.
            </h2>
          </motion.div>

          {/* 3 Quote Cards: Odd total (3) -> Center card 1 anchors, Cards 0 and 2 emerge out from the center */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <motion.div
              {...getCardEmergence(0, 3)}
              className="paper-card paper-card-hover rounded-xl p-7 bg-[#FAF7F2] hover:bg-white border border-[#E7DECF] hover:border-[#795663]/40 space-y-3 shadow-2xs hover:shadow-md transition-shadow transition-colors duration-200 cursor-pointer"
            >
              <div className="font-editorial text-base text-[#162723] font-semibold leading-snug">
                "I just want to understand myself first."
              </div>
              <p className="font-zen text-xs text-[#5C6873] leading-relaxed">
                Not ready for therapy, but want more than guessing at why they feel a certain way.
              </p>
            </motion.div>

            <motion.div
              {...getCardEmergence(1, 3)}
              className="paper-card paper-card-hover rounded-xl p-7 bg-[#FAF7F2] hover:bg-white border border-[#E7DECF] hover:border-[#795663]/40 space-y-3 shadow-2xs hover:shadow-md transition-shadow transition-colors duration-200 cursor-pointer"
            >
              <div className="font-editorial text-base text-[#162723] font-semibold leading-snug">
                "I don't want to repeat my whole story again."
              </div>
              <p className="font-zen text-xs text-[#5C6873] leading-relaxed">
                Been to therapy before, tired of starting from zero with someone new.
              </p>
            </motion.div>

            <motion.div
              {...getCardEmergence(2, 3)}
              className="paper-card paper-card-hover rounded-xl p-7 bg-[#FAF7F2] hover:bg-white border border-[#E7DECF] hover:border-[#795663]/40 space-y-3 shadow-2xs hover:shadow-md transition-shadow transition-colors duration-200 cursor-pointer"
            >
              <div className="font-editorial text-base text-[#162723] font-semibold leading-snug">
                "I have a therapist, but weeks in between feel unsupported."
              </div>
              <p className="font-zen text-xs text-[#5C6873] leading-relaxed">
                Wants somewhere to put thoughts down between sessions.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 9. A QUICK LOOK (3 Steps Flow: Odd total (3) -> Center Step 02 anchors, Steps 01 and 03 emerge out from center) */}
      <section className="py-20 md:py-24 px-5 sm:px-8 bg-[#FAF7F2] overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-3"
          >
            <div className="font-mono-code text-[10.5px] sm:text-[11px] tracking-[0.18em] uppercase text-[#7D8E87] font-semibold">
              A QUICK LOOK
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl text-[#162723] font-normal">
              From a journal entry to a clearer pattern, in three steps.
            </h2>
          </motion.div>

          {/* 3 Step Flow Container */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="paper-card rounded-2xl p-6 sm:p-10 bg-white border border-[#E7DECF] shadow-xs"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              {/* Step 01: Emerges out to the left from center Step 02 */}
              <motion.div
                {...getCardEmergence(0, 3)}
                className="p-6 sm:p-7 rounded-2xl bg-[#FAF7F2] hover:bg-white border border-[#E7DECF] hover:border-[#795663]/40 text-center space-y-2.5 shadow-2xs hover:shadow-md transition-shadow transition-colors duration-200 cursor-pointer flex flex-col justify-center"
              >
                <span className="font-mono-code text-xs text-[#B8964A] font-bold tracking-wider">01</span>
                <div className="font-editorial text-xl text-[#162723]">Write</div>
                <p className="font-zen text-xs sm:text-[13px] text-[#5C6873] leading-relaxed">
                  A few minutes a day, guided or free-flow.
                </p>
              </motion.div>

              {/* Step 02: Center anchor card */}
              <motion.div
                {...getCardEmergence(1, 3)}
                className="p-6 sm:p-7 rounded-2xl bg-[#FAF7F2] hover:bg-white border border-[#E7DECF] hover:border-[#795663]/40 text-center space-y-2.5 shadow-2xs hover:shadow-md transition-shadow transition-colors duration-200 cursor-pointer flex flex-col justify-center"
              >
                <span className="font-mono-code text-xs text-[#B8964A] font-bold tracking-wider">02</span>
                <div className="font-editorial text-xl text-[#162723]">See the report</div>
                <p className="font-zen text-xs sm:text-[13px] text-[#5C6873] leading-relaxed">
                  Weekly summary surfaces themes and words.
                </p>
              </motion.div>

              {/* Step 03: Emerges out to the right from center Step 02 */}
              <motion.div
                {...getCardEmergence(2, 3)}
                className="p-6 sm:p-7 rounded-2xl bg-[#FAF7F2] hover:bg-white border border-[#E7DECF] hover:border-[#795663]/40 text-center space-y-2.5 shadow-2xs hover:shadow-md transition-shadow transition-colors duration-200 cursor-pointer flex flex-col justify-center"
              >
                <span className="font-mono-code text-xs text-[#B8964A] font-bold tracking-wider">03</span>
                <div className="font-editorial text-xl text-[#162723]">Understand, act</div>
                <p className="font-zen text-xs sm:text-[13px] text-[#5C6873] leading-relaxed">
                  Conscious choices aligned with your values.
                </p>
              </motion.div>
            </div>

            <div className="pt-6">
              <button
                type="button"
                onClick={() => handleSelectTab('how')}
                className="text-xs sm:text-sm font-editorial text-[#795663] hover:underline font-medium cursor-pointer"
              >
                See the full walkthrough, including therapy →
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 10. PRICING IN SHORT: Even total (2 cards) -> Both split smoothly from the center outward */}
      <section className="py-20 md:py-28 px-5 sm:px-8 bg-[#FDFBF8] border-t border-[#E7DECF] overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="text-center space-y-3"
          >
            <div className="font-mono-code text-[10.5px] sm:text-[11px] tracking-[0.18em] uppercase text-[#7D8E87] font-semibold">
              PRICING, IN SHORT
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl text-[#162723] font-normal">
              Simple, transparent, in rupees.
            </h2>
          </motion.div>

          {/* Two Pricing Cards: Even total (2) -> Both split smoothly from the center outward */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {/* Plan 1: Starts at center line (+80px) and splits smoothly out to left */}
            <motion.div
              {...getCardEmergence(0, 2)}
              className="paper-card paper-card-hover rounded-2xl p-8 bg-white border border-[#E7DECF] hover:border-[#795663]/40 flex flex-col justify-between space-y-6 shadow-xs hover:shadow-md transition-shadow transition-colors duration-200 cursor-pointer"
            >
              <div>
                <span className="font-mono-code text-[10px] tracking-wider uppercase font-semibold text-[#5C7D64]">
                  Ingress Within Self-Work
                </span>
                <div className="flex items-baseline gap-2 mt-3">
                  <span className="font-mono-code text-4xl text-[#795663] font-semibold">₹499</span>
                  <span className="font-zen text-xs text-[#5C6873]">/ month (GST inclusive)</span>
                </div>
                <p className="font-zen text-xs text-[#5C6873] leading-relaxed pt-3">
                  Journal, weekly & monthly reports included. Psychoeducation modules purchased separately, only when relevant.
                </p>
              </div>
              <a
                href="/login"
                onClick={handleAuthRedirect}
                className="w-full text-center py-3 bg-[#FAF7F2] hover:bg-white text-[#162723] border border-[#E7DECF] rounded-full text-xs font-semibold cursor-pointer transition-colors"
              >
                Write your first entry →
              </a>
            </motion.div>

            {/* Plan 2: Starts at center line (-80px) and splits smoothly out to right */}
            <motion.div
              {...getCardEmergence(1, 2)}
              className="paper-card paper-card-hover rounded-2xl p-8 bg-white border-2 border-[#795663]/40 hover:border-[#795663] flex flex-col justify-between space-y-6 shadow-xs hover:shadow-md transition-shadow transition-colors duration-200 cursor-pointer"
            >
              <div>
                <span className="font-mono-code text-[10px] tracking-wider uppercase font-semibold text-[#795663]">
                  THERAPIST COLLABORATION
                </span>
                <div className="flex items-baseline gap-2 mt-3">
                  <span className="font-mono-code text-4xl text-[#162723] font-semibold">From ₹999</span>
                  <span className="font-zen text-xs text-[#5C6873]">/ session</span>
                </div>
                <p className="font-zen text-xs text-[#5C6873] leading-relaxed pt-3">
                  Licensed, verified therapists. Shared milestone dashboards and homework continuity. No lock-in packages.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleSelectTab('start')}
                className="w-full text-center py-3 bg-[#795663] hover:bg-[#654652] text-white rounded-full text-xs font-semibold cursor-pointer shadow-xs transition-colors"
              >
                Book your first session →
              </button>
            </motion.div>
          </div>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => handleSelectTab('pricing')}
              className="text-xs sm:text-sm font-editorial text-[#795663] hover:underline font-medium cursor-pointer"
            >
              See full pricing details →
            </button>
          </div>
        </div>
      </section>

      {/* 11. PHILOSOPHY / CLOSING STATEMENT BAND */}
      <section className="py-24 px-5 sm:px-8 bg-[#011627] text-white text-center relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 35, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto space-y-5 relative z-10"
        >
          <div className="inline-block font-mono-code text-[10.5px] tracking-[0.2em] uppercase text-[#B8964A] font-semibold bg-white/10 px-4 py-1.5 rounded-full">
            UNDERSTAND. GROW. CONTINUE.
          </div>
          <h2 className="font-editorial text-3xl sm:text-5xl font-normal leading-tight text-white">
            The philosophy behind the platform: not a sequence you have to follow.
          </h2>
          <p className="font-zen text-sm sm:text-base text-[#C7CDD3] max-w-xl mx-auto leading-relaxed pt-2">
            You might start with therapy. You might start by practising. You might just want to know what's going on. Ingress Within meets you where you are.
          </p>
          <div className="pt-4">
            <a
              href="/login"
              onClick={handleAuthRedirect}
              className="inline-flex items-center gap-2 bg-white text-[#011627] hover:bg-[#FAF7F2] font-zen text-sm font-semibold px-7 py-3 rounded-full transition-all cursor-pointer shadow-sm hover:scale-[1.02]"
            >
              <span>Begin your reflection</span>
              <span>→</span>
            </a>
          </div>
        </motion.div>
      </section>

    </div>
  );

  // -------------------------------------------------------------
  // TAB 2: SOLUTION / WHAT IT IS
  // -------------------------------------------------------------
  const renderSolution = () => (
    <div className="w-full space-y-0">
      
      {/* 1. HERO SECTION (Subtle Parchment Gradient with Watercolor Bleeds & Brushstroke) */}
      <section className="relative w-full py-20 md:py-28 px-5 sm:px-8 bg-gradient-to-b from-[#FAF7F2] via-[#F4EDE2]/45 to-[#FAF7F2] border-b border-[#E7DECF]/80 overflow-hidden">
        {/* Ambient Top-Right Watercolor Wash (Dusty Rose) */}
        <svg
          className="absolute -top-16 -right-20 w-[420px] sm:w-[540px] h-auto opacity-60 pointer-events-none mix-blend-multiply"
          viewBox="0 0 600 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="sol-rose-wash" cx="70%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#C49A8F" stopOpacity="0.38" />
              <stop offset="45%" stopColor="#D9BCAF" stopOpacity="0.22" />
              <stop offset="75%" stopColor="#EFE3DE" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#FAF7F2" stopOpacity="0" />
            </radialGradient>
            <filter id="sol-bleed-1" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="14" />
            </filter>
          </defs>
          <path
            d="M500 40 C410 0 300 50 240 130 C180 210 180 320 230 400 C290 470 410 500 500 460 C580 420 620 320 630 210 C640 120 590 60 500 40 Z"
            fill="url(#sol-rose-wash)"
            filter="url(#sol-bleed-1)"
          />
          <circle cx="210" cy="180" r="3.5" fill="#C49A8F" opacity="0.28" />
          <circle cx="240" cy="220" r="2.5" fill="#C49A8F" opacity="0.22" />
          <circle cx="180" cy="270" r="4" fill="#C49A8F" opacity="0.18" />
        </svg>

        {/* Ambient Top-Left Watercolor Wash (Sage Green) */}
        <svg
          className="absolute -top-12 -left-16 w-[380px] sm:w-[480px] h-auto opacity-55 pointer-events-none mix-blend-multiply"
          viewBox="0 0 550 450"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="sol-sage-wash" cx="30%" cy="25%" r="70%">
              <stop offset="0%" stopColor="#7E9E82" stopOpacity="0.35" />
              <stop offset="50%" stopColor="#96B49A" stopOpacity="0.2" />
              <stop offset="80%" stopColor="#C4D7C7" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#FAF7F2" stopOpacity="0" />
            </radialGradient>
          </defs>
          <path
            d="M80 50 C160 -10 290 20 380 80 C460 130 510 240 460 330 C410 410 290 440 210 420 C130 400 50 340 30 250 C10 160 10 90 80 50 Z"
            fill="url(#sol-sage-wash)"
            filter="url(#sol-bleed-1)"
          />
          <circle cx="410" cy="130" r="4" fill="#8AA688" opacity="0.25" />
          <circle cx="440" cy="160" r="2.5" fill="#8AA688" opacity="0.2" />
        </svg>

        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2.5 font-mono-code text-[11px] tracking-[0.2em] uppercase text-[#795663] font-semibold bg-white/85 backdrop-blur-xs border border-[#E7DECF] shadow-2xs px-4 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#795663]" />
            OUR SOLUTION
          </div>
          
          <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-[#162723] font-normal leading-[1.12] max-w-3xl mx-auto">
            One platform. Different ways to work on your mental health.
          </h1>

          <p className="font-zen text-base sm:text-lg text-[#5C6873] leading-relaxed max-w-2xl mx-auto">
            Some people just want to understand themselves better. Some want a therapist. Some want both, at different times. Here is what each path looks like in practice.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => {
                const el = document.getElementById('sol-independent');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-mono-code font-semibold tracking-wider uppercase bg-[#162723] text-white hover:bg-[#203631] transition-all cursor-pointer shadow-xs"
            >
              <span>Explore Self-Work</span>
              <span>&rarr;</span>
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('sol-collaborative');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-mono-code font-medium tracking-wider uppercase bg-white/90 border border-[#E7DECF] text-[#162723] hover:border-[#795663] transition-all cursor-pointer shadow-2xs"
            >
              <span>Explore Therapy</span>
              <span>&darr;</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. SECTION 01: INDEPENDENT INQUIRY (Subtle Warm Paper with Sage Wash) */}
      <section id="sol-independent" className="relative w-full py-20 md:py-28 px-5 sm:px-8 bg-[#FAF7F2]/85 border-b border-[#E7DECF]/75 overflow-hidden">
        {/* Subtle watercolor accent bleed */}
        <div className="absolute top-1/2 -right-24 w-80 h-80 rounded-full bg-[#8AA688]/10 blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto space-y-10 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-3xl mx-auto space-y-3"
          >
            <div className="inline-flex items-center gap-2 font-mono-code text-[11px] uppercase tracking-wider text-[#2E7A70] bg-[#EAF2ED] px-3.5 py-1 rounded-full font-semibold border border-[#8AA688]/25">
              <span>●</span> INDEPENDENT INQUIRY
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl lg:text-[42px] text-[#162723] font-normal leading-tight mx-auto">
              Write it down. Let the platform show you what you can't see day to day.
            </h2>
          </motion.div>

          {/* 3 Core Pillars: Odd total (3) -> Center card (Reports) anchors, left/right emerge outward */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <motion.div
              {...getCardEmergence(0, 3)}
              className="paper-card paper-card-hover rounded-2xl p-7 sm:p-8 bg-white/95 backdrop-blur-xs border border-[#E7DECF] shadow-[0_6px_24px_rgba(1,22,39,0.03)] space-y-4 hover:border-[#795663]/40 transition-shadow transition-colors duration-200 cursor-pointer"
            >
              <span className="inline-block font-mono-code text-xs text-[#795663] font-bold bg-[#F7EFE9] border border-[#C49A8F]/30 px-3 py-1 rounded-full">
                JOURNAL
              </span>
              <h3 className="font-editorial text-xl text-[#162723] leading-snug">
                Free-flow, or a guided 5-prompt journal.
              </h3>
              <p className="font-zen text-xs sm:text-sm text-[#5C6873] leading-relaxed">
                Write freely about your day, or use the guided journal, which asks what happened, why, and how it affected you: five prompts, a few minutes a day.
              </p>
            </motion.div>

            <motion.div
              {...getCardEmergence(1, 3)}
              className="paper-card paper-card-hover rounded-2xl p-7 sm:p-8 bg-white/95 backdrop-blur-xs border border-[#E7DECF] shadow-[0_6px_24px_rgba(1,22,39,0.03)] space-y-4 hover:border-[#795663]/40 transition-shadow transition-colors duration-200 cursor-pointer"
            >
              <span className="inline-block font-mono-code text-xs text-[#2E7A70] font-bold bg-[#EAF2ED] border border-[#8AA688]/30 px-3 py-1 rounded-full">
                REPORTS
              </span>
              <h3 className="font-editorial text-xl text-[#162723] leading-snug">
                Entries become reports, automatically.
              </h3>
              <p className="font-zen text-xs sm:text-sm text-[#5C6873] leading-relaxed">
                Every Sunday, a weekly report groups entries by theme, surfaces your most frequent emotional words, and notes shifts in tone. Every month, a deeper report connects themes across weeks.
              </p>
            </motion.div>

            <motion.div
              {...getCardEmergence(2, 3)}
              className="paper-card paper-card-hover rounded-2xl p-7 sm:p-8 bg-white/95 backdrop-blur-xs border border-[#E7DECF] shadow-[0_6px_24px_rgba(1,22,39,0.03)] space-y-4 hover:border-[#795663]/40 transition-shadow transition-colors duration-200 cursor-pointer"
            >
              <span className="inline-block font-mono-code text-xs text-[#8C6D23] font-bold bg-[#FDF6E9] border border-[#D4AF37]/35 px-3 py-1 rounded-full">
                PATTERNS
              </span>
              <h3 className="font-editorial text-xl text-[#162723] leading-snug">
                Patterns surfaced early, named clearly.
              </h3>
              <p className="font-zen text-xs sm:text-sm text-[#5C6873] leading-relaxed">
                Interventions explain what a recurring pattern or emotional word might mean, in plain language, as soon as it appears. This part is included, not a paywall. If it's still showing up after about two months, we'll suggest one focused module that speaks directly to it.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. SECTION 02: THE GUIDED JOURNAL & PROGRESS TIMELINE (Subtle Warm Sand with Rose Wash) */}
      <section className="relative w-full py-20 md:py-28 px-5 sm:px-8 bg-gradient-to-b from-[#F5EFE6]/90 via-[#EFE7DC]/70 to-[#F5EFE6]/90 border-b border-[#E7DECF] overflow-hidden">
        {/* Subtle watercolor bleed blob */}
        <div className="absolute -bottom-16 -left-20 w-96 h-96 rounded-full bg-[#C49A8F]/10 blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto space-y-12 relative z-10">
          {/* The 5 Prompts */}
          <div className="space-y-6">
            <div className="text-center max-w-3xl mx-auto space-y-2">
              <div className="inline-flex items-center gap-2 font-mono-code text-[11px] uppercase tracking-wider text-[#795663] font-semibold bg-white/80 border border-[#E7DECF] px-3.5 py-1 rounded-full shadow-2xs">
                <span>●</span> THE GUIDED JOURNAL
              </div>
              <h3 className="font-editorial text-2xl sm:text-3xl text-[#162723] pt-1">
                Five short prompts, so you're not staring at a blank page.
              </h3>
            </div>
            
            {/* 5 Prompts Cards: Odd total (5) -> Center card (03) anchors, others emerge outward */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3.5">
              {['What happened?', 'Why do you think so?', 'How did you react?', 'What did you feel?', 'What would you tell a friend?'].map((p, idx) => (
                <motion.div
                  key={p}
                  {...getCardEmergence(idx, 5)}
                  className="p-5 bg-white/95 rounded-2xl border border-[#E7DECF] shadow-2xs text-left hover:border-[#795663]/40 transition-shadow transition-colors duration-200 flex flex-col justify-between space-y-3 cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-[#F4EDE2] border border-[#E7DECF] flex items-center justify-center font-mono-code text-[11px] font-bold text-[#795663]">
                    0{idx + 1}
                  </div>
                  <p className="font-editorial text-[15px] sm:text-base text-[#162723] leading-snug font-medium">{p}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sample Weekly Report with Watercolor Chips */}
          <div className="paper-card rounded-2xl p-7 sm:p-9 bg-white border border-[#E7DECF] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E7DECF]/80 pb-3 gap-2">
              <span className="font-mono-code text-[11px] uppercase tracking-wider text-[#795663] font-bold">
                SAMPLE WEEKLY REPORT · WEEK 3
              </span>
              <span className="font-mono-code text-xs text-[#5C6873]">5 entries recorded</span>
            </div>
            
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="px-3.5 py-1 rounded-full bg-[#EAF2ED] text-[#2E7A70] font-mono-code text-xs font-medium border border-[#8AA688]/30 shadow-2xs">
                Work / Boundaries (3 entries)
              </span>
              <span className="px-3.5 py-1 rounded-full bg-[#F7EFE9] text-[#795663] font-mono-code text-xs font-medium border border-[#C49A8F]/30 shadow-2xs">
                Guilt (frequent word)
              </span>
              <span className="px-3.5 py-1 rounded-full bg-[#FDF6E9] text-[#8C6D23] font-mono-code text-xs font-medium border border-[#D4AF37]/35 shadow-2xs">
                Evening (most common time)
              </span>
            </div>
            
            <p className="font-zen text-xs sm:text-sm text-[#5C6873] leading-relaxed pt-1">
              <strong className="text-[#162723] font-medium">Recurring loop:</strong> Agreeing to help others at your own cost. <strong className="text-[#162723] font-medium">Suggested focus:</strong> Notice the moment right before you say "yes."
            </p>
          </div>

          {/* How a suggestion forms diagram with enhanced watercolor glow */}
          <div className="paper-card rounded-2xl p-7 sm:p-10 bg-white border border-[#E7DECF] shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div className="font-mono-code text-[11px] uppercase tracking-wider text-[#795663] font-bold">
                HOW A SUGGESTION FORMS
              </div>
              <span className="font-mono-code text-xs text-[#2E7A70] bg-[#EAF2ED] px-3 py-0.5 rounded-full font-medium">
                100% Free longitudinal tracking
              </span>
            </div>
            
            <h3 className="font-editorial text-2xl sm:text-3xl text-[#162723]">
              Free the whole way, until one point.
            </h3>

            <div className="w-full overflow-x-auto pt-2">
              <svg viewBox="0 0 720 230" role="img" aria-label="Chart showing a pattern appearing gently in week one with a free explanation, repeating through week eight, at which point one paid module is suggested" className="w-full min-w-[560px] h-auto">
                <defs>
                  <linearGradient id="chart-line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#7E9E82" />
                    <stop offset="65%" stopColor="#795663" />
                    <stop offset="100%" stopColor="#B8964A" />
                  </linearGradient>
                  <linearGradient id="chart-glow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#7E9E82" stopOpacity="0.12" />
                    <stop offset="65%" stopColor="#795663" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#B8964A" stopOpacity="0.25" />
                  </linearGradient>
                </defs>

                {/* Soft watercolor curve fill */}
                <path d="M50,175 C130,168 180,150 260,140 C340,130 400,110 470,95 C540,80 600,65 650,55 L650,190 L50,190 Z" fill="url(#chart-glow-gradient)"/>

                <line x1="50" y1="190" x2="670" y2="190" stroke="#E7DECF" strokeWidth="1.5"/>
                <path d="M50,175 C130,168 180,150 260,140 C340,130 400,110 470,95 C540,80 600,65 650,55" fill="none" stroke="url(#chart-line-gradient)" strokeWidth="3.5" strokeLinecap="round"/>
                
                <circle cx="50" cy="175" r="5.5" fill="#7E9E82"/>
                <circle cx="260" cy="140" r="5.5" fill="#795663"/>
                <circle cx="470" cy="95" r="5.5" fill="#795663"/>
                <circle cx="650" cy="55" r="7.5" fill="#B8964A" stroke="#fff" strokeWidth="2"/>

                <text x="50" y="210" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#795663" fontWeight="bold">WEEK 1</text>
                <text x="260" y="210" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#7D8E87">WEEK 3</text>
                <text x="470" y="210" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#7D8E87">WEEK 6</text>
                <text x="650" y="210" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#B8964A" fontWeight="bold">WEEK 8</text>

                <text x="50" y="155" textAnchor="middle" fontFamily="Georgia, serif" fontSize="11" fill="#162723" fontStyle="italic">First noticed</text>
                <text x="260" y="120" textAnchor="middle" fontFamily="Georgia, serif" fontSize="11" fill="#162723" fontStyle="italic">Repeating</text>
                <text x="470" y="75" textAnchor="middle" fontFamily="Georgia, serif" fontSize="11" fill="#162723" fontStyle="italic">Intervention shown</text>
                <text x="650" y="35" textAnchor="middle" fontFamily="Georgia, serif" fontSize="11.5" fill="#795663" fontWeight="bold">1 module offered</text>
              </svg>
            </div>

            <p className="font-editorial italic text-xs sm:text-sm text-[#7D8E87] pt-2 border-t border-[#E7DECF]/70">
              Everything on the line is included with your ₹499/month subscription. Only the single point at the end, the module, is a separate, optional purchase.
            </p>
          </div>
        </div>
      </section>

      {/* 4. SECTION 03: COLLABORATIVE CARE (Subtle Warm Paper with Brushstroke) */}
      <section id="sol-collaborative" className="relative w-full py-20 md:py-28 px-5 sm:px-8 bg-[#FAF7F2]/85 border-b border-[#E7DECF]/75 overflow-hidden">
        {/* Subtle watercolor splash */}
        <div className="absolute top-12 -left-20 w-72 h-72 rounded-full bg-[#8AA688]/10 blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto space-y-10 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-3xl mx-auto space-y-3"
          >
            <div className="inline-flex items-center gap-2 font-mono-code text-[11px] uppercase tracking-wider text-[#795663] bg-[#F7EFE9] px-3.5 py-1 rounded-full font-semibold border border-[#C49A8F]/30">
              <span>●</span> COLLABORATIVE CARE
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl lg:text-[42px] text-[#162723] font-normal leading-tight mx-auto">
              Not just the session, but a dashboard that shows the work between sessions too.
            </h2>
          </motion.div>

          {/* 3 Collaborative Care Cards: Odd total (3) -> Center card anchors, left/right emerge outward */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <motion.div
              {...getCardEmergence(0, 3)}
              className="paper-card paper-card-hover rounded-2xl p-7 sm:p-8 bg-white/95 backdrop-blur-xs border border-[#E7DECF] shadow-xs space-y-3 hover:border-[#795663]/40 transition-shadow transition-colors duration-200 cursor-pointer"
            >
              <span className="font-mono-code text-xs text-[#795663] font-bold">YOUR DASHBOARD</span>
              <h3 className="font-editorial text-xl text-[#162723] leading-snug">
                See what happened last session, and what's due next.
              </h3>
              <p className="font-zen text-xs sm:text-sm text-[#5C6873] leading-relaxed">
                A recap of your last session, any homework your therapist assigned, and your goals, so therapy isn't only what you remember from the room.
              </p>
            </motion.div>

            <motion.div
              {...getCardEmergence(1, 3)}
              className="paper-card paper-card-hover rounded-2xl p-7 sm:p-8 bg-white/95 backdrop-blur-xs border border-[#E7DECF] shadow-xs space-y-3 hover:border-[#795663]/40 transition-shadow transition-colors duration-200 cursor-pointer"
            >
              <span className="font-mono-code text-xs text-[#795663] font-bold">THERAPIST-ASSIGNED WORK</span>
              <h3 className="font-editorial text-xl text-[#162723] leading-snug">
                Homework and psychoeducation, set by your therapist.
              </h3>
              <p className="font-zen text-xs sm:text-sm text-[#5C6873] leading-relaxed">
                Your therapist can assign homework and psychoeducation modules directly, tailored to what came up in session.
              </p>
            </motion.div>

            <motion.div
              {...getCardEmergence(2, 3)}
              className="paper-card paper-card-hover rounded-2xl p-7 sm:p-8 bg-white/95 backdrop-blur-xs border border-[#E7DECF] shadow-xs space-y-3 hover:border-[#795663]/40 transition-shadow transition-colors duration-200 cursor-pointer"
            >
              <span className="font-mono-code text-xs text-[#795663] font-bold">CONTINUITY</span>
              <h3 className="font-editorial text-xl text-[#162723] leading-snug">
                Keep your history if the support changes.
              </h3>
              <p className="font-zen text-xs sm:text-sm text-[#5C6873] leading-relaxed">
                Selected goals, session recaps and self-work can move with you when you change therapists.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. SECTION 04: A LOOK AT THE DASHBOARD (Subtle Warm Sand with Dual-Tint Watercolor Cards) */}
      <section className="relative w-full py-20 md:py-28 px-5 sm:px-8 bg-gradient-to-b from-[#F5EFE6]/90 via-[#EFE7DC]/70 to-[#F5EFE6]/90 border-b border-[#E7DECF] overflow-hidden">
        {/* Watercolor wash background drop */}
        <div className="absolute top-1/3 -right-24 w-88 h-88 rounded-full bg-[#7E9E82]/10 blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto space-y-10 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 font-mono-code text-[11px] uppercase tracking-wider text-[#795663] font-bold bg-white/80 border border-[#E7DECF] px-3.5 py-1 rounded-full shadow-2xs">
              <span>●</span> A LOOK AT THE DASHBOARD
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl text-[#162723] mx-auto">
              What you and your therapist both see.
            </h2>
          </div>

          {/* Dual Dashboard Cards: Even total (2) -> Both split smoothly outward from center line */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* Your Side (Rose Wash Tint) */}
            <motion.div
              {...getCardEmergence(0, 2)}
              className="paper-card paper-card-hover rounded-2xl p-7 sm:p-8 bg-white border border-[#E7DECF] shadow-xs space-y-5 border-l-4 border-l-[#C49A8F] hover:border-[#795663]/40 transition-shadow transition-colors duration-200 cursor-pointer"
            >
              <span className="inline-block px-3.5 py-1 rounded-full bg-[#F7EFE9] font-mono-code text-[10.5px] uppercase tracking-wider text-[#795663] font-semibold border border-[#C49A8F]/30">
                YOUR SIDE
              </span>
              <div className="space-y-3.5">
                <div className="p-4.5 rounded-xl bg-[#FAF7F2] border border-[#E7DECF] space-y-1 hover:border-[#795663]/40 transition-colors">
                  <b className="font-editorial text-sm text-[#162723] block">Last session: 12 Aug</b>
                  <p className="font-zen text-xs text-[#5C6873]">
                    Talked through the tension with your manager about weekend calls.
                  </p>
                </div>
                <div className="p-4.5 rounded-xl bg-[#FAF7F2] border border-[#E7DECF] space-y-1 hover:border-[#795663]/40 transition-colors">
                  <b className="font-editorial text-sm text-[#162723] block">Homework due</b>
                  <p className="font-zen text-xs text-[#5C6873]">
                    Write down one moment this week you wanted to say no and didn't.
                  </p>
                </div>
                <div className="p-4.5 rounded-xl bg-[#FAF7F2] border border-[#E7DECF] space-y-1 hover:border-[#795663]/40 transition-colors">
                  <b className="font-editorial text-sm text-[#162723] block">Psychoeducation assigned</b>
                  <p className="font-zen text-xs text-[#5C6873]">
                    Understanding people-pleasing patterns · 8 min read
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Your Therapist's Side (Sage Wash Tint) */}
            <motion.div
              {...getCardEmergence(1, 2)}
              className="paper-card paper-card-hover rounded-2xl p-7 sm:p-8 bg-white border border-[#E7DECF] shadow-xs space-y-5 border-l-4 border-l-[#8AA688] hover:border-[#8AA688]/40 transition-shadow transition-colors duration-200 cursor-pointer"
            >
              <span className="inline-block px-3.5 py-1 rounded-full bg-[#EAF2ED] font-mono-code text-[10.5px] uppercase tracking-wider text-[#2E7A70] font-semibold border border-[#8AA688]/30">
                YOUR THERAPIST'S SIDE
              </span>
              <div className="space-y-3.5">
                <div className="p-4.5 rounded-xl bg-[#FAF7F2] border border-[#E7DECF] space-y-1 hover:border-[#8AA688]/40 transition-colors">
                  <b className="font-editorial text-sm text-[#162723] block">Active client · Week 3 of care</b>
                  <p className="font-zen text-xs text-[#5C6873]">
                    Goal: Boundary-setting at work without residual guilt.
                  </p>
                </div>
                <div className="p-4.5 rounded-xl bg-[#FAF7F2] border border-[#E7DECF] space-y-1 hover:border-[#8AA688]/40 transition-colors">
                  <b className="font-editorial text-sm text-[#162723] block">Homework assigned</b>
                  <p className="font-zen text-xs text-[#5C6873]">
                    Due before Session 4 · 1 entry logged by client
                  </p>
                </div>
                <div className="p-4.5 rounded-xl bg-[#FAF7F2] border border-[#E7DECF] space-y-1 hover:border-[#8AA688]/40 transition-colors">
                  <b className="font-editorial text-sm text-[#162723] block">Client-shared entries</b>
                  <p className="font-zen text-xs text-[#5C6873]">
                    2 journal entries the client chose to share this week
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 6. SECTION 05: PSYCHOEDUCATION LIBRARY (Curated Watercolor Category Badges) */}
      <section className="relative w-full py-20 md:py-28 px-5 sm:px-8 bg-[#FAF7F2]/85 border-b border-[#E7DECF]/75 overflow-hidden">
        <div className="max-w-5xl mx-auto space-y-10 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 font-mono-code text-[11px] uppercase tracking-wider text-[#795663] font-bold bg-[#F7EFE9] px-3.5 py-1 rounded-full border border-[#C49A8F]/30">
              <span>●</span> PSYCHOEDUCATION LIBRARY
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl text-[#162723] mx-auto">
              A few examples of what a module actually covers.
            </h2>
          </div>

          {/* 6 Psychoeducation Modules: Even 2D grid (6 cards) -> Splits smoothly from center in all 4 directions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Understanding people-pleasing patterns',
                desc: 'Why saying yes feels safer than saying no, and how to notice the moment before you agree.',
                tag: 'PEOPLE-PLEASING',
                color: 'bg-[#F7EFE9] text-[#795663] border-[#C49A8F]/30'
              },
              {
                title: 'Managing family expectations',
                desc: 'Working with, not against, obligation, without losing yourself in it.',
                tag: 'FAMILY SYSTEMS',
                color: 'bg-[#FDF6E9] text-[#8C6D23] border-[#D4AF37]/35'
              },
              {
                title: 'Setting boundaries without guilt',
                desc: 'Practical language for saying no to people you care about.',
                tag: 'BOUNDARIES',
                color: 'bg-[#EAF2ED] text-[#2E7A70] border-[#8AA688]/30'
              },
              {
                title: 'Recognising burnout early',
                desc: 'The difference between a hard week and a pattern that needs attention.',
                tag: 'BURNOUT',
                color: 'bg-[#F6EEE9] text-[#8A5A4A] border-[#C49A8F]/30'
              },
              {
                title: 'Breaking the overthinking spiral',
                desc: 'Cognitive defusion techniques when your brain won\'t turn down the volume.',
                tag: 'RUMINATION',
                color: 'bg-[#EEF3F8] text-[#3D5265] border-[#BFCAD7]/40'
              },
              {
                title: 'Navigating professional transitions',
                desc: 'Separating your core self-worth from temporary career uncertainty.',
                tag: 'CAREER & IDENTITY',
                color: 'bg-[#F4EFF8] text-[#6A5D7B] border-[#D2C5DF]/40'
              }
            ].map((module, idx) => (
              <motion.div
                key={module.title}
                {...getCardEmergence(idx, 6, true, 3)}
                className="paper-card paper-card-hover rounded-2xl p-7 bg-white border border-[#E7DECF] shadow-xs flex flex-col justify-between space-y-4 hover:border-[#795663]/40 transition-shadow transition-colors duration-200 cursor-pointer"
              >
                <div className="space-y-3">
                  <span className={`inline-block font-mono-code text-[10px] font-bold px-3 py-0.5 rounded-full border ${module.color}`}>
                    {module.tag}
                  </span>
                  <h3 className="font-editorial text-lg text-[#162723] leading-snug">
                    {module.title}
                  </h3>
                  <p className="font-zen text-xs sm:text-sm text-[#5C6873] leading-relaxed">
                    {module.desc}
                  </p>
                </div>
                <div className="pt-2">
                  <span className="font-mono-code text-[11px] text-[#795663] font-medium">8–12 min guided module &rarr;</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. SECTION 06: WHAT PEOPLE ACTUALLY BRING IN (Artisanal Handmade Stationery Quotes) */}
      <section className="relative w-full py-20 md:py-28 px-5 sm:px-8 bg-gradient-to-b from-[#F5EFE6]/90 via-[#F0E8DC]/70 to-[#F5EFE6]/90 border-b border-[#E7DECF] overflow-hidden">
        <div className="max-w-5xl mx-auto space-y-10 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 font-mono-code text-[11px] uppercase tracking-wider text-[#795663] font-bold bg-white/80 border border-[#E7DECF] px-3.5 py-1 rounded-full shadow-2xs">
              <span>●</span> WHAT PEOPLE ACTUALLY BRING IN
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl text-[#162723] mx-auto">
              A few examples of what this looks like in practice.
            </h2>
          </div>

          {/* 3 Practical Example Cards: Odd total (3) -> Center card anchors, left/right emerge outward */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              {...getCardEmergence(0, 3)}
              className="paper-card paper-card-hover rounded-2xl p-6 bg-white border border-[#E7DECF] shadow-xs hover:border-[#795663]/40 transition-shadow transition-colors duration-200 cursor-pointer"
            >
              <div className="p-5 rounded-xl bg-[#FAF7F2] border border-dashed border-[#C49A8F]/60 space-y-2 relative">
                <span className="font-mono-code text-[10px] tracking-wider text-[#795663] font-bold uppercase block">
                  SHARED WITH THERAPIST
                </span>
                <p className="font-editorial italic text-base sm:text-lg text-[#162723] leading-relaxed">
                  "I got anxious before my sister's wedding and couldn't figure out why."
                </p>
              </div>
            </motion.div>

            <motion.div
              {...getCardEmergence(1, 3)}
              className="paper-card paper-card-hover rounded-2xl p-6 bg-white border border-[#E7DECF] shadow-xs hover:border-[#795663]/40 transition-shadow transition-colors duration-200 cursor-pointer"
            >
              <div className="p-5 rounded-xl bg-[#FAF7F2] border border-dashed border-[#C49A8F]/60 space-y-2 relative">
                <span className="font-mono-code text-[10px] tracking-wider text-[#795663] font-bold uppercase block">
                  SHARED WITH THERAPIST
                </span>
                <p className="font-editorial italic text-base sm:text-lg text-[#162723] leading-relaxed">
                  "My in-laws commented on my job again and I just went quiet."
                </p>
              </div>
            </motion.div>

            <motion.div
              {...getCardEmergence(2, 3)}
              className="paper-card paper-card-hover rounded-2xl p-6 bg-white border border-[#E7DECF] shadow-xs hover:border-[#795663]/40 transition-shadow transition-colors duration-200 cursor-pointer"
            >
              <div className="p-5 rounded-xl bg-[#FAF7F2] border border-dashed border-[#C49A8F]/60 space-y-2 relative">
                <span className="font-mono-code text-[10px] tracking-wider text-[#795663] font-bold uppercase block">
                  SHARED WITH THERAPIST
                </span>
                <p className="font-editorial italic text-base sm:text-lg text-[#162723] leading-relaxed">
                  "I said yes to extra work again even though I'm exhausted."
                </p>
              </div>
            </motion.div>
          </div>

          <p className="font-editorial italic text-xs sm:text-sm text-[#7D8E87] pt-2">
            The same selected history also carries over if you switch therapists, or move to self-work only after finishing therapy.
          </p>
        </div>
      </section>

      {/* 8. SECTION 07: THE PLATFORM, NOT TWO PRODUCTS (Full Width Dark Ink Band with Gold Accents) */}
      <section className="relative w-full py-20 md:py-28 px-5 sm:px-8 bg-[#011627] text-white overflow-hidden">
        {/* Subtle celestial gold watercolor glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-[#B8964A]/12 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-4xl mx-auto text-center space-y-5 relative z-10">
          <div className="font-mono-code text-xs tracking-widest uppercase text-[#C5A880] font-semibold">
            THE PLATFORM, NOT TWO PRODUCTS
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-white font-normal leading-tight">
            The same capabilities can be used at different levels of support.
          </h2>
          <p className="font-zen text-sm sm:text-base text-[#9AA59F] max-w-xl mx-auto leading-relaxed">
            The difference is who is involved in guiding the work: you, or you and a licensed therapist.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => handleSelectTab('how')}
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-full text-xs font-mono-code font-semibold tracking-wider uppercase bg-[#C5A880] text-[#011627] hover:bg-[#D8BE9B] transition-all cursor-pointer shadow-lg"
            >
              See how both connect &rarr;
            </button>
            <button
              onClick={() => handleSelectTab('pricing')}
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-full text-xs font-mono-code font-semibold tracking-wider uppercase bg-transparent text-white border border-white/20 hover:border-white transition-all cursor-pointer"
            >
              View transparent pricing &rarr;
            </button>
          </div>
        </div>
      </section>
    </div>
  );

  // -------------------------------------------------------------
  // TAB 3: HOW IT WORKS / OUR APPROACH
  // -------------------------------------------------------------
  const renderHowItWorks = () => (
    <div className="space-y-0 w-full">
      
      {/* 1. HERO SECTION */}
      <section className="w-full bg-[#FDFBF8] py-20 sm:py-24 border-b border-[#E7DECF]">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2.5 font-mono-code text-[11px] tracking-[0.2em] uppercase text-[#795663] font-semibold bg-white border border-[#E7DECF] shadow-2xs px-4 py-1.5 rounded-full mx-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-[#795663]" />
            OUR APPROACH & HOW IT WORKS
          </div>
          <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-[#162723] font-normal leading-[1.12] max-w-3xl mx-auto">
            Different entry points. Shared capabilities.
          </h1>
          <p className="font-zen text-base sm:text-lg text-[#5C6873] leading-relaxed max-w-2xl mx-auto">
            Two distinct paths (working alone with our pattern engine, and working with a licensed therapist), designed to give you clarity without comfort-traps.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => {
                const el = document.getElementById('approach-principles');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center justify-center px-6 py-3 rounded-full text-xs font-mono-code font-semibold tracking-wider uppercase bg-[#162723] text-white hover:bg-[#2A3A3E] transition-all cursor-pointer shadow-xs"
            >
              Our 3 Principles &rarr;
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('walkthrough-self');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center justify-center px-6 py-3 rounded-full text-xs font-mono-code font-medium tracking-wider uppercase bg-white border border-[#E7DECF] text-[#162723] hover:border-[#795663] transition-all cursor-pointer shadow-2xs"
            >
              View the Walkthroughs &darr;
            </button>
          </div>
        </div>
      </section>

      {/* 2. CORE PHILOSOPHY / OUR APPROACH */}
      <section id="approach-principles" className="w-full bg-[#F2ECE1] py-20 sm:py-24 border-b border-[#E7DECF]">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="font-mono-code text-xs tracking-widest uppercase text-[#795663] font-semibold">
              CORE PHILOSOPHY
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-[#162723] font-normal leading-tight mx-auto">
              Clarity comes from truth, not comfort.
            </h2>
            <p className="font-zen text-base sm:text-lg text-[#5C6873] leading-relaxed max-w-2xl mx-auto">
              Three things we will never do, and why.
            </p>
          </div>

          {/* Three Principles Cards: Odd total (3) -> Center card anchors, left/right emerge outward */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <motion.div
              {...getCardEmergence(0, 3)}
              className="paper-card paper-card-hover rounded-2xl p-7 bg-[#FDFBF8] border border-[#E7DECF] shadow-xs flex flex-col justify-between space-y-6 hover:border-[#795663]/40 transition-shadow transition-colors duration-200 cursor-pointer"
            >
              <div className="space-y-4">
                <div className="w-9 h-9 rounded-full bg-[#F2ECE1] border border-[#E7DECF] flex items-center justify-center font-mono-code text-xs font-bold text-[#795663]">
                  01
                </div>
                <h3 className="font-editorial text-2xl text-[#162723] leading-snug">
                  We don't validate blindly.
                </h3>
                <p className="font-zen text-xs sm:text-sm text-[#5C6873] leading-relaxed">
                  There is a version of emotional support that agrees with everything and changes nothing. It is comfortable. It is also useless. If you are writing the same entry for the fifth time with different characters, we will name the loop.
                </p>
              </div>
              <div className="pt-4 border-t border-[#E7DECF]/80">
                <p className="font-editorial text-xs sm:text-[13px] italic text-[#795663] leading-relaxed">
                  "Not harshly. Not with a diagnosis. Just: this pattern has shown up before."
                </p>
              </div>
            </motion.div>

            <motion.div
              {...getCardEmergence(1, 3)}
              className="paper-card paper-card-hover rounded-2xl p-7 bg-[#FDFBF8] border border-[#E7DECF] shadow-xs flex flex-col justify-between space-y-6 hover:border-[#795663]/40 transition-shadow transition-colors duration-200 cursor-pointer"
            >
              <div className="space-y-4">
                <div className="w-9 h-9 rounded-full bg-[#F2ECE1] border border-[#E7DECF] flex items-center justify-center font-mono-code text-xs font-bold text-[#795663]">
                  02
                </div>
                <h3 className="font-editorial text-2xl text-[#162723] leading-snug">
                  We don't give solutions.
                </h3>
                <p className="font-zen text-xs sm:text-sm text-[#5C6873] leading-relaxed">
                  The moment we start telling you what to do, we've removed you from the equation. People don't build self-awareness by following instructions. They build it by sitting with hard questions long enough to find their own answers.
                </p>
              </div>
              <div className="pt-4 border-t border-[#E7DECF]/80">
                <p className="font-editorial text-xs sm:text-[13px] italic text-[#795663] leading-relaxed">
                  "Our job is the question, not the answer."
                </p>
              </div>
            </motion.div>

            <motion.div
              {...getCardEmergence(2, 3)}
              className="paper-card paper-card-hover rounded-2xl p-7 bg-[#FDFBF8] border border-[#E7DECF] shadow-xs flex flex-col justify-between space-y-6 hover:border-[#795663]/40 transition-shadow transition-colors duration-200 cursor-pointer"
            >
              <div className="space-y-4">
                <div className="w-9 h-9 rounded-full bg-[#F2ECE1] border border-[#E7DECF] flex items-center justify-center font-mono-code text-xs font-bold text-[#795663]">
                  03
                </div>
                <h3 className="font-editorial text-2xl text-[#162723] leading-snug">
                  We don't create dependency.
                </h3>
                <p className="font-zen text-xs sm:text-sm text-[#5C6873] leading-relaxed">
                  This product should make itself progressively less necessary, not more. A person using it for a year should know themselves well enough that they need it less, not feel like they cannot function without checking in.
                </p>
              </div>
              <div className="pt-4 border-t border-[#E7DECF]/80">
                <p className="font-editorial text-xs sm:text-[13px] italic text-[#795663] leading-relaxed">
                  "The measure of success is how clearly you see yourself without it."
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. DAY ONE: WHAT ACTUALLY HAPPENS */}
      <section className="w-full bg-[#FDFBF8] py-20 sm:py-24 border-b border-[#E7DECF]">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="font-mono-code text-xs tracking-widest uppercase text-[#795663] font-semibold">
              DAY ONE
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-[#162723] font-normal leading-tight mx-auto">
              What actually happens when you sign up.
            </h2>
            <p className="font-zen text-base sm:text-lg text-[#5C6873] leading-relaxed max-w-2xl mx-auto">
              Zero confusion. Here is what your first hour looks like on either path.
            </p>
          </div>

          {/* Two Paths Cards: Even total (2) -> Both split smoothly outward from center line */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Self-work panel */}
            <motion.div
              {...getCardEmergence(0, 2)}
              className="paper-card paper-card-hover rounded-2xl p-8 bg-white border border-[#E7DECF] shadow-xs flex flex-col justify-between space-y-6 hover:border-[#795663]/40 transition-shadow transition-colors duration-200 cursor-pointer"
            >
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 font-mono-code text-xs text-[#2E7A70] bg-[#EAF2ED] px-3 py-1 rounded-full font-semibold">
                  <span>●</span> SELF-WORK PLATFORM
                </div>
                <h3 className="font-editorial text-2xl sm:text-3xl text-[#162723]">
                  Starting with self-work
                </h3>
                <p className="font-zen text-sm sm:text-base text-[#5C6873] leading-relaxed">
                  Subscribe (₹499/month), answer a few quick questions about what's on your mind, and write your first journal entry, free-flow or guided. Nothing else is required before you begin.
                </p>
                <div className="pt-3 space-y-2.5 font-zen text-xs sm:text-sm text-[#162723]">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[#8AA688] font-bold">✓</span> No waitlists or onboarding barriers
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-[#8AA688] font-bold">✓</span> Free-flow and guided 5-prompt modes
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-[#8AA688] font-bold">✓</span> Instant, reflective AI insight on submission
                  </div>
                </div>
              </div>
              <button
                onClick={handleAuthRedirect}
                className="w-full py-3.5 px-5 rounded-xl font-mono-code text-xs tracking-wider uppercase font-semibold text-center bg-[#F2ECE1] border border-[#E7DECF] text-[#162723] hover:bg-[#E7DECF] transition-colors cursor-pointer"
              >
                Start self-work &rarr;
              </button>
            </motion.div>

            {/* Therapist panel */}
            <motion.div
              {...getCardEmergence(1, 2)}
              className="paper-card paper-card-hover rounded-2xl p-8 bg-white border border-[#E7DECF] shadow-xs flex flex-col justify-between space-y-6 hover:border-[#795663]/40 transition-shadow transition-colors duration-200 cursor-pointer"
            >
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 font-mono-code text-xs text-[#795663] bg-[#F7EFE9] px-3 py-1 rounded-full font-semibold">
                  <span>●</span> THERAPIST-SUPPORTED
                </div>
                <h3 className="font-editorial text-2xl sm:text-3xl text-[#162723]">
                  Starting with a therapist
                </h3>
                <p className="font-zen text-sm sm:text-base text-[#5C6873] leading-relaxed">
                  Browse therapist profiles filtered by language, gender, specialty and availability, book a first session at ₹999+ per session, and set up your shared dashboard together in that first session.
                </p>
                <div className="pt-3 space-y-2.5 font-zen text-xs sm:text-sm text-[#162723]">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[#8AA688] font-bold">✓</span> Verified clinical credentials & video intro
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-[#8AA688] font-bold">✓</span> Joint goal-setting in session one
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-[#8AA688] font-bold">✓</span> Shared recap & homework dashboard activated
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleSelectTab('start')}
                className="w-full py-3.5 px-5 rounded-xl font-mono-code text-xs tracking-wider uppercase font-semibold text-center bg-[#162723] text-white hover:bg-[#2A3A3E] transition-colors cursor-pointer"
              >
                Book a first session &rarr;
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. SIDE BY SIDE COMPARISON */}
      <section className="w-full bg-[#F2ECE1] py-20 sm:py-24 border-b border-[#E7DECF]">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="font-mono-code text-xs tracking-widest uppercase text-[#795663] font-semibold">
              SIDE BY SIDE
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-[#162723] font-normal leading-tight mx-auto">
              What each option actually includes.
            </h2>
            <p className="font-zen text-base sm:text-lg text-[#5C6873] leading-relaxed max-w-2xl mx-auto">
              Transparent breakdown across capabilities, human guidance, and pricing structure.
            </p>
          </div>

          <div className="paper-card rounded-2xl p-6 sm:p-10 bg-white border border-[#E7DECF] shadow-xs overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm font-zen min-w-[540px]">
              <thead>
                <tr className="border-b-2 border-[#E7DECF] text-[#795663] font-mono-code text-[11px] tracking-wider uppercase">
                  <th className="py-4 pr-6">Capability</th>
                  <th className="py-4 px-6">Self-work</th>
                  <th className="py-4 pl-6">Therapist-supported</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7DECF]/70 text-[#5C6873]">
                <tr>
                  <td className="py-4 pr-6 text-[#162723] font-medium">Journal (free-flow + guided)</td>
                  <td className="py-4 px-6 text-[#2E7A70] font-semibold">✓ Included</td>
                  <td className="py-4 pl-6 text-[#2E7A70] font-semibold">✓ Included</td>
                </tr>
                <tr>
                  <td className="py-4 pr-6 text-[#162723] font-medium">Weekly & monthly reports</td>
                  <td className="py-4 px-6 text-[#2E7A70] font-semibold">✓ Included</td>
                  <td className="py-4 pl-6 text-[#2E7A70] font-semibold">✓ Included</td>
                </tr>
                <tr>
                  <td className="py-4 pr-6 text-[#162723] font-medium">Pattern & emotional vocabulary detection</td>
                  <td className="py-4 px-6 text-[#2E7A70] font-semibold">✓ Included</td>
                  <td className="py-4 pl-6 text-[#2E7A70] font-semibold">✓ Included</td>
                </tr>
                <tr>
                  <td className="py-4 pr-6 text-[#162723] font-medium">Psychoeducation modules</td>
                  <td className="py-4 px-6">Self-selected, paid per module</td>
                  <td className="py-4 pl-6">Therapist-assigned, paid per module</td>
                </tr>
                <tr>
                  <td className="py-4 pr-6 text-[#162723] font-medium">Licensed therapist sessions</td>
                  <td className="py-4 px-6 text-[#9AA59F]">-</td>
                  <td className="py-4 pl-6 text-[#2E7A70] font-semibold">✓ Included</td>
                </tr>
                <tr>
                  <td className="py-4 pr-6 text-[#162723] font-medium">Shared dashboard with recap & homework</td>
                  <td className="py-4 px-6 text-[#9AA59F]">-</td>
                  <td className="py-4 pl-6 text-[#2E7A70] font-semibold">✓ Included</td>
                </tr>
                <tr className="font-semibold text-[#162723] bg-[#FDFBF8]/60">
                  <td className="py-4 pr-6">Typical cost</td>
                  <td className="py-4 px-6 font-mono-code text-[#795663]">₹499 / month</td>
                  <td className="py-4 pl-6 font-mono-code text-[#162723]">From ₹999 / session</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 5. WORKING ON YOURSELF */}
      <section id="walkthrough-self" className="w-full bg-[#FDFBF8] py-20 sm:py-24 border-b border-[#E7DECF]">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="font-mono-code text-xs tracking-widest uppercase text-[#795663] font-semibold">
              WORKING ON YOURSELF
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-[#162723] font-normal leading-tight mx-auto">
              Example: “Why do I feel guilty resting instead of helping at home?”
            </h2>
            <p className="font-zen text-base sm:text-lg text-[#5C6873] leading-relaxed max-w-3xl mx-auto">
              Here is how a persistent feeling moves from raw reflection into long-term behavioral change.
            </p>
          </div>

          {/* 4 Self-Work Steps: Even total (4) -> Inner cards split from center line, outer cards emerge outward */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              {...getCardEmergence(0, 4)}
              className="paper-card paper-card-hover rounded-2xl p-6 bg-white border border-[#E7DECF] shadow-xs flex flex-col justify-between space-y-4 hover:border-[#795663]/40 transition-shadow transition-colors duration-200 cursor-pointer"
            >
              <div className="space-y-2">
                <div className="font-mono-code text-xs font-bold text-[#795663]">01</div>
                <h3 className="font-editorial text-xl text-[#162723]">Journal</h3>
                <p className="font-zen text-xs sm:text-sm text-[#5C6873] leading-relaxed">
                  Write freely, or use the guided 5-prompt journal: what happened, why, how you reacted, what you felt, and what you'd tell a friend.
                </p>
              </div>
            </motion.div>

            <motion.div
              {...getCardEmergence(1, 4)}
              className="paper-card paper-card-hover rounded-2xl p-6 bg-white border border-[#E7DECF] shadow-xs flex flex-col justify-between space-y-4 hover:border-[#795663]/40 transition-shadow transition-colors duration-200 cursor-pointer"
            >
              <div className="space-y-2">
                <div className="font-mono-code text-xs font-bold text-[#795663]">02</div>
                <h3 className="font-editorial text-xl text-[#162723]">Get your report</h3>
                <p className="font-zen text-xs sm:text-sm text-[#5C6873] leading-relaxed">
                  Weekly and monthly reports show recurring situations and the emotional vocabulary showing up most in your entries.
                </p>
              </div>
            </motion.div>

            <motion.div
              {...getCardEmergence(2, 4)}
              className="paper-card paper-card-hover rounded-2xl p-6 bg-white border border-[#E7DECF] shadow-xs flex flex-col justify-between space-y-4 hover:border-[#795663]/40 transition-shadow transition-colors duration-200 cursor-pointer"
            >
              <div className="space-y-2">
                <div className="font-mono-code text-xs font-bold text-[#795663]">03</div>
                <h3 className="font-editorial text-xl text-[#162723]">See the pattern</h3>
                <p className="font-zen text-xs sm:text-sm text-[#5C6873] leading-relaxed">
                  An intervention explains the pattern in plain language. If it holds for roughly two months, a specific psychoeducation module is recommended, not forced.
                </p>
              </div>
            </motion.div>

            <motion.div
              {...getCardEmergence(3, 4)}
              className="paper-card paper-card-hover rounded-2xl p-6 bg-white border border-[#E7DECF] shadow-xs flex flex-col justify-between space-y-4 hover:border-[#795663]/40 transition-shadow transition-colors duration-200 cursor-pointer"
            >
              <div className="space-y-2">
                <div className="font-mono-code text-xs font-bold text-[#795663]">04</div>
                <h3 className="font-editorial text-xl text-[#162723]">Practise & review</h3>
                <p className="font-zen text-xs sm:text-sm text-[#5C6873] leading-relaxed">
                  Apply what you learned in real situations that week, then check the next report to see if anything shifted.
                </p>
              </div>
            </motion.div>
          </div>

          {/* 2 Realistic Week Cards: Even total (2) -> Both split smoothly from center line */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <motion.div
              {...getCardEmergence(0, 2)}
              className="paper-card paper-card-hover rounded-2xl p-6 sm:p-7 bg-[#F2ECE1]/60 border border-[#E7DECF] space-y-2 hover:border-[#795663]/40 transition-shadow transition-colors duration-200 cursor-pointer"
            >
              <h3 className="font-editorial text-lg text-[#162723] font-medium">A realistic week</h3>
              <p className="font-zen text-xs sm:text-sm text-[#5C6873] leading-relaxed">
                Mon–Fri: 2–3 short journal entries. Sunday: weekly report lands, 5 minutes to read. Once a pattern repeats for weeks, a module gets recommended, and you decide if or when to take it.
              </p>
            </motion.div>
            <motion.div
              {...getCardEmergence(1, 2)}
              className="paper-card paper-card-hover rounded-2xl p-6 sm:p-7 bg-[#F2ECE1]/60 border border-[#E7DECF] space-y-2 hover:border-[#795663]/40 transition-shadow transition-colors duration-200 cursor-pointer"
            >
              <h3 className="font-editorial text-lg text-[#162723] font-medium">What you're not getting</h3>
              <p className="font-zen text-xs sm:text-sm text-[#5C6873] leading-relaxed">
                No daily notifications guilting you into writing, no automatic diagnosis, and no module purchase without you actively choosing it.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 6. WITH A THERAPIST */}
      <section className="w-full bg-[#F2ECE1] py-20 sm:py-24 border-b border-[#E7DECF]">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="font-mono-code text-xs tracking-widest uppercase text-[#795663] font-semibold">
              WITH A THERAPIST
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-[#162723] font-normal leading-tight mx-auto">
              Same journal and reports. Plus a therapist, and a dashboard for both of you.
            </h2>
            <p className="font-zen text-base sm:text-lg text-[#5C6873] leading-relaxed max-w-3xl mx-auto">
              Care that doesn't evaporate the moment you hang up the video call.
            </p>
          </div>

          {/* 4 Therapist Steps: Even total (4) -> Inner cards split from center line, outer cards emerge outward */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              {...getCardEmergence(0, 4)}
              className="paper-card paper-card-hover rounded-2xl p-6 bg-white border border-[#E7DECF] shadow-xs flex flex-col justify-between space-y-4 hover:border-[#795663]/40 transition-shadow transition-colors duration-200 cursor-pointer"
            >
              <div className="space-y-2">
                <div className="font-mono-code text-xs font-bold text-[#795663]">01</div>
                <h3 className="font-editorial text-xl text-[#162723]">Set goals</h3>
                <p className="font-zen text-xs sm:text-sm text-[#5C6873] leading-relaxed">
                  Define what matters to the client in the first session or two, visible on both dashboards afterward.
                </p>
              </div>
            </motion.div>

            <motion.div
              {...getCardEmergence(1, 4)}
              className="paper-card paper-card-hover rounded-2xl p-6 bg-white border border-[#E7DECF] shadow-xs flex flex-col justify-between space-y-4 hover:border-[#795663]/40 transition-shadow transition-colors duration-200 cursor-pointer"
            >
              <div className="space-y-2">
                <div className="font-mono-code text-xs font-bold text-[#795663]">02</div>
                <h3 className="font-editorial text-xl text-[#162723]">Session recap</h3>
                <p className="font-zen text-xs sm:text-sm text-[#5C6873] leading-relaxed">
                  After each session, your dashboard shows a recap, any homework, and any psychoeducation your therapist assigned.
                </p>
              </div>
            </motion.div>

            <motion.div
              {...getCardEmergence(2, 4)}
              className="paper-card paper-card-hover rounded-2xl p-6 bg-white border border-[#E7DECF] shadow-xs flex flex-col justify-between space-y-4 hover:border-[#795663]/40 transition-shadow transition-colors duration-200 cursor-pointer"
            >
              <div className="space-y-2">
                <div className="font-mono-code text-xs font-bold text-[#795663]">03</div>
                <h3 className="font-editorial text-xl text-[#162723]">Practise between</h3>
                <p className="font-zen text-xs sm:text-sm text-[#5C6873] leading-relaxed">
                  Complete homework, or journal independently. Many clients keep journaling even on weeks with a session.
                </p>
              </div>
            </motion.div>

            <motion.div
              {...getCardEmergence(3, 4)}
              className="paper-card paper-card-hover rounded-2xl p-6 bg-white border border-[#E7DECF] shadow-xs flex flex-col justify-between space-y-4 hover:border-[#795663]/40 transition-shadow transition-colors duration-200 cursor-pointer"
            >
              <div className="space-y-2">
                <div className="font-mono-code text-xs font-bold text-[#795663]">04</div>
                <h3 className="font-editorial text-xl text-[#162723]">Review & continue</h3>
                <p className="font-zen text-xs sm:text-sm text-[#5C6873] leading-relaxed">
                  Every few weeks, revisit goals together. Continue, change direction, graduate, or change therapists, without losing your history.
                </p>
              </div>
            </motion.div>
          </div>

          <div className="paper-card rounded-2xl p-7 bg-white border border-[#E7DECF] shadow-xs space-y-2">
            <h3 className="font-editorial text-xl text-[#162723] font-medium">A realistic cadence</h3>
            <p className="font-zen text-sm text-[#5C6873] leading-relaxed">
              Most clients start weekly or fortnightly, review goals every 4–6 sessions, and taper to monthly check-ins as things stabilise, and your therapist adjusts this with you, not on a fixed schedule.
            </p>
          </div>
        </div>
      </section>

      {/* 7. USE BOTH: BIDIRECTIONAL INTEGRATION */}
      <section className="w-full bg-[#FDFBF8] py-20 sm:py-24 border-b border-[#E7DECF]">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="font-mono-code text-xs tracking-widest uppercase text-[#795663] font-semibold">
              USE BOTH
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-[#162723] font-normal leading-tight mx-auto">
              The two sides can feed each other.
            </h2>
            <p className="font-zen text-base sm:text-lg text-[#5C6873] leading-relaxed max-w-2xl mx-auto">
              The platform connects self-directed reflection with clinical guidance without locking you into either.
            </p>
          </div>

          {/* SVG Diagram */}
          <div className="paper-card rounded-2xl p-6 sm:p-10 bg-white border border-[#E7DECF] shadow-xs">
            <div className="w-full max-w-2xl mx-auto">
              <svg viewBox="0 0 700 170" role="img" aria-label="Diagram of two boxes, self-work and therapy, connected by two arrows: share an entry going from self-work to therapy, and continue practice going from therapy to self-work" className="w-full h-auto">
                <rect x="30" y="45" width="230" height="80" rx="16" fill="#FDFBF8" stroke="#E7DECF" strokeWidth="2"/>
                <text x="145" y="90" textAnchor="middle" fontFamily="Lora, Georgia, serif" fontSize="18" fill="#162723" fontWeight="500">Self-work</text>
                
                <rect x="440" y="45" width="230" height="80" rx="16" fill="#FDFBF8" stroke="#E7DECF" strokeWidth="2"/>
                <text x="555" y="90" textAnchor="middle" fontFamily="Lora, Georgia, serif" fontSize="18" fill="#162723" fontWeight="500">Therapy</text>
                
                <path d="M262,70 C330,52 380,52 438,68" fill="none" stroke="#795663" strokeWidth="2.5" markerEnd="url(#arrowu1-v2)"/>
                <text x="350" y="46" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="11" fill="#795663" letterSpacing="0.5">share a selected entry &rarr;</text>
                
                <path d="M438,102 C380,120 330,120 262,103" fill="none" stroke="#2E7A70" strokeWidth="2.5" markerEnd="url(#arrowu2-v2)"/>
                <text x="350" y="142" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="11" fill="#2E7A70" letterSpacing="0.5">&larr; continue practice after</text>
                
                <defs>
                  <marker id="arrowu1-v2" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">
                    <path d="M0,0 L9,4.5 L0,9 z" fill="#795663"/>
                  </marker>
                  <marker id="arrowu2-v2" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">
                    <path d="M0,0 L9,4.5 L0,9 z" fill="#2E7A70"/>
                  </marker>
                </defs>
              </svg>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-8 border-t border-[#E7DECF]/80">
              <div className="space-y-2">
                <h4 className="font-editorial text-lg text-[#162723] font-medium">Self-work &rarr; Therapy</h4>
                <p className="font-zen text-xs sm:text-sm text-[#5C6873] leading-relaxed">
                  E.g. three weeks of entries about a specific relative, brought into session instead of retold from memory.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-editorial text-lg text-[#162723] font-medium">Therapy &rarr; Self-work</h4>
                <p className="font-zen text-xs sm:text-sm text-[#5C6873] leading-relaxed">
                  E.g. keep journaling on boundary-setting after your last session, with reports still tracking whether it holds.
                </p>
              </div>
            </div>
            <p className="font-mono-code text-xs text-[#795663] text-center pt-6 mt-4 border-t border-[#E7DECF]/60">
              Switch direction anytime: nothing is locked in.
            </p>
          </div>
        </div>
      </section>

      {/* 8. COMMON QUESTIONS (FAQ) */}
      <section className="w-full bg-[#F2ECE1] py-20 sm:py-24 border-b border-[#E7DECF]">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="font-mono-code text-xs tracking-widest uppercase text-[#795663] font-semibold">
              COMMON QUESTIONS
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-[#162723] font-normal leading-tight mx-auto">
              The practical stuff.
            </h2>
            <p className="font-zen text-base sm:text-lg text-[#5C6873] leading-relaxed max-w-2xl mx-auto">
              Straightforward answers about subscriptions, pauses, and combining formats.
            </p>
          </div>

          <div className="space-y-3 max-w-3xl mx-auto">
            {[
              {
                q: 'What if I miss a few days of journaling?',
                a: "Nothing happens automatically. Your next report simply reflects fewer entries. There's no streak to lose or penalty for gaps."
              },
              {
                q: 'Can I change or stop my therapist?',
                a: 'Yes, anytime. You can switch therapists and choose what history moves with you, or stop therapy altogether and continue on self-work only.'
              },
              {
                q: 'Do I have to buy a psychoeducation module when it is recommended?',
                a: "No. It's a suggestion based on a repeating pattern: buying it is always your choice, in both self-work and therapy."
              },
              {
                q: 'What happens if I pause my subscription?',
                a: "Your journal history and past reports stay saved. You won't get new weekly or monthly reports until you resume."
              },
              {
                q: 'Can I use self-work and therapy in the same week?',
                a: 'Yes, many people journal on non-session weeks and bring select entries into their next session.'
              }
            ].map((faq) => (
              <details key={faq.q} className="paper-card rounded-xl p-5 sm:p-6 bg-white border border-[#E7DECF] group transition-all">
                <summary className="font-editorial text-base sm:text-lg text-[#162723] cursor-pointer font-medium list-none flex items-center justify-between">
                  <span>{faq.q}</span>
                  <span className="text-[#795663] text-xl font-bold group-open:rotate-45 transition-transform duration-200">+</span>
                </summary>
                <p className="font-zen text-xs sm:text-sm text-[#5C6873] pt-4 leading-relaxed border-t border-[#E7DECF]/60 mt-4">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 9. DARK INK CLOSING BAND */}
      <section className="w-full bg-[#011627] py-20 sm:py-24 text-white">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center space-y-6">
          <div className="font-mono-code text-xs tracking-widest uppercase text-[#C5A880] font-semibold">
            UNDERSTAND · GROW · CONTINUE
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-white font-normal leading-tight">
            Self-work, therapy, or both. Your pace.
          </h2>
          <p className="font-zen text-base sm:text-lg text-[#9AA59F] leading-relaxed max-w-xl mx-auto">
            Different entry points, same dedication to truth over comfort. Start exploring your own patterns today.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={handleAuthRedirect}
              className="inline-flex items-center justify-center px-8 py-4 rounded-full text-xs font-mono-code font-semibold tracking-wider uppercase bg-[#C5A880] text-[#011627] hover:bg-[#D8BE9B] transition-all cursor-pointer shadow-lg"
            >
              Start self-work (₹499/mo) &rarr;
            </button>
            <button
              onClick={() => handleSelectTab('start')}
              className="inline-flex items-center justify-center px-8 py-4 rounded-full text-xs font-mono-code font-semibold tracking-wider uppercase bg-transparent text-white border border-white/20 hover:border-white transition-all cursor-pointer"
            >
              Book a therapist session &rarr;
            </button>
          </div>
        </div>
      </section>
    </div>
  );

  // -------------------------------------------------------------
  // TAB 4: PRICING (Dynamic ₹499/mo & ₹999/session)
  // -------------------------------------------------------------
  const renderPricing = () => (
    <div className="w-full space-y-0">
      
      {/* 1. HERO SECTION (Subtle Parchment Gradient with Watercolor Bleeds & Brushstroke) */}
      <section className="relative w-full py-20 md:py-28 px-5 sm:px-8 bg-gradient-to-b from-[#FAF7F2] via-[#F4EDE2]/45 to-[#FAF7F2] border-b border-[#E7DECF]/80 overflow-hidden">
        {/* Ambient Top-Right Watercolor Wash (Dusty Rose) */}
        <svg
          className="absolute -top-16 -right-20 w-[420px] sm:w-[540px] h-auto opacity-60 pointer-events-none mix-blend-multiply"
          viewBox="0 0 600 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="price-rose-wash" cx="70%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#C49A8F" stopOpacity="0.38" />
              <stop offset="45%" stopColor="#D9BCAF" stopOpacity="0.22" />
              <stop offset="75%" stopColor="#EFE3DE" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#FAF7F2" stopOpacity="0" />
            </radialGradient>
            <filter id="price-bleed" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="14" />
            </filter>
          </defs>
          <path
            d="M500 40 C410 0 300 50 240 130 C180 210 180 320 230 400 C290 470 410 500 500 460 C580 420 620 320 630 210 C640 120 590 60 500 40 Z"
            fill="url(#price-rose-wash)"
            filter="url(#price-bleed)"
          />
          <circle cx="220" cy="180" r="3.5" fill="#C49A8F" opacity="0.28" />
          <circle cx="250" cy="220" r="2.5" fill="#C49A8F" opacity="0.22" />
        </svg>

        {/* Ambient Top-Left Watercolor Wash (Sage Green) */}
        <svg
          className="absolute -top-12 -left-16 w-[380px] sm:w-[480px] h-auto opacity-55 pointer-events-none mix-blend-multiply"
          viewBox="0 0 550 450"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="price-sage-wash" cx="30%" cy="25%" r="70%">
              <stop offset="0%" stopColor="#7E9E82" stopOpacity="0.35" />
              <stop offset="50%" stopColor="#96B49A" stopOpacity="0.2" />
              <stop offset="80%" stopColor="#C4D7C7" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#FAF7F2" stopOpacity="0" />
            </radialGradient>
          </defs>
          <path
            d="M80 50 C160 -10 290 20 380 80 C460 130 510 240 460 330 C410 410 290 440 210 420 C130 400 50 340 30 250 C10 160 10 90 80 50 Z"
            fill="url(#price-sage-wash)"
            filter="url(#price-bleed)"
          />
          <circle cx="410" cy="130" r="4" fill="#8AA688" opacity="0.25" />
        </svg>

        <div className="max-w-4xl mx-auto space-y-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2.5 font-mono-code text-[11px] tracking-[0.2em] uppercase text-[#795663] font-semibold bg-white/85 backdrop-blur-xs border border-[#E7DECF] shadow-2xs px-4 py-1.5 rounded-full mx-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-[#795663]" />
            PRICING & TRANSPARENCY
          </div>

          <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-[#162723] font-normal leading-[1.12] max-w-3xl mx-auto">
            A monthly plan for self-work. Pay per session for therapy.
          </h1>

          <p className="font-zen text-base sm:text-lg text-[#5C6873] leading-relaxed max-w-2xl mx-auto">
            Prices shown in ₹ (INR). Pay by UPI, card or netbanking. No hidden charges, and no long-term lock-ins.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5">
            <span className="font-mono-code text-xs text-[#4F635E] bg-white/80 border border-[#E7DECF] px-3.5 py-1.5 rounded-full shadow-2xs">
              ✓ UPI
            </span>
            <span className="font-mono-code text-xs text-[#4F635E] bg-white/80 border border-[#E7DECF] px-3.5 py-1.5 rounded-full shadow-2xs">
              ✓ Cards (Debit & Credit)
            </span>
            <span className="font-mono-code text-xs text-[#4F635E] bg-white/80 border border-[#E7DECF] px-3.5 py-1.5 rounded-full shadow-2xs">
              ✓ Netbanking
            </span>
            <span className="font-mono-code text-xs text-[#4F635E] bg-white/80 border border-[#E7DECF] px-3.5 py-1.5 rounded-full shadow-2xs">
              ✓ GST Inclusive
            </span>
          </div>
        </div>
      </section>

      {/* 2. THE TWO CORE OPTIONS (Subtle Warm Paper with Distinct Cards) */}
      <section className="relative w-full py-20 md:py-28 px-5 sm:px-8 bg-[#FAF7F2]/85 border-b border-[#E7DECF]/75 overflow-hidden">
        {/* Subtle watercolor blur */}
        <div className="absolute top-1/2 -left-20 w-80 h-80 rounded-full bg-[#8AA688]/10 blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto space-y-12 relative z-10">
          {/* Two Core Pricing Cards: Even total (2) -> Both split smoothly from center line */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Card 1: Self-Work Platform */}
            <motion.div
              {...getCardEmergence(0, 2)}
              className="paper-card paper-card-hover rounded-2xl p-8 sm:p-10 bg-white border border-[#E7DECF] shadow-xs flex flex-col justify-between space-y-8 hover:border-[#795663]/40 transition-shadow transition-colors duration-200 cursor-pointer"
            >
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 font-mono-code text-xs text-[#2E7A70] bg-[#EAF2ED] px-3.5 py-1 rounded-full font-semibold border border-[#8AA688]/30">
                  <span>●</span> Ingress Within Self-Work
                </div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono-code text-5xl font-semibold text-[#795663]">₹499</span>
                    <span className="font-zen text-sm text-[#5C6873]">/ month (GST inclusive)</span>
                  </div>
                  <p className="font-zen text-xs text-[#2E7A70] font-medium pt-1">
                    First 7 days free • Cancel anytime in 1 click
                  </p>
                </div>
                <p className="font-zen text-xs sm:text-sm text-[#5C6873] leading-relaxed">
                  Journal (free-flow + guided), and weekly & monthly reports with pattern and emotional vocabulary tracking, included in your subscription.
                </p>
                <div className="h-[1px] bg-[#E7DECF]/80" />
                <ul className="space-y-2.5 text-xs sm:text-sm font-zen text-[#162723]">
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#8AA688] font-bold">✓</span> Unlimited daily journal entries
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#8AA688] font-bold">✓</span> Weekly summary & monthly pattern reports
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#8AA688] font-bold">✓</span> Longitudinal pattern engine (4-state lifecycle)
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#8AA688] font-bold">✓</span> Free plain-language pattern interventions
                  </li>
                </ul>
                <p className="font-zen text-xs text-[#7D8E87] pt-2 border-t border-[#E7DECF]/60 italic">
                  Psychoeducation modules are priced and purchased separately, inside the app.
                </p>
              </div>
              <button
                onClick={handleAuthRedirect}
                className="w-full text-center py-4 bg-[#162723] hover:bg-[#203631] text-white rounded-xl font-mono-code text-xs uppercase tracking-wider font-semibold shadow-xs cursor-pointer transition-colors"
              >
                Start self-work (₹499/mo) &rarr;
              </button>
            </motion.div>

            {/* Card 2: Therapy */}
            <motion.div
              {...getCardEmergence(1, 2)}
              className="paper-card paper-card-hover rounded-2xl p-8 sm:p-10 bg-white border-2 border-[#795663]/40 shadow-xs flex flex-col justify-between space-y-8 hover:border-[#795663]/70 transition-shadow transition-colors duration-200 cursor-pointer"
            >
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 font-mono-code text-xs text-[#795663] bg-[#F7EFE9] px-3.5 py-1 rounded-full font-semibold border border-[#C49A8F]/30">
                  <span>●</span> THERAPIST-SUPPORTED
                </div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono-code text-5xl font-semibold text-[#162723]">From ₹999</span>
                    <span className="font-zen text-sm text-[#5C6873]">/ session</span>
                  </div>
                  <p className="font-zen text-xs text-[#795663] font-medium pt-1">
                    Pay per session • No package commitment required
                  </p>
                </div>
                <p className="font-zen text-xs sm:text-sm text-[#5C6873] leading-relaxed">
                  Licensed therapist, goal setting, between-session practice and progress review. Journal and reports can be added alongside.
                </p>
                <div className="h-[1px] bg-[#E7DECF]/80" />
                <ul className="space-y-2.5 text-xs sm:text-sm font-zen text-[#162723]">
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#8AA688] font-bold">✓</span> Verified licensed clinical psychologists
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#8AA688] font-bold">✓</span> Shared milestone dashboard between sessions
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#8AA688] font-bold">✓</span> Therapist-assigned homework & session recaps
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#8AA688] font-bold">✓</span> Seamless continuity if you change therapists
                  </li>
                </ul>
                <p className="font-zen text-xs text-[#7D8E87] pt-2 border-t border-[#E7DECF]/60 italic">
                  Psychoeducation modules assigned by your therapist are priced and purchased separately.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleSelectTab('start')}
                className="w-full text-center py-4 bg-[#795663] hover:bg-[#654652] text-white rounded-xl font-mono-code text-xs uppercase tracking-wider font-semibold shadow-xs cursor-pointer transition-colors"
              >
                Book your first session &rarr;
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. PSYCHOEDUCATION MODULES (MATCHING EXACT SCREENSHOT FROM USER) */}
      <section className="relative w-full py-20 md:py-28 px-5 sm:px-8 bg-gradient-to-b from-[#F5EFE6]/90 via-[#EFE7DC]/70 to-[#F5EFE6]/90 border-b border-[#E7DECF] overflow-hidden">
        {/* Subtle watercolor accent bleed */}
        <div className="absolute top-1/2 -right-24 w-80 h-80 rounded-full bg-[#C49A8F]/10 blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto space-y-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="inline-block px-3.5 py-1 rounded-full bg-[#F7EFE9] font-mono-code text-[11px] uppercase tracking-wider text-[#795663] font-semibold border border-[#C49A8F]/30 mx-auto">
              PSYCHOEDUCATION MODULES
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl lg:text-[42px] text-[#162723] font-normal leading-tight pt-1 mx-auto">
              Bought one at a time, only when it's relevant.
            </h2>
            <p className="font-zen text-sm sm:text-base text-[#5C6873] leading-relaxed max-w-3xl mx-auto">
              The plain-language explanation of a pattern is always free, as soon as it shows up, as part of your subscription or session, not an upsell. Only the deeper, structured module is separate: on self-work, offered once a pattern has repeated for about two months; in therapy, assignable by your therapist whenever they judge it's useful. Either way, it's a one-time purchase you choose, never automatic.
            </p>
          </div>

          {/* 2 Timeline Example Cards: Even total (2) -> Both split smoothly from center line */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 pt-2">
            {/* Card 1: Month 1, Self-work only */}
            <motion.div
              {...getCardEmergence(0, 2)}
              className="paper-card paper-card-hover rounded-[22px] p-7 sm:p-8 bg-white border border-[#E7DECF] shadow-xs space-y-4 hover:border-[#795663]/40 transition-shadow transition-colors duration-200 cursor-pointer"
            >
              <span className="inline-block px-3.5 py-1 rounded-full bg-[#F7EFE9] font-mono-code text-[10.5px] uppercase tracking-wider text-[#795663] font-semibold border border-[#C49A8F]/30">
                MONTH 1, SELF-WORK ONLY
              </span>
              <p className="font-zen text-sm sm:text-base text-[#5C6873] leading-relaxed">
                ₹499 subscription. That's it: modules only if you choose one later.
              </p>
            </motion.div>

            {/* Card 2: Month 1, Therapy (Weekly) */}
            <motion.div
              {...getCardEmergence(1, 2)}
              className="paper-card paper-card-hover rounded-[22px] p-7 sm:p-8 bg-white border border-[#E7DECF] shadow-xs space-y-4 hover:border-[#795663]/40 transition-shadow transition-colors duration-200 cursor-pointer"
            >
              <span className="inline-block px-3.5 py-1 rounded-full bg-[#F7EFE9] font-mono-code text-[10.5px] uppercase tracking-wider text-[#795663] font-semibold border border-[#C49A8F]/30">
                MONTH 1, THERAPY (WEEKLY)
              </span>
              <p className="font-zen text-sm sm:text-base text-[#5C6873] leading-relaxed">
                ≈₹999–1,500 × 4 sessions, depending on therapist. No subscription fee on top.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. COMMON QUESTIONS ABOUT PRICING */}
      <section className="relative w-full py-20 md:py-28 px-5 sm:px-8 bg-[#FAF7F2]/85 border-b border-[#E7DECF]/75 overflow-hidden">
        <div className="max-w-5xl mx-auto space-y-10 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 font-mono-code text-[11px] uppercase tracking-wider text-[#795663] font-bold bg-white/80 border border-[#E7DECF] px-3.5 py-1 rounded-full shadow-2xs mx-auto">
              <span>●</span> PRICING FAQS
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl text-[#162723] mx-auto">
              Clear answers, zero fine print.
            </h2>
          </div>

          <div className="space-y-3 max-w-3xl mx-auto">
            {[
              {
                q: 'What happens if I pause or cancel my self-work subscription?',
                a: 'You can cancel anytime in one click from your settings. Your past journal entries and historical reports stay saved forever. You simply will not receive new weekly and monthly reports until you restart.'
              },
              {
                q: 'Do I have to commit to multiple therapy sessions upfront?',
                a: 'No. Ingress Within operates strictly on a pay-per-session model. You can book one session at a time with no requirement to buy packages or commit to bundles.'
              },
              {
                q: 'Are psychoeducation modules ever billed automatically?',
                a: 'Never. Psychoeducation modules are always optional, one-time individual purchases. The plain-language explanation of your patterns is completely free and included.'
              },
              {
                q: 'Which payment methods are accepted?',
                a: 'We accept UPI (Google Pay, PhonePe, Paytm, BHIM), Indian & international credit and debit cards, and netbanking across all major banks in India.'
              }
            ].map((faq) => (
              <details key={faq.q} className="paper-card rounded-xl p-5 sm:p-6 bg-white border border-[#E7DECF] group transition-all">
                <summary className="font-editorial text-base sm:text-lg text-[#162723] cursor-pointer font-medium list-none flex items-center justify-between">
                  <span>{faq.q}</span>
                  <span className="text-[#795663] text-xl font-bold group-open:rotate-45 transition-transform duration-200">+</span>
                </summary>
                <p className="font-zen text-xs sm:text-sm text-[#5C6873] pt-4 leading-relaxed border-t border-[#E7DECF]/60 mt-4">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 5. DARK INK CLOSING BAND */}
      <section className="relative w-full py-20 sm:py-24 px-5 sm:px-8 bg-[#011627] text-white overflow-hidden text-center">
        {/* Subtle celestial gold watercolor glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-[#B8964A]/12 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <div className="font-mono-code text-xs tracking-widest uppercase text-[#C5A880] font-semibold">
            START FREE · CONTINUE ONLY IF IT HELPS
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-white font-normal leading-tight">
            Start free. Continue only if it's honest enough to.
          </h2>
          <p className="font-zen text-base sm:text-lg text-[#9AA59F] leading-relaxed max-w-xl mx-auto">
            We don't ask for commitment before we've earned it. Begin with our 7-day self-work trial or schedule a session with a therapist.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={handleAuthRedirect}
              className="inline-flex items-center justify-center px-8 py-4 rounded-full text-xs font-mono-code font-semibold tracking-wider uppercase bg-[#C5A880] text-[#011627] hover:bg-[#D8BE9B] transition-all cursor-pointer shadow-lg"
            >
              Start 7-day free trial &rarr;
            </button>
            <button
              onClick={() => handleSelectTab('start')}
              className="inline-flex items-center justify-center px-8 py-4 rounded-full text-xs font-mono-code font-semibold tracking-wider uppercase bg-transparent text-white border border-white/20 hover:border-white transition-all cursor-pointer"
            >
              Book a therapist session &rarr;
            </button>
          </div>
        </div>
      </section>
    </div>
  );

  // -------------------------------------------------------------
  // TAB 5: AI & DATA
  // -------------------------------------------------------------
  const renderAiData = () => (
    <div className="w-full space-y-0">
      
      {/* 1. HERO SECTION (Subtle Parchment Gradient with Watercolor Bleeds & Brushstroke) */}
      <section className="relative w-full py-20 md:py-28 px-5 sm:px-8 bg-gradient-to-b from-[#FAF7F2] via-[#F4EDE2]/45 to-[#FAF7F2] border-b border-[#E7DECF]/80 overflow-hidden">
        {/* Ambient Top-Right Watercolor Wash (Dusty Rose) */}
        <svg
          className="absolute -top-16 -right-20 w-[420px] sm:w-[540px] h-auto opacity-60 pointer-events-none mix-blend-multiply"
          viewBox="0 0 600 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="ai-rose-wash" cx="70%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#C49A8F" stopOpacity="0.38" />
              <stop offset="45%" stopColor="#D9BCAF" stopOpacity="0.22" />
              <stop offset="75%" stopColor="#EFE3DE" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#FAF7F2" stopOpacity="0" />
            </radialGradient>
            <filter id="ai-bleed" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="14" />
            </filter>
          </defs>
          <path
            d="M500 40 C410 0 300 50 240 130 C180 210 180 320 230 400 C290 470 410 500 500 460 C580 420 620 320 630 210 C640 120 590 60 500 40 Z"
            fill="url(#ai-rose-wash)"
            filter="url(#ai-bleed)"
          />
          <circle cx="220" cy="180" r="3.5" fill="#C49A8F" opacity="0.28" />
          <circle cx="250" cy="220" r="2.5" fill="#C49A8F" opacity="0.22" />
        </svg>

        {/* Ambient Top-Left Watercolor Wash (Sage Green) */}
        <svg
          className="absolute -top-12 -left-16 w-[380px] sm:w-[480px] h-auto opacity-55 pointer-events-none mix-blend-multiply"
          viewBox="0 0 550 450"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="ai-sage-wash" cx="30%" cy="25%" r="70%">
              <stop offset="0%" stopColor="#7E9E82" stopOpacity="0.35" />
              <stop offset="50%" stopColor="#96B49A" stopOpacity="0.2" />
              <stop offset="80%" stopColor="#C4D7C7" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#FAF7F2" stopOpacity="0" />
            </radialGradient>
          </defs>
          <path
            d="M80 50 C160 -10 290 20 380 80 C460 130 510 240 460 330 C410 410 290 440 210 420 C130 400 50 340 30 250 C10 160 10 90 80 50 Z"
            fill="url(#ai-sage-wash)"
            filter="url(#ai-bleed)"
          />
          <circle cx="410" cy="130" r="4" fill="#8AA688" opacity="0.25" />
        </svg>

        <div className="max-w-4xl mx-auto space-y-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2.5 font-mono-code text-[11px] tracking-[0.2em] uppercase text-[#795663] font-semibold bg-white/85 backdrop-blur-xs border border-[#E7DECF] shadow-2xs px-4 py-1.5 rounded-full mx-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-[#795663]" />
            AI & DATA PRINCIPLES
          </div>

          <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-[#162723] font-normal leading-[1.12] max-w-3xl mx-auto">
            AI helps connect the information. It does not become the authority.
          </h1>

          <p className="font-zen text-base sm:text-lg text-[#5C6873] leading-relaxed max-w-2xl mx-auto">
            AI can organise information, surface possible patterns and connect relevant learning. In therapist-supported care, it can help structure information for professional review.
          </p>
        </div>
      </section>

      {/* 2. THE THREE CAPABILITY CARDS (MATCHING SCREENSHOT 1) */}
      <section className="relative w-full py-20 md:py-28 px-5 sm:px-8 bg-[#FAF7F2]/85 border-b border-[#E7DECF]/75 overflow-hidden">
        {/* Subtle watercolor blur */}
        <div className="absolute top-1/2 -right-24 w-80 h-80 rounded-full bg-[#8AA688]/10 blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10">
          {/* 3 Capability Cards: Odd total (3) -> Center card anchors, left/right emerge outward */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Card 1: Journal Analysis */}
            <motion.div
              {...getCardEmergence(0, 3)}
              className="paper-card paper-card-hover rounded-2xl p-8 sm:p-10 bg-white border border-[#E7DECF] shadow-xs text-center flex flex-col items-center justify-start space-y-3 hover:border-[#795663]/40 transition-shadow transition-colors duration-200 cursor-pointer"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#EAF2ED] flex items-center justify-center mb-2">
                <svg
                  viewBox="0 0 64 64"
                  fill="none"
                  stroke="#2E7A70"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-8 h-8"
                  aria-hidden="true"
                >
                  <rect x="14" y="10" width="36" height="44" rx="5" />
                  <line x1="22" y1="20" x2="42" y2="20" />
                  <line x1="22" y1="28" x2="42" y2="28" />
                  <line x1="22" y1="36" x2="34" y2="36" />
                  <circle cx="42" cy="42" r="6" />
                  <line x1="46" y1="46" x2="51" y2="51" />
                </svg>
              </div>
              <h3 className="font-editorial text-xl sm:text-2xl text-[#162723] font-medium leading-snug">
                Journal analysis
              </h3>
              <p className="font-zen text-xs sm:text-sm text-[#5C6873] leading-relaxed max-w-[240px]">
                Entries become weekly & monthly reports.
              </p>
            </motion.div>

            {/* Card 2: Pattern Trigger */}
            <motion.div
              {...getCardEmergence(1, 3)}
              className="paper-card paper-card-hover rounded-2xl p-8 sm:p-10 bg-white border border-[#E7DECF] shadow-xs text-center flex flex-col items-center justify-start space-y-3 hover:border-[#795663]/40 transition-shadow transition-colors duration-200 cursor-pointer"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#EEF3F8] flex items-center justify-center mb-2">
                <svg
                  viewBox="0 0 64 64"
                  fill="none"
                  stroke="#3D5265"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-8 h-8"
                  aria-hidden="true"
                >
                  <path d="M10 44 L22 30 L32 38 L44 18 L54 26" fill="none" />
                  <circle cx="44" cy="18" r="3.5" fill="#B8964A" stroke="none" />
                  <line x1="10" y1="50" x2="54" y2="50" />
                </svg>
              </div>
              <h3 className="font-editorial text-xl sm:text-2xl text-[#162723] font-medium leading-snug">
                Pattern trigger
              </h3>
              <p className="font-zen text-xs sm:text-sm text-[#5C6873] leading-relaxed max-w-[250px]">
                Named for free, always, with a module only after ~2 months, and only if you choose.
              </p>
            </motion.div>

            {/* Card 3: Therapist Support */}
            <motion.div
              {...getCardEmergence(2, 3)}
              className="paper-card paper-card-hover rounded-2xl p-8 sm:p-10 bg-white border border-[#E7DECF] shadow-xs text-center flex flex-col items-center justify-start space-y-3 hover:border-[#795663]/40 transition-shadow transition-colors duration-200 cursor-pointer"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#F7EFE9] flex items-center justify-center mb-2">
                <svg
                  viewBox="0 0 64 64"
                  fill="none"
                  stroke="#795663"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-8 h-8"
                  aria-hidden="true"
                >
                  <circle cx="32" cy="22" r="9" />
                  <path d="M16 52 C16 40 23 34 32 34 C41 34 48 40 48 52" />
                  <path d="M40 44 L44 48 L52 38" />
                </svg>
              </div>
              <h3 className="font-editorial text-xl sm:text-2xl text-[#162723] font-medium leading-snug">
                Therapist support
              </h3>
              <p className="font-zen text-xs sm:text-sm text-[#5C6873] leading-relaxed max-w-[250px]">
                Organised for clinical review, never a diagnosis on its own.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. WHERE THE LINE SITS (AI ZONE VS HUMAN ZONE) */}
      <section className="relative w-full py-20 md:py-28 px-5 sm:px-8 bg-gradient-to-b from-[#F5EFE6]/90 via-[#EFE7DC]/70 to-[#F5EFE6]/90 border-b border-[#E7DECF] overflow-hidden">
        {/* Subtle watercolor bleed */}
        <div className="absolute top-1/3 -left-20 w-80 h-80 rounded-full bg-[#C49A8F]/10 blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto space-y-10 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 font-mono-code text-[11px] uppercase tracking-wider text-[#795663] font-bold bg-white/80 border border-[#E7DECF] px-3.5 py-1 rounded-full shadow-2xs mx-auto">
              <span>●</span> WHERE THE LINE SITS
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl lg:text-[42px] text-[#162723] font-normal leading-tight mx-auto">
              AI organises the information. A person decides what it means.
            </h2>
          </div>

          {/* Boundary Diagram Component */}
          <AIHumanBoundaryDiagram />
        </div>
      </section>

      {/* 4. DATA & PRIVACY (MATCHING EXACT SCREENSHOT 2) */}
      <section className="relative w-full py-20 md:py-28 px-5 sm:px-8 bg-[#FAF7F2]/85 border-b border-[#E7DECF]/75 overflow-hidden">
        {/* Subtle watercolor blur */}
        <div className="absolute bottom-12 -right-20 w-72 h-72 rounded-full bg-[#8AA688]/10 blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto space-y-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="inline-block px-3.5 py-1 rounded-full bg-[#F7EFE9] font-mono-code text-[11px] uppercase tracking-wider text-[#795663] font-semibold border border-[#C49A8F]/30 mx-auto">
              DATA & PRIVACY
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl lg:text-[42px] text-[#162723] font-normal leading-tight pt-1 mx-auto">
              Continuity needs trust.
            </h2>
            <p className="font-zen text-sm sm:text-base text-[#5C6873] leading-relaxed max-w-3xl mx-auto">
              The platform may hold emotional experiences, self-work, goals, progress and therapy-related information. The Privacy Notice will set out, in full, what's collected, why, who can access it (including therapists), how AI processes it, how long it's kept, and how India's data protection law applies.
            </p>
          </div>

          {/* Collapsible Questions List with Clean Dividing Lines (Matching Screenshot 2) */}
          <div className="border-t border-[#E7DECF] divide-y divide-[#E7DECF] pt-1 max-w-3xl mx-auto">
            {[
              {
                q: 'Can I keep self-work private?',
                a: 'Yes. Self-work is private by default, including from family: the intended model supports private self-work and explicit sharing into professional care.'
              },
              {
                q: 'Can I choose what goes to a new therapist?',
                a: 'Yes. The continuity model is designed around selecting the relevant history instead of transferring everything automatically.'
              },
              {
                q: 'Is everything processed by AI?',
                a: 'AI use depends on the feature. The Privacy Notice will set out exactly what is processed and for what purpose.'
              }
            ].map((item) => (
              <details key={item.q} className="group py-4 sm:py-5 transition-colors">
                <summary className="font-editorial text-base sm:text-lg text-[#162723] cursor-pointer font-medium list-none flex items-center gap-3 select-none hover:text-[#795663] transition-colors">
                  <span className="text-[10px] sm:text-xs text-[#162723] group-open:rotate-90 transition-transform duration-200 inline-block font-sans">
                    ▶
                  </span>
                  <span>{item.q}</span>
                </summary>
                <p className="font-zen text-xs sm:text-sm text-[#5C6873] pt-3 pl-6 leading-relaxed max-w-2xl">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 5. DARK INK CLOSING BAND */}
      <section className="relative w-full py-20 sm:py-24 px-5 sm:px-8 bg-[#011627] text-white overflow-hidden text-center">
        {/* Subtle celestial gold watercolor glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-[#B8964A]/12 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <div className="font-mono-code text-xs tracking-widest uppercase text-[#C5A880] font-semibold">
            AGENCY OVER AUTOMATION
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-white font-normal leading-tight">
            No automated diagnosis. No autonomous treatment.
          </h2>
          <p className="font-zen text-base sm:text-lg text-[#9AA59F] leading-relaxed max-w-xl mx-auto">
            The platform surfaces patterns so you and your therapist have clarity, but the judgment, direction, and authority remain entirely with a person.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={handleAuthRedirect}
              className="inline-flex items-center justify-center px-8 py-4 rounded-full text-xs font-mono-code font-semibold tracking-wider uppercase bg-[#C5A880] text-[#011627] hover:bg-[#D8BE9B] transition-all cursor-pointer shadow-lg"
            >
              Start self-work (₹499/mo) &rarr;
            </button>
            <button
              onClick={() => handleSelectTab('how')}
              className="inline-flex items-center justify-center px-8 py-4 rounded-full text-xs font-mono-code font-semibold tracking-wider uppercase bg-transparent text-white border border-white/20 hover:border-white transition-all cursor-pointer"
            >
              See how it works &rarr;
            </button>
          </div>
        </div>
      </section>
    </div>
  );

  // -------------------------------------------------------------
  // TAB 6: EVIDENCE & RESEARCH
  // -------------------------------------------------------------
  const renderEvidence = () => (
    <div className="py-16 sm:py-24 px-5 sm:px-8 space-y-12 sm:space-y-16 max-w-5xl mx-auto relative z-10">
      {/* Header Area */}
      <div className="space-y-5 max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center gap-2.5 font-mono-code text-[11px] tracking-[0.2em] uppercase text-[#795663] font-semibold bg-white/85 backdrop-blur-xs border border-[#E7DECF] shadow-2xs px-4 py-1.5 rounded-full mx-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-[#795663]" />
          EVIDENCE & RESEARCH
        </div>
        <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-[#162723] font-normal leading-[1.12] mx-auto">
          Why these building blocks make sense.
        </h1>
        <p className="font-zen text-base sm:text-lg text-[#5C6873] leading-relaxed mx-auto">
          Ingress Within combines several evidence-informed mechanisms rather than presenting one feature as a complete answer.
        </p>
      </div>

      {/* The Evidence Cards List */}
      <div className="space-y-8">
        {/* Card 1: Digital Psychological Interventions */}
        <div className="paper-card rounded-2xl sm:rounded-3xl p-7 sm:p-10 bg-white border border-[#E7DECF] shadow-xs hover:shadow-md transition-all space-y-5 relative overflow-hidden group">
          {/* Subtle Corner Watercolor Glow */}
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#7E9E82]/12 blur-2xl pointer-events-none group-hover:scale-110 transition-transform" />

          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E7DECF]/60 pb-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF2ED] text-[#2E7A70] font-mono-code text-[11px] font-semibold tracking-wider uppercase border border-[#7E9E82]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2E7A70]" />
              DIGITAL PSYCHOLOGICAL INTERVENTIONS
            </span>
            <span className="font-mono-code text-[11px] text-[#7D8E87]">
              2024 Meta-Analysis · PubMed 39579466
            </span>
          </div>

          <h3 className="font-editorial text-2xl sm:text-3xl text-[#162723] font-normal leading-snug">
            Structured online psychological work can help some people.
          </h3>

          {/* Key Study Highlights Strip */}
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="px-3 py-1 rounded-md bg-[#FAF7F2] border border-[#E7DECF] font-mono-code text-[11px] text-[#162723] font-medium">
              154 RCTs Included
            </span>
            <span className="px-3 py-1 rounded-md bg-[#FAF7F2] border border-[#E7DECF] font-mono-code text-[11px] text-[#162723] font-medium">
              45,335 Participants
            </span>
            <span className="px-3 py-1 rounded-md bg-[#FAF7F2] border border-[#E7DECF] font-mono-code text-[11px] text-[#2E7A70] font-semibold">
              Sustained CBT Effects
            </span>
          </div>

          <p className="font-zen text-sm sm:text-base text-[#5C6873] leading-relaxed">
            A 2024 meta-analysis of 154 randomised controlled trials involving 45,335 participants found sustained effects for internet-delivered CBT across several outcomes, with results varying by intervention, outcome and guidance.
          </p>

          <div className="pt-2">
            <a
              href="https://pubmed.ncbi.nlm.nih.gov/39579466/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FAF7F2] hover:bg-[#EAF2ED] text-[#2E7A70] text-xs font-mono-code font-semibold border border-[#E7DECF] hover:border-[#7E9E82]/50 transition-all group/link shadow-2xs"
            >
              <span>Read the study on PubMed</span>
              <span className="transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5">↗</span>
            </a>
          </div>
        </div>

        {/* Card 2: Practice & Homework */}
        <div className="paper-card rounded-2xl sm:rounded-3xl p-7 sm:p-10 bg-white border border-[#E7DECF] shadow-xs hover:shadow-md transition-all space-y-5 relative overflow-hidden group">
          {/* Subtle Corner Watercolor Glow */}
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#C49A8F]/12 blur-2xl pointer-events-none group-hover:scale-110 transition-transform" />

          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E7DECF]/60 pb-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F7EFE9] text-[#795663] font-mono-code text-[11px] font-semibold tracking-wider uppercase border border-[#C49A8F]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#795663]" />
              PRACTICE & HOMEWORK
            </span>
            <span className="font-mono-code text-[11px] text-[#7D8E87]">
              Systematic Review · PubMed 37104804
            </span>
          </div>

          <h3 className="font-editorial text-2xl sm:text-3xl text-[#162723] font-normal leading-snug">
            Learning needs a chance to become behaviour.
          </h3>

          {/* Key Study Highlights Strip */}
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="px-3 py-1 rounded-md bg-[#FAF7F2] border border-[#E7DECF] font-mono-code text-[11px] text-[#162723] font-medium">
              Between-Session Practice
            </span>
            <span className="px-3 py-1 rounded-md bg-[#FAF7F2] border border-[#E7DECF] font-mono-code text-[11px] text-[#162723] font-medium">
              Collaborative Planning
            </span>
            <span className="px-3 py-1 rounded-md bg-[#FAF7F2] border border-[#E7DECF] font-mono-code text-[11px] text-[#795663] font-semibold">
              Action Over Passive Recall
            </span>
          </div>

          <p className="font-zen text-sm sm:text-base text-[#5C6873] leading-relaxed">
            A systematic review of between-session homework highlights the value of collaboratively planning, explaining and reviewing tasks. That supports making practice central to the product.
          </p>

          <div className="pt-2">
            <a
              href="https://pubmed.ncbi.nlm.nih.gov/37104804/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FAF7F2] hover:bg-[#F7EFE9] text-[#795663] text-xs font-mono-code font-semibold border border-[#E7DECF] hover:border-[#C49A8F]/50 transition-all group/link shadow-2xs"
            >
              <span>Read the review on PubMed</span>
              <span className="transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5">↗</span>
            </a>
          </div>
        </div>

        {/* Card 3: Therapeutic Relationship */}
        <div className="paper-card rounded-2xl sm:rounded-3xl p-7 sm:p-10 bg-white border border-[#E7DECF] shadow-xs hover:shadow-md transition-all space-y-5 relative overflow-hidden group">
          {/* Subtle Corner Watercolor Glow */}
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#3D5265]/10 blur-2xl pointer-events-none group-hover:scale-110 transition-transform" />

          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E7DECF]/60 pb-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF3F8] text-[#3D5265] font-mono-code text-[11px] font-semibold tracking-wider uppercase border border-[#3D5265]/25">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3D5265]" />
              THERAPEUTIC RELATIONSHIP
            </span>
            <span className="font-mono-code text-[11px] text-[#7D8E87]">
              Alliance Meta-Analysis · PubMed 29792475
            </span>
          </div>

          <h3 className="font-editorial text-2xl sm:text-3xl text-[#162723] font-normal leading-snug">
            The platform supports the therapist; it does not replace the relationship.
          </h3>

          {/* Key Study Highlights Strip */}
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="px-3 py-1 rounded-md bg-[#FAF7F2] border border-[#E7DECF] font-mono-code text-[11px] text-[#162723] font-medium">
              Alliance & Outcomes
            </span>
            <span className="px-3 py-1 rounded-md bg-[#FAF7F2] border border-[#E7DECF] font-mono-code text-[11px] text-[#162723] font-medium">
              Internet-Delivered Care
            </span>
            <span className="px-3 py-1 rounded-md bg-[#FAF7F2] border border-[#E7DECF] font-mono-code text-[11px] text-[#3D5265] font-semibold">
              Human-In-The-Loop
            </span>
          </div>

          <p className="font-zen text-sm sm:text-base text-[#5C6873] leading-relaxed">
            A large meta-analysis found a positive association between therapeutic alliance and psychotherapy outcomes, including internet-based psychotherapy.
          </p>

          <div className="pt-2">
            <a
              href="https://pubmed.ncbi.nlm.nih.gov/29792475/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FAF7F2] hover:bg-[#EEF3F8] text-[#3D5265] text-xs font-mono-code font-semibold border border-[#E7DECF] hover:border-[#3D5265]/40 transition-all group/link shadow-2xs"
            >
              <span>Read the meta-analysis on PubMed</span>
              <span className="transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5">↗</span>
            </a>
          </div>
        </div>

        {/* Card 4: Critical Limits Card (Maintained as Card, No Section Background) */}
        <div className="rounded-2xl sm:rounded-3xl p-8 sm:p-10 bg-[#011627] text-white border border-[#C5A880]/30 shadow-lg relative overflow-hidden space-y-4">
          {/* Subtle Warm Celestial Glow inside the card */}
          <div className="absolute -top-12 -right-12 w-52 h-52 rounded-full bg-[#B8964A]/15 blur-2xl pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#C5A880]/15 text-[#C5A880] font-mono-code text-[11px] font-semibold tracking-wider uppercase border border-[#C5A880]/30">
            <span>●</span>
            SCIENTIFIC BOUNDARY · LIMITS
          </div>

          <h3 className="font-editorial text-2xl sm:text-3xl text-white font-normal leading-snug">
            Evidence for an approach is not proof that this exact product works.
          </h3>

          <p className="font-zen text-sm sm:text-base text-[#9AA59F] leading-relaxed max-w-2xl">
            We keep those claims separate as our own evidence develops. Ingress Within draws upon proven behavioral and psychotherapeutic literature while conducting independent longitudinal evaluation.
          </p>
        </div>
      </div>
    </div>
  );

  // -------------------------------------------------------------
  // TAB 7: ABOUT
  // -------------------------------------------------------------
  const renderAbout = () => (
    <div className="space-y-0 w-full">
      {/* 1. HERO SECTION */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 px-5 sm:px-8 bg-gradient-to-b from-[#FAF7F2] via-[#F4EDE2]/50 to-[#FAF7F2] border-b border-[#E7DECF]/80 overflow-hidden">
        {/* Ambient Top-Right Watercolor Wash */}
        <svg
          className="absolute -top-10 -right-16 w-[420px] sm:w-[540px] h-auto opacity-50 pointer-events-none mix-blend-multiply"
          viewBox="0 0 600 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="about-rose-wash" cx="40%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#C49A8F" stopOpacity="0.38" />
              <stop offset="45%" stopColor="#D5ABA0" stopOpacity="0.22" />
              <stop offset="75%" stopColor="#EAD8CE" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#FAF7F2" stopOpacity="0" />
            </radialGradient>
          </defs>
          <path
            d="M90 60 C180 10 320 30 420 90 C510 150 560 270 510 370 C460 460 330 490 240 470 C150 450 60 380 35 280 C10 180 20 100 90 60 Z"
            fill="url(#about-rose-wash)"
          />
        </svg>

        <div className="max-w-4xl mx-auto space-y-6 relative z-10 text-center">
          <div className="flex items-center gap-3.5 pb-1 justify-center">
            <img
              src="/logo-mark-transparent.png"
              alt="Ingress Within"
              className="w-10 h-10 object-contain flex-shrink-0"
            />
            <div className="text-left">
              <div className="font-editorial text-2xl text-[#162723] leading-none">
                Ingress <span className="font-medium text-[#2E7A70]">Within</span>
              </div>
              <div className="font-mono-code text-[9px] tracking-[0.16em] uppercase text-[#7D8E87] mt-1">
                Understand · Grow · Continue
              </div>
            </div>
          </div>

          <div className="inline-flex items-center gap-2.5 font-mono-code text-[11px] tracking-[0.2em] uppercase text-[#795663] font-semibold bg-white/85 backdrop-blur-xs border border-[#E7DECF] shadow-2xs px-4 py-1.5 rounded-full mx-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-[#795663]" />
            About Ingress Within
          </div>

          <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-[#162723] font-normal leading-[1.12] max-w-3xl mx-auto">
            One place for the different ways people work on their psychological health.
          </h1>

          <p className="font-zen text-base sm:text-lg text-[#5C6873] leading-relaxed max-w-2xl mx-auto">
            Sometimes you want to work on something yourself. Sometimes you want a therapist. Sometimes you want both. Ingress Within is built around that reality rather than forcing one route.
          </p>
        </div>
      </section>

      {/* 2. BUILT FOR INDIA (MATCHING SCREENSHOT 1) */}
      <section className="relative w-full py-20 md:py-28 px-5 sm:px-8 bg-gradient-to-b from-[#F5EFE6]/90 via-[#EFE7DC]/70 to-[#F5EFE6]/90 border-b border-[#E7DECF] overflow-hidden">
        <div className="max-w-5xl mx-auto space-y-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="inline-block px-3.5 py-1 rounded-full bg-[#F7EFE9] font-mono-code text-[11px] uppercase tracking-wider text-[#795663] font-semibold border border-[#C49A8F]/30 mx-auto">
              BUILT FOR INDIA
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl lg:text-[42px] text-[#162723] font-normal leading-tight mx-auto">
              People often start with life, not clinical terminology.
            </h2>
            <p className="font-zen text-base sm:text-lg text-[#5C6873] leading-relaxed max-w-3xl mx-auto">
              “I'm overthinking.” “I can't say no.” “My career is stressing me out.” “My relationship keeps repeating the same fight.” “I have everything, so why don't I feel okay?” The language can start there while the psychological depth sits underneath it.
            </p>
          </div>

          {/* Conversational quotes cards: Odd total (5) -> Center card anchors, others emerge outward */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {[
              { quote: "I'm overthinking.", theme: "Cognitive loop", color: "#2E7A70", bg: "#EAF2ED" },
              { quote: "I can't say no.", theme: "Boundaries", color: "#795663", bg: "#F7EFE9" },
              { quote: "My career is stressing me out.", theme: "Work & Identity", color: "#3D5265", bg: "#EEF3F8" },
              { quote: "My relationship keeps repeating the same fight.", theme: "Relational patterns", color: "#B8964A", bg: "#FFF8EB" },
              { quote: "I have everything, so why don't I feel okay?", theme: "Inner alignment", color: "#6A5D7B", bg: "#F4EFF8" }
            ].map((item, idx) => (
              <motion.div
                key={item.quote}
                {...getCardEmergence(idx, 5)}
                className="paper-card paper-card-hover rounded-2xl p-6 bg-white/90 border border-[#E7DECF] shadow-2xs hover:border-[#795663]/40 transition-shadow transition-colors duration-200 space-y-2.5 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span
                    className="font-mono-code text-[10px] tracking-wider uppercase font-semibold px-2.5 py-0.5 rounded-full"
                    style={{ color: item.color, backgroundColor: item.bg }}
                  >
                    {item.theme}
                  </span>
                  <span className="font-editorial text-2xl text-[#C49A8F]/50 leading-none">“</span>
                </div>
                <p className="font-editorial text-lg text-[#162723] italic leading-snug">
                  "{item.quote}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. WHO'S BEHIND THIS (MATCHING SCREENSHOT 2) */}
      <section className="relative w-full py-20 md:py-28 px-5 sm:px-8 bg-[#FAF7F2]/85 border-b border-[#E7DECF]/75 overflow-hidden">
        <div className="max-w-5xl mx-auto space-y-10 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="inline-block px-3.5 py-1 rounded-full bg-[#F7EFE9] font-mono-code text-[11px] uppercase tracking-wider text-[#795663] font-semibold border border-[#C49A8F]/30 mx-auto">
              WHO'S BEHIND THIS
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl lg:text-[42px] text-[#162723] font-normal leading-tight mx-auto">
              Care from qualified professionals.
            </h2>
          </div>

          {/* 3 Therapist Profiles: Odd total (3) -> Center card anchors, left/right emerge outward */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Card 1 */}
            <motion.div
              {...getCardEmergence(0, 3)}
              className="paper-card paper-card-hover rounded-2xl sm:rounded-3xl p-8 sm:p-9 bg-white border border-[#E7DECF] shadow-xs hover:border-[#795663]/40 transition-shadow transition-colors duration-200 flex flex-col justify-between space-y-6 cursor-pointer"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#EAF2ED] flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#2E7A70" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <h3 className="font-editorial text-2xl text-[#162723] font-medium leading-snug">
                  Verified therapist profiles
                </h3>
                <p className="font-zen text-sm text-[#5C6873] leading-relaxed">
                  Every therapist's qualifications and experience are reviewed before they're listed, and shown on their profile so you know who you're speaking with.
                </p>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              {...getCardEmergence(1, 3)}
              className="paper-card paper-card-hover rounded-2xl sm:rounded-3xl p-8 sm:p-9 bg-white border border-[#E7DECF] shadow-xs hover:border-[#795663]/40 transition-shadow transition-colors duration-200 flex flex-col justify-between space-y-6 cursor-pointer"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#EEF3F8] flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#3D5265" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="m19 8 2 2 4-4" />
                  </svg>
                </div>
                <h3 className="font-editorial text-2xl text-[#162723] font-medium leading-snug">
                  You choose your therapist
                </h3>
                <p className="font-zen text-sm text-[#5C6873] leading-relaxed">
                  Browse profiles and areas of focus before you book. Nobody is assigned to you without a choice.
                </p>
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              {...getCardEmergence(2, 3)}
              className="paper-card paper-card-hover rounded-2xl sm:rounded-3xl p-8 sm:p-9 bg-white border border-[#E7DECF] shadow-xs hover:border-[#795663]/40 transition-shadow transition-colors duration-200 flex flex-col justify-between space-y-6 cursor-pointer"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#F7EFE9] flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#795663" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <h3 className="font-editorial text-2xl text-[#162723] font-medium leading-snug">
                  Built with real conversations
                </h3>
                <p className="font-zen text-sm text-[#5C6873] leading-relaxed">
                  Features are shaped by talking to people who journal, and people who've been in therapy in India, not designed in a vacuum.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. PRIVATE, EVEN FROM FAMILY (MATCHING SCREENSHOT 3) */}
      <section className="relative w-full py-20 md:py-28 px-5 sm:px-8 bg-gradient-to-b from-[#F5EFE6]/90 via-[#EFE7DC]/70 to-[#F5EFE6]/90 border-b border-[#E7DECF] overflow-hidden">
        <div className="max-w-5xl mx-auto space-y-6 relative z-10 text-center">
          <span className="inline-block px-3.5 py-1 rounded-full bg-[#F7EFE9] font-mono-code text-[11px] uppercase tracking-wider text-[#795663] font-semibold border border-[#C49A8F]/30 mx-auto">
            PRIVATE, EVEN FROM FAMILY
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-[42px] text-[#162723] font-normal leading-tight mx-auto">
            What you share here stays yours to share.
          </h2>
          <p className="font-zen text-base sm:text-lg text-[#5C6873] leading-relaxed max-w-3xl mx-auto">
            Self-work stays private by default. Nobody, including family members, can see it unless you choose to share it, and a therapist only sees what you explicitly bring into session.
          </p>

          {/* 3 Privacy Pillars: Odd total (3) -> Center card anchors, left/right emerge outward */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-left">
            <motion.div
              {...getCardEmergence(0, 3)}
              className="p-6 rounded-2xl bg-white/90 border border-[#E7DECF] hover:border-[#795663]/40 transition-shadow transition-colors duration-200 space-y-2 shadow-2xs cursor-pointer"
            >
              <span className="font-mono-code text-xs font-semibold text-[#2E7A70]">01 · DEFAULT PRIVATE</span>
              <p className="font-zen text-xs sm:text-sm text-[#162723]">No automatic sharing with anyone, including loved ones or family members.</p>
            </motion.div>
            <motion.div
              {...getCardEmergence(1, 3)}
              className="p-6 rounded-2xl bg-white/90 border border-[#E7DECF] hover:border-[#795663]/40 transition-shadow transition-colors duration-200 space-y-2 shadow-2xs cursor-pointer"
            >
              <span className="font-mono-code text-xs font-semibold text-[#795663]">02 · EXPLICIT SELECTION</span>
              <p className="font-zen text-xs sm:text-sm text-[#162723]">A therapist only receives what you intentionally select and bring to session.</p>
            </motion.div>
            <motion.div
              {...getCardEmergence(2, 3)}
              className="p-6 rounded-2xl bg-white/90 border border-[#E7DECF] hover:border-[#795663]/40 transition-shadow transition-colors duration-200 space-y-2 shadow-2xs cursor-pointer"
            >
              <span className="font-mono-code text-xs font-semibold text-[#3D5265]">03 · INDIAN DPDP ALIGNED</span>
              <p className="font-zen text-xs sm:text-sm text-[#162723]">Engineered under India's Digital Personal Data Protection regulatory safeguards.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. WHY NOW (MATCHING SCREENSHOT 5) */}
      <section className="relative w-full py-20 md:py-28 px-5 sm:px-8 bg-[#FAF7F2]/85 border-b border-[#E7DECF]/75 overflow-hidden">
        <div className="max-w-5xl mx-auto space-y-6 relative z-10 text-center">
          <span className="inline-block px-3.5 py-1 rounded-full bg-[#F7EFE9] font-mono-code text-[11px] uppercase tracking-wider text-[#795663] font-semibold border border-[#C49A8F]/30 mx-auto">
            WHY NOW
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-[42px] text-[#162723] font-normal leading-tight mx-auto">
            This conversation is already happening around you.
          </h2>
          <p className="font-zen text-base sm:text-lg text-[#5C6873] leading-relaxed max-w-3xl mx-auto">
            More people in India are talking openly about burnout, overthinking and family pressure than five years ago, in the news, at work, among friends. What's often missing isn't awareness, it's a place to actually work through it at your own pace, privately, without waiting for a crisis.
          </p>
        </div>
      </section>

      {/* 6. COMMON QUESTIONS (MATCHING SCREENSHOT 4) */}
      <section className="relative w-full py-20 md:py-28 px-5 sm:px-8 bg-gradient-to-b from-[#F5EFE6]/90 via-[#EFE7DC]/70 to-[#F5EFE6]/90 border-b border-[#E7DECF] overflow-hidden">
        <div className="max-w-5xl mx-auto space-y-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="inline-block px-3.5 py-1 rounded-full bg-[#F7EFE9] font-mono-code text-[11px] uppercase tracking-wider text-[#795663] font-semibold border border-[#C49A8F]/30 mx-auto">
              COMMON QUESTIONS
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl lg:text-[42px] text-[#162723] font-normal leading-tight mx-auto">
              Before you start.
            </h2>
          </div>

          {/* Collapsible Questions List with Clean Dividing Lines (Matching Screenshot 4) */}
          <div className="border-t border-[#E7DECF] divide-y divide-[#E7DECF] pt-1 max-w-3xl mx-auto">
            {[
              {
                q: 'Do I need to know if I want self-work or therapy?',
                a: 'No. Start with whichever feels easier, and switch or combine them whenever you want.'
              },
              {
                q: 'Is this only for people with a diagnosed condition?',
                a: 'No. Most people here are dealing with everyday emotional patterns (stress, guilt, overthinking, family or work pressure) before they build into something bigger, not a diagnosed disorder.'
              },
              {
                q: 'Can my family see what I write?',
                a: 'No. Your journal and self-work stay private by default, and nothing is shared without you choosing to.'
              },
              {
                q: 'Do I need to speak English?',
                a: 'English is supported at launch, with Hindi and other Indian languages planned next.'
              },
              {
                q: 'What if I want to stop?',
                a: 'You can cancel your self-work subscription anytime, and you\'re never locked into ongoing therapy sessions.'
              }
            ].map((item) => (
              <details key={item.q} className="group py-4 sm:py-5 transition-colors">
                <summary className="font-editorial text-base sm:text-lg text-[#162723] cursor-pointer font-medium list-none flex items-center gap-3 select-none hover:text-[#795663] transition-colors">
                  <span className="text-[10px] sm:text-xs text-[#162723] group-open:rotate-90 transition-transform duration-200 inline-block font-sans">
                    ▶
                  </span>
                  <span>{item.q}</span>
                </summary>
                <p className="font-zen text-xs sm:text-sm text-[#5C6873] pt-3 pl-6 leading-relaxed max-w-2xl">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 7. DARK INK CLOSING BAND */}
      <section className="relative w-full py-20 sm:py-24 px-5 sm:px-8 bg-[#011627] text-white overflow-hidden text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-[#B8964A]/12 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <div className="font-mono-code text-xs tracking-widest uppercase text-[#C5A880] font-semibold">
            UNDERSTAND. GROW. CONTINUE.
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-white font-normal leading-tight">
            If any of this sounded familiar, that's the point to start.
          </h2>
          <p className="font-zen text-base sm:text-lg text-[#9AA59F] leading-relaxed max-w-xl mx-auto">
            You don't have to wait for a breaking point to give your mental health structured care.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={handleAuthRedirect}
              className="inline-flex items-center justify-center px-8 py-4 rounded-full text-xs font-mono-code font-semibold tracking-wider uppercase bg-[#C5A880] text-[#011627] hover:bg-[#D8BE9B] transition-all cursor-pointer shadow-lg"
            >
              Start understanding yourself &rarr;
            </button>
            <button
              onClick={() => handleSelectTab('how')}
              className="inline-flex items-center justify-center px-7 py-4 rounded-full text-xs font-mono-code font-semibold tracking-wider uppercase bg-white/10 hover:bg-white/15 text-white border border-white/20 transition-all cursor-pointer"
            >
              Show me how it connects &rarr;
            </button>
          </div>
        </div>
      </section>
    </div>
  );

  // -------------------------------------------------------------
  // TAB 8: POLICIES
  // -------------------------------------------------------------
  const renderPolicies = () => (
    <div className="py-16 sm:py-24 px-5 sm:px-8 space-y-12 max-w-4xl mx-auto">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="font-mono-code text-xs tracking-widest uppercase text-[#795663] font-semibold">
          POLICIES
        </div>
        <h1 className="font-editorial text-4xl text-[#162723] font-normal mx-auto">
          Privacy, terms & refunds.
        </h1>
        <p className="font-zen text-sm text-[#5C6873] mx-auto">
          These are working drafts, shared for transparency ahead of launch. Final versions are reviewed by legal counsel.
        </p>
      </div>

      <div className="space-y-8">
        <div className="paper-card rounded-2xl p-8 bg-white border border-[#E7DECF] space-y-3">
          <h3 className="font-editorial text-xl text-[#162723]">Privacy Policy</h3>
          <p className="font-zen text-xs sm:text-sm text-[#5C6873] leading-relaxed">
            Covers what's collected (journal entries, session information, payment details), why it's collected, who can access it, how AI is used, how long data is retained, how to request deletion, and your rights under applicable Indian data protection law (DPDP Act).
          </p>
        </div>

        <div className="paper-card rounded-2xl p-8 bg-white border border-[#E7DECF] space-y-3">
          <h3 className="font-editorial text-xl text-[#162723]">Terms of Use</h3>
          <p className="font-zen text-xs sm:text-sm text-[#5C6873] leading-relaxed">
            Covers eligibility, account responsibilities, acceptable use, the non-clinical role of AI-generated observations and reports, therapist-client conduct, and limitation of liability.
          </p>
        </div>

        <div className="paper-card rounded-2xl p-8 bg-white border border-[#E7DECF] space-y-3">
          <h3 className="font-editorial text-xl text-[#162723]">Cancellation & Refund Policy</h3>
          <p className="font-zen text-xs sm:text-sm text-[#5C6873] leading-relaxed">
            In line with standard practice across therapy platforms in India, individual therapy sessions are not eligible for a refund once booked, as a therapist has reserved that time for you. You can reschedule free of charge at least 24 hours before your session. The monthly self-work subscription (₹499/mo) can be cancelled anytime with one click for future cycles.
          </p>
        </div>
      </div>
    </div>
  );

  // -------------------------------------------------------------
  // TAB 9: START HERE / CONTACT
  // -------------------------------------------------------------
  const renderStart = () => (
    <div className="py-16 sm:py-24 px-5 sm:px-8 space-y-16 max-w-5xl mx-auto text-left">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2.5 font-mono-code text-[11px] tracking-[0.16em] uppercase text-[#795663] font-semibold bg-[#FDFBF8] border border-[#E7DECF] px-3.5 py-1.5 rounded-full shadow-xs">
          <img
            src="/logo-mark-transparent.png"
            alt="Ingress Within"
            className="w-4 h-4 object-contain"
          />
          <span>Understand · Grow · Continue</span>
        </div>
        <div className="font-mono-code text-xs tracking-widest uppercase text-[#795663] font-semibold">
          START HERE
        </div>
        <h1 className="font-editorial text-4xl sm:text-5xl text-[#162723] font-normal leading-tight">
          What would be useful to you right now?
        </h1>
        <p className="font-zen text-base text-[#5C6873]">
          Choose the kind of work or support you want today: no required order.
        </p>
      </div>

      {/* 3 Starting Path Cards: Odd total (3) -> Center card anchors, left/right emerge outward */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          {...getCardEmergence(0, 3)}
          className="paper-card paper-card-hover rounded-2xl p-7 bg-white border border-[#E7DECF] hover:border-[#795663]/40 transition-shadow transition-colors duration-200 flex flex-col justify-between space-y-6 cursor-pointer"
        >
          <div className="space-y-3">
            <span className="font-mono-code text-xs text-[#5C7D64] font-semibold">WORK ON YOURSELF</span>
            <h3 className="font-editorial text-xl text-[#162723]">I want to work on something independently.</h3>
            <p className="font-zen text-xs text-[#5C6873]">
              Start with the journal, weekly reports and pattern detection.
            </p>
          </div>
          <a
            href="/login"
            onClick={handleAuthRedirect}
            className="w-full text-center py-3 bg-[#162723] text-white rounded-full text-xs font-semibold cursor-pointer"
          >
            Start journaling · ₹499/mo →
          </a>
        </motion.div>

        <motion.div
          {...getCardEmergence(1, 3)}
          className="paper-card paper-card-hover rounded-2xl p-7 bg-white border-2 border-[#795663]/40 hover:border-[#795663]/70 transition-shadow transition-colors duration-200 flex flex-col justify-between space-y-6 cursor-pointer"
        >
          <div className="space-y-3">
            <span className="font-mono-code text-xs text-[#795663] font-semibold">WITH A THERAPIST</span>
            <h3 className="font-editorial text-xl text-[#162723]">I want professional support.</h3>
            <p className="font-zen text-xs text-[#5C6873]">
              See goals, dashboard, homework, psychoeducation and continuity.
            </p>
          </div>
          <a
            href="/therapist/auth"
            className="w-full text-center py-3 bg-[#795663] text-white rounded-full text-xs font-semibold cursor-pointer"
          >
            Book your first session →
          </a>
        </motion.div>

        <motion.div
          {...getCardEmergence(2, 3)}
          className="paper-card paper-card-hover rounded-2xl p-7 bg-white border border-[#E7DECF] hover:border-[#795663]/40 transition-shadow transition-colors duration-200 flex flex-col justify-between space-y-6 cursor-pointer"
        >
          <div className="space-y-3">
            <span className="font-mono-code text-xs text-[#4A6478] font-semibold">USE BOTH</span>
            <h3 className="font-editorial text-xl text-[#162723]">I want the two to work together.</h3>
            <p className="font-zen text-xs text-[#5C6873]">
              Bring selected self-work into therapy and continue learning independently.
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleSelectTab('how')}
            className="w-full text-center py-3 bg-[#FAF7F2] text-[#162723] border border-[#E7DECF] rounded-full text-xs font-semibold cursor-pointer"
          >
            Show me how it connects →
          </button>
        </motion.div>
      </div>

      {/* Orientation Call / Inquiry Booking */}
      <div className="paper-card rounded-2xl p-8 bg-[#FAF7F2] border border-[#E7DECF] space-y-6">
        <div>
          <span className="font-mono-code text-xs text-[#7D8E87] uppercase font-semibold">NOT SURE WHICH ONE YET?</span>
          <h3 className="font-editorial text-2xl text-[#162723] pt-1">Talk to us first: no commitment, no charge.</h3>
          <p className="font-zen text-xs sm:text-sm text-[#5C6873] pt-2">
            A free 15-minute orientation call to explain which option is likely to fit.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
          <div>
            <label className="font-mono-code text-[10px] text-[#7D8E87] block mb-1">DATE</label>
            <input
              type="date"
              value={orientDate}
              onChange={(e) => setOrientDate(e.target.value)}
              className="w-full p-3 bg-white rounded-lg border border-[#E7DECF] text-xs font-zen"
            />
          </div>
          <div>
            <label className="font-mono-code text-[10px] text-[#7D8E87] block mb-1">TIME</label>
            <select
              value={orientTime}
              onChange={(e) => setOrientTime(e.target.value)}
              className="w-full p-3 bg-white rounded-lg border border-[#E7DECF] text-xs font-zen"
            >
              <option>10:00 AM</option>
              <option>12:00 PM</option>
              <option>3:00 PM</option>
              <option>5:30 PM</option>
              <option>7:00 PM</option>
            </select>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setBookingNotice('Orientation slot selected! Our care team will confirm via email.')}
          className="py-3 px-6 bg-[#162723] text-white text-xs font-semibold rounded-full cursor-pointer hover:bg-[#203631]"
        >
          Reserve my free call
        </button>
        {bookingNotice && (
          <p className="text-xs font-zen text-[#5C7D64] font-medium">{bookingNotice}</p>
        )}
      </div>
    </div>
  );

  // -------------------------------------------------------------
  // TAB 10: CRISIS RESOURCES (Clear, Accessible, Emergency-First)
  // -------------------------------------------------------------
  const renderCrisis = () => (
    <div className="py-16 sm:py-24 px-5 sm:px-8 space-y-10 max-w-3xl mx-auto text-left">
      <div className="space-y-4 text-center">
        <div className="inline-block font-mono-code text-xs tracking-widest uppercase text-[#9A4232] font-semibold bg-[#FBEBE8] px-3.5 py-1 rounded-full">
          EMERGENCY SUPPORT
        </div>
        <h1 className="font-editorial text-3xl sm:text-4xl text-[#162723] font-normal leading-snug">
          If you're in crisis, start here, not on the rest of this site.
        </h1>
        <p className="font-zen text-sm sm:text-base text-[#5C6873] leading-relaxed">
          Ingress Within is a self-work and therapist platform. It is not built or staffed to respond in real time, so it cannot be your safety net in an emergency. The services below can.
        </p>
      </div>

      <div className="p-8 rounded-2xl bg-[#FFF8EB] border border-[#B8964A]/40 space-y-6 shadow-sm">
        <div className="space-y-2">
          <h3 className="font-editorial text-xl text-[#7A3F00] font-semibold">
            If there is immediate danger to life
          </h3>
          <p className="font-zen text-xs sm:text-sm text-[#7A3F00]">
            Call <strong className="text-base font-mono-code font-bold">112</strong> (National Emergency Number) or go to the nearest hospital emergency room.
          </p>
        </div>

        <div className="space-y-4 border-t border-[#B8964A]/20 pt-5 text-xs sm:text-sm font-zen text-[#4A3A13]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-[#B8964A]/15 pb-3">
            <b className="font-semibold text-base text-[#162723]">Tele MANAS (Govt. of India)</b>
            <span className="font-mono-code font-bold text-sm text-[#795663]">14416 or 1-800-891-4416 (24×7)</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-[#B8964A]/15 pb-3">
            <b className="font-semibold text-[#162723]">AASRA</b>
            <span className="font-mono-code text-xs text-[#5C6873]">+91 98204 66726 (24×7)</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-[#B8964A]/15 pb-3">
            <b className="font-semibold text-[#162723]">Vandrevala Foundation</b>
            <span className="font-mono-code text-xs text-[#5C6873]">1860-266-2345 (24×7 · Call & WhatsApp)</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <b className="font-semibold text-[#162723]">iCall (TISS)</b>
            <span className="font-mono-code text-xs text-[#5C6873]">+91 9152987821 (Mon–Sat, 8am–10pm)</span>
          </div>
        </div>

        <p className="font-zen text-[11.5px] text-[#7A3F00]/80 leading-relaxed border-t border-[#B8964A]/20 pt-4">
          Ingress Within does not operate these helplines and can't guarantee wait times or availability, as they are independent services included here for your safety.
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#162723] font-zen selection:bg-[#EFE3E4] selection:text-[#795663] relative">
      {/* 1. Ambient SVG Watercolor Bleeds */}
      <WatercolorBackground />

      {/* 2. Editorial Top Navbar */}
      <EditorialNavbar activeTab={activeTab} onSelectTab={handleSelectTab} />

      {/* 3. Main Content Area */}
      <main className="relative z-10">
        {activeTab === 'home' && renderHome()}
        {activeTab === 'solution' && renderSolution()}
        {activeTab === 'how' && renderHowItWorks()}
        {activeTab === 'pricing' && renderPricing()}
        {activeTab === 'ai' && renderAiData()}
        {activeTab === 'evidence' && renderEvidence()}
        {activeTab === 'about' && renderAbout()}
        {activeTab === 'policies' && renderPolicies()}
        {activeTab === 'start' && renderStart()}
        {activeTab === 'crisis' && renderCrisis()}
      </main>

      {/* 4. Editorial Dark Ink Footer */}
      <PublicFooter onSelectTab={handleSelectTab} onOpenPolicy={onOpenPolicy} />
    </div>
  );
}
