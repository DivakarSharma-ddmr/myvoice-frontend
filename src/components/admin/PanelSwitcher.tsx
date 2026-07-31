'use client';

import { useEffect, useRef, useState } from 'react';
import { clsx } from '@/lib/clsx';
import { PANELS } from '@/lib/adminMockData';
import { useAdmin } from './AdminProvider';

/** Searchable panel switcher (30+ country panels) with a Global | <panel> scope note. */
export function PanelSwitcher() {
  const { panel, setPanel } = useAdmin();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey); };
  }, [open]);

  const list = PANELS.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-teal hover:bg-lteal/50"
      >
        {panel.name}
        <span className="text-[10px]">▾</span>
      </button>
      {open && (
        <div className="absolute right-0 z-30 mt-1 w-64 overflow-hidden rounded-xl border border-bd bg-white shadow-card">
          <div className="border-b border-bd p-2">
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search panels…"
              aria-label="Search panels"
              className="w-full rounded-lg border border-bd px-2.5 py-1.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-teal/40"
            />
          </div>
          <ul role="listbox" className="max-h-72 overflow-y-auto py-1">
            {list.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={p.id === panel.id}
                  onClick={() => { setPanel(p.id); setOpen(false); setQ(''); }}
                  className={clsx(
                    'flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-cream',
                    p.id === panel.id ? 'font-bold text-dteal' : 'text-ink'
                  )}
                >
                  <span>{p.name}</span>
                  <span className="text-xs text-soft">{p.memberCount.toLocaleString()}</span>
                </button>
              </li>
            ))}
            {list.length === 0 && <li className="px-3 py-3 text-sm text-soft">No panels match.</li>}
          </ul>
        </div>
      )}
    </div>
  );
}
