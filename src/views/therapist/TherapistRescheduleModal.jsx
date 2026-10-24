import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Clock, AlertCircle, CheckCircle2, Lock } from 'lucide-react';

export default function TherapistRescheduleModal({
  appointment,
  onClose,
  onSuccess,
}) {
  const [newDate, setNewDate] = useState(
    appointment?.scheduled_start ? appointment.scheduled_start.split('T')[0] : new Date().toISOString().split('T')[0]
  );
  const [reason, setReason] = useState('Client requested slot adjustment');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Slots state
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [daySlots, setDaySlots] = useState([]);
  const [isDayClosed, setIsDayClosed] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Fetch slots whenever newDate changes
  useEffect(() => {
    let isCancelled = false;
    async function loadSlots() {
      setSlotsLoading(true);
      setSelectedSlot(null);
      setErrorMessage('');
      try {
        const res = await fetch(`/api/therapist/calendar/slots?date=${encodeURIComponent(newDate)}&duration=50`);
        if (res.ok) {
          const json = await res.json();
          if (!isCancelled) {
            setDaySlots(json.slots || []);
            setIsDayClosed(Boolean(json.isClosed));
            const firstAvailable = (json.slots || []).find((s) => s.available);
            if (firstAvailable) {
              setSelectedSlot(firstAvailable);
            }
          }
        }
      } catch {
        if (!isCancelled) {
          setErrorMessage('Failed to load slots for this date.');
        }
      } finally {
        if (!isCancelled) {
          setSlotsLoading(false);
        }
      }
    }

    if (newDate) {
      loadSlots();
    }

    return () => {
      isCancelled = true;
    };
  }, [newDate]);

  const handleReschedule = async (e) => {
    e.preventDefault();
    if (!selectedSlot) {
      setErrorMessage('Please select an available consultation slot.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch(`/api/therapist/sessions/${appointment.id}/reschedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          new_start: selectedSlot.start,
          new_end: selectedSlot.end,
          reason,
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
          throw new Error('This slot overlaps with another scheduled commitment or Google Calendar event.');
        }
        if (data.error?.code === 'OUTSIDE_WORKING_HOURS') {
          throw new Error('This time is outside your configured consultation hours.');
        }
        throw new Error(data.error?.message || 'Failed to reschedule.');
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
        className="bg-white rounded-2xl border border-[#132A24]/10 shadow-xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-5 border-b border-[#132A24]/10 flex items-center justify-between bg-[#FAFAF8] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#4E7A66]/10 text-[#4E7A66] flex items-center justify-center">
              <Clock size={17} />
            </div>
            <div>
              <h3 className="font-serif text-lg font-medium text-[#132A24]">
                Reschedule Session
              </h3>
              <p className="text-[11px] text-[#132A24]/60">
                Choose a new available slot without conflict
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[#132A24]/40 hover:text-[#132A24] cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleReschedule} className="p-6 space-y-4 text-xs overflow-y-auto grow">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="p-3 bg-[#FAFAF8] border border-[#132A24]/10 rounded-xl">
            <span className="font-semibold text-[#132A24] block mb-0.5">Current Appointment:</span>
            <p className="text-[#132A24]/80">
              {appointment?.clientDisplayName || 'Authorized Client'} &bull;{' '}
              {appointment?.scheduled_start ? new Date(appointment.scheduled_start).toLocaleString('en-IN') : ''}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#132A24] mb-1.5">New Date</label>
            <input
              type="date"
              value={newDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full border border-[#132A24]/15 rounded-xl px-3.5 py-2.5 bg-white text-[#132A24] outline-hidden focus:border-[#4E7A66]"
            />
          </div>

          {/* Time Slots */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#132A24]">
              Select New Consultation Slot
            </label>

            {slotsLoading ? (
              <div className="p-6 border border-dashed border-[#132A24]/15 rounded-xl text-center space-y-2 bg-[#FAFAF8]">
                <Clock size={18} className="mx-auto text-[#4E7A66] animate-spin" />
                <p className="text-xs text-[#132A24]/70">Checking available slots...</p>
              </div>
            ) : isDayClosed ? (
              <div className="p-4 border border-dashed border-amber-200 bg-amber-50/60 rounded-xl text-center">
                <p className="text-xs font-medium text-amber-900">Therapist closed on this day.</p>
              </div>
            ) : daySlots.length === 0 ? (
              <div className="p-4 border border-dashed border-[#132A24]/15 bg-[#FAFAF8] rounded-xl text-center">
                <p className="text-xs text-[#132A24]/70">No slots configured for this date.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1 border border-[#132A24]/10 rounded-xl bg-[#FAFAF8]">
                {daySlots.map((slot) => {
                  const isSelected = selectedSlot?.id === slot.id;
                  const isAvail = slot.available;

                  return (
                    <button
                      key={slot.id}
                      type="button"
                      disabled={!isAvail}
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-2.5 rounded-xl border text-left transition-all relative flex flex-col justify-between min-h-[56px] ${
                        isSelected
                          ? 'border-[#132A24] bg-[#132A24] text-white shadow-xs'
                          : isAvail
                          ? 'border-[#132A24]/15 bg-white text-[#132A24] hover:border-[#4E7A66] cursor-pointer'
                          : 'border-[#132A24]/10 bg-gray-100/70 text-gray-400 cursor-not-allowed opacity-75'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className={`text-[11px] font-semibold ${isSelected ? 'text-white' : isAvail ? 'text-[#132A24]' : 'text-gray-500'}`}>
                          {slot.startTimeStr}
                        </span>
                        {isSelected && <CheckCircle2 size={13} className="text-[#A2E3C4]" />}
                        {!isAvail && <Lock size={11} className="text-gray-400" />}
                      </div>
                      <div className="mt-1 flex items-center justify-between w-full">
                        <span className={`text-[10px] ${isSelected ? 'text-white/80' : 'text-[#132A24]/60'}`}>
                          {slot.endTimeStr}
                        </span>
                        {!isAvail && (
                          <span className="text-[9px] font-medium text-amber-800 bg-amber-100 px-1 py-0.2 rounded truncate max-w-[80px]">
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
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#4E7A66] shrink-0" />
                <span>
                  New Slot: <strong>{selectedSlot.formatted}</strong>
                </span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#132A24] mb-1.5">
              Reschedule Reason (Recorded in audit trail)
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border border-[#132A24]/15 rounded-xl px-3.5 py-2.5 bg-white text-[#132A24] outline-hidden focus:border-[#4E7A66]"
            />
          </div>

          <div className="pt-3 border-t border-[#132A24]/10 flex items-center justify-end gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#132A24]/15 text-[#132A24] text-xs font-medium hover:bg-[#132A24]/5 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !selectedSlot}
              className="px-5 py-2.5 rounded-xl bg-[#132A24] text-white text-xs font-semibold hover:bg-[#132A24]/90 disabled:opacity-40 cursor-pointer shadow-xs"
            >
              {submitting ? 'Updating...' : 'Confirm Reschedule'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
