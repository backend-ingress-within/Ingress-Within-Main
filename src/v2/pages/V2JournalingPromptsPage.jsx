import React from 'react';
import ArticleLayout from '../components/ArticleLayout';
import { V2_SEO_PAGES } from '../data/v2Content';

export default function V2JournalingPromptsPage({ onOpenPolicy }) {
  const pageData = V2_SEO_PAGES.find(p => p.slug === 'journaling-prompts-for-self-discovery') || V2_SEO_PAGES[0];
  return <ArticleLayout page={pageData} onOpenPolicy={onOpenPolicy} />;
}
