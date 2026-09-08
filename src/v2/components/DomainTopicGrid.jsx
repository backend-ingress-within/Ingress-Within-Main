import React from 'react';
import { V2_DOMAINS } from '../data/v2Content';

export default function DomainTopicGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {V2_DOMAINS.map((domain) => (
        <div
          key={domain.id}
          className="p-6 rounded-2xl bg-white border border-[#E7E0D3] space-y-3 hover:border-[#1E3633] transition-all hover:shadow-xs group"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-semibold text-[#758D7E]">
              {domain.number}
            </span>
            <span className="font-mono text-[10px] tracking-wider text-[#8E9E98] uppercase">
              {domain.subtitle}
            </span>
          </div>
          <h4 className="text-xl font-serif text-[#1A2421] font-semibold">
            {domain.title}
          </h4>
          <p className="text-xs sm:text-sm text-[#5E706A] leading-relaxed">
            {domain.desc}
          </p>
        </div>
      ))}
    </div>
  );
}
