import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  BookOpen,
  CheckCircle2,
  Clock,
  MessageSquare,
  AlertCircle,
  Save,
  Send,
  Calendar,
  User,
  ShieldCheck,
  CheckSquare,
  Square,
  HelpCircle,
  Sparkles,
  FileText,
  Activity,
  Wind,
  Target,
  ChevronRight,
  Info,
} from 'lucide-react';

/**
 * Enhanced ClientHomeworkModal
 *
 * Supports:
 * 1. Plain text reflections & notes
 * 2. Multi-step activities / worksheets
 * 3. Thought record structured forms (Situation, Automatic Thought, Emotion & Intensity, Balanced Alternative)
 * 4. Grounding exercise / Behavioral activation checklist
 * 5. Draft saving with metadata preservation
 * 6. Server-side validation and duplicate submission lock
 * 7. Therapist feedback callout with supervisory note exclusion
 */
export default function ClientHomeworkModal({
  assignmentId,
  onClose,
  onSuccess,
}) {
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [metadata, setMetadata] = useState({});
  const [savingDraft, setSavingDraft] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Structured response state for specific exercise types
  const [thoughtRecord, setThoughtRecord] = useState({
    situation: '',
    automaticThought: '',
    emotion: '',
    emotionIntensity: 50,
    evidenceFor: '',
    evidenceAgainst: '',
    balancedPerspective: '',
  });

  const [behavioralActivation, setBehavioralActivation] = useState({
    activityName: '',
    scheduledTime: '',
    moodBefore: 5,
    moodAfter: 5,
    notes: '',
  });

  const [checklistItems, setChecklistItems] = useState([
    { id: 'step_1', label: 'Completed 5 minutes of focused rhythmic breathing', completed: false },
    { id: 'step_2', label: 'Noticed 5 things I could see around me', completed: false },
    { id: 'step_3', label: 'Noticed 4 things I could physically touch', completed: false },
    { id: 'step_4', label: 'Identified 3 sounds in my environment', completed: false },
    { id: 'step_5', label: 'Acknowledged 2 scents or body sensations', completed: false },
    { id: 'step_6', label: 'Noticed 1 positive quality or intention for today', completed: false },
  ]);

  useEffect(() => {
    async function loadAssignment() {
      setLoading(true);
      setErrorMessage('');
      try {
        const res = await fetch(`/api/therapy/client/homework/${assignmentId}`);
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error?.message || 'Failed to load homework details.');
        }
        const data = await res.json();
        const a = data.assignment;
        setAssignment(a);

        if (a?.submission?.responseContent) {
          setContent(a.submission.responseContent);
        }

        if (a?.submission?.responseMetadata) {
          const meta = a.submission.responseMetadata;
          setMetadata(meta);

          if (meta.thoughtRecord) {
            setThoughtRecord((prev) => ({ ...prev, ...meta.thoughtRecord }));
          }
          if (meta.behavioralActivation) {
            setBehavioralActivation((prev) => ({ ...prev, ...meta.behavioralActivation }));
          }
          if (Array.isArray(meta.checklistItems) && meta.checklistItems.length > 0) {
            setChecklistItems(meta.checklistItems);
          }
        }
      } catch (err) {
        setErrorMessage(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (assignmentId) {
      loadAssignment();
    }
  }, [assignmentId]);

  // Sync structured state to main content string if user uses structured tool
  const assembleSubmissionData = () => {
    let finalContent = content;
    const finalMetadata = { ...metadata };

    if (assignment?.exerciseType === 'thought_record') {
      finalMetadata.thoughtRecord = thoughtRecord;
      if (!content.trim() && (thoughtRecord.situation || thoughtRecord.automaticThought)) {
        finalContent = [
          `[Situation]: ${thoughtRecord.situation || 'N/A'}`,
          `[Automatic Thought]: ${thoughtRecord.automaticThought || 'N/A'}`,
          `[Emotion]: ${thoughtRecord.emotion || 'N/A'} (${thoughtRecord.emotionIntensity}%)`,
          `[Evidence For]: ${thoughtRecord.evidenceFor || 'N/A'}`,
          `[Evidence Against]: ${thoughtRecord.evidenceAgainst || 'N/A'}`,
          `[Balanced Perspective]: ${thoughtRecord.balancedPerspective || 'N/A'}`,
        ].join('\n\n');
      }
    } else if (assignment?.exerciseType === 'behavioral_activation') {
      finalMetadata.behavioralActivation = behavioralActivation;
      if (!content.trim() && behavioralActivation.activityName) {
        finalContent = [
          `[Activity]: ${behavioralActivation.activityName}`,
          `[Scheduled Time]: ${behavioralActivation.scheduledTime || 'N/A'}`,
          `[Mood Before]: ${behavioralActivation.moodBefore}/10`,
          `[Mood After]: ${behavioralActivation.moodAfter}/10`,
          `[Client Reflections]: ${behavioralActivation.notes || 'None'}`,
        ].join('\n\n');
      }
    } else if (assignment?.exerciseType === 'grounding_exercise') {
      finalMetadata.checklistItems = checklistItems;
      const completedSteps = checklistItems.filter((i) => i.completed).length;
      if (!content.trim()) {
        finalContent = `Grounding Practice Protocol:\nCompleted ${completedSteps} of ${checklistItems.length} steps.\n\nReflection: ${
          content.trim() || 'Session practice completed.'
        }`;
      }
    }

    return { content: finalContent, metadata: finalMetadata };
  };

  const handleSaveDraft = async () => {
    setSavingDraft(true);
    setErrorMessage('');
    setStatusMessage('');

    const { content: draftContent, metadata: draftMeta } = assembleSubmissionData();

    try {
      const res = await fetch(`/api/therapy/client/homework/${assignmentId}/save-draft`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: draftContent,
          metadata: draftMeta,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Failed to save draft');
      setStatusMessage('Draft saved successfully.');
      setTimeout(() => setStatusMessage(''), 3000);
      if (onSuccess) onSuccess(data.submission);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setSavingDraft(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { content: submitContent, metadata: submitMeta } = assembleSubmissionData();

    if (!submitContent.trim()) {
      setErrorMessage('Please provide your response or fill in the exercise fields before submitting.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');
    setStatusMessage('');
    try {
      const res = await fetch(`/api/therapy/client/homework/${assignmentId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: submitContent.trim(),
          metadata: submitMeta,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Failed to submit response');
      if (onSuccess) onSuccess(data.assignment);
      onClose();
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const isImmutable = assignment?.status === 'reviewed';
  const isSubmitted = ['submitted', 'reviewed'].includes(assignment?.status);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="homework-modal-title"
      className="fixed inset-0 z-50 bg-[#132A24]/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="bg-white rounded-2xl border border-[#263238]/12 shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden my-auto"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#263238]/10 flex items-center justify-between bg-[#F4F1EC]/70 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center shrink-0 shadow-2xs">
              <BookOpen size={18} />
            </div>
            <div>
              <h3 id="homework-modal-title" className="font-serif text-base sm:text-lg font-medium text-[#132A24]">
                {assignment?.title || 'Clinical Self-Work Exercise'}
              </h3>
              <p className="text-xs text-[#66747A] flex items-center gap-2">
                <span>Assigned by {assignment?.therapistName || 'Your Clinician'}</span>
                {assignment?.estimatedMinutes && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} /> ~{assignment.estimatedMinutes} min
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-lg text-[#66747A] hover:text-[#132A24] hover:bg-black/5 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        {loading ? (
          <div className="p-12 text-center text-xs text-[#66747A] space-y-3">
            <div className="w-8 h-8 border-2 border-emerald-800 border-t-transparent rounded-full animate-spin mx-auto" />
            <p>Loading exercise details...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5 overflow-y-auto text-xs flex-1">
            {errorMessage && (
              <div role="alert" className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-900 flex items-start gap-2.5">
                <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-700" />
                <span className="leading-relaxed">{errorMessage}</span>
              </div>
            )}

            {statusMessage && (
              <div role="status" className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-2.5">
                <CheckCircle2 size={16} className="shrink-0 text-emerald-700" />
                <span>{statusMessage}</span>
              </div>
            )}

            {/* Exercise Instructions Card */}
            <div className="p-4 rounded-xl bg-[#F4F1EC]/60 border border-[#263238]/8 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#132A24]">
                  Clinical Instructions
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider bg-emerald-100 text-emerald-900">
                  {assignment?.exerciseType ? assignment.exerciseType.replace(/_/g, ' ') : 'Exercise'}
                </span>
              </div>
              <p className="text-[#263238] text-xs leading-relaxed whitespace-pre-wrap">
                {assignment?.instructions}
              </p>
              {assignment?.clinicalGoal && (
                <div className="pt-2 border-t border-[#263238]/6 flex items-start gap-1.5 text-[11px] text-[#132A24]">
                  <Target size={13} className="text-emerald-800 shrink-0 mt-0.5" />
                  <span>
                    <strong>Clinical Objective:</strong> {assignment.clinicalGoal}
                  </span>
                </div>
              )}
            </div>

            {/* Clinician Feedback Callout if reviewed */}
            {assignment?.submission?.therapistFeedback && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-emerald-950 text-xs">
                  <MessageSquare size={14} className="text-emerald-800" />
                  <span>Clinician Feedback &amp; Follow-up Observations</span>
                </div>
                <p className="text-emerald-900 text-xs leading-relaxed whitespace-pre-wrap bg-white/70 p-3 rounded-lg border border-emerald-100 italic">
                  "{assignment.submission.therapistFeedback}"
                </p>
                {assignment.submission.feedbackAddedAt && (
                  <p className="text-[10px] text-emerald-700">
                    Feedback provided on{' '}
                    {new Date(assignment.submission.feedbackAddedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                )}
              </div>
            )}

            {/* Structured Tools / Interactive Exercise Worksheets */}
            {assignment?.exerciseType === 'thought_record' && !isImmutable && (
              <div className="p-4 rounded-xl bg-white border border-[#263238]/12 space-y-3.5 shadow-2xs">
                <div className="flex items-center gap-1.5 font-semibold text-[#132A24] text-xs">
                  <Sparkles size={14} className="text-emerald-800" />
                  <span>CBT Thought Record Worksheet</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-medium text-[#132A24] block mb-1">
                      1. Trigger / Situation (What happened? Where, when, and with whom?)
                    </label>
                    <input
                      type="text"
                      disabled={isImmutable}
                      value={thoughtRecord.situation}
                      onChange={(e) => setThoughtRecord({ ...thoughtRecord, situation: e.target.value })}
                      placeholder="e.g. Received a critical email from my manager on Tuesday afternoon"
                      className="w-full border border-[#263238]/15 rounded-lg p-2.5 text-xs text-[#263238] focus:border-emerald-700 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-[#132A24] block mb-1">
                      2. Automatic Negative Thought (What was going through your mind?)
                    </label>
                    <input
                      type="text"
                      disabled={isImmutable}
                      value={thoughtRecord.automaticThought}
                      onChange={(e) => setThoughtRecord({ ...thoughtRecord, automaticThought: e.target.value })}
                      placeholder="e.g. 'I am going to get fired and fail everyone.'"
                      className="w-full border border-[#263238]/15 rounded-lg p-2.5 text-xs text-[#263238] focus:border-emerald-700 focus:outline-hidden"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-medium text-[#132A24] block mb-1">
                        3. Primary Emotion
                      </label>
                      <input
                        type="text"
                        disabled={isImmutable}
                        value={thoughtRecord.emotion}
                        onChange={(e) => setThoughtRecord({ ...thoughtRecord, emotion: e.target.value })}
                        placeholder="e.g. Anxiety, Dread, Shame"
                        className="w-full border border-[#263238]/15 rounded-lg p-2.5 text-xs text-[#263238] focus:border-emerald-700 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] font-medium text-[#132A24] mb-1">
                        <span>Intensity: {thoughtRecord.emotionIntensity}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        disabled={isImmutable}
                        value={thoughtRecord.emotionIntensity}
                        onChange={(e) => setThoughtRecord({ ...thoughtRecord, emotionIntensity: Number(e.target.value) })}
                        className="w-full accent-emerald-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-medium text-[#132A24] block mb-1">
                        4. Evidence For
                      </label>
                      <textarea
                        rows={2}
                        disabled={isImmutable}
                        value={thoughtRecord.evidenceFor}
                        onChange={(e) => setThoughtRecord({ ...thoughtRecord, evidenceFor: e.target.value })}
                        placeholder="Facts supporting this thought..."
                        className="w-full border border-[#263238]/15 rounded-lg p-2 text-xs text-[#263238] focus:border-emerald-700 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-[#132A24] block mb-1">
                        5. Evidence Against
                      </label>
                      <textarea
                        rows={2}
                        disabled={isImmutable}
                        value={thoughtRecord.evidenceAgainst}
                        onChange={(e) => setThoughtRecord({ ...thoughtRecord, evidenceAgainst: e.target.value })}
                        placeholder="Facts contradicting this thought..."
                        className="w-full border border-[#263238]/15 rounded-lg p-2 text-xs text-[#263238] focus:border-emerald-700 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-[#132A24] block mb-1">
                      6. Balanced, Realistic Alternative Perspective
                    </label>
                    <textarea
                      rows={2}
                      disabled={isImmutable}
                      value={thoughtRecord.balancedPerspective}
                      onChange={(e) => setThoughtRecord({ ...thoughtRecord, balancedPerspective: e.target.value })}
                      placeholder="e.g. My manager was giving feedback on one deliverable; my overall performance reviews are positive."
                      className="w-full border border-[#263238]/15 rounded-lg p-2 text-xs text-[#263238] focus:border-emerald-700 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Grounding Exercise Checklist */}
            {assignment?.exerciseType === 'grounding_exercise' && !isImmutable && (
              <div className="p-4 rounded-xl bg-white border border-[#263238]/12 space-y-3 shadow-2xs">
                <div className="flex items-center gap-1.5 font-semibold text-[#132A24] text-xs">
                  <Wind size={14} className="text-emerald-800" />
                  <span>5-4-3-2-1 Sensory Grounding Steps</span>
                </div>
                <div className="space-y-2">
                  {checklistItems.map((item, idx) => (
                    <button
                      type="button"
                      key={item.id}
                      disabled={isImmutable}
                      onClick={() => {
                        const updated = [...checklistItems];
                        updated[idx].completed = !updated[idx].completed;
                        setChecklistItems(updated);
                      }}
                      className={`w-full text-left p-2.5 rounded-lg border text-xs flex items-center gap-2.5 transition-all ${
                        item.completed
                          ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 font-medium'
                          : 'bg-white border-[#263238]/10 text-[#66747A] hover:bg-[#F4F1EC]/40'
                      }`}
                    >
                      {item.completed ? (
                        <CheckSquare size={16} className="text-emerald-800 shrink-0" />
                      ) : (
                        <Square size={16} className="text-[#A0AAB0] shrink-0" />
                      )}
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Primary Response / Reflection Area */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#132A24] flex items-center justify-between">
                <span>
                  {assignment?.exerciseType === 'thought_record' || assignment?.exerciseType === 'grounding_exercise'
                    ? 'Additional Personal Reflections / Notes'
                    : 'Your Written Practice Reflection & Response'}
                </span>
                <span className="text-[11px] font-normal text-[#66747A]">
                  {content.length}/20,000 characters
                </span>
              </label>
              <textarea
                rows={6}
                disabled={isImmutable}
                placeholder="Write your reflections, insights, emotional shifts, or observations here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full border border-[#263238]/15 rounded-xl p-3.5 text-xs text-[#263238] leading-relaxed focus:outline-hidden focus:border-emerald-700 disabled:bg-[#F4F1EC]/50 disabled:text-[#66747A]"
              />
            </div>

            {/* Submission State Banner */}
            {isSubmitted && (
              <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-blue-950 text-xs flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 size={14} className="text-blue-700" />
                  {assignment.status === 'reviewed' ? 'Assignment Reviewed' : 'Submitted & Awaiting Clinician Review'}
                </span>
                {assignment.submittedAt && (
                  <span className="text-[11px] text-blue-800">
                    Submitted on {new Date(assignment.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                )}
              </div>
            )}

            {/* Security Guard */}
            <div className="pt-2 flex items-center gap-1.5 text-[11px] text-[#66747A]">
              <ShieldCheck size={13} className="text-emerald-800 shrink-0" />
              <span>
                Encrypted &amp; confidential. Visible exclusively to your verified assigned therapist.
              </span>
            </div>

            {/* Actions */}
            <div className="pt-4 flex items-center justify-between border-t border-[#263238]/10 shrink-0">
              <div>
                {!isImmutable && (
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    disabled={savingDraft || submitting}
                    className="px-3.5 py-2 rounded-xl border border-[#263238]/15 text-[#263238] hover:bg-[#F4F1EC] inline-flex items-center gap-1.5 text-xs font-semibold cursor-pointer disabled:opacity-50 transition-all"
                  >
                    <Save size={13} />
                    <span>{savingDraft ? 'Saving Draft...' : 'Save Draft'}</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-[#263238]/12 text-[#66747A] hover:bg-[#F4F1EC] text-xs font-medium cursor-pointer transition-all"
                >
                  {isImmutable ? 'Close' : 'Cancel'}
                </button>
                {!isImmutable && (
                  <button
                    type="submit"
                    disabled={submitting || savingDraft}
                    className="px-5 py-2 rounded-xl bg-[#132A24] text-white text-xs font-semibold hover:bg-[#1C3E35] inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-2xs transition-all"
                  >
                    <Send size={13} />
                    <span>{submitting ? 'Submitting...' : 'Submit to Clinician'}</span>
                  </button>
                )}
              </div>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
