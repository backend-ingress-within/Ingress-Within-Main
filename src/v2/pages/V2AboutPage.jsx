import React from 'react';
import V2Navbar from '../components/V2Navbar';
import V2Footer from '../components/V2Footer';
import SectionLabel from '../components/SectionLabel';
import V2Button from '../components/V2Button';
import { Heart, Compass, Shield, BookOpen, Layers, Activity, ArrowRight } from 'lucide-react';

export default function V2AboutPage({ onOpenPolicy }) {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A2421] font-sans selection:bg-[#EBF1ED]">
      <V2Navbar currentPath="/v2/about" />

      {/* Section 1: Hero Cover */}
      <section className="min-h-screen w-full flex flex-col justify-center items-center py-16 xl:py-24 px-6 border-b border-[#E7E0D3] v2-hero-atmosphere relative overflow-hidden">
        <div className="w-full max-w-5xl mx-auto text-center space-y-8 relative z-10">
          <SectionLabel text="OUR MISSION & PRINCIPLES" number="ABOUT US" />
          
          <h1 className="text-4xl sm:text-6xl xl:text-7xl font-serif text-[#1A2421] tracking-tight leading-[1.15] max-w-4xl mx-auto">
            One place for the different ways people explore their inner lives.
          </h1>
          
          <p className="text-lg sm:text-xl xl:text-2xl text-[#4A5D57] max-w-3xl mx-auto font-serif italic leading-relaxed">
            "We believe understanding yourself is not an emergency intervention for distress, but a lifelong practice of curiosity, compassion, and psychological literacy."
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EBF1ED] border border-[#D5E2D9] text-[#1E3633] text-xs font-mono font-medium tracking-wide">
            <span>OFFICIAL BRAND MOTTO</span>
            <span className="text-[#8DBFB4]">•</span>
            <span className="font-serif italic font-normal text-sm">Understand. Grow. Continue.</span>
          </div>

          <div className="pt-6 flex flex-wrap justify-center gap-4">
            <V2Button href="/v2/how-it-works" variant="secondary" size="lg">
              Explore Our Architecture
            </V2Button>
            <V2Button href="/v2/contact" size="lg">
              Talk to Our Care Guide <ArrowRight className="w-4 h-4 ml-1 inline" />
            </V2Button>
          </div>
        </div>
      </section>

      {/* Section 2: Built for Real Human Conversations */}
      <section className="min-h-screen w-full flex flex-col justify-center items-center py-16 xl:py-24 px-6 bg-white border-b border-[#E7E0D3]">
        <div className="w-full max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <SectionLabel text="THE HUMAN CORE" number="FOUNDATIONS" />
            <h2 className="text-3xl sm:text-5xl font-serif text-[#1A2421] tracking-tight">
              Meeting you in the natural language of your day.
            </h2>
            <p className="text-base sm:text-lg text-[#5E706A] leading-relaxed">
              People rarely arrive with clinical jargon. They arrive with messy moments: overthinking at 2 AM, feeling unheard in a relationship, or wondering why success still feels hollow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-8 rounded-2xl bg-[#FAF8F5] border border-[#E7E0D3] space-y-4 hover:border-[#1E3633] transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#EBF1ED] flex items-center justify-center text-[#1E3633]">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-[#1A2421]">Natural Language Ingress</h3>
              <p className="text-xs sm:text-sm text-[#5E706A] leading-relaxed">
                Write freely without clinical forms or multiple-choice surveys. Express your real day in your authentic voice.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#FAF8F5] border border-[#E7E0D3] space-y-4 hover:border-[#1E3633] transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#EBF1ED] flex items-center justify-center text-[#1E3633]">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-[#1A2421]">Longitudinal Evidence</h3>
              <p className="text-xs sm:text-sm text-[#5E706A] leading-relaxed">
                Patterns are tracked over weeks and months through four distinct states: Emerging, Active, Quiet, and Re-emerging.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#FAF8F5] border border-[#E7E0D3] space-y-4 hover:border-[#1E3633] transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#EBF1ED] flex items-center justify-center text-[#1E3633]">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-[#1A2421]">Human Interpretation</h3>
              <p className="text-xs sm:text-sm text-[#5E706A] leading-relaxed">
                AI observations are mirrors, not diagnoses. You and your therapist retain complete authority over your story.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#FAF8F5] border border-[#E7E0D3] space-y-4 hover:border-[#1E3633] transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#EBF1ED] flex items-center justify-center text-[#1E3633]">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-[#1A2421]">19 Psychoeducation Labs</h3>
              <p className="text-xs sm:text-sm text-[#5E706A] leading-relaxed">
                Evidence-informed micro-curriculums spanning Cognitive Traps, Attachment Security, Burnout, and Performance Anxiety.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Non-Clinical Stance & Philosophy */}
      <section className="min-h-screen w-full flex flex-col justify-center items-center py-16 xl:py-24 px-6 bg-[#FAF8F5] border-b border-[#E7E0D3]">
        <div className="w-full max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <SectionLabel text="INTEGRITY & PRIVACY" number="OUR STANCE" />
            <h2 className="text-3xl sm:text-5xl font-serif text-[#1A2421] tracking-tight">
              A dignified container for structured self-inquiry.
            </h2>
            <p className="text-base sm:text-lg text-[#5E706A] leading-relaxed">
              We stand apart from algorithmic hype and clinical overreach. Here is what guides every decision we make.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#E7E0D3] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F0F4F2] flex items-center justify-center text-[#1E3633]">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl sm:text-2xl font-serif text-[#1A2421]">The Non-Clinical Stance</h3>
              <p className="text-sm sm:text-base text-[#5E706A] leading-relaxed">
                Ingress Within does not diagnose mental disorders, prescribe pharmaceutical treatments, or replace acute psychiatric care. We build tools that expand emotional vocabulary, surface cognitive habits, and facilitate deep human conversations.
              </p>
              <div className="pt-2 text-xs font-mono text-[#758D7E]">
                SAFE HARBOR • COMPASSIONATE SCAFFOLDING
              </div>
            </div>

            <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#E7E0D3] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F0F4F2] flex items-center justify-center text-[#1E3633]">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xl sm:text-2xl font-serif text-[#1A2421]">Client Data Sovereignty</h3>
              <p className="text-sm sm:text-base text-[#5E706A] leading-relaxed">
                Your entries, reflections, and psychometric summaries belong exclusively to you. We never sell your data, never feed your private journaling to public LLM training datasets, and provide 1-click full export and deletion whenever you choose.
              </p>
              <div className="pt-2 text-xs font-mono text-[#758D7E]">
                ZERO ADVERTISING • FULL CLIENT SOVEREIGNTY
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Final CTA Section */}
      <section className="min-h-screen w-full flex flex-col justify-center items-center py-16 xl:py-24 px-6 bg-white">
        <div className="w-full max-w-4xl mx-auto text-center space-y-8 p-12 sm:p-16 rounded-3xl bg-[#FAF8F5] border border-[#E7E0D3]">
          <div className="w-16 h-16 rounded-full border-[1.5px] border-[#2E7A70] flex items-center justify-center mx-auto bg-white shadow-xs">
            <div className="w-4 h-4 rounded-full bg-[#1E3633]" />
          </div>
          
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-5xl font-serif text-[#1A2421] tracking-tight">
              Begin your journey of self-understanding.
            </h2>
            <p className="text-base sm:text-lg text-[#5E706A] max-w-xl mx-auto leading-relaxed">
              Start with your first reflection today, or schedule a 15-minute orientation call with our care guide.
            </p>
          </div>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <V2Button href="/v2/what-it-is" variant="secondary" size="lg">
              Explore Features
            </V2Button>
            <V2Button href="/v2/contact" size="lg">
              Schedule Free Orientation →
            </V2Button>
          </div>
        </div>
      </section>

      <V2Footer onOpenPolicy={onOpenPolicy} />
    </div>
  );
}
