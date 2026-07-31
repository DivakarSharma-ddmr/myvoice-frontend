'use client';

import { useMemo, useState } from 'react';
import { clsx } from '@/lib/clsx';
import { paginate, filterRows, sortRows } from '@/lib/adminTable';

export type Column<T> = {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  accessor?: (row: T) => string | number;
  sortable?: boolean;
  filter?: 'text' | 'select';
  selectOptions?: { value: string; label: string }[];
  align?: 'left' | 'right' | 'center';
  width?: string;
};

type Props<T> = {
  columns: Column<T>[];
  rows: T[];
  getRowId: (row: T) => string | number;
  selectable?: boolean;
  selected?: Set<string | number>;
  onSelectedChange?: (s: Set<string | number>) => void;
  pageSize?: number;
  totalOverride?: number;
  density?: 'comfortable' | 'compact';
  empty?: React.ReactNode;
};

const alignClass = { left: 'text-left', right: 'text-right', center: 'text-center' };

export function DataTable<T>({
  columns,
  rows,
  getRowId,
  selectable = false,
  selected,
  onSelectedChange,
  pageSize: initialSize = 10,
  totalOverride,
  density = 'comfortable',
  empty,
}: Props<T>) {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(initialSize);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const accessorFor = (key: string) => {
    const col = columns.find((c) => c.key === key);
    return (r: T) => (col?.accessor ? col.accessor(r) : (r as Record<string, unknown>)[key] as string | number);
  };

  const filterAccessors = useMemo(() => {
    const map: Record<string, (r: T) => string | number> = {};
    for (const c of columns) if (c.filter) map[c.key] = accessorFor(c.key);
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns]);

  const processed = useMemo(() => {
    const filtered = filterRows(rows, filters, filterAccessors);
    return sortRows(filtered, sortKey, sortDir, (r, k) => accessorFor(k)(r));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, filters, filterAccessors, sortKey, sortDir]);

  const { slice, pages, page: safePage, total } = paginate(processed, page, size);
  const footerTotal = totalOverride ?? total;
  const cellPad = density === 'compact' ? 'px-3 py-2' : 'px-4 py-3';

  const setFilter = (key: string, value: string) => {
    setFilters((f) => ({ ...f, [key]: value }));
    setPage(1);
  };

  const toggleSort = (key: string) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  };

  const allOnPageSelected = selectable && slice.length > 0 && slice.every((r) => selected?.has(getRowId(r)));
  const toggleAll = () => {
    if (!onSelectedChange) return;
    const next = new Set(selected);
    if (allOnPageSelected) slice.forEach((r) => next.delete(getRowId(r)));
    else slice.forEach((r) => next.add(getRowId(r)));
    onSelectedChange(next);
  };
  const toggleOne = (id: string | number) => {
    if (!onSelectedChange) return;
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    onSelectedChange(next);
  };

  const hasFilters = columns.some((c) => c.filter);

  return (
    <div className="overflow-hidden rounded-2xl border border-bd bg-white shadow-soft">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead className="sticky top-0 z-10 bg-lteal/60 text-left text-dteal">
            <tr>
              {selectable && (
                <th className={clsx(cellPad, 'w-10')}>
                  <input type="checkbox" aria-label="Select all on page" checked={allOnPageSelected} onChange={toggleAll} />
                </th>
              )}
              {columns.map((c) => (
                <th
                  key={c.key}
                  style={c.width ? { width: c.width } : undefined}
                  className={clsx(cellPad, 'font-bold', alignClass[c.align ?? 'left'])}
                >
                  <button
                    type="button"
                    onClick={() => c.sortable && toggleSort(c.key)}
                    className={clsx('inline-flex items-center gap-1', c.sortable ? 'cursor-pointer hover:text-teal' : 'cursor-default')}
                  >
                    {c.header}
                    {c.sortable && (
                      <span className="text-[10px] text-soft">{sortKey === c.key ? (sortDir === 'asc' ? '▲' : '▼') : '↕'}</span>
                    )}
                  </button>
                </th>
              ))}
            </tr>
            {hasFilters && (
              <tr className="bg-white/70">
                {selectable && <th className={cellPad} />}
                {columns.map((c) => (
                  <th key={c.key} className={clsx('px-4 pb-3', alignClass[c.align ?? 'left'])}>
                    {c.filter === 'text' && (
                      <input
                        value={filters[c.key] ?? ''}
                        onChange={(e) => setFilter(c.key, e.target.value)}
                        placeholder="Filter…"
                        aria-label={`Filter ${c.header}`}
                        className="w-full rounded-lg border border-bd bg-white px-2 py-1.5 text-xs font-normal text-ink outline-none focus-visible:ring-2 focus-visible:ring-teal/40"
                      />
                    )}
                    {c.filter === 'select' && (
                      <select
                        value={filters[c.key] ?? ''}
                        onChange={(e) => setFilter(c.key, e.target.value)}
                        aria-label={`Filter ${c.header}`}
                        className="w-full rounded-lg border border-bd bg-white px-2 py-1.5 text-xs font-normal text-ink outline-none focus-visible:ring-2 focus-visible:ring-teal/40"
                      >
                        <option value="">All</option>
                        {c.selectOptions?.map((o) => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                    )}
                  </th>
                ))}
              </tr>
            )}
          </thead>
          <tbody>
            {slice.length === 0 && (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)} className="px-4 py-12 text-center text-soft">
                  {empty ?? 'No records found.'}
                </td>
              </tr>
            )}
            {slice.map((row) => {
              const id = getRowId(row);
              return (
                <tr key={id} className="border-t border-bd/70 hover:bg-cream">
                  {selectable && (
                    <td className={cellPad}>
                      <input type="checkbox" aria-label={`Select row ${id}`} checked={selected?.has(id) ?? false} onChange={() => toggleOne(id)} />
                    </td>
                  )}
                  {columns.map((c) => (
                    <td key={c.key} className={clsx(cellPad, 'text-ink', alignClass[c.align ?? 'left'])}>
                      {c.render ? c.render(row) : String((row as Record<string, unknown>)[c.key] ?? '')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-bd bg-white px-4 py-3 text-sm text-soft">
        <div className="flex items-center gap-2">
          <span>Page</span>
          <button type="button" onClick={() => setPage(safePage - 1)} disabled={safePage <= 1} className="rounded border border-bd px-2 py-0.5 disabled:opacity-40">‹</button>
          <span className="min-w-[2rem] text-center font-semibold text-ink">{safePage}</span>
          <button type="button" onClick={() => setPage(safePage + 1)} disabled={safePage >= pages} className="rounded border border-bd px-2 py-0.5 disabled:opacity-40">›</button>
          <span>of {pages}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>View</span>
          <select
            value={size}
            onChange={(e) => { setSize(Number(e.target.value)); setPage(1); }}
            aria-label="Rows per page"
            className="rounded-lg border border-bd bg-white px-2 py-1 text-ink outline-none focus-visible:ring-2 focus-visible:ring-teal/40"
          >
            {[10, 25, 50].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
          <span>records | Found total {footerTotal.toLocaleString()} records</span>
        </div>
      </div>
    </div>
  );
}
