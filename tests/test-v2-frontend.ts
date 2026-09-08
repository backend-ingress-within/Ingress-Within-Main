import { generatePageMetadata } from '../src/lib/seo/metadata';
import { generateStaticParams } from '../src/app/[[...slug]]/page';
import {
  V2_NAV_LINKS,
  V2_JOURNEY_STAGES,
  V2_PATHWAYS,
  V2_STARTING_POINTS,
  V2_DOMAINS,
  V2_FRAMEWORK_STEPS,
  V2_SEO_PAGES
} from '../src/v2/data/v2Content';

async function runV2Tests() {
  console.log('--- RUNNING INGRESS WITHIN V2 FRONTEND TEST SUITE ---\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, message: string) {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  }

  // 1. Verify content data structures
  console.log('[1] Verifying V2 Content Data Objects...');
  assert(V2_NAV_LINKS.length >= 6, `Navigation links exist (count: ${V2_NAV_LINKS.length})`);
  assert(V2_JOURNEY_STAGES.length === 5, `Journey Roadmap has 5 steps (count: ${V2_JOURNEY_STAGES.length})`);
  assert(V2_PATHWAYS.length === 3, `Three pathways exist (count: ${V2_PATHWAYS.length})`);
  assert(V2_STARTING_POINTS.length >= 6, `Starting points exist (count: ${V2_STARTING_POINTS.length})`);
  assert(V2_DOMAINS.length === 6, `Domains of inquiry has 6 items (count: ${V2_DOMAINS.length})`);
  assert(V2_FRAMEWORK_STEPS.length === 4, `Four-stage framework has 4 steps (count: ${V2_FRAMEWORK_STEPS.length})`);
  assert(V2_SEO_PAGES.length === 7, `Editorial SEO essays exist (count: ${V2_SEO_PAGES.length})`);

  // 2. Verify static params for Next.js SSG
  console.log('\n[2] Verifying Next.js static params for V2...');
  const staticParams = generateStaticParams();
  const v2Params = staticParams.filter(p => p.slug && p.slug[0] === 'v2');
  assert(v2Params.length >= 15, `Static params contain all 15 V2 routes (found ${v2Params.length})`);

  // 3. Verify Metadata generation for all V2 routes
  console.log('\n[3] Verifying Metadata Generator for V2 routes...');
  const testRoutes = [
    { slug: ['v2'], expectedTitleContains: 'Ingress Within' },
    { slug: ['v2', 'what-it-is'], expectedTitleContains: 'Guided Journaling' },
    { slug: ['v2', 'how-it-works'], expectedTitleContains: 'How Guided Journaling Works' },
    { slug: ['v2', 'about'], expectedTitleContains: 'About Ingress Within' },
    { slug: ['v2', 'pricing'], expectedTitleContains: 'Pricing' },
    { slug: ['v2', 'faq'], expectedTitleContains: 'FAQ' },
    { slug: ['v2', 'contact'], expectedTitleContains: 'Contact' },
    { slug: ['v2', 'ai-data'], expectedTitleContains: 'AI Journaling Privacy' },
    { slug: ['v2', 'guided-journaling'], expectedTitleContains: 'Guided Journaling' },
    { slug: ['v2', 'self-reflection'], expectedTitleContains: 'Self-Reflection' },
    { slug: ['v2', 'emotional-patterns'], expectedTitleContains: 'Emotional Patterns' },
    { slug: ['v2', 'self-awareness'], expectedTitleContains: 'Self-Aware' },
    { slug: ['v2', 'journaling-prompts-for-self-discovery'], expectedTitleContains: 'Journaling Prompts' },
    { slug: ['v2', 'how-to-start-journaling'], expectedTitleContains: 'Start Journaling' },
    { slug: ['v2', 'how-to-practice-self-reflection'], expectedTitleContains: 'Practice Self-Reflection' },
  ];

  for (const route of testRoutes) {
    const meta = generatePageMetadata({ slug: route.slug });
    const hasTitle = Boolean(meta.title && meta.title.includes(route.expectedTitleContains));
    const hasDesc = Boolean(meta.description && meta.description.length > 20);
    const hasRobots = Boolean(meta.robots && meta.robots.index === true);
    assert(hasTitle && hasDesc && hasRobots, `Metadata for /${route.slug.join('/')} valid: "${meta.title}"`);
  }

  // 4. Verify Component and Page Modules Load
  console.log('\n[4] Verifying Dynamic Page Imports...');
  try {
    const pages = [
      'V2LandingPage',
      'V2WhatItIsPage',
      'V2HowItWorksPage',
      'V2AboutPage',
      'V2PricingPage',
      'V2FaqPage',
      'V2ContactPage',
      'V2AiDataPage',
      'V2GuidedJournalingPage',
      'V2SelfReflectionPage',
      'V2EmotionalPatternsPage',
      'V2SelfAwarenessPage',
      'V2JournalingPromptsPage',
      'V2HowToStartJournalingPage',
      'V2HowToPracticeSelfReflectionPage',
    ];

    for (const pageName of pages) {
      const mod = await import(`../src/v2/pages/${pageName}`);
      assert(typeof mod.default === 'function', `Page module ${pageName} exports valid React component`);
    }
  } catch (err: any) {
    assert(false, `Dynamic page import error: ${err.message}`);
  }

  console.log(`\n========================================`);
  console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runV2Tests().catch(err => {
  console.error('Unhandled test failure:', err);
  process.exit(1);
});
