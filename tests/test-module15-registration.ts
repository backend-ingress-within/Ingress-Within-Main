import { ModuleCatalogService } from '../src/lib/modules/moduleCatalogService';
import { ModuleContentService } from '../src/lib/modules/moduleContentService';
import { ModuleRecommendationService } from '../src/lib/modules/moduleRecommendationService';
import { MODULE_15_CONTENT } from '../src/lib/modules/content/module15Data';

async function runModule15RegistrationTests() {
  console.log('--- STARTING MODULE 15 APPLICATION REGISTRATION VALIDATION TESTS ---');

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

  // 1. Catalog Tests
  console.log('\n--- 1. Catalog Tests ---');
  const catalog = ModuleCatalogService.getAllCatalogItems();
  assert(catalog.length === 15, 'Catalog contains exactly 15 modules');

  const m15Catalog = catalog.find(m => m.id === 'M15');
  assert(m15Catalog !== undefined, 'M15 exists in catalog');
  assert(m15Catalog?.id === 'M15', 'M15 catalog ID is M15');
  assert(m15Catalog?.slug === 'loss-endings', 'M15 catalog slug is loss-endings');
  assert(m15Catalog?.name === 'Loss & Endings', 'M15 catalog name is correct');
  assert(m15Catalog?.price === 599.00, 'M15 catalog price is 599.00');
  assert(m15Catalog?.currency === 'INR', 'M15 catalog currency is INR');
  assert(m15Catalog?.status === 'active', 'M15 catalog status is active');
  assert(m15Catalog?.version === '1.0', 'M15 catalog version is 1.0');
  assert(m15Catalog?.duration_weeks === 5, 'M15 catalog duration is 5 weeks');
  assert(m15Catalog?.taxonomy_concerns.length === 2, 'M15 catalog has 2 taxonomy concerns');
  assert(!!m15Catalog?.taxonomy_concerns.includes('M15-C01'), 'Includes M15-C01');
  assert(!!m15Catalog?.taxonomy_concerns.includes('M15-C02'), 'Includes M15-C02');

  const allIds = catalog.map(m => m.id);
  const allSlugs = catalog.map(m => m.slug);
  assert(new Set(allIds).size === 15, 'No duplicate module IDs in catalog');
  assert(new Set(allSlugs).size === 15, 'No duplicate module slugs in catalog');

  // 2. Content Resolution Tests
  console.log('\n--- 2. Content Resolution Tests ---');
  const contentById = ModuleContentService.getModuleContent('M15');
  const contentBySlug = ModuleContentService.getModuleContent('loss-endings');
  const allContents = ModuleContentService.getAllModuleContents();

  assert(contentById !== null, 'getModuleContent("M15") resolves content');
  assert(contentBySlug !== null, 'getModuleContent("loss-endings") resolves content');
  assert(contentById === contentBySlug, 'Both ID and slug resolve to exact same content instance');
  assert(contentById === MODULE_15_CONTENT, 'Resolved content matches MODULE_15_CONTENT');
  assert(allContents.length === 15, 'getAllModuleContents() returns exactly 15 modules');

  const contentIds = allContents.map(m => m.moduleId);
  for (let i = 1; i <= 15; i++) {
    const expectedId = `M${i}`;
    assert(contentIds.includes(expectedId), `getAllModuleContents() includes ${expectedId}`);
  }

  // 3. Recommendation Mapping Tests
  console.log('\n--- 3. Recommendation Mapping Tests ---');
  const c01Keywords = [
    'M15-C01', 'breakup', 'break_up', 'break-up', 'breakup_distress', 'breakup-distress',
    'relationship_loss', 'relationship-loss', 'romantic_loss', 'romantic-loss',
    'recent_breakup', 'recent-breakup', 'going_through_breakup', 'going-through-breakup',
    'heartbreak', 'heart_break', 'heart-break', 'missing_ex', 'missing-ex',
    'cannot_get_over_ex', 'cannot-get-over-ex', 'cant_get_over_ex', 'cant-get-over-ex',
    'breakup_rumination', 'breakup-rumination', 'relationship_ended', 'relationship-ended',
    'end_of_relationship', 'end-of-relationship', 'lost_relationship', 'lost-relationship',
    'grieving_relationship', 'grieving-relationship', 'grief_after_breakup', 'grief-after-breakup',
    'loss_endings', 'loss-endings'
  ];

  c01Keywords.forEach(kw => {
    const mapping = ModuleRecommendationService.mapConcernToModule(kw);
    assert(mapping !== null && mapping.moduleId === 'M15' && mapping.concernId === 'M15-C01', `Keyword "${kw}" maps to M15-C01`);
  });

  const c02Keywords = [
    'M15-C02', 'divorce', 'divorce_adjustment', 'divorce-adjustment', 'separation',
    'relationship_separation', 'relationship-separation', 'marital_separation', 'marital-separation',
    'going_through_divorce', 'going-through-divorce', 'adjusting_to_divorce', 'adjusting-to-divorce',
    'post_divorce', 'post-divorce', 'life_after_divorce', 'life-after-divorce',
    'separated_from_spouse', 'separated-from-spouse', 'marriage_ended', 'marriage-ended',
    'marital_breakdown', 'marital-breakdown', 'divorce_stigma', 'divorce-stigma',
    'divorce_failure', 'divorce-failure', 'rebuilding_after_divorce', 'rebuilding-after-divorce',
    'starting_over_after_divorce', 'starting-over-after-divorce'
  ];

  c02Keywords.forEach(kw => {
    const mapping = ModuleRecommendationService.mapConcernToModule(kw);
    assert(mapping !== null && mapping.moduleId === 'M15' && mapping.concernId === 'M15-C02', `Keyword "${kw}" maps to M15-C02`);
  });

  // 4. M14 vs M15 Boundary Tests
  console.log('\n--- 4. M14 vs M15 Boundary Tests ---');
  const m14Boundaries = ['grief', 'bereavement', 'loss_of_loved_one', 'death_in_family'];
  m14Boundaries.forEach(kw => {
    const mapping = ModuleRecommendationService.mapConcernToModule(kw);
    assert(mapping !== null && mapping.moduleId === 'M14', `Generic grief keyword "${kw}" maps to M14`);
  });

  const m15Boundaries = ['breakup', 'heartbreak', 'divorce', 'marital_separation'];
  m15Boundaries.forEach(kw => {
    const mapping = ModuleRecommendationService.mapConcernToModule(kw);
    assert(mapping !== null && mapping.moduleId === 'M15', `Relationship loss keyword "${kw}" maps to M15`);
  });

  // 5. Recommendation Isolation Tests
  console.log('\n--- 5. Recommendation Isolation Tests ---');
  const isolationCases = [
    { kw: 'self_criticism', mod: 'M1' },
    { kw: 'perfectionism', mod: 'M2' },
    { kw: 'generalised_anxiety', mod: 'M3' },
    { kw: 'low_mood', mod: 'M4' },
    { kw: 'identity_confusion', mod: 'M5' },
    { kw: 'trauma', mod: 'M6' },
    { kw: 'emotional_suppression', mod: 'M7' },
    { kw: 'neurodivergence', mod: 'M8' },
    { kw: 'criticism', mod: 'M9' },
    { kw: 'marriage_pressure', mod: 'M10' },
    { kw: 'misunderstood', mod: 'M11' },
    { kw: 'caregiver_burden', mod: 'M12' },
    { kw: 'inter_caste_relationship', mod: 'M13' },
    { kw: 'grief', mod: 'M14' }
  ];

  isolationCases.forEach(({ kw, mod }) => {
    const mapping = ModuleRecommendationService.mapConcernToModule(kw);
    assert(mapping !== null && mapping.moduleId === mod, `Existing keyword "${kw}" still resolves to ${mod}`);
  });

  // 6. Full M1–M15 Regression
  console.log('\n--- 6. Full M1–M15 Regression ---');
  for (let i = 1; i <= 15; i++) {
    const id = `M${i}`;
    const item = catalog.find(m => m.id === id);
    const content = ModuleContentService.getModuleContent(id);

    assert(item !== undefined, `Catalog entry for ${id} exists`);
    assert(content !== null, `Content dataset for ${id} resolves`);
    assert(content?.moduleId === id, `Content moduleId for ${id} matches`);
  }

  console.log(`\n========================================`);
  console.log(`ALL MODULE 15 REGISTRATION TESTS PASSED: ${passed}/${total}`);
  console.log(`========================================\n`);
}

runModule15RegistrationTests().catch(err => {
  console.error('Module 15 registration test execution failed:', err);
  process.exit(1);
});
