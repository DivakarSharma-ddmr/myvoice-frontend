'use client';
import { faqCategories } from '@/content/faq.generated';

// Deliberately a compact launcher rather than a nested accordion: the longest
// category holds 12 questions and several answers run past 400 words, which a
// narrow inline accordion cannot carry without the card growing unusable.
export function FaqCard({ onOpenCategory }: { onOpenCategory: (name: string) => void }) {
  return (
    <div className="rounded-2xl2 border border-bd bg-white p-5">
      <h3 className="text-base font-extrabold">FAQs</h3>
      <ul className="mt-2">
        {faqCategories.map((c) => (
          <li key={c.name}>
            <button
              onClick={() => onOpenCategory(c.name)}
              className="flex w-full items-center justify-between gap-3 border-t border-bd py-2.5 text-left first:border-t-0 hover:text-teal"
            >
              <span className="text-[13.5px] font-semibold">{c.name}</span>
              <span className="shrink-0 text-xs font-bold text-soft">
                {c.items.length}
                <span className="sr-only"> questions</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
