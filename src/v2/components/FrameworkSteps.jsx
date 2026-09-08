import React from 'react';
import { V2_FRAMEWORK_STEPS } from '../data/v2Content';

export default function FrameworkSteps() {
  return (
    <div className="w-full max-w-5xl mx-auto py-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
        {V2_FRAMEWORK_STEPS.map((step, idx) => (
          <div
            key={step.number}
            className="p-6 rounded-2xl bg-white border border-[#E7E0D3] shadow-xs flex flex-col justify-between space-y-4 relative"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-[#758D7E]">
                  STAGE {step.number}
                </span>
                <span className="font-mono text-[10px] tracking-wider uppercase text-[#8E9E98]">
                  {step.stage}
                </span>
              </div>
              <h4 className="font-serif text-lg font-semibold text-[#1A2421]">
                {step.headline}
              </h4>
            </div>
            <p className="text-xs text-[#5E706A] leading-relaxed font-sans">
              {step.detail}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
