import { ModuleCatalogService } from '../src/lib/modules/moduleCatalogService';
import { ModuleContentService } from '../src/lib/modules/moduleContentService';
import { ModuleRecommendationService } from '../src/lib/modules/moduleRecommendationService';
import { MODULE_10_CONTENT } from '../src/lib/modules/content/module10Data';

async function runRegistrationTests() {
  console.log('--- STARTING MODULE 10 REGISTRATION & INTEGRATION TESTS ---');

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
  const m10CatalogItems = allCatalogItems.filter(item => item.id === 'M10');
  assert(m10CatalogItems.length === 1, 'M10 exists exactly once in STATIC_MODULE_CATALOG (no duplicates)');

  const m10CatalogById = await ModuleCatalogService.getModuleByIdOrSlug('M10');
  assert(!!m10CatalogById, 'M10 catalog item found by ID');
  assert(m10CatalogById?.slug === 'autonomy-boundaries', 'M10 slug is autonomy-boundaries');
  assert(m10CatalogById?.name === 'Autonomy & Boundaries', 'M10 name is Autonomy & Boundaries');
  assert(m10CatalogById?.duration_weeks === 7, 'M10 duration is 7 weeks');
  assert(m10CatalogById?.price === 499.00, 'M10 price is 499.00 INR');
  assert(m10CatalogById?.status === 'active', 'M10 status is active');
  assert(m10CatalogById?.taxonomy_concerns.length === 3, 'M10 has 3 taxonomy concerns');
  assert(m10CatalogById?.taxonomy_concerns.join(',') === 'M10-C01,M10-C02,M10-C03', 'M10 concerns are M10-C01, M10-C02, M10-C03');

  const m10CatalogBySlug = await ModuleCatalogService.getModuleByIdOrSlug('autonomy-boundaries');
  assert(!!m10CatalogBySlug, 'M10 catalog item found by slug');
  assert(m10CatalogBySlug?.id === 'M10', 'Slug resolves to M10');

  // 2. Content Service Tests
  console.log('\n--- 2. Content Service Tests ---');
  const m10ContentById = ModuleContentService.getModuleContent('M10');
  assert(!!m10ContentById, 'getModuleContent("M10") returns MODULE_10_CONTENT');
  assert(m10ContentById?.moduleId === 'M10', 'm10ContentById.moduleId is M10');
  assert(m10ContentById?.slug === 'autonomy-boundaries', 'm10ContentById.slug is autonomy-boundaries');

  const m10ContentBySlug = ModuleContentService.getModuleContent('autonomy-boundaries');
  assert(!!m10ContentBySlug, 'getModuleContent("autonomy-boundaries") returns MODULE_10_CONTENT');
  assert(m10ContentBySlug?.moduleId === 'M10', 'm10ContentBySlug resolves to M10');

  const allContents = ModuleContentService.getAllModuleContents();
  assert(allContents.length === 10, 'getAllModuleContents returns all 10 modules (M1-M10)');
  assert(allContents.map(c => c.moduleId).sort().join(',') === 'M1,M10,M2,M3,M4,M5,M6,M7,M8,M9', 'All 10 module IDs present in getAllModuleContents');

  // 3. Recommendation Service Mappings
  console.log('\n--- 3. Recommendation Service Tests ---');
  const m10Concerns = [
    'M10-C01', 'marriage_pressure', 'marriage-pressure', 'arranged_marriage_pressure', 'family_marriage_pressure', 'timeline_pressure',
    'M10-C02', 'privacy_boundaries', 'privacy-boundaries', 'lack_of_privacy', 'lack-of-privacy', 'boundary_setting', 'boundary-setting', 'family_boundaries', 'personal_boundaries',
    'M10-C03', 'career_pressure', 'career-pressure', 'forced_career', 'forced-career', 'family_career_pressure', 'family_business_pressure', 'autonomy_boundaries', 'autonomy-boundaries'
  ];

  m10Concerns.forEach(concern => {
    const match = ModuleRecommendationService.mapConcernToModule(concern);
    assert(match?.moduleId === 'M10', `Concern '${concern}' correctly maps to M10`);
  });

  // 4. Recommendation Isolation (M1-M9 not modified or overwritten)
  console.log('\n--- 4. Recommendation Isolation Tests ---');
  const isolatedChecks = [
    { concern: 'self_criticism', expectedModule: 'M1' },
    { concern: 'perfectionism', expectedModule: 'M2' },
    { concern: 'panic_attacks', expectedModule: 'M3' },
    { concern: 'low_mood', expectedModule: 'M4' },
    { concern: 'identity_crisis', expectedModule: 'M5' },
    { concern: 'trauma', expectedModule: 'M6' },
    { concern: 'emotional_suppression', expectedModule: 'M7' },
    { concern: 'neurodivergence', expectedModule: 'M8' },
    { concern: 'criticism', expectedModule: 'M9' },
    { concern: 'comparison_relatives', expectedModule: 'M9' },
    { concern: 'high_expectations', expectedModule: 'M9' },
    { concern: 'marriage_pressure', expectedModule: 'M10' },
    { concern: 'privacy_boundaries', expectedModule: 'M10' },
    { concern: 'career_pressure', expectedModule: 'M10' }
  ];

  isolatedChecks.forEach(({ concern, expectedModule }) => {
    const match = ModuleRecommendationService.mapConcernToModule(concern);
    assert(match?.moduleId === expectedModule, `Isolated concern '${concern}' maps correctly to ${expectedModule}`);
  });

  // 5. Full M1-M10 Regression Checks
  console.log('\n--- 5. Full M1-M10 Regression Checks ---');
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
    { id: 'M10', slug: 'autonomy-boundaries', weeks: 7, mechs: 3, price: 499.00 }
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
