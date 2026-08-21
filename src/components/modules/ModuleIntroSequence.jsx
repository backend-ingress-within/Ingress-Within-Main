import React from 'react';
import { ArrowLeft, ArrowRight, ShieldCheck, ShieldAlert, Sparkles } from 'lucide-react';

export default function ModuleIntroSequence({ content, step, onNextStep, onPrevStep }) {
  const screens = content?.introScreens || [];
  const safeStep = Math.max(0, Math.min(step || 0, (screens.length || 1) - 1));
  const currentScreen = screens[safeStep] || screens[0];
  const mechanisms = content?.brief?.mechanisms || [];

  if (!currentScreen) return null;

  const bodyParagraphs = Array.isArray(currentScreen.body)
    ? currentScreen.body
    : currentScreen.body ? [currentScreen.body] : [];

  return (
    <div className="space-y-6">
      {/* Top Progress Dots */}
      <div className="flex items-center justify-between gap-3 pb-2">
        <button
          onClick={onPrevStep}
          className="text-xs font-semibold text-mid hover:text-accent flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft size={13} />
          <span>{safeStep === 0 ? 'Back to Overview' : 'Previous'}</span>
        </button>
        <div className="flex gap-1.5 flex-1 max-w-[200px]">
          {screens.map((_, idx) => (
            <span
              key={idx}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                idx === safeStep ? 'bg-accent' : idx < safeStep ? 'bg-secondary' : 'bg-primary/10'
              }`}
            />
          ))}
        </div>
        <span className="text-xs font-mono text-mid font-medium">
          {safeStep + 1}/{screens.length}
        </span>
      </div>

      {/* Main Screen Card */}
      <div className="bg-white-paper border border-primary/10 rounded-2xl p-6 sm:p-8 space-y-5 shadow-xs">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-accent font-bold">
          <Sparkles size={13} />
          <span>{currentScreen.eyebrow}</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-primary leading-tight">
          {currentScreen.title}
        </h2>

        {/* Screen Paragraphs */}
        <div className="space-y-3.5">
          {bodyParagraphs.map((p, idx) => (
            <p key={idx} className="text-sm sm:text-[15px] text-mid leading-relaxed font-serif">
              {p}
            </p>
          ))}
        </div>

        {/* Theory Grounding Custom Listing */}
        {currentScreen.theory && (
          <div className="space-y-4 pt-5 border-t border-primary/10 mt-5">
            <h3 className="font-serif text-lg text-primary font-semibold">
              Techniques Grounding by Mechanism
            </h3>
            {mechanisms.map(m => (
              <div key={m.key} className="bg-warm-paper border border-primary/10 rounded-xl p-4 sm:p-5 space-y-3">
                <div className="font-semibold text-sm text-primary">
                  Mechanism {m.key}: {m.name}
                </div>
                <div className="space-y-2.5">
                  {m.techniques.map(t => (
                    <div key={t.code} className="bg-white-paper rounded-xl p-3.5 sm:p-4 text-xs space-y-2 border border-primary/10 shadow-xs">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-accent font-bold">{t.code}</span>
                          <span className="font-semibold text-primary">{t.name}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                          t.format === 'C' ? 'bg-accent/10 text-accent border border-accent/25' :
                          t.format === 'B' ? 'bg-secondary/20 text-primary border border-secondary/40' :
                          'bg-warm-paper text-primary border border-primary/15'
                        }`}>
                          Format {t.format} {t.format === 'C' ? '(Reference-Only)' : t.format === 'B' ? '(Guided)' : '(Interactive)'}
                        </span>
                      </div>
                      <p className="text-mid leading-relaxed">{t.what}</p>

                      {/* Format C Therapist Note */}
                      {t.format === 'C' && t.professionalNote && (
                        <div className="mt-2.5 p-3 bg-warm-paper border border-accent/20 rounded-lg text-xs text-primary/90 space-y-1">
                          <span className="font-semibold uppercase tracking-wider text-[10px] text-accent block">
                            Therapist & Reference Note:
                          </span>
                          <p className="leading-relaxed text-mid">{t.professionalNote}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Consent Checkbox / Info */}
        {currentScreen.consent && (
          <div className="p-4 bg-warm-paper border border-secondary/30 rounded-xl text-xs text-primary flex items-center gap-2.5">
            <ShieldCheck size={16} className="text-primary shrink-0" />
            <span>Your journal entries are encrypted and accessible only to you and your practitioner.</span>
          </div>
        )}

        {/* Crisis Button */}
        {currentScreen.crisisButton && (
          <div className="pt-2">
            <button
              onClick={() => alert("Crisis Helplines:\nTeleMANAS: 14416 / 1800 891 4416\nKIRAN: 1800-599-0019\nVandrevala Foundation: +91 9999 666 555")}
              className="w-full py-3 px-4 bg-error-subtle border border-error/30 hover:bg-error/15 text-error text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <ShieldAlert size={14} />
              <span>Emergency Helpline Support Resources (KIRAN / TeleMANAS)</span>
            </button>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-3">
        {step > 0 && (
          <button
            onClick={onPrevStep}
            className="flex-1 py-3.5 px-4 bg-white-paper border border-primary/15 hover:border-accent hover:bg-accent/5 text-primary font-semibold rounded-xl text-sm transition-all cursor-pointer shadow-xs"
          >
            Previous
          </button>
        )}
        <button
          onClick={onNextStep}
          className="flex-1 py-3.5 px-4 bg-accent hover:bg-[#654652] active:bg-[#533842] text-white font-semibold rounded-xl text-sm transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>{currentScreen.cta || (safeStep === screens.length - 1 ? 'Proceed' : 'Continue')}</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
