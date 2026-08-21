import React, { useState } from 'react';
import { ArrowRight, Check, Sparkles, Trophy } from 'lucide-react';

export default function ModuleCompletionView({ content, playerState, updateState, onFinish }) {
  const mhpiConfig = content?.mhpiConfig;
  const baselineQuestions = mhpiConfig?.baselineQuestions || [];
  const extraQuestions = mhpiConfig?.endExtraQuestions || [];
  const endChoice = mhpiConfig?.endChoice;

  const [answers, setAnswers] = useState(playerState?.mhpiData?.end || {});
  const [extraAnswers, setExtraAnswers] = useState({});
  const [choiceVal, setChoiceVal] = useState(playerState?.mhpiData?.nextStep || null);
  const [submitted, setSubmitted] = useState(!!playerState?.mhpiData?.endScore);

  const baselineScore = playerState?.mhpiData?.baselineScore;
  const endScore = playerState?.mhpiData?.endScore;
  const improvementPct = playerState?.mhpiData?.improvementPct;

  const handleSelect = (qId, val) => {
    setAnswers(prev => ({ ...prev, [qId]: val }));
  };

  const handleExtraSelect = (qId, val) => {
    setExtraAnswers(prev => ({ ...prev, [qId]: val }));
  };

  const allCoreAnswered = baselineQuestions.every(q => answers[q.id] !== undefined);
  const allExtraAnswered = extraQuestions.every(q => extraAnswers[q.id] !== undefined);
  const isFormComplete = allCoreAnswered && allExtraAnswered && choiceVal !== null;

  const handleSubmit = () => {
    if (!isFormComplete) return;

    // Severity Formula per MHPI Framework v1: q1 + q2 + q3 + (10 - q4) + (10 - q5)
    const computedEndScore = (answers.q1 || 0) +
                             (answers.q2 || 0) +
                             (answers.q3 || 0) +
                             (10 - (answers.q4 || 0)) +
                             (10 - (answers.q5 || 0));

    let pct = null;
    if (baselineScore) {
      pct = Math.round(((baselineScore - computedEndScore) / baselineScore) * 100);
    }

    updateState(prev => ({
      ...prev,
      mhpiData: {
        ...prev.mhpiData,
        end: answers,
        endScore: computedEndScore,
        improvementPct: pct,
        helpfulness: extraAnswers.e6,
        nextStep: choiceVal
      }
    }));

    setSubmitted(true);
  };

  const getInterpretationLabel = (pct) => {
    if (pct === null || pct === undefined) return 'Not enough data';
    if (pct >= 30) return 'Strong response';
    if (pct >= 15) return 'Moderate response';
    if (pct >= 5) return 'Mild response';
    if (pct >= 0) return 'Minimal response';
    return 'Worsened';
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="pb-3 border-b border-primary/10">
        <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-primary">
          End Assessment & Results
        </h1>
        <p className="text-xs sm:text-sm text-mid mt-1">
          {submitted ? 'Your overall progress readout' : 'Answer the same 5 questions from baseline plus 2 extra questions.'}
        </p>
      </div>

      {!submitted ? (
        <div className="bg-white-paper border border-primary/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="text-[11px] uppercase tracking-widest text-accent font-bold">
            Baseline Comparison Questions
          </div>

          {baselineQuestions.map((q) => {
            const selectedVal = answers[q.id];
            return (
              <div key={q.id} className="space-y-3 pb-5 border-b border-primary/10">
                <div className="text-[11px] uppercase tracking-widest text-accent font-bold">
                  {q.label}
                </div>
                <p className="text-sm sm:text-[15px] text-primary font-medium leading-snug">
                  {q.prompt}
                </p>
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

          <div className="text-[11px] uppercase tracking-widest text-accent font-bold pt-2">
            Program Feedback
          </div>

          {extraQuestions.map((q) => {
            const selectedVal = extraAnswers[q.id];
            return (
              <div key={q.id} className="space-y-3 pb-5 border-b border-primary/10">
                <p className="text-sm sm:text-[15px] text-primary font-medium leading-snug">
                  {q.prompt}
                </p>
                <div className="flex gap-1.5 overflow-x-auto pt-1 pb-1 scrollbar-none">
                  {Array.from({ length: q.max - q.min + 1 }, (_, idx) => q.min + idx).map((val) => {
                    const isPicked = selectedVal === val;
                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() => handleExtraSelect(q.id, val)}
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

          {endChoice && (
            <div className="space-y-3 pt-2">
              <p className="text-sm sm:text-[15px] text-primary font-semibold">
                {endChoice.prompt}
              </p>
              <div className="grid gap-2">
                {endChoice.options.map((optText) => (
                  <button
                    key={optText}
                    type="button"
                    onClick={() => setChoiceVal(optText)}
                    className={`p-3.5 text-left rounded-xl border text-xs sm:text-sm font-medium transition-all shadow-xs cursor-pointer ${
                      choiceVal === optText
                        ? 'bg-accent text-white font-semibold border-accent shadow-xs'
                        : 'bg-white-paper border-primary/15 text-primary hover:border-accent/40'
                    }`}
                  >
                    {optText}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!isFormComplete}
            className={`w-full py-4 px-5 rounded-xl font-semibold text-sm transition-all shadow-xs flex items-center justify-center gap-2 ${
              isFormComplete
                ? 'bg-accent hover:bg-[#654652] active:bg-[#533842] text-white cursor-pointer'
                : 'bg-warm-paper border border-primary/10 text-mid/50 cursor-not-allowed'
            }`}
          >
            <span>{isFormComplete ? 'See My Results' : 'Please Answer All Questions'}</span>
            {isFormComplete && <ArrowRight size={14} />}
          </button>
        </div>
      ) : (
        /* Results Card */
        <div className="space-y-6">
          <div className="bg-white-paper border border-primary/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs text-center">
            <div className="flex items-center justify-center gap-1.5 text-[11px] uppercase tracking-widest text-accent font-bold">
              <Sparkles size={13} />
              <span>Improvement Since You Started</span>
            </div>
            <div className="font-serif text-5xl sm:text-6xl font-bold text-primary">
              {improvementPct !== null ? `${improvementPct}%` : '—'}
            </div>

            {/* Progress bar */}
            <div className="bg-warm-paper border border-primary/10 rounded-full h-3 overflow-hidden max-w-sm mx-auto">
              <div
                className="bg-accent h-full transition-all duration-700 rounded-full"
                style={{ width: `${Math.max(0, Math.min(100, improvementPct || 0))}%` }}
              />
            </div>

            <div className="text-sm sm:text-base font-medium text-primary">
              Response Category: <strong className="text-accent font-bold ml-1">{getInterpretationLabel(improvementPct)}</strong>
            </div>

            {/* Before vs After Scores */}
            <div className="grid grid-cols-2 gap-4 pt-3">
              <div className="bg-warm-paper border border-primary/10 rounded-xl p-4 sm:p-5 text-left">
                <div className="text-xs uppercase text-mid font-semibold">Baseline Score</div>
                <div className="font-serif text-2xl sm:text-3xl font-bold text-primary mt-1">
                  {baselineScore !== null ? `${baselineScore} / 50` : 'N/A'}
                </div>
              </div>
              <div className="bg-accent/5 border border-accent/20 rounded-xl p-4 sm:p-5 text-left">
                <div className="text-xs uppercase text-accent font-semibold">End Score</div>
                <div className="font-serif text-2xl sm:text-3xl font-bold text-accent mt-1">
                  {endScore !== null ? `${endScore} / 50` : 'N/A'}
                </div>
              </div>
            </div>
          </div>

          {/* Reinforcement Bank Section */}
          {content?.reinforcementBank && content.reinforcementBank.length > 0 && (
            <div className="bg-white-paper border border-primary/10 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
              <h3 className="font-serif text-xl font-semibold text-primary">
                Reinforcement Bank Reflections ({content.reinforcementBank.length})
              </h3>
              <p className="text-xs sm:text-sm text-mid">
                Keep practicing these techniques in your ongoing journal sit-downs.
              </p>
              <div className="grid gap-3">
                {content.reinforcementBank.map((rep, idx) => (
                  <div key={idx} className="bg-warm-paper border border-primary/10 rounded-xl p-4 sm:p-5 text-xs sm:text-sm space-y-2">
                    <div className="flex justify-between text-accent font-mono font-bold">
                      <span>{rep.code} — Rep {rep.rep}</span>
                    </div>
                    <p className="text-primary font-medium">{rep.scenario}</p>
                    <div className="text-mid italic pt-1">
                      Prompt: {rep.prompt}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={onFinish}
            className="w-full py-4 px-5 bg-accent hover:bg-[#654652] active:bg-[#533842] text-white font-semibold rounded-xl text-sm transition-all shadow-xs cursor-pointer"
          >
            Return to Module Overview
          </button>
        </div>
      )}
    </div>
  );
}
