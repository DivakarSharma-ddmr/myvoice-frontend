# MyVoice Admin V2 — "Operator Console" Design Spec

**Date:** 2026-07-31
**Status:** Approved-direction (the 6 changes were agreed during V1 brainstorming); this
spec elaborates them into concrete designs for build.
**Branch:** `admin-v2` (off `main`). **Route:** `/admin-lab`. **Deploys:** never on its
own — only `main` triggers the Pages Action, so this branch is safe to push.

---

## 1. Goal & Relationship to V1

V1 (`/admin`, on `main`) is a faithful re-skin of the legacy admin, being wired to the
backend. **V2 is the reimagining** — the same operations organized as an *operator console*
(what the admin needs to do) rather than a *database viewer* (what tables exist). V2 is where
we spend design capital; V1 is where the backend lands first.

## 2. Architecture — purely additive, merge-safe

The single binding rule: **V2 must not modify any V1 file.** It only adds files and *consumes*
the shared layer. This keeps `admin-v2` mergeable into `main` even after the dev team replaces
`adminMockData.ts` with real API calls — V2 inherits real data for free on merge.

```
src/
  app/admin-lab/               # NEW — V2 routes (mirror of admin, reimagined)
    layout.tsx                 # reuses AdminProvider (shared) + AdminLabShell
    page.tsx                   # Home = action hub
    members/page.tsx           # filter bar + detail drawer
    member-rewards/page.tsx    # true approval queue
    email-tool/page.tsx        # list
    email-tool/new/page.tsx    # 3-step wizard (static route, no [id] needed for V2)
    ... (remaining sections reuse V1 patterns, restyled by AdminLabShell)
  components/admin-lab/        # NEW — V2-only components
    AdminLabShell.tsx          # sidebar (labels+collapse) + scope bar + ⌘K trigger
    CommandPalette.tsx         # ⌘K: jump to member by id/email, or any section
    DetailDrawer.tsx           # right slide-in panel
    NeedsYouNow.tsx            # action-hub cards
    ApprovalQueue.tsx          # segmented queue
    CampaignWizard.tsx         # Audience → Content → Review & Send
    RowActions.tsx             # unified primary + overflow + destructive pattern
```

**Reused unchanged from V1** (`src/components/admin/*`, `src/lib/*`): `AdminProvider`,
`adminMockData.ts`, `adminStatus.ts`/`StatusPill`, `adminTable.ts`, `DataTable`,
`ConfirmDialog`, `Toast`, `Tabs`, `Field`, `StatusPill`, `PanelSwitcher`, `TwoPaneChat`.

**If V2 needs a new provider action**, add it **additively** to `AdminProvider` (a new method,
no signature changes) — additive changes merge cleanly. Prefer deriving state in-component to
avoid touching the provider at all.

**Auth:** `/admin-lab` reuses the same mock session flag (`sessionStorage['mv_admin']`) and
the existing `/admin/login`; `AdminLabShell`'s guard redirects there if unset.

**Switching V2 → primary later:** after merge, both `/admin` and `/admin-lab` exist. Making V2
primary is a one-line redirect (`/admin` → `/admin-lab`) or a route rename — no rebuild.

## 3. Register & tone

Same as V1 (product/utility, MyVoice tokens, Signal Yellow reserved for money/approve+save).
V2 is *denser and more opinionated* — quick filters, drawers, a command palette — but must not
drift into a different visual language. Same `tailwind.config.ts` tokens.

## 4. The Six Changes (concrete designs)

### 4.1 Home → action hub (`NeedsYouNow`)
Lead with **what needs the operator now**, derived live from mock data — no vanity metric on top:
- **Pending payouts** — count of `memberRewards` with status `pending` + their €total → click to the queue.
- **On hold** — count of `onhold` rewards → queue filtered to On Hold.
- **Unread support** — threads whose last message is `from: 'member'` → Message Center.
- **Draft campaigns** — campaigns with status `draft` (0 in seed; shows healthy empty state).
Each is a card with a number, a one-line "what to do", and a deep link. **Below** (demoted):
the this-month completion tiles + the recruitment table from V1's dashboard.

### 4.2 Member's Rewards → true approval queue (`ApprovalQueue`)
- **Segmented status filter** as a top control: `Pending · On Hold · Approved · Rejected` (counts on each), replacing the buried header dropdown. Default = Pending.
- **Stakes-stating bulk confirm** (reuse `ConfirmDialog`): "Approve N payouts · €X".
- **Inline member context** per row: the member's **other redemptions** count (join `memberRewards` by `memberId`) and their account **status** (lookup in `members`) — so the operator judges without leaving. A member with many prior rejects reads as higher-risk.
- Layout: dense rows with the context inline; bulk-select + per-row approve/reject/hold via `RowActions`.

### 4.3 Members → filter bar + detail drawer (`DetailDrawer`)
- **Filter bar above the table** (not header inputs): a search box + **quick-filter chips** (status: All/Active/Sleeping/Unsubscribed; a country select) + **density toggle**.
- Sticky-header table (reuse `DataTable` but drive filters from the bar via its rows prop; V2 pre-filters `rows` and hides per-column filters).
- **Row click → right slide-in `DetailDrawer`**: member fields, their recent redemptions (from `memberRewards`), and **ranked actions** — View (default), *Login as* (confirm), *Delete* (destructive, confirm) — clearly separated, not three crammed buttons.

### 4.4 Unified action + status system (`RowActions`)
One convention used everywhere in V2: **primary action visible, secondary in an overflow menu, destructive always confirmed.** `RowActions` wraps `ActionMenu` + `ConfirmDialog` so no section re-implements it. `StatusPill` (already colorblind-safe) is the only status renderer.

### 4.5 Email Tool → 3-step wizard (`CampaignWizard`)
Replace the long form with **Audience → Content → Review & Send** steps + a stepper header:
- **Audience:** panel multi-select with a **live recipient count** (sum of selected panel counts), language.
- **Content:** subject + `RichTextEditor`.
- **Review & Send:** summary + a **mandatory "Send test" gate** (Start stays disabled until a test is sent), then Start Campaign. Stats shown as **rate cards** — Open %, Click %, Unsub % (computed from the seeded stats), not raw counts.
The V2 list stays a table (reuse `DataTable`) with an "Open in wizard" action → `/admin-lab/email-tool/new`.

### 4.6 Global scaffolding (`AdminLabShell` + `CommandPalette`)
- **Sidebar** with icon+label and collapse (as V1) but restyled; persistent **scope bar** showing current panel (reuse `PanelSwitcher`).
- **Command palette (⌘K / Ctrl+K)**: a modal that (a) filters the 12 sections and navigates, and (b) matches a member by **id or email** (from `members`) and opens their detail drawer / member page. Keyboard-first (arrow keys + Enter, Esc to close). This is the single biggest operator speed win.

### 4.7 Polish (in-scope if time)
- Message Center: **canned-reply picker** (a few multilingual templates) inserted into the composer + a **member-context strip** beside the chat (status, recent redemptions). Built as an additive wrapper over `TwoPaneChat` or a V2 variant — no edit to the V1 component.
- Signal Yellow strictly on money/approve+save.

## 5. Scope boundaries (V2)
- **In:** the 6 changes above for **Home, Member's Rewards, Members, Email Tool**, the shared `AdminLabShell` + command palette across **all** `/admin-lab` sections, and the unified action/status pass.
- **Reused as-is (restyled by the shell only):** Access Control, Manage Rewards, Payment Email, Panel Settings, Account, Report, Recruitment, Message Center — V2 renders them with the same V1 page bodies under `AdminLabShell` (no reimagining this round unless time allows), so `/admin-lab` is complete and navigable.
- **Out:** real backend, real auth, persistence, dark mode.

## 6. Out-of-scope / non-goals
No modification of any `/admin/*` (V1) file, no changes to `adminMockData.ts` or existing
`AdminProvider` method signatures, no new npm dependencies.
