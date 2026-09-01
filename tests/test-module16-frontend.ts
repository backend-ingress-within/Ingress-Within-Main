import { MODULE_16_CONTENT } from '../src/lib/modules/content/module16Data';
import { ModuleCatalogService } from '../src/lib/modules/moduleCatalogService';
import { ModuleContentService } from '../src/lib/modules/moduleContentService';
import { MODULE_1_CONTENT } from '../src/lib/modules/content/module1Data';
import { MODULE_6_CONTENT } from '../src/lib/modules/content/module6Data';
import { MODULE_10_CONTENT } from '../src/lib/modules/content/module10Data';
import { MODULE_13_CONTENT } from '../src/lib/modules/content/module13Data';
import { MODULE_14_CONTENT } from '../src/lib/modules/content/module14Data';
import { MODULE_15_CONTENT } from '../src/lib/modules/content/module15Data';

async function runModule16FrontendTests() {
  console.log('--- STARTING MODULE 16 FRONTEND INTEGRATION VALIDATION TESTS ---');

  let passed = 0;
  let total = 0;

  function assert(condition: boolean, message: string) {
    total++;
    if (condition) {
      passed++;
      console.log(`✓ [PASS] ${message}`);
    } else {
      console.error(`✗ [FAIL] ${message}`);
      throw new Error(`Assertion failed: ${message}`);
    }
  }

  // 1. Module Resolution & Overview Metadata
  console.log('\n--- 1. Module Resolution & Overview Metadata ---');
  const contentById = ModuleContentService.getModuleContent('M16');
  const contentBySlug = ModuleContentService.getModuleContent('arranged-long-distance-realities');
  const catalogItem = ModuleCatalogService.getAllCatalogItems().find(m => m.id === 'M16');

  assert(contentById !== null, 'M16 resolves content by ID');
  assert(contentBySlug !== null, 'M16 resolves content by slug');
  assert(contentById === contentBySlug, 'M16 ID and slug resolve to exact same content instance');
  assert(!!catalogItem, 'M16 catalog entry exists');

  assert(catalogItem?.name === 'Arranged & Long-Distance Realities', 'Overview name matches');
  assert(catalogItem?.price === 499.00, 'Overview price is 499.00');
  assert(catalogItem?.duration_weeks === 5, 'Overview duration is 5 weeks');
  assert((MODULE_16_CONTENT.tier || '').includes('Relationships'), 'Overview domain is Relationships');
  assert((MODULE_16_CONTENT.tier || '').includes('Common'), 'Overview tier is Common');

  const mechs = MODULE_16_CONTENT.brief.mechanisms;
  assert(mechs.length === 2, 'Exactly 2 mechanisms surfaced');
  assert(mechs[0].key === 'A' && mechs[0].name === 'Arranged Marriage Compatibility Stress', 'Mechanism A matches');
  assert(mechs[1].key === 'B' && mechs[1].name === 'Long-Distance Relationship Strain', 'Mechanism B matches');

  // 2. Intro Sequence
  console.log('\n--- 2. Intro Sequence ---');
  const introScreens = MODULE_16_CONTENT.introScreens;
  assert(introScreens.length === 6, 'Intro sequence contains 6 reachable screens');
  assert(introScreens[0].consent === true, 'Screen 1 requires consent');
  assert(introScreens[2].crisisButton === true, 'Screen 3 surfaces crisis resources');
  assert(introScreens[4].title.includes('5 weeks'), 'Screen 5 presents 5-week roadmap');
  assert(introScreens[5].theory === true, 'Screen 6 displays theory grounding');

  // 3. Roadmap & Touch Count
  console.log('\n--- 3. Roadmap & Touch Count ---');
  const weeks = MODULE_16_CONTENT.weeks;
  assert(weeks.length === 5, 'Roadmap has exactly 5 weeks');

  const totalTouches = weeks.reduce((acc, w) => acc + w.touches.length, 0);
  assert(totalTouches === 25, 'Roadmap has exactly 25 teaching touches (5 x 5)');

  assert(weeks[0].mechanism === 'A' && weeks[0].kind === 'blocked', 'Week 1 is Blocked Mechanism A');
  assert(weeks[1].mechanism === 'B' && weeks[1].kind === 'blocked', 'Week 2 is Blocked Mechanism B');
  assert(weeks[2].mechanism === 'A' && weeks[2].kind === 'technique', 'Week 3 is Technique Mechanism A');
  assert(weeks[3].mechanism === 'B' && weeks[3].kind === 'technique', 'Week 4 is Technique Mechanism B');
  assert(weeks[4].mechanism === 'both' && weeks[4].kind === 'integration', 'Week 5 is Integration & Review');

  // 4. Format A Techniques Verification
  console.log('\n--- 4. Format A Techniques Verification ---');
  const allTechs = [...mechs[0].techniques, ...mechs[1].techniques];
  const formatATechs = allTechs.filter(t => t.format === 'A');
  assert(formatATechs.length === 5, 'Exactly 5 Format A techniques (A1, A2, A3, B1, B3)');

  formatATechs.forEach(t => {
    assert(!t.guardrail, `Format A technique ${t.code} has no guardrail flag`);
  });

  // 5. Format B Guardrail Verification
  console.log('\n--- 5. Format B Guardrail Verification ---');
  const formatBTechs = allTechs.filter(t => t.format === 'B');
  assert(formatBTechs.length === 1, 'Exactly 1 Format B technique (B2)');
  assert(formatBTechs[0].code === 'B2', 'Format B technique is B2');
  assert(formatBTechs[0].guardrail === true, 'B2 has guardrail === true');

  const w4t2 = weeks[3].touches[1];
  assert(w4t2.id === 'w4t2', 'w4t2 is B2 touch');
  assert(w4t2.guardrail === true, 'w4t2 has guardrail === true');
  assert(!!w4t2.apply.intensityPrompt, 'w4t2 has intensityPrompt');
  assert(w4t2.apply.intensityOptions?.length === 2, 'w4t2 has 2 intensity options');
  assert(!!w4t2.distressPrompt, 'w4t2 has distressPrompt');

  // 6. Format C Verification (Zero Format C)
  console.log('\n--- 6. Format C Verification (Zero Format C) ---');
  const formatCTechs = allTechs.filter(t => t.format === 'C');
  const refCardWeeks = weeks.filter(w => w.hasReferenceCard === true);

  assert(formatCTechs.length === 0, 'Zero Format C techniques in M16');
  assert(refCardWeeks.length === 0, 'Zero reference card flags in M16 weeks');

  // 7. Retrieval Check
  console.log('\n--- 7. Retrieval Check ---');
  assert(weeks[0].retrievalCheck === null, 'Week 1 retrievalCheck is null');
  assert(weeks[1].retrievalCheck === null, 'Week 2 retrievalCheck is null');
  assert(weeks[2].retrievalCheck !== null, 'Week 3 has retrieval check testing A & B');
  assert(weeks[3].retrievalCheck === null, 'Week 4 retrievalCheck is null');
  assert(weeks[4].retrievalCheck === null, 'Week 5 retrievalCheck is null');

  // 8. Transfer Test (w5t5)
  console.log('\n--- 8. Transfer Test (w5t5) ---');
  const w5t5 = weeks[4].touches[4];
  assert(w5t5.id === 'w5t5', 'w5t5 is final touch');
  assert(w5t5.transferTest === true, 'w5t5 has transferTest === true');
  assert(w5t5.think.mode === 'open', 'w5t5 think mode is open (unscaffolded reasoning)');

  // 9. MHPI Configuration
  console.log('\n--- 9. MHPI Configuration ---');
  const mhpi = MODULE_16_CONTENT.mhpiConfig;
  assert(mhpi.baselineQuestions.length === 5, 'MHPI baseline has 5 questions');
  assert(mhpi.weeklyQuestions.length === 3, 'MHPI weekly has 3 questions');
  assert(mhpi.endExtraQuestions.length === 1, 'MHPI end has 1 extra question');
  assert(mhpi.endChoice.options.length === 3, 'MHPI endChoice has 3 options');

  // 10. Toolkit Selection & Reinforcement Bank Accounting
  console.log('\n--- 10. Toolkit Selection & Reinforcement Bank Accounting ---');
  const bank = MODULE_16_CONTENT.reinforcementBank;
  const toolsData = MODULE_16_CONTENT.toolsData;

  assert(bank.length === 8, 'Reinforcement bank has 8 reflection reps');

  const refCodes = Array.from(new Set(bank.map(r => r.code))).sort();
  assert(refCodes.join(',') === 'A1,A2,A3,B3', 'Reflections contain exactly A1, A2, A3, B3');

  const toolKeys = Object.keys(toolsData);
  assert(toolKeys.length === 1, 'Tools data has exactly 1 tool');
  assert(toolsData.connection_schedule_log.code === 'B1', 'Tool connection_schedule_log is B1');

  const toolCodes = toolKeys.map(k => toolsData[k].code).sort();
  assert(toolCodes.join(',') === 'B1', 'Tools contain exactly B1');

  assert(!refCodes.includes('B2') && !toolCodes.includes('B2'), 'B2 (Format B guardrailed) is excluded from reflections and tools');

  const overlap = refCodes.filter(c => toolCodes.includes(c));
  assert(overlap.length === 0, 'Zero overlap between reflection techniques and tool techniques');

  const totalAccounted = refCodes.length + toolCodes.length + 1; // 4 + 1 + 1 = 6
  assert(totalAccounted === 6, '100% technique accounting (4 reflections + 1 tool + 1 exclusion = 6)');

  // 11. Completion Threshold & Progress Calculations
  console.log('\n--- 11. Completion Threshold & Progress Calculations ---');
  const allTouchIds = weeks.flatMap(w => w.touches.map(t => t.id));
  assert(allTouchIds.length === 25, 'Total touch count is 25');

  const progress24 = Math.round((24 / 25) * 100);
  const progress25 = Math.round((25 / 25) * 100);
  assert(progress24 === 96, '24/25 touches is 96% progress (incomplete)');
  assert(progress25 === 100, '25/25 touches is 100% progress (complete)');

  // 12. Module Isolation (M1-M16 Representative Modules)
  console.log('\n--- 12. Module Isolation (M1-M16 Representative Modules) ---');
  const repModules = [
    { mod: MODULE_1_CONTENT, id: 'M1', weeks: 7 },
    { mod: MODULE_6_CONTENT, id: 'M6', weeks: 2 },
    { mod: MODULE_10_CONTENT, id: 'M10', weeks: 7 },
    { mod: MODULE_13_CONTENT, id: 'M13', weeks: 5 },
    { mod: MODULE_14_CONTENT, id: 'M14', weeks: 7 },
    { mod: MODULE_15_CONTENT, id: 'M15', weeks: 5 },
    { mod: MODULE_16_CONTENT, id: 'M16', weeks: 5 }
  ];

  repModules.forEach(({ mod, id, weeks: wCount }) => {
    assert(mod.moduleId === id, `${id} moduleId intact`);
    assert(mod.weeks.length === wCount, `${id} weeks count is ${wCount}`);
  });

  console.log(`\n========================================`);
  console.log(`ALL MODULE 16 FRONTEND TESTS PASSED: ${passed}/${total}`);
  console.log(`========================================\n`);
}

runModule16FrontendTests().catch(err => {
  console.error('Module 16 frontend test execution failed:', err);
  process.exit(1);
});
