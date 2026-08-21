import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';

export const ReflectionModal = React.memo(({
  isOpen,
  reflectionToAnswer,
  entryText,
  onClose,
  reflectionAnswerText,
  setReflectionAnswerText,
  onSave,
  isSaving,
  error
}) => {
  if (!isOpen || !reflectionToAnswer) return null;

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
              <div className="text-[10px] uppercase font-semibold tracking-widest text-accent mb-1">Continue Your Reflection</div>
              <h3 className="font-serif italic text-lg text-primary leading-relaxed">
                "{reflectionToAnswer.closing_question}"
              </h3>
            </div>

            {reflectionToAnswer.reflection_text && (
              <div className="bg-accent/8 border border-accent/15 rounded-lg p-4 space-y-1.5 text-xs text-mid leading-relaxed">
                <div className="font-semibold uppercase tracking-widest text-accent text-[9px]">AI Observation</div>
                <p className="font-serif italic text-[13.5px] text-primary/90 leading-relaxed">"{reflectionToAnswer.reflection_text}"</p>
              </div>
            )}

            {entryText && (
              <details className="group border border-primary/10 rounded-lg bg-warm-paper/50 p-3.5 transition-all text-xs">
                <summary className="flex items-center justify-between font-semibold uppercase tracking-widest text-secondary text-[9px] cursor-pointer list-none select-none [&::-webkit-details-marker]:hidden">
                  <span>Re-read your writing</span>
                  <span className="text-mid/60 group-open:rotate-180 transition-transform duration-200">▼</span>
                </summary>
                <div className="mt-2.5 max-h-[160px] overflow-y-auto whitespace-pre-wrap italic font-serif text-primary leading-relaxed border-t border-primary/5 pt-2.5 pr-2 custom-scrollbar">
                  "{entryText}"
                </div>
              </details>
            )}

            <div className="space-y-2">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-secondary">Your Answer</label>
              <textarea 
                value={reflectionAnswerText}
                onChange={(e) => setReflectionAnswerText(e.target.value)}
                placeholder="Write what is actually there — no structure, no editing."
                className="w-full min-h-[140px] border border-primary/15 rounded-lg p-3.5 text-xs leading-relaxed outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 font-sans text-primary placeholder-mid/40 bg-white-paper"
              />
              {error && (
                <div className="text-[11px] text-error font-medium">{error}</div>
              )}
              <div className="text-[10px] text-mid/70 italic">
                Your response is saved securely and supports your self-reflection journey.
              </div>
            </div>

            <div className="flex gap-3 pt-3">
              <button 
                onClick={onSave}
                disabled={!reflectionAnswerText.trim() || isSaving}
                className="flex-1 py-2.5 bg-accent text-white hover:bg-[#654652] disabled:bg-accent/25 disabled:cursor-not-allowed rounded text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer border-none shadow-xs"
              >
                {isSaving ? 'Saving...' : 'Save Reflection'}
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

ReflectionModal.displayName = 'ReflectionModal';
