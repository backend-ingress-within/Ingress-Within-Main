import React, { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function MhpiBaselineModal({ content, playerState, updateState, onComplete }) {
  const questions = content?.mhpiConfig?.baselineQuestions || [];
  const [answers, setAnswers] = useState(playerState?.mhpiData?.baseline || {});

  const handleSelect = (qId, val) => {
    setAnswers(prev => ({ ...prev, [qId]: val }));
  };

  const allAnswered = questions.every(q => answers[q.id] !== undefined);

  const handleSubmit = () => {
    if (!allAnswered) return;

    // Severity Formula per MHPI Framework v1: q1 + q2 + q3 + (10 - q4) + (10 - q5)
    const score = (answers.q1 || 0) +
                  (answers.q2 || 0) +
                  (answers.q3 || 0) +
                  (10 - (answers.q4 || 0)) +
                  (10 - (answers.q5 || 0));

    updateState(prev => ({
      ...prev,
      mhpiData: {
        ...prev.mhpiData,
        baseline: answers,
        baselineScore: score
      }
    }));

    onComplete();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="pb-3 border-b border-primary/10">
        <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-primary">
          Before you begin
        </h1>
        <p className="text-xs sm:text-sm text-mid mt-1 leading-relaxed">
          Five quick questions, answered honestly — this is just for you (and your practitioner if connected) to track progress.
        </p>
      </div>

      {/* Questions Form Card */}
      <div className="bg-white-paper border border-primary/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
        {questions.map((q) => {
          const selectedVal = answers[q.id];
          return (
            <div key={q.id} className="space-y-3 pb-5 border-b border-primary/10 last:border-b-0 last:pb-0">
              <div className="text-[11px] uppercase tracking-widest text-accent font-bold">
                {q.label}
              </div>
              <p className="text-sm sm:text-[15px] text-primary font-medium leading-snug">
                {q.prompt}
              </p>

              {/* 0-10 Rating Scale */}
              <div className="flex gap-1.5 overflow-x-auto pt-1 pb-1 scrollbar-none">
                {Array.from({ length: q.max - q.min + 1 }, (_, idx) => q.min + idx).map((val) => {
                  const isPicked = selectedVal === val;
                  return (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleSelect(q.id, val)}
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-xs font-semibold flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                        isPicked
                          ? 'bg-accent text-white font-bold shadow-xs scale-105 border border-accent'
                          : 'bg-white-paper border border-primary/15 text-primary hover:border-accent/40 hover:bg-warm-paper'
                      }`}
                    >
                      {val}
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-between text-xs text-mid px-0.5 font-medium">
                <span>{q.minLabel}</span>
                <span>{q.maxLabel}</span>
              </div>
            </div>
          );
        })}

        {/* Submit Button */}
        <div className="pt-2">
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className={`w-full py-4 px-5 rounded-xl font-semibold text-sm transition-all shadow-xs flex items-center justify-center gap-2 ${
              allAnswered
                ? 'bg-accent hover:bg-[#654652] active:bg-[#533842] text-white cursor-pointer'
                : 'bg-warm-paper border border-primary/10 text-mid/50 cursor-not-allowed'
            }`}
          >
            <span>{allAnswered ? 'Submit Baseline & Start Program' : 'Please Answer All 5 Questions'}</span>
            {allAnswered && <ArrowRight size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
}
