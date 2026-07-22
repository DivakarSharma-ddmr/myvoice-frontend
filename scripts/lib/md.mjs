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
    // Google Docs escapes a wide set of punctuation, not just the obvious few.
    .replace(/\\([-.()[\]*_=+#!<>|~`{}])/g, '$1')
    // "…website:https://x" — a stripped markdown link left flush against the
    // colon that introduced it. Give the URL room to breathe.
    .replace(/([a-zA-Z]):(https?:\/\/)/g, '$1: $2')
    .replace(/\*\*/g, '')
    .replace(/(^|\s)\*(\S)/g, '$1$2')
    .replace(/(\S)\*(\s|$)/g, '$1$2')
    .replace(/\s+/g, ' ')
    .trim();
}

// Google Docs table cells flatten labelled sub-clauses ("Qualifying Surveys:",
// "No reclassification:", …) into one unbroken paragraph. This restores the
// structure the author wrote: it only REGROUPS text, never edits it, so the
// rendered words stay identical to the source. Returns null unless it finds at
// least `min` labels, so ordinary prose is left alone.
const LABEL = /(^|[.:]\s)([A-Z][A-Za-z&'’ ]{2,38}):\s/g;

export function splitLabelledClauses(text, min = 3) {
  const marks = [];
  for (const m of text.matchAll(LABEL)) {
    const label = m[2].trim();
    if (label.split(/\s+/).length > 5) continue;
    marks.push({ start: m.index + m[1].length, labelEnd: m.index + m[0].length, label });
  }
  if (marks.length < min) return null;

  const intro = text.slice(0, marks[0].start).trim();
  const items = marks.map((mk, i) => {
    const end = i + 1 < marks.length ? marks[i + 1].start : text.length;
    return `${mk.label}: ${text.slice(mk.labelEnd, end).trim()}`;
  });
  return { intro, items };
}
