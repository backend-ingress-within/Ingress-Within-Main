import { ModuleCatalogService } from '../src/lib/modules/moduleCatalogService';
import { ModuleContentService } from '../src/lib/modules/moduleContentService';
import { ModuleRecommendationService } from '../src/lib/modules/moduleRecommendationService';
import { MODULE_13_CONTENT } from '../src/lib/modules/content/module13Data';

async function runModule13RegistrationTests() {
  console.log('--- STARTING MODULE 13 APPLICATION REGISTRATION TESTS ---');

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

  // 1. Catalog Registration Tests
  console.log('\n--- 1. Catalog Registration ---');
  const catalog = ModuleCatalogService.getAllCatalogItems();
  assert(catalog.length === 13, 'Catalog contains exactly 13 modules (M1–M13)');

  const m13Catalog = catalog.find(m => m.id === 'M13');
  assert(!!m13Catalog, 'M13 catalog entry exists');
  assert(m13Catalog?.id === 'M13', 'Catalog entry id is M13');
  assert(m13Catalog?.slug === 'identity-belonging-family-acceptance', 'Catalog entry slug is identity-belonging-family-acceptance');
  assert(m13Catalog?.name === 'Identity, Belonging & Family Acceptance', 'Catalog entry name matches');
  assert((MODULE_13_CONTENT.tier || '').includes('Family'), 'MODULE_13_CONTENT domain is Family');
  assert((MODULE_13_CONTENT.tier || '').includes('Specialized'), 'MODULE_13_CONTENT tier is Specialized');
  assert(m13Catalog?.price === 399.00, 'Catalog entry price is 399.00');
  assert(m13Catalog?.currency === 'INR', 'Catalog entry currency is INR');
  assert(m13Catalog?.duration_weeks === 5, 'Catalog entry duration is 5 weeks');
  assert(m13Catalog?.status === 'active', 'Catalog entry status is active');
  assert(JSON.stringify(m13Catalog?.taxonomy_concerns) === JSON.stringify(['M13-C01', 'M13-C02']), 'Catalog entry taxonomy_concerns match M13-C01 and M13-C02');

  // Verify catalog uniqueness
  const ids = catalog.map(m => m.id);
  const slugs = catalog.map(m => m.slug);
  assert(new Set(ids).size === 13, 'All 13 module catalog IDs are unique');
  assert(new Set(slugs).size === 13, 'All 13 module catalog slugs are unique');

  // 2. Content Resolution Tests
  console.log('\n--- 2. Content Resolution ---');
  const contentById = ModuleContentService.getModuleContent('M13');
  const contentBySlug = ModuleContentService.getModuleContent('identity-belonging-family-acceptance');

  assert(contentById !== null, 'getModuleContent("M13") resolves content');
  assert(contentBySlug !== null, 'getModuleContent("identity-belonging-family-acceptance") resolves content');
  assert(contentById === contentBySlug, 'Both ID and slug resolve to the exact same content instance');
  assert(contentById === MODULE_13_CONTENT, 'Resolved content matches MODULE_13_CONTENT');

  const allContents = ModuleContentService.getAllModuleContents();
  assert(allContents.length === 13, 'getAllModuleContents() returns all 13 modules (M1–M13)');
  assert(allContents[12].moduleId === 'M13', '13th module content is M13');

  // 3. Recommendation Taxonomy & Keyword Mapping Tests
  console.log('\n--- 3. Recommendation Taxonomy & Keyword Mappings ---');

  const m13c01Keywords = [
    'M13-C01',
    'inter_caste_relationship',
    'inter-caste-relationship',
    'interfaith_relationship',
    'interfaith-relationship',
    'inter_religion_relationship',
    'inter-religion-relationship',
    'family_rejection',
    'family-rejection',
    'relationship_rejection',
    'relationship-rejection',
    'caste_family_pressure',
    'caste-family-pressure',
    'religious_family_pressure',
    'religious-family-pressure',
    'inter_caste_marriage',
    'inter-caste-marriage',
    'interfaith_marriage',
    'interfaith-marriage',
    'family_opposition_relationship',
    'family-opposition-relationship',
    'social_boycott',
    'social-boycott',
    'community_rejection',
    'community-rejection'
  ];

  m13c01Keywords.forEach(keyword => {
    const mapping = ModuleRecommendationService.mapConcernToModule(keyword);
    assert(mapping?.moduleId === 'M13', `Keyword "${keyword}" maps to M13`);
  });

  const m13c02Keywords = [
    'M13-C02',
    'family_acceptance_lgbtq',
    'family-acceptance-lgbtq',
    'sexual_orientation_family',
    'sexual-orientation-family',
    'gender_identity_family',
    'gender-identity-family',
    'family_rejection_lgbtq',
    'family-rejection-lgbtq',
    'coming_out_family',
    'coming-out-family',
    'lgbtq_family_acceptance',
    'lgbtq-family-acceptance',
    'queer_family_rejection',
    'queer-family-rejection',
    'sexuality_family_pressure',
    'sexuality-family-pressure',
    'gender_identity_rejection',
    'gender-identity-rejection',
    'identity_family_acceptance',
    'identity-family-acceptance',
    'arranged_marriage_identity_pressure',
    'arranged-marriage-identity-pressure',
    'identity_belonging_family_acceptance',
    'identity-belonging-family-acceptance'
  ];

  m13c02Keywords.forEach(keyword => {
    const mapping = ModuleRecommendationService.mapConcernToModule(keyword);
    assert(mapping?.moduleId === 'M13', `Keyword "${keyword}" maps to M13`);
  });

  // 4. Isolation & M1–M12 Regression Tests
  console.log('\n--- 4. Isolation & M1–M12 Regression ---');

  const previousModules = [
    { id: 'M1', slug: 'self-worth-self-talk', key: 'M1-C01' },
    { id: 'M2', slug: 'perfectionism-avoidance', key: 'M2-C01' },
    { id: 'M3', slug: 'anxiety-worry', key: 'M3-C01' },
    { id: 'M4', slug: 'mood-emotional-regulation', key: 'M4-C01' },
    { id: 'M5', slug: 'identity-purpose', key: 'M5-C01' },
    { id: 'M6', slug: 'trauma-past-experiences', key: 'M6-C01' },
    { id: 'M7', slug: 'emotional-suppression-masculinity-norms', key: 'M7-C01' },
    { id: 'M8', slug: 'neurodivergence-adult-diagnosis', key: 'M8-C01' },
    { id: 'M9', slug: 'judged-compared', key: 'M9-C01' },
    { id: 'M10', slug: 'autonomy-boundaries', key: 'M10-C01' },
    { id: 'M11', slug: 'conflict-communication', key: 'M11-C01' },
    { id: 'M12', slug: 'caregiving-role-burden', key: 'M12-C01' }
  ];

  previousModules.forEach(mod => {
    const content = ModuleContentService.getModuleContent(mod.id);
    const contentBySlug = ModuleContentService.getModuleContent(mod.slug);
    assert(content !== null, `${mod.id} content resolves by ID`);
    assert(contentBySlug !== null, `${mod.id} content resolves by slug`);
    assert(content === contentBySlug, `${mod.id} ID and slug resolve to same content`);

    const mapping = ModuleRecommendationService.mapConcernToModule(mod.key);
    assert(mapping?.moduleId === mod.id, `${mod.key} still maps to ${mod.id}`);
  });

  console.log(`\n========================================`);
  console.log(`ALL MODULE 13 REGISTRATION TESTS PASSED: ${passed}/${total}`);
  console.log(`========================================\n`);
}

runModule13RegistrationTests().catch(err => {
  console.error('Module 13 registration test execution failed:', err);
  process.exit(1);
});
