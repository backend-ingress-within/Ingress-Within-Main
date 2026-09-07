import { generatePageMetadata } from '../../lib/seo/metadata';
import AppClient from './AppClient';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  return generatePageMetadata({ slug });
}

export function generateStaticParams() {
  return [
    { slug: [] },
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
  ];
}

export default async function CatchAllPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  const rawPath = Array.isArray(slug)
    ? slug.join('/').toLowerCase()
    : (typeof slug === 'string' ? slug.toLowerCase() : '');

  let initialRoute = 'home';
  if (rawPath === 'what-it-is') initialRoute = 'what-it-is';
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
  else if (rawPath === 'auth') initialRoute = 'auth';
  else if (rawPath) initialRoute = rawPath;

  return <AppClient initialRoute={initialRoute} />;
}
