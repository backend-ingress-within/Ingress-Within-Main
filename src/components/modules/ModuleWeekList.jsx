import React from 'react';
import { ArrowLeft, Check, Sparkles, Trophy } from 'lucide-react';

export default function ModuleWeekList({ catalog, content, playerState, onSelectWeek, onBackToOverview, onCompleteModule }) {
  const weeks = content?.weeks || [];
  const completedTouches = playerState?.completedTouches || [];
  const totalTouches = weeks.reduce((acc, w) => acc + (w?.touches?.length || 0), 0);
  const totalCompleted = completedTouches.length;
  const isModuleFullyDone = totalCompleted >= totalTouches;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-primary/10 flex-wrap">
        <div>
          <button
            onClick={onBackToOverview}
            className="text-xs font-semibold text-mid hover:text-accent flex items-center gap-1.5 transition-colors cursor-pointer mb-1"
          >
            <ArrowLeft size={13} />
            <span>Module Overview</span>
          </button>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-primary">
            {catalog?.name || content?.brief?.moduleName} — Program Roadmap
          </h1>
        </div>
        <div className="text-right">
          <div className="text-xs text-mid font-medium">Overall Progress</div>
          <div className="font-mono text-sm font-bold text-accent">
            {totalCompleted}/{totalTouches} Touches
          </div>
        </div>
      </div>

      {/* Progress Bar Card */}
      <div className="bg-white-paper border border-primary/10 rounded-2xl p-4 sm:p-5 flex items-center gap-4 shadow-xs">
        <div className="flex-1 bg-warm-paper border border-primary/10 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-accent h-full transition-all duration-500 rounded-full"
            style={{ width: `${Math.min(100, Math.round((totalCompleted / (totalTouches || 1)) * 100))}%` }}
          />
        </div>
        <span className="text-xs font-mono font-bold text-primary whitespace-nowrap">
          {Math.round((totalCompleted / (totalTouches || 1)) * 100)}% Complete
        </span>
      </div>

      {/* Weeks Grid / List */}
      <div className="space-y-3">
        {weeks.map((week, idx) => {
          const weekTouches = week.touches || [];
          const weekCompletedCount = weekTouches.filter(t => completedTouches.includes(t.id)).length;
          const isWeekDone = weekCompletedCount === weekTouches.length && weekTouches.length > 0;

          return (
            <div
              key={week.num}
              onClick={() => onSelectWeek(idx)}
              className={`border rounded-2xl p-5 sm:p-6 cursor-pointer transition-all flex items-center justify-between gap-4 shadow-xs ${
                isWeekDone
                  ? 'bg-white-paper border-secondary/40 hover:border-secondary'
                  : 'bg-white-paper border-primary/10 hover:border-accent/40'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-11 h-11 rounded-full border flex items-center justify-center font-serif text-lg font-bold flex-shrink-0 transition-all ${
                  isWeekDone
                    ? 'bg-secondary/20 border-secondary text-primary'
                    : 'bg-warm-paper border-primary/15 text-primary'
                }`}>
                  {isWeekDone ? <Check size={18} className="text-primary" /> : week.num}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-base text-primary">
                      Week {week.num}: {week.title}
                    </h3>
                    {week.kind === 'integration' && (
                      <span className="text-[10px] uppercase tracking-wider text-accent bg-accent/10 border border-accent/25 px-2.5 py-0.5 rounded-full font-sans font-semibold">
                        Integration
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-mid">
                    <span>Mechanism: <strong className="text-primary font-semibold">{week.mechanism}</strong></span>
                    <span>•</span>
                    <span>{weekTouches.length} Touches</span>
                  </div>
                </div>
              </div>

              {/* Progress pill for week */}
              <div className="text-right flex-shrink-0">
                <span className={`text-xs font-mono px-3 py-1 rounded-full border ${
                  isWeekDone
                    ? 'bg-secondary/20 border-secondary/50 text-primary font-semibold'
                    : weekCompletedCount > 0
                    ? 'bg-accent/10 border-accent/30 text-accent font-semibold'
                    : 'bg-warm-paper border-primary/15 text-mid'
                }`}>
                  {weekCompletedCount}/{weekTouches.length} Done
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Module Completion Banner / Button */}
      {isModuleFullyDone && (
        <div className="p-6 sm:p-8 bg-white-paper border border-secondary rounded-2xl text-center space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-secondary/20 border border-secondary flex items-center justify-center mx-auto text-primary">
            <Trophy size={24} />
          </div>
          <h3 className="font-serif text-2xl font-semibold text-primary">
            All {weeks.length} Weeks Completed!
          </h3>
          <p className="text-sm text-mid max-w-md mx-auto leading-relaxed">
            You've completed all touches across the program. Take the final MHPI assessment to measure your response and view your progress readout.
          </p>
          <button
            onClick={onCompleteModule}
            className="py-3.5 px-6 bg-accent hover:bg-[#654652] active:bg-[#533842] text-white font-semibold rounded-xl text-sm transition-all shadow-xs cursor-pointer"
          >
            Take End Assessment & View Results
          </button>
        </div>
      )}
    </div>
  );
}
