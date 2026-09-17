import React, { useState, useEffect } from 'react';
import WatercolorBackground from '../../components/public-v2/WatercolorBackground';
import EditorialNavbar from '../../components/public-v2/EditorialNavbar';
import ThreeWaysSection from '../../components/public-v2/ThreeWaysSection';
import SpectrumOfInquirySection from '../../components/public-v2/SpectrumOfInquirySection';
import ContinuousJourneySection from '../../components/public-v2/ContinuousJourneySection';
import FourStageRhythmSection from '../../components/public-v2/FourStageRhythmSection';
import AIHumanBoundaryDiagram from '../../components/public-v2/AIHumanBoundaryDiagram';
import PublicFooter from '../../components/public-v2/PublicFooter';

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

  // Sync tab with URL / props
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

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
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 px-5 sm:px-8 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          
          {/* Brand Eyebrow with Official Logo Mark & Tagline */}
          <div className="inline-flex items-center gap-2.5 font-mono-code text-[10.5px] sm:text-[11.5px] tracking-[0.2em] uppercase text-[#795663] font-semibold bg-[#FDFBF8] border border-[#E7DECF] shadow-xs px-4.5 py-2 rounded-full mb-1">
            <img
              src="/logo-mark-transparent.png"
              alt="Ingress Within Logo"
              className="w-4 h-4 sm:w-5 sm:h-5 object-contain"
            />
            <span>UNDERSTAND · GROW · CONTINUE</span>
          </div>

          {/* Headline with soft terracotta brushstroke under "start" */}
          <h1 className="font-editorial text-4xl sm:text-6xl md:text-[68px] text-[#162723] font-normal tracking-tight leading-[1.08] max-w-3xl mx-auto">
            Whatever brings you here,{' '}
            <span className="relative inline-block">
              you can start
              <svg
                className="absolute -bottom-2 sm:-bottom-3 left-0 w-full h-3 sm:h-4 text-[#C49A8F] opacity-75 pointer-events-none"
                viewBox="0 0 200 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 10 C50 4 130 5 196 11 C150 14 90 15 20 12"
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
              </svg>
            </span>{' '}
            there.
          </h1>

          {/* Subtitle from HTML */}
          <p className="font-zen text-base sm:text-lg md:text-xl text-[#5C6873] max-w-2xl mx-auto leading-relaxed pt-2">
            Most of what brings people here isn't a disorder — it's feelings that got pushed aside for too long. You may want to work on something yourself. You may want a therapist. You may want both. Ingress Within brings those ways of working on your mental health into one platform.
          </p>

          {/* Dual Action CTAs */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <a
              href="/login"
              onClick={handleAuthRedirect}
              className="inline-flex items-center gap-2 bg-[#162723] hover:bg-[#203631] text-white font-zen text-sm sm:text-[15px] font-medium px-7 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer"
            >
              <span>Take the first step</span>
              <span className="text-base">→</span>
            </a>
            <button
              type="button"
              onClick={() => handleSelectTab('how')}
              className="inline-flex items-center gap-2 bg-[#FDFBF8] hover:bg-white text-[#162723] border border-[#E7DECF] font-zen text-sm sm:text-[15px] font-medium px-6 py-3.5 rounded-full shadow-xs hover:shadow transition-all cursor-pointer"
            >
              <span className="text-xs">▶</span>
              <span>Show me how it works</span>
            </button>
          </div>

          <p className="font-handwriting text-[#7D8E87] text-sm pt-1">
            There is no required order.
          </p>

          {/* Trust Chips from HTML */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
            <span className="font-mono-code text-[11px] sm:text-xs text-[#4F635E] bg-[#FAF7F2] border border-[#E7DECF] px-3.5 py-1.5 rounded-full">
              ✓ Verified therapists
            </span>
            <span className="font-mono-code text-[11px] sm:text-xs text-[#4F635E] bg-[#FAF7F2] border border-[#E7DECF] px-3.5 py-1.5 rounded-full">
              ✓ Private by default
            </span>
            <span className="font-mono-code text-[11px] sm:text-xs text-[#4F635E] bg-[#FAF7F2] border border-[#E7DECF] px-3.5 py-1.5 rounded-full">
              ✓ Priced in ₹
            </span>
            <span className="font-mono-code text-[11px] sm:text-xs text-[#4F635E] bg-[#FAF7F2] border border-[#E7DECF] px-3.5 py-1.5 rounded-full">
              ✓ Built for India
            </span>
          </div>

          {/* Hero Window / Journal Interface Peek (matching reference screenshot media_1789581839981.jpg) */}
          <div className="pt-10 max-w-3xl mx-auto">
            <div className="paper-card rounded-2xl p-4 sm:p-5 text-left bg-[#FDFBF8] border border-[#E7DECF] shadow-[0_12px_36px_rgba(1,22,39,0.06)]">
              <div className="flex items-center justify-between border-b border-[#E7DECF]/80 pb-3 mb-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#E5A898]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#8AA688]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#BFCAD7]" />
                </div>
                <div className="font-mono-code text-[10px] tracking-wider text-[#7D8E87] uppercase font-semibold">
                  • INGRESS WITHIN • PRIVATE SESSION • CYCLE 1 • DAY 06
                </div>
                <div className="w-4" />
              </div>
              <div className="p-4 sm:p-6 bg-[#FAF7F2] rounded-xl border border-[#E7DECF]/60 space-y-3">
                <div className="font-editorial text-xl sm:text-2xl text-[#162723] font-normal">
                  "I stayed silent when everyone assumed I was fine with the extra shifts."
                </div>
                <p className="font-zen text-xs sm:text-sm text-[#5C6873] leading-relaxed">
                  Notice how tension settled in your shoulders before you replied. Your reflection surfaces a familiar reflex: agreeing to protect harmony, then carrying the quiet resentment alone.
                </p>
                <div className="pt-2 flex items-center gap-2">
                  <span className="font-mono-code text-[10px] bg-white border border-[#E7DECF] text-[#795663] px-2.5 py-1 rounded-full font-semibold">
                    Pattern: Automatic Agreeing
                  </span>
                  <span className="font-mono-code text-[10px] bg-white border border-[#E7DECF] text-[#8AA688] px-2.5 py-1 rounded-full font-semibold">
                    Frequency: 4th time this cycle
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. SECTION 02: THREE WAYS TO WORK ON YOUR MENTAL HEALTH */}
      <ThreeWaysSection onSelectTab={handleSelectTab} />

      {/* 3. SECTION 04: THE SPECTRUM OF INQUIRY */}
      <SpectrumOfInquirySection />

      {/* 4. SECTION 01: A CONTINUOUS JOURNEY */}
      <ContinuousJourneySection />

      {/* 5. SECTION 05: THE 4-STAGE RHYTHM */}
      <FourStageRhythmSection />

      {/* 6. WHAT INGRESS WITHIN BRINGS TOGETHER */}
      <section className="py-20 md:py-28 px-5 sm:px-8 bg-[#FDFBF8] border-y border-[#E7DECF]/80">
        <div className="max-w-5xl mx-auto space-y-12 text-center">
          <div className="space-y-3">
            <div className="font-mono-code text-[10.5px] sm:text-[11px] tracking-[0.18em] uppercase text-[#795663] font-semibold">
              WHAT INGRESS WITHIN BRINGS TOGETHER
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl text-[#162723] font-normal">
              Different needs. One system.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            {/* Card 1 */}
            <div className="paper-card rounded-2xl p-8 bg-white border border-[#E7DECF] space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[#E7EFE5] flex items-center justify-center text-[#8AA688]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-7 h-7">
                  <path d="M4 19.5 A2.5 2.5 0 0 1 6.5 17 H20" />
                  <path d="M6.5 2 H20 v20 H6.5 A2.5 2.5 0 0 1 4 19.5 v-15 A2.5 2.5 0 0 1 6.5 2 z" />
                </svg>
              </div>
              <h3 className="font-editorial text-xl text-[#162723]">Work on yourself</h3>
              <p className="font-zen text-[13.5px] text-[#5C6873] leading-relaxed">
                Journal, weekly reports, and patterns AI notices over time.
              </p>
            </div>

            {/* Card 2 */}
            <div className="paper-card rounded-2xl p-8 bg-white border border-[#E7DECF] space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[#EBEFF2] flex items-center justify-center text-[#283D38]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-7 h-7">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <path d="M9 16 l2 2 l4 -4" />
                </svg>
              </div>
              <h3 className="font-editorial text-xl text-[#162723]">Work with a therapist</h3>
              <p className="font-zen text-[13.5px] text-[#5C6873] leading-relaxed">
                A shared dashboard for sessions, homework and goals.
              </p>
            </div>

            {/* Card 3 */}
            <div className="paper-card rounded-2xl p-8 bg-white border border-[#E7DECF] space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[#F5EAE4] flex items-center justify-center text-[#795663]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-7 h-7">
                  <path d="M7 16 V4 M7 4 L3 8 M7 4 L11 8" />
                  <path d="M17 8 v12 M17 20 l-4 -4 M17 20 l4 -4" />
                </svg>
              </div>
              <h3 className="font-editorial text-xl text-[#162723]">Move between them</h3>
              <p className="font-zen text-[13.5px] text-[#5C6873] leading-relaxed">
                A journal entry can become therapy material, and back.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. SOUND FAMILIAR? */}
      <section className="py-20 md:py-24 px-5 sm:px-8 bg-[#FAF7F2]">
        <div className="max-w-4xl mx-auto text-center space-y-6">
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
            ].map((chip) => {
              const active = selectedChips.has(chip);
              return (
                <button
                  key={chip}
                  type="button"
                  onClick={() => toggleFamiliarChip(chip)}
                  className={`font-zen text-xs sm:text-[13.5px] px-5 py-2.5 rounded-full border transition-all cursor-pointer ${
                    active
                      ? 'bg-[#795663] text-white border-transparent shadow-sm'
                      : 'bg-white text-[#162723] border-[#E7DECF] hover:border-[#795663]/40'
                  }`}
                >
                  {chip}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. WHY PEOPLE START HERE */}
      <section className="py-20 md:py-28 px-5 sm:px-8 bg-[#FDFBF8] border-t border-[#E7DECF]/80">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <div className="font-mono-code text-[10.5px] sm:text-[11px] tracking-[0.18em] uppercase text-[#7D8E87] font-semibold">
              WHY PEOPLE START HERE
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl text-[#162723] font-normal">
              Three common starting points.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="paper-card rounded-xl p-7 bg-[#FAF7F2] border border-[#E7DECF] space-y-3">
              <div className="font-editorial text-base text-[#162723] font-semibold leading-snug">
                "I just want to understand myself first."
              </div>
              <p className="font-zen text-xs text-[#5C6873] leading-relaxed">
                Not ready for therapy, but want more than guessing at why they feel a certain way.
              </p>
            </div>
            <div className="paper-card rounded-xl p-7 bg-[#FAF7F2] border border-[#E7DECF] space-y-3">
              <div className="font-editorial text-base text-[#162723] font-semibold leading-snug">
                "I don't want to repeat my whole story again."
              </div>
              <p className="font-zen text-xs text-[#5C6873] leading-relaxed">
                Been to therapy before, tired of starting from zero with someone new.
              </p>
            </div>
            <div className="paper-card rounded-xl p-7 bg-[#FAF7F2] border border-[#E7DECF] space-y-3">
              <div className="font-editorial text-base text-[#162723] font-semibold leading-snug">
                "I have a therapist, but weeks in between feel unsupported."
              </div>
              <p className="font-zen text-xs text-[#5C6873] leading-relaxed">
                Wants somewhere to put thoughts down between sessions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. A QUICK LOOK (3 Steps Diagram) */}
      <section className="py-20 md:py-24 px-5 sm:px-8 bg-[#FAF7F2]">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-3">
            <div className="font-mono-code text-[10.5px] sm:text-[11px] tracking-[0.18em] uppercase text-[#7D8E87] font-semibold">
              A QUICK LOOK
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl text-[#162723] font-normal">
              From a journal entry to a clearer pattern, in three steps.
            </h2>
          </div>

          {/* 3 Step Flow */}
          <div className="paper-card rounded-2xl p-6 sm:p-10 bg-white border border-[#E7DECF]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="p-6 rounded-xl bg-[#FAF7F2] border border-[#E7DECF] text-center space-y-2">
                <span className="font-mono-code text-xs text-[#B8964A] font-bold">01</span>
                <div className="font-editorial text-lg text-[#162723]">Write</div>
                <p className="font-zen text-xs text-[#5C6873]">A few minutes a day, guided or free-flow.</p>
              </div>
              <div className="p-6 rounded-xl bg-[#FAF7F2] border border-[#E7DECF] text-center space-y-2">
                <span className="font-mono-code text-xs text-[#B8964A] font-bold">02</span>
                <div className="font-editorial text-lg text-[#162723]">See the report</div>
                <p className="font-zen text-xs text-[#5C6873]">Weekly summary surfaces themes and words.</p>
              </div>
              <div className="p-6 rounded-xl bg-[#FDFBF8] border-2 border-[#795663]/40 text-center space-y-2">
                <span className="font-mono-code text-xs text-[#795663] font-bold">03</span>
                <div className="font-editorial text-lg text-[#162723]">Understand, act</div>
                <p className="font-zen text-xs text-[#5C6873]">Conscious choices aligned with your values.</p>
              </div>
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
          </div>
        </div>
      </section>

      {/* 10. PRICING IN SHORT (Dynamic ₹499 & ₹999) */}
      <section className="py-20 md:py-28 px-5 sm:px-8 bg-[#FDFBF8] border-t border-[#E7DECF]">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <div className="font-mono-code text-[10.5px] sm:text-[11px] tracking-[0.18em] uppercase text-[#7D8E87] font-semibold">
              PRICING, IN SHORT
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl text-[#162723] font-normal">
              Simple, transparent, in rupees.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {/* Plan 1 */}
            <div className="paper-card rounded-2xl p-8 bg-white border border-[#E7DECF] flex flex-col justify-between space-y-6">
              <div>
                <span className="font-mono-code text-[10px] tracking-wider uppercase font-semibold text-[#5C7D64]">
                  SELF-WORK PLATFORM
                </span>
                <div className="flex items-baseline gap-2 mt-3">
                  <span className="font-mono-code text-4xl text-[#795663] font-semibold">₹499</span>
                  <span className="font-zen text-xs text-[#5C6873]">/ month (+ 18% GST)</span>
                </div>
                <p className="font-zen text-xs text-[#5C6873] leading-relaxed pt-3">
                  Journal, weekly & monthly reports included. Psychoeducation modules purchased separately, only when relevant.
                </p>
              </div>
              <a
                href="/login"
                onClick={handleAuthRedirect}
                className="w-full text-center py-3 bg-[#FAF7F2] hover:bg-white text-[#162723] border border-[#E7DECF] rounded-full text-xs font-semibold cursor-pointer"
              >
                Write your first entry →
              </a>
            </div>

            {/* Plan 2 */}
            <div className="paper-card rounded-2xl p-8 bg-white border-2 border-[#795663]/40 flex flex-col justify-between space-y-6">
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
                className="w-full text-center py-3 bg-[#795663] hover:bg-[#654652] text-white rounded-full text-xs font-semibold cursor-pointer shadow-xs"
              >
                Book your first session →
              </button>
            </div>
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
        <div className="max-w-3xl mx-auto space-y-5 relative z-10">
          <div className="inline-block font-mono-code text-[10.5px] tracking-[0.2em] uppercase text-[#B8964A] font-semibold bg-white/10 px-4 py-1.5 rounded-full">
            UNDERSTAND. GROW. CONTINUE.
          </div>
          <h2 className="font-editorial text-3xl sm:text-5xl font-normal leading-tight text-white">
            The philosophy behind the platform — not a sequence you have to follow.
          </h2>
          <p className="font-zen text-sm sm:text-base text-[#C7CDD3] max-w-xl mx-auto leading-relaxed pt-2">
            You might start with therapy. You might start by practising. You might just want to know what's going on. Ingress Within meets you where you are.
          </p>
          <div className="pt-4">
            <a
              href="/login"
              onClick={handleAuthRedirect}
              className="inline-flex items-center gap-2 bg-white text-[#011627] hover:bg-[#FAF7F2] font-zen text-sm font-semibold px-7 py-3 rounded-full transition-all cursor-pointer"
            >
              <span>Begin your reflection</span>
              <span>→</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );

  // -------------------------------------------------------------
  // TAB 2: SOLUTION / WHAT IT IS
  // -------------------------------------------------------------
  const renderSolution = () => (
    <div className="py-16 sm:py-24 px-5 sm:px-8 space-y-20 max-w-6xl mx-auto">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <div className="font-mono-code text-xs tracking-widest uppercase text-[#795663] font-semibold">
          OUR SOLUTION
        </div>
        <h1 className="font-editorial text-4xl sm:text-5xl text-[#162723] font-normal leading-tight">
          One platform. Different ways to work on your mental health.
        </h1>
        <p className="font-zen text-base text-[#5C6873] leading-relaxed">
          Some people just want to understand themselves better. Some want a therapist. Some want both, at different times. Here's what each looks like.
        </p>
      </div>

      {/* When you work on yourself */}
      <div className="space-y-8">
        <div className="space-y-2">
          <div className="font-mono-code text-[11px] uppercase tracking-wider text-[#7D8E87]">INDEPENDENT INQUIRY</div>
          <h2 className="font-editorial text-2xl sm:text-3xl text-[#162723]">
            Write it down. Let the platform show you what you can't see day to day.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="paper-card rounded-2xl p-7 bg-white border border-[#E7DECF] space-y-3">
            <span className="font-mono-code text-xs text-[#795663] font-bold">JOURNAL</span>
            <h3 className="font-editorial text-xl text-[#162723]">Free-flow, or a guided 5-prompt journal.</h3>
            <p className="font-zen text-xs text-[#5C6873] leading-relaxed">
              Write freely about your day, or use the guided journal, which asks what happened, why, and how it affected you — five prompts, a few minutes a day.
            </p>
          </div>
          <div className="paper-card rounded-2xl p-7 bg-white border border-[#E7DECF] space-y-3">
            <span className="font-mono-code text-xs text-[#795663] font-bold">WEEKLY & MONTHLY REPORTS</span>
            <h3 className="font-editorial text-xl text-[#162723]">See what keeps repeating.</h3>
            <p className="font-zen text-xs text-[#5C6873] leading-relaxed">
              Included with platform access — your entries become a weekly and monthly report showing recurring situations, feelings and emotional vocabulary AI picks up over time.
            </p>
          </div>
          <div className="paper-card rounded-2xl p-7 bg-white border border-[#E7DECF] space-y-3">
            <span className="font-mono-code text-xs text-[#795663] font-bold">INTERVENTIONS & PSYCHOEDUCATION</span>
            <h3 className="font-editorial text-xl text-[#162723]">When a pattern keeps showing up, we name it — gently.</h3>
            <p className="font-zen text-xs text-[#5C6873] leading-relaxed">
              Interventions explain what a recurring pattern or emotional word might mean, in plain language, as soon as it appears — this part is included, not a paywall. If it's still showing up after about two months, we'll suggest one focused module that speaks directly to it.
            </p>
          </div>
        </div>
      </div>

      {/* The 5 Prompts */}
      <div className="paper-card rounded-2xl p-8 bg-[#FAF7F2] border border-[#E7DECF] space-y-6">
        <div>
          <span className="font-mono-code text-[11px] uppercase tracking-wider text-[#7D8E87]">THE GUIDED JOURNAL</span>
          <h3 className="font-editorial text-2xl text-[#162723] pt-1">Five short prompts, so you're not staring at a blank page.</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {['What happened?', 'Why do you think so?', 'How did you react?', 'What did you feel?', 'What would you tell a friend?'].map((p, idx) => (
            <div key={p} className="p-4 bg-white rounded-xl border border-[#E7DECF] text-left">
              <span className="font-mono-code text-xs text-[#795663] font-bold block mb-1">0{idx + 1}</span>
              <p className="font-editorial text-sm text-[#162723]">{p}</p>
            </div>
          ))}
        </div>
      </div>

      {/* When you work with a therapist */}
      <div className="space-y-8 pt-4">
        <div className="space-y-2">
          <div className="font-mono-code text-[11px] uppercase tracking-wider text-[#7D8E87]">COLLABORATIVE CARE</div>
          <h2 className="font-editorial text-2xl sm:text-3xl text-[#162723]">
            Not just the session — a dashboard that shows the work between sessions too.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="paper-card rounded-2xl p-7 bg-white border border-[#E7DECF] space-y-3">
            <span className="font-mono-code text-xs text-[#795663] font-bold">YOUR DASHBOARD</span>
            <h3 className="font-editorial text-xl text-[#162723]">See what happened last session, and what's due next.</h3>
            <p className="font-zen text-xs text-[#5C6873] leading-relaxed">
              A recap of your last session, any homework your therapist assigned, and your goals — so therapy isn't only what you remember from the room.
            </p>
          </div>
          <div className="paper-card rounded-2xl p-7 bg-white border border-[#E7DECF] space-y-3">
            <span className="font-mono-code text-xs text-[#795663] font-bold">THERAPIST-ASSIGNED WORK</span>
            <h3 className="font-editorial text-xl text-[#162723]">Homework and psychoeducation, set by your therapist.</h3>
            <p className="font-zen text-xs text-[#5C6873] leading-relaxed">
              Your therapist can assign homework and psychoeducation modules directly, tailored to what came up in session.
            </p>
          </div>
          <div className="paper-card rounded-2xl p-7 bg-white border border-[#E7DECF] space-y-3">
            <span className="font-mono-code text-xs text-[#795663] font-bold">CONTINUITY</span>
            <h3 className="font-editorial text-xl text-[#162723]">Keep your history if the support changes.</h3>
            <p className="font-zen text-xs text-[#5C6873] leading-relaxed">
              Selected goals, session recaps and self-work can move with you when you change therapists.
            </p>
          </div>
        </div>
      </div>

    </div>
  );

  // -------------------------------------------------------------
  // TAB 3: HOW IT WORKS
  // -------------------------------------------------------------
  const renderHowItWorks = () => (
    <div className="py-16 sm:py-24 px-5 sm:px-8 space-y-16 max-w-5xl mx-auto">
      <div className="space-y-4 max-w-3xl">
        <div className="font-mono-code text-xs tracking-widest uppercase text-[#795663] font-semibold">
          HOW IT WORKS
        </div>
        <h1 className="font-editorial text-4xl sm:text-5xl text-[#162723] font-normal leading-tight">
          Different entry points. Shared capabilities.
        </h1>
        <p className="font-zen text-base text-[#5C6873] leading-relaxed">
          Two walkthroughs below — working alone, and working with a therapist — so you can see exactly what each week looks like.
        </p>
      </div>

      {/* Side by side comparison table from HTML */}
      <div className="paper-card rounded-2xl p-6 sm:p-8 bg-white border border-[#E7DECF] overflow-x-auto">
        <h3 className="font-editorial text-xl text-[#162723] mb-4">What each option actually includes</h3>
        <table className="w-full text-left text-xs sm:text-sm font-zen">
          <thead>
            <tr className="border-b border-[#E7DECF] text-[#795663] font-mono-code">
              <th className="py-3 pr-4">Capability</th>
              <th className="py-3 px-4">Self-work</th>
              <th className="py-3 pl-4">Therapist-supported</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E7DECF]/60 text-[#5C6873]">
            <tr>
              <td className="py-3.5 pr-4 text-[#162723] font-medium">Journal (free-flow + guided)</td>
              <td className="py-3.5 px-4 text-[#8AA688] font-bold">✓ Included</td>
              <td className="py-3.5 pl-4 text-[#8AA688] font-bold">✓ Included</td>
            </tr>
            <tr>
              <td className="py-3.5 pr-4 text-[#162723] font-medium">Weekly & monthly reports</td>
              <td className="py-3.5 px-4 text-[#8AA688] font-bold">✓ Included</td>
              <td className="py-3.5 pl-4 text-[#8AA688] font-bold">✓ Included</td>
            </tr>
            <tr>
              <td className="py-3.5 pr-4 text-[#162723] font-medium">Pattern detection & emotional vocabulary</td>
              <td className="py-3.5 px-4 text-[#8AA688] font-bold">✓ Included</td>
              <td className="py-3.5 pl-4 text-[#8AA688] font-bold">✓ Included</td>
            </tr>
            <tr>
              <td className="py-3.5 pr-4 text-[#162723] font-medium">Psychoeducation modules</td>
              <td className="py-3.5 px-4">Self-selected, paid per module</td>
              <td className="py-3.5 pl-4">Therapist-assigned, paid per module</td>
            </tr>
            <tr>
              <td className="py-3.5 pr-4 text-[#162723] font-medium">Licensed therapist sessions</td>
              <td className="py-3.5 px-4 text-[#9AA59F]">—</td>
              <td className="py-3.5 pl-4 text-[#8AA688] font-bold">✓ Included</td>
            </tr>
            <tr>
              <td className="py-3.5 pr-4 text-[#162723] font-medium">Shared dashboard with recap & homework</td>
              <td className="py-3.5 px-4 text-[#9AA59F]">—</td>
              <td className="py-3.5 pl-4 text-[#8AA688] font-bold">✓ Included</td>
            </tr>
            <tr className="font-semibold text-[#162723]">
              <td className="py-3.5 pr-4">Cost</td>
              <td className="py-3.5 px-4 font-mono-code text-[#795663]">₹499 / month</td>
              <td className="py-3.5 pl-4 font-mono-code">From ₹999 / session</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Common FAQs from HTML */}
      <div className="space-y-4 pt-4">
        <h3 className="font-editorial text-2xl text-[#162723]">Common questions</h3>
        <div className="space-y-3">
          {[
            {
              q: 'What if I miss a few days of journaling?',
              a: "Nothing happens automatically — your next report simply reflects fewer entries. There's no streak to lose or penalty for gaps."
            },
            {
              q: 'Can I change or stop my therapist?',
              a: 'Yes, anytime. You can switch therapists and choose what history moves with you, or stop therapy altogether and continue on self-work only.'
            },
            {
              q: 'Do I have to buy a psychoeducation module when it is recommended?',
              a: "No. It's a suggestion based on a repeating pattern — buying it is always your choice, in both self-work and therapy."
            },
            {
              q: 'What happens if I pause my subscription?',
              a: "Your journal history and past reports stay saved. You won't get new weekly or monthly reports until you resume."
            }
          ].map((faq) => (
            <details key={faq.q} className="paper-card rounded-xl p-5 bg-white border border-[#E7DECF] group">
              <summary className="font-editorial text-base text-[#162723] cursor-pointer font-medium list-none flex items-center justify-between">
                <span>{faq.q}</span>
                <span className="text-[#795663] text-lg font-bold group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="font-zen text-xs sm:text-sm text-[#5C6873] pt-3 leading-relaxed border-t border-[#E7DECF]/60 mt-3">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );

  // -------------------------------------------------------------
  // TAB 4: PRICING (Dynamic ₹499/mo & ₹999/session)
  // -------------------------------------------------------------
  const renderPricing = () => (
    <div className="py-16 sm:py-24 px-5 sm:px-8 space-y-16 max-w-5xl mx-auto">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="font-mono-code text-xs tracking-widest uppercase text-[#795663] font-semibold">
          PRICING
        </div>
        <h1 className="font-editorial text-4xl sm:text-5xl text-[#162723] font-normal leading-tight">
          A monthly plan for self-work. Pay per session for therapy.
        </h1>
        <p className="font-zen text-base text-[#5C6873] leading-relaxed">
          Prices shown in ₹ (INR). Pay by UPI, card or netbanking. No hidden charges.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {/* Card 1: Self-Work Platform */}
        <div className="paper-card rounded-2xl p-8 bg-white border border-[#E7DECF] flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <span className="font-mono-code text-xs text-[#5C7D64] font-semibold tracking-wider uppercase">
              SELF-WORK PLATFORM
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-mono-code text-5xl font-semibold text-[#795663]">₹499</span>
              <span className="font-zen text-sm text-[#5C6873]">/ month (+ 18% GST)</span>
            </div>
            <p className="font-zen text-xs sm:text-sm text-[#5C6873] leading-relaxed">
              Journal (free-flow + guided), and weekly & monthly reports with pattern and emotional vocabulary tracking — included in your subscription.
            </p>
            <ul className="space-y-2 text-xs font-zen text-[#4F635E] pt-2 border-t border-[#E7DECF]/60">
              <li className="flex items-center gap-2">✓ Unlimited daily journal entries</li>
              <li className="flex items-center gap-2">✓ Weekly & monthly pattern reports included</li>
              <li className="flex items-center gap-2">✓ Longitudinal pattern engine</li>
              <li className="flex items-center gap-2">✓ Cancel anytime with one click</li>
            </ul>
          </div>
          <a
            href="/login"
            onClick={handleAuthRedirect}
            className="w-full text-center py-3.5 bg-[#162723] hover:bg-[#203631] text-white rounded-full text-xs font-semibold shadow-xs cursor-pointer"
          >
            Write your first entry →
          </a>
        </div>

        {/* Card 2: Therapy */}
        <div className="paper-card rounded-2xl p-8 bg-white border-2 border-[#795663]/40 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <span className="font-mono-code text-xs text-[#795663] font-semibold tracking-wider uppercase">
              THERAPIST-SUPPORTED
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-mono-code text-5xl font-semibold text-[#162723]">From ₹999</span>
              <span className="font-zen text-sm text-[#5C6873]">/ session</span>
            </div>
            <p className="font-zen text-xs sm:text-sm text-[#5C6873] leading-relaxed">
              Licensed therapist, goal setting, between-session practice and progress review. Journal and reports can be added alongside.
            </p>
            <ul className="space-y-2 text-xs font-zen text-[#4F635E] pt-2 border-t border-[#E7DECF]/60">
              <li className="flex items-center gap-2">✓ Verified licensed clinical psychologists</li>
              <li className="flex items-center gap-2">✓ Shared milestone dashboard</li>
              <li className="flex items-center gap-2">✓ Homework assignments between sessions</li>
              <li className="flex items-center gap-2">✓ No multi-session packages required</li>
            </ul>
          </div>
          <button
            type="button"
            onClick={() => handleSelectTab('start')}
            className="w-full text-center py-3.5 bg-[#795663] hover:bg-[#654652] text-white rounded-full text-xs font-semibold shadow-xs cursor-pointer"
          >
            Book your first session →
          </button>
        </div>
      </div>

      {/* Psychoeducation Explanation from HTML */}
      <div className="paper-card rounded-2xl p-8 bg-[#FAF7F2] border border-[#E7DECF] space-y-4 text-left">
        <span className="font-mono-code text-xs text-[#7D8E87] uppercase font-semibold">PSYCHOEDUCATION MODULES</span>
        <h3 className="font-editorial text-2xl text-[#162723]">Bought one at a time, only when it's relevant.</h3>
        <p className="font-zen text-xs sm:text-sm text-[#5C6873] leading-relaxed">
          The plain-language explanation of a pattern is always free, as soon as it shows up — that's part of your subscription or session, not an upsell. Only the deeper, structured module is separate: on self-work, offered once a pattern has repeated for about two months; in therapy, assignable by your therapist whenever they judge it's useful. Either way, it's a one-time purchase you choose, never automatic.
        </p>
      </div>
    </div>
  );

  // -------------------------------------------------------------
  // TAB 5: AI & DATA
  // -------------------------------------------------------------
  const renderAiData = () => (
    <div className="py-16 sm:py-24 px-5 sm:px-8 space-y-16 max-w-5xl mx-auto">
      <div className="space-y-4 max-w-3xl">
        <div className="font-mono-code text-xs tracking-widest uppercase text-[#795663] font-semibold">
          AI & DATA
        </div>
        <h1 className="font-editorial text-4xl sm:text-5xl text-[#162723] font-normal leading-tight">
          AI helps connect the information. It does not become the authority.
        </h1>
        <p className="font-zen text-base text-[#5C6873] leading-relaxed">
          AI can organise information, surface possible patterns and connect relevant learning. In therapist-supported care, it can help structure information for professional review.
        </p>
      </div>

      {/* Boundary Diagram */}
      <AIHumanBoundaryDiagram />

      {/* Data & Privacy FAQ */}
      <div className="space-y-4 pt-4">
        <h3 className="font-editorial text-2xl text-[#162723]">Data & Privacy</h3>
        <div className="space-y-3">
          <details className="paper-card rounded-xl p-5 bg-white border border-[#E7DECF]">
            <summary className="font-editorial text-base text-[#162723] cursor-pointer font-medium">
              Can I keep self-work private?
            </summary>
            <p className="font-zen text-xs sm:text-sm text-[#5C6873] pt-3 leading-relaxed border-t border-[#E7DECF]/60 mt-3">
              Yes. Self-work is private by default, including from family — the intended model supports private self-work and explicit sharing into professional care.
            </p>
          </details>
          <details className="paper-card rounded-xl p-5 bg-white border border-[#E7DECF]">
            <summary className="font-editorial text-base text-[#162723] cursor-pointer font-medium">
              Can I choose what goes to a new therapist?
            </summary>
            <p className="font-zen text-xs sm:text-sm text-[#5C6873] pt-3 leading-relaxed border-t border-[#E7DECF]/60 mt-3">
              Yes. The continuity model is designed around selecting the relevant history instead of transferring everything automatically.
            </p>
          </details>
        </div>
      </div>
    </div>
  );

  // -------------------------------------------------------------
  // TAB 6: EVIDENCE & RESEARCH
  // -------------------------------------------------------------
  const renderEvidence = () => (
    <div className="py-16 sm:py-24 px-5 sm:px-8 space-y-16 max-w-5xl mx-auto text-left">
      <div className="space-y-4 max-w-3xl">
        <div className="font-mono-code text-xs tracking-widest uppercase text-[#795663] font-semibold">
          EVIDENCE & RESEARCH
        </div>
        <h1 className="font-editorial text-4xl sm:text-5xl text-[#162723] font-normal leading-tight">
          Why these building blocks make sense.
        </h1>
        <p className="font-zen text-base text-[#5C6873] leading-relaxed">
          Ingress Within combines several evidence-informed mechanisms rather than presenting one feature as a complete answer.
        </p>
      </div>

      <div className="space-y-8">
        <div className="paper-card rounded-2xl p-7 bg-white border border-[#E7DECF] space-y-3">
          <span className="font-mono-code text-xs text-[#795663] font-semibold">DIGITAL PSYCHOLOGICAL INTERVENTIONS</span>
          <h3 className="font-editorial text-2xl text-[#162723]">Structured online psychological work can help some people.</h3>
          <p className="font-zen text-xs sm:text-sm text-[#5C6873] leading-relaxed">
            A 2024 meta-analysis of 154 randomised controlled trials involving 45,335 participants found sustained effects for internet-delivered CBT across several outcomes, with results varying by intervention, outcome and guidance.
          </p>
          <a href="https://pubmed.ncbi.nlm.nih.gov/39579466/" target="_blank" rel="noreferrer" className="inline-block text-xs font-mono-code text-[#795663] font-semibold hover:underline pt-2">
            Read the study (PubMed) →
          </a>
        </div>

        <div className="paper-card rounded-2xl p-7 bg-white border border-[#E7DECF] space-y-3">
          <span className="font-mono-code text-xs text-[#795663] font-semibold">PRACTICE & HOMEWORK</span>
          <h3 className="font-editorial text-2xl text-[#162723]">Learning needs a chance to become behaviour.</h3>
          <p className="font-zen text-xs sm:text-sm text-[#5C6873] leading-relaxed">
            A systematic review of between-session homework highlights the value of collaboratively planning, explaining and reviewing tasks. That supports making practice central to the product.
          </p>
          <a href="https://pubmed.ncbi.nlm.nih.gov/37104804/" target="_blank" rel="noreferrer" className="inline-block text-xs font-mono-code text-[#795663] font-semibold hover:underline pt-2">
            Read the review (PubMed) →
          </a>
        </div>

        <div className="paper-card rounded-2xl p-7 bg-white border border-[#E7DECF] space-y-3">
          <span className="font-mono-code text-xs text-[#795663] font-semibold">THERAPEUTIC RELATIONSHIP</span>
          <h3 className="font-editorial text-2xl text-[#162723]">The platform supports the therapist; it does not replace the relationship.</h3>
          <p className="font-zen text-xs sm:text-sm text-[#5C6873] leading-relaxed">
            A large meta-analysis found a positive association between therapeutic alliance and psychotherapy outcomes, including internet-based psychotherapy.
          </p>
          <a href="https://pubmed.ncbi.nlm.nih.gov/29792475/" target="_blank" rel="noreferrer" className="inline-block text-xs font-mono-code text-[#795663] font-semibold hover:underline pt-2">
            Read the meta-analysis (PubMed) →
          </a>
        </div>
      </div>

      {/* Critical Limits Band from HTML */}
      <div className="p-8 rounded-2xl bg-[#011627] text-white text-center space-y-3">
        <span className="font-mono-code text-xs text-[#B8964A] tracking-wider uppercase font-semibold">LIMITS</span>
        <h3 className="font-editorial text-2xl">Evidence for an approach is not proof that this exact product works.</h3>
        <p className="font-zen text-xs sm:text-sm text-[#C7CDD3] max-w-lg mx-auto">
          We keep those claims separate as our own evidence develops.
        </p>
      </div>
    </div>
  );

  // -------------------------------------------------------------
  // TAB 7: ABOUT
  // -------------------------------------------------------------
  const renderAbout = () => (
    <div className="py-16 sm:py-24 px-5 sm:px-8 space-y-16 max-w-5xl mx-auto text-left">
      <div className="space-y-4 max-w-3xl">
        <div className="flex items-center gap-3.5 pb-2">
          <img
            src="/logo-mark-transparent.png"
            alt="Ingress Within"
            className="w-10 h-10 object-contain flex-shrink-0"
          />
          <div>
            <div className="font-editorial text-2xl text-[#162723] leading-none">
              ingress <span className="font-medium text-[#2E7A70]">within</span>
            </div>
            <div className="font-mono-code text-[9px] tracking-[0.16em] uppercase text-[#7D8E87] mt-1">
              Understand · Grow · Continue
            </div>
          </div>
        </div>
        <div className="font-mono-code text-xs tracking-widest uppercase text-[#795663] font-semibold">
          ABOUT INGRESS WITHIN
        </div>
        <h1 className="font-editorial text-4xl sm:text-5xl text-[#162723] font-normal leading-tight">
          One place for the different ways people work on their psychological health.
        </h1>
        <p className="font-zen text-base text-[#5C6873] leading-relaxed">
          Sometimes you want to work on something yourself. Sometimes you want a therapist. Sometimes you want both. Ingress Within is built around that reality rather than forcing one route.
        </p>
      </div>

      <div className="space-y-6">
        <div className="paper-card rounded-2xl p-8 bg-[#FAF7F2] border border-[#E7DECF] space-y-3">
          <span className="font-mono-code text-xs text-[#7D8E87] uppercase font-semibold">BUILT FOR INDIA</span>
          <h3 className="font-editorial text-2xl text-[#162723]">People often start with life, not clinical terminology.</h3>
          <p className="font-zen text-xs sm:text-sm text-[#5C6873] leading-relaxed">
            “I'm overthinking.” “I can't say no.” “My career is stressing me out.” “My relationship keeps repeating the same fight.” “I have everything, so why don't I feel okay?” The language can start there while the psychological depth sits underneath it.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="paper-card rounded-2xl p-6 bg-white border border-[#E7DECF] space-y-2">
            <h4 className="font-editorial text-lg text-[#162723]">Verified therapist profiles</h4>
            <p className="font-zen text-xs text-[#5C6873]">Reviewed credentials before listing.</p>
          </div>
          <div className="paper-card rounded-2xl p-6 bg-white border border-[#E7DECF] space-y-2">
            <h4 className="font-editorial text-lg text-[#162723]">You choose your therapist</h4>
            <p className="font-zen text-xs text-[#5C6873]">Browse areas of focus and language before booking.</p>
          </div>
          <div className="paper-card rounded-2xl p-6 bg-white border border-[#E7DECF] space-y-2">
            <h4 className="font-editorial text-lg text-[#162723]">Built with real conversations</h4>
            <p className="font-zen text-xs text-[#5C6873]">Shaped by people in India who journal and attend therapy.</p>
          </div>
        </div>
      </div>
    </div>
  );

  // -------------------------------------------------------------
  // TAB 8: POLICIES
  // -------------------------------------------------------------
  const renderPolicies = () => (
    <div className="py-16 sm:py-24 px-5 sm:px-8 space-y-12 max-w-4xl mx-auto text-left">
      <div className="space-y-4">
        <div className="font-mono-code text-xs tracking-widest uppercase text-[#795663] font-semibold">
          POLICIES
        </div>
        <h1 className="font-editorial text-4xl text-[#162723] font-normal">
          Privacy, terms & refunds.
        </h1>
        <p className="font-zen text-sm text-[#5C6873]">
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
            In line with standard practice across therapy platforms in India, individual therapy sessions are not eligible for a refund once booked — a therapist has reserved that time for you. You can reschedule free of charge at least 24 hours before your session. The monthly self-work subscription (₹499/mo) can be cancelled anytime with one click for future cycles.
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
          Choose the kind of work or support you want today — no required order.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="paper-card rounded-2xl p-7 bg-white border border-[#E7DECF] flex flex-col justify-between space-y-6">
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
            Start journaling — ₹499/mo →
          </a>
        </div>

        <div className="paper-card rounded-2xl p-7 bg-white border-2 border-[#795663]/40 flex flex-col justify-between space-y-6">
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
        </div>

        <div className="paper-card rounded-2xl p-7 bg-white border border-[#E7DECF] flex flex-col justify-between space-y-6">
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
        </div>
      </div>

      {/* Orientation Call / Inquiry Booking */}
      <div className="paper-card rounded-2xl p-8 bg-[#FAF7F2] border border-[#E7DECF] space-y-6">
        <div>
          <span className="font-mono-code text-xs text-[#7D8E87] uppercase font-semibold">NOT SURE WHICH ONE YET?</span>
          <h3 className="font-editorial text-2xl text-[#162723] pt-1">Talk to us first — no commitment, no charge.</h3>
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
          If you're in crisis, start here — not on the rest of this site.
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
          Ingress Within does not operate these helplines and can't guarantee wait times or availability — they are independent services included here for your safety.
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
