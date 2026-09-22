/**
 * Card Emergence Scroll Animation Utility
 * STRICTLY SIDEWAYS (Pure Horizontal Translation - No vertical Y shift, No Skew, No Rotation)
 * 
 * Configured for a completely smooth, unified slide in ONE GO:
 * - 1 smooth ease-in-out motion ("easeInOut" curve, zero elastic bounce or snap)
 * - All cards in a section slide together in unison (delay: 0 for all cards)
 * - Pure sideways translation on the horizontal X axis
 */

export function getCardEmergence(index, total, is2D = false, cols = 3) {
  // 1 smooth ease-in-out motion for a natural, silky, non-rubbery glide
  const ease = 'easeInOut';
  const duration = 0.75;

  const hoverConfig = {
    y: -3,
    transition: { duration: 0.2, ease: 'easeOut' }
  };

  // 2D Grid calculation (e.g. 6 cards in 2x3): animate ONLY sideways in one go
  if (is2D && cols > 1) {
    const col = index % cols;
    const colCenter = (cols - 1) / 2;
    const colDiff = col - colCenter;
    let xOffset = 0;

    if (cols % 2 === 1) {
      if (colDiff < 0) {
        xOffset = 38;
      } else if (colDiff > 0) {
        xOffset = -38;
      }
    } else {
      xOffset = colDiff < 0 ? 32 : -32;
    }

    return {
      initial: {
        opacity: 0,
        x: xOffset
      },
      whileInView: {
        opacity: 1,
        x: 0
      },
      viewport: { once: true, amount: 0.15 },
      transition: {
        duration,
        ease,
        delay: 0 // In one go: all cards slide together
      },
      whileHover: hoverConfig
    };
  }

  // EVEN TOTAL (e.g. 2 cards, 4 cards): split sideways in one go
  if (total % 2 === 0) {
    const center = (total - 1) / 2;
    const diff = index - center;
    const isLeft = diff < 0;
    const rank = Math.abs(diff);

    const xOffset = isLeft ? 32 + (rank - 0.5) * 18 : -(32 + (rank - 0.5) * 18);

    return {
      initial: {
        opacity: 0,
        x: xOffset
      },
      whileInView: {
        opacity: 1,
        x: 0
      },
      viewport: { once: true, amount: 0.18 },
      transition: {
        duration,
        ease,
        delay: 0 // In one go: all cards slide together
      },
      whileHover: hoverConfig
    };
  }

  // ODD TOTAL (e.g. 3 cards, 5 cards): emerge sideways in one go
  const centerIndex = Math.floor(total / 2);

  if (index === centerIndex) {
    // Center Anchor Card: remains firmly in its resting place, smooth fade-in
    return {
      initial: {
        opacity: 0,
        x: 0
      },
      whileInView: {
        opacity: 1,
        x: 0
      },
      viewport: { once: true, amount: 0.18 },
      transition: {
        duration,
        ease,
        delay: 0 // In one go: all cards slide together
      },
      whileHover: hoverConfig
    };
  }

  // Outer cards: gentle horizontal glide outward from center in one go
  const isLeft = index < centerIndex;
  const dist = Math.abs(index - centerIndex);
  const xOffset = isLeft ? dist * 36 : -dist * 36;

  return {
    initial: {
      opacity: 0,
      x: xOffset
    },
    whileInView: {
      opacity: 1,
      x: 0
    },
    viewport: { once: true, amount: 0.18 },
    transition: {
      duration,
      ease,
      delay: 0 // In one go: all cards slide together
    },
    whileHover: hoverConfig
  };
}
