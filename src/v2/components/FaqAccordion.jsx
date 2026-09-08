import React, { useState } from 'react';
import { V2_FAQS } from '../data/v2Content';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function FaqAccordion({ items = V2_FAQS }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={idx}
            className="rounded-2xl border border-[#E7E0D3] bg-white overflow-hidden transition-all shadow-2xs"
          >
            <button
              onClick={() => setOpenIndex(isOpen ? -1 : idx)}
              className="w-full p-6 text-left flex items-center justify-between gap-4 hover:bg-[#FAF8F5] transition-colors cursor-pointer"
            >
              <h4 className="font-serif text-base sm:text-lg font-medium text-[#1A2421]">
                {item.q}
              </h4>
              <span className="text-[#5E706A] p-1 rounded-full border border-[#E7E0D3]">
                {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </span>
            </button>
            {isOpen && (
              <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-[#5E706A] leading-relaxed border-t border-[#F0ECE1] font-sans">
                {item.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
