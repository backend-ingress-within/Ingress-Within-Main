import React from 'react';

export default function StartingPointCard({ item }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-[#E7E0D3] shadow-xs flex flex-col justify-between space-y-4 hover:border-[#758D7E] transition-all hover:-translate-y-1">
      <div className="flex items-center gap-2">
        <span
          className="w-3 h-3 rounded-full border border-black/10"
          style={{ backgroundColor: item.color }}
        />
        <span className="font-mono text-[10.5px] uppercase tracking-wider text-[#758D7E] font-semibold">
          {item.theme}
        </span>
      </div>
      <p className="font-serif italic text-base sm:text-lg text-[#1A2421] leading-snug">
        "{item.quote}"
      </p>
    </div>
  );
}
