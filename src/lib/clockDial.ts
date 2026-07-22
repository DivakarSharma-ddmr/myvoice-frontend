// Geometry for the level dial — the rounded-square progress frame around the
// dashboard level medallion, read like a clock face: level 1 fills to one
// o'clock, level 2 to two o'clock, level 12 all the way round.
//
// The subtlety is that a clock hour is an ANGLE but a stroke-dash is an ARC
// LENGTH, and on a square those two do not scale together. One twelfth of the
// perimeter is not the same place as a 30° ray: on this frame one o'clock sits
// at 8.09% of the way round rather than 8.33%. The gap is small here only
// because the corners are heavily rounded — square it off and it widens.
// Dividing the perimeter into twelve equal parts would look plausible on its
// own but drift against a real clock, so each hour's stop is solved from its
// true angle instead.
//
// Deliberately dependency-free (no `@/` imports) so tests can load it directly.

export type DialGeometry = { stroke: number; radius: number };

/** Matches the SquareRing defaults; both draw the same 100-unit viewBox. */
export const DIAL: DialGeometry = { stroke: 9, radius: 25 };

const VIEW = 100;
const HOURS = 12;

type Segment =
  | { kind: 'line'; x0: number; y0: number; x1: number; y1: number; len: number }
  | { kind: 'arc'; cx: number; cy: number; r: number; t0: number; len: number };

/**
 * The outline as an ordered list of segments, starting at TOP CENTRE and
 * running clockwise. Starting at the top is what makes it a clock; an SVG
 * `<rect>` starts at the top-left corner instead, which is why this is drawn
 * as a path.
 */
function segments({ stroke, radius: r }: DialGeometry): Segment[] {
  const lo = stroke / 2;
  const hi = VIEW - stroke / 2;
  const mid = VIEW / 2;
  const quarter = (Math.PI / 2) * r;
  const line = (x0: number, y0: number, x1: number, y1: number): Segment => ({
    kind: 'line',
    x0,
    y0,
    x1,
    y1,
    len: Math.hypot(x1 - x0, y1 - y0),
  });
  const arc = (cx: number, cy: number, t0: number): Segment => ({
    kind: 'arc',
    cx,
    cy,
    r,
    t0,
    len: quarter,
  });
  return [
    line(mid, lo, hi - r, lo), // top edge, right half
    arc(hi - r, lo + r, -Math.PI / 2), // top-right corner
    line(hi, lo + r, hi, hi - r), // right edge
    arc(hi - r, hi - r, 0), // bottom-right corner
    line(hi - r, hi, lo + r, hi), // bottom edge (right to left)
    arc(lo + r, hi - r, Math.PI / 2), // bottom-left corner
    line(lo, hi - r, lo, lo + r), // left edge
    arc(lo + r, lo + r, Math.PI), // top-left corner
    line(lo + r, lo, mid, lo), // top edge, left half
  ];
}

function perimeter(segs: Segment[]): number {
  return segs.reduce((a, s) => a + s.len, 0);
}

/** The point at arc length `s` along the outline. Screen coords, y down. */
function pointAt(segs: Segment[], s: number): [number, number] {
  let left = s;
  for (const seg of segs) {
    if (left > seg.len) {
      left -= seg.len;
      continue;
    }
    const f = seg.len === 0 ? 0 : left / seg.len;
    if (seg.kind === 'line') {
      return [seg.x0 + (seg.x1 - seg.x0) * f, seg.y0 + (seg.y1 - seg.y0) * f];
    }
    const t = seg.t0 + f * (Math.PI / 2);
    return [seg.cx + seg.r * Math.cos(t), seg.cy + seg.r * Math.sin(t)];
  }
  const last = segs[segs.length - 1];
  return last.kind === 'line' ? [last.x1, last.y1] : pointAt(segs, s - 1e-9);
}

/** Clockwise angle from twelve o'clock, in radians, of a point on the outline. */
function angleAt(segs: Segment[], s: number): number {
  const [x, y] = pointAt(segs, s);
  const a = Math.atan2(x - VIEW / 2, VIEW / 2 - y);
  return a < 0 ? a + 2 * Math.PI : a;
}

/**
 * Fraction of the perimeter (0–1) at which a clock hour falls.
 *
 * The outline is convex and measured from its own centre, so the angle rises
 * monotonically with arc length and a bisection converges cleanly. Hours 3, 6
 * and 9 land on edge midpoints, which makes them exact quarter-turns and a
 * good invariant to assert.
 */
export function dialFraction(hour: number, geometry: DialGeometry = DIAL): number {
  if (hour <= 0) return 0;
  if (hour >= HOURS) return 1;
  const segs = segments(geometry);
  const total = perimeter(segs);
  const target = (hour / HOURS) * 2 * Math.PI;

  let lo = 0;
  let hi = total;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (angleAt(segs, mid) < target) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2 / total;
}

/** The same stop as a percentage, for a stroke-dash on a `pathLength="100"` path. */
export function dialPercent(hour: number, geometry: DialGeometry = DIAL): number {
  return dialFraction(hour, geometry) * 100;
}

/** The SVG path for the outline: starts at top centre, runs clockwise. */
export function dialPath({ stroke, radius: r }: DialGeometry = DIAL): string {
  const lo = stroke / 2;
  const hi = VIEW - stroke / 2;
  const mid = VIEW / 2;
  const a = (x: number, y: number) => `A ${r} ${r} 0 0 1 ${x} ${y}`;
  return [
    `M ${mid} ${lo}`,
    `L ${hi - r} ${lo}`,
    a(hi, lo + r),
    `L ${hi} ${hi - r}`,
    a(hi - r, hi),
    `L ${lo + r} ${hi}`,
    a(lo, hi - r),
    `L ${lo} ${lo + r}`,
    a(lo + r, lo),
    'Z',
  ].join(' ');
}
