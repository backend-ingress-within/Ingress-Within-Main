import React, { useState, useEffect } from 'react';
import V2Navbar from './V2Navbar';
import V2Footer from './V2Footer';
import SectionLabel from './SectionLabel';
import TableOfContents from './TableOfContents';
import V2Button from './V2Button';
import { V2_SEO_PAGES } from '../data/v2Content';
import { Clock, ArrowRight } from 'lucide-react';

export default function ArticleLayout({ page, onOpenPolicy }) {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const otherPages = V2_SEO_PAGES.filter(p => p.slug !== page.slug).slice(0, 3);

  const handleNavClick = (path, e) => {
    if (typeof window !== 'undefined' && window.navigateTo && path.startsWith('/')) {
      e.preventDefault();
      window.navigateTo(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] font-sans text-[#1A2421] selection:bg-[#EBF1ED]">
      {/* Sticky Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-[#E7E0D3] z-50">
        <div
          className="h-full bg-[#1E3633] transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <V2Navbar currentPath={`/v2/${page.slug}`} />

      {/* Article Header */}
      <div className="w-full max-w-4xl mx-auto px-6 pt-16 pb-12 text-center space-y-6">
        <SectionLabel text={page.category} number="ESSAY" />
        <h1 className="text-3xl sm:text-5xl font-serif text-[#1A2421] tracking-tight leading-tight max-w-3xl mx-auto">
          {page.title}
        </h1>
        <div className="flex items-center justify-center gap-4 text-xs font-mono text-[#7D8E87]">
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {page.readTime}</span>
          <span>·</span>
          <span>INGRESS WITHIN EDITORIAL</span>
        </div>
      </div>

      {/* Article Body Grid */}
      <div className="w-full max-w-5xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 pb-20">
        {/* Left / Sidebar Table of Contents */}
        <div className="hidden lg:block lg:col-span-4 sticky top-28 self-start space-y-6">
          <TableOfContents sections={page.sections} />
          <div className="p-5 rounded-2xl bg-white border border-[#E7E0D3] space-y-3">
            <h5 className="font-serif text-sm font-semibold text-[#1A2421]">Begin your inquiry</h5>
            <p className="text-xs text-[#5E706A] leading-relaxed">
              Explore your emotional patterns and recurring loops in a private, structured journal.
            </p>
            <V2Button href="/v2/contact" size="sm" className="w-full">
              Begin your reflection
            </V2Button>
          </div>
        </div>

        {/* Main Content Body */}
        <main className="lg:col-span-8 space-y-10">
          {/* Lede / Intro box */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E7E0D3] shadow-xs">
            <p className="font-serif italic text-base sm:text-lg text-[#25332F] leading-relaxed">
              {page.intro}
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-12">
            {page.sections.map((section, idx) => {
              const id = section.heading.toLowerCase().replace(/[^\w]+/g, '-');
              return (
                <section key={idx} id={id} className="space-y-4 scroll-mt-28">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-[#758D7E]">
                      0{idx + 1}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-serif font-semibold text-[#1A2421]">
                      {section.heading}
                    </h2>
                  </div>
                  <div className="text-sm sm:text-base text-[#3A4D47] leading-relaxed whitespace-pre-line font-sans space-y-4">
                    {section.content}
                  </div>
                </section>
              );
            })}
          </div>

          {/* Pull Quote Callout */}
          <div className="my-10 p-6 sm:p-8 rounded-2xl bg-[#EBF1ED] border border-[#D5E2D9] text-center space-y-2">
            <span className="font-mono text-[10.5px] uppercase tracking-wider text-[#1E3633] font-semibold">
              CORE PRINCIPLE
            </span>
            <p className="font-serif text-lg sm:text-xl text-[#1E3633] italic leading-snug">
              "Clarity does not come from eradicating feelings; it comes from having the quiet courage to accurately describe them."
            </p>
          </div>

          {/* Bottom Article Actions */}
          <div className="p-6 rounded-2xl bg-white border border-[#E7E0D3] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h5 className="font-serif text-sm font-semibold text-[#1A2421]">Found this reflection useful?</h5>
              <p className="text-xs text-[#5E706A]">Carry these insights into your daily journaling practice.</p>
            </div>
            <V2Button href="/v2/contact" size="sm">
              Start Journaling →
            </V2Button>
          </div>
        </main>
      </div>

      {/* Related Reading Section */}
      <div className="w-full max-w-5xl mx-auto px-6 pt-8 pb-16 border-t border-[#E7E0D3]">
        <SectionLabel text="CONTINUE EXPLORING" number="RELATED ESSAYS" align="left" className="mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {otherPages.map((op) => (
            <div
              key={op.slug}
              className="p-6 rounded-2xl bg-white border border-[#E7E0D3] shadow-xs flex flex-col justify-between space-y-3 hover:border-[#1E3633] transition-all"
            >
              <div className="space-y-1">
                <span className="font-mono text-[10px] text-[#758D7E] uppercase font-semibold">{op.category}</span>
                <h4 className="font-serif text-base font-semibold text-[#1A2421]">{op.shortTitle}</h4>
              </div>
              <a
                href={`/v2/${op.slug}`}
                onClick={(e) => handleNavClick(`/v2/${op.slug}`, e)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#1E3633] hover:underline cursor-pointer"
              >
                Read essay <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          ))}
        </div>
      </div>

      <V2Footer onOpenPolicy={onOpenPolicy} />
    </div>
  );
}
