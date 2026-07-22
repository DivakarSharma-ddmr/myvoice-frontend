import { badgeArt } from '@/lib/asset';
import type { Badge } from '@/lib/mockData';

// Locked badges keep their label and stay visible: the set reads as something
// to work towards rather than a secret. Only the internal trigger conditions
// (gamification.ts) stay hidden — those are operational data, not a promise.
export function BadgeTile({ badge, size = 52 }: { badge: Badge; size?: number }) {
  return (
    <div className="text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={badgeArt(badge.id)}
        alt=""
        aria-hidden
        draggable={false}
        width={size}
        height={size}
        loading="lazy"
        decoding="async"
        className="mx-auto block"
        style={{
          width: size,
          height: size,
          objectFit: 'contain',
          filter: badge.earned ? 'none' : 'grayscale(1)',
          opacity: badge.earned ? 1 : 0.4,
        }}
      />
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
