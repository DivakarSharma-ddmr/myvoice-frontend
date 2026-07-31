'use client';

import { useEffect, useRef } from 'react';
import { clsx } from '@/lib/clsx';

type Props = {
  open: boolean;
  title: string;
  body?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: 'default' | 'danger';
  onConfirm: () => void;
  onCancel: () => void;
};

/** Confirmation modal for sensitive / bulk / destructive actions. Esc + focus on confirm. */
export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'default',
  onConfirm,
  onCancel,
}: Props) {
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onCancel(); };
    document.addEventListener('keydown', onKey);
    confirmRef.current?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-ink/40 motion-safe:animate-[qpop_.15s_ease-out]" onClick={onCancel} />
      <div className="relative w-full max-w-md rounded-2xl border border-bd bg-white p-6 shadow-lift motion-safe:animate-[qpop_.18s_ease-out]">
        <h2 className="font-sans text-lg font-bold text-dteal">{title}</h2>
        {body && <div className="mt-2 text-sm text-soft">{body}</div>}
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="rounded-xl border border-bd bg-white px-4 py-2 text-sm font-semibold text-mute hover:bg-canvas">
            {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            type="button"
            onClick={onConfirm}
            className={clsx(
              'rounded-xl px-4 py-2 text-sm font-bold',
              tone === 'danger' ? 'bg-danger text-white hover:brightness-95' : 'bg-yel text-ink hover:brightness-95'
            )}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
