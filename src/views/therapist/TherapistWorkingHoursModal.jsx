import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Clock,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Copy,
  Sun,
  Moon,
  Sparkles,
  Calendar,
} from 'lucide-react';

// Generates 48 intervals (every 30 mins) from 00:00 to 24:00
export const ALL_24_HOUR_OPTIONS = (() => {
  const options = [];
  for (let h = 0; h < 24; h++) {
    const hh = String(h).padStart(2, '0');
    const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    const ampm = h < 12 ? 'AM' : 'PM';
    options.push({ value: `${hh}:00`, label: `${hh}:00 (${h12}:00 ${ampm})` });
    options.push({ value: `${hh}:30`, label: `${hh}:30 (${h12}:30 ${ampm})` });
  }
  options.push({ value: '24:00', label: '24:00 (12:00 AM Midnight End)' });
  return options;
})();

const DAYS_OF_WEEK = [
  { key: 'mon', label: 'Monday' },
  { key: 'tue', label: 'Tuesday' },
  { key: 'wed', label: 'Wednesday' },
  { key: 'thu', label: 'Thursday' },
  { key: 'fri', label: 'Friday' },
  { key: 'sat', label: 'Saturday' },
  { key: 'sun', label: 'Sunday' },
];

export default function TherapistWorkingHoursModal({
  initialHours,
  onClose,
  onSuccess,
}) {
  const [hours, setHours] = useState(() => {
    if (initialHours && typeof initialHours === 'object' && Object.keys(initialHours).length > 0) {
      return {
        mon: initialHours.mon || [],
        tue: initialHours.tue || [],
        wed: initialHours.wed || [],
        thu: initialHours.thu || [],
        fri: initialHours.fri || [],
        sat: initialHours.sat || [],
        sun: initialHours.sun || [],
      };
    }
    return {
      mon: ['09:00-17:00'],
      tue: ['09:00-17:00'],
      wed: ['09:00-17:00'],
      thu: ['09:00-17:00'],
      fri: ['09:00-17:00'],
      sat: [],
      sun: [],
    };
  });

  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successNotice, setSuccessNotice] = useState('');

  // Fetch latest availability if initialHours not provided
  useEffect(() => {
    if (!initialHours) {
      async function loadAvailability() {
        try {
          const res = await fetch('/api/therapist/calendar/availability');
          if (res.ok) {
            const data = await res.json();
            if (data.availabilityHours && typeof data.availabilityHours === 'object') {
              setHours({
                mon: data.availabilityHours.mon || [],
                tue: data.availabilityHours.tue || [],
                wed: data.availabilityHours.wed || [],
                thu: data.availabilityHours.thu || [],
                fri: data.availabilityHours.fri || [],
                sat: data.availabilityHours.sat || [],
                sun: data.availabilityHours.sun || [],
              });
            }
          }
        } catch {
          // Keep default fallback
        }
      }
      loadAvailability();
    }
  }, [initialHours]);

  const handleToggleDay = (dayKey) => {
    setHours((prev) => {
      const current = prev[dayKey] || [];
      const isCurrentlyOpen = current.length > 0;
      return {
        ...prev,
        [dayKey]: isCurrentlyOpen ? [] : ['09:00-17:00'],
      };
    });
  };

  const handleAddTimeSlot = (dayKey) => {
    setHours((prev) => {
      const current = prev[dayKey] || [];
      let nextStart = '18:00';
      let nextEnd = '22:00';

      if (current.length > 0) {
        const lastSlot = current[current.length - 1];
        const [, lastEnd] = lastSlot.split('-');
        if (lastEnd) {
          const lastEndHour = parseInt(lastEnd.split(':')[0], 10) || 12;
          const newStartHour = Math.min(lastEndHour + 1, 22);
          const newEndHour = Math.min(newStartHour + 3, 24);
          nextStart = `${String(newStartHour).padStart(2, '0')}:00`;
          nextEnd = `${String(newEndHour).padStart(2, '0')}:00`;
        }
      } else {
        nextStart = '08:00';
        nextEnd = '11:00';
      }

      return {
        ...prev,
        [dayKey]: [...current, `${nextStart}-${nextEnd}`],
      };
    });
  };

  const handleRemoveTimeSlot = (dayKey, slotIndex) => {
    setHours((prev) => {
      const current = [...(prev[dayKey] || [])];
      current.splice(slotIndex, 1);
      return {
        ...prev,
        [dayKey]: current,
      };
    });
  };

  const handleSlotChange = (dayKey, slotIndex, start, end) => {
    setHours((prev) => {
      const current = [...(prev[dayKey] || [])];
      current[slotIndex] = `${start}-${end}`;
      return {
        ...prev,
        [dayKey]: current,
      };
    });
  };

  // Presets
  const applyPreset = (presetType) => {
    let next = {};
    if (presetType === 'morning_routine') {
      // 8 AM - 11 AM Morning Routine
      next = {
        mon: ['08:00-11:00'],
        tue: ['08:00-11:00'],
        wed: ['08:00-11:00'],
        thu: ['08:00-11:00'],
        fri: ['08:00-11:00'],
        sat: ['08:00-11:00'],
        sun: [],
      };
    } else if (presetType === 'night_routine') {
      // 6 PM - 10 PM Night Routine (18:00 - 22:00)
      next = {
        mon: ['18:00-22:00'],
        tue: ['18:00-22:00'],
        wed: ['18:00-22:00'],
        thu: ['18:00-22:00'],
        fri: ['18:00-22:00'],
        sat: ['18:00-22:00'],
        sun: [],
      };
    } else if (presetType === 'split_morning_night') {
      // Split Routine: Morning (8-11 AM) + Night (6-10 PM)
      next = {
        mon: ['08:00-11:00', '18:00-22:00'],
        tue: ['08:00-11:00', '18:00-22:00'],
        wed: ['08:00-11:00', '18:00-22:00'],
        thu: ['08:00-11:00', '18:00-22:00'],
        fri: ['08:00-11:00', '18:00-22:00'],
        sat: ['09:00-13:00'],
        sun: [],
      };
    } else if (presetType === 'standard_day') {
      // 9 AM - 5 PM
      next = {
        mon: ['09:00-17:00'],
        tue: ['09:00-17:00'],
        wed: ['09:00-17:00'],
        thu: ['09:00-17:00'],
        fri: ['09:00-17:00'],
        sat: [],
        sun: [],
      };
    } else if (presetType === 'extended_day') {
      // 8 AM - 8 PM
      next = {
        mon: ['08:00-20:00'],
        tue: ['08:00-20:00'],
        wed: ['08:00-20:00'],
        thu: ['08:00-20:00'],
        fri: ['08:00-20:00'],
        sat: ['10:00-16:00'],
        sun: [],
      };
    } else if (presetType === 'all_day_24h') {
      // Full 24 Hours Open
      next = {
        mon: ['00:00-24:00'],
        tue: ['00:00-24:00'],
        wed: ['00:00-24:00'],
        thu: ['00:00-24:00'],
        fri: ['00:00-24:00'],
        sat: ['00:00-24:00'],
        sun: ['00:00-24:00'],
      };
    }
    setHours(next);
  };

  const copyMondayToWeekdays = () => {
    const mondaySlots = hours.mon || [];
    setHours((prev) => ({
      ...prev,
      tue: [...mondaySlots],
      wed: [...mondaySlots],
      thu: [...mondaySlots],
      fri: [...mondaySlots],
    }));
    setSuccessNotice('Copied Monday schedule to Tuesday – Friday.');
    setTimeout(() => setSuccessNotice(''), 2500);
  };

  const copyMondayToAllDays = () => {
    const mondaySlots = hours.mon || [];
    setHours({
      mon: [...mondaySlots],
      tue: [...mondaySlots],
      wed: [...mondaySlots],
      thu: [...mondaySlots],
      fri: [...mondaySlots],
      sat: [...mondaySlots],
      sun: [...mondaySlots],
    });
    setSuccessNotice('Copied Monday schedule to all 7 days.');
    setTimeout(() => setSuccessNotice(''), 2500);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage('');
    setSuccessNotice('');

    try {
      // 1. Validate all windows: start time must be before end time
      for (const [dayKey, slots] of Object.entries(hours)) {
        for (const slotStr of slots) {
          const [start, end] = slotStr.split('-');
          if (!start || !end) continue;
          const sMin = parseTimeToMinutes(start);
          const eMin = parseTimeToMinutes(end);
          if (eMin <= sMin) {
            const dayName = DAYS_OF_WEEK.find((d) => d.key === dayKey)?.label || dayKey;
            throw new Error(`In ${dayName}: End time (${end}) must be after start time (${start}).`);
          }
        }
      }

      // 2. Persist to API
      const res = await fetch('/api/therapist/calendar/availability', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ availabilityHours: hours }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error?.message || 'Failed to save working hours.');
      }

      setSuccessNotice('Working hours saved successfully!');
      if (onSuccess) {
        onSuccess(hours);
      }
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err) {
      setErrorMessage(err.message || 'Error saving working hours.');
    } finally {
      setSaving(false);
    }
  };

  function parseTimeToMinutes(timeStr) {
    if (timeStr === '24:00') return 24 * 60;
    const [h, m = 0] = timeStr.split(':').map(Number);
    return h * 60 + m;
  }

  function calculateDailySlots(slots) {
    let count = 0;
    for (const s of slots) {
      const [start, end] = s.split('-');
      if (start && end) {
        const sMin = parseTimeToMinutes(start);
        const eMin = parseTimeToMinutes(end);
        const duration = eMin - sMin;
        if (duration >= 50) {
          count += Math.floor(duration / 60);
        }
      }
    }
    return count;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        className="bg-white rounded-2xl border border-[#132A24]/10 shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col max-h-[92vh] my-auto"
      >
        {/* Header */}
        <div className="p-5 border-b border-[#132A24]/10 flex items-center justify-between bg-[#FAFAF8] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#4E7A66]/10 text-[#4E7A66] flex items-center justify-center shrink-0">
              <Clock size={20} />
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-medium text-[#132A24]">
                Practice Working Hours (24 Hours)
              </h2>
              <p className="text-[11px] sm:text-xs text-[#132A24]/60">
                Define your exact working hours across all 24 hours. Morning, afternoon, night routines, or custom shifts.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#132A24]/40 hover:text-[#132A24] hover:bg-[#132A24]/5 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs">
          {/* Alerts */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span className="font-medium">{errorMessage}</span>
            </div>
          )}

          {successNotice && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2">
              <CheckCircle2 size={16} className="shrink-0" />
              <span className="font-medium">{successNotice}</span>
            </div>
          )}

          {/* Quick Presets Bar */}
          <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-[#132A24]/10 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#132A24]/70 flex items-center gap-1.5">
                <Sparkles size={13} className="text-[#4E7A66]" />
                Quick Schedule Presets
              </span>
              <span className="text-[10px] text-[#132A24]/50">Click to apply template</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => applyPreset('morning_routine')}
                className="px-2.5 py-1.5 rounded-lg bg-white border border-[#132A24]/15 hover:border-[#4E7A66] hover:bg-emerald-50/50 text-[11px] font-semibold text-[#132A24] flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                <Sun size={12} className="text-amber-600" /> Morning (8 – 11 AM)
              </button>
              <button
                type="button"
                onClick={() => applyPreset('night_routine')}
                className="px-2.5 py-1.5 rounded-lg bg-white border border-[#132A24]/15 hover:border-[#4E7A66] hover:bg-indigo-50/50 text-[11px] font-semibold text-[#132A24] flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                <Moon size={12} className="text-indigo-600" /> Night (6 – 10 PM)
              </button>
              <button
                type="button"
                onClick={() => applyPreset('split_morning_night')}
                className="px-2.5 py-1.5 rounded-lg bg-white border border-[#132A24]/15 hover:border-[#4E7A66] hover:bg-emerald-50/50 text-[11px] font-semibold text-[#132A24] flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                <Clock size={12} className="text-[#4E7A66]" /> Split Shift (8–11 AM & 6–10 PM)
              </button>
              <button
                type="button"
                onClick={() => applyPreset('standard_day')}
                className="px-2.5 py-1.5 rounded-lg bg-white border border-[#132A24]/15 hover:border-[#4E7A66] text-[11px] font-medium text-[#132A24]/80 transition-colors cursor-pointer shadow-2xs"
              >
                Standard (9 AM – 5 PM)
              </button>
              <button
                type="button"
                onClick={() => applyPreset('extended_day')}
                className="px-2.5 py-1.5 rounded-lg bg-white border border-[#132A24]/15 hover:border-[#4E7A66] text-[11px] font-medium text-[#132A24]/80 transition-colors cursor-pointer shadow-2xs"
              >
                Extended (8 AM – 8 PM)
              </button>
              <button
                type="button"
                onClick={() => applyPreset('all_day_24h')}
                className="px-2.5 py-1.5 rounded-lg bg-white border border-[#132A24]/15 hover:border-[#4E7A66] text-[11px] font-medium text-[#132A24]/80 transition-colors cursor-pointer shadow-2xs"
              >
                All 24 Hours
              </button>
            </div>
          </div>

          {/* Bulk Replication Helpers */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-1">
            <span className="text-[11px] font-semibold text-[#132A24]/70">
              Weekly Consultation Schedule
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={copyMondayToWeekdays}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#132A24]/5 hover:bg-[#132A24]/10 text-[11px] font-medium text-[#132A24] transition-colors cursor-pointer"
                title="Copies Monday's working windows to Tuesday, Wednesday, Thursday, and Friday"
              >
                <Copy size={11} /> Copy Mon to Weekdays
              </button>
              <button
                type="button"
                onClick={copyMondayToAllDays}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#132A24]/5 hover:bg-[#132A24]/10 text-[11px] font-medium text-[#132A24] transition-colors cursor-pointer"
                title="Copies Monday's working windows to all 7 days of the week"
              >
                <Copy size={11} /> Copy Mon to All Days
              </button>
            </div>
          </div>

          {/* Days of Week List */}
          <div className="space-y-3">
            {DAYS_OF_WEEK.map(({ key, label }) => {
              const slots = hours[key] || [];
              const isEnabled = slots.length > 0;
              const slotsCount = calculateDailySlots(slots);

              return (
                <div
                  key={key}
                  className={`p-3.5 sm:p-4 rounded-xl border transition-all space-y-3 ${
                    isEnabled
                      ? 'bg-white border-[#132A24]/15 shadow-2xs'
                      : 'bg-[#FAFAF8] border-[#132A24]/8 opacity-65'
                  }`}
                >
                  {/* Day Header Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isEnabled}
                        onChange={() => handleToggleDay(key)}
                        id={`modal-day-${key}`}
                        className="rounded border-[#132A24]/20 text-[#4E7A66] focus:ring-[#4E7A66] cursor-pointer"
                      />
                      <label
                        htmlFor={`modal-day-${key}`}
                        className="font-semibold text-xs text-[#132A24] cursor-pointer w-24"
                      >
                        {label}
                      </label>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          isEnabled
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60'
                            : 'bg-stone-100 text-stone-500'
                        }`}
                      >
                        {isEnabled ? 'Open for bookings' : 'Closed'}
                      </span>
                    </div>

                    {isEnabled && (
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-medium text-[#132A24]/60 bg-[#132A24]/5 px-2.5 py-0.5 rounded-md">
                          {slotsCount} {slotsCount === 1 ? 'slot' : 'slots'} (50m) / day
                        </span>
                        <button
                          type="button"
                          onClick={() => handleAddTimeSlot(key)}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#4E7A66] hover:text-[#132A24] cursor-pointer px-2 py-1 rounded-md hover:bg-[#4E7A66]/10 transition-colors"
                        >
                          <Plus size={12} /> Add Time Window
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Windows List */}
                  {isEnabled && (
                    <div className="space-y-2 pt-2 border-t border-[#132A24]/5">
                      {slots.map((slotStr, sIdx) => {
                        const [start = '09:00', end = '17:00'] = slotStr.split('-');
                        return (
                          <div
                            key={`modal-slot-${key}-${sIdx}`}
                            className="flex flex-wrap items-center gap-2 text-xs bg-[#FAF9F5] p-2.5 rounded-lg border border-[#132A24]/10"
                          >
                            <span className="text-[11px] font-bold text-[#132A24]/70 w-16">
                              Shift {sIdx + 1}:
                            </span>
                            <span className="text-[#132A24]/60 font-medium">From</span>
                            <select
                              value={start}
                              onChange={(e) => handleSlotChange(key, sIdx, e.target.value, end)}
                              className="border border-[#132A24]/20 rounded-lg px-2.5 py-1 text-xs bg-white text-[#132A24] font-medium outline-hidden focus:border-[#4E7A66]"
                            >
                              {ALL_24_HOUR_OPTIONS.filter((o) => o.value !== '24:00').map((t) => (
                                <option key={`start-${t.value}`} value={t.value}>
                                  {t.label}
                                </option>
                              ))}
                            </select>

                            <span className="text-[#132A24]/60 font-medium">To</span>
                            <select
                              value={end}
                              onChange={(e) => handleSlotChange(key, sIdx, start, e.target.value)}
                              className="border border-[#132A24]/20 rounded-lg px-2.5 py-1 text-xs bg-white text-[#132A24] font-medium outline-hidden focus:border-[#4E7A66]"
                            >
                              {ALL_24_HOUR_OPTIONS.map((t) => (
                                <option key={`end-${t.value}`} value={t.value}>
                                  {t.label}
                                </option>
                              ))}
                            </select>

                            {slots.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveTimeSlot(key, sIdx)}
                                className="p-1 rounded text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer ml-auto transition-colors"
                                title="Remove this window"
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#132A24]/10 bg-[#FAFAF8] flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-[#132A24]/15 text-xs font-semibold text-[#132A24]/70 hover:bg-[#132A24]/5 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 rounded-lg bg-[#4E7A66] text-white text-xs font-semibold hover:bg-[#4E7A66]/90 transition-all cursor-pointer shadow-xs disabled:opacity-50 inline-flex items-center gap-1.5"
          >
            {saving ? (
              <>
                <Clock size={13} className="animate-spin" />
                Saving Hours...
              </>
            ) : (
              'Save & Apply Working Hours'
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
