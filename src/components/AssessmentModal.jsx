import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight } from 'lucide-react';

export const AssessmentModal = React.memo(({
  isOpen,
  cycleInfo,
  onClose,
  answers,
  setAnswers,
  onSave,
  isSubmitting,
  error
}) => {
  if (!isOpen || !cycleInfo) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-[#011627]/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white-paper border border-primary/10 rounded-2xl max-w-[560px] w-full p-6 sm:p-8 space-y-6 relative overflow-hidden max-h-[90vh] overflow-y-auto text-left shadow-xl"
        >
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 text-mid hover:text-primary cursor-pointer border-none bg-transparent"
          >
            <X size={18} />
          </button>

          <div className="space-y-5">
            <div>
              <div className="text-[10px] uppercase font-semibold tracking-widest text-accent mb-1">Cycle Transition Assessment</div>
              <h2 className="font-serif text-lg text-primary leading-snug">
                Complete Cycle {cycleInfo.cycleNumber} Integration
              </h2>
              <p className="text-xs text-mid leading-relaxed mt-1">
                Take a moment to arrive. These reflective inquiries help synthesize your pattern changes before provisioning your next active cycle container.
              </p>
            </div>

            <div className="space-y-4 pt-1">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-widest text-secondary">
                  1. What patterns of cognitive rigidity or avoidance did you notice during this cycle?
                </label>
                <textarea 
                  value={answers.q1}
                  onChange={(e) => setAnswers(prev => ({ ...prev, q1: e.target.value }))}
                  placeholder="Reflect on when you felt stuck, defensive, or depleted..."
                  className="w-full min-h-[90px] border border-primary/15 rounded-lg p-3 text-xs leading-relaxed outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 font-sans text-primary placeholder-mid/40 bg-white-paper"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-widest text-secondary">
                  2. How has your relationship to your feelings shifted over the past 30 days?
                </label>
                <textarea 
                  value={answers.q2}
                  onChange={(e) => setAnswers(prev => ({ ...prev, q2: e.target.value }))}
                  placeholder="Reflect on emotional intensity, clarity, or emotional vocabulary shifts..."
                  className="w-full min-h-[90px] border border-primary/15 rounded-lg p-3 text-xs leading-relaxed outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 font-sans text-primary placeholder-mid/40 bg-white-paper"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-widest text-secondary">
                  3. What is the focus or intention you want to carry into your next cycle?
                </label>
                <textarea 
                  value={answers.q3}
                  onChange={(e) => setAnswers(prev => ({ ...prev, q3: e.target.value }))}
                  placeholder="Set your intention for the next 30 days..."
                  className="w-full min-h-[90px] border border-primary/15 rounded-lg p-3 text-xs leading-relaxed outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 font-sans text-primary placeholder-mid/40 bg-white-paper"
                />
              </div>
              
              {error && (
                <div className="text-[11px] text-error font-medium bg-error-subtle border border-error/20 rounded p-2.5">
                  {error}
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-3 border-t border-primary/5">
              <button 
                onClick={onSave}
                disabled={!answers.q1.trim() || !answers.q2.trim() || !answers.q3.trim() || isSubmitting}
                className="flex-1 py-2.5 bg-accent text-white hover:bg-[#654652] disabled:bg-accent/25 disabled:cursor-not-allowed rounded text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer border-none shadow-xs"
              >
                {isSubmitting ? 'Integrating learnings...' : 'Settle & Unlock Next Cycle'}
              </button>
              <button 
                onClick={onClose}
                className="px-4 py-2.5 border border-primary/15 rounded text-xs font-semibold text-mid hover:bg-warm-paper transition-colors cursor-pointer bg-white-paper"
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
});

AssessmentModal.displayName = 'AssessmentModal';
