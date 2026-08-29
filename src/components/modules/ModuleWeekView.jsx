import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Brain, Check, Sparkles } from 'lucide-react';

export default function ModuleWeekView({ content, weekIdx, playerState, onBackToWeekList, onSelectTouch, onOpenMhpiWeekly }) {
  const weeks = content?.weeks || [];
  const safeWeekIdx = Math.max(0, Math.min(weekIdx || 0, (weeks.length || 1) - 1));
  const week = weeks[safeWeekIdx] || weeks[0];
  const completedTouches = playerState?.completedTouches || [];

  const [showRetrievalReveal, setShowRetrievalReveal] = useState(false);

  if (!week) return null;

  const touches = week.touches || [];
  const weekCompletedCount = touches.filter(t => completedTouches.includes(t.id)).length;
  const isWeekTouchesDone = weekCompletedCount === touches.length && touches.length > 0;
  const isMhpiWeeklyDone = completedTouches.includes(`mhpi_w${week.num}`);

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

      {/* Retrieval Check Banner (if present) */}
      {week.retrievalCheck && (
        <div className="bg-white-paper border border-accent/25 rounded-2xl p-5 sm:p-6 space-y-3 shadow-xs">
          <div className="text-[11px] uppercase tracking-widest text-accent font-bold flex items-center gap-2">
            <Brain size={14} />
            <span>Retrieval Check — Review before continuing</span>
          </div>
          <div className="space-y-2 text-xs sm:text-sm text-primary/90 font-medium leading-relaxed">
            <p>1. {week.retrievalCheck.prompt1}</p>
            <p>2. {week.retrievalCheck.prompt2}</p>
          </div>
          {showRetrievalReveal ? (
            <div className="p-4 bg-warm-paper border border-secondary/40 rounded-xl text-xs sm:text-sm text-mid space-y-1 leading-relaxed">
              <span className="font-semibold text-primary block">Key Takeaway & Recall:</span>
              {week.retrievalCheck.reveal}
            </div>
          ) : (
            <button
              onClick={() => setShowRetrievalReveal(true)}
              className="text-xs font-semibold text-accent hover:underline cursor-pointer flex items-center gap-1 pt-1"
            >
              <span>Show Model Answer / Recall Key</span>
              <ArrowRight size={12} />
            </button>
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
