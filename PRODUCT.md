# Product

## Register

product

> Register note (hybrid project): This codebase has two first-class surfaces. The
> **public marketing website** (`src/app/(site)/*` — home, why-join, how-it-works,
> rewards, trust, join, login) is a **brand** surface where design *is* the product:
> persuasion, trust, and conversion. The **member platform** (`src/app/member/*` —
> dashboard, surveys, rewards, profile, community, settings) is a **product** surface
> where design *serves* the task. The bare value above is the default fallback; when a
> task targets a `(site)` route, treat it as **brand**. Set register per task by the
> surface in focus.

## Users

Two audiences, one brand:

- **Prospects** arriving on the public site — people searching for "paid surveys",
  "make money online", or "online research panels", often on mobile, often skeptical
  after bad experiences with spammy survey farms. Their job: quickly judge whether
  MyVoice is legitimate, worth their time, and actually pays. They decide in seconds.
- **Members** — a global panel of 2M+ people across 30+ countries (since 2015), many
  ESL / mixed-literacy, mobile-heavy. Their job inside the platform: find surveys they
  qualify for, complete them without friction, understand exactly what they'll earn,
  and redeem rewards reliably. They return repeatedly, so clarity and trust compound.

Context: MyVoice is a survey panel operated by **DataDiggers** (market-research firm).
Members are the supply side of a research marketplace; clients buy the data.

## Product Purpose

Reposition MyVoice from a "paid survey site" into a **trusted global research
community**. The strategic arc is **Trust → Participation → Rewards**: earn credibility
first, which drives honest participation, which is fairly rewarded. Success means higher
sign-up conversion on the public site, higher survey completion and retention in the
platform, and a brand perception closer to a legitimate research institution than to a
rewards-farming app. The frontend is a static, mock-data build that is deliberately
backend-ready — every content surface flows through a single mock-data layer meant to be
swapped for the real API (survey routing, reward fulfilment, member data).

## Member Support & Platform Scope

Member support is two-track and deliberately honest about response time: an **async Contact
support form** (Help Center, ~1 business day) plus a **live chat** ("Chat with us") that
reuses the existing chat widget from the old platform — its stated availability is standard
business hours (9 AM–6 PM, Bucharest time), never a fake "instant" promise. Help Center topics
are kept lean (Account, Privacy, Contact) rather than an exhaustive category wall — surfaced as
three unlabeled topic cards directly under the welcome banner (the "Browse by topic" heading was
dropped as redundant). An earlier hero search box was removed for a while because it was a
non-functional static mock — a dead control is worse than no control (operational honesty). It
returned only once there was real FAQ content behind it to search.

The Help Center carries the **real member FAQ** — 32 questions across 6 categories, generated
from the source document rather than retyped, so the platform and the published FAQ cannot drift
apart. A **keyword search** sits under the greeting; it folds diacritics, so a member typing
"parola" finds "parolă". The Account and Privacy topic cards **deep-link into the matching
Settings group** rather than being decoration.

The empty search box carries **pressable example queries** rather than hint text describing what
a member could type. Every suggestion is asserted in tests to return results, so a chip can never
lead to a dead end. Query-side **synonym expansion** closes the gap where the platform's own
vocabulary differs from the published FAQ's — the app says "screenout", the FAQ says "redirected
prematurely", and a member who learned the word from us should not get nothing back. The FAQ text
itself is never rewritten to suit search.

Not every surface belongs on the web platform. **Notification preferences live in the mobile
app, not the web** — push/notification settings are a device concern, so the web Settings page
carries only account details, privacy/consent, and account deletion. This continues the broader
direction of trimming non-essential engagement surfaces (removed the Community Announcements
card and gamified extras) in favor of operational clarity.

## Account Data & Editability

Account details are grouped into four collapsible sections and **only one opens at a time**, so
fourteen fields never stack into a long scroll. Each collapsed row still shows its own data in
one line — a member checking which email address we hold should not have to open anything. An
accordion that hides everything only trades scrolling for clicking.

Members can see every field we hold on them, but not all of them are member-editable.
**Year of birth, gender and country are read-only**, shown with a lock and a route to support.
They drive survey targeting, so member-side editing would let someone re-target themselves into
better-paying quotas and would corrupt historical data. This is a deliberate product rule, not a
missing feature. Name, phone, address, post code, both email addresses and the profile picture
are freely editable.

**Changing the PayPal address requires confirming the new address.** Payouts keep going to the
current address until the member clicks the link sent to the new one. Money-moving fields do not
change on a single unverified edit.

## Click Draw

Click Draw entries are earned **only from surveys that end in screenout, quota full, or survey
closed** — never from completed surveys, quests, streaks or redemptions. Completions pay their
reward directly; the draw exists for the attempts that did not pay.

This is a **fraud control as much as a courtesy**. It compensates members for genuine attempts
without creating any incentive to farm completions, which is exactly the click-farm behaviour a
research panel has to avoid. Member-facing copy should carry that intent — fair and factual —
rather than framing entries as a consolation prize.

The prize structure is fixed by the signed regulation: **11 prizes monthly, 1 × €50 and 10 × €10,
€150 in total**, drawn at random via random.org, one prize per person per month. A month's draw
runs before the end of the *following* month, so winner lists are always a month behind.

Winners are published with **full name and country** on a member-only page. Section 8 of the
regulation secures consent for that. This does not contradict anonymising the public testimonial
videos: the videos are public marketing visible to anyone, the winners list sits behind member
login. Different audiences, different calculus. The winners page must never be linked from, or
rendered on, any public route.

## Gamification Data

The levels, XP sources, badges and quest pools are **internal operational data, not a promise to
members**. They are not a legal commitment, they may change at any time, and the master table is
never shown. Members earn levels, bonuses and badges through their activity; the mechanics are
handled in code, and members see only what we choose to surface — their current level and label,
their progress, and the badges they have earned. They do not see the perk ladder, the XP
formulas, the exact completion rules, or a preview of what the next level grants.

The level itself is surfaced twice on the dashboard, deliberately answering two different
questions: the frame around the medallion reads as a **clock face** showing standing in the
twelve-level ladder (level 4 fills to four o'clock), while the bar beside it shows XP progress
within the current level. Neither exposes the ladder's contents — a member sees where they are,
never what the next step pays.

In practice this draws a hard line through the member UI. The **only level perk rendered is the
streak shield, and only once it is already active** — a member is told the protection they
currently hold, never how it was earned or what the next level adds. The bonus draw entries that
levels grant are never shown at all: member-facing draw copy states the signed regulation's rule
and nothing else. **Badges are the exception that stays visible** — the full 27-badge set is
shown, earned and unearned, because a badge label is a goal, not a mechanic. The trigger
conditions behind each badge remain internal. Every badge and every level now carries its own
commissioned Captain illustration rather than a repeated glyph from the generic icon set — the
artwork is the part of the gamification that members are *meant* to see.

Daily quests **rotate** — a fixed check-in anchor, a survey slot, and one from the wider pool —
and the UI says so ("a new set arrives every morning"), so an unfinished quest reads as *there
will be another* rather than something missed. The three-way split is deliberate: if every slot
needed a survey, a member in a market with thin survey supply could end the day unable to
complete anything, which is the exact frustration the habit loop exists to prevent.

## Brand Personality

**Warm, credible, respectful.** Three words: *trustworthy, approachable, fair.*

Lead with credibility and transparency; carry warmth through tone, real member faces,
and light moments of delight — but always subordinate to trust. The earlier gamified
"Quest / Captain MyVoice" framing has been dialed back per stakeholder direction: the
mascot and playful energy survive only in small doses, and the platform now favors
operational research language (real Project/Survey identifiers, honest effort/reward)
over game mechanics. Voice is plain, human, and specific — never hypey, never
dollar-sign-baiting, never condescending to a global mixed-literacy audience.

## Anti-references

- **Survey-farm aesthetics** (Swagbucks / InboxDollars / GetPaidTo-style): banner
  clutter, flashing "$$$", countdown pressure, dark-pattern reward baiting, stock-photo
  thumbs-up imagery. This is the exact perception we are repositioning away from.
- **Over-gamified, childish UI**: heavy mascot presence, confetti on everything, points
  theater that obscures what a member actually earns. (The pullback from "Quest".)
- **Generic AI SaaS-cream landing template**: warm-tinted near-white body + tiny tracked
  uppercase eyebrows + identical icon-card grids + a hero-metric block. Credible ≠ generic.
- **Cold, corporate market-research stiffness** (over-correcting into Ipsos/Nielsen
  enterprise gray). We want credible *and* human, not institutional and lifeless.

Prolific and YouGov are credibility *reference points*, not looks to copy.

## Design Principles

- **Trust before rewards.** Every screen earns credibility before it asks for anything.
  Lead with transparency — ISO/privacy, how data is used, real members — not the payout.
- **Show, don't tell.** Real member videos, real screenshots, real numbers over stock
  imagery and adjectives. Never ship placeholder testimonials or unverified stats.
- **Warmth in service of credibility.** Approachable and human, but delight never
  undercuts the sense that this is legitimate research infrastructure.
- **Operational honesty.** Surface the real mechanics — Project/Survey IDs, actual
  effort and reward, honest availability — instead of gamified abstraction.
- **Respect the member's time.** Low friction, fast, mobile-first, unambiguous. A member
  should always know what a survey costs them and what they get for it.

## Accessibility & Inclusion

Target **WCAG 2.2 AA**. Body text ≥ 4.5:1 contrast (large text ≥ 3:1), visible keyboard
focus (already implemented via `:focus-visible`), full `prefers-reduced-motion`
alternatives (already implemented), and keyboard-navigable interactive elements.

Given a global, mobile-heavy, mixed-literacy / ESL audience, hold an extra bar in
practice: plain-language copy, color-blind-safe status colors (don't rely on red/green
alone for survey/reward state), and generous touch targets. Design for the member on a
mid-range phone on a slow connection, not the reviewer on a desktop.
