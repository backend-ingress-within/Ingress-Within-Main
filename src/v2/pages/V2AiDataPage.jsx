import React from 'react';
import V2Navbar from '../components/V2Navbar';
import V2Footer from '../components/V2Footer';
import SectionLabel from '../components/SectionLabel';

export default function V2AiDataPage({ onOpenPolicy }) {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A2421] font-sans selection:bg-[#EBF1ED]">
      <V2Navbar currentPath="/v2/ai-data" />

      <section className="pt-16 pb-20 v2-hero-atmosphere border-b border-[#E7E0D3]">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <SectionLabel text="TRANSPARENT BOUNDARIES" number="AI & DATA ETHICS" />
          <h1 className="text-3xl sm:text-5xl font-serif text-[#1A2421] tracking-tight leading-tight">
            AI helps connect the dots. It never becomes the authority.
          </h1>
          <p className="text-base sm:text-lg text-[#5E706A] max-w-2xl mx-auto leading-relaxed">
            We hold clear boundaries around how machine intelligence is used. It functions exclusively as a linguistic mirror and organizational tool, keeping ultimate agency with you.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 space-y-12 leading-relaxed text-sm sm:text-base text-[#4F635E]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#E7E0D3] space-y-2">
              <span className="font-mono text-xs text-[#758D7E] font-bold">RULE 01</span>
              <h4 className="font-serif text-lg font-semibold text-[#1A2421]">No Clinical Diagnosis</h4>
              <p className="text-xs text-[#5E706A]">
                AI models never output psychiatric labels, medical diagnoses, or autonomous treatment plans.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#E7E0D3] space-y-2">
              <span className="font-mono text-xs text-[#758D7E] font-bold">RULE 02</span>
              <h4 className="font-serif text-lg font-semibold text-[#1A2421]">Zero Data Monetization</h4>
              <p className="text-xs text-[#5E706A]">
                Your journal entries and reflections are never sold or shared with advertisers or data brokers.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#E7E0D3] space-y-2">
              <span className="font-mono text-xs text-[#758D7E] font-bold">RULE 03</span>
              <h4 className="font-serif text-lg font-semibold text-[#1A2421]">Human Interpretation</h4>
              <p className="text-xs text-[#5E706A]">
                All surfaced patterns are presented as quiet observations for you (or your therapist) to accept or discard.
              </p>
            </div>
          </div>
        </div>
      </section>

      <V2Footer onOpenPolicy={onOpenPolicy} />
    </div>
  );
}
