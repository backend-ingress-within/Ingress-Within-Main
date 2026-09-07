import { RecurringScenarioInputData } from '../definitions/recurringScenarioCatalog';

export interface RecurringScenarioPromptContext {
  answers: RecurringScenarioInputData;
  relevantJournalMentions?: string[];
  totalJournalEntriesCount?: number;
}

export class RecurringScenarioPrompt {
  public static buildPrompt(ctx: RecurringScenarioPromptContext): { system: string; user: string } {
    const system = `You are a reflective psychoeducation analysis engine for the Ingress Within framework performing a Recurring Scenario Exercise analysis.

YOUR MANDATE:
1. Analyze four sentence completions examining anticipatory cognition (rehearsed before, replayed after, assumed inevitable, avoided imagining).
2. Evaluate pattern match against recent journal entries:
   - "repeatedly": Themes of rehearsal, replay, or inevitable negative outcomes appear regularly across journal entries.
   - "sometimes": Occasional alignment found in journal writing.
   - "not_visible": Scenarios described in this exercise do not appear explicitly in recent journal entries.
3. Observe how expectations shape behavior prior to events occurring.
4. Examine what the user avoids imagining and why that possibility might feel guarded.
5. Provide a single, quiet reflective observation for the user to carry forward.

CRITICAL TONE & SAFETY CONSTRAINTS:
- STRICTLY DESCRIPTIVE, NOT PRESCRIPTIVE.
- Address the user directly as "you".
- Calm, tentative, reflective, and non-judgmental tone.
- NEVER use clinical labels or accusations such as "catastrophizing", "irrational thinking", "cognitive distortion", "dysfunctional belief", "neuroticism", or "unconscious motives".
- Do NOT lecture or prescribe advice (e.g., do NOT say "You should stop rehearsing" or "You must change your thoughts").
- Use descriptive and grounded observations (e.g., "Your responses reflect a tendency to...", "Notice how...", "In your journal entries...").
- Output ONLY valid JSON matching the exact JSON schema requested.`;

    const mentionsFormatted = ctx.relevantJournalMentions && ctx.relevantJournalMentions.length > 0
      ? ctx.relevantJournalMentions.map((m, idx) => `Journal Excerpt ${idx + 1}: "${m}"`).join('\n')
      : '(No direct matching phrases found in recent journal entries)';

    const user = `USER'S SENTENCE COMPLETIONS:
1. Rehearsed Before: "${ctx.answers.prompt_rehearse}"
2. Replayed After: "${ctx.answers.prompt_replay}"
3. Assumed Inevitable: "${ctx.answers.prompt_inevitable}"
4. Avoided Imagining: "${ctx.answers.prompt_avoid}"

HISTORICAL JOURNAL CONTEXT:
- Total Journal Entries Inspected: ${ctx.totalJournalEntriesCount || 0}
${mentionsFormatted}

OUTPUT JSON SCHEMA:
{
  "strongest_pattern": "1-2 sentence concise summary of the primary rehearsed/replayed scenario theme.",
  "entry_appearance": "repeatedly" | "sometimes" | "not_visible",
  "expectation_behaviour_connection": "2 sentence gentle observation connecting how anticipating this outcome shapes behavior or preparation before events occur.",
  "unimagined_scenario_analysis": "2 sentence gentle observation on what skipping over the avoided scenario protects or guards against.",
  "one_thing_to_notice": "1 concise reflective question or statement for the user to hold gently without pressure.",
  "summary_text": "3-4 plain, calm sentences synthesizing the overall findings."
}`;

    return { system, user };
  }
}
