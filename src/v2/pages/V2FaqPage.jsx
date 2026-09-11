import React from 'react';
import V2Navbar from '../components/V2Navbar';
import V2Footer from '../components/V2Footer';
import SectionLabel from '../components/SectionLabel';
import FaqAccordion from '../components/FaqAccordion';
import V2Button from '../components/V2Button';
import { HelpCircle, MessageSquare, ArrowRight } from 'lucide-react';

export default function V2FaqPage({ onOpenPolicy }) {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A2421] font-sans selection:bg-[#EBF1ED]">
      <V2Navbar currentPath="/v2/faq" />

      {/* Section 1: Hero Cover */}
      <section className="min-h-screen w-full flex flex-col justify-center items-center py-16 xl:py-24 px-6 border-b border-[#E7E0D3] v2-hero-atmosphere relative overflow-hidden">
        <div className="w-full max-w-5xl mx-auto text-center space-y-8 relative z-10">
          <SectionLabel text="CLARITY & DETAILS" number="FREQUENTLY ASKED QUESTIONS" />
          
          <h1 className="text-4xl sm:text-6xl xl:text-7xl font-serif text-[#1A2421] tracking-tight leading-[1.15] max-w-4xl mx-auto">
            Everything you need to know about Ingress Within.
          </h1>
          
          <p className="text-lg sm:text-xl xl:text-2xl text-[#4A5D57] max-w-3xl mx-auto font-serif italic leading-relaxed">
            "Clarity begins by answering the questions you didn't know how to ask."
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EBF1ED] border border-[#D5E2D9] text-[#1E3633] text-xs font-mono font-medium tracking-wide">
            <span>OFFICIAL FAQ DIRECTORY</span>
            <span className="text-[#8DBFB4]">•</span>
            <span className="font-serif italic font-normal text-sm">Understand. Grow. Continue.</span>
          </div>

          <div className="pt-6 flex flex-wrap justify-center gap-4">
            <V2Button href="#questions" variant="secondary" size="lg">
              Browse Questions ↓
            </V2Button>
            <V2Button href="/v2/contact" size="lg">
              Ask Our Care Team <ArrowRight className="w-4 h-4 ml-1 inline" />
            </V2Button>
          </div>
        </div>
      </section>

      {/* Section 2: FAQ Accordion Main Section */}
      <section id="questions" className="min-h-screen w-full flex flex-col justify-center items-center py-16 xl:py-24 px-6 bg-white border-b border-[#E7E0D3] scroll-mt-20">
        <div className="w-full max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <SectionLabel text="COMPREHENSIVE ANSWERS" number="ALL TOPICS" />
            <h2 className="text-3xl sm:text-5xl font-serif text-[#1A2421] tracking-tight">
              Detailed answers on methodology, ethics, & therapy.
            </h2>
            <p className="text-base sm:text-lg text-[#5E706A] leading-relaxed">
              Explore common questions regarding our Mirror Engine, longitudinal pattern lifecycle, privacy protections, and collaborative therapy care.
            </p>
          </div>

          <div className="p-8 sm:p-12 rounded-3xl bg-[#FAF8F5] border border-[#E7E0D3] shadow-xs">
            <FaqAccordion />
          </div>
        </div>
      </section>

      {/* Section 3: Still Have Questions CTA */}
      <section className="min-h-screen w-full flex flex-col justify-center items-center py-16 xl:py-24 px-6 bg-[#FAF8F5]">
        <div className="w-full max-w-4xl mx-auto text-center space-y-8 p-12 sm:p-16 rounded-3xl bg-white border border-[#E7E0D3]">
          <img
            src="/logo-mark-transparent.png"
            alt="Ingress Within"
            className="w-16 h-16 object-contain mx-auto"
          />

          <div className="space-y-3">
            <h2 className="text-3xl sm:text-5xl font-serif text-[#1A2421] tracking-tight">
              Still have questions on your mind?
            </h2>
            <p className="text-base sm:text-lg text-[#5E706A] max-w-xl mx-auto leading-relaxed">
              Our care team is always available to talk through your specific situation or explain our clinical safeguards.
            </p>
          </div>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <V2Button href="/v2/how-it-works" variant="secondary" size="lg">
              Explore How It Works
            </V2Button>
            <V2Button href="/v2/contact" size="lg">
              Schedule Free Orientation Call →
            </V2Button>
          </div>
        </div>
      </section>

      <V2Footer onOpenPolicy={onOpenPolicy} />
    </div>
  );
}
