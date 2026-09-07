import {
  RECURRING_SCENARIO_DEFINITION,
  RECURRING_SCENARIO_CONFIG,
  RECURRING_SCENARIO_PROMPTS
} from '../src/lib/exercises/v4/definitions/recurringScenarioCatalog';
import { RecurringScenarioValidator } from '../src/lib/exercises/v4/validation/recurringScenarioValidator';
import { RecurringScenarioPrompt } from '../src/lib/exercises/v4/ai/recurringScenarioPrompt';

console.log('================================================================');
console.log('  INGRESS WITHIN — RECURRING SCENARIO EXERCISE (DAY 304) TEST SUITE');
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
assert(RECURRING_SCENARIO_DEFINITION.id === 'recurring_scenario', 'Definition ID registered as "recurring_scenario"');
assert(RECURRING_SCENARIO_DEFINITION.title === 'Recurring Scenario Exercise', 'Definition title is "Recurring Scenario Exercise"');
assert(RECURRING_SCENARIO_DEFINITION.unlock_rules?.day === 304, 'Exercise unlock day is Day 304 (Month 10)');
assert(RECURRING_SCENARIO_DEFINITION.unlock_rules?.min_entries === 15, 'Exercise minimum entry requirement is 15 journal entries');
assert(RECURRING_SCENARIO_CONFIG.exercise_number === '10', 'Exercise number is "10"');
assert(RECURRING_SCENARIO_CONFIG.slug === 'recurring-scenario', 'Exercise slug is "recurring-scenario"');
assert(RECURRING_SCENARIO_CONFIG.timing === 'Month 10', 'Catalog timing is "Month 10"');

// --- 2. SENTENCE COMPLETION PROMPTS ---
console.log('\n--- 2. Sentence Completion Prompts ---');
assert(RECURRING_SCENARIO_PROMPTS.length === 4, 'Contains exactly 4 sentence completion prompts');
assert(RECURRING_SCENARIO_PROMPTS[0].stem.includes('rehearse most often'), 'Prompt 1 examines rehearsed scenarios');
assert(RECURRING_SCENARIO_PROMPTS[1].stem.includes('replay most often'), 'Prompt 2 examines replayed scenarios');
assert(RECURRING_SCENARIO_PROMPTS[2].stem.includes('inevitable'), 'Prompt 3 examines inevitable outcomes');
assert(RECURRING_SCENARIO_PROMPTS[3].stem.includes('avoid imagining entirely'), 'Prompt 4 examines avoided scenarios');

// --- 3. VALIDATOR VERIFICATION ---
console.log('\n--- 3. Validator Verification ---');
const validPayload = {
  prompt_rehearse: 'having to explain myself when someone responds abruptly',
  prompt_replay: 'the tone I used during the team review yesterday',
  prompt_inevitable: 'difficult conversations ending in distance or misunderstandings',
  prompt_avoid: 'someone welcoming my feedback with warmth and total ease'
};

const valSuccess = RecurringScenarioValidator.validateAnswers(validPayload);
assert(valSuccess.valid, 'Valid 4-prompt payload passes validation');

const invalidPayload = { ...validPayload, prompt_rehearse: 'a' };
const valFail = RecurringScenarioValidator.validateAnswers(invalidPayload);
assert(!valFail.valid, 'Prompt under 3 characters fails validation');

// --- 4. AI PROMPT & SAFETY CONSTRAINTS ---
console.log('\n--- 4. AI Prompt & Safety Constraints ---');
const promptRes = RecurringScenarioPrompt.buildPrompt({
  answers: validPayload,
  relevantJournalMentions: ['I keep thinking about how I spoke in the meeting yesterday.'],
  totalJournalEntriesCount: 18
});

assert(promptRes.system.includes('NEVER use clinical labels'), 'System prompt forbids clinical labels like catastrophizing');
assert(promptRes.system.includes('STRICTLY DESCRIPTIVE, NOT PRESCRIPTIVE'), 'System prompt specifies descriptive non-prescriptive framing');
assert(promptRes.user.includes('Rehearsed Before'), 'User prompt includes sentence 1');
assert(promptRes.user.includes('Avoided Imagining'), 'User prompt includes sentence 4');
assert(promptRes.user.includes('expectation_behaviour_connection'), 'User prompt schema includes expectation_behaviour_connection field');

// --- 5. DATA ISOLATION & REGRESSION ---
console.log('\n--- 5. Data Isolation & Regression ---');
assert(RECURRING_SCENARIO_DEFINITION.id !== 'unfinished_conversation', 'Recurring Scenario ID is distinct from Unfinished Conversation');
assert(RECURRING_SCENARIO_DEFINITION.id !== 'six_month_assessment', 'Recurring Scenario ID is distinct from 6-Month Assessment');

console.log('\n================================================================');
console.log(`  RECURRING SCENARIO TEST SUMMARY: ${passedTests} passed, ${totalTests - passedTests} failed.`);
console.log('================================================================\n');
