/**
 * Post-build: stamp the service worker cache key with a unique build id.
 *
 * `next build` copies public/sw.js to out/sw.js verbatim, leaving the
 * `__BUILD_ID__` placeholder. We rewrite that placeholder in the *output*
 * file only (the source keeps the placeholder) so every deploy ships a SW
 * with a new CACHE name. The browser sees changed bytes, installs the new
 * SW, and its `activate` handler purges all older caches — guaranteeing no
 * stale page (e.g. an old login screen) survives a deploy.
 *
 * Build id prefers the commit SHA (stable + traceable) and falls back to a
 * timestamp when git isn't available (e.g. a tarball build).
 */
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const swPath = resolve(process.cwd(), 'out', 'sw.js');

if (!existsSync(swPath)) {
  console.warn('[stamp-sw] out/sw.js not found — skipping (did `next build` run?).');
  process.exit(0);
}

let id;
try {
  id = execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
    .toString()
    .trim();
} catch {
  id = '';
}
if (!id) id = String(Date.now());

const buildId = `myvoice-${id}`;
const src = readFileSync(swPath, 'utf8');

if (!src.includes('__BUILD_ID__')) {
  console.warn('[stamp-sw] placeholder __BUILD_ID__ not found in out/sw.js — already stamped?');
  process.exit(0);
}

writeFileSync(swPath, src.replace(/__BUILD_ID__/g, buildId), 'utf8');
console.log(`[stamp-sw] CACHE stamped as "${buildId}".`);
