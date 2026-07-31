'use client';

import { clsx } from '@/lib/clsx';

export type Tab = { id: string; label: string };

/** Section-level underlined tab bar (matches the legacy admin tab strip). */
export function Tabs({ tabs, active, onChange }: { tabs: Tab[]; active: string; onChange: (id: string) => void }) {
  return (
    <div className="flex flex-wrap gap-1 border-b border-bd" role="tablist">
      {tabs.map((t) => {
        const on = t.id === active;
        return (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={on}
            onClick={() => onChange(t.id)}
            className={clsx(
              '-mb-px border-b-2 px-4 py-2.5 text-sm font-semibold transition',
              on ? 'border-dteal text-dteal' : 'border-transparent text-soft hover:text-teal'
            )}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
