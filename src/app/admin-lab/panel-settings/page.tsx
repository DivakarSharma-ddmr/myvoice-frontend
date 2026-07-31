'use client';

import { useState } from 'react';
import { useAdmin } from '@/components/admin/AdminProvider';
import { SettingsNav } from '@/components/admin-lab/SettingsNav';
import { TextField, TextArea, FileUpload } from '@/components/admin/Field';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { asset } from '@/lib/asset';
import { EMAIL_TAGS, type PanelSettings } from '@/lib/adminMockData';

const NAV = [{ id: 'settings', label: 'Settings' }, { id: 'templates', label: 'Email Templates' }];

export default function LabPanelSettings() {
  const { data, savePanelSettings, saveTemplate } = useAdmin();
  const [nav, setNav] = useState('settings');
  const [s, setS] = useState<PanelSettings>(data.panelSettings);
  const set = (p: Partial<PanelSettings>) => setS((c) => ({ ...c, ...p }));

  const [tplId, setTplId] = useState(data.templates[0].id);
  const tpl = data.templates.find((t) => t.id === tplId)!;
  const [subject, setSubject] = useState(tpl.subject);
  const [body, setBody] = useState(tpl.body);
  const [preview, setPreview] = useState(false);
  const selectTpl = (id: string) => { const t = data.templates.find((x) => x.id === id)!; setTplId(id); setSubject(t.subject); setBody(t.body); };

  return (
    <div className="grid gap-5 lg:grid-cols-[220px_1fr]">
      <SettingsNav items={NAV} active={nav} onChange={setNav} />

      <div>
        {nav === 'settings' && (
          <div className="max-w-3xl space-y-6 rounded-2xl border border-bd bg-white p-6 shadow-soft">
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="Panel Name" value={s.panelName} onChange={(v) => set({ panelName: v })} />
              <TextField label="Panel Alias" value={s.panelAlias} onChange={(v) => set({ panelAlias: v })} />
              <TextField label="Contact Email" type="email" value={s.contactEmail} onChange={(v) => set({ contactEmail: v })} />
              <TextField label="Referral Reward" type="number" value={String(s.referralReward)} onChange={(v) => set({ referralReward: Number(v) })} />
            </div>
            <TextField label="Postal Code Note" value={s.postalCodeNote} onChange={(v) => set({ postalCodeNote: v })} />
            <div className="grid gap-4 text-sm sm:grid-cols-3">
              <div><span className="mb-1.5 block font-semibold text-dteal">Panel Languages</span><ul className="list-disc pl-5 text-ink">{s.languages.map((l) => <li key={l}>{l}</li>)}</ul></div>
              <div><span className="mb-1.5 block font-semibold text-dteal">Cint Currency</span><p className="text-ink">{s.cintCurrency}</p></div>
              <div><span className="mb-1.5 block font-semibold text-dteal">MyVoice Currency</span><p className="text-ink">{s.myvoiceCurrency}</p></div>
            </div>
            <FileUpload label="Logo" currentSrc={asset('/assets/logo.webp')} />
            <div className="space-y-4 border-t border-bd pt-6">
              <h3 className="font-sans text-sm font-bold text-dteal">Rewards Info</h3>
              <TextArea label="Rewards Availability" value={s.rewardsAvailability} onChange={(v) => set({ rewardsAvailability: v })} rows={2} />
              <TextField label="Minimum Redemption Threshold" type="number" value={String(s.minRedemption)} onChange={(v) => set({ minRedemption: Number(v) })} />
              <div><span className="mb-1.5 block text-sm font-semibold text-dteal">Rewards Info</span><RichTextEditor value={s.rewardsInfoHtml} onChange={(html) => set({ rewardsInfoHtml: html })} /></div>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => savePanelSettings(s)} className="rounded-xl bg-teal px-4 py-2.5 text-sm font-bold text-white hover:bg-dteal">Save Changes</button>
              <button type="button" onClick={() => setS(data.panelSettings)} className="rounded-xl border border-bd bg-white px-4 py-2.5 text-sm font-semibold text-mute hover:bg-canvas">Cancel</button>
            </div>
          </div>
        )}

        {nav === 'templates' && (
          <div className="grid gap-4 rounded-2xl border border-bd bg-white p-4 shadow-soft lg:grid-cols-[260px_1fr]">
            <ul className="max-h-[560px] overflow-y-auto rounded-xl border border-bd">
              {data.templates.map((t) => (
                <li key={t.id}><button type="button" onClick={() => selectTpl(t.id)} className={`block w-full border-b border-bd px-3 py-2.5 text-left text-sm last:border-0 ${t.id === tplId ? 'bg-lteal font-semibold text-dteal' : 'text-ink hover:bg-cream'}`}>{t.name}</button></li>
              ))}
            </ul>
            <div className="space-y-3">
              <span className="inline-block rounded-full bg-lteal px-3 py-1 text-xs font-semibold text-dteal">English</span>
              <TextField label="Subject" value={subject} onChange={setSubject} />
              <RichTextEditor key={tplId} value={body} onChange={setBody} tags={EMAIL_TAGS} onPreview={() => setPreview(true)} />
              <button type="button" onClick={() => saveTemplate(tplId, subject, body)} className="rounded-xl bg-teal px-4 py-2.5 text-sm font-bold text-white hover:bg-dteal">Save Changes</button>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog open={preview} title="Template preview" confirmLabel="Close" cancelLabel="Dismiss" onConfirm={() => setPreview(false)} onCancel={() => setPreview(false)}
        body={<div className="max-h-[50vh] overflow-y-auto rounded-lg border border-bd bg-white p-4 text-ink" dangerouslySetInnerHTML={{ __html: body }} />} />
    </div>
  );
}
