import React from 'react';
import V2Navbar from '../components/V2Navbar';
import V2Footer from '../components/V2Footer';
import SectionLabel from '../components/SectionLabel';
import FaqAccordion from '../components/FaqAccordion';

export default function V2FaqPage({ onOpenPolicy }) {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A2421] font-sans selection:bg-[#EBF1ED]">
      <V2Navbar currentPath="/v2/faq" />

      <section className="pt-16 pb-20 v2-hero-atmosphere border-b border-[#E7E0D3]">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <SectionLabel text="CLARITY & DETAILS" number="FAQ" />
          <h1 className="text-3xl sm:text-5xl font-serif text-[#1A2421] tracking-tight leading-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-base sm:text-lg text-[#5E706A] max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about our guided journaling methodology, privacy boundaries, AI ethics, and collaborative therapy care.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <FaqAccordion />
        </div>
      </section>

      <V2Footer onOpenPolicy={onOpenPolicy} />
    </div>
  );
}
