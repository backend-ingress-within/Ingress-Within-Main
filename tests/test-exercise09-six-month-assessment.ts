import {
  SIX_MONTH_ASSESSMENT_DEFINITION,
  SIX_MONTH_ASSESSMENT_CONFIG,
  EXERCISE_9_BASE_QUESTIONS,
  EXERCISE_9_BRANCH_Q6,
  EXERCISE_9_UNIVERSAL_Q7,
  getExercise9Questions
} from '../src/lib/exercises/v4/definitions/sixMonthAssessmentCatalog';
import { SixMonthAssessmentValidator } from '../src/lib/exercises/v4/validation/sixMonthAssessmentValidator';
import { SixMonthAssessmentPrompt } from '../src/lib/exercises/v4/ai/sixMonthAssessmentPrompt';
import { EXERCISE_3_QUESTIONS } from '../src/components/exercise/v4/Exercise3Flow';

console.log('================================================================');
console.log('  INGRESS WITHIN — EXERCISE 9 (6-MONTH SELF-ASSESSMENT) TEST SUITE');
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
assert(SIX_MONTH_ASSESSMENT_DEFINITION.id === 'six_month_assessment', 'Definition ID registered as "six_month_assessment"');
assert(SIX_MONTH_ASSESSMENT_DEFINITION.title === '6-Month Self-Assessment', 'Definition title is "6-Month Self-Assessment"');
assert(SIX_MONTH_ASSESSMENT_DEFINITION.unlock_rules?.day === 183, 'Exercise unlock day is Day 183 (Month 6)');
assert(SIX_MONTH_ASSESSMENT_DEFINITION.unlock_rules?.min_entries === 20, 'Exercise minimum entry requirement is 20 journal entries');
assert(SIX_MONTH_ASSESSMENT_CONFIG.timing === 'Month 6', 'Catalog timing configuration is "Month 6"');
assert(SIX_MONTH_ASSESSMENT_CONFIG.type === 'Anchor', 'Catalog type is "Anchor"');

// --- 2. QUESTION STRUCTURE & BASELINE ALIGNMENT ---
console.log('\n--- 2. Question Structure & Baseline Alignment ---');
assert(EXERCISE_9_BASE_QUESTIONS.length === 5, 'Exercise 9 base questions contains exactly 5 core questions');
assert(EXERCISE_9_BASE_QUESTIONS[0].text === EXERCISE_3_QUESTIONS[0].text, 'Q1 text matches Exercise 3 baseline Q1 exactly');
assert(EXERCISE_9_BASE_QUESTIONS[1].text === EXERCISE_3_QUESTIONS[1].text, 'Q2 text matches Exercise 3 baseline Q2 exactly');
assert(EXERCISE_9_BASE_QUESTIONS[2].text === EXERCISE_3_QUESTIONS[2].text, 'Q3 text matches Exercise 3 baseline Q3 exactly');
assert(EXERCISE_9_BASE_QUESTIONS[3].text === EXERCISE_3_QUESTIONS[3].text, 'Q4 text matches Exercise 3 baseline Q4 exactly');
assert(EXERCISE_9_BASE_QUESTIONS[4].text === EXERCISE_3_QUESTIONS[4].text, 'Q5 text matches Exercise 3 baseline Q5 exactly');

// --- 3. BRANCH RESOLUTION (Q6) ---
console.log('\n--- 3. Branch Resolution (Q6) ---');
const branchAQuestions = getExercise9Questions('A');
const branchBQuestions = getExercise9Questions('B');
const branchCQuestions = getExercise9Questions('C');
const branchDQuestions = getExercise9Questions('D');

assert(branchAQuestions.length === 7, 'Branch A yields exactly 7 total questions');
assert(branchBQuestions.length === 7, 'Branch B yields exactly 7 total questions');
assert(branchCQuestions.length === 7, 'Branch C yields exactly 7 total questions');
assert(branchDQuestions.length === 7, 'Branch D yields exactly 7 total questions');

assert(branchAQuestions[5].text.includes('pattern identified in your Day 30 report'), 'Branch A Q6 targets unchanged Day 30 pattern rigidity');
assert(branchBQuestions[5].text.includes('chosen in the past 6 months'), 'Branch B Q6 targets choice under low self-agency');
assert(branchCQuestions[5].text.includes('most inconvenient'), 'Branch C Q6 targets emotional suppression profile');
assert(branchDQuestions[5].text.includes('felt things less intensely'), 'Branch D Q6 targets high intensity emotional profile');

assert(branchAQuestions[6].text === EXERCISE_9_UNIVERSAL_Q7.text, 'Branch A Q7 matches universal Q7 prompt');
assert(branchDQuestions[6].text === EXERCISE_9_UNIVERSAL_Q7.text, 'Branch D Q7 matches universal Q7 prompt');

// --- 4. VALIDATOR VERIFICATION ---
console.log('\n--- 4. Validator Verification ---');
const validPayload = {
  q1: 'In the last three weeks, when things felt difficult, I reached out to a trusted friend instead of withdrawing.',
  q2: 'I had a tension with my colleague regarding deadlines and addressed it directly in a calm meeting.',
  q3: 'I keep meaning to have a conversation with my brother about shared family responsibilities.',
  q4: 'I prioritized my own need for rest and boundaries while remaining supportive of my partner.',
  q5: 'I would change my tendency to overthink before acting, and what stops me is fear of making mistakes.',
  q6: 'The pattern of overworking feels most unchanged; I need clearer boundaries around working hours.',
  q7: 'I think I am still not seeing clearly how much I take on other people\'s emotional expectations.'
};

const valSuccess = SixMonthAssessmentValidator.validateAnswers(validPayload);
assert(valSuccess.valid, 'Valid 7-question payload passes validation');

const shortTextPayload = { ...validPayload, q1: 'Too short.' };
const valShort = SixMonthAssessmentValidator.validateAnswers(shortTextPayload);
assert(!valShort.valid, 'Payload with response < 20 characters fails validation');
assert(valShort.errors.some(e => e.includes('Question 1 requires at least 20 characters')), 'Validation error message mentions Question 1 minimum length');

const missingQ7Payload = { ...validPayload, q7: '   ' };
const valMissing = SixMonthAssessmentValidator.validateAnswers(missingQ7Payload);
assert(!valMissing.valid, 'Payload with missing Q7 fails validation');

// --- 5. AI PROMPT GENERATION ---
console.log('\n--- 5. AI Prompt Generation ---');
const promptRes = SixMonthAssessmentPrompt.buildPrompt({
  q1: validPayload.q1,
  q2: validPayload.q2,
  q3: validPayload.q3,
  q4: validPayload.q4,
  q5: validPayload.q5,
  q6: validPayload.q6,
  q7: validPayload.q7,
  branchCode: 'A',
  q6PromptText: EXERCISE_9_BRANCH_Q6['A'].text,
  ex03Baseline: {
    q1: 'I withdrew and stayed silent for days.',
    q2: 'I avoided the conflict completely.',
    q3: 'I kept meaning to speak up but did not.',
    q4: 'I prioritized everyone else\'s needs first.',
    q5: 'I wanted to stop avoiding hard conversations.',
    summary: 'Baseline self-perception snapshot recorded on Day 24.'
  },
  journalEntries: ['Felt overwhelmed at work today.', 'Had a good conversation about boundaries.']
});

assert(promptRes.system.includes('Address the user as "you"'), 'System prompt specifies "you" addressing');
assert(promptRes.system.includes('NEVER manufacture improvement'), 'System prompt enforces no manufactured praise rule');
assert(promptRes.user.includes('User Branch: Branch A'), 'User prompt includes Branch A identifier');
assert(promptRes.user.includes('I withdrew and stayed silent for days.'), 'User prompt includes Exercise 3 Day 24 baseline comparison text');
assert(promptRes.user.includes('self_description_change_score'), 'User prompt requires structured self_description_change_score output');

// --- 6. DATA LINEAGE & ISOLATION ---
console.log('\n--- 6. Data Lineage & Isolation ---');
assert(SIX_MONTH_ASSESSMENT_DEFINITION.id !== 'exercise_3', 'Exercise 9 ID is distinct from Exercise 3 ID');
assert(EXERCISE_3_QUESTIONS[0].text === EXERCISE_9_BASE_QUESTIONS[0].text, 'Day 24 questions are reused without modifying Exercise 3 schema');

console.log('\n================================================================');
console.log(`  EXERCISE 9 TEST SUMMARY: ${passedTests} passed, ${totalTests - passedTests} failed.`);
console.log('================================================================\n');
