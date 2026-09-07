import { generatePageMetadata } from '../../lib/seo/metadata';
import AppClient from './AppClient';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  return generatePageMetadata({ slug });
}

export default function CatchAllPage() {
  return <AppClient />;
}
