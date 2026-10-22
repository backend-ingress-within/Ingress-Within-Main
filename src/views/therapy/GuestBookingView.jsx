'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  Shield,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Info,
  Check,
  ChevronRight,
  ArrowLeft,
  User,
} from 'lucide-react';

export default function GuestBookingView({ token }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingData, setBookingData] = useState(null);

  // Slot Selection State
  const [selectedDateKey, setSelectedDateKey] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const fetchBookingData = async () => {
    if (!token) {
      setError({
        code: 'INVALID_LINK',
        message: 'This booking link is invalid or incomplete.',
      });
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/therapy/book/${encodeURIComponent(token)}`, {
        cache: 'no-store',
      });
      const data = await res.json();

      if (!res.ok) {
        setError({
          code: data.error?.code || 'UNAVAILABLE',
          message: data.error?.message || 'This booking link is invalid or no longer active.',
        });
        setBookingData(null);
        return;
      }

      setBookingData(data);

      // Pre-select the first date with open slots if available
      const slots = data.availability?.slots || [];
      if (slots.length > 0) {
        const firstDateKey = new Date(slots[0].start).toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        });
        setSelectedDateKey(firstDateKey);
      }
    } catch (err) {
      setError({
        code: 'NETWORK_ERROR',
        message: 'Unable to reach the scheduling server. Please check your connection and retry.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingData();
  }, [token]);

  // Group slots by date
  const groupedSlots = useMemo(() => {
    const groups = {};
    if (!bookingData?.availability?.slots) return groups;

    for (const slot of bookingData.availability.slots) {
      const d = new Date(slot.start);
      const dateKey = d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(slot);
    }
    return groups;
  }, [bookingData]);

  const dateKeys = Object.keys(groupedSlots);

  // Format time utility
  const formatTime = (isoString) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString('en-IN', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return '';
    }
  };

  // 1. Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] text-[#132A24] flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-white border border-[#132A24]/10 rounded-2xl p-8 shadow-sm text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#132A24]/5 border border-[#132A24]/10 flex items-center justify-center text-[#4E7A66]">
            <RefreshCw className="w-6 h-6 animate-spin" />
          </div>
          <div>
            <h2 className="text-lg font-serif font-medium text-[#132A24]">Loading Consultation Schedule</h2>
            <p className="text-xs text-[#132A24]/60 mt-1">
              Verifying care relationship and fetching real-time practitioner availability...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 2. Unavailable / Invalid Link State
  if (error || !bookingData) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] text-[#132A24] flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-white border border-red-200 rounded-2xl p-8 shadow-sm text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-red-600">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-serif font-medium text-[#132A24]">Booking Link Unavailable</h2>
            <p className="text-xs text-[#132A24]/70 leading-relaxed">
              {error?.message || 'This booking link is invalid, has expired, or the associated care relationship is no longer active.'}
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={fetchBookingData}
              className="w-full py-2.5 px-4 bg-[#132A24] hover:bg-[#132A24]/90 text-white text-xs font-medium rounded-xl transition-colors cursor-pointer"
            >
              Retry
            </button>
            <a
              href="/"
              className="text-xs text-[#4E7A66] hover:text-[#132A24] underline transition-colors block py-1"
            >
              Return to Ingress Within
            </a>
          </div>
          <p className="text-[11px] text-[#132A24]/40 pt-2 border-t border-[#132A24]/5">
            Need assistance? Reach out to support@ingresswithin.com
          </p>
        </div>
      </div>
    );
  }

  const { practitioner, session, pricing, availability } = bookingData;
  const activeDaySlots = (selectedDateKey && groupedSlots[selectedDateKey]) || [];

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#132A24] font-sans antialiased">
      {/* Top Navigation Bar */}
      <header className="border-b border-[#132A24]/10 bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-serif text-lg tracking-tight font-medium text-[#132A24]">
              Ingress Within
            </span>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#4E7A66]/10 text-[#2D5A46] font-medium border border-[#4E7A66]/20">
              Direct Therapy Booking
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#132A24]/60">
            <Shield className="w-4 h-4 text-[#4E7A66]" />
            <span>Private & Confidential</span>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Practitioner & Pricing Breakdown (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Practitioner Profile Card */}
            <div className="bg-white border border-[#132A24]/10 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-start gap-4">
                {practitioner.photoUrl ? (
                  <img
                    src={practitioner.photoUrl}
                    alt={practitioner.name}
                    className="w-16 h-16 rounded-full object-cover border border-[#132A24]/10"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-[#132A24] text-white flex items-center justify-center font-serif text-xl font-medium shrink-0">
                    {practitioner.name ? practitioner.name.charAt(0) : 'T'}
                  </div>
                )}
                <div>
                  <h1 className="font-serif text-xl font-medium text-[#132A24]">
                    {practitioner.name}
                  </h1>
                  <p className="text-xs text-[#4E7A66] font-medium mt-0.5">
                    {practitioner.title}
                  </p>
                  {practitioner.qualification && (
                    <p className="text-[11px] text-[#132A24]/60 mt-0.5">
                      {practitioner.qualification}
                    </p>
                  )}
                  {practitioner.experienceYears > 0 && (
                    <span className="inline-block text-[10px] uppercase tracking-wider font-semibold text-[#132A24]/50 mt-1">
                      {practitioner.experienceYears}+ years experience
                    </span>
                  )}
                </div>
              </div>

              {practitioner.bio && (
                <div className="pt-3 border-t border-[#132A24]/5">
                  <p className="text-xs text-[#132A24]/80 leading-relaxed italic font-serif">
                    &ldquo;{practitioner.bio}&rdquo;
                  </p>
                </div>
              )}

              {practitioner.specializations && practitioner.specializations.length > 0 && (
                <div className="pt-2">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-[#132A24]/50 block mb-2">
                    Focus Areas
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {practitioner.specializations.slice(0, 6).map((spec, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2 py-0.5 bg-[#132A24]/[0.03] border border-[#132A24]/10 rounded-md text-[#132A24]/80"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {practitioner.languages && practitioner.languages.length > 0 && (
                <div className="text-[11px] text-[#132A24]/60 pt-1">
                  <strong>Languages:</strong> {practitioner.languages.join(', ')}
                </div>
              )}
            </div>

            {/* Authoritative Pricing & Session Details Card */}
            <div className="bg-white border border-[#132A24]/10 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#132A24]/5 pb-3">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-[#4E7A66]" />
                  <span className="text-xs font-semibold text-[#132A24]">
                    {session.durationMinutes}-Minute Video Session
                  </span>
                </div>
                <span className="text-[11px] text-[#4E7A66] font-medium bg-[#4E7A66]/10 px-2 py-0.5 rounded-full">
                  Telehealth
                </span>
              </div>

              {/* Pricing Line Items */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-[#132A24]/70">
                  <span>Consultation Fee:</span>
                  <span>₹{pricing.subtotalInr.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[#132A24]/70">
                  <span>Integrated GST (18%):</span>
                  <span>₹{pricing.gstInr.toLocaleString('en-IN')}</span>
                </div>
                <div className="pt-2 border-t border-[#132A24]/10 flex justify-between font-semibold text-sm text-[#132A24]">
                  <span>Total Amount:</span>
                  <span className="font-serif">₹{pricing.totalInr.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Clinical Session Instructions */}
              <div className="bg-[#FAFAF8] border border-[#132A24]/10 rounded-xl p-3 space-y-2">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#132A24]">
                  <Info className="w-3.5 h-3.5 text-[#4E7A66]" />
                  <span>Session Guidelines</span>
                </div>
                <ul className="text-[11px] text-[#132A24]/70 space-y-1 list-disc list-inside">
                  {session.instructions.map((inst, i) => (
                    <li key={i}>{inst}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Slot Selection (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border border-[#132A24]/10 rounded-2xl p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-[#132A24]/10 pb-4">
                <div>
                  <h2 className="font-serif text-lg font-medium text-[#132A24]">
                    Select Appointment Time
                  </h2>
                  <p className="text-xs text-[#132A24]/60 mt-0.5">
                    Live schedule &bull; Times displayed in {availability.timezone}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={fetchBookingData}
                  className="p-2 text-[#132A24]/60 hover:text-[#132A24] rounded-lg hover:bg-[#132A24]/5 transition-colors cursor-pointer"
                  title="Refresh availability"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {/* No Slots Available Alert */}
              {dateKeys.length === 0 ? (
                <div className="py-12 px-6 text-center space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-serif text-base font-medium text-[#132A24]">
                      No Open Consultation Slots
                    </h3>
                    <p className="text-xs text-[#132A24]/60 max-w-sm mx-auto">
                      All consultation slots for the next 14 days are currently booked. Please check back soon or contact your practitioner.
                    </p>
                  </div>
                  <button
                    onClick={fetchBookingData}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#132A24]/20 text-xs font-medium text-[#132A24] hover:bg-[#132A24]/5 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Check Again</span>
                  </button>
                </div>
              ) : (
                <>
                  {/* Date Selector Chips */}
                  <div>
                    <span className="text-[11px] font-semibold text-[#132A24]/60 uppercase tracking-wider block mb-2">
                      Available Dates
                    </span>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                      {dateKeys.map((dateKey) => {
                        const isSelected = selectedDateKey === dateKey;
                        const count = groupedSlots[dateKey]?.length || 0;
                        return (
                          <button
                            key={dateKey}
                            type="button"
                            onClick={() => {
                              setSelectedDateKey(dateKey);
                              setSelectedSlot(null); // Reset slot selection when date changes
                            }}
                            className={`px-3.5 py-2.5 rounded-xl text-xs font-medium border flex flex-col items-center min-w-[90px] transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#132A24] border-[#132A24] text-white shadow-xs'
                                : 'bg-white border-[#132A24]/10 text-[#132A24]/70 hover:border-[#132A24]/30 hover:text-[#132A24]'
                            }`}
                          >
                            <span className="font-semibold">{dateKey}</span>
                            <span
                              className={`text-[10px] mt-0.5 ${
                                isSelected ? 'text-white/70' : 'text-[#4E7A66]'
                              }`}
                            >
                              {count} {count === 1 ? 'slot' : 'slots'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Time Slots Grid for Selected Date */}
                  <div>
                    <span className="text-[11px] font-semibold text-[#132A24]/60 uppercase tracking-wider block mb-2">
                      Available Slots for {selectedDateKey}
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {activeDaySlots.map((slot) => {
                        const isSelected = selectedSlot?.start === slot.start;
                        return (
                          <button
                            key={slot.start}
                            type="button"
                            onClick={() => setSelectedSlot(slot)}
                            aria-pressed={isSelected}
                            className={`p-3 rounded-xl border text-xs font-medium flex items-center justify-between transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-1 ring-emerald-500'
                                : 'bg-white border-[#132A24]/10 text-[#132A24] hover:border-[#132A24]/30 hover:bg-[#132A24]/[0.02]'
                            }`}
                          >
                            <div className="flex items-center gap-1.5">
                              <Clock
                                className={`w-3.5 h-3.5 ${
                                  isSelected ? 'text-emerald-700' : 'text-[#4E7A66]'
                                }`}
                              />
                              <span>{formatTime(slot.start)}</span>
                            </div>
                            {isSelected && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Selected Slot Confirmation & Next Step Readiness Banner */}
                  {selectedSlot ? (
                    <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/80 space-y-2 animate-fadeIn">
                      <div className="flex items-center gap-2 text-xs font-semibold text-emerald-950">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span>
                          Selected Slot: {new Date(selectedSlot.start).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          })}{' '}
                          at {formatTime(selectedSlot.start)} – {formatTime(selectedSlot.end)}
                        </span>
                      </div>
                      <p className="text-[11px] text-emerald-900/80 leading-relaxed">
                        Your time slot is selected and ready. In Step 4, you will provide basic contact information and finalize the booking.
                      </p>
                      <div className="pt-1">
                        <button
                          type="button"
                          disabled
                          className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 text-white text-xs font-medium opacity-90 cursor-default flex items-center justify-center gap-2"
                        >
                          <span>Slot Selected &bull; Ready for Details & Payment (Step 4)</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-[#FAFAF8] border border-[#132A24]/5 rounded-xl text-center text-xs text-[#132A24]/50">
                      Click any available slot above to select your preferred consultation time.
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
