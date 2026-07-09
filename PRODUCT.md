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
are kept lean (Account, Privacy, Contact) rather than an exhaustive category wall.

Not every surface belongs on the web platform. **Notification preferences live in the mobile
app, not the web** — push/notification settings are a device concern, so the web Settings page
carries only account details, privacy/consent, and account deletion. This continues the broader
direction of trimming non-essential engagement surfaces (removed the Community Announcements
card and gamified extras) in favor of operational clarity.

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
