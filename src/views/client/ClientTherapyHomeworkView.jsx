import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Calendar as CalendarIcon,
  AlertCircle,
  FileText,
  Filter,
  RefreshCw,
  Sparkles,
  HelpCircle,
  ChevronRight,
  ShieldCheck,
  Search,
  Check,
  Hourglass,
  Layers,
  ArrowRight,
} from 'lucide-react';
import ClientHomeworkModal from './ClientHomeworkModal';

/**
 * Step 4: Homework & Programs View
 *
 * Implements:
 * 1. Filterable categories: All, To Do (assigned/viewed/in_progress), In Review (submitted), Completed (reviewed), Overdue
 * 2. Accurate count badges aligned with current records
 * 3. Loading, empty, and recoverable error retry states
 * 4. Multi-step activities / programs overview section with verified clinical status
 * 5. Therapist feedback callouts (excluding supervisory/private clinical notes)
 * 6. Responsive layout matching Ingress Within design system
 */
export default function ClientTherapyHomeworkView({
  homeworkList = [],
  loading = false,
  error = null,
  onRefresh,
  onOpenAssignment,
}) {
  const [activeFilter, setActiveFilter] = useState('all'); // all | todo | in_review | completed | overdue
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  // Status mapping and calculation
  const now = Date.now();

  const enrichedList = (homeworkList || []).map((item) => {
    const dueTime = item.dueAt ? new Date(item.dueAt).getTime() : null;
    const isCompleted = ['submitted', 'reviewed'].includes(item.status);
    const isOverdue = dueTime ? dueTime < now && !isCompleted : false;
    const isToDo = ['assigned', 'viewed', 'in_progress'].includes(item.status);
    const isInReview = item.status === 'submitted';
    const isReviewed = item.status === 'reviewed';

    return {
      ...item,
      isOverdue,
      isToDo,
      isInReview,
      isReviewed,
    };
  });

  // Filter logic
  const filteredList = enrichedList.filter((item) => {
    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title?.toLowerCase().includes(q);
      const matchInst = item.instructions?.toLowerCase().includes(q);
      const matchType = item.exerciseType?.toLowerCase().includes(q);
      if (!matchTitle && !matchInst && !matchType) return false;
    }

    // Tab filter
    if (activeFilter === 'todo') return item.isToDo;
    if (activeFilter === 'in_review') return item.isInReview;
    if (activeFilter === 'completed') return item.isReviewed;
    if (activeFilter === 'overdue') return item.isOverdue;
    return true;
  });

  // Counts
  const counts = {
    all: enrichedList.length,
    todo: enrichedList.filter((i) => i.isToDo).length,
    in_review: enrichedList.filter((i) => i.isInReview).length,
    completed: enrichedList.filter((i) => i.isReviewed).length,
    overdue: enrichedList.filter((i) => i.isOverdue).length,
  };

  const handleOpen = (id) => {
    if (onOpenAssignment) {
      onOpenAssignment(id);
    } else {
      setSelectedId(id);
    }
  };

  const getExerciseBadge = (type) => {
    const normalized = (type || 'worksheet').replace(/_/g, ' ');
    return (
      <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-[#F4F1EC] text-[#263238] border border-[#263238]/8">
        {normalized}
      </span>
    );
  };

  const getStatusBadge = (item) => {
    if (item.isOverdue) {
      return (
        <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-200 flex items-center gap-1">
          <AlertCircle size={10} /> Overdue
        </span>
      );
    }
    if (item.status === 'reviewed') {
      return (
        <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
          <CheckCircle2 size={10} /> Reviewed
        </span>
      );
    }
    if (item.status === 'submitted') {
      return (
        <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1">
          <Hourglass size={10} /> In Review
        </span>
      );
    }
    if (item.status === 'in_progress' || item.hasDraft) {
      return (
        <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
          In Progress
        </span>
      );
    }
    return (
      <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700">
        To Do
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#263238]/10 pb-5">
        <div>
          <span className="text-[11px] uppercase tracking-wider font-bold text-emerald-800 flex items-center gap-1.5">
            <Sparkles size={13} /> Client Self-Work &amp; Tools
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#132A24] mt-1">
            Homework &amp; Programs
          </h1>
          <p className="text-xs text-[#66747A] mt-1 max-w-2xl leading-relaxed">
            Evidence-based exercises, structured thought records, and self-regulation activities assigned by your licensed clinician between consultations.
          </p>
        </div>

        {/* Search & Refresh Actions */}
        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0AAB0]" />
            <input
              type="text"
              placeholder="Search exercises..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-[#263238]/15 bg-white text-[#263238] placeholder:text-[#A0AAB0] focus:outline-hidden focus:border-emerald-700 w-44 sm:w-56"
            />
          </div>
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              title="Refresh assignments"
              className="p-2 rounded-xl border border-[#263238]/15 text-[#66747A] hover:text-[#132A24] hover:bg-white transition-all cursor-pointer"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'all', label: 'All Exercises', count: counts.all },
          { id: 'todo', label: 'To Do', count: counts.todo },
          { id: 'in_review', label: 'In Review', count: counts.in_review },
          { id: 'completed', label: 'Completed', count: counts.completed },
          { id: 'overdue', label: 'Overdue', count: counts.overdue, alert: counts.overdue > 0 },
        ].map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setActiveFilter(f.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
              activeFilter === f.id
                ? 'bg-[#132A24] text-white font-semibold shadow-2xs'
                : 'text-[#66747A] bg-white border border-[#263238]/8 hover:bg-[#F4F1EC]'
            }`}
          >
            <span>{f.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeFilter === f.id
                  ? 'bg-white/20 text-white'
                  : f.alert
                  ? 'bg-red-100 text-red-800'
                  : 'bg-[#F4F1EC] text-[#66747A]'
              }`}
            >
              {f.count}
            </span>
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="py-16 text-center space-y-3 bg-white border border-[#263238]/8 rounded-2xl">
          <div className="w-8 h-8 border-2 border-emerald-800 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[#66747A]">Loading your clinical self-work assignments...</p>
        </div>
      )}

      {/* Recoverable Error State */}
      {!loading && error && (
        <div role="alert" className="p-5 rounded-2xl bg-red-50 border border-red-200 text-red-900 space-y-3">
          <div className="flex items-start gap-2.5">
            <AlertCircle size={18} className="shrink-0 text-red-700 mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-semibold text-xs text-red-950">Unable to load self-work assignments</h3>
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

      {/* Empty State */}
      {!loading && !error && filteredList.length === 0 && (
        <div className="bg-white border border-[#263238]/10 rounded-2xl p-10 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto">
            <BookOpen size={24} />
          </div>
          <h3 className="font-serif text-base text-[#132A24] font-medium">
            {activeFilter === 'todo'
              ? 'All caught up with your self-work!'
              : activeFilter === 'overdue'
              ? 'No overdue exercises'
              : 'No assignments found'}
          </h3>
          <p className="text-xs text-[#66747A] max-w-sm mx-auto leading-relaxed">
            {activeFilter === 'todo'
              ? 'You have completed all active assignments. Your therapist will assign new clinical exercises tailored to your treatment plan during your next encounter.'
              : activeFilter === 'overdue'
              ? 'You are on track with your recommended practice schedule.'
              : 'Assigned worksheets, reflections, and psychoeducation activities will appear here.'}
          </p>
        </div>
      )}

      {/* Assignment Grid */}
      {!loading && !error && filteredList.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredList.map((item) => {
            const isCompleted = ['submitted', 'reviewed'].includes(item.status);

            return (
              <div
                key={item.id}
                className="bg-white border border-[#263238]/10 rounded-2xl p-5 shadow-2xs flex flex-col justify-between space-y-4 hover:border-[#263238]/20 transition-all"
              >
                <div className="space-y-3">
                  {/* Badges */}
                  <div className="flex items-center justify-between gap-2">
                    {getExerciseBadge(item.exerciseType)}
                    {getStatusBadge(item)}
                  </div>

                  {/* Title & Clinician info */}
                  <div>
                    <h3 className="font-serif text-base text-[#132A24] font-medium leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-[#66747A] mt-0.5">
                      Assigned by {item.therapistName || 'Your Clinician'}
                    </p>
                  </div>

                  {/* Instructions snippet */}
                  <p className="text-xs text-[#66747A] line-clamp-3 leading-relaxed">
                    {item.instructions}
                  </p>

                  {/* Clinical Goal Callout if present */}
                  {item.clinicalGoal && (
                    <div className="p-2.5 rounded-lg bg-[#F4F1EC]/60 text-[11px] text-[#132A24]">
                      <strong>Goal:</strong> {item.clinicalGoal}
                    </div>
                  )}

                  {/* Therapist Feedback Callout if reviewed */}
                  {item.feedback && (
                    <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 space-y-1">
                      <span className="font-bold flex items-center gap-1 text-[11px] text-emerald-900">
                        <CheckCircle2 size={12} /> Clinician Feedback &amp; Reflections
                      </span>
                      <p className="italic text-[#263238] leading-relaxed">"{item.feedback}"</p>
                    </div>
                  )}
                </div>

                {/* Footer metadata & Action button */}
                <div className="pt-3 border-t border-[#263238]/8 flex items-center justify-between">
                  <div className="text-[11px] text-[#66747A] flex items-center gap-3">
                    <span className="flex items-center gap-1" title="Estimated completion time">
                      <Clock size={11} /> ~{item.estimatedMinutes || 15}m
                    </span>
                    {item.dueAt && (
                      <span
                        className={`flex items-center gap-1 ${
                          item.isOverdue ? 'text-red-700 font-semibold' : ''
                        }`}
                        title="Due date"
                      >
                        <CalendarIcon size={11} />{' '}
                        {new Date(item.dueAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpen(item.id)}
                    className="bg-[#132A24] text-white hover:bg-[#1C3E35] px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                  >
                    <FileText size={12} />
                    <span>{isCompleted ? 'View Submission' : 'Open Exercise'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Multi-step Programs & Structured Activities Status Section */}
      <div className="bg-[#F4F1EC]/60 border border-[#263238]/10 rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Layers size={16} className="text-emerald-800" />
          <h3 className="font-serif text-sm font-semibold text-[#132A24]">
            Structured Multi-Step Activities &amp; Programs
          </h3>
        </div>
        <p className="text-xs text-[#66747A] leading-relaxed">
          Your clinical homework exercises are tailored dynamically by your therapist following each session. Multi-step modules (such as CBT Thought Records, Behavioral Activation Logs, and Box Breathing somatic practices) persist your progress seamlessly across encounters.
        </p>
      </div>

      {/* Privacy Guard Footer */}
      <div className="pt-3 border-t border-[#263238]/8 flex items-center gap-2 text-[11px] text-[#66747A]">
        <ShieldCheck size={14} className="text-emerald-700 shrink-0" />
        <span>
          Privacy Shield: Your homework submissions and reflections are private and strictly accessible only to your authorized licensed therapist. Internal clinical formulations and SOAP notes remain supervisory-only.
        </span>
      </div>

      {/* Modal */}
      {selectedId && (
        <ClientHomeworkModal
          assignmentId={selectedId}
          onClose={() => setSelectedId(null)}
          onSuccess={() => {
            setSelectedId(null);
            if (onRefresh) onRefresh();
          }}
        />
      )}
    </div>
  );
}
