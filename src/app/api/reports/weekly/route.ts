import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../lib/db';
import { getAuthenticatedUser } from '../../../../lib/auth-helper';

/**
 * GET /api/reports/weekly: Fetches all weekly reports for the authenticated user.
 * Pure read — never triggers report generation. Use /api/reports/backfill to generate.
 */
export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser(request);
    if (!authUser) {
      return NextResponse.json(
        { error: { code: 'AUTH_REQUIRED', message: 'Authentication is required.' } },
        { status: 401 }
      );
    }

    const userId = authUser.userId;
    const cycleId = request.nextUrl.searchParams.get('cycleId');
    const weekNumber = request.nextUrl.searchParams.get('weekNumber');

    // Non-blocking background audit to trigger generation for any missing reports without holding up the HTTP response
    const { backfillWeeklyReports } = await import('../../../../lib/weeklyReportBackfill');
    void backfillWeeklyReports(userId).catch(err => {
      console.error('[API Weekly Reports GET] Background backfill failed:', err.message);
    });

    // Fetch all weekly summaries for this user
    let query = supabase
      .from('weekly_summaries')
      .select('*')
      .eq('user_id', userId);

    if (cycleId) {
      query = query.eq('cycle_id', cycleId);
    }
    if (weekNumber) {
      const parsedWeek = parseInt(weekNumber);
      if (!isNaN(parsedWeek)) {
        query = query.eq('week_number', parsedWeek);
      }
    }

    const { data: reports, error: reportsErr } = await query.order('week_number', { ascending: true });

    if (reportsErr) {
      throw new Error(`Failed to fetch weekly summaries: ${reportsErr.message}`);
    }

    // Dynamic self-healing of historical report data structures
    const healedReports = await Promise.all(
      (reports || []).map(r => healReportData(r, supabase))
    );

    return NextResponse.json({
      success: true,
      reports: healedReports
    });

  } catch (error: any) {
    console.error('[API Weekly Reports GET] Error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message || 'An unexpected server error occurred.' } },
      { status: 500 }
    );
  }
}

async function healReportData(report: any, supabaseClient: any): Promise<any> {
  if (!report || !report.report_data) return report;

  const reportData = JSON.parse(JSON.stringify(report.report_data));
  const userId = report.user_id;
  const cycleId = report.cycle_id;
  const weekNumber = report.week_number;
  const dayStart = report.day_start || ((weekNumber - 1) * 7 + 1);
  const dayEnd = report.day_end || (weekNumber * 7);

  // 1. Format crisis_review summary (remove underscores)
  if (reportData.crisis_review?.summary) {
    reportData.crisis_review.summary = reportData.crisis_review.summary.replace(/_/g, ' ');
  }

  // Check for entries written this week
  let entriesList: any[] = [];
  try {
    const { data: dbEntries } = await supabaseClient
      .from('entries')
      .select('id, entry_type, content, cycle_day')
      .eq('user_id', userId)
      .eq('cycle_id', cycleId)
      .gte('cycle_day', dayStart)
      .lte('cycle_day', dayEnd);
    entriesList = dbEntries || [];
  } catch (err) {
    console.warn('[Heal Report Data] Error fetching entries list:', err);
  }

  const validEntries = entriesList.filter(
    (e: any) => e.entry_type !== 'empty' && (e.content || '').trim().length > 0
  );
  const isZeroEntries = validEntries.length === 0;

  // 1.5. If zero entries, populate weekly_stats and previous week baseline continuity
  if (isZeroEntries) {
    reportData.zero_entries = true;
    reportData.entriesCount = 0;
    reportData.weekly_stats = {
      ...(reportData.weekly_stats || {}),
      entries_completed: 0,
      total_possible: 7,
      skipped_days: 7,
      writing_streak: 0,
      perfect_streak: false,
      cycle_number: reportData.weekly_stats?.cycle_number || 1,
      week_number: weekNumber,
      week_range: reportData.weekly_stats?.week_range || (report.generated_at ? new Date(report.generated_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '')
    };

    let prevSummaryData = reportData.previous_week_data || null;
    if (!prevSummaryData && weekNumber > 1) {
      try {
        const { data: prevSummary } = await supabaseClient
          .from('weekly_summaries')
          .select('*')
          .eq('user_id', userId)
          .eq('cycle_id', cycleId)
          .eq('week_number', weekNumber - 1)
          .maybeSingle();

        if (prevSummary) {
          const pData = typeof prevSummary.report_data === 'string'
            ? JSON.parse(prevSummary.report_data)
            : (prevSummary.report_data || {});

          prevSummaryData = {
            week_number: prevSummary.week_number,
            title: prevSummary.title || pData.week_tone || 'Baseline',
            week_tone: pData.week_tone || prevSummary.title || 'Baseline',
            top_focal_expression: pData.top_focal_expression || (pData.vocabThisWeek?.[0]?.word) || null,
            top_focal_frequency: pData.vocabThisWeek?.[0]?.frequency || null,
            vocabThisWeek: pData.vocabThisWeek || [],
            emotion_clusters: pData.emotion_clusters || [],
            candidate_quote: pData.candidate_quote || null
          };
        }
      } catch (prevErr) {
        console.warn('[Heal Report Data] Error fetching previous summary:', prevErr);
      }
    }

    reportData.previous_week_data = prevSummaryData;

    // Build since_last_week narrative
    if (prevSummaryData) {
      const prevWords = (prevSummaryData.vocabThisWeek || []).slice(0, 3).map((v: any) => v.word);
      const prevClusterWords = (prevSummaryData.emotion_clusters || []).slice(0, 3).map((c: any) => c.word);
      const wordsToShow = prevWords.length > 0 ? prevWords : prevClusterWords;
      if (wordsToShow.length > 0) {
        reportData.since_last_week = `Last week: ${wordsToShow.join(', ')}. This week: No entries logged — continuity maintained from Week ${prevSummaryData.week_number}.`;
      } else {
        reportData.since_last_week = `Maintained baseline from Week ${prevSummaryData.week_number}. No new entries logged this week.`;
      }
    } else {
      reportData.since_last_week = 'First week on record. No journal entries logged during this period; baseline remains open.';
    }

    // Polish what_we_saw and body
    if (!reportData.what_we_saw || reportData.what_we_saw.startsWith('No journal entries were recorded')) {
      if (prevSummaryData) {
        reportData.what_we_saw = `No journal entries were recorded for Week ${weekNumber}. Your reflection baseline, focal themes, and emotional patterns from Week ${prevSummaryData.week_number} remain active.\n\nTaking time between reflections is a natural pause. Your emotional continuity is preserved, carrying forward insights from your prior entries until you resume writing.`;
      } else {
        reportData.what_we_saw = `No journal entries were recorded for Week ${weekNumber}. Your space is ready and waiting for whenever you choose to begin writing.\n\nYour first entry will establish your baseline tone, emotional vocabulary, and personal reflection arc.`;
      }
    }
    if (!report.body || report.body.startsWith('No journal entries were recorded')) {
      report.body = reportData.what_we_saw;
    }

    // Week tone & title
    if (!report.title || report.title === 'Weekly Synthesis' || report.title === 'Neutral baseline') {
      if (prevSummaryData?.week_tone) {
        report.title = `Baseline Continuity (Same as Week ${prevSummaryData.week_number})`;
      } else {
        report.title = 'Rest & Integration';
      }
    }
    reportData.week_tone = report.title;

    // Candidate quote & open question
    if (!reportData.candidate_quote) {
      reportData.candidate_quote = prevSummaryData?.candidate_quote || 'Rest and pauses are a vital part of personal reflection.';
    }
    if (!reportData.carry_question) {
      reportData.carry_question = report.open_question || 'What thoughts or reflections would you like to explore as you step into the coming week?';
    }
    if (!report.open_question) {
      report.open_question = reportData.carry_question;
    }
  }

  // 2. Heal vocabThisWeek if empty and entries exist
  if (!isZeroEntries && (!reportData.vocabThisWeek || reportData.vocabThisWeek.length === 0)) {
    try {
      const journalIds = validEntries.map((e: any) => e.id);
      
      if (journalIds.length > 0) {
        const { data: entryExts } = await supabaseClient
          .from('vocab_extractions')
          .select('normalized_word, word, confidence, sentence, created_at, entry_id')
          .eq('user_id', userId)
          .eq('cycle_id', cycleId)
          .in('entry_id', journalIds);

        if (entryExts && entryExts.length > 0) {
          const vocabMap = new Map<string, { word: string; freq: number; sentence: string }>();
          entryExts.forEach((ext: any) => {
            const norm = ext.normalized_word.toLowerCase();
            const existing = vocabMap.get(norm);
            if (existing) {
              existing.freq += 1;
            } else {
              vocabMap.set(norm, {
                word: ext.word,
                freq: 1,
                sentence: ext.sentence || ''
              });
            }
          });

          const healedVocab = Array.from(vocabMap.entries()).map(([norm, val]) => ({
            word: val.word,
            normalized_word: norm,
            frequency: val.freq,
            sentence: (val.sentence || '').substring(0, 100)
          })).sort((a, b: any) => b.frequency - a.frequency).slice(0, 10);

          reportData.vocabThisWeek = healedVocab;
        }
      }
    } catch (err) {
      console.error('[Heal Report Data] Error healing vocab:', err);
    }
  }

  // 3. Heal since_last_week comparison if week > 1 and it's empty or says "First week on record"
  const isFirstWeekMsg = !reportData.since_last_week || 
                         (typeof reportData.since_last_week === 'string' && reportData.since_last_week.includes('First week on record')) ||
                         (typeof reportData.since_last_week === 'object' && (!reportData.since_last_week.last_week_words || reportData.since_last_week.last_week_words.length === 0));

  if (!isZeroEntries && weekNumber > 1 && isFirstWeekMsg) {
    try {
      const { data: prevSummary } = await supabaseClient
        .from('weekly_summaries')
        .select('*')
        .eq('user_id', userId)
        .eq('cycle_id', cycleId)
        .eq('week_number', weekNumber - 1)
        .maybeSingle();

      if (prevSummary) {
        const healedPrev = await healReportData(prevSummary, supabaseClient);
        const prevVocab = healedPrev?.report_data?.vocabThisWeek || [];
        const thisVocab = reportData.vocabThisWeek || [];

        if (prevVocab.length > 0 || thisVocab.length > 0) {
          const lastWords = prevVocab.slice(0, 3).map((v: any) => v.word);
          const thisWords = thisVocab.slice(0, 3).map((v: any) => v.word);
          
          reportData.since_last_week = {
            last_week_words: lastWords,
            this_week_words: thisWords
          };
        }
      }
    } catch (err) {
      console.error('[Heal Report Data] Error healing since_last_week:', err);
    }
  }

  // 4. Heal graph data (entry_lengths and consistency) if empty or all-zero
  const entryLengths = reportData.writing_behaviour?.entry_lengths || [];
  const isGraphEmpty = !entryLengths || entryLengths.length === 0 || entryLengths.every((h: number) => h === 0) || reportData.writing_behaviour?.consistency === 'No reflection data recorded this week.';

  if (isGraphEmpty && !isZeroEntries) {
    try {
      const { overlayWeeklyReportGraphData } = await import('../../../../lib/reportGraphHelper');
      const tempReport = { ...report, report_data: reportData, day_start: dayStart, day_end: dayEnd };
      const overlaid = await overlayWeeklyReportGraphData(tempReport, userId);
      if (overlaid && overlaid.report_data) {
        reportData.writing_behaviour = overlaid.report_data.writing_behaviour;
      }
    } catch (graphErr) {
      console.error('[Heal Report Data] Error healing graph data:', graphErr);
    }
  } else if (isZeroEntries) {
    reportData.writing_behaviour = {
      ...(reportData.writing_behaviour || {}),
      avg_entry_length: 0,
      entry_lengths: [0, 0, 0, 0, 0, 0, 0],
      consistency: 'A restful week with no journal entries recorded. Daily pacing will resume with your next entry.'
    };
  }

  return {
    ...report,
    report_data: reportData
  };
}
