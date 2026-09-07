import { ROUTE_INTENT_MAP } from './keywordStrategy';

export interface RouteMetadataOptions {
  slug?: string | string[];
}

const BASE_URL = 'https://ingresswithin.com';
const DEFAULT_IMAGE = '/og-image.png';

/**
 * Generates unique Next.js Metadata for any public route.
 */
export function generatePageMetadata({ slug }: RouteMetadataOptions = {}) {
  let routeKey = 'home';
  
  if (Array.isArray(slug)) {
    const rawPath = slug.join('/').toLowerCase();
    if (rawPath === 'what-it-is') routeKey = 'whatItIs';
    else if (rawPath === 'how-it-works') routeKey = 'howItWorks';
    else if (rawPath === 'about') routeKey = 'about';
    else if (rawPath === 'pricing') routeKey = 'pricing';
    else if (rawPath === 'faq') routeKey = 'faq';
    else if (rawPath === 'ai-data') routeKey = 'aiData';
    else if (rawPath === 'contact') routeKey = 'contact';
    else if (rawPath === 'auth') routeKey = 'auth';
  } else if (typeof slug === 'string') {
    const rawPath = slug.toLowerCase();
    if (rawPath === 'what-it-is') routeKey = 'whatItIs';
    else if (rawPath === 'how-it-works') routeKey = 'howItWorks';
    else if (rawPath === 'about') routeKey = 'about';
    else if (rawPath === 'pricing') routeKey = 'pricing';
    else if (rawPath === 'faq') routeKey = 'faq';
    else if (rawPath === 'ai-data') routeKey = 'aiData';
    else if (rawPath === 'contact') routeKey = 'contact';
    else if (rawPath === 'auth') routeKey = 'auth';
  }

  const intent = ROUTE_INTENT_MAP[routeKey] || ROUTE_INTENT_MAP.home;
  const canonicalPath = routeKey === 'home' ? '' : `/${slug ? (Array.isArray(slug) ? slug.join('/') : slug) : ''}`;
  const canonicalUrl = `${BASE_URL}${canonicalPath}`;

  return {
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: canonicalUrl,
    },
    title: intent.title,
    description: intent.description,
    openGraph: {
      title: intent.title,
      description: intent.description,
      url: canonicalUrl,
      siteName: 'Ingress Within',
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: DEFAULT_IMAGE,
          width: 1200,
          height: 630,
          alt: intent.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: intent.title,
      description: intent.description,
      images: [DEFAULT_IMAGE],
      creator: '@ingresswithin',
    },
  };
}
