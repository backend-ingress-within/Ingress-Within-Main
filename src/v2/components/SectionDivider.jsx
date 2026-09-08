import React from 'react';

export default function SectionDivider({ number, label, className = '' }) {
  return (
    <div className={`w-full max-w-5xl mx-auto px-4 py-8 flex items-center justify-between relative ${className}`}>
      <div className="flex-1 h-px bg-[#E7E0D3]" />
      
      {(number || label) && (
        <div className="px-4 flex items-center gap-2.5">
          {number && (
            <span className="w-6 h-6 rounded-full border border-[#D5CDBC] text-[#5E706A] font-mono text-[11px] font-medium flex items-center justify-center bg-[#FAF8F5]">
              {number}
            </span>
          )}
          {label && (
            <span className="font-mono text-[10.5px] tracking-[0.16em] uppercase text-[#7D8E87] font-semibold">
              {label}
            </span>
          )}
        </div>
      )}
      
      <div className="flex-1 h-px bg-[#E7E0D3]" />
    </div>
  );
}
