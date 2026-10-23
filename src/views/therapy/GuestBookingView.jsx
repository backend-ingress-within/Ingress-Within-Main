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
  CreditCard,
  Lock,
  Hourglass,
  ExternalLink,
  Mail,
} from 'lucide-react';

export default function GuestBookingView({ token }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingData, setBookingData] = useState(null);

  // Slot Selection State
  const [selectedDateKey, setSelectedDateKey] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Guest Details & Checkout State (Step 4)
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [clientNotes, setClientNotes] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [holdExpiresAt, setHoldExpiresAt] = useState(null);
  const [timeLeftStr, setTimeLeftStr] = useState('');
  const [idempotencyKey, setIdempotencyKey] = useState(
    () => `iw_hold_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
  );

  // Payment Verification & Confirmation State (Step 5)
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const [verificationError, setVerificationError] = useState(null);
  const [confirmedAppointment, setConfirmedAppointment] = useState(null);
  const [reconciliationNotice, setReconciliationNotice] = useState(null);
  const [lastPaymentPayload, setLastPaymentPayload] = useState(null);

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

  // Hold expiration countdown timer
  useEffect(() => {
    if (!holdExpiresAt || confirmedAppointment) return;
    const interval = setInterval(() => {
      const msLeft = new Date(holdExpiresAt).getTime() - Date.now();
      if (msLeft <= 0) {
        setTimeLeftStr('00:00');
        setOrderError('Your 15-minute slot hold has expired. Please select a time slot again to proceed.');
        setCreatedOrder(null);
        setHoldExpiresAt(null);
        clearInterval(interval);
      } else {
        const mins = Math.floor(msLeft / 60000);
        const secs = Math.floor((msLeft % 60000) / 1000);
        setTimeLeftStr(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [holdExpiresAt, confirmedAppointment]);

  // Reset order state when user picks a different slot
  const handleSelectSlot = (slot) => {
    if (selectedSlot?.start !== slot.start) {
      setSelectedSlot(slot);
      setCreatedOrder(null);
      setHoldExpiresAt(null);
      setOrderError(null);
      setVerificationError(null);
      setReconciliationNotice(null);
      // Fresh idempotency key for distinct slot attempts
      setIdempotencyKey(`iw_hold_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`);
    }
  };

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

  // Step 5: Verify Payment with Server
  const verifyPayment = async (paymentResponse, bookingId) => {
    setIsVerifyingPayment(true);
    setVerificationError(null);
    setLastPaymentPayload(paymentResponse);

    try {
      const res = await fetch(`/api/therapy/book/${encodeURIComponent(token)}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          razorpayPaymentId: paymentResponse.razorpay_payment_id,
          razorpayOrderId: paymentResponse.razorpay_order_id,
          razorpaySignature: paymentResponse.razorpay_signature,
          bookingId: bookingId || createdOrder?.bookingId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setVerificationError(data.error?.message || 'Payment verification failed. Please try again or contact support.');
        setIsVerifyingPayment(false);
        return;
      }

      if (data.requiresReconciliation) {
        setReconciliationNotice(data);
        setIsVerifyingPayment(false);
        return;
      }

      if (data.success && data.appointment) {
        setConfirmedAppointment(data.appointment);
        setCreatedOrder(null);
        setHoldExpiresAt(null);
      }
    } catch (err) {
      setVerificationError(err.message || 'Network error while verifying payment. Please retry.');
    } finally {
      setIsVerifyingPayment(false);
    }
  };

  // Launch Razorpay Modal
  const launchRazorpay = async (orderPayload) => {
    try {
      if (typeof window !== 'undefined' && !window.Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        await new Promise((resolve) => {
          script.onload = resolve;
        });
      }

      const options = {
        key: orderPayload.keyId,
        order_id: orderPayload.razorpayOrderId,
        amount: orderPayload.amountPaise,
        currency: orderPayload.currency || 'INR',
        name: 'Ingress Within',
        description: `Therapy Consultation with ${bookingData?.practitioner?.name || 'Practitioner'}`,
        prefill: {
          name: guestName.trim(),
          email: guestEmail.trim(),
          contact: guestPhone.trim(),
        },
        theme: { color: '#064e3b' },
        handler: async function (response) {
          await verifyPayment(response, orderPayload.bookingId);
        },
        modal: {
          ondismiss: function () {
            // Modal closed; hold remains active for 15 minutes
          },
        },
      };

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (resp) {
          setOrderError(resp.error?.description || 'Payment was declined or failed.');
        });
        rzp.open();
      }
    } catch (err) {
      console.warn('Razorpay checkout initialization notice:', err);
    }
  };

  // Submit Guest Order & Temporary Slot Hold
  const handleCreateOrder = async (e) => {
    if (e) e.preventDefault();
    if (!selectedSlot || isSubmittingOrder) return;

    setOrderError(null);
    setVerificationError(null);
    const errors = {};

    if (!guestName.trim() || guestName.trim().length < 2) {
      errors.name = 'Please provide your full name (at least 2 characters).';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!guestEmail.trim() || !emailRegex.test(guestEmail.trim())) {
      errors.email = 'Please provide a valid email address.';
    }
    const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;
    if (!guestPhone.trim() || !phoneRegex.test(guestPhone.trim())) {
      errors.phone = 'Please provide a valid phone number (at least 7 digits).';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setIsSubmittingOrder(true);

    try {
      const res = await fetch(`/api/therapy/book/${encodeURIComponent(token)}/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKey,
        },
        body: JSON.stringify({
          fullName: guestName.trim(),
          email: guestEmail.trim(),
          phoneNumber: guestPhone.trim(),
          slotStart: selectedSlot.start,
          slotEnd: selectedSlot.end,
          clientNotes: clientNotes.trim() || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setOrderError(data.error?.message || 'Unable to reserve slot. Please select another time or retry.');
        setIsSubmittingOrder(false);
        return;
      }

      const orderData = data.order;
      setCreatedOrder(orderData);
      setHoldExpiresAt(orderData.expiresAt);

      // Check if test bypass order was generated
      if (orderData.razorpayOrderId?.startsWith('order_test_bypass_')) {
        await verifyPayment(
          {
            razorpay_payment_id: `pay_test_bypass_${Date.now()}`,
            razorpay_order_id: orderData.razorpayOrderId,
            razorpay_signature: 'test_bypass_signature',
          },
          orderData.bookingId
        );
        return;
      }

      // Open Razorpay Checkout modal
      await launchRazorpay(orderData);
    } catch (err) {
      setOrderError(err.message || 'Network error while reserving slot. Please try again.');
    } finally {
      setIsSubmittingOrder(false);
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

  // 3. Post-Payment State: Booking Confirmed (Step 5)
  if (confirmedAppointment) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] text-[#132A24] font-sans antialiased">
        <header className="border-b border-[#132A24]/10 bg-white/80 backdrop-blur-md sticky top-0 z-40">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <span className="font-serif text-lg tracking-tight font-medium text-[#132A24]">
              Ingress Within
            </span>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium">
              Booking Confirmed
            </span>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
          <div className="bg-white border border-[#132A24]/10 rounded-2xl p-8 shadow-xs space-y-6 text-center animate-fadeIn">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h1 className="text-2xl font-serif font-medium text-[#132A24]">
                Your Consultation is Confirmed
              </h1>
              <p className="text-xs text-[#132A24]/70 mt-1.5 max-w-md mx-auto leading-relaxed">
                Thank you, {guestName || 'Valued Client'}. Your session with {practitioner.name} has been securely scheduled and your payment verified.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#FAFAF8] border border-[#132A24]/10 text-left space-y-3">
              <div className="flex justify-between items-center border-b border-[#132A24]/5 pb-3">
                <span className="text-xs font-semibold text-[#132A24]">Booking Reference</span>
                <span className="font-mono text-xs font-bold text-emerald-800">
                  {confirmedAppointment.bookingReference}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                <div>
                  <span className="text-[11px] text-[#132A24]/50 block">Practitioner</span>
                  <span className="font-medium text-[#132A24]">{practitioner.name}</span>
                  <span className="text-[11px] text-[#4E7A66] block">{practitioner.title}</span>
                </div>
                <div>
                  <span className="text-[11px] text-[#132A24]/50 block">Date &amp; Time</span>
                  <span className="font-medium text-[#132A24]">
                    {new Date(confirmedAppointment.scheduledStart).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <span className="text-[11px] text-[#132A24]/70 block">
                    {formatTime(confirmedAppointment.scheduledStart)} – {formatTime(confirmedAppointment.scheduledEnd)} ({availability?.timezone || 'IST'})
                  </span>
                </div>
              </div>

              {confirmedAppointment.googleMeetUrl && (
                <div className="pt-3 border-t border-[#132A24]/5">
                  <a
                    href={confirmedAppointment.googleMeetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Video className="w-4 h-4" />
                    <span>Join Video Session (Google Meet)</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-70" />
                  </a>
                </div>
              )}
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/60 text-xs text-emerald-900 flex items-center gap-2.5 text-left">
              <Mail className="w-4 h-4 text-emerald-700 shrink-0" />
              <p className="text-[11px] leading-relaxed">
                A calendar invitation with meeting details and an official payment receipt have been sent to <strong>{guestEmail || 'your email'}</strong>.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setConfirmedAppointment(null);
                  setSelectedSlot(null);
                  fetchBookingData();
                }}
                className="text-xs text-[#4E7A66] hover:text-[#132A24] underline transition-colors cursor-pointer"
              >
                Schedule another consultation
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // 4. Post-Payment State: Reconciliation Required (Step 5 Late-Payment Edge Case)
  if (reconciliationNotice) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] text-[#132A24] font-sans antialiased">
        <header className="border-b border-[#132A24]/10 bg-white/80 backdrop-blur-md sticky top-0 z-40">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <span className="font-serif text-lg tracking-tight font-medium text-[#132A24]">
              Ingress Within
            </span>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-medium">
              Review Required
            </span>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
          <div className="bg-white border border-amber-200 rounded-2xl p-8 shadow-xs space-y-6 text-center animate-fadeIn">
            <div className="w-16 h-16 mx-auto rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <AlertCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-serif font-medium text-[#132A24]">
                Payment Received — Booking Under Review
              </h1>
              <p className="text-xs text-[#132A24]/80 max-w-md mx-auto leading-relaxed">
                {reconciliationNotice.message || 'Your payment was successfully received, but your selected time slot is no longer available. Our care team has been notified to reschedule your session or issue an immediate full refund.'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#FAFAF8] border border-[#132A24]/10 text-xs text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-[#132A24]/60">Booking Reference:</span>
                <span className="font-mono font-semibold">{reconciliationNotice.booking?.bookingReference || 'Pending'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#132A24]/60">Payment Status:</span>
                <span className="text-emerald-700 font-medium">Paid (Securely Recorded)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#132A24]/60">Support Contact:</span>
                <a href="mailto:support@ingresswithin.com" className="text-[#4E7A66] underline">
                  support@ingresswithin.com
                </a>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setReconciliationNotice(null);
                  setSelectedSlot(null);
                  fetchBookingData();
                }}
                className="w-full py-2.5 px-4 bg-[#132A24] hover:bg-[#132A24]/90 text-white text-xs font-medium rounded-xl transition-colors cursor-pointer"
              >
                Choose Another Available Slot
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#132A24] font-sans antialiased">
      {/* Verification Overlay */}
      {isVerifyingPayment && (
        <div className="fixed inset-0 z-50 bg-[#132A24]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#132A24]/10 rounded-2xl p-6 max-w-sm w-full shadow-lg text-center space-y-4 animate-scaleUp">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-800">
              <RefreshCw className="w-6 h-6 animate-spin" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#132A24]">
                Verifying Payment &amp; Scheduling Session
              </h3>
              <p className="text-xs text-[#132A24]/60 mt-1">
                Please keep this window open while we authenticate your transaction and configure your Google Meet invite...
              </p>
            </div>
          </div>
        </div>
      )}

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
            <span>Private &amp; Confidential</span>
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
                  <span>Total Payable:</span>
                  <span className="text-emerald-800">
                    ₹{pricing.totalInr.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-[#FAFAF8] rounded-xl border border-[#132A24]/5 space-y-1.5 text-[11px] text-[#132A24]/60">
                <div className="flex items-center gap-1.5 text-[#132A24]/80 font-medium">
                  <Clock className="w-3.5 h-3.5 text-[#4E7A66]" />
                  <span>Timezone Display</span>
                </div>
                <p>
                  All times shown in your local timezone ({availability?.timezone || 'IST'}).
                </p>
              </div>

              {practitioner.instructions && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-[#132A24]/80 space-y-1">
                  <strong className="block text-amber-950 font-medium">
                    Practitioner Booking Instructions
                  </strong>
                  <p>{practitioner.instructions}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Slot Selection & Guest Checkout (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-[#132A24]/10 rounded-2xl p-6 shadow-xs space-y-6">
              <div>
                <h2 className="font-serif text-lg font-medium text-[#132A24]">
                  Select Consultation Time
                </h2>
                <p className="text-xs text-[#132A24]/60 mt-0.5">
                  Choose a date and time slot for your session with {practitioner.name}.
                </p>
              </div>

              {dateKeys.length === 0 ? (
                <div className="p-8 text-center bg-[#FAFAF8] rounded-xl border border-[#132A24]/5 space-y-2">
                  <CalendarIcon className="w-8 h-8 mx-auto text-[#132A24]/30" />
                  <h3 className="text-sm font-medium text-[#132A24]">No Open Consultation Slots</h3>
                  <p className="text-xs text-[#132A24]/60 max-w-sm mx-auto">
                    The practitioner has no bookable slots in the next two weeks. Please check back later or contact your therapist directly.
                  </p>
                </div>
              ) : (
                <>
                  {/* Date Selector Carousel / List */}
                  <div>
                    <span className="text-[11px] font-semibold text-[#132A24]/60 uppercase tracking-wider block mb-2">
                      Available Dates
                    </span>
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
                      {dateKeys.map((dateKey) => {
                        const isSelected = selectedDateKey === dateKey;
                        const count = groupedSlots[dateKey]?.length || 0;
                        return (
                          <button
                            key={dateKey}
                            type="button"
                            onClick={() => setSelectedDateKey(dateKey)}
                            aria-pressed={isSelected}
                            className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all border shrink-0 cursor-pointer flex flex-col items-center ${
                              isSelected
                                ? 'bg-[#132A24] text-white border-[#132A24] shadow-xs'
                                : 'bg-[#FAFAF8] text-[#132A24]/80 border-[#132A24]/10 hover:border-[#132A24]/30'
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
                            onClick={() => handleSelectSlot(slot)}
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

                  {/* Step 4 & 5: Guest Contact Details & Temporary Slot Hold Checkout */}
                  {selectedSlot ? (
                    <div className="pt-4 border-t border-[#132A24]/10 space-y-4 animate-fadeIn">
                      {/* Selected Slot Summary Card */}
                      <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                          <div>
                            <span className="text-xs font-semibold text-emerald-950 block">
                              {new Date(selectedSlot.start).toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                              })}{' '}
                              at {formatTime(selectedSlot.start)} – {formatTime(selectedSlot.end)}
                            </span>
                            <span className="text-[11px] text-emerald-900/70">
                              {session.durationMinutes} mins &bull; Telehealth Video Consultation
                            </span>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-emerald-800">
                          ₹{pricing.totalInr.toLocaleString('en-IN')}
                        </span>
                      </div>

                      {/* Active Slot Hold Banner (if hold already acquired) */}
                      {createdOrder && (
                        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
                          <div className="flex items-center justify-between text-xs font-semibold text-amber-950">
                            <div className="flex items-center gap-2">
                              <Hourglass className="w-4 h-4 text-amber-700 animate-pulse" />
                              <span>Temporary Slot Hold Active</span>
                            </div>
                            <span className="px-2 py-0.5 rounded-md bg-amber-200/70 font-mono text-amber-900 text-[11px]">
                              {timeLeftStr || '15:00'} remaining
                            </span>
                          </div>
                          <p className="text-[11px] text-amber-900/80 leading-relaxed">
                            This time slot is temporarily reserved for you for 15 minutes while payment is completed.
                          </p>
                          <div className="pt-2 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => launchRazorpay(createdOrder)}
                              className="w-full py-2.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                            >
                              <CreditCard className="w-4 h-4" />
                              <span>Re-open Razorpay Checkout</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Verification Error Display with Safe Retry Button */}
                      {verificationError && (
                        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 space-y-2 text-xs text-red-900">
                          <div className="flex items-start gap-2.5">
                            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                            <div className="space-y-1">
                              <span className="font-semibold block">Verification Notice</span>
                              <p>{verificationError}</p>
                            </div>
                          </div>
                          {lastPaymentPayload && (
                            <button
                              type="button"
                              onClick={() => verifyPayment(lastPaymentPayload, createdOrder?.bookingId)}
                              className="py-1.5 px-3 rounded-lg bg-red-800 text-white text-[11px] font-medium hover:bg-red-900 transition-colors cursor-pointer"
                            >
                              Retry Verification
                            </button>
                          )}
                        </div>
                      )}

                      {/* Order / Checkout Error Display */}
                      {orderError && (
                        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-900">
                          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                          <div className="space-y-1">
                            <span className="font-semibold block">Checkout Notice</span>
                            <p>{orderError}</p>
                          </div>
                        </div>
                      )}

                      {/* Guest Details Form */}
                      {!createdOrder && (
                        <form onSubmit={handleCreateOrder} className="space-y-3.5" noValidate>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {/* Full Name */}
                            <div>
                              <label
                                htmlFor="guest-name"
                                className="block text-[11px] font-semibold text-[#132A24]/70 uppercase tracking-wider mb-1"
                              >
                                Full Name <span className="text-red-500">*</span>
                              </label>
                              <input
                                id="guest-name"
                                type="text"
                                value={guestName}
                                onChange={(e) => setGuestName(e.target.value)}
                                placeholder="Your full name"
                                required
                                disabled={isSubmittingOrder}
                                className={`w-full px-3 py-2 text-xs rounded-xl border bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-700 transition-colors ${
                                  formErrors.name
                                    ? 'border-red-400 bg-red-50/20'
                                    : 'border-[#132A24]/15'
                                }`}
                              />
                              {formErrors.name && (
                                <p className="text-[10px] text-red-600 mt-1">{formErrors.name}</p>
                              )}
                            </div>

                            {/* Email Address */}
                            <div>
                              <label
                                htmlFor="guest-email"
                                className="block text-[11px] font-semibold text-[#132A24]/70 uppercase tracking-wider mb-1"
                              >
                                Email Address <span className="text-red-500">*</span>
                              </label>
                              <input
                                id="guest-email"
                                type="email"
                                value={guestEmail}
                                onChange={(e) => setGuestEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                disabled={isSubmittingOrder}
                                className={`w-full px-3 py-2 text-xs rounded-xl border bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-700 transition-colors ${
                                  formErrors.email
                                    ? 'border-red-400 bg-red-50/20'
                                    : 'border-[#132A24]/15'
                                }`}
                              />
                              {formErrors.email && (
                                <p className="text-[10px] text-red-600 mt-1">{formErrors.email}</p>
                              )}
                            </div>
                          </div>

                          {/* Phone Number */}
                          <div>
                            <label
                              htmlFor="guest-phone"
                              className="block text-[11px] font-semibold text-[#132A24]/70 uppercase tracking-wider mb-1"
                            >
                              Phone Number <span className="text-red-500">*</span>
                            </label>
                            <input
                              id="guest-phone"
                              type="tel"
                              value={guestPhone}
                              onChange={(e) => setGuestPhone(e.target.value)}
                              placeholder="+91 98765 43210"
                              required
                              disabled={isSubmittingOrder}
                              className={`w-full px-3 py-2 text-xs rounded-xl border bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-700 transition-colors ${
                                formErrors.phone
                                  ? 'border-red-400 bg-red-50/20'
                                  : 'border-[#132A24]/15'
                              }`}
                            />
                            {formErrors.phone && (
                              <p className="text-[10px] text-red-600 mt-1">{formErrors.phone}</p>
                            )}
                          </div>

                          {/* Client Notes (Optional) */}
                          <div>
                            <label
                              htmlFor="guest-notes"
                              className="block text-[11px] font-semibold text-[#132A24]/70 uppercase tracking-wider mb-1"
                            >
                              Session Notes <span className="text-[#132A24]/40 font-normal">(Optional)</span>
                            </label>
                            <textarea
                              id="guest-notes"
                              value={clientNotes}
                              onChange={(e) => setClientNotes(e.target.value)}
                              placeholder="Any specific topic or focus you would like to discuss..."
                              rows={2}
                              maxLength={1000}
                              disabled={isSubmittingOrder}
                              className="w-full px-3 py-2 text-xs rounded-xl border border-[#132A24]/15 bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-700 transition-colors"
                            />
                          </div>

                          <div className="pt-2">
                            <button
                              type="submit"
                              disabled={isSubmittingOrder}
                              className={`w-full py-3 px-4 rounded-xl text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs ${
                                isSubmittingOrder
                                  ? 'bg-emerald-800/70 cursor-wait'
                                  : 'bg-emerald-800 hover:bg-emerald-900'
                              }`}
                            >
                              {isSubmittingOrder ? (
                                <>
                                  <RefreshCw className="w-4 h-4 animate-spin" />
                                  <span>Reserving 15-Minute Slot Hold...</span>
                                </>
                              ) : (
                                <>
                                  <Lock className="w-4 h-4" />
                                  <span>
                                    Reserve Slot &amp; Pay ₹{pricing.totalInr.toLocaleString('en-IN')}
                                  </span>
                                  <ChevronRight className="w-4 h-4 ml-1" />
                                </>
                              )}
                            </button>
                          </div>

                          <p className="text-[10px] text-[#132A24]/50 text-center flex items-center justify-center gap-1.5 pt-1">
                            <Shield className="w-3 h-3 text-[#4E7A66]" />
                            <span>15-minute temporary slot hold created automatically upon checkout initiation.</span>
                          </p>
                        </form>
                      )}
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
