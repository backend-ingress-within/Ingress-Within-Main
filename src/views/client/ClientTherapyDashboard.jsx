import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  BookOpen,
  CreditCard,
  PhoneCall,
  ArrowRight,
  RefreshCw,
  FileText,
  HeartHandshake,
  ExternalLink,
  MessageCircle,
  Menu,
  X,
  Sparkles,
  Info,
  CalendarCheck,
  Award,
  Languages,
  MapPin,
  Check,
  Lock,
} from 'lucide-react';
import ClientHomeworkModal from './ClientHomeworkModal';
import ClientTherapyMyTherapistView from './ClientTherapyMyTherapistView';
import TherapyBookingFlow from '../../components/therapy/TherapyBookingFlow';
import { SUPPORT_CONFIG } from '../../config/supportConfig';
import { getSessionMeetingWindow } from '../../utils/sessionMeetingUtils';

export default function ClientTherapyDashboard({
  user,
  profile,
  relationship,
  therapist,
  onRefreshRelationship,
  onSignOut,
  isPastRelationship = false,
  onStartRematch,
  onExitHistory,
  connectionStatus,
  pendingRequest,
  history = [],
}) {
  const [activeTab, setActiveTab] = useState('overview'); // overview | sessions | therapist | journey | homework | billing | support
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sessions state
  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [sessionsError, setSessionsError] = useState(null);
  const [sessionFilter, setSessionFilter] = useState('upcoming'); // upcoming | past | cancelled

  // Reschedule / Cancel modals
  const [rescheduleModalAppt, setRescheduleModalAppt] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [rescheduleReason, setRescheduleReason] = useState('');
  const [rescheduling, setRescheduling] = useState(false);

  const [cancelModalAppt, setCancelModalAppt] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  // Homework state
  const [homeworkList, setHomeworkList] = useState([]);
  const [loadingHomework, setLoadingHomework] = useState(true);
  const [homeworkError, setHomeworkError] = useState(null);
  const [selectedHomeworkId, setSelectedHomeworkId] = useState(null);
  const [homeworkFilter, setHomeworkFilter] = useState('all'); // all | pending | completed

  // Journey state
  const [journeyData, setJourneyData] = useState(null);
  const [loadingJourney, setLoadingJourney] = useState(true);
  const [journeyError, setJourneyError] = useState(null);

  // Billing state
  const [billingData, setBillingData] = useState(null);
  const [loadingBilling, setLoadingBilling] = useState(false);
  const [billingError, setBillingError] = useState(null);

  // Booking flow modal state
  const [bookingFlowOpen, setBookingFlowOpen] = useState(false);
  const [bookingTherapist, setBookingTherapist] = useState(null);

  // Fetch sessions
  const fetchSessions = async () => {
    setLoadingSessions(true);
    setSessionsError(null);
    try {
      const res = await fetch('/api/therapy/client/sessions');
      if (res.ok) {
        const json = await res.json();
        setSessions(json.sessions || []);
      } else {
        const errJson = await res.json().catch(() => ({}));
        setSessionsError(errJson.error?.message || 'Unable to load scheduled sessions');
      }
    } catch (err) {
      console.warn('Failed to load sessions:', err);
      setSessionsError('Network error loading sessions. Please check your connection.');
    } finally {
      setLoadingSessions(false);
    }
  };

  // Fetch homework
  const fetchHomework = async () => {
    setLoadingHomework(true);
    setHomeworkError(null);
    try {
      const res = await fetch('/api/therapy/client/homework');
      if (res.ok) {
        const json = await res.json();
        setHomeworkList(json.assignments || []);
      } else {
        const errJson = await res.json().catch(() => ({}));
        setHomeworkError(errJson.error?.message || 'Unable to load clinical self-work');
      }
    } catch (err) {
      console.warn('Failed to load homework:', err);
      setHomeworkError('Network error loading self-work. Please check your connection.');
    } finally {
      setLoadingHomework(false);
    }
  };

  // Fetch care journey
  const fetchJourney = async () => {
    setLoadingJourney(true);
    setJourneyError(null);
    try {
      const res = await fetch('/api/therapy/client/journey');
      if (res.ok) {
        const json = await res.json();
        setJourneyData(json.journey || null);
      } else {
        const errJson = await res.json().catch(() => ({}));
        setJourneyError(errJson.error?.message || 'Unable to load longitudinal care journey');
      }
    } catch (err) {
      console.warn('Failed to load journey:', err);
      setJourneyError('Network error loading care journey. Please check your connection.');
    } finally {
      setLoadingJourney(false);
    }
  };

  // Fetch billing
  const fetchBilling = async () => {
    setLoadingBilling(true);
    setBillingError(null);
    try {
      const res = await fetch('/api/therapy/client/billing');
      if (res.ok) {
        const json = await res.json();
        setBillingData(json);
      } else {
        const errJson = await res.json().catch(() => ({}));
        setBillingError(errJson.error?.message || 'Unable to load billing records');
      }
    } catch (err) {
      console.warn('Failed to load billing:', err);
      setBillingError('Network error loading billing.');
    } finally {
      setLoadingBilling(false);
    }
  };

  useEffect(() => {
    fetchSessions();
    fetchHomework();
    fetchJourney();
    fetchBilling();
  }, []);

  // Fetch availability slots when reschedule modal opens
  useEffect(() => {
    if (!rescheduleModalAppt) {
      setAvailableSlots([]);
      setSelectedSlot(null);
      return;
    }
    const therapistId =
      rescheduleModalAppt.therapist?.id ||
      rescheduleModalAppt.therapistAccountId ||
      therapist?.id;
    if (!therapistId) return;

    setLoadingSlots(true);
    fetch(`/api/therapy/therapists/${therapistId}/availability`)
      .then((res) => res.json())
      .then((data) => {
        setAvailableSlots(data.slots || []);
      })
      .catch(() => setAvailableSlots([]))
      .finally(() => setLoadingSlots(false));
  }, [rescheduleModalAppt, therapist]);

  // Reschedule submit
  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    if (!rescheduleModalAppt || !selectedSlot) return;

    setRescheduling(true);
    try {
      const res = await fetch('/api/therapy/sessions/reschedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appointmentId: rescheduleModalAppt.id,
          newStart: selectedSlot.start,
          newEnd: selectedSlot.end,
          reason: rescheduleReason || 'Client requested reschedule',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Failed to reschedule');

      setRescheduleModalAppt(null);
      setSelectedSlot(null);
      setRescheduleReason('');
      await fetchSessions();
    } catch (err) {
      alert(err.message);
    } finally {
      setRescheduling(false);
    }
  };

  // Cancel submit
  const handleCancelSubmit = async (e) => {
    e.preventDefault();
    if (!cancelModalAppt) return;

    setCancelling(true);
    try {
      const res = await fetch('/api/therapy/sessions/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appointmentId: cancelModalAppt.id,
          reason: cancelReason || 'Cancelled by client',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Failed to cancel session');

      setCancelModalAppt(null);
      setCancelReason('');
      await fetchSessions();
    } catch (err) {
      alert(err.message);
    } finally {
      setCancelling(false);
    }
  };



  const handleStartBooking = (targetTherapist = therapist) => {
    setBookingTherapist(targetTherapist);
    setBookingFlowOpen(true);
  };

  // Derived next session
  const now = Date.now();
  const upcomingSessionsList = sessions
    .filter((s) => ['scheduled', 'confirmed', 'rescheduled'].includes(s.status) && new Date(s.scheduledStart).getTime() > now)
    .sort((a, b) => new Date(a.scheduledStart).getTime() - new Date(b.scheduledStart).getTime());
  const nextSession = upcomingSessionsList[0] || null;

  // Derived homework stats
  const pendingHomeworkList = homeworkList.filter(
    (h) => ['assigned', 'viewed', 'in_progress'].includes(h.status)
  );
  const nextDueHomework = pendingHomeworkList[0] || null;

  const clinicianName = therapist?.displayName || therapist?.name || therapist?.full_name || 'Assigned Clinician';
  const clinicianTitle = therapist?.title || therapist?.credentials || 'Consultant Psychologist';
  const careStage = relationship?.careStage || 'intake';

  const STAGE_LABELS = {
    intake: 'Intake & Assessment',
    active_care: 'Active Clinical Care',
    maintenance: 'Maintenance & Integration',
    completed: 'Care Completed',
  };

  const STAGE_DESCRIPTIONS = {
    intake: 'Establishing safety, clinical goals, and therapeutic baseline.',
    active_care: 'Regular weekly or bi-weekly evidence-based sessions and self-work.',
    maintenance: 'Consolidating gains, spacing consultations, and preventing relapse.',
    completed: 'Formal therapy journey concluded with lifelong self-reflection tools.',
  };

  return (
    <div className="min-h-screen bg-[#F4F1EC] text-[#263238] font-sans antialiased">
      {/* 1. TOP CLIENT THERAPY NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-[#F4F1EC]/90 backdrop-blur-md border-b border-[#263238]/10 px-4 sm:px-6 py-3.5 transition-all">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Return */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined' && window.navigateTo) window.navigateTo('/dashboard');
                else window.location.href = '/dashboard';
              }}
              className="flex items-center gap-2 text-xs font-semibold text-[#66747A] hover:text-[#263238] transition-colors"
              title="Return to Ingress Within Dashboard"
            >
              <img src="/logo-mark-transparent.png" alt="Ingress Within" className="w-6 h-6 object-contain" />
              <span className="hidden sm:inline font-serif text-sm text-[#132A24] tracking-tight">
                ingress <span className="font-semibold text-[#8B5E66]">within</span>
              </span>
              <span className="text-[#A0AAB0] mx-1">/</span>
              <span className="font-semibold text-[#132A24]">Therapy Portal</span>
            </button>
          </div>

          {/* Desktop Tab Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'sessions', label: 'Sessions', count: upcomingSessionsList.length },
              { id: 'therapist', label: 'My Therapist' },
              { id: 'journey', label: 'My Journey' },
              { id: 'homework', label: 'Self-Work', count: pendingHomeworkList.length },
              { id: 'billing', label: 'Billing' },
              { id: 'support', label: 'Support' },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#132A24] text-white shadow-2xs font-semibold'
                      : 'text-[#66747A] hover:text-[#263238] hover:bg-[#263238]/5'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-[#132A24]/10 text-[#132A24]'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action: Book Session CTA & Mobile Menu Toggle */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleStartBooking(therapist)}
              className="bg-[#132A24] text-white hover:bg-[#1C3E35] px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
            >
              <CalendarIcon size={13} />
              <span className="hidden sm:inline">Book Consultation</span>
              <span className="sm:hidden">Book</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-lg border border-[#263238]/10 text-[#263238] hover:bg-[#263238]/5"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#263238]/10 pt-3 pb-2 mt-2 space-y-1">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'sessions', label: 'Sessions', count: upcomingSessionsList.length },
              { id: 'therapist', label: 'My Therapist' },
              { id: 'journey', label: 'My Journey' },
              { id: 'homework', label: 'Self-Work / Homework', count: pendingHomeworkList.length },
              { id: 'billing', label: 'Billing & Invoices' },
              { id: 'support', label: 'Care & Emergency Helplines' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between ${
                  activeTab === tab.id
                    ? 'bg-[#132A24] text-white font-semibold'
                    : 'text-[#263238] hover:bg-[#263238]/5'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* 2. MAIN DASHBOARD CONTENT AREA */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* ========================================================================= */}
        {/* TAB 1: OVERVIEW / HOME                                                    */}
        {/* ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6 sm:space-y-8">
            {/* Top Welcome Banner */}
            <div className="bg-white border border-[#263238]/10 rounded-2xl p-6 sm:p-7 shadow-2xs relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2 max-w-xl">
                  {isPastRelationship ? (
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-semibold uppercase tracking-wider">
                      <Clock size={13} className="text-amber-700" />
                      <span>Historical Care Records · Completed or Concluded</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold uppercase tracking-wider">
                      <ShieldCheck size={13} className="text-emerald-700" />
                      <span>Active Clinical Care · {STAGE_LABELS[careStage]}</span>
                    </div>
                  )}
                  <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#132A24] tracking-tight">
                    {isPastRelationship ? 'Care History & Records' : `Welcome to your care space, ${profile?.name || user?.name || 'Client'}.`}
                  </h1>
                  <p className="text-xs sm:text-sm text-[#66747A] leading-relaxed">
                    {isPastRelationship ? (
                      <>
                        Viewing historical records for care with <strong className="text-[#263238]">{clinicianName}</strong>. Your session records and self-work remain archived. You can rematch or request a new clinician at any time.
                      </>
                    ) : (
                      <>
                        You are in continuous care with{' '}
                        <strong className="text-[#263238]">{clinicianName}</strong>. All consultations,
                        assigned self-work, and care progression remain synchronized across your portal.
                      </>
                    )}
                  </p>
                  {isPastRelationship && onStartRematch && (
                    <div className="pt-2 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={onStartRematch}
                        className="bg-[#132A24] text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#1C3E35] transition-colors"
                      >
                        Find a New Therapist
                      </button>
                      {onExitHistory && (
                        <button
                          type="button"
                          onClick={onExitHistory}
                          className="border border-[#263238]/20 text-[#263238] px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-[#263238]/5 transition-colors"
                        >
                          Exit History View
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Therapist Mini Pill */}
                <div className="shrink-0 bg-[#F4F1EC] border border-[#263238]/8 rounded-xl p-4 flex items-center gap-3.5 max-w-sm">
                  {therapist?.profileImageUrl ? (
                    <img
                      src={therapist.profileImageUrl}
                      alt={clinicianName}
                      className="w-12 h-12 rounded-xl object-cover border border-[#263238]/10 shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-[#132A24] text-white flex items-center justify-center font-serif text-lg shrink-0">
                      {clinicianName.replace(/^Dr\.?\s*/i, '').charAt(0)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-[#132A24] truncate">{clinicianName}</div>
                    <div className="text-[11px] text-[#66747A] truncate">{clinicianTitle}</div>
                    <div className="text-[10px] text-emerald-700 font-medium flex items-center gap-1 mt-0.5">
                      <CheckCircle2 size={11} /> Verified Ingress Clinician
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Grid Row: Next Upcoming Session & Next Homework Action */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Next Upcoming Session Card */}
              <div className="bg-white border border-[#263238]/10 rounded-2xl p-6 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#263238]/8">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#132A24] flex items-center gap-1.5">
                      <CalendarCheck size={14} className="text-emerald-700" />
                      <span>Next Consultation</span>
                    </div>
                    {nextSession && (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                        {nextSession.status}
                      </span>
                    )}
                  </div>

                  {loadingSessions ? (
                    <div className="py-10 text-center space-y-2">
                      <div className="w-5 h-5 border-2 border-[#132A24] border-t-transparent rounded-full animate-spin mx-auto" />
                      <p className="text-xs text-[#66747A]">Checking scheduled consultations...</p>
                    </div>
                  ) : sessionsError ? (
                    <div className="py-8 text-center space-y-3">
                      <div className="inline-flex p-2 bg-red-50 text-red-700 rounded-full">
                        <AlertCircle size={20} />
                      </div>
                      <p className="text-xs text-red-800 max-w-xs mx-auto">{sessionsError}</p>
                      <button
                        type="button"
                        onClick={fetchSessions}
                        className="text-xs text-[#132A24] hover:underline font-semibold inline-flex items-center gap-1"
                      >
                        <RefreshCw size={12} /> Retry Loading
                      </button>
                    </div>
                  ) : nextSession ? (
                    <div className="mt-4 space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="font-serif text-xl text-[#132A24]">
                            {new Date(nextSession.scheduledStart).toLocaleDateString('en-US', {
                              weekday: 'long',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </div>
                          <div className="text-xs text-[#66747A] flex items-center gap-1.5 mt-1">
                            <Clock size={13} />
                            <span>
                              {new Date(nextSession.scheduledStart).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}{' '}
                              –{' '}
                              {new Date(nextSession.scheduledEnd).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-[11px] font-medium text-[#66747A] block">Mode</span>
                          <span className="text-xs font-semibold text-[#132A24] capitalize flex items-center gap-1 mt-0.5">
                            <Video size={13} className="text-emerald-700" /> Telehealth
                          </span>
                        </div>
                      </div>

                      {/* Google Meet Action */}
                      {nextSession.googleMeetUrl ? (
                        (() => {
                          const nextMeetingWindow = getSessionMeetingWindow(nextSession.scheduledStart, nextSession.scheduledEnd);
                          if (nextMeetingWindow.canJoin) {
                            return (
                              <a
                                href={nextSession.googleMeetUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-3 w-full bg-emerald-800 text-white hover:bg-emerald-900 py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-2xs cursor-pointer"
                              >
                                <Video size={15} /> Join Google Meet Consultation
                              </a>
                            );
                          }

                          if (nextMeetingWindow.isTooEarly) {
                            return (
                              <div className="mt-3 p-3 rounded-xl bg-gray-50 border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                                <div className="flex items-center gap-2 text-xs text-gray-700">
                                  <Lock size={14} className="text-gray-500 shrink-0" />
                                  <span>Meeting room access opens 1 hour prior to session ({nextMeetingWindow.joinOpensAtFormatted})</span>
                                </div>
                                <button
                                  type="button"
                                  disabled
                                  className="py-1.5 px-3 rounded-lg bg-gray-200 text-gray-500 text-xs font-medium cursor-not-allowed inline-flex items-center gap-1.5 shrink-0"
                                  title={`Google Meet room becomes accessible at ${nextMeetingWindow.joinOpensAtFormatted}`}
                                >
                                  <Lock size={12} /> Join Available 1h Prior
                                </button>
                              </div>
                            );
                          }

                          return (
                            <div className="mt-3 p-2.5 rounded-xl bg-gray-100 border border-gray-200 text-gray-600 text-xs flex items-center gap-2">
                              <Clock size={14} className="text-gray-500 shrink-0" />
                              <span>This consultation session has ended.</span>
                            </div>
                          );
                        })()
                      ) : (
                        <div className="mt-3 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
                          <Video size={14} className="text-amber-700 shrink-0" />
                          <span>Google Meet room will be provided by your clinician prior to your session.</span>
                        </div>
                      )}

                      {/* Reschedule & Policy Info */}
                      <div className="pt-2 flex items-center justify-between text-xs text-[#66747A]">
                        {nextSession.policy?.canReschedule ? (
                          <button
                            type="button"
                            onClick={() => setRescheduleModalAppt(nextSession)}
                            className="text-[#132A24] underline hover:text-emerald-800 font-medium cursor-pointer"
                          >
                            Reschedule session
                          </button>
                        ) : (
                          <span className="text-gray-400 text-[11px]">Under 24h: Rescheduling locked</span>
                        )}

                        {nextSession.policy?.canCancel && (
                          <button
                            type="button"
                            onClick={() => setCancelModalAppt(nextSession)}
                            className="text-red-700 underline hover:text-red-900 font-medium cursor-pointer"
                          >
                            Cancel appointment
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="py-8 text-center space-y-3">
                      <p className="text-xs text-[#66747A]">
                        No upcoming session scheduled right now with {clinicianName}.
                      </p>
                      <button
                        type="button"
                        onClick={() => handleStartBooking(therapist)}
                        className="bg-[#132A24] text-white hover:bg-[#1C3E35] px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                      >
                        <CalendarIcon size={14} /> Schedule Next Consultation
                      </button>
                    </div>
                  )}
                </div>

                <div className="pt-4 mt-4 border-t border-[#263238]/8 flex items-center justify-between">
                  <span className="text-[11px] text-[#66747A]">
                    {sessions.length} total consultation{sessions.length === 1 ? '' : 's'} recorded
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('sessions')}
                    className="text-xs text-[#132A24] hover:underline font-semibold flex items-center gap-1"
                  >
                    View all sessions <ChevronRight size={13} />
                  </button>
                </div>
              </div>

              {/* Next Self-Work / Homework Card */}
              <div className="bg-white border border-[#263238]/10 rounded-2xl p-6 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#263238]/8">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#132A24] flex items-center gap-1.5">
                      <BookOpen size={14} className="text-[#8B5E66]" />
                      <span>Clinical Self-Work</span>
                    </div>
                    {nextDueHomework && (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                        {nextDueHomework.status.replace('_', ' ')}
                      </span>
                    )}
                  </div>

                  {loadingHomework ? (
                    <div className="py-10 text-center space-y-2">
                      <div className="w-5 h-5 border-2 border-[#132A24] border-t-transparent rounded-full animate-spin mx-auto" />
                      <p className="text-xs text-[#66747A]">Loading assignments...</p>
                    </div>
                  ) : homeworkError ? (
                    <div className="py-8 text-center space-y-3">
                      <div className="inline-flex p-2 bg-red-50 text-red-700 rounded-full">
                        <AlertCircle size={20} />
                      </div>
                      <p className="text-xs text-red-800 max-w-xs mx-auto">{homeworkError}</p>
                      <button
                        type="button"
                        onClick={fetchHomework}
                        className="text-xs text-[#132A24] hover:underline font-semibold inline-flex items-center gap-1"
                      >
                        <RefreshCw size={12} /> Retry Loading
                      </button>
                    </div>
                  ) : nextDueHomework ? (
                    <div className="mt-4 space-y-3">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-[#8B5E66]">
                          {nextDueHomework.exerciseType.replace('_', ' ')}
                        </span>
                        <h3 className="font-serif text-lg text-[#132A24] mt-0.5">{nextDueHomework.title}</h3>
                        <p className="text-xs text-[#66747A] line-clamp-2 mt-1">
                          {nextDueHomework.instructions}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-[#66747A] pt-1">
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> ~{nextDueHomework.estimatedMinutes} mins
                        </span>
                        {nextDueHomework.dueAt && (
                          <span className="flex items-center gap-1">
                            <CalendarIcon size={12} /> Due{' '}
                            {new Date(nextDueHomework.dueAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedHomeworkId(nextDueHomework.id)}
                        className="mt-3 w-full bg-[#132A24] text-white hover:bg-[#1C3E35] py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-2xs cursor-pointer"
                      >
                        <FileText size={14} /> Open Assignment &amp; Reflect
                      </button>
                    </div>
                  ) : (
                    <div className="py-8 text-center space-y-2">
                      <CheckCircle2 size={32} className="mx-auto text-emerald-600/60" />
                      <div className="text-xs font-semibold text-[#132A24]">You are all caught up!</div>
                      <p className="text-xs text-[#66747A] max-w-xs mx-auto">
                        No pending self-work assigned right now. Practice grounding or explore journaling
                        prompts in the meantime.
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-4 mt-4 border-t border-[#263238]/8 flex items-center justify-between">
                  <span className="text-[11px] text-[#66747A]">
                    {homeworkList.length} assignment{homeworkList.length === 1 ? '' : 's'} assigned
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('homework')}
                    className="text-xs text-[#132A24] hover:underline font-semibold flex items-center gap-1"
                  >
                    View all assignments <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            </div>

            {/* Care Journey Snapshot Bar */}
            <div className="bg-white border border-[#263238]/10 rounded-2xl p-6 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                    Longitudinal Care Journey
                  </span>
                  <h3 className="font-serif text-lg text-[#132A24] mt-0.5">
                    Stage: {STAGE_LABELS[careStage]}
                  </h3>
                  <p className="text-xs text-[#66747A] mt-0.5">{STAGE_DESCRIPTIONS[careStage]}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('journey')}
                  className="shrink-0 bg-[#F4F1EC] hover:bg-[#E8E2D8] border border-[#263238]/10 text-[#132A24] px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-all"
                >
                  Explore Journey Milestones <ArrowRight size={13} />
                </button>
              </div>

              {/* Progress Steps */}
              {loadingJourney ? (
                <div className="py-4 text-center text-xs text-[#66747A]">Loading journey progression...</div>
              ) : journeyError ? (
                <div className="py-3 text-center text-xs text-red-800 flex items-center justify-center gap-2">
                  <span>{journeyError}</span>
                  <button type="button" onClick={fetchJourney} className="font-semibold underline">Retry</button>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-2 pt-2">
                  {[
                    { key: 'intake', label: '1. Intake' },
                    { key: 'active_care', label: '2. Active Care' },
                    { key: 'maintenance', label: '3. Maintenance' },
                    { key: 'completed', label: '4. Concluded' },
                  ].map((s, idx) => {
                    const stageOrder = ['intake', 'active_care', 'maintenance', 'completed'];
                    const currentIndex = stageOrder.indexOf(careStage);
                    const isPast = idx < currentIndex;
                    const isCurrent = idx === currentIndex;

                    return (
                      <div key={s.key} className="space-y-1.5 text-center">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            isPast
                              ? 'bg-emerald-600'
                              : isCurrent
                              ? 'bg-emerald-700 ring-2 ring-emerald-300'
                              : 'bg-gray-200'
                          }`}
                        />
                        <span
                          className={`text-[10px] sm:text-[11px] block truncate ${
                            isCurrent
                              ? 'font-bold text-[#132A24]'
                              : isPast
                              ? 'font-medium text-emerald-800'
                              : 'text-gray-400'
                          }`}
                        >
                          {s.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: MY THERAPIST (STEP 3)                                              */}
        {/* ========================================================================= */}
        {activeTab === 'therapist' && (
          <ClientTherapyMyTherapistView
            initialTherapist={therapist}
            initialRelationship={relationship}
            initialStatus={connectionStatus || (isPastRelationship ? 'ended' : (therapist ? 'connected' : 'no_therapist'))}
            isPastRelationship={isPastRelationship}
            pendingRequest={pendingRequest}
            history={history}
            onStartBooking={(targetTherapist) => handleStartBooking(targetTherapist || therapist)}
            onNavigateSessions={() => setActiveTab('sessions')}
            onStartRematch={onStartRematch}
            onNavigateSupport={() => setActiveTab('support')}
            onRefresh={onRefreshRelationship}
          />
        )}

        {/* ========================================================================= */}
        {/* TAB 3: MY SESSIONS                                                        */}
        {/* ========================================================================= */}
        {activeTab === 'sessions' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#263238]/10 pb-4">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-emerald-800">
                  Appointments &amp; Telehealth
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl text-[#132A24] mt-1">My Sessions</h1>
                <p className="text-xs text-[#66747A] mt-1">
                  Manage your scheduled consultations, join Google Meet sessions, or reschedule.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleStartBooking(therapist)}
                  className="bg-[#132A24] text-white hover:bg-[#1C3E35] px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                >
                  <CalendarIcon size={14} /> Book New Session
                </button>
              </div>
            </div>

            {/* Policy Banner */}
            <div className="bg-blue-50/60 border border-blue-200/80 rounded-xl p-4 text-xs text-blue-900 flex items-start gap-3">
              <Info size={15} className="shrink-0 text-blue-600 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-semibold">Rescheduling &amp; Cancellation Policy: </span>
                <span className="text-blue-800/90 leading-relaxed">
                  Sessions can be rescheduled freely up to <strong>24 hours</strong> before the start time.
                  Cancellations made <strong>48 hours or more</strong> in advance receive an automatic 100% refund.
                </span>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 border-b border-[#263238]/10 pb-2">
              {[
                { id: 'upcoming', label: 'Upcoming' },
                { id: 'past', label: 'Completed & Past' },
                { id: 'cancelled', label: 'Cancelled' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setSessionFilter(f.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    sessionFilter === f.id
                      ? 'bg-[#132A24] text-white font-semibold'
                      : 'text-[#66747A] hover:bg-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Sessions List */}
            {loadingSessions ? (
              <div className="py-16 text-center space-y-3 bg-white border border-[#263238]/10 rounded-2xl p-8">
                <div className="w-6 h-6 border-2 border-[#132A24] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-[#66747A]">Loading your clinical therapy appointments...</p>
              </div>
            ) : sessionsError ? (
              <div className="bg-white border border-red-200 rounded-2xl p-10 text-center space-y-3">
                <div className="inline-flex p-3 bg-red-50 text-red-700 rounded-full">
                  <AlertCircle size={24} />
                </div>
                <h3 className="font-serif text-base text-red-950">Unable to load appointments</h3>
                <p className="text-xs text-red-800 max-w-sm mx-auto">{sessionsError}</p>
                <button
                  type="button"
                  onClick={fetchSessions}
                  className="mt-2 bg-[#132A24] text-white hover:bg-[#1C3E35] px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                >
                  <RefreshCw size={13} /> Retry Loading Sessions
                </button>
              </div>
            ) : (() => {
              const filtered = sessions.filter((s) => {
                const isUpcoming = ['scheduled', 'confirmed', 'rescheduled'].includes(s.status) && new Date(s.scheduledStart).getTime() > now;
                const isCancelled = s.status === 'cancelled';
                if (sessionFilter === 'upcoming') return isUpcoming;
                if (sessionFilter === 'cancelled') return isCancelled;
                return !isUpcoming && !isCancelled;
              });

              if (filtered.length === 0) {
                return (
                  <div className="bg-white border border-[#263238]/10 rounded-2xl p-10 text-center space-y-3">
                    <CalendarIcon size={32} className="mx-auto text-gray-300" />
                    <h3 className="font-serif text-base text-[#132A24]">
                      No {sessionFilter} sessions found
                    </h3>
                    <p className="text-xs text-[#66747A] max-w-sm mx-auto">
                      {sessionFilter === 'upcoming'
                        ? `You have no upcoming consultations scheduled. Book a slot based on ${clinicianName}'s real-time Google Calendar.`
                        : sessionFilter === 'cancelled'
                        ? 'No cancelled appointments on record.'
                        : 'Your session records will appear here as you progress through therapy.'}
                    </p>
                    {sessionFilter === 'upcoming' && (
                      <button
                        type="button"
                        onClick={() => handleStartBooking(therapist)}
                        className="mt-2 bg-[#132A24] text-white hover:bg-[#1C3E35] px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                      >
                        <CalendarIcon size={14} /> Book a Session
                      </button>
                    )}
                  </div>
                );
              }

              return (
                <div className="space-y-3.5">
                  {filtered.map((s) => {
                    const startDate = new Date(s.scheduledStart);
                    const isUpcoming = ['scheduled', 'confirmed', 'rescheduled'].includes(s.status) && startDate.getTime() > now;

                    return (
                      <div
                        key={s.id}
                        className={`bg-white border border-[#263238]/10 rounded-xl p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                          s.status === 'cancelled' ? 'opacity-70 bg-gray-50/80 border-gray-200' : 'hover:border-[#263238]/20'
                        }`}
                      >
                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-semibold text-[#132A24]">
                              {startDate.toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                            <span className="text-xs text-[#66747A]">at</span>
                            <span className="text-xs font-semibold text-[#132A24]">
                              {startDate.toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                            <span
                              className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                                s.status === 'confirmed'
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                  : s.status === 'completed'
                                  ? 'bg-gray-100 text-gray-700'
                                  : s.status === 'cancelled'
                                  ? 'bg-red-50 text-red-700 border border-red-200'
                                  : 'bg-blue-50 text-blue-800'
                              }`}
                            >
                              {s.status}
                            </span>
                            {s.status === 'cancelled' && s.refundStatus && s.refundStatus !== 'none' && (
                              <span
                                className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                                  s.refundStatus === 'full' || s.refundStatus === 'partial'
                                    ? 'bg-blue-50 text-blue-800 border border-blue-200'
                                    : s.refundStatus === 'eligible' || s.refundStatus === 'pending'
                                    ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                    : 'bg-gray-100 text-gray-600'
                                }`}
                              >
                                Refund: {s.refundStatus}
                              </span>
                            )}
                          </div>

                          <div className="text-xs text-[#66747A] flex flex-wrap items-center gap-x-4 gap-y-1">
                            <span>Clinician: <strong>{s.therapist?.name || clinicianName}</strong></span>
                            <span>Mode: <strong className="capitalize">{s.sessionType || 'video'}</strong></span>
                            {s.calendarSyncStatus && s.calendarSyncStatus !== 'synced' && isUpcoming && (
                              <span className="text-amber-700 text-[11px] font-medium">Calendar: {s.calendarSyncStatus}</span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap items-center gap-2.5">
                          {isUpcoming && s.googleMeetUrl && (() => {
                            const meetingWindow = getSessionMeetingWindow(s.scheduledStart, s.scheduledEnd);
                            if (meetingWindow.canJoin) {
                              return (
                                <a
                                  href={s.googleMeetUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="bg-emerald-800 text-white hover:bg-emerald-900 px-3.5 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                                >
                                  <Video size={13} /> Join Meet
                                </a>
                              );
                            }
                            if (meetingWindow.isTooEarly) {
                              return (
                                <button
                                  type="button"
                                  disabled
                                  className="bg-gray-100 text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 cursor-not-allowed"
                                  title={`Room access opens 1 hour prior to session (${meetingWindow.joinOpensAtFormatted})`}
                                >
                                  <Lock size={12} className="text-gray-400" /> Join opens 1h prior
                                </button>
                              );
                            }
                            return null;
                          })()}

                          {isUpcoming && !s.googleMeetUrl && (
                            <span className="text-xs text-amber-800 font-medium px-2.5 py-1 bg-amber-50 rounded-lg border border-amber-200 inline-flex items-center gap-1">
                              <Video size={12} className="text-amber-700" /> Meet link pending
                            </span>
                          )}

                          {isUpcoming && s.policy?.canReschedule && (
                            <button
                              type="button"
                              onClick={() => setRescheduleModalAppt(s)}
                              className="text-xs px-3 py-1.5 rounded-lg border border-[#263238]/15 hover:bg-[#263238]/5 text-[#132A24] font-medium cursor-pointer"
                            >
                              Reschedule
                            </button>
                          )}

                          {isUpcoming && s.policy?.canCancel && (
                            <button
                              type="button"
                              onClick={() => setCancelModalAppt(s)}
                              className="text-xs px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-700 font-medium cursor-pointer"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: MY JOURNEY                                                         */}
        {/* ========================================================================= */}
        {activeTab === 'journey' && (
          <div className="space-y-6">
            <div className="border-b border-[#263238]/10 pb-4">
              <span className="text-[11px] uppercase tracking-wider font-bold text-emerald-800">
                Longitudinal Care Model
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl text-[#132A24] mt-1">My Therapy Journey</h1>
              <p className="text-xs text-[#66747A] mt-1">
                Your longitudinal clinical progression, care stage transitions, and treatment milestones.
              </p>
            </div>

            {/* Care Stage Header Card */}
            <div className="bg-white border border-[#263238]/10 rounded-2xl p-6 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                    Current Stage
                  </div>
                  <h2 className="font-serif text-2xl text-[#132A24] mt-0.5">
                    {STAGE_LABELS[careStage]}
                  </h2>
                  <p className="text-xs text-[#66747A] mt-1 max-w-lg">
                    {STAGE_DESCRIPTIONS[careStage]}
                  </p>
                </div>

                {journeyData?.sessionMetrics && (
                  <div className="flex items-center gap-4 bg-[#F4F1EC] p-3 rounded-xl border border-[#263238]/8">
                    <div className="text-center">
                      <div className="font-serif text-xl text-[#132A24]">
                        {journeyData.sessionMetrics.completed}
                      </div>
                      <div className="text-[10px] text-[#66747A] uppercase font-bold">Completed</div>
                    </div>
                    <div className="h-8 w-px bg-[#263238]/10" />
                    <div className="text-center">
                      <div className="font-serif text-xl text-emerald-800">
                        {journeyData.sessionMetrics.upcoming}
                      </div>
                      <div className="text-[10px] text-[#66747A] uppercase font-bold">Upcoming</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Four Stage Model Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-4 border-t border-[#263238]/8">
                {[
                  {
                    stage: 'intake',
                    title: '1. Intake',
                    desc: 'Initial assessment, rapport, and collaborative goal setting.',
                  },
                  {
                    stage: 'active_care',
                    title: '2. Active Care',
                    desc: 'Consistent consultations, cognitive reframing, and self-work.',
                  },
                  {
                    stage: 'maintenance',
                    title: '3. Maintenance',
                    desc: 'Spaced check-ins, autonomous reflection, and habit integration.',
                  },
                  {
                    stage: 'completed',
                    title: '4. Concluded',
                    desc: 'Formal discharge with long-term emotional resilience mastery.',
                  },
                ].map((s) => {
                  const isCurrent = s.stage === careStage;
                  return (
                    <div
                      key={s.stage}
                      className={`p-3 rounded-xl border transition-all ${
                        isCurrent
                          ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-200'
                          : 'bg-white border-[#263238]/8 opacity-80'
                      }`}
                    >
                      <div
                        className={`text-xs font-semibold ${
                          isCurrent ? 'text-emerald-900' : 'text-[#263238]'
                        }`}
                      >
                        {s.title}
                        {isCurrent && (
                          <span className="ml-1.5 text-[9px] uppercase px-1.5 py-0.2 rounded bg-emerald-700 text-white font-bold">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#66747A] mt-1 leading-snug">{s.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Stage Milestones Timeline */}
            <div className="bg-white border border-[#263238]/10 rounded-2xl p-6 shadow-2xs space-y-4">
              <h3 className="font-serif text-lg text-[#132A24]">Care Stage Transition Log</h3>

              {loadingJourney ? (
                <div className="py-6 text-center text-xs text-[#66747A]">Loading journey history...</div>
              ) : (journeyData?.stageHistory || []).length === 0 ? (
                <div className="py-6 text-center text-xs text-[#66747A]">
                  Care relationship commenced on{' '}
                  {relationship?.startedAt
                    ? new Date(relationship.startedAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : 'intake confirmation'}
                  . Formal transition milestones will be logged by your clinician as you progress.
                </div>
              ) : (
                <div className="space-y-3">
                  {journeyData.stageHistory.map((h, idx) => (
                    <div
                      key={h.id || idx}
                      className="p-3.5 rounded-xl bg-[#F4F1EC]/60 border border-[#263238]/8 flex items-start justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="text-xs font-semibold text-[#132A24]">
                          Transitioned to {STAGE_LABELS[h.newStage] || h.newStage}
                        </div>
                        {h.note && (
                          <p className="text-xs text-[#66747A] leading-relaxed">
                            "{h.note}"
                          </p>
                        )}
                      </div>
                      <span className="text-[11px] text-[#A0AAB0] shrink-0 font-medium">
                        {new Date(h.changedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Privacy Shield Guard */}
              <div className="pt-3 border-t border-[#263238]/8 flex items-center gap-2 text-[11px] text-[#66747A]">
                <ShieldCheck size={14} className="text-emerald-700 shrink-0" />
                <span>
                  Privacy Boundary Enforced: Clinical SOAP formulation and diagnostic assessments remain
                  restricted to licensed clinician supervisory records.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: HOMEWORK & PROGRAMS                                                */}
        {/* ========================================================================= */}
        {activeTab === 'homework' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#263238]/10 pb-4">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-emerald-800">
                  Client Self-Work &amp; Tools
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl text-[#132A24] mt-1">
                  Homework &amp; Practice
                </h1>
                <p className="text-xs text-[#66747A] mt-1">
                  Therapist-assigned exercises, worksheets, and thought records to practice between sessions.
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-2">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'pending', label: 'To Do' },
                  { id: 'completed', label: 'Submitted & Reviewed' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setHomeworkFilter(f.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      homeworkFilter === f.id
                        ? 'bg-[#132A24] text-white font-semibold'
                        : 'text-[#66747A] hover:bg-white'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {loadingHomework ? (
              <div className="py-12 text-center text-xs text-[#66747A]">Loading assignments...</div>
            ) : (() => {
              const filtered = homeworkList.filter((h) => {
                if (homeworkFilter === 'pending') {
                  return ['assigned', 'viewed', 'in_progress'].includes(h.status);
                }
                if (homeworkFilter === 'completed') {
                  return ['submitted', 'reviewed'].includes(h.status);
                }
                return true;
              });

              if (filtered.length === 0) {
                return (
                  <div className="bg-white border border-[#263238]/10 rounded-2xl p-10 text-center space-y-3">
                    <BookOpen size={32} className="mx-auto text-gray-300" />
                    <h3 className="font-serif text-base text-[#132A24]">
                      No assignments found
                    </h3>
                    <p className="text-xs text-[#66747A] max-w-sm mx-auto">
                      {homeworkFilter === 'pending'
                        ? 'You have completed all current assignments. New self-work will be assigned after your next consultation.'
                        : 'Your assigned clinical tools will appear here.'}
                    </p>
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filtered.map((h) => {
                    const isSubmitted = ['submitted', 'reviewed'].includes(h.status);

                    return (
                      <div
                        key={h.id}
                        className="bg-white border border-[#263238]/10 rounded-xl p-5 shadow-2xs flex flex-col justify-between space-y-4 hover:border-[#263238]/20 transition-all"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#F4F1EC] text-[#263238] border border-[#263238]/8">
                              {h.exerciseType.replace('_', ' ')}
                            </span>
                            <span
                              className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                                h.status === 'reviewed'
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                  : h.status === 'submitted'
                                  ? 'bg-blue-50 text-blue-800'
                                  : 'bg-amber-50 text-amber-800'
                              }`}
                            >
                              {h.status.replace('_', ' ')}
                            </span>
                          </div>

                          <h3 className="font-serif text-base text-[#132A24] font-medium">{h.title}</h3>
                          <p className="text-xs text-[#66747A] line-clamp-3 leading-relaxed">
                            {h.instructions}
                          </p>

                          {/* Clinician Feedback Callout if reviewed */}
                          {h.feedback && (
                            <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 space-y-1">
                              <span className="font-bold flex items-center gap-1 text-[11px] text-emerald-900">
                                <CheckCircle2 size={12} /> Clinician Feedback
                              </span>
                              <p className="italic text-[#263238]">"{h.feedback}"</p>
                            </div>
                          )}
                        </div>

                        <div className="pt-3 border-t border-[#263238]/8 flex items-center justify-between">
                          <div className="text-[11px] text-[#66747A] flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <Clock size={11} /> ~{h.estimatedMinutes}m
                            </span>
                            {h.dueAt && (
                              <span className="flex items-center gap-1">
                                <CalendarIcon size={11} />{' '}
                                {new Date(h.dueAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => setSelectedHomeworkId(h.id)}
                            className="bg-[#132A24] text-white hover:bg-[#1C3E35] px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                          >
                            <FileText size={12} />
                            <span>{isSubmitted ? 'View Submission' : 'Open Exercise'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: BILLING & RECEIPTS                                                 */}
        {/* ========================================================================= */}
        {activeTab === 'billing' && (
          <div className="space-y-6">
            <div className="border-b border-[#263238]/10 pb-4">
              <span className="text-[11px] uppercase tracking-wider font-bold text-emerald-800">
                Financial Ledger &amp; Invoices
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl text-[#132A24] mt-1">
                Billing &amp; Payments
              </h1>
              <p className="text-xs text-[#66747A] mt-1">
                Verified Razorpay transactions, session payments, and official receipts.
              </p>
            </div>

            {/* Session Transactions Card */}
            <div className="bg-white border border-[#263238]/10 rounded-2xl p-6 shadow-2xs space-y-4">
              <h3 className="font-serif text-lg text-[#132A24]">Therapy Session Bookings</h3>

              {loadingBilling ? (
                <div className="py-6 text-center text-xs text-[#66747A]">Loading billing records...</div>
              ) : (billingData?.sessionBookings || []).length === 0 ? (
                <div className="py-6 text-center text-xs text-[#66747A]">
                  No session payments recorded yet. Invoices will populate automatically upon booking confirmation.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#263238]/10 text-[10px] uppercase font-bold text-[#66747A]">
                        <th className="pb-2.5">Reference</th>
                        <th className="pb-2.5">Date</th>
                        <th className="pb-2.5">Clinician</th>
                        <th className="pb-2.5">Amount</th>
                        <th className="pb-2.5">Status</th>
                        <th className="pb-2.5">Payment Method</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#263238]/6">
                      {billingData.sessionBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-[#F4F1EC]/40">
                          <td className="py-3 font-mono font-medium text-[#132A24]">
                            {b.bookingReference}
                          </td>
                          <td className="py-3 text-[#66747A]">
                            {new Date(b.slotStart).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </td>
                          <td className="py-3 font-medium text-[#263238]">{b.therapistName}</td>
                          <td className="py-3 font-semibold text-[#132A24]">₹{b.amountRupees}</td>
                          <td className="py-3">
                            <span
                              className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                                b.paymentStatus === 'paid'
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                  : b.paymentStatus === 'refunded'
                                  ? 'bg-blue-50 text-blue-800'
                                  : 'bg-amber-50 text-amber-800'
                              }`}
                            >
                              {b.paymentStatus}
                            </span>
                          </td>
                          <td className="py-3 text-[#66747A]">{b.paymentMethod}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Refund & Invoicing Policy Notice */}
            <div className="bg-[#F4F1EC] border border-[#263238]/8 rounded-xl p-4 text-xs text-[#263238] flex items-start gap-3">
              <CreditCard size={16} className="shrink-0 text-emerald-800 mt-0.5" />
              <div className="space-y-1">
                <span className="font-semibold">Automatic Refund Execution</span>
                <p className="text-[#66747A] leading-relaxed">
                  Cancellations initiated at least 48 hours in advance are immediately credited back to
                  the original payment method via Razorpay. For official insurance or medical claim receipts,
                  contact our finance desk.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 7: SUPPORT & PREFERENCES                                              */}
        {/* ========================================================================= */}
        {activeTab === 'support' && (
          <div className="space-y-6">
            <div className="border-b border-[#263238]/10 pb-4">
              <span className="text-[11px] uppercase tracking-wider font-bold text-emerald-800">
                Care Team &amp; Helplines
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl text-[#132A24] mt-1">Care &amp; Support</h1>
              <p className="text-xs text-[#66747A] mt-1">
                Emergency helplines, therapy coordinators, and relationship management.
              </p>
            </div>

            {/* Emergency Crisis Strip */}
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-xs text-red-900 space-y-3">
              <div className="flex items-center gap-2 text-red-800 font-bold text-sm">
                <PhoneCall size={16} /> 24/7 Immediate Crisis Helplines
              </div>
              <p className="text-red-900/80 leading-relaxed">
                If you or someone close to you is experiencing severe distress, active self-harm thoughts, or
                an emergency, please reach out to dedicated government mental health helplines immediately:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="bg-white p-3 rounded-xl border border-red-200">
                  <div className="text-[10px] uppercase font-bold text-red-700">Tele-MANAS (Govt. of India)</div>
                  <a href="tel:14416" className="text-base font-bold text-red-900 underline block mt-0.5">
                    14416
                  </a>
                  <div className="text-[10px] text-gray-500">Toll-free, 24/7 pan-India</div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-red-200">
                  <div className="text-[10px] uppercase font-bold text-red-700">Kiran Helpline</div>
                  <a href="tel:18005990019" className="text-base font-bold text-red-900 underline block mt-0.5">
                    1800-599-0019
                  </a>
                  <div className="text-[10px] text-gray-500">Ministry of Social Justice</div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-red-200">
                  <div className="text-[10px] uppercase font-bold text-red-700">Vandrevala Foundation</div>
                  <a href="tel:+919999666555" className="text-base font-bold text-red-900 underline block mt-0.5">
                    +91 9999 666 555
                  </a>
                  <div className="text-[10px] text-gray-500">Free, confidential support</div>
                </div>
              </div>
            </div>

            {/* Team Support & Handover */}
            <div className="bg-white border border-[#263238]/10 rounded-2xl p-6 shadow-2xs space-y-4">
              <h3 className="font-serif text-lg text-[#132A24]">Ingress Within Care Coordination</h3>
              <p className="text-xs text-[#66747A] leading-relaxed">
                Need to speak with our clinical coordination team? We can assist with appointment adjustments,
                invoice requests, or therapist reassignment if you ever feel your current clinician isn't the
                right therapeutic fit.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href={`mailto:${SUPPORT_CONFIG.supportEmail}?subject=Therapy Care Assistance Request`}
                  className="bg-[#132A24] text-white hover:bg-[#1C3E35] px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-all shadow-2xs"
                >
                  <MessageCircle size={14} /> Contact Clinical Coordination
                </a>
                <span className="text-xs text-[#66747A]">
                  or call support at{' '}
                  <a href={`tel:${SUPPORT_CONFIG.temporaryContactNumberRaw}`} className="underline font-semibold text-[#132A24]">
                    {SUPPORT_CONFIG.temporaryContactNumber}
                  </a>
                </span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 3. RESCHEDULE MODAL */}
      {rescheduleModalAppt && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 border border-gray-200 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-serif text-lg font-medium text-gray-900">Reschedule Consultation</h3>
              <button
                type="button"
                onClick={() => setRescheduleModalAppt(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleRescheduleSubmit} className="space-y-4">
              <div className="text-xs text-[#66747A]">
                Select a new slot based on <strong>{clinicianName}</strong>'s real Google Calendar:
              </div>

              {loadingSlots ? (
                <div className="py-6 text-center text-xs text-[#66747A]">Loading available slots...</div>
              ) : availableSlots.length === 0 ? (
                <div className="py-4 text-center text-xs text-amber-800 bg-amber-50 rounded-xl p-3">
                  No slots currently available online. Please contact our coordination team.
                </div>
              ) : (
                <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                  {availableSlots.slice(0, 15).map((slot, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`w-full text-left p-2.5 rounded-xl text-xs border transition-all ${
                        selectedSlot === slot
                          ? 'bg-[#132A24] text-white border-[#132A24] font-semibold'
                          : 'border-gray-200 hover:border-gray-300 bg-white text-[#263238]'
                      }`}
                    >
                      {new Date(slot.start).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}{' '}
                      at{' '}
                      {new Date(slot.start).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </button>
                  ))}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#132A24] mb-1">Reason (Optional)</label>
                <textarea
                  value={rescheduleReason}
                  onChange={(e) => setRescheduleReason(e.target.value)}
                  placeholder="Need to move due to scheduling conflict..."
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#132A24]"
                  rows={2}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRescheduleModalAppt(null)}
                  className="px-4 py-2 text-xs text-gray-600 hover:text-gray-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedSlot || rescheduling}
                  className="bg-[#132A24] text-white hover:bg-[#1C3E35] disabled:opacity-40 px-4 py-2 rounded-xl text-xs font-semibold"
                >
                  {rescheduling ? 'Rescheduling...' : 'Confirm Reschedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. CANCEL MODAL */}
      {cancelModalAppt && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 border border-gray-200 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-serif text-lg font-medium text-red-900">Cancel Appointment</h3>
              <button
                type="button"
                onClick={() => setCancelModalAppt(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCancelSubmit} className="space-y-4">
              <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-200 text-xs text-blue-950 space-y-1">
                {cancelModalAppt.policy?.refundEligible ? (
                  <p>
                    <strong className="text-emerald-800">100% Refund Eligible:</strong> You are cancelling more than 48 hours in advance.
                    An automatic refund will be credited to your original payment method.
                  </p>
                ) : cancelModalAppt.policy?.hoursUntilSession >= 24 ? (
                  <p>
                    <strong className="text-amber-800">Policy Review Window:</strong> You are cancelling between 24 and 48 hours in advance.
                    Your cancellation will be submitted for care-team review regarding credit or refund eligibility.
                  </p>
                ) : (
                  <p>
                    <strong className="text-red-800">Non-refundable:</strong> This session is scheduled within 24 hours. According to clinical policy,
                    cancellations made under 24 hours are strictly non-refundable.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#132A24] mb-1">
                  Reason for Cancellation
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Please let us know why you need to cancel..."
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-red-700"
                  rows={3}
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCancelModalAppt(null)}
                  className="px-4 py-2 text-xs text-gray-600 hover:text-gray-800 font-medium"
                >
                  Keep Appointment
                </button>
                <button
                  type="submit"
                  disabled={cancelling}
                  className="bg-red-700 text-white hover:bg-red-800 disabled:opacity-40 px-4 py-2 rounded-xl text-xs font-semibold"
                >
                  {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. CLIENT HOMEWORK MODAL */}
      {selectedHomeworkId && (
        <ClientHomeworkModal
          assignmentId={selectedHomeworkId}
          onClose={() => setSelectedHomeworkId(null)}
          onSuccess={() => {
            fetchHomework();
          }}
        />
      )}

      {/* 6. DIRECT THERAPY BOOKING FLOW MODAL */}
      <TherapyBookingFlow
        isOpen={bookingFlowOpen}
        onClose={() => setBookingFlowOpen(false)}
        initialTherapist={bookingTherapist}
        onSuccess={() => {
          setBookingFlowOpen(false);
          fetchSessions();
          fetchBilling();
          onRefreshRelationship && onRefreshRelationship();
        }}
        user={user}
      />
    </div>
  );
}
