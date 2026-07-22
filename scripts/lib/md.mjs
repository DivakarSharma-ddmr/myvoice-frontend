// Shared markdown primitives for the content build.
// The source documents are exported from Google Docs, so they are full of
// escape noise (\- \. \( ) and bold markers that must be stripped before the
// text reaches the UI.

const ALIGN_ROW = /^\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?$/;
const LINK = /\[([^\]]*)\]\(([^)]*)\)/g;
const EMAIL = /[\w.+-]+@[\w-]+\.[\w.-]+/g;

function splitRow(line) {
  let s = line.trim();
  if (s.startsWith('|')) s = s.slice(1);
  if (s.endsWith('|')) s = s.slice(0, -1);
  return s.split('|').map((c) => c.trim());
}

// Every pipe table in the input, in source order. A non-table line ends the
// current table, so two tables separated by prose come back separately.
export function parseTable(markdown) {
  const tables = [];
  let current = null;
  for (const line of markdown.split(/\r?\n/)) {
    if (!line.trim().startsWith('|')) {
      current = null;
      continue;
    }
    if (ALIGN_ROW.test(line.trim())) continue;
    const cells = splitRow(line);
    if (!current) {
      current = { head: cells, rows: [] };
      tables.push(current);
    } else {
      current.rows.push(cells);
    }
  }
  return tables;
}

// Replaces [label](href) with label, and reports every link found so the
// renderer can emit real anchors. Bare email addresses become mailto links.
export function extractLinks(text) {
  const links = [];
  const out = text.replace(LINK, (_m, label, href) => {
    const cleanHref = href.replace(/\\/g, '').trim();
    const cleanLabel = label.trim();
    if (cleanHref) links.push({ label: cleanLabel, href: cleanHref });
    return cleanLabel;
  });
  for (const email of out.match(EMAIL) || []) {
    if (!links.some((l) => l.href === `mailto:${email}`)) {
      links.push({ label: email, href: `mailto:${email}` });
    }
  }
  return { text: out, links };
}

export function cleanText(text) {
  return text
    .replace(/\\([-.()[\]*_])/g, '$1')
    .replace(/\*\*/g, '')
    .replace(/(^|\s)\*(\S)/g, '$1$2')
    .replace(/(\S)\*(\s|$)/g, '$1$2')
    .replace(/\s+/g, ' ')
    .trim();
}
