'use client';

import { ActionMenu, type ActionItem } from '@/components/admin/ActionMenu';

/** Unified V2 row-action convention: one visible primary + overflow menu for the rest. */
export function RowActions({ primary, items }: { primary?: { label: string; onClick: () => void }; items: ActionItem[] }) {
  return (
    <div className="inline-flex items-center gap-1.5">
      {primary && (
        <button type="button" onClick={primary.onClick} className="rounded-lg border border-teal px-3 py-1.5 text-xs font-semibold text-teal hover:bg-lteal/40">
          {primary.label}
        </button>
      )}
      {items.length > 0 && <ActionMenu items={items} label="More" />}
    </div>
  );
}
