export const dynamic = 'force-static';
export const revalidate = 86400;

export async function GET() {
  const robotsTxt = `User-Agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /dashboard
Disallow: /write
Disallow: /write/
Disallow: /interventions
Disallow: /reports
Disallow: /patterns
Disallow: /vocab
Disallow: /knowledge
Disallow: /settings
Disallow: /session/
Disallow: /onboarding
Disallow: /exercise
Disallow: /exercises
Disallow: /assessment
Disallow: /modules
Disallow: /support
Disallow: /threads
Disallow: /thread/
Disallow: /entry/
Disallow: /test
Disallow: /test/

Content-Signal: search=yes, ai-train=no

Sitemap: https://ingresswithin.com/sitemap.xml
`;

  return new Response(robotsTxt, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=43200',
    },
  });
}
