'use client';
import { useState } from 'react';
import type { Faq } from '@/lib/mockData';

export function Accordion({ items, defaultOpen = 0 }: { items: Faq[]; defaultOpen?: number }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="flex flex-col gap-2.5">
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className="overflow-hidden rounded-2xl border border-bd bg-white">
            <button
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left md:px-6 md:py-5"
            >
              <span className="text-[15px] font-bold text-ink md:text-base">{f.q}</span>
              <span
                className="shrink-0 text-xl text-teal transition-transform"
                style={{ transform: isOpen ? 'rotate(45deg)' : 'none' }}
              >
                +
              </span>
            </button>
            {isOpen && (
              <div className="px-5 pb-5 text-sm leading-relaxed text-mute md:px-6">{f.a}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
