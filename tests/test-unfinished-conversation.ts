import {
  UNFINISHED_CONVERSATION_DEFINITION,
  UNFINISHED_CONVERSATION_CONFIG,
  UNFINISHED_CONVERSATION_QUESTIONS
} from '../src/lib/exercises/v4/definitions/unfinishedConversationCatalog';
import { UnfinishedConversationValidator } from '../src/lib/exercises/v4/validation/unfinishedConversationValidator';
import { UnfinishedConversationPrompt } from '../src/lib/exercises/v4/ai/unfinishedConversationPrompt';
import { UnfinishedConversationWorker } from '../src/lib/exercises/v4/workers/unfinishedConversationWorker';

console.log('================================================================');
console.log('  INGRESS WITHIN — EXERCISE 10A (UNFINISHED CONVERSATION) TEST SUITE');
console.log('================================================================\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, description: string) {
  totalTests++;
  if (condition) {
    console.log(` ✓ [PASS] ${description}`);
    passedTests++;
  } else {
    console.error(` ✗ [FAIL] ${description}`);
    process.exitCode = 1;
  }
}

// --- 1. EXERCISE REGISTRATION & METADATA ---
console.log('--- 1. Exercise Registration & Metadata ---');
assert(UNFINISHED_CONVERSATION_DEFINITION.id === 'unfinished_conversation', 'Definition ID registered as "unfinished_conversation"');
assert(UNFINISHED_CONVERSATION_DEFINITION.title === 'Unfinished Conversation', 'Definition title is "Unfinished Conversation"');
assert(UNFINISHED_CONVERSATION_DEFINITION.unlock_rules?.day === 213, 'Exercise unlock day is Day 213 (Month 7)');
assert(UNFINISHED_CONVERSATION_DEFINITION.unlock_rules?.min_entries === 18, 'Exercise minimum entry requirement is 18 journal entries');
assert(UNFINISHED_CONVERSATION_CONFIG.exercise_number === '10A', 'Exercise number is "10A"');
assert(UNFINISHED_CONVERSATION_CONFIG.slug === 'unfinished-conversation', 'Exercise slug is "unfinished-conversation"');
assert(UNFINISHED_CONVERSATION_CONFIG.timing === 'Month 7', 'Catalog timing is "Month 7"');
assert(UNFINISHED_CONVERSATION_CONFIG.branch === 'A', 'Catalog branch assignment is "A"');

// --- 2. QUESTION STRUCTURE & FRAMING ---
console.log('\n--- 2. Question Structure & Framing ---');
assert(UNFINISHED_CONVERSATION_QUESTIONS.length === 4, 'Exercise 10A contains exactly 4 core questions');
assert(UNFINISHED_CONVERSATION_QUESTIONS[0].text.includes('Who is the conversation with'), 'Q1 asks who the conversation is with and duration');
assert(UNFINISHED_CONVERSATION_QUESTIONS[1].text.includes('directly to them'), 'Q2 directs user to say the thing directly to them');
assert(Boolean(UNFINISHED_CONVERSATION_QUESTIONS[1].guidance?.includes("using 'You...'")), 'Q2 guidance emphasizes speaking TO the person using "You..."');
assert(UNFINISHED_CONVERSATION_QUESTIONS[2].text.includes('protecting'), 'Q3 asks what silence is protecting for self and them');
assert(UNFINISHED_CONVERSATION_QUESTIONS[3].text.includes('cost of it remaining unsaid'), 'Q4 asks what the cost of remaining unsaid is');

// --- 3. VALIDATOR VERIFICATION ---
console.log('\n--- 3. Validator Verification ---');
const validPayload = {
  person_name: 'Maya',
  relationship_type: 'Friend',
  unfinished_duration: '1 year',
  q1: 'Maya (Friend), unfinished for 1 year',
  q2: 'You hurt me when you excluded me from the group planning without explanation.',
  q3: 'For myself: avoiding uncomfortable drama. For them: protecting current surface politeness.',
  q4: 'Ongoing emotional distance and low trust whenever we interact in public.'
};

const valSuccess = UnfinishedConversationValidator.validateAnswers(validPayload);
assert(valSuccess.valid, 'Valid 4-question payload passes validation');

const missingQ2Payload = { ...validPayload, q2: '  ' };
const valMissingQ2 = UnfinishedConversationValidator.validateAnswers(missingQ2Payload);
assert(!valMissingQ2.valid, 'Payload with missing Q2 fails validation');

// --- 4. AI PROMPT & SAFETY CONSTRAINTS ---
console.log('\n--- 4. AI Prompt & Safety Constraints ---');
const promptRes = UnfinishedConversationPrompt.buildPrompt({
  personName: validPayload.person_name,
  relationshipType: validPayload.relationship_type,
  unfinishedDuration: validPayload.unfinished_duration,
  q1: validPayload.q1,
  q2: validPayload.q2,
  q3: validPayload.q3,
  q4: validPayload.q4,
  relationshipMapReference: { label: 'Friend', energy: 'draining', ambivalent: true },
  entryFrequency: 3
});

assert(promptRes.system.includes('NEVER recommend that the user have the conversation'), 'System prompt forbids recommending contact/confrontation');
assert(promptRes.system.includes('STRICTLY DESCRIPTIVE, NOT PRESCRIPTIVE'), 'System prompt specifies descriptive non-prescriptive framing');
assert(promptRes.user.includes('Maya'), 'User prompt includes person name');
assert(promptRes.user.includes('matched'), 'User prompt includes matched/partial/no_clear_match schema');
assert(promptRes.user.includes('note_of_perspective'), 'User prompt includes note_of_perspective safety grounding field');

// --- 5. CANDIDATE FALLBACK INTEGRATION ---
console.log('\n--- 5. Candidate Fallback Integration ---');
async function testCandidateFallback() {
  const candidates = await UnfinishedConversationWorker.getRelationshipCandidates('non-existent-user-id');
  assert(Array.isArray(candidates), 'Candidates generator returns an array for non-existent user');
  assert(candidates.length === 0, 'Candidates generator returns empty array gracefully without throwing/crashing');
}

testCandidateFallback().then(() => {
  // --- 6. DATA ISOLATION & REGRESSION ---
  console.log('\n--- 6. Data Isolation & Regression ---');
  assert(UNFINISHED_CONVERSATION_DEFINITION.id !== 'six_month_assessment', 'Exercise 10A ID is distinct from Exercise 9 ID');
  assert(UNFINISHED_CONVERSATION_DEFINITION.id !== 'relationship_map', 'Exercise 10A ID is distinct from Relationship Map ID');

  console.log('\n================================================================');
  console.log(`  EXERCISE 10A TEST SUMMARY: ${passedTests} passed, ${totalTests - passedTests} failed.`);
  console.log('================================================================\n');
});
