import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Brain, Check, Sparkles, AlertTriangle } from 'lucide-react';

export default function ModuleWeekView({ content, weekIdx, playerState, updateState, onBackToWeekList, onSelectTouch, onOpenMhpiWeekly }) {
  const weeks = content?.weeks || [];
  const safeWeekIdx = Math.max(0, Math.min(weekIdx || 0, (weeks.length || 1) - 1));
  const week = weeks[safeWeekIdx] || weeks[0];
  const completedTouches = playerState?.completedTouches || [];

  const rcKey = `rc_w${week?.num || 0}`;
  const savedRcAnswers = playerState?.userAnswers?.[rcKey] || {};
  const [rcAnswers, setRcAnswers] = useState({
    prompt1: savedRcAnswers.prompt1 || '',
    prompt2: savedRcAnswers.prompt2 || ''
  });
  const [showRetrievalReveal, setShowRetrievalReveal] = useState(
    Boolean(savedRcAnswers.submitted || completedTouches.includes(rcKey))
  );
  const [rcEscalationWarning, setRcEscalationWarning] = useState(null);

  useEffect(() => {
    const currentSaved = playerState?.userAnswers?.[`rc_w${week?.num || 0}`] || {};
    setRcAnswers({
      prompt1: currentSaved.prompt1 || '',
      prompt2: currentSaved.prompt2 || ''
    });
    setShowRetrievalReveal(Boolean(currentSaved.submitted || completedTouches.includes(`rc_w${week?.num || 0}`)));
    setRcEscalationWarning(null);
  }, [weekIdx, week?.num]);

  if (!week) return null;

  const touches = week.touches || [];
  const weekCompletedCount = touches.filter(t => completedTouches.includes(t.id)).length;
  const isWeekTouchesDone = weekCompletedCount === touches.length && touches.length > 0;
  const isMhpiWeeklyDone = completedTouches.includes(`mhpi_w${week.num}`);

  // Safety escalation offline scan helper for retrieval answers
  const checkTextEscalation = (text) => {
    if (!text) return null;
    const lower = text.toLowerCase();
    const t1 = [
      "kill myself", "end my life", "suicide", "don't want to live",
      "can't face them if i fail", "if this exam doesn't work out there's no point going on",
      "have a way to end it", "point in living if i fail", "better off dead if i don't clear"
    ];
    const t2 = [
      "worthless", "fundamental failure", "everyone better off without me",
      "completely hopeless", "unable to function", "cannot face family"
    ];
    for (const w of t1) {
      if (lower.includes(w)) {
        return "Support Notice: Your safety is our highest priority. Please contact KIRAN (1800-599-0019) or TeleMANAS (14416) immediately.";
      }
    }
    for (const w of t2) {
      if (lower.includes(w)) {
        return "Notice: You expressed deep distress. Please remember you can talk to a licensed therapist or loved one.";
      }
    }
    return null;
  };

  const handleRcSubmit = () => {
    const combinedText = `${rcAnswers.prompt1} ${rcAnswers.prompt2}`;
    const warning = checkTextEscalation(combinedText);
    setRcEscalationWarning(warning);
    setShowRetrievalReveal(true);

    if (updateState) {
      updateState(prev => {
        const updatedTouches = Array.from(new Set([...(prev.completedTouches || []), rcKey]));
        return {
          ...prev,
          persistentBanner: warning ? 'tier1' : prev.persistentBanner,
          completedTouches: updatedTouches,
          userAnswers: {
            ...prev.userAnswers,
            [rcKey]: {
              prompt1: rcAnswers.prompt1,
              prompt2: rcAnswers.prompt2,
              submitted: true,
              submittedAt: new Date().toISOString()
            }
          }
        };
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Navigation Header */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-primary/10 flex-wrap">
        <div>
          <button
            onClick={onBackToWeekList}
            className="text-xs font-semibold text-mid hover:text-accent flex items-center gap-1.5 transition-colors cursor-pointer mb-1"
          >
            <ArrowLeft size={13} />
            <span>Program Roadmap</span>
          </button>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-primary">
            Week {week.num}: {week.title}
          </h1>
        </div>
        <span className="text-xs font-mono font-bold text-accent bg-accent/10 border border-accent/20 px-3 py-1 rounded-full">
          {weekCompletedCount}/{touches.length} Touches
        </span>
      </div>

      {/* Retrieval Check Interactive Form (if present) */}
      {week.retrievalCheck && (
        <div className="bg-white-paper border border-accent/25 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs">
          <div className="text-[11px] uppercase tracking-widest text-accent font-bold flex items-center gap-2">
            <Brain size={14} />
            <span>Retrieval Check — Review & Recall</span>
          </div>

          {/* Safety Escalation Warning if triggered in retrieval */}
          {rcEscalationWarning && (
            <div className="p-4 bg-error-subtle border border-error/30 rounded-xl text-xs text-error space-y-1.5 shadow-xs">
              <span className="font-semibold text-error flex items-center gap-1.5">
                <AlertTriangle size={14} />
                <span>Safety Resource Notification</span>
              </span>
              <p className="leading-relaxed">{rcEscalationWarning}</p>
            </div>
          )}

          {/* Prompt 1 */}
          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-semibold text-primary block leading-relaxed">
              1. {week.retrievalCheck.prompt1}
            </label>
            <textarea
              value={rcAnswers.prompt1}
              onChange={(e) => setRcAnswers(prev => ({ ...prev, prompt1: e.target.value }))}
              placeholder="In your own words, without looking back..."
              rows={3}
              maxLength={4000}
              disabled={showRetrievalReveal}
              className="w-full bg-warm-paper border border-primary/15 focus:border-accent focus:ring-1 focus:ring-accent/20 rounded-xl p-3.5 text-xs sm:text-sm text-primary placeholder-mid/40 outline-none leading-relaxed shadow-xs disabled:opacity-85"
            />
          </div>

          {/* Prompt 2 */}
          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-semibold text-primary block leading-relaxed">
              2. {week.retrievalCheck.prompt2}
            </label>
            <textarea
              value={rcAnswers.prompt2}
              onChange={(e) => setRcAnswers(prev => ({ ...prev, prompt2: e.target.value }))}
              placeholder="In your own words, without looking back..."
              rows={3}
              maxLength={4000}
              disabled={showRetrievalReveal}
              className="w-full bg-warm-paper border border-primary/15 focus:border-accent focus:ring-1 focus:ring-accent/20 rounded-xl p-3.5 text-xs sm:text-sm text-primary placeholder-mid/40 outline-none leading-relaxed shadow-xs disabled:opacity-85"
            />
          </div>

          {/* Reveal & Recall Key */}
          {showRetrievalReveal ? (
            <div className="p-4 sm:p-5 bg-warm-paper border border-secondary/40 rounded-xl text-xs sm:text-sm text-mid space-y-1.5 leading-relaxed">
              <span className="font-semibold text-primary block flex items-center gap-1.5 text-accent">
                <Check size={14} />
                <span>Key Takeaway & Recall Model:</span>
              </span>
              <p className="font-serif text-primary/85 leading-relaxed">{week.retrievalCheck.reveal}</p>
            </div>
          ) : (
            <div className="pt-2">
              <button
                type="button"
                onClick={handleRcSubmit}
                disabled={!rcAnswers.prompt1.trim() && !rcAnswers.prompt2.trim()}
                className={`py-3 px-5 rounded-xl text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer ${
                  rcAnswers.prompt1.trim() || rcAnswers.prompt2.trim()
                    ? 'bg-accent hover:bg-[#654652] active:bg-[#533842] text-white cursor-pointer'
                    : 'bg-warm-paper border border-primary/15 text-mid/50 cursor-not-allowed'
                }`}
              >
                <span>Submit & View Recall Key</span>
                <ArrowRight size={13} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Reference Card Banner (if present - Format C reference-only techniques) */}
      {week.hasReferenceCard && (
        <div className="space-y-4">
          {(() => {
            const allMechanisms = content?.brief?.mechanisms || [];
            const activeMechanism = allMechanisms.find(m => m.key === week.mechanism) || allMechanisms[0];
            const referenceTechniques = activeMechanism?.techniques?.filter(t => t.format === 'C') || [];

            if (referenceTechniques.length === 0) {
              return (
                <div className="bg-white-paper border border-primary/15 rounded-2xl p-5 sm:p-6 space-y-2 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-accent">Format C</span>
                    <span className="text-[10px] uppercase font-mono bg-warm-paper border border-primary/15 text-mid px-2.5 py-0.5 rounded-full">
                      Reference-Only Card
                    </span>
                  </div>
                  <h3 className="font-serif text-base font-semibold text-primary">
                    Professional Support Pathway
                  </h3>
                  <p className="text-xs sm:text-sm text-mid leading-relaxed">
                    This technique is explained for reference but not practiced in-app. It is designed to be delivered with a licensed therapist.
                  </p>
                </div>
              );
            }

            return referenceTechniques.map((tech) => (
              <div key={tech.code} className="bg-white-paper border border-primary/15 rounded-2xl p-5 sm:p-6 space-y-3 shadow-xs">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-accent">{tech.code} (Format C)</span>
                  <span className="text-[10px] uppercase font-mono bg-warm-paper border border-primary/15 text-mid px-2.5 py-0.5 rounded-full font-semibold">
                    Reference-Only Professional Pathway
                  </span>
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-primary">
                    {tech.name}
                  </h3>
                  {tech.approach && (
                    <div className="text-xs text-accent font-medium mt-0.5">
                      Approach: {tech.approach}
                    </div>
                  )}
                </div>
                {tech.what && (
                  <p className="text-xs sm:text-sm text-primary/90 leading-relaxed font-sans" dangerouslySetInnerHTML={{ __html: tech.what }} />
                )}
                {tech.professionalNote && (
                  <div className="p-3.5 bg-accent/5 border border-accent/20 rounded-xl text-xs text-mid space-y-1 leading-relaxed">
                    <span className="font-semibold text-primary flex items-center gap-1.5">
                      <BookOpen size={13} className="text-accent flex-shrink-0" />
                      <span>Professional Guidance Note:</span>
                    </span>
                    <p>{tech.professionalNote}</p>
                  </div>
                )}
              </div>
            ));
          })()}
        </div>
      )}

      {/* Touch List Cards */}
      <div className="space-y-3">
        <h2 className="font-serif text-lg text-primary font-semibold">
          Week {week.num} Touches
        </h2>
        {touches.map((touch, idx) => {
          const isDone = completedTouches.includes(touch.id);
          return (
            <div
              key={touch.id}
              onClick={() => onSelectTouch(touch.id)}
              className={`border rounded-2xl p-4 sm:p-5 cursor-pointer transition-all flex items-center justify-between gap-3 shadow-xs ${
                isDone
                  ? 'bg-white-paper border-secondary/40 hover:border-secondary'
                  : 'bg-white-paper border-primary/10 hover:border-accent/40'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 border transition-all ${
                  isDone
                    ? 'bg-secondary/20 border-secondary text-primary'
                    : 'bg-warm-paper border-primary/15 text-primary'
                }`}>
                  {isDone ? <Check size={14} className="text-primary" /> : idx + 1}
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-primary">
                    {touch.title}
                  </h4>
                  <div className="text-xs text-mid">
                    {touch.role}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {touch.guardrail && (
                  <span className="text-[10px] uppercase font-mono text-accent bg-accent/10 border border-accent/25 px-2 py-0.5 rounded font-semibold">
                    Guided [B]
                  </span>
                )}
                <span className="text-xs font-semibold text-accent hover:underline flex items-center gap-0.5">
                  <span>{isDone ? 'Review' : 'Start Touch'}</span>
                  <ArrowRight size={12} />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Weekly MHPI Check-in */}
      <div className="bg-white-paper border border-primary/10 rounded-2xl p-5 sm:p-6 space-y-3 shadow-xs">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h3 className="font-serif text-base sm:text-lg font-semibold text-primary">
              Week {week.num} Check-in (MHPI)
            </h3>
            <p className="text-xs text-mid mt-0.5">
              3 quick questions to track your week-to-week changes.
            </p>
          </div>
          <button
            onClick={onOpenMhpiWeekly}
            className={`py-2.5 px-4 rounded-xl text-xs font-semibold transition-all border shadow-xs cursor-pointer ${
              isMhpiWeeklyDone
                ? 'bg-secondary/20 border-secondary text-primary'
                : isWeekTouchesDone
                ? 'bg-accent hover:bg-[#654652] active:bg-[#533842] text-white border-transparent'
                : 'bg-white-paper border-primary/15 text-primary hover:border-accent hover:bg-accent/5'
            }`}
          >
            {isMhpiWeeklyDone ? '✓ Check-in Saved' : 'Start Check-in'}
          </button>
        </div>
      </div>

      {/* Weekly Summary Card (if present) */}
      {week.summary && (
        <div className="bg-white-paper border border-primary/10 rounded-2xl p-5 sm:p-6 space-y-2 shadow-xs">
          <div className="text-[11px] uppercase tracking-widest text-accent font-bold">
            Week {week.num} Summary
          </div>
          <p className="text-xs sm:text-sm text-mid leading-relaxed font-serif">
            {week.summary}
          </p>
        </div>
      )}
    </div>
  );
}
