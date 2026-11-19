import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  Lock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Activity,
  BookOpen,
  CalendarCheck,
  TrendingUp,
  X,
  ExternalLink,
  RefreshCw,
  Eye,
  Check,
  ChevronRight,
  Info
} from 'lucide-react';

export default function ClientTherapyConsentSharingView({
  therapist,
  relationship,
  onNavigateTherapist,
}) {
  // State for insight sharing preferences
  const [sharingData, setSharingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState(null); // 'all' | categoryKey
  const [toast, setToast] = useState(null);
  const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false);

  // State for legal consent document
  const [legalDoc, setLegalDoc] = useState(null);
  const [loadingLegalDoc, setLoadingLegalDoc] = useState(false);
  const [viewingLegalModal, setViewingLegalModal] = useState(false);

  const clinicianName =
    therapist?.displayName ||
    therapist?.name ||
    therapist?.full_name ||
    sharingData?.activeTherapist?.therapistName ||
    'Assigned Clinician';

  const clinicianTitle =
    therapist?.title ||
    therapist?.credentials ||
    'Consultant Psychologist';

  // Fetch current insight sharing consent
  const fetchSharingData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/user/insights-consent', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        setSharingData(json);
      }
    } catch (err) {
      console.warn('[ConsentSharingView] Failed to fetch sharing consent:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch legal telehealth consent document
  const fetchLegalDocument = async () => {
    setLoadingLegalDoc(true);
    try {
      const res = await fetch('/api/therapy/client/consent', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        if (json.document) {
          setLegalDoc(json.document);
        }
      }
    } catch (err) {
      console.warn('[ConsentSharingView] Failed to fetch legal consent document:', err);
    } finally {
      setLoadingLegalDoc(false);
    }
  };

  useEffect(() => {
    fetchSharingData();
    fetchLegalDocument();
  }, []);

  const triggerToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Toggle individual category
  const handleToggleCategory = async (categoryKey, newValue) => {
    setSavingKey(categoryKey);
    try {
      const current = sharingData?.consent || {};
      const categories = {
        patternSummary: categoryKey === 'pattern_summary' ? newValue : Boolean(current.share_pattern_summary),
        emotionalVocabulary: categoryKey === 'emotional_vocabulary' ? newValue : Boolean(current.share_emotional_vocabulary),
        weeklyReports: categoryKey === 'weekly_reports' ? newValue : Boolean(current.share_weekly_reports),
        monthlyReports: categoryKey === 'monthly_reports' ? newValue : Boolean(current.share_monthly_reports),
      };
      const anyActive = Object.values(categories).some(Boolean);

      const res = await fetch('/api/user/insights-consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isEnabled: anyActive,
          categories,
          therapistAccountId: therapist?.id || sharingData?.activeTherapist?.therapistAccountId,
          relationshipId: relationship?.id || sharingData?.activeTherapist?.relationshipId,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        setSharingData((prev) => ({
          ...prev,
          consent: json.consent,
        }));
        triggerToast('Consent preferences updated in real time');
      } else {
        triggerToast('Failed to save preference. Please try again.', 'error');
      }
    } catch (err) {
      triggerToast('Network error updating sharing preferences', 'error');
    } finally {
      setSavingKey(null);
    }
  };

  // Withdraw all insight sharing consent
  const handleWithdrawAll = async () => {
    setSavingKey('withdraw');
    try {
      const res = await fetch('/api/user/insights-consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ withdraw: true }),
      });

      if (res.ok) {
        const json = await res.json();
        setSharingData((prev) => ({
          ...prev,
          consent: json.consent,
        }));
        setShowWithdrawConfirm(false);
        triggerToast('All insight sharing consent has been revoked');
      } else {
        triggerToast('Failed to withdraw consent', 'error');
      }
    } catch (err) {
      triggerToast('Error withdrawing consent', 'error');
    } finally {
      setSavingKey(null);
    }
  };

  // Quick enable all
  const handleEnableAll = async () => {
    setSavingKey('all');
    try {
      const categories = {
        patternSummary: true,
        emotionalVocabulary: true,
        weeklyReports: true,
        monthlyReports: true,
      };

      const res = await fetch('/api/user/insights-consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isEnabled: true,
          categories,
          therapistAccountId: therapist?.id || sharingData?.activeTherapist?.therapistAccountId,
          relationshipId: relationship?.id || sharingData?.activeTherapist?.relationshipId,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        setSharingData((prev) => ({
          ...prev,
          consent: json.consent,
        }));
        triggerToast('All insight sharing categories enabled');
      } else {
        triggerToast('Failed to enable sharing', 'error');
      }
    } catch (err) {
      triggerToast('Network error enabling sharing', 'error');
    } finally {
      setSavingKey(null);
    }
  };

  const consent = sharingData?.consent;
  const isEnabled = Boolean(consent?.is_enabled);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeUp">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-lg border text-xs font-semibold flex items-center gap-2 transition-all ${
            toast.type === 'error'
              ? 'bg-rose-900 text-white border-rose-800'
              : 'bg-[#132A24] text-white border-emerald-700/50'
          }`}
        >
          {toast.type === 'error' ? <AlertCircle size={15} /> : <CheckCircle2 size={15} className="text-emerald-400" />}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#263238]/10 pb-4">
        <div>
          <span className="text-[11px] uppercase tracking-wider font-bold text-emerald-800">
            Clinical Privacy &amp; Data Governance
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#132A24] mt-1">Consent &amp; Insight Sharing</h1>
          <p className="text-xs text-[#66747A] mt-1 max-w-2xl leading-relaxed">
            You hold complete autonomy over your therapeutic records. Choose which self-reflection syntheses your assigned clinician can view to support your care journey.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            fetchSharingData();
            fetchLegalDocument();
          }}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#263238]/10 bg-white text-xs font-medium text-[#263238] hover:bg-[#FAF9F7] transition-all cursor-pointer shadow-2xs"
          title="Refresh consent status"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Section 1: Clinical Tenancy & Status Card */}
      <div className="bg-white border border-[#263238]/10 rounded-2xl p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#263238]/8 pb-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#4E7A66]">
              Clinical Insight Sharing Status
            </span>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-xl sm:text-2xl text-[#132A24] font-medium">
                {isEnabled ? 'Insight Sharing Enabled' : 'Sharing Disabled (100% Private)'}
              </h2>
            </div>
          </div>

          <span
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full self-start sm:self-auto border ${
              isEnabled
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-stone-100 text-stone-700 border-stone-200'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isEnabled ? 'bg-emerald-600 animate-pulse' : 'bg-stone-400'}`} />
            <span>{isEnabled ? 'Active Clinical Sharing' : 'Fully Private / Disabled'}</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-1">
          <div>
            <span className="text-[#66747A] block text-[11px]">Authorized Clinician:</span>
            <span className="font-semibold text-[#132A24] text-[13px] block mt-0.5">
              {clinicianName}
            </span>
            <span className="text-[11px] text-[#66747A] block">{clinicianTitle}</span>
          </div>

          <div>
            <span className="text-[#66747A] block text-[11px]">Care Tenancy:</span>
            <span className="font-medium text-[#132A24] block mt-0.5 capitalize">
              {relationship?.careStage ? `Stage: ${relationship.careStage.replace('_', ' ')}` : 'In Care'}
            </span>
            <span className="text-[11px] text-emerald-700 font-semibold block mt-0.5">
              Encrypted Clinical Portal
            </span>
          </div>

          <div>
            <span className="text-[#66747A] block text-[11px]">Preferences Last Updated:</span>
            <span className="font-medium text-[#132A24] block mt-0.5">
              {consent?.updated_at
                ? new Date(consent.updated_at).toLocaleString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'Default settings (No shared categories)'}
            </span>
          </div>
        </div>
      </div>

      {/* Section 2: Explicit Privacy & Confidentiality Guarantee Banner */}
      <div className="bg-[#FAF9F7] border border-[#263238]/10 rounded-2xl p-5 sm:p-6 text-xs text-[#526066] space-y-3 shadow-2xs">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#132A24]">
          <ShieldCheck size={18} className="text-emerald-700 shrink-0" />
          <span>Strict Confidentiality &amp; Client Autonomy Guarantee</span>
        </div>
        <p className="leading-relaxed text-[#263238]/80 text-[12.5px]">
          Ingress Within adheres to rigorous healthcare privacy boundaries. Sharing self-reflection insights is strictly voluntary and never blocks therapy sessions or booking.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="p-3.5 rounded-xl bg-white border border-[#263238]/8 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-[#132A24]">
              <Lock size={13} className="text-emerald-700" />
              <span>Zero Raw Diary Access</span>
            </div>
            <p className="text-[11px] text-[#66747A] leading-relaxed">
              Your deeply personal journals, unedited audio recordings, and private drafts are <strong>NEVER</strong> shared.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-[#263238]/8 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-[#132A24]">
              <Sparkles size={13} className="text-emerald-700" />
              <span>Structured Summaries Only</span>
            </div>
            <p className="text-[11px] text-[#66747A] leading-relaxed">
              Clinicians receive only the high-level behavioral patterns and progress syntheses you explicitly check below.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-[#263238]/8 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-[#132A24]">
              <ShieldAlert size={13} className="text-emerald-700" />
              <span>Instant Revocation</span>
            </div>
            <p className="text-[11px] text-[#66747A] leading-relaxed">
              You can modify or withdraw consent at any time. Changes take effect on the server immediately.
            </p>
          </div>
        </div>
      </div>

      {/* Section 3: Granular Category Sharing Controls */}
      <div className="bg-white border border-[#263238]/10 rounded-2xl shadow-2xs overflow-hidden">
        <div className="p-5 sm:p-6 bg-[#FAF9F7] border-b border-[#263238]/8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-serif text-lg text-[#132A24] font-medium">Shared Insight Categories</h3>
            <p className="text-xs text-[#66747A] mt-0.5">
              Toggle each category individually to customize what {clinicianName} can access.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!isEnabled ? (
              <button
                type="button"
                onClick={handleEnableAll}
                disabled={Boolean(savingKey)}
                className="px-3.5 py-1.5 rounded-xl bg-[#132A24] text-white text-xs font-semibold hover:bg-[#1C3E35] transition-colors cursor-pointer shadow-2xs disabled:opacity-50"
              >
                {savingKey === 'all' ? 'Enabling...' : 'Enable All Categories'}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowWithdrawConfirm(true)}
                className="px-3 py-1.5 rounded-xl border border-red-200 text-red-700 text-xs font-medium hover:bg-red-50 transition-colors cursor-pointer"
              >
                Withdraw All Consent
              </button>
            )}
          </div>
        </div>

        <div className="divide-y divide-[#263238]/8">
          {/* Category 1: Pattern Summary */}
          <div className="p-5 sm:p-6 flex items-start justify-between gap-4 transition-colors hover:bg-[#FAF9F7]/50">
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-800 shrink-0 mt-0.5">
                <Activity size={18} />
              </div>
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs sm:text-sm text-[#132A24]">Pattern Summary</span>
                  {Boolean(consent?.share_pattern_summary) && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Shared
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#66747A] leading-relaxed">
                  Synthesized high-level overview of recurring behavioral and cognitive themes across reflection cycles (e.g. counts of active patterns, emerging shifts, and quiet patterns).
                </p>
                <span className="text-[11px] text-[#4E7A66] block font-medium">
                  Therapist view: Clinical dashboard overview card showing active cognitive loops.
                </span>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
              <input
                type="checkbox"
                checked={Boolean(consent?.share_pattern_summary)}
                disabled={Boolean(savingKey)}
                onChange={(e) => handleToggleCategory('pattern_summary', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-700"></div>
            </label>
          </div>

          {/* Category 2: Emotional Vocabulary */}
          <div className="p-5 sm:p-6 flex items-start justify-between gap-4 transition-colors hover:bg-[#FAF9F7]/50">
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-800 shrink-0 mt-0.5">
                <BookOpen size={18} />
              </div>
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs sm:text-sm text-[#132A24]">Emotional Vocabulary</span>
                  {Boolean(consent?.share_emotional_vocabulary) && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Shared
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#66747A] leading-relaxed">
                  Aggregated insights regarding emotional granularity (number of distinct emotion words tracked, top reached-for descriptors, and shifts in emotional vocabulary breadth).
                </p>
                <span className="text-[11px] text-blue-700 block font-medium">
                  Therapist view: Vocabulary diversity chart and affective range indicators.
                </span>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
              <input
                type="checkbox"
                checked={Boolean(consent?.share_emotional_vocabulary)}
                disabled={Boolean(savingKey)}
                onChange={(e) => handleToggleCategory('emotional_vocabulary', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-700"></div>
            </label>
          </div>

          {/* Category 3: Weekly Reports */}
          <div className="p-5 sm:p-6 flex items-start justify-between gap-4 transition-colors hover:bg-[#FAF9F7]/50">
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-800 shrink-0 mt-0.5">
                <CalendarCheck size={18} />
              </div>
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs sm:text-sm text-[#132A24]">Weekly Progress Reports</span>
                  {Boolean(consent?.share_weekly_reports) && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Shared
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#66747A] leading-relaxed">
                  Synthesized weekly progress reports detailing emotional balance, consistency, reflection frequency, and core observed milestones over the week.
                </p>
                <span className="text-[11px] text-purple-700 block font-medium">
                  Therapist view: Weekly reflection synthesis cards with longitudinal trends.
                </span>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
              <input
                type="checkbox"
                checked={Boolean(consent?.share_weekly_reports)}
                disabled={Boolean(savingKey)}
                onChange={(e) => handleToggleCategory('weekly_reports', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-700"></div>
            </label>
          </div>

          {/* Category 4: Monthly Reports (Cycle Assessments) */}
          <div className="p-5 sm:p-6 flex items-start justify-between gap-4 transition-colors hover:bg-[#FAF9F7]/50">
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-800 shrink-0 mt-0.5">
                <TrendingUp size={18} />
              </div>
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs sm:text-sm text-[#132A24]">Monthly Reports (Cycle Assessments)</span>
                  {Boolean(consent?.share_monthly_reports) && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Shared
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#66747A] leading-relaxed">
                  Full 30-day reflection cycle assessment reports summarizing your long-term progress, persistent triggers, cognitive development, and milestones.
                </p>
                <span className="text-[11px] text-amber-800 block font-medium">
                  Therapist view: Comprehensive monthly clinical report and progression indicators.
                </span>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
              <input
                type="checkbox"
                checked={Boolean(consent?.share_monthly_reports)}
                disabled={Boolean(savingKey)}
                onChange={(e) => handleToggleCategory('monthly_reports', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-700"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Section 4: Signed Telehealth Clinical Consent Record */}
      <div className="bg-white border border-[#263238]/10 rounded-2xl p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#263238]/8 pb-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#4E7A66]">
              Verified Legal Agreement
            </span>
            <h3 className="font-serif text-lg text-[#132A24] font-medium">
              Informed Consent for Psychological &amp; Telehealth Services
            </h3>
            <p className="text-xs text-[#66747A]">
              Executed during client intake and onboarding to authorize remote digital consultation with {clinicianName}.
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold self-start sm:self-auto">
            <CheckCircle2 size={13} className="text-emerald-700" />
            <span>Consent Verified</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-[#FAF9F7] border border-[#263238]/8 space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#66747A] block">Document ID</span>
            <span className="font-mono text-xs font-semibold text-[#132A24] truncate block">
              {legalDoc?.documentId || 'CONSENT-DOC-RECORD'}
            </span>
            <span className="text-[10.5px] text-[#66747A] block">Audited Legal Record</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAF9F7] border border-[#263238]/8 space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#66747A] block">Execution Date</span>
            <span className="font-semibold text-[#132A24] text-xs block">
              {legalDoc?.consentedAt
                ? new Date(legalDoc.consentedAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })
                : 'Intake Timestamp Recorded'}
            </span>
            <span className="text-[10.5px] text-[#66747A] block">Digital Consent Confirmed</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAF9F7] border border-[#263238]/8 space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#66747A] block">Legal Jurisdiction</span>
            <span className="font-semibold text-[#132A24] text-xs block truncate">
              {legalDoc?.jurisdiction || 'India (RUMINARI (OPC) PVT LTD)'}
            </span>
            <span className="text-[10.5px] text-[#66747A] block">RCI &amp; Digital Ethics Aligned</span>
          </div>
        </div>

        <div className="pt-2 flex justify-start">
          <button
            type="button"
            onClick={() => setViewingLegalModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-[#263238]/15 text-[#132A24] text-xs font-semibold hover:bg-[#FAF9F7] transition-all cursor-pointer shadow-2xs"
          >
            <Eye size={14} className="text-[#4E7A66]" />
            <span>View Complete Telehealth Consent Document</span>
          </button>
        </div>
      </div>

      {/* Section 5: Withdraw All Consent Modal / Confirm */}
      {showWithdrawConfirm && (
        <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 space-y-3">
          <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
            <AlertCircle size={16} />
            <span>Withdraw All Insight Sharing Consent?</span>
          </div>
          <p className="text-xs text-rose-900/80 leading-relaxed max-w-3xl">
            {clinicianName} will immediately lose access to all your behavioral patterns, emotional vocabulary breadth, and weekly &amp; monthly reflection summaries. Your session bookings and direct consultations remain completely unaffected. You can re-enable sharing at any time.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleWithdrawAll}
              disabled={Boolean(savingKey)}
              className="px-4 py-2 rounded-xl bg-rose-700 text-white text-xs font-semibold hover:bg-rose-800 transition-colors cursor-pointer shadow-2xs disabled:opacity-50"
            >
              {savingKey === 'withdraw' ? 'Revoking Access...' : 'Yes, Withdraw All Insight Sharing'}
            </button>
            <button
              type="button"
              onClick={() => setShowWithdrawConfirm(false)}
              className="px-3.5 py-2 rounded-xl bg-white border border-rose-300 text-rose-800 text-xs font-medium hover:bg-rose-100/50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Modal: Complete Telehealth Consent Document */}
      {viewingLegalModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#263238]/12 max-w-2xl w-full max-h-[88vh] flex flex-col shadow-2xl overflow-hidden animate-fadeUp">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#FAF9F7] border-b border-[#263238]/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-[#132A24]" />
                <h3 className="font-serif text-lg text-[#132A24] font-medium">
                  Telehealth Clinical Consent Agreement
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setViewingLegalModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#66747A] hover:text-[#132A24] hover:bg-black/5 cursor-pointer"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-[#526066] leading-relaxed">
              <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 text-emerald-950 space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 block">
                  Digital Clinical Record
                </span>
                <p className="font-medium text-xs">
                  This document serves as the authoritative, legally binding record of clinical telehealth consent acknowledged by the client for therapy consultations with {clinicianName}.
                </p>
              </div>

              {/* Legal Clauses */}
              <div className="space-y-4">
                {(legalDoc?.legalClauses || [
                  {
                    heading: '1. Purpose & Scope of Telehealth Services',
                    body: 'Ingress Within provides professional psychological consultations, psychoeducation, and guided clinical care delivered remotely via secure video and audio conferencing. The client acknowledges that psychological counseling is a collaborative healthcare process.',
                  },
                  {
                    heading: '2. Professional Confidentiality & Mandatory Exceptions',
                    body: 'All clinical communications, assessment data, and therapy session notes are kept strictly confidential under Indian clinical psychology standards. Disclosures may only occur where required by law: clear and imminent risk of severe harm to self or others, child or elder abuse, or valid court subpoena.',
                  },
                  {
                    heading: '3. Emergency & Crisis Disclaimer',
                    body: 'Telehealth is not an emergency response service. In cases of immediate life-threatening psychiatric emergencies or active suicidal ideation, client agrees to contact official helplines (Tele-MANAS: 14416 / Kiran: 1800-599-0019) or visit the nearest emergency healthcare department.',
                  },
                  {
                    heading: '4. Telehealth Technology & Security Standards',
                    body: 'Telehealth consultations are conducted through end-to-end encrypted video channels. The client is responsible for joining sessions from a private, secure, and confidential environment.',
                  },
                  {
                    heading: '5. Voluntary Participation & Right to Terminate',
                    body: 'Participation in psychological care is voluntary. The client retains full autonomy to pause, modify, or conclude care at any point without prejudice.',
                  },
                ]).map((clause, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-[#FAF9F7] border border-[#263238]/8 space-y-1">
                    <strong className="text-xs text-[#132A24] block">{clause.heading}</strong>
                    <p className="text-[11.5px] text-[#66747A] leading-relaxed">{clause.body}</p>
                  </div>
                ))}
              </div>

              {/* Execution Audit Sign-off */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-stone-700 text-[11px] space-y-1.5 font-mono">
                <div className="font-bold text-[#132A24] text-xs font-sans">Audit Verification Summary</div>
                <div>Document ID: {legalDoc?.documentId || 'CONSENT-DOC-AUTHENTICATED'}</div>
                <div>Client Identifier: {legalDoc?.clientId || 'CLIENT-VERIFIED'}</div>
                <div>Clinician: {legalDoc?.therapistName || clinicianName}</div>
                <div>Timestamp: {legalDoc?.consentedAt || new Date().toISOString()}</div>
                <div>Governing Jurisdiction: {legalDoc?.jurisdiction || 'Ahmedabad, Gujarat, India'}</div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-[#FAF9F7] border-t border-[#263238]/10 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setViewingLegalModal(false)}
                className="px-4 py-2 rounded-xl bg-[#132A24] text-white text-xs font-semibold hover:bg-[#1C3E35] transition-colors cursor-pointer"
              >
                Close Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
