import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Lock,
  Calendar,
  Clock,
  BookOpen,
  Activity,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  FileText,
  Layers,
  X,
  ExternalLink,
} from 'lucide-react';

export default function TherapistClientInsightsView({ clientId }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  // Selected report modal view states
  const [selectedWeeklyReport, setSelectedWeeklyReport] = useState(null);
  const [selectedMonthlyReport, setSelectedMonthlyReport] = useState(null);
  const [loadingReportDetail, setLoadingReportDetail] = useState(false);

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/therapist/clients/${clientId}/insights`, {
        cache: 'no-store',
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || 'Failed to load client insights.');
      }
      setData(json);
    } catch (err) {
      console.error('Failed to fetch insights:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (clientId) {
      fetchInsights();
    }
  }, [clientId]);

  const handleOpenWeeklyReport = async (reportId) => {
    setLoadingReportDetail(true);
    try {
      const res = await fetch(
        `/api/therapist/clients/${clientId}/insights/weekly-reports/${reportId}`,
        { cache: 'no-store' }
      );
      const json = await res.json();
      if (res.ok && json.report) {
        setSelectedWeeklyReport(json.report);
      } else {
        alert(json.error?.message || 'Unable to open weekly report.');
      }
    } catch (err) {
      alert('Network error loading weekly report.');
    } finally {
      setLoadingReportDetail(false);
    }
  };

  const handleOpenMonthlyReport = async (cycleId) => {
    setLoadingReportDetail(true);
    try {
      const res = await fetch(
        `/api/therapist/clients/${clientId}/insights/monthly-reports/${cycleId}`,
        { cache: 'no-store' }
      );
      const json = await res.json();
      if (res.ok && json.assessment) {
        setSelectedMonthlyReport(json.assessment);
      } else {
        alert(json.error?.message || 'Unable to open monthly report.');
      }
    } catch (err) {
      alert('Network error loading monthly report.');
    } finally {
      setLoadingReportDetail(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-[#132A24] border-t-transparent animate-spin mx-auto" />
        <p className="text-xs text-[#132A24]/60">Verifying authorization and loading client insights...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-xl space-y-2">
        <div className="flex items-center gap-2 text-red-700 text-xs font-semibold">
          <AlertCircle size={15} />
          <span>Insights Authorization Error</span>
        </div>
        <p className="text-xs text-red-600">{error}</p>
      </div>
    );
  }

  // Restricted or not authorized state
  if (!data || !data.authorized) {
    return (
      <div className="bg-[#FAFBFB] border border-[#132A24]/10 rounded-2xl p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-[#132A24]/5 flex items-center justify-center mx-auto text-[#132A24]/40">
          <Lock size={22} />
        </div>
        <div className="space-y-1.5 max-w-md mx-auto">
          <h4 className="font-serif text-lg font-normal text-[#132A24]">
            Client Insights Are Private
          </h4>
          <p className="text-xs text-[#132A24]/60 leading-relaxed">
            {data?.reason ||
              'The client has not authorized insight sharing for this care relationship. Client self-reflection summaries remain private until explicit consent is granted in their settings.'}
          </p>
        </div>
        <div className="text-[11px] text-[#132A24]/40 border-t border-[#132A24]/10 pt-4 max-w-sm mx-auto">
          Insights will automatically appear here once authorized by the client.
        </div>
      </div>
    );
  }

  const { patternSummary, emotionalVocabulary, weeklyReports, monthlyReports, disclaimer } = data;

  return (
    <div className="space-y-6">
      {/* Disclaimer Banner */}
      <div className="bg-[#FAFAF8] border border-[#132A24]/10 rounded-xl p-4 flex items-start gap-3">
        <Sparkles size={16} className="text-[#4E7A66] shrink-0 mt-0.5" />
        <div className="space-y-1 text-left">
          <div className="text-xs font-semibold text-[#132A24]">
            Self-Reflection Practice Insights &bull; Client Consented
          </div>
          <p className="text-[11px] text-[#132A24]/65 leading-relaxed">
            {disclaimer ||
              'These insights are derived from the client’s self-reflection practice and platform activity. They are not clinical diagnoses or standardized psychological evaluations.'}
          </p>
        </div>
      </div>

      {/* Grid: Pattern Summary & Emotional Vocabulary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* A. Pattern Summary Card */}
        <div className="bg-white border border-[#132A24]/10 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#132A24]/8 pb-2.5">
            <div className="flex items-center gap-2">
              <Activity size={15} className="text-[#4E7A66]" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#132A24]">
                Pattern Summary
              </h4>
            </div>
            {patternSummary?.consented ? (
              <span className="text-[10px] font-medium px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                Consented
              </span>
            ) : (
              <span className="text-[10px] font-medium px-2 py-0.5 bg-stone-100 text-stone-500 border border-stone-200 rounded-full flex items-center gap-1">
                <Lock size={10} /> Not Shared
              </span>
            )}
          </div>

          {patternSummary?.consented ? (
            patternSummary.isAvailable ? (
              <div className="space-y-3">
                <p className="text-xs text-[#132A24] leading-relaxed italic bg-[#FAFBFB] p-3 rounded-lg border border-[#132A24]/5">
                  "{patternSummary.summary?.sentence || 'Summary of recurring themes across practice cycles.'}"
                </p>
                <div className="flex flex-wrap gap-2 text-[11px]">
                  <span className="px-2.5 py-1 bg-[#132A24]/5 rounded-md text-[#132A24] font-medium">
                    Present: <strong>{patternSummary.summary?.present || 0}</strong>
                  </span>
                  <span className="px-2.5 py-1 bg-amber-50 text-amber-900 rounded-md font-medium">
                    Shifting: <strong>{patternSummary.summary?.shifting || 0}</strong>
                  </span>
                  <span className="px-2.5 py-1 bg-stone-100 text-stone-700 rounded-md font-medium">
                    Quiet: <strong>{patternSummary.summary?.quiet || 0}</strong>
                  </span>
                  <span className="px-2.5 py-1 bg-[#4E7A66]/10 text-[#4E7A66] rounded-md font-medium">
                    Cycles: <strong>{patternSummary.totalCyclesObserved || 1}</strong>
                  </span>
                </div>
                {patternSummary.updatedAt && (
                  <div className="text-[10px] text-[#132A24]/40 flex items-center gap-1 pt-1">
                    <Clock size={10} />
                    <span>Last updated: {new Date(patternSummary.updatedAt).toLocaleDateString('en-IN')}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-[#132A24]/50">
                No patterns identified yet in client's practice history.
              </div>
            )
          ) : (
            <div className="py-6 text-center space-y-1.5 text-xs text-[#132A24]/50">
              <Lock size={16} className="mx-auto text-stone-400" />
              <p>The client has not authorized sharing of their Pattern Summary.</p>
            </div>
          )}
        </div>

        {/* B. Emotional Vocabulary Card */}
        <div className="bg-white border border-[#132A24]/10 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#132A24]/8 pb-2.5">
            <div className="flex items-center gap-2">
              <BookOpen size={15} className="text-[#4E7A66]" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#132A24]">
                Emotional Vocabulary
              </h4>
            </div>
            {emotionalVocabulary?.consented ? (
              <span className="text-[10px] font-medium px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                Consented
              </span>
            ) : (
              <span className="text-[10px] font-medium px-2 py-0.5 bg-stone-100 text-stone-500 border border-stone-200 rounded-full flex items-center gap-1">
                <Lock size={10} /> Not Shared
              </span>
            )}
          </div>

          {emotionalVocabulary?.consented ? (
            emotionalVocabulary.isAvailable ? (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-[#FAFBFB] p-2.5 rounded-lg border border-[#132A24]/5">
                    <div className="text-base font-bold font-mono text-[#132A24]">
                      {emotionalVocabulary.stats?.entriesCount || 0}
                    </div>
                    <div className="text-[9.5px] text-[#132A24]/50 uppercase tracking-wider">Entries</div>
                  </div>
                  <div className="bg-[#FAFBFB] p-2.5 rounded-lg border border-[#132A24]/5">
                    <div className="text-base font-bold font-mono text-[#132A24]">
                      {emotionalVocabulary.stats?.distinctWordCount || 0}
                    </div>
                    <div className="text-[9.5px] text-[#132A24]/50 uppercase tracking-wider">Distinct Words</div>
                  </div>
                  <div className="bg-[#FAFBFB] p-2.5 rounded-lg border border-[#132A24]/5">
                    <div className="text-base font-bold font-mono text-[#4E7A66] truncate">
                      {emotionalVocabulary.stats?.mostUsedWord && emotionalVocabulary.stats?.mostUsedWord !== 'none'
                        ? `"${emotionalVocabulary.stats.mostUsedWord}"`
                        : '—'}
                    </div>
                    <div className="text-[9.5px] text-[#132A24]/50 uppercase tracking-wider">Top Word</div>
                  </div>
                </div>

                {emotionalVocabulary.mostUsed && emotionalVocabulary.mostUsed.length > 0 && (
                  <div className="space-y-1">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-[#132A24]/50">
                      Frequently Reached-For Words
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {emotionalVocabulary.mostUsed.map((w, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-[#132A24]/5 text-[#132A24] rounded-md text-[11px] font-medium"
                        >
                          {typeof w === 'string' ? w : w.word}{' '}
                          {w.frequency ? (
                            <span className="text-[#4E7A66] font-mono text-[10px]">×{w.frequency}</span>
                          ) : null}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {emotionalVocabulary.updatedAt && (
                  <div className="text-[10px] text-[#132A24]/40 flex items-center gap-1 pt-1">
                    <Clock size={10} />
                    <span>Last updated: {new Date(emotionalVocabulary.updatedAt).toLocaleDateString('en-IN')}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-[#132A24]/50">
                No vocabulary tracked yet for this client.
              </div>
            )
          ) : (
            <div className="py-6 text-center space-y-1.5 text-xs text-[#132A24]/50">
              <Lock size={16} className="mx-auto text-stone-400" />
              <p>The client has not authorized sharing of their Emotional Vocabulary.</p>
            </div>
          )}
        </div>
      </div>

      {/* C. Weekly Reports Section */}
      <div className="bg-white border border-[#132A24]/10 rounded-xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-[#132A24]/8 pb-2.5">
          <div className="flex items-center gap-2">
            <Calendar size={15} className="text-[#4E7A66]" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#132A24]">
              Weekly Reports
            </h4>
          </div>
          {weeklyReports?.consented ? (
            <span className="text-[10px] font-medium px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
              Consented
            </span>
          ) : (
            <span className="text-[10px] font-medium px-2 py-0.5 bg-stone-100 text-stone-500 border border-stone-200 rounded-full flex items-center gap-1">
              <Lock size={10} /> Not Shared
            </span>
          )}
        </div>

        {weeklyReports?.consented ? (
          weeklyReports.reports && weeklyReports.reports.length > 0 ? (
            <div className="divide-y divide-[#132A24]/5">
              {weeklyReports.reports.map((r) => (
                <div
                  key={r.id}
                  className="py-2.5 flex items-center justify-between hover:bg-[#FAFAF8] px-2 rounded-lg transition-colors"
                >
                  <div className="space-y-0.5 text-left">
                    <div className="text-xs font-semibold text-[#132A24]">
                      Week {r.week_number} Synthesis
                    </div>
                    <div className="text-[10px] text-[#132A24]/50">
                      Generated: {new Date(r.created_at).toLocaleDateString('en-IN')} &bull; Status: {r.status}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleOpenWeeklyReport(r.id)}
                    className="px-2.5 py-1 text-xs font-medium text-[#4E7A66] hover:bg-[#4E7A66]/10 rounded-md transition-colors flex items-center gap-1 cursor-pointer border border-[#4E7A66]/20"
                  >
                    <span>View Report</span>
                    <ChevronRight size={12} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center text-xs text-[#132A24]/50">
              No weekly reports generated yet for this client.
            </div>
          )
        ) : (
          <div className="py-6 text-center space-y-1.5 text-xs text-[#132A24]/50">
            <Lock size={16} className="mx-auto text-stone-400" />
            <p>The client has not authorized sharing of Weekly Reports.</p>
          </div>
        )}
      </div>

      {/* D. Monthly Reports Section */}
      <div className="bg-white border border-[#132A24]/10 rounded-xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-[#132A24]/8 pb-2.5">
          <div className="flex items-center gap-2">
            <Layers size={15} className="text-[#4E7A66]" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#132A24]">
              Monthly Reports (Cycle Assessments)
            </h4>
          </div>
          {monthlyReports?.consented ? (
            <span className="text-[10px] font-medium px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
              Consented
            </span>
          ) : (
            <span className="text-[10px] font-medium px-2 py-0.5 bg-stone-100 text-stone-500 border border-stone-200 rounded-full flex items-center gap-1">
              <Lock size={10} /> Not Shared
            </span>
          )}
        </div>

        {monthlyReports?.consented ? (
          monthlyReports.reports && monthlyReports.reports.length > 0 ? (
            <div className="divide-y divide-[#132A24]/5">
              {monthlyReports.reports.map((m) => (
                <div
                  key={m.id}
                  className="py-2.5 flex items-center justify-between hover:bg-[#FAFAF8] px-2 rounded-lg transition-colors"
                >
                  <div className="space-y-0.5 text-left">
                    <div className="text-xs font-semibold text-[#132A24]">
                      Cycle {m.cycle_number} Monthly Assessment
                    </div>
                    <div className="text-[10px] text-[#132A24]/50">
                      Completed: {new Date(m.created_at).toLocaleDateString('en-IN')} &bull; 30-Day Period
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleOpenMonthlyReport(m.cycle_id)}
                    className="px-2.5 py-1 text-xs font-medium text-[#4E7A66] hover:bg-[#4E7A66]/10 rounded-md transition-colors flex items-center gap-1 cursor-pointer border border-[#4E7A66]/20"
                  >
                    <span>View Report</span>
                    <ChevronRight size={12} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center text-xs text-[#132A24]/50">
              No monthly cycle reports generated yet for this client.
            </div>
          )
        ) : (
          <div className="py-6 text-center space-y-1.5 text-xs text-[#132A24]/50">
            <Lock size={16} className="mx-auto text-stone-400" />
            <p>The client has not authorized sharing of Monthly Reports.</p>
          </div>
        )}
      </div>

      {/* Submodal: View Weekly Report */}
      {selectedWeeklyReport && (
        <div className="fixed inset-0 z-60 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#132A24]/10 shadow-2xl max-w-2xl w-full max-h-[88vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#132A24]/10 flex items-center justify-between bg-[#FAFAF8]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#132A24]/5 border border-[#132A24]/10 flex items-center justify-center text-[#4E7A66]">
                  <FileText size={18} />
                </div>
                <div>
                  <h4 className="font-serif text-lg font-normal text-[#132A24]">
                    Week {selectedWeeklyReport.week_number} Report
                  </h4>
                  <span className="text-[11px] text-[#132A24]/50 block">
                    Days {selectedWeeklyReport.day_start || ((selectedWeeklyReport.week_number - 1) * 7 + 1)}&ndash;{selectedWeeklyReport.day_end || (selectedWeeklyReport.week_number * 7)}
                    {selectedWeeklyReport.generated_at || selectedWeeklyReport.created_at ? (
                      <> &bull; Generated {new Date(selectedWeeklyReport.generated_at || selectedWeeklyReport.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</>
                    ) : null}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedWeeklyReport(null)}
                className="p-1.5 rounded-lg text-[#132A24]/40 hover:text-[#132A24] hover:bg-[#132A24]/5 cursor-pointer transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-[#132A24] leading-relaxed text-left">
              {/* Report Headline / Title */}
              {selectedWeeklyReport.title && (
                <div className="font-serif text-base font-normal text-[#132A24] leading-snug border-l-2 border-[#4E7A66] pl-3 py-0.5">
                  {selectedWeeklyReport.title}
                </div>
              )}

              {/* Core Synthesis Narrative / What Was Observed */}
              {(selectedWeeklyReport.body || selectedWeeklyReport.why || selectedWeeklyReport.report_data?.what_we_saw) && (
                <div className="p-4 bg-[#FAFBFB] rounded-xl border border-[#132A24]/8 space-y-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#4E7A66]">
                    Weekly Synthesis
                  </div>
                  <p className="text-xs text-[#132A24]/85 leading-relaxed whitespace-pre-line font-sans">
                    {selectedWeeklyReport.body || selectedWeeklyReport.why || selectedWeeklyReport.report_data?.what_we_saw}
                  </p>
                </div>
              )}

              {/* Analytical & Psychological Block */}
              {selectedWeeklyReport.report_data?.analytical_block && (
                <div className="p-4 bg-white rounded-xl border border-[#132A24]/10 space-y-2.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#4E7A66]">
                    Clinical &amp; Emotional Dynamics
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {selectedWeeklyReport.report_data.analytical_block.primary_theme && (
                      <div className="space-y-0.5">
                        <span className="text-[11px] font-semibold text-[#132A24] block">Focal Theme:</span>
                        <p className="text-[11px] text-[#132A24]/75 leading-relaxed">
                          {selectedWeeklyReport.report_data.analytical_block.primary_theme}
                        </p>
                      </div>
                    )}
                    {selectedWeeklyReport.report_data.analytical_block.emotional_tone && (
                      <div className="space-y-0.5">
                        <span className="text-[11px] font-semibold text-[#132A24] block">Emotional Register:</span>
                        <p className="text-[11px] text-[#132A24]/75 capitalize leading-relaxed">
                          {selectedWeeklyReport.report_data.analytical_block.emotional_tone}
                        </p>
                      </div>
                    )}
                  </div>

                  {selectedWeeklyReport.report_data.analytical_block.agency_language && (
                    <div className="pt-2 border-t border-[#132A24]/5 space-y-0.5 text-xs">
                      <span className="text-[11px] font-semibold text-[#132A24] block">Self-Agency Stance:</span>
                      <p className="text-[11px] text-[#132A24]/75 leading-relaxed">
                        {selectedWeeklyReport.report_data.analytical_block.agency_language}
                      </p>
                    </div>
                  )}

                  {selectedWeeklyReport.report_data.analytical_block.notable_absence && (
                    <div className="pt-2 border-t border-[#132A24]/5 space-y-0.5 text-xs">
                      <span className="text-[11px] font-semibold text-[#132A24] block">Notable Absence:</span>
                      <p className="text-[11px] text-[#132A24]/75 leading-relaxed">
                        {selectedWeeklyReport.report_data.analytical_block.notable_absence}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Observed Emotion Words / Vocabulary This Week */}
              {Array.isArray(selectedWeeklyReport.report_data?.vocabThisWeek) && selectedWeeklyReport.report_data.vocabThisWeek.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#132A24]/60">
                    Observed Emotion Language
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedWeeklyReport.report_data.vocabThisWeek.slice(0, 8).map((v, idx) => (
                      <div key={idx} className="px-2.5 py-1 bg-[#4E7A66]/10 text-[#132A24] rounded-lg border border-[#4E7A66]/20 flex items-center gap-1.5 text-[11px]">
                        <span className="font-semibold text-[#4E7A66]">{v.word}</span>
                        {v.normalized_word && v.normalized_word !== v.word && (
                          <span className="text-[#132A24]/50 text-[10px]">&rarr; {v.normalized_word}</span>
                        )}
                        {v.frequency > 1 && (
                          <span className="px-1.5 py-0.2 bg-[#4E7A66]/20 text-[#132A24] rounded-full text-[9px] font-bold">
                            &times;{v.frequency}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Emotion Clusters */}
              {Array.isArray(selectedWeeklyReport.report_data?.emotion_clusters) && selectedWeeklyReport.report_data.emotion_clusters.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#132A24]/60">
                    Emotion Clusters
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedWeeklyReport.report_data.emotion_clusters.slice(0, 4).map((c, idx) => (
                      <div key={idx} className="p-2.5 bg-[#FAFBFB] rounded-lg border border-[#132A24]/5 text-[11px]">
                        <span className="font-semibold text-[#132A24] block mb-1">{c.word}</span>
                        <div className="flex flex-wrap gap-1">
                          {(c.related || []).map((r, rIdx) => (
                            <span key={rIdx} className="px-1.5 py-0.5 bg-white border border-[#132A24]/10 rounded text-[10px] text-[#132A24]/70">
                              {r}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Candidate Quote / Pulled Expression */}
              {selectedWeeklyReport.report_data?.candidate_quote && (
                <div className="p-3.5 bg-[#FAFAF8] rounded-xl border-l-3 border-[#4E7A66] text-xs space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#4E7A66]">
                    Client Expression
                  </div>
                  <p className="font-serif italic text-[13px] text-[#132A24]/90">
                    &ldquo;{selectedWeeklyReport.report_data.candidate_quote}&rdquo;
                  </p>
                </div>
              )}

              {/* Reflective Exploration / Carry Question */}
              {(selectedWeeklyReport.open_question || selectedWeeklyReport.report_data?.carry_question) && (
                <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-600/15 space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                    Reflective Question
                  </div>
                  <p className="font-serif text-xs text-[#132A24] leading-relaxed">
                    {selectedWeeklyReport.open_question || selectedWeeklyReport.report_data?.carry_question}
                  </p>
                </div>
              )}

              {/* Footer Note */}
              <div className="text-[10px] text-[#132A24]/40 pt-3 border-t border-[#132A24]/5">
                Client-consented reflection summary &bull; Personal unshared journal entries excluded.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submodal: View Monthly Report */}
      {selectedMonthlyReport && (() => {
        let reportData = null;
        if (typeof selectedMonthlyReport.report_text === 'string' && selectedMonthlyReport.report_text.trim().startsWith('{')) {
          try {
            reportData = JSON.parse(selectedMonthlyReport.report_text);
          } catch (e) {}
        } else if (typeof selectedMonthlyReport.report_text === 'object' && selectedMonthlyReport.report_text !== null) {
          reportData = selectedMonthlyReport.report_text;
        }

        const whatShowed = reportData?.whatThisCycleShowed;
        const stats = reportData?.stats;
        const patterns = Array.isArray(reportData?.patterns) ? reportData.patterns : [];
        const recurringThemes = Array.isArray(reportData?.recurringThemes) ? reportData.recurringThemes : [];
        const whereLeavesYou = reportData?.whereLeavesYou;
        const closingQuote = reportData?.closingQuote;

        return (
          <div className="fixed inset-0 z-60 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-[#132A24]/10 shadow-2xl max-w-2xl w-full max-h-[88vh] flex flex-col overflow-hidden">
              <div className="p-5 border-b border-[#132A24]/10 flex items-center justify-between bg-[#FAFAF8]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#132A24]/5 border border-[#132A24]/10 flex items-center justify-center text-[#4E7A66]">
                    <Layers size={18} />
                  </div>
                  <div>
                    <h4 className="font-serif text-lg font-normal text-[#132A24]">
                      Cycle {reportData?.cycleNumber || 1} Assessment Report
                    </h4>
                    <span className="text-[11px] text-[#132A24]/50 block">
                      {reportData?.startDate || 'Day 1'} &ndash; {reportData?.endDate || 'Day 30'}
                      {selectedMonthlyReport.generated_at || selectedMonthlyReport.created_at ? (
                        <> &bull; Generated {new Date(selectedMonthlyReport.generated_at || selectedMonthlyReport.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</>
                      ) : null}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedMonthlyReport(null)}
                  className="p-1.5 rounded-lg text-[#132A24]/40 hover:text-[#132A24] hover:bg-[#132A24]/5 cursor-pointer transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-5 text-xs text-[#132A24] leading-relaxed text-left">
                {/* Stats Grid */}
                {stats && (
                  <div className="grid grid-cols-3 gap-3 p-3.5 bg-[#FAFBFB] rounded-xl border border-[#132A24]/8">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#132A24]/50 block">Entries Written</span>
                      <span className="font-serif text-base font-semibold text-[#132A24]">
                        {stats.entriesCount} <span className="text-xs font-normal text-[#132A24]/50">/ {stats.totalDays || 30}</span>
                      </span>
                      <span className="text-[10px] text-[#132A24]/60 block">{stats.daysSkipped || 0} skipped</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#132A24]/50 block">Most Used Word</span>
                      <span className="font-serif text-base font-semibold text-[#4E7A66] capitalize truncate block">
                        &ldquo;{stats.mostUsedWord}&rdquo;
                      </span>
                      <span className="text-[10px] text-[#132A24]/60 block">{stats.mostUsedWordFreq || 0} entries</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#132A24]/50 block">Self-Work Modules</span>
                      <span className="font-serif text-base font-semibold text-[#132A24]">
                        {stats.exercisesCompletedCount ?? 0} <span className="text-xs font-normal text-[#132A24]/50">/ {stats.totalExercisesCount ?? 4}</span>
                      </span>
                      <span className="text-[10px] text-[#132A24]/60 block">{stats.missedExercisesText || 'Exercises'}</span>
                    </div>
                  </div>
                )}

                {/* What This Cycle Showed */}
                {whatShowed && (
                  <div className="p-4 bg-white rounded-xl border border-[#132A24]/10 space-y-2">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#4E7A66]">
                      What This Cycle Showed
                    </div>
                    {whatShowed.openingObs && (
                      <p className="font-medium text-xs text-[#132A24] leading-relaxed whitespace-pre-line">
                        {whatShowed.openingObs}
                      </p>
                    )}
                    {whatShowed.narrative && (
                      <p className="text-xs text-[#132A24]/80 leading-relaxed font-sans">
                        {whatShowed.narrative}
                      </p>
                    )}
                    {whatShowed.pulledQuote && (
                      <div className="pt-2 border-t border-[#132A24]/5">
                        <span className="text-[10px] uppercase font-bold text-[#132A24]/50 block mb-0.5">From Client Reflections:</span>
                        <p className="font-serif italic text-xs text-[#132A24]/90">
                          &ldquo;{whatShowed.pulledQuote}&rdquo;
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Cognitive & Emotional Patterns Observed */}
                {patterns.length > 0 && (
                  <div className="space-y-2.5">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#132A24]/60">
                      Identified Psychological Patterns ({patterns.length})
                    </div>
                    <div className="space-y-2">
                      {patterns.map((p, idx) => (
                        <div key={idx} className="p-3 bg-[#FAFBFB] rounded-xl border border-[#132A24]/8 space-y-1.5 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-[#132A24]">{p.name}</span>
                            {p.tag && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#4E7A66]/10 text-[#4E7A66]">
                                {p.tag}
                              </span>
                            )}
                          </div>
                          {p.mechanism && (
                            <p className="text-[11px] text-[#132A24]/80 leading-relaxed">
                              <span className="font-medium text-[#132A24]">Mechanism: </span>
                              {p.mechanism}
                            </p>
                          )}
                          {p.cost && (
                            <p className="text-[11px] text-[#132A24]/70 leading-relaxed">
                              <span className="font-medium text-[#132A24]">Impact: </span>
                              {p.cost}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recurring Themes */}
                {recurringThemes.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#132A24]/60">
                      Recurring Themes
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {recurringThemes.map((t, idx) => (
                        <div key={idx} className="p-3 bg-white rounded-xl border border-[#132A24]/10 space-y-1 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-[#132A24]">{t.name}</span>
                            {t.frequencyText && (
                              <span className="text-[10px] text-[#4E7A66] font-medium">{t.frequencyText}</span>
                            )}
                          </div>
                          {t.description && (
                            <p className="text-[11px] text-[#132A24]/75 leading-relaxed">{t.description}</p>
                          )}
                          {t.contraInsight && (
                            <p className="text-[10px] text-[#132A24]/60 italic">{t.contraInsight}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Where This Leaves You / Closing Reflection */}
                {(whereLeavesYou?.body || closingQuote?.quote) && (
                  <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-600/15 space-y-2">
                    {whereLeavesYou?.title && (
                      <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                        {whereLeavesYou.title}
                      </div>
                    )}
                    {whereLeavesYou?.body && (
                      <p className="text-xs text-[#132A24]/85 leading-relaxed">
                        {whereLeavesYou.body}
                      </p>
                    )}
                    {closingQuote?.quote && (
                      <div className="pt-2 border-t border-emerald-600/10 font-serif italic text-xs text-[#132A24]">
                        &ldquo;{closingQuote.quote}&rdquo;
                        {closingQuote.observation && (
                          <span className="not-italic block text-[10px] font-sans text-[#132A24]/60 mt-0.5">
                            &mdash; {closingQuote.observation}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Fallback to raw text if not parsed structured data */}
                {!reportData && (
                  <div className="p-4 bg-[#FAFBFB] rounded-xl border border-[#132A24]/8 whitespace-pre-wrap font-sans text-xs">
                    {selectedMonthlyReport.report_text || 'Assessment report content.'}
                  </div>
                )}

                <div className="text-[10px] text-[#132A24]/40 pt-3 border-t border-[#132A24]/5">
                  Client-consented monthly cycle summary &bull; Self-reflection insights only.
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
