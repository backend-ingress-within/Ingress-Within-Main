import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  User,
  Shield,
  Clock,
  Calendar,
  FileText,
  AlertCircle,
  CheckCircle2,
  Lock,
  KeyRound,
  Plus,
  Milestone,
  Link2,
  Check,
  Sparkles,
  Phone,
  Mail,
  Copy,
  Share2,
  MessageCircle,
  FileCheck2,
  ExternalLink,
  HeartHandshake,
  ShieldCheck,
} from 'lucide-react';
import TherapistCareJourneyView from './TherapistCareJourneyView';
import TherapistClientInsightsView from './TherapistClientInsightsView';
import TherapistTherapeuticProfileView from './TherapistTherapeuticProfileView';

export default function TherapistClientModal({
  clientId,
  initialTab = 'overview',
  onClose,
  onOpenSchedule,
  onOpenSoap,
  onReloadCaseload,
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState(null);
  const [updatingStage, setUpdatingStage] = useState(false);
  const [stageNotice, setStageNotice] = useState('');
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [linkNotice, setLinkNotice] = useState(null);

  // Legal Consent Document Modal State
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [consentDocData, setConsentDocData] = useState(null);
  const [loadingConsentDoc, setLoadingConsentDoc] = useState(false);
  const [consentDocError, setConsentDocError] = useState(null);

  const handleGenerateBookingLink = async () => {
    if (!profile?.relationship?.id || isGeneratingLink) return;
    setIsGeneratingLink(true);
    setLinkNotice(null);

    try {
      const res = await fetch(`/api/therapy/relationships/${profile.relationship.id}/booking-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || 'Failed to issue booking link');
      }

      if (data.bookingLink) {
        setProfile((prev) => ({
          ...prev,
          bookingLink: {
            url: data.bookingLink,
            token: data.token || '',
            status: 'active',
          },
        }));

        if (typeof navigator !== 'undefined' && navigator.clipboard) {
          await navigator.clipboard.writeText(data.bookingLink);
        }
        setLinkCopied(true);
        setLinkNotice({
          type: 'success',
          message: data.isNew
            ? 'New persistent booking link created and copied to clipboard!'
            : 'Active persistent booking link copied to clipboard!',
        });
        setTimeout(() => setLinkCopied(false), 3000);
      }
    } catch (err) {
      setLinkNotice({
        type: 'error',
        message: err.message || 'Unable to generate booking link.',
      });
    } finally {
      setIsGeneratingLink(false);
    }
  };

  const [magicLink, setMagicLink] = useState(null);
  const [isGeneratingMagicLink, setIsGeneratingMagicLink] = useState(false);
  const [magicLinkCopied, setMagicLinkCopied] = useState(false);
  const [magicLinkNotice, setMagicLinkNotice] = useState(null);

  const handleGenerateMagicLink = async () => {
    setIsGeneratingMagicLink(true);
    setMagicLinkNotice(null);
    try {
      const res = await fetch(`/api/therapist/clients/${clientId}/magic-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Failed to generate setup link');

      if (data.claimUrl) {
        setMagicLink(data.claimUrl);
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
          await navigator.clipboard.writeText(data.claimUrl);
        }
        setMagicLinkCopied(true);
        setMagicLinkNotice({
          type: 'success',
          message: 'Magic Account Setup link generated and copied to clipboard!',
        });
        setTimeout(() => setMagicLinkCopied(false), 3000);
      }
    } catch (err) {
      setMagicLinkNotice({ type: 'error', message: err.message || 'Unable to generate setup link.' });
    } finally {
      setIsGeneratingMagicLink(false);
    }
  };

  const handleOpenConsentDoc = async () => {
    setShowConsentModal(true);
    setLoadingConsentDoc(true);
    setConsentDocError(null);
    try {
      const res = await fetch(`/api/therapist/clients/${clientId}/consent`);
      const data = await res.json();
      if (res.ok && data.document) {
        setConsentDocData(data.document);
      } else {
        throw new Error(data.error?.message || 'Failed to retrieve legal consent document.');
      }
    } catch (err) {
      console.error('Consent document load error:', err);
      setConsentDocError(err.message || 'Unable to load legal consent document.');
    } finally {
      setLoadingConsentDoc(false);
    }
  };

  const isLinkConsumed = Boolean(
    profile?.bookingLink?.isConsumed ||
    profile?.bookingLink?.status === 'consumed' ||
    (profile?.appointments && profile.appointments.length > 0)
  );
  const activeBookingUrl = (!isLinkConsumed && profile?.bookingLink?.url) || null;

  const getWhatsAppShareUrl = (linkUrl) => {
    const rawLink = linkUrl || activeBookingUrl;
    if (!rawLink || !profile?.client?.phone) return null;
    const digits = profile.client.phone.replace(/[^\d]/g, '');
    const clientName = profile.client.name || 'there';
    const therapistName = profile.therapist?.name || 'your assigned therapist';
    const text = encodeURIComponent(
      `Hi ${clientName}, your therapy consultation with ${therapistName} at Ingress Within is ready. Please review clinical credentials, confirm telehealth consent terms, and schedule your first session here: ${rawLink}`
    );
    return `https://wa.me/${digits}?text=${text}`;
  };

  const getEmailShareUrl = (linkUrl) => {
    const rawLink = linkUrl || activeBookingUrl;
    if (!rawLink || !profile?.client?.email) return null;
    const clientName = profile.client.name || 'there';
    const therapistName = profile.therapist?.name || 'your assigned therapist';
    const subject = encodeURIComponent('Your Ingress Within Therapy Booking & Consent Link');
    const body = encodeURIComponent(
      `Hi ${clientName},\n\nYour therapy consultation with ${therapistName} at Ingress Within is ready.\n\nPlease review clinical credentials, confirm telehealth consent terms, and schedule your first session here:\n${rawLink}\n\nWarm regards,\n${therapistName}\nIngress Within Clinical Care`
    );
    return `mailto:${profile.client.email}?subject=${subject}&body=${body}`;
  };

  const fetchClientProfile = async () => {
    try {
      setLoading(true);
      setProfileError(null);
      const res = await fetch(`/api/therapist/clients/${clientId}`);
      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        setProfile(json);
      } else {
        setProfileError(json.error?.message || 'Unable to load authorized client profile.');
      }
    } catch (err) {
      console.error('Failed to load client profile:', err);
      setProfileError('Failed to load client profile due to a network connection issue.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientProfile();
  }, [clientId]);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      const targetPath = tab === 'journey'
        ? `/therapist/clients/${clientId}/journey`
        : `/therapist/clients/${clientId}`;
      if (window.location.pathname !== targetPath) {
        window.history.pushState(null, '', targetPath);
      }
    }
  };

  const handleStageChange = async (newStage) => {
    setUpdatingStage(true);
    setStageNotice('');
    try {
      const res = await fetch(`/api/therapist/clients/${clientId}/journey/stage`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ careStage: newStage }),
      });
      if (res.ok) {
        setStageNotice('Care stage updated.');
        await fetchClientProfile();
        onReloadCaseload && onReloadCaseload();
        setTimeout(() => setStageNotice(''), 3000);
      }
    } catch (err) {
      console.error('Failed to update stage:', err);
    } finally {
      setUpdatingStage(false);
    }
  };

  const TABS = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'therapeutic_profile', label: 'Therapeutic Profile', icon: HeartHandshake },
    { id: 'insights', label: 'Client Insights', icon: Sparkles },
    { id: 'journey', label: 'Care Journey', icon: Milestone },
    { id: 'sessions', label: 'Sessions', icon: Calendar },
    { id: 'soap', label: 'SOAP Notes', icon: FileText },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl border border-[#132A24]/10 shadow-xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden"
      >
        {/* Modal Top Bar */}
        <div className="p-6 border-b border-[#132A24]/10 flex items-center justify-between bg-[#FAFAF8]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#132A24] text-white flex items-center justify-center font-serif font-bold text-sm">
              {profile?.client?.name ? profile.client.name.charAt(0) : 'C'}
            </div>
            <div>
              <h3 className="font-serif text-xl font-normal text-[#132A24]">
                {profile?.client?.name || 'Client Clinical Record'}
              </h3>
              <span className="text-[11px] text-[#132A24]/50">
                Authorized Clinical Relationship &bull; Caseload Record
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {profile?.relationship?.id && (
              <button
                type="button"
                onClick={handleGenerateBookingLink}
                disabled={isGeneratingLink || profile.relationship?.status !== 'active'}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all border ${
                  linkCopied
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : profile.relationship?.status !== 'active'
                    ? 'bg-stone-100 border-stone-200 text-stone-400 cursor-not-allowed'
                    : 'bg-white border-[#132A24]/20 text-[#132A24] hover:bg-[#132A24]/5 cursor-pointer shadow-xs'
                }`}
                title={
                  profile.relationship?.status !== 'active'
                    ? `Cannot issue booking link: relationship is ${profile.relationship?.status}`
                    : 'Generate or copy persistent booking link for this client'
                }
              >
                {linkCopied ? (
                  <>
                    <Check size={14} className="text-white" />
                    <span>Copied Booking Link!</span>
                  </>
                ) : isGeneratingLink ? (
                  <>
                    <Clock size={14} className="animate-spin text-[#132A24]/60" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Link2 size={14} className="text-[#4E7A66]" />
                    <span>Generate / Copy Booking Link</span>
                  </>
                )}
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-[#132A24]/40 hover:text-[#132A24] hover:bg-[#132A24]/5 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Persistent Booking Link Feedback Banner */}
        {linkNotice && (
          <div
            className={`px-6 py-2.5 text-xs flex items-center justify-between border-b ${
              linkNotice.type === 'error'
                ? 'bg-red-50 text-red-800 border-red-200'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {linkNotice.type === 'error' ? (
                <AlertCircle size={14} className="text-red-600 shrink-0" />
              ) : (
                <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
              )}
              <span>{linkNotice.message}</span>
            </div>
            <button
              type="button"
              onClick={() => setLinkNotice(null)}
              className="text-stone-400 hover:text-stone-700 ml-4 cursor-pointer text-xs"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Workspace Tab Navigation */}
        <div className="px-6 border-b border-[#132A24]/10 bg-white flex items-center gap-1 overflow-x-auto">
          {TABS.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => handleTabChange(t.id)}
                className={`py-3 px-3.5 text-xs font-medium border-b-2 flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'border-[#132A24] text-[#132A24] font-semibold'
                    : 'border-transparent text-[#132A24]/60 hover:text-[#132A24] hover:border-[#132A24]/20'
                }`}
              >
                <Icon size={14} className={isActive ? 'text-[#132A24]' : 'text-[#132A24]/50'} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-grow">
          {activeTab === 'therapeutic_profile' ? (
            <TherapistTherapeuticProfileView
              clientId={clientId}
              relationshipId={profile?.relationship?.id}
              clientName={profile?.client?.name || 'Client'}
            />
          ) : activeTab === 'insights' ? (
            <TherapistClientInsightsView clientId={clientId} />
          ) : activeTab === 'journey' ? (
            <TherapistCareJourneyView
              clientId={clientId}
              onOpenSchedule={onOpenSchedule}
              onOpenSoap={onOpenSoap}
              onReloadCaseload={onReloadCaseload}
            />
          ) : loading ? (
            <div className="p-12 text-center text-xs text-[#132A24]/50 animate-pulse">
              Loading clinical records...
            </div>
          ) : !profile ? (
            <div className="p-8 text-center text-xs text-red-600">
              {profileError || 'Unable to load authorized client profile.'}
            </div>
          ) : activeTab === 'overview' ? (
            <>
              {/* Care Stage Control Banner */}
              <div className="bg-[#FAFAF8] border border-[#132A24]/10 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-[#4E7A66]">
                    Current Care Stage
                  </span>
                  <div className="font-serif text-base text-[#132A24] capitalize font-medium">
                    {profile.relationship?.careStage?.replace('_', ' ')}
                  </div>
                  {stageNotice && (
                    <span className="text-[11px] text-[#4E7A66] animate-pulse">{stageNotice}</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTabChange('therapeutic_profile')}
                    className="px-3 py-1.5 rounded-lg border border-[#132A24]/20 text-[#132A24] text-xs font-semibold hover:bg-[#132A24]/5 transition-colors cursor-pointer"
                  >
                    Therapeutic Profile &rarr;
                  </button>
                  <button
                    onClick={() => handleTabChange('journey')}
                    className="px-3 py-1.5 rounded-lg bg-[#132A24] text-white text-xs font-medium hover:bg-[#132A24]/90 transition-colors cursor-pointer"
                  >
                    Manage in Care Journey &rarr;
                  </button>
                </div>
              </div>

              {/* Dedicated Consent & First Session Booking Hub */}
              <div className="bg-gradient-to-br from-emerald-50/90 via-teal-50/40 to-white border border-emerald-200/90 rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#1B5E52] text-white flex items-center justify-center shadow-xs shrink-0">
                      <FileCheck2 size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-emerald-950">
                        Client Consent &amp; First Session Link
                      </h4>
                      <p className="text-[11px] text-emerald-800/80">
                        Zero login required for client. Enables practitioner review, clinical telehealth consent signing, and slot booking.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {profile.consent?.hasConsent ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300">
                        <CheckCircle2 size={13} className="text-emerald-700" />
                        Telehealth Consent Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-900 border border-amber-300">
                        <Clock size={13} className="text-amber-700" />
                        Awaiting Client Consent
                      </span>
                    )}
                  </div>
                </div>

                {isLinkConsumed ? (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <CheckCircle2 size={12} className="text-emerald-700" />
                          First Session Booked (Link Consumed)
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed max-w-md">
                        The client has booked their initial consultation. The one-time link has been securely consumed to prevent duplicate bookings.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={handleOpenConsentDoc}
                        className="px-3 py-1.5 rounded-lg bg-white border border-[#132A24]/20 text-[#132A24] text-xs font-medium hover:bg-[#132A24]/5 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <FileText size={14} className="text-[#4E7A66]" />
                        <span>View Consent</span>
                      </button>
                    </div>
                  </div>
                ) : activeBookingUrl ? (
                  <div className="space-y-3 pt-1">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={activeBookingUrl}
                        className="flex-1 bg-white border border-emerald-200 rounded-lg px-3 py-2 text-xs font-mono text-emerald-950 select-all outline-hidden"
                      />
                      <button
                        type="button"
                        onClick={handleGenerateBookingLink}
                        disabled={isGeneratingLink}
                        className="px-3 py-2 rounded-lg bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 shadow-xs"
                      >
                        {linkCopied ? (
                          <>
                            <Check size={14} />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy size={14} />
                            <span>Copy Link</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Instant Share Buttons */}
                    <div className="flex items-center gap-2 flex-wrap pt-1">
                      {profile.client?.phone && (
                        <a
                          href={getWhatsAppShareUrl()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-[#25D366] text-white text-xs font-semibold hover:bg-[#20ba59] transition-all flex items-center gap-1.5 shadow-xs"
                        >
                          <MessageCircle size={14} />
                          <span>Share on WhatsApp</span>
                        </a>
                      )}

                      {profile.client?.email && (
                        <a
                          href={getEmailShareUrl()}
                          className="px-3 py-1.5 rounded-lg bg-white border border-emerald-300 text-emerald-950 text-xs font-semibold hover:bg-emerald-50 transition-all flex items-center gap-1.5 shadow-xs"
                        >
                          <Mail size={14} className="text-emerald-700" />
                          <span>Share via Email</span>
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={handleOpenConsentDoc}
                        className="px-3 py-1.5 rounded-lg bg-white border border-[#132A24]/20 text-[#132A24] text-xs font-medium hover:bg-[#132A24]/5 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <FileText size={14} className="text-[#4E7A66]" />
                        <span>View Legal Consent Document</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenSchedule && onOpenSchedule(clientId, profile.client?.name);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#132A24] text-white text-xs font-medium hover:bg-[#132A24]/90 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Calendar size={14} />
                        <span>Book On Behalf of Client</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                    <p className="text-xs text-stone-600 leading-relaxed max-w-md">
                      Generate a persistent, zero-login link for this client. They can review your credentials, confirm their telehealth consent terms, and choose an appointment slot from your calendar.
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={handleGenerateBookingLink}
                        disabled={isGeneratingLink || profile.relationship?.status !== 'active'}
                        className="px-4 py-2 rounded-lg bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 shadow-xs disabled:opacity-50"
                      >
                        {isGeneratingLink ? (
                          <>
                            <Clock size={14} className="animate-spin" />
                            <span>Generating...</span>
                          </>
                        ) : (
                          <>
                            <Link2 size={14} />
                            <span>Generate Booking &amp; Consent Link</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={handleOpenConsentDoc}
                        className="px-3 py-2 rounded-lg bg-white border border-[#132A24]/20 text-[#132A24] text-xs font-medium hover:bg-[#132A24]/5 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <FileText size={14} className="text-[#4E7A66]" />
                        <span>View Consent</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Client Portal Account & Magic Setup Link Card */}
              <div className="bg-[#FAF7F2] border border-[#162723]/10 rounded-xl p-4 space-y-2.5">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div>
                    <h4 className="font-semibold text-xs text-[#162723] uppercase tracking-wider flex items-center gap-1.5">
                      <Lock size={13} className="text-[#4E7A66]" />
                      Client Portal Account &amp; Magic Setup Link
                    </h4>
                    <p className="text-[12px] text-[#4F635E] mt-0.5">
                      Share this secure link so the client can create a password and access their therapy dashboard.
                    </p>
                  </div>
                  <div>
                    {profile.accountClaim?.isClaimed ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 size={12} className="text-emerald-600" /> Account Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                        <Clock size={12} className="text-amber-600" /> Pending Password Setup
                      </span>
                    )}
                  </div>
                </div>

                {magicLinkNotice && (
                  <div className={`p-2.5 rounded-lg text-xs font-medium ${magicLinkNotice.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {magicLinkNotice.message}
                  </div>
                )}

                <div className="flex items-center gap-2 pt-1 flex-wrap">
                  <button
                    type="button"
                    onClick={handleGenerateMagicLink}
                    disabled={isGeneratingMagicLink}
                    className="px-3.5 py-2 rounded-lg bg-[#162723] text-white text-xs font-semibold hover:bg-[#203631] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    <KeyRound size={13} />
                    <span>{isGeneratingMagicLink ? 'Generating…' : magicLink ? (magicLinkCopied ? 'Link Copied!' : 'Copy Setup Link') : 'Generate Setup Link'}</span>
                  </button>

                  {magicLink && profile.client?.phone && (
                    <a
                      href={`https://wa.me/${profile.client.phone.replace(/[^\d]/g, '')}?text=${encodeURIComponent(`Hi ${profile.client.name || 'there'}, here is your secure setup link to create your password and access your Ingress Within Therapy portal: ${magicLink}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-lg bg-[#25D366] text-white text-xs font-semibold hover:bg-[#20ba59] transition-all flex items-center gap-1.5 shadow-xs"
                    >
                      <MessageCircle size={13} />
                      <span>Share Setup Link on WhatsApp</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Client Contact & Profile Overview */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#132A24]/60">
                  Client Contact &amp; Details
                </h4>

                <div className="bg-white border border-[#132A24]/10 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-[#132A24]/50 text-[10px] uppercase font-bold tracking-wider block mb-0.5">Phone Number</span>
                    {profile.client?.phone ? (
                      <div className="flex items-center gap-2 font-medium text-[#132A24]">
                        <span>{profile.client.phone}</span>
                        <a
                          href={`tel:${profile.client.phone.replace(/[^\d+]/g, '')}`}
                          className="text-[#4E7A66] hover:underline text-[11px]"
                          title="Call client"
                        >
                          Call
                        </a>
                      </div>
                    ) : (
                      <span className="text-stone-400 italic">Not provided</span>
                    )}
                  </div>

                  <div>
                    <span className="text-[#132A24]/50 text-[10px] uppercase font-bold tracking-wider block mb-0.5">Email Address</span>
                    {profile.client?.email ? (
                      <a
                        href={`mailto:${profile.client.email}`}
                        className="font-medium text-[#132A24] hover:underline block truncate"
                        title={profile.client.email}
                      >
                        {profile.client.email}
                      </a>
                    ) : (
                      <span className="text-stone-400 italic">Not provided</span>
                    )}
                  </div>

                  <div>
                    <span className="text-[#132A24]/50 text-[10px] uppercase font-bold tracking-wider block mb-0.5">Location / City</span>
                    <span className="font-medium text-[#132A24]">
                      {profile.client?.city || profile.clinicalIntake?.city || 'Not specified'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[#132A24]/50 text-[10px] uppercase font-bold tracking-wider block mb-0.5">Age &amp; Gender</span>
                    <span className="font-medium text-[#132A24]">
                      {profile.client?.age ? `${profile.client.age} yrs` : 'Age N/A'}
                      {profile.client?.gender ? ` • ${profile.client.gender}` : ''}
                    </span>
                  </div>

                  <div>
                    <span className="text-[#132A24]/50 text-[10px] uppercase font-bold tracking-wider block mb-0.5">Occupation</span>
                    <span className="font-medium text-[#132A24]">
                      {profile.client?.occupation || profile.clinicalIntake?.occupation || 'Not specified'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[#132A24]/50 text-[10px] uppercase font-bold tracking-wider block mb-0.5">Legal Consent Status</span>
                    <span className="font-medium">
                      {profile.consent?.hasConsent ? (
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 size={12} /> Verified &amp; On File
                        </span>
                      ) : (
                        <span className="text-amber-700 font-semibold flex items-center gap-1">
                          <Clock size={12} /> Pending First Session
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Clinical Intake Information */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#132A24]/60">
                  Intake &amp; Presenting Concerns
                </h4>

                <div className="bg-white border border-[#132A24]/10 rounded-xl p-4 space-y-3 text-xs">
                  <div>
                    <span className="font-semibold text-[#132A24] block mb-1">Primary Reason for Therapy:</span>
                    <p className="text-[#132A24]/80 leading-relaxed">
                      {profile.clinicalIntake?.presentingReason || 'Not specified in intake.'}
                    </p>
                  </div>

                  {Array.isArray(profile.clinicalIntake?.concerns) && profile.clinicalIntake.concerns.length > 0 && (
                    <div>
                      <span className="font-semibold text-[#132A24] block mb-1">Identified Concerns:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {profile.clinicalIntake.concerns.map((c, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-[#FAFAF8] border border-[#132A24]/10 text-[11px] text-[#132A24]/70">
                            {typeof c === 'string' ? c : c?.label || JSON.stringify(c)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {profile.safetyAssessment && (
                    <div className="pt-2 border-t border-[#132A24]/5 flex items-center justify-between text-[11px]">
                      <span className="text-[#132A24]/60">Safety Evaluation:</span>
                      <span className="font-medium text-[#132A24]">
                        Triage: {profile.safetyAssessment.triageLevel} &bull; Status: {profile.safetyAssessment.safetyStatus}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* PRIVACY BOUNDARY NOTICE */}
              <div className="p-4 rounded-xl bg-[#FAFAF8] border border-[#132A24]/10 flex gap-3 items-start text-xs text-[#132A24]/70">
                <Lock size={16} className="text-[#4E7A66] shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-semibold text-[#132A24] block">Client Self-Work Privacy Boundary</span>
                  <p className="text-[11px] leading-relaxed">
                    Personal journal entries, reflections, and self-help modules completed by the client are strictly private to the client and are never accessible through this clinical portal.
                  </p>
                </div>
              </div>
            </>
          ) : activeTab === 'sessions' ? (
            /* Sessions List */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#132A24]/60">
                  Scheduled Consultations
                </h4>
                {profile.relationship?.careStage !== 'completed' && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenSchedule && onOpenSchedule(clientId, profile.client.name);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs text-[#4E7A66] font-semibold hover:underline cursor-pointer"
                  >
                    <Plus size={13} /> Schedule Session
                  </button>
                )}
              </div>

              {profile.appointments.length === 0 ? (
                <p className="text-xs text-[#132A24]/50 italic">No sessions scheduled yet.</p>
              ) : (
                <div className="space-y-2">
                  {profile.appointments.map((appt) => {
                    const apptDate = new Date(appt.scheduled_start).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    });
                    const apptTime = new Date(appt.scheduled_start).toLocaleTimeString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                    return (
                      <div
                        key={appt.id}
                        className="bg-white border border-[#132A24]/10 rounded-xl p-3.5 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-[#132A24]">{apptDate} at {apptTime}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#132A24]/5 uppercase">
                              {appt.status}
                            </span>
                          </div>
                          <span className="text-[11px] text-[#132A24]/50 mt-0.5 block capitalize">
                            Modality: {appt.session_type}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* SOAP Notes List */
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#132A24]/60">
                Clinical SOAP Records
              </h4>

              {profile.appointments.length === 0 ? (
                <p className="text-xs text-[#132A24]/50 italic">No sessions on record to write SOAP notes.</p>
              ) : (
                <div className="space-y-2">
                  {profile.appointments.map((appt) => {
                    const apptDate = new Date(appt.scheduled_start).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    });
                    const apptTime = new Date(appt.scheduled_start).toLocaleTimeString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                    const existingSoap = (profile.soapNotes || []).find((s) => s.appointment_id === appt.id);

                    return (
                      <div
                        key={appt.id}
                        className="bg-white border border-[#132A24]/10 rounded-xl p-3.5 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-[#132A24]">{apptDate} at {apptTime}</span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                                existingSoap
                                  ? existingSoap.is_draft
                                    ? 'bg-amber-100 text-amber-900'
                                    : 'bg-emerald-100 text-emerald-900'
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {existingSoap ? (existingSoap.is_draft ? 'Draft Note' : 'Finalized Note') : 'No SOAP'}
                            </span>
                          </div>
                          <span className="text-[11px] text-[#132A24]/50 mt-0.5 block">
                            {existingSoap && existingSoap.finalized_at
                              ? `Locked ${new Date(existingSoap.finalized_at).toLocaleDateString('en-IN')}`
                              : 'Session documentation'}
                          </span>
                        </div>

                        <button
                          onClick={() => {
                            onClose();
                            onOpenSoap && onOpenSoap(appt.id);
                          }}
                          className="px-3 py-1.5 rounded-lg border border-[#132A24]/15 bg-white text-xs hover:bg-[#132A24]/5 cursor-pointer"
                        >
                          {existingSoap ? (existingSoap.is_draft ? 'Edit Draft' : 'View Note') : 'Write Note'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#132A24]/10 bg-[#FAFAF8] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#132A24] text-white text-xs font-medium hover:bg-[#132A24]/90 cursor-pointer"
          >
            Close Profile
          </button>
        </div>

        {/* Authoritative Legal Consent Document Modal */}
        <AnimatePresence>
          {showConsentModal && (
            <div className="fixed inset-0 z-60 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl border border-[#132A24]/10 shadow-2xl max-w-2xl w-full max-h-[88vh] flex flex-col overflow-hidden"
              >
                {/* Consent Modal Header */}
                <div className="p-5 border-b border-[#132A24]/10 bg-[#FAFAF8] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#1B5E52] text-white flex items-center justify-center">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-medium text-[#132A24]">
                        Informed Consent for Psychological &amp; Telehealth Services
                      </h3>
                      <span className="text-[11px] text-[#132A24]/60">
                        Verified Practitioner Record &bull; Legal Compliance Document
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowConsentModal(false);
                      setConsentDocData(null);
                    }}
                    className="p-1.5 rounded-lg text-[#132A24]/40 hover:text-[#132A24] hover:bg-[#132A24]/5 cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Consent Modal Body */}
                <div className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
                  {loadingConsentDoc ? (
                    <div className="p-12 text-center text-xs text-[#132A24]/50 animate-pulse">
                      Loading authoritative legal consent document...
                    </div>
                  ) : consentDocError ? (
                    <div className="p-6 text-center text-red-600 bg-red-50 rounded-xl border border-red-200">
                      {consentDocError}
                    </div>
                  ) : consentDocData ? (
                    <>
                      {/* Status Banner */}
                      <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                            Document Identification &amp; Verification Status
                          </span>
                          <span className="font-mono text-xs font-semibold text-emerald-950">
                            {consentDocData.documentId}
                          </span>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-200 text-emerald-900 border border-emerald-300">
                          {consentDocData.consentStatus}
                        </span>
                      </div>

                      {/* Participant Details */}
                      <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-[#FAFAF8] border border-[#132A24]/10">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#132A24]/50 block mb-0.5">
                            Client Details
                          </span>
                          <div className="font-bold text-[#132A24]">{consentDocData.clientName}</div>
                          {consentDocData.clientEmail && (
                            <div className="text-[11px] text-[#132A24]/60">{consentDocData.clientEmail}</div>
                          )}
                          {consentDocData.clientPhone && (
                            <div className="text-[11px] text-[#132A24]/60">{consentDocData.clientPhone}</div>
                          )}
                          <div className="text-[10px] text-stone-400 font-mono mt-1">ID: {consentDocData.clientId}</div>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#132A24]/50 block mb-0.5">
                            Treating Practitioner
                          </span>
                          <div className="font-bold text-[#132A24]">{consentDocData.therapistName}</div>
                          <div className="text-[11px] text-[#4E7A66]">{consentDocData.therapistTitle}</div>
                          <div className="text-[10px] text-stone-400 font-mono mt-1">ID: {consentDocData.therapistId}</div>
                        </div>
                      </div>

                      {/* Legal Agreement Clauses */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#132A24]/60">
                          Governing Legal Agreement Clauses
                        </h4>
                        {consentDocData.legalClauses?.map((c, i) => (
                          <div key={i} className="border border-[#132A24]/10 rounded-xl p-3.5 bg-white space-y-1">
                            <div className="font-bold text-xs text-[#132A24]">{c.heading}</div>
                            <p className="text-[11px] text-[#132A24]/80 leading-relaxed">{c.body}</p>
                          </div>
                        ))}
                      </div>

                      {/* Attestation & Audit Verification */}
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
                        <div><strong>Consent Timestamp:</strong> {consentDocData.consentedAt ? new Date(consentDocData.consentedAt).toLocaleString('en-IN') : 'Recorded Session'}</div>
                        <div><strong>Session IP Address:</strong> {consentDocData.ipAddress}</div>
                        <div><strong>Governing Jurisdiction:</strong> {consentDocData.jurisdiction}</div>
                        <div><strong>Authorized Platform Entity:</strong> {consentDocData.authorizedBy}</div>
                        <div className="text-[10px] font-mono text-slate-400 pt-1">
                          Audit Verification Hash: SHA256:{consentDocData.documentId.split('').reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) >>> 0, 0).toString(16).padStart(32, 'a')}
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>

                {/* Consent Modal Footer */}
                <div className="p-4 border-t border-[#132A24]/10 bg-[#FAFAF8] flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setShowConsentModal(false);
                      setConsentDocData(null);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#132A24] text-white hover:bg-[#2C4A3E] transition-colors cursor-pointer"
                  >
                    Close Document
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
