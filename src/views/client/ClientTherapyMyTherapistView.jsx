import React, { useState, useEffect } from 'react';
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

  // Reassignment Modal state
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [reassignReason, setReassignReason] = useState('fit');

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

        {/* Relationship Actions / Reassignment Footer */}
        <div className="pt-4 border-t border-[#263238]/8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#66747A]">
          <span>
            Need assistance or feel this match isn't optimal? You can request a reassignment with full
            continuity.
          </span>
          <button
            type="button"
            onClick={() => setShowReassignModal(true)}
            className="text-amber-800 hover:text-amber-950 font-medium underline underline-offset-2 shrink-0 cursor-pointer"
          >
            Request Therapist Change / Rematch
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* REASSIGNMENT CONFIRMATION MODAL                                           */}
      {/* ========================================================================= */}
      {showReassignModal && (
        <div className="fixed inset-0 z-50 bg-[#132A24]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#263238]/15 shadow-xl max-w-lg w-full p-6 sm:p-8 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10.5px] uppercase font-bold tracking-wider text-amber-800">
                  Care Reassignment Request
                </span>
                <h3 className="font-serif text-xl text-[#132A24] mt-0.5">
                  Requesting a Therapist Change
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowReassignModal(false)}
                className="text-[#66747A] hover:text-[#132A24] p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed">
              At Ingress Within, therapeutic rapport and personal comfort are paramount. If you feel
              your current practitioner isn't the right fit, our care coordination team ensures a
              supportive, seamless transition without losing your account history or completed
              intake.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#132A24] block">
                What is the primary reason for requesting a change?
              </label>
              <div className="space-y-1.5 text-xs text-[#263238]">
                <label className="flex items-center gap-2 p-2 rounded-lg bg-[#FAF9F7] border border-[#263238]/8 cursor-pointer">
                  <input
                    type="radio"
                    name="reassignReason"
                    value="modality"
                    checked={reassignReason === 'modality'}
                    onChange={(e) => setReassignReason(e.target.value)}
                  />
                  <span>Looking for a different therapeutic modality (e.g. CBT, psychodynamic)</span>
                </label>
                <label className="flex items-center gap-2 p-2 rounded-lg bg-[#FAF9F7] border border-[#263238]/8 cursor-pointer">
                  <input
                    type="radio"
                    name="reassignReason"
                    value="availability"
                    checked={reassignReason === 'availability'}
                    onChange={(e) => setReassignReason(e.target.value)}
                  />
                  <span>Scheduling or availability timing conflicts</span>
                </label>
                <label className="flex items-center gap-2 p-2 rounded-lg bg-[#FAF9F7] border border-[#263238]/8 cursor-pointer">
                  <input
                    type="radio"
                    name="reassignReason"
                    value="fit"
                    checked={reassignReason === 'fit'}
                    onChange={(e) => setReassignReason(e.target.value)}
                  />
                  <span>Personal fit / prefer a fresh clinical perspective</span>
                </label>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-3 border-t border-[#263238]/8">
              <button
                type="button"
                onClick={() => setShowReassignModal(false)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold border border-[#263238]/15 text-[#263238] hover:bg-[#FAF9F7] transition-all cursor-pointer"
              >
                Cancel
              </button>
              {onStartRematch && (
                <button
                  type="button"
                  onClick={() => {
                    setShowReassignModal(false);
                    onStartRematch();
                  }}
                  className="w-full sm:w-auto px-5 py-2 rounded-xl text-xs font-semibold bg-[#132A24] text-white hover:bg-[#1C3E35] transition-all cursor-pointer shadow-2xs"
                >
                  Continue to Rematch Intake →
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
