'use client';

import { useMemo, useState } from 'react';
import { useAdmin } from '@/components/admin/AdminProvider';
import { StatusPill } from '@/components/admin/StatusPill';
import { Select, DatePicker } from '@/components/admin/Field';
import { RowActions } from '@/components/admin-lab/RowActions';
import { PANELS } from '@/lib/adminMockData';
import { clsx } from '@/lib/clsx';

const OPTIONS = ['Select Option', 'Panel Report', 'Panel Statistics', 'Recruitment Statistics', 'Panel Health'];
const COLUMNS = ['Panelist Id', 'Email', 'Status', 'Country', 'Registered', 'Verified', 'Rewards', 'Last Activity'];

export default function LabReport() {
  const { data, addReport, toast } = useAdmin();
  const [panelId, setPanelId] = useState('');
  const [option, setOption] = useState(OPTIONS[0]);
  const [cols, setCols] = useState<Set<string>>(new Set());
  const [start, setStart] = useState('');
  const [q, setQ] = useState('');

  const rows = useMemo(() => data.reports.filter((r) => !q || r.name.toLowerCase().includes(q.toLowerCase())), [data.reports, q]);
  const toggleCol = (c: string) => setCols((s) => { const n = new Set(s); n.has(c) ? n.delete(c) : n.add(c); return n; });
  const generate = () => {
    const panel = PANELS.find((p) => p.id === panelId)?.name.replace(/\s+/g, '') ?? 'Multiple_Panels';
    const opt = option === 'Select Option' ? 'Report' : option.replace(/\s+/g, '');
    addReport(`${panel}_${opt}_2026-07-31`); setCols(new Set());
  };

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-bd bg-white p-6 shadow-soft">
        <h2 className="mb-4 font-sans text-base font-bold text-dteal">Generate Report</h2>
        <div className="grid gap-4 lg:grid-cols-4">
          <Select label="Panels" value={panelId} onChange={setPanelId} options={[{ value: '', label: 'Select Panel' }, ...PANELS.map((p) => ({ value: p.id, label: p.name }))]} />
          <Select label="Options" value={option} onChange={setOption} options={OPTIONS.map((o) => ({ value: o, label: o }))} />
          <div>
            <span className="mb-1.5 block text-sm font-semibold text-dteal">Columns</span>
            <div className="flex max-h-[92px] flex-wrap gap-1.5 overflow-y-auto rounded-xl border border-bd p-2">
              {COLUMNS.map((c) => (
                <button key={c} type="button" onClick={() => toggleCol(c)} className={clsx('rounded-full px-2.5 py-1 text-xs font-semibold', cols.has(c) ? 'bg-teal text-white' : 'border border-bd text-soft hover:bg-cream')}>{c}</button>
              ))}
            </div>
          </div>
          <DatePicker label="Start Date" value={start} onChange={setStart} />
        </div>
        <p className="mt-3 text-xs text-soft">Selected columns: {cols.size ? Array.from(cols).join(', ') : '—'}</p>
        <div className="mt-4 flex justify-end gap-2">
          <button type="button" onClick={generate} className="rounded-xl bg-teal px-4 py-2.5 text-sm font-bold text-white hover:bg-dteal">Generate</button>
          <button type="button" onClick={() => { setPanelId(''); setOption(OPTIONS[0]); setCols(new Set()); setStart(''); }} className="rounded-xl border border-bd bg-white px-4 py-2.5 text-sm font-semibold text-mute hover:bg-canvas">Reset</button>
        </div>
      </section>

      <div className="flex items-center gap-2 rounded-2xl border border-bd bg-white p-3 shadow-soft">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search reports…" aria-label="Search reports" className="min-w-[220px] flex-1 rounded-lg border border-bd px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-teal/40" />
        <span className="text-sm text-soft">{rows.length} of 913</span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-bd bg-white shadow-soft">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-lteal/50 text-left text-dteal">
            <tr><th className="px-4 py-3 font-bold">Name</th><th className="px-4 py-3 font-bold">Status</th><th className="px-4 py-3 font-bold">Created At</th><th className="px-4 py-3 text-right font-bold">Actions</th></tr>
          </thead>
          <tbody>
            {rows.slice(0, 20).map((r) => (
              <tr key={r.id} className="border-t border-bd/70 hover:bg-cream">
                <td className="px-4 py-3 text-ink">{r.name}</td>
                <td className="px-4 py-3"><StatusPill status={r.status} /></td>
                <td className="px-4 py-3 text-soft">{r.createdAt}</td>
                <td className="px-4 py-3 text-right"><RowActions primary={{ label: 'Download', onClick: () => toast('Report downloaded.') }} items={[]} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
