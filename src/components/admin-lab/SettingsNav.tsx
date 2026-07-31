'use client';

import { clsx } from '@/lib/clsx';

/** Vertical settings navigation (V2 replaces V1's top tabs for settings pages). */
export function SettingsNav({ items, active, onChange }: { items: { id: string; label: string }[]; active: string; onChange: (id: string) => void }) {
  return (
    <nav className="flex gap-1 overflow-x-auto rounded-2xl border border-bd bg-white p-2 shadow-soft lg:flex-col lg:overflow-visible">
      {items.map((it) => (
        <button key={it.id} type="button" onClick={() => onChange(it.id)}
          className={clsx('whitespace-nowrap rounded-xl px-4 py-2.5 text-left text-sm font-semibold transition', it.id === active ? 'bg-lteal text-dteal' : 'text-soft hover:bg-cream hover:text-teal')}>
          {it.label}
        </button>
      ))}
    </nav>
  );
}
