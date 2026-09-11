import React from 'react';
import V2Navbar from '../components/V2Navbar';
import V2Footer from '../components/V2Footer';
import SectionLabel from '../components/SectionLabel';
import FrameworkSteps from '../components/FrameworkSteps';
import ProductShowcase from '../components/ProductShowcase';
import FaqAccordion from '../components/FaqAccordion';
import V2Button from '../components/V2Button';
import { ArrowRight, ShieldCheck } from 'lucide-react';

export default function V2HowItWorksPage({ onOpenPolicy }) {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A2421] font-sans selection:bg-[#EBF1ED] overflow-x-hidden">
      <V2Navbar currentPath="/v2/how-it-works" />

      {/* 1. Header (Full Page Cover 1920x1080) */}
      <section className="min-h-screen w-full flex flex-col justify-center items-center py-16 xl:py-24 px-6 v2-hero-atmosphere border-b border-[#E7E0D3]">
        <div className="max-w-5xl w-full mx-auto text-center space-y-8 my-auto">
          <SectionLabel text="UNDERSTAND · GROW · CONTINUE" number="HOW IT WORKS" />
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif text-[#1A2421] tracking-tight leading-[1.08] max-w-4xl mx-auto">
            Different entry points.<br />
            <span className="italic font-serif text-[#1E3633]">Shared psychological scaffolding.</span>
          </h1>
          <p className="text-base sm:text-lg text-[#5E706A] max-w-2xl mx-auto leading-relaxed">
            Whether you choose independent self-reflection or collaborate with a licensed practitioner, the platform provides a structured, calm framework for noticing, understanding, and continuing.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <V2Button href="/v2/contact" size="lg">
              Begin your reflection
            </V2Button>
            <V2Button href="/v2/pricing" variant="play" size="lg">
              View transparent pricing
            </V2Button>
          </div>
        </div>
      </section>

      {/* 2. Rhythm of Growth (Full Page Cover 1920x1080) */}
      <section className="min-h-screen w-full flex flex-col justify-center items-center py-16 xl:py-24 px-6 bg-white border-b border-[#E7E0D3]">
        <div className="max-w-6xl w-full mx-auto space-y-12 my-auto">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <SectionLabel text="THE RHYTHM OF GROWTH" number="01" />
            <h2 className="text-3xl sm:text-5xl font-serif text-[#1A2421] tracking-tight">
              The four stages of reflective clarity.
            </h2>
            <p className="text-sm sm:text-base text-[#5E706A] leading-relaxed">
              Moving from raw daily reactions to grounded, intentional self-agency across 30-day cycles.
            </p>
          </div>
          <FrameworkSteps />
        </div>
      </section>

      {/* 3. Platform Interfaces & Actual Capabilities (Full Page Cover 1920x1080) */}
      <section className="min-h-screen w-full flex flex-col justify-center items-center py-16 xl:py-24 px-6 bg-[#FAF8F5] border-b border-[#E7E0D3]">
        <div className="max-w-6xl w-full mx-auto space-y-8 my-auto">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <SectionLabel text="PLATFORM INTERFACES" number="02" />
            <h2 className="text-3xl sm:text-5xl font-serif text-[#1A2421] tracking-tight">
              How the tools work together.
            </h2>
            <p className="text-sm sm:text-base text-[#5E706A]">
              An authentic preview of the daily mirror engine, longitudinal pattern tracking, 30-day cycle reports, and psychoeducation lab.
            </p>
          </div>
          <ProductShowcase />
        </div>
      </section>

      {/* 4. Practical Questions / FAQ (Full Page Cover 1920x1080) */}
      <section className="min-h-screen w-full flex flex-col justify-center items-center py-16 xl:py-24 px-6 bg-white border-b border-[#E7E0D3]">
        <div className="max-w-4xl w-full mx-auto space-y-10 my-auto">
          <div className="text-center space-y-3">
            <SectionLabel text="FREQUENTLY ASKED" number="03" />
            <h2 className="text-3xl sm:text-5xl font-serif text-[#1A2421]">Practical Questions</h2>
            <p className="text-sm text-[#5E706A]">
              Clear answers on methodology, privacy, AI boundaries, and subscriptions.
            </p>
          </div>
          <FaqAccordion />
        </div>
      </section>

      {/* 5. Final CTA (Full Page Cover 1920x1080) */}
      <section className="min-h-screen w-full flex flex-col justify-center items-center py-20 xl:py-32 px-6 bg-[#1E3633] text-[#FAF8F5] relative overflow-hidden">
        <div className="max-w-4xl w-full mx-auto text-center space-y-8 relative z-10 my-auto">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#A5C0B3] font-semibold">
            UNDERSTAND · GROW · CONTINUE
          </span>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif font-normal leading-tight">
            Start where clarity begins.
          </h2>

          <p className="text-base sm:text-lg text-[#C9D8D1] max-w-xl mx-auto font-serif italic">
            Seven days free. No card needed. Write without editing yourself — or don't bother.
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

