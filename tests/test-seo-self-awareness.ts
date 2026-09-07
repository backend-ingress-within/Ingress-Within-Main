import { generatePageMetadata } from '../src/lib/seo/metadata';
import { ROUTE_INTENT_MAP, KEYWORD_CLUSTERS } from '../src/lib/seo/keywordStrategy';
import sitemap from '../src/app/sitemap';
import fs from 'fs';
import path from 'path';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    process.exit(1);
  }
}

async function runSelfAwarenessPillarTests() {
  console.log('=== STARTING PHASE 3 STEP 4: SELF-AWARENESS PILLAR PAGE VALIDATION TESTS ===\n');

  // 1 & 2. Route Intent Architecture & Distinction
  console.log('1 & 2. Testing /self-awareness Route Intent Mapping & Cluster Distinction...');
  assert(!!ROUTE_INTENT_MAP.selfAwareness, 'selfAwareness route intent must exist in keywordStrategy.ts');
  assert(ROUTE_INTENT_MAP.selfAwareness.clusterId === 'selfUnderstanding', 'selfAwareness clusterId must be selfUnderstanding');
  
  // Verify cluster distinction across other pillar pages
  assert(ROUTE_INTENT_MAP.guidedJournaling.clusterId !== ROUTE_INTENT_MAP.selfAwareness.clusterId, 'guidedJournaling and selfAwareness must have distinct clusters');
  assert(ROUTE_INTENT_MAP.emotionalPatterns.clusterId !== ROUTE_INTENT_MAP.selfAwareness.clusterId, 'emotionalPatterns and selfAwareness must have distinct clusters');
  console.log('   ✅ Route intent mapping and keyword cluster distinction validated.');

  // 3, 4 & 5. Metadata, Title & Canonical URL Generation
  console.log('3, 4 & 5. Testing Metadata, Title & Canonical URL Generation (metadata.ts)...');
  const meta = generatePageMetadata({ slug: 'self-awareness' });
  const titleStr = typeof meta.title === 'string' ? meta.title : (meta.title as any)?.default;

  assert(titleStr === 'How to Become More Self-Aware | Ingress Within', `Expected title "How to Become More Self-Aware | Ingress Within", got: "${titleStr}"`);
  assert(meta.description.includes('self-awareness') && meta.description.includes('self-understanding'), `Description must describe self-awareness and self-understanding, got: "${meta.description}"`);
  assert(meta.alternates?.canonical === 'https://ingresswithin.com/self-awareness', `Canonical URL must be "https://ingresswithin.com/self-awareness", got: "${meta.alternates?.canonical}"`);
  console.log('   ✅ Metadata title, description, and canonical URL validated.');

  // 6, 7 & 8. Sitemap.xml Inclusion, Priority & Change Frequency
  console.log('6, 7 & 8. Testing Sitemap.xml Inclusion (sitemap.js)...');
  const sitemapEntries = sitemap();
  const awarenessEntry = sitemapEntries.find(e => e.url === 'https://ingresswithin.com/self-awareness');
  assert(!!awarenessEntry, '/self-awareness must exist in sitemap.js');
  assert(awarenessEntry?.priority === 0.9, `Sitemap priority for /self-awareness must be 0.9, got ${awarenessEntry?.priority}`);
  assert(awarenessEntry?.changeFrequency === 'monthly', `Change frequency must be monthly, got ${awarenessEntry?.changeFrequency}`);
  console.log('   ✅ Sitemap entry, priority (0.9), and changeFrequency (monthly) validated.');

  // 9. Client Routing Validation
  console.log('9. Testing Client Routing & Registration (App.jsx)...');
  const appPath = path.join(process.cwd(), 'src/App.jsx');
  assert(fs.existsSync(appPath), 'App.jsx must exist');
  const appContent = fs.readFileSync(appPath, 'utf-8');

  assert(appContent.includes("import('./views/SelfAwarenessPage')"), 'App.jsx must lazy import SelfAwarenessPage');
  assert(appContent.includes("/self-awareness'"), 'App.jsx handleLocationChange must match /self-awareness path');
  assert(appContent.includes("case 'self-awareness':"), 'App.jsx renderPage must have switch case for self-awareness');
  console.log('   ✅ Client routing in App.jsx validated.');

  // 10 & 11. Heading Architecture Validation (SelfAwarenessPage.jsx)
  console.log('10 & 11. Testing SelfAwarenessPage.jsx Heading Hierarchy (H1 & H2s)...');
  const pagePath = path.join(process.cwd(), 'src/views/SelfAwarenessPage.jsx');
  assert(fs.existsSync(pagePath), 'SelfAwarenessPage.jsx must exist');
  const pageContent = fs.readFileSync(pagePath, 'utf-8');

  const h1Matches = pageContent.match(/<h1[\s\S]*?>[\s\S]*?<\/h1>/gi);
  assert(!!h1Matches && h1Matches.length === 1, `SelfAwarenessPage must contain exactly ONE H1 tag, found: ${h1Matches?.length || 0}`);
  assert(pageContent.includes('How to Become More Self-Aware'), 'H1 text must be "How to Become More Self-Aware"');

  const requiredH2s = [
    'What Is Self-Awareness?',
    'Why Is Self-Awareness Important?',
    'Examples of Self-Awareness',
    'How to Develop Self-Awareness',
    'Questions That Can Help You Understand Yourself Better',
    'Self-Awareness and Emotional Patterns',
    'Self-Awareness and Self-Reflection',
    'Practical Self-Awareness Exercises',
    'How Ingress Within Supports Self-Understanding',
    'Frequently Asked Questions About Self-Awareness'
  ];

  for (const h2Text of requiredH2s) {
    assert(pageContent.includes(h2Text), `SelfAwarenessPage must contain H2 section "${h2Text}"`);
  }
  console.log('   ✅ Exactly one H1 and all 10 required H2 sections validated.');

  // 12 & 13. FAQ Schema & Parity Validation
  console.log('12 & 13. Testing FAQPage JSON-LD Schema & Content Parity...');
  assert(pageContent.includes('type="application/ld+json"'), 'SelfAwarenessPage must embed FAQPage JSON-LD schema script tag');
  assert(pageContent.includes('"@type":"FAQPage"') || pageContent.includes('"@type": "FAQPage"'), 'JSON-LD schema must specify "@type": "FAQPage"');

  const faqQuestions = [
    'What is self-awareness?',
    'How can I become more self-aware?',
    'What are examples of self-awareness?',
    'Can journaling support self-awareness?',
    'What is the difference between self-awareness and self-reflection?',
    'How do emotional patterns relate to self-awareness?',
    'Does Ingress Within provide therapy?'
  ];

  for (const q of faqQuestions) {
    assert(pageContent.includes(q), `Visible FAQ and schema must both contain question "${q}"`);
  }
  console.log('   ✅ Valid FAQPage JSON-LD schema and 7 matching FAQ questions validated.');

  // 14 & 15. Non-Clinical Compliance Validation
  console.log('14 & 15. Testing Non-Clinical Disclaimer & Forbidden Claims...');
  assert(pageContent.includes('Ingress Within is designed for guided self-reflection and self-understanding and is not a replacement for professional mental health care.'), 'Must contain explicit non-clinical disclaimer in FAQ');

  const forbiddenTerms = ['cure depression', 'treat anxiety', 'diagnose depression', 'ai therapy', 'replace therapy', 'heal trauma', 'mental illness detection'];
  for (const term of forbiddenTerms) {
    assert(!pageContent.toLowerCase().includes(term), `SelfAwarenessPage content must not contain forbidden phrase "${term}"`);
  }
  console.log('   ✅ Non-clinical language and disclaimer compliance validated.');

  // 16, 17 & 18. Internal Linking Graph Validation
  console.log('16, 17 & 18. Testing Outbound & Inbound Internal Linking Graph...');
  const expectedOutbound = [
    'href="/guided-journaling"',
    'href="/self-reflection"',
    'href="/emotional-patterns"',
    'href="/what-it-is"',
    'href="/how-it-works"',
    'href="/pricing"',
    'href="/faq"'
  ];
  for (const link of expectedOutbound) {
    assert(pageContent.includes(link), `SelfAwarenessPage must contain internal link ${link}`);
  }

  const inboundViews = [
    'src/views/LandingPage.jsx',
    'src/views/GuidedJournalingPage.jsx',
    'src/views/SelfReflectionPage.jsx',
    'src/views/EmotionalPatternsPage.jsx',
    'src/views/WhatItIsPage.jsx',
    'src/views/HowItWorksPage.jsx',
    'src/views/FaqPage.jsx'
  ];

  for (const viewFile of inboundViews) {
    const fullPath = path.join(process.cwd(), viewFile);
    assert(fs.existsSync(fullPath), `${viewFile} must exist`);
    const content = fs.readFileSync(fullPath, 'utf-8');
    assert(content.includes('href="/self-awareness"'), `${viewFile} must contain inbound link href="/self-awareness"`);
  }
  console.log('   ✅ Internal linking graph (outbound and inbound across 7 public views) validated.');

  console.log('\n====================================================================');
  console.log('🎉 ALL PHASE 3 STEP 4 SELF-AWARENESS PILLAR TESTS PASSED SUCCESSFULLY!');
  console.log('====================================================================\n');
}

runSelfAwarenessPillarTests().catch(err => {
  console.error('Fatal error during Self-Awareness Pillar test suite:', err);
  process.exit(1);
});
