'use client';

import { usePathname } from 'next/navigation';
import { AdminProvider } from '@/components/admin/AdminProvider';
import { AdminShell } from '@/components/admin/AdminShell';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // The login gate renders WITHOUT the shell (or the provider it needs).
  if (pathname?.includes('/admin/login')) return <>{children}</>;

  return (
    <AdminProvider>
      <AdminShell>{children}</AdminShell>
    </AdminProvider>
  );
}
