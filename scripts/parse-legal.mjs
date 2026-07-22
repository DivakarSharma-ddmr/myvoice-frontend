// Four legal documents, four different shapes, one shared output type.
// See docs/superpowers/specs/2026-07-22-help-settings-community-design.md § 1.

import { parseTable, extractLinks, cleanText } from './lib/md.mjs';

function slug(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 50) || 'section';
}

function withUniqueIds(sections) {
  const seen = new Set();
  return sections.map((s) => {
    let id = slug(s.heading);
    let n = 2;
    while (seen.has(id)) id = `${slug(s.heading)}-${n++}`;
    seen.add(id);
    return { ...s, id };
  });
}

function para(raw) {
  const { text, links } = extractLinks(raw);
  return { type: 'p', text: cleanText(text), links };
}

function findDate(md, label) {
  const m = md.match(new RegExp(`\\*\\*${label}:?\\*\\*\\s*([^\\n*]+)`, 'i'));
  return m ? cleanText(m[1]) : undefined;
}

// Paragraphs beginning with an escaped dash are really list items.
function foldDashParagraphs(blocks) {
  const out = [];
  for (const b of blocks) {
    const isItem = b.type === 'p' && /^-\s*\S/.test(b.text);
    if (!isItem) {
      out.push(b);
      continue;
    }
    const item = b.text.replace(/^-\s*/, '');
    const last = out[out.length - 1];
    if (last && last.type === 'list') last.items.push(item);
    else out.push({ type: 'list', items: [item] });
  }
  return out;
}

function sectionsFromHeadings(md, headingRe) {
  const sections = [];
  let current = null;
  for (const rawLine of md.split(/\r?\n/)) {
    const line = rawLine.trim();
    const m = line.match(headingRe);
    if (m) {
      // A heading pattern may offer several alternatives; take whichever
      // capture group matched.
      const heading = cleanText(m.slice(1).find((g) => g !== undefined) ?? '');
      if (!heading) continue;
      current = { heading, blocks: [] };
      sections.push(current);
      continue;
    }
    if (!line || !current) continue;
    if (/^\*\*(Effective|Last Revised)/i.test(line)) continue;
    current.blocks.push(para(line));
  }
  return sections.map((s) => ({ ...s, blocks: foldDashParagraphs(s.blocks) }));
}

export function parseCookiePolicy(md) {
  return {
    slug: 'cookies',
    title: 'Cookie policy',
    effective: findDate(md, 'Effective Date'),
    revised: findDate(md, 'Last Revised'),
    sections: withUniqueIds(sectionsFromHeadings(md, /^#{3,4}\s+(.*)$/)),
  };
}

export function parsePrivacyPolicy(md) {
  const tables = parseTable(md);
  const sections = [];
  let current = null;
  for (const rawLine of md.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('|')) continue;
    if (/^\*\*(Effective|Last Revised)/i.test(line)) continue;
    const m = line.match(/^\*\*(\d+\\?\.\s+[A-Z][^*]*)\*\*\s*$/);
    if (m) {
      current = { heading: cleanText(m[1]), blocks: [] };
      sections.push(current);
      continue;
    }
    if (/^\*\*PRIVACY NOTICE\*\*/i.test(line)) continue;
    if (!current) continue;
    current.blocks.push(para(line));
  }
  const withTable = sections.map((s) => ({ ...s, blocks: foldDashParagraphs(s.blocks) }));
  const target = withTable.find((s) => /HOW WE USE YOUR PERSONAL DATA/i.test(s.heading));
  if (target && tables[0]) {
    target.blocks.push({
      type: 'table',
      head: tables[0].head.map(cleanText),
      rows: tables[0].rows.map((r) => r.map((c) => cleanText(extractLinks(c).text))),
    });
  }
  return {
    slug: 'privacy',
    title: 'Privacy notice',
    effective: findDate(md, 'Effective Date'),
    revised: findDate(md, 'Last Revised'),
    sections: withUniqueIds(withTable),
  };
}

// Most Terms sections are `### **N\. Heading**`, but the Google Docs export
// left section 14 as a plain bold paragraph. Accept both forms, or 14 gets
// swallowed into the body of 13.
const TERMS_HEADING = /^(?:###\s+(.*)|\*\*(\d+\\?\.\s+[A-Z][^*]*)\*\*)$/;

export function parseTerms(md) {
  const titleLines = [...md.matchAll(/^####\s+\*\*(.+?)\*\*\s*$/gm)].map((m) => cleanText(m[1]));
  return {
    slug: 'terms',
    title: titleLines.length
      ? titleLines.join(' ').replace(/,\s*$/, '')
      : 'Terms and conditions',
    effective: findDate(md, 'Effective Date'),
    revised: findDate(md, 'Last Revised'),
    sections: withUniqueIds(sectionsFromHeadings(md, TERMS_HEADING)),
  };
}

// The Click Draw regulation is a Google Docs export in which the whole
// document lives inside one table cell, with "Section N." markers inline
// instead of as headings. Each marker is followed by a short title phrase and
// then the body, run together with no punctuation between them. The title runs
// until the first capitalised word after the opening one, which is where the
// body's first sentence begins.
const HEADING_MAX_WORDS = 14;

function splitHeading(rest) {
  const words = [...rest.matchAll(/\S+/g)];
  for (let i = 1; i < words.length && i < HEADING_MAX_WORDS; i += 1) {
    const bare = words[i][0].replace(/^[^\p{L}\p{N}]+/u, '');
    if (bare && bare[0] === bare[0].toUpperCase() && bare[0] !== bare[0].toLowerCase()) {
      return words[i].index;
    }
  }
  const fallback = words[Math.min(words.length, 8)];
  return fallback ? fallback.index : rest.length;
}

export function parseClickDraw(md) {
  const noImages = md
    .split(/\r?\n/)
    .filter((l) => !/^\[image\d+\]:/.test(l.trim()))
    .join('\n')
    .replace(/!\[[^\]]*\]\[[^\]]*\]/g, '');

  const tables = parseTable(noImages);
  const title = tables[0] ? cleanText(tables[0].head[0]) : 'The Click Draw';

  // The first table's head is the document title. Every other cell — including
  // later tables' head rows, which are only "heads" because a blank line broke
  // the table — is body copy.
  const body = tables
    .flatMap((t, i) => (i === 0 ? t.rows.flat() : [...t.head, ...t.rows.flat()]))
    .map((c) => c.trim())
    .filter((c) => c && !/^-+$/.test(c))
    .join(' ');

  const parts = body.split(/\s*Section\s+(\d+)\\?\.\s*/);
  const sections = [];
  for (let i = 1; i < parts.length; i += 2) {
    const number = parts[i];
    const { text: linkless, links } = extractLinks(parts[i + 1] || '');
    const rest = cleanText(linkless);
    if (!rest) continue;
    const cut = splitHeading(rest);
    const heading = `Section ${number}. ${rest.slice(0, cut).trim()}`.replace(/\s+$/, '');
    const text = rest.slice(cut).trim();
    sections.push({
      heading: cleanText(heading),
      blocks: text ? [{ type: 'p', text, links }] : [],
    });
  }

  return { slug: 'click-draw', title, sections: withUniqueIds(sections) };
}
