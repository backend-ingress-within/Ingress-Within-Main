import { CostBenefitPatternAnswers } from '../definitions/costBenefitCatalog';

export class CostBenefitPrompt {
  /**
   * Builds prompt for evaluating a single pattern and its four answers.
   */
  public static buildSinglePatternPrompt(pattern: string, answers: CostBenefitPatternAnswers): string {
    return `ANALYSIS API PROMPT — COST-BENEFIT AUDIT (SINGLE PATTERN EVALUATION)

A person examined a specific personal pattern as part of a Cost-Benefit Audit exercise:

PATTERN NAME:
"${pattern}"

USER RESPONSES:
1. What holding onto this costs in daily life, relationships, or energy:
"${answers.cost}"

2. What this pattern protects against or keeps safe:
"${answers.protection}"

3. The origin context where this response first started making sense:
"${answers.origin}"

4. Assessment of whether it still serves that same purpose today:
"${answers.stillMakesSense}"

CLINICAL TASK:
Examine this pattern carefully and generate a grounded, descriptive reflection that addresses:
1. The relationship between what this pattern costs and the protection it provides.
2. The functional protection mechanism (what role this pattern appears to serve).
3. The significance of the person's assessment regarding whether it still makes sense today.

STRICT CLINICAL TONE AND STYLE GUIDELINES:
- Directly address the person using "you".
- Be descriptive and observational, never diagnostic.
- Do NOT claim certainty or label the person.
- Do NOT prescribe what the person should do or pressure them to change.
- Do NOT judge the pattern as "bad", "wrong", "dysfunctional", or "irrational".
- Respect the original protective intelligence of the pattern while exploring its current trade-offs.
- Use nuanced, collaborative language: "may suggest", "appears to", "there seems to be", "one possible tension is", "it is worth noticing".
- Ground your analysis strictly in the words and themes provided above. Do NOT invent journal history or external context.

Return ONLY this valid JSON object on a single line (no markdown formatting, no code blocks):
{
  "observation": "2-3 grounded sentences exploring the relationship between the cost, the protection, and its ongoing validity in current life.",
  "protectionMechanism": "1-2 clear sentences articulating the functional protective purpose the pattern appears to serve.",
  "relationship": "1-2 sentences highlighting the dynamic balance or tension between what is protected and what is expended."
}`;
  }

  /**
   * Builds prompt for overall synthesis across all analyzed patterns.
   */
  public static buildOverallSynthesisPrompt(
    patternsData: { pattern: string; answers: CostBenefitPatternAnswers }[]
  ): string {
    const formatted = patternsData
      .map(
        (p, i) =>
          `[Pattern ${i + 1}: "${p.pattern}"]\n- Cost: ${p.answers.cost}\n- Protection: ${p.answers.protection}\n- Origin: ${p.answers.origin}\n- Current Validity: ${p.answers.stillMakesSense}`
      )
      .join('\n\n');

    return `ANALYSIS API PROMPT — COST-BENEFIT AUDIT (OVERALL SYNTHESIS)

A person examined the following ${patternsData.length} personal patterns during a Cost-Benefit Audit:

${formatted}

TASK:
Provide a brief, grounded 2-3 sentence overall observation synthesizing common protective themes or agency dynamics across these patterns.
Do not diagnose, do not give advice. Use "you".

Return ONLY this valid JSON object on a single line:
{
  "overall_reflection": "2-3 grounded sentences synthesizing the common protective themes across these patterns."
}`;
  }
}
