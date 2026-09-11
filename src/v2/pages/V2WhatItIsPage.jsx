import React from 'react';
import V2Navbar from '../components/V2Navbar';
import V2Footer from '../components/V2Footer';
import SectionLabel from '../components/SectionLabel';
import V2Button from '../components/V2Button';
import DomainTopicGrid from '../components/DomainTopicGrid';
import PrivacyCallout from '../components/PrivacyCallout';
import { ArrowRight, Sparkles, Layers, BookOpen, ShieldCheck } from 'lucide-react';

export default function V2WhatItIsPage({ onOpenPolicy }) {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A2421] font-sans selection:bg-[#EBF1ED] overflow-x-hidden">
      <V2Navbar currentPath="/v2/what-it-is" />

      {/* 1. Header (Full Page Cover 1920x1080) */}
      <section className="min-h-screen w-full flex flex-col justify-center items-center py-16 xl:py-24 px-6 v2-hero-atmosphere border-b border-[#E7E0D3]">
        <div className="max-w-5xl w-full mx-auto text-center space-y-8 my-auto">
          <SectionLabel text="UNDERSTAND · GROW · CONTINUE" number="WHAT IT IS" />
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif text-[#1A2421] tracking-tight leading-[1.08] max-w-4xl mx-auto">
            A calm digital space for understanding yourself.
          </h1>
          <p className="text-base sm:text-lg text-[#5E706A] max-w-2xl mx-auto leading-relaxed">
            Ingress Within is not a generic wellness tracker, a medical clinic, or an automated chatbot. It is a dedicated psychoeducational sanctuary built around structured daily inquiry and longitudinal pattern intelligence.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <V2Button href="/v2/contact" size="lg">
              Begin your reflection
            </V2Button>
            <V2Button href="/v2/how-it-works" variant="play" size="lg">
              Explore how it works
            </V2Button>
          </div>
        </div>
      </section>

      {/* 2. Narrative Section (Full Page Cover 1920x1080) */}
      <section className="min-h-screen w-full flex flex-col justify-center items-center py-16 xl:py-24 px-6 bg-white border-b border-[#E7E0D3]">
        <div className="max-w-6xl w-full mx-auto space-y-12 my-auto">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="font-mono text-xs text-[#758D7E] uppercase font-semibold">01 · BEYOND SURFACE WELLNESS</span>
            <h2 className="text-3xl sm:text-5xl font-serif text-[#1A2421] tracking-tight">
              Why ordinary notes and streaks fail to build lasting insight.
            </h2>
            <p className="text-sm sm:text-base text-[#4F635E] leading-relaxed">
              Most digital tools either overwhelm users with clinical diagnostic jargon or reduce mental health to gamified daily streaks. When life gets complicated, a streak counter creates guilt rather than clarity. Ingress Within replaces gamification with thoughtful, evidence-informed structure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="p-8 rounded-2xl bg-[#FAF8F5] border border-[#E7E0D3] space-y-4 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#EBF1ED] text-[#1E3633] flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="font-serif text-xl font-semibold text-[#1A2421]">Daily Mirror Engine</h4>
              <p className="text-xs sm:text-sm text-[#5E706A] leading-relaxed">
                Free-form and guided inquiry that reflects recurring subtext back without judgment, generating active Open Threads that stay with you through your day.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#FAF8F5] border border-[#E7E0D3] space-y-4 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#F7EFEA] text-[#8A3020] flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="font-serif text-xl font-semibold text-[#1A2421]">Pattern Intelligence</h4>
              <p className="text-xs sm:text-sm text-[#5E706A] leading-relaxed">
                Deterministic 4-stage lifecycle (Active, Emerging, Quiet, Re-emerging) tracking behavioral loops across 30-day cycles without claiming you are cured or erasing your history.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#FAF8F5] border border-[#E7E0D3] space-y-4 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#EEF3F7] text-[#1E3633] flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <h4 className="font-serif text-xl font-semibold text-[#1A2421]">19 Psychoeducation Labs</h4>
              <p className="text-xs sm:text-sm text-[#5E706A] leading-relaxed">
                Evidence-informed cognitive reframing modules covering Performance Anxiety, Burnout, Relational Patterns, and Emotional Regulation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Domains of Inquiry (Full Page Cover 1920x1080) */}
      <section className="min-h-screen w-full flex flex-col justify-center items-center py-16 xl:py-24 px-6 bg-[#FAF8F5] border-b border-[#E7E0D3]">
        <div className="max-w-6xl w-full mx-auto space-y-12 my-auto">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <SectionLabel text="AREAS OF INQUIRY" number="02" />
            <h2 className="text-3xl sm:text-5xl font-serif text-[#1A2421] tracking-tight">
              The six dimensions of inner exploration.
            </h2>
            <p className="text-sm sm:text-base text-[#5E706A]">
              Six interconnected dimensions of self-awareness designed to build psychological literacy and grounding.
            </p>
          </div>
          <DomainTopicGrid />
        </div>
      </section>

      {/* 4. Privacy Sanctuary & CTA (Full Page Cover 1920x1080) */}
      <section className="min-h-screen w-full flex flex-col justify-center items-center py-16 xl:py-24 px-6 bg-[#1E3633] text-[#FAF8F5] relative overflow-hidden">
        <div className="max-w-4xl w-full mx-auto text-center space-y-8 relative z-10 my-auto">
          <div className="w-12 h-12 rounded-full bg-white/10 text-[#8DBFB4] flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>

          <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#A5C0B3] font-semibold">
            UNDERSTAND · GROW · CONTINUE
          </span>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif font-normal leading-tight">
            Begin your first guided reflection today.
          </h2>

          <p className="text-base sm:text-lg text-[#C9D8D1] max-w-xl mx-auto font-serif italic">
            Seven days free. No credit card required. A calm space that pays attention to what you are carrying.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a
              href="/v2/contact"
              className="px-8 py-3.5 rounded-full bg-[#FAF8F5] text-[#1E3633] hover:bg-white text-sm font-semibold tracking-wide transition-all shadow-md inline-flex items-center gap-2 cursor-pointer no-underline"
            >
              Begin your journey <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="/v2/pricing"
              className="px-8 py-3.5 rounded-full border border-[#A5C0B3]/40 text-[#FAF8F5] hover:bg-white/10 text-sm font-medium tracking-wide transition-all cursor-pointer no-underline"
            >
              View pricing details
            </a>
          </div>
        </div>
      </section>

      <V2Footer onOpenPolicy={onOpenPolicy} />
    </div>
  );
}

