import { badgeArt } from '@/lib/asset';
import type { Badge } from '@/lib/mockData';

// Locked badges keep their label and stay visible: the set reads as something
// to work towards rather than a secret. Only the internal trigger conditions
// (gamification.ts) stay hidden — those are operational data, not a promise.
//
// Every badge sits in the same sand tile. Three of the 27 (First Check-In, Deep
// Dive, Feedback Loop) are drawn as full-bleed scenes rather than cut-out
// figures, and loose on a white card they read as photographs dropped among
// drawings. A shared frame makes the difference stop looking like a mistake:
// each one is then a picture in a tile, not an odd tile.
export function BadgeTile({ badge, size = 72 }: { badge: Badge; size?: number }) {
  const art = Math.round(size * 0.82);
  return (
    <div className="text-center">
      <div
        className="mx-auto grid place-items-center overflow-hidden"
        style={{
          width: size,
          height: size,
          borderRadius: Math.round(size * 0.24),
          background: badge.earned ? '#FBF4E6' : '#F4F3EF',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={badgeArt(badge.id)}
          alt=""
          aria-hidden
          draggable={false}
          width={art}
          height={art}
          loading="lazy"
          decoding="async"
          className="block"
          style={{
            width: art,
            height: art,
            objectFit: 'contain',
            filter: badge.earned ? 'none' : 'grayscale(1)',
            opacity: badge.earned ? 1 : 0.45,
          }}
        />
      </div>
      {/* Locked labels stay at Mute (4.5:1 on white) rather than fading further
          — the lock is carried by the grayscale art, not by unreadable text. */}
      <div
        className="mt-1.5 text-[11px] font-semibold leading-snug"
        style={{ color: badge.earned ? '#475467' : '#667085' }}
      >
        {badge.label}
        {/* Earned state is carried by more than the grayscale + fade, so it
            survives for screen readers and colour-blind members. */}
        <span className="sr-only">{badge.earned ? ' — earned' : ' — not earned yet'}</span>
      </div>
    </div>
  );
}
