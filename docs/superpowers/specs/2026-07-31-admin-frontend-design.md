# MyVoice Admin (Panel Admin) Frontend — Design Spec

**Date:** 2026-07-31
**Status:** Approved for implementation (V1); V2 captured as roadmap
**Surface:** Panel-admin console for MyVoice (DataDiggers) — a *third* first-class surface
alongside the public site (`(site)/*`) and member platform (`member/*`).

---

## 1. Overview & Goals

The MyVoice panel admin is the internal operational tool panel administrators use to run a
country panel: approve reward payouts, manage members, edit reward catalogues and settings,
run email campaigns, generate reports, manage recruitment sources, and answer support chat.
The legacy admin is a Metronic-themed "database viewer" — dense tables, per-column header
filters, tiny `Actions ▾` dropdowns, `page 1 of 8770`, page-wide horizontal scrollbars.

We are building **two versions**:

- **Version 1 (`/admin`) — build now.** A faithful re-skin of the legacy admin: identical
  information architecture, columns, actions and flows, so the dev team can wire the real
  backend with a **1:1 data mapping** and nothing needs re-thinking. This unblocks going live.
- **Version 2 (`/admin-lab`) — build later, at the owner's pace.** The "operator console"
  reimagining (see §11). Shares V1's mock-data layer and design tokens; a pure UX/layout
  redesign that never disturbs V1.

This spec covers **V1 in full** and **V2 as a roadmap** (not a detailed spec — V2 requirements
will be shaped when that track starts).

### Non-goals (V1)

- No real backend, auth, or data mutation persistence. Static export, mock data, in-memory
  session state (resets on reload) — same model as the member platform.
- No re-architecture of the legacy IA beyond the explicitly-requested merges (§8).
- No dark mode (light only for V1).
- No new sections beyond the 12 documented here.

---

## 2. Two-Version Strategy & Repo Structure

Both versions live in the existing `myvoice-frontend` repo and deploy to the same GitHub Pages
site (admin routes are **unlinked** from the public site and member area).

```
src/
  app/
    admin/            # V1 — build now
      login/page.tsx        # mock login gate
      layout.tsx            # AdminProvider + AdminShell
      page.tsx              # Home (dashboard)
      access-control/page.tsx
      members/page.tsx
      member-rewards/page.tsx
      manage-rewards/page.tsx
      payment-email/page.tsx
      panel-settings/page.tsx      # tabs: Settings (+Rewards Info) | Email Templates
      account/page.tsx             # tabs: Personal Info | Change Picture | Change Password
      email-tool/page.tsx          # campaign list
      email-tool/[id]/page.tsx     # campaign builder (Basic | Template | Statistics)
      report/page.tsx
      recruitment/page.tsx         # tabs: Recruitment Source | Recruitment Report
      messages/page.tsx            # MyVoice Message Center
    admin-lab/        # V2 — later (route reserved, not built now)
  components/
    admin/            # AdminShell, AdminProvider, DataTable, StatusPill, ActionMenu, ...
  lib/
    adminMockData.ts  # the swap-for-API file (mirrors mockData.ts)
```

- **Data flows through `src/lib/adminMockData.ts`** exactly like the member platform's
  `mockData.ts`. Backend wiring = replace that layer with API calls.
- **`AdminProvider`** (mirrors `MemberProvider`) holds in-memory admin state and exposes the
  mutation actions. Actions update state for the session and reset on reload.
- V2 reuses `adminMockData.ts` + Tailwind tokens; it is a separate route tree, so V1 going
  live (and being wired to the backend) never blocks or breaks V2.

**V2 route name:** `/admin-lab` (changeable to `/admin-next` or `/admin-v2` if preferred).

---

## 3. Register & Design Language

Admin is a **product / utility** surface — function over warmth. It is **not** the "Trusted
Neighbor" marketing tone. It uses the same design tokens (`tailwind.config.ts`) but at higher
density than the member app.

- **Palette:** existing tokens — `teal #336666` (primary chrome/nav), `dteal #1F4F4F`
  (headers/active), `cream/sand/canvas` backgrounds, `ink` text, `mute/soft` secondary text.
  **Signal Yellow `#FFCC33` is reserved for primary/positive money actions** (Approve, Save
  Changes) so "yellow = value" stays meaningful; it must stay ≤10% of any screen.
- **Status colors (colorblind-safe — icon + color, never color alone):** see §7. Fixes the
  legacy bug where *Active* and *Unsubscribed* were both blue.
- **Type:** Plus Jakarta Sans (headings/`font-sans`), Inter (dense UI/body/`font-body`).
- **Density:** tighter spacing than member; comfortable-but-compact table rows; a table
  **density toggle** (comfortable / compact).
- **Shadows:** teal-tinted only (`shadow-soft/card`), consistent with DESIGN.md.
- **Responsive:** works down to **tablet (768px)**; the reward queue and Message Center remain
  usable on tablet. Full phone optimization is not a V1 requirement (admins are desktop-first).

---

## 4. Global Shell (`AdminShell`)

Shared chrome around every admin page.

- **Left sidebar:** icon **+ label**, collapsible to icons-with-tooltips (legacy icons-only
  state is cryptic). Active item highlighted (yellow accent, matching the legacy active state).
  Nav order per §8.
- **Top bar:**
  - **Panel switcher** — `Romania Panel ▾`, a **searchable** dropdown over 30+ country panels.
    A persistent context indicator shows current scope (a panel, or *Global*). Switching panel
    updates the visible data (mock).
  - **Admin user menu** — avatar + name (`Divakar`), dropdown → Account, Logout (returns to
    `/admin/login`).
- **Page header block:** title + breadcrumb matching the legacy pattern (`Home • Members`).
- **Content container:** max-width, page padding; tables get a contained horizontal-scroll
  region instead of a page-wide scrollbar.

### Mock login gate (`/admin/login`)

Styled admin login (email + password + submit) using MyVoice branding. **Any credentials pass**
(static site). It sets the frame and matches the real product. On submit → `/admin` (Home).
Admin routes are never linked from the public site or member area. A client-side guard redirects
to `/admin/login` if a mock "session" flag isn't set (cosmetic only).

---

## 5. Shared Components (`src/components/admin/*`)

Most of the admin is a handful of reused primitives. Building these well is the bulk of the work.

| Component | Purpose |
|-----------|---------|
| `AdminShell` | Sidebar + top bar + page header + content container |
| `AdminProvider` | In-memory state + mutation actions; current panel context |
| `PanelSwitcher` | Searchable 30+ panel dropdown with scope indicator |
| `DataTable` | Sortable columns, per-column filter inputs (kept for 1:1 mapping), sticky header, contained horizontal scroll, pagination footer (`Page X of Y · View N`), density toggle, row selection (checkbox) where needed, empty & loading states |
| `StatusPill` | Consistent status token set (§7) — icon + label + color |
| `ActionMenu` | The `Actions ▾` row dropdown (Edit / Mark Inactive / etc.), plus standalone row buttons (View / Login / Delete) where the legacy uses them |
| `Tabs` | Section-level tabs (Panel Settings, Account, Recruitment, Email Tool builder) |
| Form controls | `TextField`, `TextArea`, `Select`, `Toggle` (gender), `DatePicker`, `FileUpload` (logo/avatar), styled consistently |
| `RichTextEditor` | Email/content editor (toolbar) with **tag chips** (`%%first_name%%`) and a Preview action. Used by Panel Settings → Email Templates and Email Tool → Template, and Panel Settings → Rewards Info |
| `TwoPaneChat` | Message Center: recent-threads list + conversation pane + composer |
| `StatTile` | Home dashboard metric tiles |
| `ConfirmDialog` | Confirmation for sensitive/bulk/destructive actions (approve payouts, delete, login-as, mark inactive) |
| `Toast` | Feedback after mock actions ("12 payouts approved", "Settings saved") |

Reuse existing `src/components/ui/*` (`Button`, `Card`, `Accordion`) where they fit; add
admin-specific primitives rather than overloading member components.

---

## 6. Data & Interactivity Model

- **`src/lib/adminMockData.ts`** — realistic seed data:
  - `panels`: 30+ country panels with member counts (drives the switcher and Email Tool
    audience selector), e.g. `Albania (211)`, `Algeria (2103)`, … `Romania`.
  - `adminUsers` (Access Control), `members` (~120 rows, Romanian names/emails, statuses),
    `memberRewards` (redemption queue), `rewardCatalogue` (Manage Rewards), `emailTemplates`
    (the transaction template list), `campaigns` (Email Tool) + per-campaign stats, `reports`
    (generated reports list), `recruitmentSources`, `messageThreads` (support chat),
    `panelSettings`, `paymentEmailSettings`, `adminProfile`, and `dashboardStats`.
  - Table totals are believable (e.g. "Found total 6,144 records") even though only a page of
    seed rows exists — pagination is faked over the seed set.
- **`AdminProvider`** exposes actions that mutate in-memory state for the session:
  - Member's Rewards: set row status, **bulk Approve/Reject** → `ConfirmDialog` stating stakes
    (count + total €) → `Toast`.
  - Members: mark status, delete (confirm), "Login as" (confirm; cosmetic).
  - Access Control: add user, edit, mark inactive.
  - Manage Rewards: add/edit reward, toggle active.
  - Panel Settings / Payment Email / Account: edit forms → save → toast.
  - Email Tool: create/edit campaign, test send, start (mock) → status becomes `complete`.
  - Recruitment: add source, mark inactive, edit.
  - Messages: send a reply (appended to thread).
- All mutations reset on reload (documented, expected for a prototype).

---

## 7. Status Token Set (colorblind-safe)

One map, reused everywhere via `StatusPill` (icon + color + label):

| Status | Where | Treatment |
|--------|-------|-----------|
| Active | members, users, rewards, sources | green, check icon |
| Inactive | members, users, rewards, sources | slate/mute, dash icon |
| Sleeping | members | amber, moon icon |
| Unsubscribed | members, users | soft teal, bell-off icon (distinct from Active) |
| Pending | member rewards | amber, clock icon |
| On Hold | member rewards | gold, pause icon |
| Approved | member rewards | green, check icon |
| Rejected | member rewards | danger, x icon |
| Complete | campaigns, reports | teal, check icon |

---

## 8. Navigation (12 items, post-merge)

Order preserved from the legacy sidebar, with the owner-requested consolidations:

1. **Home** (dashboard)
2. **Access Control**
3. **Members**
4. **Member's Rewards**
5. **Manage Rewards**
6. **Payment Email Settings**
7. **Panel Settings** — Tab 1 **Settings (+ Rewards Info merged in)**, Tab 2 **Email Templates**
   (the legacy *Transaction Email Templates* editor, moved here)
8. **Account**
9. **Email Tool**
10. **Report**
11. **Recruitment**
12. **MyVoice Message Center** (route `messages`)

**Dropped per instruction:** *Panel Communication* as a standalone nav item (only its
Transaction Email Templates survives → Panel Settings Tab 2); the struck-off Panel Settings
tabs (Privacy policy, Cookie policy, Terms & conditions, FAQ, About Us Info, Contact Us Info,
Why Sign Up, Campaigns); the struck-off Panel Communication tabs (Dashboard Header, Dashboard
Footer, Page Header, Panel Bonus Rewards).

---

## 9. Section-by-Section (V1)

Each section is a faithful re-skin: same columns, filters, actions, and flows as the legacy
screenshots; new theme/layout only.

### 9.1 Home (dashboard)
- Four stat tiles: **Pending Rewards**, **Cint Surveys Completed This Month**, **MyVoice
  Surveys Completed This Month**, **Survey Complete from Email Invite This Month**.
- **Recruitment Source** weekly table: Source, Hits, Registered, Verified, Conversion
  (with `Global | <panel>` scope note + start/end date filter + Submit/Clear).
- **Rewards** recent list (Date, Value, Status) with "View All".
- **Feed** panel (event feed; may be empty state).

### 9.2 Access Control
- Table: Panelist Id, First Name, Last Name, Email, **Status** (Active / Inactive /
  Unsubscribed), **Actions** (`Actions ▾` → Edit, Mark Inactive).
- **Add User** button (opens form: name, email, status).

### 9.3 Members
- Paginated `DataTable`: Id, Email, Gender, Birth Year, Postal Code, **Status** (Active /
  Sleeping / Unsubscribed), Country, **Actions** (View), **Login** (login-as, confirm),
  **Delete** (confirm).
- Per-column filter inputs (Id, Email) + Status select + Country select; Reset.
- Pagination footer with total-records count (e.g. 87,696). View-size selector.

### 9.4 Member's Rewards (redemption queue)
- `DataTable` with **row selection**: checkbox, Reward, Member Id, Email, **Value (€)**,
  **Status** (Pending / Approved / Rejected / On Hold — inline select), Date, Country,
  **Actions** (`Actions ▾`).
- **Approve Selected / Reject Selected** bulk actions → `ConfirmDialog` stating stakes
  (count + total €) → `Toast`. Reset.
- Sortable columns + per-column filters (reward, member id, email, value, status, country).

### 9.5 Manage Rewards (catalogue)
- Table: Name, Value, Description, **Status** (Active / Inactive), **Actions** (`Actions ▾`).
- **Add new +** (form: name, value, description, status).

### 9.6 Payment Email Settings
- Simple form: **Email**, **Additional Email**. Reset / Save. (Legacy title: "Payment Manager
  Email Settings".)

### 9.7 Panel Settings (2 tabs)
- **Tab 1 — Settings (+ Rewards Info merged):**
  - Settings fields: Panel Name, Panel Alias, Contact Email, Referral Reward, Postal Code Note,
    Panel Languages (list), Cint Panel Currency, MyVoice Panel Currency, **Logo** (upload).
  - Rewards Info fields (merged into this tab as a grouped section): **Rewards Availability**,
    **Minimum Redemption Threshold**, **Rewards Info** (rich text). Save Changes / Cancel.
- **Tab 2 — Email Templates:** the legacy *Transaction Email Templates* editor —
  - Left list of templates (Rewards Redemption Email [Admin], Member Feedback Email [Admin],
    Password Reset, Signup Confirmation, Refer Friend Invitation, Password Update, Signup
    Welcome, Invitation to MyVoice, Refer Friend Reminder, Account Deleted, Suspicious Activity,
    Mark Fraud Panelist to Inactive, Inactive by Correction Points Alert, First/Second Profile
    Question Reminder).
  - Right: language selector, Subject field, `RichTextEditor` with **tag chips**
    (`%%panelist_id%%`, `%%first_name%%`, `%%email%%`, `%%paypal_email%%`, `%%PANEL_NAME%%`) +
    **Preview Template**. Save Changes.

### 9.8 Account (3 tabs)
- **Personal Info:** First Name, Last Name, Mobile Number, **Gender** (Male/Female toggle),
  Date of Birth (date picker), Address, **Postal Code***. Save Changes / Cancel.
- **Change Picture:** avatar upload/preview.
- **Change Password:** current, new, confirm.

### 9.9 Email Tool
- **Campaign list** `DataTable`: Campaign-ID, Campaign-Subject, Created, Sent, **Status**
  (complete), **Action** (View), **Delete**. Sortable + filters. **Add Campaign**.
- **Campaign builder** (`email-tool/[id]`), tabs:
  - **Basic Settings:** Campaign Name, Campaign Subject, Select Language, **Select panel**
    (multi-select list with per-panel member counts + running Total Member Count), To Email
    Address, From Email address (select), From email name.
  - **Template:** `RichTextEditor`.
  - **Statistics:** cards — Campaign ID, Subject Name, Recipients, Opens, Clicks, Unsubscribes;
    Refresh, Export Statistics.
  - Actions: Test Campaign / Save / Start Campaign (mock) / Back to list.

### 9.10 Report
- **Generate Report** panel: Panels (select), **Options** (Panel Report / Panel Statistics /
  Recruitment Statistics / Panel Health), Columns (multi-select chips), Selected column, Start
  Date. Generate / Reset.
- **Generated reports** `DataTable`: Name, **Status** (Complete), Created At, **Download**.
  Filters + pagination.

### 9.11 Recruitment (2 tabs)
- **Recruitment Source:** Name + **Add**. Table: Name, **Status** (Active / Inactive),
  **Trigger pixel at** (SOI (Registration) / DOI (Email Verification)), **Action** (`Actions ▾`
  → Mark as Inactive, Edit). Pagination.
- **Recruitment Report:** report view (mirrors the Home recruitment table at panel scope).

### 9.12 MyVoice Message Center (`messages`)
- `TwoPaneChat`: left **Recent** threads list (avatar, member name + panel, last message
  preview, date, search); right **conversation** (member header: name + panel, Panelist ID +
  Email; message bubbles admin/member; composer with attach + send). Sending appends to thread
  (mock).

---

## 10. Accessibility & Responsive

- Target **WCAG 2.2 AA**: ≥4.5:1 body contrast, visible `:focus-visible`, keyboard-navigable
  tables/menus/dialogs, `prefers-reduced-motion` respected.
- Status never conveyed by color alone (icon + label).
- Responsive to tablet (768px); tables scroll within a contained region; reward queue and
  Message Center usable on tablet.

---

## 11. Version 2 Roadmap (deferred — not built now)

V2 (`/admin-lab`) is the "operator console" reimagining. Captured here so it isn't lost; it
will get its own spec when that track starts. Scope = the six changes already agreed:

1. **Home → action hub** — lead with "needs you now" (pending payouts count + €, fraud/
   correction-point flags, unread support threads, campaign status); demote vanity metrics.
2. **Member's Rewards → true approval queue** — segmented status filter, stakes-stating bulk
   confirm, inline member context (account age, prior redemptions).
3. **Members → filter bar + detail drawer** — search/quick-filter bar (not header inputs),
   sticky header, density toggle, row → right-side detail drawer with ranked actions.
4. **One consistent action + status system** — primary visible / secondary in overflow /
   destructive confirmed; single colorblind-safe status set (already introduced in V1 §7).
5. **Email Tool → 3-step flow** — Audience → Content → Review & Send, live recipient count,
   mandatory Test send, stats as rate cards (Open % / Click % / Unsub %); template editors
   with side-by-side live preview + tag chips.
6. **Global scaffolding** — searchable panel switcher + persistent scope bar, **command
   palette (⌘K)** (jump to member by Id/email or any section), sidebar labels w/ collapse.

Plus agreed polish: canned multilingual replies + member-context panel in Message Center;
Signal Yellow strictly for money/approve actions; tablet-usable queue + chat.

The two more ambitious pieces (command palette, member detail drawer) are included in V2 scope.

---

## 12. Open Questions

None blocking. Default assumptions in effect: V2 route = `/admin-lab`; light mode only for V1;
tablet (not full phone) as the smallest V1 target.
