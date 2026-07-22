import Link from 'next/link';

// A locked field deliberately has NO edit control rather than a disabled one:
// a disabled button offers no explanation on touch devices, where there is no
// hover to reveal a tooltip.
export function SettingsField({
  label,
  value,
  locked = false,
  hint,
}: {
  label: string;
  value: string;
  locked?: boolean;
  hint?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-t border-bd py-3">
      <div className="min-w-0">
        <div className="text-[13px] font-semibold text-mute">{label}</div>
        <div className="mt-0.5 break-words text-sm font-bold">
          {value || <span className="font-semibold text-mute">Not set</span>}
        </div>
        {hint && <p className="mt-1 text-[11px] leading-snug text-mute">{hint}</p>}
      </div>
      {locked && (
        <div className="shrink-0 text-right">
          <div className="text-[11px] font-bold text-mute">
            <span aria-hidden="true">🔒 </span>Locked
          </div>
          <Link href="/member/help" className="text-[11px] font-bold text-teal hover:underline">
            Contact support
          </Link>
        </div>
      )}
    </div>
  );
}
