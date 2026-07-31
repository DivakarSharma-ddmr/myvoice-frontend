'use client';

import { useState } from 'react';
import { useAdmin } from '@/components/admin/AdminProvider';
import { Tabs } from '@/components/admin/Tabs';
import { DataTable, type Column } from '@/components/admin/DataTable';
import { StatusPill } from '@/components/admin/StatusPill';
import { ActionMenu } from '@/components/admin/ActionMenu';
import type { RecruitmentSource } from '@/lib/adminMockData';

const TABS = [
  { id: 'source', label: 'Recruitment Source' },
  { id: 'report', label: 'Recruitment Report' },
];

export default function RecruitmentPage() {
  const { data, panel, addRecruitment, setRecruitmentStatus } = useAdmin();
  const [tab, setTab] = useState('source');
  const [name, setName] = useState('');

  const columns: Column<RecruitmentSource>[] = [
    { key: 'name', header: 'Name', filter: 'text' },
    { key: 'status', header: 'Status', align: 'center', render: (r) => <StatusPill status={r.status} /> },
    { key: 'trigger', header: 'Trigger pixel at', render: (r) => r.trigger || '—' },
    {
      key: 'action', header: 'Action', align: 'right',
      render: (r) => (
        <ActionMenu items={[
          { label: r.status === 'active' ? 'Mark as Inactive' : 'Mark as Active', onClick: () => setRecruitmentStatus(r.id, r.status === 'active' ? 'inactive' : 'active') },
          { label: 'Edit', onClick: () => {} },
        ]} />
      ),
    },
  ];

  const add = () => { if (name.trim()) { addRecruitment(name.trim()); setName(''); } };

  return (
    <div className="space-y-5">
      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      {tab === 'source' && (
        <div className="space-y-4">
          <div className="flex items-end gap-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-dteal">Name</span>
              <input value={name} onChange={(e) => setName(e.target.value)} className="rounded-xl border border-bd px-3.5 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-teal/40" />
            </label>
            <button type="button" onClick={add} className="rounded-xl bg-teal px-4 py-2.5 text-sm font-bold text-white hover:bg-dteal">Add</button>
          </div>
          <DataTable columns={columns} rows={data.recruitment} getRowId={(r) => r.id} />
        </div>
      )}

      {tab === 'report' && (
        <section className="rounded-2xl border border-bd bg-white p-6 shadow-soft">
          <p className="mb-3 text-xs text-soft">(Global | {panel.name})</p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm">
              <thead className="text-left text-dteal">
                <tr className="border-b border-bd">
                  <th className="py-2 pr-3 font-bold">Source</th>
                  <th className="py-2 pr-3 font-bold">Hits</th>
                  <th className="py-2 pr-3 font-bold">Registered</th>
                  <th className="py-2 pr-3 font-bold">Verified</th>
                  <th className="py-2 font-bold">Conversion</th>
                </tr>
              </thead>
              <tbody>
                {data.dashboard.recruitment.map((r) => (
                  <tr key={r.source} className="border-b border-bd/60">
                    <td className="py-2 pr-3 text-ink">{r.source}</td>
                    <td className="py-2 pr-3 text-soft">{r.hits}</td>
                    <td className="py-2 pr-3 text-soft">{r.registered}</td>
                    <td className="py-2 pr-3 text-soft">{r.verified}</td>
                    <td className="py-2 text-soft">{r.conversion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
