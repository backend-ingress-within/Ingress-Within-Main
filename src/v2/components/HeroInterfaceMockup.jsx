import React, { useState, useEffect } from 'react';
import { Sparkles, Edit3, Compass, Lock, MessageSquare, BookOpen, Layers, BarChart2, Activity } from 'lucide-react';

export default function HeroInterfaceMockup() {
  const [typedText, setTypedText] = useState('');
  const [activeTab, setActiveTab] = useState('Journal');
  const [showReflection, setShowReflection] = useState(false);

  const samplePhrase = "I noticed I started over-explaining my schedule when my manager asked for a quick update. I felt an immediate urge to justify why every minute was spent, even though no one questioned my output...";

  useEffect(() => {
    let index = 0;
    let isTyping = true;
    let timer = null;

    const tick = () => {
      if (isTyping) {
        if (index < samplePhrase.length) {
          setTypedText(samplePhrase.slice(0, index + 1));
          index++;
          timer = setTimeout(tick, 30);
        } else {
          isTyping = false;
          setShowReflection(true);
          timer = setTimeout(tick, 5000);
        }
      } else {
        index = 0;
        isTyping = true;
        setTypedText('');
        setShowReflection(false);
        timer = setTimeout(tick, 1000);
      }
    };

    timer = setTimeout(tick, 800);
    return () => clearTimeout(timer);
  }, []);

  const navItems = [
    { name: 'Dashboard', icon: Compass },
    { name: 'Journal', icon: Edit3 },
    { name: 'Open Threads', icon: MessageSquare },
    { name: 'Patterns', icon: Layers },
    { name: 'Vocabulary', icon: Activity },
    { name: 'Cycle Reports', icon: BarChart2 },
    { name: 'Modules', icon: BookOpen }
  ];

  return (
    <div className="relative w-full max-w-5xl mx-auto rounded-2xl bg-white border border-[#E7E0D3] shadow-2xl overflow-hidden font-sans text-[#1A2421]">
      {/* Window Controls & Top Header */}
      <div className="px-5 py-3.5 bg-[#FAF8F5] border-b border-[#E7E0D3] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#D4897E]/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#D8BA7B]/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#82A38D]/70" />
        </div>

        <div className="flex items-center gap-2 text-xs text-[#7A8E87]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#758D7E]" />
          <span className="font-mono text-[10px] tracking-wider uppercase">INGRESS WITHIN · PRIVATE SESSION · CYCLE 1 · DAY 06</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#EBF1ED] text-[#1E3633] text-[10px] font-semibold flex items-center justify-center">
            A
          </div>
        </div>
      </div>

      {/* Main Mockup Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[480px]">
        {/* Left Sidebar */}
        <div className="hidden md:block md:col-span-3 border-r border-[#E7E0D3] bg-[#FAF8F5]/60 p-4 space-y-6">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => setActiveTab(item.name)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2.5 ${
                    isActive
                      ? 'bg-white text-[#1E3633] shadow-xs border border-[#E7E0D3] font-semibold'
                      : 'text-[#6A7E77] hover:text-[#1A2421] hover:bg-white/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{item.name}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-6 border-t border-[#E7E0D3]/60 px-2 space-y-2">
            <span className="font-mono text-[9px] uppercase tracking-wider text-[#8DBFB4] font-semibold block">
              CYCLE TRAJECTORY
            </span>
            <p className="text-[11px] font-serif italic text-[#7A8E87] leading-relaxed">
              "Reflective stance showed steady self-agency and exploratory awareness."
            </p>
          </div>
        </div>

        {/* Center Canvas */}
        <div className="col-span-1 md:col-span-9 p-6 sm:p-8 flex flex-col justify-between space-y-5">
          {/* Greeting & Date */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F0ECE1] pb-3">
            <div>
              <h3 className="text-xl sm:text-2xl font-serif text-[#1A2421] tracking-tight">
                Daily Reflection
              </h3>
              <p className="text-xs text-[#6A7E77] mt-0.5">
                Write freely. The AI mirror reflects what is present without judgment.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#7A8E87] bg-[#FAF8F5] px-2.5 py-1 rounded-md border border-[#E7E0D3]">
              <span>Cycle 1</span>
              <span>·</span>
              <span className="text-[#1E3633] font-semibold">Day 06 of 30</span>
            </div>
          </div>

          {/* Reflection Input Card */}
          <div className="bg-[#FAF8F5] rounded-xl p-4 border border-[#E7E0D3] space-y-3">
            <div className="text-xs font-serif italic text-[#6A7E77]">
              What's on your mind right now?
            </div>
            <div className="min-h-[56px] text-sm text-[#1A2421] font-sans leading-relaxed">
              {typedText}
              <span className="inline-block w-1.5 h-4 ml-1 bg-[#1E3633] animate-pulse align-middle" />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#EAE4D7] text-[11px] text-[#6A7E77]">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white border border-[#DCD5C5] text-[#1E3633]">
                  <Edit3 className="w-3 h-3" /> Guided
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white border border-[#DCD5C5]">
                  <Lock className="w-3 h-3" /> Private
                </span>
              </div>
              <span className="font-mono text-[10px] text-[#8E9E98]">
                Auto-saved
              </span>
            </div>
          </div>

          {/* AI Mirror & Open Thread Reveal */}
          {showReflection && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 transition-all duration-300">
              <div className="p-3.5 rounded-xl bg-[#EBF1ED] border border-[#D1E0D7] space-y-1.5">
                <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold tracking-wider uppercase text-[#1A5040]">
                  <Sparkles className="w-3 h-3" /> The Mirror Reflection
                </div>
                <p className="font-serif italic text-xs text-[#1E3633] leading-relaxed">
                  "You noticed an urge to justify your time before anyone asked. Naming this tension separates your actual work from the urgency of anxiety."
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF8F5] border-l-3 border-l-[#E0A898] border border-[#E7E0D3] space-y-1.5">
                <div className="text-[10px] font-mono font-bold tracking-wider uppercase text-[#8A3020]">
                  Open Thread Question
                </div>
                <p className="font-serif italic text-xs text-[#1A2421] leading-relaxed">
                  "What is the outcome you are attempting to prevent by justifying yourself before anyone asks?"
                </p>
              </div>
            </div>
          )}

          {/* Patterns & Psychometrics Bottom Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 border-t border-[#F0ECE1]">
            {/* Longitudinal Pattern Status */}
            <div className="p-3.5 rounded-xl border border-[#E7E0D3] bg-white space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#1A2421]">Longitudinal Patterns</span>
                <span className="text-[9.5px] font-mono text-[#758D7E] uppercase">Cycle 1 Tracking</span>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between p-1.5 rounded-lg bg-[#FAF8F5] text-xs">
                  <span className="font-medium text-[#1A2421]">Over-Responsibility</span>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#E0A898]/20 text-[#8A3020] border border-[#E0A898]/40">Active</span>
                </div>
                <div className="flex items-center justify-between p-1.5 rounded-lg bg-[#FAF8F5] text-xs">
                  <span className="font-medium text-[#1A2421]">Cognitive Avoidance</span>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#8DBFB4]/20 text-[#1A5040] border border-[#8DBFB4]/40">Active</span>
                </div>
                <div className="flex items-center justify-between p-1.5 rounded-lg bg-[#FAF8F5] text-xs">
                  <span className="font-medium text-[#6A7E77]">People Pleasing</span>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#1E2A2E]/8 text-[#4A6A64] border border-[#1E2A2E]/15">Quiet</span>
                </div>
              </div>
            </div>

            {/* Cycle Psychometrics */}
            <div className="p-3.5 rounded-xl border border-[#E7E0D3] bg-white space-y-2 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#1A2421]">Cycle Psychometrics</span>
                <span className="text-[9.5px] font-mono text-[#758D7E]">30-Day Synthesis</span>
              </div>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-[11px] text-[#5E706A] mb-1">
                    <span>Self-Agency</span>
                    <span className="font-mono font-semibold text-[#1E3633]">7.2 / 10</span>
                  </div>
                  <div className="w-full bg-[#FAF8F5] h-1.5 rounded-full overflow-hidden border border-[#EAE4D7]">
                    <div className="bg-[#8DBFB4] h-full w-[72%] rounded-full" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] text-[#5E706A] mb-1">
                    <span>Distress Trajectory</span>
                    <span className="font-mono font-semibold text-[#1E3633]">Steady (6.8 / 10)</span>
                  </div>
                  <div className="w-full bg-[#FAF8F5] h-1.5 rounded-full overflow-hidden border border-[#EAE4D7]">
                    <div className="bg-[#E0A898] h-full w-[68%] rounded-full" />
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-[#7A8E87] italic font-serif">
                Synthesized from your daily writing and vocabulary extractions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

