import { ModuleCatalogService } from '../src/lib/modules/moduleCatalogService';
import { ModuleContentService } from '../src/lib/modules/moduleContentService';
import { ModuleRecommendationService } from '../src/lib/modules/moduleRecommendationService';
import { MODULE_9_CONTENT } from '../src/lib/modules/content/module9Data';

async function runTests() {
  console.log('--- STARTING MODULE 9 & REGRESSION VERIFICATION ---');

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

  // 1. Module 9 Catalog Validation
  console.log('\n--- 1. Catalog Tests ---');
  const m9CatalogById = await ModuleCatalogService.getModuleByIdOrSlug('M9');
  assert(!!m9CatalogById, 'M9 catalog item found by ID');
  assert(m9CatalogById?.slug === 'judged-compared', 'M9 slug is judged-compared');
  assert(m9CatalogById?.name === 'Judged & Compared', 'M9 name matches');
  assert(m9CatalogById?.duration_weeks === 7, 'M9 duration is 7 weeks');
  assert(m9CatalogById?.price === 349.00, 'M9 price is 349.00 INR');
  assert(m9CatalogById?.status === 'active', 'M9 status is active');
  assert(m9CatalogById?.taxonomy_concerns.length === 3, 'M9 has 3 taxonomy concerns');

  const m9CatalogBySlug = await ModuleCatalogService.getModuleByIdOrSlug('judged-compared');
  assert(!!m9CatalogBySlug, 'M9 catalog item found by slug');
  assert(m9CatalogBySlug?.id === 'M9', 'Slug resolves to M9');

  // 2. Module 9 Content Service Validation
  console.log('\n--- 2. Content Service Tests ---');
  const m9ContentById = ModuleContentService.getModuleContent('M9');
  assert(!!m9ContentById, 'M9 content found by ID');
  assert(m9ContentById?.moduleId === 'M9', 'M9 content moduleId is M9');

  const m9ContentBySlug = ModuleContentService.getModuleContent('judged-compared');
  assert(!!m9ContentBySlug, 'M9 content found by slug');

  const allContents = ModuleContentService.getAllModuleContents();
  assert(allContents.length === 9, 'getAllModuleContents returns all 9 modules (M1-M9)');
  assert(allContents.map(c => c.moduleId).sort().join(',') === 'M1,M2,M3,M4,M5,M6,M7,M8,M9', 'All 9 module IDs present');

  // 3. Module 9 Structure & Content Brief
  console.log('\n--- 3. Module 9 Structure & Brief ---');
  const brief = MODULE_9_CONTENT.brief;
  assert(brief.moduleName === 'Judged & Compared', 'Brief module name matches');
  assert(brief.mechanisms.length === 3, 'Exactly 3 mechanisms in Module 9');

  const [mechaA, mechaB, mechaC] = brief.mechanisms;

  // Mechanism A: Constant Criticism
  assert(mechaA.key === 'A', 'Mechanism A key matches');
  assert(mechaA.name === 'Constant Criticism', 'Mechanism A name matches');
  assert(mechaA.short === 'Criticism', 'Mechanism A short name matches');
  assert(mechaA.techniques.length === 4, 'Mechanism A has 4 techniques');

  // Mechanism B: Comparison with Relatives
  assert(mechaB.key === 'B', 'Mechanism B key matches');
  assert(mechaB.name === 'Comparison with Relatives', 'Mechanism B name matches');
  assert(mechaB.short === 'Comparison', 'Mechanism B short name matches');
  assert(mechaB.techniques.length === 3, 'Mechanism B has 3 techniques');

  // Mechanism C: High Expectations to Succeed
  assert(mechaC.key === 'C', 'Mechanism C key matches');
  assert(mechaC.name === 'High Expectations to Succeed', 'Mechanism C name matches');
  assert(mechaC.short === 'Expectations', 'Mechanism C short name matches');
  assert(mechaC.techniques.length === 3, 'Mechanism C has 3 techniques');

  const allTechniques = brief.mechanisms.flatMap(m => m.techniques);
  assert(allTechniques.length === 10, 'Total techniques across M9 is exactly 10');
  assert(allTechniques.every(t => t.format === 'A'), 'All 10 techniques are Format A');
  assert(allTechniques.every(t => !t.guardrail), 'Zero techniques have guardrail: true');

  // 4. Source Attribution Audit
  console.log('\n--- 4. Source Attribution Audit ---');
  const techMap = Object.fromEntries(allTechniques.map(t => [t.code, t]));
  assert(techMap['A1'].source.includes('Beck'), 'A1 source references Beck');
  assert(techMap['A2'].source.includes('Gilbert'), 'A2 source references Gilbert');
  assert(techMap['A3'].source.includes('Bower') || techMap['A3'].source.includes('Salter'), 'A3 source references Bower & Bower / Salter');
  assert(techMap['A4'].source.includes('Wolpe'), 'A4 source references Wolpe');
  assert(techMap['B1'].source.includes('Beck'), 'B1 source references Beck');
  assert(techMap['B2'].source.includes('Neff'), 'B2 source references Neff');
  assert(techMap['B3'].source.includes('Festinger'), 'B3 source references Festinger');
  assert(techMap['C1'].source.includes('Wilson') || techMap['C1'].source.includes('Lundgren'), 'C1 source references Wilson & Lundgren');
  assert(techMap['C2'].source.includes('Ellis'), 'C2 source references Ellis');
  assert(techMap['C3'].source.includes('Peterson') || techMap['C3'].source.includes('Seligman'), 'C3 source references Peterson & Seligman');

  // 5. Weeks & Touches Verification
  console.log('\n--- 5. Weeks & Touches Verification ---');
  const weeks = MODULE_9_CONTENT.weeks;
  assert(weeks.length === 7, 'Module 9 has exactly 7 weeks');

  // Weeks 1-3: Understanding
  assert(weeks[0].kind === 'blocked' && weeks[0].mechanism === 'A', 'Week 1 is blocked Mechanism A');
  assert(weeks[1].kind === 'blocked' && weeks[1].mechanism === 'B', 'Week 2 is blocked Mechanism B');
  assert(weeks[2].kind === 'blocked' && weeks[2].mechanism === 'C', 'Week 3 is blocked Mechanism C');

  // Weeks 4-6: Technique
  assert(weeks[3].kind === 'technique' && weeks[3].mechanism === 'A', 'Week 4 is technique Mechanism A');
  assert(weeks[4].kind === 'technique' && weeks[4].mechanism === 'B', 'Week 5 is technique Mechanism B');
  assert(weeks[5].kind === 'technique' && weeks[5].mechanism === 'C', 'Week 6 is technique Mechanism C');

  // Week 7: Integration
  assert(weeks[6].kind === 'integration', 'Week 7 is integration');

  // Touches per week: 5 touches each = 35 total
  weeks.forEach((w, idx) => {
    assert(w.touches.length === 5, `Week ${idx + 1} has exactly 5 touches`);
  });
  const totalTouches = weeks.reduce((acc, w) => acc + w.touches.length, 0);
  assert(totalTouches === 35, 'Total touches across Module 9 is 35');

  // 6. Retrieval Checks Verification (Weeks 4 and 7)
  console.log('\n--- 6. Retrieval Checks ---');
  assert(weeks[0].retrievalCheck === null, 'Week 1 retrievalCheck is null');
  assert(weeks[1].retrievalCheck === null, 'Week 2 retrievalCheck is null');
  assert(weeks[2].retrievalCheck === null, 'Week 3 retrievalCheck is null');
  assert(weeks[3].retrievalCheck !== null, 'Week 4 has retrievalCheck');
  assert(weeks[4].retrievalCheck === null, 'Week 5 retrievalCheck is null');
  assert(weeks[5].retrievalCheck === null, 'Week 6 retrievalCheck is null');
  assert(weeks[6].retrievalCheck !== null, 'Week 7 has retrievalCheck');

  // 7. Transfer Test Spirit on w7t5
  console.log('\n--- 7. Transfer Test on w7t5 ---');
  const w7t5 = weeks[6].touches[4];
  assert(w7t5.id === 'w7t5', 'Touch w7t5 is final touch');
  assert(w7t5.apply.scenario.includes('With nothing pre-walked this time'), 'w7t5 contains unscaffolded transfer scenario');
  assert(w7t5.apply.prompt.includes('which of the ten tools') || w7t5.apply.prompt.includes('next move'), 'w7t5 contains unscaffolded transfer prompt');

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
  const bank = MODULE_9_CONTENT.reinforcementBank;
  assert(bank.length === 10, 'Reinforcement Bank has exactly 10 reflection reps (5 techniques × 2 reps)');
  const reflectionCodes = Array.from(new Set(bank.map(r => r.code))).sort();
  assert(reflectionCodes.join(',') === 'A1,A3,B1,C1,C2', 'Reflections bank contains exactly A1, A3, B1, C1, C2');

  const tools = MODULE_9_CONTENT.toolsData;
  const toolCodes = Object.values(tools).map((t: any) => t.code).sort();
  assert(toolCodes.length === 5, 'Tools data has exactly 5 tools');
  assert(toolCodes.join(',') === 'A2,A4,B2,B3,C3', 'Tools data contains exactly A2, A4, B2, B3, C3');

  // Check no overlapping technique between Reflections and Tools
  const allBankCodes = [...reflectionCodes, ...toolCodes].sort();
  assert(allBankCodes.join(',') === 'A1,A2,A3,A4,B1,B2,B3,C1,C2,C3', 'All 10 techniques accounted for with zero duplicates in bank');

  // 10. MHPI Verification
  console.log('\n--- 10. MHPI Verification ---');
  const mhpi = MODULE_9_CONTENT.mhpiConfig;
  assert(mhpi.baselineQuestions.length === 5, '5 baseline questions');
  assert(mhpi.weeklyQuestions.length === 3, '3 weekly questions');
  assert(mhpi.endExtraQuestions.length === 1, '1 extra question at end');
  assert(mhpi.endChoice.options.length === 3, '3 options in endChoice');

  // 11. Escalation & Safety Verification
  console.log('\n--- 11. Escalation & Safety Verification ---');
  const esc = MODULE_9_CONTENT.escalationConfig;
  assert(!!esc.tier1, 'Tier 1 escalation definition present');
  assert(!!esc.tier2, 'Tier 2 escalation definition present');
  assert(esc.tier1FallbackWords.length > 0, 'Tier 1 fallback words present');
  assert(esc.tier2FallbackWords.length > 0, 'Tier 2 fallback words present');

  // 12. Recommendation Service Mapping Verification
  console.log('\n--- 12. Recommendation Service Mappings ---');
  const m9Recommendations = [
    'M9-C01', 'criticism', 'family_criticism', 'family-criticism',
    'constant_criticism', 'constant-criticism', 'being_judged',
    'M9-C02', 'comparison_relatives', 'relative_comparison', 'family_comparison',
    'M9-C03', 'high_expectations', 'pressure_to_succeed', 'achievement_pressure'
  ];

  m9Recommendations.forEach(concern => {
    const match = ModuleRecommendationService.mapConcernToModule(concern);
    assert(match?.moduleId === 'M9', `Concern '${concern}' correctly maps to M9`);
  });

  // 13. Full Regression Verification on Modules 1 to 8
  console.log('\n--- 13. Regression on Modules 1 to 8 ---');
  const expectedModules = [
    { id: 'M1', slug: 'self-worth-self-talk', weeks: 7, mechs: 3, price: 349.00 },
    { id: 'M2', slug: 'perfectionism-avoidance', weeks: 5, mechs: 2, price: 349.00 },
    { id: 'M3', slug: 'anxiety-worry', weeks: 9, mechs: 4, price: 499.00 },
    { id: 'M4', slug: 'mood-emotional-regulation', weeks: 7, mechs: 3, price: 349.00 },
    { id: 'M5', slug: 'identity-purpose', weeks: 5, mechs: 2, price: 499.00 },
    { id: 'M6', slug: 'trauma-past-experiences', weeks: 2, mechs: 1, price: 399.00 },
    { id: 'M7', slug: 'emotional-suppression-masculinity-norms', weeks: 2, mechs: 1, price: 499.00 },
    { id: 'M8', slug: 'neurodivergence-adult-diagnosis', weeks: 2, mechs: 1, price: 599.00 },
    { id: 'M9', slug: 'judged-compared', weeks: 7, mechs: 3, price: 349.00 }
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
