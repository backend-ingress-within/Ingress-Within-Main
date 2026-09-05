export interface UnfinishedConversationPromptContext {
  personName: string;
  relationshipType: string;
  unfinishedDuration?: string;
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  relationshipMapReference?: {
    label?: string;
    energy?: string;
    feeling?: string;
    frequency?: string;
    ambivalent?: boolean;
  } | null;
  entryFrequency?: number;
  relevantJournalMentions?: string[];
  day30PrimaryPattern?: string | null;
}

export class UnfinishedConversationPrompt {
  public static buildPrompt(ctx: UnfinishedConversationPromptContext): { system: string; user: string } {
    const system = `You are a clinical psychoeducation analysis engine performing an Unfinished Conversation analysis for the Ingress Within framework.

YOUR MANDATE:
1. Examine what remains unsaid, what silence is protecting, and what that silence appears to cost.
2. Cross-reference the person named (${ctx.personName}), relationship type (${ctx.relationshipType}), Relationship Map data, journal entry frequency, and user responses (Q1-Q4).
3. Evaluate pattern match against existing journal/relationship patterns:
   - "matched": Evidence in journal writing/Relationship Map clearly supports a connection to an established pattern (e.g. avoidance of confrontation, protecting surface peace).
   - "partial": Some connection exists but limited journal evidence.
   - "no_clear_match": User's response does not clearly align with existing journal pattern data.

CRITICAL SAFETY & NON-PRESCRIPTIVE RULES:
- Address the user as "you".
- Plain, direct, grounded language.
- STRICTLY DESCRIPTIVE, NOT PRESCRIPTIVE.
- NEVER recommend that the user have the conversation.
- NEVER recommend confronting someone, sending a message, contacting them, reconciling, or ending a relationship.
- NEVER give confrontation advice, relationship advice, or instructions for contacting someone.
- Always include the grounded perspective: "This exercise does not ask you to contact or confront anyone. It only makes visible what keeping it unfinished appears to be doing."
- Return ONLY valid JSON formatted according to the requested schema.`;

    const relMapFormatted = ctx.relationshipMapReference
      ? `RELATIONSHIP MAP SNAPSHOT:
- Person in Map: ${ctx.personName} (${ctx.relationshipMapReference.label || ctx.relationshipType})
- Energy Rating: ${ctx.relationshipMapReference.energy || 'Not rated'}
- Stored Feeling/Notes: ${ctx.relationshipMapReference.feeling || 'None'}
- Ambivalent Dynamic: ${ctx.relationshipMapReference.ambivalent ? 'Yes' : 'No'}`
      : `RELATIONSHIP MAP SNAPSHOT: (No prior Relationship Map record found for this person)`;

    const mentionsFormatted = ctx.relevantJournalMentions && ctx.relevantJournalMentions.length > 0
      ? ctx.relevantJournalMentions.map((m, idx) => `Mention ${idx + 1}: "${m}"`).join('\n')
      : '(No direct mentions of this person in recent journal entries)';

    const user = `EXERCISE RESPONSES:
- Person Named: ${ctx.personName}
- Relationship Type: ${ctx.relationshipType}
- Unfinished Duration / Q1 Context: ${ctx.q1}
- Q2 Direct Statement (Speaking TO person): "${ctx.q2}"
- Q3 Protection (What silence protects for self & other): ${ctx.q3}
- Q4 Cost (Cost of remaining unsaid): ${ctx.q4}

HISTORICAL & CONTEXTUAL DATA:
${relMapFormatted}
- Journal Mention Frequency: ${ctx.entryFrequency || 0} recent entries mention this person
${ctx.day30PrimaryPattern ? `- Day 30 Primary Pattern: ${ctx.day30PrimaryPattern}` : ''}

RECENT JOURNAL MENTIONS:
${mentionsFormatted}

OUTPUT JSON SCHEMA:
{
  "conversation_summary": {
    "person_name": "${ctx.personName}",
    "relationship_type": "${ctx.relationshipType}",
    "unfinished_duration": "${ctx.unfinishedDuration || 'unspecified'}"
  },
  "what_remains_unsaid": "1-2 sentence core reflection on the direct statement in Q2.",
  "what_silence_protects": {
    "self_protection": "1 sentence on self-protection identified in Q3.",
    "other_protection": "1 sentence on protection of the other person/relationship identified in Q3."
  },
  "what_it_costs": {
    "emotional_cost": "1 sentence on emotional cost.",
    "relational_cost": "1 sentence on relational cost.",
    "cognitive_cost": "1 sentence on ongoing mental energy/tension."
  },
  "pattern_match": "matched" | "partial" | "no_clear_match",
  "pattern_explanation": "2 plain sentences connecting journal evidence and Relationship Map data to this relational theme.",
  "note_of_perspective": "This exercise does not ask you to contact or confront anyone. It only makes visible what keeping it unfinished appears to be doing.",
  "ai_analysis_text": "3-4 plain, grounded sentences summarizing what this unfinished state protects and costs, without recommending any confrontation or action."
}`;

    return { system, user };
  }
}
