import { notFound } from 'next/navigation';
import { generatePageMetadata } from '../../lib/seo/metadata';
import AppClient from './AppClient';

const KNOWN_PUBLIC_ROUTES = new Set([
  '',
  'user/login',
  'user/auth',
  'login',
  'auth',
  'what-it-is',
  'how-it-works',
  'about',
  'pricing',
  'faq',
  'contact',
  'ai-data',
  'guided-journaling',
  'self-reflection',
  'emotional-patterns',
  'self-awareness',
  'journaling-prompts-for-self-discovery',
  'how-to-start-journaling',
  'how-to-practice-self-reflection',
  'v2',
  'v2/what-it-is',
  'v2/how-it-works',
  'v2/about',
  'v2/pricing',
  'v2/faq',
  'v2/contact',
  'v2/ai-data',
  'v2/guided-journaling',
  'v2/self-reflection',
  'v2/emotional-patterns',
  'v2/self-awareness',
  'v2/journaling-prompts-for-self-discovery',
  'v2/how-to-start-journaling',
  'v2/how-to-practice-self-reflection',
]);

function isKnownRoute(rawPath) {
  if (!rawPath || KNOWN_PUBLIC_ROUTES.has(rawPath)) return true;
  if (rawPath.startsWith('v2')) return true;
  if (rawPath === 'auth' || rawPath === 'login') return true;
  if (
    rawPath.startsWith('onboarding') ||
    rawPath.startsWith('dashboard') ||
    rawPath.startsWith('settings') ||
    rawPath.startsWith('write') ||
    rawPath.startsWith('reports') ||
    rawPath.startsWith('patterns') ||
    rawPath.startsWith('vocab') ||
    rawPath.startsWith('knowledge') ||
    rawPath.startsWith('kb') ||
    rawPath.startsWith('interventions') ||
    rawPath.startsWith('modules') ||
    rawPath.startsWith('exercise') ||
    rawPath.startsWith('exercises') ||
    rawPath.startsWith('assessment') ||
    rawPath.startsWith('support') ||
    rawPath.startsWith('session') ||
    rawPath.startsWith('threads') ||
    rawPath.startsWith('thread') ||
    rawPath.startsWith('entry') ||
    rawPath.startsWith('test') ||
    rawPath.startsWith('admin')
  ) {
    return true;
  }
  return false;
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  const rawPath = Array.isArray(slug)
    ? slug.join('/').toLowerCase()
    : (typeof slug === 'string' ? slug.toLowerCase() : '');

  if (!isKnownRoute(rawPath)) {
    return {
      title: 'Page Not Found | Ingress Within',
      robots: { index: false, follow: false },
    };
  }

  return generatePageMetadata({ slug });
}

export function generateStaticParams() {
  return [
    { slug: [] },
    { slug: ['user', 'login'] },
    { slug: ['user', 'auth'] },
    { slug: ['login'] },
    { slug: ['auth'] },
    { slug: ['what-it-is'] },
    { slug: ['how-it-works'] },
    { slug: ['about'] },
    { slug: ['pricing'] },
    { slug: ['faq'] },
    { slug: ['contact'] },
    { slug: ['ai-data'] },
    { slug: ['guided-journaling'] },
    { slug: ['self-reflection'] },
    { slug: ['emotional-patterns'] },
    { slug: ['self-awareness'] },
    { slug: ['journaling-prompts-for-self-discovery'] },
    { slug: ['how-to-start-journaling'] },
    { slug: ['how-to-practice-self-reflection'] },
    { slug: ['v2'] },
    { slug: ['v2', 'what-it-is'] },
    { slug: ['v2', 'how-it-works'] },
    { slug: ['v2', 'about'] },
    { slug: ['pricing'] },
    { slug: ['v2', 'pricing'] },
    { slug: ['v2', 'faq'] },
    { slug: ['v2', 'contact'] },
    { slug: ['v2', 'ai-data'] },
    { slug: ['v2', 'guided-journaling'] },
    { slug: ['v2', 'self-reflection'] },
    { slug: ['v2', 'emotional-patterns'] },
    { slug: ['v2', 'self-awareness'] },
    { slug: ['v2', 'journaling-prompts-for-self-discovery'] },
    { slug: ['v2', 'how-to-start-journaling'] },
    { slug: ['v2', 'how-to-practice-self-reflection'] },
  ];
}

export default async function CatchAllPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  const rawPath = Array.isArray(slug)
    ? slug.join('/').toLowerCase()
    : (typeof slug === 'string' ? slug.toLowerCase() : '');

  if (!isKnownRoute(rawPath)) {
    notFound();
  }

  let initialRoute = 'home';
  if (rawPath === 'user/login' || rawPath === 'user/auth' || rawPath === 'login' || rawPath === 'auth') initialRoute = 'login';
  else if (rawPath === 'what-it-is') initialRoute = 'what-it-is';
  else if (rawPath === 'guided-journaling') initialRoute = 'guided-journaling';
  else if (rawPath === 'self-reflection') initialRoute = 'self-reflection';
  else if (rawPath === 'emotional-patterns') initialRoute = 'emotional-patterns';
  else if (rawPath === 'self-awareness') initialRoute = 'self-awareness';
  else if (rawPath === 'journaling-prompts-for-self-discovery') initialRoute = 'journaling-prompts-for-self-discovery';
  else if (rawPath === 'how-to-start-journaling') initialRoute = 'how-to-start-journaling';
  else if (rawPath === 'how-to-practice-self-reflection') initialRoute = 'how-to-practice-self-reflection';
  else if (rawPath === 'how-it-works') initialRoute = 'how-it-works';
  else if (rawPath === 'about') initialRoute = 'about';
  else if (rawPath === 'pricing') initialRoute = 'pricing';
  else if (rawPath === 'faq') initialRoute = 'faq';
  else if (rawPath === 'contact') initialRoute = 'contact';
  else if (rawPath === 'ai-data') initialRoute = 'ai-data';
  else if (rawPath === 'v2') initialRoute = 'v2-home';
  else if (rawPath.startsWith('v2/')) initialRoute = `v2-${rawPath.slice(3)}`;
  else if (rawPath) initialRoute = rawPath;

  return <AppClient initialRoute={initialRoute} />;
}
