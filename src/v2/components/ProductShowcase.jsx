import React from 'react';
import { Sparkles } from 'lucide-react';

export default function ProductShowcase() {
  return (
    <div className="space-y-16 py-8">
      {/* Feature 1: Guided Reflection */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-6 space-y-4">
          <span className="font-mono text-xs font-semibold text-[#758D7E] uppercase tracking-wider">
            01 · STRUCTURED INQUIRY
          </span>
          <h3 className="text-2xl sm:text-3xl font-serif text-[#1A2421] leading-snug">
            Five prompts so you are never staring at a blank screen.
          </h3>
          <p className="text-sm text-[#5E706A] leading-relaxed">
            Free-flow writing can easily slip into recounting logistical tasks or looping in rumination. Our 5-prompt sequence gently guides you through what happened, why it carried emotional weight, how your body reacted, and what a compassionate friend would say.
          </p>
        </div>
        <div className="lg:col-span-6 p-6 rounded-2xl bg-white border border-[#E7E0D3] shadow-sm space-y-3">
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#EAE4D7]">
              <span className="font-mono text-[#758D7E] font-bold">1. Context:</span> What happened today?
            </div>
            <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#EAE4D7]">
              <span className="font-mono text-[#758D7E] font-bold">2. Significance:</span> Why did it affect you?
            </div>
            <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#EAE4D7]">
              <span className="font-mono text-[#758D7E] font-bold">3. Reaction:</span> How did you respond?
            </div>
            <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#EAE4D7]">
              <span className="font-mono text-[#758D7E] font-bold">4. Somatic:</span> Where did your body hold tension?
            </div>
            <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#EAE4D7]">
              <span className="font-mono text-[#758D7E] font-bold">5. Compassion:</span> What perspective would you offer a loved one?
            </div>
          </div>
        </div>
      </div>

      {/* Feature 2: Longitudinal Pattern Recognition */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-6 order-2 lg:order-1 p-6 rounded-2xl bg-white border border-[#E7E0D3] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#F0ECE1] pb-3">
            <span className="text-xs font-semibold text-[#1A2421]">Monthly Pattern Summary</span>
            <span className="text-[10px] font-mono text-[#758D7E]">Week 4 Analysis</span>
          </div>
          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E7E0D3] space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EBF1ED] text-[#1E3633] text-[11px] font-medium">
              <Sparkles className="w-3 h-3" /> Core Recurring Script
            </div>
            <h5 className="font-serif text-sm font-semibold text-[#1A2421]">
              Agreeing under pressure, followed by silent exhaustion.
            </h5>
            <p className="text-xs text-[#5E706A] leading-relaxed">
              Observed in 4 of your last 6 workplace entries. Triggered when requests are framed as urgent favors.
            </p>
          </div>
        </div>
        <div className="lg:col-span-6 order-1 lg:order-2 space-y-4">
          <span className="font-mono text-xs font-semibold text-[#B69186] uppercase tracking-wider">
            02 · LONGITUDINAL INSIGHTS
          </span>
          <h3 className="text-2xl sm:text-3xl font-serif text-[#1A2421] leading-snug">
            Connecting what repeats across weeks, not just today.
          </h3>
          <p className="text-sm text-[#5E706A] leading-relaxed">
            Individual entries are like single frames in a film. Ingress Within synthesizes weekly and monthly reports, surfacing the recurring situations, implicit rules, and emotional vocabulary you rely on when stress arrives.
          </p>
        </div>
      </div>
    </div>
  );
}
