// Parses content/source/Member FAQs.md — a single three-column markdown table —
// into categories of FAQ items, preserving source order.

import { parseTable, extractLinks, cleanText } from './lib/md.mjs';

function slug(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
}

export function parseFaq(markdown) {
  const [table] = parseTable(markdown);
  if (!table) throw new Error('parse-faq: no table found in Member FAQs.md');

  const byCategory = new Map();
  const seen = new Set();

  for (const row of table.rows) {
    const [rawCategory, rawQuestion, rawAnswer] = row;
    if (!rawCategory || !rawQuestion) continue;

    const category = cleanText(rawCategory);
    const q = extractLinks(rawQuestion || '');
    const a = extractLinks(rawAnswer || '');
    const question = cleanText(q.text);
    const answer = cleanText(a.text);

    let id = `${slug(category)}--${slug(question)}`;
    let n = 2;
    while (seen.has(id)) id = `${slug(category)}--${slug(question)}-${n++}`;
    seen.add(id);

    const item = { id, category, question, answer, links: [...q.links, ...a.links] };
    if (!byCategory.has(category)) byCategory.set(category, []);
    byCategory.get(category).push(item);
  }

  return {
    categories: [...byCategory.entries()].map(([name, items]) => ({ name, items })),
  };
}
