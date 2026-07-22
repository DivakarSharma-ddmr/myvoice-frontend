# Help Center, Settings, Community + gamification rules layer

Date: 2026-07-22
Status: approved design, ready for implementation planning

## Summary

Three member pages gain real content pulled from the source legal and FAQ
documents: the Help Center gets keyword search and a browsable FAQ, Settings gets
a full account-details form and links to the four legal documents, and Community
gets a Click Draw explainer, a compact tips row and a winners archive.

Underneath, a new canonical gamification module encodes the levels, XP sources,
badges and quest pools from `Level, XP, Badges, Quests rules.md`, and every piece
of copy in the app that describes Click Draw tickets is corrected to match the
signed raffle regulation.

Out of scope, deferred to its own spec: redesigning the dashboard, profile,
surveys and rewards UI to fully express the new gamification model (27-badge
gallery, rotating quest slots, streak-shield indicator, level-perk display).

## Source documents

Six documents in the working folder are the content source of truth:

| File | Feeds |
| :--- | :--- |
| `Member FAQs.md` | Help Center FAQ + search index |
| `Privacy Policy.md` | `/legal/privacy` |
| `Cookie Policy.md` | `/legal/cookies` |
| `Terms and Conditions.md` | `/legal/terms` |
| `Click Draw T&C.md` | `/legal/click-draw` + draw explainer |
| `Level, XP, Badges, Quests rules.md` | `src/lib/gamification.ts` |

## Decisions taken

1. FAQ presentation: compact launcher card plus a full-width reading panel, not a
   nested accordion. The longest category holds 12 questions and several answers
   exceed 400 words; a narrow inline accordion cannot carry them.
2. Legal documents: dedicated routes, not modals. Legal text must be linkable,
   printable and searchable with the browser's own find.
3. Click Draw entries follow the signed regulation — one entry per survey ending
   in Screenout, Quota Full or Survey Closed — plus the level-perk monthly bonus
   from the new rules document. The regulation needs amending; see Open items.
4. Winners are published with full names and country. Section 8 of the regulation
   secures consent for public announcement of winner identity.
5. Year of birth, gender and country are read-only. They drive survey targeting,
   so member-side editing invites quota gaming and corrupts historical data.
6. PayPal email is editable but the UI states that a confirmation link is sent to
   the new address before payouts move.

## 1. Content pipeline

The source documents live outside the git repository, so CI cannot read them.
Copy all six into `content/source/` inside the repo, and add
`scripts/build-content.mjs` which parses them into typed modules under
`src/content/`.

Generated output is committed. The script runs on demand via `npm run content`,
not as part of `npm run build` — a parser failure should never break a deploy.

### Parsers

`Member FAQs.md` is a three-column markdown table. Each row becomes
`{ id, category, question, answer, links }`. Inline markdown links are extracted
to a `links` array so the renderer can emit real anchors rather than raw markdown.
Bare email addresses become `mailto:` links. Output preserves source order, which
determines category order.

The four legal documents share one output shape:

```ts
type Block =
  | { type: 'p'; text: string; links?: Link[] }
  | { type: 'list'; items: string[] }
  | { type: 'table'; head: string[]; rows: string[][] };

type LegalDoc = {
  slug: string;
  title: string;
  effective?: string;
  revised?: string;
  sections: { id: string; heading: string; blocks: Block[] }[];
};
```

Per-document parsing notes:

- Cookie Policy: `### **Heading**` starts a section; the leading `\-` escapes on
  the bullet paragraphs are stripped and those paragraphs become list items.
- Privacy Policy: `**N.  HEADING**` starts a section. The purpose/lawful-basis
  markdown table becomes a `table` block.
- Terms and Conditions: `### **N\. Heading**` starts a section; the two `####`
  lines at the top form the document title; empty `###` lines are discarded.
- Click Draw T&C: the whole regulation sits in one table cell on line 6. Split on
  the `Section N\.` markers to synthesise sections. Line 9 is a base64 signature
  image and is discarded entirely — it is 56 KB and must not reach the bundle.

## 2. Help Center

Route unchanged at `/member/help`. Three stacked rows.

**Row 1** — `lg:grid-cols-[1.15fr_1fr]`.

Left: the existing welcome banner, keeping the mascot and the
`How can we help, {name}?` greeting, with a search field added beneath it.

Right: an `FAQs` card listing the six categories with a question count each.
Categories in source order: Panel registration (8), Panel member status (3),
Rewards (5), Completing surveys (12), Personal data privacy and safety (3),
Password recovery (1). Clicking a row opens the reading panel at that category.

**Row 2** — the three existing topic cards, now interactive:

| Card | Action |
| :--- | :--- |
| Account | Navigate to `/member/settings#account` |
| Privacy | Navigate to `/member/settings#privacy` |
| Contact | Smooth-scroll to the contact form below |

These become real `<a>` and `<button>` elements with focus-visible rings, not
`div`s with `cursor-pointer`.

**Row 3** — the existing Contact support and Chat with us pair, unchanged.

### Search

`src/lib/faqSearch.ts`, no dependencies, index built once at module load.

Normalisation lowercases, decomposes to NFD and strips combining marks so
"parola" matches "parolă", removes punctuation, tokenises on whitespace, drops a
short stopword list and any token under two characters.

Scoring per FAQ entry, requiring at least one term match:

| Signal | Points |
| :--- | ---: |
| Whole query appears in the question | 100 |
| All query terms matched somewhere | 25 |
| Term matches a question word | 10 |
| Term prefixes a question word | 6 |
| Term matches the category name | 4 |
| Term matches an answer word | 3 |
| Term prefixes an answer word | 2 |

Results sort descending, cap at 8, and render in a panel beneath the search field
showing the question with matched terms marked, the category as a chip, and a
one-line answer snippet. Selecting a result opens the reading panel at that
question. Empty results show a plain message offering the contact form.

### Reading panel

`src/components/member/FaqPanel.tsx`. A dialog over the page, `max-w-[880px]`,
`max-h-[85vh]`, internal scroll. Category rail on the left at `md:` and above; a
`<select>` on mobile. Questions render as the existing signature accordion.

Accessibility: `role="dialog"`, `aria-modal="true"`, labelled by its heading,
focus moved to the panel on open and restored to the trigger on close, Escape
closes, focus trapped while open, background scroll locked.

## 3. Settings

Route unchanged. Anchors `id="account"` and `id="privacy"` with `scroll-mt-24`
so the Help Center deep links land below the sticky header.

### Account details

One card, four groups separated by hairline dividers and small group headings.
Per the no-nesting rule, groups are dividers and tint surfaces, never nested
cards. Each group carries a single Edit control that swaps the group into a form
with Save and Cancel, rather than one Edit button per row.

| Group | Fields |
| :--- | :--- |
| Personal details | Profile picture, First name, Last name, Gender (locked), Year of birth (locked) |
| Contact | Email, Secondary email, Phone number, Address, Post code, Country (locked), Language |
| Payments | PayPal email |
| Security | Password |

Locked fields render with a lock icon, no Edit affordance, and a
"Contact support to change" link to `/member/help`. This is a deliberate product
rule, not a missing feature, and is recorded in PRODUCT.md.

Profile picture uses a file input restricted to images, previewing client-side
via an object URL. Nothing uploads. Marked `PLACEHOLDER (dev team)` and the
object URL is revoked on unmount.

PayPal email shows, while editing, a plain-language notice that a confirmation
link goes to the new address and payouts keep using the current address until it
is confirmed.

Since this is a static mock, Save exits edit mode and raises the existing toast.
No state persists across reloads — flagged in the code.

### Privacy and consent

Four buttons: Manage consent (dark, unchanged), then Privacy policy, Cookie
policy and Terms and conditions linking to their `/legal/*` routes.

## 4. Legal routes

`src/app/legal/[slug]/page.tsx` with `generateStaticParams` returning the four
slugs, plus a minimal layout at `src/app/legal/layout.tsx` carrying the logo and
a back link. Deliberately outside both the `(site)` and `member` route groups so
the public footer and the member platform can both link to it without either
shell wrapping it.

`src/components/legal/LegalDocView.tsx` renders any `LegalDoc`: title, effective
and last-revised dates, a sticky section index at `lg:` and above, then the body.
A print stylesheet hides the index, back link and chrome, and forces black text
on white.

The public footer currently points Privacy, Terms and Cookies all at
`/trust-privacy`. Those three links are repointed at the real documents. Data
protection stays on `/trust-privacy`.

## 5. Community

### Draw card

Copy is corrected. The current line — "Earn more tickets by completing quests and
redeeming rewards" — contradicts the signed regulation and is replaced with the
real rule: an entry for every survey that ends in screenout, quota full or survey
closed, plus the member's level bonus. Prize wording changes from the placeholder
"€250 prize pool" to the regulation's actual 11 prizes worth €150 in total.

"How the draw works" opens `DrawExplainerModal` — a short plain-language panel
covering how entries are earned, the monthly reset, the 11 prizes, random.org
selection, one prize per person per month, notification by email, and the fact
that a month's draw happens before the end of the following month. It closes with
"Read the full terms" linking to `/legal/click-draw`. The full regulation is a
route; the explainer is not a legal document and stays a modal.

### Member tips

Three tips in one row at `sm:grid-cols-3`, showing only the tip title. The
explanation strings stay in `mockData.ts` for later use rather than being deleted.

### Winners

A banner below the tips: "Last month's Click Draw winners are in", with a
subline naming the month and the count, linking to
`/member/community/winners`.

The winners page lists a month at a time with a month selector, a table of
Country, Member and Prize, and a note on the draw schedule. Data lives in
`src/content/drawWinners.ts` as a plainly commented array the user edits monthly:

```ts
export type DrawWinner = { country: string; flag: string; name: string; prize: number };
export type DrawMonth = { id: string; label: string; winners: DrawWinner[] };
```

Seeded with one placeholder month of 11 entries — one €50 and ten €10 — matching
the regulation's prize structure, marked `PLACEHOLDER` throughout.

Because a month's draw runs before the end of the *following* month, the banner
and page name the month explicitly rather than saying "last month", and the page
states when the next month's list is expected.

## 6. Gamification rules layer

New `src/lib/gamification.ts` is the single source of truth, transcribed from
`Level, XP, Badges, Quests rules.md`:

- `LEVELS` — 13 entries, level 0 to 12, with cumulative XP thresholds
  0 / 200 / 500 / 1 000 / 2 000 / 5 000 / 10 000 / 20 000 / 50 000 / 100 000 /
  200 000 / 500 000 / 1 000 000 and their labels from Getting Started to
  MyVoice Champion.
- `LEVEL_PERKS` — perk text per level, plus structured
  `drawEntriesPerActiveMonth` (levels 2, 5, 8, 11, 12 → +1, +2, +3, +5, +7) and
  `streakGraceDays` (levels 3, 6, 9, 12 → 2, 3, 5, 7 consecutive misses).

  Resolved 2026-07-22. **The rules document is internal operational data, not a
  member-facing promise.** It is not a legal commitment, it may change at any
  time, and the master table is never shown to members. Members earn levels,
  bonuses and badges through their activity; the mechanics are handled in code,
  and members see only what the business chooses to surface.

  This resolves the apparent conflict with the signed regulation. The regulation
  governs what MyVoice *promises* about draw entries — qualifying surveys only,
  and that is what member-facing copy says. The level perks are an internal
  weighting the platform applies, not an advertised entitlement, so no amendment
  is needed and none is made.

  The binding constraint that follows: `LEVEL_PERKS`, `XP_SOURCES`, and the
  `rule` field on every quest are **engineering data and must never be rendered
  in member-facing UI**. Members may see their current level label, their
  progress, and the badges they have earned. They must not see the perk ladder,
  the XP formulas, the exact completion rules, or a preview of what the next
  level grants.
- `levelFromXp(xp)` and `levelProgress(xp)` returning level, label, XP into the
  current band, band span, percentage and next threshold.
- `surveyCompletionXp(minutes) = 25 + 5 * minutes`. This replaces the July 7
  spec's payout-based `reward € × 50`.
- `XP_SOURCES` — the full table including one-off awards, streak milestones and
  survey-completion milestones.
- `BADGES` — all 27, each with trigger text and the Captain MyVoice art concept.
- `DAILY_QUESTS` (17), `WEEKLY_QUESTS` (12), `MONTHLY_QUESTS` (6) with their
  objectives, completion rules and bonus XP.
- `DRAW` — prize structure, entry sources and monthly reset rule.

### Reconciliation with existing mock data

`member` currently reads `level: 4, rank: 'Voicer', xp: 320, xpMax: 500`, which
does not fit the new curve at all. It becomes a lifetime XP figure that derives
its level: 2 340 XP → level 4, Trusted Voice, next band at 5 000. `rank` is
replaced by the level label so there is one vocabulary, not two.

`quests` becomes three daily quests drawn from the pool with the document's XP
values. `badges` grows from 6 invented entries to the real 27; the existing
profile grid renders them all for now, which makes that section long — fixing
that is phase-two work and is noted, not solved here.

`MemberProvider` is audited so XP awards use `surveyCompletionXp`, level-up
triggers use `levelFromXp`, and any ticket award on redemption is removed, since
redemption is not an entry source under the regulation.

Every remaining mention of tickets, draws, XP, levels, streaks, badges and quests
across the 15 files that reference them is checked against the new rules and
corrected.

The July 7 gamification spec is left in place, with a dated note at the top
recording that its XP formula and ticket rules are superseded by this work.

## Verification

`npm run build` must pass. Because `preview_screenshot` times out on these pages
— the mascot animation never lets the renderer settle — visual checks use the
established headless-Chrome recipe against the running dev server: unique
`--user-data-dir`, absolute Windows output path, curl-warm the route first, and
no `taskkill` around the capture.

Checks: the two Help Center deep links land on the right Settings groups, search
returns sensible results for a handful of real queries, the FAQ panel traps focus
and closes on Escape, all four legal routes render and print cleanly, and the
Community winners page renders the placeholder month.

## Resolved during design review

**The Click Draw entry rule stands as written, and the regulation is not
amended.** Confirmed 2026-07-22: rewarding screenouts, quota-full and
survey-closed outcomes is deliberate policy. It pays members who genuinely
attempt surveys without creating an incentive to farm completions, which is
exactly the click-farm behaviour the panel needs to avoid. The rule is a fraud
control, not just a consolation mechanic, and the member-facing copy should carry
that intent rather than framing entries as a booby prize.

**Full winner names are correct, because the audiences differ.** Confirmed
2026-07-22: the testimonial videos sit on the public marketing site, visible to
anyone, so they are anonymised to "Verified MyVoice member". The winners list is
behind member authentication and visible only to panel members, and Section 8 of
the regulation secures consent for it. Both decisions are right for their
surface. The winners page must therefore never be linked from, or rendered on,
any public `(site)` route.

## Open items for the user

1. **Prize-draw legality per market.** Carried forward from the July 7 spec and
   still unresolved: prize draws are regulated country by country, and MyVoice
   operates in 30+ markets. Which members even see the draw is a legal call.
2. **Real winners data.** The seeded month is placeholder content and must be
   replaced before launch.
3. **Whether level perks grant draw entries.** See the note in section 6.
