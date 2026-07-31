import { clsx } from '@/lib/clsx';
import { statusToken, type StatusIcon } from '@/lib/adminStatus';

/** Inline SVG glyphs — colorblind-safe: status is never colour alone. */
const ICONS: Record<StatusIcon, React.ReactNode> = {
  check: <path d="M20 6 9 17l-5-5" />,
  dash: <path d="M5 12h14" />,
  moon: <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />,
  'bell-off': <><path d="m2 2 20 20" /><path d="M8.7 3.3A6 6 0 0 1 18 8c0 3 .7 4.5 1.5 5.5" /><path d="M6 8c0 3-1 5-2 6h13" /><path d="M10.3 21a2 2 0 0 0 3.4 0" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  pause: <><path d="M9 5v14" /><path d="M15 5v14" /></>,
  x: <path d="M18 6 6 18M6 6l12 12" />,
};

export function StatusPill({ status, className }: { status: string; className?: string }) {
  const t = statusToken(status);
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold',
        t.tone,
        className
      )}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-3.5 w-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {ICONS[t.icon]}
      </svg>
      {t.label}
    </span>
  );
}
