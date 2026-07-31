'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAdmin } from '@/components/admin/AdminProvider';
import { DataTable, type Column } from '@/components/admin/DataTable';
import { StatusPill } from '@/components/admin/StatusPill';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { TOTALS, type Campaign } from '@/lib/adminMockData';

const STATUS_OPTS = [
  { value: 'complete', label: 'Complete' },
  { value: 'draft', label: 'Draft' },
];

export default function EmailToolPage() {
  const { data, deleteCampaign } = useAdmin();
  const [del, setDel] = useState<Campaign | null>(null);

  const columns: Column<Campaign>[] = [
    { key: 'id', header: 'Campaign-ID', sortable: true },
    { key: 'subject', header: 'Campaign-Subject', filter: 'text' },
    { key: 'created', header: 'Created', sortable: true },
    { key: 'sent', header: 'Sent', sortable: true },
    { key: 'status', header: 'Status', filter: 'select', selectOptions: STATUS_OPTS, render: (r) => <StatusPill status={r.status} /> },
    {
      key: 'action', header: 'Action', align: 'center',
      render: (r) => <Link href={`/admin/email-tool/${r.id}`} className="rounded-lg border border-bd px-3 py-1.5 text-xs font-semibold text-teal hover:bg-lteal/40">View</Link>,
    },
    {
      key: 'delete', header: 'Delete', align: 'center',
      render: (r) => <button type="button" onClick={() => setDel(r)} className="rounded-lg border border-bd px-3 py-1.5 text-xs font-semibold text-danger hover:bg-danger/10">Delete</button>,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Link href="/admin/email-tool/new" className="rounded-xl bg-teal px-4 py-2.5 text-sm font-bold text-white hover:bg-dteal">Add Campaign</Link>
      </div>

      <DataTable columns={columns} rows={data.campaigns} getRowId={(r) => r.id} totalOverride={TOTALS.campaigns} />

      <ConfirmDialog
        open={del !== null} title="Delete campaign?" tone="danger" confirmLabel="Delete"
        body={del && <>Delete campaign <strong>{del.subject}</strong> (#{del.id})?</>}
        onConfirm={() => { if (del) deleteCampaign(del.id); setDel(null); }} onCancel={() => setDel(null)}
      />
    </div>
  );
}
