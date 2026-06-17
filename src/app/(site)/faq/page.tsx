import type { Metadata } from 'next';
import { LinkButton } from '@/components/ui/Button';
import { PageHero } from '@/components/site/PillTitle';
import { Accordion } from '@/components/ui/Accordion';
import { faqs } from '@/lib/mockData';

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Everything you might want to know before — and after — you join MyVoice.',
};

export default function FaqPage() {
  return (
    <>
      <PageHero kicker="FAQ" title="Questions, answered"
        sub="Everything you might want to know before — and after — you join." />
      <section className="mx-auto max-w-[860px] px-6 py-6 md:px-11">
        <Accordion items={faqs} defaultOpen={-1} />
      </section>
      <section className="mx-auto max-w-[860px] px-6 pb-10 md:px-11">
        <div className="rounded-2xl2 bg-lteal px-7 py-7 text-center">
          <h3 className="text-[19px] font-extrabold text-dteal">Still have a question?</h3>
          <p className="mt-1.5 text-sm text-soft">Reach our support team and we’ll get back to you, usually within one business day.</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2.5">
            <LinkButton href="/faq" variant="dark" pill>Contact support</LinkButton>
            <LinkButton href="/join" pill>Join free →</LinkButton>
          </div>
        </div>
      </section>
    </>
  );
}
