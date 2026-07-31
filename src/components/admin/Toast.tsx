'use client';

export type ToastMsg = { id: number; text: string };

/** Presentational toast stack (bottom-right). State + timers live in AdminProvider. */
export function ToastViewport({ toasts, onDismiss }: { toasts: ToastMsg[]; onDismiss: (id: number) => void }) {
  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[60] flex w-80 max-w-[calc(100vw-2.5rem)] flex-col gap-2">
      {toasts.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onDismiss(t.id)}
          className="pointer-events-auto rounded-xl border border-dteal/20 bg-dteal px-4 py-3 text-left text-sm font-medium text-white shadow-card motion-safe:animate-[qtoast_.25s_ease-out]"
        >
          {t.text}
        </button>
      ))}
    </div>
  );
}
