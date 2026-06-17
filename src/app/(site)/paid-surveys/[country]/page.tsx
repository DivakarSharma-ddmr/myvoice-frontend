import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { LinkButton } from '@/components/ui/Button';
import { Accordion } from '@/components/ui/Accordion';
import { FinalCta } from '@/components/site/FinalCta';
import { countries } from '@/lib/mockData';

const slugify = (c: string) => c.toLowerCase().replace(/ /g, '-');
const fromSlug = (slug: string) => countries.find((c) => slugify(c) === slug);

export function generateStaticParams() {
  return countries.map((c) => ({ country: slugify(c) }));
}

export function generateMetadata({ params }: { params: { country: string } }): Metadata {
  const co = fromSlug(params.country);
  if (!co) return { title: 'Paid surveys' };
  return {
    title: `Paid surveys in ${co}`,
    description: `Join MyVoice for free in ${co}, take surveys matched to your profile, and earn rewards you can redeem locally.`,
  };
}

export default function CountryPage({ params }: { params: { country: string } }) {
  const co = fromSlug(params.country);
  if (!co) notFound();

  const features: [string, string, string][] = [
    ['🎯', 'Surveys matched to you', `Studies relevant to people in ${co}, based on your profile.`],
    ['💶', 'Local reward options', `Redeem via PayPal, gift cards and bank transfer available in ${co}.`],
    ['🔒', 'GDPR-compliant', 'Your data is handled to European privacy standards.'],
  ];
  const faq = [
    { q: `Is MyVoice available in ${co}?`, a: `Yes — MyVoice welcomes members across 30+ countries, including ${co}.` },
    { q: `What rewards can I redeem in ${co}?`, a: 'Reward options vary by country and typically include PayPal, popular gift cards, bank transfer and charity donations.' },
    { q: `Is it free to join in ${co}?`, a: 'Always. Joining and participating is free, with no fees of any kind.' },
  ];

  return (
    <>
      <section className="relative m-3 overflow-hidden rounded-3xl2 px-6 py-12 md:m-[18px] md:px-11" style={{ background: 'linear-gradient(155deg,#FFF6DA,#E8F3F3)' }}>
        <div className="relative mb-4 flex flex-wrap gap-2">
          {countries.map((c) => (
            <Link key={c} href={`/paid-surveys/${slugify(c)}`}
              className={`rounded-full px-3.5 py-1.5 text-[13px] font-bold ${c === co ? 'bg-teal text-white' : 'bg-white text-mute'}`}>{c}</Link>
          ))}
        </div>
        <h1 className="relative text-[34px] font-extrabold leading-[1.05] tracking-tight text-dteal md:text-[46px]">Paid surveys in {co}</h1>
        <p className="relative mt-3.5 max-w-[600px] text-base leading-relaxed text-soft md:text-lg">
          Join MyVoice for free, take surveys matched to your profile, and earn rewards you can redeem locally in {co}.
        </p>
        <div className="relative mt-6 flex flex-wrap gap-3">
          <LinkButton href="/join" variant="dark" pill>Join free in {co} →</LinkButton>
          <LinkButton href="/how-it-works" variant="secondary" pill>How it works</LinkButton>
        </div>
      </section>

      <section className="mx-auto max-w-[1080px] px-6 py-6 md:px-11">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {features.map((c, i) => (
            <Card key={i}>
              <div className="text-[26px]">{c[0]}</div>
              <h3 className="mt-2.5 text-base font-bold text-dteal">{c[1]}</h3>
              <p className="mt-1.5 text-[13px] leading-snug text-mute">{c[2]}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[860px] px-6 pb-5 pt-2.5 md:px-11">
        <h3 className="mb-4 text-[22px] font-extrabold text-dteal">Paid surveys in {co} — FAQ</h3>
        <Accordion items={faq} defaultOpen={-1} />
      </section>

      <FinalCta />
    </>
  );
}
