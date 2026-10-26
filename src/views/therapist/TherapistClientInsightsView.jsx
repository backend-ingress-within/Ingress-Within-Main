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
          <div className="bg-white rounded-2xl border border-[#132A24]/10 shadow-xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-[#132A24]/10 flex items-center justify-between bg-[#FAFAF8]">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-[#4E7A66]" />
                <h4 className="font-serif text-base text-[#132A24]">
                  Week {selectedWeeklyReport.week_number} Report Summary
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setSelectedWeeklyReport(null)}
                className="p-1 rounded-lg text-[#132A24]/40 hover:text-[#132A24] cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4 text-xs text-[#132A24] leading-relaxed text-left">
              <div className="p-3 bg-[#FAFBFB] rounded-lg border border-[#132A24]/5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#132A24]/60 mb-1">
                  Synthesized Week Synthesis
                </div>
                <p>
                  {selectedWeeklyReport.report_data?.summary ||
                    selectedWeeklyReport.report_data?.synthesis ||
                    'Synthesized review of this reflection period.'}
                </p>
              </div>

              {selectedWeeklyReport.report_data?.themes && (
                <div className="space-y-1.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#132A24]/60">
                    Observed Themes
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(Array.isArray(selectedWeeklyReport.report_data.themes)
                      ? selectedWeeklyReport.report_data.themes
                      : []
                    ).map((t, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-[#4E7A66]/10 text-[#4E7A66] rounded-md text-[11px]">
                        {typeof t === 'string' ? t : t.title || t.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-[10px] text-[#132A24]/40 pt-4 border-t border-[#132A24]/5">
                Client-consented reflection summary &bull; Private unshared notes excluded.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submodal: View Monthly Report */}
      {selectedMonthlyReport && (
        <div className="fixed inset-0 z-60 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#132A24]/10 shadow-xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-[#132A24]/10 flex items-center justify-between bg-[#FAFAF8]">
              <div className="flex items-center gap-2">
                <Layers size={16} className="text-[#4E7A66]" />
                <h4 className="font-serif text-base text-[#132A24]">
                  Cycle Assessment Report
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMonthlyReport(null)}
                className="p-1 rounded-lg text-[#132A24]/40 hover:text-[#132A24] cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4 text-xs text-[#132A24] leading-relaxed text-left">
              <div className="p-4 bg-[#FAFBFB] rounded-lg border border-[#132A24]/5 whitespace-pre-wrap font-sans text-xs">
                {typeof selectedMonthlyReport.report_text === 'string' &&
                selectedMonthlyReport.report_text.startsWith('{')
                  ? (() => {
                      try {
                        const parsed = JSON.parse(selectedMonthlyReport.report_text);
                        return (
                          <div className="space-y-3">
                            <h5 className="font-bold text-sm text-[#132A24]">
                              {parsed.title || 'Cycle Reflection Synthesis'}
                            </h5>
                            <p className="text-[#132A24]/80">
                              {parsed.overview || parsed.summary || 'Summary across full 30-day practice cycle.'}
                            </p>
                            {parsed.insights && (
                              <div className="space-y-1 pt-2">
                                <div className="text-[10px] font-bold uppercase tracking-wider text-[#132A24]/60">
                                  Key Patterns &amp; Observations
                                </div>
                                <ul className="list-disc pl-4 space-y-1">
                                  {(Array.isArray(parsed.insights) ? parsed.insights : [parsed.insights]).map(
                                    (ins, i) => (
                                      <li key={i}>{typeof ins === 'string' ? ins : ins.text}</li>
                                    )
                                  )}
                                </ul>
                              </div>
                            )}
                          </div>
                        );
                      } catch (e) {
                        return selectedMonthlyReport.report_text;
                      }
                    })()
                  : selectedMonthlyReport.report_text || 'Assessment report content.'}
              </div>

              <div className="text-[10px] text-[#132A24]/40 pt-4 border-t border-[#132A24]/5">
                Client-consented monthly cycle summary &bull; Self-reflection insights only.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
