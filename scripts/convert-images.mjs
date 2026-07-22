// Converts the site's raster assets to WebP and deletes the originals.
//
//   node scripts/convert-images.mjs [--dry]
//
// A one-off authoring step like scripts/extract-emoji-sheets.mjs — the outputs
// are committed. Run it again after dropping new PNGs or JPEGs into public.
//
// Why lossy here and lossless in extract-emoji-sheets.mjs: these are
// anti-aliased, shaded, photographic-ish assets (the icon set, member-platform
// screenshots, the mascot poses). Measured on the icon set, quality 90 is 8.7 KB
// against 72.6 KB for the source PNG and 32.4 KB for lossless WebP. The badge
// and level art is the opposite case — hard edges and flat fills, where
// lossless is both artefact-free and smaller.
import sharp from 'sharp';
import { readdir, stat, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve('public/assets');

// Everything under these paths, plus the loose files listed below.
const DIRS = ['cap', 'screens'];
const FILES = ['captain-announce.png', 'captain-cheer.png', 'captain-winner.png', 'logo.jpg'];

// Left alone deliberately:
//   icons/  — the PWA manifest and apple-touch-icon. Install icons are the one
//             place a PNG is still the safe format across app launchers, and
//             they are fetched once at install, not on every page.
//   videos/ — not images.
const SKIP = new Set(['icons', 'videos', 'badges', 'levels']);

const QUALITY = { quality: 90, effort: 6 };
const dry = process.argv.includes('--dry');

async function convert(file) {
  const ext = path.extname(file);
  if (!/^\.(png|jpe?g)$/i.test(ext)) return null;
  const out = file.slice(0, -ext.length) + '.webp';
  const before = (await stat(file)).size;
  const buf = await sharp(file).webp(QUALITY).toBuffer();
  if (!dry) {
    await writeFile(out, buf);
    await unlink(file);
  }
  return { file: path.relative(ROOT, file), before, after: buf.length };
}

const targets = [];
for (const dir of DIRS) {
  if (SKIP.has(dir)) continue;
  for (const name of await readdir(path.join(ROOT, dir))) {
    targets.push(path.join(ROOT, dir, name));
  }
}
for (const name of FILES) targets.push(path.join(ROOT, name));

let before = 0;
let after = 0;
for (const t of targets) {
  const r = await convert(t);
  if (!r) continue;
  before += r.before;
  after += r.after;
  console.log(
    `${r.file.padEnd(28)} ${(r.before / 1024).toFixed(1).padStart(7)} KB → ${(r.after / 1024)
      .toFixed(1)
      .padStart(6)} KB`
  );
}
const pct = before ? Math.round((1 - after / before) * 100) : 0;
console.log(
  `\n${dry ? '[dry run] ' : ''}${(before / 1024 / 1024).toFixed(2)} MB → ${(after / 1024 / 1024).toFixed(2)} MB (${pct}% smaller)`
);
