import { useState, useEffect } from 'react';

/**
 * Editorial Navbar matching the screenshot visual design.
 * Features dynamic translucent glass styling that adapts to its background:
 * When scrolling over dark navy/blue bands ([data-dark-section="true"] or footer),
 * it turns into a rich frosty deep blue with glowing legible light accents.
 */
export default function EditorialNavbar({ user, profile, activeTab = 'home', onSelectTab }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOnBlue, setIsOnBlue] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let lastScrolled = typeof window !== 'undefined' ? window.scrollY > 20 : false;
    setIsScrolled(lastScrolled);

    const handleScroll = () => {
      const currentScrolled = window.scrollY > 20;
      if (currentScrolled !== lastScrolled) {
        lastScrolled = currentScrolled;
        setIsScrolled(currentScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Use IntersectionObserver to track dark sections & footer without layout thrashing
    let observer = null;
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
        const navHeight = 88;
        const activeIntersections = new Set();

        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                activeIntersections.add(entry.target);
              } else {
                activeIntersections.delete(entry.target);
              }
            });
            setIsOnBlue(activeIntersections.size > 0);
          },
          {
            rootMargin: `0px 0px -${Math.max(window.innerHeight - navHeight, 100)}px 0px`,
            threshold: 0
          }
        );

        const darkElements = document.querySelectorAll('[data-dark-section="true"], footer');
        darkElements.forEach((el) => observer.observe(el));
      }
    }, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
      if (observer) observer.disconnect();
    };
  }, [activeTab]);

  const navItems = [
    { id: 'solution', label: 'Our Solution', path: '/solution' },
    { id: 'therapy', label: 'Therapy', path: '/therapy', isTherapy: true },
    { id: 'how', label: 'How It Works', path: '/how-it-works' },
    { id: 'pricing', label: 'Pricing', path: '/pricing' },
    { id: 'ai', label: 'AI & Data', path: '/ai-data' },
    { id: 'evidence', label: 'Evidence', path: '/evidence' },
    { id: 'about', label: 'About', path: '/about' },
    { id: 'crisis', label: 'In Crisis?', path: '/crisis', highlight: true }
  ];

  const handleNavClick = (item, e) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (item.id === 'therapy' || item.path === '/therapy') {
      if (typeof window !== 'undefined') {
        if (window.navigateTo) window.navigateTo('/therapy');
        else window.location.href = '/therapy';
      }
      return;
    }
    if (onSelectTab) {
      onSelectTab(item.id);
    } else if (typeof window !== 'undefined') {
      window.history.pushState({}, '', item.path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAuthClick = (path, e) => {
    if (e) e.preventDefault();
    setMobileMenuOpen(false);
    const destination = user
      ? (profile && !profile.onboarding_completed ? '/onboarding' : '/dashboard')
      : (path || '/login');
    if (typeof window !== 'undefined') {
      if (window.navigateTo) {
        window.navigateTo(destination);
      } else {
        window.location.href = destination;
      }
    }
  };

  return (
    <header
      style={{
        background: isOnBlue
          ? 'linear-gradient(to bottom, rgba(1, 22, 39, 0.92) 0%, rgba(1, 22, 39, 0.85) 100%)'
          : isScrolled
          ? 'linear-gradient(to bottom, rgba(246, 241, 234, 0.94) 0%, rgba(246, 241, 234, 0.88) 100%)'
          : 'linear-gradient(to bottom, rgba(246, 241, 234, 0.82) 0%, rgba(246, 241, 234, 0.60) 100%)',
        backdropFilter: isOnBlue ? 'blur(16px) saturate(160%)' : 'blur(14px) saturate(140%)',
        WebkitBackdropFilter: isOnBlue ? 'blur(16px) saturate(160%)' : 'blur(14px) saturate(140%)',
        border: 'none',
        borderBottom: isOnBlue
          ? '1px solid rgba(255, 255, 255, 0.08)'
          : isScrolled
          ? '1px solid rgba(22, 39, 35, 0.08)'
          : '1px solid rgba(22, 39, 35, 0.05)',
        boxShadow: isOnBlue
          ? '0 10px 30px -10px rgba(0, 0, 0, 0.45)'
          : isScrolled
          ? '0 10px 30px -10px rgba(22, 39, 35, 0.04)'
          : 'none',
        transform: 'translate3d(0, 0, 0)',
        transition: 'background 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease'
      }}
      className="sticky top-0 z-50 w-full"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 h-16 sm:h-[68px] flex items-center justify-between gap-4">
        
        {/* Brand Logo: Clean, proportional editorial emblem */}
        <a
          href="/"
          onClick={(e) => handleNavClick({ id: 'home', path: '/' }, e)}
          className="flex items-center gap-2.5 group text-left cursor-pointer select-none py-0.5 shrink-0"
        >
          {/* Logo Mark */}
          <img
            src={isOnBlue ? "/logo-mark-light.png" : "/logo-mark-transparent.png"}
            alt="Ingress Within"
            className="w-7 h-7 sm:w-8 sm:h-8 object-contain flex-shrink-0 transition-transform duration-200 group-hover:scale-105"
          />

          {/* Wordmark + Tagline Combined Block */}
          <div className="flex flex-col justify-center">
            <div
              className={`font-editorial text-base sm:text-[18px] tracking-tight leading-none transition-colors duration-200 ${
                isOnBlue ? 'text-white' : 'text-[#162723]'
              }`}
            >
              Ingress{' '}
              <span
                className={`font-medium transition-colors duration-200 ${
                  isOnBlue ? 'text-[#E8A598]' : 'text-[#795663]'
                }`}
              >
                Within
              </span>
            </div>
            <div
              className={`font-mono-code text-[7px] sm:text-[7.5px] tracking-[0.14em] uppercase transition-colors duration-200 mt-1 leading-none ${
                isOnBlue ? 'text-[#9AAAB8]' : 'text-[#7D8E87]'
              }`}
            >
              Understand · Grow · Continue
            </div>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-3.5 xl:gap-5 2xl:gap-6 text-[12.5px] xl:text-[13px]">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <a
                key={item.id}
                href={item.path}
                onClick={(e) => handleNavClick(item, e)}
                className={`relative py-1.5 whitespace-nowrap transition-colors duration-200 cursor-pointer ${
                  item.highlight
                    ? isOnBlue
                      ? 'text-[#FF8A7A] hover:text-[#FFA092] font-semibold'
                      : 'text-[#9A4232] hover:text-[#7A2F22] font-semibold'
                    : item.isTherapy
                    ? isOnBlue
                      ? 'text-[#E8A598] hover:text-white font-semibold'
                      : 'text-[#795663] hover:text-[#162723] font-semibold'
                    : isActive
                    ? isOnBlue
                      ? 'text-white font-semibold'
                      : 'text-[#162723] font-semibold'
                    : isOnBlue
                    ? 'text-[#C2D1DE] hover:text-white font-normal'
                    : 'text-[#4F635E] hover:text-[#162723] font-normal'
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
                      isOnBlue ? 'bg-white' : 'bg-[#162723]'
                    }`}
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Desktop CTA / Login Buttons */}
        <div className="hidden sm:flex items-center gap-2.5 shrink-0">
          {user ? (
            <a
              href="/dashboard"
              onClick={(e) => handleAuthClick('/dashboard', e)}
              className={`inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-medium px-4 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-2xs hover:shadow-xs transition-all duration-200 hover:scale-[1.01] cursor-pointer whitespace-nowrap ${
                isOnBlue
                  ? 'bg-white hover:bg-[#FAF7F2] text-[#011627]'
                  : 'bg-[#162723] hover:bg-[#203631] text-[#FAF7F2]'
              }`}
            >
              <span>Dashboard</span>
              <span className="text-[13px]">→</span>
            </a>
          ) : (
            <>
              <a
                href="/login"
                onClick={(e) => handleAuthClick('/login', e)}
                className={`text-xs sm:text-[13px] font-medium px-2.5 py-1.5 transition-colors duration-200 cursor-pointer whitespace-nowrap ${
                  isOnBlue
                    ? 'text-[#C2D1DE] hover:text-white'
                    : 'text-[#4F635E] hover:text-[#162723]'
                }`}
              >
                Log in
              </a>
              <a
                href="/login"
                onClick={(e) => handleAuthClick('/login', e)}
                className={`inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-medium px-4 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-2xs hover:shadow-xs transition-all duration-200 hover:scale-[1.01] cursor-pointer whitespace-nowrap ${
                  isOnBlue
                    ? 'bg-white hover:bg-[#FAF7F2] text-[#011627]'
                    : 'bg-[#162723] hover:bg-[#203631] text-[#FAF7F2]'
                }`}
              >
                <span>Get Started</span>
                <span className="text-[13px]">→</span>
              </a>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="flex items-center gap-2 sm:hidden">
          <a
            href="/therapy"
            onClick={(e) => {
              e.preventDefault();
              if (typeof window !== 'undefined') {
                if (window.navigateTo) window.navigateTo('/therapy');
                else window.location.href = '/therapy';
              }
            }}
            className={`inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors duration-300 ${
              isOnBlue
                ? 'border-[#E8A598]/60 text-[#E8A598]'
                : 'border-[#795663]/50 text-[#795663]'
            }`}
          >
            Therapy
          </a>
          <a
            href={user ? '/dashboard' : '/login'}
            onClick={(e) => handleAuthClick(user ? '/dashboard' : '/login', e)}
            className={`inline-flex items-center text-xs font-semibold px-3.5 py-1.5 rounded-full transition-colors duration-300 ${
              isOnBlue
                ? 'bg-white text-[#011627]'
                : 'bg-[#162723] text-white'
            }`}
          >
            {user ? 'Dashboard' : 'Log in'}
          </a>
          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded-lg transition-colors ${
              isOnBlue ? 'text-white hover:bg-white/10' : 'text-[#162723] hover:bg-black/5'
            }`}
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <span
                className={`w-full h-0.5 rounded-full transition-all ${
                  isOnBlue ? 'bg-white' : 'bg-[#162723]'
                } ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}
              />
              <span
                className={`w-full h-0.5 rounded-full transition-all ${
                  isOnBlue ? 'bg-white' : 'bg-[#162723]'
                } ${mobileMenuOpen ? 'opacity-0' : ''}`}
              />
              <span
                className={`w-full h-0.5 rounded-full transition-all ${
                  isOnBlue ? 'bg-white' : 'bg-[#162723]'
                } ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}
              />
            </div>
          </button>
        </div>

      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: isOnBlue ? 'rgba(1, 22, 39, 0.96)' : 'rgba(253, 251, 248, 0.95)',
            backdropFilter: 'blur(36px) saturate(200%)',
            WebkitBackdropFilter: 'blur(36px) saturate(200%)',
          }}
          className={`sm:hidden px-6 py-5 space-y-4 shadow-[0_16px_36px_rgba(22,39,35,0.06)] animate-fadeDown border-b ${
            isOnBlue ? 'text-white border-white/10' : 'text-[#162723] border-[#E7DECF]/40'
          }`}
        >
          <div className={`pb-3 border-b ${isOnBlue ? 'border-white/10' : 'border-[#E7DECF]/40'}`}>
            <div className="flex items-center gap-2.5">
              <img
                src={isOnBlue ? "/logo-mark-light.png" : "/logo-mark-transparent.png"}
                alt="Ingress Within"
                className="w-7 h-7 sm:w-8 sm:h-8 object-contain flex-shrink-0"
              />
              <div className="flex flex-col justify-center">
                <div className={`font-editorial text-base leading-none ${isOnBlue ? 'text-white' : 'text-[#162723]'}`}>
                  Ingress{' '}
                  <span className={`font-medium ${isOnBlue ? 'text-[#E8A598]' : 'text-[#795663]'}`}>
                    Within
                  </span>
                </div>
                <div
                  className={`font-mono-code text-[7px] tracking-[0.14em] uppercase mt-0.5 leading-none ${
                    isOnBlue ? 'text-[#9AAAB8]' : 'text-[#7D8E87]'
                  }`}
                >
                  Understand · Grow · Continue
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-1">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.path}
                onClick={(e) => handleNavClick(item, e)}
                className={`block py-2 text-sm ${
                  activeTab === item.id
                    ? isOnBlue
                      ? 'font-bold text-white'
                      : 'font-bold text-[#162723]'
                    : isOnBlue
                    ? 'text-[#C2D1DE]'
                    : 'text-[#4F635E]'
                } ${item.highlight ? (isOnBlue ? 'text-[#FF8A7A]' : 'text-[#9A4232]') : ''}`}
              >
                {item.label}
              </a>
            ))}
          </div>
          <div className={`pt-4 border-t flex flex-col gap-2 ${isOnBlue ? 'border-white/10' : 'border-[#E7DECF]'}`}>
            <a
              href="/therapy"
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                if (typeof window !== 'undefined') {
                  if (window.navigateTo) window.navigateTo('/therapy');
                  else window.location.href = '/therapy';
                }
              }}
              className={`w-full text-center py-2.5 text-xs font-semibold rounded-full border transition-colors ${
                isOnBlue ? 'border-[#E8A598]/60 text-[#E8A598] hover:bg-white/5' : 'border-[#795663]/40 text-[#795663] hover:bg-[#795663]/5'
              }`}
            >
              Start with a Therapist →
            </a>
            <a
              href={user ? '/dashboard' : '/login'}
              onClick={(e) => handleAuthClick(user ? '/dashboard' : '/login', e)}
              className={`w-full text-center py-2.5 text-xs font-semibold rounded-full ${
                isOnBlue ? 'bg-white text-[#011627]' : 'text-white bg-[#162723]'
              }`}
            >
              {user ? 'Go to Dashboard →' : 'Get Started →'}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
