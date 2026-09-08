import React, { useState, useEffect } from 'react';
import { Sparkles, Edit3, Compass, Lock, CheckCircle2, BookOpen, Layers } from 'lucide-react';

export default function HeroInterfaceMockup() {
  const [typedText, setTypedText] = useState('');
  const [activeTab, setActiveTab] = useState('Home');
  const samplePhrase = "I noticed I started over-explaining my schedule when my manager asked for a quick update...";

  useEffect(() => {
    let index = 0;
    let isTyping = true;
    let timer = null;

    const tick = () => {
      if (isTyping) {
        if (index < samplePhrase.length) {
          setTypedText(samplePhrase.slice(0, index + 1));
          index++;
          timer = setTimeout(tick, 35);
        } else {
          isTyping = false;
          timer = setTimeout(tick, 4000);
        }
      } else {
        index = 0;
        isTyping = true;
        setTypedText('');
        timer = setTimeout(tick, 1000);
      }
    };

    timer = setTimeout(tick, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full max-w-4xl mx-auto rounded-2xl bg-white border border-[#E7E0D3] shadow-2xl overflow-hidden font-sans text-[#1A2421]">
      {/* Window Controls & Top Header */}
      <div className="px-5 py-3.5 bg-[#FAF8F5] border-b border-[#E7E0D3] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#D4897E]/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#D8BA7B]/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#82A38D]/70" />
        </div>

        <div className="flex items-center gap-2 text-xs text-[#7A8E87]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#758D7E]" />
          <span className="font-mono text-[10px] tracking-wider uppercase">INGRESS WITHIN · PRIVATE SESSION</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#EBF1ED] text-[#1E3633] text-[10px] font-semibold flex items-center justify-center">
            A
          </div>
        </div>
      </div>

      {/* Main Mockup Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[440px]">
        {/* Left Mini Sidebar */}
        <div className="hidden md:block md:col-span-3 border-r border-[#E7E0D3] bg-[#FAF8F5]/60 p-4 space-y-6">
          <div className="space-y-1">
            {['Home', 'Journal', 'Journeys', 'Insights', 'Therapy', 'Library'].map((item, i) => (
              <button
                key={item}
                onClick={() => setActiveTab(item)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2.5 ${
                  activeTab === item
                    ? 'bg-white text-[#1E3633] shadow-xs border border-[#E7E0D3]'
                    : 'text-[#6A7E77] hover:text-[#1A2421] hover:bg-white/50'
                }`}
              >
                {i === 0 && <Compass className="w-3.5 h-3.5" />}
                {i === 1 && <Edit3 className="w-3.5 h-3.5" />}
                {i === 2 && <Layers className="w-3.5 h-3.5" />}
                {i === 3 && <Sparkles className="w-3.5 h-3.5" />}
                {i === 4 && <CheckCircle2 className="w-3.5 h-3.5" />}
                {i === 5 && <BookOpen className="w-3.5 h-3.5" />}
                {item}
              </button>
            ))}
          </div>

          <div className="pt-8 border-t border-[#E7E0D3]/60 px-2">
            <p className="text-[11px] font-serif italic text-[#7A8E87] leading-relaxed">
              "Progress looks different for everyone."
            </p>
          </div>
        </div>

        {/* Center Canvas */}
        <div className="col-span-1 md:col-span-9 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          {/* Greeting & Date */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F0ECE1] pb-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-serif text-[#1A2421] tracking-tight">
                Good morning, Alex.
              </h3>
              <p className="text-xs text-[#6A7E77] mt-0.5">
                How is your emotional ground feeling today?
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#7A8E87] bg-[#FAF8F5] px-2.5 py-1 rounded-md border border-[#E7E0D3]">
              <span>Cycle 1</span>
              <span>·</span>
              <span className="text-[#1E3633] font-semibold">Day 06</span>
            </div>
          </div>

          {/* Reflection Input Card */}
          <div className="bg-[#FAF8F5] rounded-xl p-4 border border-[#E7E0D3] space-y-3">
            <div className="text-xs font-serif italic text-[#6A7E77]">
              What's on your mind right now?
            </div>
            <div className="min-h-[48px] text-sm text-[#1A2421] font-sans leading-relaxed">
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

          {/* Constellation & Patterns Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Pattern Constellation Preview */}
            <div className="p-4 rounded-xl border border-[#E7E0D3] bg-white space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#1A2421]">Your Patterns</span>
                <span className="text-[10px] font-mono text-[#758D7E] uppercase">Week 2 Map</span>
              </div>
              
              {/* Pattern Node Constellation */}
              <div className="h-28 relative flex items-center justify-center bg-[#FAF8F5]/80 rounded-lg overflow-hidden p-2">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 260 110">
                  {/* Connecting curved lines */}
                  <path d="M 40,75 Q 100,20 160,50 T 220,35" fill="none" stroke="#D5CDBC" strokeWidth="1.2" strokeDasharray="3 3" />
                  <path d="M 40,75 Q 120,95 200,80" fill="none" stroke="#D5CDBC" strokeWidth="1.2" />
                  <path d="M 100,30 L 160,50" fill="none" stroke="#758D7E" strokeWidth="1.5" />
                  
                  {/* Nodes */}
                  <circle cx="40" cy="75" r="5" fill="#8FA0AF" />
                  <circle cx="100" cy="30" r="6" fill="#758D7E" />
                  <circle cx="160" cy="50" r="4.5" fill="#B69186" />
                  <circle cx="220" cy="35" r="5.5" fill="#B8964A" />
                  <circle cx="200" cy="80" r="4" fill="#654652" />
                  
                  <text x="35" y="93" fontSize="8.5" fill="#5E706A" fontFamily="sans-serif">Triggers</text>
                  <text x="75" y="20" fontSize="8.5" fill="#1E3633" fontWeight="bold" fontFamily="sans-serif">Overthinking</text>
                  <text x="145" y="66" fontSize="8.5" fill="#5E706A" fontFamily="sans-serif">Hesitation</text>
                  <text x="195" y="25" fontSize="8.5" fill="#5E706A" fontFamily="sans-serif">Boundaries</text>
                </svg>
              </div>
              <p className="text-[11px] text-[#6A7E77] leading-tight">
                Noticing a recurring link between social friction and subsequent self-doubt.
              </p>
            </div>

            {/* Emotional Granularity & Progress */}
            <div className="p-4 rounded-xl border border-[#E7E0D3] bg-white flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#1A2421]">Weekly Rhythm</span>
                <span className="text-[10px] font-mono text-[#758D7E]">4 of 5 entries</span>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-[#5E706A]">
                  <span>Reflective clarity</span>
                  <span className="font-mono text-[#1E3633] font-semibold">Consistent</span>
                </div>
                <div className="w-full bg-[#FAF8F5] h-2 rounded-full overflow-hidden border border-[#EAE4D7]">
                  <div className="bg-[#758D7E] h-full w-[78%] rounded-full" />
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#FAF8F5] border border-[#E7E0D3] text-[11px] text-[#5E706A] leading-relaxed">
                <span className="font-semibold text-[#1A2421]">Focus:</span> Notice the moment right before you agree to unsolicited tasks.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
