'use client';

import React, { useState, useEffect } from 'react';
import {
  Stethoscope,
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
  Users,
  Video,
  CreditCard,
  Lock,
  RefreshCw,
  Sparkles,
  Info,
  Phone,
  Mail,
  Award,
  BookOpen,
} from 'lucide-react';
import RelationshipDetailModal from '../../components/admin/RelationshipDetailModal';

export default function TherapistOverviewView({ showToast }) {
  // Aggregate Metrics State
  const [metrics, setMetrics] = useState({
    totalRegisteredTherapists: 0,
    totalTherapistsWithClients: 0,
    totalActiveTherapists: 0,
    totalUniqueClientsAcrossTherapists: 0,
    totalActiveRelationships: 0,
    totalDormantRelationships: 0,
    totalCompletedRelationships: 0,
    totalValidSessions: 0,
  });

  // Table & List State
  const [therapists, setTherapists] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  // Filters & Sorting State
  const [search, setSearch] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('all');
  const [activityFilter, setActivityFilter] = useState('all');
  const [sort, setSort] = useState('total_clients_desc');
  const [page, setPage] = useState(1);

  // Selected Therapist for Detailed Dashboard
  const [selectedTherapistId, setSelectedTherapistId] = useState(null);
  const [therapistDetail, setTherapistDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailTab, setDetailTab] = useState('overview'); // 'overview' | 'clients' | 'sessions'

  // Selected Relationship for Nested Relationship Detail View (Phase 4.D requirement)
  const [nestedRelationshipId, setNestedRelationshipId] = useState(null);

  // Fetch Therapist Overview List
  const fetchTherapists = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({
        page: String(page),
        limit: '15',
        search,
        verificationStatus,
        activityFilter,
        sort,
      });

      const res = await fetch(`/api/admin/therapist-overview?${q.toString()}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setTherapists(data.therapists || []);
        setPagination(data.pagination || { page: 1, limit: 15, total: 0, totalPages: 1 });
        if (data.aggregateMetrics) {
          setMetrics(data.aggregateMetrics);
        }
      } else {
        if (showToast) showToast(data.error?.message || 'Failed to load therapist overview data', true);
      }
    } catch (err) {
      console.error('[TherapistOverviewView] Fetch error:', err);
      if (showToast) showToast('Network error loading therapist overview', true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTherapists();
  }, [page, verificationStatus, activityFilter, sort]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchTherapists();
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  // Open individual therapist detailed dashboard
  const handleOpenTherapistDetail = async (therapistId) => {
    setSelectedTherapistId(therapistId);
    setDetailLoading(true);
    setDetailTab('overview');

    try {
      const res = await fetch(`/api/admin/therapist-overview/${therapistId}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setTherapistDetail(data);
      } else {
        if (showToast) showToast(data.error?.message || 'Failed to load therapist details', true);
        setSelectedTherapistId(null);
      }
    } catch (err) {
      console.error('[TherapistOverviewView] Detail load error:', err);
      if (showToast) showToast('Network error loading therapist details', true);
      setSelectedTherapistId(null);
    } finally {
      setDetailLoading(false);
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

  const getVerificationBadge = (therapist) => {
    if (therapist.verificationStatus === 'verified' && therapist.canPractice) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-[11px] font-semibold">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          Verified
        </span>
      );
    }
    if (therapist.status === 'suspended') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-700 text-[11px] font-semibold">
          <AlertCircle className="w-3 h-3 text-rose-600" />
          Suspended
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 text-[11px] font-semibold">
        <Clock className="w-3 h-3 text-amber-600" />
        {therapist.verificationStatus || 'Pending'}
      </span>
    );
  };

  const getRelationshipStatusBadge = (status) => {
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
          <div className="p-2 rounded-xl bg-[#4E7A66]/10 text-[#2D5A46] shrink-0">
            <Shield className="w-4 h-4 text-[#4E7A66]" />
          </div>
          <div>
            <strong className="text-[#132A24] font-semibold">Therapist Clinical & Session Governance</strong>
            <p className="text-[11px] text-[#132A24]/60 mt-0.5">
              Aggregated across authoritative care relationships and clinical appointments. Private SOAP notes, clinical formulations, and personal journals are strictly excluded.
            </p>
          </div>
        </div>

        <button
          onClick={fetchTherapists}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#132A24]/5 hover:bg-[#132A24]/10 text-[#132A24] transition-all cursor-pointer shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* PHASE 2: AGGREGATE PLATFORM METRICS CARDS */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {/* 1. Total Registered Therapists */}
        <div className="bg-white border border-[#132A24]/10 rounded-2xl p-3.5 shadow-xs flex flex-col justify-between">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-[#132A24]/50">
            Registered
          </div>
          <div className="mt-1">
            <div className="text-xl font-bold font-serif text-[#132A24]">
              {metrics.totalRegisteredTherapists}
            </div>
            <div className="text-[10px] text-[#132A24]/60">Total Practitioners</div>
          </div>
        </div>

        {/* 2. Therapists with Clients */}
        <div className="bg-white border border-[#132A24]/10 rounded-2xl p-3.5 shadow-xs flex flex-col justify-between">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-[#132A24]/50">
            Assigned
          </div>
          <div className="mt-1">
            <div className="text-xl font-bold font-serif text-[#2D5A46]">
              {metrics.totalTherapistsWithClients}
            </div>
            <div className="text-[10px] text-[#132A24]/60">With Client History</div>
          </div>
        </div>

        {/* 3. Active Therapists */}
        <div className="bg-white border border-[#132A24]/10 rounded-2xl p-3.5 shadow-xs flex flex-col justify-between">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-[#132A24]/50">
            Can Practice
          </div>
          <div className="mt-1">
            <div className="text-xl font-bold font-serif text-emerald-700">
              {metrics.totalActiveTherapists}
            </div>
            <div className="text-[10px] text-[#132A24]/60">Active & Verified</div>
          </div>
        </div>

        {/* 4. Total Unique Clients */}
        <div className="bg-white border border-emerald-500/20 bg-emerald-50/20 rounded-2xl p-3.5 shadow-xs flex flex-col justify-between">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-800">
            Unique Clients
          </div>
          <div className="mt-1">
            <div className="text-xl font-bold font-serif text-emerald-900">
              {metrics.totalUniqueClientsAcrossTherapists}
            </div>
            <div className="text-[10px] text-emerald-700/80 font-medium">Distinct Individuals</div>
          </div>
        </div>

        {/* 5. Active Relationships */}
        <div className="bg-white border border-[#132A24]/10 rounded-2xl p-3.5 shadow-xs flex flex-col justify-between">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-[#132A24]/50">
            Active Rels
          </div>
          <div className="mt-1">
            <div className="text-xl font-bold font-serif text-emerald-600">
              {metrics.totalActiveRelationships}
            </div>
            <div className="text-[10px] text-[#132A24]/60">Ongoing Care</div>
          </div>
        </div>

        {/* 6. Dormant Relationships */}
        <div className="bg-white border border-[#132A24]/10 rounded-2xl p-3.5 shadow-xs flex flex-col justify-between">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-[#132A24]/50">
            Dormant Rels
          </div>
          <div className="mt-1">
            <div className="text-xl font-bold font-serif text-amber-600">
              {metrics.totalDormantRelationships}
            </div>
            <div className="text-[10px] text-[#132A24]/60">Paused Status</div>
          </div>
        </div>

        {/* 7. Completed Relationships */}
        <div className="bg-white border border-[#132A24]/10 rounded-2xl p-3.5 shadow-xs flex flex-col justify-between">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-[#132A24]/50">
            Completed Rels
          </div>
          <div className="mt-1">
            <div className="text-xl font-bold font-serif text-slate-700">
              {metrics.totalCompletedRelationships}
            </div>
            <div className="text-[10px] text-[#132A24]/60">Discharged / Ended</div>
          </div>
        </div>

        {/* 8. Total Valid Sessions */}
        <div className="bg-white border border-[#4E7A66]/30 bg-[#FAF7F2] rounded-2xl p-3.5 shadow-xs flex flex-col justify-between">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-[#2D5A46]">
            Valid Sessions
          </div>
          <div className="mt-1">
            <div className="text-xl font-bold font-serif text-[#132A24]">
              {metrics.totalValidSessions}
            </div>
            <div className="text-[10px] text-[#132A24]/60">Non-Cancelled</div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PHASE 3: SEARCH, FILTERS, AND SORTING CONTROLS */}
      {/* ========================================================================= */}
      <div className="bg-white border border-[#132A24]/10 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#132A24]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by therapist name, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-[#132A24]/15 focus:outline-hidden focus:border-[#4E7A66] bg-[#FAF7F2]/40 text-[#132A24]"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#132A24]/40 hover:text-[#132A24]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Controls Group */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter */}
            <select
              value={verificationStatus}
              onChange={(e) => {
                setVerificationStatus(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 text-xs rounded-xl border border-[#132A24]/15 bg-white text-[#132A24] focus:outline-hidden cursor-pointer"
            >
              <option value="all">Verification: All</option>
              <option value="verified">Verified & Active</option>
              <option value="pending">Pending Approval</option>
              <option value="suspended">Suspended / Inactive</option>
            </select>

            {/* Activity Filter */}
            <select
              value={activityFilter}
              onChange={(e) => {
                setActivityFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 text-xs rounded-xl border border-[#132A24]/15 bg-white text-[#132A24] focus:outline-hidden cursor-pointer"
            >
              <option value="all">Activity: All</option>
              <option value="with_active_clients">Currently Active Clients</option>
              <option value="with_historical_clients">With Historical Clients</option>
              <option value="no_clients">No Clients Handled</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 text-xs rounded-xl border border-[#132A24]/15 bg-white text-[#132A24] focus:outline-hidden cursor-pointer font-medium"
            >
              <option value="total_clients_desc">Sort: Total Clients (High → Low)</option>
              <option value="active_clients_desc">Sort: Active Clients (High → Low)</option>
              <option value="total_sessions_desc">Sort: Total Valid Sessions (High → Low)</option>
              <option value="last_session_desc">Sort: Last Completed Session Date</option>
              <option value="name_asc">Sort: Name (A → Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PHASE 3: THERAPIST-WISE STATISTICS TABLE */}
      {/* ========================================================================= */}
      <div className="bg-white border border-[#132A24]/10 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#132A24]/10 bg-[#FAF7F2]/80 text-[#132A24]/70 font-semibold">
                <th className="py-3.5 px-4">Therapist Profile</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Historical Clients (Unique)</th>
                <th className="py-3.5 px-4 text-center">Active Clients</th>
                <th className="py-3.5 px-4 text-center">Dormant</th>
                <th className="py-3.5 px-4 text-center">Completed</th>
                <th className="py-3.5 px-4 text-center">Valid Sessions</th>
                <th className="py-3.5 px-4">First Session</th>
                <th className="py-3.5 px-4">Last Completed</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#132A24]/5">
              {loading ? (
                <tr>
                  <td colSpan={10} className="py-16 text-center text-[#132A24]/50">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#4E7A66]" />
                    <span>Loading therapist statistics...</span>
                  </td>
                </tr>
              ) : therapists.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-16 text-center text-[#132A24]/60">
                    <div className="max-w-md mx-auto space-y-2">
                      <Stethoscope className="w-8 h-8 text-[#132A24]/30 mx-auto" />
                      <p className="font-semibold text-sm text-[#132A24]">No therapists matched your criteria</p>
                      <p className="text-xs text-[#132A24]/50">
                        Try adjusting your search query, verification filter, or relationship activity filters.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                therapists.map((t) => (
                  <tr key={t.id} className="hover:bg-[#FAF7F2]/40 transition-colors">
                    {/* 1. Therapist Name & Email */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#132A24] text-xs flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-[#4E7A66] shrink-0" />
                        <span>{t.name}</span>
                      </div>
                      <div className="text-[11px] text-[#132A24]/60 pl-5">
                        {t.email || t.phone || 'No direct contact recorded'}
                      </div>
                      {t.title && (
                        <div className="text-[10px] text-[#4E7A66] font-medium pl-5 truncate max-w-[200px]">
                          {t.title}
                        </div>
                      )}
                    </td>

                    {/* 2. Verification / Account Status */}
                    <td className="py-3.5 px-4">{getVerificationBadge(t)}</td>

                    {/* 3. Total Historical Clients */}
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-xs ${
                          t.totalHistoricalClients > 0
                            ? 'bg-[#4E7A66]/10 text-[#2D5A46] border border-[#4E7A66]/20'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {t.totalHistoricalClients}
                      </span>
                    </td>

                    {/* 4. Current Active Clients */}
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-xs ${
                          t.activeClients > 0
                            ? 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20'
                            : 'text-gray-400'
                        }`}
                      >
                        {t.activeClients}
                      </span>
                    </td>

                    {/* 5. Dormant Clients */}
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs ${
                          t.dormantClients > 0
                            ? 'bg-amber-500/10 text-amber-700 border border-amber-500/20 font-semibold'
                            : 'text-gray-400'
                        }`}
                      >
                        {t.dormantClients}
                      </span>
                    </td>

                    {/* 6. Completed Client Relationships */}
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs ${
                          t.completedClients > 0
                            ? 'bg-slate-500/10 text-slate-700 border border-slate-500/20 font-medium'
                            : 'text-gray-400'
                        }`}
                      >
                        {t.completedClients}
                      </span>
                    </td>

                    {/* 7. Total Valid Sessions */}
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-xs ${
                          t.totalValidSessions > 0
                            ? 'bg-[#132A24] text-white shadow-xs'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {t.totalValidSessions}
                      </span>
                      {t.completedSessions > 0 && (
                        <div className="text-[10px] text-emerald-600 mt-0.5">
                          {t.completedSessions} completed
                        </div>
                      )}
                    </td>

                    {/* 8. First Session */}
                    <td className="py-3.5 px-4 text-[11px] text-[#132A24]/80">
                      {t.firstSessionDate ? (
                        formatDate(t.firstSessionDate)
                      ) : (
                        <span className="text-gray-400 italic">None</span>
                      )}
                    </td>

                    {/* 9. Last Completed Session */}
                    <td className="py-3.5 px-4 text-[11px] text-[#132A24]">
                      {t.lastCompletedSessionDate ? (
                        <div className="font-medium text-[#132A24]">
                          {formatDate(t.lastCompletedSessionDate, true)}
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">No completed</span>
                      )}
                    </td>

                    {/* 10. Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleOpenTherapistDetail(t.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#132A24] text-white hover:bg-[#2C4A3E] transition-all cursor-pointer shadow-xs"
                      >
                        Overview
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
            Showing <strong className="text-[#132A24]">{therapists.length}</strong> of{' '}
            <strong className="text-[#132A24]">{pagination.total}</strong> registered practitioners
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
      {/* PHASE 4: INDIVIDUAL THERAPIST DETAILED DASHBOARD MODAL */}
      {/* ========================================================================= */}
      {selectedTherapistId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#132A24]/15 overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#132A24]/10 flex items-start justify-between bg-[#132A24]/[0.02]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#4E7A66] bg-[#4E7A66]/10 px-2 py-0.5 rounded-md border border-[#4E7A66]/20">
                    Therapist ID: {therapistDetail?.therapist?.id || selectedTherapistId}
                  </span>
                  {therapistDetail && getVerificationBadge(therapistDetail.therapist)}
                  {therapistDetail?.therapist?.rciRegistered && (
                    <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-700 text-[10px] font-semibold border border-purple-500/20">
                      RCI: {therapistDetail.therapist.rciNumber || 'Registered'}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-serif font-bold text-[#132A24]">
                  {therapistDetail?.therapist?.name || 'Therapist Dossier'}
                </h3>
                <p className="text-xs text-[#132A24]/60">
                  {therapistDetail?.therapist?.title || 'Clinical Practitioner'} • Comprehensive client lifecycle, session performance, and historical records.
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedTherapistId(null);
                  setTherapistDetail(null);
                }}
                className="p-2 text-[#132A24]/50 hover:text-[#132A24] rounded-xl hover:bg-[#132A24]/5 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-[#132A24]/10 bg-[#FAF7F2]/60 px-6 flex items-center gap-2 text-xs font-semibold">
              <button
                onClick={() => setDetailTab('overview')}
                className={`py-3 px-4 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                  detailTab === 'overview'
                    ? 'border-[#132A24] text-[#132A24]'
                    : 'border-transparent text-[#132A24]/60 hover:text-[#132A24]'
                }`}
              >
                <Stethoscope className="w-3.5 h-3.5" />
                <span>Profile & Metrics</span>
              </button>
              <button
                onClick={() => setDetailTab('clients')}
                className={`py-3 px-4 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                  detailTab === 'clients'
                    ? 'border-[#132A24] text-[#132A24]'
                    : 'border-transparent text-[#132A24]/60 hover:text-[#132A24]'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Client Roster ({therapistDetail?.clients?.length || 0})</span>
              </button>
              <button
                onClick={() => setDetailTab('sessions')}
                className={`py-3 px-4 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                  detailTab === 'sessions'
                    ? 'border-[#132A24] text-[#132A24]'
                    : 'border-transparent text-[#132A24]/60 hover:text-[#132A24]'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>Session Records ({therapistDetail?.sessions?.length || 0})</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {detailLoading || !therapistDetail ? (
                <div className="py-20 text-center text-[#132A24]/50">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#4E7A66]" />
                  <span>Loading practitioner intelligence dossier...</span>
                </div>
              ) : (
                <>
                  {/* TAB 1: OVERVIEW & PERFORMANCE */}
                  {detailTab === 'overview' && (
                    <div className="space-y-6">
                      {/* Summary Cards Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* A. Profile Card */}
                        <div className="border border-[#132A24]/10 rounded-2xl p-4 bg-[#FAF7F2] space-y-2">
                          <div className="flex items-center gap-2 text-xs font-bold text-[#132A24] uppercase tracking-wider">
                            <UserCheck className="w-3.5 h-3.5 text-[#4E7A66]" />
                            <span>Practitioner Profile</span>
                          </div>
                          <div className="font-bold text-sm text-[#132A24]">{therapistDetail.therapist.name}</div>
                          <div className="text-xs text-[#132A24]/70 space-y-1">
                            <div>
                              <strong>Title:</strong> {therapistDetail.therapist.title || 'Therapist'}
                            </div>
                            <div>
                              <strong>Qualifications:</strong> {therapistDetail.therapist.qualification || '—'}
                            </div>
                            <div>
                              <strong>Experience:</strong>{' '}
                              {therapistDetail.therapist.experienceYears
                                ? `${therapistDetail.therapist.experienceYears} Years`
                                : '—'}
                            </div>
                            <div>
                              <strong>Session Fee:</strong> ₹{therapistDetail.therapist.perSessionFee}
                            </div>
                            <div>
                              <strong>Email:</strong> {therapistDetail.therapist.email || '—'}
                            </div>
                            <div>
                              <strong>Phone:</strong> {therapistDetail.therapist.phone || '—'}
                            </div>
                          </div>
                        </div>

                        {/* B. Client Statistics Card */}
                        <div className="border border-[#132A24]/10 rounded-2xl p-4 bg-[#FAF7F2] space-y-2">
                          <div className="flex items-center gap-2 text-xs font-bold text-[#132A24] uppercase tracking-wider">
                            <Users className="w-3.5 h-3.5 text-[#4E7A66]" />
                            <span>Client Statistics</span>
                          </div>
                          <div className="text-xs text-[#132A24]/80 space-y-1.5 pt-1">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold">Unique Clients Ever:</span>
                              <span className="font-bold text-sm text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded-md">
                                {therapistDetail.clientStats.uniqueClientsEver}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Currently Active Clients:</span>
                              <span className="font-semibold text-emerald-700">
                                {therapistDetail.clientStats.activeClients}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Dormant Relationships:</span>
                              <span className="font-semibold text-amber-700">
                                {therapistDetail.clientStats.dormantRelationships}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Completed Relationships:</span>
                              <span className="font-semibold text-slate-700">
                                {therapistDetail.clientStats.completedRelationships}
                              </span>
                            </div>
                            <div className="flex items-center justify-between pt-1 border-t border-[#132A24]/10 text-[11px] text-[#132A24]/60">
                              <span>Total Historical Care Relationships:</span>
                              <span className="font-mono font-medium">
                                {therapistDetail.clientStats.totalRelationships}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* C. Session Statistics Card */}
                        <div className="border border-[#132A24]/10 rounded-2xl p-4 bg-[#FAF7F2] space-y-2">
                          <div className="flex items-center gap-2 text-xs font-bold text-[#132A24] uppercase tracking-wider">
                            <Calendar className="w-3.5 h-3.5 text-[#4E7A66]" />
                            <span>Session Statistics</span>
                          </div>
                          <div className="text-xs text-[#132A24]/80 space-y-1.5 pt-1">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold">Total Valid Sessions:</span>
                              <span className="font-bold text-sm text-[#132A24] bg-white border border-[#132A24]/15 px-2 py-0.5 rounded-md">
                                {therapistDetail.sessionStats.totalValidSessions}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Completed Sessions:</span>
                              <span className="font-semibold text-emerald-700">
                                {therapistDetail.sessionStats.completedSessions}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Upcoming Confirmed:</span>
                              <span className="font-semibold text-blue-700">
                                {therapistDetail.sessionStats.upcomingConfirmedSessions}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Cancelled (Excluded):</span>
                              <span className="font-semibold text-rose-700">
                                {therapistDetail.sessionStats.cancelledSessions}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>No-Show (Separated):</span>
                              <span className="font-semibold text-amber-700">
                                {therapistDetail.sessionStats.noShowSessions}
                              </span>
                            </div>
                            <div className="pt-1 border-t border-[#132A24]/10 text-[11px] text-[#132A24]/70 space-y-0.5">
                              <div>
                                First Session:{' '}
                                <strong>{formatDate(therapistDetail.sessionStats.firstCompletedSessionDate)}</strong>
                              </div>
                              <div>
                                Last Completed:{' '}
                                <strong>{formatDate(therapistDetail.sessionStats.mostRecentCompletedSessionDate, true)}</strong>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bio & Clinical Metadata */}
                      {therapistDetail.therapist.bio && (
                        <div className="border border-[#132A24]/10 rounded-2xl p-4 bg-white space-y-2">
                          <div className="text-xs font-bold text-[#132A24] uppercase tracking-wider">
                            Professional Clinical Bio
                          </div>
                          <p className="text-xs text-[#132A24]/80 leading-relaxed">
                            {therapistDetail.therapist.bio}
                          </p>
                        </div>
                      )}

                      {/* Specializations & Languages */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border border-[#132A24]/10 rounded-2xl p-4 bg-white space-y-2">
                          <div className="text-xs font-bold text-[#132A24] uppercase tracking-wider">
                            Specializations
                          </div>
                          {therapistDetail.therapist.specializations?.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5">
                              {therapistDetail.therapist.specializations.map((s, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 rounded-lg bg-[#4E7A66]/10 text-[#2D5A46] text-xs font-medium border border-[#4E7A66]/20"
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <div className="text-xs text-gray-400 italic">No specializations listed</div>
                          )}
                        </div>

                        <div className="border border-[#132A24]/10 rounded-2xl p-4 bg-white space-y-2">
                          <div className="text-xs font-bold text-[#132A24] uppercase tracking-wider">
                            Languages Spoken
                          </div>
                          {therapistDetail.therapist.languages?.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5">
                              {therapistDetail.therapist.languages.map((l, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 rounded-lg bg-[#132A24]/5 text-[#132A24] text-xs font-medium border border-[#132A24]/10"
                                >
                                  {l}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <div className="text-xs text-gray-400 italic">No languages specified</div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: CLIENT ROSTER */}
                  {detailTab === 'clients' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-[#132A24]">
                            Assigned Client Relationships ({therapistDetail.clients.length})
                          </h4>
                          <p className="text-[11px] text-[#132A24]/60">
                            Includes current active clients, dormant care, and historical transferred/completed relationships. Click any client to inspect the authoritative journey timeline.
                          </p>
                        </div>
                      </div>

                      <div className="border border-[#132A24]/10 rounded-2xl overflow-hidden bg-white">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="border-b border-[#132A24]/10 bg-[#FAF7F2]/80 text-[#132A24]/70 font-semibold">
                                <th className="py-3 px-4">Client</th>
                                <th className="py-3 px-4">Request Date</th>
                                <th className="py-3 px-4">Acceptance Status</th>
                                <th className="py-3 px-4">Consent</th>
                                <th className="py-3 px-4">First Session</th>
                                <th className="py-3 px-4 text-center">Valid Sessions</th>
                                <th className="py-3 px-4">Last Completed</th>
                                <th className="py-3 px-4">Status</th>
                                <th className="py-3 px-4 text-right">Action</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#132A24]/5">
                              {therapistDetail.clients.length === 0 ? (
                                <tr>
                                  <td colSpan={9} className="py-12 text-center text-[#132A24]/50 italic">
                                    No clients have been assigned to this therapist yet.
                                  </td>
                                </tr>
                              ) : (
                                therapistDetail.clients.map((c) => (
                                  <tr
                                    key={c.relationshipId}
                                    className="hover:bg-[#FAF7F2]/50 transition-colors cursor-pointer"
                                    onClick={() => setNestedRelationshipId(c.relationshipId)}
                                  >
                                    <td className="py-3 px-4">
                                      <div className="font-bold text-[#132A24]">{c.clientName}</div>
                                      <div className="text-[11px] text-[#132A24]/60">
                                        {c.clientEmail || c.clientPhone || '—'}
                                      </div>
                                    </td>
                                    <td className="py-3 px-4 text-[11px] text-[#132A24]/80">
                                      {formatDate(c.requestDate)}
                                    </td>
                                    <td className="py-3 px-4">
                                      <span
                                        className={`px-2 py-0.5 rounded-md text-[10px] font-semibold capitalize ${
                                          c.therapistAcceptanceStatus === 'accepted'
                                            ? 'bg-emerald-500/10 text-emerald-700'
                                            : 'bg-amber-500/10 text-amber-700'
                                        }`}
                                      >
                                        {c.therapistAcceptanceStatus}
                                      </span>
                                    </td>
                                    <td className="py-3 px-4">
                                      <span
                                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                          c.hasConsent
                                            ? 'bg-emerald-500/10 text-emerald-700'
                                            : 'bg-amber-500/10 text-amber-700'
                                        }`}
                                      >
                                        {c.consentStatus}
                                      </span>
                                    </td>
                                    <td className="py-3 px-4 text-[11px] text-[#132A24]/80">
                                      {formatDate(c.firstSessionDate)}
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                      <span className="font-bold text-xs bg-[#FAF7F2] border border-[#132A24]/10 px-2 py-0.5 rounded-full">
                                        {c.totalValidSessions}
                                      </span>
                                    </td>
                                    <td className="py-3 px-4 text-[11px] text-[#132A24]">
                                      {formatDate(c.lastCompletedSessionDate, true)}
                                    </td>
                                    <td className="py-3 px-4">{getRelationshipStatusBadge(c.relationshipStatus)}</td>
                                    <td className="py-3 px-4 text-right">
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setNestedRelationshipId(c.relationshipId);
                                        }}
                                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#132A24] text-white hover:bg-[#2C4A3E] transition-colors cursor-pointer"
                                      >
                                        Inspect
                                      </button>
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: CLINICAL SESSION RECORDS */}
                  {detailTab === 'sessions' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-[#132A24]">
                            Clinical Appointments History ({therapistDetail.sessions.length})
                          </h4>
                          <p className="text-[11px] text-[#132A24]/60">
                            Strict data privacy enforced. Includes scheduled, completed, and cancelled sessions.
                          </p>
                        </div>
                      </div>

                      <div className="border border-[#132A24]/10 rounded-2xl overflow-hidden bg-white">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="border-b border-[#132A24]/10 bg-[#FAF7F2]/80 text-[#132A24]/70 font-semibold">
                                <th className="py-3 px-4">Date & Time (IST)</th>
                                <th className="py-3 px-4">Client</th>
                                <th className="py-3 px-4">Session Modality</th>
                                <th className="py-3 px-4">Status</th>
                                <th className="py-3 px-4">Payment</th>
                                <th className="py-3 px-4">Meeting</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#132A24]/5">
                              {therapistDetail.sessions.length === 0 ? (
                                <tr>
                                  <td colSpan={6} className="py-12 text-center text-[#132A24]/50 italic">
                                    No appointments recorded for this therapist.
                                  </td>
                                </tr>
                              ) : (
                                therapistDetail.sessions.map((s) => (
                                  <tr key={s.id} className="hover:bg-[#FAF7F2]/40 transition-colors">
                                    <td className="py-3 px-4 font-medium text-[#132A24]">
                                      {formatDate(s.scheduledStart, true)}
                                    </td>
                                    <td className="py-3 px-4 font-semibold text-[#132A24]">
                                      {s.clientName}
                                    </td>
                                    <td className="py-3 px-4 capitalize text-[#132A24]/70">
                                      {s.sessionType}
                                    </td>
                                    <td className="py-3 px-4">
                                      <span
                                        className={`px-2 py-0.5 rounded-md text-[10px] font-semibold capitalize ${
                                          s.status === 'completed'
                                            ? 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20'
                                            : s.status === 'cancelled'
                                            ? 'bg-rose-500/10 text-rose-700 border border-rose-500/20'
                                            : s.status === 'no_show'
                                            ? 'bg-amber-500/10 text-amber-700 border border-amber-500/20'
                                            : 'bg-blue-500/10 text-blue-700 border border-blue-500/20'
                                        }`}
                                      >
                                        {s.status}
                                      </span>
                                    </td>
                                    <td className="py-3 px-4 capitalize text-[11px] text-[#132A24]/80">
                                      {s.paymentStatus || 'unpaid'}
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
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#132A24]/10 bg-[#FAF7F2] flex items-center justify-end">
              <button
                type="button"
                onClick={() => {
                  setSelectedTherapistId(null);
                  setTherapistDetail(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#132A24] text-white hover:bg-[#2C4A3E] transition-colors cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PHASE 4.D: REUSED THERAPY RELATIONSHIP DETAIL MODAL */}
      {/* ========================================================================= */}
      {nestedRelationshipId && (
        <RelationshipDetailModal
          relationshipId={nestedRelationshipId}
          onClose={() => setNestedRelationshipId(null)}
          showToast={showToast}
        />
      )}
    </div>
  );
}
