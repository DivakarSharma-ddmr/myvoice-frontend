import { clsx } from '@/lib/clsx';

/** Dashboard metric tile — big number + label. */
export function StatTile({ value, label, className }: { value: React.ReactNode; label: string; className?: string }) {
  return (
    <div className={clsx('rounded-2xl border border-bd bg-white p-5 shadow-soft', className)}>
      <div className="font-sans text-3xl font-extrabold text-dteal">{value}</div>
      <div className="mt-1 text-sm font-semibold uppercase tracking-wide text-soft">{label}</div>
    </div>
  );
}
