import React from 'react';
import { V2_SEO_PAGES } from '../data/v2Content';

export default function V2Footer({ onOpenPolicy }) {
  const handleNavClick = (path, e) => {
    if (typeof window !== 'undefined' && window.navigateTo && path.startsWith('/')) {
      e.preventDefault();
      window.navigateTo(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="w-full bg-[#1A2421] text-[#FAF8F5] pt-20 pb-12 mt-20 border-t border-[#2D3E3A]">
      <div className="max-w-6xl w-full mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 pb-16 border-b border-[#2D3E3A]">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo-mark-light.png"
                alt="Ingress Within"
                className="w-8 h-8 object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] flex-shrink-0"
              />
              <div className="flex flex-col justify-center">
                <span className="font-serif text-xl tracking-[0.01em] text-[#FAF8F5] font-normal leading-none">
                  ingress <span className="font-semibold text-[#8DBFB4]">within</span>
                </span>
                <span className="font-sans text-[9px] font-medium tracking-[0.14em] text-[#A8D4CE] uppercase leading-tight mt-1">
                  Understand. Grow. Continue
                </span>
              </div>
            </div>
            <p className="font-serif italic text-[#A5C0B3] text-sm leading-relaxed max-w-sm">
              "Whatever brings you here, you can start there."
            </p>
            <p className="text-xs text-[#8A9E97] leading-relaxed max-w-sm font-sans">
              Guided journaling and longitudinal pattern recognition for self-understanding.
            </p>
          </div>

          {/* Explore */}
          <div className="space-y-3">
            <h4 className="font-mono text-[11px] font-semibold tracking-[0.16em] uppercase text-[#A5C0B3]">
              Explore
            </h4>
            <ul className="space-y-2 text-xs text-[#D1DCD6]">
              <li><a href="/v2/what-it-is" onClick={(e) => handleNavClick('/v2/what-it-is', e)} className="hover:text-white transition-colors">What It Is</a></li>
              <li><a href="/v2/how-it-works" onClick={(e) => handleNavClick('/v2/how-it-works', e)} className="hover:text-white transition-colors">How It Works</a></li>
              <li><a href="/v2/pricing" onClick={(e) => handleNavClick('/v2/pricing', e)} className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="/v2/contact" onClick={(e) => handleNavClick('/v2/contact', e)} className="hover:text-white transition-colors">Start Here</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-3">
            <h4 className="font-mono text-[11px] font-semibold tracking-[0.16em] uppercase text-[#A5C0B3]">
              Resources
            </h4>
            <ul className="space-y-2 text-xs text-[#D1DCD6]">
              {V2_SEO_PAGES.slice(0, 4).map((page) => (
                <li key={page.slug}>
                  <a
                    href={`/v2/${page.slug}`}
                    onClick={(e) => handleNavClick(`/v2/${page.slug}`, e)}
                    className="hover:text-white transition-colors"
                  >
                    {page.shortTitle}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Trust & Legal */}
          <div className="space-y-3">
            <h4 className="font-mono text-[11px] font-semibold tracking-[0.16em] uppercase text-[#A5C0B3]">
              Sanctuary & Trust
            </h4>
            <ul className="space-y-2 text-xs text-[#D1DCD6]">
              <li><a href="/v2/ai-data" onClick={(e) => handleNavClick('/v2/ai-data', e)} className="hover:text-white transition-colors">AI & Data Ethics</a></li>
              <li><a href="/v2/about" onClick={(e) => handleNavClick('/v2/about', e)} className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="/v2/faq" onClick={(e) => handleNavClick('/v2/faq', e)} className="hover:text-white transition-colors">FAQ</a></li>
              <li>
                <button
                  onClick={() => onOpenPolicy ? onOpenPolicy('privacy') : null}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Privacy Notice
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy ? onOpenPolicy('terms') : null}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Terms of Use
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7A8E87]">
          <div>
            © {new Date().getFullYear()} Ingress Within. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span>Private by default</span>
            <span className="w-1 h-1 rounded-full bg-[#7A8E87]" />
            <span>Non-clinical sanctuary</span>
            <span className="w-1 h-1 rounded-full bg-[#7A8E87]" />
            <span>Built for human clarity</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
