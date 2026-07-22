'use client';
import Link from 'next/link';
import { useMember } from '@/components/member/MemberProvider';
import { Mascot } from '@/components/ui/Mascot';
import { CapIcon, IconLabel } from '@/components/ui/CapIcon';
import { Ring, ProgressBar } from '@/components/ui/Progress';
import { BadgeTile } from '@/components/member/BadgeTile';
import { badges, draw, profileCompletion, weeklyQuest } from '@/lib/mockData';
import { streakGraceDays } from '@/lib/gamification';

export default function DashboardPage() {
  const m = useMember();
  const xpPct = m.xpPct;
  const doneCount = m.quests.filter((q) => q.done).length;
  const earnedBadges = badges.filter((b) => b.earned);
  const badgePct = Math.round((earnedBadges.length / badges.length) * 100);
  const shieldActive = streakGraceDays(m.level) > 1;
  const weeklyPct = Math.round((weeklyQuest.progress / weeklyQuest.target) * 100);

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="relative flex flex-col items-center gap-5 overflow-hidden rounded-3xl2 p-6 sm:flex-row sm:gap-6"
        style={{ background: 'linear-gradient(135deg,#1F4F4F,#2c6a64)' }}>
        <div aria-hidden className="absolute -right-8 -top-10 h-44 w-44 rounded-full bg-yel/[.12]" />
        <div className="relative grid h-[120px] w-[120px] shrink-0 place-items-center">
          <Ring pct={xpPct} size={120} />
          <div className="absolute flex flex-col items-center">
            <span className="text-[11px] font-bold text-[#BFE0E0]">LEVEL</span>
            <span className="text-[34px] font-extrabold leading-none text-white">{m.level}</span>
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
        <div className="relative hidden md:block"><Mascot size={104} pose="cheer" bubble="Captain MyVoice says: one more quest to level up!" /></div>
      </div>

      {/* Daily quests */}
      <div>
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <div>
            <h2 className="text-[17px] font-extrabold"><IconLabel name="u2-target" text="Daily quests" /></h2>
            {/* The rotation is the point: say so, so an unfinished quest reads
                as "there'll be another" rather than something missed. */}
            <p className="mt-0.5 text-[13px] text-mute">A new set arrives every morning.</p>
          </div>
          <span className="text-[13px] font-bold text-gold">{doneCount}/{m.quests.length} complete</span>
        </div>
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {m.quests.map((q) => (
            <div key={q.id} className="rounded-2xl2 border-[1.5px] bg-white p-[18px]" style={{ borderColor: q.done ? '#CFE7CF' : '#F1ECDB' }}>
              <div className="flex items-start justify-between">
                {q.done ? (
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#E7F6EF] text-xl font-extrabold text-green">✓</span>
                ) : (
                  <CapIcon name={q.icon} size={40} />
                )}
                <span className="rounded-full bg-syel px-2.5 py-1 text-xs font-extrabold text-gold">+{q.xp} XP</span>
              </div>
              <div className="mt-3 text-[15px] font-bold">{q.title}</div>
              <button onClick={q.done ? undefined : () => m.completeQuest(q)} disabled={q.done}
                className="mt-3 w-full rounded-[10px] py-2.5 text-[13px] font-bold disabled:cursor-default"
                style={{ background: q.done ? '#E7F6EF' : '#FFCC33', color: q.done ? '#22A06B' : '#1C2526' }}>
                {q.done ? 'Completed' : q.kind === 'survey' ? 'Start →' : 'Claim'}
              </button>
            </div>
          ))}
        </div>

        {/* One weekly goal under the dailies. It runs on its own clock, so it
            shows progress rather than a claim button — nothing to press, just
            somewhere the week's work adds up. */}
        <div className="mt-3.5 flex flex-col gap-3.5 rounded-2xl2 border border-bd bg-white p-[18px] sm:flex-row sm:items-center">
          <CapIcon name={weeklyQuest.icon} size={40} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
              <span className="text-[15px] font-bold">This week: {weeklyQuest.objective}</span>
              <span className="text-[13px] font-bold text-gold">
                {weeklyQuest.progress} of {weeklyQuest.target}
              </span>
            </div>
            <div className="mt-2 max-w-[420px]">
              <ProgressBar pct={weeklyPct} color="linear-gradient(90deg,#336666,#22A06B)" height={8} />
            </div>
            <div className="mt-1.5 text-[13px] text-mute">
              Resets in {weeklyQuest.resetsIn} · +{weeklyQuest.xp} XP when it is done
            </div>
          </div>
        </div>
      </div>

      {/* Surveys + badges */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <h2 className="mb-2.5 text-base font-extrabold"><IconLabel name="u1-share" text="Surveys for you" size={22} /></h2>
          {m.surveys.length ? (
            m.surveys.map((sv) => (
              <div key={sv.id} className="mb-2.5 flex items-center gap-3 rounded-2xl border border-bd bg-white p-3.5">
                <CapIcon name={sv.icon} size={42} />
                <div className="min-w-0 flex-1">
                  <div className="text-[15px] font-bold">Project {sv.projectId} · Survey {sv.surveyId}</div>
                  <div className="text-xs text-mute">⏱ {sv.time} min · {m.fmt(sv.reward)} · +{sv.xp} XP</div>
                </div>
                <button onClick={() => m.openSurvey({ id: sv.id, topic: sv.topic, reward: sv.reward, xp: sv.xp }, null)}
                  className="shrink-0 rounded-[10px] bg-teal px-4 py-2.5 text-[13px] font-bold text-white">Play</button>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-bd bg-white p-6 text-center">
              <div className="flex justify-center"><CapIcon name="r1-celebrate" size={58} radius={14} /></div>
              <div className="mt-1.5 text-sm font-bold">All surveys done — legend!</div>
            </div>
          )}
          <Link href="/member/surveys" className="mt-1 inline-block rounded-[10px] border border-bd bg-white px-4 py-2.5 text-[13px] font-bold text-teal">See all surveys →</Link>
        </div>

        {/* A summary, not a catalogue: the dashboard answers "how am I doing?"
            in one glance and sends the full 27-tile set to its own page. */}
        <div className="rounded-2xl2 border border-bd bg-white p-[18px]">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-base font-extrabold"><IconLabel name="r1-celebrate" text="Badges" size={22} /></h2>
            <span className="shrink-0 text-[13px] font-extrabold text-teal">{earnedBadges.length} of {badges.length}</span>
          </div>
          <div className="mt-2.5"><ProgressBar pct={badgePct} color="linear-gradient(90deg,#336666,#22A06B)" height={8} /></div>

          {earnedBadges.length ? (
            <>
              <div className="mt-4 grid grid-cols-3 gap-x-2.5 gap-y-3.5">
                {earnedBadges.slice(0, 6).map((b) => (
                  <BadgeTile key={b.label} badge={b} />
                ))}
              </div>
              {earnedBadges.length > 6 && (
                <div className="mt-3 text-[13px] text-mute">
                  and {earnedBadges.length - 6} more earned
                </div>
              )}
            </>
          ) : (
            <div className="mt-4 text-[13px] leading-snug text-mute">
              No badges yet. Finish a profile section or take your first survey and the first one
              is yours.
            </div>
          )}

          <Link href="/member/dashboard/badges" className="mt-3.5 inline-block rounded-[10px] border border-bd bg-white px-4 py-2.5 text-[13px] font-bold text-teal">See all badges →</Link>
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
        <div className="flex items-center justify-between gap-4 rounded-2xl2 px-6 py-5 text-white" style={{ background: 'linear-gradient(120deg,#336666,#2c6a64)' }}>
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
