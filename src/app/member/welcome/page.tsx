'use client';
import Link from 'next/link';
import { Mascot } from '@/components/ui/Mascot';
import { CapIcon } from '@/components/ui/CapIcon';
import { member, onboardingSteps } from '@/lib/mockData';

export default function WelcomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6" style={{ background: 'linear-gradient(160deg,#FFF6DA 0%,#E8F3F3 100%)' }}>
      <div className="w-[620px] max-w-full rounded-3xl2 bg-white p-7 text-center shadow-lift md:p-10">
        <div className="flex justify-center"><Mascot size={168} pose="announce" /></div>
        <div className="mt-2.5 text-[13px] font-extrabold tracking-wider text-teal">WELCOME ABOARD</div>
        <h1 className="mt-1.5 text-[26px] font-extrabold tracking-tight text-dteal md:text-[32px]">Hi {member.name} — I’m Captain MyVoice!</h1>
        <p className="mx-auto mt-2.5 max-w-[460px] text-[15px] leading-relaxed text-soft">
          I’ll help you turn your opinions into real rewards. Here’s how MyVoice works:
        </p>
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {onboardingSteps.map((s, i) => (
            <div key={i} className="rounded-2xl border border-bd bg-cream p-4">
              <div className="flex justify-center"><CapIcon name={s[0]} size={52} radius={13} /></div>
              <div className="mt-2 text-sm font-bold">{s[1]}</div>
              <div className="mt-1 text-xs leading-snug text-mute">{s[2]}</div>
            </div>
          ))}
        </div>
        <div className="mt-5 flex items-center justify-between rounded-2xl bg-lteal px-5 py-4 text-left">
          <div>
            <div className="text-sm font-extrabold text-dteal">Your profile is 28% complete</div>
            <div className="text-xs text-soft">Finish your first section to unlock survey matches.</div>
          </div>
          <div className="shrink-0 rounded-full bg-syel px-2.5 py-1 text-xs font-extrabold text-teal">+50 XP</div>
        </div>
        <div className="mt-5 flex gap-2.5">
          <Link href="/member/dashboard" className="rounded-xl border border-bd bg-white px-5 py-3.5 text-[15px] font-bold text-mute">Skip for now</Link>
          <Link href="/member/profile" className="flex-1 rounded-xl bg-yel py-3.5 text-center text-[15px] font-bold text-ink">Complete my first section →</Link>
        </div>
        <div className="mt-4 text-xs text-[#98A2B3]">Reward threshold: €10 · Free forever · GDPR-compliant</div>
      </div>
    </div>
  );
}
