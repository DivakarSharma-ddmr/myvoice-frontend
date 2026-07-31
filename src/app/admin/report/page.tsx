'use client';

import { useState } from 'react';
import { useAdmin } from '@/components/admin/AdminProvider';
import { DataTable, type Column } from '@/components/admin/DataTable';
import { StatusPill } from '@/components/admin/StatusPill';
import { Select, DatePicker } from '@/components/admin/Field';
import { PANELS, type ReportRow } from '@/lib/adminMockData';
import { clsx } from '@/lib/clsx';

const OPTIONS = ['Select Option', 'Panel Report', 'Panel Statistics', 'Recruitment Statistics', 'Panel Health'];
const COLUMNS = ['Panelist Id', 'Email', 'Status', 'Country', 'Registered', 'Verified', 'Rewards', 'Last Activity'];
const STATUS_OPTS = [{ value: 'complete', label: 'Complete' }];

export default function ReportPage() {
  const { data, addReport } = useAdmin();
  const [panelId, setPanelId] = useState('');
  const [option, setOption] = useState(OPTIONS[0]);
  const [cols, setCols] = useState<Set<string>>(new Set());
  const [start, setStart] = useState('');

  const toggleCol = (c: string) => setCols((s) => { const n = new Set(s); n.has(c) ? n.delete(c) : n.add(c); return n; });

  const generate = () => {
    const panel = PANELS.find((p) => p.id === panelId)?.name.replace(/\s+/g, '') ?? 'Multiple_Panels';
    const opt = option === 'Select Option' ? 'Report' : option.replace(/\s+/g, '');
    addReport(`${panel}_${opt}_2026-07-31`);
    setCols(new Set());
  };

  const reset = () => { setPanelId(''); setOption(OPTIONS[0]); setCols(new Set()); setStart(''); };

  const columns: Column<ReportRow>[] = [
    { key: 'name', header: 'Name', filter: 'text' },
    { key: 'status', header: 'Status', filter: 'select', selectOptions: STATUS_OPTS, render: (r) => <StatusPill status={r.status} /> },
    { key: 'createdAt', header: 'Created At', sortable: true },
    { key: 'actions', header: 'Actions', align: 'center', render: () => <button type="button" className="rounded-lg border border-bd px-3 py-1.5 text-xs font-semibold text-teal hover:bg-lteal/40">Download</button> },
  ];

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
                <button key={c} type="button" onClick={() => toggleCol(c)} className={clsx('rounded-full px-2.5 py-1 text-xs font-semibold', cols.has(c) ? 'bg-teal text-white' : 'border border-bd text-soft hover:bg-cream')}>
                  {c}
                </button>
              ))}
            </div>
          </div>
          <DatePicker label="Start Date" value={start} onChange={setStart} />
        </div>
        <p className="mt-3 text-xs text-soft">Selected columns: {cols.size ? Array.from(cols).join(', ') : '—'}</p>
        <div className="mt-4 flex justify-end gap-2">
          <button type="button" onClick={generate} className="rounded-xl bg-teal px-4 py-2.5 text-sm font-bold text-white hover:bg-dteal">Generate</button>
          <button type="button" onClick={reset} className="rounded-xl border border-bd bg-white px-4 py-2.5 text-sm font-semibold text-mute hover:bg-canvas">Reset</button>
        </div>
      </section>

      <DataTable columns={columns} rows={data.reports} getRowId={(r) => r.id} totalOverride={913} />
    </div>
  );
}
