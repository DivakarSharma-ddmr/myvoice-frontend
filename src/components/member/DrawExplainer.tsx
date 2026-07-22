'use client';
import { useEffect } from 'react';
import Link from 'next/link';

// Copy states ONLY what the signed Click Draw regulation promises: entries come
// from screenouts, quota-full and survey-closed outcomes. The internal level
// perks that also weight entries are operational data and are never advertised
// to members. See DESIGN.md and the 2026-07-22 spec.
const STEPS: [string, string][] = [
  [
    'You get an entry every time a survey does not work out',
    'If a survey ends because you were screened out, the quota was already full, or it had closed, you get one entry. There is no limit on how many you can earn in a month.',
  ],
  [
    'Completing a survey pays you directly instead',
    'Completed surveys pay their reward straight into your balance. The draw is there for the attempts that did not pay.',
  ],
  [
    'Entries reset at the start of each month',
    'Every month starts fresh. Entries do not carry over.',
  ],
  [
    'Eleven members win every month',
    'One member wins €50 and ten members win €10 — €150 in total. Winners are picked at random using random.org, and one person can win once per month.',
  ],
  [
    'We credit the prize to your MyVoice account',
    'We email you first. A month’s draw takes place before the end of the following month.',
  ],
];

export function DrawExplainer({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-[rgba(15,30,30,.45)] p-4 backdrop-blur-sm md:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="draw-explainer-title"
        className="flex max-h-[85vh] w-full max-w-[560px] flex-col overflow-hidden rounded-3xl2 bg-white shadow-lift"
      >
        <div className="flex items-center justify-between gap-3 border-b border-bd px-5 py-4">
          <h2 id="draw-explainer-title" className="text-lg font-extrabold text-dteal">
            How the Click Draw works
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-[#F1F2EE] text-sm text-mute"
          >
            ✕
          </button>
        </div>

        <div className="min-h-0 overflow-y-auto px-5 py-4">
          <ol className="space-y-4">
            {STEPS.map(([title, body], i) => (
              <li key={i} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-lteal text-[13px] font-extrabold text-teal"
                >
                  {i + 1}
                </span>
                <div>
                  <div className="text-sm font-bold text-ink">{title}</div>
                  <p className="mt-0.5 text-[13px] leading-relaxed text-soft">{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="border-t border-bd px-5 py-4">
          <Link href="/legal/click-draw" className="text-[13px] font-bold text-teal hover:underline">
            Read the full terms and conditions
          </Link>
        </div>
      </div>
    </div>
  );
}
