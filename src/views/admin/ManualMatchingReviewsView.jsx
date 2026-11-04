'use strict';
import React, { useState, useEffect } from 'react';
import {
  ClipboardList,
  Search,
  Filter,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  ChevronRight,
  Eye,
  ShieldCheck,
  Lock,
  User,
  HeartHandshake,
  Calendar,
  X,
  Send,
} from 'lucide-react';

export default function ManualMatchingReviewsView({ showToast }) {
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [counts, setCounts] = useState({
    total: 0,
    manual_review_required: 0,
    under_review: 0,
    therapist_identified: 0,
    resolved: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedReview, setSelectedReview] = useState(null);

  // Assignment modal states
  const [therapists, setTherapists] = useState([]);
  const [selectedTherapistId, setSelectedTherapistId] = useState('');
  const [updateStatus, setUpdateStatus] = useState('');
  const [internalNotes, setInternalNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const url = statusFilter && statusFilter !== 'all'
        ? `/api/admin/manual-matching-reviews?status=${statusFilter}`
        : '/api/admin/manual-matching-reviews';
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok && data.success) {
        setReviews(data.reviews || []);
        if (data.counts) setCounts(data.counts);
      } else {
        showToast(data.error?.message || 'Failed to load matching reviews.', true);
      }
    } catch (err) {
      showToast('Network error loading matching reviews.', true);
    } finally {
      setLoading(false);
    }
  };

  const fetchTherapists = async () => {
    try {
      const res = await fetch('/api/admin/therapists?status=active');
      const data = await res.json();
      if (res.ok && data.therapists) {
        setTherapists(data.therapists);
      }
    } catch {}
  };

  useEffect(() => {
    fetchReviews();
    fetchTherapists();
  }, [statusFilter]);

  const handleOpenReview = (rev) => {
    setSelectedReview(rev);
    setUpdateStatus(rev.review_status);
    setInternalNotes(rev.internal_notes || '');
    setSelectedTherapistId(rev.identified_therapist_id || '');
  };

  const handleSaveReview = async () => {
    if (!selectedReview) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/manual-matching-reviews/${selectedReview.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewStatus: updateStatus,
          internalNotes: internalNotes.trim(),
          identifiedTherapistId: selectedTherapistId || null,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Matching review successfully updated.');
        setSelectedReview(null);
        fetchReviews();
      } else {
        showToast(data.error?.message || 'Failed to update review.', true);
      }
    } catch (err) {
      showToast('Error updating review.', true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredReviews = reviews.filter((r) => {
    const q = searchTerm.toLowerCase();
    const ref = (r.reference_id || '').toLowerCase();
    const name = (r.clientName || '').toLowerCase();
    const email = (r.clientEmail || '').toLowerCase();
    return ref.includes(q) || name.includes(q) || email.includes(q);
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'manual_review_required':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
            <Clock size={11} />
            <span>Manual Review Required</span>
          </span>
        );
      case 'under_review':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-blue-800 border border-blue-200">
            <span>Under Clinical Review</span>
          </span>
        );
      case 'therapist_identified':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-purple-50 text-purple-800 border border-purple-200">
            <UserCheck size={11} />
            <span>Therapist Identified</span>
          </span>
        );
      case 'resolved':
      case 'closed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 size={11} />
            <span>Resolved</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-gray-100 text-gray-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-2xl font-bold text-[#132A24]">
              Intake Matching Reviews
            </h2>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#132A24]/10 text-primary">
              Clinical Team Coordination
            </span>
          </div>
          <p className="text-xs text-mid mt-0.5">
            Authorized management of unmatched intakes. Ensures zero automated clinician broadcasts and maintains patient confidentiality.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchReviews}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-primary/20 hover:border-accent text-primary hover:bg-primary/5 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer shadow-2xs self-start"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* METRICS ROW */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-[#132A24]/10 shadow-2xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-mid mb-1">
            Total Reviews
          </div>
          <div className="text-2xl font-serif font-bold text-primary">
            {counts.total}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 shadow-2xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-amber-800 mb-1">
            Action Required
          </div>
          <div className="text-2xl font-serif font-bold text-amber-900">
            {counts.manual_review_required}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/80 shadow-2xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-blue-800 mb-1">
            Under Review
          </div>
          <div className="text-2xl font-serif font-bold text-blue-900">
            {counts.under_review}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 shadow-2xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 mb-1">
            Resolved / Assigned
          </div>
          <div className="text-2xl font-serif font-bold text-emerald-900">
            {counts.resolved + counts.therapist_identified}
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white border border-[#132A24]/10 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <Search size={15} className="text-mid/60 ml-2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search reference ID, client name, or email..."
            className="w-full text-xs text-primary bg-transparent outline-none placeholder:text-mid/50"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={14} className="text-mid/60" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-[#FAF8F5] border border-primary/15 rounded-xl px-3 py-1.5 text-primary outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="manual_review_required">Manual Review Required</option>
            <option value="under_review">Under Review</option>
            <option value="therapist_identified">Therapist Identified</option>
            <option value="resolved">Resolved / Closed</option>
          </select>
        </div>
      </div>

      {/* REVIEWS TABLE */}
      <div className="bg-white border border-[#132A24]/10 rounded-2xl overflow-hidden shadow-2xs">
        {loading ? (
          <div className="p-12 text-center text-xs text-mid">
            Loading matching reviews...
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="p-12 text-center text-xs text-mid space-y-2">
            <ShieldCheck size={28} className="mx-auto text-emerald-700" />
            <div className="font-semibold text-primary">No pending reviews found</div>
            <p className="font-light text-mid/80 max-w-sm mx-auto">
              All client intakes either successfully matched eligible clinicians or have been fully coordinated by the clinical team.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#132A24]/10 bg-[#FAF8F5] text-mid font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Reference &amp; Date</th>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Type &amp; Needs</th>
                  <th className="py-3 px-4">Unmet Criteria / Reason</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#132A24]/8">
                {filteredReviews.map((rev) => {
                  const reqs = rev.matching_requirements || {};
                  const concerns = Array.isArray(reqs.concerns) ? reqs.concerns.join(', ') : 'General';
                  const dateStr = rev.created_at ? new Date(rev.created_at).toLocaleDateString() : 'N/A';

                  return (
                    <tr key={rev.id || rev.reference_id} className="hover:bg-primary/[0.02] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-primary">{rev.reference_id}</div>
                        <div className="text-[11px] text-mid/70">{dateStr}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-primary">{rev.clientName}</div>
                        <div className="text-[11px] text-mid/70">{rev.clientEmail}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-medium text-primary">{rev.therapy_type}</div>
                        <div className="text-[11px] text-mid truncate max-w-[200px]" title={concerns}>
                          {concerns}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-mid/90 font-light truncate max-w-[220px]" title={rev.no_match_reason}>
                          {rev.no_match_reason || 'Criteria exceeded available capacity.'}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        {getStatusBadge(rev.review_status)}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleOpenReview(rev)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-primary/20 hover:border-accent hover:bg-primary/5 text-primary text-[11px] font-semibold uppercase tracking-wider transition-all cursor-pointer"
                        >
                          <span>Review</span>
                          <Eye size={12} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* REVIEW & MANUAL ASSIGNMENT MODAL */}
      {selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#132A24]/40 backdrop-blur-xs">
          <div className="bg-white border border-[#132A24]/12 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#132A24]/10 mb-5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">
                  Intake Coordination File
                </span>
                <h3 className="font-serif text-xl font-bold text-primary">
                  {selectedReview.reference_id}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReview(null)}
                className="w-8 h-8 rounded-full border border-primary/10 flex items-center justify-center text-mid hover:text-primary cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-5 text-xs">
              {/* Client & Request Overview */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 bg-[#FAF8F5] rounded-2xl border border-primary/8">
                <div>
                  <div className="text-[10px] font-bold text-mid uppercase">Client Name</div>
                  <div className="font-medium text-primary mt-0.5">{selectedReview.clientName}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-mid uppercase">Email</div>
                  <div className="font-medium text-primary mt-0.5">{selectedReview.clientEmail}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-mid uppercase">Phone</div>
                  <div className="font-medium text-primary mt-0.5">{selectedReview.clientPhone}</div>
                </div>
              </div>

              {/* Matching Requirements */}
              <div className="space-y-2">
                <div className="font-bold text-primary uppercase text-[10px] tracking-wider">
                  Submitted Requirements
                </div>
                <div className="p-3.5 rounded-xl border border-primary/10 bg-white space-y-1.5 text-mid font-light leading-relaxed">
                  <div>
                    <strong className="text-primary font-medium">Therapy Type:</strong> {selectedReview.therapy_type}
                  </div>
                  <div>
                    <strong className="text-primary font-medium">Concerns:</strong> {Array.isArray(selectedReview.matching_requirements?.concerns) ? selectedReview.matching_requirements.concerns.join(', ') : 'Not specified'}
                  </div>
                  <div>
                    <strong className="text-primary font-medium">Format &amp; City:</strong> {selectedReview.matching_requirements?.format || 'Telehealth'} {selectedReview.matching_requirements?.city ? `(${selectedReview.matching_requirements.city})` : ''}
                  </div>
                  <div>
                    <strong className="text-primary font-medium">Languages:</strong> {Array.isArray(selectedReview.matching_requirements?.languages) ? selectedReview.matching_requirements.languages.join(', ') : 'English'}
                  </div>
                  <div>
                    <strong className="text-primary font-medium">Budget:</strong> {selectedReview.matching_requirements?.budget || 'Flexible'}
                  </div>
                  <div>
                    <strong className="text-primary font-medium">Gender Preference:</strong> {selectedReview.matching_requirements?.genderPreference || 'No preference'}
                  </div>
                </div>
              </div>

              {/* Status Update Form */}
              <div className="space-y-2">
                <label className="block font-bold text-primary uppercase text-[10px] tracking-wider">
                  Review Status
                </label>
                <select
                  value={updateStatus}
                  onChange={(e) => setUpdateStatus(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-primary/15 text-xs text-primary bg-white outline-none"
                >
                  <option value="manual_review_required">Manual Review Required</option>
                  <option value="under_review">Under Review</option>
                  <option value="therapist_identified">Therapist Identified</option>
                  <option value="awaiting_therapist_acceptance">Awaiting Therapist Acceptance</option>
                  <option value="client_contacted">Client Contacted</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              {/* Clinician Assignment */}
              <div className="space-y-2">
                <label className="block font-bold text-primary uppercase text-[10px] tracking-wider">
                  Manually Assign Verified Therapist (Optional)
                </label>
                <select
                  value={selectedTherapistId}
                  onChange={(e) => {
                    setSelectedTherapistId(e.target.value);
                    if (e.target.value && updateStatus === 'manual_review_required') {
                      setUpdateStatus('therapist_identified');
                    }
                  }}
                  className="w-full p-2.5 rounded-xl border border-primary/15 text-xs text-primary bg-white outline-none"
                >
                  <option value="">-- No Therapist Assigned --</option>
                  {therapists.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.full_name} ({t.qualification || 'Consultant'} · ₹{t.per_session_fee || 1500}/session)
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-mid font-light">
                  Assigning a clinician directly coordinates care with that specific verified therapist. It will never broadcast to or notify unauthorized therapists.
                </p>
              </div>

              {/* Internal Notes */}
              <div className="space-y-2">
                <label className="block font-bold text-primary uppercase text-[10px] tracking-wider">
                  Internal Clinical Notes
                </label>
                <textarea
                  rows={3}
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="Notes on coordination, outreach, or therapist fit..."
                  className="w-full p-2.5 rounded-xl border border-primary/15 text-xs text-primary outline-none resize-none"
                />
              </div>

              {/* Audit Trail */}
              {selectedReview.audit_trail && selectedReview.audit_trail.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-primary/10">
                  <div className="font-bold text-primary uppercase text-[10px] tracking-wider">
                    Audit History
                  </div>
                  <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                    {selectedReview.audit_trail.map((entry, idx) => (
                      <div key={idx} className="p-2 rounded-lg bg-[#FAF8F5] border border-primary/8 text-[11px] flex items-start justify-between gap-2">
                        <div>
                          <strong className="text-primary">{entry.actor}:</strong> {entry.details || entry.action}
                        </div>
                        <div className="text-mid/60 text-[10px] shrink-0">
                          {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#132A24]/10 mt-6">
              <button
                type="button"
                onClick={() => setSelectedReview(null)}
                className="px-4 py-2 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-primary/5 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSaveReview}
                className="px-6 py-2 bg-primary hover:bg-primary/90 text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <CheckCircle2 size={13} />
                <span>Save Review</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
