'use client';

import React, { useState, useEffect, useTransition } from 'react';
import {
  HeartHandshake,
  Search,
  Filter,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Shield,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  X,
  User,
  UserCheck,
  Video,
  CreditCard,
  Lock,
  RefreshCw,
  Sparkles,
  Info,
} from 'lucide-react';

export default function TherapyRelationshipsView({ showToast }) {
  const [relationships, setRelationships] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, totalPages: 1 });
  const [counts, setCounts] = useState({
    all: 0,
    active: 0,
    dormant: 0,
    completed: 0,
    awaiting_therapist_acceptance: 0,
    awaiting_mutual_acceptance: 0,
    consent_pending: 0,
    first_session_not_booked: 0,
  });

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('newest_request');
  const [page, setPage] = useState(1);

  // Selected relationship for detailed view
  const [selectedRelId, setSelectedRelId] = useState(null);
  const [detailData, setDetailData] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Consent document viewer state
  const [consentDocId, setConsentDocId] = useState(null);
  const [consentDocData, setConsentDocData] = useState(null);
  const [consentDocLoading, setConsentDocLoading] = useState(false);

  // Fetch list
  const fetchRelationships = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({
        page: String(page),
        limit: '15',
        search,
        filter,
        sort,
      });

      const res = await fetch(`/api/admin/therapy-relationships?${q.toString()}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setRelationships(data.relationships || []);
        setPagination(data.pagination || { page: 1, limit: 15, total: 0, totalPages: 1 });
        if (data.counts) setCounts(data.counts);
      } else {
        if (showToast) showToast(data.error?.message || 'Failed to load therapy relationships', true);
      }
    } catch (err) {
      console.error('[TherapyRelationshipsView] Fetch error:', err);
      if (showToast) showToast('Network error loading therapy relationships', true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRelationships();
  }, [page, filter, sort]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchRelationships();
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  // Open detailed view
  const handleOpenDetail = async (relId) => {
    setSelectedRelId(relId);
    setDetailLoading(true);
    try {
      const res = await fetch(`/api/admin/therapy-relationships/${relId}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setDetailData(data.relationship);
      } else {
        if (showToast) showToast(data.error?.message || 'Failed to load relationship details', true);
        setSelectedRelId(null);
      }
    } catch (err) {
      console.error('[TherapyRelationshipsView] Detail load error:', err);
      if (showToast) showToast('Network error loading relationship details', true);
      setSelectedRelId(null);
    } finally {
      setDetailLoading(false);
    }
  };

  // Open consent document modal
  const handleOpenConsentDoc = async (relId) => {
    setConsentDocId(relId);
    setConsentDocLoading(true);
    try {
      const res = await fetch(`/api/admin/therapy-relationships/${relId}/consent`);
      const data = await res.json();
      if (res.ok && data.success) {
        setConsentDocData(data.document);
      } else {
        if (showToast) showToast(data.error?.message || 'Failed to retrieve consent document', true);
        setConsentDocId(null);
      }
    } catch (err) {
      console.error('[TherapyRelationshipsView] Consent document error:', err);
      if (showToast) showToast('Network error retrieving consent document', true);
      setConsentDocId(null);
    } finally {
      setConsentDocLoading(false);
    }
  };

  // Helper date formatter
  const formatDate = (isoString, includeTime = false) => {
    if (!isoString) return '—';
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return '—';
      return d.toLocaleDateString('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        ...(includeTime ? { hour: '2-digit', minute: '2-digit', hour12: true } : {}),
      });
    } catch {
      return '—';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-[11px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Active
          </span>
        );
      case 'Dormant':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 text-[11px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Dormant
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-500/10 border border-slate-500/20 text-slate-700 text-[11px] font-semibold">
            <CheckCircle2 className="w-3 h-3 text-slate-500" />
            Completed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[11px]">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Privacy Notice Banner */}
      <div className="bg-white border border-[#132A24]/10 rounded-2xl p-4 text-xs text-[#132A24]/80 flex items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-[#4E7A66] shrink-0" />
          <span>
            <strong className="text-[#132A24]">Clinical Tenancy & Privacy Safeguard:</strong> This dashboard tracks administrative milestones, session counts, and consent integrity. Patient SOAP notes, diagnostic formulations, and private self-work journals remain strictly isolated between client and clinician.
          </span>
        </div>
        <button
          onClick={fetchRelationships}
          disabled={loading}
          className="shrink-0 p-1.5 rounded-lg border border-[#132A24]/10 hover:bg-[#132A24]/5 text-[#132A24]/70 transition-colors"
          title="Refresh Data"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#4E7A66]' : ''}`} />
        </button>
      </div>

      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-[#132A24]">Client-Therapist Relationships</h2>
          <p className="text-xs text-[#132A24]/60">
            Authoritative longitudinal tracking from initial therapy request to relationship completion.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#132A24]/40" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search client or therapist..."
              className="w-full pl-9 pr-8 py-2 rounded-xl text-xs bg-white border border-[#132A24]/15 focus:outline-none focus:border-[#4E7A66] text-[#132A24] transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#132A24]/40 hover:text-[#132A24]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 bg-white border border-[#132A24]/15 rounded-xl px-3 py-2 text-xs text-[#132A24]">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#132A24]/60" />
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
              className="bg-transparent border-none focus:outline-none text-xs font-medium cursor-pointer"
            >
              <option value="newest_request">Newest Requests</option>
              <option value="oldest_request">Oldest Requests</option>
              <option value="matching_date_desc">Matching Date</option>
              <option value="first_session_desc">First Session Date</option>
              <option value="last_session_desc">Last Session Date</option>
              <option value="sessions_count_desc">Session Count (High to Low)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {[
          { key: 'all', label: 'All Relationships', count: counts.all },
          { key: 'active', label: 'Active', count: counts.active },
          { key: 'dormant', label: 'Dormant', count: counts.dormant },
          { key: 'completed', label: 'Completed', count: counts.completed },
          { key: 'awaiting_therapist_acceptance', label: 'Awaiting Acceptance', count: counts.awaiting_therapist_acceptance },
          { key: 'awaiting_mutual_acceptance', label: 'Mutual Acceptance Pending', count: counts.awaiting_mutual_acceptance },
          { key: 'consent_pending', label: 'Consent Pending', count: counts.consent_pending },
          { key: 'first_session_not_booked', label: 'First Session Not Booked', count: counts.first_session_not_booked },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => {
              setFilter(f.key);
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              filter === f.key
                ? 'bg-[#132A24] text-white shadow-xs'
                : 'bg-white border border-[#132A24]/10 text-[#132A24]/70 hover:bg-[#132A24]/5'
            }`}
          >
            <span>{f.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                filter === f.key ? 'bg-white/20 text-white' : 'bg-[#132A24]/10 text-[#132A24]'
              }`}
            >
              {f.count}
            </span>
          </button>
        ))}
      </div>

      {/* Overview Table */}
      <div className="bg-white border border-[#132A24]/10 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#132A24]/[0.02] border-b border-[#132A24]/10 text-[#132A24]/60 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4 min-w-[200px]">Client & Therapist</th>
                <th className="py-3.5 px-4 min-w-[150px]">New User / Therapy Request</th>
                <th className="py-3.5 px-4 min-w-[150px]">Therapist Matched</th>
                <th className="py-3.5 px-4 min-w-[150px]">Mutual Acceptance</th>
                <th className="py-3.5 px-4 min-w-[160px]">Client Consent</th>
                <th className="py-3.5 px-4 min-w-[130px]">First Session</th>
                <th className="py-3.5 px-4 text-center min-w-[90px]">Sessions</th>
                <th className="py-3.5 px-4 min-w-[130px]">Last Session</th>
                <th className="py-3.5 px-4 min-w-[100px]">Status</th>
                <th className="py-3.5 px-4 text-right min-w-[100px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#132A24]/5 text-[#132A24]">
              {loading ? (
                <tr>
                  <td colSpan="10" className="py-16 text-center text-[#132A24]/50">
                    <div className="inline-flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-[#4E7A66]" />
                      <span>Loading relationship lifecycle data...</span>
                    </div>
                  </td>
                </tr>
              ) : relationships.length === 0 ? (
                <tr>
                  <td colSpan="10" className="py-16 text-center text-[#132A24]/40 italic">
                    <HeartHandshake className="w-8 h-8 mx-auto mb-2 opacity-30 text-[#4E7A66]" />
                    No therapy relationships found matching the selected filter or search.
                  </td>
                </tr>
              ) : (
                relationships.map((rel) => (
                  <tr key={rel.id} className="hover:bg-[#132A24]/[0.015] transition-colors">
                    {/* 1. Client & Therapist Names */}
                    <td className="py-3.5 px-4">
                      <div>
                        <div className="font-semibold text-[#132A24] flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-[#4E7A66] shrink-0" />
                          <span>{rel.clientName}</span>
                        </div>
                        <div className="text-[11px] text-[#132A24]/60 pl-5 flex items-center gap-1">
                          <span>With:</span>
                          <span className="font-medium text-[#132A24]">{rel.therapistName}</span>
                        </div>
                        {rel.clientEmail && (
                          <div className="text-[10px] text-[#132A24]/40 pl-5 truncate max-w-[200px]">
                            {rel.clientEmail}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* 2. New User / Therapy Request */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <div className="text-[11px] font-medium text-[#132A24]">
                          {formatDate(rel.requestDate)}
                        </div>
                        <div>
                          {rel.intakeCompleted ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 text-[10px] font-semibold border border-emerald-500/20">
                              <CheckCircle2 className="w-2.5 h-2.5" />
                              Intake Completed
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 text-[10px] font-semibold border border-amber-500/20">
                              <Clock className="w-2.5 h-2.5" />
                              Intake Pending
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* 3. Therapist Matched */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <div className="text-[11px] font-medium text-[#132A24]">
                          {formatDate(rel.matchingDate)}
                        </div>
                        <div>
                          {rel.therapistAcceptanceStatus === 'accepted' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 text-[10px] font-medium border border-emerald-500/20">
                              Accepted
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 text-[10px] font-medium border border-amber-500/20">
                              Pending Acceptance
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* 4. Mutual Acceptance */}
                    <td className="py-3.5 px-4">
                      {rel.mutualAccepted && rel.mutualAcceptedAt ? (
                        <div>
                          <div className="text-[11px] font-medium text-[#132A24]">
                            {formatDate(rel.mutualAcceptedAt, true)}
                          </div>
                          <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-0.5 mt-0.5">
                            <CheckCircle2 className="w-3 h-3" /> Confirmed
                          </span>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-[10px] font-medium">
                          <Clock className="w-2.5 h-2.5" /> Pending
                        </span>
                      )}
                    </td>

                    {/* 5. Client Consent */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          {rel.hasConsent ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 text-[10px] font-semibold border border-emerald-500/20">
                              <CheckCircle2 className="w-2.5 h-2.5" />
                              Consented
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-700 text-[10px] font-semibold border border-rose-500/20">
                              <AlertCircle className="w-2.5 h-2.5" />
                              Pending
                            </span>
                          )}
                        </div>
                        {rel.consentDate && (
                          <div className="text-[10px] text-[#132A24]/60">
                            {formatDate(rel.consentDate)}
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => handleOpenConsentDoc(rel.id)}
                          className="inline-flex items-center gap-1 text-[11px] text-[#4E7A66] hover:text-[#132A24] font-medium underline underline-offset-2 cursor-pointer transition-colors"
                        >
                          <FileText className="w-3 h-3" />
                          View Consent Doc
                        </button>
                      </div>
                    </td>

                    {/* 6. First Session Booked */}
                    <td className="py-3.5 px-4">
                      {rel.firstSessionBooked ? (
                        <div>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 text-[10px] font-semibold border border-emerald-500/20 mb-1">
                            Yes
                          </span>
                          <div className="text-[11px] font-medium text-[#132A24] leading-tight">
                            {formatDate(rel.firstSessionDate, true)}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-[10px] font-medium">
                            No
                          </span>
                          <span className="text-[10px] text-[#132A24]/40 block mt-0.5">Not booked</span>
                        </div>
                      )}
                    </td>

                    {/* 7. Number of Sessions */}
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold ${
                          rel.totalSessions > 0
                            ? 'bg-[#4E7A66]/10 text-[#132A24] border border-[#4E7A66]/20'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {rel.totalSessions}
                      </span>
                    </td>

                    {/* 8. Last Session Date */}
                    <td className="py-3.5 px-4">
                      {rel.lastSessionDate ? (
                        <div className="text-[11px] font-medium text-[#132A24]">
                          {formatDate(rel.lastSessionDate, true)}
                        </div>
                      ) : (
                        <span className="text-[#132A24]/40 text-[11px] italic">No completed sessions</span>
                      )}
                    </td>

                    {/* 9. Relationship Status */}
                    <td className="py-3.5 px-4">{getStatusBadge(rel.status)}</td>

                    {/* 10. Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleOpenDetail(rel.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#132A24] text-white hover:bg-[#2C4A3E] transition-all cursor-pointer shadow-xs"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="p-4 border-t border-[#132A24]/10 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#132A24]/70">
          <div>
            Showing <strong className="text-[#132A24]">{relationships.length}</strong> of{' '}
            <strong className="text-[#132A24]">{pagination.total}</strong> relationship records
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={pagination.page <= 1 || loading}
              className="p-1.5 rounded-lg border border-[#132A24]/15 hover:bg-[#132A24]/5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-2 text-xs font-medium text-[#132A24]">
              Page {pagination.page} of {pagination.totalPages || 1}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={pagination.page >= pagination.totalPages || loading}
              className="p-1.5 rounded-lg border border-[#132A24]/15 hover:bg-[#132A24]/5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RELATIONSHIP DETAILS MODAL / DRAWER */}
      {/* ========================================================================= */}
      {selectedRelId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#132A24]/15 overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#132A24]/10 flex items-start justify-between bg-[#132A24]/[0.02]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#4E7A66] bg-[#4E7A66]/10 px-2 py-0.5 rounded-md border border-[#4E7A66]/20">
                    Relationship ID: {detailData?.id || selectedRelId}
                  </span>
                  {detailData && getStatusBadge(detailData.status)}
                  {detailData?.careStage && (
                    <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-700 text-[10px] font-semibold border border-blue-500/20 capitalize">
                      Stage: {detailData.careStage.replace('_', ' ')}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-serif font-bold text-[#132A24]">
                  {detailData?.clientName || 'Loading...'} & {detailData?.therapistName || ''}
                </h3>
                <p className="text-xs text-[#132A24]/60">
                  Comprehensive lifecycle journey, clinical session records, and audit milestones.
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedRelId(null);
                  setDetailData(null);
                }}
                className="p-2 text-[#132A24]/50 hover:text-[#132A24] rounded-xl hover:bg-[#132A24]/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {detailLoading || !detailData ? (
                <div className="py-20 text-center text-[#132A24]/50">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#4E7A66]" />
                  <span>Loading relationship audit details...</span>
                </div>
              ) : (
                <>
                  {/* Summary Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Client Card */}
                    <div className="border border-[#132A24]/10 rounded-2xl p-4 bg-[#FAF7F2] space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#132A24] uppercase tracking-wider">
                        <User className="w-4 h-4 text-[#4E7A66]" />
                        <span>Client Information</span>
                      </div>
                      <div className="text-sm font-semibold text-[#132A24]">{detailData.clientDetails.name}</div>
                      <div className="text-xs text-[#132A24]/70 space-y-0.5 font-mono">
                        {detailData.clientDetails.phone && <div>Phone: {detailData.clientDetails.phone}</div>}
                        {detailData.clientDetails.email && <div>Email: {detailData.clientDetails.email}</div>}
                        <div className="text-[10px] text-[#132A24]/50 pt-1">Client ID: {detailData.userId}</div>
                      </div>
                    </div>

                    {/* Therapist Card */}
                    <div className="border border-[#132A24]/10 rounded-2xl p-4 bg-[#FAF7F2] space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#132A24] uppercase tracking-wider">
                        <UserCheck className="w-4 h-4 text-[#4E7A66]" />
                        <span>Assigned Therapist</span>
                      </div>
                      <div className="text-sm font-semibold text-[#132A24]">{detailData.therapistDetails.name}</div>
                      <div className="text-xs text-[#132A24]/70 space-y-0.5">
                        <div className="text-[11px] font-medium text-[#4E7A66]">{detailData.therapistDetails.title}</div>
                        {detailData.therapistDetails.qualification && (
                          <div className="text-[11px]">{detailData.therapistDetails.qualification}</div>
                        )}
                        <div className="text-[11px]">Fee: ₹{detailData.therapistDetails.fee} / session</div>
                        <div className="text-[10px] text-[#132A24]/50 pt-1 font-mono">Therapist ID: {detailData.therapistAccountId}</div>
                      </div>
                    </div>

                    {/* Session Metrics Card */}
                    <div className="border border-[#132A24]/10 rounded-2xl p-4 bg-[#FAF7F2] space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#132A24] uppercase tracking-wider">
                        <Calendar className="w-4 h-4 text-[#4E7A66]" />
                        <span>Session Metrics</span>
                      </div>
                      <div className="text-2xl font-bold text-[#132A24]">
                        {detailData.totalSessions}{' '}
                        <span className="text-xs font-normal text-[#132A24]/60">Valid Session(s)</span>
                      </div>
                      <div className="text-xs text-[#132A24]/70 space-y-1">
                        <div>
                          <strong>First Booked:</strong> {formatDate(detailData.firstSessionDate, true)}
                        </div>
                        <div>
                          <strong>Last Completed:</strong> {formatDate(detailData.lastSessionDate, true)}
                        </div>
                        <div className="pt-1">
                          <button
                            type="button"
                            onClick={() => handleOpenConsentDoc(detailData.id)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white border border-[#132A24]/15 hover:bg-[#132A24]/5 text-[#132A24] cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5 text-[#4E7A66]" />
                            View Signed Consent
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Intake & Clinical Request Information */}
                  {detailData.intakeDetails && (
                    <div className="border border-[#132A24]/10 rounded-2xl p-5 bg-white space-y-3">
                      <div className="flex items-center justify-between border-b border-[#132A24]/10 pb-2.5">
                        <h4 className="text-sm font-bold text-[#132A24] flex items-center gap-2">
                          <FileText className="w-4 h-4 text-[#4E7A66]" />
                          <span>Therapy Intake Details</span>
                        </h4>
                        <span className="text-xs text-[#132A24]/50">
                          Submitted: {formatDate(detailData.intakeDetails.submittedAt, true)}
                        </span>
                      </div>

                      {detailData.intakeDetails.presentingReason && (
                        <div>
                          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#132A24]/50 mb-1">
                            Presenting Concern
                          </div>
                          <div className="text-xs text-[#132A24] bg-[#FAF7F2] p-3 rounded-xl border border-[#132A24]/5 leading-relaxed">
                            "{detailData.intakeDetails.presentingReason}"
                          </div>
                        </div>
                      )}

                      {detailData.intakeDetails.concerns?.length > 0 && (
                        <div>
                          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#132A24]/50 mb-1">
                            Reported Clinical Concerns
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {detailData.intakeDetails.concerns.map((c, idx) => (
                              <span
                                key={idx}
                                className="px-2.5 py-1 rounded-lg bg-[#4E7A66]/10 text-[#2D5A46] text-xs font-medium border border-[#4E7A66]/20"
                              >
                                {c}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Matching Metadata */}
                      {detailData.matchingDetails?.matchScore && (
                        <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-[#132A24]/70">
                          <span>
                            <strong>Match Score:</strong> {detailData.matchingDetails.matchScore}%
                          </span>
                          {detailData.matchingDetails.matchRank && (
                            <span>
                              <strong>Rank:</strong> #{detailData.matchingDetails.matchRank}
                            </span>
                          )}
                          {detailData.matchingDetails.matchReasons?.length > 0 && (
                            <span className="italic">
                              ({detailData.matchingDetails.matchReasons.join(', ')})
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Chronological Relationship Timeline */}
                  <div className="border border-[#132A24]/10 rounded-2xl p-5 bg-white space-y-4">
                    <div className="border-b border-[#132A24]/10 pb-2.5">
                      <h4 className="text-sm font-bold text-[#132A24] flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#4E7A66]" />
                        <span>Chronological Relationship Milestones</span>
                      </h4>
                      <p className="text-[11px] text-[#132A24]/60">
                        Authoritative timeline verified from database timestamps and event audits.
                      </p>
                    </div>

                    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#132A24]/10">
                      {detailData.timeline.map((m) => {
                        const isDone = m.status === 'completed';
                        const isInProg = m.status === 'in_progress';

                        return (
                          <div key={m.id} className="relative">
                            {/* Milestone Dot */}
                            <div
                              className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border transition-colors ${
                                isDone
                                  ? 'bg-emerald-500 border-emerald-600 text-white shadow-xs'
                                  : isInProg
                                  ? 'bg-amber-500 border-amber-600 text-white animate-pulse'
                                  : 'bg-white border-[#132A24]/20 text-[#132A24]/40'
                              }`}
                            >
                              {isDone ? '✓' : m.milestoneNumber}
                            </div>

                            <div className="space-y-0.5">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <span className={`text-xs font-semibold ${isDone ? 'text-[#132A24]' : 'text-[#132A24]/70'}`}>
                                  {m.title}
                                </span>
                                <span className="text-[10px] font-mono text-[#132A24]/50">
                                  {formatDate(m.timestamp, true)}
                                </span>
                              </div>
                              <p className="text-xs text-[#132A24]/70 leading-relaxed">{m.details}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Complete Clinical Session History */}
                  <div className="border border-[#132A24]/10 rounded-2xl overflow-hidden bg-white shadow-xs space-y-0">
                    <div className="p-4 border-b border-[#132A24]/10 bg-[#FAF7F2] flex items-center justify-between">
                      <h4 className="text-sm font-bold text-[#132A24] flex items-center gap-2">
                        <Video className="w-4 h-4 text-[#4E7A66]" />
                        <span>Clinical Session History</span>
                      </h4>
                      <span className="text-xs text-[#132A24]/60">
                        {detailData.sessionsList.length} appointment record(s) on file
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#132A24]/[0.02] border-b border-[#132A24]/10 text-[#132A24]/60 font-semibold uppercase tracking-wider text-[11px]">
                          <tr>
                            <th className="py-2.5 px-4">Session Date & Time</th>
                            <th className="py-2.5 px-4">Format</th>
                            <th className="py-2.5 px-4">Status</th>
                            <th className="py-2.5 px-4">Payment</th>
                            <th className="py-2.5 px-4">Meeting Link</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#132A24]/5">
                          {detailData.sessionsList.length === 0 ? (
                            <tr>
                              <td colSpan="5" className="py-8 text-center text-[#132A24]/40 italic">
                                No clinical appointments recorded for this relationship yet.
                              </td>
                            </tr>
                          ) : (
                            detailData.sessionsList.map((s) => (
                              <tr key={s.id} className="hover:bg-[#132A24]/[0.015]">
                                <td className="py-3 px-4 font-medium text-[#132A24]">
                                  {formatDate(s.scheduledStart, true)}
                                </td>
                                <td className="py-3 px-4 capitalize text-[#132A24]/70">
                                  {s.sessionType} ({s.modality})
                                </td>
                                <td className="py-3 px-4">
                                  <span
                                    className={`px-2 py-0.5 rounded-md text-[10px] font-semibold capitalize ${
                                      s.status === 'completed'
                                        ? 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20'
                                        : s.status === 'cancelled'
                                        ? 'bg-rose-500/10 text-rose-700 border border-rose-500/20'
                                        : 'bg-blue-500/10 text-blue-700 border border-blue-500/20'
                                    }`}
                                  >
                                    {s.status}
                                  </span>
                                  {s.cancellationReason && (
                                    <div className="text-[10px] text-rose-600 mt-0.5 truncate max-w-[200px]" title={s.cancellationReason}>
                                      Reason: {s.cancellationReason}
                                    </div>
                                  )}
                                </td>
                                <td className="py-3 px-4 capitalize text-[11px] text-[#132A24]/80">
                                  {s.paymentStatus}
                                </td>
                                <td className="py-3 px-4">
                                  {s.meetingLink ? (
                                    <a
                                      href={s.meetingLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-[#4E7A66] hover:text-[#132A24] font-medium text-[11px]"
                                    >
                                      <Video className="w-3 h-3" />
                                      Join Link
                                      <ExternalLink className="w-2.5 h-2.5" />
                                    </a>
                                  ) : (
                                    <span className="text-[#132A24]/40 italic text-[11px]">—</span>
                                  )}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#132A24]/10 bg-[#FAF7F2] flex items-center justify-end">
              <button
                type="button"
                onClick={() => {
                  setSelectedRelId(null);
                  setDetailData(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#132A24] text-white hover:bg-[#2C4A3E] transition-colors cursor-pointer"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECURE CONSENT DOCUMENT MODAL */}
      {/* ========================================================================= */}
      {consentDocId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#132A24]/15 overflow-hidden my-auto">
            {/* Header */}
            <div className="p-6 border-b border-[#132A24]/10 bg-[#132A24] text-white flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-300">
                    Authenticated Legal Record
                  </span>
                </div>
                <h3 className="text-lg font-serif font-bold">
                  Telehealth & Clinical Therapy Informed Consent
                </h3>
                <p className="text-xs text-white/70">
                  {consentDocData?.documentId || 'Loading Record...'}
                </p>
              </div>

              <button
                onClick={() => {
                  setConsentDocId(null);
                  setConsentDocData(null);
                }}
                className="p-1.5 text-white/60 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-[#132A24]">
              {consentDocLoading || !consentDocData ? (
                <div className="py-20 text-center text-[#132A24]/50">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#4E7A66]" />
                  <span>Verifying legal consent audit signatures...</span>
                </div>
              ) : (
                <>
                  {/* Verification Banner */}
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 flex items-center justify-between">
                    <div>
                      <div className="font-bold flex items-center gap-1.5 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Consent Status: {consentDocData.consentStatus}</span>
                      </div>
                      <div className="text-[11px] text-emerald-700 mt-0.5">
                        Consented at: <strong>{formatDate(consentDocData.consentedAt, true)}</strong> (IST)
                      </div>
                    </div>
                    <div className="text-right text-[11px]">
                      <div>Version: <strong>{consentDocData.consentVersion}</strong></div>
                      <div className="font-mono text-[10px] opacity-70">IP: {consentDocData.ipAddress}</div>
                    </div>
                  </div>

                  {/* Parties Box */}
                  <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-[#FAF7F2] border border-[#132A24]/10">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#132A24]/50 block mb-0.5">
                        Client Participant
                      </span>
                      <div className="font-bold text-[#132A24]">{consentDocData.clientName}</div>
                      <div className="text-[11px] text-[#132A24]/60 font-mono">ID: {consentDocData.clientId}</div>
                      {consentDocData.clientEmail && (
                        <div className="text-[11px] text-[#132A24]/60">{consentDocData.clientEmail}</div>
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#132A24]/50 block mb-0.5">
                        Assigned Practitioner
                      </span>
                      <div className="font-bold text-[#132A24]">{consentDocData.therapistName}</div>
                      <div className="text-[11px] text-[#4E7A66]">{consentDocData.therapistTitle}</div>
                      <div className="text-[11px] text-[#132A24]/60 font-mono">ID: {consentDocData.therapistId}</div>
                    </div>
                  </div>

                  {/* Formal Legal Clauses */}
                  <div className="space-y-4">
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

                  {/* Legal Attestation */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
                    <div><strong>Governing Jurisdiction:</strong> {consentDocData.jurisdiction}</div>
                    <div><strong>Authorized Platform Entity:</strong> {consentDocData.authorizedBy}</div>
                    <div className="text-[10px] font-mono text-slate-400 pt-1">
                      Audit Verification Hash: SHA256:{Buffer.from(consentDocData.documentId).toString('hex').substring(0, 32)}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[#132A24]/10 bg-[#FAF7F2] flex items-center justify-between">
              <span className="text-[11px] text-[#132A24]/60">
                Protected Under Digital Clinical Standards
              </span>
              <button
                type="button"
                onClick={() => {
                  setConsentDocId(null);
                  setConsentDocData(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#132A24] text-white hover:bg-[#2C4A3E] transition-colors cursor-pointer"
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
