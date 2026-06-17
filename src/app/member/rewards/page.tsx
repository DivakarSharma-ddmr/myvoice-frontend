'use client';
import { useMember } from '@/components/member/MemberProvider';
import { CapIcon } from '@/components/ui/CapIcon';
import { ProgressBar } from '@/components/ui/Progress';
import { rewardMethods, recentActivity } from '@/lib/mockData';

export default function RewardsPage() {
  const m = useMember();
  const redeemable = m.available >= 10;
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_1fr]">
        {/* Balance card */}
        <div className="relative overflow-hidden rounded-2xl2 p-6 text-white" style={{ background: 'linear-gradient(135deg,#1F4F4F,#2c6a64)' }}>
          <div aria-hidden className="absolute -bottom-8 -right-8 h-[150px] w-[150px] rounded-full bg-yel/[.14]" />
          <div className="relative">
            <div className="text-[13px] font-semibold text-[#BFE0E0]">Available to redeem</div>
            <div className="text-[50px] font-extrabold tracking-tighter">{m.fmt(m.available)}</div>
            <div className="mt-2.5"><ProgressBar pct={Math.min(100, (m.available / 10) * 100)} color="#FFCC33" height={12} /></div>
            <div className="mt-2 text-[13px] text-[#BFE0E0]">
              {redeemable ? 'Eligible — redeem for a bonus ticket! 🎟' : `${m.fmt(10 - m.available)} to the €10 minimum`}
            </div>
            <button onClick={redeemable ? m.openRedeem : undefined} disabled={!redeemable}
              className="mt-3.5 rounded-xl px-6 py-3 text-[15px] font-bold disabled:cursor-not-allowed"
              style={{ background: redeemable ? '#FFCC33' : 'rgba(255,255,255,.14)', color: redeemable ? '#1C2526' : '#7FA3A3' }}>
              {redeemable ? 'Redeem now' : `Locked · ${m.fmt(10 - m.available)} to go`}
            </button>
          </div>
        </div>
        {/* Side stats */}
        <div className="flex flex-col gap-3">
          <div className="rounded-2xl2 border border-bd bg-white p-5">
            <div className="text-xs text-mute">Pending verification</div>
            <div className="text-[26px] font-extrabold text-amber">{m.fmt(m.pending)}</div>
          </div>
          <div className="rounded-2xl2 border border-bd bg-white p-5">
            <div className="text-xs text-mute">Lifetime earned</div>
            <div className="text-[26px] font-extrabold text-dteal">{m.fmt(m.lifetime)}</div>
          </div>
        </div>
      </div>

      {/* Methods */}
      <div>
        <h2 className="mb-3 text-base font-extrabold">Spend your rewards</h2>
        <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
          {rewardMethods.map((c, i) => (
            <div key={i} className="rounded-2xl border border-bd bg-white p-[18px] text-center">
              <div className="flex justify-center"><CapIcon name={c.icon} size={48} radius={12} /></div>
              <div className="mt-2 text-sm font-bold">{c.name}</div>
              <div className="text-xs text-mute">{c.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity */}
      <div className="overflow-hidden rounded-2xl2 border border-bd bg-white">
        <div className="border-b border-bd px-5 py-4 text-[15px] font-extrabold">Recent activity</div>
        {recentActivity.map((t, i) => (
          <div key={i} className="flex items-center justify-between px-5 py-3" style={{ borderTop: i ? '1px solid #F1ECDB' : 'none' }}>
            <div className="flex min-w-0 items-center gap-3.5">
              <span className="w-[58px] shrink-0 text-xs text-[#98A2B3]">{t[0]}</span>
              <span className="truncate text-sm font-semibold">{t[1]}</span>
              {t[3] && <span className="hidden rounded-full bg-syel px-2 py-0.5 text-[11px] font-bold text-gold sm:inline">{t[3]}</span>}
            </div>
            <div className="flex items-center gap-3.5">
              <span className="text-sm font-bold" style={{ color: t[2].startsWith('+') ? '#22A06B' : '#1C2526' }}>{t[2]}</span>
              <span className="w-[78px] rounded-full px-2.5 py-1 text-center text-xs font-bold" style={{ color: t[5], background: t[6] }}>{t[4]}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
