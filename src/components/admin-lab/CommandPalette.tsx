'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { seed } from '@/lib/adminMockData';
import { LAB_NAV } from './labNav';
import { useLabUI } from './LabUIProvider';

type Result =
  | { kind: 'section'; label: string; href: string }
  | { kind: 'member'; label: string; sub: string; id: number };

/** ⌘K / Ctrl+K palette: jump to any section, or to a member by id / email. */
export function CommandPalette() {
  const router = useRouter();
  const { paletteOpen, setPaletteOpen, setFocusMemberId } = useLabUI();
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);

  useEffect(() => { if (paletteOpen) { setQ(''); setActive(0); } }, [paletteOpen]);

  const results = useMemo<Result[]>(() => {
    const query = q.trim().toLowerCase();
    const sections: Result[] = LAB_NAV
      .filter((n) => !query || n.label.toLowerCase().includes(query))
      .map((n) => ({ kind: 'section', label: n.label, href: n.href }));
    const members: Result[] = query
      ? seed.members
          .filter((m) => String(m.id).includes(query) || m.email.toLowerCase().includes(query))
          .slice(0, 6)
          .map((m) => ({ kind: 'member', label: m.email, sub: `Member #${m.id} · ${m.status}`, id: m.id }))
      : [];
    return [...sections, ...members];
  }, [q]);

  const go = (r: Result) => {
    setPaletteOpen(false);
    if (r.kind === 'section') router.push(r.href);
    else { setFocusMemberId(r.id); router.push('/admin-lab/members'); }
  };

  useEffect(() => {
    if (!paletteOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPaletteOpen(false);
      else if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
      else if (e.key === 'Enter') { e.preventDefault(); if (results[active]) go(results[active]); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paletteOpen, results, active]);

  if (!paletteOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center p-4 pt-[12vh]" role="dialog" aria-modal="true" aria-label="Command palette">
      <div className="absolute inset-0 bg-ink/40" onClick={() => setPaletteOpen(false)} />
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-bd bg-white shadow-lift">
        <input
          autoFocus
          value={q}
          onChange={(e) => { setQ(e.target.value); setActive(0); }}
          placeholder="Jump to a section, or find a member by id / email…"
          aria-label="Command palette search"
          className="w-full border-b border-bd px-4 py-3.5 text-sm outline-none"
        />
        <ul className="max-h-80 overflow-y-auto py-1">
          {results.map((r, i) => (
            <li key={`${r.kind}-${r.kind === 'member' ? r.id : r.href}`}>
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onClick={() => go(r)}
                className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm ${i === active ? 'bg-lteal' : 'hover:bg-cream'}`}
              >
                <span className="min-w-0">
                  <span className="block truncate text-ink">{r.label}</span>
                  {r.kind === 'member' && <span className="block truncate text-xs text-soft">{r.sub}</span>}
                </span>
                <span className="shrink-0 text-[11px] uppercase tracking-wide text-soft">{r.kind}</span>
              </button>
            </li>
          ))}
          {results.length === 0 && <li className="px-4 py-6 text-center text-sm text-soft">No matches.</li>}
        </ul>
        <div className="flex items-center gap-3 border-t border-bd bg-canvas px-4 py-2 text-[11px] text-soft">
          <span>↑↓ navigate</span><span>↵ open</span><span>esc close</span>
        </div>
      </div>
    </div>
  );
}
