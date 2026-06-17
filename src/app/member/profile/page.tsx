'use client';
import { useState } from 'react';
import { useMember } from '@/components/member/MemberProvider';
import { Mascot } from '@/components/ui/Mascot';
import { Ring, ProgressBar } from '@/components/ui/Progress';
import { profileCategories } from '@/lib/mockData';

const DEVICES = ['Smartphone', 'Laptop', 'Tablet', 'Smartwatch', 'Smart speaker', 'Games console'];

export default function ProfilePage() {
  const [picked, setPicked] = useState<number[]>([0, 1]);
  const toggle = (i: number) => setPicked((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]));

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

      {/* Conversational question */}
      <h2 className="text-[17px] font-extrabold">Quick question</h2>
      <div className="rounded-2xl2 border border-bd bg-white p-5 md:p-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold text-teal">TECHNOLOGY · 2 of 5</span>
          <span className="text-xs text-mute">You can skip anytime</span>
        </div>
        <div className="my-2.5"><ProgressBar pct={40} color="#336666" height={6} /></div>
        <h3 className="mt-2.5 text-[19px] font-extrabold">Which devices do you personally own?</h3>
        <div className="mt-3.5 flex flex-wrap gap-2.5">
          {DEVICES.map((o, i) => {
            const sel = picked.includes(i);
            return (
              <button key={i} onClick={() => toggle(i)}
                className="rounded-full border-[1.5px] px-4 py-2.5 text-sm font-semibold"
                style={{ borderColor: sel ? '#336666' : '#F1ECDB', background: sel ? '#E8F3F3' : '#fff' }}>
                {sel ? '✓ ' : ''}{o}
              </button>
            );
          })}
        </div>
        <div className="mt-4 flex gap-2.5">
          <button className="rounded-[11px] border border-bd bg-white px-5 py-3 text-sm font-bold text-mute">Back</button>
          <button className="flex-1 rounded-[11px] bg-yel py-3 text-sm font-bold text-ink">Save &amp; continue</button>
        </div>
      </div>
    </div>
  );
}
