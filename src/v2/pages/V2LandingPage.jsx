import React from 'react';
import V2Navbar from '../components/V2Navbar';
import V2Footer from '../components/V2Footer';
import SectionLabel from '../components/SectionLabel';
import SectionDivider from '../components/SectionDivider';
import V2Button from '../components/V2Button';
import HeroInterfaceMockup from '../components/HeroInterfaceMockup';
import JourneyRoadmap from '../components/JourneyRoadmap';
import PathwayCard from '../components/PathwayCard';
import StartingPointCard from '../components/StartingPointCard';
import DomainTopicGrid from '../components/DomainTopicGrid';
import FrameworkSteps from '../components/FrameworkSteps';
import ProductShowcase from '../components/ProductShowcase';
import PrivacyCallout from '../components/PrivacyCallout';
import { V2_PATHWAYS, V2_STARTING_POINTS } from '../data/v2Content';
import { ArrowRight } from 'lucide-react';

export default function V2LandingPage({ onOpenPolicy }) {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A2421] font-sans selection:bg-[#EBF1ED] overflow-x-hidden">
      <V2Navbar currentPath="/v2" />

      {/* 1. HERO SECTION (Full Page Cover 1920x1080) */}
      <section className="min-h-screen w-full flex flex-col justify-center items-center py-16 xl:py-24 px-6 relative overflow-hidden v2-hero-atmosphere">
        <div className="max-w-6xl w-full mx-auto text-center space-y-8 relative z-10 my-auto">
          <SectionLabel text="UNDERSTAND · GROW · CONTINUE" />

          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif text-[#1A2421] tracking-tight leading-[1.08]">
              Whatever brings you here,<br />
              <span className="italic font-serif text-[#1E3633]">you can start there.</span>
            </h1>
            <p className="text-base sm:text-lg text-[#5E706A] max-w-2xl mx-auto leading-relaxed pt-1">
              Ingress Within is a calm, continuous psychological growth ecosystem bringing together self-guided inquiry, therapist collaboration, and structured self-understanding.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-1">
            <V2Button href="/v2/contact" size="lg">
              Begin your reflection
            </V2Button>
            <V2Button href="/v2/how-it-works" variant="play" size="lg">
              See how it works
            </V2Button>
          </div>

          {/* Hero UI Live Platform Mockup */}
          <div className="pt-6 w-full">
            <HeroInterfaceMockup />
          </div>
        </div>
      </section>

      {/* 2. JOURNEY PROGRESSION ROADMAP (Full Page Cover 1920x1080) */}
      <section className="min-h-screen w-full flex flex-col justify-center items-center py-16 xl:py-24 px-6 bg-white border-y border-[#E7E0D3]">
        <div className="max-w-6xl w-full mx-auto space-y-8 text-center my-auto">
          <div className="space-y-3 max-w-2xl mx-auto">
            <SectionLabel text="A CONTINUOUS JOURNEY" number="01" />
            <h2 className="text-3xl sm:text-5xl font-serif text-[#1A2421] tracking-tight">
              A continuous path from reflection to clarity.
            </h2>
            <p className="text-sm sm:text-base text-[#5E706A] leading-relaxed">
              Self-awareness doesn't happen in a single breakthrough. It builds through consistent daily registration, noticing loops, and intentional reframing.
            </p>
          </div>
          <JourneyRoadmap />
        </div>
      </section>

      {/* 3. WAYS TO BEGIN / PATHWAYS (Full Page Cover 1920x1080) */}
      <section className="min-h-screen w-full flex flex-col justify-center items-center py-16 xl:py-24 px-6 bg-[#FAF8F5]">
        <div className="max-w-6xl w-full mx-auto space-y-12 my-auto">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <SectionLabel text="CHOOSE YOUR STARTING POINT" number="02" />
            <h2 className="text-3xl sm:text-5xl font-serif text-[#1A2421] tracking-tight">
              Three ways to work on your mental health.
            </h2>
            <p className="text-sm sm:text-base text-[#5E706A] leading-relaxed">
              Different needs. A connected journey. Choose what works for you right now—or move between them whenever your life changes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {V2_PATHWAYS.map((p) => (
              <PathwayCard key={p.step} pathway={p} />
            ))}
          </div>
        </div>
      </section>

      <SectionDivider number="03" label="COMMON STARTING POINTS" />

      {/* 4. COMMON STARTING POINTS (Full Page Cover 1920x1080) */}
      <section className="min-h-screen w-full flex flex-col justify-center items-center py-16 xl:py-24 px-6 bg-[#FAF8F5]">
        <div className="max-w-6xl w-full mx-auto space-y-10 my-auto">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <SectionLabel text="COMMON EXPERIENCES" number="03" />
            <h3 className="text-3xl sm:text-5xl font-serif text-[#1A2421] tracking-tight">
              Most of this starts as ordinary life, not a clinical complaint.
            </h3>
            <p className="text-sm sm:text-base text-[#5E706A]">
              Relatable emotional moments that bring people to our doorstep.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {V2_STARTING_POINTS.map((item, idx) => (
              <StartingPointCard key={idx} item={item} />
            ))}
          </div>
        </div>
      </section>

      <SectionDivider number="04" label="DOMAINS OF INQUIRY" />

      {/* 5. DOMAINS OF INQUIRY (Full Page Cover 1920x1080) */}
      <section className="min-h-screen w-full flex flex-col justify-center items-center py-16 xl:py-24 px-6 bg-white border-y border-[#E7E0D3]">
        <div className="max-w-6xl w-full mx-auto space-y-12 my-auto">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <SectionLabel text="THE SPECTRUM OF INQUIRY" number="04" />
            <h2 className="text-3xl sm:text-5xl font-serif text-[#1A2421] tracking-tight">
              What Ingress Within helps you explore.
            </h2>
            <p className="text-sm sm:text-base text-[#5E706A]">
              Six interconnected dimensions of self-awareness designed to build psychological maturity.
            </p>
          </div>

          <DomainTopicGrid />
        </div>
      </section>

      <SectionDivider number="05" label="HOW IT WORKS" />

      {/* 6. HOW IT WORKS 4-STAGE FLOW (Full Page Cover 1920x1080) */}
      <section className="min-h-screen w-full flex flex-col justify-center items-center py-16 xl:py-24 px-6 bg-[#FAF8F5]">
        <div className="max-w-6xl w-full mx-auto space-y-10 my-auto">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <SectionLabel text="THE 4-STAGE RHYTHM" number="05" />
            <h2 className="text-3xl sm:text-5xl font-serif text-[#1A2421] tracking-tight">
              From a daily reaction to lasting clarity.
            </h2>
            <p className="text-sm sm:text-base text-[#5E706A]">
              A consistent sequence that turns raw daily experiences into integrated wisdom.
            </p>
          </div>

          <FrameworkSteps />
        </div>
      </section>

      <SectionDivider number="06" label="EXPERIENCE PREVIEW" />

      {/* 7. PRODUCT SHOWCASE (Full Page Cover 1920x1080) */}
      <section className="min-h-screen w-full flex flex-col justify-center items-center py-16 xl:py-24 px-6 bg-white border-y border-[#E7E0D3]">
        <div className="max-w-6xl w-full mx-auto space-y-8 my-auto">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <SectionLabel text="INSIDE THE PLATFORM" number="06" />
            <h2 className="text-3xl sm:text-5xl font-serif text-[#1A2421] tracking-tight">
              Designed for quiet contemplation.
            </h2>
            <p className="text-sm sm:text-base text-[#5E706A]">
              An authentic preview of the daily mirror engine, longitudinal pattern tracking, 30-day cycle reports, and psychoeducation lab.
            </p>
          </div>

          <ProductShowcase />
        </div>
      </section>

      {/* 8. PRIVACY CALLOUT (Full Page Cover 1920x1080) */}
      <section className="min-h-screen w-full flex flex-col justify-center items-center py-16 xl:py-24 px-6 bg-[#FAF8F5]">
        <div className="max-w-5xl w-full mx-auto my-auto">
          <PrivacyCallout />
        </div>
      </section>

      {/* 9. FINAL EMOTIONAL CTA (Full Page Cover 1920x1080) */}
      <section className="min-h-screen w-full flex flex-col justify-center items-center py-20 xl:py-32 px-6 bg-[#1E3633] text-[#FAF8F5] relative overflow-hidden">
        <div className="max-w-4xl w-full mx-auto text-center space-y-8 relative z-10 my-auto">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#A5C0B3] font-semibold">
            UNDERSTAND · GROW · CONTINUE
          </span>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif font-normal leading-tight">
            "Understanding yourself doesn't have to begin with having all the answers."
          </h2>

          <p className="text-base sm:text-lg text-[#C9D8D1] max-w-xl mx-auto font-serif italic">
            Sometimes it begins simply with giving yourself somewhere safe to look.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a
              href="/v2/contact"
              onClick={(e) => {
                if (typeof window !== 'undefined' && window.navigateTo) {
                  e.preventDefault();
                  window.navigateTo('/v2/contact');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="px-8 py-3.5 rounded-full bg-[#FAF8F5] text-[#1E3633] hover:bg-white text-sm font-semibold tracking-wide transition-all shadow-md inline-flex items-center gap-2 cursor-pointer no-underline"
            >
              Begin your journey <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="/v2/how-it-works"
              onClick={(e) => {
                if (typeof window !== 'undefined' && window.navigateTo) {
                  e.preventDefault();
                  window.navigateTo('/v2/how-it-works');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="px-8 py-3.5 rounded-full border border-[#A5C0B3]/40 text-[#FAF8F5] hover:bg-white/10 text-sm font-medium tracking-wide transition-all cursor-pointer no-underline"
            >
              Explore how it works
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <V2Footer onOpenPolicy={onOpenPolicy} />
    </div>
  );
}

