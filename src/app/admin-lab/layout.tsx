'use client';

import { AdminProvider } from '@/components/admin/AdminProvider';
import { LabUIProvider } from '@/components/admin-lab/LabUIProvider';
import { AdminLabShell } from '@/components/admin-lab/AdminLabShell';

export default function AdminLabLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <LabUIProvider>
        <AdminLabShell>{children}</AdminLabShell>
      </LabUIProvider>
    </AdminProvider>
  );
}
