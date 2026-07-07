# MyVoice Member Platform — Gamification Design Spec

**Status:** Draft for review. Numbers throughout are illustrative starting points, not final — adjust freely, then share back for insertion into `PRODUCT.md` / `DESIGN.md`.
**Scope:** Logged-in member platform only (dashboard, surveys, rewards, profile). Does not apply to or change the public marketing site's tone/personality.
**Author context:** Drafted with the user through structured brainstorming on 2026-07-07.

---

## 1. Goals & Priorities

Ranked priority order for what the gamification layer should optimize for (confirmed with stakeholder):

1. **Survey completion rate** — more surveys started AND finished, less mid-survey abandon.
2. **Daily return visits** — habitual opens even on days with no perfectly-matched survey.
3. **Long-term retention** — active membership sustained over 6-12 months, not just days/weeks.

Referral/panel growth was explicitly **not** prioritized in this round (referrals are currently hidden from member nav per the 2026-06-30 stakeholder trim) and is out of scope for this spec.

## 2. Overall Design Approach

**Hybrid: Effort-proportional core, flat habit loop.**

- Survey-related rewards (XP, tickets) scale with the real payout of the survey — this ties the game layer directly to actual business value instead of treating all surveys as equally "worth" the same in-game.
- Habit-loop actions (daily check-in, light quests) pay small **flat** rewards regardless of survey availability that day — this keeps the daily-return habit predictable and not dependent on survey supply variance.

This was chosen over a fully flat model (simpler but decouples game value from real value) and a fully effort-proportional model (most precise but least predictable for members, which works against habit formation).

## 3. XP & Levels

### 3.1 XP sources

| Action | XP formula | Notes |
|---|---|---|
| Survey completed | `round(reward_€ × 50)`, floor 25 XP | Effort-proportional core |
| Survey screened-out / quota-full | Flat 10 XP, capped at 3/day per member | Consolation for effort spent through no fault of the member — softens the #1 pain point flagged in the original blueprint. Cap prevents farming via deliberate abandon-loops |
| Daily check-in | Flat 15 XP + 1 ticket | Zero-friction habit action, always completable |
| Profile section completed | Flat 40 XP, one-time per section | Must track a genuine field edit, not a re-save of the same value, to prevent farming |
| Weekly quest bonus | Flat 150-300 XP | Paid on top of whatever the underlying actions already earned — a bonus for what they'd do anyway, not a separate ask |

**[ADJUST]** — the `×50` multiplier, the 10/15/40 flat amounts, and the weekly bonus range are all starting points. Tune against real average survey reward/duration once available.

### 3.2 Levels

Formula-based so it can be implemented directly rather than hardcoded: cumulative XP to reach level *n* = `200 × n × (n + 2)`.

Produces a curve that's fast in early levels (early dopamine, keeps casual/new members hooked) and stretches out at the top (supports the long-term retention priority).

| Level | Cumulative XP | Illustrative time @ ~800 XP/wk (moderately active member) |
|---|---|---|
| 2 | 1,600 | ~2 weeks |
| 5 | 7,000 | ~9 weeks |
| 8 | 16,000 | ~20 weeks |
| 10 | 24,000 | ~30 weeks |
| 12 (max) | 33,600 | ~42 weeks |

**[ADJUST]** — this table assumes ~800 XP/week for a "moderately active" member. That figure is an estimate, not derived from real panel telemetry. Recalibrate the formula constant (currently `200`) once real completion/frequency data is available.

### 3.3 Level perks (mostly cosmetic, 1-2 small functional perks)

| Level | Perk |
|---|---|
| 3 | Cosmetic profile flair unlock |
| 5 | Streak grace period extends from 1 missed day to 2 missed days before reset |
| 7 | +1 bonus ticket per week, automatic |
| 10 | "Trusted Voice" badge + early access to a small pool of high-value surveys ahead of general release — **requires survey-ops sign-off**, this is the one perk that touches routing/quota fairness |
| 12 (max) | Permanent "Founding Voice" status — evergreen recognition, no further requirement |

## 4. Streaks

**Definition:** A streak day counts if the member does *any* qualifying action that day — completes ≥1 survey **or** does the daily check-in. Using "any action" rather than "survey only" matters because survey supply, while near-daily, isn't literally 100% guaranteed for every member every day; check-in is the always-available fallback that protects the habit loop.

**Leniency (grace period, no tokens):** Missing one calendar day does not reset the streak — the counter freezes (shown dimmed, with a "your streak is at risk" nudge). The streak only resets to 0 after **two consecutive** missed days. (Level-5 perk extends this to a 2-miss grace / 3-miss reset.)

**Milestone rewards:** escalating XP + ticket bonuses at 3, 7, 14, 30, 60, 100, and 365 days, each unlocking a corresponding badge (see §6). Every 7-day mark additionally grants +1 bonus draw ticket to reinforce the weekly rhythm.

**[ADJUST]** — exact milestone bonus amounts, grace-period length, and whether to add streak-freeze tokens instead of/alongside the grace period are all open for tuning.

## 5. Quests

### 5.1 Daily quests (3 slots, refresh at local midnight)

| Slot | Quest | Purpose |
|---|---|---|
| Core habit | Daily check-in | Always completable — guarantees a win even with no matching survey that day |
| Primary | Complete a survey today | Anchors to the largest XP/ticket source |
| Rotating | Pulled from a pool (update a profile section, rate last survey, check wallet, etc.) | Pool auto-substitutes once profile hits 100% so this slot never goes stale |

Individual daily quests pay the flat rewards already defined in §3.1/§4 — quests are a "what to do today" surface, not an additional reward source. Exception: completing **all 3** in one day earns a **+1 ticket completion bonus**.

### 5.2 Weekly quests (2-3 active, reset on member's week-anchor day)

- "Complete 3 surveys this week" → larger XP + ticket lump
- "Try a survey from a new category" → drives category breadth, which also has real research-ops value (data diversity), not just an engagement hook
- "Keep your streak alive all 7 days" → reinforces §4 rather than competing with it

### 5.3 Seasonal / special quests

Time-boxed campaigns (member join-anniversary, platform anniversary, a new survey vertical launching, culturally-relevant moments). **Note:** needs per-market calendar sensitivity across 30+ countries — a campaign themed around one region's holiday may be irrelevant or inappropriate elsewhere.

- Higher reward tier than weekly quests + a genuinely time-limited exclusive badge.
- Copy should frame these as celebration ("join in") rather than pressure ("last chance!") to stay consistent with the "warm but credible" brand tone and avoid drifting toward the "casino-like gamification" the original blueprint explicitly warned against.
- Recommend starting light — **4-6 campaigns/year** — since a stale or expired seasonal banner reads worse than having none at all.

## 6. Tickets & Prize Draw

Tickets are **prize-draw entries**, not a redeemable currency and not purely cosmetic (confirmed).

### 6.1 Ticket sources

| Source | Tickets |
|---|---|
| Daily check-in | +1 |
| Survey completed | +1 flat (not scaled by payout) |
| Streak milestone | Escalating (e.g. +2 at 7 days, +5 at 30 days...) |
| Weekly quest completed | +1-2 |
| All 3 daily quests done | +1 bonus |
| Level 7+ | +1 bonus/week (see §3.3) |

Survey-completion tickets are deliberately **flat**, unlike XP — this keeps the draw feeling winnable for smaller/newer members, which matters for a lottery-style mechanic's perceived fairness. XP already rewards big earners proportionally; the draw doesn't need to double down on that.

### 6.2 Draw structure

- Keep the existing **monthly draw** as the anchor prize.
- Show members their odds transparently: "Your tickets this month: X / total pool: Y (~1 in Z)." Good for the "trusted neighbor" credibility positioning, and likely a **legal requirement** in several markets regardless.
- **Phase 2 idea (not day-one):** a smaller weekly mini-draw (e.g. 5×€10) once ticket volume from the above is calibrated. Frequent small wins are a stronger engagement lever than one rare large prize, but this adds ops overhead and should come after the base mechanic is proven.

### 6.3 Compliance flag — not a design decision, a requirement

Prize draws/sweepstakes are legally regulated **per country**. Common requirements include a no-purchase/no-action-necessary free alternate entry method, odds disclosure, minimum-age verification, and some jurisdictions prohibit this mechanic for foreign operators entirely. Given MyVoice operates in 30+ countries, **this needs legal review market-by-market before launch** — which countries can even see the draw should be a legal decision, not an engineering default of "on everywhere."

## 7. Badges (~20, curated set)

| Category | Badges |
|---|---|
| Streak (4) | 7-day, 30-day, 100-day, 365-day |
| Survey milestones (4) | 1st survey, 25, 100, 500 |
| Level (3) | Level 5, Level 10, Level 12 "Founding Voice" |
| Profile & trust (3) | Profile 100% complete, Verified member, 1-year anniversary |
| Breadth (2) | "Explorer" (5+ categories), "Well-Rounded" (10+ categories) |
| Seasonal (2-3) | Campaign-exclusive, genuinely time-limited (can't be earned outside the window) |
| Legacy (1) | "Founding Member" — tenure-based, for pre-relaunch panelists. A nod to the existing 2M+ member base without inventing new mechanics for them |

Each badge should carry a short "why it matters" line tied to research value rather than pure game flavor text, to stay on-brand — e.g. *"Explorer — your feedback spans 5+ topics, and that diversity is what makes our data valuable."*

## 8. Guardrails Before Launch

These are flagged, not fully specified — each needs its own decision/owner:

- **Anti-gaming:** profile-quest completion must require a genuine field edit (not a re-save of the same value); screen-out consolation XP is capped at 3/day to prevent farming via deliberate start-and-abandon loops.
- **Fraud tie-in:** every XP/ticket-earning action increases the incentive for multi-accounting. This must plug into whatever fraud/duplicate-account detection already exists in the platform — it should not run as an independent, unaware system.
- **Survey routing fairness:** the Level-10 "early access" perk (§3.3) touches survey routing/quota logic and needs sign-off from whoever owns survey distribution, not just product/marketing.
- **Legal/compliance:** the prize draw (§6.3) needs per-market legal review before any market sees it live.

## 9. Rollout & Tuning

None of the numeric constants in this doc are derived from real MyVoice panel telemetry — they're directionally grounded in proven patterns (Duolingo-style streak + grace period, RPG-style escalating level curves, flat-ticket lottery fairness) but need calibration. Recommended approach:

1. Launch with conservative numbers (the ones in this doc are a reasonable starting point).
2. Instrument from day one: XP earned/day, streak retention curve (what % survive day 2, day 8, day 31), ticket distribution across the member base, quest completion rate by type.
3. Plan a first re-tuning pass at **60-90 days** post-launch once real behavior data exists, rather than trying to perfect the numbers pre-launch.

---

*This document intentionally does not modify `PRODUCT.md` or `DESIGN.md` — per instruction, changes should be merged there once numbers are finalized and shared back.*
