import { seed } from '@/lib/adminMockData';
import { CampaignBuilder } from './CampaignBuilder';

// Required for static export: pre-render every seeded campaign id plus "new".
export function generateStaticParams() {
  return [{ id: 'new' }, ...seed.campaigns.map((c) => ({ id: String(c.id) }))];
}

export default function CampaignBuilderPage({ params }: { params: { id: string } }) {
  return <CampaignBuilder id={params.id} />;
}
