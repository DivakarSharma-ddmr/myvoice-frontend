'use client';
import { useMember } from '@/components/member/MemberProvider';
import { Mascot } from '@/components/ui/Mascot';
import { CapIcon } from '@/components/ui/CapIcon';
import { allSurveys, surveyFilters, surveyStateMeta, type SurveyState } from '@/lib/mockData';

const OPEN: SurveyState[] = ['rec', 'closing', 'avail'];
const ctaLabel: Record<SurveyState, string> = {
  rec: 'Start survey →',
  closing: 'Start survey →',
  avail: 'Start survey →',
  pending: 'Being verified…',
  done: 'Completed ✓',
  quota: 'Quota full',
  screen: 'Different profile needed',
};

export default function SurveysPage() {
  const m = useMember();
  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {surveyFilters.map((f, i) => (
          <button key={i} className="rounded-full border px-3.5 py-2 text-[13px] font-bold"
            style={{ background: i === 0 ? '#336666' : '#fff', color: i === 0 ? '#fff' : '#667085', borderColor: i === 0 ? '#336666' : '#F1ECDB' }}>{f}</button>
        ))}
      </div>

      {/* Mascot banner */}
      <div className="flex items-center gap-4 rounded-2xl2 px-5 py-4" style={{ background: 'linear-gradient(120deg,#E8F3F3,#FFF6DA)' }}>
        <div className="hidden sm:block"><Mascot size={96} pose="point" /></div>
        <div>
          <div className="text-[15px] font-extrabold text-dteal">4 surveys are a match right now</div>
          <div className="text-[13px] text-soft">Captain MyVoice picked these for your profile — start with the recommended ones.</div>
        </div>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
        {allSurveys.map((sv, i) => {
          const isOpen = OPEN.includes(sv.state);
          const meta = surveyStateMeta[sv.state];
          const dim = sv.state === 'quota' || sv.state === 'screen';
          return (
            <div key={i} className="rounded-2xl2 border border-bd bg-white p-[18px]" style={{ opacity: dim ? 0.62 : 1 }}>
              <div className="flex items-center gap-3">
                <CapIcon name={sv.icon} size={46} radius={13} />
                <div className="min-w-0 flex-1">
                  <div className="text-base font-extrabold">Project {sv.projectId} · Survey {sv.surveyId}</div>
                  <div className="mt-0.5 text-xs text-mute">⏱ {sv.time} min · {m.fmt(sv.reward)} · +{sv.xp} XP</div>
                </div>
                <span className="rounded-full px-2.5 py-1 text-[11px] font-extrabold" style={{ color: meta.fg, background: meta.bg }}>{meta.label}</span>
              </div>
              <button
                onClick={isOpen ? () => m.openSurvey({ id: 100 + i, topic: sv.topic, reward: sv.reward, xp: sv.xp }, null) : undefined}
                disabled={!isOpen}
                className="mt-3.5 w-full rounded-[11px] py-3 text-sm font-bold disabled:cursor-not-allowed"
                style={{ background: isOpen ? '#FFCC33' : '#F1F2EE', color: isOpen ? '#1C2526' : '#B0B6BC' }}>
                {ctaLabel[sv.state]}
              </button>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-3.5 rounded-2xl border border-dashed border-bd bg-white px-5 py-4">
        <span className="text-[13px] leading-relaxed text-mute">
          <b className="text-ink">Tip: </b>“Quota full” means enough people from your group already responded. “Not a match” means this study needed a different profile — completing more of your profile unlocks more.
        </span>
      </div>
    </div>
  );
}
