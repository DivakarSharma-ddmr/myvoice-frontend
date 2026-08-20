import { seed } from '@/lib/adminMockData';
import { MemberProfile } from '@/components/admin-lab/MemberProfile';

// Required for static export: pre-render every seeded member id.
export function generateStaticParams() {
  return seed.members.map((m) => ({ id: String(m.id) }));
}

export default function LabEditMemberPage({ params }: { params: { id: string } }) {
  return <MemberProfile id={Number(params.id)} />;
}
