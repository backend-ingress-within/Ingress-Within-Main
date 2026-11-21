import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

export const dynamic = 'force-static';
export const revalidate = 86400;

export async function GET() {
  const filePath = join(process.cwd(), 'public', 'llms.txt');
  let content = '';

  if (existsSync(filePath)) {
    content = readFileSync(filePath, 'utf-8');
  } else {
    content = `# Ingress Within
> One connected platform for self-guided psychological inquiry, emotional pattern discovery, and licensed clinical therapy.

## Core Sections
- [Homepage](https://ingresswithin.com/): Unified entry point for self-guided practice and therapist care.
- [Therapy Care](https://ingresswithin.com/therapy): Telehealth sessions with licensed clinical psychologists and psychotherapists.
- [Our Solution](https://ingresswithin.com/solution): The integrated mental health model connecting self-inquiry with clinical practice.
- [How It Works](https://ingresswithin.com/how-it-works): Overview of guided reflection rhythm, emotional vocabulary, and clinician collaboration.
- [Pricing](https://ingresswithin.com/pricing): Transparent pricing for self-guided modules and individual therapy sessions.
- [AI & Data Philosophy](https://ingresswithin.com/ai-data): Privacy-first architecture with strict boundaries, user consent controls, and no AI model training on personal reflection data.
- [About Ingress Within](https://ingresswithin.com/about): Mission, clinical governance, and ethical standards.
- [Contact Support](https://ingresswithin.com/contact): Inquiries, feedback, and customer support.
`;
  }

  return new Response(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=43200',
      'Vary': 'Accept',
    },
  });
}
