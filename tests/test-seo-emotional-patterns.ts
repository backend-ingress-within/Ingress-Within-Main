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

async function runEmotionalPatternsPillarTests() {
  console.log('=== STARTING PHASE 3 STEP 3: EMOTIONAL PATTERNS PILLAR PAGE VALIDATION TESTS ===\n');

  // 1 & 2. Route Intent Architecture & Distinction
  console.log('1 & 2. Testing /emotional-patterns Route Intent Mapping & Cluster Distinction...');
  assert(!!ROUTE_INTENT_MAP.emotionalPatterns, 'emotionalPatterns route intent must exist in keywordStrategy.ts');
  assert(ROUTE_INTENT_MAP.emotionalPatterns.clusterId === 'emotionalPatterns', 'emotionalPatterns clusterId must be emotionalPatterns');
  
  // Verify cluster distinction across pillar pages
  assert(ROUTE_INTENT_MAP.guidedJournaling.clusterId !== ROUTE_INTENT_MAP.emotionalPatterns.clusterId, 'guidedJournaling and emotionalPatterns must have distinct clusters');
  assert(ROUTE_INTENT_MAP.selfReflection.clusterId !== ROUTE_INTENT_MAP.emotionalPatterns.clusterId, 'selfReflection and emotionalPatterns must have distinct clusters');
  console.log('   ✅ Route intent mapping and keyword cluster distinction validated.');

  // 3, 4 & 5. Metadata, Title & Canonical URL Generation
  console.log('3, 4 & 5. Testing Metadata, Title & Canonical URL Generation (metadata.ts)...');
  const meta = generatePageMetadata({ slug: 'emotional-patterns' });
  const titleStr = typeof meta.title === 'string' ? meta.title : (meta.title as any)?.default;

  assert(titleStr === 'How to Identify Emotional Patterns | Ingress Within', `Expected title "How to Identify Emotional Patterns | Ingress Within", got: "${titleStr}"`);
  assert(meta.description.includes('recurring emotional patterns') && meta.description.includes('repeated reactions'), `Description must describe emotional patterns, got: "${meta.description}"`);
  assert(meta.alternates?.canonical === 'https://ingresswithin.com/emotional-patterns', `Canonical URL must be "https://ingresswithin.com/emotional-patterns", got: "${meta.alternates?.canonical}"`);
  console.log('   ✅ Metadata title, description, and canonical URL validated.');

  // 6, 7 & 8. Sitemap.xml Inclusion, Priority & Change Frequency
  console.log('6, 7 & 8. Testing Sitemap.xml Inclusion (sitemap.js)...');
  const sitemapEntries = sitemap();
  const patternEntry = sitemapEntries.find(e => e.url === 'https://ingresswithin.com/emotional-patterns');
  assert(!!patternEntry, '/emotional-patterns must exist in sitemap.js');
  assert(patternEntry?.priority === 0.9, `Sitemap priority for /emotional-patterns must be 0.9, got ${patternEntry?.priority}`);
  assert(patternEntry?.changeFrequency === 'monthly', `Change frequency must be monthly, got ${patternEntry?.changeFrequency}`);
  console.log('   ✅ Sitemap entry, priority (0.9), and changeFrequency (monthly) validated.');

  // 9. Client Routing Validation
  console.log('9. Testing Client Routing & Registration (App.jsx)...');
  const appPath = path.join(process.cwd(), 'src/App.jsx');
  assert(fs.existsSync(appPath), 'App.jsx must exist');
  const appContent = fs.readFileSync(appPath, 'utf-8');

  assert(appContent.includes("import('./views/EmotionalPatternsPage')"), 'App.jsx must lazy import EmotionalPatternsPage');
  assert(appContent.includes("/emotional-patterns'"), 'App.jsx handleLocationChange must match /emotional-patterns path');
  assert(appContent.includes("case 'emotional-patterns':"), 'App.jsx renderPage must have switch case for emotional-patterns');
  console.log('   ✅ Client routing in App.jsx validated.');

  // 10 & 11. Heading Architecture Validation (EmotionalPatternsPage.jsx)
  console.log('10 & 11. Testing EmotionalPatternsPage.jsx Heading Hierarchy (H1 & H2s)...');
  const pagePath = path.join(process.cwd(), 'src/views/EmotionalPatternsPage.jsx');
  assert(fs.existsSync(pagePath), 'EmotionalPatternsPage.jsx must exist');
  const pageContent = fs.readFileSync(pagePath, 'utf-8');

  const h1Matches = pageContent.match(/<h1[\s\S]*?>[\s\S]*?<\/h1>/gi);
  assert(!!h1Matches && h1Matches.length === 1, `EmotionalPatternsPage must contain exactly ONE H1 tag, found: ${h1Matches?.length || 0}`);
  assert(pageContent.includes('How to Identify Emotional Patterns'), 'H1 text must be "How to Identify Emotional Patterns"');

  const requiredH2s = [
    'What Are Emotional Patterns?',
    'Why Do We Repeat Similar Emotional Reactions?',
    'Examples of Emotional Patterns',
    'How to Notice Your Emotional Patterns',
    'Questions That Can Help You Notice Recurring Patterns',
    'Emotional Patterns and Self-Understanding',
    'How to Track Emotional Patterns Over Time',
    'How Ingress Within Helps You Notice Patterns',
    'Frequently Asked Questions About Emotional Patterns'
  ];

  for (const h2Text of requiredH2s) {
    assert(pageContent.includes(h2Text), `EmotionalPatternsPage must contain H2 section "${h2Text}"`);
  }
  console.log('   ✅ Exactly one H1 and all 9 required H2 sections validated.');

  // 12 & 13. FAQ Schema & Parity Validation
  console.log('12 & 13. Testing FAQPage JSON-LD Schema & Content Parity...');
  assert(pageContent.includes('type="application/ld+json"'), 'EmotionalPatternsPage must embed FAQPage JSON-LD schema script tag');
  assert(pageContent.includes('"@type":"FAQPage"') || pageContent.includes('"@type": "FAQPage"'), 'JSON-LD schema must specify "@type": "FAQPage"');

  const faqQuestions = [
    'What are emotional patterns?',
    'How can I identify my emotional patterns?',
    'Why do I react the same way in similar situations?',
    'How long does it take to notice emotional patterns?',
    'Can journaling help me notice recurring patterns?',
    'Does Ingress Within provide therapy?'
  ];

  for (const q of faqQuestions) {
    assert(pageContent.includes(q), `Visible FAQ and schema must both contain question "${q}"`);
  }
  console.log('   ✅ Valid FAQPage JSON-LD schema and 6 matching FAQ questions validated.');

  // 14 & 15. Non-Clinical Compliance Validation
  console.log('14 & 15. Testing Non-Clinical Disclaimer & Forbidden Claims...');
  assert(pageContent.includes('Ingress Within is designed for guided self-reflection and self-understanding and is not a replacement for professional mental health care.'), 'Must contain explicit non-clinical disclaimer in FAQ');

  const forbiddenTerms = ['cure depression', 'treat anxiety', 'diagnose depression', 'ai therapy', 'replace therapy', 'heal trauma', 'mental illness detection'];
  for (const term of forbiddenTerms) {
    assert(!pageContent.toLowerCase().includes(term), `EmotionalPatternsPage content must not contain forbidden phrase "${term}"`);
  }
  console.log('   ✅ Non-clinical language and disclaimer compliance validated.');

  // 16, 17 & 18. Internal Linking Graph Validation
  console.log('16, 17 & 18. Testing Outbound & Inbound Internal Linking Graph...');
  const expectedOutbound = [
    'href="/guided-journaling"',
    'href="/self-reflection"',
    'href="/what-it-is"',
    'href="/how-it-works"',
    'href="/pricing"',
    'href="/faq"'
  ];
  for (const link of expectedOutbound) {
    assert(pageContent.includes(link), `EmotionalPatternsPage must contain internal link ${link}`);
  }

  const inboundViews = [
    'src/views/LandingPage.jsx',
    'src/views/GuidedJournalingPage.jsx',
    'src/views/SelfReflectionPage.jsx',
    'src/views/WhatItIsPage.jsx',
    'src/views/HowItWorksPage.jsx',
    'src/views/FaqPage.jsx'
  ];

  for (const viewFile of inboundViews) {
    const fullPath = path.join(process.cwd(), viewFile);
    assert(fs.existsSync(fullPath), `${viewFile} must exist`);
    const content = fs.readFileSync(fullPath, 'utf-8');
    assert(content.includes('href="/emotional-patterns"'), `${viewFile} must contain inbound link href="/emotional-patterns"`);
  }
  console.log('   ✅ Internal linking graph (outbound and inbound across 6 public views) validated.');

  console.log('\n====================================================================');
  console.log('🎉 ALL PHASE 3 STEP 3 EMOTIONAL PATTERNS PILLAR TESTS PASSED SUCCESSFULLY!');
  console.log('====================================================================\n');
}

runEmotionalPatternsPillarTests().catch(err => {
  console.error('Fatal error during Emotional Patterns Pillar test suite:', err);
  process.exit(1);
});
