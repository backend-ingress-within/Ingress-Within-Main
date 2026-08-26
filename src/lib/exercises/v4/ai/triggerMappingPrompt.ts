import { TriggerMappingMomentInput } from '../definitions/triggerMappingCatalog';

export class TriggerMappingPrompt {
  public static buildPrompt(
    moments: TriggerMappingMomentInput[],
    synthesisAnswer: string
  ): string {
    const momentsBlock = moments
      .map(
        (m, i) =>
          `MOMENT ${i + 1}: ${m.moment_text}\nQ1 (first reaction): ${m.q1}\nQ2 (what they wanted to avoid): ${m.q2}`
      )
      .join('\n\n');

    return `TRIGGER MAPPING — CLINICAL ANALYSIS PROMPT

A person mapped ${moments.length} of their own triggering moments — situations where something produced a bigger reaction than the moment itself seemed to call for. For each, they described their first reaction and what they most wanted to avoid. They then answered a synthesis question comparing all the moments.

Context: describing a strong reaction and naming what someone wanted to avoid is the intended content of this exercise, not something alarming on its own. Only treat a response as a genuine concern if it's an unambiguous, explicit statement about self-harm, suicide, or wanting to die or disappear. If nothing meets that bar, proceed with the task normally.

The moments, in order:

${momentsBlock}

Their synthesis answer (their own attempt to find a pattern across all the moments): "${synthesisAnswer}"

You are producing two things.

PART 1 — ANALYSIS (label: ANALYSIS:)
2-3 plain sentences directly to the person using "you". Read the moments and their synthesis answer. Name 2-3 specific things from their own words. Then say one plain thing about their synthesis answer specifically — what it got right, and what it's missing, if anything. Do not just restate what they already said. Sound like you're talking to them, not writing a report.

Hard rules:
- Must quote or closely reference their actual words.
- No abstract language, no jargon: architecture, mechanism, domain, trigger, pattern, dual bind, dynamic, narrative, threshold, unresolved, ongoing, present.
- No literary phrasing, no metaphor.
- Do not be warm or encouraging.

PART 2 — WORTH SITTING WITH (1-2 items, each with a longer note, 3-5 sentences, produced only inside the JSON below)
Pick the 1-2 moments most worth a closer look — not necessarily the ones the person's own synthesis focused on. For each, write like a therapist explaining their thinking out loud:
1. Contrast this moment's Q1/Q2 against the pattern in the other moments — name the pattern specifically.
2. Say plainly what's different about this one and why it's worth noticing.
3. Extend to what this kind of pattern can look like day to day, framed as a possibility, never a diagnosis.
4. Close with one line starting "Worth noticing if..." that turns it into a question they ask themselves.

Rules for both parts: grounded only in what's above; plain words; "you" throughout, never "this person"; no markdown; not warm or falsely reassuring.

After both parts, on a new line return ONLY this JSON:
{"worth_sitting_with": [{"label": "[short name for the moment, a few words]", "note": "[3-5 sentence note following the 4-part structure above]"}]}`;
  }
}
