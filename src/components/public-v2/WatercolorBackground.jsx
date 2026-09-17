import React from 'react';

/**
 * Ambient watercolor atmosphere inspired by the editorial design references.
 * Features organic bleeds in Sage Green (#8AA688), Dusty Rose (#D9BCAF / #795663),
 * and Pale Fog (#BFCAD7) on Warm Handmade Paper (#FAF7F2).
 */
export default function WatercolorBackground({ className = '' }) {
  return (
    <div
      className={`fixed inset-0 pointer-events-none overflow-hidden z-0 ${className}`}
      aria-hidden="true"
    >
      {/* 1. Top-Left: Sage Green Wash with Paint Bleed */}
      <svg
        className="absolute -top-16 -left-20 w-[420px] sm:w-[560px] md:w-[680px] h-auto opacity-75 sm:opacity-85 mix-blend-multiply"
        viewBox="0 0 600 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="sage-wash" cx="25%" cy="20%" r="70%">
            <stop offset="0%" stopColor="#7E9E82" stopOpacity="0.45" />
            <stop offset="45%" stopColor="#96B49A" stopOpacity="0.28" />
            <stop offset="75%" stopColor="#C4D7C7" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#FAF7F2" stopOpacity="0" />
          </radialGradient>
          <filter id="bleed-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="18" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
        <path
          d="M60 40 C140 -20 280 10 380 70 C470 120 540 240 480 340 C430 420 300 460 210 440 C120 420 30 360 10 260 C-10 160 -10 90 60 40 Z"
          fill="url(#sage-wash)"
          filter="url(#bleed-blur)"
        />
        {/* Subtle watercolor splatter drops */}
        <circle cx="430" cy="110" r="4.5" fill="#8AA688" opacity="0.3" />
        <circle cx="455" cy="130" r="3" fill="#8AA688" opacity="0.25" />
        <circle cx="390" cy="190" r="5" fill="#8AA688" opacity="0.2" />
        <circle cx="480" cy="270" r="4" fill="#8AA688" opacity="0.25" />
        <circle cx="510" cy="245" r="2.5" fill="#8AA688" opacity="0.2" />
      </svg>

      {/* 2. Top-Right: Dusty Rose / Terracotta Wash */}
      <svg
        className="absolute -top-12 -right-24 w-[440px] sm:w-[580px] md:w-[720px] h-auto opacity-70 sm:opacity-80 mix-blend-multiply"
        viewBox="0 0 650 550"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="rose-wash" cx="75%" cy="25%" r="70%">
            <stop offset="0%" stopColor="#C49A8F" stopOpacity="0.4" />
            <stop offset="40%" stopColor="#D9BCAF" stopOpacity="0.26" />
            <stop offset="70%" stopColor="#EFE3DE" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#FAF7F2" stopOpacity="0" />
          </radialGradient>
        </defs>
        <path
          d="M520 20 C420 -10 310 40 240 120 C170 200 160 310 210 390 C270 470 390 510 490 470 C580 430 630 330 640 220 C650 120 610 50 520 20 Z"
          fill="url(#rose-wash)"
          filter="url(#bleed-blur)"
        />
        {/* Rose splatter drops */}
        <circle cx="210" cy="170" r="4" fill="#C49A8F" opacity="0.3" />
        <circle cx="185" cy="195" r="3" fill="#C49A8F" opacity="0.25" />
        <circle cx="160" cy="250" r="5" fill="#C49A8F" opacity="0.22" />
        <circle cx="230" cy="340" r="3.5" fill="#C49A8F" opacity="0.2" />
      </svg>

      {/* 3. Bottom-Left: Soft Mauve / Clay Wash */}
      <svg
        className="absolute -bottom-24 -left-28 w-[400px] sm:w-[520px] md:w-[640px] h-auto opacity-65 mix-blend-multiply"
        viewBox="0 0 600 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M40 450 C90 360 170 310 270 320 C360 330 430 400 450 480 C400 520 220 540 130 520 C60 500 10 480 40 450 Z"
          fill="url(#rose-wash)"
          filter="url(#bleed-blur)"
        />
      </svg>

      {/* 4. Bottom-Right: Soft Sage Wash */}
      <svg
        className="absolute -bottom-20 -right-20 w-[420px] sm:w-[540px] md:w-[660px] h-auto opacity-70 mix-blend-multiply"
        viewBox="0 0 600 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M520 440 C450 350 360 320 270 340 C190 360 150 430 180 490 C250 530 410 520 480 500 C530 480 560 460 520 440 Z"
          fill="url(#sage-wash)"
          filter="url(#bleed-blur)"
        />
        <circle cx="250" cy="320" r="4" fill="#8AA688" opacity="0.25" />
        <circle cx="290" cy="290" r="3" fill="#8AA688" opacity="0.2" />
      </svg>
    </div>
  );
}
