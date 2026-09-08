import React from 'react';
import V2Navbar from '../components/V2Navbar';
import V2Footer from '../components/V2Footer';
import SectionLabel from '../components/SectionLabel';
import V2Button from '../components/V2Button';
import DomainTopicGrid from '../components/DomainTopicGrid';
import PrivacyCallout from '../components/PrivacyCallout';

export default function V2WhatItIsPage({ onOpenPolicy }) {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A2421] font-sans selection:bg-[#EBF1ED]">
      <V2Navbar currentPath="/v2/what-it-is" />

      {/* Header */}
      <section className="pt-16 pb-20 v2-hero-atmosphere border-b border-[#E7E0D3]">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <SectionLabel text="THE PHILOSOPHY & ECOSYSTEM" number="WHAT IT IS" />
          <h1 className="text-3xl sm:text-5xl font-serif text-[#1A2421] tracking-tight leading-tight">
            A calm digital space for understanding yourself.
          </h1>
          <p className="text-base sm:text-lg text-[#5E706A] max-w-2xl mx-auto leading-relaxed">
            Ingress Within is not a generic wellness tracker, a medical clinic, or an automated chatbot. It is a dedicated psychoeducational sanctuary built around structured inquiry and longitudinal self-awareness.
          </p>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 space-y-16">
          <div className="space-y-4">
            <span className="font-mono text-xs text-[#758D7E] uppercase font-semibold">01 · BEYOND SURFACE WELLNESS</span>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#1A2421]">
              Why ordinary notes and streaks fail to build lasting insight.
            </h2>
            <p className="text-sm sm:text-base text-[#4F635E] leading-relaxed">
              Most digital tools either overwhelm users with clinical diagnostic jargon or reduce mental health to gamified daily streaks. When life gets complicated, a streak counter creates guilt rather than clarity. Ingress Within replaces gamification with thoughtful, evidence-informed structure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#E7E0D3] space-y-3">
              <h4 className="font-serif text-lg font-semibold text-[#1A2421]">Structured Prompts</h4>
              <p className="text-xs text-[#5E706A] leading-relaxed">
                Five questions that systematically disentangle context, appraisal, somatic tension, and default reactions.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#E7E0D3] space-y-3">
              <h4 className="font-serif text-lg font-semibold text-[#1A2421]">Pattern Intelligence</h4>
              <p className="text-xs text-[#5E706A] leading-relaxed">
                Longitudinal synthesis that connects disparate reflections across weeks, highlighting unseen behavioral costs.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#E7E0D3] space-y-3">
              <h4 className="font-serif text-lg font-semibold text-[#1A2421]">Flexible Continuity</h4>
              <p className="text-xs text-[#5E706A] leading-relaxed">
                Seamless transition between independent self-work and therapist-supported care without losing your history.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Domains Grid */}
      <section className="py-20 bg-[#FAF8F5] border-t border-[#E7E0D3]">
        <div className="max-w-6xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <SectionLabel text="AREAS OF INQUIRY" number="02" />
            <h2 className="text-3xl font-serif text-[#1A2421]">
              The six dimensions of inner exploration.
            </h2>
          </div>
          <DomainTopicGrid />
        </div>
      </section>

      {/* Privacy Sanctuary */}
      <section className="py-12 bg-white border-t border-[#E7E0D3]">
        <div className="max-w-5xl mx-auto px-6">
          <PrivacyCallout />
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#1E3633] text-[#FAF8F5] text-center space-y-6">
        <h2 className="text-3xl sm:text-4xl font-serif">Begin your first guided reflection today.</h2>
        <p className="text-sm text-[#C9D8D1] max-w-md mx-auto">
          Take the first step toward structured self-understanding.
        </p>
        <V2Button href="/v2/contact" variant="secondary">
          Get Started →
        </V2Button>
      </section>

      <V2Footer onOpenPolicy={onOpenPolicy} />
    </div>
  );
}
