import { seed } from '@/lib/adminMockData';
import { MemberEditor } from './MemberEditor';

// Required for static export: pre-render every seeded member id.
export function generateStaticParams() {
  return seed.members.map((m) => ({ id: String(m.id) }));
}

export default function EditMemberPage({ params }: { params: { id: string } }) {
  return <MemberEditor id={Number(params.id)} />;
}
