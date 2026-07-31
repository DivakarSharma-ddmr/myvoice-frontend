'use client';

import { useEffect } from 'react';

/** Right slide-in detail panel. Backdrop click + Esc close. */
export function DetailDrawer({
  open, title, subtitle, onClose, children, footer,
}: {
  open: boolean; title: string; subtitle?: string; onClose: () => void;
  children: React.ReactNode; footer?: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} />
      <div className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-bd bg-white shadow-lift motion-safe:animate-[qtoast_.2s_ease-out]">
        <div className="flex items-start justify-between border-b border-bd px-5 py-4">
          <div className="min-w-0">
            <h2 className="font-sans text-lg font-bold text-dteal">{title}</h2>
            {subtitle && <p className="mt-0.5 truncate text-sm text-soft">{subtitle}</p>}
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-lg p-1.5 text-mute hover:bg-cream">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer && <div className="border-t border-bd px-5 py-4">{footer}</div>}
      </div>
    </div>
  );
}
