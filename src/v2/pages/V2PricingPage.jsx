import React from 'react';
import V2Navbar from '../components/V2Navbar';
import V2Footer from '../components/V2Footer';
import SectionLabel from '../components/SectionLabel';
import V2Button from '../components/V2Button';
import { Check, ArrowRight, ShieldCheck } from 'lucide-react';

export default function V2PricingPage({ onOpenPolicy }) {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A2421] font-sans selection:bg-[#EBF1ED] overflow-x-hidden">
      <V2Navbar currentPath="/v2/pricing" />

      {/* 1. Header (Full Page Cover 1920x1080) */}
      <section className="min-h-screen w-full flex flex-col justify-center items-center py-16 xl:py-24 px-6 v2-hero-atmosphere border-b border-[#E7E0D3]">
        <div className="max-w-5xl w-full mx-auto text-center space-y-8 my-auto">
          <SectionLabel text="UNDERSTAND · GROW · CONTINUE" number="PRICING" />
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif text-[#1A2421] tracking-tight leading-[1.08] max-w-4xl mx-auto">
            Simple, honest pricing.<br />
            <span className="italic font-serif text-[#1E3633]">No locked-in packages.</span>
          </h1>
          <p className="text-base sm:text-lg text-[#5E706A] max-w-2xl mx-auto leading-relaxed">
            All prices shown clearly in INR (₹). Pay by UPI, cards, or netbanking. Seven days free. Cancel or pause anytime without penalty.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <V2Button href="/v2/contact" size="lg">
              Start 7-day free trial
            </V2Button>
            <V2Button href="/v2/how-it-works" variant="play" size="lg">
              See what is included
            </V2Button>
          </div>
        </div>
      </section>

      {/* 2. Pricing Plans Grid (Full Page Cover 1920x1080) */}
      <section className="min-h-screen w-full flex flex-col justify-center items-center py-16 xl:py-24 px-6 bg-white border-b border-[#E7E0D3]">
        <div className="max-w-6xl w-full mx-auto space-y-12 my-auto">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="font-mono text-xs text-[#758D7E] uppercase font-semibold">01 · PLANS &amp; ACCESS</span>
            <h2 className="text-3xl sm:text-5xl font-serif text-[#1A2421] tracking-tight">
              Choose the level of support you need.
            </h2>
            <p className="text-sm sm:text-base text-[#5E706A] leading-relaxed">
              Start with independent journaling, or connect with a credentialed practitioner when you want collaborative depth.
            </p>
          </div>

          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            {/* Plan 1: Self-Work Platform */}
            <div className="p-8 sm:p-10 rounded-2xl bg-[#FAF8F5] border border-[#E7E0D3] shadow-xs flex flex-col justify-between space-y-6 hover:shadow-md transition-all">
              <div className="space-y-4">
                <span className="font-mono text-xs text-[#758D7E] uppercase font-semibold">INDEPENDENT PRACTICE</span>
                <h3 className="text-2xl sm:text-3xl font-serif text-[#1A2421]">Self-Work Platform</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-serif font-bold text-[#1A2421]">₹499</span>
                  <span className="text-xs text-[#7D8E87] font-mono">/ month</span>
                </div>
                <p className="text-xs sm:text-sm text-[#5E706A] leading-relaxed">
                  Unlimited guided and free-flow journaling, weekly pattern reports, 30-day synthesis, and complete private history.
                </p>
                <ul className="space-y-2.5 pt-4 border-t border-[#EAE4D7] text-xs sm:text-sm text-[#4F635E]">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#758D7E] flex-shrink-0" /> Unlimited daily entries &amp; AI mirror reflection</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#758D7E] flex-shrink-0" /> Longitudinal pattern engine (4-state lifecycle)</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#758D7E] flex-shrink-0" /> Emotional vocabulary discovery &amp; shift radar</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#758D7E] flex-shrink-0" /> 19 structured psychoeducation modules</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#758D7E] flex-shrink-0" /> Cancel or pause anytime with one click</li>
                </ul>
              </div>
              <V2Button href="/v2/contact" variant="secondary" className="w-full">
                Start 7-day free trial →
              </V2Button>
            </div>

            {/* Plan 2: Collaborative Care */}
            <div className="p-8 sm:p-10 rounded-2xl bg-white border-2 border-[#1E3633] shadow-md flex flex-col justify-between space-y-6 hover:shadow-lg transition-all">
              <div className="space-y-4">
                <span className="font-mono text-xs text-[#1E3633] uppercase font-semibold">THERAPIST COLLABORATION</span>
                <h3 className="text-2xl sm:text-3xl font-serif text-[#1A2421]">Therapist-Supported</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-serif font-bold text-[#1E3633]">From ₹999</span>
                  <span className="text-xs text-[#7D8E87] font-mono">/ session</span>
                </div>
                <p className="text-xs sm:text-sm text-[#5E706A] leading-relaxed">
                  Connect with verified licensed practitioners. Includes shared milestone dashboards, between-session homework, and care continuity.
                </p>
                <ul className="space-y-2.5 pt-4 border-t border-[#EAE4D7] text-xs sm:text-sm text-[#4F635E]">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#1E3633] flex-shrink-0" /> Verified, credentialed clinical psychologists</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#1E3633] flex-shrink-0" /> Shared thematic recap dashboard</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#1E3633] flex-shrink-0" /> Selective reflection sharing (you choose what to share)</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#1E3633] flex-shrink-0" /> Includes full access to self-work platform</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#1E3633] flex-shrink-0" /> Pay per session, zero multi-month packages</li>
                </ul>
              </div>
              <V2Button href="/v2/contact" variant="primary" className="w-full">
                Book orientation session →
              </V2Button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Final Reassurance CTA (Full Page Cover 1920x1080) */}
      <section className="min-h-screen w-full flex flex-col justify-center items-center py-20 xl:py-32 px-6 bg-[#1E3633] text-[#FAF8F5] relative overflow-hidden">
        <div className="max-w-4xl w-full mx-auto text-center space-y-8 relative z-10 my-auto">
          <div className="w-12 h-12 rounded-full bg-white/10 text-[#8DBFB4] flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>

          <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#A5C0B3] font-semibold">
            UNDERSTAND · GROW · CONTINUE
          </span>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif font-normal leading-tight">
            Start free. Continue only if it's honest enough to.
          </h2>

          <p className="text-base sm:text-lg text-[#C9D8D1] max-w-xl mx-auto font-serif italic">
            No long-term contracts. No auto-renew traps. A calm sanctuary built around your agency.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a
              href="/v2/contact"
              className="px-8 py-3.5 rounded-full bg-[#FAF8F5] text-[#1E3633] hover:bg-white text-sm font-semibold tracking-wide transition-all shadow-md inline-flex items-center gap-2 cursor-pointer no-underline"
            >
              Begin your free trial <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      <V2Footer onOpenPolicy={onOpenPolicy} />
    </div>
  );
}

