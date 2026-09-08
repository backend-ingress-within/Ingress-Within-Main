import React from 'react';
import V2Navbar from '../components/V2Navbar';
import V2Footer from '../components/V2Footer';
import SectionLabel from '../components/SectionLabel';
import V2Button from '../components/V2Button';
import { Check } from 'lucide-react';

export default function V2PricingPage({ onOpenPolicy }) {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A2421] font-sans selection:bg-[#EBF1ED]">
      <V2Navbar currentPath="/v2/pricing" />

      <section className="pt-16 pb-20 v2-hero-atmosphere border-b border-[#E7E0D3]">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <SectionLabel text="TRANSPARENT & PREDICTABLE" number="PRICING" />
          <h1 className="text-3xl sm:text-5xl font-serif text-[#1A2421] tracking-tight leading-tight">
            Simple, honest pricing. No lock-in packages.
          </h1>
          <p className="text-base sm:text-lg text-[#5E706A] max-w-2xl mx-auto leading-relaxed">
            All prices shown clearly in INR (₹). Pay by UPI, cards, or netbanking. Cancel or pause anytime.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Plan 1: Self-Work Platform */}
          <div className="p-8 sm:p-10 rounded-2xl bg-[#FAF8F5] border border-[#E7E0D3] shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="font-mono text-xs text-[#758D7E] uppercase font-semibold">INDEPENDENT PRACTICE</span>
              <h3 className="text-2xl font-serif text-[#1A2421]">Self-Work Platform</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-serif font-bold text-[#1A2421]">₹499</span>
                <span className="text-xs text-[#7D8E87] font-mono">/ month</span>
              </div>
              <p className="text-xs text-[#5E706A] leading-relaxed">
                Unlimited guided and free-flow journaling, weekly pattern reports, monthly synthesis, and complete private history.
              </p>
              <ul className="space-y-2.5 pt-4 border-t border-[#EAE4D7] text-xs text-[#4F635E]">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#758D7E]" /> Unlimited 5-prompt guided entries</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#758D7E]" /> Weekly & monthly pattern reports</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#758D7E]" /> Emotional vocabulary discovery</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#758D7E]" /> Cancel or pause anytime</li>
              </ul>
            </div>
            <V2Button href="/v2/contact" variant="secondary" className="w-full">
              Start self-reflection →
            </V2Button>
          </div>

          {/* Plan 2: Collaborative Care */}
          <div className="p-8 sm:p-10 rounded-2xl bg-white border-2 border-[#1E3633] shadow-md flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="font-mono text-xs text-[#1E3633] uppercase font-semibold">THERAPIST COLLABORATION</span>
              <h3 className="text-2xl font-serif text-[#1A2421]">Therapist-Supported</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-serif font-bold text-[#1E3633]">From ₹999</span>
                <span className="text-xs text-[#7D8E87] font-mono">/ session</span>
              </div>
              <p className="text-xs text-[#5E706A] leading-relaxed">
                Connect with verified licensed practitioners. Includes shared milestone dashboards, between-session homework, and care continuity.
              </p>
              <ul className="space-y-2.5 pt-4 border-t border-[#EAE4D7] text-xs text-[#4F635E]">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#1E3633]" /> Verified, credentialed therapists</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#1E3633]" /> Shared session recap dashboard</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#1E3633]" /> Selective entry sharing</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#1E3633]" /> Pay per session, zero lock-in</li>
              </ul>
            </div>
            <V2Button href="/v2/contact" variant="primary" className="w-full">
              Book orientation session →
            </V2Button>
          </div>
        </div>
      </section>

      <V2Footer onOpenPolicy={onOpenPolicy} />
    </div>
  );
}
