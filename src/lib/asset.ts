/**
 * Prefix a public asset path with the configured basePath so images resolve
 * correctly whether the site is served at the domain root or under
 * /myvoice-frontend on GitHub Pages.
 *
 * Usage: <img src={asset('/assets/logo.jpg')} />
 */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export function asset(path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${BASE}${clean}`;
}

/** Captain MyVoice icon set lives in /public/assets/cap/<name>.png */
export function capIcon(name: string): string {
  return asset(`/assets/cap/${name}.png`);
}
