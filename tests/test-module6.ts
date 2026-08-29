import { ModuleCatalogService } from '../src/lib/modules/moduleCatalogService';
import { ModuleContentService } from '../src/lib/modules/moduleContentService';
import { ModuleRecommendationService } from '../src/lib/modules/moduleRecommendationService';
import { MODULE_6_CONTENT } from '../src/lib/modules/content/module6Data';

async function runTests() {
  console.log('--- STARTING MODULE 6 & REGRESSION VERIFICATION ---');

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

  // 1. Module 6 Catalog Validation
  console.log('\n--- 1. Catalog Tests ---');
  const m6CatalogById = await ModuleCatalogService.getModuleByIdOrSlug('M6');
  assert(!!m6CatalogById, 'M6 catalog item found by ID');
  assert(m6CatalogById?.slug === 'trauma-past-experiences', 'M6 slug is trauma-past-experiences');
  assert(m6CatalogById?.name === 'Trauma & Past Experiences', 'M6 name is Trauma & Past Experiences');
  assert(m6CatalogById?.duration_weeks === 2, 'M6 duration is 2 weeks');
  assert(m6CatalogById?.price === 399.00, 'M6 price is 399.00 INR');
  assert(m6CatalogById?.status === 'active', 'M6 status is active');

  const m6CatalogBySlug = await ModuleCatalogService.getModuleByIdOrSlug('trauma-past-experiences');
  assert(!!m6CatalogBySlug, 'M6 catalog item found by slug');
  assert(m6CatalogBySlug?.id === 'M6', 'Slug resolves to M6');

  // 2. Module 6 Content Service Validation
  console.log('\n--- 2. Content Service Tests ---');
  const m6ContentById = ModuleContentService.getModuleContent('M6');
  assert(!!m6ContentById, 'M6 content found by ID');
  assert(m6ContentById?.moduleId === 'M6', 'M6 content moduleId is M6');

  const m6ContentBySlug = ModuleContentService.getModuleContent('trauma-past-experiences');
  assert(!!m6ContentBySlug, 'M6 content found by slug');

  const allContents = ModuleContentService.getAllModuleContents();
  assert(allContents.length === 6, 'getAllModuleContents returns all 6 modules (M1-M6)');
  assert(allContents.map(c => c.moduleId).sort().join(',') === 'M1,M2,M3,M4,M5,M6', 'All 6 module IDs present');

  // 3. Module 6 Structure & Content Brief
  console.log('\n--- 3. Module 6 Structure & Brief ---');
  const brief = MODULE_6_CONTENT.brief;
  assert(brief.moduleName === 'Trauma & Past Experiences', 'Brief module name matches');
  assert(brief.mechanisms.length === 1, 'Exactly 1 mechanism in Module 6');

  const mechA = brief.mechanisms[0];
  assert(mechA.key === 'A', 'Mechanism key is A');
  assert(mechA.name === 'Trauma & Past Difficult Experiences', 'Mechanism name is Trauma & Past Difficult Experiences');
  assert(mechA.short === 'Trauma', 'Mechanism short name is Trauma');
  assert(mechA.need === 'Safety, containment, agency', 'Mechanism need is Safety, containment, agency');
  assert(mechA.contrast.who === 'Ayaan', 'Contrast who is Ayaan');

  // 4. Techniques Verification (A1-A4)
  console.log('\n--- 4. Technique Verification ---');
  assert(mechA.techniques.length === 4, 'Exactly 4 techniques in Mechanism A');

  const [tA1, tA2, tA3, tA4] = mechA.techniques;

  // A1: Titrated Grounding
  assert(tA1.code === 'A1', 'Technique A1 code matches');
  assert(tA1.format === 'B', 'Technique A1 format is B');
  assert(tA1.guardrail === true, 'Technique A1 has guardrail true');
  assert(tA1.name === 'Titrated Grounding & Body-Based Regulation', 'Technique A1 name matches');

  // A2: Narrative Re-Authoring
  assert(tA2.code === 'A2', 'Technique A2 code matches');
  assert(tA2.format === 'B', 'Technique A2 format is B');
  assert(tA2.guardrail === true, 'Technique A2 has guardrail true');
  assert(tA2.name === 'Narrative Re-Authoring to Restore Agency', 'Technique A2 name matches');

  // A3: Trauma-Focused CBT (Format C)
  assert(tA3.code === 'A3', 'Technique A3 code matches');
  assert(tA3.format === 'C', 'Technique A3 format is C (reference-only)');
  assert(!tA3.guardrail, 'Technique A3 has no guardrail (reference-only)');
  assert(tA3.name === 'Trauma Narrative Construction & Cognitive Restructuring', 'Technique A3 name matches');
  assert(!!tA3.professionalNote, 'Technique A3 has professionalNote');

  // A4: EMDR (Format C)
  assert(tA4.code === 'A4', 'Technique A4 code matches');
  assert(tA4.format === 'C', 'Technique A4 format is C (reference-only)');
  assert(!tA4.guardrail, 'Technique A4 has no guardrail (reference-only)');
  assert(tA4.name === 'EMDR (Eye Movement Desensitization & Reprocessing)', 'Technique A4 name matches');
  assert(!!tA4.professionalNote, 'Technique A4 has professionalNote');

  // 5. Weeks & Touches Verification
  console.log('\n--- 5. Weeks & Touches Verification ---');
  const weeks = MODULE_6_CONTENT.weeks;
  assert(weeks.length === 2, 'Module 6 has exactly 2 weeks');

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
  assert(week2.hasReferenceCard === true, 'Week 2 hasReferenceCard is true');
  assert(week2.touches.length === 5, 'Week 2 has exactly 5 touches');
  assert(week2.touches.map(t => t.id).join(',') === 'w2t1,w2t2,w2t3,w2t4,w2t5', 'Week 2 touch IDs are w2t1-w2t5');

  const totalTouches = weeks.reduce((acc, w) => acc + w.touches.length, 0);
  assert(totalTouches === 10, 'Total touches across Module 6 is 10');

  // 6. Guardrail Details in Week 2
  console.log('\n--- 6. Guardrail Details ---');
  const w2t1 = week2.touches[0];
  assert(w2t1.id === 'w2t1', 'Touch w2t1 is A1');
  assert(w2t1.guardrail === true, 'w2t1 has guardrail: true');
  assert(!!w2t1.apply.intensityPrompt, 'w2t1 has intensityPrompt');
  assert(w2t1.apply.intensityOptions?.length === 2, 'w2t1 has 2 intensityOptions');
  assert(!!w2t1.distressPrompt, 'w2t1 has distressPrompt');

  const w2t2 = week2.touches[1];
  assert(w2t2.id === 'w2t2', 'Touch w2t2 is A2');
  assert(w2t2.guardrail === true, 'w2t2 has guardrail: true');
  assert(!!w2t2.apply.intensityPrompt, 'w2t2 has intensityPrompt');
  assert(w2t2.apply.intensityOptions?.length === 2, 'w2t2 has 2 intensityOptions');
  assert(!!w2t2.distressPrompt, 'w2t2 has distressPrompt');

  // 7. Delayed Reference Continuity
  console.log('\n--- 7. Delayed Reference Continuity ---');
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

  // 8. Reinforcement Bank Verification
  console.log('\n--- 8. Reinforcement Bank Verification ---');
  const bank = MODULE_6_CONTENT.reinforcementBank;
  assert(bank.length === 2, 'Reinforcement Bank has exactly 2 reflections');
  assert(bank.every(r => r.code === 'A2'), 'All reflections in bank are for technique A2');
  assert(bank.every(r => r.type === 'reflection'), 'All bank entries are reflections');

  const tools = MODULE_6_CONTENT.toolsData;
  assert(Object.keys(tools).length === 1, 'Tools data has exactly 1 tool');
  assert(tools.grounding_log.code === 'A1', 'Tool grounding_log is for technique A1');
  assert(tools.grounding_log.title === 'Titrated Grounding', 'Tool title is Titrated Grounding');
  assert(tools.grounding_log.kind === 'log_single', 'Tool kind is log_single');

  // 9. MHPI Verification
  console.log('\n--- 9. MHPI Verification ---');
  const mhpi = MODULE_6_CONTENT.mhpiConfig;
  assert(mhpi.baselineQuestions.length === 5, '5 baseline questions');
  assert(mhpi.weeklyQuestions.length === 3, '3 weekly questions');
  assert(mhpi.endExtraQuestions.length === 1, '1 extra question at end');
  assert(mhpi.endChoice.options.length === 3, '3 options in endChoice');

  // 10. Escalation & Safety Verification
  console.log('\n--- 10. Escalation & Safety Verification ---');
  const esc = MODULE_6_CONTENT.escalationConfig;
  assert(!!esc.tier1, 'Tier 1 escalation definition present');
  assert(!!esc.tier2, 'Tier 2 escalation definition present');
  assert(!!esc.traumaClassifierNote, 'traumaClassifierNote present');
  assert(esc.tier1FallbackWords.length > 0, 'Tier 1 fallback words present');
  assert(esc.tier2FallbackWords.length > 0, 'Tier 2 fallback words present');

  // 11. Recommendation Service Mapping Verification
  console.log('\n--- 11. Recommendation Service Mappings ---');
  const m6Recommendations = [
    'M6-C01', 'trauma', 'past_experiences', 'past-experiences',
    'ptsd_symptoms', 'ptsd', 'hypervigilance', 'startle_response',
    'trauma_avoidance', 'flashbacks', 'past_difficult_experiences'
  ];

  m6Recommendations.forEach(concern => {
    const match = ModuleRecommendationService.mapConcernToModule(concern);
    assert(match?.moduleId === 'M6', `Concern '${concern}' correctly maps to M6`);
  });

  // 12. Full Regression Verification on Modules 1 to 5
  console.log('\n--- 12. Regression on Modules 1 to 5 ---');
  const expectedModules = [
    { id: 'M1', slug: 'self-worth-self-talk', weeks: 7, mechs: 3, price: 349.00 },
    { id: 'M2', slug: 'perfectionism-avoidance', weeks: 5, mechs: 2, price: 349.00 },
    { id: 'M3', slug: 'anxiety-worry', weeks: 9, mechs: 4, price: 499.00 },
    { id: 'M4', slug: 'mood-emotional-regulation', weeks: 7, mechs: 3, price: 349.00 },
    { id: 'M5', slug: 'identity-purpose', weeks: 5, mechs: 2, price: 499.00 },
    { id: 'M6', slug: 'trauma-past-experiences', weeks: 2, mechs: 1, price: 399.00 }
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
