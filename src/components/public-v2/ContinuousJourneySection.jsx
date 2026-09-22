import { motion } from 'framer-motion';
import { getCardEmergence } from '../../utils/cardEmergence';

/**
 * Section 01 · A Continuous Journey
 * Recreates media_1789581839975.jpg:
 * "A continuous path from reflection to clarity"
 * 5 editorial cards representing the five core phases.
 */
export default function ContinuousJourneySection() {
  const steps = [
    {
      number: '01',
      title: 'REFLECT',
      description: 'Notice what is present right now'
    },
    {
      number: '02',
      title: 'UNDERSTAND',
      description: 'Give words to unnamed feelings'
    },
    {
      number: '03',
      title: 'NOTICE',
      description: 'Observe recurring emotional loops'
    },
    {
      number: '04',
      title: 'GROW',
      description: 'Align choices with core values'
    },
    {
      number: '05',
      title: 'CONTINUE',
      description: 'Build sustainable self-clarity'
    }
  ];

  return (
    <section className="relative py-20 md:py-28 px-4 sm:px-8 overflow-hidden bg-[#FAF7F2]">
      <div className="max-w-6xl mx-auto text-center space-y-4">
        
        {/* Eyebrow */}
        <div className="font-mono-code text-[10.5px] sm:text-[11px] tracking-[0.18em] uppercase text-[#7D8E87] font-semibold">
          01 · A CONTINUOUS JOURNEY
        </div>

        {/* Heading */}
        <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl text-[#162723] font-normal tracking-tight max-w-3xl mx-auto leading-[1.18]">
          A continuous path from{' '}
          <span className="block sm:inline">reflection to clarity.</span>
        </h2>

        {/* Subtitle */}
        <p className="font-zen text-sm sm:text-base text-[#5C6873] max-w-2xl mx-auto leading-relaxed pt-1">
          Self-awareness doesn't happen in a single breakthrough. It builds through consistent daily registration, noticing loops, and intentional reframing.
        </p>

        {/* 5 Sequential Paper Cards: Odd total (5) -> Center card (03 NOTICE) anchors, others emerge outward */}
        <div className="pt-12 sm:pt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5 text-center">
          {steps.map((step, idx) => (
            <motion.div
              key={step.number}
              {...getCardEmergence(idx, 5)}
              className="paper-card paper-card-hover rounded-xl p-6 sm:p-7 flex flex-col items-center justify-center bg-[#FDFBF8] hover:bg-white border border-[#E7DECF] hover:border-[#795663]/40 min-h-[160px] shadow-xs hover:shadow-md transition-shadow cursor-pointer"
            >
              {/* Number */}
              <div className="font-mono-code text-xs text-[#9AA59F] font-semibold mb-3">
                {step.number}
              </div>

              {/* Title */}
              <h3 className="font-editorial text-lg sm:text-xl text-[#162723] font-normal tracking-wide mb-3">
                {step.title}
              </h3>

              {/* Description */}
              <p className="font-zen text-xs sm:text-[13px] text-[#5C6873] leading-relaxed max-w-[170px]">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
