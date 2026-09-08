import React from 'react';
import V2Navbar from '../components/V2Navbar';
import V2Footer from '../components/V2Footer';
import SectionLabel from '../components/SectionLabel';
import FrameworkSteps from '../components/FrameworkSteps';
import ProductShowcase from '../components/ProductShowcase';
import FaqAccordion from '../components/FaqAccordion';

export default function V2HowItWorksPage({ onOpenPolicy }) {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A2421] font-sans selection:bg-[#EBF1ED]">
      <V2Navbar currentPath="/v2/how-it-works" />

      <section className="pt-16 pb-20 v2-hero-atmosphere border-b border-[#E7E0D3]">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <SectionLabel text="STEP-BY-STEP PROCESS" number="HOW IT WORKS" />
          <h1 className="text-3xl sm:text-5xl font-serif text-[#1A2421] tracking-tight leading-tight">
            Different entry points. Shared capabilities.
          </h1>
          <p className="text-base sm:text-lg text-[#5E706A] max-w-2xl mx-auto leading-relaxed">
            Whether you choose independent self-reflection or collaborate with a licensed therapist, the platform provides a structured, calm scaffolding for your growth.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <SectionLabel text="THE RHYTHM OF GROWTH" number="01" />
            <h2 className="text-3xl font-serif text-[#1A2421]">
              The four stages of reflective clarity.
            </h2>
          </div>
          <FrameworkSteps />
        </div>
      </section>

      <section className="py-20 bg-[#FAF8F5] border-t border-[#E7E0D3]">
        <div className="max-w-6xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <SectionLabel text="PLATFORM INTERFACES" number="02" />
            <h2 className="text-3xl font-serif text-[#1A2421]">
              How the tools work together.
            </h2>
          </div>
          <ProductShowcase />
        </div>
      </section>

      <section className="py-20 bg-white border-t border-[#E7E0D3]">
        <div className="max-w-4xl mx-auto px-6 space-y-10">
          <div className="text-center space-y-3">
            <SectionLabel text="FREQUENTLY ASKED" number="03" />
            <h2 className="text-3xl font-serif text-[#1A2421]">Practical Questions</h2>
          </div>
          <FaqAccordion />
        </div>
      </section>

      <V2Footer onOpenPolicy={onOpenPolicy} />
    </div>
  );
}
