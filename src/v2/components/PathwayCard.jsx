import React from 'react';
import { ArrowRight, User, Users, RefreshCw } from 'lucide-react';

export default function PathwayCard({ pathway }) {
  const handleNavClick = (path, e) => {
    if (typeof window !== 'undefined' && window.navigateTo && path.startsWith('/')) {
      e.preventDefault();
      window.navigateTo(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderIcon = () => {
    if (pathway.step === '01') return <User className="w-5 h-5 text-[#1E3633]" />;
    if (pathway.step === '02') return <Users className="w-5 h-5 text-[#B69186]" />;
    return <RefreshCw className="w-5 h-5 text-[#8FA0AF]" />;
  };

  return (
    <div className="bg-white rounded-2xl p-8 border border-[#E7E0D3] shadow-xs flex flex-col justify-between space-y-6 group hover:border-[#1E3633] transition-all hover:shadow-md">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center shadow-2xs"
            style={{ backgroundColor: pathway.accentSoft }}
          >
            {renderIcon()}
          </div>
          <span className="font-mono text-[11px] font-semibold text-[#7D8E87] uppercase">
            {pathway.step}
          </span>
        </div>

        <div className="space-y-1">
          <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#758D7E] font-semibold">
            {pathway.category}
          </span>
          <h3 className="text-xl font-serif font-semibold text-[#1A2421] tracking-tight">
            {pathway.title}
          </h3>
        </div>

        <p className="text-sm text-[#5E706A] leading-relaxed font-sans">
          {pathway.description}
        </p>
      </div>

      <div className="pt-4 border-t border-[#F0ECE1]">
        <a
          href={pathway.path}
          onClick={(e) => handleNavClick(pathway.path, e)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1E3633] group-hover:translate-x-1 transition-transform cursor-pointer"
        >
          {pathway.linkText} <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
