export interface SixMonthPromptContext {
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  q5: string;
  q6: string;
  q7: string;
  branchCode: 'A' | 'B' | 'C' | 'D';
  q6PromptText: string;
  ex03Baseline?: {
    q1?: string;
    q2?: string;
    q3?: string;
    q4?: string;
    q5?: string;
    summary?: string;
    completedAt?: string;
  } | null;
  day30PrimaryPattern?: string | null;
  journalEntries?: string[];
}

export class SixMonthAssessmentPrompt {
  public static buildPrompt(ctx: SixMonthPromptContext): { system: string; user: string } {
    const system = `You are a clinical psychoeducation analysis engine performing a 6-Month Self-Assessment evidence comparison for the Ingress Within framework.

YOUR MANDATE:
1. Compare Month 6 self-descriptions (Q1-Q5) against Day 24 baseline self-descriptions (EX03).
2. Cross-reference perceived changes against actual journal entry evidence.
3. Quantify self-description change score (0-5: number of Q1-Q5 showing meaningful shift).
4. Quantify entry-validated change score (0-5: number of self-described shifts supported by journal writing).
5. Assess discrepancy (difference between perceived shift and journal-evidenced shift).
6. Analyze branch-specific Question 6 and universal Question 7.

CRITICAL RULES:
- Address the user as "you".
- Plain, direct, grounded language.
- NO clinical jargon, NO diagnosis, NO therapeutic clichés ("journey", "holding space", "proud of you").
- NEVER manufacture improvement. If entries show no change, state it clearly and calmly.
- Never write "You lied" or "You failed". Frame gaps as "You described X, whereas your writing indicates Y."
- Return ONLY valid JSON formatted according to the requested schema.`;

    const baselineFormatted = ctx.ex03Baseline
      ? `DAY 24 BASELINE (EX03):
- Q1 Baseline: ${ctx.ex03Baseline.q1 || 'N/A'}
- Q2 Baseline: ${ctx.ex03Baseline.q2 || 'N/A'}
- Q3 Baseline: ${ctx.ex03Baseline.q3 || 'N/A'}
- Q4 Baseline: ${ctx.ex03Baseline.q4 || 'N/A'}
- Q5 Baseline: ${ctx.ex03Baseline.q5 || 'N/A'}
- Baseline Summary: ${ctx.ex03Baseline.summary || 'None'}`
      : `DAY 24 BASELINE (EX03): (No prior Day 24 baseline recorded - perform single-point analysis)`;

    const entriesFormatted = ctx.journalEntries && ctx.journalEntries.length > 0
      ? ctx.journalEntries.slice(0, 15).map((e, idx) => `Entry ${idx + 1}: "${e}"`).join('\n')
      : '(No recent journal entries recorded)';

    const user = `USER PROFILE & RESPONSES:
User Branch: Branch ${ctx.branchCode}
${ctx.day30PrimaryPattern ? `Day 30 Primary Pattern: ${ctx.day30PrimaryPattern}` : ''}

${baselineFormatted}

MONTH 6 SELF-ASSESSMENT RESPONSES (EX09):
- Q1 (Hard situations): ${ctx.q1}
- Q2 (Conflict handling): ${ctx.q2}
- Q3 (Unsaid / undone): ${ctx.q3}
- Q4 (Prioritised needs): ${ctx.q4}
- Q5 (What you'd change & stops you): ${ctx.q5}
- Q6 (Branch ${ctx.branchCode} - ${ctx.q6PromptText}): ${ctx.q6}
- Q7 (Universal - What you're still not seeing clearly): ${ctx.q7}

JOURNAL EVIDENCE (Recent writing):
${entriesFormatted}

OUTPUT JSON SCHEMA:
{
  "self_description_change_score": number, // 0 to 5
  "entry_validated_change_score": number, // 0 to 5
  "discrepancy": {
    "level": "low" | "moderate" | "significant",
    "summary": "Plain 1-2 sentence description of gap between self-perception and behavioral writing evidence."
  },
  "question_changes": [
    {
      "question_number": 1,
      "meaningful_shift": boolean,
      "baseline_summary": "1 sentence baseline summary",
      "current_summary": "1 sentence Month 6 summary",
      "entry_evidence": "supported" | "partial" | "not_supported",
      "evidence_summary": "1 sentence entry evidence summary"
    },
    ... for Q1 through Q5
  ],
  "branch_q6_analysis": {
    "evidence_level": "supported" | "partial" | "not_supported",
    "summary": "2 sentence analysis of Q6 response and journal evidence"
  },
  "q7_reflection": "2 sentence reflection on Q7 self-identified blind spot",
  "ai_analysis_text": "3-4 plain, grounded sentences summarizing 6-month evolution, validated shifts, and remaining edges."
}`;

    return { system, user };
  }
}
