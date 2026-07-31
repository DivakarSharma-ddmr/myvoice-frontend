# CLAUDE.md

## Design Context

This project has an impeccable design system. Read [PRODUCT.md](PRODUCT.md) (strategy)
and [DESIGN.md](DESIGN.md) (visual system) before designing or changing any UI.

**Register (hybrid):** `product` by default. Routes under `src/app/(site)/*` (public
marketing website) are **brand** surfaces; routes under `src/app/member/*` (logged-in
platform) are **product** surfaces. Routes under `src/app/admin/*` (V1) and
`src/app/admin-lab/*` (V2) are the **internal panel-admin console** — **product/utility**
register, denser than the member area, no brand/marketing tone (see PRODUCT.md "Panel Admin
Console" + DESIGN.md §8). Set register per task by the surface in focus.

**Mission:** reposition MyVoice from a "paid survey site" into a *trusted global
research community* — Trust → Participation → Rewards. Personality: warm, credible,
respectful (gamification dialed back). North Star: **"The Trusted Neighbor."**

**Design principles:**
1. Trust before rewards — earn credibility before asking for anything.
2. Show, don't tell — real member videos/screenshots/numbers, never placeholders.
3. Warmth in service of credibility — delight never undercuts legitimacy.
4. Operational honesty — real Project/Survey IDs and effort/reward, not gamified abstraction.
5. Respect the member's time — low-friction, mobile-first, unambiguous.

**Guardrails:** WCAG 2.2 AA. Signal Yellow `#FFCC33` on ≤10% of a screen (CTA/reward
only). No survey-farm clutter, no over-gamification, no generic AI SaaS-cream template,
no cold enterprise gray. Teal-tinted shadows only. See DESIGN.md for the full spec.
