import React, { useState, useEffect } from 'react';

/**
 * Editorial Navbar matching the screenshot visual design.
 * Features the brand mark, refined serif typography, small mono subtitle,
 * active indicator dot, and clean routing to production authentication.
 */
export default function EditorialNavbar({ activeTab = 'home', onSelectTab }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', path: '/' },
    { id: 'solution', label: 'What It Is', path: '/solution' },
    { id: 'how', label: 'How It Works', path: '/how-it-works' },
    { id: 'about', label: 'About Us', path: '/about' },
    { id: 'pricing', label: 'Pricing', path: '/pricing' },
    { id: 'ai', label: 'AI & Data', path: '/ai-data' },
    { id: 'evidence', label: 'Evidence', path: '/evidence' },
    { id: 'crisis', label: 'In crisis?', path: '/crisis', highlight: true }
  ];

  const handleNavClick = (item, e) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (onSelectTab) {
      onSelectTab(item.id);
    }
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', item.path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAuthClick = (path, e) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (typeof window !== 'undefined') {
      window.location.href = path;
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FAF7F2]/90 backdrop-blur-md shadow-[0_2px_16px_rgba(1,22,39,0.04)] border-b border-[#E7DECF]/70'
          : 'bg-[#FAF7F2]/60 backdrop-blur-[2px] border-b border-[#E7DECF]/40'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-20 sm:h-22 flex items-center justify-between">
        
        {/* Brand Logo */}
        <a
          href="/"
          onClick={(e) => handleNavClick({ id: 'home', path: '/' }, e)}
          className="flex items-center gap-3 group text-left cursor-pointer"
        >
          {/* Logo Mark */}
          <div className="w-8 h-8 sm:w-9 sm:h-9 flex-shrink-0 transition-transform group-hover:scale-105">
            <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <path
                d="M32,34 C32,28 27,24 22,26 C16,28 15,36 20,40 C25,44 33,42 35,35 C37,27 30,20 22,21"
                stroke="#1E2A2E"
                strokeWidth="3.2"
                strokeLinecap="round"
              />
              <line x1="22" y1="21" x2="18" y2="10" stroke="#1E2A2E" strokeWidth="3.2" strokeLinecap="round" />
              <circle cx="16" cy="7" r="5" fill="#795663" />
              <line x1="35" y1="35" x2="46" y2="30" stroke="#1E2A2E" strokeWidth="3.2" strokeLinecap="round" />
              <circle cx="49" cy="28" r="5" fill="#8AA688" />
              <line x1="20" y1="40" x2="14" y2="50" stroke="#1E2A2E" strokeWidth="3.2" strokeLinecap="round" />
              <circle cx="11" cy="53" r="5" fill="#BFCAD7" />
            </svg>
          </div>

          <div>
            <div className="font-editorial text-[21px] sm:text-[23px] text-[#162723] tracking-tight leading-none">
              ingress within
            </div>
            <div className="font-mono-code text-[8.5px] sm:text-[9px] tracking-[0.16em] uppercase text-[#7D8E87] mt-1">
              UNDERSTAND · GROW · CONTINUE
            </div>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-[13.5px]">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <a
                key={item.id}
                href={item.path}
                onClick={(e) => handleNavClick(item, e)}
                className={`relative py-2 font-medium transition-colors cursor-pointer ${
                  item.highlight
                    ? 'text-[#9A4232] hover:text-[#7A2F22] font-semibold'
                    : isActive
                    ? 'text-[#162723] font-semibold'
                    : 'text-[#4F635E] hover:text-[#162723]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#162723]" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Desktop CTA / Login Buttons */}
        <div className="hidden sm:flex items-center gap-4">
          <a
            href="/login"
            onClick={(e) => handleAuthClick('/login', e)}
            className="text-xs sm:text-[13px] font-medium text-[#4F635E] hover:text-[#162723] px-3 py-2 transition-colors cursor-pointer"
          >
            Log in
          </a>
          <a
            href="/login"
            onClick={(e) => handleAuthClick('/login', e)}
            className="inline-flex items-center gap-1.5 bg-[#162723] hover:bg-[#203631] text-[#FAF7F2] text-xs sm:text-[13px] font-medium px-5 py-2.5 rounded-full shadow-sm hover:shadow transition-all hover:scale-[1.02] cursor-pointer"
          >
            <span>Get Started</span>
            <span className="text-[14px]">→</span>
          </a>
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="flex items-center gap-2 sm:hidden">
          <a
            href="/login"
            onClick={(e) => handleAuthClick('/login', e)}
            className="inline-flex items-center text-xs font-semibold bg-[#162723] text-white px-3.5 py-1.5 rounded-full"
          >
            Log in
          </a>
          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#162723] hover:bg-black/5 rounded-lg transition-colors"
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <span className={`w-full h-0.5 bg-[#162723] rounded-full transition-transform ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
              <span className={`w-full h-0.5 bg-[#162723] rounded-full transition-opacity ${mobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`w-full h-0.5 bg-[#162723] rounded-full transition-transform ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>

      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#FAF7F2] border-b border-[#E7DECF] px-6 py-6 space-y-3 shadow-lg animate-fadeDown">
          <div className="space-y-1">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.path}
                onClick={(e) => handleNavClick(item, e)}
                className={`block py-2 text-sm ${
                  activeTab === item.id ? 'font-bold text-[#162723]' : 'text-[#4F635E]'
                } ${item.highlight ? 'text-[#9A4232]' : ''}`}
              >
                {item.label}
              </a>
            ))}
          </div>
          <div className="pt-4 border-t border-[#E7DECF] flex flex-col gap-2">
            <a
              href="/login"
              onClick={(e) => handleAuthClick('/login', e)}
              className="w-full text-center py-2.5 text-xs font-semibold text-white bg-[#162723] rounded-full"
            >
              Get Started →
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
