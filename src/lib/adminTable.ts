/**
 * Pure table helpers — paginate / filter / sort.
 * Self-contained (no @/ imports) so the node:test runner can load it directly.
 * The <DataTable/> component composes these; keeping them pure keeps the UI thin
 * and the logic unit-testable.
 */

export type Page<T> = { slice: T[]; page: number; pages: number; total: number };

/** 1-indexed pagination; clamps out-of-range page numbers. */
export function paginate<T>(rows: T[], page: number, size: number): Page<T> {
  const total = rows.length;
  const pages = Math.max(1, Math.ceil(total / size));
  const p = Math.min(Math.max(1, page | 0), pages);
  const start = (p - 1) * size;
  return { slice: rows.slice(start, start + size), page: p, pages, total };
}

/**
 * Case-insensitive substring filter across named accessors.
 * An empty value — or the sentinel 'all' — means "no filter on this column".
 */
export function filterRows<T>(
  rows: T[],
  filters: Record<string, string>,
  accessors: Record<string, (r: T) => string | number>
): T[] {
  const active = Object.entries(filters).filter(([, v]) => v && v !== 'all');
  if (!active.length) return rows;
  return rows.filter((r) =>
    active.every(([k, v]) => {
      const get = accessors[k];
      if (!get) return true;
      return String(get(r)).toLowerCase().includes(String(v).toLowerCase());
    })
  );
}

/** Stable sort by an accessor; null key preserves original order. */
export function sortRows<T>(
  rows: T[],
  key: string | null,
  dir: 'asc' | 'desc',
  accessor: (r: T, k: string) => string | number
): T[] {
  if (!key) return rows;
  const sorted = [...rows].sort((a, b) => {
    const av = accessor(a, key);
    const bv = accessor(b, key);
    if (av < bv) return -1;
    if (av > bv) return 1;
    return 0;
  });
  return dir === 'desc' ? sorted.reverse() : sorted;
}
