'use client';
import { useMember } from '@/components/member/MemberProvider';
import { Mascot } from '@/components/ui/Mascot';
import { CapIcon, IconLabel } from '@/components/ui/CapIcon';
import { communityStats, draw, memberTips, announcements } from '@/lib/mockData';

export default function CommunityPage() {
  const m = useMember();
  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
        {communityStats.map((s, i) => (
          <div key={i} className="rounded-2xl2 border border-bd bg-white p-5 text-center">
            <div className="flex justify-center"><CapIcon name={s.icon} size={48} radius={12} /></div>
            <div className="mt-1 text-[28px] font-extrabold text-dteal">{s.value}</div>
            <div className="text-xs font-semibold text-mute">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Draw */}
        <div className="flex items-center gap-4 rounded-2xl2 p-6 text-white" style={{ background: 'linear-gradient(135deg,#1F4F4F,#2c6a64)' }}>
          <div className="hidden sm:block"><Mascot size={104} pose="winner" /></div>
          <div className="flex-1">
            <div className="text-[13px] font-extrabold text-yel">MONTHLY CLICK DRAW</div>
            <h3 className="mt-1 text-xl font-extrabold">You’re in with {m.tickets} tickets</h3>
            <p className="mt-1.5 text-[13px] leading-snug text-[#BFE0E0]">Next draw {draw.date} · {draw.prize}. Earn more tickets by completing quests and redeeming rewards.</p>
            <button className="mt-3 rounded-[11px] bg-yel px-4 py-2.5 text-[13px] font-bold text-ink">How the draw works</button>
          </div>
        </div>
      </div>

      {/* Tips + announcements */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-2xl2 border border-bd bg-white p-5">
          <h3 className="mb-2.5 text-base font-extrabold"><IconLabel name="u2-idea" text="Member tips" size={22} /></h3>
          {memberTips.map((t, i) => (
            <div key={i} className="flex gap-2.5 py-2.5" style={{ borderTop: i ? '1px solid #F1ECDB' : 'none' }}>
              <span className="font-extrabold text-green">✓</span>
              <div>
                <div className="text-sm font-bold">{t[0]}</div>
                <div className="text-xs text-mute">{t[1]}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-2xl2 border border-bd bg-white p-5">
          <h3 className="mb-2.5 text-base font-extrabold"><IconLabel name="u1-share" text="Announcements" size={22} /></h3>
          {announcements.map((a, i) => (
            <div key={i} className="py-2.5" style={{ borderTop: i ? '1px solid #F1ECDB' : 'none' }}>
              <div className="text-sm font-bold">{a[0]}</div>
              <div className="mt-0.5 text-xs text-mute">{a[1]}</div>
              <div className="mt-1 text-[11px] text-[#98A2B3]">{a[2]}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
