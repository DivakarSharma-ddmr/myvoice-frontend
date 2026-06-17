import { MemberProvider } from '@/components/member/MemberProvider';
import { MemberShell } from '@/components/member/MemberShell';

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  return (
    <MemberProvider>
      <MemberShell>{children}</MemberShell>
    </MemberProvider>
  );
}
