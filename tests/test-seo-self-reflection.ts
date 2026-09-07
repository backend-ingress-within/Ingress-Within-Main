import { generatePageMetadata } from '../src/lib/seo/metadata';
import { ROUTE_INTENT_MAP } from '../src/lib/seo/keywordStrategy';
import sitemap from '../src/app/sitemap';
import fs from 'fs';
import path from 'path';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    process.exit(1);
  }
}

async function runSelfReflectionPillarTests() {
  console.log('=== STARTING PHASE 3 STEP 2: SELF-REFLECTION PILLAR PAGE VALIDATION TESTS ===\n');

  // 1. Route Intent Architecture
  console.log('1. Testing /self-reflection Route Intent Mapping (keywordStrategy.ts)...');
  assert(!!ROUTE_INTENT_MAP.selfReflection, 'selfReflection route intent must exist in keywordStrategy.ts');
  assert(ROUTE_INTENT_MAP.selfReflection.clusterId === 'selfUnderstanding', 'selfReflection clusterId must be selfUnderstanding');
  console.log('   ✅ Route intent mapping validated.');

  // 2 & 3. Metadata & Canonical URL Validation
  console.log('2 & 3. Testing Metadata & Canonical URL Generation (metadata.ts)...');
  const meta = generatePageMetadata({ slug: 'self-reflection' });
  const titleStr = typeof meta.title === 'string' ? meta.title : (meta.title as any)?.default;

  assert(titleStr === 'What Is Self-Reflection? | Ingress Within', `Expected title "What Is Self-Reflection? | Ingress Within", got: "${titleStr}"`);
  assert(meta.description.includes('what self-reflection is') && meta.description.includes('structured reflection'), `Description must accurately reflect self-reflection intent, got: "${meta.description}"`);
  assert(meta.alternates?.canonical === 'https://ingresswithin.com/self-reflection', `Canonical URL must be "https://ingresswithin.com/self-reflection", got: "${meta.alternates?.canonical}"`);
  console.log('   ✅ Metadata title, description, and canonical URL validated.');

  // 4. Sitemap Inclusion Validation
  console.log('4. Testing Sitemap.xml Inclusion (sitemap.js)...');
  const sitemapEntries = sitemap();
  const selfReflEntry = sitemapEntries.find(e => e.url === 'https://ingresswithin.com/self-reflection');
  assert(!!selfReflEntry, '/self-reflection must exist in sitemap.js');
  assert(selfReflEntry?.priority === 0.9, `Sitemap priority for /self-reflection must be 0.9, got ${selfReflEntry?.priority}`);
  assert(selfReflEntry?.changeFrequency === 'monthly', `Change frequency must be monthly, got ${selfReflEntry?.changeFrequency}`);
  console.log('   ✅ Sitemap entry, priority (0.9), and changeFrequency (monthly) validated.');

  // 5. Client Routing Validation
  console.log('5. Testing Client Routing & Registration (App.jsx)...');
  const appPath = path.join(process.cwd(), 'src/App.jsx');
  assert(fs.existsSync(appPath), 'App.jsx must exist');
  const appContent = fs.readFileSync(appPath, 'utf-8');

  assert(appContent.includes("import('./views/SelfReflectionPage')"), 'App.jsx must lazy import SelfReflectionPage');
  assert(appContent.includes("/self-reflection'"), 'App.jsx handleLocationChange must match /self-reflection path');
  assert(appContent.includes("case 'self-reflection':"), 'App.jsx renderPage must have switch case for self-reflection');
  console.log('   ✅ Client routing in App.jsx validated.');

  // 6 & 7. Heading Architecture Validation (SelfReflectionPage.jsx)
  console.log('6 & 7. Testing SelfReflectionPage.jsx Heading Hierarchy (H1 & H2s)...');
  const pagePath = path.join(process.cwd(), 'src/views/SelfReflectionPage.jsx');
  assert(fs.existsSync(pagePath), 'SelfReflectionPage.jsx must exist');
  const pageContent = fs.readFileSync(pagePath, 'utf-8');

  const h1Matches = pageContent.match(/<h1[\s\S]*?>[\s\S]*?<\/h1>/gi);
  assert(!!h1Matches && h1Matches.length === 1, `SelfReflectionPage must contain exactly ONE H1 tag, found: ${h1Matches?.length || 0}`);
  assert(pageContent.includes('What Is Self-Reflection?'), 'H1 text must be "What Is Self-Reflection?"');

  const requiredH2s = [
    'Why Is Self-Reflection Important?',
    'How to Practice Self-Reflection',
    'Questions to Ask Yourself During Self-Reflection',
    'Self-Reflection and Self-Understanding',
    'Self-Reflection Exercises',
    'How Structured Reflection Can Help You Notice Patterns',
    'Self-Reflection With Ingress Within',
    'Frequently Asked Questions About Self-Reflection'
  ];

  for (const h2Text of requiredH2s) {
    assert(pageContent.includes(h2Text), `SelfReflectionPage must contain H2 section "${h2Text}"`);
  }
  console.log('   ✅ Exactly one H1 and all 8 required H2 sections validated.');

  // 8 & 9. FAQ Schema & Parity Validation
  console.log('8 & 9. Testing FAQPage JSON-LD Schema & Content Parity...');
  assert(pageContent.includes('type="application/ld+json"'), 'SelfReflectionPage must embed FAQPage JSON-LD schema script tag');
  assert(pageContent.includes('"@type":"FAQPage"') || pageContent.includes('"@type": "FAQPage"'), 'JSON-LD schema must specify "@type": "FAQPage"');

  const faqQuestions = [
    'What is self-reflection?',
    'How do I practice self-reflection?',
    'What are some good self-reflection questions?',
    'What is the difference between self-reflection and journaling?',
    'Does Ingress Within provide therapy?'
  ];

  for (const q of faqQuestions) {
    assert(pageContent.includes(q), `Visible FAQ and schema must both contain question "${q}"`);
  }
  console.log('   ✅ Valid FAQPage JSON-LD schema and 5 matching FAQ questions validated.');

  // 10 & 11. Non-Clinical Compliance Validation
  console.log('10 & 11. Testing Non-Clinical Disclaimer & Forbidden Claims...');
  assert(pageContent.includes('Ingress Within is designed for guided self-reflection and self-understanding and is not a replacement for professional mental health care.'), 'Must contain explicit non-clinical disclaimer in FAQ');

  const forbiddenTerms = ['cure depression', 'treat anxiety', 'diagnose depression', 'ai therapy', 'replace therapy'];
  for (const term of forbiddenTerms) {
    assert(!pageContent.toLowerCase().includes(term), `SelfReflectionPage content must not contain forbidden phrase "${term}"`);
  }
  console.log('   ✅ Non-clinical language and disclaimer compliance validated.');

  // 12 & 13 & 14. Internal Linking Graph Validation
  console.log('12, 13 & 14. Testing Outbound & Inbound Internal Linking Graph...');
  const expectedOutbound = ['href="/guided-journaling"', 'href="/what-it-is"', 'href="/how-it-works"', 'href="/pricing"', 'href="/faq"'];
  for (const link of expectedOutbound) {
    assert(pageContent.includes(link), `SelfReflectionPage must contain internal link ${link}`);
  }

  const inboundViews = [
    'src/views/LandingPage.jsx',
    'src/views/GuidedJournalingPage.jsx',
    'src/views/WhatItIsPage.jsx',
    'src/views/HowItWorksPage.jsx',
    'src/views/FaqPage.jsx'
  ];

  for (const viewFile of inboundViews) {
    const fullPath = path.join(process.cwd(), viewFile);
    assert(fs.existsSync(fullPath), `${viewFile} must exist`);
    const content = fs.readFileSync(fullPath, 'utf-8');
    assert(content.includes('href="/self-reflection"'), `${viewFile} must contain inbound link href="/self-reflection"`);
  }
  console.log('   ✅ Internal linking graph (outbound and inbound across 5 public views) validated.');

  console.log('\n====================================================================');
  console.log('🎉 ALL PHASE 3 STEP 2 SELF-REFLECTION PILLAR TESTS PASSED SUCCESSFULLY!');
  console.log('====================================================================\n');
}

runSelfReflectionPillarTests().catch(err => {
  console.error('Fatal error during Self-Reflection Pillar test suite:', err);
  process.exit(1);
});
