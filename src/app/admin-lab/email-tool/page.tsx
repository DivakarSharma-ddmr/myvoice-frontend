'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAdmin } from '@/components/admin/AdminProvider';
import { DataTable, type Column } from '@/components/admin/DataTable';
import { StatusPill } from '@/components/admin/StatusPill';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { DetailDrawer } from '@/components/admin-lab/DetailDrawer';
import { RowActions } from '@/components/admin-lab/RowActions';
import { TOTALS, type Campaign } from '@/lib/adminMockData';

const pct = (num: number, den: number) => (den > 0 ? `${((num / den) * 100).toFixed(1)}%` : '—');

export default function LabEmailTool() {
  const { data, deleteCampaign } = useAdmin();
  const [stats, setStats] = useState<Campaign | null>(null);
  const [del, setDel] = useState<Campaign | null>(null);

  const columns: Column<Campaign>[] = [
    { key: 'id', header: 'Campaign-ID', sortable: true },
    { key: 'subject', header: 'Campaign-Subject', filter: 'text' },
    { key: 'created', header: 'Created', sortable: true },
    { key: 'sent', header: 'Sent', sortable: true },
    { key: 'status', header: 'Status', render: (r) => <StatusPill status={r.status} /> },
    {
      key: 'actions', header: 'Actions', align: 'right',
      render: (r) => <RowActions primary={{ label: 'Stats', onClick: () => setStats(r) }} items={[{ label: 'Delete', danger: true, onClick: () => setDel(r) }]} />,
    },
  ];

  const agg = stats ? stats.stats.reduce((a, s) => ({ recipients: a.recipients + s.recipients, opens: a.opens + s.opens, clicks: a.clicks + s.clicks, unsubscribes: a.unsubscribes + s.unsubscribes }), { recipients: 0, opens: 0, clicks: 0, unsubscribes: 0 }) : null;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Link href="/admin-lab/email-tool/new" className="rounded-xl bg-teal px-4 py-2.5 text-sm font-bold text-white hover:bg-dteal">New campaign</Link>
      </div>

      <DataTable columns={columns} rows={data.campaigns} getRowId={(r) => r.id} totalOverride={TOTALS.campaigns} />

      <DetailDrawer open={stats !== null} title={stats?.subject ?? ''} subtitle={`Campaign #${stats?.id ?? ''}`} onClose={() => setStats(null)}>
        {agg && (
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Recipients', value: agg.recipients.toLocaleString() },
              { label: 'Open rate', value: pct(agg.opens, agg.recipients) },
              { label: 'Click rate', value: pct(agg.clicks, agg.recipients) },
              { label: 'Unsub rate', value: pct(agg.unsubscribes, agg.recipients) },
            ].map((c) => (
              <div key={c.label} className="rounded-xl border border-bd bg-cream p-4">
                <div className="font-sans text-2xl font-extrabold text-dteal">{c.value}</div>
                <div className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-soft">{c.label}</div>
              </div>
            ))}
          </div>
        )}
      </DetailDrawer>

      <ConfirmDialog open={del !== null} title="Delete campaign?" tone="danger" confirmLabel="Delete"
        body={del && <>Delete <strong>{del.subject}</strong> (#{del.id})?</>}
        onConfirm={() => { if (del) deleteCampaign(del.id); setDel(null); }} onCancel={() => setDel(null)} />
    </div>
  );
}
