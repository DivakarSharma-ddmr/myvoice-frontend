'use client';
import { Mascot } from '@/components/ui/Mascot';
import { Ring, ProgressBar } from '@/components/ui/Progress';
import { profileCategories } from '@/lib/mockData';

export default function ProfilePage() {
  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="relative flex flex-col items-center gap-5 overflow-hidden rounded-2xl2 p-6 text-white sm:flex-row sm:gap-6"
        style={{ background: 'linear-gradient(135deg,#1F4F4F,#2c6a64)' }}>
        <div className="relative grid h-[108px] w-[108px] shrink-0 place-items-center">
          <Ring pct={72} size={108} />
          <div className="absolute text-center">
            <div className="text-3xl font-extrabold leading-none">72%</div>
            <div className="text-[10px] font-bold text-[#BFE0E0]">COMPLETE</div>
          </div>
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-[22px] font-extrabold">Complete your profile for better matches</h2>
          <p className="mt-1.5 text-sm leading-snug text-[#BFE0E0]">About 16 minutes left across 5 sections. Finish your profile to unlock a bonus 100 XP and more relevant surveys.</p>
        </div>
        <div className="hidden md:block"><Mascot size={92} pose="wave" bubble="Almost there — keep going!" /></div>
      </div>

      {/* Sections */}
      <h2 className="text-[17px] font-extrabold">Profile sections</h2>
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {profileCategories.map((c, i) => {
          const full = c.pct === 100;
          return (
            <div key={i} className="rounded-2xl border border-bd bg-white p-4">
              <div className="flex items-center justify-between">
                <div className="text-[15px] font-bold">{c.name}</div>
                <span className="text-[13px] font-extrabold" style={{ color: full ? '#22A06B' : '#336666' }}>{c.pct}%</span>
              </div>
              <div className="my-2.5"><ProgressBar pct={c.pct} color={full ? '#22A06B' : 'linear-gradient(90deg,#336666,#22A06B)'} height={8} /></div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-mute">{full ? 'Up to date' : `${c.time} left`}</span>
                <button className="rounded-[9px] px-3 py-1.5 text-xs font-bold"
                  style={{ background: full ? '#E7F6EF' : '#FFF4CC', color: full ? '#22A06B' : '#8a6d12' }}>
                  {full ? 'Edit' : c.pct > 0 ? 'Continue' : 'Start'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
