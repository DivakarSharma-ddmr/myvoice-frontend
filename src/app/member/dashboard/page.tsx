'use client';
import Link from 'next/link';
import { useMember } from '@/components/member/MemberProvider';
import { Mascot } from '@/components/ui/Mascot';
import { CapIcon, IconLabel } from '@/components/ui/CapIcon';
import { Ring, ProgressBar } from '@/components/ui/Progress';
import { badges, profileCompletion } from '@/lib/mockData';

export default function DashboardPage() {
  const m = useMember();
  const xpPct = (m.xp / m.xpMax) * 100;
  const doneCount = m.quests.filter((q) => q.done).length;

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
          <div className="mt-0.5 text-2xl font-extrabold text-white">{m.xp} / {m.xpMax} XP</div>
          <div className="mt-1 text-[13px] text-[#BFE0E0]">{m.xpMax - m.xp} XP to Level {m.level + 1} — {m.tickets} draw tickets earned</div>
          <div className="mx-auto mt-2.5 max-w-[420px] sm:mx-0">
            <ProgressBar pct={xpPct} color="linear-gradient(90deg,#FFCC33,#FFE9A6)" />
          </div>
        </div>
        <div className="relative hidden md:block"><Mascot size={104} pose="cheer" bubble="Captain MyVoice says: one more quest to level up!" /></div>
      </div>

      {/* Daily quests */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[17px] font-extrabold"><IconLabel name="u2-target" text="Daily quests" /></h2>
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

        <div className="rounded-2xl2 border border-bd bg-white p-[18px]">
          <h2 className="mb-3 text-base font-extrabold"><IconLabel name="r1-celebrate" text="Badges" size={22} /></h2>
          <div className="grid grid-cols-3 gap-2.5">
            {badges.map((b, i) => (
              <div key={i} className="text-center" style={{ opacity: b.earned ? 1 : 0.45 }}>
                <div className="mx-auto h-[52px] w-[52px] overflow-hidden rounded-[14px]" style={{ filter: b.earned ? 'none' : 'grayscale(1)' }}>
                  <CapIcon name={b.icon} size={52} radius={14} />
                </div>
                <div className="mt-1 text-[10px] font-semibold text-mute">{b.label}</div>
              </div>
            ))}
          </div>
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
            <div className="mt-0.5 text-[13px] text-[#BFE0E0]">You have {m.tickets} tickets · drawn Jun 30</div>
          </div>
          <Link href="/member/community" className="shrink-0 rounded-[11px] bg-yel px-5 py-2.5 text-sm font-bold text-ink">View prizes</Link>
        </div>
      </div>
    </div>
  );
}
