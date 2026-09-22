'use client';

import React from 'react';
import { motion } from 'framer-motion';

import { getCardEmergence } from '../../utils/cardEmergence';

/**
 * Section 02 · Choose Your Starting Point
 * Features an editorial 3-card splitting scroll animation where cards
 * emerge purely sideways into their positions as the user scrolls in.
 */
export default function ThreeWaysSection({ onSelectTab }) {
  const cards = [
    {
      number: '01',
      eyebrow: 'INDEPENDENT INQUIRY',
      title: 'Work on yourself',
      description:
        'Understand what is happening within you with structured learning, reflective prompts, and longitudinal pattern recognition.',
      badgeBg: 'bg-[#E7EFE5]',
      badgeColor: 'text-[#5C7D64]',
      eyebrowColor: 'text-[#5C7D64]',
      targetTab: 'solution',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-5 h-5">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 4-6 8-6s8 2 8 6" strokeLinecap="round" />
        </svg>
      )
    },
    {
      number: '02',
      eyebrow: 'CLINICAL GUIDANCE',
      title: 'Work with a therapist',
      description:
        'Experienced, verified therapists who understand modern stress, trauma, and identity. Regular 50-minute video sessions.',
      badgeBg: 'bg-[#F5ECE8]',
      badgeColor: 'text-[#795663]',
      eyebrowColor: 'text-[#795663]',
      targetTab: 'start',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-5 h-5">
          <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 14s1.5 2 4 2 4-2 4-2" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      )
    },
    {
      number: '03',
      eyebrow: 'INTEGRATED RHYTHM',
      title: 'Move between the two',
      description:
        "Your journey doesn't have to follow one route. Switch, combine or explore, whatever works for you.",
      badgeBg: 'bg-[#EBEFF2]',
      badgeColor: 'text-[#4A6478]',
      eyebrowColor: 'text-[#4A6478]',
      targetTab: 'how-it-works',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-5 h-5">
          <path d="M4 12 A8 8 0 0 1 18.5 7.5" strokeLinecap="round" />
          <polyline points="15 4 19 8 15 12" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M20 12 A8 8 0 0 1 5.5 16.5" strokeLinecap="round" />
          <polyline points="9 20 5 16 9 12" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    }
  ];

  return (
    <section className="relative py-20 md:py-28 px-5 sm:px-8 overflow-hidden">
      <div className="max-w-6xl mx-auto text-center space-y-4">
        
        {/* Section Heading with smooth fade-up */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4"
        >
          {/* Section Eyebrow */}
          <div className="font-mono-code text-[10.5px] sm:text-[11px] tracking-[0.18em] uppercase text-[#7D8E87] font-semibold">
            02 · CHOOSE YOUR STARTING POINT
          </div>

          {/* Section Heading */}
          <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl text-[#162723] font-normal tracking-tight max-w-2xl mx-auto leading-[1.18]">
            Three ways to work on your mental health.
          </h2>

          {/* Section Subtext */}
          <p className="font-zen text-sm sm:text-base text-[#5C6873] max-w-2xl mx-auto leading-relaxed pt-1">
            Different needs. A connected journey. Choose what works for you right now, or move between them whenever your life changes.
          </p>
        </motion.div>

        {/* Three Editorial Paper Cards with Splitting Animation */}
        <div className="pt-10 sm:pt-14 grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr_auto_1fr] items-stretch gap-6 lg:gap-0 text-left">
          {cards.map((card, idx) => (
            <React.Fragment key={card.number}>
              {/* Paper Card with Splitting Motion */}
              <motion.div
                {...getCardEmergence(idx, 3)}
                className="paper-card paper-card-hover rounded-2xl p-7 sm:p-8 flex flex-col justify-between relative bg-[#FDFBF8] shadow-xs hover:shadow-md transition-shadow cursor-pointer"
              >
                <div>
                  {/* Top Bar: Icon Badge & Pinned Number */}
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${card.badgeBg} ${card.badgeColor}`}
                    >
                      {card.icon}
                    </div>
                    <span className="font-mono-code text-xs text-[#9AA59F] font-medium">
                      {card.number}
                    </span>
                  </div>

                  {/* Micro Eyebrow */}
                  <div
                    className={`font-mono-code text-[10px] tracking-[0.14em] uppercase font-semibold mb-2 ${card.eyebrowColor}`}
                  >
                    {card.eyebrow}
                  </div>

                  {/* Card Title */}
                  <h3 className="font-editorial text-2xl text-[#162723] font-normal mb-3 leading-snug">
                    {card.title}
                  </h3>

                  {/* Description */}
                  <p className="font-zen text-[13.5px] text-[#5C6873] leading-relaxed">
                    {card.description}
                  </p>
                </div>

                {/* Card CTA Link */}
                <div className="pt-6">
                  <button
                    type="button"
                    onClick={() => onSelectTab && onSelectTab(card.targetTab)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#162723] hover:text-[#795663] transition-colors cursor-pointer group"
                  >
                    <span>Learn more</span>
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </button>
                </div>
              </motion.div>

              {/* "or" Separator between cards on desktop */}
              {idx < cards.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: 0.35 }}
                  className="hidden lg:flex flex-col items-center justify-center px-4 relative"
                >
                  <div className="w-[1px] h-full bg-[#E7DECF]/80 absolute top-0" />
                  <span className="relative z-10 bg-[#FAF7F2] py-2 px-2 text-xs font-editorial italic text-[#8D98A3]">
                    or
                  </span>
                </motion.div>
              )}
            </React.Fragment>
          ))}
        </div>

      </div>
    </section>
  );
}
