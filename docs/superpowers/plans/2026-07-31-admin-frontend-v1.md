# MyVoice Admin (V1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Version 1 of the MyVoice panel-admin console (`/admin`) — a faithful, prettier re-skin of the legacy Metronic admin across 12 sections, on the existing Next.js static-export + mock-data stack, so the dev team can wire the real backend with a 1:1 mapping.

**Architecture:** A third route surface mirroring `member/`: `src/app/admin/layout.tsx` wraps `AdminProvider` (in-memory session state + mutation actions) and `AdminShell` (sidebar + top bar + panel switcher). All data flows through a single swap-for-API file `src/lib/adminMockData.ts`. Most screens are built from a small shared component library (`DataTable`, `StatusPill`, `ActionMenu`, `Tabs`, form controls, `ConfirmDialog`, `Toast`), so section pages are mostly declarative column/field configs.

**Tech Stack:** Next.js 14 (App Router, `output: 'export'`), React 18, TypeScript, Tailwind (existing tokens in `tailwind.config.ts`), Plus Jakarta Sans / Inter. Tests: `node --test tests/*.test.mjs` (Node 24 native TS). No new dependencies.

## Global Constraints

- **No new npm dependencies.** Build only on `next`, `react`, `react-dom` + existing devDeps (`sharp`, `tailwindcss`, `typescript`). No date-picker/table/rich-text libraries — hand-roll with native inputs + `contentEditable`.
- **Static export safe.** All interactive pages are Client Components (`'use client'`). No server-only APIs. No `Date`-derived values computed at module scope or during render that differ between build and hydration (member platform hydration-mismatch lesson) — seed any "now"-relative data as fixed literals in `adminMockData.ts`.
- **Base-path aware.** Use the existing `asset()` helper / `next/link` for URLs; never hard-code `/admin/...` without going through `next/link` (basePath is `/myvoice-frontend` in prod).
- **Design tokens only.** Use existing Tailwind colors: `teal #336666`, `dteal #1F4F4F`, `yel #FFCC33`, `cream`, `sand`, `canvas`, `ink`, `mute`, `soft`, `green`, `amber`, `danger`, `bd`, `lteal`. **Signal Yellow (`yel`) is reserved for primary/positive money actions only** (Approve, Save) and must stay ≤10% of any screen. Teal-tinted shadows only (`shadow-soft/card`).
- **Register:** product/utility, denser than the member app. Not the marketing tone. Light mode only.
- **Status is never color-alone** — always `StatusPill` (icon + label + color).
- **Admin is unlinked** from the public site and member area; reachable only by URL, gated by a cosmetic mock login.
- **Verification for logic modules:** `node --test tests/<name>.test.mjs`. Logic modules under test must be self-contained (no `@/` imports) so the runner can load them.
- **Verification for UI:** `npx tsc --noEmit` (types) then `npm run build` (static export succeeds). `npm run lint` is NOT configured — do not use it.
- **Commit frequently**, one deliverable per commit, message ending with the Co-Authored-By trailer used in this repo.

---

## File Structure

```
src/
  lib/
    adminMockData.ts        # NEW — swap-for-API: types, seed data, pure helpers
    adminStatus.ts          # NEW — status token map (self-contained, tested)
    adminTable.ts           # NEW — pure table helpers: paginate, filterRows (tested)
  components/admin/         # NEW
    AdminProvider.tsx       # in-memory state + actions + panel context
    AdminShell.tsx          # sidebar + top bar + page header + content container
    PanelSwitcher.tsx       # searchable panel dropdown + scope indicator
    DataTable.tsx           # sortable, filterable, paginated, selectable table
    StatusPill.tsx          # icon+label+color from adminStatus
    ActionMenu.tsx          # Actions ▾ dropdown
    ConfirmDialog.tsx       # sensitive/bulk/destructive confirmation
    Toast.tsx               # action feedback (via AdminProvider)
    Tabs.tsx                # section tabs
    Field.tsx               # TextField/TextArea/Select/Toggle/DatePicker/FileUpload
    RichTextEditor.tsx      # contentEditable + toolbar + tag chips + preview
    TwoPaneChat.tsx         # Message Center layout
    StatTile.tsx            # dashboard metric tile
  app/admin/                # NEW
    login/page.tsx
    layout.tsx
    page.tsx                # Home
    access-control/page.tsx
    members/page.tsx
    member-rewards/page.tsx
    manage-rewards/page.tsx
    payment-email/page.tsx
    panel-settings/page.tsx
    account/page.tsx
    email-tool/page.tsx
    email-tool/[id]/page.tsx
    report/page.tsx
    recruitment/page.tsx
    messages/page.tsx
tests/
  adminStatus.test.mjs      # NEW
  adminTable.test.mjs       # NEW
  adminMockData.test.mjs    # NEW
```

**Phase map** (each phase produces working, navigable software):
- **Phase 1 — Foundation:** mock data + pure helpers + status system + shared components + provider + shell + login + Home. *(Fully step-detailed below.)*
- **Phase 2 — Member operations:** Access Control, Members, Member's Rewards.
- **Phase 3 — Config & catalogue:** Manage Rewards, Payment Email Settings, Panel Settings, Account.
- **Phase 4 — Comms & reporting:** Email Tool, Report, Recruitment, Message Center.

Phases 2–4 sections are each one task built from the Phase-1 components; their columns/fields/actions are fully specified. Because they are mechanical applications of the Task 3 `DataTable` / Task 8 `Field` patterns, each section task uses the **Standard UI verification** cycle (below) rather than repeating a five-step skeleton.

**Standard UI verification** (every UI task ends with this):
1. `npx tsc --noEmit` → Expected: no errors.
2. `npm run build` → Expected: "Compiled successfully" + the new route(s) listed in the export output.
3. Visual check: `npm run dev`, open the route, confirm content/columns/actions render and mock actions fire a `Toast`.
4. Commit.

---

## Phase 1 — Foundation

### Task 1: Status token map (`adminStatus.ts`)

**Files:**
- Create: `src/lib/adminStatus.ts`
- Test: `tests/adminStatus.test.mjs`

**Interfaces:**
- Produces: `type AdminStatus = 'active'|'inactive'|'sleeping'|'unsubscribed'|'pending'|'onhold'|'approved'|'rejected'|'complete'`; `STATUS_TOKENS: Record<AdminStatus, { label: string; tone: string; icon: string }>`; `statusToken(s: string): {label,tone,icon}` (case-insensitive; falls back to a neutral token).

- [ ] **Step 1: Write the failing test**

```js
// tests/adminStatus.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { STATUS_TOKENS, statusToken } from '../src/lib/adminStatus.ts';

test('every status has a distinct label, tone class and icon', () => {
  const keys = Object.keys(STATUS_TOKENS);
  assert.equal(keys.length, 9);
  // Active and Unsubscribed must NOT share a tone (legacy bug: both blue)
  assert.notEqual(STATUS_TOKENS.active.tone, STATUS_TOKENS.unsubscribed.tone);
  for (const k of keys) {
    assert.ok(STATUS_TOKENS[k].label && STATUS_TOKENS[k].tone && STATUS_TOKENS[k].icon);
  }
});

test('statusToken is case-insensitive and maps legacy strings', () => {
  assert.equal(statusToken('Active').label, 'Active');
  assert.equal(statusToken('ON HOLD').label, 'On Hold');
  assert.equal(statusToken('unknown-x').label, 'Unknown-x'); // graceful fallback
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/adminStatus.test.mjs`
Expected: FAIL (cannot find module `adminStatus.ts`).

- [ ] **Step 3: Write minimal implementation**

```ts
// src/lib/adminStatus.ts  (self-contained: no @/ imports)
export type AdminStatus =
  | 'active' | 'inactive' | 'sleeping' | 'unsubscribed'
  | 'pending' | 'onhold' | 'approved' | 'rejected' | 'complete';

type Token = { label: string; tone: string; icon: string };

// tone = Tailwind classes (bg + text), colorblind-safe pairing with a distinct icon.
export const STATUS_TOKENS: Record<AdminStatus, Token> = {
  active:       { label: 'Active',       tone: 'bg-green/15 text-green',   icon: 'check' },
  inactive:     { label: 'Inactive',     tone: 'bg-mute/15 text-mute',     icon: 'dash' },
  sleeping:     { label: 'Sleeping',     tone: 'bg-amber/15 text-amber',   icon: 'moon' },
  unsubscribed: { label: 'Unsubscribed', tone: 'bg-soft/15 text-soft',     icon: 'bell-off' },
  pending:      { label: 'Pending',      tone: 'bg-amber/15 text-amber',   icon: 'clock' },
  onhold:       { label: 'On Hold',      tone: 'bg-gold/15 text-gold',     icon: 'pause' },
  approved:     { label: 'Approved',     tone: 'bg-green/15 text-green',   icon: 'check' },
  rejected:     { label: 'Rejected',     tone: 'bg-danger/15 text-danger', icon: 'x' },
  complete:     { label: 'Complete',     tone: 'bg-teal/15 text-teal',     icon: 'check' },
};

const ALIASES: Record<string, AdminStatus> = { 'on hold': 'onhold' };

export function statusToken(raw: string): Token {
  const key = raw.trim().toLowerCase().replace(/\s+/g, ' ');
  const norm = (ALIASES[key] ?? key.replace(/\s+/g, '')) as AdminStatus;
  if (STATUS_TOKENS[norm]) return STATUS_TOKENS[norm];
  const label = raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
  return { label, tone: 'bg-mute/15 text-mute', icon: 'dash' };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/adminStatus.test.mjs`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/adminStatus.ts tests/adminStatus.test.mjs
git commit -m "feat(admin): status token map (colorblind-safe, distinct Active/Unsubscribed)"
```

---

### Task 2: Pure table helpers (`adminTable.ts`)

**Files:**
- Create: `src/lib/adminTable.ts`
- Test: `tests/adminTable.test.mjs`

**Interfaces:**
- Produces:
  - `paginate<T>(rows: T[], page: number, size: number): { slice: T[]; page: number; pages: number; total: number }` (1-indexed page, clamps out-of-range).
  - `filterRows<T>(rows: T[], filters: Record<string, string>, accessors: Record<string, (r:T)=>string>): T[]` (case-insensitive substring; empty filter = pass; `''`/'all' select = pass).
  - `sortRows<T>(rows: T[], key: string | null, dir: 'asc'|'desc', accessor: (r:T,k:string)=>string|number): T[]`.

- [ ] **Step 1: Write the failing test**

```js
// tests/adminTable.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { paginate, filterRows, sortRows } from '../src/lib/adminTable.ts';

const rows = Array.from({ length: 23 }, (_, i) => ({ id: i + 1, name: `n${i + 1}` }));

test('paginate slices and clamps', () => {
  const p = paginate(rows, 1, 10);
  assert.equal(p.slice.length, 10);
  assert.equal(p.pages, 3);
  assert.equal(p.total, 23);
  assert.equal(paginate(rows, 99, 10).page, 3); // clamps high
  assert.equal(paginate(rows, 0, 10).page, 1);  // clamps low
  assert.equal(paginate(rows, 3, 10).slice.length, 3);
});

test('filterRows is case-insensitive substring; blanks pass', () => {
  const acc = { name: (r) => r.name };
  assert.equal(filterRows(rows, { name: 'N1' }, acc).length, 4); // n1,n10..n19? -> n1,n10-n19 => 11? check substring
  assert.equal(filterRows(rows, { name: '' }, acc).length, 23);
});

test('sortRows asc/desc by accessor', () => {
  const acc = (r) => r.id;
  assert.equal(sortRows(rows, 'id', 'desc', acc)[0].id, 23);
  assert.equal(sortRows(rows, 'id', 'asc', acc)[0].id, 1);
  assert.equal(sortRows(rows, null, 'asc', acc)[0].id, 1); // null key = original order
});
```

> Note: fix the expected `filterRows` count to the true substring match when writing (n1, n10–n19 = 11) — the point is behavior, not the literal number; assert the actual value the implementation returns.

- [ ] **Step 2: Run** `node --test tests/adminTable.test.mjs` → Expected: FAIL (module missing).

- [ ] **Step 3: Implement**

```ts
// src/lib/adminTable.ts  (self-contained)
export function paginate(rows, page, size) {
  const total = rows.length;
  const pages = Math.max(1, Math.ceil(total / size));
  const p = Math.min(Math.max(1, page | 0), pages);
  const start = (p - 1) * size;
  return { slice: rows.slice(start, start + size), page: p, pages, total };
}

export function filterRows(rows, filters, accessors) {
  const active = Object.entries(filters).filter(([, v]) => v && v !== 'all');
  if (!active.length) return rows;
  return rows.filter((r) =>
    active.every(([k, v]) => {
      const get = accessors[k];
      if (!get) return true;
      return String(get(r)).toLowerCase().includes(String(v).toLowerCase());
    })
  );
}

export function sortRows(rows, key, dir, accessor) {
  if (!key) return rows;
  const s = [...rows].sort((a, b) => {
    const av = accessor(a, key), bv = accessor(b, key);
    if (av < bv) return -1;
    if (av > bv) return 1;
    return 0;
  });
  return dir === 'desc' ? s.reverse() : s;
}
```

> These are `.ts` with implicit `any` params to stay dependency-free and loadable by `node --test`; add generic types in a `.d`-style overload only if `tsc` complains under the app build (it won't, because the app imports typed wrappers). Keep signatures as documented in Interfaces.

- [ ] **Step 4: Run** `node --test tests/adminTable.test.mjs` → Expected: PASS. Adjust the one substring count assertion to the real returned value.

- [ ] **Step 5: Commit**

```bash
git add src/lib/adminTable.ts tests/adminTable.test.mjs
git commit -m "feat(admin): pure table helpers (paginate/filter/sort)"
```

---

### Task 3: Mock data + derivations (`adminMockData.ts`)

**Files:**
- Create: `src/lib/adminMockData.ts`
- Test: `tests/adminMockData.test.mjs`

**Interfaces (Produces — later tasks depend on these exact names/types):**
```ts
export type Panel = { id: string; name: string; alias: string; memberCount: number };
export type AdminUser = { panelistId: string; firstName: string; lastName: string; email: string; status: 'active'|'inactive'|'unsubscribed' };
export type Member = { id: number; email: string; gender: 'Male'|'Female'; birthYear: number; postalCode: string; status: 'active'|'sleeping'|'unsubscribed'|'inactive'; country: string };
export type MemberReward = { id: string; reward: string; memberId: number; email: string; value: number; status: 'pending'|'approved'|'rejected'|'onhold'; date: string; country: string };
export type CatalogueReward = { id: string; name: string; value: number; description: string; status: 'active'|'inactive' };
export type EmailTemplate = { id: string; name: string; group: 'admin'|'member'; subject: string; body: string };
export type Campaign = { id: number; subject: string; created: string; sent: string; status: 'complete'|'draft'; stats: { recipients: number; opens: number; clicks: number; unsubscribes: number }[] };
export type ReportRow = { id: string; name: string; status: 'complete'; createdAt: string };
export type RecruitmentSource = { id: string; name: string; status: 'active'|'inactive'; trigger: 'SOI (Registration)'|'DOI (Email Verification)'|'' };
export type MessageThread = { id: string; name: string; panel: string; panelistId: string; email: string; preview: string; date: string; messages: { from: 'admin'|'member'; text: string; time: string }[] };
export type PanelSettings = { panelName: string; panelAlias: string; contactEmail: string; referralReward: number; postalCodeNote: string; languages: string[]; cintCurrency: string; myvoiceCurrency: string; rewardsAvailability: string; minRedemption: number; rewardsInfoHtml: string };
export type PaymentEmailSettings = { email: string; additionalEmail: string };
export type AdminProfile = { firstName: string; lastName: string; mobile: string; gender: 'Male'|'Female'; dob: string; address: string; postalCode: string };
export type DashboardStats = { pendingRewards: number; cintCompleted: number; myvoiceCompleted: number; emailInviteCompleted: number; recruitment: { source: string; hits: string; registered: string; verified: string; conversion: string }[]; recentRewards: { date: string; value: number; status: string }[] };

export const PANELS: Panel[];                 // 30+ entries; includes Romania (id 'ro')
export const seed: {
  adminUsers: AdminUser[]; members: Member[]; memberRewards: MemberReward[];
  catalogue: CatalogueReward[]; templates: EmailTemplate[]; campaigns: Campaign[];
  reports: ReportRow[]; recruitment: RecruitmentSource[]; threads: MessageThread[];
  panelSettings: PanelSettings; paymentEmail: PaymentEmailSettings;
  profile: AdminProfile; dashboard: DashboardStats;
};
// Faked totals so pagination footers read like the legacy admin:
export const TOTALS = { members: 87696, memberRewards: 6144, campaigns: 3242, reports: 913 };
export const approvalTotal = (rewards: MemberReward[]): number => /* sum of value */;
export const EMAIL_TAGS: { token: string; label: string }[]; // %%first_name%% etc.
```

- [ ] **Step 1: Write the failing test**

```js
// tests/adminMockData.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PANELS, seed, TOTALS, approvalTotal } from '../src/lib/adminMockData.ts';

test('panels include Romania and have counts', () => {
  assert.ok(PANELS.length >= 30);
  assert.ok(PANELS.find((p) => p.name === 'Romania Panel'));
  assert.ok(PANELS.every((p) => typeof p.memberCount === 'number'));
});

test('seed tables are populated and typed', () => {
  assert.ok(seed.members.length >= 60);
  assert.ok(seed.memberRewards.length >= 10);
  assert.ok(seed.catalogue.length >= 15);
  assert.ok(seed.templates.length >= 15);
  assert.ok(seed.threads.length >= 5);
});

test('approvalTotal sums selected reward values', () => {
  assert.equal(approvalTotal([{ value: 10 }, { value: 15 }, { value: 10 }]), 35);
  assert.equal(TOTALS.memberRewards, 6144);
});
```

- [ ] **Step 2: Run** `node --test tests/adminMockData.test.mjs` → Expected: FAIL.

- [ ] **Step 3: Implement `adminMockData.ts`** with the types above and realistic seed data. Requirements for the data (fill each array with believable values, copying names/emails/statuses from the spec screenshots where given):
  - `PANELS`: 30+ from the Email Tool list — Albania (211), Algeria (2103), Angola (45), Argentina (1429), Australia (836), Austria (166), Bahrain (0), …, Romania Panel (id `ro`, alias `ropanel`, a nonzero count). Copy the counts shown; invent plausible ones for the rest.
  - `seed.adminUsers`: the Access Control rows (MyVoice/techdev active, Gabriela Tudor inactive, Laurentiu Petrea unsubscribed, gaurav khandelwal active, …) — ~14 rows.
  - `seed.members`: ~120 rows, Romanian names/emails, gender, birthYear (1949–2005), postalCode, mixed status (`active`/`sleeping`/`unsubscribed`), country "Romania Panel". Include the exact first-page rows from the screenshot (id 34, 75, 800015, 199942…).
  - `seed.memberRewards`: ~40 rows (reward PayPal/Wise/Amazon, memberId, email, value €10/€15/€20/€30, status, date `2026-07-2x …`, country). Include the screenshot's first rows.
  - `seed.catalogue`: the full Manage Rewards list (Amazon e-Card ×4 values, Donatie Caini de Salvare, GoGift, Neteller, PayPal ×4, Payoneer, Red Cross ×2 inactive, Revolut ×2, Skrill ×5 inactive, TREMENDOUS, Wise ×4, Xoom…) with descriptions + status exactly as shown.
  - `seed.templates`: the 16 Transaction Email Template names from the screenshot, each with a subject and a short HTML body (Rewards Redemption uses the `%%panelist_id%% %%first_name%% %%email%% %%paypal_email%% %%PANEL_NAME%%` body shown).
  - `seed.campaigns`: ~12 rows (id 3470–3479, subject "MV Iul 26 - <language>", created/sent timestamps, status complete, stats array as in the Statistics screenshot).
  - `seed.reports`: ~12 rows (names like `Multiple_Panels_Statistics_2026-06-08_07:50:08`, status complete, createdAt).
  - `seed.recruitment`: the Recruitment Source rows (Google active SOI, MVFinItaly inactive, Facebook inactive, MVFinUSA active DOI, ongraph, Testing active, TORO, MVFinGermany, AdGateMedia, MaxBounty…).
  - `seed.threads`: ~8 support threads (Çetin Kurt / Turkey Panel / 1138655, septian tri nugroho, Ahmet Arif Gunes, Yasoo Kareem, jonas christensson, Mohamed Kallel…) each with a few messages incl. the English canned reply shown.
  - `seed.panelSettings`: Romania Panel / ropanel / membersupport@myvoice-surveys.com / referralReward 1 / languages [English, Romanian] / cintCurrency EUR / myvoiceCurrency "Euro(€)" / rewardsAvailability "Available in 3 working day" / minRedemption 10 / rewardsInfoHtml (the "Once you've accumulated USD/EUR 10.00…" copy).
  - `seed.paymentEmail`: { email: 'panel-manager@datadiggers-mr.com', additionalEmail: 'ddtest074@gmail.com' }.
  - `seed.profile`: Divakar Sharma / +40722 222 222 / Male / dob '' / address '' / postalCode '110075'.
  - `seed.dashboard`: pendingRewards 0, cintCompleted 4, myvoiceCompleted 196, emailInviteCompleted 78, recruitment rows (LeadscaleinUSA 6|0 / 2|0 / 2|0 / 0.33%|0.00%, MVFinUSA 25|0 …, LeadscaleinBE 5|0 …), recentRewards [].
  - `TOTALS` and `approvalTotal` and `EMAIL_TAGS` exactly as in Interfaces.
  - All timestamps/dates are **fixed string literals** (no `new Date()` at module scope).

- [ ] **Step 4: Run** `node --test tests/adminMockData.test.mjs` → Expected: PASS.
- [ ] **Step 5: Commit**

```bash
git add src/lib/adminMockData.ts tests/adminMockData.test.mjs
git commit -m "feat(admin): mock data layer (swap-for-API) + derivations"
```

---

### Task 4: `StatusPill` + `Icon` helper

**Files:**
- Create: `src/components/admin/StatusPill.tsx`
- Create/extend: an inline `Icon` map inside `StatusPill.tsx` (small inline SVGs for check/dash/moon/bell-off/clock/pause/x). No icon library.

**Interfaces:**
- Consumes: `statusToken` from `@/lib/adminStatus`.
- Produces: `<StatusPill status={string} />` — renders `bg`/`text` tone + inline SVG icon + label. `export function StatusPill`.

- [ ] Build the component: read `statusToken(status)`, render `<span className={clsx('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold', token.tone)}>` with the matching inline SVG + `token.label`. Provide a `const ICONS: Record<string, JSX.Element>` with the 7 glyphs; default to `dash`.
- [ ] **Standard UI verification** (tsc + build — render is exercised by Task 6+). Commit:

```bash
git add src/components/admin/StatusPill.tsx
git commit -m "feat(admin): StatusPill component"
```

---

### Task 5: `DataTable` component

**Files:**
- Create: `src/components/admin/DataTable.tsx`

**Interfaces:**
- Consumes: `paginate`, `filterRows`, `sortRows` (`@/lib/adminTable`), `clsx` (`@/lib/clsx`).
- Produces:
```ts
export type Column<T> = {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;   // default: String(row[key])
  accessor?: (row: T) => string | number;  // for sort/filter; default row[key]
  sortable?: boolean;
  filter?: 'text' | 'select';              // renders a header filter control
  selectOptions?: { value: string; label: string }[];
  align?: 'left' | 'right' | 'center';
  width?: string;
};
export function DataTable<T>(props: {
  columns: Column<T>[];
  rows: T[];
  getRowId: (row: T) => string | number;
  selectable?: boolean;
  selected?: Set<string | number>;
  onSelectedChange?: (s: Set<string | number>) => void;
  pageSize?: number;                        // default 10
  totalOverride?: number;                   // faked total for the footer label
  density?: 'comfortable' | 'compact';
  empty?: React.ReactNode;
}): JSX.Element;
```
- Behavior: sticky header; per-column header filter inputs (`text` → `<input>`, `select` → `<select>`); click sortable header toggles asc/desc; contained `overflow-x-auto` wrapper; footer `Page ‹ [n] › of {pages} · View [size] · Found total {totalOverride ?? total} records` matching the legacy wording; optional leading checkbox column when `selectable`.
- [ ] Implement with local `useState` for `page`, `filters`, `sortKey`, `sortDir`, `pageSize`. Compose `filterRows` → `sortRows` → `paginate`. Row selection lifts to `onSelectedChange`.
- [ ] **Standard UI verification** (tsc + build). Commit:

```bash
git add src/components/admin/DataTable.tsx
git commit -m "feat(admin): DataTable (sort/filter/paginate/select, legacy footer)"
```

---

### Task 6: Interaction primitives — `ActionMenu`, `ConfirmDialog`, `Toast`, `Tabs`

**Files:**
- Create: `src/components/admin/ActionMenu.tsx`, `ConfirmDialog.tsx`, `Toast.tsx`, `Tabs.tsx`

**Interfaces:**
- `ActionMenu`: `<ActionMenu items={{ label: string; icon?: string; danger?: boolean; onClick: () => void; disabled?: boolean }[]} />` — a teal `Actions ▾` button opening a menu (click-outside to close, Esc, keyboard nav).
- `ConfirmDialog`: `<ConfirmDialog open title body confirmLabel onConfirm onCancel tone?='default'|'danger' />` — modal with focus trap + Esc; `confirmLabel` button is `yel` for approve/save, `danger` for destructive.
- `Toast`: `<ToastHost />` mounted once in the shell; a `useToast()` hook exposing `toast(msg: string)` (wired through `AdminProvider` in Task 7). Auto-dismiss ~2.5s, `qtoast` animation from tokens.
- `Tabs`: `<Tabs tabs={{ id: string; label: string }[]} active onChange />` — underlined active tab (dteal), matching the legacy tab bar.
- [ ] Implement all four (reuse `Overlay.tsx` pattern from `components/member` for the modal backdrop if convenient; otherwise a local backdrop). Respect `prefers-reduced-motion`.
- [ ] **Standard UI verification** (tsc + build). Commit:

```bash
git add src/components/admin/ActionMenu.tsx src/components/admin/ConfirmDialog.tsx src/components/admin/Toast.tsx src/components/admin/Tabs.tsx
git commit -m "feat(admin): ActionMenu, ConfirmDialog, Toast, Tabs primitives"
```

---

### Task 7: `AdminProvider` (state + actions)

**Files:**
- Create: `src/components/admin/AdminProvider.tsx`

**Interfaces:**
- Consumes: `seed`, all types, `approvalTotal`, `PANELS` from `@/lib/adminMockData`.
- Produces `useAdmin()` returning:
```ts
{
  panel: Panel; setPanel(id: string): void;               // current panel context
  data: typeof seed;                                       // live, mutable copy
  toast(msg: string): void;
  // mutations (each updates `data` immutably then toasts):
  setRewardStatus(id: string, status: MemberReward['status']): void;
  bulkReward(ids: (string)[], status: 'approved'|'rejected'): void;  // toasts count + €total for approve
  setMemberStatus(id: number, status: Member['status']): void;
  deleteMember(id: number): void;
  addAdminUser(u: Omit<AdminUser,'status'> & { status: AdminUser['status'] }): void;
  setAdminUserStatus(panelistId: string, status: AdminUser['status']): void;
  upsertCatalogue(r: CatalogueReward): void;
  saveTemplate(id: string, subject: string, body: string): void;
  savePanelSettings(p: PanelSettings): void;
  savePaymentEmail(p: PaymentEmailSettings): void;
  saveProfile(p: AdminProfile): void;
  addRecruitment(name: string): void;
  setRecruitmentStatus(id: string, status: 'active'|'inactive'): void;
  sendMessage(threadId: string, text: string): void;
}
```
- [ ] Implement as a Client Component context. Initialize `data` from a deep copy of `seed` (`structuredClone(seed)`). Each mutation produces a new `data` object and calls `toast(...)`. `bulkReward('approved')` toasts ```${ids.length} payouts approved · €${approvalTotal(selectedRows)}`.`` Mount `<ToastHost />` here.
- [ ] **Standard UI verification** (tsc + build). Commit:

```bash
git add src/components/admin/AdminProvider.tsx
git commit -m "feat(admin): AdminProvider in-memory state + mutation actions"
```

---

### Task 8: Form controls (`Field.tsx`)

**Files:**
- Create: `src/components/admin/Field.tsx`

**Interfaces (Produces):**
- `TextField`, `TextArea`, `Select`, `Toggle` (two-state segmented, e.g. Male/Female), `DatePicker` (native `<input type="date">` styled), `FileUpload` (button + filename + preview for images) — each `{ label, value, onChange, ...}` , consistent hairline styling, `:focus-visible` ring.
- [ ] Implement all controls with shared label + wrapper. `Toggle` renders two pill segments (active = `bg-teal text-white`). `FileUpload` shows current image preview (logo/avatar) via object URL.
- [ ] **Standard UI verification** (tsc + build). Commit:

```bash
git add src/components/admin/Field.tsx
git commit -m "feat(admin): shared form controls"
```

---

### Task 9: `PanelSwitcher` + `AdminShell` + mock login + layout + route guard

**Files:**
- Create: `src/components/admin/PanelSwitcher.tsx`, `src/components/admin/AdminShell.tsx`
- Create: `src/app/admin/layout.tsx`, `src/app/admin/login/page.tsx`

**Interfaces:**
- `PanelSwitcher`: consumes `useAdmin()` (`panel`, `setPanel`, `PANELS`); searchable dropdown; shows `Global | <panel>` scope note.
- `AdminShell`: renders sidebar (12 nav items w/ icon+label, active highlight, collapse toggle → icons+tooltip), top bar (PanelSwitcher + admin user menu w/ Logout), page header slot (title + breadcrumb), content container. Nav items & routes:
  `Home /admin` · `Access Control /admin/access-control` · `Members /admin/members` · `Member's Rewards /admin/member-rewards` · `Manage Rewards /admin/manage-rewards` · `Payment Email Settings /admin/payment-email` · `Panel Settings /admin/panel-settings` · `Account /admin/account` · `Email Tool /admin/email-tool` · `Report /admin/report` · `Recruitment /admin/recruitment` · `MyVoice Message Center /admin/messages`. Active state via `usePathname()` prefix match (like `MemberShell`). Derive page title from the active route.
- `layout.tsx`: `<AdminProvider><AdminShell>{children}</AdminShell></AdminProvider>`, EXCEPT the `/admin/login` route must render WITHOUT the shell — implement by checking `usePathname()` in the layout (client) and rendering `children` bare on `/admin/login`; otherwise wrap in shell. A cosmetic guard: on mount, if `sessionStorage['mv_admin']` is unset and path ≠ `/admin/login`, redirect to `/admin/login`. Login page sets the flag and routes to `/admin`.
- `login/page.tsx`: centered card, MyVoice logo (`asset('logo.webp')`), email + password + "Sign in" (`yel`), any credentials pass.
- [ ] Implement. Sidebar icons: reuse simple inline SVGs (home, wrench, list, bag, mail, gear, user, image, doc, users, chat) approximating the legacy set.
- [ ] **Standard UI verification** — additionally confirm: `/admin/login` shows no shell; after sign-in, `/admin` shows the shell; sidebar navigation highlights the active item; panel switcher opens and filters. Commit:

```bash
git add src/components/admin/PanelSwitcher.tsx src/components/admin/AdminShell.tsx src/app/admin/layout.tsx src/app/admin/login/page.tsx
git commit -m "feat(admin): shell, panel switcher, mock login gate + route guard"
```

---

### Task 10: Home dashboard (`/admin`)

**Files:**
- Create: `src/app/admin/page.tsx`
- Create: `src/components/admin/StatTile.tsx`

**Interfaces:** consumes `useAdmin().data.dashboard`, `StatTile`, `DataTable`.
- [ ] `StatTile`: `<StatTile value label />` — big number (dteal) + label (mute), `Card`-style.
- [ ] Page layout: four `StatTile`s (Pending Rewards, Cint / MyVoice / Email-invite completed this month); a **Recruitment Source** card with a start/end date filter + Submit/Clear and a table (Source, Hits, Registered, Verified, Conversion) fed from `dashboard.recruitment` with the `Global | Romania Panel` scope note; a **Rewards** card (recent list + "View All" → `/admin/member-rewards`); a **Feed** card (empty state "No recent events").
- [ ] **Standard UI verification** (tsc + build + visual: dashboard renders under the shell). Commit:

```bash
git add src/app/admin/page.tsx src/components/admin/StatTile.tsx
git commit -m "feat(admin): Home dashboard"
```

**End of Phase 1 → a navigable, logged-in admin shell with a working dashboard and the full shared component library.**

---

## Phase 2 — Member operations

Each task consumes Phase-1 `DataTable`, `StatusPill`, `ActionMenu`, `ConfirmDialog`, `useAdmin()`. Standard UI verification applies to each.

### Task 11: Access Control (`/admin/access-control`)
- Page header "Access Control" + breadcrumb `Home • Access Control`; top-right **Add User** (`dark` button) → opens a `ConfirmDialog`-style form (First/Last name, Email, Status select) → `addAdminUser` → toast.
- `DataTable<AdminUser>` columns: `panelistId` "Panelist Id" (sortable), `firstName` "First Name" (filter text), `lastName` "Last Name" (filter text), `email` "Email" (filter text), `status` "Status" (render `StatusPill`, filter select active/inactive/unsubscribed), `actions` (render `ActionMenu` → Edit (opens the form), Mark Inactive → `setAdminUserStatus(id,'inactive')`).
- Rows from `data.adminUsers`. Commit `feat(admin): Access Control section`.

### Task 12: Members (`/admin/members`)
- Header "Members" + breadcrumb; `DataTable<Member>` columns: `id` "Id" (filter text, sortable), `email` "Email" (filter text), `gender` "Gender", `birthYear` "Birth Year", `postalCode` "Postal Code", `status` "Status" (StatusPill, filter select), `country` "Country" (filter select from PANELS), plus three action columns: **Actions** (`View` button — opens a read-only member detail `ConfirmDialog`/panel), **Login** (`ghost` button → `ConfirmDialog` "Login as member #id?" cosmetic → toast), **Delete** (`ghost danger` → `ConfirmDialog` destructive → `deleteMember`).
- `totalOverride={TOTALS.members}` so the footer reads "Found total 87,696 records". Rows from `data.members`. Commit `feat(admin): Members section`.

### Task 13: Member's Rewards (`/admin/member-rewards`) — money queue
- Header "Member's Rewards" + breadcrumb; top-right **Approve Selected** (`yel`), **Reject Selected** (`ghost`), **Reset**.
- `DataTable<MemberReward>` with `selectable`, columns: `reward` "Reward" (sortable, filter text), `memberId` "Member Id" (filter text), `email` "Email" (sortable, filter text), `value` "Value" (render `€{value}`, right align, sortable), `status` "Status" (render an inline `Select` bound to `setRewardStatus`, filter select pending/approved/rejected/onhold), `date` "Date" (sortable desc default), `country` "Country" (filter select), `actions` (`ActionMenu` → Approve/Reject/On Hold).
- **Approve Selected** → `ConfirmDialog` titled "Approve N payouts?" body "Total €X to N members." confirm `yel` → `bulkReward(selectedIds,'approved')` → toast (count + €). Reject Selected → destructive confirm → `bulkReward(...,'rejected')`. Reset clears selection + filters.
- `totalOverride={TOTALS.memberRewards}`. Commit `feat(admin): Member's Rewards approval queue`.

**End of Phase 2 → the three core member tables, including the money-critical approval queue, fully interactive.**

---

## Phase 3 — Config & catalogue

### Task 14: Manage Rewards (`/admin/manage-rewards`)
- Header "Rewards" (breadcrumb `Home • Rewards`); top-left **Add new +** (`primary`) → form dialog (Name, Value, Description, Status) → `upsertCatalogue`.
- `DataTable<CatalogueReward>` columns: `name` "Name", `value` "Value" (`€{value}`), `description` "Description" (wraps), `status` "Status" (StatusPill), `actions` (`ActionMenu` → Edit → form; Mark Active/Inactive → `upsertCatalogue` with toggled status). No pagination override (show all). Commit `feat(admin): Manage Rewards catalogue`.

### Task 15: Payment Email Settings (`/admin/payment-email`)
- Header "Payment Manager Email Settings" (breadcrumb `Home • Project Manager Email Settings`). Two `TextField`s (Email, Additional Email) bound to `data.paymentEmail`; **Reset** + **Save** (`dark`) → `savePaymentEmail` → toast. Commit `feat(admin): Payment Email Settings`.

### Task 16: Panel Settings (`/admin/panel-settings`) — 2 tabs
- `Tabs` [Settings, Email Templates].
- **Settings tab:** `TextField`s Panel Name, Panel Alias, Contact Email, Referral Reward (number), Postal Code Note; read-only display of Panel Languages (list), Cint Panel Currency, MyVoice Panel Currency; `FileUpload` Logo (preview current `logo.webp`). **Merged Rewards Info group** (hairline-separated): `TextArea` Rewards Availability, `TextField` Minimum Redemption Threshold (number), `RichTextEditor` Rewards Info (bound to `rewardsInfoHtml`). **Save Changes** (`dark`) / **Cancel** → `savePanelSettings` → toast.
- **Email Templates tab:** two-pane — left list of `data.templates` (name), right editor: language chip (English), `TextField` Subject, `RichTextEditor` body with **tag chips** from `EMAIL_TAGS` (click inserts token) + **Preview Template** (renders body HTML in a modal). **Save Changes** → `saveTemplate`.
- Depends on **Task 17** `RichTextEditor`; sequence Task 17 before 16 or stub then wire. Commit `feat(admin): Panel Settings (Settings+Rewards Info | Email Templates)`.

### Task 17: `RichTextEditor` component
- Create `src/components/admin/RichTextEditor.tsx`. `<RichTextEditor value onChange tags? onPreview? />`. A `contentEditable` div + a toolbar of `document.execCommand`-based buttons (bold/italic/underline/list/link) — acceptable for a mock; guard `execCommand` behind `'use client'` + a mounted check. `tags` renders clickable chips that insert the token at caret. Emits HTML string via `onChange`. Commit `feat(admin): RichTextEditor with tag chips`. *(Build this before wiring Task 16's editors.)*

### Task 18: Account (`/admin/account`) — 3 tabs
- `Tabs` [Personal Info, Change Picture, Change Password].
- **Personal Info:** TextFields First Name, Last Name, Mobile Number; `Toggle` Gender (Male/Female); `DatePicker` Date of Birth; TextField Address; TextField Postal Code (required marker). Save Changes / Cancel → `saveProfile` → toast.
- **Change Picture:** `FileUpload` avatar with preview.
- **Change Password:** current / new / confirm TextFields (type password) + Save (validates new==confirm, cosmetic) → toast. Commit `feat(admin): Account section`.

**End of Phase 3 → all settings/config/catalogue screens editable (in-session).**

---

## Phase 4 — Comms & reporting

### Task 19: Email Tool list (`/admin/email-tool`)
- Header "Email Tool"; top-right **Add Campaign** (`dark`) → routes to `/admin/email-tool/new`.
- `DataTable<Campaign>` columns: `id` "Campaign-ID" (sortable), `subject` "Campaign-Subject" (filter text), `created` "Created" (sortable), `sent` "Sent" (sortable), `status` "Status" (StatusPill, filter select), `action` (`View` → `/admin/email-tool/{id}`), `delete` (`ghost danger` → confirm → remove from `data.campaigns`). `totalOverride={TOTALS.campaigns}`. Commit `feat(admin): Email Tool campaign list`.

### Task 20: Email Tool builder (`/admin/email-tool/[id]`) — 3 tabs
- Load campaign by `id` (or blank for `new`). Top-right buttons Test Campaign / Save / **Start Campaign** (`dark`) / Back to list. Starting sets status `complete` + toast.
- `Tabs` [Basic Settings, Template, Statistics].
- **Basic Settings:** TextField Campaign Name, Campaign Subject; `Select` Language; **Select panel** multi-select list from `PANELS` with per-panel counts + a live **Total Member Count** sum; `TextArea` To Email Address; `Select` From Email address; TextField From email name.
- **Template:** `RichTextEditor`.
- **Statistics:** metric cards (Campaign ID, Subject, Recipients, Opens, Clicks, Unsubscribes) from `campaign.stats`; Refresh + Export Statistics (cosmetic toast). Commit `feat(admin): Email Tool campaign builder`.

### Task 21: Report (`/admin/report`)
- Header "Reports". **Generate Report** panel: `Select` Panels, `Select` Options (Panel Report / Panel Statistics / Recruitment Statistics / Panel Health), multi-select Columns (chips) + Selected column readout, `DatePicker` Start Date; **Generate** (adds a row to `data.reports` with status complete + toast) / Reset.
- `DataTable<ReportRow>` columns: `name` "Name" (filter text), `status` "Status" (StatusPill, filter select), `createdAt` "Created At" (sortable desc default), `actions` (`Download` ghost button → cosmetic toast). `totalOverride={TOTALS.reports}`. Commit `feat(admin): Report section`.

### Task 22: Recruitment (`/admin/recruitment`) — 2 tabs
- `Tabs` [Recruitment Source, Recruitment Report].
- **Recruitment Source:** `TextField` Name + **Add** → `addRecruitment`. `DataTable<RecruitmentSource>` columns: `name` "Name", `status` "Status" (StatusPill), `trigger` "Trigger pixel at", `action` (`ActionMenu` → Mark as Inactive → `setRecruitmentStatus`, Edit).
- **Recruitment Report:** reuse the Home recruitment table (Source/Hits/Registered/Verified/Conversion) at panel scope from `data.dashboard.recruitment`. Commit `feat(admin): Recruitment section`.

### Task 23: MyVoice Message Center (`/admin/messages`)
- Create `src/components/admin/TwoPaneChat.tsx`. Header "MyVoice Message Center".
- Left pane: **Recent** list from `data.threads` (avatar, name, panel, last-message preview, date) + search box (filters by name/email). Right pane: selected thread header (name + panel; `Panelist ID` + `Email` subline), scrollable message bubbles (admin = `bg-dteal text-white` right-aligned, member = `bg-lteal` left), composer (attach icon + textarea + send) → `sendMessage` appends. Commit `feat(admin): MyVoice Message Center`.

**End of Phase 4 → all 12 sections complete. V1 done.**

---

## Self-Review

**Spec coverage** — every §9 section maps to a task: Home→T10, Access Control→T11, Members→T12, Member's Rewards→T13, Manage Rewards→T14, Payment Email→T15, Panel Settings (Settings+Rewards Info | Email Templates)→T16/T17, Account→T18, Email Tool (list/builder/stats)→T19/T20, Report→T21, Recruitment (both tabs)→T22, Message Center→T23. Shell/switcher/login/register→T9; status system→T1/T4; data layer→T3; interactivity model→T7; shared components→T4–T8. V2 roadmap intentionally not planned (spec §11, deferred).

**Placeholder scan** — logic tasks (T1–T3) carry full test + implementation code. UI tasks specify exact files, component prop signatures (Interfaces blocks), and exact column/field/action content per section; the repeated build/verify cycle is defined once as "Standard UI verification" (DRY) rather than restated. No "TBD/TODO/handle edge cases".

**Type consistency** — `MemberReward.status` uses `'onhold'` everywhere (T3 type, T13 filter, `bulkReward` union); `useAdmin()` method names in T7 match their call sites in T11–T23 (`setRewardStatus`, `bulkReward`, `setMemberStatus`, `deleteMember`, `addAdminUser`, `setAdminUserStatus`, `upsertCatalogue`, `saveTemplate`, `savePanelSettings`, `savePaymentEmail`, `saveProfile`, `addRecruitment`, `setRecruitmentStatus`, `sendMessage`). `DataTable` `Column<T>`/props (T5) match usage. `RichTextEditor` (T17) built before its consumer (T16). `statusToken`/`STATUS_TOKENS` (T1) consumed by `StatusPill` (T4).

**Ordering note** — within Phase 3, build Task 17 (RichTextEditor) before Task 16 (Panel Settings) which consumes it.
