import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Video,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  XCircle,
  FileText,
  AlertCircle
} from 'lucide-react';
import TherapistScheduleModal from './TherapistScheduleModal';
import TherapistRescheduleModal from './TherapistRescheduleModal';

export default function TherapistCalendarView({ onOpenSoap }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('week'); // 'day' | 'week'
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [rescheduleAppt, setRescheduleAppt] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchCalendar = async () => {
    try {
      const res = await fetch('/api/therapist/sessions');
      if (res.ok) {
        const json = await res.json();
        setAppointments(json.appointments || []);
      }
    } catch (err) {
      console.error('Failed to load sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendar();
  }, []);

  const handleCancelSession = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this session? This will be marked in session history.')) {
      return;
    }
    setCancellingId(appointmentId);
    try {
      const res = await fetch(`/api/therapist/sessions/${appointmentId}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Therapist schedule change' }),
      });
      if (res.ok) {
        await fetchCalendar();
      }
    } catch (err) {
      console.error('Failed to cancel session:', err);
    } finally {
      setCancellingId(null);
    }
  };

  const handleCompleteSession = async (appointmentId) => {
    try {
      const res = await fetch(`/api/therapist/sessions/${appointmentId}/complete`, {
        method: 'POST',
      });
      if (res.ok) {
        await fetchCalendar();
      }
    } catch (err) {
      console.error('Failed to complete session:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#132A24]/10 pb-6">
        <div>
          <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#4E7A66]">
            Clinical Schedule
          </span>
          <h1 className="font-serif text-3xl font-normal text-[#132A24] mt-1">
            Calendar & Appointments
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex rounded-lg bg-[#132A24]/5 p-1 border border-[#132A24]/10 text-xs">
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1 rounded-md font-medium capitalize transition-all cursor-pointer ${
                viewMode === 'day' ? 'bg-white text-[#132A24] shadow-xs' : 'text-[#132A24]/60'
              }`}
            >
              Day
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 rounded-md font-medium capitalize transition-all cursor-pointer ${
                viewMode === 'week' ? 'bg-white text-[#132A24] shadow-xs' : 'text-[#132A24]/60'
              }`}
            >
              Week
            </button>
          </div>

          <button
            onClick={() => setScheduleModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#132A24] text-white text-xs font-semibold hover:bg-[#132A24]/90 transition-all cursor-pointer shadow-xs"
          >
            <Plus size={14} /> Schedule Session
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-[#132A24]/50 animate-pulse">
          Loading calendar events...
        </div>
      ) : appointments.length === 0 ? (
        <div className="bg-white border border-[#132A24]/10 rounded-2xl p-12 text-center space-y-3">
          <CalendarIcon size={36} className="mx-auto text-[#132A24]/30" />
          <h3 className="font-serif text-xl font-normal text-[#132A24]">Calendar Clear</h3>
          <p className="text-xs text-[#132A24]/60 max-w-sm mx-auto leading-relaxed">
            No clinical sessions are scheduled. Click "Schedule Session" above to book an appointment with an authorized client.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {appointments.map((appt) => {
            const dateStr = new Date(appt.scheduled_start).toLocaleDateString('en-IN', {
              weekday: 'short',
              day: 'numeric',
              month: 'short',
            });
            const timeStr = new Date(appt.scheduled_start).toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit',
            });
            const endTimeStr = new Date(appt.scheduled_end).toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit',
            });

            const isCancelled = appt.status === 'cancelled';
            const isCompleted = appt.status === 'completed';

            return (
              <div
                key={appt.id}
                className={`bg-white border rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                  isCancelled ? 'opacity-60 border-gray-200 bg-gray-50' : 'border-[#132A24]/10 hover:border-[#4E7A66]/30'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#FAFAF8] border border-[#132A24]/10 flex flex-col items-center justify-center shrink-0">
                    <CalendarIcon size={16} className="text-[#4E7A66]" />
                    <span className="text-[10px] font-bold text-[#132A24] mt-0.5">
                      {new Date(appt.scheduled_start).getDate()}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#132A24]">{dateStr} &bull; {timeStr} – {endTimeStr}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider ${
                        isCompleted
                          ? 'bg-[#4E7A66]/10 text-[#4E7A66]'
                          : isCancelled
                          ? 'bg-red-50 text-red-700'
                          : 'bg-blue-50 text-blue-700'
                      }`}>
                        {appt.status}
                      </span>
                    </div>

                    <h4 className="font-serif text-base font-medium text-[#132A24] mt-0.5">
                      {appt.clientDisplayName}
                    </h4>

                    {appt.client_notes && (
                      <p className="text-[11px] text-[#132A24]/60 mt-0.5">{appt.client_notes}</p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  {!isCancelled && !isCompleted && (
                    <>
                      {appt.meeting_link && (
                        <a
                          href={appt.meeting_link}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-[#132A24] text-white text-xs font-medium hover:bg-[#132A24]/90 no-underline cursor-pointer"
                        >
                          Join Call
                        </a>
                      )}
                      <button
                        onClick={() => handleCompleteSession(appt.id)}
                        className="px-3 py-1.5 rounded-lg border border-[#132A24]/15 text-xs text-[#132A24] hover:bg-[#132A24]/5 cursor-pointer"
                      >
                        Complete
                      </button>
                      <button
                        onClick={() => setRescheduleAppt(appt)}
                        className="px-3 py-1.5 rounded-lg border border-[#132A24]/15 text-xs text-[#132A24] hover:bg-[#132A24]/5 cursor-pointer"
                      >
                        Reschedule
                      </button>
                      <button
                        onClick={() => handleCancelSession(appt.id)}
                        disabled={cancellingId === appt.id}
                        className="px-2.5 py-1.5 rounded-lg border border-red-200 text-xs text-red-600 hover:bg-red-50 cursor-pointer"
                      >
                        Cancel
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => onOpenSoap(appt.id)}
                    className="px-3 py-1.5 rounded-lg border border-[#132A24]/15 bg-white text-xs text-[#132A24] hover:bg-[#132A24]/5 cursor-pointer flex items-center gap-1.5"
                  >
                    <FileText size={13} /> SOAP Note
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Booking Modal */}
      {scheduleModalOpen && (
        <TherapistScheduleModal
          onClose={() => setScheduleModalOpen(false)}
          onSuccess={() => fetchCalendar()}
        />
      )}

      {/* Reschedule Modal */}
      {rescheduleAppt && (
        <TherapistRescheduleModal
          appointment={rescheduleAppt}
          onClose={() => setRescheduleAppt(null)}
          onSuccess={() => fetchCalendar()}
        />
      )}
    </div>
  );
}
