import JSZip from 'jszip';
import { supabase } from './db';
import { decrypt } from './encryption';

export interface DataExportStats {
  entriesCount: number;
  reportsCount: number;
  reflectionsCount: number;
  cyclesCount: number;
  exercisesCount: number;
  vocabWordsCount: number;
}

export class DataExportService {
  /**
   * Helper to format human-readable dates
   */
  private static formatDate(dateStr: string | null | undefined): string {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      });
    } catch {
      return dateStr;
    }
  }

  /**
   * Helper to format YYYY-MM-DD
   */
  private static formatIsoDate(dateStr: string | null | undefined): string {
    if (!dateStr) return 'undated';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return 'undated';
      return d.toISOString().split('T')[0];
    } catch {
      return 'undated';
    }
  }

  /**
   * Helper to escape CSV values
   */
  private static escapeCsv(val: any): string {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  }

  /**
   * Generates a complete ZIP archive with dedicated documents for each category of user data.
   */
  public static async exportUserDataZip(userId: string): Promise<{
    buffer: Buffer;
    filename: string;
    stats: DataExportStats;
  }> {
    const zip = new JSZip();

    // 1. Fetch User & Profile
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    // 2. Fetch Cycles
    const { data: cycles } = await supabase
      .from('cycles')
      .select('*')
      .eq('user_id', userId)
      .order('cycle_number', { ascending: true });

    const cycleMap = new Map<string, number>();
    (cycles || []).forEach((c) => {
      cycleMap.set(c.id, c.cycle_number || 1);
    });

    // 3. Fetch Entries
    const { data: rawEntries } = await supabase
      .from('entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    // 4. Fetch Reflections
    const { data: rawReflections } = await supabase
      .from('reflections')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    // Map reflections by entry_id
    const reflectionByEntryId = new Map<string, any>();
    (rawReflections || []).forEach((r) => {
      if (r.entry_id) {
        reflectionByEntryId.set(r.entry_id, r);
      }
    });

    // 5. Fetch Weekly Summaries / Reports
    const { data: rawReports } = await supabase
      .from('weekly_summaries')
      .select('*')
      .eq('user_id', userId)
      .order('week_number', { ascending: true });

    // 6. Fetch Exercises
    const { data: rawExercises } = await supabase
      .from('exercises')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    // 7. Fetch Vocabulary
    const { data: rawVocabWords } = await supabase
      .from('vocab_words')
      .select('*')
      .eq('user_id', userId);

    const { data: rawVocabExtractions } = await supabase
      .from('vocab_extractions')
      .select('*')
      .eq('user_id', userId);

    const entriesList = rawEntries || [];
    const reflectionsList = rawReflections || [];
    const reportsList = rawReports || [];
    const cyclesList = cycles || [];
    const exercisesList = rawExercises || [];
    const vocabList = rawVocabWords || [];

    const stats: DataExportStats = {
      entriesCount: entriesList.length,
      reportsCount: reportsList.length,
      reflectionsCount: reflectionsList.length,
      cyclesCount: cyclesList.length,
      exercisesCount: exercisesList.length,
      vocabWordsCount: vocabList.length
    };

    const exportTimestamp = new Date().toISOString();
    const exportFormattedDate = this.formatDate(exportTimestamp);
    const dateSlug = this.formatIsoDate(exportTimestamp);
    const userName = profile?.full_name || user?.name || 'Ingress Within User';
    const userPhone = user?.phone_number || profile?.phone_number || 'Registered Phone';

    // ----------------------------------------------------
    // ROOT README.md
    // ----------------------------------------------------
    const readmeContent = `# Ingress Within — Personal Journey Data Export
Generated on: ${exportFormattedDate}

## User Information
- **Full Name:** ${userName}
- **Phone Number:** ${userPhone}
- **User Identifier:** ${userId}
- **Account Created:** ${this.formatDate(user?.created_at || profile?.created_at)}
- **Export Package Date:** ${dateSlug}

---

## What Is Included In This Archive
This archive contains your complete personal reflection data, carefully organized into distinct, human-readable documents and structured data:

1. **\`entries/\`**
   - Individual markdown documents (\`.md\`) for every single reflection entry you wrote.
   - \`all_entries.md\`: A comprehensive, chronological manuscript of all your entries in one file.
   - \`entries.csv\`: Tabular spreadsheet format containing dates, cycle numbers, days, word counts, and text.
   - \`entries.json\`: Raw structured JSON export.

2. **\`reflections/\`**
   - Individual documents for daily prompts, closing questions, AI reflections, and your answers.
   - \`all_reflections.md\`: Consolidated collection of all reflection exchanges.
   - \`reflections.json\`: Structured JSON records.

3. **\`reports/\`**
   - Separate documents for every weekly synthesis report (\`Weekly_Report_Week_X_Cycle_Y.md\`).
   - Detailed emotional landscape, emergent themes, and cognitive shifts.
   - \`all_reports.md\`: Complete bound collection of all weekly summaries.
   - \`reports.json\`: Raw structured JSON records.

4. **\`emotional_vocabulary/\`**
   - \`emotional_vocabulary_lexicon.md\`: Your personal emotional dictionary, tracked words, and nuance patterns.
   - \`vocabulary.json\`: Structured vocabulary list.

5. **\`exercises/\`**
   - \`completed_exercises.md\`: Summary of completed somatic regulation and cognitive reframing exercises.
   - \`exercises.json\`: Structured exercise responses.

6. **\`profile/\`**
   - \`profile_overview.md\`: Account identity and onboarding milestones.
   - \`profile.json\`: Raw profile records.

7. **\`cycles/\`**
   - \`cycles_summary.md\`: History of all your 30-day reflection cycles.
   - \`cycles.json\`: Structured cycle data.

8. **\`account_summary.json\`**
   - Unified master backup file for complete data portability.

---

### Data Ownership & Privacy Assurance
You retain absolute sovereignty over your reflections, thoughts, and writings. All content in this export was decrypted directly from your private account keys.
Ingress Within · Secure Export System
`;
    zip.file('README.md', readmeContent);

    // ----------------------------------------------------
    // 1. PROFILE FOLDER
    // ----------------------------------------------------
    const profileFolder = zip.folder('profile') || zip;
    const profileMd = `# Profile & Account Overview

- **Name:** ${userName}
- **Phone:** ${userPhone}
- **Account Status:** ${user?.account_status || 'active'}
- **Onboarding Status:** ${profile?.onboarding_status || 'completed'}
- **Consent Confirmed:** ${profile?.consent_completed ? 'Yes' : 'No'}
- **Orientation Completed:** ${profile?.orientation_completed ? 'Yes' : 'No'}
- **Assessment Completed:** ${profile?.assessment_completed ? 'Yes' : 'No'}
- **Account Created:** ${this.formatDate(user?.created_at)}
- **Last Updated:** ${this.formatDate(profile?.updated_at || user?.updated_at)}
`;
    profileFolder.file('profile_overview.md', profileMd);
    profileFolder.file('profile.json', JSON.stringify({ user, profile }, null, 2));

    // ----------------------------------------------------
    // 2. CYCLES FOLDER
    // ----------------------------------------------------
    const cyclesFolder = zip.folder('cycles') || zip;
    let cyclesMd = `# Reflection Cycles History\n\nTotal Cycles: ${cyclesList.length}\n\n`;
    cyclesList.forEach((c) => {
      cyclesMd += `## Cycle ${c.cycle_number}\n`;
      cyclesMd += `- **Status:** ${c.status}\n`;
      cyclesMd += `- **Start Date:** ${this.formatDate(c.start_date)}\n`;
      cyclesMd += `- **End Date:** ${c.end_date ? this.formatDate(c.end_date) : 'Ongoing'}\n`;
      cyclesMd += `- **Current Day:** ${c.current_day || 1} / ${c.total_days || 30}\n`;
      cyclesMd += `- **Days Completed:** ${c.days_completed || 0}\n`;
      cyclesMd += `- **Entries Recorded:** ${c.entries_count || 0}\n\n`;
    });
    cyclesFolder.file('cycles_summary.md', cyclesMd);
    cyclesFolder.file('cycles.json', JSON.stringify(cyclesList, null, 2));

    // ----------------------------------------------------
    // 3. ENTRIES FOLDER (Separate docs for every entry!)
    // ----------------------------------------------------
    const entriesFolder = zip.folder('entries') || zip;
    let allEntriesMd = `# Ingress Within — Complete Journal Entries Manuscript\nUser: ${userName}\nExport Date: ${exportFormattedDate}\n\n---\n\n`;
    
    // CSV Header
    let entriesCsv = '"id","cycle_number","cycle_day","written_at","word_count","classification","entry_content","reflection_question","reflection_answer"\n';

    const processedEntries: any[] = [];

    entriesList.forEach((entry, index) => {
      const cycleNum = entry.cycle_number || (entry.cycle_id ? cycleMap.get(entry.cycle_id) : null) || 1;
      const dayNum = entry.cycle_day || (index + 1);
      const writtenDate = entry.written_at || entry.created_at;
      const dateStr = this.formatIsoDate(writtenDate);
      const formattedDate = this.formatDate(writtenDate);

      // Decrypt entry text
      let text = '';
      if (entry.new_entry_text_encrypted) {
        text = decrypt(entry.new_entry_text_encrypted, entry.new_entry_text_iv) || '';
      }
      if (!text && entry.content) {
        text = entry.content;
      }

      // Check linked reflection
      const linkedReflection = reflectionByEntryId.get(entry.id);
      let reflectionAnswer = '';
      if (entry.reflection_text_encrypted) {
        reflectionAnswer = decrypt(entry.reflection_text_encrypted, entry.reflection_text_iv) || '';
      }
      if (!reflectionAnswer && linkedReflection?.reflection_answer) {
        reflectionAnswer = linkedReflection.reflection_answer;
      }

      const wordCount = entry.word_count || (text ? text.trim().split(/\s+/).filter(Boolean).length : 0);

      // Individual entry Markdown document
      const entryFileDoc = `# Reflection Entry — Cycle ${cycleNum}, Day ${dayNum}

- **Date:** ${formattedDate}
- **Cycle:** ${cycleNum}
- **Day:** ${dayNum}
- **Word Count:** ${wordCount} words
${entry.classification ? `- **Emotional Classification:** ${entry.classification}\n` : ''}
${entry.crisis_flag ? `- **Crisis Flag:** Noted for gentle care\n` : ''}

---

## Journal Entry

${text || '*(No writing content recorded)*'}

${linkedReflection ? `
---

## Daily Reflection Exchange

${linkedReflection.reflection_text ? `### Guided Reflection\n${linkedReflection.reflection_text}\n` : ''}
${linkedReflection.closing_question ? `### Inquiry Question\n*${linkedReflection.closing_question}*\n` : ''}
${reflectionAnswer ? `### Your Response\n${reflectionAnswer}\n` : ''}
` : ''}

---
*Ingress Within · Private Entry Record*
`;

      // Save individual document
      const individualFilename = `Entry_Cycle_${cycleNum}_Day_${String(dayNum).padStart(2, '0')}_${dateStr}.md`;
      entriesFolder.file(individualFilename, entryFileDoc);

      // Append to all_entries.md
      allEntriesMd += `## Cycle ${cycleNum}, Day ${dayNum} — ${formattedDate}\n\n`;
      allEntriesMd += `${text || '*(Empty entry)*'}\n\n`;
      if (linkedReflection?.closing_question) {
        allEntriesMd += `> **Inquiry:** ${linkedReflection.closing_question}\n`;
        if (reflectionAnswer) {
          allEntriesMd += `> **Response:** ${reflectionAnswer}\n`;
        }
        allEntriesMd += `\n`;
      }
      allEntriesMd += `---\n\n`;

      // Append to CSV
      entriesCsv += [
        this.escapeCsv(entry.id),
        this.escapeCsv(cycleNum),
        this.escapeCsv(dayNum),
        this.escapeCsv(formattedDate),
        this.escapeCsv(wordCount),
        this.escapeCsv(entry.classification || ''),
        this.escapeCsv(text),
        this.escapeCsv(linkedReflection?.closing_question || ''),
        this.escapeCsv(reflectionAnswer || '')
      ].join(',') + '\n';

      processedEntries.push({
        id: entry.id,
        cycle_number: cycleNum,
        cycle_day: dayNum,
        written_at: writtenDate,
        word_count: wordCount,
        classification: entry.classification || null,
        content: text,
        reflection: linkedReflection ? {
          question: linkedReflection.closing_question || null,
          insight: linkedReflection.reflection_text || null,
          user_answer: reflectionAnswer || null
        } : null
      });
    });

    entriesFolder.file('all_entries.md', allEntriesMd);
    entriesFolder.file('entries.csv', entriesCsv);
    entriesFolder.file('entries.json', JSON.stringify(processedEntries, null, 2));

    // ----------------------------------------------------
    // 4. REFLECTIONS FOLDER
    // ----------------------------------------------------
    const reflectionsFolder = zip.folder('reflections') || zip;
    let allReflectionsMd = `# Ingress Within — Daily Reflections Collection\nUser: ${userName}\n\n---\n\n`;

    reflectionsList.forEach((r, idx) => {
      const cycleNum = r.cycle_number || 1;
      const dayNum = r.cycle_day || (idx + 1);
      const dateStr = this.formatIsoDate(r.created_at);

      const reflectionDoc = `# Daily Reflection — Cycle ${cycleNum}, Day ${dayNum}

- **Date:** ${this.formatDate(r.created_at)}
- **Cycle:** ${cycleNum}
- **Day:** ${dayNum}
${r.classification ? `- **Classification:** ${r.classification}\n` : ''}
${r.themes ? `- **Themes:** ${Array.isArray(r.themes) ? r.themes.join(', ') : r.themes}\n` : ''}

---

### Reflection Insight
${r.reflection_text || '*(No insight text)*'}

### Inquiry Question
*${r.closing_question || '*(No inquiry question)*'}*

### Your Response
${r.reflection_answer || '*(Unanswered)*'}
`;

      reflectionsFolder.file(`Reflection_Cycle_${cycleNum}_Day_${String(dayNum).padStart(2, '0')}_${dateStr}.md`, reflectionDoc);

      allReflectionsMd += `## Cycle ${cycleNum}, Day ${dayNum} (${dateStr})\n`;
      if (r.reflection_text) allReflectionsMd += `**Insight:** ${r.reflection_text}\n\n`;
      if (r.closing_question) allReflectionsMd += `**Question:** *${r.closing_question}*\n\n`;
      if (r.reflection_answer) allReflectionsMd += `**Your Response:** ${r.reflection_answer}\n\n`;
      allReflectionsMd += `---\n\n`;
    });

    reflectionsFolder.file('all_reflections.md', allReflectionsMd);
    reflectionsFolder.file('reflections.json', JSON.stringify(reflectionsList, null, 2));

    // ----------------------------------------------------
    // 5. REPORTS FOLDER (Separate docs for every weekly report!)
    // ----------------------------------------------------
    const reportsFolder = zip.folder('reports') || zip;
    let allReportsMd = `# Ingress Within — Weekly Synthesis Reports\nUser: ${userName}\n\n---\n\n`;

    reportsList.forEach((rep) => {
      const weekNum = rep.week_number || 1;
      const cycleNum = rep.cycle_id ? (cycleMap.get(rep.cycle_id) || 1) : 1;
      const formattedDate = this.formatDate(rep.created_at);

      let themesFormatted = '';
      if (rep.themes) {
        if (Array.isArray(rep.themes)) {
          themesFormatted = rep.themes.map((t: string) => `- ${t}`).join('\n');
        } else if (typeof rep.themes === 'object') {
          themesFormatted = Object.entries(rep.themes).map(([k, v]) => `- **${k}:** ${v}`).join('\n');
        } else {
          themesFormatted = String(rep.themes);
        }
      }

      let shiftsFormatted = '';
      if (rep.shifts) {
        if (Array.isArray(rep.shifts)) {
          shiftsFormatted = rep.shifts.map((s: string) => `- ${s}`).join('\n');
        } else if (typeof rep.shifts === 'object') {
          shiftsFormatted = Object.entries(rep.shifts).map(([k, v]) => `- **${k}:** ${JSON.stringify(v)}`).join('\n');
        } else {
          shiftsFormatted = String(rep.shifts);
        }
      }

      const reportDoc = `# Weekly Synthesis Report — Week ${weekNum} (Cycle ${cycleNum})

- **Report Generated:** ${formattedDate}
- **Cycle:** ${cycleNum}
- **Week Number:** ${weekNum}

---

## Synthesis Summary
${rep.summary_text || rep.summary || 'Summary completed.'}

${themesFormatted ? `\n## Emergent Themes\n${themesFormatted}\n` : ''}
${shiftsFormatted ? `\n## Emotional & Behavioral Shifts\n${shiftsFormatted}\n` : ''}

${rep.key_observations ? `\n## Key Observations\n${Array.isArray(rep.key_observations) ? rep.key_observations.map((o: string) => `- ${o}`).join('\n') : rep.key_observations}\n` : ''}

---
*Ingress Within Cognitive Synthesis*
`;

      reportsFolder.file(`Weekly_Report_Week_${weekNum}_Cycle_${cycleNum}.md`, reportDoc);

      allReportsMd += `## Week ${weekNum} (Cycle ${cycleNum}) — ${formattedDate}\n\n`;
      allReportsMd += `${rep.summary_text || rep.summary || ''}\n\n`;
      if (themesFormatted) allReportsMd += `### Themes\n${themesFormatted}\n\n`;
      allReportsMd += `---\n\n`;
    });

    reportsFolder.file('all_reports.md', allReportsMd);
    reportsFolder.file('reports.json', JSON.stringify(reportsList, null, 2));

    // ----------------------------------------------------
    // 6. EMOTIONAL VOCABULARY FOLDER
    // ----------------------------------------------------
    const vocabFolder = zip.folder('emotional_vocabulary') || zip;
    let vocabMd = `# Emotional Vocabulary Lexicon\nUser: ${userName}\n\n`;
    vocabMd += `Extracted words count: ${vocabList.length}\n\n`;
    vocabMd += `| Word | Category / Emotion | Frequency | Last Observed |\n`;
    vocabMd += `| :--- | :--- | :--- | :--- |\n`;

    vocabList.forEach((v) => {
      vocabMd += `| **${v.word || v.term || 'Word'}** | ${v.category || v.emotion || 'Affect'} | ${v.frequency || v.occurrences || 1} | ${this.formatDate(v.created_at || v.last_seen)} |\n`;
    });

    vocabFolder.file('emotional_vocabulary_lexicon.md', vocabMd);
    vocabFolder.file('vocabulary.json', JSON.stringify({ words: vocabList, extractions: rawVocabExtractions || [] }, null, 2));

    // ----------------------------------------------------
    // 7. EXERCISES FOLDER
    // ----------------------------------------------------
    const exercisesFolder = zip.folder('exercises') || zip;
    let exercisesMd = `# Somatic & Cognitive Exercises History\n\nTotal Completed: ${exercisesList.length}\n\n`;
    exercisesList.forEach((ex, idx) => {
      exercisesMd += `### Exercise ${idx + 1}: ${ex.template_id || 'Reframing'}\n`;
      exercisesMd += `- **Completed:** ${this.formatDate(ex.completed_at || ex.created_at)}\n`;
      exercisesMd += `- **Cycle:** ${ex.cycle_id ? (cycleMap.get(ex.cycle_id) || 1) : 1} | **Day:** ${ex.cycle_day || 1}\n`;
      if (ex.response_encrypted) {
        try {
          const parsed = JSON.parse(ex.response_encrypted);
          if (parsed.stressor_type) exercisesMd += `- **Stressor Type:** ${parsed.stressor_type}\n`;
          if (parsed.reactive_thought) exercisesMd += `- **Reactive Thought:** ${parsed.reactive_thought}\n`;
          if (parsed.reframed_thought) exercisesMd += `- **Reframed Thought:** ${parsed.reframed_thought}\n`;
          if (parsed.clarity_score) exercisesMd += `- **Clarity Score:** ${parsed.clarity_score}/10\n`;
        } catch {
          exercisesMd += `- **Response:** Recorded\n`;
        }
      }
      exercisesMd += `\n`;
    });
    exercisesFolder.file('completed_exercises.md', exercisesMd);
    exercisesFolder.file('exercises.json', JSON.stringify(exercisesList, null, 2));

    // ----------------------------------------------------
    // 8. UNIFIED MASTER JSON
    // ----------------------------------------------------
    const masterJson = {
      export_version: '1.0',
      exported_at: exportTimestamp,
      user,
      profile,
      cycles: cyclesList,
      entries: processedEntries,
      reflections: reflectionsList,
      weekly_summaries: reportsList,
      emotional_vocabulary: vocabList,
      exercises: exercisesList
    };
    zip.file('account_summary.json', JSON.stringify(masterJson, null, 2));

    // Generate ZIP buffer with high compression
    const buffer = await zip.generateAsync({
      type: 'nodebuffer',
      compression: 'DEFLATE',
      compressionOptions: { level: 9 }
    });

    const safeName = (userName || 'user').toLowerCase().replace(/[^a-z0-9]/g, '_');
    const filename = `ingress_within_${safeName}_export_${dateSlug}.zip`;

    // Asynchronously log the download event in audit_logs
    try {
      await supabase.from('audit_logs').insert({
        user_id: userId,
        action: 'DATA_EXPORT_DOWNLOADED',
        metadata: {
          filename,
          stats,
          exported_at: exportTimestamp
        }
      });
    } catch (e) {
      console.warn('[DataExportService] Failed to insert audit log for export download:', e);
    }

    return { buffer, filename, stats };
  }

  /**
   * Logs a data export request and marks it ready.
   */
  public static async requestDataExport(
    userId: string,
    contactInfo?: string,
    ip?: string,
    userAgent?: string
  ): Promise<{
    success: boolean;
    requestedAt: string;
    status: string;
    message: string;
  }> {
    const nowIso = new Date().toISOString();

    try {
      await supabase.from('audit_logs').insert({
        user_id: userId,
        action: 'DATA_EXPORT_REQUESTED',
        ip_address: ip || null,
        user_agent: userAgent || null,
        metadata: {
          contact_info: contactInfo,
          requested_at: nowIso,
          status: 'ready'
        }
      });
    } catch (err) {
      console.warn('[DataExportService] Error logging export request:', err);
    }

    return {
      success: true,
      requestedAt: nowIso,
      status: 'ready',
      message: 'Your data export request has been securely logged. Your complete document archive is ready for immediate download below.'
    };
  }

  /**
   * Retrieves the current user's data export status and counts.
   */
  public static async getDataExportStatus(userId: string): Promise<{
    requested: boolean;
    lastRequestedAt: string | null;
    lastDownloadedAt: string | null;
    entriesCount: number;
    reportsCount: number;
    isReady: boolean;
  }> {
    // Check audit logs for past export activity
    const { data: logs } = await supabase
      .from('audit_logs')
      .select('action, created_at, metadata')
      .eq('user_id', userId)
      .in('action', ['DATA_EXPORT_REQUESTED', 'DATA_EXPORT_DOWNLOADED'])
      .order('created_at', { ascending: false })
      .limit(10);

    let lastRequestedAt: string | null = null;
    let lastDownloadedAt: string | null = null;

    if (logs && logs.length > 0) {
      for (const log of logs) {
        if (log.action === 'DATA_EXPORT_REQUESTED' && !lastRequestedAt) {
          lastRequestedAt = log.created_at;
        }
        if (log.action === 'DATA_EXPORT_DOWNLOADED' && !lastDownloadedAt) {
          lastDownloadedAt = log.created_at;
        }
      }
    }

    // Check count of entries and reports
    const { count: entriesCount } = await supabase
      .from('entries')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId);

    const { count: reportsCount } = await supabase
      .from('weekly_summaries')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId);

    return {
      requested: Boolean(lastRequestedAt),
      lastRequestedAt,
      lastDownloadedAt,
      entriesCount: entriesCount || 0,
      reportsCount: reportsCount || 0,
      isReady: true
    };
  }
}
