# Admin — Edit Member page (V1 faithful + V2 single-page)

**Date:** 2026-08-20
**Surface:** Panel Admin Console (internal, product/utility register)
**Status:** Design approved (build V1 + V2 both)

## Goal

On the admin **Members** list, clicking **View** on a row must open a full
**Edit Member** page (legacy route `/manager/panelists/view/{id}`), reproducing the
six-tab "Edit User" screen from the legacy Metronic admin. Build it twice:

- **V1** (`/admin`, branch `main`) — a **faithful 1:1 re-skin** so the dev team can
  wire the backend to the exact same fields/tabs.
- **V2** (`/admin-lab`, branch `admin-v2`) — a **lighter/sleeker single scannable
  page** (no tab-hopping) for the future operator console.

Both read from the same mock-data layer so wiring the backend means swapping
`adminMockData.ts` + the `AdminProvider` action bodies, not rebuilding UI.

## Decisions (confirmed with user)

- Scope: **build V1 + V2 both** this session.
- V1 fidelity: **faithful 1:1 re-skin** — every tab, every field, the Award/Approve
  bar and Wallet header, cleanly restyled in the design system, **mock actions**.
- V2 direction: **single scannable page** — compact identity header + pinned action
  row + progressively-disclosed collapsible sections.

## Constraints / non-negotiables

- **Static export**: any `[id]` route MUST export `generateStaticParams()` over the
  seeded member ids (precedent: `email-tool/[id]`).
- **Hydration-safe mock data**: no `new Date()` / randomness at module scope. All
  timestamps are fixed string literals; generated detail is deterministic from `id`.
- **Register**: product/utility, denser than the member area. Signal Yellow `#FFCC33`
  reserved for money/approve/save actions only; nav-active stays `lteal/dteal`.
- **Additive V2**: no V1 file is modified from the `admin-v2` branch except by merging
  `main` forward. V2 only *consumes* the shared data layer + shared primitives.
- Mutations are in-memory (reset on reload); real auth, roles, server-side pagination
  and real side-effects remain the backend team's job.

## Shared data layer — `src/lib/adminMockData.ts`

Add a richer per-member detail shape and a lookup. The existing `Member` (6 fields)
is unchanged; `MemberDetail` is a superset returned only on the detail page.

```ts
export type PanelQuestionGroup = { group: string; items: { question: string; answer: string }[] };
export type MemberTransaction = {
  id: string; created: string; type: string; amount: number;
  status: string; projectNo: string; surveyNo: string; token: string; clickDraw: string;
};
export type MemberConsent = { name: string; option: 'Yes' | 'No'; collected: string };
export type MemberMessage = { created: string; message: string; status: string };

export type MemberDetail = Member & {
  panel: string;            // legacy "Panel" (e.g. "1")
  cintId: string;
  created: string; lastSent: string; lastAnswered: string;
  lastUpdated: string; lastAction: string;
  walletAmount: number; recruitmentSource: string;
  emailVerified: boolean; resetPasswordLink: string;
  memberIdField: string;    // legacy editable "Member Id" (often "0")
  mobile: string; daysBetweenMailouts: string;
  // meta
  firstName: string; lastName: string; username: string; ssn: string;
  bankClearing: string; bankAccount: string; streetAddress: string;
  secondaryEmail: string; paypalEmail: string; metaUpdatedOn: string;
  panelQuestions: PanelQuestionGroup[];
  transactions: MemberTransaction[];
  consents: MemberConsent[];
  messages: MemberMessage[];
};

export function memberDetail(id: number): MemberDetail;   // exact for 34, deterministic otherwise
```

Also export enum option lists used by the Transactions filters:

```ts
export const TXN_TYPES = ['Correct Points','Redemption','Points From Survey','Bonus Rewards','Cint Survey','Profile Completion Reward','MyVoice Survey'];
export const TXN_STATUSES = ['Survey Started','Completed','Screenout from Survey','Quota Full','Quality Terminate','Survey Closed','Client Dropout'];
```

### Member 34 — exact reproduction (from screenshots)

- **User Details (read-only):** Id 34 · Panel 1 · Cint ID 1123080033 · Created
  `2019-01-23 00:00:00` · Last sent `N/A` · Last answered / Last updated / Last Action
  `2026-06-15 14:29:13` · Wallet €0.00 · Recruitment source `` · Email Verification Yes
  · Reset Password Link `https://www.myvoice-surveys.com/password_reset/ahlUlWgJqZbuWj24QPxWuQP1bye5IlVlWZLF8yOF`
- **User Details (editable):** Status Active · Member Id `0` · Email
  `bhartianshul916@gmail.com` · Mobile `` · Gender Male · Year of birth 1997 ·
  Postal Code 201001 · Days between mailouts ``
- **Extra/Meta:** First name `anshul_athlete`, all other meta fields empty, Updated on ``
- **Panel Questions:** `Household` → "How many people live in the household?" =
  `* Prefer not to say`; `Occupation` → the 15 rows in the screenshot (Occupation =
  Full-time work, India - What is your occupation = Skilled Worked, industry = Computer
  Software, employees = 101-250, … primary role = Systems analyst). Plus two extra
  plausible groups (`Auto`, `Technology`) to show the grouped layout — clearly mock.
- **Transactions (3):**
  `2019-10-15 08:27:59` MyVoice Survey €0.00 **QT** 8072 664 - - ·
  `2019-10-15 08:01:20` MyVoice Survey €0.00 **Survey Closed** 8072 646 - - ·
  `2019-09-02 13:16:32` MyVoice Survey €0.00 **Survey Closed** 7376 422 - -
- **Consent (6, all Yes @ `2026-06-15 14:29:13`):** Take surveys · Terms and Conditions
  · Connect Cookie Tracking · Mobile Advertising · Third party Cookie · Share Profile
- **Messages:** none ("No data available in table").

### Other members — deterministic generation

Derive every field from `id` (modulo tables, like `buildMembers`). ~2–4 transactions,
the same 6 consents, 2–3 panel-question groups, empty or 1–2 messages. No randomness,
no `Date()`.

## AdminProvider actions (new, mock)

```ts
saveMemberDetails(id: number, patch: Partial<MemberDetail>): void;  // toast, updates matching list row status/email/gender/etc.
saveMemberMeta(id: number, patch: Partial<MemberDetail>): void;     // toast
awardPoints(id: number, points: number, reason: string): void;     // toast "Awarded N points…"
sendMemberMessage(id: number, text: string): void;                 // toast, appends to detail messages (session only)
```

Detail state is held per-page (from `memberDetail(id)`), not in the global seed, to
avoid bloating `AdminProvider`; the actions only toast + optionally sync the summary
row already in `data.members`. `setMemberStatus`/`deleteMember` already exist and are
reused.

## V1 — `/admin/members/[id]`

- `src/app/admin/members/[id]/page.tsx` — server component:
  ```ts
  export function generateStaticParams() {
    return seed.members.map((m) => ({ id: String(m.id) }));
  }
  ```
  renders client `<MemberEditor id={Number(params.id)} />`.
- `src/app/admin/members/[id]/MemberEditor.tsx` — client:
  - **Identity strip**: `‹ Back to members` link, `Member #{id}`, email, `StatusPill`.
  - **Award bar**: `Wallet Amount: €X.XX` · Award Point input · Reason input · **Approve**
    button (yellow — money action). Approve calls `awardPoints`.
  - **`Tabs`** (existing component) with 6 tabs:
    1. **User Details** — 2-col grid: left `<dl>` of read-only facts; right column of
       editable `Field`s (Status `Select`, Member Id, Email, Mobile, Gender `Select`,
       Year of birth, Postal Code, Days between mailouts) + **Submit** → `saveMemberDetails`.
    2. **Extra/Meta Data** — 9 `TextField`s + "Updated on" + **Submit** → `saveMemberMeta`.
    3. **Panel Questions** — read-only grouped cards (grey group header, `question` left,
       `* answer` right), from `panelQuestions`.
    4. **Transactions** — `DataTable` columns Created · Transaction Type · Amount · Status
       · Project No. · Survey No. · Token · Click Draw · Action(edit icon); filters:
       Type `select` (TXN_TYPES), Status `select` (TXN_STATUSES), Project/Survey/ClickDraw
       `text`. Amount rendered `€0.00`.
    5. **Consent** — 3-col table (Consent Name · Member Option · Collected).
    6. **Messages** — textarea + **Submit**/**Reset** (`sendMemberMessage`) + history
       `DataTable` (Created · Message · Status), empty-state "No data available in table".
- **Members list** (`members/page.tsx`): replace the View **button+modal** with
  `<Link href={\`/admin/members/${r.id}\`} …>View</Link>`. Remove the `view` state and its
  `ConfirmDialog`. Login and Delete dialogs unchanged. AdminShell already treats
  `/admin/members/*` as the Members section (prefix match).

## V2 — `/admin-lab/members/[id]` (branch `admin-v2`)

Merge `main` into `admin-v2` first (brings the detail data layer + V1 — all additive),
then add V2-only files:

- `src/app/admin-lab/members/[id]/page.tsx` — same `generateStaticParams` pattern →
  client `<MemberProfile id=… />`.
- `src/components/admin-lab/MemberProfile.tsx` — **one scroll, no tabs**:
  - **Sticky identity header**: avatar (initials), name/email, `StatusPill`, key facts
    inline (id · panel · Cint · created · wallet · email-verified). Pinned **action row**:
    Status `Select`, Award points (points+reason inline), **Save**, **Login as** — always
    visible while scrolling.
  - **Collapsible section cards** (first open): **Account & meta** (User Details + Extra/
    Meta merged into one form), **Panel questions**, **Transactions**, **Consent**,
    **Messages**. Slim in-page **section rail** (anchor links) on wide viewports.
  - Dark-teal "LAB" chrome (matches `AdminLabShell`). Signal Yellow only on Save/Award.
- Wire the V2 members `DetailDrawer` (and/or command-palette member-jump) with an
  **"Open full profile →"** link into this route.

## Tests

`tests/adminMemberDetail.test.mjs` (`node --test`, imports `adminMockData.ts` directly):

- `memberDetail(34)` returns the exact screenshot fields (cintId, firstName, 3 txns,
  6 consents, panel-question answers, empty messages).
- Every seeded member id resolves to a `MemberDetail` with all required arrays present.
- Determinism: two calls for the same id are deep-equal.

## Delivery

- **V1** → commit + push `main` (auto-deploys to GitHub Pages `/admin`). Verify with the
  headless-Chrome recipe / Playwright as needed.
- **V2** → commit + push `admin-v2` (does **not** deploy). Verify locally with Playwright
  MCP (seed `sessionStorage['mv_admin']='1'`, navigate, screenshot).
- Docs: PRODUCT.md ("Panel Admin Console" gets a member-detail note), DESIGN.md §8
  (Edit Member layout, V1 tabs vs V2 single-page).

## Out of scope

- Real auth/roles, server-side pagination for the 87k-row member table, real email/
  message transport, real reset-password issuance, real point/wallet ledger.
- Bulk edit, member merge, audit log — not in the legacy screen, not added.
