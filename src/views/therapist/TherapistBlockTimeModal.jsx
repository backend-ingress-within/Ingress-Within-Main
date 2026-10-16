import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar as CalendarIcon, Clock, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function TherapistBlockTimeModal({
  initialDate,
  onClose,
  onSuccess,
}) {
  const defaultDateStr = initialDate
    ? new Date(initialDate.getTime() - initialDate.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 10)
    : new Date().toISOString().slice(0, 10);

  const [date, setDate] = useState(defaultDateStr);
  const [isAllDay, setIsAllDay] = useState(true);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('18:00');
  const [reason, setReason] = useState('Personal Leave / Time Off');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!date) {
      setError('Please select a date to block.');
      return;
    }

    if (!isAllDay && startTime >= endTime) {
      setError('End time must be after start time.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/therapist/calendar/block', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          specificDate: date,
          startTime: isAllDay ? '00:00:00' : `${startTime}:00`,
          endTime: isAllDay ? '23:59:59' : `${endTime}:00`,
          reason: reason.trim() || 'Manual Block / Leave',
          isRecurring: false,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error?.message || 'Failed to block calendar window.');
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to block time.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-[#132A24]/10 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-[#132A24]/10 flex items-center justify-between bg-[#FAF9F5]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-700 flex items-center justify-center">
              <CalendarIcon size={16} />
            </div>
            <div>
              <h3 className="font-serif text-lg font-medium text-[#132A24]">
                Block Time / Leave
              </h3>
              <p className="text-[11px] text-[#132A24]/60">
                Prevent client bookings and mark your calendar as unavailable
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#132A24]/40 hover:text-[#132A24] hover:bg-[#132A24]/5 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <ShieldAlert size={14} className="shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#132A24] mb-1.5">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#132A24]/20 text-xs text-[#132A24] focus:outline-none focus:border-[#4E7A66]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#132A24] mb-1.5">
              Duration Mode
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsAllDay(true)}
                className={`py-2 px-3 rounded-lg text-xs font-medium border text-center transition-all cursor-pointer ${
                  isAllDay
                    ? 'border-[#132A24] bg-[#132A24] text-white shadow-2xs'
                    : 'border-[#132A24]/15 bg-white text-[#132A24]/70 hover:bg-[#132A24]/5'
                }`}
              >
                All Day / On Leave
              </button>
              <button
                type="button"
                onClick={() => setIsAllDay(false)}
                className={`py-2 px-3 rounded-lg text-xs font-medium border text-center transition-all cursor-pointer ${
                  !isAllDay
                    ? 'border-[#132A24] bg-[#132A24] text-white shadow-2xs'
                    : 'border-[#132A24]/15 bg-white text-[#132A24]/70 hover:bg-[#132A24]/5'
                }`}
              >
                Specific Time Window
              </button>
            </div>
          </div>

          {!isAllDay && (
            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[#FAF9F5] border border-[#132A24]/10">
              <div>
                <label className="block text-[11px] font-semibold text-[#132A24]/70 mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-md border border-[#132A24]/20 text-xs text-[#132A24] bg-white focus:outline-none focus:border-[#4E7A66]"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#132A24]/70 mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-md border border-[#132A24]/20 text-xs text-[#132A24] bg-white focus:outline-none focus:border-[#4E7A66]"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#132A24] mb-1.5">
              Reason / Label (Optional)
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Personal Leave, Medical Appointment, Vacation"
              className="w-full px-3 py-2 rounded-lg border border-[#132A24]/20 text-xs text-[#132A24] focus:outline-none focus:border-[#4E7A66]"
            />
            <p className="text-[10px] text-[#132A24]/50 mt-1">
              Only visible to you on your therapist calendar.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#132A24]/10">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-3.5 py-2 rounded-lg border border-[#132A24]/15 text-xs font-medium text-[#132A24]/80 hover:bg-[#132A24]/5 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              {submitting ? 'Blocking...' : 'Confirm Block / Leave'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
