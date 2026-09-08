import {
  YEAR_END_ANCHORS,
  YearEndAnchorResponse,
  YearEndSynthesisAnswers
} from '../definitions/yearEndPortraitCatalog';

export interface YearEndPortraitPromptContext {
  anchors: Record<string, YearEndAnchorResponse>;
  closerReflection: string;
  synthesis: YearEndSynthesisAnswers;
}

export class YearEndPortraitPrompt {
  public static buildPrompt(ctx: YearEndPortraitPromptContext): { system: string; user: string } {
    const system = `You are a grounded, reflective psychoeducational synthesis engine for Ingress Within.

YOUR MANDATE:
You are synthesizing the user's 12-Month Year-End Self-Portrait based entirely and self-containedly on their submitted reflections:
1. 8 Anchor Revisits (Self-perception, Values, Depleting connections, Restorative connections, Somatic signals, Avoidance, Pattern costs, and Recurring contexts) with user-assigned judgments ('still_true', 'changed', 'complicated') and notes.
2. Universal Closer Reflection (What they are still not seeing clearly about yourself).
3. 5 Synthesis Reflections (Starting emotional state, Single most important understanding, Most resistant pattern, What they are now ready to examine, Advice to their past self).

CRITICAL NON-CLINICAL RULES:
- Address the user directly as "you".
- Use warm, grounded, clear, and dignified psychoeducational language.
- DO NOT use clinical diagnosis, pathologies, psychiatric labels, or medical jargon.
- DO NOT use hollow therapeutic cliches ("magical journey", "proud of you", "holding space", "healing vibes").
- Ground every observation directly in the user's specific words and judgments.
- Treat contradictions with respectful inquiry rather than judgment.
- Return ONLY valid JSON formatted strictly to the requested schema.`;

    const formattedAnchors = YEAR_END_ANCHORS.map(anchor => {
      const resp = ctx.anchors[anchor.id] || { judgment: 'still_true', note: '' };
      const judgmentText = resp.judgment === 'still_true'
        ? 'Still true'
        : resp.judgment === 'changed'
        ? "Something's changed"
        : "It's complicated";
      return `- Anchor ${anchor.categoryNumber} (${anchor.title} / ${anchor.subtitle}):
  * Judgment: ${judgmentText} (${resp.judgment})
  * User's Reflection/Note: ${resp.note || '(No additional note provided)'}`;
    }).join('\n\n');

    const user = `USER 12-MONTH YEAR-END SELF-PORTRAIT SUBMISSIONS:

=== PART 1: 8 ANCHOR REVISITS ===
${formattedAnchors}

=== PART 2: UNIVERSAL CLOSER REFLECTION ===
Question: "Looking back, what do you think you're still not seeing clearly about yourself?"
User's Reflection:
"${ctx.closerReflection || 'No reflection entered'}"

=== PART 3: 5 SYNTHESIS QUESTIONS ===
1. Who were you emotionally at the start of this year (one sentence):
"${ctx.synthesis.q1 || 'N/A'}"

2. Single most important thing understood in the past 12 months:
"${ctx.synthesis.q2 || 'N/A'}"

3. Pattern most resistant to change despite awareness:
"${ctx.synthesis.q3 || 'N/A'}"

4. What you are now ready to examine that you weren't ready for at the start of the year:
"${ctx.synthesis.q4 || 'N/A'}"

5. What you would tell someone standing where you were a year ago:
"${ctx.synthesis.q5 || 'N/A'}"

OUTPUT JSON SCHEMA:
{
  "part1_ground": "3-4 grounded paragraphs synthesizing 'The Ground You Stood On': where they began, the foundational anchors they identified, what held steady ('still true'), and the initial emotional landscape.",
  "part2_shift": "3-4 insightful paragraphs detailing 'The Shape of the Shift': the primary breakthroughs, the persistent patterns that resisted change, and how their awareness altered their relationship to costs, avoidance, and boundaries.",
  "part3_motion": "3-4 integrating paragraphs on 'What Remains in Motion': what they are now capable of examining, the ongoing inquiry, and the resonance of the counsel they offered to their earlier self.",
  "closing_question": "A single, profound, high-impact inquiry directly tailored to their blind spot and forward horizon.",
  "summary": "A concise 2-3 sentence executive summary of the entire year-end self-portrait."
}`;

    return { system, user };
  }
}
