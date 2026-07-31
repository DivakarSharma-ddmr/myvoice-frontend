'use client';

import { useState } from 'react';
import { useAdmin } from '@/components/admin/AdminProvider';
import { StatusPill } from '@/components/admin/StatusPill';
import { TextField, TextArea, Select } from '@/components/admin/Field';
import { DetailDrawer } from '@/components/admin-lab/DetailDrawer';
import { ActionMenu } from '@/components/admin/ActionMenu';
import type { CatalogueReward } from '@/lib/adminMockData';
import { clsx } from '@/lib/clsx';

const STATUS_OPTS = [{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }];
const FILTERS = ['all', 'active', 'inactive'];
const blank: CatalogueReward = { id: '', name: '', value: 0, description: '', status: 'active' };

export default function LabManageRewards() {
  const { data, upsertCatalogue } = useAdmin();
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState<CatalogueReward | null>(null);

  const rows = data.catalogue.filter((r) => filter === 'all' || r.status === filter);
  const save = () => { if (form) upsertCatalogue({ ...form, id: form.id || `cat-${Date.now()}`, value: Number(form.value) || 0 }); setForm(null); };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-bd bg-white p-3 shadow-soft">
        <div className="mr-auto flex gap-1">
          {FILTERS.map((f) => (
            <button key={f} type="button" onClick={() => setFilter(f)} className={clsx('rounded-full px-3 py-1.5 text-xs font-semibold capitalize', filter === f ? 'bg-teal text-white' : 'border border-bd text-soft hover:bg-cream')}>{f}</button>
          ))}
        </div>
        <button type="button" onClick={() => setForm(blank)} className="rounded-xl bg-teal px-4 py-2 text-sm font-bold text-white hover:bg-dteal">Add reward</button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((r) => (
          <div key={r.id} className="flex flex-col rounded-2xl border border-bd bg-white p-5 shadow-soft">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="font-sans text-base font-bold text-dteal">{r.name}</div>
                <div className="mt-0.5 text-2xl font-extrabold text-ink">€{r.value}</div>
              </div>
              <ActionMenu items={[
                { label: 'Edit', onClick: () => setForm(r) },
                { label: r.status === 'active' ? 'Mark Inactive' : 'Mark Active', onClick: () => upsertCatalogue({ ...r, status: r.status === 'active' ? 'inactive' : 'active' }) },
              ]} />
            </div>
            {r.description && <p className="mt-2 flex-1 text-xs text-soft line-clamp-3">{r.description}</p>}
            <div className="mt-3"><StatusPill status={r.status} /></div>
          </div>
        ))}
      </div>

      <DetailDrawer open={form !== null} title={form?.id ? 'Edit reward' : 'Add reward'} onClose={() => setForm(null)}
        footer={<button type="button" onClick={save} className="w-full rounded-xl bg-teal px-4 py-2.5 text-sm font-bold text-white hover:bg-dteal">Save</button>}>
        {form && (
          <div className="space-y-3">
            <TextField label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
            <TextField label="Value (€)" type="number" value={String(form.value)} onChange={(v) => setForm({ ...form, value: Number(v) })} />
            <TextArea label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} />
            <Select label="Status" value={form.status} onChange={(v) => setForm({ ...form, status: v as CatalogueReward['status'] })} options={STATUS_OPTS} />
          </div>
        )}
      </DetailDrawer>
    </div>
  );
}
