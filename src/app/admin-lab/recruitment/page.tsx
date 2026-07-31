'use client';

import { useMemo, useState } from 'react';
import { useAdmin } from '@/components/admin/AdminProvider';
import { Tabs } from '@/components/admin/Tabs';
import { StatusPill } from '@/components/admin/StatusPill';
import { RowActions } from '@/components/admin-lab/RowActions';

const TABS = [{ id: 'source', label: 'Recruitment Source' }, { id: 'report', label: 'Recruitment Report' }];

export default function LabRecruitment() {
  const { data, panel, addRecruitment, setRecruitmentStatus } = useAdmin();
  const [tab, setTab] = useState('source');
  const [name, setName] = useState('');
  const [q, setQ] = useState('');

  const rows = useMemo(() => data.recruitment.filter((r) => !q || r.name.toLowerCase().includes(q.toLowerCase())), [data.recruitment, q]);
  const add = () => { if (name.trim()) { addRecruitment(name.trim()); setName(''); } };

  return (
    <div className="space-y-5">
      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      {tab === 'source' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-bd bg-white p-3 shadow-soft">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search sources…" aria-label="Search sources" className="min-w-[180px] flex-1 rounded-lg border border-bd px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-teal/40" />
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="New source name" aria-label="New source" className="rounded-lg border border-bd px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-teal/40" />
            <button type="button" onClick={add} className="rounded-xl bg-teal px-4 py-2 text-sm font-bold text-white hover:bg-dteal">Add</button>
          </div>

          <div className="overflow-hidden rounded-2xl border border-bd bg-white shadow-soft">
            <table className="w-full min-w-[600px] text-sm">
              <thead className="bg-lteal/50 text-left text-dteal">
                <tr><th className="px-4 py-3 font-bold">Name</th><th className="px-4 py-3 font-bold">Status</th><th className="px-4 py-3 font-bold">Trigger pixel at</th><th className="px-4 py-3 text-right font-bold">Action</th></tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-t border-bd/70 hover:bg-cream">
                    <td className="px-4 py-3 font-semibold text-ink">{r.name}</td>
                    <td className="px-4 py-3"><StatusPill status={r.status} /></td>
                    <td className="px-4 py-3 text-soft">{r.trigger || '—'}</td>
                    <td className="px-4 py-3 text-right">
                      <RowActions
                        primary={{ label: r.status === 'active' ? 'Deactivate' : 'Activate', onClick: () => setRecruitmentStatus(r.id, r.status === 'active' ? 'inactive' : 'active') }}
                        items={[{ label: 'Edit', onClick: () => {} }]}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'report' && (
        <section className="rounded-2xl border border-bd bg-white p-6 shadow-soft">
          <p className="mb-3 text-xs text-soft">(Global | {panel.name})</p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm">
              <thead className="text-left text-dteal">
                <tr className="border-b border-bd"><th className="py-2 pr-3 font-bold">Source</th><th className="py-2 pr-3 font-bold">Hits</th><th className="py-2 pr-3 font-bold">Registered</th><th className="py-2 pr-3 font-bold">Verified</th><th className="py-2 font-bold">Conversion</th></tr>
              </thead>
              <tbody>
                {data.dashboard.recruitment.map((r) => (
                  <tr key={r.source} className="border-b border-bd/60">
                    <td className="py-2 pr-3 text-ink">{r.source}</td><td className="py-2 pr-3 text-soft">{r.hits}</td><td className="py-2 pr-3 text-soft">{r.registered}</td><td className="py-2 pr-3 text-soft">{r.verified}</td><td className="py-2 text-soft">{r.conversion}</td>
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
