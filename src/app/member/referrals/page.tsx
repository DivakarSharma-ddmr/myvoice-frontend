'use client';
import { useMember } from '@/components/member/MemberProvider';
import { Mascot } from '@/components/ui/Mascot';
import { ProgressBar } from '@/components/ui/Progress';
import { member, referralSteps, referralFriends, referralStats } from '@/lib/mockData';

export default function ReferralsPage() {
  const m = useMember();
  return (
    <div className="space-y-4">
      {/* Hero */}
      <div className="relative flex flex-col items-center gap-5 overflow-hidden rounded-2xl2 p-6 text-white sm:flex-row sm:gap-6"
        style={{ background: 'linear-gradient(135deg,#1F4F4F,#2c6a64)' }}>
        <div aria-hidden className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-yel/[.12]" />
        <div className="relative hidden sm:block"><Mascot size={96} pose="wave" bubble="Bring a friend along!" /></div>
        <div className="relative flex-1">
          <h2 className="text-2xl font-extrabold">Invite friends, earn together</h2>
          <p className="mt-1.5 text-sm leading-snug text-[#BFE0E0]">When a friend joins and completes their first survey, you both earn €5. Rewards are confirmed only once conditions are met.</p>
          <div className="mt-4 flex max-w-[460px] flex-col gap-2.5 sm:flex-row">
            <div className="flex-1 truncate rounded-[11px] border border-white/20 bg-white/[.12] px-3.5 py-3 text-sm font-semibold">{member.referralLink}</div>
            <button onClick={m.copyRef} className="rounded-[11px] bg-yel px-5 py-3 text-sm font-bold text-ink">{m.refCopied ? 'Copied ✓' : 'Copy link'}</button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3.5">
        {referralStats.map((s, i) => (
          <div key={i} className="rounded-2xl border border-bd bg-white p-[18px] text-center">
            <div className="text-[26px] font-extrabold text-dteal">{s[0]}</div>
            <div className="text-xs font-semibold text-mute">{s[1]}</div>
          </div>
        ))}
      </div>

      {/* Stages */}
      <h2 className="text-[17px] font-extrabold">How a referral progresses</h2>
      <div className="flex flex-wrap gap-2">
        {referralSteps.map((st, i) => (
          <div key={i} className="min-w-[140px] flex-1 rounded-[14px] border border-bd bg-white p-3.5">
            <span className="rounded-full px-2.5 py-1 text-[11px] font-extrabold"
              style={{ color: i === 0 ? '#98A2B3' : i < 3 ? '#336666' : i < 4 ? '#8a6d12' : '#22A06B', background: i === 0 ? '#F1F2EE' : i < 3 ? '#E8F3F3' : i < 4 ? '#FFF4CC' : '#E7F6EF' }}>
              Step {i + 1}
            </span>
            <div className="mt-2 text-sm font-bold">{st[0]}</div>
            <div className="mt-0.5 text-xs text-mute">{st[1]}</div>
          </div>
        ))}
      </div>

      {/* Friends */}
      <h2 className="text-[17px] font-extrabold">Your invited friends</h2>
      <div className="overflow-hidden rounded-2xl2 border border-bd bg-white">
        {referralFriends.map((f, i) => (
          <div key={i} className="flex items-center justify-between px-5 py-3.5" style={{ borderTop: i ? '1px solid #F1ECDB' : 'none' }}>
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-[10px] bg-lteal text-sm font-extrabold text-dteal">{f[0][0]}</span>
              <span className="text-sm font-bold">{f[0]}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="hidden w-[120px] sm:block"><ProgressBar pct={(f[2] / 4) * 100} color="linear-gradient(90deg,#336666,#22A06B)" height={6} /></div>
              <span className="w-[130px] text-right text-xs font-bold" style={{ color: f[2] === 4 ? '#22A06B' : '#667085' }}>{f[1]}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
