import { notFound } from 'next/navigation';
import { legalDocs, legalSlugs } from '@/content/legal.generated';
import { LegalDocView } from '@/components/legal/LegalDocView';

// Required for static export.
export function generateStaticParams() {
  return legalSlugs.map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const doc = legalDocs[params.slug];
  return { title: doc ? `${doc.title} · MyVoice` : 'MyVoice' };
}

export default function LegalPage({ params }: { params: { slug: string } }) {
  const doc = legalDocs[params.slug];
  if (!doc) notFound();
  return <LegalDocView doc={doc} />;
}
