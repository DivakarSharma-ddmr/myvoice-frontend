'use client';

import { useState } from 'react';
import { useAdmin } from '@/components/admin/AdminProvider';
import { DataTable, type Column } from '@/components/admin/DataTable';
import { StatusPill } from '@/components/admin/StatusPill';
import { ActionMenu } from '@/components/admin/ActionMenu';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { TextField, TextArea, Select } from '@/components/admin/Field';
import type { CatalogueReward } from '@/lib/adminMockData';

const STATUS_OPTS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

const blank: CatalogueReward = { id: '', name: '', value: 0, description: '', status: 'active' };

export default function ManageRewardsPage() {
  const { data, upsertCatalogue } = useAdmin();
  const [form, setForm] = useState<CatalogueReward | null>(null);

  const columns: Column<CatalogueReward>[] = [
    { key: 'name', header: 'Name', filter: 'text', sortable: true },
    { key: 'value', header: 'Value', align: 'right', sortable: true, accessor: (r) => r.value, render: (r) => `€${r.value}` },
    { key: 'description', header: 'Description', render: (r) => <span className="block max-w-md whitespace-normal text-soft">{r.description || '—'}</span> },
    { key: 'status', header: 'Status', filter: 'select', selectOptions: STATUS_OPTS, render: (r) => <StatusPill status={r.status} /> },
    {
      key: 'actions', header: 'Actions', align: 'right',
      render: (r) => (
        <ActionMenu items={[
          { label: 'Edit', onClick: () => setForm(r) },
          { label: r.status === 'active' ? 'Mark Inactive' : 'Mark Active', onClick: () => upsertCatalogue({ ...r, status: r.status === 'active' ? 'inactive' : 'active' }) },
        ]} />
      ),
    },
  ];

  const save = () => {
    if (!form) return;
    upsertCatalogue({ ...form, id: form.id || `cat-${Date.now()}`, value: Number(form.value) || 0 });
    setForm(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex">
        <button type="button" onClick={() => setForm(blank)} className="rounded-xl bg-teal px-4 py-2.5 text-sm font-bold text-white hover:bg-dteal">Add new +</button>
      </div>

      <DataTable columns={columns} rows={data.catalogue} getRowId={(r) => r.id} pageSize={25} />

      <ConfirmDialog
        open={form !== null}
        title={form?.id ? 'Edit reward' : 'Add reward'}
        confirmLabel="Save"
        onConfirm={save}
        onCancel={() => setForm(null)}
        body={form && (
          <div className="space-y-3 pt-1 text-left">
            <TextField label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
            <TextField label="Value (€)" type="number" value={String(form.value)} onChange={(v) => setForm({ ...form, value: Number(v) })} />
            <TextArea label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} />
            <Select label="Status" value={form.status} onChange={(v) => setForm({ ...form, status: v as CatalogueReward['status'] })} options={STATUS_OPTS} />
          </div>
        )}
      />
    </div>
  );
}
