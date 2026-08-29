import { ModuleCatalogService } from '../src/lib/modules/moduleCatalogService';
import { ModuleContentService } from '../src/lib/modules/moduleContentService';
import { ModuleRecommendationService } from '../src/lib/modules/moduleRecommendationService';
import { MODULE_7_CONTENT } from '../src/lib/modules/content/module7Data';

async function runTests() {
  console.log('--- STARTING MODULE 7 & REGRESSION VERIFICATION ---');

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition: boolean, message: string) {
    totalTests++;
    if (condition) {
      passedTests++;
      console.log(`✓ [PASS] ${message}`);
    } else {
      console.error(`✗ [FAIL] ${message}`);
      throw new Error(`Assertion failed: ${message}`);
    }
  }

  // 1. Module 7 Catalog Validation
  console.log('\n--- 1. Catalog Tests ---');
  const m7CatalogById = await ModuleCatalogService.getModuleByIdOrSlug('M7');
  assert(!!m7CatalogById, 'M7 catalog item found by ID');
  assert(m7CatalogById?.slug === 'emotional-suppression-masculinity-norms', 'M7 slug is emotional-suppression-masculinity-norms');
  assert(m7CatalogById?.name === 'Emotional Suppression & Masculinity Norms', 'M7 name matches');
  assert(m7CatalogById?.duration_weeks === 2, 'M7 duration is 2 weeks');
  assert(m7CatalogById?.price === 499.00, 'M7 price is 499.00 INR');
  assert(m7CatalogById?.status === 'active', 'M7 status is active');

  const m7CatalogBySlug = await ModuleCatalogService.getModuleByIdOrSlug('emotional-suppression-masculinity-norms');
  assert(!!m7CatalogBySlug, 'M7 catalog item found by slug');
  assert(m7CatalogBySlug?.id === 'M7', 'Slug resolves to M7');

  // 2. Module 7 Content Service Validation
  console.log('\n--- 2. Content Service Tests ---');
  const m7ContentById = ModuleContentService.getModuleContent('M7');
  assert(!!m7ContentById, 'M7 content found by ID');
  assert(m7ContentById?.moduleId === 'M7', 'M7 content moduleId is M7');

  const m7ContentBySlug = ModuleContentService.getModuleContent('emotional-suppression-masculinity-norms');
  assert(!!m7ContentBySlug, 'M7 content found by slug');

  const allContents = ModuleContentService.getAllModuleContents();
  assert(allContents.length === 7, 'getAllModuleContents returns all 7 modules (M1-M7)');
  assert(allContents.map(c => c.moduleId).sort().join(',') === 'M1,M2,M3,M4,M5,M6,M7', 'All 7 module IDs present');

  // 3. Module 7 Structure & Content Brief
  console.log('\n--- 3. Module 7 Structure & Brief ---');
  const brief = MODULE_7_CONTENT.brief;
  assert(brief.moduleName === 'Emotional Suppression & Masculinity Norms', 'Brief module name matches');
  assert(brief.mechanisms.length === 1, 'Exactly 1 mechanism in Module 7');

  const mechA = brief.mechanisms[0];
  assert(mechA.key === 'A', 'Mechanism key is A');
  assert(mechA.name === 'Emotional Suppression & Masculinity Norms', 'Mechanism name matches');
  assert(mechA.short === 'Suppression', 'Mechanism short name is Suppression');
  assert(mechA.need === 'Authenticity, connection, permission to feel', 'Mechanism need matches');
  assert(mechA.contrast.who === 'Vikrant', 'Contrast who is Vikrant');

  // 4. Techniques Verification (A1-A4)
  console.log('\n--- 4. Technique Verification ---');
  assert(mechA.techniques.length === 4, 'Exactly 4 techniques in Mechanism A');

  const [tA1, tA2, tA3, tA4] = mechA.techniques;

  // A1: Feelings Wheel (Format A)
  assert(tA1.code === 'A1', 'Technique A1 code matches');
  assert(tA1.format === 'A', 'Technique A1 format is A');
  assert(!tA1.guardrail, 'Technique A1 has no guardrail');
  assert(tA1.name === 'Emotion-Identification Exercises Using a Feelings Wheel', 'Technique A1 name matches');

  // A2: Behavioural Experiments (Format B, Guardrailed)
  assert(tA2.code === 'A2', 'Technique A2 code matches');
  assert(tA2.format === 'B', 'Technique A2 format is B');
  assert(tA2.guardrail === true, 'Technique A2 has guardrail true');
  assert(tA2.name === 'Behavioural Experiments Testing Predicted Social Costs of Expressing Emotion', 'Technique A2 name matches');

  // A3: Values-Consistent Vulnerability (Format A)
  assert(tA3.code === 'A3', 'Technique A3 code matches');
  assert(tA3.format === 'A', 'Technique A3 format is A');
  assert(!tA3.guardrail, 'Technique A3 has no guardrail');
  assert(tA3.name === 'Acceptance of Vulnerability as Values-Consistent Action', 'Technique A3 name matches');

  // A4: Toughness Scripts (Format A)
  assert(tA4.code === 'A4', 'Technique A4 code matches');
  assert(tA4.format === 'A', 'Technique A4 format is A');
  assert(!tA4.guardrail, 'Technique A4 has no guardrail');
  assert(tA4.name === 'Externalising & Re-Authoring Conversations Questioning Internalized \'Toughness\' Scripts', 'Technique A4 name matches');

  // 5. Weeks & Touches Verification
  console.log('\n--- 5. Weeks & Touches Verification ---');
  const weeks = MODULE_7_CONTENT.weeks;
  assert(weeks.length === 2, 'Module 7 has exactly 2 weeks');

  const week1 = weeks[0];
  assert(week1.num === 1, 'Week 1 num is 1');
  assert(week1.mechanism === 'A', 'Week 1 mechanism is A');
  assert(week1.kind === 'blocked', 'Week 1 kind is blocked');
  assert(week1.retrievalCheck === null, 'Week 1 retrievalCheck is null');
  assert(week1.touches.length === 5, 'Week 1 has exactly 5 touches');
  assert(week1.touches.map(t => t.id).join(',') === 'w1t1,w1t2,w1t3,w1t4,w1t5', 'Week 1 touch IDs are w1t1-w1t5');

  const week2 = weeks[1];
  assert(week2.num === 2, 'Week 2 num is 2');
  assert(week2.mechanism === 'A', 'Week 2 mechanism is A');
  assert(week2.kind === 'technique', 'Week 2 kind is technique');
  assert(week2.retrievalCheck === null, 'Week 2 retrievalCheck is null');
  assert(week2.touches.length === 5, 'Week 2 has exactly 5 touches');
  assert(week2.touches.map(t => t.id).join(',') === 'w2t1,w2t2,w2t3,w2t4,w2t5', 'Week 2 touch IDs are w2t1-w2t5');

  const totalTouches = weeks.reduce((acc, w) => acc + w.touches.length, 0);
  assert(totalTouches === 10, 'Total touches across Module 7 is 10');

  // 6. Guardrail Details on w2t2 (A2)
  console.log('\n--- 6. Guardrail Details on w2t2 ---');
  const w2t2 = week2.touches[1];
  assert(w2t2.id === 'w2t2', 'Touch w2t2 is A2');
  assert(w2t2.guardrail === true, 'w2t2 has guardrail: true');
  assert(!!w2t2.apply.intensityPrompt, 'w2t2 has intensityPrompt');
  assert(w2t2.apply.intensityOptions?.length === 2, 'w2t2 has 2 intensityOptions');
  assert(!!w2t2.distressPrompt, 'w2t2 has distressPrompt');

  // 7. Transfer Test Spirit on w2t5
  console.log('\n--- 7. Transfer Test Spirit on w2t5 ---');
  const w2t5 = week2.touches[4];
  assert(w2t5.id === 'w2t5', 'Touch w2t5 is final touch');
  assert(w2t5.apply.scenario.includes('With nothing pre-walked this time'), 'w2t5 contains unscaffolded transfer scenario');
  assert(w2t5.apply.prompt.includes('what\'s your actual next move, and why that one'), 'w2t5 contains unscaffolded transfer prompt');

  // 8. Delayed Reference Continuity
  console.log('\n--- 8. Delayed Reference Continuity ---');
  const allTouches = weeks.flatMap(w => w.touches);
  const completedStepKeys = new Set<string>();

  allTouches.forEach(t => {
    if (t.noDelayed) {
      assert(t.id === 'w1t1', `Touch ${t.id} has noDelayed`);
    } else {
      assert(!!t.delayedRef, `Touch ${t.id} has delayedRef`);
      assert(completedStepKeys.has(t.delayedRef!), `Touch ${t.id} references existing earlier step ${t.delayedRef}`);
    }
    completedStepKeys.add(`${t.id}_apply`);
  });

  // 9. Reinforcement Bank Verification
  console.log('\n--- 9. Reinforcement Bank Verification ---');
  const bank = MODULE_7_CONTENT.reinforcementBank;
  assert(bank.length === 2, 'Reinforcement Bank has exactly 2 reflections');
  assert(bank.every(r => r.code === 'A4'), 'All reflections in bank are for technique A4');
  assert(bank.every(r => r.type === 'reflection'), 'All bank entries are reflections');

  const tools = MODULE_7_CONTENT.toolsData;
  assert(Object.keys(tools).length === 2, 'Tools data has exactly 2 tools (A1, A3)');
  assert(tools.feelings_wheel_log.code === 'A1', 'Tool feelings_wheel_log is for technique A1');
  assert(tools.feelings_wheel_log.title === 'Feelings Wheel Check-In', 'Tool title is Feelings Wheel Check-In');
  assert(tools.feelings_wheel_log.kind === 'log_single', 'Tool kind is log_single');

  assert(tools.values_vulnerability_log.code === 'A3', 'Tool values_vulnerability_log is for technique A3');
  assert(tools.values_vulnerability_log.title === 'Values-Consistent Vulnerability', 'Tool title is Values-Consistent Vulnerability');
  assert(tools.values_vulnerability_log.kind === 'log_single', 'Tool kind is log_single');

  // 10. MHPI Verification
  console.log('\n--- 10. MHPI Verification ---');
  const mhpi = MODULE_7_CONTENT.mhpiConfig;
  assert(mhpi.baselineQuestions.length === 5, '5 baseline questions');
  assert(mhpi.weeklyQuestions.length === 3, '3 weekly questions');
  assert(mhpi.endExtraQuestions.length === 1, '1 extra question at end');
  assert(mhpi.endChoice.options.length === 3, '3 options in endChoice');

  // 11. Escalation & Safety Verification
  console.log('\n--- 11. Escalation & Safety Verification ---');
  const esc = MODULE_7_CONTENT.escalationConfig;
  assert(!!esc.tier1, 'Tier 1 escalation definition present');
  assert(!!esc.tier2, 'Tier 2 escalation definition present');
  assert(!!esc.suppressionClassifierNote, 'suppressionClassifierNote present');
  assert(esc.tier1FallbackWords.length > 0, 'Tier 1 fallback words present');
  assert(esc.tier2FallbackWords.length > 0, 'Tier 2 fallback words present');

  // 12. Recommendation Service Mapping Verification
  console.log('\n--- 12. Recommendation Service Mappings ---');
  const m7Recommendations = [
    'M7-C01', 'emotional_suppression', 'emotional-suppression',
    'masculinity_norms', 'masculinity-norms', 'toughness_script',
    'toughness-script', 'vulnerability_avoidance', 'stoicism',
    'suppression', 'holding_it_in', 'unexpressed_emotions'
  ];

  m7Recommendations.forEach(concern => {
    const match = ModuleRecommendationService.mapConcernToModule(concern);
    assert(match?.moduleId === 'M7', `Concern '${concern}' correctly maps to M7`);
  });

  // 13. Full Regression Verification on Modules 1 to 6
  console.log('\n--- 13. Regression on Modules 1 to 6 ---');
  const expectedModules = [
    { id: 'M1', slug: 'self-worth-self-talk', weeks: 7, mechs: 3, price: 349.00 },
    { id: 'M2', slug: 'perfectionism-avoidance', weeks: 5, mechs: 2, price: 349.00 },
    { id: 'M3', slug: 'anxiety-worry', weeks: 9, mechs: 4, price: 499.00 },
    { id: 'M4', slug: 'mood-emotional-regulation', weeks: 7, mechs: 3, price: 349.00 },
    { id: 'M5', slug: 'identity-purpose', weeks: 5, mechs: 2, price: 499.00 },
    { id: 'M6', slug: 'trauma-past-experiences', weeks: 2, mechs: 1, price: 399.00 },
    { id: 'M7', slug: 'emotional-suppression-masculinity-norms', weeks: 2, mechs: 1, price: 499.00 }
  ];

  for (const mod of expectedModules) {
    const cat = await ModuleCatalogService.getModuleByIdOrSlug(mod.id);
    assert(!!cat, `${mod.id} catalog entry exists`);
    assert(cat?.slug === mod.slug, `${mod.id} slug matches ${mod.slug}`);
    assert(cat?.duration_weeks === mod.weeks, `${mod.id} duration matches ${mod.weeks} weeks`);
    assert(cat?.price === mod.price, `${mod.id} price matches ${mod.price}`);

    const content = ModuleContentService.getModuleContent(mod.id);
    assert(!!content, `${mod.id} content exists`);
    assert(content?.weeks.length === mod.weeks, `${mod.id} content has ${mod.weeks} weeks`);
    assert(content?.brief.mechanisms.length === mod.mechs, `${mod.id} has ${mod.mechs} mechanisms`);
  }

  console.log(`\n========================================`);
  console.log(`ALL TESTS PASSED: ${passedTests}/${totalTests}`);
  console.log(`========================================\n`);
}

runTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
