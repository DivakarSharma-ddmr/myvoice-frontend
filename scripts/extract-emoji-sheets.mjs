// Slices the two Captain MyVoice contact sheets into individual PNGs.
//
//   node scripts/extract-emoji-sheets.mjs
//
// Sources live OUTSIDE the repo (the design folder), so this is a one-off
// authoring step, not part of `npm run build` — the outputs are committed.
//
// Panels are found rather than hard-coded: white gutters split the sheet into
// bands, then each band into cells. That survives the sheets being re-exported
// at a different size, which hand-measured rectangles would not.
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const SRC = path.resolve('../Final design/Emoji sets');
const OUT = path.resolve('public/assets');

// Badge ids in the order the rules document lists them, which is the order the
// sheet numbers them (1 = Verified Voice, 27 = Draw Debut).
const BADGE_IDS = [
  'verified-voice', 'reward-ready', 'profile-starter', 'profile-pioneer', 'halfway-heard',
  'full-picture', 'new-chapter', 'invitation-accepted', 'survey-scout', 'every-attempt-counts',
  'quota-navigator', 'back-on-track', 'confirmed-contribution', 'first-earnings', 'reward-step-up',
  'quick-take', 'thoughtful-ten', 'deep-dive', 'feedback-loop', 'first-check-in',
  'daily-sweep', 'three-day-rhythm', 'seven-day-voice', 'shield-activated', 'cashout-ready',
  'first-redemption', 'draw-debut',
];

// The badge sheet is NOT in reading order: 16 and 19 were moved to the last
// row. This is the printed number of each panel, read left-to-right and
// top-to-bottom, so panels are matched by their label rather than position.
const BADGE_READING_ORDER = [
  1, 2, 3, 4, 5,
  6, 7, 8, 9, 10,
  11, 12, 13, 14, 15,
  17, 18, 20, 21, 22,
  23, 24, 25, 26, 27,
  16, 19,
];

const INK = 245; // below this a pixel counts as content, not paper
const MIN_BAND = 40; // ignore runs shorter than this (caption lines, stray marks)
const MIN_CELL = 40;
// These are line drawings with flat fills, so a 128-colour palette is visually
// indistinguishable from truecolour at the sizes they are displayed (checked
// against the hardest case, the level-12 sunburst and the sunrise badge) and
// cuts the set from 3.8 MB to well under 1 MB. The audience is explicitly a
// mid-range phone on a slow connection.
const PNG = { compressionLevel: 9, palette: true, colours: 128 };

// The badge sheet has no cell borders, so a small gap inside one drawing (the
// coin flying out of the wallet in 26) must be merged back. The level sheet
// has solid black frames whose gutters are as narrow as 5px, so merging there
// would fuse neighbouring panels — hence per-sheet values.
const BADGE_MERGE_GAP = 20;
const LEVEL_MERGE_GAP = 0;

function runs(profile, length, threshold, min) {
  const out = [];
  let start = null;
  for (let i = 0; i < length; i++) {
    if (profile[i] >= threshold) {
      if (start === null) start = i;
    } else if (start !== null) {
      if (i - start > min) out.push([start, i - 1]);
      start = null;
    }
  }
  if (start !== null && length - start > min) out.push([start, length - 1]);
  return out;
}

function mergeClose(spans, gap) {
  const out = [];
  for (const s of spans) {
    const last = out[out.length - 1];
    if (last && s[0] - last[1] <= gap) last[1] = s[1];
    else out.push([...s]);
  }
  return out;
}

/**
 * Every panel on a sheet, in reading order, as a sharp extract rect.
 *
 * `tightenToArt` is for the badge sheet, where each cell is a caption stacked
 * above a drawing and only the drawing is wanted. Two things go wrong without
 * it, and both showed up in the first run:
 *
 *  - the row band is a union across the whole row, so a cell whose drawing
 *    starts lower than its neighbours' keeps its own caption in frame;
 *  - the column profile is also row-wide, so a drawing that reaches further
 *    left or right than the rest of its row gets clipped at the cell edge.
 *
 * So each cell is first widened to the midpoint of the gutter on either side
 * (a neighbouring drawing never crosses that), then reduced to its tallest
 * unbroken run of rows — the drawing, never the one- or two-line caption —
 * and finally tightened to the ink inside those rows.
 */
async function findPanels(file, { mergeGap, tightenToArt = false }) {
  const { data, info } = await sharp(file)
    .flatten({ background: '#fff' })
    .toColourspace('b-w')
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;
  const ink = (x, y) => data[y * W + x] < INK;

  const rowInk = new Array(H).fill(0);
  for (let y = 0; y < H; y++) {
    let c = 0;
    for (let x = 0; x < W; x++) if (ink(x, y)) c++;
    rowInk[y] = c;
  }

  const panels = [];
  for (const [y0, y1] of runs(rowInk, H, W * 0.01, MIN_BAND)) {
    const bandH = y1 - y0 + 1;
    const colInk = new Array(W).fill(0);
    for (let y = y0; y <= y1; y++)
      for (let x = 0; x < W; x++) if (ink(x, y)) colInk[x]++;
    const cells = mergeClose(runs(colInk, W, bandH * 0.01, MIN_CELL), mergeGap);

    cells.forEach(([x0, x1], i) => {
      if (!tightenToArt) {
        panels.push({ left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 });
        return;
      }
      // Step one, rows: measured inside the cell's OWN columns. Widening first
      // would drag in the neighbouring drawing, whose rows are continuous, and
      // that welds the caption to the art as a single unbroken run.
      const cellRows = new Array(bandH).fill(0);
      for (let y = y0; y <= y1; y++) {
        let c = 0;
        for (let x = x0; x <= x1; x++) if (ink(x, y)) c++;
        cellRows[y - y0] = c;
      }
      const blocks = runs(cellRows, bandH, 1, 8);
      if (!blocks.length) throw new Error(`empty cell at band y=${y0}, x=${x0}`);
      const [ay0, ay1] = blocks.reduce((a, b) => (b[1] - b[0] > a[1] - a[0] ? b : a));
      const top = y0 + ay0;
      const bottom = y0 + ay1;

      // Step two, columns: now that only the drawing's rows are in play, grow
      // outwards while there is unbroken ink. The blank gutter stops the walk,
      // so a drawing that overhangs its row's column band is recovered without
      // ever reaching the neighbour.
      const colHasInk = (x) => {
        for (let y = top; y <= bottom; y++) if (ink(x, y)) return true;
        return false;
      };
      let left = x0;
      let right = x1;
      while (left > 0 && colHasInk(left - 1)) left--;
      while (right < W - 1 && colHasInk(right + 1)) right++;
      while (left < right && !colHasInk(left)) left++;
      while (right > left && !colHasInk(right)) right--;

      panels.push({ left, top, width: right - left + 1, height: bottom - top + 1 });
    });
  }
  return panels;
}

/**
 * Makes the paper around the drawing transparent by flooding inwards from the
 * edges. A plain "white becomes transparent" pass would punch holes in every
 * speech bubble, sheet of paper and eye highlight; only paper connected to the
 * outside is background.
 */
function floodTransparent(rgba, W, H, tol = 232) {
  const isPaper = (i) => rgba[i] >= tol && rgba[i + 1] >= tol && rgba[i + 2] >= tol;
  const seen = new Uint8Array(W * H);
  const stack = [];
  for (let x = 0; x < W; x++) {
    stack.push(x, (H - 1) * W + x);
  }
  for (let y = 0; y < H; y++) {
    stack.push(y * W, y * W + W - 1);
  }
  while (stack.length) {
    const p = stack.pop();
    if (seen[p]) continue;
    const i = p * 4;
    if (!isPaper(i)) continue;
    seen[p] = 1;
    rgba[i + 3] = 0;
    const x = p % W;
    const y = (p - x) / W;
    if (x > 0) stack.push(p - 1);
    if (x < W - 1) stack.push(p + 1);
    if (y > 0) stack.push(p - W);
    if (y < H - 1) stack.push(p + W);
  }
}

/** Squares a panel by padding the short side, then resizes. */
async function square(buffer, size, background) {
  const meta = await sharp(buffer).metadata();
  const side = Math.max(meta.width, meta.height);
  return sharp({
    create: { width: side, height: side, channels: 4, background },
  })
    .composite([
      {
        input: buffer,
        left: Math.round((side - meta.width) / 2),
        top: Math.round((side - meta.height) / 2),
      },
    ])
    .png()
    .toBuffer()
    .then((b) => sharp(b).resize(size, size).png(PNG).toBuffer());
}

async function extractBadges() {
  const file = path.join(SRC, 'Final Badges.png');
  const panels = await findPanels(file, { mergeGap: BADGE_MERGE_GAP, tightenToArt: true });
  if (panels.length !== 27) throw new Error(`expected 27 badge panels, found ${panels.length}`);

  const dir = path.join(OUT, 'badges');
  await mkdir(dir, { recursive: true });

  for (let i = 0; i < panels.length; i++) {
    const number = BADGE_READING_ORDER[i];
    const id = BADGE_IDS[number - 1];
    const pad = 12; // a little air so the flood fill has paper to start from
    const p = panels[i];
    const { data, info } = await sharp(file)
      .extract(p)
      .extend({ top: pad, bottom: pad, left: pad, right: pad, background: '#fff' })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    floodTransparent(data, info.width, info.height);
    const cut = await sharp(data, {
      raw: { width: info.width, height: info.height, channels: 4 },
    })
      .png()
      .toBuffer();
    const out = await square(cut, 256, { r: 0, g: 0, b: 0, alpha: 0 });
    await writeFile(path.join(dir, `${id}.png`), out);
    console.log(`badge ${String(number).padStart(2)} → ${id}.png (${p.width}x${p.height})`);
  }
}

async function extractLevels() {
  const file = path.join(SRC, 'Final Levels.png');
  const panels = await findPanels(file, { mergeGap: LEVEL_MERGE_GAP });
  if (panels.length !== 13) throw new Error(`expected 13 level panels, found ${panels.length}`);

  const dir = path.join(OUT, 'levels');
  await mkdir(dir, { recursive: true });

  for (let i = 0; i < panels.length; i++) {
    // Level panels are framed illustrations with their own background, so the
    // border is trimmed and the artwork kept whole — no transparency pass.
    const inset = 8;
    const p = panels[i];
    const cut = await sharp(file)
      .extract({ left: p.left + inset, top: p.top + inset, width: p.width - inset * 2, height: p.height - inset * 2 })
      .png()
      .toBuffer();
    // Centre-cropped to square rather than letterboxed: these are displayed in
    // a circular medallion, and a padded landscape image inscribed in a circle
    // shows nothing but background bars.
    const out = await sharp(cut)
      .resize(256, 256, { fit: 'cover', position: 'centre' })
      .png(PNG)
      .toBuffer();
    await writeFile(path.join(dir, `${i}.png`), out);
    console.log(`level ${i} → ${i}.png (${p.width}x${p.height})`);
  }
}

await extractBadges();
await extractLevels();
console.log('done');
