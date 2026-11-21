import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { NextRequest } from 'next/server';
import { middleware } from '../src/middleware';
import { GET as getRobots } from '../src/app/robots.txt/route';
import { GET as getLlms } from '../src/app/llms.txt/route';
import { GET as getMcpServerCard } from '../src/app/.well-known/mcp/server-card.json/route';

let passed = 0;
let failed = 0;

function assert(condition: boolean, desc: string) {
  if (condition) {
    console.log(`  ✓ [PASS] ${desc}`);
    passed++;
  } else {
    console.error(`  ✗ [FAIL] ${desc}`);
    failed++;
  }
}

async function runSuite() {
  console.log('================================================================');
  console.log('  INGRESS WITHIN — AGENT READINESS & LLM CAPABILITIES SUITE     ');
  console.log('================================================================\n');

  // 1. Content Signals in robots.txt
  console.log('--- 1. Goal: Content Signals Declared in robots.txt ---');
  const robotsResponse = await getRobots();
  const robotsText = await robotsResponse.text();
  assert(robotsResponse.status === 200, 'GET /robots.txt returns status 200');
  assert(
    robotsText.includes('Content-Signal: search=yes, ai-train=no'),
    'robots.txt contains explicit "Content-Signal: search=yes, ai-train=no"'
  );
  assert(
    robotsText.includes('Sitemap: https://ingresswithin.com/sitemap.xml'),
    'robots.txt contains sitemap URL'
  );
  assert(
    existsSync(join(process.cwd(), 'public', 'robots.txt')),
    'public/robots.txt static file exists for CDN/static serving'
  );

  // 2. Organization / LocalBusiness Schema
  console.log('\n--- 2. Goal: Organization & LocalBusiness Schema Complete ---');
  const structuredDataCode = readFileSync(
    join(process.cwd(), 'src', 'components', 'seo', 'StructuredData.jsx'),
    'utf-8'
  );
  assert(
    structuredDataCode.includes("'telephone': '+91 89556 05569'"),
    'StructuredData includes phone number (+91 89556 05569)'
  );
  assert(
    structuredDataCode.includes("'@type': 'PostalAddress'"),
    'StructuredData includes address with PostalAddress schema'
  );
  assert(
    structuredDataCode.includes("'addressLocality': 'Mumbai'") &&
    structuredDataCode.includes("'addressRegion': 'Maharashtra'"),
    'StructuredData includes Mumbai, Maharashtra location'
  );
  assert(
    structuredDataCode.includes("'@type': 'LocalBusiness'") &&
    structuredDataCode.includes("'@type': 'Organization'"),
    'StructuredData declares both Organization and LocalBusiness schemas'
  );

  // 3. About, contact and legal pages linked
  console.log('\n--- 3. Goal: About, Contact & Legal Pages Linked from Homepage ---');
  const footerCode = readFileSync(
    join(process.cwd(), 'src', 'components', 'public-v2', 'PublicFooter.jsx'),
    'utf-8'
  );
  const navbarCode = readFileSync(
    join(process.cwd(), 'src', 'components', 'public-v2', 'EditorialNavbar.jsx'),
    'utf-8'
  );
  assert(
    footerCode.includes('href="/contact"') && footerCode.includes('Contact'),
    'PublicFooter links directly to /contact'
  );
  assert(
    footerCode.includes('href="/about"') && footerCode.includes('About'),
    'PublicFooter links directly to /about'
  );
  assert(
    footerCode.includes('href="/privacy-policy"'),
    'PublicFooter links directly to /privacy-policy'
  );
  assert(
    footerCode.includes('href="/terms"'),
    'PublicFooter links directly to /terms'
  );
  assert(
    navbarCode.includes("path: '/contact'"),
    'EditorialNavbar navigation items include /contact'
  );

  // 4. llms.txt served
  console.log('\n--- 4. Goal: llms.txt Served ---');
  const llmsResponse = await getLlms();
  const llmsText = await llmsResponse.text();
  assert(llmsResponse.status === 200, 'GET /llms.txt returns status 200');
  assert(
    llmsText.startsWith('# Ingress Within'),
    'llms.txt starts with H1 title "# Ingress Within"'
  );
  assert(
    llmsText.includes('> One connected platform'),
    'llms.txt includes blockquote project summary'
  );
  assert(
    llmsText.includes('## Core Sections') && llmsText.includes('## Trust & Safety'),
    'llms.txt structures sections with H2 headings per llmstxt.org'
  );
  assert(
    llmsText.includes('- [Contact Support](https://ingresswithin.com/contact)') &&
    llmsText.includes('- [Therapy Care](https://ingresswithin.com/therapy)'),
    'llms.txt links key operational endpoints'
  );
  assert(
    existsSync(join(process.cwd(), 'public', 'llms.txt')),
    'public/llms.txt static fallback file exists'
  );

  // 5. Serves Markdown when an agent asks for it
  console.log('\n--- 5. Goal: Serves Markdown for Accept: text/markdown ---');
  const reqWithMarkdown = new NextRequest('https://ingresswithin.com/', {
    headers: {
      accept: 'text/markdown, text/html;q=0.9',
    },
  });
  const markdownRes = middleware(reqWithMarkdown);
  const markdownBody = await markdownRes.text();
  const contentType = markdownRes.headers.get('content-type') || '';
  assert(markdownRes.status === 200, 'Agent markdown request returns status 200');
  assert(
    contentType.includes('text/markdown'),
    `Returns Content-Type text/markdown (got: ${contentType})`
  );
  assert(
    markdownBody.includes('# Ingress Within') && markdownBody.includes('## Pathways of Care'),
    'Returns rich, token-efficient Markdown content for homepage'
  );
  assert(
    (markdownRes.headers.get('vary') || '').includes('Accept'),
    'Returns Vary: Accept header for cache-control'
  );

  // 6. Homepage advertises resources via Link headers
  console.log('\n--- 6. Goal: RFC 8288 Link Headers Advertised on Homepage ---');
  const reqNormal = new NextRequest('https://ingresswithin.com/', {
    headers: {
      accept: 'text/html,application/xhtml+xml',
    },
  });
  const normalRes = middleware(reqNormal);
  const linkHeader = normalRes.headers.get('link') || '';
  assert(
    linkHeader.includes('rel="describedby"') && linkHeader.includes('llms.txt'),
    `Link header emits rel="describedby" pointing to llms.txt (got: ${linkHeader})`
  );
  assert(
    (normalRes.headers.get('vary') || '').includes('Accept'),
    'Normal request includes Vary: Accept header'
  );

  // 7. MCP Server Card published
  console.log('\n--- 7. Goal: MCP Server Card Published at /.well-known/mcp/server-card.json ---');
  const mcpResponse = await getMcpServerCard();
  const mcpJson = await mcpResponse.json();
  assert(mcpResponse.status === 200, 'GET /.well-known/mcp/server-card.json returns status 200');
  assert(
    Boolean(mcpJson.name) && typeof mcpJson.name === 'string',
    `Server Card contains name: "${mcpJson.name}"`
  );
  assert(
    Boolean(mcpJson.version) && typeof mcpJson.version === 'string',
    `Server Card contains version: "${mcpJson.version}"`
  );
  assert(
    Boolean(mcpJson.endpoint) && mcpJson.endpoint.startsWith('https://'),
    `Server Card contains valid endpoint: "${mcpJson.endpoint}"`
  );
  assert(
    Boolean(mcpJson.capabilities) && typeof mcpJson.capabilities === 'object',
    'Server Card declares capabilities object'
  );
  assert(
    existsSync(join(process.cwd(), 'public', '.well-known', 'mcp', 'server-card.json')),
    'public/.well-known/mcp/server-card.json static file exists'
  );
  assert(
    existsSync(join(process.cwd(), 'public', '.well-known', 'mcp.json')),
    'public/.well-known/mcp.json SEP-2127 static file exists'
  );

  // 8. WebMCP in-browser tools registered & declarative forms annotated
  console.log('\n--- 8. Goal: Site Exposes WebMCP Tools to In-Browser Agents ---');
  const webMcpCode = readFileSync(
    join(process.cwd(), 'src', 'components', 'seo', 'WebMcpTools.jsx'),
    'utf-8'
  );
  assert(
    webMcpCode.includes('registerTool') && webMcpCode.includes('navigator.modelContext'),
    'WebMcpTools calls navigator.modelContext.registerTool() on page load'
  );
  assert(
    webMcpCode.includes('document.modelContext'),
    'WebMcpTools supports document.modelContext.registerTool() for W3C draft spec'
  );
  assert(
    webMcpCode.includes('toolname="search_care_pathways"') &&
    webMcpCode.includes('tooldescription="'),
    'WebMcpTools renders declarative HTML forms annotated with toolname and tooldescription'
  );
  assert(
    webMcpCode.includes('inputSchema:') && webMcpCode.includes('execute:'),
    'Registered WebMCP tools specify name, description, inputSchema, and execute callback'
  );
  const layoutCode = readFileSync(
    join(process.cwd(), 'src', 'app', 'layout.jsx'),
    'utf-8'
  );
  assert(
    layoutCode.includes('<WebMcpTools'),
    'Root layout mounts WebMcpTools globally on all pages'
  );

  console.log('\n================================================================');
  console.log(` RESULTS: ${passed} passed, ${failed} failed (${passed + failed} total)`);
  console.log('================================================================\n');

  if (failed > 0) process.exit(1);
}

runSuite().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
