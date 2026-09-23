import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  HelpCircle,
  Shield,
  ArrowRight,
  Filter
} from 'lucide-react';

export default function TherapistRequestsView({ onNavigate }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'pending' | 'accepted'

  const fetchRequests = async () => {
    try {
      const res = await fetch('/api/therapist/requests');
      if (res.ok) {
        const json = await res.json();
        setRequests(json.requests || []);
      }
    } catch (err) {
      console.error('Failed to load requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (matchId, action) => {
    setActioningId(matchId);
    try {
      const res = await fetch(`/api/therapist/requests/${matchId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        await fetchRequests();
      }
    } catch (err) {
      console.error('Action failed:', err);
    } finally {
      setActioningId(null);
    }
  };

  const filtered = requests.filter((r) => {
    if (filterStatus === 'pending') {
      return r.matchStatus === 'candidate' || r.matchStatus === 'shortlisted';
    }
    if (filterStatus === 'accepted') {
      return r.matchStatus === 'selected';
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#132A24]/10 pb-6">
        <div>
          <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#4E7A66]">
            Patient Matching Engine
          </span>
          <h1 className="font-serif text-3xl font-normal text-[#132A24] mt-1">
            New Client Requests
          </h1>
        </div>

        {/* Filter Toggle */}
        <div className="flex rounded-lg bg-[#132A24]/5 p-1 border border-[#132A24]/10 text-xs">
          {['all', 'pending', 'accepted'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-md font-medium capitalize transition-all cursor-pointer ${
                filterStatus === st
                  ? 'bg-white text-[#132A24] shadow-xs'
                  : 'text-[#132A24]/60 hover:text-[#132A24]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-[#132A24]/50 animate-pulse">
          Loading assigned requests...
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-[#132A24]/10 rounded-2xl p-12 text-center space-y-3">
          <Users size={36} className="mx-auto text-[#132A24]/30" />
          <h3 className="font-serif text-xl font-normal text-[#132A24]">No Matching Requests</h3>
          <p className="text-xs text-[#132A24]/60 max-w-sm mx-auto leading-relaxed">
            When clients complete their intake journey and are matched with your clinical specialties, their consultation requests will appear here for review.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((req) => {
            const isPending = req.matchStatus === 'candidate' || req.matchStatus === 'shortlisted';
            const isSelected = req.matchStatus === 'selected';
            const isDeclined = req.matchStatus === 'rejected';

            const createdDate = new Date(req.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
            });

            return (
              <div
                key={req.id}
                className="bg-white border border-[#132A24]/10 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-[#4E7A66]/30 transition-all"
              >
                <div className="space-y-3 flex-grow max-w-2xl">
                  <div className="flex items-center gap-2.5">
                    <span className="font-serif text-lg font-medium text-[#132A24]">
                      {req.clientDisplayName}
                    </span>
                    {req.age && (
                      <span className="text-xs text-[#132A24]/50">&bull; {req.age} yrs</span>
                    )}
                    {req.gender && (
                      <span className="text-xs text-[#132A24]/50">&bull; {req.gender}</span>
                    )}
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ml-auto md:ml-2 ${
                      isSelected
                        ? 'bg-[#4E7A66]/10 text-[#4E7A66]'
                        : isDeclined
                        ? 'bg-red-50 text-red-700'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {req.matchStatus}
                    </span>
                  </div>

                  <p className="text-xs text-[#132A24]/80 leading-relaxed font-sans">
                    <span className="font-medium text-[#132A24]">Presenting Concern: </span>
                    {req.presentingReason}
                  </p>

                  {/* Concerns Tags */}
                  {Array.isArray(req.concerns) && req.concerns.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {req.concerns.map((c, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-md bg-[#FAFAF8] border border-[#132A24]/10 text-[11px] text-[#132A24]/70"
                        >
                          {typeof c === 'string' ? c : c?.label || JSON.stringify(c)}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="text-[11px] text-[#132A24]/40 flex items-center gap-3 pt-1">
                    <span>Received: {createdDate}</span>
                    <span>&bull; Journey: {req.journeyType}</span>
                    <span>&bull; Urgency: {req.triageLevel}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
                  {isPending ? (
                    <>
                      <button
                        onClick={() => handleAction(req.id, 'decline')}
                        disabled={actioningId === req.id}
                        className="px-4 py-2 rounded-lg border border-[#132A24]/15 text-xs text-[#132A24]/70 hover:bg-[#132A24]/5 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => handleAction(req.id, 'accept')}
                        disabled={actioningId === req.id}
                        className="px-5 py-2 rounded-lg bg-[#4E7A66] text-white text-xs font-semibold hover:bg-[#4E7A66]/90 transition-all cursor-pointer shadow-xs disabled:opacity-50"
                      >
                        {actioningId === req.id ? 'Connecting...' : 'Accept Client'}
                      </button>
                    </>
                  ) : isSelected ? (
                    <button
                      onClick={() => onNavigate('clients')}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#132A24] text-white text-xs font-medium hover:bg-[#132A24]/90 cursor-pointer shadow-xs"
                    >
                      View in Clients <ArrowRight size={13} />
                    </button>
                  ) : (
                    <span className="text-xs text-[#132A24]/40 italic">Declined</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
