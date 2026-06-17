import type { Metadata } from 'next';
import { PageHero } from '@/components/site/PillTitle';
import { FinalCta } from '@/components/site/FinalCta';
import { ProgressBar } from '@/components/ui/Progress';

export const metadata: Metadata = {
  title: 'Rewards | Earn Rewards for Online Surveys',
  description: 'Learn how MyVoice rewards work, track your balance, and redeem after completing eligible surveys.',
};

const approval: [string, string, string][] = [
  ['Pending', 'Your response is being verified for quality.', '#FFF4CC'],
  ['Approved', 'Reward is confirmed and added to your balance.', '#E7F6EF'],
  ['Redeemed', 'You’ve cashed out via your chosen method.', '#E8F3F3'],
];
const methods: [string, string, string][] = [
  ['💸', 'PayPal', 'Cash to your account'],
  ['🎁', 'Gift cards', 'Top brands & retailers'],
  ['🏦', 'Bank transfer', 'Straight to your bank'],
  ['❤️', 'Charity', 'Donate your balance'],
];

export default function RewardsPage() {
  return (
    <>
      <PageHero kicker="Rewards" title="Earn rewards for sharing your opinion"
        sub="Track every cent, know exactly when you’re eligible, and redeem the way that suits you." />

      <section className="mx-auto grid max-w-[1180px] items-center gap-6 px-6 py-8 md:grid-cols-2 md:px-11">
        <div className="rounded-3xl2 border border-bd bg-white p-7 shadow-card md:p-8">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-mute">Available balance</span>
            <span className="rounded-full bg-[#E7F6EF] px-2.5 py-1 text-xs font-bold text-green">Eligible at €10</span>
          </div>
          <div className="text-[44px] font-extrabold tracking-tighter text-dteal md:text-[56px]">€8.80</div>
          <ProgressBar pct={88} height={14} className="mt-3" />
          <div className="mt-2 text-sm text-mute">Only €1.20 to go until you can redeem</div>
          <div className="mt-4 flex gap-3">
            <div className="flex-1 rounded-2xl bg-[#FAFAF7] p-3">
              <div className="text-xs text-mute">Pending</div>
              <div className="text-lg font-extrabold">€2.40</div>
            </div>
            <div className="flex-1 rounded-2xl bg-[#FAFAF7] p-3">
              <div className="text-xs text-mute">Lifetime</div>
              <div className="text-lg font-extrabold">€146.20</div>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-extrabold text-dteal md:text-[22px]">How approval works</h3>
          <div className="mt-4 flex flex-col gap-3">
            {approval.map((s, i) => (
              <div key={i} className="flex items-center gap-3.5 rounded-2xl border border-bd bg-white p-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl font-extrabold text-dteal" style={{ background: s[2] }}>{i + 1}</span>
                <div>
                  <div className="text-[15px] font-bold">{s[0]}</div>
                  <div className="text-[13px] text-mute">{s[1]}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-6 py-6 md:px-11">
        <h3 className="mb-4 text-2xl font-extrabold text-dteal">Choose how you get rewarded</h3>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {methods.map((c, i) => (
            <div key={i} className="rounded-2xl2 border border-bd bg-white p-6 text-center">
              <div className="text-3xl">{c[0]}</div>
              <h4 className="mt-2.5 text-base font-bold">{c[1]}</h4>
              <p className="mt-1 text-[13px] text-mute">{c[2]}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-[1180px] px-6 md:px-11">
        <p className="rounded-2xl bg-[#FAFAF7] px-5 py-4 text-[13px] leading-relaxed text-[#98A2B3]">
          MyVoice is not a full-time income opportunity. It’s a simple way to earn occasional rewards for participating in legitimate research. Rewards are subject to validation, and available reward types depend on your country.
        </p>
      </div>

      <div className="pt-8"><FinalCta /></div>
    </>
  );
}
