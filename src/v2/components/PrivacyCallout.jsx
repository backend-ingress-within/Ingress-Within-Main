import React from 'react';
import { Lock, ArrowRight } from 'lucide-react';

export default function PrivacyCallout() {
  const handleNavClick = (path, e) => {
    if (typeof window !== 'undefined' && window.navigateTo && path.startsWith('/')) {
      e.preventDefault();
      window.navigateTo(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-12 p-8 sm:p-10 rounded-2xl bg-[#FAF8F5] border border-[#E7E0D3] shadow-xs relative overflow-hidden text-center space-y-4">
      <div className="w-12 h-12 rounded-full bg-[#EBF1ED] text-[#1E3633] flex items-center justify-center mx-auto">
        <Lock className="w-5 h-5" />
      </div>
      <h3 className="text-xl sm:text-2xl font-serif text-[#1A2421] max-w-lg mx-auto">
        "Some things are easier to understand when they have space to remain yours."
      </h3>
      <p className="text-xs sm:text-sm text-[#5E706A] max-w-md mx-auto leading-relaxed">
        Ingress Within is designed around uncompromising personal privacy. Your reflections are never shared with employers, family, or advertising trackers.
      </p>
      <div className="pt-2">
        <a
          href="/v2/ai-data"
          onClick={(e) => handleNavClick('/v2/ai-data', e)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1E3633] hover:underline cursor-pointer"
        >
          Learn about our AI and data philosophy <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
