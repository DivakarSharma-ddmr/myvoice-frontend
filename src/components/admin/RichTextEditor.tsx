'use client';

import { useEffect, useRef } from 'react';
import { clsx } from '@/lib/clsx';

type Props = {
  value: string;
  onChange: (html: string) => void;
  tags?: { token: string; label: string }[];
  onPreview?: () => void;
  className?: string;
};

const TOOLBAR: { cmd: string; label: string; arg?: string }[] = [
  { cmd: 'bold', label: 'B' },
  { cmd: 'italic', label: 'I' },
  { cmd: 'underline', label: 'U' },
  { cmd: 'insertUnorderedList', label: '• List' },
  { cmd: 'insertOrderedList', label: '1. List' },
];

/**
 * Lightweight rich-text editor (contentEditable + execCommand). Uncontrolled:
 * seeds innerHTML on mount, emits HTML on input. Parents remount it (via `key`)
 * to load different content. Merge-tag chips insert tokens at the caret.
 */
export function RichTextEditor({ value, onChange, tags, onPreview, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.innerHTML = value;
    // Seed once on mount; parent uses `key` to reload different content.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const emit = () => { if (ref.current) onChange(ref.current.innerHTML); };

  const exec = (cmd: string) => {
    ref.current?.focus();
    document.execCommand(cmd, false);
    emit();
  };

  const insertTag = (token: string) => {
    ref.current?.focus();
    document.execCommand('insertText', false, token);
    emit();
  };

  return (
    <div className={clsx('overflow-hidden rounded-xl border border-bd bg-white', className)}>
      <div className="flex flex-wrap items-center gap-1 border-b border-bd bg-canvas px-2 py-1.5">
        {TOOLBAR.map((t) => (
          <button key={t.cmd} type="button" onMouseDown={(e) => { e.preventDefault(); exec(t.cmd); }} className="rounded px-2 py-1 text-xs font-semibold text-soft hover:bg-white hover:text-teal">
            {t.label}
          </button>
        ))}
        {onPreview && (
          <button type="button" onClick={onPreview} className="ml-auto rounded bg-teal px-2.5 py-1 text-xs font-semibold text-white hover:bg-dteal">Preview Template</button>
        )}
      </div>

      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-1 border-b border-bd px-2 py-2">
          {tags.map((t) => (
            <button key={t.token} type="button" onMouseDown={(e) => { e.preventDefault(); insertTag(t.token); }} title={t.token} className="rounded-full border border-teal/40 bg-lteal/40 px-2.5 py-1 text-xs font-semibold text-teal hover:bg-lteal">
              {t.label}
            </button>
          ))}
        </div>
      )}

      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={emit}
        role="textbox"
        aria-multiline="true"
        aria-label="Rich text editor"
        className="min-h-[180px] px-3.5 py-3 text-sm text-ink outline-none [&_a]:text-teal [&_a]:underline"
      />
    </div>
  );
}
