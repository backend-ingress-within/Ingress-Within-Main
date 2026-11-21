import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getPageMarkdown } from './lib/seo/agentMarkdown';

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files with extensions (e.g. .png, .jpg, .svg, .webp)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
};

const RFC_8288_LINK_HEADER = '<https://ingresswithin.com/llms.txt>; rel="describedby"; type="text/markdown", </llms.txt>; rel="describedby"';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const acceptHeader = request.headers.get('accept') || '';

  // 1. Content Negotiation: Agent requesting Markdown representation (RFC 7763)
  const isMarkdownRequested =
    acceptHeader.includes('text/markdown') ||
    acceptHeader.includes('text/x-markdown');

  // Skip API routes from markdown content negotiation
  if (isMarkdownRequested && !pathname.startsWith('/api/')) {
    const markdownContent = getPageMarkdown(pathname);

    return new NextResponse(markdownContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Vary': 'Accept',
        'Link': RFC_8288_LINK_HEADER,
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  }

  // 2. Default flow: emit RFC 8288 Link headers and Vary: Accept on public responses
  const response = NextResponse.next();

  response.headers.set('Link', RFC_8288_LINK_HEADER);
  response.headers.append('Vary', 'Accept');

  return response;
}
