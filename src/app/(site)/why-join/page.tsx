import type { Metadata } from 'next';
import { Card } from '@/components/ui/Card';
import { PageHero } from '@/components/site/PillTitle';
import { FinalCta } from '@/components/site/FinalCta';
import { whyJoinCards, communityMonth } from '@/lib/mockData';

export const metadata: Metadata = {
  title: 'Why join',
  description: 'More than paid surveys — a research community that treats your time and privacy with respect.',
};

export default function WhyJoinPage() {
  return (
    <>
      <PageHero kicker="Why join" title="Reasons members love MyVoice"
        sub="More than paid surveys — a research community that treats your time and privacy with respect." />
      <section className="mx-auto max-w-[1080px] px-6 py-8 md:px-11">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {whyJoinCards.map((c, i) => (
            <Card key={i}>
              <div className={`grid h-[50px] w-[50px] place-items-center rounded-2xl text-2xl ${i % 2 ? 'bg-lteal' : 'bg-syel'}`}>{c.icon}</div>
              <h3 className="mt-3.5 text-[17px] font-bold text-dteal">{c.title}</h3>
              <p className="mt-2 text-sm leading-snug text-mute">{c.body}</p>
            </Card>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-[1180px] px-6 pb-12 pt-2 md:px-11">
        <div className="flex flex-wrap items-center justify-between gap-6 rounded-3xl2 px-8 py-10 md:px-11"
          style={{ background: 'linear-gradient(120deg,#E8F3F3,#FFF6DA)' }}>
          <div>
            <h3 className="text-2xl font-extrabold text-dteal">This month in the community</h3>
            <p className="mt-1.5 text-[15px] text-soft">Real activity from real members across 30+ countries.</p>
          </div>
          <div className="flex gap-7">
            {communityMonth.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-extrabold tracking-tight text-dteal">{s.value}</div>
                <div className="text-[13px] font-semibold text-soft">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <FinalCta />
    </>
  );
}
