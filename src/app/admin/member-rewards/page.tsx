'use client';

import { useState } from 'react';
import { useAdmin } from '@/components/admin/AdminProvider';
import { DataTable, type Column } from '@/components/admin/DataTable';
import { StatusPill } from '@/components/admin/StatusPill';
import { ActionMenu } from '@/components/admin/ActionMenu';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { PANELS, TOTALS, approvalTotal, type MemberReward } from '@/lib/adminMockData';

const STATUS_OPTS = [
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'onhold', label: 'On Hold' },
];
const COUNTRY_OPTS = PANELS.map((p) => ({ value: p.name, label: p.name }));

export default function MemberRewardsPage() {
  const { data, setRewardStatus, bulkReward } = useAdmin();
  const [selected, setSelected] = useState<Set<string | number>>(new Set());
  const [confirm, setConfirm] = useState<null | 'approved' | 'rejected'>(null);

  const selectedRows = data.memberRewards.filter((r) => selected.has(r.id));
  const total = approvalTotal(selectedRows);
  const ids = selectedRows.map((r) => r.id);

  const columns: Column<MemberReward>[] = [
    { key: 'reward', header: 'Reward', filter: 'text', sortable: true },
    { key: 'memberId', header: 'Member Id', filter: 'text' },
    { key: 'email', header: 'Email', filter: 'text', sortable: true },
    { key: 'value', header: 'Value', align: 'right', sortable: true, accessor: (r) => r.value, render: (r) => `€${r.value}` },
    {
      key: 'status', header: 'Status', filter: 'select', selectOptions: STATUS_OPTS,
      render: (r) => (
        <select
          value={r.status}
          onChange={(e) => setRewardStatus(r.id, e.target.value as MemberReward['status'])}
          aria-label={`Status for ${r.id}`}
          className="rounded-lg border border-bd bg-white px-2 py-1 text-xs text-ink outline-none focus-visible:ring-2 focus-visible:ring-teal/40"
        >
          {STATUS_OPTS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ),
    },
    { key: 'date', header: 'Date', sortable: true },
    { key: 'country', header: 'Country', filter: 'select', selectOptions: COUNTRY_OPTS },
    {
      key: 'actions', header: 'Actions', align: 'right',
      render: (r) => (
        <ActionMenu items={[
          { label: 'Approve', onClick: () => setRewardStatus(r.id, 'approved') },
          { label: 'Reject', danger: true, onClick: () => setRewardStatus(r.id, 'rejected') },
          { label: 'On Hold', onClick: () => setRewardStatus(r.id, 'onhold') },
        ]} />
      ),
    },
  ];

  const runBulk = () => {
    if (confirm) { bulkReward(ids, confirm); setSelected(new Set()); }
    setConfirm(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-end gap-2">
        {selected.size > 0 && <span className="mr-auto text-sm text-soft">{selected.size} selected · €{total}</span>}
        <button type="button" disabled={selected.size === 0} onClick={() => setConfirm('approved')} className="rounded-xl bg-yel px-4 py-2.5 text-sm font-bold text-ink hover:brightness-95 disabled:opacity-40">Approve Selected</button>
        <button type="button" disabled={selected.size === 0} onClick={() => setConfirm('rejected')} className="rounded-xl border border-bd bg-white px-4 py-2.5 text-sm font-semibold text-mute hover:bg-canvas disabled:opacity-40">Reject Selected</button>
        <button type="button" onClick={() => setSelected(new Set())} className="rounded-xl border border-bd bg-white px-4 py-2.5 text-sm font-semibold text-mute hover:bg-canvas">Reset</button>
      </div>

      <DataTable
        columns={columns}
        rows={data.memberRewards}
        getRowId={(r) => r.id}
        selectable
        selected={selected}
        onSelectedChange={setSelected}
        totalOverride={TOTALS.memberRewards}
      />

      <ConfirmDialog
        open={confirm !== null}
        title={confirm === 'approved' ? `Approve ${ids.length} payout${ids.length === 1 ? '' : 's'}?` : `Reject ${ids.length} payout${ids.length === 1 ? '' : 's'}?`}
        tone={confirm === 'rejected' ? 'danger' : 'default'}
        confirmLabel={confirm === 'approved' ? `Approve · €${total}` : 'Reject'}
        body={confirm === 'approved'
          ? <>Total <strong>€{total}</strong> to {ids.length} member{ids.length === 1 ? '' : 's'}.</>
          : <>This rejects {ids.length} redemption request{ids.length === 1 ? '' : 's'}.</>}
        onConfirm={runBulk}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
}
