import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export const ThreadResponseModal = React.memo(({
  isOpen,
  activeThread,
  onClose,
  threadResponse,
  setThreadResponse,
  onSave,
  isSaving
}) => {
  if (!isOpen || !activeThread) return null;

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
              <div className="text-[10px] uppercase font-semibold tracking-widest text-accent mb-1">Open Thread Question</div>
              <h3 className="font-serif italic text-lg text-primary leading-relaxed">
                "{activeThread.question}"
              </h3>
            </div>

            <div className="bg-accent/8 border border-accent/15 rounded-xl p-4 space-y-1.5 text-xs text-mid leading-relaxed text-left">
              <div className="font-semibold uppercase tracking-widest text-accent text-[9px]">Context</div>
              <p className="font-serif italic text-[13.5px] text-primary/90 leading-relaxed">"{activeThread.context}"</p>
            </div>

            <div className="space-y-2 text-left">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-secondary">Your Reflection</label>
              <textarea 
                value={threadResponse}
                onChange={(e) => setThreadResponse(e.target.value)}
                placeholder="Write what is actually there — no structure, no editing."
                className="w-full min-h-[140px] border border-primary/15 rounded-xl p-3.5 text-xs leading-relaxed outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 font-sans text-primary placeholder-mid/40 bg-white-paper"
              />
              <div className="text-[10px] text-mid/70 italic">
                Your response feeds directly into your Day 28 report.
              </div>
            </div>

            <div className="flex gap-3 pt-3">
              <button 
                onClick={onSave}
                disabled={!threadResponse.trim() || isSaving}
                className="flex-1 py-2.5 bg-accent text-white hover:bg-[#654652] disabled:bg-accent/25 disabled:cursor-not-allowed rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer border-none shadow-xs"
              >
                {isSaving ? 'Saving...' : "That's what's there"}
              </button>
              <button 
                onClick={onClose}
                className="px-4 py-2.5 border border-primary/15 rounded-xl text-xs font-semibold text-mid hover:bg-warm-paper transition-colors cursor-pointer bg-white-paper"
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

ThreadResponseModal.displayName = 'ThreadResponseModal';
