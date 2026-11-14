'use strict';
import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Search,
  Filter,
  RefreshCw,
  Phone,
  PhoneCall,
  MessageCircle,
  Mail,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Eye,
  X,
  FileText,
  UserCheck,
  Calendar,
  Sparkles,
  ExternalLink,
  AlertTriangle,
  Link,
  Copy,
  Check,
  Key,
  Share2,
} from 'lucide-react';
import { citiesMatch } from '../../lib/therapy/cityUtils';

export default function LeadPipelineView({ showToast }) {
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState([]);
  const [metrics, setMetrics] = useState({
    total: 0,
    intakeDropoffs: 0,
    matchesShownDropoffs: 0,
    completed: 0,
    contactedOrConverted: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Manual Matching states
  const [therapists, setTherapists] = useState([]);
  const [selectedTherapistId, setSelectedTherapistId] = useState('');
  const [connectDirectly, setConnectDirectly] = useState(true);
  const [isMatching, setIsMatching] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCredentials, setCopiedCredentials] = useState(false);

  const getFullBookingUrl = (relativeLink) => {
    if (!relativeLink) return '';
    if (relativeLink.startsWith('http')) return relativeLink;
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://ingresswithin.com';
    return `${origin}${relativeLink.startsWith('/') ? '' : '/'}${relativeLink}`;
  };

  const handleCopyBookingLink = async (link) => {
    const full = getFullBookingUrl(link);
    try {
      await navigator.clipboard.writeText(full);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
      if (showToast) showToast('Booking link copied to clipboard!', 'success');
    } catch {
      if (showToast) showToast('Failed to copy to clipboard', 'error');
    }
  };

  const handleCopyCredentials = async (lead) => {
    try {
      const clientId = lead.user_id || lead.id;
      const res = await fetch(`/api/admin/clients/${clientId}/magic-link`, { method: 'POST' });
      const data = await res.json();
      const setupUrl = data.claimUrl || 'https://ingresswithin.com/therapy/login';
      const therapistName = lead.selected_therapist_name || 'your assigned therapist';
      const message = `Hi ${lead.full_name || 'there'}, your Ingress Within Therapy portal with ${therapistName} is ready. Use your secure setup link to create your password and access your therapy consultations and clinician notes:\n${setupUrl}`;
      await navigator.clipboard.writeText(message);
      setCopiedCredentials(true);
      setTimeout(() => setCopiedCredentials(false), 2000);
      if (showToast) showToast('Magic Setup Link & portal message copied to clipboard!', 'success');
    } catch {
      const message = `Hi ${lead.full_name || 'there'}, you can sign in to your Ingress Within Therapy portal at https://ingresswithin.com/therapy/login using your phone number (${lead.phone_number}).`;
      await navigator.clipboard.writeText(message);
      setCopiedCredentials(true);
      setTimeout(() => setCopiedCredentials(false), 2000);
      if (showToast) showToast('Portal login link copied to clipboard', 'success');
    }
  };

  const getBookingWhatsAppLink = (lead, link) => {
    const digits = String(lead.phone_number || '').replace(/[^\d]/g, '');
    const therapistName = lead.selected_therapist_name || 'your therapist';
    const fullUrl = getFullBookingUrl(link);
    const text = encodeURIComponent(`Hi ${lead.full_name || 'there'}, your therapy consultation with ${therapistName} at Ingress Within is ready. Please review their clinical credentials, confirm the telehealth consent terms, and schedule your first session here: ${fullUrl}`);
    return `https://wa.me/${digits}?text=${text}`;
  };

  const handleGenerateBookingLink = async () => {
    if (!selectedLead) return;
    setIsMatching(true);
    try {
      const res = await fetch(`/api/admin/leads/${selectedLead.id}/booking-link`);
      const data = await res.json();
      if (res.ok && data.bookingLink) {
        if (showToast) showToast('Booking link generated successfully!', 'success');
        const updatedAnswers = {
          ...(selectedLead.answers || {}),
          booking_link: data.bookingLink,
          booking_token: data.bookingToken,
        };
        const updatedLead = {
          ...selectedLead,
          answers: updatedAnswers,
          selected_therapist_name: data.therapistName || selectedLead.selected_therapist_name,
        };
        setSelectedLead(updatedLead);
        fetchLeads();
      } else {
        if (showToast) showToast(data.error || 'Failed to generate booking link', 'error');
      }
    } catch (err) {
      console.error('Error generating booking link:', err);
      if (showToast) showToast('Network error generating booking link', 'error');
    } finally {
      setIsMatching(false);
    }
  };

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.set('search', searchTerm);
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (stageFilter !== 'all') params.set('stage', stageFilter);

      const res = await fetch(`/api/admin/leads?${params.toString()}`);
      const data = await res.json();
      if (res.ok) {
        setLeads(data.leads || []);
        if (data.metrics) setMetrics(data.metrics);
      } else {
        if (showToast) showToast(data.error || 'Failed to load leads', 'error');
      }
    } catch (err) {
      console.error('Error fetching leads:', err);
      if (showToast) showToast('Network error loading leads pipeline', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchTherapists = async () => {
    try {
      const res = await fetch('/api/admin/therapists?status=active&limit=100');
      const data = await res.json();
      if (res.ok && Array.isArray(data.therapists)) {
        setTherapists(data.therapists.filter((t) => t.verification_status === 'verified' || t.status === 'active'));
      }
    } catch {
      // Non-blocking
    }
  };

  useEffect(() => {
    fetchTherapists();
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [stageFilter, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchLeads();
  };

  const handleOpenLead = (lead) => {
    setSelectedLead(lead);
    setEditStatus(lead.follow_up_status || 'new');
    setEditNotes(lead.internal_notes || '');
    setSelectedTherapistId(lead.selected_therapist_id || '');
    setConnectDirectly(true);
  };

  const handleManualMatchLead = async () => {
    if (!selectedLead || !selectedTherapistId) return;
    setIsMatching(true);
    try {
      const res = await fetch(`/api/admin/leads/${selectedLead.id}/match`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          therapistId: selectedTherapistId,
          connectDirectly,
          internalNotes: editNotes.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const msg = connectDirectly
          ? `Matched & directly connected ${selectedLead.full_name || 'client'} with ${data.therapistName}`
          : `Assigned ${data.therapistName} and sent clinician match request`;
        if (showToast) showToast(msg, 'success');
        if (data.lead) {
          const leadToSet = {
            ...data.lead,
            answers: {
              ...(data.lead.answers || {}),
              booking_link: data.bookingLink || data.lead.answers?.booking_link,
              booking_token: data.bookingToken || data.lead.answers?.booking_token,
            },
          };
          setSelectedLead(leadToSet);
          setEditStatus(data.lead.follow_up_status || editStatus);
          setEditNotes(data.lead.internal_notes || editNotes);
        }
        fetchLeads();
      } else {
        if (showToast) showToast(data.error || 'Failed to manually match client', 'error');
      }
    } catch (err) {
      console.error('Error manually matching lead:', err);
      if (showToast) showToast('Network error while matching client', 'error');
    } finally {
      setIsMatching(false);
    }
  };

  const handleSaveLeadStatus = async () => {
    if (!selectedLead) return;
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/leads/${selectedLead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          follow_up_status: editStatus,
          internal_notes: editNotes,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (showToast) showToast('Lead follow-up updated successfully', 'success');
        setSelectedLead(data.lead);
        fetchLeads();
      } else {
        if (showToast) showToast(data.error || 'Failed to update lead', 'error');
      }
    } catch (err) {
      console.error('Error saving lead status:', err);
      if (showToast) showToast('Network error updating lead', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const formatStageLabel = (stage, step) => {
    switch (stage) {
      case 'contact_captured':
        return `Contact Entered (Step ${step || 3})`;
      case 'concerns_selected':
        return `Concerns Added (Step ${step || 5})`;
      case 'safety_evaluated':
        return `Safety Checked (Step ${step || 10})`;
      case 'preferences_set':
        return `Preferences Set (Step ${step || 13})`;
      case 'matches_shown':
        return `Matches Shown (Step ${step || 16})`;
      case 'no_matches_found':
        return `No Match Found (Step ${step || 16})`;
      case 'team_review_requested':
        return `Manual Match Requested (Step ${step || 16})`;
      case 'booking_initiated':
        return `Booking Started (Step ${step || 17})`;
      case 'completed':
        return 'Intake Completed';
      default:
        return stage ? stage.replace(/_/g, ' ') : `Step ${step || 0}`;
    }
  };

  const getStageBadgeStyle = (stage) => {
    switch (stage) {
      case 'matches_shown':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'no_matches_found':
      case 'team_review_requested':
        return 'bg-orange-50 text-orange-800 border-orange-200';
      case 'completed':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'booking_initiated':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      default:
        return 'bg-purple-50 text-purple-800 border-purple-200';
    }
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'new':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'contacted':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'callback_scheduled':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'converted':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'not_interested':
      case 'closed_lost':
        return 'bg-stone-100 text-stone-600 border-stone-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getWhatsAppLink = (phone, name) => {
    const digits = String(phone || '').replace(/[^\d]/g, '');
    const greeting = encodeURIComponent(`Hi ${name || 'there'}, this is Ingress Within Care Team following up on your therapy request. How can we support you today?`);
    return `https://wa.me/${digits}?text=${greeting}`;
  };

  return (
    <div className="space-y-6">
      {/* Header Info Banner */}
      <div className="bg-white border border-[#132A24]/10 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#1B5E52]" />
              <h2 className="text-lg font-serif font-semibold text-[#132A24]">
                Lead Pipeline &amp; Intake Drop-offs
              </h2>
            </div>
            <p className="text-xs text-[#132A24]/70 mt-1 max-w-2xl">
              Autosaves contact details the instant a client enters their phone number. Tracks longitudinal drop-off stages from intake to match review for clinical outreach and conversion.
            </p>
          </div>
          <button
            onClick={fetchLeads}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-[#132A24] bg-[#F7F9F8] border border-[#132A24]/10 rounded-xl hover:bg-[#EAF2EE] transition-colors self-start md:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Pipeline
          </button>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5 pt-4 border-t border-[#132A24]/10">
          <div className="p-3 bg-[#F7F9F8] rounded-xl border border-[#132A24]/5">
            <span className="text-[11px] font-medium text-[#132A24]/60 uppercase tracking-wider block">Total Leads Captured</span>
            <span className="text-xl font-semibold text-[#132A24] mt-1 block">{metrics.total}</span>
            <span className="text-[11px] text-[#132A24]/50">Autosaved contacts</span>
          </div>
          <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100">
            <span className="text-[11px] font-medium text-purple-900/70 uppercase tracking-wider block">Dropped at Intake</span>
            <span className="text-xl font-semibold text-purple-900 mt-1 block">{metrics.intakeDropoffs}</span>
            <span className="text-[11px] text-purple-700/60">Before seeing matches</span>
          </div>
          <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100">
            <span className="text-[11px] font-medium text-amber-900/70 uppercase tracking-wider block">Dropped after Matches</span>
            <span className="text-xl font-semibold text-amber-900 mt-1 block">{metrics.matchesShownDropoffs}</span>
            <span className="text-[11px] text-amber-700/60">Saw clinicians, no booking</span>
          </div>
          <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
            <span className="text-[11px] font-medium text-emerald-900/70 uppercase tracking-wider block">Followed Up / Converted</span>
            <span className="text-xl font-semibold text-emerald-900 mt-1 block">{metrics.contactedOrConverted}</span>
            <span className="text-[11px] text-emerald-700/60">Active outreach pipeline</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#132A24]/10 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#132A24]/40" />
            <input
              type="text"
              placeholder="Search by name, phone (+91...), or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#F7F9F8] border border-[#132A24]/15 rounded-xl focus:outline-hidden focus:border-[#1B5E52] focus:bg-white text-[#132A24]"
            />
          </form>

          <div className="flex items-center gap-2 flex-wrap text-xs">
            {/* Stage filter */}
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="px-3 py-2 bg-[#F7F9F8] border border-[#132A24]/15 rounded-xl text-[#132A24] focus:outline-hidden"
            >
              <option value="all">All Drop-off Stages</option>
              <option value="contact_captured">Contact Entered (Early Drop-off)</option>
              <option value="concerns_selected">Concerns Selected</option>
              <option value="safety_evaluated">Safety Evaluated</option>
              <option value="preferences_set">Preferences Set</option>
              <option value="no_matches_found">No Match Found (Needs Manual Match)</option>
              <option value="team_review_requested">Manual Match Requested</option>
              <option value="matches_shown">Matches Shown (High Value Lead)</option>
              <option value="completed">Completed Intakes</option>
            </select>

            {/* Follow-up status filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-[#F7F9F8] border border-[#132A24]/15 rounded-xl text-[#132A24] focus:outline-hidden"
            >
              <option value="all">All Follow-up States</option>
              <option value="new">🔴 New / Uncontacted</option>
              <option value="contacted">🔵 Contacted</option>
              <option value="callback_scheduled">🟡 Callback Scheduled</option>
              <option value="converted">🟢 Converted / Booked</option>
              <option value="not_interested">⚪ Not Interested</option>
            </select>
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white border border-[#132A24]/10 rounded-2xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-xs text-[#132A24]/60">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto text-[#1B5E52] mb-2" />
            Loading lead pipeline records…
          </div>
        ) : leads.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#132A24]/60">
            <User className="w-8 h-8 text-[#132A24]/30 mx-auto mb-2" />
            No leads found matching current filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#132A24]/[0.02] border-b border-[#132A24]/10 text-[#132A24]/60 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Client Contact</th>
                  <th className="py-3.5 px-4">Drop-off Stage</th>
                  <th className="py-3.5 px-4">Key Preferences</th>
                  <th className="py-3.5 px-4">Matches Viewed</th>
                  <th className="py-3.5 px-4">Follow-up Status</th>
                  <th className="py-3.5 px-4">Last Activity</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#132A24]/5">
                {leads.map((lead) => {
                  const hasMatches = Array.isArray(lead.matches_shown) && lead.matches_shown.length > 0;
                  return (
                    <tr key={lead.id} className="hover:bg-[#132A24]/[0.01] transition-colors">
                      {/* Contact Info */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-[#132A24] flex items-center gap-1.5">
                          <span>{lead.full_name || 'Anonymous Client'}</span>
                          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded-sm bg-gray-100 text-gray-600">
                            {lead.journey_type || 'guided'}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#132A24]/70 flex items-center gap-2 mt-0.5">
                          <a
                            href={`tel:${lead.phone_number}`}
                            className="inline-flex items-center gap-1 text-[#1B5E52] hover:underline font-mono"
                          >
                            <Phone className="w-3 h-3" />
                            {lead.phone_number}
                          </a>
                          {lead.email && (
                            <span className="text-[#132A24]/40">· {lead.email}</span>
                          )}
                        </div>
                      </td>

                      {/* Drop-off Stage */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border ${getStageBadgeStyle(lead.drop_off_stage)}`}>
                          {formatStageLabel(lead.drop_off_stage, lead.current_step)}
                        </span>
                      </td>

                      {/* Key Preferences */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5 max-w-[200px]">
                          {lead.concerns && lead.concerns.length > 0 && (
                            <div className="truncate text-[11px] text-[#132A24]/80">
                              <span className="font-semibold">Concerns:</span> {lead.concerns.slice(0, 2).join(', ')}{lead.concerns.length > 2 ? ` +${lead.concerns.length - 2}` : ''}
                            </div>
                          )}
                          <div className="text-[11px] text-[#132A24]/60 flex items-center gap-2">
                            {lead.preferred_language && <span>Lang: {lead.preferred_language}</span>}
                            {lead.therapist_gender_pref && <span>Gender: {lead.therapist_gender_pref}</span>}
                          </div>
                          {!lead.concerns?.length && !lead.preferred_language && (
                            <span className="text-[#132A24]/40 italic">Dropped before preferences</span>
                          )}
                        </div>
                      </td>

                      {/* Matches Viewed / Assigned */}
                      <td className="py-3.5 px-4">
                        {lead.selected_therapist_name ? (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" />
                              Matched: {lead.selected_therapist_name}
                            </span>
                          </div>
                        ) : hasMatches ? (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1B5E52]">
                              <Sparkles className="w-3 h-3 text-amber-500" />
                              {lead.matches_shown.length} Clinicians Shown
                            </span>
                            <div className="text-[10px] text-[#132A24]/60 truncate max-w-[150px]">
                              {lead.matches_shown.map((m) => m.name).join(', ')}
                            </div>
                          </div>
                        ) : lead.drop_off_stage === 'no_matches_found' || lead.drop_off_stage === 'team_review_requested' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-medium bg-orange-50 text-orange-800 border border-orange-200">
                            0 Auto-Matches · Needs Manual Match
                          </span>
                        ) : (
                          <span className="text-[#132A24]/40 text-[11px]">None shown</span>
                        )}
                      </td>

                      {/* Follow-up Status */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium border capitalize ${getStatusBadgeStyle(lead.follow_up_status)}`}>
                          {lead.follow_up_status ? lead.follow_up_status.replace(/_/g, ' ') : 'New'}
                        </span>
                      </td>

                      {/* Last Activity */}
                      <td className="py-3.5 px-4 text-[#132A24]/60 text-[11px]">
                        {lead.last_active_at
                          ? new Date(lead.last_active_at).toLocaleString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : '—'}
                      </td>

                      {/* Action buttons */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          {/* Direct WhatsApp Call/Chat */}
                          <a
                            href={getWhatsAppLink(lead.phone_number, lead.full_name)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
                            title="Chat on WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>

                          {/* Direct Phone Call */}
                          <a
                            href={`tel:${lead.phone_number}`}
                            className="p-1.5 text-[#1B5E52] bg-[#EAF2EE] hover:bg-[#D5E6DE] border border-[#1B5E52]/20 rounded-lg transition-colors"
                            title="Call Phone"
                          >
                            <PhoneCall className="w-3.5 h-3.5" />
                          </a>

                          {/* Quick copy booking link if issued */}
                          {lead.answers?.booking_link && (
                            <button
                              type="button"
                              onClick={() => handleCopyBookingLink(lead.answers.booking_link)}
                              className="p-1.5 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors cursor-pointer"
                              title="Copy Client Booking Link"
                            >
                              <Link className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Manually match client & therapist */}
                          <button
                            onClick={() => handleOpenLead(lead)}
                            className="inline-flex items-center gap-1 px-2 py-1.5 text-[11px] font-semibold text-[#1B5E52] bg-[#EAF2EE] hover:bg-[#D5E6DE] border border-[#1B5E52]/25 rounded-lg transition-colors cursor-pointer"
                            title="Manually Match Therapist"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>{lead.selected_therapist_name ? 'Rematch' : 'Match'}</span>
                          </button>

                          {/* View details & edit modal */}
                          <button
                            onClick={() => handleOpenLead(lead)}
                            className="p-1.5 text-[#132A24]/70 hover:text-[#132A24] bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg transition-colors"
                            title="View Lead Profile"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Drawer: View & Update Lead */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl border border-[#132A24]/10 p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#132A24]/10">
              <div>
                <h3 className="font-serif font-semibold text-lg text-[#132A24]">
                  Lead Profile &amp; Follow-up Outreach
                </h3>
                <p className="text-xs text-[#132A24]/60">
                  ID: {selectedLead.id} · Session: {selectedLead.session_id}
                </p>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contact quick actions banner */}
            <div className="bg-[#F7F9F8] p-4 rounded-xl border border-[#132A24]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="font-semibold text-sm text-[#132A24]">
                  {selectedLead.full_name || 'Anonymous Client'}
                </div>
                <div className="text-xs text-[#132A24]/70 mt-0.5 flex items-center gap-3">
                  <span className="font-mono">{selectedLead.phone_number}</span>
                  {selectedLead.email && <span>{selectedLead.email}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={getWhatsAppLink(selectedLead.phone_number, selectedLead.full_name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-800 bg-emerald-100/70 border border-emerald-300 rounded-lg hover:bg-emerald-200/70"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  WhatsApp
                </a>
                <a
                  href={`tel:${selectedLead.phone_number}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#1B5E52] bg-[#EAF2EE] border border-[#1B5E52]/30 rounded-lg hover:bg-[#D5E6DE]"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Call
                </a>
              </div>
            </div>

            {/* Dedicated Booking & Consent Link Banner */}
            {(selectedLead.selected_therapist_name || selectedLead.answers?.booking_link) && (
              <div className="bg-gradient-to-br from-emerald-50 via-teal-50/40 to-white p-4 rounded-xl border border-emerald-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#1B5E52] text-white flex items-center justify-center shadow-xs">
                      <Link className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-emerald-950 uppercase tracking-wider">
                        Client Consent &amp; First Session Link
                      </h4>
                      <p className="text-[11px] text-emerald-800/80">
                        Zero login required for client. Enables practitioner review, clinical consent, and slot payment.
                      </p>
                    </div>
                  </div>
                  {selectedLead.answers?.booking_link ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300">
                      <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                      Active Token
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleGenerateBookingLink}
                      disabled={isMatching}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#1B5E52] hover:bg-[#144A41] rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-60"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      {isMatching ? 'Generating Link…' : 'Generate Booking Link'}
                    </button>
                  )}
                </div>

                {selectedLead.answers?.booking_link && (
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={getFullBookingUrl(selectedLead.answers.booking_link)}
                        className="flex-1 px-3 py-2 text-xs bg-white border border-emerald-300/80 rounded-lg text-[#132A24] font-mono select-all focus:outline-hidden"
                      />
                      <button
                        type="button"
                        onClick={() => handleCopyBookingLink(selectedLead.answers.booking_link)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-950 bg-white border border-emerald-300 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                        title="Copy Link to Clipboard"
                      >
                        {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                      </button>
                      <a
                        href={selectedLead.answers.booking_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-emerald-800 bg-white border border-emerald-300 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Test Booking Link in New Tab"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <a
                        href={getBookingWhatsAppLink(selectedLead, selectedLead.answers.booking_link)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-900 bg-emerald-100/90 border border-emerald-300 hover:bg-emerald-200 rounded-lg transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-700" />
                        Send Booking Link via WhatsApp
                      </a>
                      {selectedLead.email && (
                        <a
                          href={`mailto:${selectedLead.email}?subject=${encodeURIComponent(`Your Ingress Within Therapy Consultation with ${selectedLead.selected_therapist_name || 'Practitioner'}`)}&body=${encodeURIComponent(`Hi ${selectedLead.full_name || 'there'},\n\nYour therapy intake with Ingress Within has been assigned to ${selectedLead.selected_therapist_name || 'your clinician'}.\n\nPlease review their clinical credentials, confirm the telehealth consent terms, and schedule your first session date & time here:\n${getFullBookingUrl(selectedLead.answers.booking_link)}\n\nBest regards,\nIngress Within Care Team`)}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#132A24] bg-white border border-stone-300 hover:bg-stone-50 rounded-lg transition-colors"
                        >
                          <Mail className="w-3.5 h-3.5 text-[#132A24]/70" />
                          Send via Email
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => handleCopyCredentials(selectedLead)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#1B5E52] bg-white border border-[#1B5E52]/30 hover:bg-[#EAF2EE] rounded-lg transition-colors cursor-pointer"
                        title="Copy message sharing login instructions to client for post-session portal access"
                      >
                        {copiedCredentials ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Key className="w-3.5 h-3.5 text-[#1B5E52]" />}
                        <span>{copiedCredentials ? 'Portal Message Copied' : 'Share Portal Access'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Intake progress summary */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-[#132A24] uppercase tracking-wider">
                Intake Progress &amp; Drop-off Details
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                  <span className="text-[#132A24]/60 block text-[11px]">Journey Funnel</span>
                  <strong className="text-[#132A24] capitalize">{selectedLead.journey_type || 'guided'}</strong>
                </div>
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                  <span className="text-[#132A24]/60 block text-[11px]">Furthest Stage Reached</span>
                  <strong className="text-[#132A24]">
                    {formatStageLabel(selectedLead.drop_off_stage, selectedLead.current_step)}
                  </strong>
                </div>
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                  <span className="text-[#132A24]/60 block text-[11px]">Language Preference</span>
                  <strong className="text-[#132A24]">{selectedLead.preferred_language || 'Not specified'}</strong>
                </div>
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                  <span className="text-[#132A24]/60 block text-[11px]">Therapist Gender Preference</span>
                  <strong className="text-[#132A24]">{selectedLead.therapist_gender_pref || 'No preference'}</strong>
                </div>
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                  <span className="text-[#132A24]/60 block text-[11px]">Client City</span>
                  <strong className="text-[#132A24]">{selectedLead.answers?.city || 'Not provided'}</strong>
                </div>
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                  <span className="text-[#132A24]/60 block text-[11px]">Budget Range</span>
                  <strong className="text-[#132A24]">{selectedLead.answers?.budget || (selectedLead.budget ? `₹${selectedLead.budget}` : 'Flexible')}</strong>
                </div>
              </div>

              {selectedLead.concerns && selectedLead.concerns.length > 0 && (
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs">
                  <span className="text-[#132A24]/60 block text-[11px] mb-1">Presenting Concerns</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedLead.concerns.map((c, i) => (
                      <span key={i} className="px-2 py-0.5 bg-white border border-stone-300 rounded-md text-[#132A24]">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Matches viewed */}
              {Array.isArray(selectedLead.matches_shown) && selectedLead.matches_shown.length > 0 && (
                <div className="p-3 bg-amber-50/70 rounded-lg border border-amber-200 text-xs">
                  <span className="text-amber-900 font-semibold block text-[11px] mb-1.5">
                    Matched Clinicians Shown to Client:
                  </span>
                  <div className="space-y-1">
                    {selectedLead.matches_shown.map((m, idx) => (
                      <div key={idx} className="flex items-center justify-between text-[#132A24] bg-white/80 p-1.5 rounded-sm">
                        <span>{m.name} ({m.credentials || 'Therapist'})</span>
                        {m.score && <span className="font-semibold text-[#1B5E52]">{m.score}% Fit</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Manual Client–Therapist Matching */}
            <div className="space-y-3 pt-3 border-t border-[#132A24]/10">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-[#132A24] uppercase tracking-wider flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-[#1B5E52]" />
                  <span>Manual Client–Therapist Matching</span>
                </h4>
                {selectedLead.selected_therapist_name && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" />
                    Matched: {selectedLead.selected_therapist_name}
                  </span>
                )}
              </div>

              <p className="text-[11px] text-[#132A24]/65 leading-relaxed">
                Manually assign a verified active clinician when automated matching finds no fit or a client drops off before booking.
              </p>

              <div className="space-y-2.5 bg-[#F7F9F8] p-3.5 rounded-xl border border-[#132A24]/10">
                <div>
                  <label className="block text-[11px] font-medium text-[#132A24] mb-1">
                    Select Verified Therapist
                  </label>
                  <select
                    value={selectedTherapistId}
                    onChange={(e) => setSelectedTherapistId(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-white border border-[#132A24]/20 rounded-xl text-[#132A24]"
                  >
                    <option value="">-- Choose an active therapist --</option>
                    {therapists.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.full_name} ({t.qualification || t.title || 'Consultant'} · {t.city || 'Telehealth'} · ₹{t.per_session_fee || 1500}/session)
                      </option>
                    ))}
                  </select>
                </div>

                {selectedTherapistId && (() => {
                  const chosen = therapists.find((th) => th.id === selectedTherapistId);
                  if (!chosen) return null;
                  const leadLang = selectedLead.preferred_language || selectedLead.answers?.language;
                  const leadGender = selectedLead.therapist_gender_pref || selectedLead.answers?.therapistGender;
                  const leadCity = selectedLead.answers?.city;
                  const matchesLang =
                    leadLang &&
                    leadLang !== 'No preference' &&
                    Array.isArray(chosen.languages) &&
                    chosen.languages.some((l) => String(l || '').toLowerCase().includes(String(leadLang).toLowerCase()));
                  const matchesGender =
                    leadGender &&
                    leadGender !== 'No preference' &&
                    String(chosen.gender || '').toLowerCase() === String(leadGender).toLowerCase();
                  const isSameCity = Boolean(leadCity && chosen.city && citiesMatch(leadCity, chosen.city));

                  return (
                    <div className="p-3 bg-white border border-[#D5DFDA] rounded-xl text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <strong className="text-[#132A24] font-semibold">{chosen.full_name}</strong>
                        <span className="font-mono text-[#1B5E52] font-semibold">
                          ₹{chosen.per_session_fee || 1500}/session
                        </span>
                      </div>
                      <div className="text-[11px] text-[#4E635E]">
                        {chosen.qualification || chosen.title || 'Consultant Psychologist'} · {chosen.gender || 'Clinician'} · {chosen.city || 'Telehealth'}
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                        {Array.isArray(chosen.languages) && chosen.languages.length > 0 && (
                          <span className="text-[11px] text-[#132A24]/70">
                            Languages: {chosen.languages.join(', ')}
                          </span>
                        )}
                        {matchesLang && (
                          <span className="px-1.5 py-0.5 rounded-sm bg-emerald-100 text-emerald-800 text-[10px] font-semibold">
                            ✓ Matches Language
                          </span>
                        )}
                        {matchesGender && (
                          <span className="px-1.5 py-0.5 rounded-sm bg-emerald-100 text-emerald-800 text-[10px] font-semibold">
                            ✓ Matches Gender
                          </span>
                        )}
                        {isSameCity && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm bg-amber-100 text-amber-900 text-[10px] font-semibold">
                            <AlertTriangle className="w-3 h-3" />
                            Same City ({chosen.city}) — Dual Relationship Caution
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {selectedTherapistId && (
                  <label className="flex items-start gap-2.5 p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/50 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={connectDirectly}
                      onChange={(e) => setConnectDirectly(e.target.checked)}
                      className="mt-0.5 rounded text-emerald-600"
                    />
                    <div>
                      <span className="font-semibold text-emerald-950 block">
                        Directly connect care relationship
                      </span>
                      <span className="text-[11px] text-emerald-800/80 block">
                        Immediately establishes an active therapy relationship and marks this lead converted, instead of waiting for therapist acceptance.
                      </span>
                    </div>
                  </label>
                )}

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleManualMatchLead}
                    disabled={!selectedTherapistId || isMatching}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#1B5E52] hover:bg-[#144A41] rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>
                      {isMatching
                        ? 'Matching Client…'
                        : connectDirectly
                        ? 'Confirm & Directly Match Client'
                        : 'Assign & Request Clinician'}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Follow-up controls */}
            <div className="space-y-3 pt-3 border-t border-[#132A24]/10">
              <h4 className="text-xs font-semibold text-[#132A24] uppercase tracking-wider">
                Manage Outreach &amp; Pipeline Status
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#132A24] mb-1">
                    Follow-up Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-[#F7F9F8] border border-[#132A24]/20 rounded-xl text-[#132A24]"
                  >
                    <option value="new">🔴 New / Uncontacted</option>
                    <option value="contacted">🔵 Contacted Client</option>
                    <option value="callback_scheduled">🟡 Callback Scheduled</option>
                    <option value="converted">🟢 Converted / Therapy Booked</option>
                    <option value="closed_lost">⚪ Closed / Dropped</option>
                    <option value="not_interested">⚪ Not Interested</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#132A24] mb-1">
                  Internal Care Notes &amp; Follow-up Log
                </label>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Record call outcome, client needs, follow-up timeline..."
                  rows={3}
                  className="w-full text-xs p-3 bg-[#F7F9F8] border border-[#132A24]/20 rounded-xl text-[#132A24] focus:bg-white focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedLead(null)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveLeadStatus}
                  disabled={isUpdating}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#1B5E52] hover:bg-[#144A41] rounded-xl transition-colors disabled:opacity-50"
                >
                  {isUpdating ? 'Saving…' : 'Save Lead Updates'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
