'use client';
import { useState } from 'react';
import { asset } from '@/lib/asset';

export type Pose = 'announce' | 'point' | 'cheer' | 'wave' | 'flag' | 'winner';

// pose -> [image file (without ext), animation class]
const POSE: Record<Pose, [string, string]> = {
  announce: ['captain-announce', 'animate-mbob'],
  point: ['captain-announce', 'animate-mpoint'],
  cheer: ['captain-cheer', 'animate-mcheer'],
  wave: ['captain-cheer', 'animate-mwave'],
  flag: ['captain-cheer', 'animate-mbob'],
  winner: ['captain-winner', 'animate-mcheer'],
};

/** Animated Captain MyVoice mascot with an optional speech bubble. */
export function Mascot({
  size = 104,
  pose = 'cheer',
  bubble,
}: {
  size?: number;
  pose?: Pose;
  bubble?: string;
}) {
  const [broken, setBroken] = useState(false);
  const [file, anim] = POSE[pose] ?? POSE.cheer;

  const fig = (
    <div
      className={anim}
      style={{ transformOrigin: 'bottom center', display: 'inline-block', filter: 'drop-shadow(0 10px 16px rgba(31,79,79,.22))' }}
    >
      {broken ? (
        // Fallback if the PNG is missing
        <svg width={size} height={size} viewBox="0 0 120 120" fill="none" aria-hidden>
          <path d="M44 52 L86 32 L86 108 L44 88 Z" fill="#336666" />
          <circle cx="60" cy="64" r="7" fill="#fff" />
          <circle cx="74" cy="60" r="7" fill="#fff" />
          <path d="M96 50c7 6 7 22 0 30" stroke="#FFCC33" strokeWidth="5" strokeLinecap="round" />
        </svg>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={asset(`/assets/${file}.png`)}
          alt="Captain MyVoice"
          onError={() => setBroken(true)}
          style={{ width: size, height: size, objectFit: 'contain', display: 'block' }}
        />
      )}
    </div>
  );

  if (!bubble) return fig;
  return (
    <div className="flex flex-col items-center gap-2">
      {fig}
      <div className="max-w-[168px] rounded-xl bg-white px-3 py-2 text-center text-xs font-bold text-dteal shadow-soft">
        {bubble}
      </div>
    </div>
  );
}
