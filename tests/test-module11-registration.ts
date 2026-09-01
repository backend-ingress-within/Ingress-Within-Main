import { ModuleCatalogService } from '../src/lib/modules/moduleCatalogService';
import { ModuleContentService } from '../src/lib/modules/moduleContentService';
import { ModuleRecommendationService } from '../src/lib/modules/moduleRecommendationService';
import { MODULE_11_CONTENT } from '../src/lib/modules/content/module11Data';

async function runRegistrationTests() {
  console.log('--- STARTING MODULE 11 REGISTRATION & INTEGRATION TESTS ---');

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

  // 1. Catalog Tests
  console.log('\n--- 1. Catalog Tests ---');
  const allCatalogItems = ModuleCatalogService.getAllCatalogItems();
  const m11CatalogItems = allCatalogItems.filter(item => item.id === 'M11');
  assert(m11CatalogItems.length === 1, 'M11 exists exactly once in STATIC_MODULE_CATALOG (no duplicates)');

  const m11CatalogById = await ModuleCatalogService.getModuleByIdOrSlug('M11');
  assert(!!m11CatalogById, 'M11 catalog item found by ID');
  assert(m11CatalogById?.slug === 'conflict-communication', 'M11 slug is conflict-communication');
  assert(m11CatalogById?.name === 'Conflict & Communication', 'M11 name is Conflict & Communication');
  assert(m11CatalogById?.duration_weeks === 9, 'M11 duration is 9 weeks');
  assert(m11CatalogById?.price === 499.00, 'M11 price is 499.00 INR');
  assert(m11CatalogById?.status === 'active', 'M11 status is active');
  assert(m11CatalogById?.taxonomy_concerns.length === 4, 'M11 has 4 taxonomy concerns');
  assert(m11CatalogById?.taxonomy_concerns.join(',') === 'M11-C01,M11-C02,M11-C03,M11-C04', 'M11 concerns are M11-C01, M11-C02, M11-C03, M11-C04');

  const m11CatalogBySlug = await ModuleCatalogService.getModuleByIdOrSlug('conflict-communication');
  assert(!!m11CatalogBySlug, 'M11 catalog item found by slug');
  assert(m11CatalogBySlug?.id === 'M11', 'Slug resolves to M11');

  // 2. Content Service Tests
  console.log('\n--- 2. Content Service Tests ---');
  const m11ContentById = ModuleContentService.getModuleContent('M11');
  assert(!!m11ContentById, 'getModuleContent("M11") returns MODULE_11_CONTENT');
  assert(m11ContentById?.moduleId === 'M11', 'm11ContentById.moduleId is M11');
  assert(m11ContentById?.slug === 'conflict-communication', 'm11ContentById.slug is conflict-communication');

  const m11ContentBySlug = ModuleContentService.getModuleContent('conflict-communication');
  assert(!!m11ContentBySlug, 'getModuleContent("conflict-communication") returns MODULE_11_CONTENT');
  assert(m11ContentBySlug?.moduleId === 'M11', 'm11ContentBySlug resolves to M11');

  const allContents = ModuleContentService.getAllModuleContents();
  assert(allContents.length === 11, 'getAllModuleContents returns all 11 modules (M1-M11)');
  assert(allContents.map(c => c.moduleId).sort().join(',') === 'M1,M10,M11,M2,M3,M4,M5,M6,M7,M8,M9', 'All 11 module IDs present in getAllModuleContents');

  // 3. Recommendation Service Mappings
  console.log('\n--- 3. Recommendation Service Tests ---');
  const m11Concerns = [
    // M11-C01
    { key: 'M11-C01', concernId: 'M11-C01' },
    { key: 'misunderstood', concernId: 'M11-C01' },
    { key: 'feeling_misunderstood', concernId: 'M11-C01' },
    { key: 'no_one_understands_me', concernId: 'M11-C01' },
    { key: 'miscommunication', concernId: 'M11-C01' },
    { key: 'feeling_unheard', concernId: 'M11-C01' },
    { key: 'not_being_heard', concernId: 'M11-C01' },
    // M11-C02
    { key: 'M11-C02', concernId: 'M11-C02' },
    { key: 'frequent_arguments', concernId: 'M11-C02' },
    { key: 'constant_fighting', concernId: 'M11-C02' },
    { key: 'recurring_arguments', concernId: 'M11-C02' },
    { key: 'family_arguments', concernId: 'M11-C02' },
    { key: 'relationship_arguments', concernId: 'M11-C02' },
    // M11-C03
    { key: 'M11-C03', concernId: 'M11-C03' },
    { key: 'joint_family_conflict', concernId: 'M11-C03' },
    { key: 'in_law_conflict', concernId: 'M11-C03' },
    { key: 'inlaws', concernId: 'M11-C03' },
    { key: 'family_authority', concernId: 'M11-C03' },
    { key: 'household_conflict', concernId: 'M11-C03' },
    // M11-C04
    { key: 'M11-C04', concernId: 'M11-C04' },
    { key: 'sibling_conflict', concernId: 'M11-C04' },
    { key: 'sibling_arguments', concernId: 'M11-C04' },
    { key: 'brother_conflict', concernId: 'M11-C04' },
    { key: 'sister_conflict', concernId: 'M11-C04' },
    { key: 'family_sibling_conflict', concernId: 'M11-C04' },
    { key: 'conflict-communication', concernId: 'M11-C04' }
  ];

  m11Concerns.forEach(({ key, concernId }) => {
    const match = ModuleRecommendationService.mapConcernToModule(key);
    assert(match?.moduleId === 'M11', `Concern '${key}' correctly maps to M11`);
    assert(match?.concernId === concernId, `Concern '${key}' correctly maps to concernId '${concernId}'`);
  });

  // 4. Recommendation Isolation (M1-M10 not modified or overwritten)
  console.log('\n--- 4. Recommendation Isolation Tests ---');
  const isolatedChecks = [
    { concern: 'self_criticism', expectedModule: 'M1' },
    { concern: 'perfectionism', expectedModule: 'M2' },
    { concern: 'panic_attacks', expectedModule: 'M3' },
    { concern: 'generalised_anxiety', expectedModule: 'M3' },
    { concern: 'low_mood', expectedModule: 'M4' },
    { concern: 'identity_crisis', expectedModule: 'M5' },
    { concern: 'identity_confusion', expectedModule: 'M5' },
    { concern: 'trauma', expectedModule: 'M6' },
    { concern: 'emotional_suppression', expectedModule: 'M7' },
    { concern: 'neurodivergence', expectedModule: 'M8' },
    { concern: 'criticism', expectedModule: 'M9' },
    { concern: 'comparison_relatives', expectedModule: 'M9' },
    { concern: 'high_expectations', expectedModule: 'M9' },
    { concern: 'marriage_pressure', expectedModule: 'M10' },
    { concern: 'privacy_boundaries', expectedModule: 'M10' },
    { concern: 'career_pressure', expectedModule: 'M10' },
    { concern: 'misunderstood', expectedModule: 'M11' },
    { concern: 'frequent_arguments', expectedModule: 'M11' },
    { concern: 'in_law_conflict', expectedModule: 'M11' },
    { concern: 'sibling_conflict', expectedModule: 'M11' }
  ];

  isolatedChecks.forEach(({ concern, expectedModule }) => {
    const match = ModuleRecommendationService.mapConcernToModule(concern);
    assert(match?.moduleId === expectedModule, `Isolated concern '${concern}' maps correctly to ${expectedModule}`);
  });

  // 5. Full M1-M11 Regression Checks
  console.log('\n--- 5. Full M1-M11 Regression Checks ---');
  const expectedModules = [
    { id: 'M1', slug: 'self-worth-self-talk', weeks: 7, mechs: 3, price: 349.00 },
    { id: 'M2', slug: 'perfectionism-avoidance', weeks: 5, mechs: 2, price: 349.00 },
    { id: 'M3', slug: 'anxiety-worry', weeks: 9, mechs: 4, price: 499.00 },
    { id: 'M4', slug: 'mood-emotional-regulation', weeks: 7, mechs: 3, price: 349.00 },
    { id: 'M5', slug: 'identity-purpose', weeks: 5, mechs: 2, price: 499.00 },
    { id: 'M6', slug: 'trauma-past-experiences', weeks: 2, mechs: 1, price: 399.00 },
    { id: 'M7', slug: 'emotional-suppression-masculinity-norms', weeks: 2, mechs: 1, price: 499.00 },
    { id: 'M8', slug: 'neurodivergence-adult-diagnosis', weeks: 2, mechs: 1, price: 599.00 },
    { id: 'M9', slug: 'judged-compared', weeks: 7, mechs: 3, price: 349.00 },
    { id: 'M10', slug: 'autonomy-boundaries', weeks: 7, mechs: 3, price: 499.00 },
    { id: 'M11', slug: 'conflict-communication', weeks: 9, mechs: 4, price: 499.00 }
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
  console.log(`ALL REGISTRATION TESTS PASSED: ${passedTests}/${totalTests}`);
  console.log(`========================================\n`);
}

runRegistrationTests().catch(err => {
  console.error('Registration test execution failed:', err);
  process.exit(1);
});
