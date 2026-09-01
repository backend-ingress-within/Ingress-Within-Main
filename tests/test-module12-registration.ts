import { ModuleCatalogService } from '../src/lib/modules/moduleCatalogService';
import { ModuleContentService } from '../src/lib/modules/moduleContentService';
import { ModuleRecommendationService } from '../src/lib/modules/moduleRecommendationService';

async function runRegistrationTests() {
  console.log('--- STARTING MODULE 12 REGISTRATION & INTEGRATION TESTS ---');

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
  const m12CatalogItems = allCatalogItems.filter(item => item.id === 'M12');
  assert(m12CatalogItems.length === 1, 'M12 exists exactly once in STATIC_MODULE_CATALOG (no duplicates)');

  const m12CatalogById = await ModuleCatalogService.getModuleByIdOrSlug('M12');
  assert(!!m12CatalogById, 'M12 catalog item found by ID');
  assert(m12CatalogById?.slug === 'caregiving-role-burden', 'M12 slug is caregiving-role-burden');
  assert(m12CatalogById?.name === 'Caregiving & Role Burden', 'M12 name is Caregiving & Role Burden');
  assert(Boolean(m12CatalogById?.description.includes('family-domain')), 'M12 catalog description specifies family-domain');
  assert(m12CatalogById?.duration_weeks === 5, 'M12 duration is 5 weeks');
  assert(m12CatalogById?.price === 499.00, 'M12 price is 499.00 INR');
  assert(m12CatalogById?.status === 'active', 'M12 status is active');
  assert(m12CatalogById?.taxonomy_concerns.length === 2, 'M12 has 2 taxonomy concerns');
  assert(m12CatalogById?.taxonomy_concerns.join(',') === 'M12-C01,M12-C02', 'M12 concerns are M12-C01, M12-C02');

  const m12CatalogBySlug = await ModuleCatalogService.getModuleByIdOrSlug('caregiving-role-burden');
  assert(!!m12CatalogBySlug, 'M12 catalog item found by slug');
  assert(m12CatalogBySlug?.id === 'M12', 'Slug resolves to M12');

  // Check unique IDs and slugs across entire catalog
  const catalogIds = allCatalogItems.map(item => item.id);
  const catalogSlugs = allCatalogItems.map(item => item.slug);
  assert(new Set(catalogIds).size === catalogIds.length, 'No duplicate module IDs exist in catalog');
  assert(new Set(catalogSlugs).size === catalogSlugs.length, 'No duplicate module slugs exist in catalog');

  // 2. Content Service Tests
  console.log('\n--- 2. Content Service Tests ---');
  const m12ContentById = ModuleContentService.getModuleContent('M12');
  assert(!!m12ContentById, 'getModuleContent("M12") returns MODULE_12_CONTENT');
  assert(m12ContentById?.moduleId === 'M12', 'm12ContentById.moduleId is M12');
  assert(m12ContentById?.slug === 'caregiving-role-burden', 'm12ContentById.slug is caregiving-role-burden');

  const m12ContentBySlug = ModuleContentService.getModuleContent('caregiving-role-burden');
  assert(!!m12ContentBySlug, 'getModuleContent("caregiving-role-burden") returns MODULE_12_CONTENT');
  assert(m12ContentBySlug?.moduleId === 'M12', 'm12ContentBySlug resolves to M12');

  const allContents = ModuleContentService.getAllModuleContents();
  assert(allContents.length === 12, 'getAllModuleContents returns all 12 modules (M1-M12)');
  assert(allContents.map(c => c.moduleId).sort().join(',') === 'M1,M10,M11,M12,M2,M3,M4,M5,M6,M7,M8,M9', 'All 12 module IDs present in getAllModuleContents');

  // 3. Recommendation Service Mappings
  console.log('\n--- 3. Recommendation Service Tests ---');
  const m12Concerns = [
    // M12-C01
    { key: 'M12-C01', concernId: 'M12-C01' },
    { key: 'caregiver_burden', concernId: 'M12-C01' },
    { key: 'caregiver-burden', concernId: 'M12-C01' },
    { key: 'caregiving_stress', concernId: 'M12-C01' },
    { key: 'caring_for_parent', concernId: 'M12-C01' },
    { key: 'caring_for_ageing_parent', concernId: 'M12-C01' },
    { key: 'elder_care', concernId: 'M12-C01' },
    { key: 'caregiver_exhaustion', concernId: 'M12-C01' },
    { key: 'caregiver_guilt', concernId: 'M12-C01' },
    { key: 'family_caregiving_responsibilities', concernId: 'M12-C01' },
    // M12-C02
    { key: 'M12-C02', concernId: 'M12-C02' },
    { key: 'parenting_stress', concernId: 'M12-C02' },
    { key: 'parenting-stress', concernId: 'M12-C02' },
    { key: 'parenting_anxiety', concernId: 'M12-C02' },
    { key: 'parenting_pressure', concernId: 'M12-C02' },
    { key: 'overwhelmed_parent', concernId: 'M12-C02' },
    { key: 'parenting_guilt', concernId: 'M12-C02' },
    { key: 'fear_of_being_a_bad_parent', concernId: 'M12-C02' },
    { key: 'parenting_decisions', concernId: 'M12-C02' },
    { key: 'struggling_with_parenting', concernId: 'M12-C02' },
    { key: 'caregiving-role-burden', concernId: 'M12-C02' }
  ];

  m12Concerns.forEach(({ key, concernId }) => {
    const match = ModuleRecommendationService.mapConcernToModule(key);
    assert(match?.moduleId === 'M12', `Concern '${key}' correctly maps to M12`);
    assert(match?.concernId === concernId, `Concern '${key}' correctly maps to concernId '${concernId}'`);
  });

  // 4. Recommendation Isolation (M1-M11 not modified or overwritten)
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
    { concern: 'marriage_pressure', expectedModule: 'M10' },
    { concern: 'privacy_boundaries', expectedModule: 'M10' },
    { concern: 'misunderstood', expectedModule: 'M11' },
    { concern: 'frequent_arguments', expectedModule: 'M11' },
    { concern: 'in_law_conflict', expectedModule: 'M11' },
    { concern: 'sibling_conflict', expectedModule: 'M11' },
    { concern: 'caregiver_burden', expectedModule: 'M12' },
    { concern: 'parenting_stress', expectedModule: 'M12' }
  ];

  isolatedChecks.forEach(({ concern, expectedModule }) => {
    const match = ModuleRecommendationService.mapConcernToModule(concern);
    assert(match?.moduleId === expectedModule, `Isolated concern '${concern}' maps correctly to ${expectedModule}`);
  });

  // 5. Full M1-M12 Regression Checks
  console.log('\n--- 5. Full M1-M12 Regression Checks ---');
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
    { id: 'M11', slug: 'conflict-communication', weeks: 9, mechs: 4, price: 499.00 },
    { id: 'M12', slug: 'caregiving-role-burden', weeks: 5, mechs: 2, price: 499.00 }
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
