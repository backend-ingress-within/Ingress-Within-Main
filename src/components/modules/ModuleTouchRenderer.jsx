import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, ShieldAlert, Sparkles, AlertTriangle } from 'lucide-react';

export default function ModuleTouchRenderer({ content, touchId, playerState, updateState, onBackToWeek }) {
  // Find current touch across all weeks
  let touch = null;
  let technique = null;

  if (content && touchId) {
    for (const week of (content?.weeks || [])) {
      const found = (week?.touches || []).find(t => t.id === touchId);
      if (found) {
        touch = found;
        break;
      }
    }
    // Also search technique if touch is format C or technique ID
    if (content.brief?.mechanisms) {
      for (const m of content.brief.mechanisms) {
        const tFound = m.techniques.find(t => t.code === touchId || t.code === touch?.role?.split(' ')?.[1]);
        if (tFound) technique = tFound;
      }
    }
  }

  // Active step inside touch: 'relate' | 'think' | 'apply' | 'distress_check' | 'reveal' | 'remember'
  const [step, setStep] = useState(playerState?.touchStep || 'relate');

  // Answers state
  const touchAnswers = playerState?.userAnswers?.[touchId] || {};
  const [selectedTapOpt, setSelectedTapOpt] = useState(touchAnswers.selectedTapOpt ?? null);
  const [thinkWhyText, setThinkWhyText] = useState(touchAnswers.thinkWhyText || '');
  const [thinkOpenText, setThinkOpenText] = useState(touchAnswers.thinkOpenText || '');
  const [selectedIntensity, setSelectedIntensity] = useState(touchAnswers.selectedIntensity ?? null);
  const [applyText, setApplyText] = useState(touchAnswers.applyText || '');
  const [distressRating, setDistressRating] = useState(touchAnswers.distressRating ?? null);
  const [rememberText, setRememberText] = useState(touchAnswers.rememberText || '');
  const [escalationWarning, setEscalationWarning] = useState(null);

  React.useEffect(() => {
    setStep('relate');
    const answers = playerState?.userAnswers?.[touchId] || {};
    setSelectedTapOpt(answers.selectedTapOpt ?? null);
    setThinkWhyText(answers.thinkWhyText || '');
    setThinkOpenText(answers.thinkOpenText || '');
    setSelectedIntensity(answers.selectedIntensity ?? null);
    setApplyText(answers.applyText || '');
    setDistressRating(answers.distressRating ?? null);
    setRememberText(answers.rememberText || '');
    setEscalationWarning(null);
  }, [touchId]);

  if (!touch && !technique) {
    return (
      <div className="bg-white-paper border border-primary/10 rounded-2xl p-8 text-center space-y-4 shadow-xs">
        <p className="text-sm text-mid">Touch '{touchId}' not found.</p>
        <button
          onClick={onBackToWeek}
          className="px-5 py-2.5 bg-accent hover:bg-[#654652] active:bg-[#533842] text-white font-semibold rounded-xl text-xs transition-all shadow-xs cursor-pointer"
        >
          Return to Week
        </button>
      </div>
    );
  }

  // Handle Format C (Reference-Only Card)
  // Format C: no Apply, no Reveal, no Remember, no free-text answer, no escalation, no completion tracking.
  if (technique && technique.format === 'C') {
    return (
      <div className="space-y-6">
        <button
          onClick={onBackToWeek}
          className="text-xs font-semibold text-mid hover:text-accent flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft size={13} />
          <span>Back to Week</span>
        </button>

        <div className="bg-white-paper border border-primary/15 rounded-2xl p-6 sm:p-8 space-y-5 shadow-xs">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="font-mono text-xs font-bold text-accent">{technique.code}</span>
            <span className="text-[10px] uppercase font-mono bg-warm-paper border border-primary/15 text-mid px-2.5 py-0.5 rounded-full font-semibold">
              Format C — Reference-Only
            </span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-primary leading-tight">
            {technique.name}
          </h2>

          <div className="text-xs text-mid font-mono border-b border-primary/5 pb-3">
            Approach: <strong className="text-primary">{technique.approach}</strong> • Source: <strong className="text-primary">{technique.source}</strong>
          </div>

          <div className="space-y-4 pt-1 text-sm sm:text-[15px] text-mid leading-relaxed">
            <div className="space-y-1">
              <strong className="text-primary block font-sans text-xs uppercase tracking-wider font-semibold">What it is:</strong>
              <p className="font-serif text-primary/85">{technique.what}</p>
            </div>
            <div className="space-y-1">
              <strong className="text-primary block font-sans text-xs uppercase tracking-wider font-semibold">How it works:</strong>
              <p className="font-serif text-primary/85">{technique.how}</p>
            </div>
            <div className="space-y-1">
              <strong className="text-primary block font-sans text-xs uppercase tracking-wider font-semibold">Why it's referenced:</strong>
              <p className="font-serif text-primary/85">{technique.why}</p>
            </div>
          </div>

          {technique.professionalNote && (
            <div className="mt-4 p-4 bg-warm-paper border border-accent/25 rounded-xl space-y-1.5 text-xs sm:text-sm text-primary/90">
              <span className="font-semibold uppercase tracking-wider text-[10px] text-accent block">
                Professional / Therapist Guidance:
              </span>
              <p className="leading-relaxed text-mid">{technique.professionalNote}</p>
            </div>
          )}
        </div>

        <button
          onClick={onBackToWeek}
          className="w-full py-3.5 px-4 bg-white-paper hover:bg-warm-paper border border-primary/15 text-primary font-semibold rounded-xl text-sm transition-all shadow-xs cursor-pointer"
        >
          Close Reference Card
        </button>
      </div>
    );
  }

  // Safety escalation offline scan helper
  const checkTextEscalation = (text) => {
    if (!text) return null;
    const lower = text.toLowerCase();
    const t1 = ["kill myself", "end my life", "suicide", "don't want to live"];
    const t2 = ["worthless", "fundamental failure", "everyone better off without me"];
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

  const saveTouchProgress = (finalStep, isComplete = false) => {
    const newAnswers = {
      selectedTapOpt,
      thinkWhyText,
      thinkOpenText,
      selectedIntensity,
      applyText,
      distressRating,
      rememberText
    };

    // Scan text for escalation
    const flag = checkTextEscalation(`${thinkWhyText} ${thinkOpenText} ${applyText} ${rememberText}`);
    setEscalationWarning(flag);

    updateState(prev => {
      const updatedTouches = isComplete
        ? Array.from(new Set([...(prev.completedTouches || []), touchId]))
        : prev.completedTouches;

      return {
        ...prev,
        touchStep: finalStep,
        completedTouches: updatedTouches,
        userAnswers: {
          ...prev.userAnswers,
          [touchId]: newAnswers
        }
      };
    });
  };

  const isGuardrailed = touch.guardrail || false;

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-primary/10 flex-wrap">
        <button
          onClick={onBackToWeek}
          className="text-xs font-semibold text-mid hover:text-accent flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft size={13} />
          <span>Back to Week</span>
        </button>
        <div className="flex items-center gap-2">
          {isGuardrailed && (
            <span className="text-[10px] uppercase font-mono text-accent bg-accent/10 border border-accent/25 px-2 py-0.5 rounded font-semibold">
              Guided [B]
            </span>
          )}
          <span className="text-xs font-mono font-semibold text-primary bg-warm-paper border border-primary/15 px-2.5 py-0.5 rounded-full">{touch.role}</span>
        </div>
      </div>

      {/* Safety Escalation Warning Banner */}
      {escalationWarning && (
        <div className="p-4 bg-error-subtle border border-error/30 rounded-xl text-xs text-error space-y-1.5 shadow-xs">
          <span className="font-semibold text-error flex items-center gap-1.5">
            <AlertTriangle size={14} />
            <span>Safety Resource Notification</span>
          </span>
          <p className="leading-relaxed">{escalationWarning}</p>
        </div>
      )}

      {/* Touch Card Header */}
      <div className="bg-white-paper border border-primary/10 rounded-2xl p-5 sm:p-6 space-y-2 shadow-xs">
        <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-primary">
          {touch.title}
        </h1>
        {touch.delayedRef && touch.delayedPrompt && (
          <div className="p-3.5 bg-warm-paper border border-accent/25 rounded-xl text-xs text-accent italic leading-relaxed">
            <strong className="not-italic font-semibold text-primary mr-1">Memory Anchor:</strong> {touch.delayedPrompt}
          </div>
        )}
      </div>

      {/* STEP 1: RELATE BEAT */}
      {step === 'relate' && (
        <div className="bg-white-paper border border-primary/10 rounded-2xl p-6 sm:p-8 space-y-5 shadow-xs">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-accent font-bold">
            <Sparkles size={13} />
            <span>Beat 1 · Relate</span>
          </div>
          <div className="space-y-3.5 text-sm sm:text-[15px] text-mid leading-relaxed font-serif">
            {touch.relate.text.map((p, idx) => (
              <p key={idx} dangerouslySetInnerHTML={{ __html: p }} />
            ))}
          </div>

          <button
            onClick={() => {
              saveTouchProgress('think');
              setStep('think');
            }}
            className="w-full py-4 px-5 bg-accent hover:bg-[#654652] active:bg-[#533842] text-white font-semibold rounded-xl text-sm transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer mt-4"
          >
            <span>Next: Think Beat</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* STEP 2: THINK BEAT */}
      {step === 'think' && (
        <div className="bg-white-paper border border-primary/10 rounded-2xl p-6 sm:p-8 space-y-5 shadow-xs">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-accent font-bold">
            <Sparkles size={13} />
            <span>Beat 2 · Think</span>
          </div>
          <p className="text-sm sm:text-[15px] font-semibold text-primary leading-snug">
            {touch.think.prompt}
          </p>

          {/* Mode TAP */}
          {touch.think.mode === 'tap' && touch.think.options && (
            <div className="space-y-3 pt-2">
              {touch.think.options.map((optItem, idx) => {
                const isSelected = selectedTapOpt === idx;
                return (
                  <div key={idx} className="space-y-2">
                    <button
                      type="button"
                      onClick={() => setSelectedTapOpt(idx)}
                      className={`w-full text-left p-4 rounded-xl border text-sm transition-all shadow-xs cursor-pointer ${
                        isSelected
                          ? 'bg-accent/5 border-accent text-primary ring-1 ring-accent/20 font-medium'
                          : 'bg-white-paper border-primary/15 text-mid hover:border-accent/40 hover:text-primary'
                      }`}
                    >
                      {optItem.label}
                    </button>
                    {isSelected && (
                      <div className="p-4 bg-warm-paper border border-accent/20 rounded-xl text-xs sm:text-sm text-primary/90 leading-relaxed">
                        <span className="font-semibold text-accent block mb-1">
                          {optItem.isTarget ? 'Key Insight:' : 'Consideration:'}
                        </span>
                        {optItem.explain}
                      </div>
                    )}
                  </div>
                );
              })}

              {touch.think.whyPrompt && (
                <div className="space-y-2 pt-3">
                  <label className="text-xs font-semibold text-primary block">
                    {touch.think.whyPrompt}
                  </label>
                  <textarea
                    value={thinkWhyText}
                    onChange={(e) => setThinkWhyText(e.target.value)}
                    placeholder="Your explanation in a few words..."
                    rows={2}
                    className="w-full bg-warm-paper border border-primary/15 focus:border-accent focus:ring-1 focus:ring-accent/20 rounded-xl p-3.5 text-xs sm:text-sm text-primary placeholder-mid/40 outline-none leading-relaxed shadow-xs"
                  />
                </div>
              )}
            </div>
          )}

          {/* Mode OPEN */}
          {touch.think.mode === 'open' && (
            <div className="pt-2">
              <textarea
                value={thinkOpenText}
                onChange={(e) => setThinkOpenText(e.target.value)}
                placeholder={touch.think.placeholder || 'Your answer...'}
                rows={3}
                className="w-full bg-warm-paper border border-primary/15 focus:border-accent focus:ring-1 focus:ring-accent/20 rounded-xl p-4 text-sm text-primary placeholder-mid/40 outline-none leading-relaxed shadow-xs"
              />
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setStep('relate')}
              className="flex-1 py-3.5 px-4 bg-white-paper border border-primary/15 hover:border-accent hover:bg-accent/5 text-primary font-semibold rounded-xl text-xs sm:text-sm transition-all cursor-pointer shadow-xs"
            >
              ← Back
            </button>
            <button
              onClick={() => {
                saveTouchProgress('apply');
                setStep('apply');
              }}
              disabled={touch.think.mode === 'tap' ? selectedTapOpt === null : !thinkOpenText.trim()}
              className={`flex-1 py-3.5 px-4 rounded-xl font-semibold text-xs sm:text-sm transition-all shadow-xs flex items-center justify-center gap-1.5 ${
                (touch.think.mode === 'tap' ? selectedTapOpt !== null : thinkOpenText.trim())
                  ? 'bg-accent hover:bg-[#654652] active:bg-[#533842] text-white cursor-pointer'
                  : 'bg-warm-paper border border-primary/10 text-mid/50 cursor-not-allowed'
              }`}
            >
              <span>Next: Apply Beat</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: APPLY BEAT */}
      {step === 'apply' && (
        <div className="bg-white-paper border border-primary/10 rounded-2xl p-6 sm:p-8 space-y-5 shadow-xs">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-accent font-bold">
            <Sparkles size={13} />
            <span>Beat 3 · Apply</span>
          </div>
          <div className="p-4 sm:p-5 bg-warm-paper border border-primary/10 rounded-xl text-xs sm:text-sm text-mid leading-relaxed">
            <strong className="text-primary block mb-1 font-sans text-xs uppercase tracking-wider font-semibold">Scenario context:</strong>
            <p className="font-serif text-primary/85">{touch.apply.scenario}</p>
          </div>

          {/* Format B Intensity Selector */}
          {touch.apply.intensityPrompt && touch.apply.intensityOptions && (
            <div className="space-y-2 pt-2">
              <label className="text-xs font-semibold text-primary block">
                {touch.apply.intensityPrompt}
              </label>
              <div className="grid gap-2">
                {touch.apply.intensityOptions.map((optText, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedIntensity(idx)}
                    className={`p-3.5 text-left rounded-xl border text-xs sm:text-sm font-medium transition-all shadow-xs cursor-pointer ${
                      selectedIntensity === idx
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

          <div className="space-y-2 pt-2">
            <label className="text-xs font-semibold text-primary block">
              {touch.apply.prompt}
            </label>
            <textarea
              value={applyText}
              onChange={(e) => setApplyText(e.target.value)}
              placeholder={touch.apply.placeholder || 'Your answer...'}
              rows={4}
              className="w-full bg-warm-paper border border-primary/15 focus:border-accent focus:ring-1 focus:ring-accent/20 rounded-xl p-4 text-sm text-primary placeholder-mid/40 outline-none leading-relaxed shadow-xs"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setStep('think')}
              className="flex-1 py-3.5 px-4 bg-white-paper border border-primary/15 hover:border-accent hover:bg-accent/5 text-primary font-semibold rounded-xl text-xs sm:text-sm transition-all cursor-pointer shadow-xs"
            >
              ← Back
            </button>
            <button
              onClick={() => {
                if (isGuardrailed && touch.distressPrompt) {
                  saveTouchProgress('distress_check');
                  setStep('distress_check');
                } else {
                  saveTouchProgress('reveal');
                  setStep('reveal');
                }
              }}
              disabled={!applyText.trim()}
              className={`flex-1 py-3.5 px-4 rounded-xl font-semibold text-xs sm:text-sm transition-all shadow-xs flex items-center justify-center gap-1.5 ${
                applyText.trim()
                  ? 'bg-accent hover:bg-[#654652] active:bg-[#533842] text-white cursor-pointer'
                  : 'bg-warm-paper border border-primary/10 text-mid/50 cursor-not-allowed'
              }`}
            >
              <span>{isGuardrailed ? 'Next: Safety Check' : 'Next: Reveal'}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3.5: DISTRESS CHECK-IN (Format B Guardrailed) */}
      {step === 'distress_check' && (
        <div className="bg-white-paper border border-accent/30 rounded-2xl p-6 sm:p-8 space-y-5 shadow-xs">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-accent font-bold">
            <ShieldAlert size={14} />
            <span>Format B Guardrail · Safety Check-in</span>
          </div>
          <p className="text-sm sm:text-[15px] font-medium text-primary">
            {touch.distressPrompt}
          </p>

          <div className="space-y-2.5 pt-2">
            <label className="text-xs text-mid block font-medium">Rate your distress level (0 = Calm, 10 = Severe Distress):</label>
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {Array.from({ length: 11 }, (_, i) => i).map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setDistressRating(val)}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-xs font-semibold flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                    distressRating === val
                      ? 'bg-accent text-white font-bold shadow-xs scale-105 border border-accent'
                      : 'bg-white-paper border border-primary/15 text-primary hover:border-accent/40 hover:bg-warm-paper'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          {distressRating !== null && distressRating >= 7 && (
            <div className="p-4 bg-error-subtle border border-error/30 rounded-xl text-xs text-error space-y-1 shadow-xs">
              <strong className="block text-error font-semibold">Safety Guidance Notice</strong>
              <p className="leading-relaxed">You reported elevated distress ({distressRating}/10). If this practice feels too overwhelming right now, take a moment to ground yourself, pause, or reach out to a trusted professional or support resource.</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setStep('apply')}
              className="flex-1 py-3.5 px-4 bg-white-paper border border-primary/15 hover:border-accent hover:bg-accent/5 text-primary font-semibold rounded-xl text-xs sm:text-sm transition-all cursor-pointer shadow-xs"
            >
              ← Back to Apply
            </button>
            <button
              onClick={() => {
                saveTouchProgress('reveal');
                setStep('reveal');
              }}
              disabled={distressRating === null}
              className={`flex-1 py-3.5 px-4 rounded-xl font-semibold text-xs sm:text-sm transition-all shadow-xs flex items-center justify-center gap-1.5 ${
                distressRating !== null
                  ? 'bg-accent hover:bg-[#654652] active:bg-[#533842] text-white cursor-pointer'
                  : 'bg-warm-paper border border-primary/10 text-mid/50 cursor-not-allowed'
              }`}
            >
              <span>Continue to Reveal</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: REVEAL BEAT */}
      {step === 'reveal' && (
        <div className="bg-white-paper border border-primary/10 rounded-2xl p-6 sm:p-8 space-y-5 shadow-xs">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-accent font-bold">
            <Sparkles size={13} />
            <span>Beat 4 · Model Reveal</span>
          </div>
          <div className="p-5 bg-warm-paper border-l-4 border-accent border-y border-r border-primary/10 rounded-xl text-sm sm:text-[15px] text-primary leading-relaxed font-serif shadow-xs">
            <strong className="text-accent block mb-1 font-sans text-xs uppercase tracking-wider font-semibold not-italic">Model takeaway:</strong>
            {touch.reveal.text}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setStep(isGuardrailed ? 'distress_check' : 'apply')}
              className="flex-1 py-3.5 px-4 bg-white-paper border border-primary/15 hover:border-accent hover:bg-accent/5 text-primary font-semibold rounded-xl text-xs sm:text-sm transition-all cursor-pointer shadow-xs"
            >
              ← Back
            </button>
            <button
              onClick={() => {
                saveTouchProgress('remember');
                setStep('remember');
              }}
              className="flex-1 py-3.5 px-4 bg-accent hover:bg-[#654652] active:bg-[#533842] text-white font-semibold rounded-xl text-xs sm:text-sm transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Next: Personal Takeaway</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: REMEMBER BEAT */}
      {step === 'remember' && (
        <div className="bg-white-paper border border-primary/10 rounded-2xl p-6 sm:p-8 space-y-5 shadow-xs">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-accent font-bold">
            <Sparkles size={13} />
            <span>Beat 5 · Remember & Commit</span>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-primary block leading-snug">
              {touch.remember.prompt}
            </label>
            <textarea
              value={rememberText}
              onChange={(e) => setRememberText(e.target.value)}
              placeholder={touch.remember.placeholder || 'Your answer...'}
              rows={3}
              className="w-full bg-warm-paper border border-primary/15 focus:border-accent focus:ring-1 focus:ring-accent/20 rounded-xl p-4 text-sm text-primary placeholder-mid/40 outline-none leading-relaxed shadow-xs"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setStep('reveal')}
              className="flex-1 py-3.5 px-4 bg-white-paper border border-primary/15 hover:border-accent hover:bg-accent/5 text-primary font-semibold rounded-xl text-xs sm:text-sm transition-all cursor-pointer shadow-xs"
            >
              ← Back
            </button>
            <button
              onClick={() => {
                saveTouchProgress('remember', true); // Mark touch complete!
                onBackToWeek();
              }}
              disabled={!rememberText.trim()}
              className={`flex-1 py-3.5 px-4 rounded-xl font-semibold text-sm transition-all shadow-xs flex items-center justify-center gap-1.5 ${
                rememberText.trim()
                  ? 'bg-accent hover:bg-[#654652] active:bg-[#533842] text-white cursor-pointer'
                  : 'bg-warm-paper border border-primary/10 text-mid/50 cursor-not-allowed'
              }`}
            >
              <Check size={16} />
              <span>Complete Touch</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
