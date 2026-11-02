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
  ChevronRight,
  MessageSquare,
  History,
  X,
  Edit2,
  Check,
  Shield,
  Layers,
} from 'lucide-react';

export default function TherapistTherapeuticProfileView({
  clientId,
  relationshipId,
  clientName = 'Client',
}) {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('goals'); // goals | life_events | reviews | intake

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
    therapistFeedback: '',
  });
  const [savingGoal, setSavingGoal] = useState(false);

  // Goal History modal
  const [viewingGoalHistory, setViewingGoalHistory] = useState(null);
  const [goalHistoryList, setGoalHistoryList] = useState([]);
  const [loadingGoalHistory, setLoadingGoalHistory] = useState(false);

  // Clarification flag modal
  const [showClarificationModal, setShowClarificationModal] = useState(false);
  const [clarificationField, setClarificationField] = useState('presenting_reason');
  const [clarificationNote, setClarificationNote] = useState('');
  const [savingClarification, setSavingClarification] = useState(false);

  // Periodic Review modals
  const [showInitiateReviewModal, setShowInitiateReviewModal] = useState(false);
  const [initiateReviewForm, setInitiateReviewForm] = useState({
    reviewPeriodLabel: 'Session 1–6 Mid-Point Review',
    sessionsIncluded: 6,
    nextReviewDueDate: '',
  });
  const [initiatingReview, setInitiatingReview] = useState(false);

  // Review Feedback & Internal Notes Modal
  const [completingReview, setCompletingReview] = useState(null);
  const [reviewCompletionForm, setReviewCompletionForm] = useState({
    progressObserved: '',
    collaborativeNextSteps: '',
    feedbackForClient: '',
    nextReviewDueDate: '',
    clinicalNotesInternal: '',
    clinicalRiskAssessmentNotes: '',
    diagnosticImpressions: '',
  });
  const [savingCompletion, setSavingCompletion] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/therapist/clients/${clientId}/therapeutic-profile`);
      const json = await res.json();
      if (res.ok) {
        setProfileData(json);
      } else {
        setError(json.error?.message || 'Unable to load therapeutic profile.');
      }
    } catch (err) {
      console.error('Failed to fetch therapeutic profile:', err);
      setError('Network connection error loading therapeutic profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [clientId]);

  // Goal Save Handler
  const handleSaveGoal = async (e) => {
    e.preventDefault();
    if (!goalForm.title.trim()) return;
    setSavingGoal(true);
    try {
      if (editingGoal) {
        const res = await fetch(
          `/api/therapist/clients/${clientId}/therapeutic-profile/goals/${editingGoal.id}`,
          {
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
                therapistFeedback: goalForm.therapistFeedback,
              },
              changeReason: 'Therapist collaborative update',
            }),
          }
        );
        if (!res.ok) throw new Error('Failed to update goal');
      } else {
        const res = await fetch(
          `/api/therapist/clients/${clientId}/therapeutic-profile/goals`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...goalForm,
              progressPercentage: Number(goalForm.progressPercentage),
            }),
          }
        );
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
      const res = await fetch(
        `/api/therapy/client/therapeutic-profile/goals/${goal.id}/history`
      );
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

  // Clarification Flag Handler
  const handleSaveClarification = async (e) => {
    e.preventDefault();
    setSavingClarification(true);
    try {
      const existingFlags = profileData?.intake?.clarificationFlags || [];
      const updatedFlags = [
        ...existingFlags,
        { field: clarificationField, note: clarificationNote },
      ];
      const res = await fetch(
        `/api/therapist/clients/${clientId}/therapeutic-profile/intake/clarify`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ clarificationFlags: updatedFlags }),
        }
      );
      if (!res.ok) throw new Error('Failed to flag clarification');
      setShowClarificationModal(false);
      setClarificationNote('');
      await fetchProfile();
    } catch (err) {
      alert(err.message || 'Error flagging clarification');
    } finally {
      setSavingClarification(false);
    }
  };

  const handleMarkIntakeReviewed = async () => {
    try {
      const res = await fetch(
        `/api/therapist/clients/${clientId}/therapeutic-profile/intake/clarify`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ markReviewed: true }),
        }
      );
      if (res.ok) {
        await fetchProfile();
      }
    } catch (err) {
      console.error('Failed to mark intake reviewed:', err);
    }
  };

  // Initiate Periodic Review Handler
  const handleInitiateReview = async (e) => {
    e.preventDefault();
    setInitiatingReview(true);
    try {
      const res = await fetch(
        `/api/therapist/clients/${clientId}/therapeutic-profile/reviews/initiate`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(initiateReviewForm),
        }
      );
      if (!res.ok) throw new Error('Failed to initiate review');
      setShowInitiateReviewModal(false);
      await fetchProfile();
    } catch (err) {
      alert(err.message || 'Error initiating review');
    } finally {
      setInitiatingReview(false);
    }
  };

  // Complete Review Handler
  const handleCompleteReview = async (e) => {
    e.preventDefault();
    if (!completingReview) return;
    setSavingCompletion(true);
    try {
      const res = await fetch(
        `/api/therapist/clients/${clientId}/therapeutic-profile/reviews/${completingReview.id}/complete`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            feedback: {
              progressObserved: reviewCompletionForm.progressObserved,
              collaborativeNextSteps: reviewCompletionForm.collaborativeNextSteps,
              feedbackForClient: reviewCompletionForm.feedbackForClient,
              nextReviewDueDate: reviewCompletionForm.nextReviewDueDate || null,
            },
            internalClinicalNotes: {
              clinicalNotesInternal: reviewCompletionForm.clinicalNotesInternal,
              clinicalRiskAssessmentNotes: reviewCompletionForm.clinicalRiskAssessmentNotes,
              diagnosticImpressions: reviewCompletionForm.diagnosticImpressions,
            },
          }),
        }
      );
      if (!res.ok) throw new Error('Failed to complete review');
      setCompletingReview(null);
      await fetchProfile();
    } catch (err) {
      alert(err.message || 'Error completing review');
    } finally {
      setSavingCompletion(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 text-center space-y-3 bg-white border border-[#263238]/10 rounded-2xl">
        <div className="w-8 h-8 border-2 border-emerald-800 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-[#66747A]">Loading client therapeutic profile...</p>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-2">
        <div className="flex items-center gap-2 text-amber-900 font-semibold text-xs">
          <AlertCircle size={16} /> Caseload Authorization Notice
        </div>
        <p className="text-xs leading-relaxed text-amber-800">
          {error || 'Unable to access therapeutic profile for this client.'}
        </p>
      </div>
    );
  }

  const { intake, goals, sharedLifeEvents = [], reviews = [] } = profileData;
  const activeGoals = goals?.active || [];
  const achievedGoals = goals?.achieved || [];
  const pausedGoals = goals?.paused || [];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-[#263238]/10 shadow-2xs">
        <div>
          <span className="text-[11px] uppercase tracking-wider font-bold text-emerald-800 flex items-center gap-1.5">
            <HeartHandshake size={13} /> Longitudinal Therapeutic Profile
          </span>
          <h2 className="font-serif text-xl sm:text-2xl text-[#132A24] mt-0.5">
            {clientName}&apos;s Living Record
          </h2>
          <p className="text-xs text-[#66747A] mt-0.5">
            Collaborative goals, client-shared milestones, intake background, and longitudinal progress reviews.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchProfile}
          title="Refresh profile"
          className="p-2 rounded-xl border border-[#263238]/15 text-[#66747A] hover:text-[#132A24] hover:bg-white self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw size={14} />
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1.5 border-b border-[#263238]/10 pb-2 overflow-x-auto">
        {[
          { id: 'goals', label: `Goals (${activeGoals.length})`, icon: Target },
          { id: 'life_events', label: `Shared Milestones (${sharedLifeEvents.length})`, icon: Calendar },
          { id: 'reviews', label: `Periodic Reviews (${reviews.length})`, icon: MessageSquare },
          { id: 'intake', label: 'Intake & Context', icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
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
      {/* 1. TAB: COLLABORATIVE GOALS                                          */}
      {/* ===================================================================== */}
      {activeTab === 'goals' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg text-[#132A24]">Collaborative Therapeutic Goals</h3>
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
                  therapistFeedback: '',
                });
                setShowGoalModal(true);
              }}
              className="bg-[#132A24] text-white hover:bg-[#1C3E35] text-xs px-3.5 py-1.5 rounded-xl font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Plus size={13} /> <span>Add Collaborative Goal</span>
            </button>
          </div>

          {activeGoals.length === 0 ? (
            <div className="p-10 text-center bg-white rounded-2xl border border-dashed border-gray-200 text-xs text-[#66747A]">
              No active goals established yet. Propose or collaborate with {clientName} to map therapeutic goals.
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
                        <span className="text-[10px] text-gray-400 capitalize">
                          By {g.created_by_role}
                        </span>
                      </div>
                      {g.description && (
                        <p className="text-xs text-[#263238] mt-1 leading-relaxed">
                          {g.description}
                        </p>
                      )}
                      {g.why_it_matters && (
                        <p className="text-xs text-emerald-800 font-medium mt-1">
                          Client motivation: &quot;{g.why_it_matters}&quot;
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleOpenGoalHistory(g)}
                        className="p-1.5 rounded-lg border border-gray-200 text-[#66747A] hover:text-[#132A24] text-xs flex items-center gap-1"
                      >
                        <History size={13} />
                        <span className="text-[11px]">Audit</span>
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
                            therapistFeedback: g.therapist_feedback,
                          });
                          setShowGoalModal(true);
                        }}
                        className="p-1.5 rounded-lg border border-gray-200 text-[#66747A] hover:text-[#132A24] text-xs flex items-center gap-1"
                      >
                        <Edit2 size={13} />
                        <span className="text-[11px]">Update / Feedback</span>
                      </button>
                    </div>
                  </div>

                  {/* Progress Indicator */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-[#66747A]">
                      <span>Progress</span>
                      <span className="font-bold text-[#132A24]">{g.progress_percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-700 h-full rounded-full transition-all"
                        style={{ width: `${g.progress_percentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Reflections & Clinician Feedback */}
                  {(g.client_notes || g.therapist_feedback) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                      {g.client_notes && (
                        <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 space-y-1">
                          <span className="text-[10px] uppercase font-bold text-gray-500">
                            Client Reflections
                          </span>
                          <p className="text-gray-800 leading-relaxed">{g.client_notes}</p>
                        </div>
                      )}
                      {g.therapist_feedback && (
                        <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 space-y-1">
                          <span className="text-[10px] uppercase font-bold text-emerald-800">
                            Your Clinical Feedback
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

          {achievedGoals.length > 0 && (
            <div className="space-y-2 pt-4">
              <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 size={14} /> Achieved Goals ({achievedGoals.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {achievedGoals.map((g) => (
                  <div
                    key={g.id}
                    className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/30 text-xs space-y-1"
                  >
                    <div className="font-medium text-emerald-950 font-serif">{g.title}</div>
                    <div className="text-[11px] text-emerald-800">100% Achieved</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* 2. TAB: CLIENT-SHARED LIFE EVENTS                                    */}
      {/* ===================================================================== */}
      {activeTab === 'life_events' && (
        <div className="space-y-5">
          <div className="bg-white p-5 rounded-2xl border border-[#263238]/10 shadow-2xs space-y-1">
            <h3 className="font-serif text-lg text-[#132A24]">Client-Shared Life Milestones</h3>
            <p className="text-xs text-[#66747A] leading-relaxed">
              These events have been explicitly shared by {clientName} to help inform formulation and session pacing. (Private events are strictly kept invisible).
            </p>
          </div>

          {sharedLifeEvents.length === 0 ? (
            <div className="p-10 text-center bg-white rounded-2xl border border-dashed border-gray-200 text-xs text-[#66747A]">
              No shared life events logged by the client yet.
            </div>
          ) : (
            <div className="space-y-3">
              {sharedLifeEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="bg-white border border-[#263238]/10 rounded-2xl p-5 shadow-2xs space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-gray-500 font-mono">
                          {new Date(ev.event_date).toLocaleDateString()}
                        </span>
                        <h4 className="font-serif text-base text-[#132A24] font-medium">
                          {ev.title}
                        </h4>
                        {ev.discuss_in_session && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                            Client wants to discuss in session
                          </span>
                        )}
                      </div>
                      {ev.description && (
                        <p className="text-xs text-gray-800 leading-relaxed pt-1">
                          {ev.description}
                        </p>
                      )}
                    </div>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700 shrink-0">
                      {ev.category.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="text-[11px] text-[#66747A] pt-1 border-t border-gray-50">
                    Emotional impact noted: <strong className="capitalize">{ev.emotional_impact.replace('_', ' ')}</strong>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* 3. TAB: PERIODIC SESSION REVIEWS                                     */}
      {/* ===================================================================== */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-[#263238]/10 shadow-2xs">
            <div>
              <h3 className="font-serif text-lg text-[#132A24]">Periodic Progress Reviews</h3>
              <p className="text-xs text-[#66747A] mt-0.5">
                Longitudinal evaluation conducted every 4–6 consultations. Combines client self-evaluation with your clinical observations.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowInitiateReviewModal(true);
              }}
              className="bg-[#132A24] text-white hover:bg-[#1C3E35] text-xs px-3.5 py-2 rounded-xl font-semibold flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <Plus size={14} /> <span>Initiate Periodic Review</span>
            </button>
          </div>

          {reviews.length === 0 ? (
            <div className="p-10 text-center bg-white rounded-2xl border border-dashed border-gray-200 text-xs text-[#66747A]">
              No periodic reviews conducted yet. Initiate a review to gather client feedback and document treatment milestones.
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
                              : rev.status === 'client_submitted'
                              ? 'bg-purple-50 text-purple-800 border border-purple-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {rev.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#66747A]">
                        Initiated {new Date(rev.initiated_at).toLocaleDateString()} • Sessions Included: {rev.sessions_included}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setCompletingReview(rev);
                        setReviewCompletionForm({
                          progressObserved: rev.progress_observed || '',
                          collaborativeNextSteps: rev.collaborative_next_steps || '',
                          feedbackForClient: rev.feedback_for_client || '',
                          nextReviewDueDate: rev.next_review_due_date || '',
                          clinicalNotesInternal:
                            rev.internal_notes?.clinical_notes_internal || '',
                          clinicalRiskAssessmentNotes:
                            rev.internal_notes?.clinical_risk_assessment_notes || '',
                          diagnosticImpressions:
                            rev.internal_notes?.diagnostic_impressions || '',
                        });
                      }}
                      className="bg-[#132A24] text-white hover:bg-[#1C3E35] text-xs px-3.5 py-1.5 rounded-xl font-semibold cursor-pointer"
                    >
                      {rev.status === 'completed' ? 'Edit Feedback & Notes' : 'Review & Complete'}
                    </button>
                  </div>

                  {/* Client Perspective Preview */}
                  {(rev.status === 'client_submitted' || rev.status === 'completed') && (
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2 text-xs">
                      <span className="font-bold text-gray-700 block text-[11px] uppercase">
                        Client Self-Reflection:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <strong className="text-gray-600 block text-[10px]">What feels better:</strong>
                          <p className="text-gray-900 mt-0.5">{rev.what_feels_better || 'None noted'}</p>
                        </div>
                        <div>
                          <strong className="text-gray-600 block text-[10px]">Difficulties:</strong>
                          <p className="text-gray-900 mt-0.5">{rev.what_remains_difficult || 'None noted'}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Therapist Internal Notes Status */}
                  {rev.internal_notes && (
                    <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-amber-950 text-[11px] uppercase">
                        <Lock size={12} className="text-amber-700" /> Secure Clinician Formulation (Private to you)
                      </div>
                      <p className="text-amber-900/90 leading-relaxed text-[11px]">
                        {rev.internal_notes.clinical_notes_internal || 'No internal formulation recorded yet.'}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* 4. TAB: INTAKE & BACKGROUND                                          */}
      {/* ===================================================================== */}
      {activeTab === 'intake' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-[#263238]/10 shadow-2xs">
            <div>
              <h3 className="font-serif text-lg text-[#132A24]">Client Intake &amp; Background</h3>
              <p className="text-xs text-[#66747A] mt-0.5">
                Initial referral and onboarding answers. Flag items requiring clinical clarification during consultation.
              </p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setShowClarificationModal(true)}
                className="bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1 cursor-pointer"
              >
                <AlertCircle size={13} /> <span>Flag for Clarification</span>
              </button>
              <button
                type="button"
                onClick={handleMarkIntakeReviewed}
                className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Check size={13} /> <span>Mark Reviewed</span>
              </button>
            </div>
          </div>

          {/* Clarification Flags */}
          {intake?.clarificationFlags && intake.clarificationFlags.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-2">
              <h4 className="font-semibold text-xs text-amber-900 flex items-center gap-1.5">
                <AlertCircle size={14} className="text-amber-700" /> Active Clarification Question(s)
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

          {/* Intake Information */}
          {intake?.intake ? (
            <div className="bg-white border border-[#263238]/10 rounded-2xl p-6 shadow-2xs space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-gray-100 pb-4">
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
                <div className="space-y-1">
                  <span className="text-gray-500 font-semibold block text-[11px]">In Client&apos;s Own Words</span>
                  <p className="text-gray-800 bg-gray-50 p-3 rounded-xl border border-gray-100 leading-relaxed">
                    {intake.intake.ownWords}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between text-[11px] text-[#66747A] pt-2">
                <span>Completed: {intake.completionDate ? new Date(intake.completionDate).toLocaleDateString() : 'Onboarding'}</span>
                <span>Last Reviewed: {intake.lastReviewedByTherapistAt ? new Date(intake.lastReviewedByTherapistAt).toLocaleDateString() : 'Not recorded'}</span>
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

      {/* A. THERAPIST GOAL MODAL */}
      {showGoalModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 border border-gray-200 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-serif text-lg font-medium text-gray-900">
                {editingGoal ? 'Update Goal & Feedback' : 'Add Collaborative Goal'}
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
                  placeholder="e.g. Develop cognitive restructuring routine"
                  className="w-full p-2.5 rounded-xl border border-gray-200 focus:ring-1 focus:ring-emerald-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#132A24] mb-1">Clinical Description / Focus</label>
                <textarea
                  rows={2}
                  value={goalForm.description}
                  onChange={(e) => setGoalForm({ ...goalForm, description: e.target.value })}
                  placeholder="Clinical intervention notes and context..."
                  className="w-full p-2.5 rounded-xl border border-gray-200 focus:ring-1 focus:ring-emerald-800 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
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
                    <option value="revised">Revised</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#132A24] mb-1">
                    Progress ({goalForm.progressPercentage}%)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={goalForm.progressPercentage}
                    onChange={(e) => setGoalForm({ ...goalForm, progressPercentage: e.target.value })}
                    className="w-full accent-emerald-800 mt-2"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#132A24] mb-1">
                  Therapist Feedback (Visible to Client)
                </label>
                <textarea
                  rows={3}
                  value={goalForm.therapistFeedback}
                  onChange={(e) => setGoalForm({ ...goalForm, therapistFeedback: e.target.value })}
                  placeholder="Collaborative feedback or encouraging notes for the client..."
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
                  {savingGoal ? 'Saving...' : editingGoal ? 'Update Goal' : 'Add Goal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* B. INITIATE REVIEW MODAL */}
      {showInitiateReviewModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-gray-200 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-serif text-lg font-medium text-gray-900">
                Initiate Periodic Progress Review
              </h3>
              <button
                type="button"
                onClick={() => setShowInitiateReviewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleInitiateReview} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#132A24] mb-1">Review Period Label *</label>
                <input
                  type="text"
                  required
                  value={initiateReviewForm.reviewPeriodLabel}
                  onChange={(e) =>
                    setInitiateReviewForm({ ...initiateReviewForm, reviewPeriodLabel: e.target.value })
                  }
                  placeholder="e.g. Session 1–6 Review"
                  className="w-full p-2.5 rounded-xl border border-gray-200 focus:ring-1 focus:ring-emerald-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#132A24] mb-1">Sessions Included</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={initiateReviewForm.sessionsIncluded}
                  onChange={(e) =>
                    setInitiateReviewForm({ ...initiateReviewForm, sessionsIncluded: Number(e.target.value) })
                  }
                  className="w-full p-2.5 rounded-xl border border-gray-200 focus:ring-1 focus:ring-emerald-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#132A24] mb-1">Next Review Target Date (Optional)</label>
                <input
                  type="date"
                  value={initiateReviewForm.nextReviewDueDate}
                  onChange={(e) =>
                    setInitiateReviewForm({ ...initiateReviewForm, nextReviewDueDate: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border border-gray-200 focus:ring-1 focus:ring-emerald-800 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowInitiateReviewModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={initiatingReview}
                  className="bg-[#132A24] text-white hover:bg-[#1C3E35] disabled:opacity-50 px-4 py-2 rounded-xl font-semibold"
                >
                  {initiatingReview ? 'Initiating...' : 'Send Review to Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* C. COMPLETE REVIEW & SECURE INTERNAL NOTES MODAL */}
      {completingReview && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 border border-gray-200 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div>
                <h3 className="font-serif text-lg font-medium text-gray-900">
                  Complete Periodic Review: {completingReview.review_period_label}
                </h3>
                <p className="text-xs text-gray-500">Document client-facing feedback and private clinical formulation</p>
              </div>
              <button
                type="button"
                onClick={() => setCompletingReview(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCompleteReview} className="space-y-4 text-xs">
              {/* Client-Visible Section */}
              <div className="space-y-3 p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
                <span className="text-[11px] uppercase font-bold text-emerald-900 block">
                  1. Client-Facing Feedback (Visible in Client Portal)
                </span>

                <div>
                  <label className="block font-semibold text-emerald-950 mb-1">Progress Observed *</label>
                  <textarea
                    rows={2}
                    required
                    value={reviewCompletionForm.progressObserved}
                    onChange={(e) =>
                      setReviewCompletionForm({ ...reviewCompletionForm, progressObserved: e.target.value })
                    }
                    placeholder="Notable shifts in emotional regulation, behavioral experiments completed..."
                    className="w-full p-2.5 rounded-xl border border-emerald-200 bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-emerald-950 mb-1">Collaborative Next Steps</label>
                  <textarea
                    rows={2}
                    value={reviewCompletionForm.collaborativeNextSteps}
                    onChange={(e) =>
                      setReviewCompletionForm({ ...reviewCompletionForm, collaborativeNextSteps: e.target.value })
                    }
                    placeholder="Agreed focus areas for upcoming consultations..."
                    className="w-full p-2.5 rounded-xl border border-emerald-200 bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Therapist-Only Internal Notes Section */}
              <div className="space-y-3 p-4 rounded-xl bg-amber-50/60 border border-amber-200">
                <span className="text-[11px] uppercase font-bold text-amber-950 flex items-center gap-1.5">
                  <Lock size={12} className="text-amber-800" /> 2. Clinician-Only Formulation (Strictly Isolated &amp; Private)
                </span>
                <p className="text-[11px] text-amber-900/80">
                  This content is NEVER returned by client-facing APIs, exports, or portal views.
                </p>

                <div>
                  <label className="block font-semibold text-amber-950 mb-1">Internal Clinical Formulation / Notes</label>
                  <textarea
                    rows={3}
                    value={reviewCompletionForm.clinicalNotesInternal}
                    onChange={(e) =>
                      setReviewCompletionForm({ ...reviewCompletionForm, clinicalNotesInternal: e.target.value })
                    }
                    placeholder="Working clinical hypotheses, psychodynamic observations, alliance dynamics..."
                    className="w-full p-2.5 rounded-xl border border-amber-200 bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setCompletingReview(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingCompletion}
                  className="bg-[#132A24] text-white hover:bg-[#1C3E35] disabled:opacity-50 px-4 py-2 rounded-xl font-semibold"
                >
                  {savingCompletion ? 'Saving...' : 'Finalize Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* D. CLARIFICATION MODAL */}
      {showClarificationModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-gray-200 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-serif text-lg font-medium text-gray-900">
                Flag Question for Clarification
              </h3>
              <button
                type="button"
                onClick={() => setShowClarificationModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveClarification} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#132A24] mb-1">Intake Field</label>
                <select
                  value={clarificationField}
                  onChange={(e) => setClarificationField(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none"
                >
                  <option value="presenting_reason">Presenting Reason</option>
                  <option value="concerns">Specific Concerns</option>
                  <option value="coping_and_support">Coping Mechanisms</option>
                  <option value="expectations">Therapy Expectations</option>
                  <option value="mental_health_history">Mental Health History</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#132A24] mb-1">Note for Discussion / Follow-up *</label>
                <textarea
                  rows={3}
                  required
                  value={clarificationNote}
                  onChange={(e) => setClarificationNote(e.target.value)}
                  placeholder="e.g. Inquire about onset timeline of panic episodes in work meetings..."
                  className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowClarificationModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingClarification}
                  className="bg-amber-800 text-white hover:bg-amber-900 disabled:opacity-50 px-4 py-2 rounded-xl font-semibold"
                >
                  {savingClarification ? 'Saving...' : 'Add Flag'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* E. GOAL AUDIT MODAL */}
      {viewingGoalHistory && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-gray-200 shadow-xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-serif text-base font-medium text-gray-900">
                Goal Revision Audit
              </h3>
              <button
                type="button"
                onClick={() => setViewingGoalHistory(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="font-semibold text-[#132A24]">{viewingGoalHistory.title}</div>
              {loadingGoalHistory ? (
                <div className="py-6 text-center text-gray-500">Loading history...</div>
              ) : goalHistoryList.length === 0 ? (
                <div className="py-6 text-center text-gray-500">No revisions logged.</div>
              ) : (
                <div className="space-y-2">
                  {goalHistoryList.map((h) => (
                    <div key={h.id} className="p-3 rounded-xl bg-gray-50 border border-gray-100 space-y-1">
                      <div className="flex justify-between text-[11px] text-gray-500">
                        <span>By: <strong className="capitalize">{h.changed_by_role}</strong></span>
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
