'use client';
import { useEffect, useState } from 'react';
import { levelArt } from '@/lib/asset';

/**
 * The level marker inside the dashboard XP ring. It flips continuously between
 * the level number and that level's Captain artwork.
 *
 * The number is the front face and the initial state, so the server-rendered
 * HTML and the first client render agree, and so a member who never sees the
 * flip (reduced motion, a paused tab, a screenshot) still gets the fact rather
 * than the decoration.
 */
// Sized to sit concentrically inside the 120px SquareRing: a 9px stroke plus a
// 3px breathing gap leaves 96px, and the corner radius steps down by the same
// 12px inset (30 → 18) so the two shapes stay parallel. Both faces are that
// square, so the number and the artwork occupy exactly the same area and the
// flip has nothing to resize.
export function LevelMedallion({
  level,
  size = 96,
  radius = 22,
  intervalMs = 4500,
}: {
  level: number;
  size?: number;
  radius?: number;
  intervalMs?: number;
}) {
  const [showArt, setShowArt] = useState(false);

  useEffect(() => {
    // Continuous motion is exactly what prefers-reduced-motion is for: no
    // interval at all, rather than a flip that snaps. The global CSS rule
    // would kill the transition but not the state change.
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motion.matches) return;
    const t = setInterval(() => setShowArt((v) => !v), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);

  const face: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    display: 'grid',
    placeItems: 'center',
    borderRadius: radius,
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
  };

  return (
    <div style={{ width: size, height: size, perspective: 700 }}>
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          transition: 'transform 750ms cubic-bezier(.2,.8,.2,1)',
          transform: showArt ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        <div style={face}>
          <div className="flex flex-col items-center">
            <span className="text-[11px] font-bold tracking-wide text-[#BFE0E0]">LEVEL</span>
            <span className="text-[38px] font-extrabold leading-none text-white">{level}</span>
          </div>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={levelArt(level)}
          alt=""
          aria-hidden
          draggable={false}
          width={size}
          height={size}
          style={{
            ...face,
            transform: 'rotateY(180deg)',
            width: size,
            height: size,
            // The panel is letterboxed to square at export with its own
            // background colour, so `cover` here crops nothing.
            objectFit: 'cover',
            // A hairline separates the cream artwork from the dark hero behind
            // the ring.
            boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,.3)',
          }}
        />
      </div>
    </div>
  );
}
