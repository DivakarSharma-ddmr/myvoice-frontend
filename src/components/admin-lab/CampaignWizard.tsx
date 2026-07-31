'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/components/admin/AdminProvider';
import { TextField, Select } from '@/components/admin/Field';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { PANELS } from '@/lib/adminMockData';
import { clsx } from '@/lib/clsx';

const STEPS = ['Audience', 'Content', 'Review & Send'];
const LANGS = ['No Selection', 'English', 'Romanian', 'Spanish EUR', 'Turkish', 'Vietnamese'];

export function CampaignWizard() {
  const router = useRouter();
  const { toast } = useAdmin();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [language, setLanguage] = useState('No Selection');
  const [panels, setPanels] = useState<Set<string>>(new Set());
  const [body, setBody] = useState('<p>Write your campaign…</p>');
  const [tested, setTested] = useState(false);

  const recipients = PANELS.filter((p) => panels.has(p.id)).reduce((s, p) => s + p.memberCount, 0);
  const togglePanel = (id: string) => setPanels((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const sendTest = () => { setTested(true); toast('Test email sent — you can now start the campaign.'); };
  const start = () => { toast('Campaign started.'); router.push('/admin-lab/email-tool'); };

  return (
    <div className="space-y-6">
      {/* Stepper */}
      <ol className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <li key={s} className="flex items-center gap-2">
            <button type="button" onClick={() => i < step && setStep(i)} className={clsx('flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold', i === step ? 'bg-dteal text-white' : i < step ? 'bg-lteal text-dteal' : 'bg-white text-soft border border-bd')}>
              <span className={clsx('flex h-5 w-5 items-center justify-center rounded-full text-xs', i === step ? 'bg-white/25' : 'bg-canvas')}>{i + 1}</span>
              {s}
            </button>
            {i < STEPS.length - 1 && <span className="text-bd">→</span>}
          </li>
        ))}
      </ol>

      {step === 0 && (
        <div className="max-w-2xl space-y-4 rounded-2xl border border-bd bg-white p-6 shadow-soft">
          <TextField label="Campaign Name" value={name} onChange={setName} />
          <TextField label="Campaign Subject" value={subject} onChange={setSubject} />
          <Select label="Language" value={language} onChange={setLanguage} options={LANGS.map((l) => ({ value: l, label: l }))} />
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-sm font-semibold text-dteal">Audience</span>
              <span className="rounded-full bg-lteal px-3 py-1 text-sm font-bold text-dteal">{recipients.toLocaleString()} recipients</span>
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
        </div>
      )}

      {step === 1 && (
        <div className="max-w-2xl rounded-2xl border border-bd bg-white p-4 shadow-soft">
          <RichTextEditor value={body} onChange={setBody} />
        </div>
      )}

      {step === 2 && (
        <div className="max-w-2xl space-y-4 rounded-2xl border border-bd bg-white p-6 shadow-soft">
          <h3 className="font-sans text-base font-bold text-dteal">Review</h3>
          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
            <dt className="text-soft">Name</dt><dd className="text-ink">{name || '—'}</dd>
            <dt className="text-soft">Subject</dt><dd className="text-ink">{subject || '—'}</dd>
            <dt className="text-soft">Language</dt><dd className="text-ink">{language}</dd>
            <dt className="text-soft">Recipients</dt><dd className="font-semibold text-ink">{recipients.toLocaleString()}</dd>
          </dl>
          <div className="flex items-center gap-3 rounded-xl bg-cream p-4">
            <button type="button" onClick={sendTest} className="rounded-lg border border-teal bg-white px-4 py-2 text-sm font-semibold text-teal hover:bg-lteal/40">Send test</button>
            <span className={clsx('text-sm font-semibold', tested ? 'text-green' : 'text-soft')}>{tested ? '✓ Test sent' : 'Required before starting'}</span>
          </div>
        </div>
      )}

      {/* Nav */}
      <div className="flex max-w-2xl items-center justify-between">
        <button type="button" onClick={() => (step === 0 ? router.push('/admin-lab/email-tool') : setStep(step - 1))} className="rounded-xl border border-bd bg-white px-4 py-2.5 text-sm font-semibold text-mute hover:bg-canvas">
          {step === 0 ? 'Cancel' : 'Back'}
        </button>
        {step < 2 ? (
          <button type="button" onClick={() => setStep(step + 1)} className="rounded-xl bg-teal px-5 py-2.5 text-sm font-bold text-white hover:bg-dteal">Next</button>
        ) : (
          <button type="button" disabled={!tested} onClick={start} className="rounded-xl bg-yel px-5 py-2.5 text-sm font-bold text-ink hover:brightness-95 disabled:opacity-40">Start Campaign</button>
        )}
      </div>
    </div>
  );
}
