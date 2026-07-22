/**
 * Prefix a public asset path with the configured basePath so images resolve
 * correctly whether the site is served at the domain root or under
 * /myvoice-frontend on GitHub Pages.
 *
 * Usage: <img src={asset('/assets/logo.webp')} />
 */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export function asset(path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${BASE}${clean}`;
}

/** Captain MyVoice icon set lives in /public/assets/cap/<name>.webp */
export function capIcon(name: string): string {
  return asset(`/assets/cap/${name}.webp`);
}

/**
 * Bespoke Captain artwork per badge, sliced from the "Final Badges" sheet by
 * scripts/extract-emoji-sheets.mjs. Filename is the badge id from
 * gamification.ts, so there is no second mapping to keep in step.
 */
export function badgeArt(id: string): string {
  return asset(`/assets/badges/${id}.webp`);
}

/** Level artwork, 0–12, from the "Final Levels" sheet. */
export function levelArt(level: number): string {
  return asset(`/assets/levels/${level}.webp`);
}
