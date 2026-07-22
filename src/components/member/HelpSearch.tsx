'use client';
import { useMemo, useState } from 'react';
import { faqItems } from '@/content/faq.generated';
import { searchFaq } from '@/lib/faqSearch';

export function HelpSearch({
  onOpenItem,
}: {
  onOpenItem: (id: string, category: string) => void;
}) {
  const [q, setQ] = useState('');
  const query = q.trim();
  const hits = useMemo(() => (query ? searchFaq(faqItems, query, 6) : []), [query]);

  return (
    <div className="mt-3">
      <label htmlFor="faq-search" className="sr-only">
        Search the FAQs
      </label>
      <input
        id="faq-search"
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search the FAQs — try “balance” or “password”"
        autoComplete="off"
        className="w-full rounded-[11px] border border-bd bg-white px-3.5 py-3 text-sm outline-none focus:border-teal"
      />

      {query && (
        <div
          role="status"
          aria-live="polite"
          className="mt-2 overflow-hidden rounded-[11px] border border-bd bg-white shadow-soft"
        >
          {hits.length === 0 ? (
            <p className="px-3.5 py-3 text-[13px] leading-snug text-soft">
              No answers matched “{query}”. Try a different word, or message us using the form
              below.
            </p>
          ) : (
            <ul>
              {hits.map((h) => (
                <li key={h.item.id}>
                  <button
                    onClick={() => {
                      onOpenItem(h.item.id, h.item.category);
                      setQ('');
                    }}
                    className="w-full border-t border-bd px-3.5 py-2.5 text-left first:border-t-0 hover:bg-cream"
                  >
                    <span className="block text-[13.5px] font-semibold text-ink">
                      {h.item.question}
                    </span>
                    <span className="mt-0.5 block text-[11px] font-bold text-teal">
                      {h.item.category}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
