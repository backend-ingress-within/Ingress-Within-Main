import React from 'react';
import V2Navbar from '../components/V2Navbar';
import V2Footer from '../components/V2Footer';
import SectionLabel from '../components/SectionLabel';

export default function V2AboutPage({ onOpenPolicy }) {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A2421] font-sans selection:bg-[#EBF1ED]">
      <V2Navbar currentPath="/v2/about" />

      <section className="pt-16 pb-20 v2-hero-atmosphere border-b border-[#E7E0D3]">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <SectionLabel text="OUR MISSION & PRINCIPLES" number="ABOUT US" />
          <h1 className="text-3xl sm:text-5xl font-serif text-[#1A2421] tracking-tight leading-tight">
            One place for the different ways people explore their inner lives.
          </h1>
          <p className="text-base sm:text-lg text-[#5E706A] max-w-2xl mx-auto leading-relaxed">
            We believe that understanding yourself is not an emergency response to distress, but a lifelong practice of curiosity, compassion, and clarity.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6 space-y-12 leading-relaxed text-sm sm:text-base text-[#4F635E]">
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-serif text-[#1A2421]">Built for Real Human Conversations</h2>
            <p>
              People often arrive with everyday moments: "I keep overthinking," "I say yes when I mean no," "My career is causing friction at home," or "I have achieved my goals, so why do I still feel uneasy?"
            </p>
            <p>
              The language starts with life, but the psychological depth sits right underneath it. Ingress Within is designed to meet you in the natural language of your day and provide the scaffolding to observe yourself without shame.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-[#FAF8F5] border border-[#E7E0D3] space-y-3">
            <h4 className="font-serif text-lg font-semibold text-[#1A2421]">Our Non-Clinical Stance</h4>
            <p className="text-xs sm:text-sm text-[#5E706A]">
              We do not diagnose pathologies, assign mental illness labels, or make clinical promises. We provide a dignified, evidence-informed container for structured reflection and psychological literacy.
            </p>
          </div>
        </div>
      </section>

      <V2Footer onOpenPolicy={onOpenPolicy} />
    </div>
  );
}
