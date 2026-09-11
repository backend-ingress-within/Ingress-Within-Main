import React, { useState, useEffect } from 'react';
import { V2_NAV_LINKS } from '../data/v2Content';
import { Menu, X, ArrowRight } from 'lucide-react';

export default function V2Navbar({ currentPath = '/v2' }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (path, e) => {
    if (typeof window !== 'undefined' && window.navigateTo) {
      e.preventDefault();
      window.navigateTo(path);
      setMobileMenuOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled
            ? 'bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E7E0D3] shadow-xs py-3.5'
            : 'bg-[#FAF8F5]/60 backdrop-blur-xs border-b border-transparent py-5'
        }`}
      >
        <div className="w-full max-w-6xl mx-auto px-6 flex items-center justify-between">
          {/* Logo with original logo mark and tagline */}
          <a
            href="/v2"
            onClick={(e) => handleNavClick('/v2', e)}
            className="flex items-center gap-3 group cursor-pointer no-underline"
          >
            <img
              src="/logo-mark-transparent.png"
              alt="Ingress Within"
              className="w-8 h-8 object-contain transition-transform duration-300 group-hover:scale-105 flex-shrink-0"
            />
            <div className="flex flex-col justify-center">
              <span className="font-serif tracking-[0.01em] text-xl text-[#1A2421] font-normal leading-none">
                ingress <span className="font-semibold text-[#2E7A70]">within</span>
              </span>
              <span className="font-sans text-[9px] font-medium tracking-[0.14em] text-[#4A6A64] uppercase leading-tight mt-1">
                Understand. Grow. Continue
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7">
            {V2_NAV_LINKS.slice(0, 5).map((link) => {
              const isActive = currentPath === link.path;
              return (
                <a
                  key={link.path}
                  href={link.path}
                  onClick={(e) => handleNavClick(link.path, e)}
                  className={`text-sm font-medium transition-colors relative py-1 cursor-pointer ${
                    isActive
                      ? 'text-[#1E3633] font-semibold'
                      : 'text-[#5E706A] hover:text-[#1A2421]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#1E3633]" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="/auth"
              onClick={(e) => handleNavClick('/auth', e)}
              className="text-xs font-semibold text-[#5E706A] hover:text-[#1A2421] px-3 py-2 transition-colors cursor-pointer"
            >
              Log in
            </a>
            <a
              href="/v2/contact"
              onClick={(e) => handleNavClick('/v2/contact', e)}
              className="px-5 py-2 rounded-full bg-[#1E3633] text-[#FAF8F5] hover:bg-[#2B4B47] text-xs font-medium tracking-wide transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              Get Started <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#1A2421] hover:text-[#1E3633] rounded-lg transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[73px] z-30 bg-[#FAF8F5] border-b border-[#E7E0D3] shadow-lg p-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-3">
            {V2_NAV_LINKS.map((link) => (
              <a
                key={link.path}
                href={link.path}
                onClick={(e) => handleNavClick(link.path, e)}
                className="text-base font-serif text-[#1A2421] hover:text-[#1E3633] py-1 border-b border-[#EEE7DB]/60"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="pt-2 flex flex-col gap-2.5">
            <a
              href="/auth"
              onClick={(e) => handleNavClick('/auth', e)}
              className="w-full py-2.5 text-center text-sm font-medium border border-[#D5CDBC] text-[#1A2421] rounded-full"
            >
              Log In
            </a>
            <a
              href="/v2/contact"
              onClick={(e) => handleNavClick('/v2/contact', e)}
              className="w-full py-2.5 text-center text-sm font-medium bg-[#1E3633] text-white rounded-full flex items-center justify-center gap-2"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </>
  );
}
