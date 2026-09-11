import React, { useState } from 'react';
import { Sparkles, Edit3, Layers, BarChart2, BookOpen, MessageSquare, ArrowRight, ShieldCheck } from 'lucide-react';

export default function ProductShowcase() {
  const [activePillar, setActivePillar] = useState('daily');

  const pillars = [
    {
      id: 'daily',
      number: '01',
      label: 'DAILY REFLECTION',
      title: 'The AI Mirror Engine & Open Threads',
      desc: 'Free-form and structured inquiry that reflects recurring subtext back to you without judgment, generating poignant open threads that stay active until addressed.',
      icon: Edit3
    },
    {
      id: 'patterns',
      number: '02',
      label: 'LONGITUDINAL PATTERNS',
      title: 'Deterministic 4-Stage Pattern Lifecycle',
      desc: 'Tracks behavioral loops across 30-day cycles with emerging, active, quiet, and re-emerging states. Patterns are never erased when inactive—they remain part of your story.',
      icon: Layers
    },
    {
      id: 'cycles',
      number: '03',
      label: 'CYCLE SYNTHESIS',
      title: '30-Day Psychometric & Vocabulary Reports',
      desc: 'Weekly and monthly milestone reports tracking your emotional vocabulary shifts, self-agency index, pattern rigidity, and distress trajectories.',
      icon: BarChart2
    },
    {
      id: 'modules',
      number: '04',
      label: 'PSYCHOEDUCATION',
      title: '19 Structured Psychoeducation Modules',
      desc: 'Evidence-based cognitive reframing courses designed for high-functioning adults, complete with baseline MHPI check-ins and tactile exercises.',
      icon: BookOpen
    }
  ];

  return (
    <div className="w-full space-y-10 py-6">
      {/* Pillar Navigation Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-5xl mx-auto">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;
          const isActive = activePillar === pillar.id;
          return (
            <button
              key={pillar.id}
              onClick={() => setActivePillar(pillar.id)}
              className={`p-4 rounded-xl text-left transition-all border cursor-pointer ${
                isActive
                  ? 'bg-white border-[#1E3633] shadow-sm ring-1 ring-[#1E3633]/10'
                  : 'bg-[#FAF8F5]/80 border-[#E7E0D3] hover:bg-white text-[#5E706A]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] font-bold text-[#758D7E]">
                  {pillar.number}
                </span>
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#1E3633]' : 'text-[#8E9E98]'}`} />
              </div>
              <h4 className={`text-xs sm:text-sm font-semibold leading-tight ${isActive ? 'text-[#1A2421]' : 'text-[#5E706A]'}`}>
                {pillar.label}
              </h4>
            </button>
          );
        })}
      </div>

      {/* Active Pillar Display */}
      <div className="max-w-5xl mx-auto bg-[#FAF8F5] rounded-2xl border border-[#E7E0D3] p-6 sm:p-10 shadow-xs">
        {activePillar === 'daily' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="font-mono text-xs font-semibold text-[#758D7E] uppercase tracking-wider">
                01 · THE MIRROR ENGINE
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif text-[#1A2421] leading-snug">
                Writing without self-editing gives you something real to work with.
              </h3>
              <p className="text-xs sm:text-sm text-[#5E706A] leading-relaxed">
                Ingress Within does not provide generic cheerleading. It acts as an honest mirror—noticing the gap between what happened and the story you tell yourself, then generating an unresolvable Open Thread to sit with throughout your day.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-medium text-[#1E3633]">
                <ShieldCheck className="w-4 h-4 text-[#758D7E]" />
                <span>Zero unsolicited advice. 100% private and unshared.</span>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-3">
              <div className="p-4 rounded-xl bg-white border border-[#E7E0D3] shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#758D7E]">
                  <span>DAILY JOURNAL PROMPT</span>
                  <span>DAY 06</span>
                </div>
                <p className="font-serif italic text-sm text-[#1A2421]">
                  "I kept saying yes to meetings today even though my calendar was packed. I'm afraid if I push back, people will think I can't handle my responsibilities."
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#EBF1ED] border border-[#D1E0D7] space-y-2">
                <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold tracking-wider uppercase text-[#1A5040]">
                  <Sparkles className="w-3.5 h-3.5" /> AI Mirror Reflection
                </div>
                <p className="font-serif italic text-xs text-[#1E3633] leading-relaxed">
                  "You noticed how the fear of being seen as overwhelmed turns boundary-setting into a perceived risk. Simply noticing this pattern creates room for intentional choice."
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border-l-3 border-l-[#E0A898] border border-[#E7E0D3] space-y-1">
                <span className="text-[10px] font-mono font-bold text-[#8A3020] uppercase tracking-wider block">
                  Active Open Thread
                </span>
                <p className="font-serif italic text-xs text-[#1A2421]">
                  "What would it look like to decline one request this week and observe what actually happens?"
                </p>
              </div>
            </div>
          </div>
        )}

        {activePillar === 'patterns' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="font-mono text-xs font-semibold text-[#B69186] uppercase tracking-wider">
                02 · LONGITUDINAL PATTERN ENGINE
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif text-[#1A2421] leading-snug">
                Quiet patterns are never erased. They remain part of your journey.
              </h3>
              <p className="text-xs sm:text-sm text-[#5E706A] leading-relaxed">
                When a pattern stops appearing strongly in recent entries, it enters the <strong>Quiet</strong> lifecycle state. It is never marked "cured" or deleted. When meaningful evidence returns, it seamlessly transitions to <strong>Re-emerging</strong>.
              </p>
              <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] font-mono">
                <div className="p-2 rounded bg-white border border-[#E7E0D3]">
                  <span className="font-bold text-[#1A5040]">● ACTIVE:</span> Sustained presence
                </div>
                <div className="p-2 rounded bg-white border border-[#E7E0D3]">
                  <span className="font-bold text-[#4A6A64]">○ QUIET:</span> Historical record
                </div>
                <div className="p-2 rounded bg-white border border-[#E7E0D3]">
                  <span className="font-bold text-[#5A4A8A]">◆ EMERGING:</span> Early signals
                </div>
                <div className="p-2 rounded bg-white border border-[#E7E0D3]">
                  <span className="font-bold text-[#8A3020]">▲ RE-EMERGING:</span> Returning trend
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-3">
              <div className="p-4 rounded-xl bg-white border border-[#E7E0D3] shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-serif text-sm font-semibold text-[#1A2421]">Cognitive Avoidance</span>
                  <span className="text-[9.5px] font-bold px-2.5 py-0.5 rounded-full bg-[#8DBFB4]/20 text-[#1A5040] border border-[#8DBFB4]/40">
                    Active · High Presence
                  </span>
                </div>
                <p className="text-xs text-[#5E706A] leading-relaxed">
                  Stepping into logistical busyness to postpone addressing emotionally charged conversations.
                </p>
                <div className="grid grid-cols-4 gap-1 pt-2 border-t border-[#F0ECE1] text-[10px] text-center font-mono">
                  <div className="p-1.5 rounded bg-[#FAF8F5]">
                    <span className="text-[#8E9E98] block">Step 1</span>
                    <strong className="text-[#1A2421]">Trigger</strong>
                  </div>
                  <div className="p-1.5 rounded bg-[#FAF8F5]">
                    <span className="text-[#8E9E98] block">Step 2</span>
                    <strong className="text-[#1A2421]">Notice</strong>
                  </div>
                  <div className="p-1.5 rounded bg-[#FAF8F5]">
                    <span className="text-[#8E9E98] block">Step 3</span>
                    <strong className="text-[#1A2421]">Pause</strong>
                  </div>
                  <div className="p-1.5 rounded bg-[#EBF1ED]">
                    <span className="text-[#1A5040] block">Step 4</span>
                    <strong className="text-[#1A5040]">Action</strong>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/70 border border-[#E7E0D3] opacity-85 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-serif text-sm font-medium text-[#4A6A64]">People Pleasing Dynamic</span>
                  <span className="text-[9.5px] font-bold px-2.5 py-0.5 rounded-full bg-[#1E2A2E]/8 text-[#4A6A64] border border-[#1E2A2E]/15">
                    Quiet · Last active Week 1
                  </span>
                </div>
                <p className="text-xs text-[#6A7E77] italic leading-relaxed">
                  "This pattern was observed earlier and has been quieter in your recent entries."
                </p>
              </div>
            </div>
          </div>
        )}

        {activePillar === 'cycles' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="font-mono text-xs font-semibold text-[#8FA0AF] uppercase tracking-wider">
                03 · 30-DAY CYCLE SYNTHESIS
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif text-[#1A2421] leading-snug">
                Psychometric trends and vocabulary expansion over time.
              </h3>
              <p className="text-xs sm:text-sm text-[#5E706A] leading-relaxed">
                At the conclusion of each 30-day cycle, Ingress Within compiles an in-depth longitudinal report synthesizing radar charts, words reached for, and distress trajectories.
              </p>
              <div className="p-3.5 rounded-xl bg-white border border-[#E7E0D3] text-xs text-[#5E706A] space-y-1">
                <strong className="text-[#1A2421] block">Tracked Across Cycles:</strong>
                <span>• Pattern Rigidity &amp; Persistence</span><br />
                <span>• Emotional Intensity Index</span><br />
                <span>• Perceived Self-Agency</span><br />
                <span>• Overall Direction (Distress Trajectory)</span>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-3">
              <div className="p-5 rounded-xl bg-white border border-[#E7E0D3] shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#F0ECE1] pb-3">
                  <div>
                    <span className="font-serif text-sm font-semibold text-[#1A2421] block">Cycle 1 Summary Report</span>
                    <span className="text-[10px] text-[#7A8E87]">Day 1 — Day 30 · 26 entries logged</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#1E3633] bg-[#EBF1ED] px-2.5 py-1 rounded-md">
                    Agency: 7.2 / 10
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between text-[#5E706A] mb-1">
                      <span>Emotional Intensity</span>
                      <span className="font-mono font-semibold">5.4 / 10 (Moderate)</span>
                    </div>
                    <div className="w-full bg-[#FAF8F5] h-2 rounded-full border border-[#EAE4D7]">
                      <div className="bg-[#B8A8D4] h-full w-[54%] rounded-full" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[#5E706A] mb-1">
                      <span>Pattern Persistence</span>
                      <span className="font-mono font-semibold">6.2 / 10 (Flexible)</span>
                    </div>
                    <div className="w-full bg-[#FAF8F5] h-2 rounded-full border border-[#EAE4D7]">
                      <div className="bg-[#E0A898] h-full w-[62%] rounded-full" />
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#E7E0D3] text-xs">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-[#758D7E] font-bold block mb-1">
                    PRIMARY VOCABULARY WORD REACHED FOR
                  </span>
                  <p className="font-serif italic text-[#1A2421]">
                    "Exhaustion" appeared 14 times, shifting from reactive fatigue to intentional boundary awareness.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activePillar === 'modules' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="font-mono text-xs font-semibold text-[#758D7E] uppercase tracking-wider">
                04 · PSYCHOEDUCATION LAB
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif text-[#1A2421] leading-snug">
                19 Clinical-Grade Modules for Self-Guided Learning.
              </h3>
              <p className="text-xs sm:text-sm text-[#5E706A] leading-relaxed">
                Structured mental fitness curriculums designed specifically for high-achieving adults navigating complex personal and professional landscapes.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                <div className="p-2.5 rounded-lg bg-white border border-[#E7E0D3]">
                  <strong className="text-[#1A2421] block">M19 · Anxiety</strong>
                  <span className="text-[#7A8E87] text-[11px]">Performance &amp; Achievement</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-[#E7E0D3]">
                  <strong className="text-[#1A2421] block">M18 · Burnout</strong>
                  <span className="text-[#7A8E87] text-[11px]">Pressure &amp; Energy Capacity</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-[#E7E0D3]">
                  <strong className="text-[#1A2421] block">M17 · Intimacy</strong>
                  <span className="text-[#7A8E87] text-[11px]">Communication &amp; Vulnerability</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-[#E7E0D3]">
                  <strong className="text-[#1A2421] block">M11 · Relational</strong>
                  <span className="text-[#7A8E87] text-[11px]">De-escalation &amp; Repair</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-3">
              <div className="p-5 rounded-xl bg-white border border-[#E7E0D3] shadow-2xs space-y-3">
                <div className="flex items-center justify-between text-xs border-b border-[#F0ECE1] pb-2">
                  <span className="font-mono text-[#758D7E] font-bold">MODULE 19 · WEEK 1 TOUCH</span>
                  <span className="text-[10px] font-mono text-[#8E9E98]">MHPI BASELINE</span>
                </div>
                <h5 className="font-serif text-base font-semibold text-[#1A2421]">
                  Deconstructing the Fear of Imperfect Execution
                </h5>
                <p className="text-xs text-[#5E706A] leading-relaxed">
                  "When you anticipate feedback on your work, notice whether your body prepares for dialogue or bracing against criticism."
                </p>
                <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#EAE4D7] text-xs space-y-1">
                  <span className="font-bold text-[#1E3633]">Cognitive Reframe Task:</span>
                  <p className="italic text-[#5E706A]">
                    Distinguish between standard of quality vs. fear of social disapproval.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

