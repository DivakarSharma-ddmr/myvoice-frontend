'use client';
import { useEffect, useRef, useState } from 'react';
import { faqCategories } from '@/content/faq.generated';

const FOCUSABLE =
  'a[href], button:not([disabled]), select, input, [tabindex]:not([tabindex="-1"])';

export function FaqPanel({
  open,
  categoryName,
  itemId,
  onClose,
}: {
  open: boolean;
  categoryName?: string;
  itemId?: string;
  onClose: () => void;
}) {
  const [active, setActive] = useState(categoryName ?? faqCategories[0].name);
  const [openItem, setOpenItem] = useState<string | undefined>(itemId);
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreTo = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    restoreTo.current = document.activeElement as HTMLElement;
    if (categoryName) setActive(categoryName);
    setOpenItem(itemId);
    panelRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
      restoreTo.current?.focus();
    };
  }, [open, categoryName, itemId]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const f = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!f || !f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  const category = faqCategories.find((c) => c.name === active) ?? faqCategories[0];

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-[rgba(15,30,30,.45)] p-4 backdrop-blur-sm md:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="faq-panel-title"
        className="flex max-h-[85vh] w-full max-w-[880px] flex-col overflow-hidden rounded-3xl2 bg-white shadow-lift outline-none"
      >
        <div className="flex items-center justify-between gap-3 border-b border-bd px-5 py-4">
          <h2 id="faq-panel-title" className="text-lg font-extrabold text-dteal">
            Frequently asked questions
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-[#F1F2EE] text-sm text-mute"
          >
            ✕
          </button>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-[220px_minmax(0,1fr)]">
          <div className="border-b border-bd p-4 md:border-b-0 md:border-r">
            <label className="md:hidden">
              <span className="sr-only">Category</span>
              <select
                value={active}
                onChange={(e) => {
                  setActive(e.target.value);
                  setOpenItem(undefined);
                }}
                className="w-full rounded-[11px] border border-bd bg-white px-3.5 py-3 text-sm outline-none focus:border-teal"
              >
                {faqCategories.map((c) => (
                  <option key={c.name}>{c.name}</option>
                ))}
              </select>
            </label>

            <ul className="hidden md:block md:space-y-1">
              {faqCategories.map((c) => (
                <li key={c.name}>
                  <button
                    onClick={() => {
                      setActive(c.name);
                      setOpenItem(undefined);
                    }}
                    aria-current={c.name === active ? 'true' : undefined}
                    className={`w-full rounded-[10px] px-3 py-2 text-left text-[13px] font-semibold ${
                      c.name === active ? 'bg-lteal text-teal' : 'text-soft hover:bg-cream'
                    }`}
                  >
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="min-h-0 overflow-y-auto p-4">
            {category.items.map((it) => {
              const isOpen = openItem === it.id;
              return (
                <div key={it.id} className="border-b border-bd last:border-b-0">
                  <button
                    onClick={() => setOpenItem(isOpen ? undefined : it.id)}
                    aria-expanded={isOpen}
                    className="flex w-full items-start justify-between gap-3 py-3 text-left"
                  >
                    <span className="text-sm font-bold text-ink">{it.question}</span>
                    <span
                      className="shrink-0 text-lg text-teal transition-transform"
                      style={{ transform: isOpen ? 'rotate(45deg)' : 'none' }}
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </button>
                  {isOpen && (
                    <p className="pb-4 text-sm leading-relaxed text-soft">{it.answer}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
