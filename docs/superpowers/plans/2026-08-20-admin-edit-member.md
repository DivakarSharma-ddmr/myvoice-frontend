# Admin Edit Member Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the admin Members "View" button open a full Edit Member page — reproduced faithfully as V1 six tabs (`/admin/members/[id]`) and reimagined as a lighter single-scroll page in V2 (`/admin-lab/members/[id]`).

**Architecture:** Add a `MemberDetail` shape + `memberDetail(id)` lookup to the single mock-data layer (`adminMockData.ts`); member 34 reproduced exactly from screenshots, all other ids deterministic. V1 renders the legacy 6-tab layout with the shared `Tabs`/`DataTable`/`Field`/`StatusPill` primitives; V2 (on the additive `admin-v2` branch) renders one scannable page. All actions are mock through `AdminProvider`.

**Tech Stack:** Next.js 14 App Router (static export), TypeScript, Tailwind, `node --test` for logic tests.

## Global Constraints

- Static export: every `[id]` route MUST export `generateStaticParams()` over seeded member ids. Precedent: `src/app/admin/email-tool/[id]/page.tsx`.
- No `new Date()` / randomness at module scope in `adminMockData.ts`; timestamps are fixed string literals; generated detail is deterministic from `id`.
- Register = product/utility. Signal Yellow `#FFCC33` only on money/approve/save actions; nav-active stays `lteal`/`dteal`.
- Additive V2: from the `admin-v2` branch, no V1 file is modified except by merging `main` forward. New files only under `src/app/admin-lab/*` + `src/components/admin-lab/*`.
- Verify TypeScript with `npx tsc --noEmit` (NOT `npm run lint` — it hangs on an interactive prompt).
- Tests run with `npm test` (`node --test tests/*.test.mjs`). Pure-logic modules imported by tests must have no `@/` imports (Node strips TS natively).
- Design tokens available: `dteal`, `teal`, `lteal`, `soft`, `mute`, `ink`, `bd`, `canvas`, `cream`, `danger`, `signal` (yellow). Helper `clsx` at `@/lib/clsx`.

---

### Task 1: Member detail data layer + tests

**Files:**
- Modify: `src/lib/adminMockData.ts` (append new types, enums, generator, `memberDetail`)
- Test: `tests/adminMemberDetail.test.mjs`

**Interfaces:**
- Consumes: existing `Member`, `buildMembers()` output, `seed.members`.
- Produces:
  - `type PanelQuestionGroup = { group: string; items: { question: string; answer: string }[] }`
  - `type MemberTransaction = { id: string; created: string; type: string; amount: number; status: string; projectNo: string; surveyNo: string; token: string; clickDraw: string }`
  - `type MemberConsent = { name: string; option: 'Yes' | 'No'; collected: string }`
  - `type MemberMessage = { created: string; message: string; status: string }`
  - `type MemberDetail = Member & { …full shape from spec… }`
  - `function memberDetail(id: number): MemberDetail`
  - `const TXN_TYPES: string[]`, `const TXN_STATUSES: string[]`
  - `const CONSENT_NAMES: string[]` (the 6 consent labels)

- [ ] **Step 1: Write the failing test**

Create `tests/adminMemberDetail.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { memberDetail, TXN_TYPES, TXN_STATUSES, seed } from '../src/lib/adminMockData.ts';

test('member 34 reproduces the screenshot exactly', () => {
  const m = memberDetail(34);
  assert.equal(m.id, 34);
  assert.equal(m.panel, '1');
  assert.equal(m.cintId, '1123080033');
  assert.equal(m.created, '2019-01-23 00:00:00');
  assert.equal(m.lastSent, 'N/A');
  assert.equal(m.lastAnswered, '2026-06-15 14:29:13');
  assert.equal(m.walletAmount, 0);
  assert.equal(m.emailVerified, true);
  assert.equal(m.memberIdField, '0');
  assert.equal(m.email, 'bhartianshul916@gmail.com');
  assert.equal(m.gender, 'Male');
  assert.equal(m.birthYear, 1997);
  assert.equal(m.postalCode, '201001');
  assert.ok(m.resetPasswordLink.startsWith('https://www.myvoice-surveys.com/password_reset/'));
  assert.equal(m.firstName, 'anshul_athlete');
  assert.equal(m.lastName, '');
  assert.equal(m.transactions.length, 3);
  assert.equal(m.transactions[0].status, 'QT');
  assert.equal(m.transactions[0].projectNo, '8072');
  assert.equal(m.transactions[0].surveyNo, '664');
  assert.equal(m.consents.length, 6);
  assert.ok(m.consents.every((c) => c.option === 'Yes' && c.collected === '2026-06-15 14:29:13'));
  assert.equal(m.consents[0].name, 'Take surveys');
  assert.equal(m.messages.length, 0);
  const occ = m.panelQuestions.find((g) => g.group === 'Occupation');
  assert.ok(occ);
  assert.equal(occ.items[0].answer, 'Full-time work');
});

test('every seeded member id resolves with all arrays present', () => {
  for (const row of seed.members) {
    const m = memberDetail(row.id);
    assert.equal(m.id, row.id);
    assert.ok(Array.isArray(m.panelQuestions) && m.panelQuestions.length > 0);
    assert.ok(Array.isArray(m.transactions));
    assert.ok(Array.isArray(m.consents) && m.consents.length === 6);
    assert.ok(Array.isArray(m.messages));
    assert.ok(typeof m.cintId === 'string' && m.cintId.length > 0);
  }
});

test('memberDetail is deterministic', () => {
  assert.deepEqual(memberDetail(200005), memberDetail(200005));
});

test('enum lists match the legacy dropdowns', () => {
  assert.deepEqual(TXN_TYPES, ['Correct Points','Redemption','Points From Survey','Bonus Rewards','Cint Survey','Profile Completion Reward','MyVoice Survey']);
  assert.deepEqual(TXN_STATUSES, ['Survey Started','Completed','Screenout from Survey','Quota Full','Quality Terminate','Survey Closed','Client Dropout']);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — `memberDetail`/`TXN_TYPES` are not exported.

- [ ] **Step 3: Implement the data layer**

Append to `src/lib/adminMockData.ts` (after the existing exports). Add the types, enum lists, the exact member-34 record, a deterministic generator, and `memberDetail`:

```ts
/* ---------------------------- MEMBER DETAIL ----------------------------- */

export type PanelQuestionGroup = { group: string; items: { question: string; answer: string }[] };
export type MemberTransaction = {
  id: string; created: string; type: string; amount: number;
  status: string; projectNo: string; surveyNo: string; token: string; clickDraw: string;
};
export type MemberConsent = { name: string; option: 'Yes' | 'No'; collected: string };
export type MemberMessage = { created: string; message: string; status: string };

export type MemberDetail = Member & {
  panel: string; cintId: string;
  created: string; lastSent: string; lastAnswered: string; lastUpdated: string; lastAction: string;
  walletAmount: number; recruitmentSource: string; emailVerified: boolean; resetPasswordLink: string;
  memberIdField: string; mobile: string; daysBetweenMailouts: string;
  firstName: string; lastName: string; username: string; ssn: string;
  bankClearing: string; bankAccount: string; streetAddress: string;
  secondaryEmail: string; paypalEmail: string; metaUpdatedOn: string;
  panelQuestions: PanelQuestionGroup[];
  transactions: MemberTransaction[];
  consents: MemberConsent[];
  messages: MemberMessage[];
};

export const TXN_TYPES = ['Correct Points', 'Redemption', 'Points From Survey', 'Bonus Rewards', 'Cint Survey', 'Profile Completion Reward', 'MyVoice Survey'];
export const TXN_STATUSES = ['Survey Started', 'Completed', 'Screenout from Survey', 'Quota Full', 'Quality Terminate', 'Survey Closed', 'Client Dropout'];
export const CONSENT_NAMES = ['Take surveys', 'Terms and Conditions', 'Connect Cookie Tracking', 'Mobile Advertising', 'Third party Cookie', 'Share Profile'];

const OCCUPATION_QA: { question: string; answer: string }[] = [
  { question: 'Occupation', answer: 'Full-time work' },
  { question: 'India - What is your occupation', answer: 'Skilled Worked' },
  { question: "Which of the following categories best describes your organization's primary industry?", answer: 'Computer Software' },
  { question: 'Approximately how many employees work at your organization (all locations)?', answer: '101-250' },
  { question: 'Which department do you primarily work within at your organization? (Field of expertise)', answer: 'Technology Development Software (not only IT)' },
  { question: "If you work in your organization's IT department, please provide more detail about your role.", answer: 'Quality Assurance' },
  { question: 'What is your professional position in the company you work for?', answer: "I don't work" },
  { question: 'If you work in the finance sector, which best describes your position?', answer: "I don't work/I don't work in finance" },
  { question: 'Please choose which departments/products you have influence or decision making authority on spending/purchasing', answer: "I don't work" },
  { question: 'How many cars does your organization purchase/lease per year for their employees?', answer: '1 to 4' },
  { question: 'How would you define the price range of the car your organization purchases/leases for their employees?', answer: 'Mid Price Range' },
  { question: 'Which mobile operator/carrier do you use for business purposes?', answer: "I don't have a company mobile phone" },
  { question: 'Do you use a smart phone for business purposes?', answer: "I don't work" },
  { question: 'What brand of smartphone do you use for business purposes?', answer: "I don't use a smart phone for business purposes" },
  { question: 'If you use a smart phone for business, what operating system do you use?', answer: "I don't use a smart phone for business purposes" },
  { question: 'What is your primary role in your organization?', answer: 'Systems analyst' },
];

const MEMBER_34: MemberDetail = {
  id: 34, email: 'bhartianshul916@gmail.com', gender: 'Male', birthYear: 1997, postalCode: '201001', status: 'active', country: 'Romania Panel',
  panel: '1', cintId: '1123080033',
  created: '2019-01-23 00:00:00', lastSent: 'N/A', lastAnswered: '2026-06-15 14:29:13', lastUpdated: '2026-06-15 14:29:13', lastAction: '2026-06-15 14:29:13',
  walletAmount: 0, recruitmentSource: '', emailVerified: true,
  resetPasswordLink: 'https://www.myvoice-surveys.com/password_reset/ahlUlWgJqZbuWj24QPxWuQP1bye5IlVlWZLF8yOF',
  memberIdField: '0', mobile: '', daysBetweenMailouts: '',
  firstName: 'anshul_athlete', lastName: '', username: '', ssn: '', bankClearing: '', bankAccount: '', streetAddress: '', secondaryEmail: '', paypalEmail: '', metaUpdatedOn: '',
  panelQuestions: [
    { group: 'Household', items: [{ question: 'How many people live in the household?', answer: 'Prefer not to say' }] },
    { group: 'Occupation', items: OCCUPATION_QA },
    { group: 'Auto', items: [
      { question: 'Do you own or lease a car?', answer: 'Own' },
      { question: 'What is the make of your primary car?', answer: 'Dacia' },
      { question: 'When do you plan to buy your next car?', answer: 'In more than 2 years' },
    ] },
    { group: 'Technology', items: [
      { question: 'Which devices do you personally own?', answer: 'Smartphone, Laptop' },
      { question: 'How often do you shop online?', answer: 'At least once a week' },
    ] },
  ],
  transactions: [
    { id: 't-1', created: '2019-10-15 08:27:59', type: 'MyVoice Survey', amount: 0, status: 'QT', projectNo: '8072', surveyNo: '664', token: '-', clickDraw: '-' },
    { id: 't-2', created: '2019-10-15 08:01:20', type: 'MyVoice Survey', amount: 0, status: 'Survey Closed', projectNo: '8072', surveyNo: '646', token: '-', clickDraw: '-' },
    { id: 't-3', created: '2019-09-02 13:16:32', type: 'MyVoice Survey', amount: 0, status: 'Survey Closed', projectNo: '7376', surveyNo: '422', token: '-', clickDraw: '-' },
  ],
  consents: CONSENT_NAMES.map((name) => ({ name, option: 'Yes' as const, collected: '2026-06-15 14:29:13' })),
  messages: [],
};

// Deterministic detail for any non-34 member (no Date(), no randomness).
const TXN_TIMES = ['2026-05-14 09:12:03', '2026-04-02 15:40:21', '2026-02-19 11:05:48', '2025-12-30 18:22:10'];
function buildDetail(base: Member): MemberDetail {
  const n = base.id;
  const txnCount = 2 + (n % 3); // 2..4
  const transactions: MemberTransaction[] = Array.from({ length: txnCount }, (_, i) => ({
    id: `t-${n}-${i}`,
    created: TXN_TIMES[i % TXN_TIMES.length],
    type: TXN_TYPES[(n + i) % TXN_TYPES.length],
    amount: (n + i) % 4 === 0 ? 10 : 0,
    status: TXN_STATUSES[(n + i * 2) % TXN_STATUSES.length],
    projectNo: String(7000 + ((n + i) % 1500)),
    surveyNo: String(400 + ((n * 3 + i) % 600)),
    token: '-', clickDraw: '-',
  }));
  const stamp = '2026-06-15 14:29:13';
  return {
    ...base,
    panel: '1', cintId: String(1_100_000_000 + (n % 90_000_000)),
    created: '2019-01-23 00:00:00', lastSent: 'N/A', lastAnswered: stamp, lastUpdated: stamp, lastAction: stamp,
    walletAmount: n % 5 === 0 ? 10 : 0, recruitmentSource: n % 4 === 0 ? 'Google' : '', emailVerified: n % 7 !== 0,
    resetPasswordLink: `https://www.myvoice-surveys.com/password_reset/${(n * 2654435761 >>> 0).toString(36)}Mock`,
    memberIdField: '0', mobile: '', daysBetweenMailouts: '',
    firstName: '', lastName: '', username: '', ssn: '', bankClearing: '', bankAccount: '', streetAddress: '', secondaryEmail: '', paypalEmail: '', metaUpdatedOn: '',
    panelQuestions: [
      { group: 'Household', items: [{ question: 'How many people live in the household?', answer: ['1', '2', '3', '4 or more', 'Prefer not to say'][n % 5] }] },
      { group: 'Occupation', items: OCCUPATION_QA.slice(0, 4) },
      { group: 'Auto', items: [{ question: 'Do you own or lease a car?', answer: n % 2 === 0 ? 'Own' : 'No car' }] },
    ],
    transactions,
    consents: CONSENT_NAMES.map((name) => ({ name, option: 'Yes' as const, collected: stamp })),
    messages: [],
  };
}

export function memberDetail(id: number): MemberDetail {
  if (id === 34) return structuredClone(MEMBER_34);
  const base = seed.members.find((m) => m.id === id);
  if (base) return buildDetail(base);
  // Fallback for an unknown id (keeps the page from crashing on a stray route).
  return buildDetail({ id, email: `member${id}@example.com`, gender: 'Male', birthYear: 1990, postalCode: '000000', status: 'active', country: 'Romania Panel' });
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: all tests PASS (existing 69 + the 4 new).

- [ ] **Step 5: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/lib/adminMockData.ts tests/adminMemberDetail.test.mjs
git commit -m "feat(admin): member detail data layer + memberDetail(id)"
```

---

### Task 2: AdminProvider mock actions for the editor

**Files:**
- Modify: `src/components/admin/AdminProvider.tsx` (add 4 actions to the context type + value)

**Interfaces:**
- Consumes: existing `useAdmin`, `setData`, `toast`, `data.members`.
- Produces on the context value:
  - `saveMemberDetails: (id: number, patch: { status?: Member['status']; email?: string; gender?: Member['gender']; birthYear?: number; postalCode?: string }) => void`
  - `saveMemberMeta: (id: number) => void`
  - `awardPoints: (id: number, points: number, reason: string) => void`
  - `sendMemberMessage: (id: number, text: string) => void`

- [ ] **Step 1: Add the action signatures to `AdminContextValue`**

In `AdminProvider.tsx`, add to the `type AdminContextValue = { … }` block:

```ts
  saveMemberDetails: (id: number, patch: { status?: Member['status']; email?: string; gender?: Member['gender']; birthYear?: number; postalCode?: string }) => void;
  saveMemberMeta: (id: number) => void;
  awardPoints: (id: number, points: number, reason: string) => void;
  sendMemberMessage: (id: number, text: string) => void;
```

- [ ] **Step 2: Implement the actions in the `value` memo**

Add inside the `useMemo<AdminContextValue>(() => ({ … }))` object (after `deleteMember`):

```ts
    saveMemberDetails: (id, patch) => {
      setData((d) => ({ ...d, members: d.members.map((m) => (m.id === id ? { ...m, ...patch } : m)) }));
      toast(`Member #${id} details saved.`);
    },
    saveMemberMeta: (id) => { toast(`Member #${id} meta data saved.`); },
    awardPoints: (id, points, reason) => {
      toast(`Awarded ${points} point${points === 1 ? '' : 's'} to #${id}${reason ? ` (${reason})` : ''}.`);
    },
    sendMemberMessage: (id, text) => {
      if (text.trim()) toast(`Message sent to #${id}.`);
    },
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/admin/AdminProvider.tsx
git commit -m "feat(admin): mock actions for member editor (save/award/message)"
```

---

### Task 3: V1 Edit Member route + editor + Members list link

**Files:**
- Create: `src/app/admin/members/[id]/page.tsx`
- Create: `src/app/admin/members/[id]/MemberEditor.tsx`
- Modify: `src/app/admin/members/page.tsx` (View button → Link; remove view modal)

**Interfaces:**
- Consumes: `memberDetail`, `TXN_TYPES`, `TXN_STATUSES`, `MemberDetail`, `MemberTransaction` from `@/lib/adminMockData`; `useAdmin` actions from Task 2; `Tabs` `@/components/admin/Tabs`; `DataTable`+`Column` `@/components/admin/DataTable`; `StatusPill` `@/components/admin/StatusPill`; `TextField`/`Select` `@/components/admin/Field`.
- Produces: the route `/admin/members/[id]` (statically exported).

- [ ] **Step 1: Create the server route with static params**

`src/app/admin/members/[id]/page.tsx`:

```tsx
import { seed } from '@/lib/adminMockData';
import { MemberEditor } from './MemberEditor';

export function generateStaticParams() {
  return seed.members.map((m) => ({ id: String(m.id) }));
}

export default function EditMemberPage({ params }: { params: { id: string } }) {
  return <MemberEditor id={Number(params.id)} />;
}
```

- [ ] **Step 2: Create `MemberEditor.tsx` — shell, identity strip, award bar, tab state**

`src/app/admin/members/[id]/MemberEditor.tsx` (client). Structure:
- `'use client'`; imports as listed in Interfaces + `Link` from `next/link` + `useMemo/useState` + `memberDetail`.
- `const d = useMemo(() => memberDetail(id), [id]);`
- Local editable state seeded from `d`: `status, memberIdField, email, mobile, gender, birthYear, postalCode, daysBetweenMailouts` and the 9 meta fields; `award`, `reason`, `msg` strings.
- `const { saveMemberDetails, saveMemberMeta, awardPoints, sendMemberMessage } = useAdmin();`
- `const [tab, setTab] = useState('details');`
- Render:
  - Back link: `<Link href="/admin/members" className="text-sm text-teal hover:underline">‹ Back to members</Link>`
  - Identity row: `Member #{d.id}` (bold dteal), `{d.email}` (soft), `<StatusPill status={status} />`.
  - **Award bar** (flex, wrap, gap-4, items-end, border-b pb-4): `Wallet Amount: €{d.walletAmount.toFixed(2)}` label; `<TextField label="Award Point" value={award} onChange={setAward} />`; `<TextField label="Reason" value={reason} onChange={setReason} />`; Approve button:
    ```tsx
    <button type="button" onClick={() => awardPoints(d.id, Number(award) || 0, reason)} className="rounded-xl bg-signal px-5 py-2.5 text-sm font-bold text-ink hover:brightness-95">Approve</button>
    ```
  - `<Tabs tabs={TABS} active={tab} onChange={setTab} />` where
    `const TABS = [{id:'details',label:'User Details'},{id:'meta',label:'Extra/Meta Data'},{id:'questions',label:'Panel Questions'},{id:'transactions',label:'Transactions'},{id:'consent',label:'Consent'},{id:'messages',label:'Messages'}];`
  - `<div className="pt-6">{tab === 'details' && <DetailsTab/>} …</div>` — implement each tab inline or as local components in the same file (Steps 3–8).

- [ ] **Step 3: User Details tab**

Two-column grid (`grid gap-8 lg:grid-cols-2`). Left = read-only `<dl className="grid grid-cols-[max-content_1fr] gap-x-6 gap-y-2 text-sm">` with rows: Id, Panel, Cint ID, Created, Last sent, Last answered, Last updated, Last Action, Wallet Amount (`€{d.walletAmount.toFixed(2)}`), Recruitment source, Email Verification (`d.emailVerified ? 'Yes' : 'No'`), Reset Password Link (render as `<a href={d.resetPasswordLink} className="break-all text-teal hover:underline">`). Right = editable stack (`space-y-4`): `Select` Status (options from a `STATUS_OPTS` array `active/sleeping/unsubscribed/inactive`), `TextField` Member Id, Email address, Mobile, `Select` Gender (`Male/Female`), `TextField` Year of birth, Postal Code, Days between mailouts; then Submit:
```tsx
<button type="button" onClick={() => saveMemberDetails(d.id, { status, email, gender, birthYear: Number(birthYear) || d.birthYear, postalCode })} className="rounded-xl bg-teal px-5 py-2.5 text-sm font-bold text-white hover:bg-dteal">Submit</button>
```

- [ ] **Step 4: Extra/Meta Data tab**

`grid gap-4 sm:grid-cols-2 max-w-3xl` of `TextField`s bound to the meta state: First name, Last name, Username, SSN, Bank clearing, Bank account, Street address, Secondary Email, Paypal Email. Then a muted line `Updated on: {d.metaUpdatedOn || '—'}` and a Submit button (teal) calling `saveMemberMeta(d.id)`.

- [ ] **Step 5: Panel Questions tab**

`space-y-6`. For each `g` in `d.panelQuestions`: a card `rounded-2xl border border-bd bg-white`, header `bg-cream px-5 py-3 font-bold text-dteal` = `g.group`, body rows `divide-y divide-bd/60`; each item a `flex justify-between gap-6 px-5 py-2.5 text-sm` with `question` (ink, left) and `* {answer}` (soft, right, `text-right`).

- [ ] **Step 6: Transactions tab**

```tsx
const columns: Column<MemberTransaction>[] = [
  { key: 'created', header: 'Created' },
  { key: 'type', header: 'Transaction Type', filter: 'select', selectOptions: TXN_TYPES.map((t) => ({ value: t, label: t })) },
  { key: 'amount', header: 'Amount', render: (r) => `€${r.amount.toFixed(2)}` },
  { key: 'status', header: 'Status', filter: 'select', selectOptions: TXN_STATUSES.map((s) => ({ value: s, label: s })) },
  { key: 'projectNo', header: 'Project No.', filter: 'text' },
  { key: 'surveyNo', header: 'Survey No.', filter: 'text' },
  { key: 'token', header: 'Token' },
  { key: 'clickDraw', header: 'Click Draw', filter: 'text' },
  { key: 'action', header: 'Action', align: 'center', render: () => <button type="button" className="text-teal hover:text-dteal" aria-label="Edit transaction">✎</button> },
];
return <DataTable columns={columns} rows={d.transactions} getRowId={(r) => r.id} />;
```

- [ ] **Step 7: Consent tab**

A plain table (`w-full text-sm`, header `bg-lteal/60 text-dteal`, rows `border-t border-bd/70`): columns Consent Name / Member Option / Collected, mapping `d.consents`. Wrap in `rounded-2xl border border-bd bg-white overflow-hidden`.

- [ ] **Step 8: Messages tab**

Top: `<TextArea>`-style textarea bound to `msg` (label "Message", placeholder "Type Message here…"); Submit (teal) → `sendMemberMessage(d.id, msg)` then `setMsg('')`; Reset → `setMsg('')`. Below: a `DataTable` over `d.messages` with columns Created / Message / Status, `empty="No data available in table"`.

- [ ] **Step 9: Change the Members list View button to a Link; remove the view modal**

In `src/app/admin/members/page.tsx`:
- Add `import Link from 'next/link';`
- Replace the `actions` column render with:
  ```tsx
  render: (r) => (
    <Link href={`/admin/members/${r.id}`} className="inline-block rounded-lg border border-bd px-3 py-1.5 text-xs font-semibold text-teal hover:bg-lteal/40">View</Link>
  ),
  ```
- Remove `const [view, setView] = useState<Member | null>(null);` and the entire view `ConfirmDialog` block. Keep `login`/`del` state and their dialogs.

- [ ] **Step 10: Typecheck + build**

Run: `npx tsc --noEmit && npm run build`
Expected: typecheck clean; build succeeds and statically renders `/admin/members/[id]` for every seeded id.
NOTE: if a dev server is running, restart it after `npm run build` (build wipes `.next` → chunk 404s).

- [ ] **Step 11: Commit**

```bash
git add src/app/admin/members
git commit -m "feat(admin): V1 Edit Member page (6 tabs) + Members View link"
```

---

### Task 4: Verify V1 in the browser

**Files:** none (verification only)

- [ ] **Step 1: Start the dev server** via preview_start `{name: admin dev}` or `npm run dev`; ensure `.next` is fresh (`rm -rf .next` if a prior `npm run build` ran).

- [ ] **Step 2: Seed the mock admin session + open the page.** With Playwright MCP: `sessionStorage.setItem('mv_admin','1')` on `/admin/login`, then navigate to `/admin/members/34/`.

- [ ] **Step 3: Confirm each tab renders member-34 data:** User Details (Cint 1123080033, reset link), Extra/Meta (First name `anshul_athlete`), Panel Questions (Occupation group), Transactions (3 rows, QT + 2 Survey Closed), Consent (6 Yes rows), Messages (empty state). Confirm the Members list "View" now navigates (no modal).

- [ ] **Step 4: Screenshot** the User Details + Transactions tabs for the record.

---

### Task 5: Docs — PRODUCT.md + DESIGN.md

**Files:**
- Modify: `PRODUCT.md` (Panel Admin Console section)
- Modify: `DESIGN.md` (§8 admin)

- [ ] **Step 1: PRODUCT.md** — under the Panel Admin Console section, add a short paragraph: the Members "View" opens a full Edit Member page reproducing the legacy six-tab Edit User screen (User Details, Extra/Meta Data, Panel Questions, Transactions, Consent, Messages); the Award/Approve bar and all submits are mock; the backend team wires them via `memberDetail(id)` + the new `AdminProvider` actions.

- [ ] **Step 2: DESIGN.md §8** — add an "Edit Member layout" subsection: V1 = legacy 6-tab faithful re-skin (shared `Tabs`/`DataTable`/`Field`); Signal Yellow reserved for the Approve (points) action; V2 = single scannable page (identity header + pinned action row + collapsible sections), covered in Task 8.

- [ ] **Step 3: Commit + push main**

```bash
git add PRODUCT.md DESIGN.md
git commit -m "docs: Edit Member page in PRODUCT.md + DESIGN.md"
git push origin main
```

---

### Task 6: Switch to `admin-v2` and merge `main` forward

**Files:** none (branch/merge only)

- [ ] **Step 1: Ensure a clean tree**, then check out the branch:

```bash
git status --short   # expect empty
git checkout admin-v2
```

- [ ] **Step 2: Merge main forward** (brings the detail data layer + V1 — all additive):

```bash
git merge main -m "merge: bring member-detail data layer + V1 Edit Member into admin-v2"
```
Expected: clean merge (no V1 file conflicts — V2 only adds files). If any conflict appears in `adminMockData.ts`, keep both additions (the V2 branch never modified the appended detail block).

- [ ] **Step 3: Sanity check** `npx tsc --noEmit && npm test` on the branch.
Expected: clean; tests pass.

- [ ] **Step 4:** (no commit — merge already committed).

---

### Task 7: V2 single-scannable Edit Member page

**Files:**
- Create: `src/app/admin-lab/members/[id]/page.tsx`
- Create: `src/components/admin-lab/MemberProfile.tsx`

**Interfaces:**
- Consumes: `memberDetail`, `MemberDetail`, `MemberTransaction`, `TXN_TYPES`, `TXN_STATUSES`, `seed` from `@/lib/adminMockData`; `useAdmin`; `StatusPill`; `DataTable`+`Column`; `Select`/`TextField` from `@/components/admin/Field`.
- Produces: the route `/admin-lab/members/[id]` (statically exported).

- [ ] **Step 1: Server route with static params**

`src/app/admin-lab/members/[id]/page.tsx`:

```tsx
import { seed } from '@/lib/adminMockData';
import { MemberProfile } from '@/components/admin-lab/MemberProfile';

export function generateStaticParams() {
  return seed.members.map((m) => ({ id: String(m.id) }));
}

export default function LabEditMemberPage({ params }: { params: { id: string } }) {
  return <MemberProfile id={Number(params.id)} />;
}
```

- [ ] **Step 2: `MemberProfile.tsx` — identity header + pinned action row**

`'use client'`. `const d = useMemo(() => memberDetail(id), [id]);` plus editable `status`, `award`, `reason` state and `useAdmin` actions.
- **Sticky header** (`sticky top-0 z-10 bg-dteal text-white … rounded-b-2xl px-6 py-4`): initials avatar circle, `d.email` + `Member #{d.id}`, `<StatusPill status={status} />`; a facts row (`flex flex-wrap gap-x-6 gap-y-1 text-xs text-white/70`): `id · panel · Cint {d.cintId} · created {d.created} · wallet €{d.walletAmount.toFixed(2)} · {d.emailVerified ? 'Verified' : 'Unverified'}`.
- **Pinned action row** (below header, `flex flex-wrap items-end gap-3`): `Select` Status; `TextField` Award points (`award`); `TextField` Reason; Save button (`bg-signal text-ink`) → `saveMemberDetails(d.id,{status})` then `awardPoints` if `award`; `Login as` button (outline).

- [ ] **Step 3: Collapsible `Section` helper + section rail**

Local `function Section({ id, title, defaultOpen, children })` = a `<details open={defaultOpen}>` styled card (`rounded-2xl border border-bd bg-white`; `<summary>` = `cursor-pointer px-5 py-3 font-bold text-dteal`). On wide screens a left rail (`hidden xl:block`) of anchor links to `#account #questions #transactions #consent #messages`. Layout `grid xl:grid-cols-[180px_1fr] gap-6`.

- [ ] **Step 4: Sections content**

- **Account & meta** (`id="account"`, defaultOpen): a two-column form merging User Details editable fields + the 9 meta fields (reuse the same `TextField`/`Select` bindings as V1 Task 3–4; read-only facts shown as small labelled text).
- **Panel questions** (`id="questions"`): same grouped rendering as V1 Step 5.
- **Transactions** (`id="transactions"`): same `DataTable` as V1 Step 6.
- **Consent** (`id="consent"`): same table as V1 Step 7.
- **Messages** (`id="messages"`): textarea + Save (calls `sendMemberMessage`) + `DataTable` history (empty state).

- [ ] **Step 5: Typecheck + build**

Run: `npx tsc --noEmit && npm run build`
Expected: clean; `/admin-lab/members/[id]` statically rendered.

- [ ] **Step 6: Commit**

```bash
git add src/app/admin-lab/members src/components/admin-lab/MemberProfile.tsx
git commit -m "feat(admin-v2): single-page Edit Member profile"
```

---

### Task 8: Wire the V2 members list/drawer to the full profile

**Files:**
- Modify: the V2 members page and/or `DetailDrawer` under `src/app/admin-lab/members/` or `src/components/admin-lab/` (locate with grep — see Step 1)

- [ ] **Step 1: Locate the V2 members surface**

Run: `grep -rl "DetailDrawer\|focusMemberId" src/app/admin-lab src/components/admin-lab`
Identify the drawer/list that shows a focused member.

- [ ] **Step 2: Add an "Open full profile →" Link** into `/admin-lab/members/{id}` in the drawer's action area:

```tsx
<Link href={`/admin-lab/members/${member.id}`} className="text-sm font-semibold text-teal hover:underline">Open full profile →</Link>
```
(Use the drawer's actual member variable name.)

- [ ] **Step 3: Typecheck + build**

Run: `npx tsc --noEmit && npm run build`
Expected: clean.

- [ ] **Step 4: Commit + push branch**

```bash
git add -A
git commit -m "feat(admin-v2): link members drawer to full member profile"
git push origin admin-v2
```

---

### Task 9: Verify V2 + DESIGN.md V2 note

**Files:**
- Modify: `DESIGN.md` (§8 — confirm the V2 Edit Member subsection reflects the built page)

- [ ] **Step 1: Verify V2 via Playwright MCP** (branch `admin-v2`, dev server): seed `sessionStorage['mv_admin']='1'`, navigate `/admin-lab/members/34/`; confirm the sticky header, pinned action row, and all five sections render member-34 data; screenshot.

- [ ] **Step 2: Finalize DESIGN.md §8** V2 subsection if wording needs adjusting after the build; commit + push `admin-v2`.

```bash
git add DESIGN.md
git commit -m "docs: V2 Edit Member layout note in DESIGN.md"
git push origin admin-v2
```

- [ ] **Step 3: Return to `main`** so the working tree ends on the deployable branch:

```bash
git checkout main
```

---

## Self-Review

**Spec coverage:**
- Shared data layer (`MemberDetail`, `memberDetail`, enums, member-34 exact, deterministic others) → Task 1. ✓
- AdminProvider mock actions → Task 2. ✓
- V1 route + 6 tabs + Members View link → Task 3; verify → Task 4. ✓
- V2 branch merge → Task 6; V2 single page → Task 7; drawer link → Task 8; verify → Task 9. ✓
- Tests → Task 1. ✓ Docs → Task 5 (V1) + Task 9 (V2). ✓
- Static export `generateStaticParams` → Tasks 3 & 7. ✓
- Additive V2 (merge main forward, new files only) → Tasks 6–8. ✓

**Placeholder scan:** No TBD/TODO; each code step shows real code or exact field/column lists tied to the spec's verbatim member-34 data. UI tab steps reference concrete field lists rather than "add fields".

**Type consistency:** `memberDetail`, `MemberDetail`, `MemberTransaction`, `TXN_TYPES`, `TXN_STATUSES`, `CONSENT_NAMES` used identically across Tasks 1/3/7. AdminProvider action names (`saveMemberDetails`, `saveMemberMeta`, `awardPoints`, `sendMemberMessage`) defined in Task 2 and consumed in Tasks 3/7 match. `Column`/`DataTable`/`Tabs`/`StatusPill`/`Select`/`TextField` import paths match the real components read during design.
