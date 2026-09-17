import React from 'react';

/**
 * Editorial Dark Ink Footer matching source HTML content.
 */
export default function PublicFooter({ onSelectTab, onOpenPolicy }) {
  const handleNav = (tabId, e) => {
    e.preventDefault();
    if (onSelectTab) onSelectTab(tabId);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePolicy = (policyKey, e) => {
    e.preventDefault();
    if (onOpenPolicy) onOpenPolicy(policyKey);
    else if (onSelectTab) onSelectTab('policies');
  };

  return (
    <footer className="bg-[#011627] text-[#DCE2E7] py-16 sm:py-20 px-5 sm:px-8 border-t border-[#1E2A2E]">
      <div className="max-w-6xl mx-auto">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 sm:gap-12 pb-14 border-b border-white/10">
          
          {/* Brand Info */}
          <div className="space-y-3 md:pr-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 flex-shrink-0">
                <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <path
                    d="M32,34 C32,28 27,24 22,26 C16,28 15,36 20,40 C25,44 33,42 35,35 C37,27 30,20 22,21"
                    stroke="#DCE2E7"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                  />
                  <line x1="22" y1="21" x2="18" y2="10" stroke="#DCE2E7" strokeWidth="3.2" strokeLinecap="round" />
                  <circle cx="16" cy="7" r="5" fill="#D9BCAF" />
                  <line x1="35" y1="35" x2="46" y2="30" stroke="#DCE2E7" strokeWidth="3.2" strokeLinecap="round" />
                  <circle cx="49" cy="28" r="5" fill="#8AA688" />
                  <line x1="20" y1="40" x2="14" y2="50" stroke="#DCE2E7" strokeWidth="3.2" strokeLinecap="round" />
                  <circle cx="11" cy="53" r="5" fill="#BFCAD7" />
                </svg>
              </div>
              <span className="font-editorial italic text-xl text-white">Ingress Within</span>
            </div>
            <p className="font-zen text-xs text-[#8D98A3] leading-relaxed">
              Understand. Grow. Continue.
            </p>
            <p className="font-zen text-xs text-[#8D98A3] leading-relaxed pt-1">
              One platform for different ways of working on your mental health.
            </p>
          </div>

          {/* Explore Links */}
          <div className="space-y-3">
            <div className="font-editorial italic text-sm text-white font-medium">Explore</div>
            <ul className="space-y-2 text-xs font-zen text-[#8D98A3]">
              <li>
                <a href="/solution" onClick={(e) => handleNav('solution', e)} className="hover:text-white transition-colors">
                  Our solution
                </a>
              </li>
              <li>
                <a href="/how-it-works" onClick={(e) => handleNav('how', e)} className="hover:text-white transition-colors">
                  How it works
                </a>
              </li>
              <li>
                <a href="/pricing" onClick={(e) => handleNav('pricing', e)} className="hover:text-white transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="/start" onClick={(e) => handleNav('start', e)} className="hover:text-white transition-colors">
                  Start here
                </a>
              </li>
            </ul>
          </div>

          {/* Trust & Safety Links */}
          <div className="space-y-3">
            <div className="font-editorial italic text-sm text-white font-medium">Trust</div>
            <ul className="space-y-2 text-xs font-zen text-[#8D98A3]">
              <li>
                <a href="/ai-data" onClick={(e) => handleNav('ai', e)} className="hover:text-white transition-colors">
                  AI & data
                </a>
              </li>
              <li>
                <a href="/evidence" onClick={(e) => handleNav('evidence', e)} className="hover:text-white transition-colors">
                  Evidence & research
                </a>
              </li>
              <li>
                <a href="/about" onClick={(e) => handleNav('about', e)} className="hover:text-white transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="/crisis" onClick={(e) => handleNav('crisis', e)} className="hover:text-[#E0A898] transition-colors font-medium">
                  In crisis right now?
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-3">
            <div className="font-editorial italic text-sm text-white font-medium">Legal</div>
            <ul className="space-y-2 text-xs font-zen text-[#8D98A3]">
              <li>
                <button type="button" onClick={(e) => handlePolicy('privacy', e)} className="text-left text-xs text-[#8D98A3] hover:text-white transition-colors cursor-pointer">
                  Privacy policy
                </button>
              </li>
              <li>
                <button type="button" onClick={(e) => handlePolicy('terms', e)} className="text-left text-xs text-[#8D98A3] hover:text-white transition-colors cursor-pointer">
                  Terms of use
                </button>
              </li>
              <li>
                <button type="button" onClick={(e) => handlePolicy('cancellation', e)} className="text-left text-xs text-[#8D98A3] hover:text-white transition-colors cursor-pointer">
                  Refund & cancellation policy
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono-code text-[#606E7A] gap-4">
          <div>
            © {new Date().getFullYear()} Ingress Within. All rights reserved.
          </div>
          <div className="text-center sm:text-right text-[10.5px]">
            Designed for India · Non-clinical inquiry & structured psychological reflection
          </div>
        </div>

      </div>
    </footer>
  );
}
