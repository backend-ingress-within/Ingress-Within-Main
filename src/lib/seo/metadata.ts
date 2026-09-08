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
  let isKnownPublicRoute = false;

  const rawPath = Array.isArray(slug)
    ? slug.join('/').toLowerCase()
    : (typeof slug === 'string' ? slug.toLowerCase() : '');

  if (!rawPath || rawPath === '') {
    routeKey = 'home';
    isKnownPublicRoute = true;
  } else if (rawPath === 'what-it-is') {
    routeKey = 'whatItIs';
    isKnownPublicRoute = true;
  } else if (rawPath === 'guided-journaling') {
    routeKey = 'guidedJournaling';
    isKnownPublicRoute = true;
  } else if (rawPath === 'self-reflection') {
    routeKey = 'selfReflection';
    isKnownPublicRoute = true;
  } else if (rawPath === 'emotional-patterns') {
    routeKey = 'emotionalPatterns';
    isKnownPublicRoute = true;
  } else if (rawPath === 'self-awareness') {
    routeKey = 'selfAwareness';
    isKnownPublicRoute = true;
  } else if (rawPath === 'journaling-prompts-for-self-discovery') {
    routeKey = 'journalingPrompts';
    isKnownPublicRoute = true;
  } else if (rawPath === 'how-to-start-journaling') {
    routeKey = 'howToStartJournaling';
    isKnownPublicRoute = true;
  } else if (rawPath === 'how-to-practice-self-reflection') {
    routeKey = 'howToPracticeSelfReflection';
    isKnownPublicRoute = true;
  } else if (rawPath === 'how-it-works') {
    routeKey = 'howItWorks';
    isKnownPublicRoute = true;
  } else if (rawPath === 'about') {
    routeKey = 'about';
    isKnownPublicRoute = true;
  } else if (rawPath === 'pricing') {
    routeKey = 'pricing';
    isKnownPublicRoute = true;
  } else if (rawPath === 'faq') {
    routeKey = 'faq';
    isKnownPublicRoute = true;
  } else if (rawPath === 'ai-data') {
    routeKey = 'aiData';
    isKnownPublicRoute = true;
  } else if (rawPath === 'contact') {
    routeKey = 'contact';
    isKnownPublicRoute = true;
  } else if (rawPath === 'auth') {
    routeKey = 'auth';
    isKnownPublicRoute = true;
  }

  const intent = ROUTE_INTENT_MAP[routeKey] || ROUTE_INTENT_MAP.home;
  const canonicalPath = routeKey === 'home' ? '' : `/${rawPath}`;
  const canonicalUrl = `${BASE_URL}${canonicalPath}`;

  const robots = isKnownPublicRoute
    ? {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      }
    : {
        index: false,
        follow: false,
        googleBot: {
          index: false,
          follow: false,
        },
      };

  const googleVerification = process.env.GOOGLE_SITE_VERIFICATION || process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
  const bingVerification = process.env.BING_SITE_VERIFICATION || process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION;
  const verification = (googleVerification || bingVerification)
    ? {
        ...(googleVerification ? { google: googleVerification } : {}),
        ...(bingVerification ? { other: { 'msvalidate.01': bingVerification } } : {}),
      }
    : undefined;

  return {
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: canonicalUrl,
    },
    title: intent.title,
    description: intent.description,
    robots,
    ...(verification ? { verification } : {}),
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
