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

async function runGuidedJournalingPillarTests() {
  console.log('=== STARTING PHASE 3 STEP 1: GUIDED JOURNALING PILLAR PAGE VALIDATION TESTS ===\n');

  // 1. Metadata & Route Intent Architecture
  console.log('1. Testing /guided-journaling Metadata & Route Intent Architecture...');
  assert(!!ROUTE_INTENT_MAP.guidedJournaling, 'guidedJournaling route intent must exist in keywordStrategy.ts');
  
  const meta = generatePageMetadata({ slug: 'guided-journaling' });
  const titleStr = typeof meta.title === 'string' ? meta.title : (meta.title as any)?.default;
  
  assert(titleStr === 'What Is Guided Journaling? | Ingress Within', `Expected title "What Is Guided Journaling? | Ingress Within", got: ${titleStr}`);
  assert(meta.description.includes('what guided journaling is') && meta.description.includes('structured self-reflection'), `Description must describe guided journaling, got: ${meta.description}`);
  assert(meta.alternates?.canonical === 'https://ingresswithin.com/guided-journaling', `Canonical URL must be https://ingresswithin.com/guided-journaling, got: ${meta.alternates?.canonical}`);
  console.log('   ✅ Metadata, route intent, and canonical URL validated.');

  // 2. Sitemap Entry Validation
  console.log('2. Testing Sitemap Inclusion (/guided-journaling)...');
  const sitemapEntries = sitemap();
  const guidedEntry = sitemapEntries.find(e => e.url === 'https://ingresswithin.com/guided-journaling');
  assert(!!guidedEntry, '/guided-journaling must exist in sitemap.js');
  assert(guidedEntry?.priority === 0.9, `Sitemap priority for /guided-journaling must be 0.9, got ${guidedEntry?.priority}`);
  assert(guidedEntry?.changeFrequency === 'monthly', `Change frequency must be monthly, got ${guidedEntry?.changeFrequency}`);
  console.log('   ✅ Sitemap entry, priority (0.9), and changeFrequency (monthly) validated.');

  // 3. Routing Registration in App.jsx
  console.log('3. Testing App.jsx Routing & Component Registration...');
  const appPath = path.join(process.cwd(), 'src/App.jsx');
  assert(fs.existsSync(appPath), 'App.jsx must exist');
  const appContent = fs.readFileSync(appPath, 'utf-8');
  assert(appContent.includes("import('./views/GuidedJournalingPage')"), 'App.jsx must lazy import GuidedJournalingPage');
  assert(appContent.includes("/guided-journaling'"), 'App.jsx handleLocationChange must match /guided-journaling path');
  assert(appContent.includes("case 'guided-journaling':"), 'App.jsx renderPage must have case for guided-journaling');
  console.log('   ✅ App.jsx client routing registration validated.');

  // 4. Page Architecture & Heading Structure (GuidedJournalingPage.jsx)
  console.log('4. Testing GuidedJournalingPage.jsx Heading Architecture & Content...');
  const pagePath = path.join(process.cwd(), 'src/views/GuidedJournalingPage.jsx');
  assert(fs.existsSync(pagePath), 'GuidedJournalingPage.jsx must exist');
  const pageContent = fs.readFileSync(pagePath, 'utf-8');

  // Single H1 Check
  const h1Matches = pageContent.match(/<h1[\s\S]*?>[\s\S]*?<\/h1>/gi);
  assert(!!h1Matches && h1Matches.length === 1, `GuidedJournalingPage must contain exactly ONE H1 tag, found: ${h1Matches?.length || 0}`);
  assert(pageContent.includes('What Is Guided Journaling?'), 'H1 text must be "What Is Guided Journaling?"');

  // Required H2 Sections
  const requiredH2s = [
    'How Is Guided Journaling Different From Regular Journaling?',
    'A More Structured Way to Reflect',
    'What Can You Explore Through Guided Journaling?',
    'Guided Journaling and Self-Reflection',
    'How Guided Journaling Can Help You Notice Patterns',
    'How Ingress Within Uses Guided Reflection',
    'Frequently Asked Questions About Guided Journaling'
  ];

  for (const h2Text of requiredH2s) {
    assert(pageContent.includes(h2Text), `GuidedJournalingPage must contain H2 section "${h2Text}"`);
  }
  console.log('   ✅ Single H1 and all 7 required H2 sections validated.');

  // 5. Non-Clinical Compliance & Therapy Disclaimer
  console.log('5. Testing Non-Clinical Compliance & Disclaimer...');
  assert(pageContent.includes('No. Ingress Within is designed for guided self-reflection and self-understanding and is not a replacement for professional mental health care.'), 'Must contain explicit non-clinical disclaimer in FAQ');
  
  const forbiddenTerms = ['cure depression', 'treat anxiety', 'diagnose depression', 'ai therapy', 'replace therapy'];
  for (const term of forbiddenTerms) {
    assert(!pageContent.toLowerCase().includes(term), `GuidedJournalingPage content must not contain forbidden clinical phrase "${term}"`);
  }
  console.log('   ✅ Non-clinical language and disclaimer compliance validated.');

  // 6. Inbound Internal Cross-Links Verification
  console.log('6. Testing Inbound Internal Links to /guided-journaling...');
  const checkViews = ['src/views/WhatItIsPage.jsx', 'src/views/HowItWorksPage.jsx', 'src/views/FaqPage.jsx'];
  for (const viewPath of checkViews) {
    const fullPath = path.join(process.cwd(), viewPath);
    assert(fs.existsSync(fullPath), `${viewPath} must exist`);
    const content = fs.readFileSync(fullPath, 'utf-8');
    assert(content.includes('href="/guided-journaling"'), `${viewPath} must contain internal link href="/guided-journaling"`);
  }
  console.log('   ✅ Inbound internal cross-links validated from WhatItIsPage, HowItWorksPage, and FaqPage.');

  console.log('\n====================================================================');
  console.log('🎉 ALL PHASE 3 STEP 1 GUIDED JOURNALING PILLAR TESTS PASSED SUCCESSFULLY!');
  console.log('====================================================================\n');
}

runGuidedJournalingPillarTests().catch(err => {
  console.error('Fatal error during Guided Journaling Pillar test suite:', err);
  process.exit(1);
});
