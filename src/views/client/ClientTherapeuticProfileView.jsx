import React, { useState, useEffect } from 'react';
import {
  HeartHandshake,
  FileText,
  Target,
  Calendar,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  RefreshCw,
  Lock,
  Eye,
  EyeOff,
  ChevronRight,
  TrendingUp,
  MessageSquare,
  History,
  X,
  Edit2,
  Trash2,
  Check,
  Compass,
} from 'lucide-react';

export default function ClientTherapeuticProfileView({
  relationshipId,
  clinicianName = 'Your Clinician',
  onNavigateJourney,
}) {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeModule, setActiveModule] = useState('overview'); // overview | intake | goals | life_events | reviews

  // Modals state
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [goalForm, setGoalForm] = useState({
    title: '',
    description: '',
    whyItMatters: '',
    category: 'anxiety_management',
    targetDate: '',
    status: 'in_progress',
    progressPercentage: 0,
    clientNotes: '',
  });
  const [savingGoal, setSavingGoal] = useState(false);

  // Goal History modal
  const [viewingGoalHistory, setViewingGoalHistory] = useState(null);
  const [goalHistoryList, setGoalHistoryList] = useState([]);
  const [loadingGoalHistory, setLoadingGoalHistory] = useState(false);

  // Life Event modal
  const [showLifeEventModal, setShowLifeEventModal] = useState(false);
  const [editingLifeEvent, setEditingLifeEvent] = useState(null);
  const [lifeEventForm, setLifeEventForm] = useState({
    title: '',
    category: 'other',
    eventDate: new Date().toISOString().split('T')[0],
    description: '',
    emotionalImpact: 'neutral',
    discussInSession: false,
    isSharedWithTherapist: true,
  });
  const [savingLifeEvent, setSavingLifeEvent] = useState(false);

  // Intake Edit modal
  const [showIntakeModal, setShowIntakeModal] = useState(false);
  const [intakeForm, setIntakeForm] = useState({
    concerns: [],
    affectedLifeAreas: [],
    ownWords: '',
    expectations: {},
    copingAndSupport: {},
  });
  const [savingIntake, setSavingIntake] = useState(false);

  // Periodic Review Submission modal
  const [submittingReview, setSubmittingReview] = useState(null);
  const [reviewResponseForm, setReviewResponseForm] = useState({
    whatFeelsBetter: '',
    whatRemainsDifficult: '',
    whatHasChanged: '',
    nextFocus: '',
    meetingNeedsRating: 'yes',
  });
  const [savingReviewResponse, setSavingReviewResponse] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/therapy/client/therapeutic-profile');
      if (res.ok) {
        const json = await res.json();
        setProfileData(json);
      } else {
        const errJson = await res.json().catch(() => ({}));
        setError(errJson.error?.message || 'Unable to load therapeutic profile.');
      }
    } catch (err) {
      console.error('Failed to load therapeutic profile:', err);
      setError('Network connection error loading therapeutic profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [relationshipId]);

  // Goal submission handler
  const handleSaveGoal = async (e) => {
    e.preventDefault();
    if (!goalForm.title.trim()) return;
    setSavingGoal(true);
    try {
      if (editingGoal) {
        const res = await fetch(`/api/therapy/client/therapeutic-profile/goals/${editingGoal.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            updates: {
              title: goalForm.title,
              description: goalForm.description,
              whyItMatters: goalForm.whyItMatters,
              category: goalForm.category,
              targetDate: goalForm.targetDate || null,
              status: goalForm.status,
              progressPercentage: Number(goalForm.progressPercentage),
              clientNotes: goalForm.clientNotes,
            },
            changeReason: 'Client updated goal details',
          }),
        });
        if (!res.ok) throw new Error('Failed to update goal');
      } else {
        const res = await fetch('/api/therapy/client/therapeutic-profile/goals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...goalForm,
            progressPercentage: Number(goalForm.progressPercentage),
          }),
        });
        if (!res.ok) throw new Error('Failed to create goal');
      }
      setShowGoalModal(false);
      setEditingGoal(null);
      await fetchProfile();
    } catch (err) {
      alert(err.message || 'Error saving goal');
    } finally {
      setSavingGoal(false);
    }
  };

  const handleOpenGoalHistory = async (goal) => {
    setViewingGoalHistory(goal);
    setLoadingGoalHistory(true);
    try {
      const res = await fetch(`/api/therapy/client/therapeutic-profile/goals/${goal.id}/history`);
      if (res.ok) {
        const json = await res.json();
        setGoalHistoryList(json.history || []);
      }
    } catch (err) {
      console.warn('Failed to fetch goal history:', err);
    } finally {
      setLoadingGoalHistory(false);
    }
  };

  // Life event submission handler
  const handleSaveLifeEvent = async (e) => {
    e.preventDefault();
    if (!lifeEventForm.title.trim()) return;
    setSavingLifeEvent(true);
    try {
      if (editingLifeEvent) {
        const res = await fetch(
          `/api/therapy/client/therapeutic-profile/life-events/${editingLifeEvent.id}`,
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(lifeEventForm),
          }
        );
        if (!res.ok) throw new Error('Failed to update life event');
      } else {
        const res = await fetch('/api/therapy/client/therapeutic-profile/life-events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(lifeEventForm),
        });
        if (!res.ok) throw new Error('Failed to create life event');
      }
      setShowLifeEventModal(false);
      setEditingLifeEvent(null);
      await fetchProfile();
    } catch (err) {
      alert(err.message || 'Error saving life event');
    } finally {
      setSavingLifeEvent(false);
    }
  };

  const handleDeleteLifeEvent = async (id) => {
    if (!confirm('Are you sure you want to remove this personal event?')) return;
    try {
      const res = await fetch(`/api/therapy/client/therapeutic-profile/life-events/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await fetchProfile();
      }
    } catch (err) {
      console.error('Failed to delete event:', err);
    }
  };

  // Intake update handler
  const handleSaveIntake = async (e) => {
    e.preventDefault();
    setSavingIntake(true);
    try {
      const res = await fetch('/api/therapy/client/therapeutic-profile/intake', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          relationshipId: profileData?.relationship?.id,
          updates: {
            concerns: intakeForm.concerns,
            affectedLifeAreas: intakeForm.affectedLifeAreas,
            ownWords: intakeForm.ownWords,
          },
          updateSummary: 'Client updated background reflections',
        }),
      });
      if (!res.ok) throw new Error('Failed to update intake');
      setShowIntakeModal(false);
      await fetchProfile();
    } catch (err) {
      alert(err.message || 'Error updating intake');
    } finally {
      setSavingIntake(false);
    }
  };

  // Periodic review response handler
  const handleSubmitReviewResponse = async (e) => {
    e.preventDefault();
    if (!submittingReview) return;
    setSavingReviewResponse(true);
    try {
      const res = await fetch(
        `/api/therapy/client/therapeutic-profile/reviews/${submittingReview.id}/submit`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reviewResponseForm),
        }
      );
      if (!res.ok) throw new Error('Failed to submit review responses');
      setSubmittingReview(null);
      await fetchProfile();
    } catch (err) {
      alert(err.message || 'Error submitting review response');
    } finally {
      setSavingReviewResponse(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3 bg-white border border-[#263238]/8 rounded-2xl">
        <div className="w-8 h-8 border-2 border-emerald-800 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-[#66747A]">Loading your comprehensive Therapeutic Profile...</p>
      </div>
    );
  }

  if (error || !profileData?.hasActiveRelationship) {
    return (
      <div className="p-6 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-950 space-y-3">
        <div className="flex items-start gap-2.5">
          <AlertCircle size={18} className="shrink-0 text-amber-700 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-semibold text-xs text-amber-900">
              {error || 'No active therapy relationship profile found'}
            </h3>
            <p className="text-xs text-amber-800 leading-relaxed">
              Therapeutic profiles are tied directly to an active client-therapist relationship.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { intake, goals, lifeEvents = [], reviews = [] } = profileData;
  const activeGoals = goals?.active || [];
  const achievedGoals = goals?.achieved || [];
  const pausedGoals = goals?.paused || [];

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#263238]/10 pb-5">
        <div>
          <span className="text-[11px] uppercase tracking-wider font-bold text-emerald-800 flex items-center gap-1.5">
            <HeartHandshake size={14} /> Living Clinical Record
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#132A24] mt-1">
            Therapeutic Profile
          </h1>
          <p className="text-xs text-[#66747A] mt-1 max-w-2xl leading-relaxed">
            A collaborative therapeutic space for your personal goals, significant life events, background, and periodic progress reviews with {clinicianName}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onNavigateJourney && (
            <button
              type="button"
              onClick={onNavigateJourney}
              className="text-xs px-3 py-1.5 rounded-lg border border-[#263238]/15 hover:bg-white text-[#263238] font-medium flex items-center gap-1 cursor-pointer"
            >
              <Compass size={13} />
              <span>Care Journey</span>
            </button>
          )}
          <button
            type="button"
            onClick={fetchProfile}
            title="Refresh profile"
            className="p-2 rounded-xl border border-[#263238]/15 text-[#66747A] hover:text-[#132A24] hover:bg-white transition-all cursor-pointer"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Module Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-[#263238]/10 pb-2 overflow-x-auto">
        {[
          { id: 'overview', label: 'Profile Summary', icon: Sparkles },
          { id: 'goals', label: `Goals (${activeGoals.length})`, icon: Target },
          { id: 'life_events', label: `Life Events (${lifeEvents.length})`, icon: Calendar },
          { id: 'reviews', label: `Periodic Reviews (${reviews.length})`, icon: MessageSquare },
          { id: 'intake', label: 'Intake & Background', icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeModule === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveModule(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-[#132A24] text-white shadow-2xs font-semibold'
                  : 'text-[#66747A] hover:text-[#263238] hover:bg-gray-100'
              }`}
            >
              <Icon size={13} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ===================================================================== */}
      {/* 1. MODULE: OVERVIEW / PROFILE SUMMARY                                */}
      {/* ===================================================================== */}
      {activeModule === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Active Goals Card */}
            <div className="bg-white border border-[#263238]/10 rounded-2xl p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase font-bold text-emerald-800 tracking-wider">
                  Active Goals
                </span>
                <Target size={16} className="text-emerald-700" />
              </div>
              <div className="text-2xl font-serif text-[#132A24] font-bold">
                {activeGoals.length}
              </div>
              <p className="text-xs text-[#66747A]">
                {achievedGoals.length} goals achieved to date
              </p>
              <button
                type="button"
                onClick={() => setActiveModule('goals')}
                className="text-xs text-emerald-800 font-semibold hover:underline flex items-center gap-1"
              >
                <span>Manage goals</span> <ChevronRight size={13} />
              </button>
            </div>

            {/* Life Events Card */}
            <div className="bg-white border border-[#263238]/10 rounded-2xl p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase font-bold text-blue-800 tracking-wider">
                  Life Milestones
                </span>
                <Calendar size={16} className="text-blue-700" />
              </div>
              <div className="text-2xl font-serif text-[#132A24] font-bold">
                {lifeEvents.length}
              </div>
              <p className="text-xs text-[#66747A]">
                {lifeEvents.filter((e) => e.is_shared_with_therapist).length} shared with {clinicianName}
              </p>
              <button
                type="button"
                onClick={() => setActiveModule('life_events')}
                className="text-xs text-blue-800 font-semibold hover:underline flex items-center gap-1"
              >
                <span>View timeline</span> <ChevronRight size={13} />
              </button>
            </div>

            {/* Periodic Reviews Card */}
            <div className="bg-white border border-[#263238]/10 rounded-2xl p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase font-bold text-purple-800 tracking-wider">
                  Session Reviews
                </span>
                <MessageSquare size={16} className="text-purple-700" />
              </div>
              <div className="text-2xl font-serif text-[#132A24] font-bold">
                {reviews.filter((r) => r.status === 'completed').length}
              </div>
              <p className="text-xs text-[#66747A]">
                {reviews.some((r) => r.status === 'pending_client_input')
                  ? '1 review pending your response'
                  : 'Cadence: Every 6 sessions'}
              </p>
              <button
                type="button"
                onClick={() => setActiveModule('reviews')}
                className="text-xs text-purple-800 font-semibold hover:underline flex items-center gap-1"
              >
                <span>Check reviews</span> <ChevronRight size={13} />
              </button>
            </div>
          </div>

          {/* Review Invitation Alert (if pending) */}
          {reviews.some((r) => r.status === 'pending_client_input') && (
            <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-xs text-purple-950 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-purple-700" /> Periodic Review Ready for Your Input
                </h4>
                <button
                  type="button"
                  onClick={() => {
                    const rev = reviews.find((r) => r.status === 'pending_client_input');
                    setSubmittingReview(rev);
                    setReviewResponseForm({
                      whatFeelsBetter: rev.what_feels_better || '',
                      whatRemainsDifficult: rev.what_remains_difficult || '',
                      whatHasChanged: rev.what_has_changed || '',
                      nextFocus: rev.next_focus || '',
                      meetingNeedsRating: rev.meeting_needs_rating || 'yes',
                    });
                  }}
                  className="bg-purple-800 hover:bg-purple-900 text-white text-xs px-3 py-1.5 rounded-lg font-semibold cursor-pointer"
                >
                  Share My Perspective
                </button>
              </div>
              <p className="text-xs text-purple-900/80 leading-relaxed">
                {clinicianName} has initiated your periodic check-in. Sharing how you feel helps evaluate your therapeutic milestones collaboratively.
              </p>
            </div>
          )}

          {/* Quick Peek: Active Goals */}
          <div className="bg-white border border-[#263238]/10 rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg text-[#132A24]">Current Active Goals</h3>
              <button
                type="button"
                onClick={() => {
                  setEditingGoal(null);
                  setGoalForm({
                    title: '',
                    description: '',
                    whyItMatters: '',
                    category: 'anxiety_management',
                    targetDate: '',
                    status: 'in_progress',
                    progressPercentage: 0,
                    clientNotes: '',
                  });
                  setShowGoalModal(true);
                }}
                className="bg-[#132A24] text-white hover:bg-[#1C3E35] text-xs px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Plus size={13} /> <span>New Goal</span>
              </button>
            </div>

            {activeGoals.length === 0 ? (
              <p className="text-xs text-[#66747A] py-4 text-center">
                No active therapeutic goals mapped yet. Propose your first goal to track progress with {clinicianName}.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeGoals.slice(0, 4).map((g) => (
                  <div
                    key={g.id}
                    className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-semibold text-xs text-[#132A24]">{g.title}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase">
                        {g.status.replace('_', ' ')}
                      </span>
                    </div>
                    {g.why_it_matters && (
                      <p className="text-[11px] text-[#66747A] italic">
                        &quot;{g.why_it_matters}&quot;
                      </p>
                    )}
                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-[10px] text-[#66747A]">
                        <span>Progress</span>
                        <span className="font-bold">{g.progress_percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-700 h-full rounded-full transition-all"
                          style={{ width: `${g.progress_percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 2. MODULE: GOALS MANAGEMENT                                          */}
      {/* ===================================================================== */}
      {activeModule === 'goals' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-[#263238]/10 shadow-2xs">
            <div>
              <h3 className="font-serif text-lg text-[#132A24]">Therapeutic Goals</h3>
              <p className="text-xs text-[#66747A] mt-0.5">
                Collaborative roadmap established with {clinicianName}. Track evolution and progress over time.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditingGoal(null);
                setGoalForm({
                  title: '',
                  description: '',
                  whyItMatters: '',
                  category: 'anxiety_management',
                  targetDate: '',
                  status: 'in_progress',
                  progressPercentage: 0,
                  clientNotes: '',
                });
                setShowGoalModal(true);
              }}
              className="bg-[#132A24] text-white hover:bg-[#1C3E35] text-xs px-3.5 py-2 rounded-xl font-semibold flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <Plus size={14} /> <span>Propose New Goal</span>
            </button>
          </div>

          {/* Active Goals Section */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#132A24] uppercase tracking-wider">
              Active Goals ({activeGoals.length})
            </h4>
            {activeGoals.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-gray-200 text-xs text-[#66747A]">
                No active goals currently in progress.
              </div>
            ) : (
              <div className="space-y-3">
                {activeGoals.map((g) => (
                  <div
                    key={g.id}
                    className="bg-white border border-[#263238]/10 rounded-2xl p-5 shadow-2xs space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif text-base text-[#132A24] font-medium">
                            {g.title}
                          </h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase">
                            {g.status.replace('_', ' ')}
                          </span>
                        </div>
                        {g.description && (
                          <p className="text-xs text-[#263238] mt-1 leading-relaxed">
                            {g.description}
                          </p>
                        )}
                        {g.why_it_matters && (
                          <p className="text-xs text-emerald-800 font-medium mt-1">
                            Why it matters: &quot;{g.why_it_matters}&quot;
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                        <button
                          type="button"
                          onClick={() => handleOpenGoalHistory(g)}
                          title="View revision history"
                          className="p-1.5 rounded-lg border border-gray-200 text-[#66747A] hover:text-[#132A24] text-xs flex items-center gap-1"
                        >
                          <History size={13} />
                          <span className="text-[11px]">History</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingGoal(g);
                            setGoalForm({
                              title: g.title,
                              description: g.description,
                              whyItMatters: g.why_it_matters,
                              category: g.category,
                              targetDate: g.target_date || '',
                              status: g.status,
                              progressPercentage: g.progress_percentage,
                              clientNotes: g.client_notes,
                            });
                            setShowGoalModal(true);
                          }}
                          className="p-1.5 rounded-lg border border-gray-200 text-[#66747A] hover:text-[#132A24] text-xs flex items-center gap-1"
                        >
                          <Edit2 size={13} />
                          <span className="text-[11px]">Update</span>
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-xs text-[#66747A]">
                        <span>Goal Completion</span>
                        <span className="font-bold text-[#132A24]">{g.progress_percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-700 h-full rounded-full transition-all"
                          style={{ width: `${g.progress_percentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Therapist Feedback & Client Notes */}
                    {(g.therapist_feedback || g.client_notes) && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                        {g.client_notes && (
                          <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 space-y-1">
                            <span className="text-[10px] uppercase font-bold text-gray-500">
                              Your Reflections
                            </span>
                            <p className="text-gray-800 leading-relaxed">{g.client_notes}</p>
                          </div>
                        )}
                        {g.therapist_feedback && (
                          <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 space-y-1">
                            <span className="text-[10px] uppercase font-bold text-emerald-800">
                              Feedback from {clinicianName}
                            </span>
                            <p className="text-emerald-950 leading-relaxed">{g.therapist_feedback}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Achieved Goals Section */}
          {achievedGoals.length > 0 && (
            <div className="space-y-3 pt-4">
              <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 size={14} /> Achieved Goals ({achievedGoals.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {achievedGoals.map((g) => (
                  <div
                    key={g.id}
                    className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-xs text-emerald-950 font-serif">{g.title}</h4>
                      <span className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                        100% Achieved
                      </span>
                    </div>
                    {g.description && <p className="text-[11px] text-emerald-900/80">{g.description}</p>}
                    <span className="text-[10px] text-emerald-800 block">
                      Completed: {g.completed_at ? new Date(g.completed_at).toLocaleDateString() : 'Recorded'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* 3. MODULE: PERSONAL LIFE EVENTS & MILESTONES                         */}
      {/* ===================================================================== */}
      {activeModule === 'life_events' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-[#263238]/10 shadow-2xs">
            <div>
              <h3 className="font-serif text-lg text-[#132A24]">Personal Life Events</h3>
              <p className="text-xs text-[#66747A] mt-0.5">
                Significant experiences and milestones. Choose what to share with {clinicianName} or keep private to your own timeline.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditingLifeEvent(null);
                setLifeEventForm({
                  title: '',
                  category: 'other',
                  eventDate: new Date().toISOString().split('T')[0],
                  description: '',
                  emotionalImpact: 'neutral',
                  discussInSession: false,
                  isSharedWithTherapist: true,
                });
                setShowLifeEventModal(true);
              }}
              className="bg-[#132A24] text-white hover:bg-[#1C3E35] text-xs px-3.5 py-2 rounded-xl font-semibold flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <Plus size={14} /> <span>Log Life Event</span>
            </button>
          </div>

          {lifeEvents.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-gray-200 text-xs text-[#66747A] space-y-2">
              <Calendar size={28} className="mx-auto text-gray-400" />
              <p className="font-semibold text-gray-700">No life events logged yet.</p>
              <p className="max-w-md mx-auto">
                Documenting major job changes, relationship shifts, moves, or family events helps contextualize your emotional resilience over time.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {lifeEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="bg-white border border-[#263238]/10 rounded-2xl p-5 shadow-2xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-gray-500 font-mono">
                          {new Date(ev.event_date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                        <h4 className="font-serif text-base text-[#132A24] font-medium">
                          {ev.title}
                        </h4>

                        {/* Privacy Badge */}
                        {ev.is_shared_with_therapist ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 flex items-center gap-1">
                            <Eye size={10} /> Shared with Clinician
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 flex items-center gap-1">
                            <Lock size={10} /> Private to Me
                          </span>
                        )}

                        {/* Discuss in Session Badge */}
                        {ev.discuss_in_session && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                            Discuss in upcoming session
                          </span>
                        )}
                      </div>

                      {ev.description && (
                        <p className="text-xs text-[#263238] mt-2 leading-relaxed">
                          {ev.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingLifeEvent(ev);
                          setLifeEventForm({
                            title: ev.title,
                            category: ev.category,
                            eventDate: ev.event_date,
                            description: ev.description,
                            emotionalImpact: ev.emotional_impact,
                            discussInSession: ev.discuss_in_session,
                            isSharedWithTherapist: ev.is_shared_with_therapist,
                          });
                          setShowLifeEventModal(true);
                        }}
                        className="p-1.5 rounded-lg border border-gray-200 text-[#66747A] hover:text-[#132A24] text-xs"
                        title="Edit event"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteLifeEvent(ev.id)}
                        className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs"
                        title="Delete event"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-[#66747A] pt-1 border-t border-gray-50">
                    <span>
                      Category: <strong className="capitalize">{ev.category.replace('_', ' ')}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Impact: <strong className="capitalize">{ev.emotional_impact.replace('_', ' ')}</strong>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* 4. MODULE: PERIODIC SESSION REVIEWS                                  */}
      {/* ===================================================================== */}
      {activeModule === 'reviews' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-[#263238]/10 shadow-2xs space-y-1">
            <h3 className="font-serif text-lg text-[#132A24]">Periodic Progress Reviews</h3>
            <p className="text-xs text-[#66747A] leading-relaxed">
              Every 4–6 sessions, structured reviews evaluate how therapy is addressing your needs. Reflect on what feels better, ongoing difficulties, and collaborative next steps.
            </p>
          </div>

          {reviews.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-gray-200 text-xs text-[#66747A] space-y-2">
              <MessageSquare size={28} className="mx-auto text-gray-400" />
              <p className="font-semibold text-gray-700">No periodic reviews initiated yet.</p>
              <p className="max-w-md mx-auto">
                Reviews are scheduled after your first 4–6 consultations with {clinicianName}.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white border border-[#263238]/10 rounded-2xl p-6 shadow-2xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-serif text-base text-[#132A24] font-medium">
                          {rev.review_period_label}
                        </h4>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            rev.status === 'completed'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : rev.status === 'pending_client_input'
                              ? 'bg-purple-100 text-purple-900 border border-purple-200'
                              : 'bg-blue-50 text-blue-800'
                          }`}
                        >
                          {rev.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#66747A]">
                        Initiated {new Date(rev.initiated_at).toLocaleDateString()} • Sessions Included: {rev.sessions_included}
                      </span>
                    </div>

                    {rev.status === 'pending_client_input' && (
                      <button
                        type="button"
                        onClick={() => {
                          setSubmittingReview(rev);
                          setReviewResponseForm({
                            whatFeelsBetter: rev.what_feels_better || '',
                            whatRemainsDifficult: rev.what_remains_difficult || '',
                            whatHasChanged: rev.what_has_changed || '',
                            nextFocus: rev.next_focus || '',
                            meetingNeedsRating: rev.meeting_needs_rating || 'yes',
                          });
                        }}
                        className="bg-purple-800 hover:bg-purple-900 text-white text-xs px-3.5 py-1.5 rounded-xl font-semibold cursor-pointer"
                      >
                        Share Your Perspective
                      </button>
                    )}
                  </div>

                  {/* Client Perspective Section */}
                  {(rev.status === 'client_submitted' || rev.status === 'completed') && (
                    <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-100 space-y-3">
                      <span className="text-[11px] uppercase font-bold text-gray-700 flex items-center gap-1.5">
                        <CheckCircle2 size={13} className="text-emerald-700" /> Your Perspective
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        {rev.what_feels_better && (
                          <div>
                            <span className="text-gray-500 font-semibold block text-[11px]">What feels better:</span>
                            <p className="text-gray-800 mt-0.5">{rev.what_feels_better}</p>
                          </div>
                        )}
                        {rev.what_remains_difficult && (
                          <div>
                            <span className="text-gray-500 font-semibold block text-[11px]">What remains difficult:</span>
                            <p className="text-gray-800 mt-0.5">{rev.what_remains_difficult}</p>
                          </div>
                        )}
                        {rev.what_has_changed && (
                          <div>
                            <span className="text-gray-500 font-semibold block text-[11px]">What has changed:</span>
                            <p className="text-gray-800 mt-0.5">{rev.what_has_changed}</p>
                          </div>
                        )}
                        {rev.next_focus && (
                          <div>
                            <span className="text-gray-500 font-semibold block text-[11px]">Focus for next period:</span>
                            <p className="text-gray-800 mt-0.5">{rev.next_focus}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Therapist Collaborative Feedback (if completed) */}
                  {rev.status === 'completed' && (
                    <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-100 space-y-3">
                      <span className="text-[11px] uppercase font-bold text-emerald-900 flex items-center gap-1.5">
                        <Sparkles size={13} className="text-emerald-700" /> Collaborative Feedback from {clinicianName}
                      </span>
                      <div className="space-y-2 text-xs">
                        {rev.progress_observed && (
                          <div>
                            <span className="text-emerald-900 font-semibold block text-[11px]">Progress Observed:</span>
                            <p className="text-emerald-950 mt-0.5">{rev.progress_observed}</p>
                          </div>
                        )}
                        {rev.collaborative_next_steps && (
                          <div>
                            <span className="text-emerald-900 font-semibold block text-[11px]">Collaborative Next Steps:</span>
                            <p className="text-emerald-950 mt-0.5">{rev.collaborative_next_steps}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* 5. MODULE: INTAKE & BACKGROUND                                       */}
      {/* ===================================================================== */}
      {activeModule === 'intake' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-[#263238]/10 shadow-2xs">
            <div>
              <h3 className="font-serif text-lg text-[#132A24]">Intake Form &amp; Background</h3>
              <p className="text-xs text-[#66747A] mt-0.5">
                Information shared at the start of therapy. Update reflections as your circumstances evolve.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setIntakeForm({
                  concerns: intake?.intake?.concerns || [],
                  affectedLifeAreas: intake?.intake?.affectedLifeAreas || [],
                  ownWords: intake?.intake?.ownWords || '',
                  expectations: intake?.intake?.expectations || {},
                  copingAndSupport: intake?.intake?.copingAndSupport || {},
                });
                setShowIntakeModal(true);
              }}
              className="bg-[#132A24] text-white hover:bg-[#1C3E35] text-xs px-3.5 py-2 rounded-xl font-semibold flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <Edit2 size={13} /> <span>Update Background</span>
            </button>
          </div>

          {/* Clarification Flags Alert (if any from therapist) */}
          {intake?.clarificationFlags && intake.clarificationFlags.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-2">
              <h4 className="font-semibold text-xs text-amber-900 flex items-center gap-1.5">
                <AlertCircle size={14} className="text-amber-700" /> Clinician Clarification Questions
              </h4>
              <div className="space-y-1.5">
                {intake.clarificationFlags.map((flag, idx) => (
                  <div key={idx} className="text-xs text-amber-950 bg-white p-2.5 rounded-lg border border-amber-200">
                    <strong className="capitalize">{flag.field.replace('_', ' ')}:</strong> {flag.note}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Intake Content Details */}
          {intake?.intake ? (
            <div className="bg-white border border-[#263238]/10 rounded-2xl p-6 shadow-2xs space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs border-b border-gray-100 pb-4">
                <div>
                  <span className="text-gray-500 font-semibold block text-[11px]">Presenting Reason</span>
                  <p className="text-gray-900 mt-1">{intake.intake.presentingReason || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-gray-500 font-semibold block text-[11px]">Primary Concerns</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {(intake.intake.concerns || []).map((c, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-800 text-[11px]">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {intake.intake.ownWords && (
                <div className="space-y-1 text-xs">
                  <span className="text-gray-500 font-semibold block text-[11px]">In Your Own Words</span>
                  <p className="text-gray-800 bg-gray-50 p-3 rounded-xl border border-gray-100 leading-relaxed">
                    {intake.intake.ownWords}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between text-[11px] text-[#66747A] pt-2">
                <span>Completed: {intake.completionDate ? new Date(intake.completionDate).toLocaleDateString() : 'Initial Onboarding'}</span>
                <span>Last Updated: {intake.lastUpdatedAt ? new Date(intake.lastUpdatedAt).toLocaleDateString() : 'Original Submission'}</span>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-2xl border border-gray-100 text-xs text-gray-500">
              No intake submission found on file.
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODALS                                                               */}
      {/* ===================================================================== */}

      {/* A. GOAL MODAL */}
      {showGoalModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 border border-gray-200 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-serif text-lg font-medium text-gray-900">
                {editingGoal ? 'Update Goal' : 'Propose New Therapeutic Goal'}
              </h3>
              <button
                type="button"
                onClick={() => setShowGoalModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveGoal} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#132A24] mb-1">Goal Title *</label>
                <input
                  type="text"
                  required
                  value={goalForm.title}
                  onChange={(e) => setGoalForm({ ...goalForm, title: e.target.value })}
                  placeholder="e.g. Manage panic attacks in social environments"
                  className="w-full p-2.5 rounded-xl border border-gray-200 focus:ring-1 focus:ring-emerald-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#132A24] mb-1">Why this matters to you</label>
                <input
                  type="text"
                  value={goalForm.whyItMatters}
                  onChange={(e) => setGoalForm({ ...goalForm, whyItMatters: e.target.value })}
                  placeholder="e.g. So I can attend family gatherings without anxiety"
                  className="w-full p-2.5 rounded-xl border border-gray-200 focus:ring-1 focus:ring-emerald-800 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#132A24] mb-1">Category</label>
                  <select
                    value={goalForm.category}
                    onChange={(e) => setGoalForm({ ...goalForm, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:ring-1 focus:ring-emerald-800 focus:outline-none"
                  >
                    <option value="anxiety_management">Anxiety Management</option>
                    <option value="emotional_regulation">Emotional Regulation</option>
                    <option value="interpersonal_relationships">Interpersonal Relationships</option>
                    <option value="life_transition">Life Transition</option>
                    <option value="career_academics">Career &amp; Academics</option>
                    <option value="habits_routines">Habits &amp; Routines</option>
                    <option value="mindfulness_acceptance">Mindfulness &amp; Acceptance</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#132A24] mb-1">Status</label>
                  <select
                    value={goalForm.status}
                    onChange={(e) => setGoalForm({ ...goalForm, status: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:ring-1 focus:ring-emerald-800 focus:outline-none"
                  >
                    <option value="in_progress">In Progress</option>
                    <option value="not_started">Not Started</option>
                    <option value="needs_attention">Needs Attention</option>
                    <option value="achieved">Achieved (100%)</option>
                    <option value="paused">Paused</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#132A24] mb-1">
                  Progress Percentage ({goalForm.progressPercentage}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={goalForm.progressPercentage}
                  onChange={(e) => setGoalForm({ ...goalForm, progressPercentage: e.target.value })}
                  className="w-full accent-emerald-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#132A24] mb-1">Personal Notes / Reflection</label>
                <textarea
                  rows={2}
                  value={goalForm.clientNotes}
                  onChange={(e) => setGoalForm({ ...goalForm, clientNotes: e.target.value })}
                  placeholder="Note small wins or challenges encountered..."
                  className="w-full p-2.5 rounded-xl border border-gray-200 focus:ring-1 focus:ring-emerald-800 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowGoalModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingGoal}
                  className="bg-[#132A24] text-white hover:bg-[#1C3E35] disabled:opacity-50 px-4 py-2 rounded-xl font-semibold"
                >
                  {savingGoal ? 'Saving...' : editingGoal ? 'Update Goal' : 'Create Goal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* B. LIFE EVENT MODAL */}
      {showLifeEventModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 border border-gray-200 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-serif text-lg font-medium text-gray-900">
                {editingLifeEvent ? 'Edit Life Event' : 'Log Personal Milestone'}
              </h3>
              <button
                type="button"
                onClick={() => setShowLifeEventModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveLifeEvent} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#132A24] mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  value={lifeEventForm.title}
                  onChange={(e) => setLifeEventForm({ ...lifeEventForm, title: e.target.value })}
                  placeholder="e.g. Changed company, moved to new apartment"
                  className="w-full p-2.5 rounded-xl border border-gray-200 focus:ring-1 focus:ring-emerald-800 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#132A24] mb-1">Approximate Date *</label>
                  <input
                    type="date"
                    required
                    value={lifeEventForm.eventDate}
                    onChange={(e) => setLifeEventForm({ ...lifeEventForm, eventDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:ring-1 focus:ring-emerald-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#132A24] mb-1">Category</label>
                  <select
                    value={lifeEventForm.category}
                    onChange={(e) => setLifeEventForm({ ...lifeEventForm, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:ring-1 focus:ring-emerald-800 focus:outline-none"
                  >
                    <option value="career_education">Career &amp; Education</option>
                    <option value="relationships_family">Relationships &amp; Family</option>
                    <option value="health_wellness">Health &amp; Wellness</option>
                    <option value="loss_bereavement">Loss &amp; Bereavement</option>
                    <option value="relocation_home">Relocation &amp; Home</option>
                    <option value="achievement_milestone">Achievement &amp; Milestone</option>
                    <option value="financial_stress">Financial Stress</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#132A24] mb-1">Emotional Impact</label>
                <select
                  value={lifeEventForm.emotionalImpact}
                  onChange={(e) => setLifeEventForm({ ...lifeEventForm, emotionalImpact: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 focus:ring-1 focus:ring-emerald-800 focus:outline-none"
                >
                  <option value="positive">Positive / Uplifting</option>
                  <option value="neutral">Neutral / Balanced</option>
                  <option value="challenging">Challenging / Stressful</option>
                  <option value="mixed">Mixed Emotions</option>
                  <option value="severe_distress">High Distress</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#132A24] mb-1">Description (Optional)</label>
                <textarea
                  rows={3}
                  value={lifeEventForm.description}
                  onChange={(e) => setLifeEventForm({ ...lifeEventForm, description: e.target.value })}
                  placeholder="Share details or context about how this impacted your routine..."
                  className="w-full p-2.5 rounded-xl border border-gray-200 focus:ring-1 focus:ring-emerald-800 focus:outline-none"
                />
              </div>

              {/* Privacy and Discussion Toggles */}
              <div className="space-y-2 p-3.5 rounded-xl bg-gray-50 border border-gray-200">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={lifeEventForm.isSharedWithTherapist}
                    onChange={(e) =>
                      setLifeEventForm({ ...lifeEventForm, isSharedWithTherapist: e.target.checked })
                    }
                    className="accent-emerald-800 w-4 h-4 rounded"
                  />
                  <span className="font-semibold text-gray-900">
                    Share with {clinicianName}
                  </span>
                </label>
                <p className="text-[11px] text-gray-500 pl-6">
                  When unchecked, this entry remains 100% private to you and will never be seen by your clinician.
                </p>

                <label className="flex items-center gap-2 cursor-pointer pt-2">
                  <input
                    type="checkbox"
                    checked={lifeEventForm.discussInSession}
                    onChange={(e) =>
                      setLifeEventForm({ ...lifeEventForm, discussInSession: e.target.checked })
                    }
                    className="accent-emerald-800 w-4 h-4 rounded"
                  />
                  <span className="font-semibold text-gray-900">
                    Flag to discuss in upcoming session
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowLifeEventModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingLifeEvent}
                  className="bg-[#132A24] text-white hover:bg-[#1C3E35] disabled:opacity-50 px-4 py-2 rounded-xl font-semibold"
                >
                  {savingLifeEvent ? 'Saving...' : editingLifeEvent ? 'Update Event' : 'Log Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* C. PERIODIC REVIEW SUBMISSION MODAL */}
      {submittingReview && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 border border-gray-200 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div>
                <h3 className="font-serif text-lg font-medium text-gray-900">
                  Periodic Review: {submittingReview.review_period_label}
                </h3>
                <p className="text-xs text-gray-500">Share your perspective on progress</p>
              </div>
              <button
                type="button"
                onClick={() => setSubmittingReview(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitReviewResponse} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#132A24] mb-1">
                  1. What feels better since beginning therapy?
                </label>
                <textarea
                  rows={2}
                  required
                  value={reviewResponseForm.whatFeelsBetter}
                  onChange={(e) =>
                    setReviewResponseForm({ ...reviewResponseForm, whatFeelsBetter: e.target.value })
                  }
                  placeholder="Reflect on shifts in mood, clarity, or behavior..."
                  className="w-full p-2.5 rounded-xl border border-gray-200 focus:ring-1 focus:ring-emerald-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#132A24] mb-1">
                  2. What remains difficult or stressful?
                </label>
                <textarea
                  rows={2}
                  required
                  value={reviewResponseForm.whatRemainsDifficult}
                  onChange={(e) =>
                    setReviewResponseForm({ ...reviewResponseForm, whatRemainsDifficult: e.target.value })
                  }
                  placeholder="Persistent triggers, unresolved challenges..."
                  className="w-full p-2.5 rounded-xl border border-gray-200 focus:ring-1 focus:ring-emerald-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#132A24] mb-1">
                  3. What has changed overall in your daily routines?
                </label>
                <textarea
                  rows={2}
                  required
                  value={reviewResponseForm.whatHasChanged}
                  onChange={(e) =>
                    setReviewResponseForm({ ...reviewResponseForm, whatHasChanged: e.target.value })
                  }
                  placeholder="Sleep patterns, boundaries, emotional regulation..."
                  className="w-full p-2.5 rounded-xl border border-gray-200 focus:ring-1 focus:ring-emerald-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#132A24] mb-1">
                  4. What would you like to focus on in the next period?
                </label>
                <textarea
                  rows={2}
                  value={reviewResponseForm.nextFocus}
                  onChange={(e) =>
                    setReviewResponseForm({ ...reviewResponseForm, nextFocus: e.target.value })
                  }
                  placeholder="Topics or interventions to explore with your clinician..."
                  className="w-full p-2.5 rounded-xl border border-gray-200 focus:ring-1 focus:ring-emerald-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#132A24] mb-1">
                  5. Do you feel therapy is addressing your needs?
                </label>
                <select
                  value={reviewResponseForm.meetingNeedsRating}
                  onChange={(e) =>
                    setReviewResponseForm({ ...reviewResponseForm, meetingNeedsRating: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border border-gray-200 focus:ring-1 focus:ring-emerald-800 focus:outline-none"
                >
                  <option value="yes">Yes, very effectively</option>
                  <option value="partially">Partially, making progress</option>
                  <option value="needs_adjustment">Needs some adjustment</option>
                  <option value="no">Not meeting expectations</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setSubmittingReview(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingReviewResponse}
                  className="bg-purple-800 text-white hover:bg-purple-900 disabled:opacity-50 px-4 py-2 rounded-xl font-semibold"
                >
                  {savingReviewResponse ? 'Submitting...' : 'Submit Perspective'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* D. GOAL HISTORY DRAWER / MODAL */}
      {viewingGoalHistory && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-gray-200 shadow-xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-serif text-base font-medium text-gray-900">
                Goal Revision History
              </h3>
              <button
                type="button"
                onClick={() => setViewingGoalHistory(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <div className="font-semibold text-xs text-[#132A24]">{viewingGoalHistory.title}</div>
              {loadingGoalHistory ? (
                <div className="py-6 text-center text-xs text-gray-500">Loading audit trail...</div>
              ) : goalHistoryList.length === 0 ? (
                <div className="py-6 text-center text-xs text-gray-500">No revisions logged yet.</div>
              ) : (
                <div className="space-y-2.5">
                  {goalHistoryList.map((h) => (
                    <div key={h.id} className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-gray-500">
                        <span>
                          By: <strong className="capitalize">{h.changed_by_role}</strong>
                        </span>
                        <span>{new Date(h.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="text-gray-800">
                        Status: <strong>{h.new_status}</strong> ({h.new_progress}%)
                      </div>
                      {h.change_reason && (
                        <div className="text-gray-600 italic">&quot;{h.change_reason}&quot;</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
