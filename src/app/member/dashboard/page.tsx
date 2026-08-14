'use client';
import Link from 'next/link';
import { useMember } from '@/components/member/MemberProvider';
import { CapIcon, IconLabel } from '@/components/ui/CapIcon';
import { SquareRing, ProgressBar } from '@/components/ui/Progress';
import { BadgeTile } from '@/components/member/BadgeTile';
import { LevelMedallion } from '@/components/member/LevelMedallion';
import { badges, draw, profileCompletion, weeklyQuest } from '@/lib/mockData';
import { streakGraceDays } from '@/lib/gamification';
import { dialPercent } from '@/lib/clockDial';

export default function DashboardPage() {
  const m = useMember();
  const xpPct = m.xpPct;
  const doneCount = m.quests.filter((q) => q.done).length;
  const earnedBadges = badges.filter((b) => b.earned);
  const badgePct = Math.round((earnedBadges.length / badges.length) * 100);
  const shieldActive = streakGraceDays(m.level) > 1;

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="relative flex flex-col items-center gap-5 overflow-hidden rounded-3xl2 bg-dgreen p-6 sm:flex-row sm:gap-6">
        <div aria-hidden className="absolute -right-8 -top-10 h-44 w-44 rounded-full bg-yel/[.12]" />
        {/* Frame and faces are the same shape, so the artwork fills the square
            instead of shrinking to fit inside a circle. The frame reads as a
            clock face — level 4 fills to four o'clock — so it shows standing
            in the twelve-level ladder, while the bar below it shows XP within
            the current level. Two different questions, two different marks. */}
        <div className="relative grid h-[120px] w-[120px] shrink-0 place-items-center">
          <SquareRing pct={dialPercent(m.level)} size={120} />
          <div className="absolute">
            <LevelMedallion level={m.level} />
          </div>
        </div>
        <div className="relative flex-1 text-center sm:text-left">
          <div className="text-[13px] font-bold text-yel">{m.rank.toUpperCase()}</div>
          <div className="mt-0.5 text-2xl font-extrabold text-white">{m.xpInto} / {m.xpMax} XP</div>
          <div className="mt-1 text-[13px] text-[#BFE0E0]">
            {m.xpToNext === null
              ? 'Top level reached'
              : `${m.xpToNext} XP to Level ${m.level + 1}`}
            {' — '}
            {m.tickets} draw {m.tickets === 1 ? 'entry' : 'entries'} earned
          </div>
          <div className="mx-auto mt-2.5 max-w-[420px] sm:mx-0">
            <ProgressBar pct={xpPct} color="linear-gradient(90deg,#FFCC33,#FFE9A6)" />
          </div>
          {/* The only level perk shown to members, and only once it is already
              active. The ladder itself, the XP formulas and the bonus draw
              entries stay internal — see PRODUCT.md, "Gamification Data". */}
          {shieldActive && (
            <div className="mt-2.5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[12px] font-bold text-[#DCEFEF]">
              <span aria-hidden="true">🛡</span>
              Streak shield active — a missed day won’t reset you
            </div>
          )}
        </div>
      </div>

      {/* Surveys for you — lifted directly under the hero: the member's
          reason to be here comes first, laid out two-up so several fit above
          the fold. */}
      <div>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-[17px] font-extrabold"><IconLabel name="u1-share" text="Surveys for you" size={24} /></h2>
          <Link href="/member/surveys" className="shrink-0 rounded-[10px] border border-bd bg-white px-4 py-2.5 text-[13px] font-bold text-teal">See all surveys →</Link>
        </div>
        {m.surveys.length ? (
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            {m.surveys.map((sv) => (
              <div key={sv.id} className="flex items-center gap-3 rounded-2xl border border-bd bg-white p-3.5">
                <CapIcon name={sv.icon} size={42} />
                <div className="min-w-0 flex-1">
                  <div className="text-[15px] font-bold">Project {sv.projectId} · Survey {sv.surveyId}</div>
                  <div className="text-xs text-mute">⏱ {sv.time} min · {m.fmt(sv.reward)} · +{sv.xp} XP</div>
                </div>
                <button onClick={() => m.openSurvey({ id: sv.id, topic: sv.topic, reward: sv.reward, xp: sv.xp }, null)}
                  className="shrink-0 rounded-[10px] bg-teal px-5 py-2.5 text-[13px] font-bold text-white">Start</button>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-bd bg-white p-6 text-center">
            <div className="flex justify-center"><CapIcon name="r1-celebrate" size={58} radius={14} /></div>
            <div className="mt-1.5 text-sm font-bold">All surveys done — legend!</div>
          </div>
        )}
      </div>

      {/* Daily quests · This week · Badges — three parallel columns, kept
          deliberately compact so the whole row sits under the surveys without
          dominating them. Each answers a different question: what's on today,
          how the week is going, what's been earned. */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.15fr_.9fr_1fr]">
        {/* Daily quests — compact rows: icon, title, XP, and a small action
            button beside the heading rather than a full-width bar. */}
        <div>
          <div className="mb-2.5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
            <div>
              <h2 className="text-[15px] font-extrabold"><IconLabel name="u2-target" text="Daily quests" size={22} /></h2>
              {/* The rotation is the point: say so, so an unfinished quest reads
                  as "there'll be another" rather than something missed. */}
              <p className="mt-0.5 text-[12px] text-mute">A new set arrives every morning.</p>
            </div>
            <span className="text-[12px] font-bold text-gold">{doneCount}/{m.quests.length} complete</span>
          </div>
          <div className="flex flex-col gap-2.5">
            {m.quests.map((q) => (
              <div key={q.id} className="flex items-center gap-2.5 rounded-xl2 border-[1.5px] bg-white p-2.5" style={{ borderColor: q.done ? '#CFE7CF' : '#F1ECDB' }}>
                {q.done ? (
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#E7F6EF] text-base font-extrabold text-green">✓</span>
                ) : (
                  <CapIcon name={q.icon} size={32} />
                )}
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-bold leading-tight">{q.title}</div>
                  <div className="mt-0.5 text-[11px] font-extrabold text-gold">+{q.xp} XP</div>
                </div>
                <button onClick={q.done ? undefined : () => m.completeQuest(q)} disabled={q.done}
                  className="shrink-0 rounded-lg px-3 py-1.5 text-[12px] font-bold disabled:cursor-default"
                  style={{ background: q.done ? '#E7F6EF' : '#FFCC33', color: q.done ? '#22A06B' : '#1C2526' }}>
                  {q.done ? 'Done' : q.kind === 'survey' ? 'Start →' : 'Claim'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* This week — one weekly goal on its own clock. Shown as a step ladder
            rather than a claim button: nothing to press, just somewhere the
            week's attempts add up toward the reset. */}
        <div className="rounded-2xl2 border border-bd bg-white p-4">
          <div className="flex flex-col items-center text-center">
            <CapIcon name={weeklyQuest.icon} size={40} />
            <div className="mt-2 text-[13.5px] font-bold leading-snug">This week: {weeklyQuest.objective}</div>
          </div>
          <div className="relative mx-auto mt-3.5 max-w-[190px]">
            <span className="absolute left-[6px] top-1.5 bottom-1.5 w-px -translate-x-1/2 bg-bd" aria-hidden="true" />
            <ul className="relative space-y-2.5">
              {Array.from({ length: weeklyQuest.target }).map((_, i) => {
                const done = i < weeklyQuest.progress;
                return (
                  <li key={i} className="flex items-center gap-3">
                    <span className={`z-10 grid h-3 w-3 place-items-center rounded-full border-2 ${done ? 'border-green bg-green' : 'border-bd bg-white'}`} />
                    <span className={`text-[12px] font-semibold ${done ? 'text-ink' : 'text-mute'}`}>Level {i + 1}</span>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="mt-3.5 text-center text-[12px] font-bold text-gold">{weeklyQuest.progress} of {weeklyQuest.target}</div>
          <div className="mt-1 text-center text-[11px] text-mute">Resets in {weeklyQuest.resetsIn} · +{weeklyQuest.xp} XP when it is done</div>
        </div>

        {/* Badges — a summary, not a catalogue: the dashboard answers "how am I
            doing?" in one glance and sends the full 27-tile set to its own page. */}
        <div className="rounded-2xl2 border border-bd bg-white p-4">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-[15px] font-extrabold"><IconLabel name="r1-celebrate" text="Badges" size={20} /></h2>
            <span className="shrink-0 text-[12px] font-extrabold text-teal">{earnedBadges.length} of {badges.length}</span>
          </div>
          <div className="mt-2"><ProgressBar pct={badgePct} color="linear-gradient(90deg,#336666,#22A06B)" height={7} /></div>

          {earnedBadges.length ? (
            <>
              <div className="mt-3 grid grid-cols-3 gap-x-2 gap-y-2.5">
                {earnedBadges.slice(0, 6).map((b) => (
                  <BadgeTile key={b.id} badge={b} size={56} />
                ))}
              </div>
              {earnedBadges.length > 6 && (
                <div className="mt-2.5 text-[12px] text-mute">
                  and {earnedBadges.length - 6} more earned
                </div>
              )}
            </>
          ) : (
            <div className="mt-3 text-[12px] leading-snug text-mute">
              No badges yet. Finish a profile section or take your first survey and the first one
              is yours.
            </div>
          )}

          <Link href="/member/dashboard/badges" className="mt-3 inline-block rounded-[10px] border border-bd bg-white px-3.5 py-2 text-[12px] font-bold text-teal">See all badges →</Link>
        </div>
      </div>

      {/* Profile + draw */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-2xl2 border border-bd bg-white p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-[15px] font-extrabold"><IconLabel name="u1-work" text="Profile completion" size={22} /></h3>
            <span className="text-[13px] font-extrabold text-teal">{profileCompletion}%</span>
          </div>
          <div className="mt-2.5"><ProgressBar pct={profileCompletion} color="linear-gradient(90deg,#336666,#22A06B)" /></div>
          <div className="mt-2 text-[13px] text-mute">Complete 3 more sections to get better survey matches.</div>
          <Link href="/member/profile" className="mt-3 inline-block rounded-[10px] bg-teal px-4 py-2.5 text-[13px] font-bold text-white">Improve my profile →</Link>
        </div>
        <div className="flex items-center justify-between gap-4 rounded-2xl2 bg-dgreen px-6 py-5 text-white">
          <div>
            <div className="text-[17px] font-extrabold">🎟 Monthly community draw</div>
            <div className="mt-0.5 text-[13px] text-[#BFE0E0]">You have {m.tickets} {m.tickets === 1 ? 'entry' : 'entries'} · next draw {draw.date}</div>
          </div>
          <Link href="/member/community" className="shrink-0 rounded-[11px] bg-yel px-5 py-2.5 text-sm font-bold text-ink">View prizes</Link>
        </div>
      </div>
    </div>
  );
}
