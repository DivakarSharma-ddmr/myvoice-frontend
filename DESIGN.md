---
name: MyVoice by DataDiggers
description: Warm, credible design system for a trusted global research community — public site + member platform.
colors:
  teal: "#336666"
  dteal: "#1F4F4F"
  teal2: "#2C6A64"
  soft: "#52706E"
  yel: "#FFCC33"
  syel: "#FFF4CC"
  gold: "#8A6D12"
  lteal: "#E8F3F3"
  ink: "#1C2526"
  mute: "#667085"
  green: "#22A06B"
  amber: "#F59E0B"
  danger: "#D92D20"
  canvas: "#EEEFEB"
  cream: "#FFFDF6"
  sand: "#FBF4E6"
  bd: "#F1ECDB"
  white: "#FFFFFF"
typography:
  display:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 5vw, 3.25rem)"
    fontWeight: 800
    lineHeight: 1.04
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 3vw, 2.25rem)"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "normal"
  body:
    fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "normal"
rounded:
  md: "12px"
  lg: "16px"
  xl2: "18px"
  2xl2: "22px"
  3xl2: "28px"
  full: "9999px"
spacing:
  card: "20px"
  card-lg: "24px"
  section: "56px"
components:
  button-primary:
    backgroundColor: "{colors.yel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "12px 20px"
  button-primary-pill:
    backgroundColor: "{colors.yel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    padding: "12px 24px"
  button-dark:
    backgroundColor: "{colors.teal}"
    textColor: "{colors.white}"
    rounded: "{rounded.md}"
    padding: "12px 20px"
  button-dark-hover:
    backgroundColor: "{colors.dteal}"
    textColor: "{colors.white}"
  button-secondary:
    backgroundColor: "{colors.white}"
    textColor: "{colors.teal}"
    rounded: "{rounded.md}"
    padding: "12px 20px"
  button-ghost:
    backgroundColor: "{colors.white}"
    textColor: "{colors.mute}"
    rounded: "{rounded.md}"
    padding: "12px 20px"
  card:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.2xl2}"
    padding: "20px"
  input:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "12px 14px"
  nav-pill:
    backgroundColor: "{colors.white}"
    textColor: "{colors.teal}"
    rounded: "{rounded.full}"
    padding: "10px 20px"
---

# Design System: MyVoice by DataDiggers

## 1. Overview

**Creative North Star: "The Trusted Neighbor"**

MyVoice is a survey panel repositioning itself away from the "paid survey site" category and toward a *trusted global research community*. The visual system carries that shift. It should feel like a neighbor you already trust — warm, human, and unmistakably real — while quietly signalling that serious research infrastructure sits behind it. Warmth earns the first look; credibility earns the sign-up.

The palette is built on a confident **teal** (`#336666`) against soft **warm-neutral** surfaces (cream, sand, a muted `#EEEFEB` canvas), with a single bright **signal yellow** (`#FFCC33`) reserved for the moments that matter — the primary call to action, a reward, a highlight. Corners are generously rounded (18–28px), shadows are diffuse and teal-tinted rather than hard and gray, and motion is gentle (a floating wallet card, a waving mascot in small doses). Nothing shouts. The design is confident enough to be quiet.

This system explicitly rejects the **survey-farm aesthetic** it is escaping: no banner clutter, no flashing `$$$`, no countdown-timer pressure, no stock thumbs-up imagery. It also rejects the opposite over-correction — cold, gray, enterprise market-research stiffness. And it avoids the **generic AI SaaS-cream template** (tiny tracked uppercase eyebrows, identical icon-card grids, a hero-metric block). Warm ≠ generic; credible ≠ cold.

**Key Characteristics:**
- Confident teal + warm neutrals, with yellow as a rare, high-value signal.
- Generous rounding (18–28px) and soft, teal-tinted diffuse shadows.
- Human warmth (real member faces, gentle motion) subordinated to trust.
- Restraint: one accent, one voice, plenty of quiet surface.

## 2. Colors

A warm, grounded palette: a deep teal does the heavy lifting, warm off-whites carry the surfaces, and one saturated yellow is the single loud voice.

### Primary
- **Deep Muted Teal** (`#336666`): The brand's anchor. Primary buttons in "dark" mode, links, active nav, headings on light surfaces. Carries credibility and calm.
- **Forest Teal (deep)** (`#1F4F4F`): The darkest teal. Hero headline color, primary-button hover. Adds weight and seriousness where teal alone would feel light.
- **Deep Green (dark)** (`#023842`, token `dgreen`): The member platform's structural dark surface — the desktop **sidebar**, the dashboard **level hero**, and every standing feature bar (dashboard **monthly community draw**, rewards **"available to redeem"**, profile **completion** hero, community **Click Draw** bar). Deeper and greener than Forest Teal; used flat (no gradient) so the member area's dark anchors all read as one surface.
- **Soft Teal (muted)** (`#52706E`): Desaturated teal for secondary body copy on warm surfaces where pure `#667085` gray would look washed out. Use instead of gray-on-tint.

### Secondary
- **Signal Yellow** (`#FFCC33`): The single high-value accent. The primary CTA, reward highlights, wallet moments. Never decorative filler — its rarity is what makes it read as "this matters."
- **Soft Yellow** (`#FFF4CC`): Tinted yellow wash for reward/highlight chips and icon backgrounds. The quiet echo of the signal.
- **Gold (text)** (`#8A6D12`): The accessible text color for use *on* yellow surfaces (yellow text on yellow fails contrast; this passes).

### Tertiary
- **Light Teal** (`#E8F3F3`): Tint surface for selected states, icon chips, quiet section backgrounds.
- **Success Green** (`#22A06B`): Reward earned, survey completed, progress positive. Paired with an icon/label — never color alone.
- **Amber** (`#F59E0B`) / **Danger Red** (`#D92D20`): Warning and error/blocked states. Reserved for genuine status, never emphasis.

### Neutral
- **Ink** (`#1C2526`): Primary text. Near-black with a whisper of teal.
- **Mute** (`#667085`): Secondary text and metadata on white surfaces only. On warm/tinted surfaces, switch to **Soft Teal** `#52706E` for contrast.
- **Canvas** (`#EEEFEB`): The body background. A warm-cool mid-neutral — deliberately *not* a bright white and *not* a saturated cream.
- **Cream** (`#FFFDF6`) / **Sand** (`#FBF4E6`): Warm surface washes, hero gradients, member platform base.
- **Border Sand** (`#F1ECDB`): The default hairline border on cards, inputs, and pills. Warm, 1px, quiet.
- **White** (`#FFFFFF`): Card and control surfaces that need to lift off the warm canvas.

### Named Rules
**The Signal Yellow Rule.** Yellow appears on ≤10% of any screen and only on things a member should act on or celebrate (primary CTA, reward, wallet). If yellow is decorating, it's wrong — demote it to `#FFF4CC` or remove it.

**The No-Gray-On-Warm Rule.** Never place `#667085` mute-gray body text on cream/sand/tinted surfaces; it washes out and fails contrast. Use **Soft Teal** `#52706E` (a darker shade of the surface's own family) instead.

## 3. Typography

**Display / Primary Font:** Plus Jakarta Sans (with `system-ui`, sans-serif fallback)
**Body / UI Companion Font:** Inter (with `system-ui` fallback), available for dense UI text
**Label Font:** Plus Jakarta Sans (weights 600–800)

**Character:** One warm humanist geometric sans carries almost everything — friendly, rounded terminals, highly legible at small sizes for a global mixed-literacy, mobile-heavy audience. Jakarta's heavier weights (700–800) give headlines confidence without a second display face. Inter is the quieter companion for data-dense UI where Jakarta's warmth is less useful. This is a single-family, multi-weight strategy, not a contrast pairing.

### Hierarchy
- **Display** (800, `clamp(2.5rem, 5vw, 3.25rem)`, line-height 1.04, tracking -0.02em): Hero headlines. Deepened to Forest Teal `#1F4F4F`. Use `text-wrap: balance`. Ceiling is ~52px — this brand does not shout.
- **Headline** (800, `clamp(1.75rem, 3vw, 2.25rem)`, line-height 1.1): Section titles across site and platform.
- **Title** (700, 1.125rem, line-height 1.3): Card titles, survey names, nav labels.
- **Body** (400–500, 1rem, line-height 1.6): Paragraph copy. Cap measure at 65–75ch; hero intro caps around 440px.
- **Label** (600–700, 0.8125rem): Metadata, chips, pill labels, timestamps ("8 min · €1.20").

### Named Rules
**The One-Family Rule.** Do not introduce a second display or body typeface. Hierarchy comes from weight and size within Plus Jakarta Sans (400 / 500 / 700 / 800), not from a new font. Inter is the only sanctioned companion, and only for dense UI.

**The No-Eyebrow Rule.** No tiny tracked uppercase kicker ("ABOUT", "HOW IT WORKS") above section headings. It is the AI-template tell and it undercuts the "not-generic" position. Let the headline lead.

## 4. Elevation

The system is **soft-layered, not flat and not heavy.** Depth is conveyed with diffuse, teal-tinted shadows (never neutral gray, never hard 2014-era drop shadows) plus warm 1px borders and white surfaces lifting off the warm canvas. Shadows deepen on hover to signal interactivity; at rest they are barely-there ambient lift.

### Shadow Vocabulary
- **Soft** (`box-shadow: 0 12px 30px -18px rgba(31,79,79,.3)`): The default resting lift — sticky header, pills, small chips.
- **Card** (`box-shadow: 0 18px 40px -26px rgba(31,79,79,.4)`): Cards and panels that need to float clearly off the canvas.
- **Lift** (`box-shadow: 0 30px 70px -34px rgba(31,79,79,.45)`): The hero floating elements (wallet card, survey card) and hover-elevated states. The strongest tier; use sparingly.

### Named Rules
**The Teal-Tint Shadow Rule.** Every shadow is tinted with `rgba(31,79,79,...)` (deep teal), never black or neutral gray. A gray shadow on this palette looks cheap and dead. If a shadow reads as gray, it's the wrong token.

## 5. Components

### Buttons
- **Shape:** Rounded rectangle (`rounded-xl`, 12px) by default; **pill** (`rounded-full`) for hero and marketing CTAs. All buttons are bold, with a subtle `active:scale-[.98]` press.
- **Primary:** Signal Yellow `#FFCC33` background, Ink text, `padding: 12px 20px` (pill: `12px 24px`). Hover: `brightness-95`. The single loudest control on a screen.
- **Dark:** Teal `#336666` background, white text. Hover → Forest Teal `#1F4F4F`. The credible secondary CTA (often the *actual* primary action on trust-forward pages).
- **Secondary:** White background, Teal text, 1px Teal border. Hover → faint `#E8F3F3` wash.
- **Ghost:** White background, Mute text, 1px Border-Sand. Quietest tier.

### Cards / Containers
- **Corner Style:** Generous — `rounded-2xl2` (22px) for standard cards, up to `rounded-3xl2` (28px) for hero and feature panels.
- **Background:** White `#FFFFFF` lifting off the warm `#EEEFEB` canvas.
- **Border:** 1px Border-Sand `#F1ECDB` — warm, quiet, always present (borders do the structural work; shadow is atmosphere).
- **Shadow Strategy:** Flat-with-border at rest for list cards; `soft`/`card` for floating panels. See Elevation.
- **Internal Padding:** 20px (`p-5`), 24px (`p-6`) on larger cards.
- **Nesting:** Never nest a card inside a card. Use tint surfaces (`#E8F3F3`, `#FBF4E6`) or dividers for internal grouping.

### Inputs / Fields
- **Style:** White background, 1px Border-Sand, `rounded-xl` (12px), `padding: 12px 14px`, Ink text.
- **Focus:** Border shifts to Teal `#336666` (`outline-none focus:border-teal`); global `:focus-visible` adds a 3px translucent teal focus ring for keyboard users.
- **Select / Checkbox:** Same shell as text inputs; progress-step bars use Teal `#336666` filled vs `#EDEFEA` empty.

### Navigation
- **Site header:** A floating white pill — `bg-white/90`, `rounded-full`, `backdrop-blur-md`, `shadow-soft`, warm 1px border — stuck near the top with margin on all sides (not edge-to-edge). Nav links are 14px semibold `#33635F`, bold Teal when active. Mobile collapses to a hamburger revealing a rounded card menu with Light-Teal active rows.
- **Member platform:** A `#023842` (Deep Green) fixed **200px** sidebar on desktop, split into two groups by a hairline `bg-white/10` divider — primary destinations (Dashboard / Surveys / Rewards / Profile / Community) above, support/config (Help Center / Settings) below. A white logo panel sits at the top. Nav uses **clean single-stroke line icons** (`src/components/ui/NavIcon.tsx`, `currentColor` so one icon serves both states) — *not* the Captain CapIcon tiles, which stay reserved for content (page titles, cards, badges). Active row = Signal-Yellow fill with ink text; idle = `#BFE0E0` with a `hover:bg-white/5`. Mobile keeps the bottom tab bar (same line icons) with a "More" overflow.
- **Topbar chips:** The three status chips (🔥 streak, 🎫 Click Draw entries, 💰 balance) each carry a `group-hover` tooltip that spells out what the number means — the glyphs alone were ambiguous. The tooltip is a **light speech bubble**: `bg-cream` fill, `text-ink` (black) copy, 1px Border-Sand, `rounded-2xl`, `shadow-card`, and a rotated-square **tail** (same fill + border) pointing up to the chip. It pops in with a `scale-90 → scale-100` + `opacity` transition on hover (`role="tooltip"` + `aria-label` for a11y). The middle chip uses a **ticket** glyph (🎫), not the ambiguous admission-tickets one.

### Member dashboard layout
Information order answers the member's questions in priority sequence, top to bottom:
1. **Level hero** (`#023842`) — rank, XP into the level, draw entries, streak-shield chip. No mascot on the hero (removed: it competed with the numbers). The clock-face `SquareRing` + flipping `LevelMedallion` stay.
2. **Surveys for you** — lifted directly under the hero (the member's reason to be here comes first), a **2×2 grid** of recommended surveys with a compact `See all surveys →` in the heading row.
3. **Daily quests · This week · Badges** — three parallel columns, deliberately compact so they support the surveys rather than dominate. **Daily-quest cards are a single tight row**: icon, title, `+XP`, and a *small* action button (Claim / Start) beside the heading — not a full-width bar. **This week** is a vertical step ladder (the `n-compass` stopwatch icon, one dot per weekly attempt) rather than a claim button — nothing to press, just where the week accrues. **Badges** stays the summary card (56px tiles).
4. **Profile completion · Monthly community draw** — the two closing cards.

### Accordion (signature)
White rows, `rounded-2xl` (16px), 1px Border-Sand, a `+` glyph in Teal that rotates 45° to `×` on open. Answer copy in Mute at `text-sm leading-relaxed`. Used for FAQ across site and help center.

### Settings accordion
Account details collapse into four rows sharing a single open state — opening one closes the
others. Each row is a full-width `<button>` carrying the group name in Forest Teal above a
one-line **data summary** in Mute, with the signature `+`-rotates-45°-to-`×` glyph on the right
in a 28px hairline circle. The summary is what keeps the pattern honest: collapsed does not mean
hidden, so reading your own account costs nothing and only *editing* costs a click. Summaries
`truncate` rather than wrap — they hold at 390px without clipping.

Collapsed panels are **unmounted, not height-animated**. A `grid-template-rows: 0fr` panel is
invisible but still in the tab order, so a keyboard member tabs into controls they cannot see;
the rotating glyph carries the state change instead. `aria-expanded` and `aria-controls` on the
button, panel `id` on the content.

### Badge display
Two tiers, deliberately not one. The **dashboard card is a summary**: count, a teal→green
progress bar, the first six earned tiles, an "and N more earned" line, and a link out. It sits in
the same row as "Surveys for you" and matches that column's height. The **full 27-tile gallery
lives at its own route** (`/member/dashboard/badges`), split into "Earned" and "Still to earn"
sections on an `auto-fill, minmax(96px, 1fr)` grid.

A gallery is a place, not an interruption — it gets a URL, the back button, and full width on a
phone, none of which a dialog gives. Modals are reserved for reading flows over a launcher (see
the FAQ panel), not for content a member navigates to.

Locked tiles keep their label at full Mute contrast and carry the lock in `grayscale(1)` plus
40% opacity on the art alone, with an `sr-only` "earned" / "not earned yet" suffix. Never fade a
label past 4.5:1 to signal state.

Each badge has **its own Captain illustration** — the `art` line in the rules document, drawn
and delivered as a contact sheet, sliced by `scripts/extract-emoji-sheets.mjs` into
`public/assets/badges/<badge-id>.webp`. The filename is the badge id, so there is no icon map to
drift out of step. Backgrounds are cut out by flooding inwards from the edges, never by keying on
white — that would punch holes through every speech bubble and sheet of paper in the set.

Every badge sits in a **sand tile** (`#FBF4E6`, corner radius 24% of the tile, art at 82% inside),
84px in the gallery and 68px on the dashboard card. The tile is not decoration. Three of the 27 —
First Check-In, Deep Dive, Feedback Loop — are drawn as full-bleed scenes rather than cut-out
figures, and loose on a white card they read as photographs dropped among drawings. Those
backgrounds are painted into the artwork and cannot be separated without redrawing, so the fix is
a shared frame: each badge becomes a picture in a tile rather than an odd tile. Locked tiles swap
the sand for a neutral `#F4F3EF`.

### Level medallion
The XP ring on the dashboard hero holds a 92px medallion that flips continuously between the
level number and that level's Captain artwork, 4.5s a side, 750ms on a `rotateY` with
`backface-visibility: hidden`. **The number is the front face and the initial state** — the
server-rendered HTML, a paused tab, a screenshot and a reduced-motion member all get the fact
rather than the decoration. Under `prefers-reduced-motion` the interval never starts; killing the
transition alone would leave the state still snapping between faces.

**The frame is a rounded square too**, not a circle — `SquareRing`. A circular track around
square faces leaves dead corners and forces the artwork down to the inscribed square; matching
the frame to the faces lets them fill it. 120px frame, 9px stroke, 96px medallion inside — a 12px
inset on every side, with the corner radius stepping down by the same amount so the two shapes
stay parallel. Both faces are that same square, so the number and the artwork occupy exactly the
same area and the flip has nothing to resize.

**The frame is a clock face.** It marks the member's level, not their XP: level 1 fills to one
o'clock, level 4 to four o'clock, level 12 all the way round. The horizontal bar beside it still
shows XP within the current level — standing in the ladder and progress toward the next step are
two different questions, so they get two different marks rather than one repeated twice.

Two details make it read as a real clock rather than an approximation. It is drawn as a **path,
not a `<rect>`**, because a rect's outline starts at the top-LEFT corner — the fill would begin at
half past ten. And each hour's stop is solved from its **true angle**, not by dividing the
perimeter into twelve: an hour is an angle, a stroke-dash is an arc length, and on a square those
do not scale together. One o'clock sits at 8.09% of the way round rather than 8.33%. The maths
lives in `src/lib/clockDial.ts`, where hours 3, 6 and 9 landing on exact quarter-turns is the
invariant the tests hold it to.

Level art is letterboxed rather than cropped, so each panel is shown whole; the export trims each
panel's own background margin first, which is what keeps the Captain legible at that size. The sheet's corner number
chips are painted out at export with the panel's ring-median background colour — the medallion
already shows the number on its other face, and printing it twice looks like a mistake.

## 6. Assets

Every raster asset the site serves is **WebP**, in one of two encodings, chosen by content:

- **Flat art** (badges, level panels) — quantised to a 128-colour palette, then encoded
  *lossless*. Hard edges and large flat fills are exactly what lossy compression rings around,
  and quantising first collapses the anti-aliasing ramps that make lossless expensive: 5.2 KB a
  badge, against 42 KB lossless-from-source and 16 KB at lossy quality 90.
- **Shaded art** (the Captain icon set, mascot poses, platform screenshots, logo) — *lossy*
  quality 90. The icon set drops from 72 KB a file to 8.7 KB, where lossless WebP would be 32 KB.

Run `node scripts/extract-emoji-sheets.mjs` after re-exporting a contact sheet, and
`node scripts/convert-images.mjs` after adding any new PNG or JPEG. Both are authoring steps, not
build steps: a failure should be an asset error caught locally, never a broken deploy.

Only `public/assets/icons/*` stays PNG — those are the PWA manifest and apple-touch icons, fetched
once at install, where PNG is still the safest format across app launchers. All non-video assets
together come to 861 KB, on a platform whose stated target is a mid-range phone on a slow
connection.

### Search suggestion chips
Under an empty search field, pressable pill chips (white, hairline border, Teal bold 12px) on a
`Try` label in Soft Teal — never static hint text. They are real `<button>`s that run the search,
they replace themselves with results once there is a query so they cost no height while
searching, and every one of them is test-asserted to return hits. Keep the labels to one or two
words: at 390px each extra word pushes the row onto another line.

### Help Center layout
The Help Center opens with a **two-column row** at `lg:grid-cols-[1.15fr_1fr]`. On the left, a `rounded-2xl2` teal→cream gradient card holds the announce-pose mascot, the greeting (`How can we help, {name}?`) and a **working search field** beneath it. On the right, an **FAQs launcher card** lists the six categories with a question count each.

The search field earns its place now that it actually searches — the earlier hero search box was removed precisely because it was a dead control, and this one only returned when there was real content behind it. Results appear in a bordered list directly under the input, each showing the question and its category; selecting one opens the reading panel at that answer. An empty result set says so plainly and points at the contact form.

Directly below sit the three topic cards (Account / Privacy / Contact) with **no "Browse by topic" heading**. All three are real controls — `<a>` for the two that navigate into Settings, `<button>` for the one that scrolls — never a `div` with `cursor-pointer`. Then the Contact + Chat two-column row.

### FAQ reading panel
A dialog over the page, `max-w-[880px]`, `max-h-[85vh]`, scrolling internally. A category rail sits on the left from `md:` up and collapses to a `<select>` on mobile; the active rail row is a Light-Teal pill in Teal text. Answers use the signature `+`-rotates-to-`×` accordion.

Why a panel rather than expanding inside the card: the longest category holds twelve questions and several answers run past 400 words. Nesting that inside a narrow right-hand column makes the card lurch in height on every click and squeezes long answers into a gutter. The panel keeps the launcher calm and gives the prose full width.

Dialog behaviour is non-negotiable: `role="dialog"`, `aria-modal="true"`, labelled by its heading, focus moved in on open and restored to the trigger on close, focus trapped while open, Escape closes, background scroll locked.

### Legal document layout
The `/legal/*` shell is deliberately outside both the `(site)` and `member` route groups, so the public footer and the member platform can both link to it without either shell wrapping the text. A minimal header carries the logo and a route back to the account.

Each document renders as a balanced title, an Effective / Last revised line in Soft Teal, a **sticky section index** on the left from `lg:` up, and sections divided by warm hairlines with `scroll-mt-24` so anchor links clear the header. Wide tables scroll inside their own `overflow-x-auto` container — the page body never scrolls sideways.

A **print stylesheet** is part of the design, not an afterthought: members and regulators do print these. `.no-print` drops the header and section index, the background goes white, and link URLs are not appended after anchors.

### Support chat window
The Help Center pairs the async **Contact support** form (left, ~1.1fr) with a **"Chat with us"** window (right, ~1fr) in a `lg:grid-cols-[1.1fr_1fr]` layout. The chat window is a *window frame inside* the card (the one sanctioned exception to no-nesting, because it must read as a distinct live surface, not a second card): `rounded-xl` (12px), 1px Border-Sand, `overflow-hidden`. Header bar on `#E8F3F3` (Light Teal) with a small mascot/agent avatar, a green presence dot, agent name in Forest Teal, and a plain-language availability line (support hours, not a fake "typing…"). Message bubbles are `rounded-2xl` with a squared inner corner: **agent** = Light-Teal fill / Deep-Teal text on the left; **member** = Teal fill / white text on the right. Input row is a pill field + a Signal-Yellow **Send** button (the card's only yellow — Send is the CTA). In the static build the window is a non-interactive placeholder for the real chat widget; keep the availability caption honest (e.g. business hours + timezone) rather than promising instant replies.

## 7. Do’s and Don’ts

### Do:
- **Do** reserve Signal Yellow `#FFCC33` for the primary action, rewards, and wallet moments — the Signal Yellow Rule (≤10% of a screen).
- **Do** use Soft Teal `#52706E` for secondary text on warm/cream surfaces; keep Mute `#667085` for white surfaces only.
- **Do** tint every shadow with deep teal `rgba(31,79,79,...)` — the Teal-Tint Shadow Rule.
- **Do** build hierarchy from Plus Jakarta Sans weights (400/500/700/800), not from new fonts.
- **Do** hold WCAG 2.2 AA: 4.5:1 body contrast, visible focus, and status conveyed by icon+label, not color alone (member audience includes color-blind and ESL users).
- **Do** keep corners generous (18–28px) and surfaces quiet; let one thing per screen be loud.

### Don't:
- **Don't** slide back toward the **survey-farm aesthetic**: no flashing `$$$`, banner clutter, countdown-timer pressure, or stock thumbs-up imagery. This is the exact perception the redesign escapes.
- **Don't** over-gamify: no confetti-on-everything, no heavy mascot presence, no points theater that hides what a member actually earns.
- **Don't** ship the **generic AI SaaS-cream template**: no tiny tracked uppercase eyebrows, no identical icon-card grids, no hero-metric block.
- **Don't** over-correct into **cold enterprise research gray** (Ipsos/Nielsen stiffness). Credible *and* human, not institutional and lifeless.
- **Don't** put mute-gray text on cream/sand — it washes out and fails contrast (No-Gray-On-Warm Rule).
- **Don't** use gray or black shadows; **don't** nest cards; **don't** exceed a ~52px display headline.
- **Don't** use color as the only signal for survey/reward state — always pair with an icon or label.

## 8. Admin Console (internal surface)

A **third surface** beyond the public site and member platform: the **panel-admin console**,
the internal operational tool panel administrators use (approve payouts, manage members,
run campaigns, answer support). It ships in two versions that share one design language:

- **V1 — `/admin`** (on `main`, deployed): a faithful, prettier re-skin of the legacy Metronic
  admin, backend-ready for a 1:1 wiring.
- **V2 — `/admin-lab`** (on branch `admin-v2`, not deployed): the reimagined *operator console*.

### Register & tone
Admin is a **product / utility** register — **denser than the member platform**, function over
warmth. It is deliberately **not** the "Trusted Neighbor" brand voice: no marketing warmth, no
mascot, no gamification. Same tokens (`tailwind.config.ts`), tighter spacing, more information
per screen. Light mode only for now.

### Rules carried over (unchanged)
- **Signal Yellow stays money-only** — reserved for the primary/positive value action
  (Approve payouts, Save), never for nav-active or decoration. (This is why admin nav-active
  uses `lteal/dteal`, not the legacy yellow highlight.)
- **Teal-tinted shadows**, generous radii, WCAG 2.2 AA.
- **Status by icon + colour, never colour alone** — one canonical token set in
  `src/lib/adminStatus.ts` → `<StatusPill>`: Active (green/check), Inactive (mute/dash),
  Sleeping (amber/moon), Unsubscribed (soft-teal/bell-off — *distinct* from Active, fixing the
  legacy "both blue" bug), Pending (amber/clock), On Hold (gold/pause), Approved (green/check),
  Rejected (danger/x), Complete (teal/check).

### Shared component library (`src/components/admin/*`)
`AdminShell`, `DataTable` (sort/filter/paginate/select + faked legacy totals), `StatusPill`,
`ActionMenu`, `ConfirmDialog` (stakes-stating for money/bulk/destructive), `Toast`, `Tabs`,
`Field` (Text/TextArea/Select/Toggle/DatePicker/FileUpload), `RichTextEditor` (contentEditable
+ `%%merge-tag%%` chips + preview), `PanelSwitcher` (searchable 30+ panels), `TwoPaneChat`,
`StatTile`. Data flows through `src/lib/adminMockData.ts` (the swap-for-API file); mutations
live in `AdminProvider` and reset on reload.

### Edit Member layout (the member record)
The Members list's **View** opens a full member record. Two layouts, one data source
(`memberDetail(id)`):
- **V1 (`/admin/members/[id]`)** — **faithful legacy 6-tab** layout via the shared `Tabs` strip:
  User Details · Extra/Meta Data · Panel Questions · Transactions · Consent · Messages. A top
  bar carries the **Wallet Amount** and the **Award Point / Reason / Approve** control. Read-only
  account facts sit left in a `<dl>`; editable identity fields (`Field` inputs) sit right; the
  Transactions/Messages tabs reuse `DataTable`; Panel Questions are grouped read-only cards.
  **Signal Yellow is reserved for the Approve (points) button** — every other submit is teal.
- **V2 (`/admin-lab/members/[id]`)** — the same record as **one single scannable page**: a sticky
  dark-teal identity header (avatar, name/email, status, key facts inline), a **pinned action row**
  (status · award · save · login-as) that stays reachable while scrolling, then **collapsible
  section cards** (Account & meta · Panel questions · Transactions · Consent · Messages) with an
  in-page anchor rail — no tab-hopping. Reached from the members `DetailDrawer` via "Open full
  profile →".

### V2 visual differentiators (`/admin-lab`, `src/components/admin-lab/*`)
V2 reads as a distinct "console" while staying in the same design language:
- **Dark Deep-Teal sidebar** (vs V1's white sidebar) with a small **"LAB"** badge — instantly
  tells you which version you're in.
- **Action hub Home** ("Needs you now" cards) instead of a stats wall.
- **Approval queue**: segmented status filter with counts, bulk €-total confirms, inline member
  risk context (redemption count + account status per row).
- **Filter bar + right `DetailDrawer`** for record detail (Members), replacing crammed row
  buttons; **card grid** for the reward catalogue; **vertical settings-nav** for settings pages.
- **`RowActions`** convention everywhere: one visible primary + overflow menu + destructive
  confirmed.
- **Command palette (⌘K/Ctrl+K)**: jump to any section or a member by id/email.
- **3-step campaign wizard** (Audience → Content → Review), Start gated on a test send.
- Message Center adds **canned multilingual replies** + a **member-context strip**.

### Admin Do / Don't
- **Do** state the stakes on money/bulk/destructive actions ("Approve 12 payouts · €140?").
- **Do** keep the console unlinked from the public site and member area; entry is the cosmetic
  mock login at `/admin/login`.
- **Don't** apply the warm marketing tone, mascot, or gamification here — this surface serves the
  task, not persuasion.
- **Don't** let V2 modify any V1 file — V2 is purely additive so it merges cleanly after backend
  wiring.
