import React, { useState } from 'react';
import {
  Compass,
  CalendarCheck,
  CheckCircle2,
  Clock,
  BookOpen,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  AlertCircle,
  Layers,
  ChevronRight,
  Target,
  FileText,
  Calendar,
  HeartHandshake,
  ArrowRight,
  TrendingUp,
  Info,
} from 'lucide-react';

const STAGE_LABELS = {
  intake: 'Intake & Foundation',
  active_care: 'Active Therapeutic Care',
  maintenance: 'Maintenance & Autonomy',
  completed: 'Concluded & Graduated',
};

const STAGE_DESCRIPTIONS = {
  intake:
    'Establishing therapeutic alliance, biopsychosocial assessment, and collaborative goal mapping.',
  active_care:
    'Weekly or bi-weekly consultations focusing on evidence-based cognitive and emotional interventions.',
  maintenance:
    'Spaced sessions prioritizing autonomous reflection, coping strategy mastery, and behavioral resilience.',
  completed:
    'Formal conclusion of the care cycle with documented relapse prevention plan and progress integration.',
};

/**
 * Step 5: My Journey View
 *
 * Implements:
 * 1. Authoritative Care Stage progression breakdown (Intake -> Active Care -> Maintenance -> Concluded).
 * 2. Transparent progress metrics derived from real records (attended sessions, upcoming sessions, completed homework, clinician reviews).
 * 3. Unified chronological timeline of clinical milestones with accurate timestamps and categories.
 * 4. Links to revisit client-authored reflections and therapist feedback without duplicating private entries.
 * 5. Strict privacy shield: isolates therapist supervisory SOAP formulations and notes.
 * 6. Responsive layout, loading, empty, and recoverable error retry states.
 */
export default function ClientTherapyCareJourneyView({
  journeyData = null,
  careStage = 'intake',
  clinicianName = 'Your Clinician',
  loading = false,
  error = null,
  onRefresh,
  onNavigateSessions,
  onNavigateHomework,
  onOpenHomework,
}) {
  const [timelineFilter, setTimelineFilter] = useState('all'); // all | sessions | homework | stages

  const timeline = journeyData?.timeline || [];
  const sessionMetrics = journeyData?.sessionMetrics || {
    total: 0,
    completed: 0,
    attended: 0,
    upcoming: 0,
    cancelled: 0,
  };
  const homeworkMetrics = journeyData?.homeworkMetrics || {
    total: 0,
    submitted: 0,
    reviewed: 0,
  };

  const filteredTimeline = timeline.filter((item) => {
    if (timelineFilter === 'sessions') return item.type === 'session_attended';
    if (timelineFilter === 'homework')
      return item.type === 'homework_submitted' || item.type === 'homework_reviewed';
    if (timelineFilter === 'stages')
      return item.type === 'care_stage_transition' || item.type === 'relationship_started' || item.type === 'care_concluded';
    return true;
  });

  const getTimelineIcon = (type) => {
    switch (type) {
      case 'relationship_started':
        return <HeartHandshake size={15} className="text-emerald-700" />;
      case 'care_stage_transition':
        return <TrendingUp size={15} className="text-blue-700" />;
      case 'session_attended':
        return <CalendarCheck size={15} className="text-emerald-800" />;
      case 'homework_reviewed':
        return <MessageSquare size={15} className="text-purple-700" />;
      case 'homework_submitted':
        return <BookOpen size={15} className="text-amber-700" />;
      case 'care_concluded':
        return <CheckCircle2 size={15} className="text-teal-700" />;
      default:
        return <Sparkles size={15} className="text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#263238]/10 pb-5">
        <div>
          <span className="text-[11px] uppercase tracking-wider font-bold text-emerald-800 flex items-center gap-1.5">
            <Compass size={13} /> Longitudinal Care Tracking
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#132A24] mt-1">
            My Therapeutic Journey
          </h1>
          <p className="text-xs text-[#66747A] mt-1 max-w-2xl leading-relaxed">
            Your clinical progression, care stage transitions, and treatment milestones documented throughout your work with {clinicianName}.
          </p>
        </div>

        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            title="Refresh journey data"
            className="self-start sm:self-auto p-2 rounded-xl border border-[#263238]/15 text-[#66747A] hover:text-[#132A24] hover:bg-white transition-all cursor-pointer"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="py-16 text-center space-y-3 bg-white border border-[#263238]/8 rounded-2xl">
          <div className="w-8 h-8 border-2 border-emerald-800 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[#66747A]">Loading your care journey timeline...</p>
        </div>
      )}

      {/* Recoverable Error State */}
      {!loading && error && (
        <div role="alert" className="p-5 rounded-2xl bg-red-50 border border-red-200 text-red-900 space-y-3">
          <div className="flex items-start gap-2.5">
            <AlertCircle size={18} className="shrink-0 text-red-700 mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-semibold text-xs text-red-950">Unable to load care journey</h3>
              <p className="text-xs text-red-800 leading-relaxed">{error}</p>
            </div>
          </div>
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-900 text-white text-xs font-medium hover:bg-red-950 transition-all cursor-pointer shadow-2xs"
            >
              <RefreshCw size={12} />
              <span>Retry Connection</span>
            </button>
          )}
        </div>
      )}

      {/* Main Content */}
      {!loading && !error && (
        <div className="space-y-6">
          {/* Current Care Stage Card */}
          <div className="bg-white border border-[#263238]/10 rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                  <Target size={13} /> Current Clinical Stage
                </div>
                <h2 className="font-serif text-2xl text-[#132A24] mt-0.5">
                  {STAGE_LABELS[careStage] || careStage}
                </h2>
                <p className="text-xs text-[#66747A] mt-1 max-w-lg leading-relaxed">
                  {STAGE_DESCRIPTIONS[careStage] ||
                    'Clinical treatment progression tailored collaboratively between you and your clinician.'}
                </p>
              </div>

              {/* Verified Activity Metric Chips */}
              <div className="flex items-center gap-3 bg-[#F4F1EC] p-3 rounded-2xl border border-[#263238]/8 shrink-0">
                <div className="text-center px-2">
                  <div className="font-serif text-xl text-[#132A24]">
                    {sessionMetrics.completed}
                  </div>
                  <div className="text-[10px] text-[#66747A] uppercase font-bold tracking-wider">
                    Attended
                  </div>
                </div>
                <div className="h-8 w-px bg-[#263238]/10" />
                <div className="text-center px-2">
                  <div className="font-serif text-xl text-emerald-800">
                    {sessionMetrics.upcoming}
                  </div>
                  <div className="text-[10px] text-[#66747A] uppercase font-bold tracking-wider">
                    Upcoming
                  </div>
                </div>
                <div className="h-8 w-px bg-[#263238]/10" />
                <div className="text-center px-2">
                  <div className="font-serif text-xl text-purple-800">
                    {homeworkMetrics.reviewed}
                  </div>
                  <div className="text-[10px] text-[#66747A] uppercase font-bold tracking-wider">
                    Self-Work
                  </div>
                </div>
              </div>
            </div>

            {/* Non-Linear Progression Callout */}
            <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200/80 text-xs text-blue-950 flex items-start gap-2.5">
              <Info size={15} className="shrink-0 text-blue-700 mt-0.5" />
              <p className="text-[11px] text-blue-900 leading-relaxed">
                <strong>About your clinical milestones:</strong> Therapy progress is naturally non-linear and tailored to your personal context. Metrics reflect completed consultations and shared reflections, rather than automated diagnostic scores.
              </p>
            </div>

            {/* 4-Stage Progressive Framework */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-4 border-t border-[#263238]/8">
              {[
                {
                  stage: 'intake',
                  title: '1. Intake',
                  desc: 'Comprehensive clinical assessment and collaborative treatment mapping.',
                },
                {
                  stage: 'active_care',
                  title: '2. Active Care',
                  desc: 'Regular consultations, structured reframing, and between-session self-work.',
                },
                {
                  stage: 'maintenance',
                  title: '3. Maintenance',
                  desc: 'Spaced check-ins, independent emotional regulation, and habit consolidation.',
                },
                {
                  stage: 'completed',
                  title: '4. Concluded',
                  desc: 'Graduation from continuous care with resilient long-term mastery.',
                },
              ].map((s) => {
                const isCurrent = s.stage === careStage;
                return (
                  <div
                    key={s.stage}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isCurrent
                        ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-200 shadow-2xs'
                        : 'bg-white border-[#263238]/8 opacity-80'
                    }`}
                  >
                    <div
                      className={`text-xs font-semibold flex items-center justify-between ${
                        isCurrent ? 'text-emerald-950' : 'text-[#263238]'
                      }`}
                    >
                      <span>{s.title}</span>
                      {isCurrent && (
                        <span className="text-[9px] uppercase px-1.5 py-0.2 rounded-full bg-emerald-800 text-white font-bold tracking-wider">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#66747A] mt-1.5 leading-snug">{s.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chronological Timeline Section */}
          <div className="bg-white border border-[#263238]/10 rounded-2xl p-6 shadow-2xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#263238]/8 pb-4">
              <div>
                <h3 className="font-serif text-lg text-[#132A24]">Longitudinal Milestone Log</h3>
                <p className="text-xs text-[#66747A] mt-0.5">
                  Verified chronology of session encounters, stage transitions, and self-work reviews.
                </p>
              </div>

              {/* Timeline Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {[
                  { id: 'all', label: 'All Events' },
                  { id: 'sessions', label: 'Sessions' },
                  { id: 'homework', label: 'Self-Work' },
                  { id: 'stages', label: 'Care Stages' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setTimelineFilter(f.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
                      timelineFilter === f.id
                        ? 'bg-[#132A24] text-white font-semibold'
                        : 'text-[#66747A] hover:bg-[#F4F1EC]'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Empty Timeline State */}
            {filteredTimeline.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <Compass size={28} className="mx-auto text-gray-300" />
                <h4 className="font-serif text-sm font-semibold text-[#132A24]">
                  No milestones recorded yet for this filter
                </h4>
                <p className="text-xs text-[#66747A] max-w-sm mx-auto leading-relaxed">
                  Your journey is currently building. As you attend consultations and complete self-work exercises, verified milestones will appear chronologically here.
                </p>
              </div>
            ) : (
              <div className="relative pl-6 sm:pl-8 space-y-6 before:content-[''] before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#263238]/10">
                {filteredTimeline.map((item, idx) => (
                  <div key={item.id || idx} className="relative group">
                    {/* Bullet marker */}
                    <div className="absolute -left-6 sm:-left-8 top-1 w-6 h-6 rounded-full bg-white border border-[#263238]/15 shadow-2xs flex items-center justify-center shrink-0">
                      {getTimelineIcon(item.type)}
                    </div>

                    {/* Timeline Event Card */}
                    <div className="p-4 rounded-xl bg-[#F4F1EC]/50 border border-[#263238]/8 hover:border-[#263238]/20 transition-all space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <h4 className="text-xs font-semibold text-[#132A24] flex items-center gap-2">
                          <span>{item.title}</span>
                        </h4>
                        <span className="text-[11px] text-[#A0AAB0] font-medium shrink-0">
                          {new Date(item.timestamp).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>

                      {item.description && (
                        <p className="text-xs text-[#66747A] leading-relaxed whitespace-pre-wrap">
                          {item.description}
                        </p>
                      )}

                      {/* Direct links to revisit work */}
                      {item.metadata?.homeworkId && onOpenHomework && (
                        <div className="pt-1">
                          <button
                            type="button"
                            onClick={() => onOpenHomework(item.metadata.homeworkId)}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 hover:text-emerald-950 transition-colors cursor-pointer"
                          >
                            <FileText size={12} />
                            <span>Revisit Completed Exercise &amp; Feedback</span>
                            <ChevronRight size={12} />
                          </button>
                        </div>
                      )}

                      {item.type === 'session_attended' && onNavigateSessions && (
                        <div className="pt-1">
                          <button
                            type="button"
                            onClick={onNavigateSessions}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#132A24] hover:underline transition-colors cursor-pointer"
                          >
                            <Calendar size={12} />
                            <span>View Session Records</span>
                            <ChevronRight size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Privacy Shield Boundary */}
          <div className="pt-3 border-t border-[#263238]/8 flex items-center gap-2 text-[11px] text-[#66747A]">
            <ShieldCheck size={14} className="text-emerald-700 shrink-0" />
            <span>
              Clinical Boundary Enforced: SOAP notes, clinical formulation, risk logs, and therapist supervisory records remain strictly restricted to licensed clinician charts and are never stored or displayed on the client timeline.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
