import React from 'react';

export default function TableOfContents({ sections = [] }) {
  const scrollTo = (heading) => {
    const id = heading.toLowerCase().replace(/[^\w]+/g, '-');
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  if (!sections || sections.length === 0) return null;

  return (
    <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E7E0D3] space-y-3">
      <span className="font-mono text-[10.5px] uppercase tracking-wider text-[#758D7E] font-semibold block">
        Table of Contents
      </span>
      <ul className="space-y-2 text-xs">
        {sections.map((sec, idx) => (
          <li key={idx}>
            <button
              onClick={() => scrollTo(sec.heading)}
              className="text-[#5E706A] hover:text-[#1E3633] text-left transition-colors cursor-pointer"
            >
              {idx + 1}. {sec.heading}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
