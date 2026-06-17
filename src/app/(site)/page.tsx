import Link from 'next/link';
import { LinkButton } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PillTitle } from '@/components/site/PillTitle';
import { TrustBar } from '@/components/site/TrustBar';
import { FinalCta } from '@/components/site/FinalCta';
import { Accordion } from '@/components/ui/Accordion';
import { ProgressBar } from '@/components/ui/Progress';
import {
  howItWorksSteps,
  whyItMatters,
  trustCards,
  insideTiles,
  faqs,
  communityMonth,
  testimonials,
} from '@/lib/mockData';

function HeroMock() {
  return (
    <div className="relative hidden h-[400px] md:block">
      <div className="absolute right-2.5 top-1.5 w-[300px] animate-bfloat rounded-3xl2 bg-white p-6 shadow-lift">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-mute">Wallet</span>
          <span className="grid h-[34px] w-[34px] place-items-center rounded-xl bg-syel text-base">💰</span>
        </div>
        <div className="mt-1.5 text-[46px] font-extrabold tracking-tighter text-dteal">€8.80</div>
        <div className="mt-2.5 flex justify-between text-[13px] font-semibold">
          <span className="text-mute">Next reward €10</span>
          <span className="text-green">88%</span>
        </div>
        <ProgressBar pct={88} height={12} className="mt-2" />
        <button className="mt-4 w-full rounded-2xl bg-yel py-3 text-sm font-bold">Redeem reward</button>
      </div>
      <div className="absolute bottom-2.5 left-0 w-[230px] rounded-2xl2 bg-white p-[18px] shadow-card" style={{ animation: 'bfloat 5s ease-in-out infinite .6s' }}>
        <div className="flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-lteal text-lg">🛍️</span>
          <div>
            <div className="text-sm font-bold">Shopping Habits</div>
            <div className="text-xs text-mute">8 min · €1.20</div>
          </div>
        </div>
        <button className="mt-3 w-full rounded-xl bg-teal py-2.5 text-[13px] font-bold text-white">Start survey →</button>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative m-3 overflow-hidden rounded-3xl2 px-6 py-12 md:m-[18px] md:px-11 md:py-14"
        style={{ background: 'linear-gradient(155deg,#FFF6DA 0%,#FBF4E6 40%,#E8F3F3 100%)' }}>
        <div className="relative z-10 grid items-center gap-10 md:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-[13px] font-bold text-dteal shadow-soft">
              🌍 2M+ members · 30+ countries
            </span>
            <h1 className="mt-4 text-[40px] font-extrabold leading-[1.04] tracking-tight text-dteal md:text-[52px]">
              Your opinion is worth something.
            </h1>
            <p className="mt-4 max-w-[440px] text-base leading-relaxed text-soft md:text-lg">
              Take surveys you actually relate to, and turn your honest feedback into real rewards — with a community that values your time.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <LinkButton href="/join" variant="dark" pill>Join free →</LinkButton>
              <LinkButton href="/how-it-works" variant="secondary" pill>How it works</LinkButton>
            </div>
            <p className="mt-3.5 text-[13px] font-semibold text-[#7a8f8d]">Free forever · GDPR-compliant · Powered by DataDiggers</p>
          </div>
          <HeroMock />
        </div>
      </section>

      <div className="py-2"><TrustBar /></div>

      {/* How it works */}
      <section className="mx-auto max-w-[1180px] px-6 pb-8 pt-16 md:px-11">
        <PillTitle kicker="How it works" title="Four happy little steps" />
        <div className="mt-9 grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-4">
          {howItWorksSteps.map((s, i) => (
            <div key={i} className="rounded-3xl2 border border-bd bg-white p-6">
              <div className={`grid h-[54px] w-[54px] place-items-center rounded-2xl text-2xl ${i % 2 ? 'bg-lteal' : 'bg-syel'}`}>{s.icon}</div>
              <h3 className="mt-4 text-lg font-bold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-mute">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why it matters */}
      <section className="mx-auto max-w-[1180px] px-6 py-11 md:px-11">
        <PillTitle kicker="Why it matters" title="Your answers help organizations make better decisions"
          sub="Companies, researchers and organizations use survey feedback to improve products, services and public understanding." />
        <div className="mt-9 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {whyItMatters.map((c, i) => (
            <div key={i} className="rounded-2xl2 border border-bd bg-white p-5 md:p-6">
              <div className="text-3xl">{c.icon}</div>
              <h3 className="mt-3 text-base font-bold">{c.title}</h3>
              <p className="mt-1.5 text-[13px] leading-snug text-mute">{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Rewards tease */}
      <section className="px-6 py-10 md:px-11">
        <div className="relative mx-auto grid max-w-[1180px] items-center gap-8 overflow-hidden rounded-3xl2 bg-dteal p-8 md:grid-cols-2 md:p-14">
          <div className="relative">
            <span className="inline-block rounded-full bg-yel/20 px-3.5 py-1.5 text-[13px] font-bold text-yel">Rewards</span>
            <h2 className="mt-3.5 text-[28px] font-extrabold leading-tight tracking-tight text-white md:text-4xl">Clear, simple, and genuinely transparent.</h2>
            <p className="mt-3.5 text-[15px] leading-relaxed text-[#BFE0E0] md:text-base">
              No mystery points. See exactly what you’ve earned, what’s pending, and how close you are to your next payout — anytime.
            </p>
            <div className="mt-5"><LinkButton href="/rewards" pill>Explore rewards →</LinkButton></div>
          </div>
          <div className="relative grid grid-cols-2 gap-3">
            {[['€8.80', 'Available', 'light'], ['€2.40', 'Pending', 'glass'], ['€146', 'Lifetime', 'glass'], ['×6', 'Draw tickets', 'yellow']].map((c, i) => (
              <div key={i} className="rounded-2xl2 p-5"
                style={{ background: c[2] === 'light' ? '#fff' : c[2] === 'yellow' ? '#FFCC33' : 'rgba(255,255,255,.08)', border: c[2] === 'glass' ? '1px solid rgba(255,255,255,.14)' : 'none' }}>
                <div className="text-3xl font-extrabold tracking-tight" style={{ color: c[2] === 'glass' ? '#fff' : '#1F4F4F' }}>{c[0]}</div>
                <div className="mt-0.5 text-[13px] font-semibold" style={{ color: c[2] === 'glass' ? '#BFE0E0' : '#5a6b6a' }}>{c[1]}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="mx-auto max-w-[1180px] px-6 py-11 md:px-11">
        <PillTitle kicker="Trust & privacy" title="Built on trust, privacy and quality" />
        <div className="mt-9 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {trustCards.map((c, i) => (
            <div key={i} className="rounded-2xl2 border border-bd bg-white p-5 text-center md:p-6">
              <div className="text-3xl">{c.icon}</div>
              <h3 className="mt-3 text-base font-bold">{c.title}</h3>
              <p className="mt-1.5 text-[13px] leading-snug text-mute">{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      <TestimonialReel />

      {/* Inside MyVoice */}
      <section className="mx-auto max-w-[1180px] px-6 py-11 md:px-11">
        <PillTitle kicker="Inside MyVoice" title="A member experience that feels modern" />
        <div className="mt-9 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {insideTiles.map((t, i) => (
            <div key={i} className="overflow-hidden rounded-2xl2 border border-bd bg-white">
              <div className={`flex h-[130px] items-center justify-center ${t.tint === 'lteal' ? 'bg-lteal' : 'bg-syel'}`}>
                <div className="flex h-[74px] w-[74%] flex-col justify-center rounded-xl bg-white p-3 shadow-card">
                  <div className="h-2 w-1/2 rounded-full bg-[#EDEFEA]" />
                  <div className="mt-1.5 h-2 w-4/5 rounded-full bg-[#EDEFEA]" />
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-[15px] font-bold">{t.title}</h3>
                <p className="mt-1 text-xs leading-snug text-mute">{t.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ preview */}
      <section className="mx-auto max-w-[860px] px-6 pb-2.5 pt-8 md:px-11">
        <PillTitle kicker="FAQ" title="Questions, answered" />
        <div className="mt-8"><Accordion items={faqs.slice(0, 4)} /></div>
        <div className="mt-5 text-center">
          <LinkButton href="/faq" variant="ghost" pill>See all FAQs →</LinkButton>
        </div>
      </section>

      {/* Community */}
      <section className="mx-auto max-w-[1180px] px-6 pb-12 pt-8 md:px-11">
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

// Auto-scrolling testimonial reel (CSS marquee). Quotes/clips are placeholders.
function TestimonialReel() {
  const reel = [...testimonials, ...testimonials];
  const band = [...testimonials, ...testimonials];
  return (
    <section className="py-10">
      <div className="px-6 md:px-11">
        <PillTitle kicker="From the community" title="Real members, real rewards"
          sub="Hear it straight from panelists across 30+ countries — short clips from people who’ve been paid." />
      </div>
      {/* video reel */}
      <div className="mt-8 overflow-hidden" style={{ maskImage: 'linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)', WebkitMaskImage: 'linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)' }}>
        <div className="flex w-max animate-bmarq gap-[18px] px-6 md:px-11" style={{ animationDuration: '38s' }}>
          {reel.map((v, i) => (
            <div key={i} className="relative h-[340px] w-[200px] shrink-0 overflow-hidden rounded-2xl2 border border-bd shadow-card"
              style={{ background: 'repeating-linear-gradient(135deg,#E8F3F3 0 14px,#DCEEEE 14px 28px)' }}>
              <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,rgba(31,79,79,0) 40%,rgba(31,79,79,.78) 100%)' }} />
              <div className="absolute left-3 top-3 rounded-md bg-white/80 px-2 py-0.5 font-mono text-[10px] text-[#5b7d7b]">video · 0:{v.secs}</div>
              <div className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 animate-bpulse place-items-center rounded-full bg-white/90 shadow-card">
                <span className="ml-0.5 text-lg text-teal">▶</span>
              </div>
              <div className="absolute inset-x-3.5 bottom-3.5 text-white">
                <span className="inline-flex rounded-full bg-yel/95 px-2.5 py-0.5 text-[11px] font-extrabold text-ink">{v.tag}</span>
                <div className="mt-2 text-base font-extrabold">{v.name}</div>
                <div className="text-xs font-semibold text-[#CFE7E3]">{v.place}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* text banner */}
      <div className="mt-6 overflow-hidden bg-dteal py-4.5" style={{ paddingTop: 18, paddingBottom: 18, maskImage: 'linear-gradient(90deg,transparent,#000 5%,#000 95%,transparent)', WebkitMaskImage: 'linear-gradient(90deg,transparent,#000 5%,#000 95%,transparent)' }}>
        <div className="flex w-max animate-bmarq gap-14 pl-14">
          {band.map((q, i) => (
            <div key={i} className="flex shrink-0 items-center gap-4">
              <span className="whitespace-nowrap text-base font-semibold text-white">“{q.quote}”</span>
              <span className="whitespace-nowrap text-[13px] font-extrabold text-yel">{q.name} · {q.place.split(',').pop()?.trim()}</span>
              <span className="text-white/30">•</span>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-4.5 px-6 text-center text-[13px] text-[#98A2B3]" style={{ marginTop: 18 }}>
        Clips and quotes shown are placeholders — drop in real member videos to go live.
      </p>
    </section>
  );
}
