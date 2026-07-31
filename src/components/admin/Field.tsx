'use client';

import { useState } from 'react';
import { clsx } from '@/lib/clsx';

const inputBase =
  'w-full rounded-xl border border-bd bg-white px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-mute focus-visible:ring-2 focus-visible:ring-teal/40';

function Label({ label, required }: { label?: string; required?: boolean }) {
  if (!label) return null;
  return (
    <span className="mb-1.5 block text-sm font-semibold text-dteal">
      {label}
      {required && <span className="text-danger"> *</span>}
    </span>
  );
}

export function TextField({
  label, value, onChange, type = 'text', placeholder, required, readOnly, className,
}: {
  label?: string; value: string; onChange?: (v: string) => void; type?: string;
  placeholder?: string; required?: boolean; readOnly?: boolean; className?: string;
}) {
  return (
    <label className={clsx('block', className)}>
      <Label label={label} required={required} />
      <input
        type={type}
        value={value}
        readOnly={readOnly}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        className={clsx(inputBase, readOnly && 'bg-canvas text-soft')}
      />
    </label>
  );
}

export function TextArea({
  label, value, onChange, placeholder, rows = 3, className,
}: {
  label?: string; value: string; onChange?: (v: string) => void; placeholder?: string; rows?: number; className?: string;
}) {
  return (
    <label className={clsx('block', className)}>
      <Label label={label} />
      <textarea
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        className={clsx(inputBase, 'resize-y')}
      />
    </label>
  );
}

export function Select({
  label, value, onChange, options, className,
}: {
  label?: string; value: string; onChange?: (v: string) => void;
  options: { value: string; label: string }[]; className?: string;
}) {
  return (
    <label className={clsx('block', className)}>
      <Label label={label} />
      <select value={value} onChange={(e) => onChange?.(e.target.value)} className={inputBase}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}

/** Two-state segmented toggle (e.g. Male / Female). */
export function Toggle({
  label, value, onChange, options,
}: {
  label?: string; value: string; onChange?: (v: string) => void; options: [string, string];
}) {
  return (
    <div>
      <Label label={label} />
      <div className="inline-flex overflow-hidden rounded-xl border border-bd">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => onChange?.(o)}
            className={clsx(
              'px-6 py-2 text-sm font-semibold transition',
              value === o ? 'bg-teal text-white' : 'bg-white text-soft hover:bg-canvas'
            )}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

export function DatePicker({
  label, value, onChange, required, className,
}: {
  label?: string; value: string; onChange?: (v: string) => void; required?: boolean; className?: string;
}) {
  return (
    <label className={clsx('block', className)}>
      <Label label={label} required={required} />
      <input type="date" value={value} onChange={(e) => onChange?.(e.target.value)} className={inputBase} />
    </label>
  );
}

/** Image upload with a live preview (logo / avatar). Object URL is local-only. */
export function FileUpload({
  label, currentSrc, onFile,
}: {
  label?: string; currentSrc?: string; onFile?: (file: File) => void;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const src = preview ?? currentSrc;
  return (
    <div>
      <Label label={label} />
      <div className="flex items-center gap-4">
        {src && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt="Preview" className="h-16 w-16 rounded-xl border border-bd object-contain bg-white p-1" />
        )}
        <label className="cursor-pointer rounded-xl border border-teal bg-white px-4 py-2 text-sm font-semibold text-teal hover:bg-lteal/40">
          Choose file
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) { setPreview(URL.createObjectURL(f)); onFile?.(f); }
            }}
          />
        </label>
      </div>
    </div>
  );
}
