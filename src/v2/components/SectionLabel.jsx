import React from 'react';

export default function SectionLabel({ text, number, align = 'center', className = '' }) {
  const alignmentClass = align === 'left' ? 'justify-start' : align === 'right' ? 'justify-end' : 'justify-center';
  
  return (
    <div className={`flex items-center gap-2 ${alignmentClass} ${className}`}>
      {number && (
        <span className="font-mono text-[11px] font-semibold tracking-wider text-[#758D7E] uppercase">
          {number}
        </span>
      )}
      {number && <span className="w-1 h-1 rounded-full bg-[#758D7E]/50" />}
      <span className="font-mono text-[11px] font-semibold tracking-[0.18em] text-[#5E706A] uppercase">
        {text}
      </span>
    </div>
  );
}
