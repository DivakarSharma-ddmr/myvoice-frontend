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
export function LevelMedallion({
  level,
  size = 92,
  intervalMs = 4500,
}: {
  level: number;
  size?: number;
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
    borderRadius: '50%',
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
            <span className="text-[34px] font-extrabold leading-none text-white">{level}</span>
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
            objectFit: 'cover',
            // A hairline keeps the cream artwork from bleeding into the ring's
            // own stroke on the dark hero.
            boxShadow: 'inset 0 0 0 2px rgba(255,255,255,.25)',
          }}
        />
      </div>
    </div>
  );
}
