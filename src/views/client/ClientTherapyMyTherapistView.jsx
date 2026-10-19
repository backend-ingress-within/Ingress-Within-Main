import React, { useState, useEffect, useRef } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Award,
  Languages,
  MapPin,
  CreditCard,
  CalendarCheck,
  Info,
  ChevronRight,
  HeartHandshake,
  Sparkles,
  ArrowRight,
  X,
  Lock,
  FileText,
  MessageCircle,
  Smartphone,
  KeyRound,
} from 'lucide-react';

/**
 * Step 3: My Therapist View
 *
 * Implements authoritative relationship rendering:
 * 1. Connected: Assigned therapist's client-visible profile, credentials, specializations, rate, booking and session navigation.
 * 2. Pending: Transparent display of matching/intake review status, submitted preferences, and coordinator actions.
 * 3. No Connection: Clear, dignified entry paths (Guided Match, Direct Directory, Care Coordinator).
 * 4. Historical: Unambiguous archived relationship state with past care dates, preserved records, and rematch CTAs.
 * 5. Loading & Errors: Live spinners and recoverable error states with retry actions.
 */
export default function ClientTherapyMyTherapistView({
  initialTherapist = null,
  initialRelationship = null,
  initialStatus = null,
  isPastRelationship = false,
  pendingRequest: initialPendingRequest = null,
  history: initialHistory = [],
  onStartBooking,
  onNavigateSessions,
  onStartRematch,
  onNavigateSupport,
  onRefresh,
}) {
  const [connectionData, setConnectionData] = useState({
    status: isPastRelationship
      ? 'ended'
      : initialStatus || (initialTherapist ? 'connected' : 'no_therapist'),
    relationship: initialRelationship,
    therapist: initialTherapist,
    pendingRequest: initialPendingRequest,
    history: initialHistory,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Transition Modal State (Change Therapist or Quit Therapy)
  const [transitionModal, setTransitionModal] = useState({
    isOpen: false,
    action: 'change', // 'change' | 'quit'
    step: 1, // 1: Reason & feedback, 2: OTP verification
  });
  const [transitionReason, setTransitionReason] = useState('fit');
  const [transitionNotes, setTransitionNotes] = useState('');
  const [maskedPhone, setMaskedPhone] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [otpCooldown, setOtpCooldown] = useState(0);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isSubmittingTransition, setIsSubmittingTransition] = useState(false);
  const [transitionError, setTransitionError] = useState(null);
  const [transitionSuccess, setTransitionSuccess] = useState(null);
  const otpInputRefs = useRef([]);

  // Available therapists for post-change clinician selection
  const [availableTherapists, setAvailableTherapists] = useState([]);
  const [loadingTherapists, setLoadingTherapists] = useState(false);
  const [therapistsError, setTherapistsError] = useState(null);

  const fetchAvailableTherapists = async () => {
    setLoadingTherapists(true);
    setTherapistsError(null);
    try {
      const res = await fetch('/api/therapy/therapists');
      if (res.ok) {
        const data = await res.json();
        const currentId = connectionData?.therapist?.id;
        const filtered = (data.therapists || []).filter(
          (t) => !currentId || String(t.id) !== String(currentId)
        );
        setAvailableTherapists(filtered);
      } else {
        setTherapistsError('Unable to load available therapists.');
      }
    } catch (err) {
      setTherapistsError('Network error loading therapists.');
    } finally {
      setLoadingTherapists(false);
    }
  };

  // Resend OTP countdown
  useEffect(() => {
    let timer;
    if (otpCooldown > 0) {
      timer = setInterval(() => {
        setOtpCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [otpCooldown]);

  const openTransitionModal = (action = 'change') => {
    setTransitionModal({
      isOpen: true,
      action,
      step: 1,
    });
    setTransitionReason(action === 'change' ? 'fit' : 'goals_reached');
    setTransitionNotes('');
    setOtpDigits(['', '', '', '', '', '']);
    setTransitionError(null);
    setTransitionSuccess(null);
  };

  // Backwards-compatible alias for Step 3 reassignment modal
  const setShowReassignModal = (open) => {
    if (open) openTransitionModal('change');
    else closeTransitionModal();
  };

  const closeTransitionModal = () => {
    setTransitionModal({ isOpen: false, action: 'change', step: 1 });
    setTransitionError(null);
    setTransitionSuccess(null);
    setOtpDigits(['', '', '', '', '', '']);
  };

  const handleRequestOtp = async () => {
    setTransitionError(null);
    setIsSendingOtp(true);
    try {
      const res = await fetch('/api/therapy/client/relationship/send-otp', {
        method: 'POST',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMaskedPhone(data.maskedPhone || 'your registered number');
        setOtpCooldown(data.resendInSeconds || 30);
        setOtpDigits(['', '', '', '', '', '']);
        setTransitionModal((prev) => ({ ...prev, step: 2 }));
        setTimeout(() => {
          otpInputRefs.current[0]?.focus();
        }, 80);
      } else {
        setTransitionError(data.error?.message || 'Failed to send verification code. Please try again.');
      }
    } catch (err) {
      setTransitionError('Network error while requesting verification code. Please check your connection.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleOtpDigitChange = (index, val) => {
    const clean = val.replace(/\D/g, '');
    if (!clean) {
      const next = [...otpDigits];
      next[index] = '';
      setOtpDigits(next);
      return;
    }

    if (clean.length > 1) {
      const pasted = clean.slice(0, 6).split('');
      const next = [...otpDigits];
      pasted.forEach((ch, idx) => {
        if (idx < 6) next[idx] = ch;
      });
      setOtpDigits(next);
      const focusIdx = Math.min(pasted.length, 5);
      otpInputRefs.current[focusIdx]?.focus();
      return;
    }

    const next = [...otpDigits];
    next[index] = clean.slice(-1);
    setOtpDigits(next);
    setTransitionError(null);

    if (index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      const next = [...otpDigits];
      next[index - 1] = '';
      setOtpDigits(next);
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleConfirmTransition = async () => {
    const code = otpDigits.join('').trim();
    if (code.length !== 6 || !/^\d{6}$/.test(code)) {
      setTransitionError('Please enter the complete 6-digit verification code.');
      return;
    }

    setTransitionError(null);
    setIsSubmittingTransition(true);

    try {
      const res = await fetch('/api/therapy/client/relationship/transition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: transitionModal.action,
          otpCode: code,
          reason: transitionReason,
          notes: transitionNotes,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setTransitionSuccess(data.message);
        if (transitionModal.action === 'change') {
          // Immediately load other available therapists with their full details and proceed to Step 3
          await fetchAvailableTherapists();
          setTransitionModal((prev) => ({ ...prev, step: 3 }));
          await fetchTherapistDetails();
          if (onRefresh) onRefresh();
        } else {
          // For quit: conclude care and take client to the matching engine
          setTimeout(async () => {
            closeTransitionModal();
            await fetchTherapistDetails();
            if (onRefresh) onRefresh();
            if (onStartRematch) {
              // Continue to Rematch Intake / Matching Engine
              onStartRematch('guided');
            }
          }, 900);
        }
      } else {
        setTransitionError(data.error?.message || 'Verification failed. Please check the code and try again.');
      }
    } catch (err) {
      setTransitionError('Network error while processing transition. Please try again.');
    } finally {
      setIsSubmittingTransition(false);
    }
  };

  // Fetch authoritative connection details from the dedicated Step 3 endpoint
  const fetchTherapistDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/therapy/client/therapist');
      if (res.ok) {
        const json = await res.json();
        setConnectionData({
          status: isPastRelationship ? 'ended' : json.status || 'no_therapist',
          relationship: json.relationship || null,
          therapist: json.therapist || null,
          pendingRequest: json.pendingRequest || null,
          history: json.history || [],
        });
      } else {
        const errJson = await res.json().catch(() => ({}));
        setError(errJson.error?.message || 'Unable to load therapist relationship details.');
      }
    } catch (err) {
      console.warn('[MyTherapistView] Fetch error:', err);
      setError('Network error loading clinician details. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // If not provided initially, fetch fresh data
    if (!initialTherapist && !initialPendingRequest) {
      fetchTherapistDetails();
    }
  }, []);

  const handleRefresh = async () => {
    await fetchTherapistDetails();
    if (onRefresh) {
      onRefresh();
    }
  };

  const status = connectionData.status;
  const therapist = connectionData.therapist;
  const relationship = connectionData.relationship;
  const pendingRequest = connectionData.pendingRequest;
  const historyList = connectionData.history || [];

  const clinicianName =
    therapist?.displayName || therapist?.name || therapist?.full_name || 'Assigned Clinician';
  const clinicianTitle = therapist?.title || therapist?.credentials || 'Consultant Psychologist';

  // Format dates
  const formatCareDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  // =========================================================================
  // 1. LOADING STATE
  // =========================================================================
  if (loading && !therapist && !pendingRequest) {
    return (
      <div className="bg-white border border-[#263238]/10 rounded-2xl p-12 text-center space-y-4 shadow-2xs">
        <div className="w-10 h-10 border-3 border-[#132A24] border-t-transparent rounded-full animate-spin mx-auto" />
        <h3 className="font-serif text-lg text-[#132A24]">Loading your care relationship...</h3>
        <p className="text-xs text-[#66747A] max-w-sm mx-auto">
          Confirming authoritative clinical assignment and practitioner credentials.
        </p>
      </div>
    );
  }

  // =========================================================================
  // 2. ERROR STATE
  // =========================================================================
  if (error && !therapist && !pendingRequest) {
    return (
      <div className="bg-white border border-red-200 rounded-2xl p-8 sm:p-10 space-y-4 shadow-2xs text-center max-w-xl mx-auto">
        <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
          <AlertCircle size={24} />
        </div>
        <h3 className="font-serif text-xl text-[#132A24]">Unable to Load Therapist Details</h3>
        <p className="text-xs sm:text-sm text-[#66747A] leading-relaxed">{error}</p>
        <button
          type="button"
          onClick={handleRefresh}
          className="inline-flex items-center gap-2 bg-[#132A24] text-white hover:bg-[#1C3E35] px-5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-2xs"
        >
          <RefreshCw size={14} /> Try Again
        </button>
      </div>
    );
  }

  // =========================================================================
  // 3. PENDING STATE (Intake Under Review / Matching In Progress)
  // =========================================================================
  if (status === 'pending' || (pendingRequest && !therapist)) {
    const concerns = pendingRequest?.concerns || [];
    const submittedDate = formatCareDate(pendingRequest?.submittedAt);
    const requestedName = pendingRequest?.requestedTherapistName;
    const requestedTitle = pendingRequest?.requestedTherapistTitle;
    const requestedImage = pendingRequest?.requestedTherapistImage;

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#263238]/10 pb-4">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-bold text-amber-800">
              Clinical Matching In Progress
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl text-[#132A24] mt-1">My Therapist</h1>
            <p className="text-xs text-[#66747A] mt-1">
              Your care preferences are currently being reviewed by our clinical coordinator.
            </p>
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#263238]/10 text-xs font-medium text-[#263238] hover:bg-[#FAF9F7] transition-all cursor-pointer"
            aria-label="Refresh matching status"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            <span>Check Status</span>
          </button>
        </div>

        <div className="bg-white border border-[#263238]/10 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
              <Clock size={13} className="text-amber-700" /> Matching in Progress · Under Review
            </span>
            {submittedDate && (
              <span className="text-xs text-[#66747A]">Submitted {submittedDate}</span>
            )}
          </div>

          <div>
            <h2 className="font-serif text-2xl text-[#132A24]">
              Finding the Right Clinical Match for You
            </h2>
            <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed mt-2 max-w-2xl">
              Our clinical care coordinator is reviewing your intake to match you with a vetted,
              licensed practitioner aligned with your presenting concerns, clinical modalities, and
              schedule.
            </p>
          </div>

          {requestedName && (
            <div className="p-4 rounded-xl bg-[#FAF9F7] border border-[#263238]/8 flex items-center gap-4">
              {requestedImage ? (
                <img
                  src={requestedImage}
                  alt={requestedName}
                  className="w-12 h-12 rounded-xl object-cover border border-[#263238]/10 shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-[#132A24] text-white flex items-center justify-center font-serif text-lg shrink-0">
                  {requestedName.charAt(0)}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#66747A] block">
                  Requested Clinician
                </span>
                <strong className="text-sm text-[#132A24] font-medium block truncate">
                  {requestedName}
                </strong>
                {requestedTitle && <span className="text-xs text-[#66747A]">{requestedTitle}</span>}
              </div>
            </div>
          )}

          {concerns.length > 0 && (
            <div className="p-4 rounded-xl bg-[#FAF9F7] border border-[#263238]/8 space-y-2">
              <span className="text-[11px] uppercase tracking-wider font-bold text-[#66747A]">
                Submitted Presenting Focus Areas
              </span>
              <div className="flex flex-wrap gap-1.5">
                {concerns.map((c, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-white border border-[#263238]/10 text-xs font-medium text-[#263238]"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Three-step timeline */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-[#FAF9F7] border border-[#263238]/8 space-y-1">
              <strong className="text-xs text-[#132A24] block">1. Clinical Review</strong>
              <p className="text-[11.5px] text-[#66747A] leading-relaxed">
                Licensure, modality alignment, and scope of practice are verified.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#FAF9F7] border border-[#263238]/8 space-y-1">
              <strong className="text-xs text-[#132A24] block">2. Availability Verification</strong>
              <p className="text-[11.5px] text-[#66747A] leading-relaxed">
                Real-time calendar openings are reserved for your preferred slots.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#FAF9F7] border border-[#263238]/8 space-y-1">
              <strong className="text-xs text-[#132A24] block">3. Direct Activation</strong>
              <p className="text-[11.5px] text-[#66747A] leading-relaxed">
                You receive an email and this portal updates automatically with your clinician.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-[#263238]/8">
            {onStartRematch && (
              <button
                type="button"
                onClick={onStartRematch}
                className="bg-[#132A24] text-white hover:bg-[#1C3E35] px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-2xs"
              >
                Update Intake Preferences
              </button>
            )}
            {onNavigateSupport && (
              <button
                type="button"
                onClick={onNavigateSupport}
                className="bg-white border border-[#263238]/15 text-[#263238] hover:bg-[#FAF9F7] px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer"
              >
                Speak with Care Coordinator
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 4. NO ACTIVE CONNECTION STATE
  // =========================================================================
  if (status === 'no_therapist' || !therapist) {
    return (
      <div className="space-y-6">
        <div className="border-b border-[#263238]/10 pb-4">
          <span className="text-[11px] uppercase tracking-wider font-bold text-[#66747A]">
            Mental Healthcare Portal
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#132A24] mt-1">My Therapist</h1>
          <p className="text-xs text-[#66747A] mt-1">
            Connect with a verified, licensed clinical psychologist tailored to your needs.
          </p>
        </div>

        <div className="bg-white border border-[#263238]/10 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gray-100 text-[#4A5568] text-[11px] font-semibold mb-3">
              No Active Clinician Connection
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#132A24]">
              Start Your Therapy Journey
            </h2>
            <p className="text-xs sm:text-sm text-[#66747A] leading-relaxed mt-2">
              Ingress Within matches you with licensed mental health practitioners based on your
              psychological baseline, therapeutic goals, and preferred schedule.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-5 rounded-xl bg-[#FAF9F7] border border-[#263238]/8 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
                  <Sparkles size={18} />
                </div>
                <h3 className="font-serif text-base text-[#132A24]">Guided Matching</h3>
                <p className="text-xs text-[#66747A] leading-relaxed">
                  Answer a few questions regarding your presenting concerns and clinical
                  preferences to receive a curated practitioner match.
                </p>
              </div>
              {onStartRematch && (
                <button
                  type="button"
                  onClick={onStartRematch}
                  className="w-full bg-[#132A24] text-white hover:bg-[#1C3E35] py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  Start Match Questionnaire <ArrowRight size={13} />
                </button>
              )}
            </div>

            <div className="p-5 rounded-xl bg-[#FAF9F7] border border-[#263238]/8 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
                  <CalendarIcon size={18} />
                </div>
                <h3 className="font-serif text-base text-[#132A24]">Clinician Directory</h3>
                <p className="text-xs text-[#66747A] leading-relaxed">
                  Browse approved clinicians, view professional bios and specialties, and book
                  directly into open calendar slots.
                </p>
              </div>
              {onStartBooking && (
                <button
                  type="button"
                  onClick={() => onStartBooking(null)}
                  className="w-full bg-white border border-[#263238]/15 text-[#263238] hover:bg-gray-50 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  Browse Directory <ArrowRight size={13} />
                </button>
              )}
            </div>

            <div className="p-5 rounded-xl bg-[#FAF9F7] border border-[#263238]/8 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
                  <HeartHandshake size={18} />
                </div>
                <h3 className="font-serif text-base text-[#132A24]">Care Coordination</h3>
                <p className="text-xs text-[#66747A] leading-relaxed">
                  Speak directly with our clinical triage coordinator to discuss specific clinical
                  needs or scheduling constraints.
                </p>
              </div>
              {onNavigateSupport && (
                <button
                  type="button"
                  onClick={onNavigateSupport}
                  className="w-full bg-white border border-[#263238]/15 text-[#263238] hover:bg-gray-50 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  Contact Care Team <ArrowRight size={13} />
                </button>
              )}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200/80 text-xs text-blue-900 flex items-start gap-3">
            <ShieldCheck size={16} className="shrink-0 text-blue-600 mt-0.5" />
            <p className="leading-relaxed">
              All Ingress Within clinicians are verified practitioners holding accredited master's
              or doctoral degrees in clinical psychology, supervised experience, and independent
              licensure.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 5. HISTORICAL RELATIONSHIP STATE
  // =========================================================================
  const isHistorical =
    isPastRelationship ||
    ['paused', 'ended', 'completed', 'terminated', 'transferred'].includes(status);

  if (isHistorical) {
    const statusLabel =
      status === 'paused' ? 'Paused' : status === 'transferred' ? 'Transferred' : 'Concluded';
    const startedDate = formatCareDate(relationship?.startedAt || relationship?.started_at);
    const endedDate = formatCareDate(relationship?.endedAt || relationship?.ended_at);

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#263238]/10 pb-4">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-bold text-amber-800">
              Care History Archive
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl text-[#132A24] mt-1">My Therapist</h1>
            <p className="text-xs text-[#66747A] mt-1">
              Archived clinical care records. This is not an active therapeutic relationship.
            </p>
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#263238]/10 text-xs font-medium text-[#263238] hover:bg-[#FAF9F7] transition-all cursor-pointer"
            aria-label="Refresh relationship history"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Distinct Historical Banner */}
        <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300/50">
                Relationship {statusLabel}
              </span>
              {(startedDate || endedDate) && (
                <span className="text-xs text-amber-800 font-medium">
                  Care Period: {startedDate || 'Start'} — {endedDate || 'Present'}
                </span>
              )}
            </div>
            <strong className="text-sm font-semibold text-amber-950 block">
              Care with {clinicianName} is currently {statusLabel.toLowerCase()}.
            </strong>
            <p className="text-xs text-amber-800/90 leading-relaxed">
              Your historical session notes, completed self-work, and invoices remain securely
              preserved in your account. You can request a new therapist at any time.
            </p>
          </div>

          {onStartRematch && (
            <button
              type="button"
              onClick={onStartRematch}
              className="shrink-0 bg-amber-900 text-white hover:bg-amber-950 px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-2xs cursor-pointer"
            >
              Find a New Therapist
            </button>
          )}
        </div>

        {/* Historical Clinician Profile Card */}
        <div className="bg-white border border-[#263238]/10 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {therapist?.profileImageUrl ? (
              <img
                src={therapist.profileImageUrl}
                alt={clinicianName}
                className="w-20 h-20 rounded-2xl object-cover border border-[#263238]/10 shrink-0 shadow-xs filter grayscale-[30%]"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-gray-700 text-white flex items-center justify-center font-serif text-2xl shrink-0">
                {clinicianName.replace(/^Dr\.?\s*/i, '').charAt(0)}
              </div>
            )}

            <div className="space-y-1 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-serif text-xl sm:text-2xl text-[#132A24] font-medium">
                  {clinicianName}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[11px] font-semibold border border-gray-200">
                  Past Clinician
                </span>
              </div>
              <p className="text-xs text-[#66747A]">{clinicianTitle}</p>
              {therapist?.qualification && (
                <p className="text-xs text-[#66747A] flex items-center gap-1 mt-1">
                  <Award size={13} className="text-gray-500" /> {therapist.qualification}
                </p>
              )}
            </div>
          </div>

          {therapist?.bio && (
            <div className="pt-4 border-t border-[#263238]/8 space-y-1.5">
              <span className="text-[11px] uppercase tracking-wider font-bold text-[#66747A]">
                Clinical Bio
              </span>
              <p className="text-xs text-[#66747A] leading-relaxed line-clamp-3">
                {therapist.bio}
              </p>
            </div>
          )}

          {/* Past Relationships History Archive */}
          {historyList.length > 0 && (
            <div className="pt-4 border-t border-[#263238]/8 space-y-3">
              <span className="text-[11px] uppercase tracking-wider font-bold text-[#66747A] block">
                Archived Care History ({historyList.length})
              </span>
              <div className="space-y-2">
                {historyList.map((h, i) => (
                  <div
                    key={h.relationshipId || i}
                    className="p-3 rounded-xl bg-[#FAF9F7] border border-[#263238]/8 flex items-center justify-between text-xs"
                  >
                    <div>
                      <strong className="text-[#132A24] font-medium">
                        {h.therapist?.name || 'Practitioner'}
                      </strong>
                      <span className="text-[#66747A] ml-2">
                        {formatCareDate(h.startedAt)} — {formatCareDate(h.endedAt) || 'Concluded'}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-gray-200 text-gray-700">
                      {h.status || 'Concluded'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // 6. CONNECTED STATE (Active Therapist)
  // =========================================================================
  const careStage = relationship?.careStage || relationship?.care_stage || 'Active Care';
  const startedAtDate = formatCareDate(relationship?.startedAt || relationship?.started_at);
  const sessionFee = therapist?.fee || therapist?.per_session_fee || 1500;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#263238]/10 pb-4">
        <div>
          <span className="text-[11px] uppercase tracking-wider font-bold text-emerald-800">
            Primary Care Clinician
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#132A24] mt-1">My Therapist</h1>
          <p className="text-xs text-[#66747A] mt-1">
            Your assigned licensed mental healthcare provider on Ingress Within.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#263238]/10 text-xs font-medium text-[#263238] hover:bg-[#FAF9F7] transition-all cursor-pointer"
            title="Refresh therapist status"
            aria-label="Refresh therapist profile"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white border border-[#263238]/10 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {therapist?.profileImageUrl ? (
            <img
              src={therapist.profileImageUrl}
              alt={clinicianName}
              className="w-24 h-24 rounded-2xl object-cover border border-[#263238]/10 shrink-0 shadow-xs"
            />
          ) : (
            <div className="w-24 h-24 rounded-2xl bg-[#132A24] text-white flex items-center justify-center font-serif text-3xl shrink-0 shadow-xs">
              {clinicianName.replace(/^Dr\.?\s*/i, '').charAt(0)}
            </div>
          )}

          <div className="space-y-2 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-serif text-2xl text-[#132A24] font-medium">{clinicianName}</h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold">
                <CheckCircle2 size={12} className="text-emerald-700" /> Verified Practitioner
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-[11px] font-semibold">
                ● Active Care Relationship
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#66747A]">{clinicianTitle}</p>

            <div className="flex flex-wrap items-center gap-3.5 text-xs text-[#66747A] pt-1">
              {therapist?.qualification && (
                <span className="flex items-center gap-1.5">
                  <Award size={13} className="text-emerald-700" />
                  <span>{therapist.qualification}</span>
                </span>
              )}
              {therapist?.experienceYears > 0 && (
                <span className="flex items-center gap-1.5">
                  <Clock size={13} className="text-gray-500" />
                  <span>{therapist.experienceYears}+ years experience</span>
                </span>
              )}
              {therapist?.city && (
                <span className="flex items-center gap-1.5">
                  <MapPin size={13} className="text-gray-500" />
                  <span>
                    {therapist.city}
                    {therapist.state ? `, ${therapist.state}` : ''}
                  </span>
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Video size={13} className="text-gray-500" />
                <span>Telehealth Video</span>
              </span>
              <span className="flex items-center gap-1.5 font-medium text-[#132A24]">
                <CreditCard size={13} className="text-emerald-700" />
                <span>₹{sessionFee} / session</span>
              </span>
              {startedAtDate && (
                <span className="flex items-center gap-1.5 text-emerald-900 bg-emerald-50/70 px-2 py-0.5 rounded">
                  <CalendarCheck size={13} className="text-emerald-700" />
                  <span>
                    Stage: {careStage} · Since {startedAtDate}
                  </span>
                </span>
              )}
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="shrink-0 pt-2 sm:pt-0 flex flex-col gap-2 w-full sm:w-auto">
            {onStartBooking && (
              <button
                type="button"
                onClick={() => onStartBooking(therapist)}
                className="w-full sm:w-auto bg-[#132A24] text-white hover:bg-[#1C3E35] px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-2xs cursor-pointer"
              >
                <CalendarIcon size={14} /> Book Consultation (₹{sessionFee})
              </button>
            )}
            {onNavigateSessions && (
              <button
                type="button"
                onClick={onNavigateSessions}
                className="w-full sm:w-auto bg-white border border-[#263238]/15 text-[#263238] hover:bg-[#FAF9F7] px-4 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Clock size={13} /> View Upcoming Sessions
              </button>
            )}
          </div>
        </div>

        {/* Bio & Approach */}
        {therapist?.bio && (
          <div className="pt-4 border-t border-[#263238]/8 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#132A24]">
              Clinical Bio &amp; Approach
            </h3>
            <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed whitespace-pre-line">
              {therapist.bio}
            </p>
          </div>
        )}

        {/* Specializations & Languages */}
        <div className="pt-4 border-t border-[#263238]/8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#132A24]">
              Specializations
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {(therapist?.specializations || []).length > 0 ? (
                therapist.specializations.map((spec) => (
                  <span
                    key={spec}
                    className="px-2.5 py-1 rounded-lg bg-[#FAF9F7] text-xs font-medium text-[#263238] border border-[#263238]/8"
                  >
                    {spec}
                  </span>
                ))
              ) : (
                <span className="text-xs text-gray-400">Clinical psychology &amp; counseling</span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#132A24]">Languages</h3>
            <div className="flex flex-wrap gap-1.5">
              {(therapist?.languages || ['English', 'Hindi']).map((lang) => (
                <span
                  key={lang}
                  className="px-2.5 py-1 rounded-lg bg-[#FAF9F7] text-xs font-medium text-[#263238] border border-[#263238]/8"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Confidentiality Notice */}
        <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200/80 text-xs text-blue-900 flex items-start gap-3">
          <Info size={16} className="shrink-0 text-blue-600 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold">Confidentiality &amp; Ethical Governance</p>
            <p className="text-blue-800/80 leading-relaxed">
              All consultations and communications are strictly protected under Ingress Within's
              healthcare governance. Your therapist's internal supervision case notes remain private
              to safeguard clinical integrity.
            </p>
          </div>
        </div>

        {/* Relationship Actions / Care Management Footer */}
        <div className="pt-5 border-t border-[#263238]/10 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#66747A]">
            <div className="space-y-0.5">
              <span className="font-semibold text-[#132A24] block">Care Relationship &amp; Autonomy</span>
              <span>
                Need a different clinical approach or wish to conclude care? You retain full autonomy with continuous history.
              </span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setShowReassignModal(true)}
                className="text-amber-800 hover:text-amber-950 font-medium underline underline-offset-2 shrink-0 cursor-pointer"
              >
                Change Therapist / Rematch
              </button>
              <span className="text-[#263238]/20">•</span>
              <button
                type="button"
                onClick={() => openTransitionModal('quit')}
                className="text-red-700 hover:text-red-900 font-medium underline underline-offset-2 shrink-0 cursor-pointer"
              >
                Quit Therapy
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RELATIONSHIP TRANSITION MODAL (OTP-GATED CHANGE & QUIT)                   */}
      {/* ========================================================================= */}
      {transitionModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-[#132A24]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`bg-white rounded-2xl border border-[#263238]/15 shadow-xl w-full p-6 sm:p-8 space-y-5 animate-in fade-in zoom-in-95 duration-150 ${
              transitionModal.step === 3 ? 'max-w-2xl max-h-[88vh] overflow-y-auto' : 'max-w-lg'
            }`}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div>
                <span
                  className={`text-[10.5px] uppercase font-bold tracking-wider ${
                    transitionModal.step === 3
                      ? 'text-emerald-800'
                      : transitionModal.action === 'change'
                      ? 'text-amber-800'
                      : 'text-red-800'
                  }`}
                >
                  {transitionModal.step === 3
                    ? 'Practitioner Selection'
                    : transitionModal.action === 'change'
                    ? 'Therapist Reassignment & Rematch'
                    : 'Conclude Therapy Care'}
                </span>
                <h3 className="font-serif text-xl text-[#132A24] mt-0.5">
                  {transitionModal.step === 1
                    ? transitionModal.action === 'change'
                      ? 'Requesting a Therapist Change'
                      : 'Conclude Your Therapy Cycle'
                    : transitionModal.step === 2
                    ? 'Verify with Security Code'
                    : 'Available Practitioners'}
                </h3>
              </div>
              <button
                type="button"
                onClick={closeTransitionModal}
                className="text-[#66747A] hover:text-[#132A24] p-1 rounded-lg"
                disabled={isSubmittingTransition}
              >
                <X size={18} />
              </button>
            </div>

            {/* Error & Success Banners */}
            {transitionError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2">
                <AlertCircle size={15} className="shrink-0 text-red-600 mt-0.5" />
                <span className="leading-relaxed">{transitionError}</span>
              </div>
            )}
            {transitionSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
                <CheckCircle2 size={15} className="shrink-0 text-emerald-600 mt-0.5" />
                <span className="leading-relaxed">{transitionSuccess}</span>
              </div>
            )}

            {/* STEP 1: Reason Selection & Guidance */}
            {transitionModal.step === 1 && (
              <div className="space-y-4">
                <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed">
                  {transitionModal.action === 'change'
                    ? "At Ingress Within, therapeutic rapport and personal comfort are paramount. If you feel your current practitioner isn't the right fit, our care coordination team ensures a supportive, seamless transition without losing your account history or completed intake."
                    : 'You have full autonomy over your therapeutic journey. If you wish to conclude or pause therapy, your previous consultations, reflections, and care milestones will remain securely archived for whenever you choose to resume.'}
                </p>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#132A24] block">
                    {transitionModal.action === 'change'
                      ? 'What is the primary reason for requesting a change?'
                      : 'What is the primary reason for concluding therapy?'}
                  </label>

                  <div className="space-y-1.5 text-xs text-[#263238]">
                    {transitionModal.action === 'change' ? (
                      <>
                        <label className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#FAF9F7] border border-[#263238]/8 cursor-pointer hover:bg-[#F4F1EC]/60 transition-colors">
                          <input
                            type="radio"
                            name="reassignReason"
                            value="fit"
                            checked={transitionReason === 'fit'}
                            onChange={(e) => setTransitionReason(e.target.value)}
                          />
                          <span>Personal fit / prefer a fresh clinical perspective</span>
                        </label>
                        <label className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#FAF9F7] border border-[#263238]/8 cursor-pointer hover:bg-[#F4F1EC]/60 transition-colors">
                          <input
                            type="radio"
                            name="reassignReason"
                            value="modality"
                            checked={transitionReason === 'modality'}
                            onChange={(e) => setTransitionReason(e.target.value)}
                          />
                          <span>Looking for a different therapeutic modality (e.g. CBT, psychodynamic)</span>
                        </label>
                        <label className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#FAF9F7] border border-[#263238]/8 cursor-pointer hover:bg-[#F4F1EC]/60 transition-colors">
                          <input
                            type="radio"
                            name="reassignReason"
                            value="availability"
                            checked={transitionReason === 'availability'}
                            onChange={(e) => setTransitionReason(e.target.value)}
                          />
                          <span>Scheduling or availability timing conflicts</span>
                        </label>
                        <label className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#FAF9F7] border border-[#263238]/8 cursor-pointer hover:bg-[#F4F1EC]/60 transition-colors">
                          <input
                            type="radio"
                            name="reassignReason"
                            value="other"
                            checked={transitionReason === 'other'}
                            onChange={(e) => setTransitionReason(e.target.value)}
                          />
                          <span>Other personal reason</span>
                        </label>
                      </>
                    ) : (
                      <>
                        <label className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#FAF9F7] border border-[#263238]/8 cursor-pointer hover:bg-[#F4F1EC]/60 transition-colors">
                          <input
                            type="radio"
                            name="transitionReason"
                            value="goals_reached"
                            checked={transitionReason === 'goals_reached'}
                            onChange={(e) => setTransitionReason(e.target.value)}
                          />
                          <span>Achieved my current therapy goals</span>
                        </label>
                        <label className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#FAF9F7] border border-[#263238]/8 cursor-pointer hover:bg-[#F4F1EC]/60 transition-colors">
                          <input
                            type="radio"
                            name="transitionReason"
                            value="taking_break"
                            checked={transitionReason === 'taking_break'}
                            onChange={(e) => setTransitionReason(e.target.value)}
                          />
                          <span>Taking a personal pause or break from therapy</span>
                        </label>
                        <label className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#FAF9F7] border border-[#263238]/8 cursor-pointer hover:bg-[#F4F1EC]/60 transition-colors">
                          <input
                            type="radio"
                            name="transitionReason"
                            value="schedule_or_cost"
                            checked={transitionReason === 'schedule_or_cost'}
                            onChange={(e) => setTransitionReason(e.target.value)}
                          />
                          <span>Scheduling constraints or financial pause</span>
                        </label>
                        <label className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#FAF9F7] border border-[#263238]/8 cursor-pointer hover:bg-[#F4F1EC]/60 transition-colors">
                          <input
                            type="radio"
                            name="transitionReason"
                            value="alternative_support"
                            checked={transitionReason === 'alternative_support'}
                            onChange={(e) => setTransitionReason(e.target.value)}
                          />
                          <span>Exploring alternative wellness resources</span>
                        </label>
                        <label className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#FAF9F7] border border-[#263238]/8 cursor-pointer hover:bg-[#F4F1EC]/60 transition-colors">
                          <input
                            type="radio"
                            name="transitionReason"
                            value="other"
                            checked={transitionReason === 'other'}
                            onChange={(e) => setTransitionReason(e.target.value)}
                          />
                          <span>Other personal reason</span>
                        </label>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#132A24] block">
                    Additional notes or feedback for our clinical care team (optional)
                  </label>
                  <textarea
                    rows={2}
                    value={transitionNotes}
                    onChange={(e) => setTransitionNotes(e.target.value)}
                    placeholder="Share any details that can help us support you better..."
                    className="w-full text-xs p-2.5 rounded-xl border border-[#263238]/15 focus:outline-hidden focus:border-[#132A24] text-[#263238] resize-none"
                  />
                </div>

                {/* Security Verification Notice */}
                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2.5">
                  <Lock size={15} className="shrink-0 text-amber-700 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong>Security Verification Required:</strong> To protect your therapy care
                    from accidental or unauthorized changes, a 6-digit OTP will be sent to your
                    registered phone number.
                  </p>
                </div>

                {/* Step 1 Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-3 border-t border-[#263238]/8">
                  <button
                    type="button"
                    onClick={closeTransitionModal}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold border border-[#263238]/15 text-[#263238] hover:bg-[#FAF9F7] transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleRequestOtp}
                    disabled={isSendingOtp}
                    className={`w-full sm:w-auto px-5 py-2 rounded-xl text-xs font-semibold text-white transition-all cursor-pointer shadow-2xs flex items-center justify-center gap-1.5 ${
                      transitionModal.action === 'change'
                        ? 'bg-[#132A24] hover:bg-[#1C3E35]'
                        : 'bg-red-800 hover:bg-red-900'
                    }`}
                  >
                    {isSendingOtp ? (
                      <>
                        <RefreshCw size={13} className="animate-spin" />
                        <span>Sending Code...</span>
                      </>
                    ) : (
                      <>
                        <span>Request OTP to Continue</span>
                        <ArrowRight size={13} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: OTP Verification & Final Execution */}
            {transitionModal.step === 2 && (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-xs text-emerald-950 flex items-start gap-2.5">
                  <Smartphone size={16} className="shrink-0 text-emerald-700 mt-0.5" />
                  <div>
                    <p className="font-semibold text-emerald-900">Verification Code Sent</p>
                    <p className="text-emerald-800 leading-relaxed mt-0.5">
                      Enter the 6-digit code sent to <strong>{maskedPhone || 'your registered mobile'}</strong>{' '}
                      to authorize {transitionModal.action === 'change' ? 'changing your therapist' : 'concluding therapy'}.
                    </p>
                  </div>
                </div>

                {/* 6-Digit Code Inputs */}
                <div className="space-y-2 py-2">
                  <label className="text-xs font-semibold text-[#132A24] block text-center">
                    Enter 6-Digit OTP Code
                  </label>
                  <div className="flex items-center justify-center gap-2">
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => (otpInputRefs.current[idx] = el)}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        className="w-11 h-12 text-center text-lg font-mono font-bold text-[#132A24] bg-[#FAF9F7] border border-[#263238]/20 rounded-xl focus:border-[#132A24] focus:bg-white focus:outline-hidden transition-all shadow-2xs"
                      />
                    ))}
                  </div>

                  {/* Resend Cooldown */}
                  <div className="text-center pt-1 text-xs text-[#66747A]">
                    {otpCooldown > 0 ? (
                      <span>Resend code in {otpCooldown}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleRequestOtp}
                        disabled={isSendingOtp}
                        className="text-[#132A24] font-semibold underline underline-offset-2 hover:text-emerald-800 cursor-pointer"
                      >
                        {isSendingOtp ? 'Sending...' : 'Didn’t receive code? Resend OTP'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Step 2 Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-3 border-t border-[#263238]/8">
                  <button
                    type="button"
                    onClick={() => setTransitionModal((prev) => ({ ...prev, step: 1 }))}
                    disabled={isSubmittingTransition}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold border border-[#263238]/15 text-[#263238] hover:bg-[#FAF9F7] transition-all cursor-pointer"
                  >
                    ← Back to Reason
                  </button>

                  <button
                    type="button"
                    onClick={handleConfirmTransition}
                    disabled={otpDigits.join('').trim().length !== 6 || isSubmittingTransition}
                    className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-semibold text-white transition-all cursor-pointer shadow-2xs flex items-center justify-center gap-1.5 ${
                      otpDigits.join('').trim().length !== 6 || isSubmittingTransition
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : transitionModal.action === 'change'
                        ? 'bg-[#132A24] hover:bg-[#1C3E35]'
                        : 'bg-red-800 hover:bg-red-900'
                    }`}
                  >
                    {isSubmittingTransition ? (
                      <>
                        <RefreshCw size={13} className="animate-spin" />
                        <span>Verifying &amp; Updating...</span>
                      </>
                    ) : (
                      <>
                        <KeyRound size={13} />
                        <span>
                          {transitionModal.action === 'change'
                            ? 'Verify & Change Therapist'
                            : 'Verify & Conclude Therapy'}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Available Therapists (Post-Change Clinician Selection) */}
            {transitionModal.step === 3 && (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-xs text-emerald-950 flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="shrink-0 text-emerald-700 mt-0.5" />
                  <div>
                    <p className="font-semibold text-emerald-900">Therapist Change Authorized</p>
                    <p className="text-emerald-800 leading-relaxed mt-0.5">
                      Your previous assignment has been updated. Explore other licensed practitioners below to book a consultation, or launch our guided matching engine.
                    </p>
                  </div>
                </div>

                {/* Guided Matching CTA Banner */}
                <div className="p-4 rounded-xl bg-[#FAF9F7] border border-[#263238]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-[#132A24] block">Prefer Algorithmic Matching?</span>
                    <span className="text-[#66747A]">Our clinical triage engine can recommend matches based on your updated focus.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      closeTransitionModal();
                      if (onStartRematch) onStartRematch('guided');
                    }}
                    className="bg-[#132A24] hover:bg-[#1C3E35] text-white font-semibold px-4 py-2 rounded-xl transition-all shadow-2xs shrink-0 cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Launch Matching Engine</span>
                    <ArrowRight size={13} />
                  </button>
                </div>

                {/* Available Therapists Cards */}
                <div className="space-y-3 pt-1">
                  <h4 className="font-serif text-base text-[#132A24] font-semibold flex items-center justify-between">
                    <span>Available Practitioners &amp; Modalities</span>
                    <span className="text-xs font-sans text-[#66747A] font-normal">
                      {availableTherapists.length} clinician{availableTherapists.length === 1 ? '' : 's'} available
                    </span>
                  </h4>

                  {loadingTherapists ? (
                    <div className="py-12 text-center space-y-2">
                      <div className="w-5 h-5 border-2 border-[#132A24] border-t-transparent rounded-full animate-spin mx-auto" />
                      <p className="text-xs text-[#66747A]">Loading available practitioners...</p>
                    </div>
                  ) : therapistsError ? (
                    <div className="p-4 rounded-xl bg-red-50 text-xs text-red-800 text-center space-y-2">
                      <p>{therapistsError}</p>
                      <button
                        type="button"
                        onClick={fetchAvailableTherapists}
                        className="text-[#132A24] font-semibold underline underline-offset-2 hover:text-emerald-800"
                      >
                        Retry Loading
                      </button>
                    </div>
                  ) : availableTherapists.length === 0 ? (
                    <div className="py-8 text-center space-y-3 bg-[#FAF9F7] rounded-xl border border-[#263238]/8 p-4">
                      <p className="text-xs text-[#66747A]">
                        No other practitioners currently available in open directory. You can launch our matching engine to request care coordination.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          closeTransitionModal();
                          if (onStartRematch) onStartRematch('guided');
                        }}
                        className="bg-[#132A24] text-white text-xs font-semibold px-4 py-2 rounded-xl"
                      >
                        Go to Matching Engine →
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                      {availableTherapists.map((t) => (
                        <div
                          key={t.id}
                          className="p-4 sm:p-5 rounded-xl bg-[#FAF9F7] border border-[#263238]/10 hover:border-[#132A24]/30 transition-all space-y-3"
                        >
                          <div className="flex items-start gap-3.5">
                            {t.profileImageUrl ? (
                              <img
                                src={t.profileImageUrl}
                                alt={t.displayName || t.name}
                                className="w-13 h-13 rounded-xl object-cover border border-[#263238]/10 shrink-0"
                              />
                            ) : (
                              <div className="w-13 h-13 rounded-xl bg-[#132A24] text-white flex items-center justify-center font-serif text-lg shrink-0">
                                {(t.displayName || t.name || 'T').charAt(0)}
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h5 className="font-serif text-base text-[#132A24] font-semibold truncate">
                                  {t.displayName || t.name}
                                </h5>
                                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1">
                                  <ShieldCheck size={11} /> Verified
                                </span>
                              </div>
                              <p className="text-xs text-[#66747A] mt-0.5">
                                {t.credentials || t.title || 'Consultant Psychologist'}
                                {t.experienceYears ? ` · ${t.experienceYears}+ yrs experience` : ''}
                              </p>
                              {(t.fee || t.per_session_fee) && (
                                <span className="text-xs font-semibold text-[#132A24] mt-1 block">
                                  ₹{t.fee || t.per_session_fee}{' '}
                                  <span className="text-[11px] font-normal text-[#66747A]">/ 50-min consultation</span>
                                </span>
                              )}
                            </div>
                          </div>

                          {t.bio && (
                            <p className="text-xs text-[#4A5568] line-clamp-2 leading-relaxed">
                              {t.bio}
                            </p>
                          )}

                          {/* Specializations & Languages */}
                          <div className="space-y-1 pt-1">
                            {t.specializations && t.specializations.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {t.specializations.slice(0, 4).map((spec, sIdx) => (
                                  <span
                                    key={sIdx}
                                    className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-[#263238]/8 text-[#263238]"
                                  >
                                    {spec}
                                  </span>
                                ))}
                                {t.specializations.length > 4 && (
                                  <span className="text-[10px] px-1.5 py-0.5 text-[#66747A]">
                                    +{t.specializations.length - 4} more
                                  </span>
                                )}
                              </div>
                            )}

                            {t.languages && t.languages.length > 0 && (
                              <div className="flex items-center gap-1 text-[11px] text-[#66747A] pt-0.5">
                                <Languages size={12} className="shrink-0" />
                                <span>{t.languages.join(', ')}</span>
                              </div>
                            )}
                          </div>

                          {/* Booking CTA */}
                          <div className="pt-2 border-t border-[#263238]/8 flex items-center justify-end">
                            <button
                              type="button"
                              onClick={() => {
                                closeTransitionModal();
                                if (onStartBooking) onStartBooking(t);
                              }}
                              className="bg-[#132A24] hover:bg-[#1C3E35] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                            >
                              <CalendarIcon size={13} />
                              <span>Book Consultation →</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Close / Return Footer */}
                <div className="pt-3 border-t border-[#263238]/8 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={closeTransitionModal}
                    className="px-4 py-2 rounded-xl text-xs font-semibold border border-[#263238]/15 text-[#263238] hover:bg-[#FAF9F7] transition-all cursor-pointer"
                  >
                    Close &amp; Return to Dashboard
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
