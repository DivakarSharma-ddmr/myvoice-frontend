'use client';
import { useEffect, useState } from 'react';
import { DIAL, dialPath } from '@/lib/clockDial';

/** Animated horizontal progress bar. Fills from 0 to `pct` on mount. */
export function ProgressBar({
  pct,
  color = 'linear-gradient(90deg,#FFCC33,#22A06B)',
  height = 10,
  className,
}: {
  pct: number;
  color?: string;
  height?: number;
  className?: string;
}) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setW(pct), 120);
    return () => clearTimeout(t);
  }, [pct]);
  return (
    <div
      className={className}
      style={{ height, borderRadius: 99, background: 'rgba(0,0,0,.07)', overflow: 'hidden' }}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        style={{
          width: `${w}%`,
          height: '100%',
          background: color,
          borderRadius: 99,
          transition: 'width 1.1s cubic-bezier(.2,.8,.2,1)',
        }}
      />
    </div>
  );
}

/**
 * Animated rounded-square progress frame (SVG).
 *
 * The square sibling of `Ring`, for the dashboard level medallion: both of its
 * faces — the number and the level artwork — are rounded squares, and a
 * circular track around a square face leaves dead corners and forces the art
 * to shrink to the inscribed square. Matching the frame to the faces lets them
 * fill it.
 *
 * Drawn as a path rather than a `<rect>` because it is read as a clock face:
 * a rect's outline starts at the top-LEFT corner, so the fill would begin at
 * half past ten. `dialPath()` starts at top centre and runs clockwise, and
 * `pathLength="100"` normalises the perimeter so `pct` is a plain percentage
 * regardless of the corner arcs. See src/lib/clockDial.ts for how an hour is
 * converted into that percentage.
 */
export function SquareRing({
  pct,
  size = 120,
  stroke = DIAL.stroke,
  radius = DIAL.radius,
}: {
  pct: number;
  size?: number;
  stroke?: number;
  radius?: number;
}) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setVal(pct), 140);
    return () => clearTimeout(t);
  }, [pct]);
  const d = dialPath({ stroke, radius });
  const common = { d, fill: 'none', strokeWidth: stroke, pathLength: 100 };
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden>
      <path {...common} stroke="rgba(255,255,255,.2)" />
      <path
        {...common}
        stroke="#FFCC33"
        strokeLinecap="round"
        strokeDasharray="100"
        strokeDashoffset={100 - val}
        style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(.2,.8,.2,1)' }}
      />
    </svg>
  );
}

/** Animated circular progress ring (SVG). */
export function Ring({ pct, size = 120, stroke = 9 }: { pct: number; size?: number; stroke?: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setVal(pct), 140);
    return () => clearTimeout(t);
  }, [pct]);
  const r = 44;
  const c = 2 * Math.PI * r;
  const off = c * (1 - val / 100);
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden>
      <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,.2)" strokeWidth={stroke} />
      <circle
        cx="50"
        cy="50"
        r={r}
        fill="none"
        stroke="#FFCC33"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={off}
        transform="rotate(-90 50 50)"
        style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(.2,.8,.2,1)' }}
      />
    </svg>
  );
}
