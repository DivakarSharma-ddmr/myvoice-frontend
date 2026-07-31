'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/components/admin/AdminProvider';
import { Tabs } from '@/components/admin/Tabs';
import { TextField, Select } from '@/components/admin/Field';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { PANELS } from '@/lib/adminMockData';

const TABS = [
  { id: 'basic', label: 'Basic Settings' },
  { id: 'template', label: 'Template' },
  { id: 'stats', label: 'Statistics' },
];

const LANGS = ['No Selection', 'English', 'Romanian', 'Spanish EUR', 'Spanish USD', 'Turkish', 'Vietnamese'];
const FROM = [
  { value: 'communications@myvoice-surveys.com', label: 'MyVoice communications email address' },
  { value: 'membersupport@myvoice-surveys.com', label: 'MyVoice member support email address' },
];

export function CampaignBuilder({ id }: { id: string }) {
  const router = useRouter();
  const { data, toast } = useAdmin();
  const existing = data.campaigns.find((c) => String(c.id) === id);

  const [tab, setTab] = useState('basic');
  const [name, setName] = useState(existing?.name ?? '');
  const [subject, setSubject] = useState(existing?.subject ?? '');
  const [language, setLanguage] = useState(existing?.language ?? 'No Selection');
  const [panels, setPanels] = useState<Set<string>>(new Set());
  const [toEmail, setToEmail] = useState('');
  const [from, setFrom] = useState(FROM[0].value);
  const [fromName, setFromName] = useState('');
  const [body, setBody] = useState('<p>Write your campaign…</p>');

  const totalMembers = PANELS.filter((p) => panels.has(p.id)).reduce((s, p) => s + p.memberCount, 0);
  const togglePanel = (pid: string) => setPanels((s) => { const n = new Set(s); n.has(pid) ? n.delete(pid) : n.add(pid); return n; });

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap justify-end gap-2">
        <button type="button" onClick={() => toast('Test email sent.')} className="rounded-xl border border-teal bg-white px-4 py-2 text-sm font-semibold text-teal hover:bg-lteal/40">Test Campaign</button>
        <button type="button" onClick={() => toast('Campaign saved.')} className="rounded-xl border border-teal bg-white px-4 py-2 text-sm font-semibold text-teal hover:bg-lteal/40">Save</button>
        <button type="button" onClick={() => toast('Campaign started.')} className="rounded-xl bg-teal px-4 py-2 text-sm font-bold text-white hover:bg-dteal">Start Campaign</button>
        <button type="button" onClick={() => router.push('/admin/email-tool')} className="rounded-xl border border-bd bg-white px-4 py-2 text-sm font-semibold text-mute hover:bg-canvas">Back to list</button>
      </div>

      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      {tab === 'basic' && (
        <div className="max-w-3xl space-y-4 rounded-2xl border border-bd bg-white p-6 shadow-soft">
          <TextField label="Campaign Name" value={name} onChange={setName} />
          <TextField label="Campaign Subject" value={subject} onChange={setSubject} />
          <Select label="Select Language" value={language} onChange={setLanguage} options={LANGS.map((l) => ({ value: l, label: l }))} />
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-sm font-semibold text-dteal">Select panel</span>
              <span className="text-sm text-soft">Total Member Count: {totalMembers.toLocaleString()}</span>
            </div>
            <div className="max-h-56 overflow-y-auto rounded-xl border border-bd p-2">
              {PANELS.map((p) => (
                <label key={p.id} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-cream">
                  <input type="checkbox" checked={panels.has(p.id)} onChange={() => togglePanel(p.id)} />
                  <span className="text-ink">{p.name}</span>
                  <span className="text-soft">( {p.memberCount.toLocaleString()} )</span>
                </label>
              ))}
            </div>
          </div>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-dteal">To Email Address</span>
            <textarea value={toEmail} onChange={(e) => setToEmail(e.target.value)} rows={3} className="w-full rounded-xl border border-bd px-3.5 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-teal/40" />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <Select label="From Email address" value={from} onChange={setFrom} options={FROM} />
            <TextField label="From email name" value={fromName} onChange={setFromName} />
          </div>
        </div>
      )}

      {tab === 'template' && (
        <div className="max-w-3xl rounded-2xl border border-bd bg-white p-4 shadow-soft">
          <RichTextEditor value={body} onChange={setBody} />
        </div>
      )}

      {tab === 'stats' && (
        <div className="space-y-3">
          <div className="flex justify-between">
            <button type="button" onClick={() => toast('Statistics refreshed.')} className="rounded-xl border border-bd bg-white px-4 py-2 text-sm font-semibold text-mute hover:bg-canvas">Refresh</button>
            <button type="button" onClick={() => toast('Statistics exported.')} className="rounded-xl bg-teal px-4 py-2 text-sm font-bold text-white hover:bg-dteal">Export Statistics</button>
          </div>
          {existing ? existing.stats.map((st) => (
            <div key={st.campaignId} className="grid grid-cols-2 gap-4 rounded-2xl bg-dteal p-5 text-center text-white sm:grid-cols-5">
              <div><div className="text-xs opacity-80">Campaign ID</div><div className="font-bold">{st.campaignId}</div></div>
              <div><div className="text-xs opacity-80">Recipients</div><div className="font-bold">{st.recipients.toLocaleString()}</div></div>
              <div><div className="text-xs opacity-80">Opens</div><div className="font-bold">{st.opens}</div></div>
              <div><div className="text-xs opacity-80">Clicks</div><div className="font-bold">{st.clicks}</div></div>
              <div><div className="text-xs opacity-80">Unsubscribes</div><div className="font-bold">{st.unsubscribes}</div></div>
            </div>
          )) : (
            <div className="rounded-2xl border border-bd bg-white p-8 text-center text-sm text-soft">No statistics yet — start the campaign first.</div>
          )}
        </div>
      )}
    </div>
  );
}
