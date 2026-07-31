'use client';

import { useState } from 'react';
import { clsx } from '@/lib/clsx';
import { useAdmin } from '@/components/admin/AdminProvider';
import { StatusPill } from '@/components/admin/StatusPill';

const CANNED: { label: string; text: string }[] = [
  { label: 'Account active (EN)', text: 'Hello, thank you for your message. Your account is active and verified. Please stay active on the panel — more surveys will match your profile soon.' },
  { label: 'Screenout (EN)', text: 'If a survey does not show as complete, it means you did not qualify for it, so no reward was earned. This is normal — please keep trying other surveys.' },
  { label: 'Payout timing (EN)', text: 'Rewards are processed within 3 working days after approval. You will receive your voucher by email.' },
  { label: 'Mulțumesc (RO)', text: 'Bună ziua! Vă mulțumim pentru mesaj. Contul dvs. este activ. O zi bună!' },
];

export function ChatConsole() {
  const { data, sendMessage } = useAdmin();
  const [activeId, setActiveId] = useState(data.threads[0]?.id ?? '');
  const [q, setQ] = useState('');
  const [draft, setDraft] = useState('');
  const [cannedOpen, setCannedOpen] = useState(false);

  const threads = data.threads.filter((t) => t.name.toLowerCase().includes(q.toLowerCase()) || t.email.toLowerCase().includes(q.toLowerCase()));
  const active = data.threads.find((t) => t.id === activeId);
  const member = active ? data.members.find((m) => m.email.toLowerCase() === active.email.toLowerCase()) : undefined;
  const redemptions = active ? data.memberRewards.filter((r) => r.email.toLowerCase() === active.email.toLowerCase()) : [];

  const send = () => { if (draft.trim() && active) { sendMessage(active.id, draft.trim()); setDraft(''); } };

  return (
    <div className="grid h-[calc(100vh-190px)] min-h-[480px] grid-cols-1 overflow-hidden rounded-2xl border border-bd bg-white shadow-soft lg:grid-cols-[280px_1fr_260px]">
      {/* Recent */}
      <div className="flex flex-col border-r border-bd">
        <div className="border-b border-bd p-3">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" aria-label="Search conversations" className="w-full rounded-lg border border-bd px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-teal/40" />
        </div>
        <ul className="flex-1 overflow-y-auto">
          {threads.map((t) => (
            <li key={t.id}>
              <button type="button" onClick={() => setActiveId(t.id)} className={clsx('flex w-full items-start gap-3 border-b border-bd px-3 py-3 text-left hover:bg-cream', t.id === activeId && 'bg-lteal/50')}>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal text-sm font-bold text-white">{t.name.charAt(0)}</span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2"><span className="truncate text-sm font-semibold text-ink">{t.name}</span><span className="shrink-0 text-[11px] text-soft">{t.date}</span></span>
                  <span className="mt-0.5 line-clamp-2 block text-xs text-soft">{t.preview}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Conversation */}
      {active ? (
        <div className="flex min-w-0 flex-col border-r border-bd">
          <div className="border-b border-bd px-5 py-3">
            <h3 className="font-sans text-base font-bold text-dteal">{active.name} — {active.panel}</h3>
            <p className="text-xs text-soft">Panelist ID: {active.panelistId} | {active.email}</p>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto bg-cream/40 p-5">
            {active.messages.map((m, i) => (
              <div key={i} className={clsx('flex', m.from === 'admin' ? 'justify-end' : 'justify-start')}>
                <div className={clsx('max-w-[80%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-sm', m.from === 'admin' ? 'bg-dteal text-white' : 'bg-lteal text-ink')}>
                  {m.text}<div className={clsx('mt-1 text-[10px]', m.from === 'admin' ? 'text-white/70' : 'text-soft')}>{m.time}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-bd p-3">
            <div className="relative mb-2">
              <button type="button" onClick={() => setCannedOpen((o) => !o)} className="rounded-lg border border-bd px-3 py-1.5 text-xs font-semibold text-soft hover:bg-cream">Canned replies ▾</button>
              {cannedOpen && (
                <div className="absolute bottom-full z-10 mb-1 w-72 overflow-hidden rounded-xl border border-bd bg-white py-1 shadow-card">
                  {CANNED.map((c) => (
                    <button key={c.label} type="button" onClick={() => { setDraft(c.text); setCannedOpen(false); }} className="block w-full px-3 py-2 text-left text-sm text-ink hover:bg-cream">{c.label}</button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-end gap-2">
              <textarea value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }} rows={2} placeholder="Type your message here" aria-label="Message" className="max-h-32 flex-1 resize-none rounded-xl border border-bd px-3.5 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-teal/40" />
              <button type="button" onClick={send} className="rounded-xl bg-teal px-4 py-2.5 text-sm font-bold text-white hover:bg-dteal">Send</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center border-r border-bd text-sm text-soft">Select a conversation.</div>
      )}

      {/* Member context strip */}
      <div className="hidden flex-col overflow-y-auto p-4 lg:flex">
        <h4 className="mb-3 font-sans text-sm font-bold text-dteal">Member context</h4>
        {active ? (
          <div className="space-y-4 text-sm">
            <div><div className="text-xs text-soft">Panel</div><div className="text-ink">{active.panel}</div></div>
            <div><div className="text-xs text-soft">Panelist ID</div><div className="text-ink">{active.panelistId}</div></div>
            <div><div className="text-xs text-soft">Account status</div><div className="mt-1">{member ? <StatusPill status={member.status} /> : <span className="text-soft">Not on this panel</span>}</div></div>
            <div>
              <div className="mb-1 text-xs text-soft">Recent redemptions</div>
              {redemptions.length === 0 ? <div className="text-soft">None on record.</div> : (
                <ul className="space-y-1">
                  {redemptions.slice(0, 5).map((r) => (
                    <li key={r.id} className="flex items-center justify-between rounded-lg bg-cream px-2.5 py-1.5 text-xs"><span className="text-ink">{r.reward} · €{r.value}</span><StatusPill status={r.status} /></li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ) : <p className="text-sm text-soft">No conversation selected.</p>}
      </div>
    </div>
  );
}
