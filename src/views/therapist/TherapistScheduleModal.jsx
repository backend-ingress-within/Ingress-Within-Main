import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, Clock, AlertCircle, CheckCircle2, Lock } from 'lucide-react';

export default function TherapistScheduleModal({
  defaultClientId,
  defaultClientName,
  initialDate,
  onClose,
  onSuccess,
}) {
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState(defaultClientId || '');
  const [sessionDate, setSessionDate] = useState(
    initialDate ? new Date(initialDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
  );
  const [durationMinutes, setDurationMinutes] = useState(50);
  const [sessionType, setSessionType] = useState('video');
  const [clientNotes, setClientNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Slots state
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [daySlots, setDaySlots] = useState([]);
  const [isDayClosed, setIsDayClosed] = useState(false);
  const [workingHoursLabel, setWorkingHoursLabel] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Load clients
  useEffect(() => {
    async function loadClients() {
      try {
        const res = await fetch('/api/therapist/clients');
        if (res.ok) {
          const json = await res.json();
          setClients(json.clients || []);
          if (!selectedClientId && json.clients?.length > 0) {
            setSelectedClientId(json.clients[0].clientId);
          }
        }
      } catch (e) {}
    }
    loadClients();
  }, []);

  // Fetch slots whenever sessionDate or durationMinutes changes
  useEffect(() => {
    let isCancelled = false;
    async function loadSlots() {
      setSlotsLoading(true);
      setSelectedSlot(null);
      setErrorMessage('');
      try {
        const res = await fetch(
          `/api/therapist/calendar/slots?date=${encodeURIComponent(sessionDate)}&duration=${durationMinutes}`
        );
        if (res.ok) {
          const json = await res.json();
          if (!isCancelled) {
            setDaySlots(json.slots || []);
            setIsDayClosed(Boolean(json.isClosed));
            setWorkingHoursLabel(json.workingHours || '');
            // Auto-select first available slot if any
            const firstAvailable = (json.slots || []).find((s) => s.available);
            if (firstAvailable) {
              setSelectedSlot(firstAvailable);
            }
          }
        }
      } catch (err) {
        if (!isCancelled) {
          setErrorMessage('Failed to load slots for this date.');
        }
      } finally {
        if (!isCancelled) {
          setSlotsLoading(false);
        }
      }
    }

    if (sessionDate) {
      loadSlots();
    }

    return () => {
      isCancelled = true;
    };
  }, [sessionDate, durationMinutes]);

  const handleSchedule = async (e) => {
    e.preventDefault();
    if (!selectedClientId) {
      setErrorMessage('Please select a client.');
      return;
    }
    if (!selectedSlot) {
      setErrorMessage('Please select an available consultation time slot.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/therapist/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: selectedClientId,
          scheduled_start: selectedSlot.start,
          scheduled_end: selectedSlot.end,
          session_type: sessionType,
          client_notes: clientNotes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (
          data.error?.code === 'SESSION_CONFLICT' ||
          data.error?.code === 'CLIENT_CONFLICT' ||
          data.error?.code === 'BLOCKED_WINDOW' ||
          data.error?.code === 'GOOGLE_CALENDAR_CONFLICT'
        ) {
          throw new Error('This slot overlaps with another appointment or Google Calendar commitment.');
        }
        if (data.error?.code === 'OUTSIDE_WORKING_HOURS') {
          throw new Error('This time is outside your configured consultation hours.');
        }
        if (data.error?.code === 'CLIENT_NOT_AUTHORIZED') {
          throw new Error('Client does not have an active care relationship with you.');
        }
        throw new Error(data.error?.message || 'Failed to schedule session.');
      }

      onSuccess && onSuccess(data.appointment || data.session);
      onClose();
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl border border-[#132A24]/10 shadow-xl max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-5 border-b border-[#132A24]/10 flex items-center justify-between bg-[#FAFAF8] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#4E7A66]/10 text-[#4E7A66] flex items-center justify-center">
              <Calendar size={17} />
            </div>
            <div>
              <h3 className="font-serif text-lg font-medium text-[#132A24]">
                Schedule Clinical Session
              </h3>
              <p className="text-[11px] text-[#132A24]/60">
                Select an available slot based on your working hours and Google Calendar
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#132A24]/40 hover:text-[#132A24] hover:bg-[#132A24]/5 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSchedule} className="p-6 space-y-4 text-xs overflow-y-auto grow">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Client Selection */}
          <div>
            <label className="block text-xs font-semibold text-[#132A24] mb-1.5">
              Authorized Client
            </label>
            {defaultClientName ? (
              <input
                type="text"
                disabled
                value={defaultClientName}
                className="w-full border border-[#132A24]/15 rounded-xl px-3.5 py-2.5 bg-[#FAFAF8] text-[#132A24] font-medium"
              />
            ) : (
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="w-full border border-[#132A24]/15 rounded-xl px-3.5 py-2.5 bg-white text-[#132A24] outline-hidden focus:border-[#4E7A66] transition-colors"
              >
                {clients.map((c) => (
                  <option key={c.clientId} value={c.clientId}>
                    {c.name} ({c.careStage})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Date & Format Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1">
              <label className="block text-xs font-semibold text-[#132A24] mb-1.5">
                Session Date
              </label>
              <input
                type="date"
                value={sessionDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setSessionDate(e.target.value)}
                className="w-full border border-[#132A24]/15 rounded-xl px-3 py-2 bg-white text-[#132A24] outline-hidden focus:border-[#4E7A66]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#132A24] mb-1.5">
                Duration
              </label>
              <select
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full border border-[#132A24]/15 rounded-xl px-3 py-2 bg-white text-[#132A24] outline-hidden focus:border-[#4E7A66]"
              >
                <option value={50}>50 Min (Standard)</option>
                <option value={30}>30 Min (Intake/Check-in)</option>
                <option value={60}>60 Min (Extended)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#132A24] mb-1.5">
                Modality
              </label>
              <select
                value={sessionType}
                onChange={(e) => setSessionType(e.target.value)}
                className="w-full border border-[#132A24]/15 rounded-xl px-3 py-2 bg-white text-[#132A24] outline-hidden focus:border-[#4E7A66]"
              >
                <option value="video">Online Video (Meet)</option>
                <option value="audio">Audio Consultation</option>
                <option value="in_person">In-Person Clinic</option>
              </select>
            </div>
          </div>

          {/* Consultation Time Slots (Discrete Selection, No raw time picker) */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-[#132A24]">
                Available Consultation Slots
              </label>
              {workingHoursLabel && (
                <span className="text-[11px] text-[#132A24]/60">
                  Hours: {workingHoursLabel}
                </span>
              )}
            </div>

            {slotsLoading ? (
              <div className="p-8 border border-dashed border-[#132A24]/15 rounded-xl text-center space-y-2 bg-[#FAFAF8]">
                <Clock size={20} className="mx-auto text-[#4E7A66] animate-spin" />
                <p className="text-xs text-[#132A24]/70">Checking working hours and calendar availability...</p>
              </div>
            ) : isDayClosed ? (
              <div className="p-6 border border-dashed border-amber-200 bg-amber-50/60 rounded-xl text-center space-y-1.5">
                <p className="text-xs font-semibold text-amber-900">Therapist Closed on this Day</p>
                <p className="text-[11px] text-amber-800/80">
                  Your working schedule indicates you are closed on this day of the week. You can adjust your working days in Profile Settings or choose another date above.
                </p>
              </div>
            ) : daySlots.length === 0 ? (
              <div className="p-6 border border-dashed border-[#132A24]/15 bg-[#FAFAF8] rounded-xl text-center space-y-1">
                <p className="text-xs font-medium text-[#132A24]">No slots configured for this date.</p>
                <p className="text-[11px] text-[#132A24]/60">Please choose another date or update your working windows.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-52 overflow-y-auto p-1 border border-[#132A24]/10 rounded-xl bg-[#FAFAF8]">
                {daySlots.map((slot) => {
                  const isSelected = selectedSlot?.id === slot.id;
                  const isAvail = slot.available;

                  return (
                    <button
                      key={slot.id}
                      type="button"
                      disabled={!isAvail}
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-2.5 rounded-xl border text-left transition-all relative flex flex-col justify-between min-h-[58px] ${
                        isSelected
                          ? 'border-[#132A24] bg-[#132A24] text-white shadow-xs'
                          : isAvail
                          ? 'border-[#132A24]/15 bg-white text-[#132A24] hover:border-[#4E7A66] hover:bg-[#4E7A66]/5 cursor-pointer'
                          : 'border-[#132A24]/10 bg-gray-100/70 text-gray-400 cursor-not-allowed opacity-75'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className={`text-[11px] font-semibold ${isSelected ? 'text-white' : isAvail ? 'text-[#132A24]' : 'text-gray-500'}`}>
                          {slot.startTimeStr}
                        </span>
                        {isSelected && (
                          <CheckCircle2 size={13} className="text-[#A2E3C4]" />
                        )}
                        {!isAvail && (
                          <Lock size={11} className="text-gray-400" />
                        )}
                      </div>

                      <div className="mt-1 flex items-center justify-between w-full">
                        <span className={`text-[10px] ${isSelected ? 'text-white/80' : 'text-[#132A24]/60'}`}>
                          {slot.endTimeStr}
                        </span>
                        {!isAvail && (
                          <span className="text-[9px] font-medium text-amber-800 bg-amber-100/90 px-1 py-0.2 rounded truncate max-w-[80px]">
                            {slot.conflictReason || 'Unavailable'}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {selectedSlot && (
              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-900">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-[#4E7A66] shrink-0" />
                  <span>
                    Selected Slot: <strong>{selectedSlot.formatted}</strong>
                  </span>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700">
                  Ready to book
                </span>
              </div>
            )}
          </div>

          {/* Clinical Focus / Notes */}
          <div>
            <label className="block text-xs font-semibold text-[#132A24] mb-1.5">
              Clinical Note / Focus (Optional)
            </label>
            <textarea
              rows={2}
              value={clientNotes}
              onChange={(e) => setClientNotes(e.target.value)}
              placeholder="e.g. Session on cognitive restructuring and sleep hygiene..."
              className="w-full border border-[#132A24]/15 rounded-xl px-3.5 py-2 bg-white text-[#132A24] outline-hidden focus:border-[#4E7A66]"
            />
          </div>

          {/* Footer Controls */}
          <div className="pt-3 border-t border-[#132A24]/10 flex items-center justify-between shrink-0">
            <span className="text-[11px] text-[#132A24]/50">
              Session automatically syncs to Google Calendar & Meet
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-[#132A24]/15 text-[#132A24] text-xs font-medium hover:bg-[#132A24]/5 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !selectedSlot}
                className="px-5 py-2.5 rounded-xl bg-[#132A24] text-white text-xs font-semibold hover:bg-[#132A24]/90 disabled:opacity-40 transition-all cursor-pointer shadow-xs inline-flex items-center gap-1.5"
              >
                {submitting ? 'Confirming...' : 'Book Selected Slot'}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
