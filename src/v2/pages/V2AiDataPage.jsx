import React from 'react';
import V2Navbar from '../components/V2Navbar';
import V2Footer from '../components/V2Footer';
import SectionLabel from '../components/SectionLabel';
import V2Button from '../components/V2Button';
import { ShieldCheck, Lock, EyeOff, FileText, Database, KeyRound, CheckCircle2, ArrowRight } from 'lucide-react';

export default function V2AiDataPage({ onOpenPolicy }) {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A2421] font-sans selection:bg-[#EBF1ED]">
      <V2Navbar currentPath="/v2/ai-data" />

      {/* Section 1: Hero Cover */}
      <section className="min-h-screen w-full flex flex-col justify-center items-center py-16 xl:py-24 px-6 border-b border-[#E7E0D3] v2-hero-atmosphere relative overflow-hidden">
        <div className="w-full max-w-5xl mx-auto text-center space-y-8 relative z-10">
          <SectionLabel text="TRANSPARENT BOUNDARIES" number="AI & DATA ETHICS" />
          
          <h1 className="text-4xl sm:text-6xl xl:text-7xl font-serif text-[#1A2421] tracking-tight leading-[1.15] max-w-4xl mx-auto">
            AI helps connect the dots. It never becomes the authority.
          </h1>
          
          <p className="text-lg sm:text-xl xl:text-2xl text-[#4A5D57] max-w-3xl mx-auto font-serif italic leading-relaxed">
            "We hold rigorous boundaries around machine intelligence. It functions exclusively as a linguistic mirror and organizational lens, keeping ultimate interpretation and agency with you."
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EBF1ED] border border-[#D5E2D9] text-[#1E3633] text-xs font-mono font-medium tracking-wide">
            <span>CORE PILLAR</span>
            <span className="text-[#8DBFB4]">•</span>
            <span className="font-serif italic font-normal text-sm">Understand. Grow. Continue.</span>
          </div>

          <div className="pt-6 flex flex-wrap justify-center gap-4">
            <V2Button href="/v2/how-it-works" variant="secondary" size="lg">
              How the Engine Works
            </V2Button>
            <V2Button href="/v2/contact" size="lg">
              Ask Our Privacy Officer <ArrowRight className="w-4 h-4 ml-1 inline" />
            </V2Button>
          </div>
        </div>
      </section>

      {/* Section 2: Six Ethical Guardrails */}
      <section className="min-h-screen w-full flex flex-col justify-center items-center py-16 xl:py-24 px-6 bg-white border-b border-[#E7E0D3]">
        <div className="w-full max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <SectionLabel text="ARCHITECTURAL COMMITMENTS" number="GUARDRAILS" />
            <h2 className="text-3xl sm:text-5xl font-serif text-[#1A2421] tracking-tight">
              Six immutable rules built into our codebase.
            </h2>
            <p className="text-base sm:text-lg text-[#5E706A] leading-relaxed">
              Every prompt, synthesis engine, and vector retrieval operation is governed by these foundational ethical invariants.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-8 rounded-2xl bg-[#FAF8F5] border border-[#E7E0D3] space-y-3 hover:border-[#1E3633] transition-all">
              <span className="font-mono text-xs text-[#758D7E] font-bold">INVARIANT 01</span>
              <h3 className="font-serif text-lg font-semibold text-[#1A2421] flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#2E7A70]" /> No Clinical Diagnosis
              </h3>
              <p className="text-xs sm:text-sm text-[#5E706A] leading-relaxed">
                Our models never assign DSM psychiatric labels or generate unvetted medical prescriptions.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#FAF8F5] border border-[#E7E0D3] space-y-3 hover:border-[#1E3633] transition-all">
              <span className="font-mono text-xs text-[#758D7E] font-bold">INVARIANT 02</span>
              <h3 className="font-serif text-lg font-semibold text-[#1A2421] flex items-center gap-2">
                <EyeOff className="w-5 h-5 text-[#2E7A70]" /> Zero Data Monetization
              </h3>
              <p className="text-xs sm:text-sm text-[#5E706A] leading-relaxed">
                Your reflections, journal text, and psychometrics are never sold, rented, or shared with third-party advertisers.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#FAF8F5] border border-[#E7E0D3] space-y-3 hover:border-[#1E3633] transition-all">
              <span className="font-mono text-xs text-[#758D7E] font-bold">INVARIANT 03</span>
              <h3 className="font-serif text-lg font-semibold text-[#1A2421] flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#2E7A70]" /> Zero Training on Your Words
              </h3>
              <p className="text-xs sm:text-sm text-[#5E706A] leading-relaxed">
                We use zero-retention commercial API agreements. Your private entries are never used to train public foundational AI models.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#FAF8F5] border border-[#E7E0D3] space-y-3 hover:border-[#1E3633] transition-all">
              <span className="font-mono text-xs text-[#758D7E] font-bold">INVARIANT 04</span>
              <h3 className="font-serif text-lg font-semibold text-[#1A2421] flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-[#2E7A70]" /> Client Sovereignty & Export
              </h3>
              <p className="text-xs sm:text-sm text-[#5E706A] leading-relaxed">
                Export your full longitudinal history in standard JSON or markdown, or permanently delete your account with one click.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#FAF8F5] border border-[#E7E0D3] space-y-3 hover:border-[#1E3633] transition-all">
              <span className="font-mono text-xs text-[#758D7E] font-bold">INVARIANT 05</span>
              <h3 className="font-serif text-lg font-semibold text-[#1A2421] flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#2E7A70]" /> Transparent Evidence Grounding
              </h3>
              <p className="text-xs sm:text-sm text-[#5E706A] leading-relaxed">
                Every pattern detected links directly to exact timestamped entry quotes. Nothing is hallucinatory or ungrounded.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#FAF8F5] border border-[#E7E0D3] space-y-3 hover:border-[#1E3633] transition-all">
              <span className="font-mono text-xs text-[#758D7E] font-bold">INVARIANT 06</span>
              <h3 className="font-serif text-lg font-semibold text-[#1A2421] flex items-center gap-2">
                <Database className="w-5 h-5 text-[#2E7A70]" /> Collaborative Encryption
              </h3>
              <p className="text-xs sm:text-sm text-[#5E706A] leading-relaxed">
                All data is encrypted in transit (TLS 1.3) and at rest (AES-256) across isolated cloud database instances.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Data Lifecycle & How Reflection Works */}
      <section className="min-h-screen w-full flex flex-col justify-center items-center py-16 xl:py-24 px-6 bg-[#FAF8F5] border-b border-[#E7E0D3]">
        <div className="w-full max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <SectionLabel text="PROCESSING INTEGRITY" number="LIFECYCLE" />
            <h2 className="text-3xl sm:text-5xl font-serif text-[#1A2421] tracking-tight">
              How your journal text flows through our architecture.
            </h2>
            <p className="text-base sm:text-lg text-[#5E706A] leading-relaxed">
              We process reflections ephemerally to extract linguistic markers and longitudinal patterns without persistent third-party caching.
            </p>
          </div>

          <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#E7E0D3] shadow-xs space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <div className="w-8 h-8 rounded-full bg-[#EBF1ED] text-[#1E3633] font-mono font-bold flex items-center justify-center text-xs">
                  01
                </div>
                <h4 className="font-serif text-base font-semibold text-[#1A2421]">Encrypted Ingress</h4>
                <p className="text-xs sm:text-sm text-[#5E706A] leading-relaxed">
                  Your daily reflection is written locally in the browser and transmitted over end-to-end encrypted TLS to secure application servers.
                </p>
              </div>

              <div className="space-y-3">
                <div className="w-8 h-8 rounded-full bg-[#EBF1ED] text-[#1E3633] font-mono font-bold flex items-center justify-center text-xs">
                  02
                </div>
                <h4 className="font-serif text-base font-semibold text-[#1A2421]">Ephemeral Mirror Synthesis</h4>
                <p className="text-xs sm:text-sm text-[#5E706A] leading-relaxed">
                  The Mirror prompt analyzes your entry for cognitive distortions and emotional tones, generating a gentle reflective response in real time.
                </p>
              </div>

              <div className="space-y-3">
                <div className="w-8 h-8 rounded-full bg-[#EBF1ED] text-[#1E3633] font-mono font-bold flex items-center justify-center text-xs">
                  03
                </div>
                <h4 className="font-serif text-base font-semibold text-[#1A2421]">Longitudinal State Tracking</h4>
                <p className="text-xs sm:text-sm text-[#5E706A] leading-relaxed">
                  Pattern detections transition across 4 verifiable states (Emerging, Active, Quiet, Re-emerging) and are synthesized into 30-day cycle reports.
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-[#E7E0D3] flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-mono text-[#5E706A]">
                <CheckCircle2 className="w-4 h-4 text-[#2E7A70]" /> HIPAA & GDPR architectural alignment
              </div>
              <button
                onClick={() => onOpenPolicy?.('privacy')}
                className="text-xs font-semibold text-[#1E3633] underline hover:text-[#2E7A70] cursor-pointer"
              >
                Read our complete Privacy Policy →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: CTA Section */}
      <section className="min-h-screen w-full flex flex-col justify-center items-center py-16 xl:py-24 px-6 bg-white">
        <div className="w-full max-w-4xl mx-auto text-center space-y-8 p-12 sm:p-16 rounded-3xl bg-[#FAF8F5] border border-[#E7E0D3]">
          <div className="w-16 h-16 rounded-full border-[1.5px] border-[#2E7A70] flex items-center justify-center mx-auto bg-white shadow-xs">
            <div className="w-4 h-4 rounded-full bg-[#1E3633]" />
          </div>
          
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-5xl font-serif text-[#1A2421] tracking-tight">
              Your mind deserves a private, secure sanctuary.
            </h2>
            <p className="text-base sm:text-lg text-[#5E706A] max-w-xl mx-auto leading-relaxed">
              Experience the clarity of self-reflection without compromise.
            </p>
          </div>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <V2Button href="/v2/what-it-is" variant="secondary" size="lg">
              Platform Features
            </V2Button>
            <V2Button href="/v2/contact" size="lg">
              Begin Today →
            </V2Button>
          </div>
        </div>
      </section>

      <V2Footer onOpenPolicy={onOpenPolicy} />
    </div>
  );
}
