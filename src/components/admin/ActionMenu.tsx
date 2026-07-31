'use client';

import { useEffect, useRef, useState } from 'react';
import { clsx } from '@/lib/clsx';

export type ActionItem = {
  label: string;
  danger?: boolean;
  disabled?: boolean;
  onClick: () => void;
};

/** The legacy "Actions ▾" row menu: primary trigger + dropdown, click-out + Esc. */
export function ActionMenu({ items, label = 'Actions' }: { items: ActionItem[]; label?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey); };
  }, [open]);

  return (
    <div ref={ref} className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 rounded-lg bg-teal2 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal"
      >
        {label}
        <span className="text-[10px]">▾</span>
      </button>
      {open && (
        <div role="menu" className="absolute right-0 z-20 mt-1 w-44 overflow-hidden rounded-xl border border-bd bg-white py-1 shadow-card">
          {items.map((it, i) => (
            <button
              key={i}
              role="menuitem"
              disabled={it.disabled}
              onClick={() => { setOpen(false); it.onClick(); }}
              className={clsx(
                'flex w-full items-center px-3 py-2 text-left text-sm hover:bg-cream disabled:opacity-40',
                it.danger ? 'text-danger' : 'text-ink'
              )}
            >
              {it.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
