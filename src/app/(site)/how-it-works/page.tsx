import type { Metadata } from 'next';
import { Card } from '@/components/ui/Card';
import { PageHero } from '@/components/site/PillTitle';
import { FinalCta } from '@/components/site/FinalCta';
import { howItWorksDetailed } from '@/lib/mockData';

export const metadata: Metadata = {
  title: 'How it works',
  description: 'From sign-up to payout — the full MyVoice member journey, with no surprises.',
};

const explainer = [
  { icon: '📈', title: 'Why profile completion matters', body: 'The more we know about your lifestyle and interests, the better we match you — and the less you get screened out. Profile data is used only for matching and research.' },
  { icon: '🔎', title: 'Why you may not qualify', body: 'Not every survey is available to every member. Surveys are matched on location, profile, lifestyle and each study’s quotas. “Quota full” simply means enough people in your group already responded.' },
];

export default function HowItWorksPage() {
  return (
    <>
      <PageHero kicker="How it works" title="How MyVoice works"
        sub="From sign-up to payout — here’s the full member journey, with no surprises along the way." />
      <section className="mx-auto max-w-[880px] px-6 py-8 md:px-11">
        <div className="flex flex-col gap-3.5">
          {howItWorksDetailed.map((s, i) => (
            <div key={i} className="flex items-start gap-4 rounded-2xl2 border border-bd bg-white p-5 md:p-6">
              <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-[22px] ${i % 2 ? 'bg-lteal' : 'bg-syel'}`}>{s.icon}</div>
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-extrabold text-teal">STEP {i + 1}</span>
                  <h3 className="text-lg font-bold">{s.title}</h3>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-mute">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-[1080px] px-6 pb-8 pt-2.5 md:px-11">
        <div className="grid gap-4 md:grid-cols-2">
          {explainer.map((c, i) => (
            <Card key={i}>
              <div className="text-[26px]">{c.icon}</div>
              <h3 className="mt-2.5 text-lg font-bold text-dteal">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-mute">{c.body}</p>
            </Card>
          ))}
        </div>
      </section>
      <FinalCta />
    </>
  );
}
