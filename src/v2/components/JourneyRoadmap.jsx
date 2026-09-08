import React from 'react';
import { V2_JOURNEY_STAGES } from '../data/v2Content';

export default function JourneyRoadmap() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 relative">
        {V2_JOURNEY_STAGES.map((stage, idx) => (
          <div
            key={stage.step}
            className="flex flex-col items-center text-center p-4 rounded-xl bg-white/60 border border-[#E7E0D3] relative group hover:border-[#758D7E] transition-all hover:bg-white"
          >
            <span className="font-mono text-xs font-semibold text-[#758D7E] mb-1">
              {stage.step}
            </span>
            <h4 className="font-serif text-base font-semibold text-[#1A2421] mb-1">
              {stage.title}
            </h4>
            <p className="text-[11px] text-[#6A7E77] leading-relaxed">
              {stage.subtitle}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
