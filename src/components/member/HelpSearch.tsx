'use client';
import { useMemo, useRef, useState } from 'react';
import { faqItems } from '@/content/faq.generated';
import { searchFaq } from '@/lib/faqSearch';
// Examples the member can actually press, rather than hint text telling them
// what they could have typed. Each one is asserted to return hits in
// tests/faqSearch.test.mjs, so a suggestion can never lead to an empty result.
import { FAQ_SUGGESTIONS } from '@/lib/faqSuggestions';

export function HelpSearch({
  onOpenItem,
}: {
  onOpenItem: (id: string, category: string) => void;
}) {
  const [q, setQ] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const query = q.trim();
  const hits = useMemo(() => (query ? searchFaq(faqItems, query, 6) : []), [query]);

  return (
    <div className="mt-3">
      <label htmlFor="faq-search" className="sr-only">
        Search the FAQs
      </label>
      <input
        ref={inputRef}
        id="faq-search"
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search the FAQs"
        autoComplete="off"
        className="w-full rounded-[11px] border border-bd bg-white px-3.5 py-3 text-sm outline-none focus:border-teal"
      />

      {/* The empty state does the teaching. Once there is a query these are
          replaced by results, so they cost no height while searching. */}
      {!query && (
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          <span className="text-[12px] font-semibold text-soft">Try</span>
          {FAQ_SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setQ(s);
                inputRef.current?.focus();
              }}
              className="rounded-full border border-bd bg-white px-3 py-1.5 text-[12px] font-bold text-teal transition hover:border-teal"
            >
              {s}
            </button>
          ))}
        </div>
      )}

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
