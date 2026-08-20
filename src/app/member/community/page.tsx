'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useMember } from '@/components/member/MemberProvider';
import { Mascot } from '@/components/ui/Mascot';
import { CapIcon, IconLabel } from '@/components/ui/CapIcon';
import { DrawExplainer } from '@/components/member/DrawExplainer';
import { latestDrawMonth } from '@/content/drawWinners';
import { communityStats, draw, memberTips } from '@/lib/mockData';

export default function CommunityPage() {
  const m = useMember();
  const [explainer, setExplainer] = useState(false);

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
        {communityStats.map((s, i) => (
          <div key={i} className="rounded-2xl2 border border-bd bg-white p-5 text-center">
            <div className="flex justify-center">
              <CapIcon name={s.icon} size={48} radius={12} />
            </div>
            <div className="mt-1 text-[28px] font-extrabold text-dteal">{s.value}</div>
            <div className="text-xs font-semibold text-mute">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Draw */}
      <div
        className="flex items-center gap-4 rounded-2xl2 bg-dgreen p-6 text-white"
      >
        <div className="hidden sm:block">
          <Mascot size={104} pose="winner" />
        </div>
        <div className="flex-1">
          {/* No uppercase tracked eyebrow (DESIGN.md No-Eyebrow Rule) and no
              decorative yellow — the headline carries it, and yellow is spent
              on the button below. */}
          <h3 className="text-xl font-extrabold">
            You’re in the monthly Click Draw with {m.tickets}{' '}
            {m.tickets === 1 ? 'entry' : 'entries'}
          </h3>
          <p className="mt-1.5 text-[13px] leading-snug text-[#BFE0E0]">
            Next draw {draw.date} · {draw.prize}. You earn an entry every time a survey ends in a
            screenout, a full quota, or because it had already closed.
          </p>
          <button
            onClick={() => setExplainer(true)}
            className="mt-3 rounded-[11px] bg-yel px-4 py-2.5 text-[13px] font-bold text-ink"
          >
            How the draw works
          </button>
        </div>
      </div>

      {/* Tips */}
      <div className="rounded-2xl2 border border-bd bg-white p-5">
        <h3 className="mb-3 text-base font-extrabold">
          <IconLabel name="u2-idea" text="Member tips" size={22} />
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {memberTips.map((t, i) => (
            <div key={i} className="flex items-start gap-2 rounded-xl bg-cream p-3">
              <span aria-hidden="true" className="font-extrabold text-green">
                ✓
              </span>
              <span className="text-[13px] font-bold leading-snug">{t[0]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Winners */}
      <Link
        href="/member/community/winners"
        className="flex items-center gap-4 rounded-2xl2 border border-bd bg-white p-5 transition hover:border-teal"
      >
        <span
          aria-hidden="true"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-syel text-lg"
        >
          🏆
        </span>
        <span className="flex-1">
          <span className="block text-sm font-extrabold text-ink">
            {latestDrawMonth.label} Click Draw winners are in
          </span>
          <span className="mt-0.5 block text-xs text-mute">
            {latestDrawMonth.winners.length} members won — check the complete list
          </span>
        </span>
        <span aria-hidden="true" className="shrink-0 font-extrabold text-teal">
          →
        </span>
      </Link>

      <DrawExplainer open={explainer} onClose={() => setExplainer(false)} />
    </div>
  );
}
