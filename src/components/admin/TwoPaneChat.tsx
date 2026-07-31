'use client';

import { useState } from 'react';
import { clsx } from '@/lib/clsx';
import { useAdmin } from './AdminProvider';

export function TwoPaneChat() {
  const { data, sendMessage } = useAdmin();
  const [activeId, setActiveId] = useState(data.threads[0]?.id ?? '');
  const [q, setQ] = useState('');
  const [draft, setDraft] = useState('');

  const threads = data.threads.filter(
    (t) => t.name.toLowerCase().includes(q.toLowerCase()) || t.email.toLowerCase().includes(q.toLowerCase())
  );
  const active = data.threads.find((t) => t.id === activeId);

  const send = () => { if (draft.trim() && active) { sendMessage(active.id, draft.trim()); setDraft(''); } };

  return (
    <div className="grid h-[calc(100vh-190px)] min-h-[480px] grid-cols-1 overflow-hidden rounded-2xl border border-bd bg-white shadow-soft md:grid-cols-[320px_1fr]">
      {/* Recent list */}
      <div className="flex flex-col border-r border-bd">
        <div className="border-b border-bd p-3">
          <h2 className="mb-2 font-sans text-base font-bold text-dteal">Recent</h2>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" aria-label="Search conversations" className="w-full rounded-lg border border-bd px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-teal/40" />
        </div>
        <ul className="flex-1 overflow-y-auto">
          {threads.map((t) => (
            <li key={t.id}>
              <button type="button" onClick={() => setActiveId(t.id)} className={clsx('flex w-full items-start gap-3 border-b border-bd px-3 py-3 text-left hover:bg-cream', t.id === activeId && 'bg-lteal/50')}>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal text-sm font-bold text-white">{t.name.charAt(0)}</span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-semibold text-ink">{t.name}</span>
                    <span className="shrink-0 text-[11px] text-soft">{t.date}</span>
                  </span>
                  <span className="mt-0.5 line-clamp-2 block text-xs text-soft">{t.preview}</span>
                </span>
              </button>
            </li>
          ))}
          {threads.length === 0 && <li className="px-3 py-6 text-center text-sm text-soft">No conversations.</li>}
        </ul>
      </div>

      {/* Conversation */}
      {active ? (
        <div className="flex min-w-0 flex-col">
          <div className="border-b border-bd px-5 py-3">
            <h3 className="font-sans text-base font-bold text-dteal">{active.name} — {active.panel}</h3>
            <p className="text-xs text-soft">Panelist ID: {active.panelistId} | Email: {active.email}</p>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto bg-cream/40 p-5">
            {active.messages.map((m, i) => (
              <div key={i} className={clsx('flex', m.from === 'admin' ? 'justify-end' : 'justify-start')}>
                <div className={clsx('max-w-[75%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-sm', m.from === 'admin' ? 'bg-dteal text-white' : 'bg-lteal text-ink')}>
                  {m.text}
                  <div className={clsx('mt-1 text-[10px]', m.from === 'admin' ? 'text-white/70' : 'text-soft')}>{m.time}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-end gap-2 border-t border-bd p-3">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
              rows={1}
              placeholder="Type your message here"
              aria-label="Message"
              className="max-h-32 flex-1 resize-none rounded-xl border border-bd px-3.5 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-teal/40"
            />
            <button type="button" onClick={send} className="rounded-xl bg-teal px-4 py-2.5 text-sm font-bold text-white hover:bg-dteal">Send</button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center text-sm text-soft">Select a conversation.</div>
      )}
    </div>
  );
}
