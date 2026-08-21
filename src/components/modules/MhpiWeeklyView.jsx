import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

export default function MhpiWeeklyView({ content, weekIdx, playerState, updateState, onComplete }) {
  const week = content?.weeks?.[weekIdx];
  const questions = content?.mhpiConfig?.weeklyQuestions || [];
  const weekKey = `w${week?.num || 1}`;
  const existingAnswers = playerState?.mhpiData?.weekly?.[weekKey] || {};

  const [answers, setAnswers] = useState(existingAnswers);

  if (!week) return null;

  const handleSelect = (qId, val) => {
    setAnswers(prev => ({ ...prev, [qId]: val }));
  };

  const allAnswered = questions.every(q => answers[q.id] !== undefined);

  const handleSubmit = () => {
    if (!allAnswered) return;

    updateState(prev => ({
      ...prev,
      completedTouches: Array.from(new Set([...(prev.completedTouches || []), `mhpi_${weekKey}`])),
      mhpiData: {
        ...prev.mhpiData,
        weekly: {
          ...prev.mhpiData.weekly,
          [weekKey]: answers
        }
      }
    }));

    onComplete();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="pb-3 border-b border-primary/10">
        <button
          onClick={onComplete}
          className="text-xs font-semibold text-mid hover:text-accent flex items-center gap-1.5 transition-colors cursor-pointer mb-1"
        >
          <ArrowLeft size={13} />
          <span>Back to Week {week.num}</span>
        </button>
        <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-primary">
          Week {week.num} Check-in
        </h1>
        <p className="text-xs sm:text-sm text-mid mt-1">
          Three quick questions to track your weekly progress.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white-paper border border-primary/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
        {questions.map((q) => {
          const selectedVal = answers[q.id];
          return (
            <div key={q.id} className="space-y-3 pb-5 border-b border-primary/10 last:border-b-0 last:pb-0">
              <p className="text-sm sm:text-[15px] text-primary font-medium leading-snug">
                {q.prompt}
              </p>

              {/* Rating Scale */}
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

        <button
          onClick={handleSubmit}
          disabled={!allAnswered}
          className={`w-full py-4 px-5 rounded-xl font-semibold text-sm transition-all shadow-xs flex items-center justify-center gap-2 ${
            allAnswered
              ? 'bg-accent hover:bg-[#654652] active:bg-[#533842] text-white cursor-pointer'
              : 'bg-warm-paper border border-primary/10 text-mid/50 cursor-not-allowed'
          }`}
        >
          <span>{allAnswered ? 'Save Weekly Check-in' : 'Please Answer All 3 Questions'}</span>
          {allAnswered && <Check size={14} />}
        </button>
      </div>
    </div>
  );
}
