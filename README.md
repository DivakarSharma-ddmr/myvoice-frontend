# MyVoice — Website + Member Platform (Frontend)

A fully responsive, production-structured **frontend** for **MyVoice by DataDiggers** — the public marketing website plus the logged-in member platform. Built from the approved Claude Design directions (**"Bloom"** public site + **"Quest"** member platform).

It runs entirely on **realistic mock data** today, so stakeholders can click through a working site. Your dev team then swaps the mock-data layer for real APIs (Laravel / MongoDB / Node) — no UI rewrite needed.

> **Status:** Frontend + mock data complete. Backend not connected yet (by design).

---

## ✨ What's inside

**Public website** (`/`) — 10 pages
Home · How it works · Rewards · Why join · Trust & privacy · FAQ · Learn (blog) · Country landing pages (`/paid-surveys/[country]`) · Login · Join (3-step sign-up).

**Member platform** (`/member/*`) — 9 screens, fully interactive on mock data
Dashboard (levels / XP / streak / daily quests / badges) · Surveys (all 7 states + survey modal) · Rewards wallet (3-step redeem flow + confetti) · Profile (12 sections + conversational form) · Community (draw + live poll + announcements) · Referrals (5-stage tracker) · Help Center (search + contact + tickets) · Settings (notification toggles, privacy, delete) · Onboarding/Welcome — all with **Captain MyVoice** mascot, toasts, level-up and confetti animations.

Responsive across **1920 / 1440 / 1366 / 1280 / 768 / 414 / 390 / 375 px** (desktop sidebar ↔ mobile bottom-nav).

---

## 🧱 Tech stack

| Layer | Choice |
| --- | --- |
| Framework | **Next.js 14** (App Router) |
| Language | **TypeScript** |
| Styling | **Tailwind CSS** + brand tokens |
| Fonts | Plus Jakarta Sans (UI) + Inter (body) via `next/font` |
| Output | **Static export** (`output: 'export'`) — hostable anywhere, no Node server |
| PWA | Web manifest + service worker (installable, offline shell) |

Brand: Teal `#336666` / Yellow `#FFCC33` (see `tailwind.config.ts`, `src/lib/theme.ts`).

---

## 🚀 Run locally

```bash
npm install
npm run dev      # http://localhost:3000
```

Build the static site (outputs to `out/`):

```bash
npm run build
```

> Locally the app runs at the **root path**. The production build uses a base path
> of `/myvoice-frontend` for GitHub Pages — see *Deployment* below.

---

## 📁 Project structure

```
src/
  app/
    (site)/            # Public website (header + footer chrome)
      page.tsx                 # Home
      how-it-works/ rewards/ why-join/ trust-privacy/ faq/ learn/
      paid-surveys/[country]/  # SEO country pages (static per country)
      login/ join/
    member/            # Logged-in platform (sidebar + topbar + bottom-nav)
      layout.tsx               # Wraps MemberProvider + MemberShell
      dashboard/ surveys/ rewards/ profile/ community/
      referrals/ help/ settings/ welcome/
    layout.tsx         # Root: fonts, metadata, PWA register
  components/
    site/              # Header, Footer, TrustBar, hero/section helpers, AuthShell
    member/            # MemberProvider (state), MemberShell (chrome), Overlay (modals/confetti/toasts)
    ui/                # Button, Card, Progress(Bar/Ring), Accordion, CapIcon, Mascot
  lib/
    mockData.ts        # ⭐ SINGLE SOURCE OF CONTENT — replace with API calls
    asset.ts           # basePath-aware asset() helper
    theme.ts clsx.ts
public/
  assets/              # logo, Captain MyVoice poses, cap/ icon set, PWA icons
  manifest.webmanifest  sw.js  .nojekyll
```

---

## 🔌 Connecting the backend (for the dev team)

All content/state flows through **`src/lib/mockData.ts`** and **`src/components/member/MemberProvider.tsx`**. Replace those reads with API calls — the components don't need to change.

Suggested endpoint map (aligns with the Laravel + MongoDB + Node stack in the design doc):

| Screen | Data needed | Likely endpoint |
| --- | --- | --- |
| Auth (login/join) | credentials, registration, email verify | `POST /api/auth/login`, `POST /api/auth/register` |
| Dashboard | level/XP, streak, tickets, quests, top surveys | `GET /api/member/summary` |
| Surveys | available surveys + states (Project/Survey ID, length, reward, device) | `GET /api/surveys` (sync from iControl / Cint) |
| Survey start | redirect to survey | survey `start_url` |
| Rewards | balance (available/pending/lifetime), history, redeem | `GET /api/wallet`, `POST /api/wallet/redeem` |
| Profile | categories + completion, qualification Qs | `GET /api/profile` (questions synced from iControl, qual data via Cint) |
| Community | stats, draw, poll, announcements | `GET /api/community` |
| Referrals | link, friends, statuses | `GET /api/referrals` |
| Help | categories, tickets, contact | `GET/POST /api/support/tickets` |
| Settings | account, notification prefs, consent | `GET/PATCH /api/account` |
| Message Center (future) | live chat | Node + PM2 + Redis (per design doc) |

`MemberProvider` already models the realtime-ish behaviors (reward goes **pending → approved**, XP/level-up, confetti) so wiring is mostly swapping the seed values for fetched ones.

---

## 🌍 Deployment (GitHub Pages — automatic)

A GitHub Actions workflow (`.github/workflows/deploy.yml`) builds the static export and publishes it on every push to `main`.

**One-time setup:** in the repo, go to **Settings → Pages → Build and deployment → Source = GitHub Actions.**

Live URL: `https://<owner>.github.io/myvoice-frontend/`

**Hosting on a custom domain at the root?** Set an environment variable
`NEXT_PUBLIC_BASE_PATH=""` (empty) at build time and the base path disappears.
Change the `repo` constant in `next.config.mjs` if you rename the repository.

---

## 📱 PWA & future mobile app

- Installable today (Add to Home Screen), with an offline shell via `public/sw.js`.
- The member-platform **logic lives in `MemberProvider`** (framework-light, no DOM assumptions) so a future **Expo / React Native** app can reuse the state machine and the `mockData` types directly — only the presentation layer gets rebuilt natively.

---

## ⚠️ Business-critical placeholders to confirm before go-live

Search the codebase for `PLACEHOLDER`. Key ones (all in `src/lib/mockData.ts`):

- **Trust stats** — "2M+ members / 30+ countries / ISO 20252": must be verifiably accurate (this is a trust brand — don't overstate).
- **Testimonials** — names, quotes and video clips are **invented for layout**. Use only real, consented member content.
- **Community / draw numbers** — monthly activity, "€250 prize pool, drawn Jun 30" are illustrative.
- **Reward catalogue** — "20+ brands", PayPal / SEPA / charity availability varies by country.
- **Referral reward** — "€5 each" is illustrative; confirm the real program terms.

---

*Built as a stakeholder-review frontend. Mock data only — not connected to live systems.*
