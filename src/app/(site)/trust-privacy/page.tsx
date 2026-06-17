import type { Metadata } from 'next';
import { Card } from '@/components/ui/Card';
import { LinkButton } from '@/components/ui/Button';
import { PageHero } from '@/components/site/PillTitle';
import { trustSections } from '@/lib/mockData';

export const metadata: Metadata = {
  title: 'Trust & Privacy | How MyVoice Protects Members',
  description: 'How MyVoice protects member data, supports responsible market research, and keeps participation transparent and secure.',
};

export default function TrustPrivacyPage() {
  return (
    <>
      <PageHero kicker="Trust & privacy" title="Built on trust, privacy and quality"
        sub="Survey panels deserve scrutiny. Here’s exactly who we are, how we handle your data, and how we keep things fair." />
      <section className="mx-auto max-w-[960px] px-6 py-8 md:px-11">
        <div className="grid gap-4 md:grid-cols-2">
          {trustSections.map((s, i) => (
            <Card key={i}>
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-lteal text-[15px] font-extrabold text-dteal">{i + 1}</div>
              <h3 className="mt-3 text-[17px] font-bold text-dteal">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-mute">{s.body}</p>
            </Card>
          ))}
        </div>
        <div className="mt-4.5 flex flex-wrap items-center justify-between gap-5 rounded-2xl2 bg-dteal px-8 py-7" style={{ marginTop: 18 }}>
          <div>
            <h3 className="text-xl font-extrabold text-white">Questions about your data?</h3>
            <p className="mt-1.5 text-sm text-[#BFE0E0]">Our support team is here to help — clearly and without jargon.</p>
          </div>
          <LinkButton href="/faq" pill>Contact support</LinkButton>
        </div>
      </section>
    </>
  );
}
