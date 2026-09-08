import {
  YEAR_END_PORTRAIT_DEFINITION,
  YEAR_END_PORTRAIT_CONFIG,
  YEAR_END_ANCHORS,
  ANCHOR_JUDGMENT_OPTIONS,
  UNIVERSAL_CLOSER_QUESTION,
  SYNTHESIS_QUESTIONS
} from '../src/lib/exercises/v4/definitions/yearEndPortraitCatalog';
import { YearEndPortraitPrompt } from '../src/lib/exercises/v4/ai/yearEndPortraitPrompt';

async function runTests() {
  console.log('--- Testing Year-End Self-Portrait (Exercise 15) ---');
  let passed = 0;
  let total = 0;

  function assert(condition: boolean, msg: string) {
    total++;
    if (condition) {
      console.log(`[PASS] ${msg}`);
      passed++;
    } else {
      console.error(`[FAIL] ${msg}`);
      process.exitCode = 1;
    }
  }

  // 1. Definition tests
  assert(YEAR_END_PORTRAIT_DEFINITION.id === 'year_end_portrait', 'Definition ID is year_end_portrait');
  assert(YEAR_END_PORTRAIT_DEFINITION.unlock_rules?.day === 365, 'Unlock rule is Day 365');
  assert(YEAR_END_PORTRAIT_DEFINITION.cycle === 12, 'Cycle is 12 (Month 12)');
  assert(YEAR_END_PORTRAIT_DEFINITION.title === 'Year-End Self-Portrait', 'Title is Year-End Self-Portrait');
  assert(YEAR_END_PORTRAIT_CONFIG.slug === 'year-end-portrait', 'Config slug matches');

  // 2. 8 Anchors tests
  assert(YEAR_END_ANCHORS.length === 8, 'Exactly 8 anchors defined');
  const expectedTitles = [
    'How you saw yourself',
    'What mattered most',
    'Who drained your energy',
    'Who gave you energy',
    'Your most consistent signal',
    'What you were avoiding',
    'What a pattern was costing you',
    'Where a pattern showed up'
  ];
  YEAR_END_ANCHORS.forEach((anchor, idx) => {
    assert(anchor.categoryNumber === idx + 1, `Anchor ${idx + 1} category number is ${idx + 1}`);
    assert(anchor.title === expectedTitles[idx], `Anchor ${idx + 1} title matches '${expectedTitles[idx]}'`);
    assert(Boolean(anchor.factPrompt && anchor.judgmentPrompt), `Anchor ${idx + 1} has fact and judgment prompts`);
  });

  // 3. Anchor judgment options
  assert(ANCHOR_JUDGMENT_OPTIONS.length === 3, 'Exactly 3 judgment options');
  const optionValues = ANCHOR_JUDGMENT_OPTIONS.map(o => o.value);
  assert(optionValues.includes('still_true'), 'Contains still_true option');
  assert(optionValues.includes('changed'), 'Contains changed option');
  assert(optionValues.includes('complicated'), 'Contains complicated option');

  // 4. Universal Closer Question
  assert(UNIVERSAL_CLOSER_QUESTION.id === 'universal_closer', 'Universal closer ID is universal_closer');
  assert(
    UNIVERSAL_CLOSER_QUESTION.prompt === "Looking back, what do you think you're still not seeing clearly about yourself?",
    'Universal closer prompt matches verbatim'
  );

  // 5. 5 Synthesis Questions
  assert(SYNTHESIS_QUESTIONS.length === 5, 'Exactly 5 synthesis questions');
  assert(
    SYNTHESIS_QUESTIONS[0].prompt === 'Who were you emotionally at the start of this year — in one honest sentence?',
    'Synthesis Q1 prompt matches verbatim'
  );
  assert(
    SYNTHESIS_QUESTIONS[1].prompt === "What is the single most important thing you've understood about yourself in the past 12 months?",
    'Synthesis Q2 prompt matches verbatim'
  );
  assert(
    SYNTHESIS_QUESTIONS[2].prompt === 'What pattern has been most resistant to change, despite your awareness of it?',
    'Synthesis Q3 prompt matches verbatim'
  );
  assert(
    SYNTHESIS_QUESTIONS[3].prompt === "What are you ready to examine that you weren't ready for at the start of the year?",
    'Synthesis Q4 prompt matches verbatim'
  );
  assert(
    SYNTHESIS_QUESTIONS[4].prompt === 'What would you tell someone standing where you were a year ago?',
    'Synthesis Q5 prompt matches verbatim'
  );

  // 6. AI Prompt Builder tests
  const sampleAnchors = {
    anchor_1: { anchor_id: 'anchor_1', judgment: 'still_true' as const, note: 'Still cautious' },
    anchor_2: { anchor_id: 'anchor_2', judgment: 'changed' as const, note: 'Priorities shifted to health' },
    anchor_3: { anchor_id: 'anchor_3', judgment: 'changed' as const, note: 'Set firmer boundaries' },
    anchor_4: { anchor_id: 'anchor_4', judgment: 'still_true' as const, note: 'Old friends still ground me' },
    anchor_5: { anchor_id: 'anchor_5', judgment: 'complicated' as const, note: 'Chest tension persists' },
    anchor_6: { anchor_id: 'anchor_6', judgment: 'changed' as const, note: 'No longer avoiding difficult career talks' },
    anchor_7: { anchor_id: 'anchor_7', judgment: 'changed' as const, note: 'Reduced emotional exhaustion' },
    anchor_8: { anchor_id: 'anchor_8', judgment: 'complicated' as const, note: 'Triggers still arise in family dinners' }
  };

  const sampleSynthesis = {
    q1: 'I was guarded and constantly bracing for conflict.',
    q2: 'My reactions were protective mechanisms rather than fundamental flaws.',
    q3: 'Over-explaining myself whenever there is tension.',
    q4: 'My underlying fear of disappointing authority figures.',
    q5: 'Slow down and let others have their reactions without rushing to fix them.'
  };

  const promptResult = YearEndPortraitPrompt.buildPrompt({
    anchors: sampleAnchors,
    closerReflection: 'I still struggle to see when I am withdrawing under stress.',
    synthesis: sampleSynthesis
  });

  assert(Boolean(promptResult.system), 'System prompt generated');
  assert(Boolean(promptResult.user), 'User prompt generated');
  assert(promptResult.system.includes('DO NOT use clinical diagnosis'), 'System prompt enforces non-clinical mandate');
  assert(promptResult.user.includes('Anchor 1 (How you saw yourself'), 'User prompt contains Anchor 1');
  assert(promptResult.user.includes('Anchor 8 (Where a pattern showed up'), 'User prompt contains Anchor 8');
  assert(promptResult.user.includes('I was guarded and constantly bracing for conflict.'), 'User prompt contains Synthesis Q1');
  assert(promptResult.user.includes('part1_ground'), 'User prompt includes part1_ground in schema');
  assert(promptResult.user.includes('part2_shift'), 'User prompt includes part2_shift in schema');
  assert(promptResult.user.includes('part3_motion'), 'User prompt includes part3_motion in schema');

  console.log(`
Results: ${passed} / ${total} tests passed.`);
}

runTests().catch(err => {
  console.error(err);
  process.exit(1);
});
