# Help Center, Settings, Community + gamification rules — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the Help Center real searchable FAQ content, expand Settings with a full account form and links to four generated legal-document routes, rebuild the Community draw and winners surfaces, and encode the new gamification rules as a single typed module.

**Architecture:** Source markdown is vendored under `content/source/` and parsed by a dependency-free Node script into committed TypeScript modules under `src/content/`. Pure logic — markdown parsing, FAQ search scoring, level maths — lives in self-contained modules with no path-alias imports so Node's built-in test runner can import them directly. UI consumes the generated content through existing component patterns.

**Tech Stack:** Next.js 14 App Router (static export), TypeScript 5.5, Tailwind 3.4, Node 24 built-in test runner with native TypeScript type stripping. No new dependencies.

**Spec:** `docs/superpowers/specs/2026-07-22-help-settings-community-design.md`

## Global Constraints

- No new runtime or dev dependencies. Everything ships with Node 24, Next 14, React 18, Tailwind 3.4.
- Static export. No server components fetching at request time, no route handlers, no `dynamic = 'force-dynamic'`. Every dynamic route needs `generateStaticParams`.
- Design system is binding: read `DESIGN.md`. Signal Yellow `#FFCC33` on at most 10% of a screen, CTA and reward only. Shadows tinted `rgba(31,79,79,…)`, never gray or black. Never nest a card inside a card — group with hairline dividers or tint surfaces. No tiny tracked uppercase eyebrows. Body text on cream, sand or tinted surfaces uses Soft Teal `#52706E`, never Mute `#667085`.
- WCAG 2.2 AA. Interactive things are `<button>` or `<a>`, never a `div` with `cursor-pointer`. Status is never conveyed by color alone.
- Copy rule: plain language for a global, mixed-literacy, ESL, mobile-heavy audience. No hype, no dollar-sign baiting.
- Business-critical invented values are marked with a `PLACEHOLDER` comment naming what real data is needed.
- Click Draw entry rule, verbatim from the signed regulation: one entry for every survey that ends in **Screenout**, **Quota Full** or **Survey Closed**. Completions do not earn entries. Redemptions do not earn entries. Quests do not earn entries.
- Click Draw prizes, verbatim: 11 prizes monthly — 1 × €50 and 10 × €10, total €150. Never "€250 prize pool".
- Member-facing copy must not promise level-perk draw entries until the user confirms it. See spec section 6.
- The winners page is member-only. Never link it from, or render it on, any `(site)` route.
- Existing paths must keep working: `/member/help`, `/member/settings`, `/member/community`.

---

### Task 1: Test harness and markdown helper library

The parsers all need the same primitives: read a GitHub-flavoured markdown table, pull inline links out of a text run, and clean up the escape noise (`\-`, `\.`, `**`) that the source documents are full of. Build and test those first.

**Files:**
- Create: `scripts/lib/md.mjs`
- Create: `tests/md.test.mjs`
- Modify: `package.json` (add `test` and `content` scripts)

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `parseTable(markdown: string): { head: string[], rows: string[][] }[]` — every pipe table in the input, in source order. Alignment rows (`| :--- |`) are dropped.
  - `extractLinks(text: string): { text: string, links: { label: string, href: string }[] }` — strips `[label](href)` to plain `label`, and bare emails to their label, returning what was found.
  - `cleanText(text: string): string` — unescapes `\-`, `\.`, `\(`, `\)`, strips `**` and `*`, collapses runs of whitespace, trims.

- [ ] **Step 1: Add the scripts to `package.json`**

In the `"scripts"` block, after `"lint"`, add:

```json
    "test": "node --test tests/*.test.mjs",
    "content": "node scripts/build-content.mjs"
```

Note the test glob is `tests/*.test.mjs`, not `tests/`. Passing a bare directory makes Node try to `require` it as a module and fail with `MODULE_NOT_FOUND`.

- [ ] **Step 2: Write the failing test**

Create `tests/md.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseTable, extractLinks, cleanText } from '../scripts/lib/md.mjs';

test('parseTable reads a table and drops the alignment row', () => {
  const md = [
    '| Category | Question |',
    '| :---: | :---- |',
    '| Rewards | Where can I see my balance? |',
    '| Rewards | How much can I make? |',
  ].join('\n');
  const [t] = parseTable(md);
  assert.deepEqual(t.head, ['Category', 'Question']);
  assert.equal(t.rows.length, 2);
  assert.deepEqual(t.rows[0], ['Rewards', 'Where can I see my balance?']);
});

test('parseTable returns each table separately', () => {
  const md = '| A |\n| :-- |\n| 1 |\n\ntext\n\n| B |\n| :-- |\n| 2 |';
  assert.equal(parseTable(md).length, 2);
});

test('extractLinks strips markdown links and keeps the label', () => {
  const r = extractLinks('Very simple: [click here](http://x.com/register), fill it in.');
  assert.equal(r.text, 'Very simple: click here, fill it in.');
  assert.deepEqual(r.links, [{ label: 'click here', href: 'http://x.com/register' }]);
});

test('extractLinks finds bare email addresses', () => {
  const r = extractLinks('Contact us at membersupport@myvoice-surveys.com today.');
  assert.equal(r.text, 'Contact us at membersupport@myvoice-surveys.com today.');
  assert.deepEqual(r.links, [{
    label: 'membersupport@myvoice-surveys.com',
    href: 'mailto:membersupport@myvoice-surveys.com',
  }]);
});

test('cleanText removes escape noise and bold markers', () => {
  assert.equal(cleanText('**Section 3\\.** Terms  and\\- conditions'), 'Section 3. Terms and- conditions');
});

test('cleanText collapses whitespace and trims', () => {
  assert.equal(cleanText('  a   b \n c  '), 'a b c');
});
```

- [ ] **Step 3: Run the test to verify it fails**

```bash
npm test
```

Expected: FAIL — `Cannot find module '../scripts/lib/md.mjs'`.

- [ ] **Step 4: Write the implementation**

Create `scripts/lib/md.mjs`:

```js
const ALIGN_ROW = /^\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?$/;
const LINK = /\[([^\]]*)\]\(([^)]*)\)/g;
const EMAIL = /[\w.+-]+@[\w-]+\.[\w.-]+/g;

function splitRow(line) {
  let s = line.trim();
  if (s.startsWith('|')) s = s.slice(1);
  if (s.endsWith('|')) s = s.slice(0, -1);
  return s.split('|').map((c) => c.trim());
}

export function parseTable(markdown) {
  const tables = [];
  let current = null;
  for (const line of markdown.split(/\r?\n/)) {
    const isRow = line.trim().startsWith('|');
    if (!isRow) {
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

export function extractLinks(text) {
  const links = [];
  let out = text.replace(LINK, (_m, label, href) => {
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
```

- [ ] **Step 5: Run the test to verify it passes**

```bash
npm test
```

Expected: PASS, 6 tests.

- [ ] **Step 6: Commit**

```bash
git add package.json scripts/lib/md.mjs tests/md.test.mjs
git commit -m "Add markdown helper library and Node test harness"
```

---

### Task 2: FAQ parser

**Files:**
- Create: `src/content/types.ts`
- Create: `scripts/parse-faq.mjs`
- Create: `scripts/build-content.mjs`
- Create: `tests/parse-faq.test.mjs`
- Generated: `src/content/faq.generated.ts`

**Interfaces:**
- Consumes: `parseTable`, `extractLinks`, `cleanText` from `scripts/lib/md.mjs`.
- Produces:
  - `src/content/types.ts` exporting `Link`, `Block`, `LegalDoc`, `FaqItem`, `FaqCategory`.
  - `parseFaq(markdown: string): { categories: FaqCategory[] }` from `scripts/parse-faq.mjs`.
  - `src/content/faq.generated.ts` exporting `faqCategories: FaqCategory[]` and `faqItems: FaqItem[]` (flat, source order).

- [ ] **Step 1: Write the shared content types**

Create `src/content/types.ts`. Hand-written, not generated:

```ts
export type Link = { label: string; href: string };

export type Block =
  | { type: 'p'; text: string; links: Link[] }
  | { type: 'list'; items: string[] }
  | { type: 'table'; head: string[]; rows: string[][] };

export type LegalDoc = {
  slug: string;
  title: string;
  effective?: string;
  revised?: string;
  sections: { id: string; heading: string; blocks: Block[] }[];
};

export type FaqItem = {
  id: string;
  category: string;
  question: string;
  answer: string;
  links: Link[];
};

export type FaqCategory = { name: string; items: FaqItem[] };
```

- [ ] **Step 2: Write the failing test**

Create `tests/parse-faq.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseFaq } from '../scripts/parse-faq.mjs';

const SAMPLE = [
  '| Category | Question | Actions |',
  '| :---: | :---- | :---- |',
  '| Panel registration | Who can join the panel? | Anyone at least 14 years old. |',
  '| Panel registration | How do I join? | Very simple: [click here](http://x.com/register). |',
  '| Rewards | Where can I see my balance? | Log in and check the dashboard. |',
].join('\n');

test('groups items by category in source order', () => {
  const { categories } = parseFaq(SAMPLE);
  assert.deepEqual(categories.map((c) => c.name), ['Panel registration', 'Rewards']);
  assert.equal(categories[0].items.length, 2);
  assert.equal(categories[1].items.length, 1);
});

test('gives every item a stable unique id', () => {
  const { categories } = parseFaq(SAMPLE);
  const ids = categories.flatMap((c) => c.items.map((i) => i.id));
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(parseFaq(SAMPLE).categories[0].items[0].id, ids[0]);
});

test('strips markdown links from the answer but records them', () => {
  const { categories } = parseFaq(SAMPLE);
  const item = categories[0].items[1];
  assert.equal(item.answer, 'Very simple: click here.');
  assert.deepEqual(item.links, [{ label: 'click here', href: 'http://x.com/register' }]);
});

test('question text is cleaned of markdown', () => {
  const md = '| C | Q |\n| :-- | :-- |\n| Rewards | [Why no money](http://x.com/faq)? | Reasons vary. |';
  const { categories } = parseFaq(md);
  assert.equal(categories[0].items[0].question, 'Why no money?');
});
```

- [ ] **Step 3: Run the test to verify it fails**

```bash
npm test
```

Expected: FAIL — `Cannot find module '../scripts/parse-faq.mjs'`.

- [ ] **Step 4: Write the parser**

Create `scripts/parse-faq.mjs`:

```js
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
```

- [ ] **Step 5: Run the test to verify it passes**

```bash
npm test
```

Expected: PASS, 10 tests total.

- [ ] **Step 6: Write the build orchestrator**

Create `scripts/build-content.mjs`. It handles FAQ now; Task 3 adds legal:

```js
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseFaq } from './parse-faq.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = (name) => readFileSync(join(root, 'content', 'source', name), 'utf8');
const out = (rel, body) => {
  const path = join(root, 'src', 'content', rel);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, body, 'utf8');
  console.log(`wrote src/content/${rel}`);
};

const BANNER = `// Generated by scripts/build-content.mjs from content/source/.
// Do not edit by hand. Edit the markdown and run: npm run content
`;

const { categories } = parseFaq(src('Member FAQs.md'));
out(
  'faq.generated.ts',
  `${BANNER}import type { FaqCategory, FaqItem } from './types';

export const faqCategories: FaqCategory[] = ${JSON.stringify(categories, null, 2)};

export const faqItems: FaqItem[] = faqCategories.flatMap((c) => c.items);
`
);
```

- [ ] **Step 7: Generate and verify the output**

```bash
npm run content
```

Expected: `wrote src/content/faq.generated.ts`. Then confirm the shape:

```bash
node -e "const s=require('fs').readFileSync('src/content/faq.generated.ts','utf8');console.log('categories:',(s.match(/\"name\":/g)||[]).length,'items:',(s.match(/\"question\":/g)||[]).length)"
```

Expected: `categories: 6 items: 32`. If either number differs, the source table changed — reconcile before continuing.

- [ ] **Step 8: Typecheck and commit**

```bash
npx tsc --noEmit
git add src/content scripts/parse-faq.mjs scripts/build-content.mjs tests/parse-faq.test.mjs
git commit -m "Generate FAQ content from source markdown"
```

---

### Task 3: Legal document parsers

Four documents with four different shapes. One parser per shape, one shared output type.

**Files:**
- Create: `scripts/parse-legal.mjs`
- Create: `tests/parse-legal.test.mjs`
- Modify: `scripts/build-content.mjs`
- Generated: `src/content/legal.generated.ts`

**Interfaces:**
- Consumes: `parseTable`, `extractLinks`, `cleanText` from `scripts/lib/md.mjs`.
- Produces from `scripts/parse-legal.mjs`:
  - `parseCookiePolicy(md: string): LegalDoc`
  - `parsePrivacyPolicy(md: string): LegalDoc`
  - `parseTerms(md: string): LegalDoc`
  - `parseClickDraw(md: string): LegalDoc`
- Produces `src/content/legal.generated.ts` exporting `legalDocs: Record<string, LegalDoc>` and `legalSlugs: string[]`, with slugs `privacy`, `cookies`, `terms`, `click-draw`.

- [ ] **Step 1: Write the failing test**

Create `tests/parse-legal.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseCookiePolicy, parseClickDraw, parseTerms } from '../scripts/parse-legal.mjs';

const COOKIE = [
  '**COOKIE POLICY**',
  '',
  '**Effective Date:** April 19th, 2019',
  '',
  '**Last Revised:** August 9th, 2022',
  '',
  "### **What's a \"cookie\"?**",
  '',
  'A cookie is a piece of information stored on your device.',
  '',
  'Cookies are used by nearly all websites.',
  '',
  '### **How do we use cookies?**',
  '',
  '**\\- Session cookies:** deleted when you close your browser; or',
  '',
  '**\\- Persistent cookies:** stored as a file on your computer.',
].join('\n');

test('cookie policy captures title and dates', () => {
  const doc = parseCookiePolicy(COOKIE);
  assert.equal(doc.slug, 'cookies');
  assert.equal(doc.title, 'Cookie policy');
  assert.equal(doc.effective, 'April 19th, 2019');
  assert.equal(doc.revised, 'August 9th, 2022');
});

test('cookie policy splits sections on ### headings', () => {
  const doc = parseCookiePolicy(COOKIE);
  assert.equal(doc.sections.length, 2);
  assert.equal(doc.sections[0].heading, 'What\'s a "cookie"?');
  assert.equal(doc.sections[0].blocks.length, 2);
});

test('cookie policy turns dash-prefixed paragraphs into a list', () => {
  const doc = parseCookiePolicy(COOKIE);
  const list = doc.sections[1].blocks.find((b) => b.type === 'list');
  assert.ok(list, 'expected a list block');
  assert.equal(list.items.length, 2);
  assert.match(list.items[0], /^Session cookies:/);
});

test('every section gets a unique slug id', () => {
  const doc = parseCookiePolicy(COOKIE);
  const ids = doc.sections.map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(ids.every((id) => /^[a-z0-9-]+$/.test(id)));
});

test('click draw splits the single cell on Section markers', () => {
  const md = [
    '| Terms and Conditions Raffle "The Click Draw" |',
    '| :---: |',
    '| Section 1\\. The raffle organizer The organizer is DataDiggers. Section 2\\. Place and duration Held online monthly. |',
    '',
    '[image1]: <data:image/png;base64,AAAA>',
  ].join('\n');
  const doc = parseClickDraw(md);
  assert.equal(doc.slug, 'click-draw');
  assert.equal(doc.sections.length, 2);
  assert.equal(doc.sections[0].heading, 'Section 1. The raffle organizer');
  assert.match(doc.sections[1].blocks[0].text, /Held online monthly/);
});

test('click draw discards the base64 signature image', () => {
  const md = [
    '| T |',
    '| :---: |',
    '| Section 1\\. Organizer DataDiggers ![Sig][image1] |',
    '',
    '[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUg>',
  ].join('\n');
  const doc = parseClickDraw(md);
  const all = JSON.stringify(doc);
  assert.ok(!all.includes('base64'), 'base64 image leaked into output');
  assert.ok(!all.includes('image1'), 'image reference leaked into output');
});

test('terms splits on numbered section headings', () => {
  const md = [
    '#### **TERMS AND CONDITIONS FOR PANEL MEMBERSHIP,**',
    '',
    '### **Definitions**',
    '',
    'Words have meanings.',
    '',
    '### ',
    '',
    '### **1\\. Applicability; Agreement**',
    '',
    'These terms apply to you.',
  ].join('\n');
  const doc = parseTerms(md);
  assert.equal(doc.slug, 'terms');
  assert.equal(doc.sections.length, 2);
  assert.equal(doc.sections[1].heading, '1. Applicability; Agreement');
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npm test
```

Expected: FAIL — `Cannot find module '../scripts/parse-legal.mjs'`.

- [ ] **Step 3: Write the parsers**

Create `scripts/parse-legal.mjs`:

```js
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
      const heading = cleanText(m[1]);
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

export function parseTerms(md) {
  const titleLines = [...md.matchAll(/^####\s+\*\*(.+?)\*\*\s*$/gm)].map((m) => cleanText(m[1]));
  return {
    slug: 'terms',
    title: titleLines.length
      ? titleLines.join(' ').replace(/,\s*$/, '')
      : 'Terms and conditions',
    sections: withUniqueIds(sectionsFromHeadings(md, /^###\s+(.*)$/)),
  };
}

export function parseClickDraw(md) {
  const noImages = md
    .split(/\r?\n/)
    .filter((l) => !/^\[image\d+\]:/.test(l.trim()))
    .join('\n')
    .replace(/!\[[^\]]*\]\[[^\]]*\]/g, '');

  const tables = parseTable(noImages);
  const title = tables[0] ? cleanText(tables[0].head[0]) : 'The Click Draw';
  const body = tables
    .flatMap((t) => t.rows.flat())
    .map((c) => c.trim())
    .filter((c) => c && c !== '-----')
    .join(' ');

  const parts = body.split(/\s*Section\s+(\d+)\\?\.\s*/);
  const sections = [];
  for (let i = 1; i < parts.length; i += 2) {
    const number = parts[i];
    const rest = cleanText(extractLinks(parts[i + 1] || '').text);
    const stop = rest.search(/\.\s|$/);
    const heading = `Section ${number}. ${rest.slice(0, stop === -1 ? 60 : stop)}`.trim();
    const text = rest.slice(stop === -1 ? 0 : stop + 1).trim();
    const { text: clean, links } = extractLinks(parts[i + 1] || '');
    sections.push({
      heading: cleanText(heading),
      blocks: [{ type: 'p', text: text || cleanText(clean), links }],
    });
  }

  return { slug: 'click-draw', title, sections: withUniqueIds(sections) };
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npm test
```

Expected: PASS, 17 tests total. If the Click Draw heading assertions fail, the heading is being cut at the wrong sentence boundary — adjust the `stop` search, not the test.

- [ ] **Step 5: Wire the legal docs into the build orchestrator**

Append to `scripts/build-content.mjs`:

```js
import {
  parseCookiePolicy,
  parsePrivacyPolicy,
  parseTerms,
  parseClickDraw,
} from './parse-legal.mjs';

const docs = [
  parsePrivacyPolicy(src('Privacy Policy.md')),
  parseCookiePolicy(src('Cookie Policy.md')),
  parseTerms(src('Terms and Conditions.md')),
  parseClickDraw(src('Click Draw T&C.md')),
];

for (const d of docs) {
  if (!d.sections.length) throw new Error(`build-content: ${d.slug} produced no sections`);
}

out(
  'legal.generated.ts',
  `${BANNER}import type { LegalDoc } from './types';

export const legalDocs: Record<string, LegalDoc> = ${JSON.stringify(
    Object.fromEntries(docs.map((d) => [d.slug, d])),
    null,
    2
  )};

export const legalSlugs = ${JSON.stringify(docs.map((d) => d.slug))};
`
);
```

Move the two `import` statements to the top of the file with the others — ES module imports are hoisted, but keeping them together is the codebase convention.

- [ ] **Step 6: Generate and sanity-check the output**

```bash
npm run content
```

Expected: `wrote src/content/faq.generated.ts` then `wrote src/content/legal.generated.ts`.

```bash
node -e "
const s = require('fs').readFileSync('src/content/legal.generated.ts','utf8');
if (s.includes('base64')) throw new Error('base64 leaked');
console.log('size KB:', Math.round(s.length/1024));
for (const slug of ['privacy','cookies','terms','click-draw']) {
  if (!s.includes('\"'+slug+'\"')) throw new Error('missing '+slug);
}
console.log('all four documents present, no base64');
"
```

Expected: no base64, all four present, size well under 100 KB. If size exceeds 200 KB the image filter failed.

- [ ] **Step 7: Typecheck and commit**

```bash
npx tsc --noEmit
git add src/content scripts/parse-legal.mjs scripts/build-content.mjs tests/parse-legal.test.mjs
git commit -m "Generate legal documents from source markdown"
```

---

### Task 4: FAQ keyword search

Pure and self-contained so the test can import it directly. It takes items as an argument rather than importing generated content — that is what makes it testable and reusable.

**Files:**
- Create: `src/lib/faqSearch.ts`
- Create: `tests/faqSearch.test.mjs`

**Interfaces:**
- Consumes: nothing. Deliberately no imports, including no `@/` aliases, so `node --test` can load it.
- Produces:
  - `normalize(text: string): string`
  - `tokenize(text: string): string[]`
  - `type SearchableItem = { id: string; category: string; question: string; answer: string }`
  - `type SearchHit<T> = { item: T; score: number; terms: string[] }`
  - `searchFaq<T extends SearchableItem>(items: T[], query: string, limit?: number): SearchHit<T>[]`

- [ ] **Step 1: Write the failing test**

Create `tests/faqSearch.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalize, tokenize, searchFaq } from '../src/lib/faqSearch.ts';

const ITEMS = [
  { id: 'a', category: 'Rewards', question: 'Where can I see my balance?', answer: 'Log in and the dashboard shows your current balance.' },
  { id: 'b', category: 'Rewards', question: 'How can I claim the money I earned?', answer: 'There are different methods to claim your money.' },
  { id: 'c', category: 'Password recovery', question: 'I have lost my password. How do I get it back?', answer: 'Use the password reset page to recover it.' },
  { id: 'd', category: 'Completing surveys', question: 'How much time does it take to fill in a survey?', answer: 'Most studies average 10-15 minutes.' },
];

test('normalize folds case, diacritics and punctuation', () => {
  assert.equal(normalize('Parolă, PIERDUTĂ!'), 'parola pierduta');
});

test('tokenize drops stopwords and single characters', () => {
  assert.deepEqual(tokenize('how do I get it back'), ['back']);
});

test('finds an item by a word in its question', () => {
  const hits = searchFaq(ITEMS, 'balance');
  assert.equal(hits[0].item.id, 'a');
});

test('question matches outrank answer-only matches', () => {
  const hits = searchFaq(ITEMS, 'password');
  assert.equal(hits[0].item.id, 'c');
});

test('an exact question phrase wins outright', () => {
  const hits = searchFaq(ITEMS, 'claim the money');
  assert.equal(hits[0].item.id, 'b');
});

test('matches ignore diacritics in the query', () => {
  const hits = searchFaq(ITEMS, 'bálance');
  assert.equal(hits[0].item.id, 'a');
});

test('prefix matching finds partial words', () => {
  const hits = searchFaq(ITEMS, 'surv');
  assert.ok(hits.some((h) => h.item.id === 'd'));
});

test('returns nothing for a query with no match', () => {
  assert.deepEqual(searchFaq(ITEMS, 'helicopter'), []);
});

test('returns nothing for an empty or stopword-only query', () => {
  assert.deepEqual(searchFaq(ITEMS, '   '), []);
  assert.deepEqual(searchFaq(ITEMS, 'the and it'), []);
});

test('respects the result limit', () => {
  assert.ok(searchFaq(ITEMS, 'money balance survey password', 2).length <= 2);
});

test('reports which terms matched so the UI can highlight them', () => {
  const [hit] = searchFaq(ITEMS, 'balance dashboard');
  assert.deepEqual([...hit.terms].sort(), ['balance', 'dashboard']);
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npm test
```

Expected: FAIL — cannot find `../src/lib/faqSearch.ts`.

- [ ] **Step 3: Write the implementation**

Create `src/lib/faqSearch.ts`:

```ts
export type SearchableItem = { id: string; category: string; question: string; answer: string };
export type SearchHit<T> = { item: T; score: number; terms: string[] };

const STOPWORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'but', 'by', 'can', 'do', 'does', 'for', 'from',
  'get', 'has', 'have', 'how', 'i', 'if', 'in', 'is', 'it', 'me', 'my', 'not', 'of', 'on', 'or',
  'so', 'that', 'the', 'their', 'them', 'there', 'they', 'this', 'to', 'up', 'was', 'we', 'what',
  'when', 'where', 'which', 'who', 'why', 'will', 'with', 'you', 'your',
]);

export function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function tokenize(text: string): string[] {
  return normalize(text)
    .split(' ')
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

const SCORE = {
  phrase: 100,
  allTerms: 25,
  questionWord: 10,
  questionPrefix: 6,
  categoryWord: 4,
  answerWord: 3,
  answerPrefix: 2,
};

function scoreOne(words: string[], term: string, exact: number, prefix: number) {
  if (words.includes(term)) return exact;
  if (words.some((w) => w.startsWith(term))) return prefix;
  return 0;
}

export function searchFaq<T extends SearchableItem>(
  items: T[],
  query: string,
  limit = 8
): SearchHit<T>[] {
  const terms = tokenize(query);
  if (!terms.length) return [];
  const phrase = normalize(query);

  const hits: SearchHit<T>[] = [];

  for (const item of items) {
    const nq = normalize(item.question);
    const qWords = nq.split(' ');
    const aWords = normalize(item.answer).split(' ');
    const cWords = normalize(item.category).split(' ');

    let score = 0;
    const matched: string[] = [];

    for (const term of terms) {
      let termScore = scoreOne(qWords, term, SCORE.questionWord, SCORE.questionPrefix);
      if (!termScore) termScore = scoreOne(cWords, term, SCORE.categoryWord, 0);
      if (!termScore) termScore = scoreOne(aWords, term, SCORE.answerWord, SCORE.answerPrefix);
      if (termScore) {
        score += termScore;
        matched.push(term);
      }
    }

    if (!matched.length) continue;
    if (matched.length === terms.length) score += SCORE.allTerms;
    if (phrase.length > 2 && nq.includes(phrase)) score += SCORE.phrase;

    hits.push({ item, score, terms: matched });
  }

  return hits.sort((a, b) => b.score - a.score || a.item.id.localeCompare(b.item.id)).slice(0, limit);
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npm test
```

Expected: PASS, 28 tests total.

- [ ] **Step 5: Spot-check against the real content**

```bash
node -e "
import('./src/lib/faqSearch.ts').then(async (m) => {
  const { faqItems } = await import('./src/content/faq.generated.ts');
  for (const q of ['balance', 'password', 'how much money', 'delete account', 'screenout']) {
    const hits = m.searchFaq(faqItems, q, 3);
    console.log(q.padEnd(18), '->', hits.map((h) => h.item.question.slice(0, 46)).join(' | ') || 'NO RESULTS');
  }
});
"
```

Expected: every query returns something sensible. `balance` should surface "Where can I see my balance?" first. If any common query returns nothing, adjust the stopword list rather than the scoring.

- [ ] **Step 6: Commit**

```bash
git add src/lib/faqSearch.ts tests/faqSearch.test.mjs
git commit -m "Add dependency-free keyword search over the FAQ"
```

---

### Task 5: Gamification rules module

Transcribed by hand from `content/source/Level, XP, Badges, Quests rules.md`. Self-contained, no imports, so the test can load it directly.

**Files:**
- Create: `src/lib/gamification.ts`
- Create: `tests/gamification.test.mjs`

**Interfaces:**
- Consumes: nothing.
- Produces: `LEVELS`, `LEVEL_PERKS`, `BADGES`, `DAILY_QUESTS`, `WEEKLY_QUESTS`, `MONTHLY_QUESTS`, `XP_SOURCES`, `DRAW`, and functions `levelFromXp(xp)`, `levelProgress(xp)`, `surveyCompletionXp(minutes)`, `streakGraceDays(level)`, `drawEntriesFromLevel(level)`.
- `levelProgress` returns `{ level: number; label: string; into: number; span: number; pct: number; nextAt: number | null; nextLabel: string | null }`.

- [ ] **Step 1: Write the failing test**

Create `tests/gamification.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  LEVELS, BADGES, DAILY_QUESTS, WEEKLY_QUESTS, MONTHLY_QUESTS, DRAW,
  levelFromXp, levelProgress, surveyCompletionXp, streakGraceDays, drawEntriesFromLevel,
} from '../src/lib/gamification.ts';

test('the level table matches the rules document', () => {
  assert.equal(LEVELS.length, 13);
  assert.equal(LEVELS[0].label, 'Getting Started');
  assert.equal(LEVELS[12].label, 'MyVoice Champion');
  assert.deepEqual(
    LEVELS.map((l) => l.cumulativeXp),
    [0, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000, 200000, 500000, 1000000]
  );
});

test('levelFromXp picks the highest threshold reached', () => {
  assert.equal(levelFromXp(0), 0);
  assert.equal(levelFromXp(199), 0);
  assert.equal(levelFromXp(200), 1);
  assert.equal(levelFromXp(2340), 4);
  assert.equal(levelFromXp(4999), 4);
  assert.equal(levelFromXp(5000), 5);
  assert.equal(levelFromXp(9999999), 12);
});

test('levelProgress reports position within the band', () => {
  const p = levelProgress(2340);
  assert.equal(p.level, 4);
  assert.equal(p.label, 'Trusted Voice');
  assert.equal(p.into, 340);
  assert.equal(p.span, 3000);
  assert.equal(p.nextAt, 5000);
  assert.equal(p.nextLabel, 'Insightful Voice');
  assert.equal(p.pct, Math.round((340 / 3000) * 100));
});

test('levelProgress caps cleanly at the maximum level', () => {
  const p = levelProgress(2000000);
  assert.equal(p.level, 12);
  assert.equal(p.nextAt, null);
  assert.equal(p.nextLabel, null);
  assert.equal(p.pct, 100);
});

test('survey completion XP is effort-based, not payout-based', () => {
  assert.equal(surveyCompletionXp(5), 50);
  assert.equal(surveyCompletionXp(10), 75);
  assert.equal(surveyCompletionXp(15), 100);
  assert.equal(surveyCompletionXp(20), 125);
  assert.equal(surveyCompletionXp(30), 175);
});

test('streak grace days step up at levels 3, 6, 9 and 12', () => {
  assert.equal(streakGraceDays(0), 1);
  assert.equal(streakGraceDays(2), 1);
  assert.equal(streakGraceDays(3), 2);
  assert.equal(streakGraceDays(5), 2);
  assert.equal(streakGraceDays(6), 3);
  assert.equal(streakGraceDays(9), 5);
  assert.equal(streakGraceDays(12), 7);
});

test('level draw-entry bonuses step up at levels 2, 5, 8, 11 and 12', () => {
  assert.equal(drawEntriesFromLevel(1), 0);
  assert.equal(drawEntriesFromLevel(2), 1);
  assert.equal(drawEntriesFromLevel(4), 1);
  assert.equal(drawEntriesFromLevel(5), 2);
  assert.equal(drawEntriesFromLevel(8), 3);
  assert.equal(drawEntriesFromLevel(11), 5);
  assert.equal(drawEntriesFromLevel(12), 7);
});

test('the badge set is complete and uniquely keyed', () => {
  assert.equal(BADGES.length, 27);
  const ids = BADGES.map((b) => b.id);
  assert.equal(new Set(ids).size, 27);
  assert.ok(BADGES.every((b) => b.label && b.trigger && b.art));
});

test('quest pools match the rules document', () => {
  assert.equal(DAILY_QUESTS.length, 17);
  assert.equal(WEEKLY_QUESTS.length, 12);
  assert.equal(MONTHLY_QUESTS.length, 6);
  assert.ok([...DAILY_QUESTS, ...WEEKLY_QUESTS, ...MONTHLY_QUESTS].every((q) => q.xp > 0));
});

test('the draw prize structure matches the signed regulation', () => {
  assert.equal(DRAW.totalValue, 150);
  assert.equal(DRAW.prizes.reduce((n, p) => n + p.count, 0), 11);
  assert.deepEqual(DRAW.entrySources, ['screenout', 'quota-full', 'survey-closed']);
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npm test
```

Expected: FAIL — cannot find `../src/lib/gamification.ts`.

- [ ] **Step 3: Write the module**

Create `src/lib/gamification.ts`. Transcribe every table from
`content/source/Level, XP, Badges, Quests rules.md`. The skeleton below shows
the exact shapes and the values the tests assert; fill the remaining rows from
the document without paraphrasing the completion rules — they are operational
specifications the dev team will implement against.

```ts
export type Level = { level: number; cumulativeXp: number; label: string };
export type LevelPerk = {
  level: number;
  perk: string;
  rule: string;
  drawEntriesPerActiveMonth?: number;
  streakGraceDays?: number;
};
export type Badge = { id: string; label: string; trigger: string; art: string };
export type QuestDef = { id: string; title: string; objective: string; rule: string; xp: number };

export const LEVELS: Level[] = [
  { level: 0, cumulativeXp: 0, label: 'Getting Started' },
  { level: 1, cumulativeXp: 200, label: 'New Voice' },
  { level: 2, cumulativeXp: 500, label: 'Active Voice' },
  { level: 3, cumulativeXp: 1000, label: 'Consistent Voice' },
  { level: 4, cumulativeXp: 2000, label: 'Trusted Voice' },
  { level: 5, cumulativeXp: 5000, label: 'Insightful Voice' },
  { level: 6, cumulativeXp: 10000, label: 'Top Voice' },
  { level: 7, cumulativeXp: 20000, label: 'Community Ally' },
  { level: 8, cumulativeXp: 50000, label: 'Community Pillar' },
  { level: 9, cumulativeXp: 100000, label: 'Research Ally' },
  { level: 10, cumulativeXp: 200000, label: 'Research Pillar' },
  { level: 11, cumulativeXp: 500000, label: 'Panel Pro' },
  { level: 12, cumulativeXp: 1000000, label: 'MyVoice Champion' },
];

// An "active month" requires at least one confirmed survey start.
export const LEVEL_PERKS: LevelPerk[] = [
  { level: 0, perk: 'Captain MyVoice Welcome Badge', rule: 'Displayed automatically during onboarding.' },
  { level: 1, perk: 'New Voice Profile Pack', rule: 'First permanent Captain MyVoice badge and bronze profile frame.' },
  { level: 2, perk: 'First Level-Up Draw Entry', rule: 'Grants +1 Click Draw entry per active month.', drawEntriesPerActiveMonth: 1 },
  { level: 3, perk: 'Streak Shield', rule: 'The streak resets only after two consecutive missed days.', streakGraceDays: 2 },
  { level: 4, perk: 'Trusted Voice Profile Pack', rule: 'More prominent badge and silver profile frame.' },
  { level: 5, perk: 'Second Level-Up Draw Entry', rule: 'Grants +2 Click Draw entries per active month.', drawEntriesPerActiveMonth: 2 },
  { level: 6, perk: 'Streak Shield Level Two', rule: 'The streak resets only after three consecutive missed days.', streakGraceDays: 3 },
  { level: 7, perk: 'Community Ally Profile Pack', rule: 'More prominent badge and gold profile frame.' },
  { level: 8, perk: 'Third Level-Up Draw Entry', rule: 'Grants +3 Click Draw entries per active month.', drawEntriesPerActiveMonth: 3 },
  { level: 9, perk: 'Streak Shield Level Three', rule: 'The streak resets only after five consecutive missed days.', streakGraceDays: 5 },
  { level: 10, perk: 'Research Pillar Profile Pack', rule: 'More prominent badge and diamond profile frame.' },
  { level: 11, perk: 'Final Level-Up Draw Entry', rule: 'Grants +5 Click Draw entries per active month.', drawEntriesPerActiveMonth: 5 },
  { level: 12, perk: 'Maximum-level prestige', rule: 'Permanent animated Champion badge, seven-day streak shield, +7 Click Draw entries per active month. The status never expires.', drawEntriesPerActiveMonth: 7, streakGraceDays: 7 },
];

export function levelFromXp(xp: number): number {
  let out = 0;
  for (const l of LEVELS) if (xp >= l.cumulativeXp) out = l.level;
  return out;
}

export function levelProgress(xp: number) {
  const level = levelFromXp(xp);
  const current = LEVELS[level];
  const next = LEVELS[level + 1] ?? null;
  const into = xp - current.cumulativeXp;
  const span = next ? next.cumulativeXp - current.cumulativeXp : 0;
  return {
    level,
    label: current.label,
    into,
    span,
    pct: next ? Math.round((into / span) * 100) : 100,
    nextAt: next ? next.cumulativeXp : null,
    nextLabel: next ? next.label : null,
  };
}

// Effort-based. Supersedes the payout-based formula in the 2026-07-07 spec.
export function surveyCompletionXp(estimatedMinutes: number): number {
  return 25 + 5 * estimatedMinutes;
}

function perkValue(level: number, key: 'drawEntriesPerActiveMonth' | 'streakGraceDays', base: number) {
  let out = base;
  for (const p of LEVEL_PERKS) {
    if (p.level <= level && p[key] !== undefined) out = p[key] as number;
  }
  return out;
}

export function streakGraceDays(level: number): number {
  return perkValue(level, 'streakGraceDays', 1);
}

export function drawEntriesFromLevel(level: number): number {
  return perkValue(level, 'drawEntriesPerActiveMonth', 0);
}
```

Then add, in the same file, transcribing every remaining row from
`content/source/Level, XP, Badges, Quests rules.md`. Copy the completion rules
verbatim — they are operational specifications the dev team implements against,
so paraphrasing loses information. The exact shape for each, with the first row
of each table worked through so there is no ambiguity:

```ts
// All 19 rows of the "XP sources" table.
export const XP_SOURCES: { source: string; award: string; frequency: string; rule: string }[] = [
  {
    source: 'Verify email and activate account',
    award: '50 XP',
    frequency: 'Once',
    rule: 'Award after the verification link or code is successfully confirmed.',
  },
  // …18 more, in document order.
];

// All 27 rows of the "Badges" table. id is a kebab-case slug of the label.
export const BADGES: Badge[] = [
  {
    id: 'verified-voice',
    label: 'Verified Voice',
    trigger: 'Successfully verify the member account through email or the required account-verification process.',
    art: 'Captain holding a check-mark shield.',
  },
  // …26 more, in document order. The remaining ids, in order:
  // reward-ready, profile-starter, profile-pioneer, halfway-heard, full-picture,
  // new-chapter, invitation-accepted, survey-scout, every-attempt-counts,
  // quota-navigator, back-on-track, confirmed-contribution, first-earnings,
  // reward-step-up, quick-take, thoughtful-ten, deep-dive, feedback-loop,
  // first-check-in, daily-sweep, three-day-rhythm, seven-day-voice,
  // shield-activated, cashout-ready, first-redemption, draw-debut
];

// Section 4.1, all 17 rows. Three slots are drawn from this pool daily.
export const DAILY_QUESTS: QuestDef[] = [
  {
    id: 'daily-check-in',
    title: 'Daily Check-In',
    objective: 'Check in to MyVoice today',
    rule: 'Complete the first authenticated platform session during the member’s local calendar day',
    xp: 5,
  },
  // …16 more, in document order. Task 10 references ids
  // `share-your-voice` and `give-it-a-go`, which must exist.
];

// Section 4.2, all 12 rows. One is active per week.
export const WEEKLY_QUESTS: QuestDef[] = [
  {
    id: 'three-voices-shared',
    title: 'Three Voices Shared',
    objective: 'Complete three surveys this week',
    rule: 'Receive three distinct confirmed valid survey completions during the weekly period',
    xp: 150,
  },
  // …11 more, in document order.
];

// Section 4.3, all 6 rows. One is active per month.
export const MONTHLY_QUESTS: QuestDef[] = [
  {
    id: 'ten-voices-shared',
    title: 'Ten Voices Shared',
    objective: 'Complete 10 surveys this month',
    rule: 'Receive 10 distinct confirmed valid survey completions during the monthly period',
    xp: 750,
  },
  // …5 more, in document order.
];
```

Finally the draw constant:

```ts
export const DRAW = {
  prizes: [
    { count: 1, value: 50 },
    { count: 10, value: 10 },
  ],
  totalValue: 150,
  currency: 'EUR',
  entrySources: ['screenout', 'quota-full', 'survey-closed'] as const,
  entriesPerQualifyingSurvey: 1,
  monthlyCap: null,
  resetsMonthly: true,
  drawnWith: 'random.org',
  onePrizePerPersonPerMonth: true,
};
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npm test
```

Expected: PASS, 38 tests total. The badge and quest count assertions will fail until every row is transcribed — that is the point of them.

- [ ] **Step 5: Typecheck and commit**

```bash
npx tsc --noEmit
git add src/lib/gamification.ts tests/gamification.test.mjs
git commit -m "Add canonical gamification rules module"
```

---

### Task 6: Legal document routes

**Files:**
- Create: `src/app/legal/layout.tsx`
- Create: `src/app/legal/[slug]/page.tsx`
- Create: `src/components/legal/LegalDocView.tsx`
- Modify: `src/components/site/SiteFooter.tsx:7`

**Interfaces:**
- Consumes: `legalDocs`, `legalSlugs` from `src/content/legal.generated.ts`; `LegalDoc`, `Block` from `src/content/types.ts`; `asset` from `src/lib/asset.ts`.
- Produces: routes `/legal/privacy`, `/legal/cookies`, `/legal/terms`, `/legal/click-draw`.

- [ ] **Step 1: Write the document view component**

Create `src/components/legal/LegalDocView.tsx`:

```tsx
import type { LegalDoc, Block } from '@/content/types';

function BlockView({ block }: { block: Block }) {
  if (block.type === 'list') {
    return (
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-soft">
        {block.items.map((it, i) => <li key={i}>{it}</li>)}
      </ul>
    );
  }
  if (block.type === 'table') {
    return (
      <div className="mt-4 overflow-x-auto rounded-xl border border-bd">
        <table className="w-full min-w-[560px] border-collapse text-left text-[13px]">
          <thead className="bg-lteal">
            <tr>{block.head.map((h, i) => <th key={i} className="p-3 font-bold text-dteal">{h}</th>)}</tr>
          </thead>
          <tbody>
            {block.rows.map((r, i) => (
              <tr key={i} className="border-t border-bd align-top">
                {r.map((c, j) => <td key={j} className="p-3 leading-relaxed text-soft">{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  return <p className="mt-3 text-sm leading-relaxed text-soft">{block.text}</p>;
}

export function LegalDocView({ doc }: { doc: LegalDoc }) {
  return (
    <div className="mx-auto max-w-[1080px] px-5 py-8 md:px-8">
      <h1 className="max-w-[22ch] text-[28px] font-extrabold leading-tight text-dteal md:text-[34px]"
        style={{ textWrap: 'balance' } as React.CSSProperties}>
        {doc.title}
      </h1>
      {(doc.effective || doc.revised) && (
        <p className="mt-2 text-[13px] font-semibold text-soft">
          {doc.effective && <>Effective {doc.effective}</>}
          {doc.effective && doc.revised && <span aria-hidden="true"> · </span>}
          {doc.revised && <>Last revised {doc.revised}</>}
        </p>
      )}

      <div className="mt-7 gap-8 lg:grid lg:grid-cols-[220px_minmax(0,1fr)]">
        <nav aria-label="Sections" className="no-print mb-6 hidden lg:sticky lg:top-6 lg:mb-0 lg:block lg:self-start">
          <ul className="space-y-1.5 border-l border-bd pl-4">
            {doc.sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="block text-[13px] leading-snug text-soft hover:text-teal">
                  {s.heading}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          {doc.sections.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-24 border-t border-bd py-6 first:border-t-0 first:pt-0">
              <h2 className="text-lg font-extrabold text-ink">{s.heading}</h2>
              {s.blocks.map((b, i) => <BlockView key={i} block={b} />)}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Write the layout**

Create `src/app/legal/layout.tsx`. Deliberately outside both route groups so the public footer and the member platform can both link here:

```tsx
import Link from 'next/link';
import { asset } from '@/lib/asset';

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-canvas">
      <header className="no-print border-b border-bd bg-white">
        <div className="mx-auto flex max-w-[1080px] items-center justify-between px-5 py-4 md:px-8">
          <Link href="/" aria-label="MyVoice home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset('/assets/logo.jpg')} alt="MyVoice" className="h-[22px]" />
          </Link>
          <Link href="/member/settings" className="text-[13px] font-bold text-teal hover:underline">
            Back to my account
          </Link>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
```

- [ ] **Step 3: Write the route**

Create `src/app/legal/[slug]/page.tsx`. `generateStaticParams` is mandatory for static export:

```tsx
import { notFound } from 'next/navigation';
import { legalDocs, legalSlugs } from '@/content/legal.generated';
import { LegalDocView } from '@/components/legal/LegalDocView';

export function generateStaticParams() {
  return legalSlugs.map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const doc = legalDocs[params.slug];
  return { title: doc ? `${doc.title} · MyVoice` : 'MyVoice' };
}

export default function LegalPage({ params }: { params: { slug: string } }) {
  const doc = legalDocs[params.slug];
  if (!doc) notFound();
  return <LegalDocView doc={doc} />;
}
```

- [ ] **Step 4: Add print styles**

Append to `src/app/globals.css` (find it next to `layout.tsx`; if the project keeps global CSS elsewhere, add it there):

```css
@media print {
  .no-print { display: none !important; }
  body { background: #fff !important; }
  a[href]::after { content: ''; }
}
```

- [ ] **Step 5: Repoint the public footer**

In `src/components/site/SiteFooter.tsx:7`, the Trust group currently sends Privacy, Terms and Cookies all to `/trust-privacy`. Replace that line with:

```tsx
  ['Trust', [['Privacy', '/legal/privacy'], ['Terms', '/legal/terms'], ['Cookies', '/legal/cookies'], ['Data protection', '/trust-privacy']]],
```

- [ ] **Step 6: Build and verify all four routes render**

```bash
npm run build
```

Expected: build succeeds and the output lists `/legal/privacy`, `/legal/cookies`, `/legal/terms`, `/legal/click-draw`.

```bash
for s in privacy cookies terms click-draw; do
  test -f "out/legal/$s.html" && echo "ok  $s $(wc -c < out/legal/$s.html) bytes" || echo "MISSING $s";
done
grep -l "base64" out/legal/*.html && echo "FAIL: base64 in output" || echo "ok  no base64 in output"
```

Expected: four `ok` lines and no base64.

- [ ] **Step 7: Commit**

```bash
git add src/app/legal src/components/legal src/app/globals.css src/components/site/SiteFooter.tsx
git commit -m "Add legal document routes and repoint public footer links"
```

---

### Task 7: Help Center rebuild

**Files:**
- Modify: `src/app/member/help/page.tsx`
- Create: `src/components/member/HelpSearch.tsx`
- Create: `src/components/member/FaqCard.tsx`
- Create: `src/components/member/FaqPanel.tsx`
- Modify: `src/lib/mockData.ts` (help category card targets)

**Interfaces:**
- Consumes: `faqCategories`, `faqItems` from `src/content/faq.generated.ts`; `searchFaq` from `src/lib/faqSearch.ts`.
- Produces:
  - `FaqPanel({ open, categoryName, itemId, onClose })` — the reading panel.
  - `FaqCard({ onOpenCategory })` — the six-row launcher.
  - `HelpSearch({ onOpenItem })` — the search field plus results list.

- [ ] **Step 1: Write the reading panel**

Create `src/components/member/FaqPanel.tsx`. Dialog semantics, focus restore, Escape, scroll lock:

```tsx
'use client';
import { useEffect, useRef, useState } from 'react';
import { faqCategories } from '@/content/faq.generated';

export function FaqPanel({
  open, categoryName, itemId, onClose,
}: { open: boolean; categoryName?: string; itemId?: string; onClose: () => void }) {
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
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab') return;
      const f = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), select, [tabindex]:not([tabindex="-1"])'
      );
      if (!f || !f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  const category = faqCategories.find((c) => c.name === active) ?? faqCategories[0];

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[rgba(15,30,30,.45)] p-4 backdrop-blur-sm md:p-6"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div ref={panelRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="faq-panel-title"
        className="flex max-h-[85vh] w-full max-w-[880px] flex-col overflow-hidden rounded-3xl2 bg-white shadow-lift outline-none">
        <div className="flex items-center justify-between border-b border-bd px-5 py-4">
          <h2 id="faq-panel-title" className="text-lg font-extrabold text-dteal">Frequently asked questions</h2>
          <button onClick={onClose} aria-label="Close"
            className="grid h-9 w-9 place-items-center rounded-[10px] bg-[#F1F2EE] text-sm text-mute">✕</button>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-[220px_minmax(0,1fr)]">
          <div className="border-b border-bd p-4 md:border-b-0 md:border-r">
            <label className="md:hidden">
              <span className="sr-only">Category</span>
              <select value={active} onChange={(e) => setActive(e.target.value)}
                className="w-full rounded-[11px] border border-bd bg-white px-3.5 py-3 text-sm outline-none focus:border-teal">
                {faqCategories.map((c) => <option key={c.name}>{c.name}</option>)}
              </select>
            </label>
            <ul className="hidden md:block md:space-y-1">
              {faqCategories.map((c) => (
                <li key={c.name}>
                  <button onClick={() => { setActive(c.name); setOpenItem(undefined); }}
                    aria-current={c.name === active ? 'true' : undefined}
                    className={`w-full rounded-[10px] px-3 py-2 text-left text-[13px] font-semibold ${
                      c.name === active ? 'bg-lteal text-teal' : 'text-soft hover:bg-cream'}`}>
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
                  <button onClick={() => setOpenItem(isOpen ? undefined : it.id)} aria-expanded={isOpen}
                    className="flex w-full items-start justify-between gap-3 py-3 text-left">
                    <span className="text-sm font-bold text-ink">{it.question}</span>
                    <span className="shrink-0 text-lg text-teal transition-transform"
                      style={{ transform: isOpen ? 'rotate(45deg)' : 'none' }} aria-hidden="true">+</span>
                  </button>
                  {isOpen && <p className="pb-4 text-sm leading-relaxed text-soft">{it.answer}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Write the FAQ launcher card**

Create `src/components/member/FaqCard.tsx`:

```tsx
'use client';
import { faqCategories } from '@/content/faq.generated';

export function FaqCard({ onOpenCategory }: { onOpenCategory: (name: string) => void }) {
  return (
    <div className="rounded-2xl2 border border-bd bg-white p-5">
      <h3 className="text-base font-extrabold">FAQs</h3>
      <ul className="mt-2">
        {faqCategories.map((c) => (
          <li key={c.name}>
            <button onClick={() => onOpenCategory(c.name)}
              className="flex w-full items-center justify-between gap-3 border-t border-bd py-2.5 text-left first:border-t-0">
              <span className="text-[13.5px] font-semibold text-ink">{c.name}</span>
              <span className="shrink-0 text-xs font-bold text-soft">
                {c.items.length}<span className="sr-only"> questions</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 3: Write the search component**

Create `src/components/member/HelpSearch.tsx`:

```tsx
'use client';
import { useMemo, useState } from 'react';
import { faqItems } from '@/content/faq.generated';
import { searchFaq } from '@/lib/faqSearch';

export function HelpSearch({ onOpenItem }: { onOpenItem: (id: string, category: string) => void }) {
  const [q, setQ] = useState('');
  const hits = useMemo(() => (q.trim() ? searchFaq(faqItems, q, 6) : []), [q]);
  const searching = q.trim().length > 0;

  return (
    <div className="relative mt-3">
      <label htmlFor="faq-search" className="sr-only">Search the FAQs</label>
      <input id="faq-search" type="search" value={q} onChange={(e) => setQ(e.target.value)}
        placeholder="Search the FAQs — try “balance” or “password”"
        autoComplete="off"
        className="w-full rounded-[11px] border border-bd bg-white px-3.5 py-3 text-sm outline-none focus:border-teal" />

      {searching && (
        <div className="mt-2 overflow-hidden rounded-[11px] border border-bd bg-white shadow-soft">
          {hits.length === 0 ? (
            <p className="px-3.5 py-3 text-[13px] text-soft">
              No answers matched “{q.trim()}”. Try a different word, or message us using the form below.
            </p>
          ) : (
            <ul>
              {hits.map((h) => (
                <li key={h.item.id}>
                  <button onClick={() => { onOpenItem(h.item.id, h.item.category); setQ(''); }}
                    className="w-full border-t border-bd px-3.5 py-2.5 text-left first:border-t-0 hover:bg-cream">
                    <span className="block text-[13.5px] font-semibold text-ink">{h.item.question}</span>
                    <span className="mt-0.5 block text-[11px] font-bold text-teal">{h.item.category}</span>
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
```

- [ ] **Step 4: Point the help category cards at their destinations**

In `src/lib/mockData.ts`, replace the `helpCategories` export with a version carrying an explicit target:

```ts
export const helpCategories: { icon: string; title: string; desc: string; href?: string; scrollTo?: string }[] = [
  { icon: 'u1-work', title: 'Account', desc: 'Login, profile, deletion', href: '/member/settings#account' },
  { icon: 'u2-shield', title: 'Privacy', desc: 'Data, GDPR, consent', href: '/member/settings#privacy' },
  { icon: 'n-headphones', title: 'Contact', desc: 'Reach our support team', scrollTo: 'contact-support' },
];
```

- [ ] **Step 5: Rebuild the Help page**

Rewrite `src/app/member/help/page.tsx`. Keep the Contact support and Chat with us blocks exactly as they are today — only the ID on the contact card is new. The top of the file becomes:

```tsx
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Mascot } from '@/components/ui/Mascot';
import { CapIcon } from '@/components/ui/CapIcon';
import { HelpSearch } from '@/components/member/HelpSearch';
import { FaqCard } from '@/components/member/FaqCard';
import { FaqPanel } from '@/components/member/FaqPanel';
import { member, helpCategories, helpTopics } from '@/lib/mockData';

export default function HelpPage() {
  const [panel, setPanel] = useState<{ open: boolean; category?: string; item?: string }>({ open: false });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.15fr_1fr]">
        <div className="rounded-2xl2 p-6" style={{ background: 'linear-gradient(120deg,#E8F3F3,#FFF6DA)' }}>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block"><Mascot size={72} pose="announce" /></div>
            <h2 className="text-[22px] font-extrabold text-dteal">How can we help, {member.name}?</h2>
          </div>
          <HelpSearch onOpenItem={(item, category) => setPanel({ open: true, item, category })} />
        </div>

        <FaqCard onOpenCategory={(category) => setPanel({ open: true, category })} />
      </div>

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {helpCategories.map((c) => {
          const body = (
            <>
              <CapIcon name={c.icon} size={44} radius={11} />
              <div className="mt-2 text-[15px] font-bold">{c.title}</div>
              <div className="mt-0.5 text-xs text-mute">{c.desc}</div>
            </>
          );
          const cls = 'block rounded-2xl border border-bd bg-white p-[18px] text-left transition hover:border-teal';
          return c.href
            ? <Link key={c.title} href={c.href} className={cls}>{body}</Link>
            : <button key={c.title} className={cls}
                onClick={() => document.getElementById(c.scrollTo!)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
                {body}
              </button>;
        })}
      </div>

      {/* existing Contact + chat row, with id="contact-support" added to the contact card */}
```

On the existing contact-support card element, add `id="contact-support"` and `className="… scroll-mt-24"`. At the end of the component, before the closing `</div>`, render the panel:

```tsx
      <FaqPanel open={panel.open} categoryName={panel.category} itemId={panel.item}
        onClose={() => setPanel({ open: false })} />
```

- [ ] **Step 6: Build and verify**

```bash
npm run build && npm run dev
```

With the dev server up, check `/member/help`: search "balance" returns results, clicking one opens the panel at that answer, the FAQ card shows six categories with counts 8/3/5/12/3/1, Escape closes the panel, and the Account card navigates to `/member/settings#account`.

Screenshot using the recipe in the plan preamble under Verification.

- [ ] **Step 7: Commit**

```bash
git add src/app/member/help src/components/member/HelpSearch.tsx src/components/member/FaqCard.tsx src/components/member/FaqPanel.tsx src/lib/mockData.ts
git commit -m "Rebuild Help Center with FAQ search and browsable answers"
```

---

### Task 8: Settings rebuild

**Files:**
- Modify: `src/app/member/settings/page.tsx`
- Create: `src/components/member/SettingsField.tsx`
- Modify: `src/lib/mockData.ts` (member profile fields)

**Interfaces:**
- Consumes: `member` from `src/lib/mockData.ts`.
- Produces: `SettingsField({ label, value, locked, hint })` — one labelled row, rendering a lock affordance and support link when `locked`.

- [ ] **Step 1: Extend the member mock with the new fields**

In `src/lib/mockData.ts`, add to the `member` object, keeping the existing keys:

```ts
  firstName: 'Ana',
  lastName: 'Marin',
  phone: '+40 721 000 000',
  gender: 'Female',
  yearOfBirth: '1992',
  address: 'Str. Exemplu 12, Ap. 4',
  postCode: '010101',
  city: 'Bucharest',
  secondaryEmail: '',
  paypalEmail: 'ana.m@email.com',
  avatarUrl: '',
```

- [ ] **Step 2: Write the field component**

Create `src/components/member/SettingsField.tsx`:

```tsx
import Link from 'next/link';

export function SettingsField({
  label, value, locked = false, hint,
}: { label: string; value: string; locked?: boolean; hint?: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-t border-bd py-3">
      <div className="min-w-0">
        <div className="text-[13px] font-semibold text-mute">{label}</div>
        <div className="mt-0.5 break-words text-sm font-bold">
          {value || <span className="font-semibold text-mute">Not set</span>}
        </div>
        {hint && <p className="mt-1 text-[11px] leading-snug text-mute">{hint}</p>}
      </div>
      {locked ? (
        <div className="shrink-0 text-right">
          <div className="text-[11px] font-bold text-mute">
            <span aria-hidden="true">🔒 </span>Locked
          </div>
          <Link href="/member/help" className="text-[11px] font-bold text-teal hover:underline">
            Contact support
          </Link>
        </div>
      ) : null}
    </div>
  );
}
```

The locked row deliberately has no Edit control at all, rather than a disabled one — a disabled button gives no explanation on touch devices.

- [ ] **Step 3: Rebuild the Settings page**

Rewrite `src/app/member/settings/page.tsx`. Groups are hairline-divided sections inside one card, never nested cards:

```tsx
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { member } from '@/lib/mockData';
import { SettingsField } from '@/components/member/SettingsField';

// PLACEHOLDER (dev team): every group here is display-only. Edit swaps the group
// into a form in the real build; nothing persists in this static mock.
function Group({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  const [editing, setEditing] = useState(false);
  return (
    <section className="border-t border-bd pt-4 first:border-t-0 first:pt-0">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-extrabold text-dteal">{title}</h4>
          {note && <p className="mt-0.5 text-[11px] leading-snug text-mute">{note}</p>}
        </div>
        <button onClick={() => setEditing((v) => !v)}
          className="shrink-0 rounded-[9px] border border-bd bg-white px-3.5 py-2 text-[13px] font-bold text-teal">
          {editing ? 'Cancel' : 'Edit'}
        </button>
      </div>
      <div className="mt-1">{children}</div>
      {editing && (
        <div className="mt-3 flex gap-2">
          <button onClick={() => setEditing(false)}
            className="rounded-[10px] bg-yel px-4 py-2.5 text-[13px] font-bold text-ink">Save changes</button>
          <button onClick={() => setEditing(false)}
            className="rounded-[10px] border border-bd bg-white px-4 py-2.5 text-[13px] font-bold text-mute">Cancel</button>
        </div>
      )}
    </section>
  );
}

export default function SettingsPage() {
  return (
    <div className="max-w-[780px] space-y-4">
      <div id="account" className="scroll-mt-24 rounded-2xl2 border border-bd bg-white p-5">
        <h3 className="text-base font-extrabold">Account details</h3>

        <div className="mt-4 space-y-5">
          <Group title="Personal details">
            <div className="flex items-center gap-3 border-t border-bd py-3">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-teal text-base font-extrabold text-white">
                {member.initials}
              </span>
              <div>
                <div className="text-[13px] font-semibold text-mute">Profile picture</div>
                {/* PLACEHOLDER (dev team): preview only, nothing uploads. */}
                <label className="mt-1 inline-block cursor-pointer rounded-[9px] border border-bd px-3 py-1.5 text-[12px] font-bold text-teal">
                  Upload a photo
                  <input type="file" accept="image/*" className="sr-only" />
                </label>
              </div>
            </div>
            <SettingsField label="First name" value={member.firstName} />
            <SettingsField label="Last name" value={member.lastName} />
            <SettingsField label="Gender" value={member.gender} locked
              hint="Used to match you to the right surveys." />
            <SettingsField label="Year of birth" value={member.yearOfBirth} locked
              hint="Used to match you to the right surveys." />
          </Group>

          <Group title="Contact">
            <SettingsField label="Email" value={member.email} />
            <SettingsField label="Secondary email" value={member.secondaryEmail} />
            <SettingsField label="Phone number" value={member.phone} />
            <SettingsField label="Address" value={member.address} />
            <SettingsField label="Post code" value={member.postCode} />
            <SettingsField label="Country" value={`${member.countryFlag} ${member.country}`} locked
              hint="Surveys are matched to your country." />
            <SettingsField label="Language" value={member.language} />
          </Group>

          <Group title="Payments"
            note="Change your PayPal address and we send a confirmation link to it. Payouts keep using your current address until you confirm.">
            <SettingsField label="PayPal email" value={member.paypalEmail} />
          </Group>

          <Group title="Security">
            <SettingsField label="Password" value="••••••••" />
          </Group>
        </div>
      </div>

      <div id="privacy" className="scroll-mt-24 rounded-2xl2 border border-bd bg-white p-5">
        <h3 className="text-base font-extrabold">Privacy &amp; consent</h3>
        <p className="mt-1.5 text-[13px] leading-snug text-mute">
          Manage how your data is used. Your answers are only ever used for research, and you can delete your data anytime.
        </p>
        <div className="mt-3.5 flex flex-wrap gap-2.5">
          <button className="rounded-[10px] border border-teal bg-teal px-4 py-2.5 text-[13px] font-bold text-white">
            Manage consent
          </button>
          {[
            ['Privacy policy', '/legal/privacy'],
            ['Cookie policy', '/legal/cookies'],
            ['Terms &amp; conditions', '/legal/terms'],
          ].map(([label, href]) => (
            <Link key={href} href={href}
              className="rounded-[10px] border border-teal bg-white px-4 py-2.5 text-[13px] font-bold text-teal">
              {label.replace('&amp;', '&')}
            </Link>
          ))}
        </div>
      </div>

      {/* existing Delete account card, unchanged */}
    </div>
  );
}
```

Keep the existing Delete account card exactly as it is.

- [ ] **Step 4: Build and verify the deep links**

```bash
npm run build && npm run dev
```

Navigate to `/member/settings#account` and `/member/settings#privacy` — both must land with the heading clear of the sticky header. Confirm Gender, Year of birth and Country show the lock affordance with a working support link, and the three legal buttons reach their documents.

- [ ] **Step 5: Commit**

```bash
git add src/app/member/settings src/components/member/SettingsField.tsx src/lib/mockData.ts
git commit -m "Expand Settings with grouped account fields and legal links"
```

---

### Task 9: Community rebuild

**Files:**
- Modify: `src/app/member/community/page.tsx`
- Create: `src/components/member/DrawExplainer.tsx`
- Create: `src/content/drawWinners.ts`
- Create: `src/app/member/community/winners/page.tsx`
- Modify: `src/lib/mockData.ts` (`draw` constant)

**Interfaces:**
- Consumes: `DRAW` from `src/lib/gamification.ts`.
- Produces:
  - `DrawExplainer({ open, onClose })`
  - `src/content/drawWinners.ts` exporting `type DrawWinner`, `type DrawMonth`, `drawMonths: DrawMonth[]`.

- [ ] **Step 1: Correct the draw constant**

In `src/lib/mockData.ts`, replace the `draw` export and its stale placeholder comment:

```ts
// Prize structure is fixed by the signed Click Draw regulation: 1 x EUR 50 plus
// 10 x EUR 10, EUR 150 total, drawn monthly. See src/lib/gamification.ts DRAW.
// PLACEHOLDER (business-critical): confirm the live next-draw date each month.
export const draw = { date: 'Jul 31', prize: '11 prizes, €150 in total' };
```

- [ ] **Step 2: Write the draw explainer**

Create `src/components/member/DrawExplainer.tsx`. Copy states the regulation's rule and nothing beyond it — no level-perk entries until the user confirms:

```tsx
'use client';
import { useEffect } from 'react';
import Link from 'next/link';

const STEPS: [string, string][] = [
  ['You get an entry every time a survey does not work out',
   'If a survey ends because you were screened out, the quota was full, or it had already closed, you get one entry. There is no limit on how many you can earn in a month.'],
  ['Completing a survey pays you directly instead',
   'Completed surveys pay their reward straight into your balance. The draw is there for the attempts that did not pay.'],
  ['Entries reset at the start of each month',
   'Every month starts fresh. Entries do not carry over.'],
  ['Eleven members win every month',
   'One member wins €50 and ten members win €10, so €150 in total. Winners are picked at random using random.org, one prize per person per month.'],
  ['We credit the prize to your MyVoice account',
   'We email you first. A month’s draw takes place before the end of the following month.'],
];

export function DrawExplainer({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[rgba(15,30,30,.45)] p-4 backdrop-blur-sm md:p-6"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-labelledby="draw-explainer-title"
        className="flex max-h-[85vh] w-full max-w-[560px] flex-col overflow-hidden rounded-3xl2 bg-white shadow-lift">
        <div className="flex items-center justify-between border-b border-bd px-5 py-4">
          <h2 id="draw-explainer-title" className="text-lg font-extrabold text-dteal">How the Click Draw works</h2>
          <button onClick={onClose} aria-label="Close"
            className="grid h-9 w-9 place-items-center rounded-[10px] bg-[#F1F2EE] text-sm text-mute">✕</button>
        </div>
        <div className="min-h-0 overflow-y-auto px-5 py-4">
          <ol className="space-y-4">
            {STEPS.map(([title, body], i) => (
              <li key={i} className="flex gap-3">
                <span aria-hidden="true"
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-lteal text-[13px] font-extrabold text-teal">
                  {i + 1}
                </span>
                <div>
                  <div className="text-sm font-bold text-ink">{title}</div>
                  <p className="mt-0.5 text-[13px] leading-relaxed text-soft">{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="border-t border-bd px-5 py-4">
          <Link href="/legal/click-draw" className="text-[13px] font-bold text-teal hover:underline">
            Read the full terms and conditions
          </Link>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create the winners data file**

Create `src/content/drawWinners.ts`. This is the file the user edits monthly, so the comment block matters as much as the data:

```ts
// Click Draw winners, published to members only.
//
// TO UPDATE EACH MONTH:
//   1. Add a new object at the TOP of `drawMonths` (newest first).
//   2. `id` is YYYY-MM. `label` is what members see, e.g. "July 2026".
//   3. List 11 winners: one prize of 50 and ten of 10, per the regulation.
//   4. Names are published with consent under Section 8 of the Click Draw terms.
//      This page is behind member login and must never be linked from the
//      public site.
//
// PLACEHOLDER (business-critical): the month below is invented sample data and
// must be replaced with the real draw results before launch.

export type DrawWinner = { country: string; flag: string; name: string; prize: number };
export type DrawMonth = { id: string; label: string; drawnOn: string; winners: DrawWinner[] };

export const drawMonths: DrawMonth[] = [
  {
    id: '2026-06',
    label: 'June 2026',
    drawnOn: '2026-07-14',
    winners: [
      { country: 'Romania', flag: '🇷🇴', name: 'Maria Popescu', prize: 50 },
      { country: 'Germany', flag: '🇩🇪', name: 'Thomas Keller', prize: 10 },
      { country: 'Poland', flag: '🇵🇱', name: 'Anna Wójcik', prize: 10 },
      { country: 'Italy', flag: '🇮🇹', name: 'Giulia Rossi', prize: 10 },
      { country: 'Spain', flag: '🇪🇸', name: 'Carlos Ferrer', prize: 10 },
      { country: 'France', flag: '🇫🇷', name: 'Camille Dubois', prize: 10 },
      { country: 'Hungary', flag: '🇭🇺', name: 'Eszter Nagy', prize: 10 },
      { country: 'Romania', flag: '🇷🇴', name: 'Andrei Ionescu', prize: 10 },
      { country: 'Bulgaria', flag: '🇧🇬', name: 'Dimitar Petrov', prize: 10 },
      { country: 'Czechia', flag: '🇨🇿', name: 'Petra Novák', prize: 10 },
      { country: 'Greece', flag: '🇬🇷', name: 'Nikos Papadakis', prize: 10 },
    ],
  },
];

export const latestDrawMonth = drawMonths[0];
```

- [ ] **Step 4: Write the winners page**

Create `src/app/member/community/winners/page.tsx`:

```tsx
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { drawMonths } from '@/content/drawWinners';

export default function WinnersPage() {
  const [id, setId] = useState(drawMonths[0].id);
  const month = drawMonths.find((m) => m.id === id) ?? drawMonths[0];
  const countries = new Set(month.winners.map((w) => w.country)).size;

  return (
    <div className="max-w-[780px] space-y-4">
      <Link href="/member/community" className="inline-block text-[13px] font-bold text-teal hover:underline">
        ← Back to community
      </Link>

      <div className="rounded-2xl2 border border-bd bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-extrabold">Click Draw winners</h3>
            <p className="mt-0.5 text-[13px] text-mute">
              {month.winners.length} members across {countries} countries won in {month.label}.
            </p>
          </div>
          <label>
            <span className="sr-only">Choose a month</span>
            <select value={id} onChange={(e) => setId(e.target.value)}
              className="rounded-[10px] border border-bd bg-white px-3 py-2 text-[13px] font-bold outline-none focus:border-teal">
              {drawMonths.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
            </select>
          </label>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[420px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-bd">
                <th scope="col" className="py-2 text-[12px] font-bold text-mute">Country</th>
                <th scope="col" className="py-2 text-[12px] font-bold text-mute">Member</th>
                <th scope="col" className="py-2 text-right text-[12px] font-bold text-mute">Prize</th>
              </tr>
            </thead>
            <tbody>
              {month.winners.map((w, i) => (
                <tr key={i} className="border-b border-bd last:border-b-0">
                  <td className="py-2.5"><span aria-hidden="true">{w.flag} </span>{w.country}</td>
                  <td className="py-2.5 font-semibold">{w.name}</td>
                  <td className="py-2.5 text-right font-extrabold text-dteal">€{w.prize}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-[11px] leading-snug text-mute">
          Winners are drawn at random using random.org and published with their consent under the
          Click Draw terms. Each month’s draw takes place before the end of the following month.{' '}
          <Link href="/legal/click-draw" className="font-bold text-teal hover:underline">Read the full terms</Link>.
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Rebuild the Community page**

In `src/app/member/community/page.tsx`: add `'use client'` imports for `useState`, `Link`, `DrawExplainer` and `latestDrawMonth`. Then:

Replace the draw card's paragraph and button:

```tsx
            <p className="mt-1.5 text-[13px] leading-snug text-[#BFE0E0]">
              Next draw {draw.date} · {draw.prize}. You earn an entry every time a survey ends in a
              screenout, a full quota, or because it had already closed.
            </p>
            <button onClick={() => setExplainer(true)}
              className="mt-3 rounded-[11px] bg-yel px-4 py-2.5 text-[13px] font-bold text-ink">
              How the draw works
            </button>
```

Replace the tips block body with a single row showing only the tip:

```tsx
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {memberTips.map((t, i) => (
            <div key={i} className="flex items-start gap-2 rounded-xl bg-cream p-3">
              <span aria-hidden="true" className="font-extrabold text-green">✓</span>
              <span className="text-[13px] font-bold leading-snug">{t[0]}</span>
            </div>
          ))}
        </div>
```

Add the winners banner directly after the tips card:

```tsx
      <Link href="/member/community/winners"
        className="flex items-center gap-4 rounded-2xl2 border border-bd bg-white p-5 transition hover:border-teal">
        <span aria-hidden="true" className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-syel text-lg">🏆</span>
        <span className="flex-1">
          <span className="block text-sm font-extrabold text-ink">
            {latestDrawMonth.label} Click Draw winners are in
          </span>
          <span className="mt-0.5 block text-xs text-mute">
            {latestDrawMonth.winners.length} members won — check the complete list
          </span>
        </span>
        <span aria-hidden="true" className="shrink-0 font-extrabold text-teal">→</span>
      </Link>

      <DrawExplainer open={explainer} onClose={() => setExplainer(false)} />
```

with `const [explainer, setExplainer] = useState(false);` at the top of the component.

- [ ] **Step 6: Build and verify**

```bash
npm run build && npm run dev
```

Check `/member/community`: tips sit in one row of three with no explanatory text, "How the draw works" opens the explainer and Escape closes it, "Read the full terms" reaches `/legal/click-draw`, and the winners banner reaches the winners page where the month selector works.

- [ ] **Step 7: Commit**

```bash
git add src/app/member/community src/components/member/DrawExplainer.tsx src/content/drawWinners.ts src/lib/mockData.ts
git commit -m "Add Click Draw explainer, winners archive and single-row tips"
```

---

### Task 10: Gamification reconciliation across the app

The rules module exists; now make the app agree with it.

**Files:**
- Modify: `src/lib/mockData.ts`
- Modify: `src/components/member/MemberProvider.tsx`
- Modify: any file the audit in Step 1 flags

**Interfaces:**
- Consumes: `levelProgress`, `levelFromXp`, `surveyCompletionXp`, `BADGES`, `DAILY_QUESTS`, `DRAW` from `src/lib/gamification.ts`.

- [ ] **Step 1: Audit every mention**

```bash
grep -rn -i "ticket\|draw\|\bxp\b\|level\|streak\|badge\|quest\|voicer" src --include=*.tsx --include=*.ts | grep -v "src/lib/gamification.ts" > /tmp/gamification-audit.txt
wc -l /tmp/gamification-audit.txt
```

Read every line. For each, decide: correct already, wrong and fixable here, or presentational and deferred to the phase-two UI spec. Anything claiming tickets come from completions, quests or redemptions is wrong and must change.

- [ ] **Step 2: Reconcile the member mock**

In `src/lib/mockData.ts`, replace the level and XP keys on `member`:

```ts
  // Lifetime XP. Level and label derive from it — see levelProgress() in
  // src/lib/gamification.ts. Do not store level separately; it drifts.
  xp: 2340,
  // PLACEHOLDER (business-critical): real entry count for the current month.
  tickets: 6,
  streak: 7,
```

Remove `level`, `rank` and `xpMax`. Every consumer switches to `levelProgress(member.xp)`, which supplies `level`, `label`, `pct` and `nextAt`. This removes the second vocabulary — there is no "Voicer" rank alongside a level label any more.

- [ ] **Step 3: Reconcile quests and badges**

Replace the `quests` export with three daily quests drawn from the pool, using the document's XP values:

```ts
import { DAILY_QUESTS } from './gamification';

const DAILY_SLOTS = ['daily-check-in', 'share-your-voice', 'give-it-a-go'];
export const quests: Quest[] = DAILY_SLOTS.map((id, i) => {
  const def = DAILY_QUESTS.find((q) => q.id === id)!;
  return {
    id: i + 1,
    title: def.objective,
    icon: ['u1-calendar', 'u1-share', 'u2-target'][i],
    xp: def.xp,
    done: false,
    kind: (['checkin', 'survey', 'survey'] as const)[i],
  };
});
```

Drop the `reward` field from the seeded quests — quests pay XP, not money, under the new rules. Keep it optional on the `Quest` type.

Replace the `badges` export with the real set:

```ts
import { BADGES } from './gamification';

// PLACEHOLDER (business-critical): which badges this member has actually earned.
const EARNED = new Set([
  'verified-voice', 'profile-starter', 'profile-pioneer', 'halfway-heard',
  'invitation-accepted', 'first-check-in', 'three-day-rhythm', 'seven-day-voice',
  'every-attempt-counts', 'draw-debut',
]);

export const badges: Badge[] = BADGES.map((b) => ({
  icon: 'u2-target',
  label: b.label,
  earned: EARNED.has(b.id),
}));
```

The profile grid now renders 27 badges and gets long. That is expected — the badge gallery redesign belongs to the phase-two spec. Leave a comment saying so.

- [ ] **Step 4: Reconcile the member provider**

In `src/components/member/MemberProvider.tsx`:

- XP awarded on survey submit uses `surveyCompletionXp(sv.time)`, not the survey's `xp` field.
- Level-up detection uses `levelFromXp(newXp) > levelFromXp(oldXp)`.
- Remove any ticket increment on redemption or quest completion. Redemption and quests are not entry sources.
- The level-up modal copy in `src/components/member/Overlay.tsx:38` says "New badge unlocked and a bonus draw ticket added." Drop the ticket claim; keep the badge.

- [ ] **Step 5: Run everything**

```bash
npm test && npx tsc --noEmit && npm run build
```

Expected: 38 tests pass, no type errors, build succeeds.

- [ ] **Step 6: Re-run the audit to confirm nothing was missed**

```bash
grep -rn -i "bonus.*ticket\|ticket.*redeem\|redeem.*ticket\|€250\|250 prize" src --include=*.tsx --include=*.ts
```

Expected: no output.

- [ ] **Step 7: Commit**

```bash
git add src/lib/mockData.ts src/components/member
git commit -m "Reconcile app with the new gamification rules and draw regulation"
```

---

### Task 11: Documentation and final verification

**Files:**
- Modify: `PRODUCT.md`
- Modify: `DESIGN.md`
- Modify: `docs/superpowers/specs/2026-07-07-member-gamification-design.md`

- [ ] **Step 1: Update PRODUCT.md**

In the Member Support & Platform Scope section, record that the Help Center now carries searchable FAQ content drawn from the member FAQ document, and that Account and Privacy topic cards deep-link into Settings.

Add a short subsection recording two product rules:

- Year of birth, gender and country are member-visible but not member-editable, because they drive survey targeting; changing them is a support action. Changing the PayPal address requires confirming the new address before payouts move.
- Click Draw entries are earned only from surveys that end in screenout, quota full or survey closed. This is a deliberate fraud control: it pays members for genuine attempts without creating an incentive to farm completions.

- [ ] **Step 2: Update DESIGN.md**

Add to section 5:

- **Legal document layout** — the `/legal/*` shell: balanced title, effective and revised dates in Soft Teal, sticky section index on the left at `lg:`, sections divided by warm hairlines, tables scrolling inside their own container, and a print stylesheet that drops the chrome.
- **FAQ reading panel** — the dialog pattern: category rail at `md:` and above collapsing to a select on mobile, the signature `+`-to-`×` accordion for answers, focus trapped and restored, Escape to close.

Note in the Help Center layout subsection that the hero is now a two-column row — greeting and search on the left, FAQ launcher on the right.

- [ ] **Step 3: Mark the July 7 spec superseded**

At the top of `docs/superpowers/specs/2026-07-07-member-gamification-design.md`, immediately under the title, add:

```markdown
> **Partly superseded, 2026-07-22.** The levels table, XP sources, badge set and
> quest pools are now defined by `Level, XP, Badges, Quests rules.md`, transcribed
> into `src/lib/gamification.ts`. Two rules in this document are wrong and must
> not be implemented: XP is effort-based (`25 + 5 × estimated minutes`), not
> payout-based (`reward € × 50`); and Click Draw entries come from screenouts,
> quota-full and survey-closed outcomes, not from completed surveys. The
> priorities, guardrails and open compliance questions here still stand.
> See `2026-07-22-help-settings-community-design.md`.
```

- [ ] **Step 4: Full verification pass**

```bash
npm test && npx tsc --noEmit && npm run build
```

Then with `npm run dev` running, screenshot the four changed surfaces using the established recipe — `preview_screenshot` times out on these pages because the mascot animation never lets the renderer settle:

```bash
curl -s -o /dev/null http://localhost:3000/member/help
"C:/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu --no-sandbox \
  --hide-scrollbars --user-data-dir="$(mktemp -d)" --force-device-scale-factor=2 \
  --window-size=1280,900 --virtual-time-budget=8000 \
  --screenshot="D:\\temp\\help.png" http://localhost:3000/member/help
```

Warm each route with curl first, use a unique `--user-data-dir` per invocation, pass an absolute Windows output path, and do not wrap the capture in `taskkill` — that kills the shot process and writes nothing.

Capture `/member/help`, `/member/settings`, `/member/community`, `/member/community/winners` and `/legal/click-draw`.

- [ ] **Step 5: Commit and push**

```bash
git add PRODUCT.md DESIGN.md docs
git commit -m "Record Help, Settings, Community and gamification decisions in the design docs"
git push origin main
```

Then confirm the GitHub Actions run goes green before reporting completion.

---

## Notes for the implementer

**The mock is a specification.** This build has no backend. Where a control cannot work, it either carries a `PLACEHOLDER (dev team)` comment saying what must replace it, or it is not shipped at all. The Help Center search box was removed once before precisely because it was a dead control; do not reintroduce dead controls.

**Do not invent business values.** Prize amounts, draw dates, winner names, badge-earned states and entry counts are all either fixed by the regulation or marked `PLACEHOLDER`. If a number is needed and not in the source documents, add a placeholder comment naming who supplies it.

**Copy is load-bearing.** This product is repositioning away from survey-farm perception. Read the copy back and ask whether it sounds like a research organisation talking plainly to a member, or like a rewards app. The draw explainer in particular must read as fair and factual, not as a consolation prize dressed up.
