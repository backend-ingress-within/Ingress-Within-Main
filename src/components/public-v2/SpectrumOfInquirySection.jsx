import React from 'react';

/**
 * Section 04 · The Spectrum of Inquiry
 * Recreates media_1789581839978.jpg with high visual fidelity:
 * Six pinned paper notes with brass rivets, washi tape, organic copper string connections,
 * subtle paper rotations, and handwritten annotations in Kalam font.
 */
export default function SpectrumOfInquirySection() {
  const swatches = [
    {
      id: 'thoughts',
      number: '01',
      category: 'COGNITIVE OBSERVATION',
      title: 'Thoughts',
      description:
        'Notice what repeatedly occupies your mind, the assumptions you make under uncertainty, and the narratives you tell yourself.',
      bgColor: 'bg-[#FDFBF8]',
      borderColor: 'border-[#E3D9CC]',
      rotation: '-rotate-1',
      annotation: 'What am I telling myself?',
      annotationPos: 'left',
      arrow: '↳'
    },
    {
      id: 'emotions',
      number: '02',
      category: 'GRANULAR REGISTRATION',
      title: 'Emotions',
      description:
        'Explore the nuance behind how experiences affect you. Move beyond simple labels toward exact emotional vocabulary.',
      bgColor: 'bg-[#F9ECE7]',
      borderColor: 'border-[#E2CECA]',
      rotation: 'rotate-[0.5deg]',
      annotation: 'Feel it to understand it.',
      annotationPos: 'top'
    },
    {
      id: 'reactions',
      number: '03',
      category: 'BEHAVIORAL TRIGGERS',
      title: 'Reactions',
      description:
        'Understand how you instinctively respond in high-friction, conflict, or vulnerable moments before automatic habits take over.',
      bgColor: 'bg-[#EBF1F5]',
      borderColor: 'border-[#CAD7DF]',
      rotation: '-rotate-[0.5deg]',
      annotation: 'What sets this off?',
      annotationPos: 'right',
      arrow: '↵'
    },
    {
      id: 'patterns',
      number: '04',
      category: 'THEMATIC CONNECTIONS',
      title: 'Patterns',
      description:
        'See the recurring loops that connect disparate events across weeks and months, revealing unseen behavioral costs.',
      bgColor: 'bg-[#EBF3EC]',
      borderColor: 'border-[#CADCCA]',
      rotation: 'rotate-[0.8deg]',
      annotation: 'A bigger picture emerges.',
      annotationPos: 'left',
      arrow: '↳',
      hasTape: true
    },
    {
      id: 'values',
      number: '05',
      category: 'INTERNAL COMPASS',
      title: 'Values',
      description:
        'Clarify what genuinely matters to you and distinguish authentic principles from inherited obligations or social expectations.',
      bgColor: 'bg-[#FBF8EF]',
      borderColor: 'border-[#E6DFCD]',
      rotation: '-rotate-[0.75deg]',
      annotation: 'What do I want this to be about?',
      annotationPos: 'bottom',
      annotationEncircled: true
    },
    {
      id: 'self-understanding',
      number: '06',
      category: 'INTEGRATED WISDOM',
      title: 'Self-Understanding',
      description:
        'Bring these observations together over time into a calm, coherent sense of identity that withstands daily volatility.',
      bgColor: 'bg-[#F2EDF7]',
      borderColor: 'border-[#D9CFE3]',
      rotation: 'rotate-1',
      annotation: 'A calmer, clearer me.',
      annotationPos: 'right',
      arrow: '↵',
      hasTape: true
    }
  ];

  return (
    <section className="relative py-24 md:py-32 px-4 sm:px-8 overflow-hidden bg-[#FAF7F2]/80">
      <div className="max-w-6xl mx-auto text-center space-y-4">
        
        {/* Eyebrow */}
        <div className="font-mono-code text-[10.5px] sm:text-[11px] tracking-[0.18em] uppercase text-[#7D8E87] font-semibold">
          04 · THE SPECTRUM OF INQUIRY
        </div>

        {/* Heading */}
        <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl text-[#162723] font-normal tracking-tight max-w-2xl mx-auto leading-[1.18]">
          What Ingress Within helps you explore.
        </h2>

        {/* Subtitle */}
        <p className="font-zen text-sm sm:text-base text-[#5C6873] max-w-2xl mx-auto leading-relaxed pt-1">
          Six interconnected dimensions of self-awareness designed to build psychological maturity.
        </p>

        {/* Pinboard Canvas */}
        <div className="relative pt-12 sm:pt-16 pb-6">
          
          {/* SVG Interconnected Copper String on Desktop */}
          <svg
            className="hidden md:block absolute inset-0 w-full h-full pointer-events-none z-10"
            viewBox="0 0 1100 680"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M 180 120 L 550 145 M 550 145 L 910 130 M 180 120 L 550 480 M 550 145 L 210 440 M 550 145 L 890 480 M 910 130 L 210 440 M 210 440 L 550 480 M 550 480 L 890 480"
              stroke="#A86B5A"
              strokeWidth="1.3"
              strokeOpacity="0.45"
              strokeDasharray="4 2"
            />
          </svg>

          {/* 6 Pinned Paper Swatches Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 lg:gap-12 relative z-20 text-left">
            {swatches.map((swatch, idx) => (
              <div key={swatch.id} className="relative group">
                
                {/* Handwritten Annotations */}
                {swatch.annotation && (
                  <div
                    className={`font-handwriting text-[#5A635E] text-xs sm:text-[13.5px] leading-tight select-none pointer-events-none transition-transform duration-300 group-hover:scale-105 ${
                      swatch.annotationPos === 'left'
                        ? 'md:absolute md:-left-20 md:top-8 max-w-[130px] -rotate-6'
                        : swatch.annotationPos === 'right'
                        ? 'md:absolute md:-right-20 md:top-10 max-w-[130px] rotate-6 text-right'
                        : swatch.annotationPos === 'top'
                        ? 'md:absolute md:left-1/2 md:-translate-x-1/2 md:-top-7 whitespace-nowrap -rotate-2'
                        : 'md:absolute md:-left-12 md:-bottom-8 max-w-[150px] -rotate-3'
                    }`}
                  >
                    {swatch.annotationEncircled ? (
                      <span className="inline-block px-3 py-1.5 border border-[#8C7A6B]/50 rounded-full bg-[#FAF7F2]/90">
                        {swatch.annotation}
                      </span>
                    ) : (
                      <span>
                        {swatch.annotation} {swatch.arrow && <span className="text-sm">{swatch.arrow}</span>}
                      </span>
                    )}
                  </div>
                )}

                {/* Paper Note Card */}
                <div
                  className={`relative p-6 sm:p-7 rounded-lg border shadow-[0_6px_22px_rgba(1,22,39,0.04)] transition-all duration-300 hover:shadow-[0_12px_32px_rgba(1,22,39,0.08)] hover:-translate-y-1 ${swatch.bgColor} ${swatch.borderColor} ${swatch.rotation} hover:rotate-0`}
                >
                  {/* Brass Pushpin at top center */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 brass-pin" />

                  {/* Translucent Washi Tape (decorative on some cards) */}
                  {swatch.hasTape && (
                    <div className="absolute -top-3 -right-3 w-12 h-5 washi-tape rotate-12 rounded-xs" />
                  )}

                  {/* Note Header: Number + Category */}
                  <div className="flex items-center justify-between border-b border-[#1E2A2E]/10 pb-3 mb-4">
                    <span className="font-mono-code text-[11px] font-bold text-[#1E2A2E]/70">
                      {swatch.number}
                    </span>
                    <span className="font-mono-code text-[9px] tracking-[0.14em] uppercase font-semibold text-[#6C7872]">
                      {swatch.category}
                    </span>
                  </div>

                  {/* Note Title */}
                  <h3 className="font-editorial text-2xl text-[#162723] font-normal mb-2.5">
                    {swatch.title}
                  </h3>

                  {/* Note Description */}
                  <p className="font-zen text-[13px] text-[#4F635E] leading-relaxed">
                    {swatch.description}
                  </p>
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
