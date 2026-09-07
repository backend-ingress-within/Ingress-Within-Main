import { generatePageMetadata } from '../src/lib/seo/metadata';
import { KEYWORD_CLUSTERS, ROUTE_INTENT_MAP } from '../src/lib/seo/keywordStrategy';
import fs from 'fs';
import path from 'path';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    process.exit(1);
  }
}

async function runOnPageSeoTests() {
  console.log('=== STARTING PHASE 2 ON-PAGE SEO & SEARCH INTENT VALIDATION TESTS ===\n');

  // 1. Keyword Architecture Tests
  console.log('1. Testing Keyword Clusters & Route Intent Strategy (keywordStrategy.ts)...');
  assert(!!KEYWORD_CLUSTERS.guidedJournaling, 'guidedJournaling cluster must exist');
  assert(!!KEYWORD_CLUSTERS.selfUnderstanding, 'selfUnderstanding cluster must exist');
  assert(!!KEYWORD_CLUSTERS.emotionalPatterns, 'emotionalPatterns cluster must exist');
  assert(!!KEYWORD_CLUSTERS.psychologyInformed, 'psychologyInformed cluster must exist');
  assert(!!KEYWORD_CLUSTERS.mentalWellness, 'mentalWellness cluster must exist');

  const requiredRoutes = ['home', 'whatItIs', 'howItWorks', 'about', 'pricing', 'faq', 'aiData', 'contact', 'auth'];
  for (const rKey of requiredRoutes) {
    assert(!!ROUTE_INTENT_MAP[rKey], `ROUTE_INTENT_MAP must define intent for ${rKey}`);
    assert(!!ROUTE_INTENT_MAP[rKey].title, `Route ${rKey} must have a title`);
    assert(!!ROUTE_INTENT_MAP[rKey].description, `Route ${rKey} must have a description`);
  }
  console.log('   ✅ Keyword architecture and route intent maps validated.');

  // 2. Unique Page Metadata Tests
  console.log('2. Testing Unique Metadata Generation for All Public Routes (metadata.ts)...');
  const publicSlugs = [
    undefined, // home /
    'what-it-is',
    'how-it-works',
    'about',
    'pricing',
    'faq',
    'ai-data',
    'contact',
    'auth'
  ];

  const titles = new Set<string>();
  const descriptions = new Set<string>();
  const canonicals = new Set<string>();

  for (const slug of publicSlugs) {
    const meta = generatePageMetadata({ slug });
    const titleStr = typeof meta.title === 'string' ? meta.title : (meta.title as any)?.default;
    
    assert(!!titleStr, `Page ${slug || '/'} must have a title`);
    assert(!!meta.description, `Page ${slug || '/'} must have a description`);
    assert(!!meta.alternates?.canonical, `Page ${slug || '/'} must have a canonical URL`);
    assert(meta.alternates.canonical.startsWith('https://ingresswithin.com'), `Canonical for ${slug || '/'} must start with https://ingresswithin.com`);

    // Non-clinical compliance checks
    const lowerTitle = titleStr.toLowerCase();
    const lowerDesc = meta.description.toLowerCase();
    assert(!lowerTitle.includes('cure'), `Title for ${slug || '/'} must not contain "cure"`);
    assert(!lowerTitle.includes('diagnose'), `Title for ${slug || '/'} must not contain "diagnose"`);
    assert(!lowerDesc.includes('ai therapy'), `Description for ${slug || '/'} must not contain "ai therapy"`);
    assert(!lowerDesc.includes('replace therapy'), `Description for ${slug || '/'} must not contain "replace therapy"`);

    titles.add(titleStr);
    descriptions.add(meta.description);
    canonicals.add(meta.alternates.canonical);
  }

  assert(titles.size === publicSlugs.length, `All ${publicSlugs.length} public pages must have UNIQUE titles`);
  assert(descriptions.size === publicSlugs.length, `All ${publicSlugs.length} public pages must have UNIQUE descriptions`);
  assert(canonicals.size === publicSlugs.length, `All ${publicSlugs.length} public pages must have UNIQUE canonical URLs`);
  console.log('   ✅ All public routes have unique metadata, canonical URLs, and non-clinical compliance.');

  // 3. Homepage Heading Architecture (LandingPage.jsx)
  console.log('3. Testing Homepage Heading Architecture & Target Keywords (LandingPage.jsx)...');
  const landingPath = path.join(process.cwd(), 'src/views/LandingPage.jsx');
  assert(fs.existsSync(landingPath), 'LandingPage.jsx must exist');
  const landingContent = fs.readFileSync(landingPath, 'utf-8');

  assert(landingContent.includes('<h1'), 'LandingPage must contain an <h1> element');
  assert(landingContent.includes('Guided Journaling for Self-Understanding'), 'LandingPage must contain primary H1 positioning "Guided Journaling for Self-Understanding"');
  assert(landingContent.includes('Understand the Patterns Behind Your Thoughts and Emotions'), 'LandingPage must contain H2 "Understand the Patterns Behind Your Thoughts and Emotions"');
  assert(landingContent.includes('A More Structured Way to Reflect'), 'LandingPage must contain H2 "A More Structured Way to Reflect"');
  assert(landingContent.includes('Turn Everyday Experiences Into Meaningful Insights'), 'LandingPage must contain H2 "Turn Everyday Experiences Into Meaningful Insights"');
  assert(landingContent.includes('Psychology-Informed Exercises for Self-Reflection'), 'LandingPage must contain H2 "Psychology-Informed Exercises for Self-Reflection"');
  assert(landingContent.includes('Build a Better Understanding of Yourself'), 'LandingPage must contain H2 "Build a Better Understanding of Yourself"');
  console.log('   ✅ Homepage H1 and H2 heading architecture validated.');

  // 4. FAQ Content & FAQPage Schema (FaqPage.jsx)
  console.log('4. Testing FAQ Search-Intent Questions & FAQPage Schema (FaqPage.jsx)...');
  const faqPath = path.join(process.cwd(), 'src/views/FaqPage.jsx');
  assert(fs.existsSync(faqPath), 'FaqPage.jsx must exist');
  const faqContent = fs.readFileSync(faqPath, 'utf-8');

  assert(faqContent.includes('What is guided journaling?'), 'FAQ must include search question "What is guided journaling?"');
  assert(faqContent.includes('How can journaling help with self-reflection'), 'FAQ must include search question regarding self-reflection');
  assert(faqContent.includes('How do I understand my emotional patterns?'), 'FAQ must include search question regarding emotional patterns');
  assert(faqContent.includes('What is structured self-reflection?'), 'FAQ must include search question regarding structured self-reflection');
  assert(faqContent.includes('Does Ingress Within provide therapy?'), 'FAQ must include search question regarding therapy');
  assert(faqContent.includes('not a replacement for professional mental health care'), 'FAQ must include explicit non-clinical disclaimer');
  assert(faqContent.includes("'@type': 'FAQPage'"), 'FaqPage must embed FAQPage JSON-LD schema');
  console.log('   ✅ FAQ search intent questions, non-clinical disclaimer, and FAQPage schema validated.');

  // 5. Internal Links Verification Across Views
  console.log('5. Testing Internal Linking Graph Across Public Pages...');
  const pageFiles = [
    'src/views/LandingPage.jsx',
    'src/views/WhatItIsPage.jsx',
    'src/views/HowItWorksPage.jsx',
    'src/views/AboutPage.jsx',
    'src/views/PricingPage.jsx',
    'src/views/FaqPage.jsx',
    'src/views/AiDataPage.jsx',
    'src/views/ContactPage.jsx'
  ];

  for (const pageFile of pageFiles) {
    const fullPath = path.join(process.cwd(), pageFile);
    assert(fs.existsSync(fullPath), `File ${pageFile} must exist`);
    const content = fs.readFileSync(fullPath, 'utf-8');
    assert(content.includes('href="/what-it-is"') || content.includes('href="/how-it-works"') || content.includes('href="/pricing"') || content.includes('href="/faq"'), `${pageFile} must contain internal cross-links`);
  }
  console.log('   ✅ Internal linking graph validated across all public views.');

  console.log('\n==================================================');
  console.log('🎉 ALL PHASE 2 ON-PAGE SEO TESTS PASSED SUCCESSFULLY!');
  console.log('==================================================\n');
}

runOnPageSeoTests().catch(err => {
  console.error('Fatal error during On-Page SEO validation:', err);
  process.exit(1);
});
