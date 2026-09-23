import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  User,
  Users,
  Video,
  FileText,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';

export default function TherapistTodayView({ onNavigate, onOpenSoap }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completingId, setCompletingId] = useState(null);

  const fetchTodayData = async () => {
    try {
      const res = await fetch('/api/therapist/dashboard/today');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Failed to load today overview:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayData();
  }, []);

  const handleCompleteSession = async (appointmentId) => {
    setCompletingId(appointmentId);
    try {
      const res = await fetch(`/api/therapist/sessions/${appointmentId}/complete`, {
        method: 'POST',
      });
      if (res.ok) {
        await fetchTodayData();
      }
    } catch (err) {
      console.error('Failed to complete session:', err);
    } finally {
      setCompletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-xs text-[#132A24]/50 animate-pulse">
        Loading operational workspace...
      </div>
    );
  }

  const metrics = data?.metrics || {
    todaySessionsCount: 0,
    pendingRequestsCount: 0,
    activeClientsCount: 0,
    outstandingSoapNotesCount: 0,
  };

  const todaySessions = data?.todaySessions || [];
  const upcoming = data?.upcomingSession;

  return (
    <div className="space-y-8">
      {/* Top Banner / Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#132A24]/10 pb-6">
        <div>
          <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#4E7A66]">
            Clinical Operational Workspace
          </span>
          <h1 className="font-serif text-3xl font-normal text-[#132A24] mt-1">
            Today's Schedule & Caseload
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('calendar')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#132A24] text-white text-xs font-semibold hover:bg-[#132A24]/90 transition-all cursor-pointer shadow-xs"
          >
            <Calendar size={14} /> View Calendar
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#132A24]/10 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-[#132A24]/50 text-xs font-medium mb-2">
            <span>Today's Sessions</span>
            <Calendar size={15} className="text-[#4E7A66]" />
          </div>
          <div className="text-2xl font-serif text-[#132A24] font-semibold">{metrics.todaySessionsCount}</div>
          <span className="text-[11px] text-[#132A24]/40 mt-1 block">Scheduled for today</span>
        </div>

        <div
          onClick={() => onNavigate('requests')}
          className="bg-white border border-[#132A24]/10 rounded-xl p-5 shadow-xs cursor-pointer hover:border-[#4E7A66]/50 transition-all"
        >
          <div className="flex items-center justify-between text-[#132A24]/50 text-xs font-medium mb-2">
            <span>New Requests</span>
            <Users size={15} className="text-amber-600" />
          </div>
          <div className="text-2xl font-serif text-[#132A24] font-semibold">{metrics.pendingRequestsCount}</div>
          <span className="text-[11px] text-amber-700 font-medium mt-1 block">
            {metrics.pendingRequestsCount > 0 ? 'Awaiting therapist review' : 'No new client requests.'}
          </span>
        </div>

        <div
          onClick={() => onNavigate('clients')}
          className="bg-white border border-[#132A24]/10 rounded-xl p-5 shadow-xs cursor-pointer hover:border-[#4E7A66]/50 transition-all"
        >
          <div className="flex items-center justify-between text-[#132A24]/50 text-xs font-medium mb-2">
            <span>Active Clients</span>
            <User size={15} className="text-[#4E7A66]" />
          </div>
          <div className="text-2xl font-serif text-[#132A24] font-semibold">{metrics.activeClientsCount}</div>
          <span className="text-[11px] text-[#132A24]/40 mt-1 block">
            {metrics.activeClientsCount > 0 ? 'In clinical care journey' : 'No active clients yet.'}
          </span>
        </div>

        <div className="bg-white border border-[#132A24]/10 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-[#132A24]/50 text-xs font-medium mb-2">
            <span>Notes Due</span>
            <FileText size={15} className="text-[#132A24]/60" />
          </div>
          <div className="text-2xl font-serif text-[#132A24] font-semibold">{metrics.outstandingSoapNotesCount}</div>
          <span className="text-[11px] text-[#132A24]/40 mt-1 block">
            {metrics.outstandingSoapNotesCount > 0 ? 'SOAP documentation needed' : 'No outstanding notes.'}
          </span>
        </div>
      </div>

      {/* Main Operational Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Today's Appointments Timeline */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-normal text-[#132A24]">Today's Consultations</h3>
            <span className="text-xs text-[#132A24]/50">{todaySessions.length} sessions</span>
          </div>

          {todaySessions.length === 0 ? (
            <div className="bg-white border border-[#132A24]/10 rounded-xl p-8 text-center space-y-2">
              <Calendar size={28} className="mx-auto text-[#132A24]/30" />
              <p className="text-sm font-medium text-[#132A24]">No sessions scheduled for today.</p>
              <p className="text-xs text-[#132A24]/50 max-w-sm mx-auto">
                Your calendar is clear today. View your calendar or manage client requests from the sidebar.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {todaySessions.map((session) => {
                const startTime = new Date(session.scheduledStart).toLocaleTimeString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                });
                const endTime = new Date(session.scheduledEnd).toLocaleTimeString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                });

                return (
                  <div
                    key={session.id}
                    className="bg-white border border-[#132A24]/10 rounded-xl p-5 shadow-xs flex items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-[#4E7A66]/10 text-[#4E7A66] flex flex-col items-center justify-center shrink-0">
                        <Video size={18} />
                        <span className="text-[9px] uppercase font-bold tracking-wider mt-0.5">50m</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-[#132A24]">{startTime} – {endTime}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider ${
                            session.status === 'completed'
                              ? 'bg-[#4E7A66]/10 text-[#4E7A66]'
                              : 'bg-blue-50 text-blue-700'
                          }`}>
                            {session.status}
                          </span>
                        </div>
                        <h4 className="font-serif text-base font-medium text-[#132A24] mt-0.5">
                          {session.clientDisplayName}
                        </h4>
                        <span className="text-[11px] text-[#132A24]/50 block">Individual Telehealth Session</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {session.meetingLink && session.status !== 'completed' && (
                        <a
                          href={session.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3.5 py-1.5 rounded-lg bg-[#132A24] text-white text-xs font-medium hover:bg-[#132A24]/90 no-underline cursor-pointer"
                        >
                          Join Call
                        </a>
                      )}
                      {session.status !== 'completed' && (
                        <button
                          onClick={() => handleCompleteSession(session.id)}
                          disabled={completingId === session.id}
                          className="px-3 py-1.5 rounded-lg border border-[#132A24]/15 text-xs text-[#132A24]/80 hover:bg-[#132A24]/5 transition-colors cursor-pointer"
                        >
                          {completingId === session.id ? 'Completing...' : 'Mark Complete'}
                        </button>
                      )}
                      <button
                        onClick={() => onOpenSoap(session.id)}
                        className="px-3 py-1.5 rounded-lg border border-[#132A24]/15 text-xs text-[#132A24]/80 hover:bg-[#132A24]/5 transition-colors cursor-pointer"
                      >
                        SOAP Note
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Next Session Focus & Quick Action */}
        <div className="space-y-6">
          <div className="bg-[#132A24] text-white rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between text-xs text-white/60">
              <span className="uppercase tracking-[0.16em] font-bold text-[#8DBFB4]">Upcoming Session</span>
              <Clock size={14} className="text-[#8DBFB4]" />
            </div>

            {upcoming ? (
              <div className="space-y-3">
                <div>
                  <div className="text-xl font-serif font-medium">{upcoming.clientDisplayName}</div>
                  <div className="text-xs text-white/70 mt-1">
                    {new Date(upcoming.scheduledStart).toLocaleDateString('en-IN', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                    })} &bull; {new Date(upcoming.scheduledStart).toLocaleTimeString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>

                <div className="pt-2 flex gap-2">
                  {upcoming.meetingLink && (
                    <a
                      href={upcoming.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-2 text-center rounded-lg bg-white text-[#132A24] text-xs font-semibold hover:bg-white/90 no-underline"
                    >
                      Start Call
                    </a>
                  )}
                  <button
                    onClick={() => onOpenSoap(upcoming.id)}
                    className="flex-1 py-2 text-center rounded-lg bg-white/10 text-white text-xs font-medium hover:bg-white/15 border border-white/10 cursor-pointer"
                  >
                    Clinical Notes
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-sm font-medium text-white">No upcoming sessions.</p>
                <p className="text-xs text-white/60 leading-relaxed">
                  Review open requests or schedule future sessions with active clients.
                </p>
              </div>
            )}
          </div>

          {/* Clinical Standards Tip */}
          <div className="bg-white border border-[#132A24]/10 rounded-xl p-5 shadow-xs text-xs space-y-2 text-[#132A24]/80">
            <div className="flex items-center gap-2 font-semibold text-[#132A24]">
              <Sparkles size={14} className="text-[#4E7A66]" />
              <span>Confidentiality & Clinical Notes</span>
            </div>
            <p className="text-[11px] leading-relaxed text-[#132A24]/60">
              Patient SOAP notes remain strictly confidential to your clinical account. Self-reflection journals written by clients are private self-work and never visible on clinical records.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
