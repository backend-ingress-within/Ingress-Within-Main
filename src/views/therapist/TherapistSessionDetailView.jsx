import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  Video,
  User,
  ShieldCheck,
  ArrowLeft,
  FileText,
  AlertCircle,
  ExternalLink,
  History,
  CheckCircle2,
  XCircle,
  RotateCcw
} from 'lucide-react';
import TherapistRescheduleModal from './TherapistRescheduleModal';

export default function TherapistSessionDetailView({
  sessionId,
  onBack,
  onNavigate,
  onOpenClientProfile,
  onOpenSoap
}) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [completing, setCompleting] = useState(false);

  const fetchSession = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/therapist/sessions/${sessionId}`);
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error?.message || 'Failed to load session details.');
      }
      const json = await res.json();
      setSession(json.session);
    } catch (err) {
      console.error('Session detail error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sessionId) {
      fetchSession();
    }
  }, [sessionId]);

  const handleCancelSession = async () => {
    const reason = window.prompt('Please enter the reason for session cancellation:');
    if (reason === null) return; // User cancelled prompt

    setCancelling(true);
    try {
      const res = await fetch(`/api/therapist/sessions/${sessionId}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: reason.trim() || 'Therapist requested cancellation' }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error?.message || 'Failed to cancel session.');
      }
      await fetchSession();
    } catch (err) {
      alert(`Error cancelling session: ${err.message}`);
    } finally {
      setCancelling(false);
    }
  };

  const handleCompleteSession = async () => {
    if (!window.confirm('Mark this clinical session as completed? This will register the completed encounter.')) {
      return;
    }
    setCompleting(true);
    try {
      const res = await fetch(`/api/therapist/sessions/${sessionId}/complete`, {
        method: 'POST',
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error?.message || 'Failed to mark session complete.');
      }
      await fetchSession();
    } catch (err) {
      alert(`Error completing session: ${err.message}`);
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#132A24]/5 animate-pulse" />
          <div className="h-6 w-48 bg-[#132A24]/10 rounded animate-pulse" />
        </div>
        <div className="bg-white border border-[#132A24]/10 rounded-2xl p-8 space-y-4">
          <div className="h-8 w-1/3 bg-[#132A24]/5 rounded animate-pulse" />
          <div className="h-20 w-full bg-[#132A24]/5 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="space-y-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#132A24]/70 hover:text-[#132A24] cursor-pointer"
        >
          <ArrowLeft size={14} /> Back to Schedule
        </button>
        <div className="bg-white border border-red-200 rounded-2xl p-8 text-center space-y-3">
          <AlertCircle size={32} className="mx-auto text-red-500" />
          <h3 className="font-serif text-lg font-medium text-[#132A24]">
            {error || 'Session Not Found'}
          </h3>
          <p className="text-xs text-[#132A24]/60 max-w-md mx-auto">
            The requested clinical session could not be retrieved. It may not exist or belongs to another provider.
          </p>
          <button
            onClick={fetchSession}
            className="px-4 py-2 rounded-lg bg-[#132A24] text-white text-xs font-medium cursor-pointer"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const startDate = new Date(session.startsAt);
  const endDate = new Date(session.endsAt);

  const dateFormatted = startDate.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const startTimeFormatted = startDate.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const endTimeFormatted = endDate.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const isCancelled = session.status === 'cancelled';
  const isCompleted = session.status === 'completed';
  const isScheduled = session.status === 'scheduled' || session.status === 'confirmed' || session.status === 'rescheduled';

  return (
    <div className="space-y-6">
      {/* Navigation Topbar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#132A24]/70 hover:text-[#132A24] cursor-pointer transition-colors"
        >
          <ArrowLeft size={14} /> Back
        </button>

        <span className={`px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${
          isCompleted
            ? 'bg-[#4E7A66]/10 text-[#4E7A66]'
            : isCancelled
            ? 'bg-red-50 text-red-600'
            : 'bg-blue-50 text-blue-700'
        }`}>
          {session.status}
        </span>
      </div>

      {/* Main Session Card */}
      <div className="bg-white border border-[#132A24]/10 rounded-2xl p-6 lg:p-8 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#132A24]/10 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#4E7A66] font-semibold uppercase tracking-wider mb-1">
              <Calendar size={14} /> Clinical Session Details
            </div>
            <h1 className="font-serif text-2xl lg:text-3xl font-normal text-[#132A24]">
              {dateFormatted}
            </h1>
            <p className="text-xs text-[#132A24]/60 mt-1 flex items-center gap-1.5">
              <Clock size={13} /> {startTimeFormatted} – {endTimeFormatted} ({session.durationMinutes || 50} mins)
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            {session.meetingLink && !isCancelled && !isCompleted && (
              <a
                href={session.meetingLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#132A24] text-white text-xs font-semibold hover:bg-[#132A24]/90 transition-all cursor-pointer no-underline shadow-xs"
              >
                <Video size={14} /> Join Telehealth Call
              </a>
            )}

            {isScheduled && (
              <>
                <button
                  onClick={() => setRescheduleModalOpen(true)}
                  className="px-3.5 py-2 rounded-lg border border-[#132A24]/15 text-xs font-medium text-[#132A24] hover:bg-[#132A24]/5 transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <RotateCcw size={13} /> Reschedule
                </button>
                <button
                  onClick={handleCompleteSession}
                  disabled={completing}
                  className="px-3.5 py-2 rounded-lg border border-[#4E7A66]/30 text-xs font-medium text-[#4E7A66] hover:bg-[#4E7A66]/10 transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <CheckCircle2 size={13} /> {completing ? 'Completing...' : 'Mark Complete'}
                </button>
                <button
                  onClick={handleCancelSession}
                  disabled={cancelling}
                  className="px-3 py-2 rounded-lg border border-red-200 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <XCircle size={13} /> {cancelling ? 'Cancelling...' : 'Cancel'}
                </button>
              </>
            )}

            {onOpenSoap && (
              <button
                onClick={() => onOpenSoap(session.id)}
                className="px-3.5 py-2 rounded-lg border border-[#132A24]/15 bg-white text-xs font-medium text-[#132A24] hover:bg-[#132A24]/5 transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <FileText size={13} /> Clinical SOAP Note
              </button>
            )}
          </div>
        </div>

        {/* Session Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#FAFAF8] border border-[#132A24]/5">
            <span className="text-[10px] uppercase font-bold text-[#132A24]/50 tracking-wider block mb-1">
              Session Format
            </span>
            <span className="text-xs font-semibold text-[#132A24] capitalize">
              {session.sessionType || 'Video'}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#FAFAF8] border border-[#132A24]/5">
            <span className="text-[10px] uppercase font-bold text-[#132A24]/50 tracking-wider block mb-1">
              Modality
            </span>
            <span className="text-xs font-semibold text-[#132A24] capitalize">
              {session.modality || 'Telehealth'}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#FAFAF8] border border-[#132A24]/5">
            <span className="text-[10px] uppercase font-bold text-[#132A24]/50 tracking-wider block mb-1">
              Care Stage
            </span>
            <span className="text-xs font-semibold text-[#132A24] capitalize">
              {(session.careStage || 'Intake').replace(/_/g, ' ')}
            </span>
          </div>
        </div>

        {/* Cancellation Notice if Cancelled */}
        {isCancelled && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-900 space-y-1">
            <div className="font-semibold flex items-center gap-1.5">
              <XCircle size={14} className="text-red-600" /> Session Cancelled
            </div>
            <p className="text-red-700">
              Cancelled by: <span className="font-medium capitalize">{session.cancelledBy || 'Therapist'}</span> &bull; Reason: {session.cancellationReason || 'No reason provided.'}
            </p>
            <p className="text-[11px] text-red-600/80">
              This session record is permanently preserved for clinical audit and does not occupy practitioner availability.
            </p>
          </div>
        )}

        {/* Client Card */}
        <div className="p-5 rounded-xl border border-[#132A24]/10 bg-white space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#132A24]/5 border border-[#132A24]/10 flex items-center justify-center font-serif font-bold text-sm text-[#132A24]">
                {session.client?.displayName ? session.client.displayName.charAt(0) : 'C'}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#132A24]">
                  {session.client?.displayName || 'Client'}
                </h4>
                <span className="text-[11px] text-[#4E7A66] font-medium flex items-center gap-1">
                  <ShieldCheck size={12} /> Active Care Relationship
                </span>
              </div>
            </div>

            {onOpenClientProfile && session.client?.id && (
              <button
                onClick={() => onOpenClientProfile(session.client.id)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#132A24]/15 text-xs font-medium text-[#132A24] hover:bg-[#132A24]/5 cursor-pointer transition-colors"
              >
                <span>View Profile</span> <ExternalLink size={12} />
              </button>
            )}
          </div>

          {session.clientNotes && (
            <div className="pt-2 border-t border-[#132A24]/5 text-xs text-[#132A24]/70">
              <span className="font-medium text-[#132A24] block mb-0.5">Clinical Note:</span>
              <p>{session.clientNotes}</p>
            </div>
          )}

          {/* Privacy Boundary Guarantee */}
          <div className="p-3 rounded-lg bg-[#FAFAF8] border border-[#132A24]/5 text-[11px] text-[#132A24]/60 leading-relaxed">
            <strong className="text-[#132A24]">Client Self-Work Privacy Boundary:</strong> Personal journals, reflections, and self-guided exercises are private to the client and never visible in practitioner portals. Only structured clinical assessment questionnaires and session notes are shared.
          </div>
        </div>

        {/* Reschedule Audit Trail */}
        {session.rescheduleHistory && session.rescheduleHistory.length > 0 && (
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#132A24]/60 flex items-center gap-1.5">
              <History size={14} /> Reschedule Audit Trail ({session.rescheduleHistory.length})
            </h4>
            <div className="space-y-2">
              {session.rescheduleHistory.map((item, idx) => {
                const prevStart = new Date(item.previousStart).toLocaleString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                });
                const nextStart = new Date(item.newStart).toLocaleString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div key={item.id || idx} className="p-3 rounded-lg bg-[#FAFAF8] border border-[#132A24]/5 text-xs flex items-center justify-between">
                    <div>
                      <span className="text-[#132A24]/50">{prevStart}</span>
                      <span className="mx-2 text-[#4E7A66] font-bold">&rarr;</span>
                      <span className="font-semibold text-[#132A24]">{nextStart}</span>
                      <p className="text-[11px] text-[#132A24]/60 mt-0.5">
                        Reason: {item.reason || 'Schedule adjustment'} &bull; By: {item.rescheduledBy}
                      </p>
                    </div>
                    <span className="text-[10px] text-[#132A24]/40">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Reschedule Modal */}
      {rescheduleModalOpen && (
        <TherapistRescheduleModal
          appointment={{
            id: session.id,
            scheduled_start: session.startsAt,
            scheduled_end: session.endsAt,
            clientDisplayName: session.client?.displayName,
          }}
          onClose={() => setRescheduleModalOpen(false)}
          onSuccess={() => fetchSession()}
        />
      )}
    </div>
  );
}
