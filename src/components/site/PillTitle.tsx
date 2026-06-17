import { clsx } from '@/lib/clsx';

/** Centered (or left) kicker pill + heading + optional subtitle. Used site-wide. */
export function PillTitle({
  kicker,
  title,
  sub,
  align = 'center',
}: {
  kicker: string;
  title: string;
  sub?: string;
  align?: 'center' | 'left';
}) {
  return (
    <div className={clsx('max-w-[640px]', align === 'center' ? 'mx-auto text-center' : 'text-left')}>
      <span className="inline-block rounded-full bg-syel px-3.5 py-1.5 text-[13px] font-bold text-gold">{kicker}</span>
      <h2 className="mt-3.5 text-[28px] font-extrabold leading-tight tracking-tight text-dteal md:text-4xl">{title}</h2>
      {sub && <p className="mt-3.5 text-base leading-relaxed text-mute md:text-[17px]">{sub}</p>}
    </div>
  );
}

/** Big gradient hero used at the top of inner pages. */
export function PageHero({ kicker, title, sub }: { kicker: string; title: string; sub?: string }) {
  return (
    <section className="relative m-3 overflow-hidden rounded-3xl2 px-6 py-12 text-center md:m-4 md:px-11 md:py-14"
      style={{ background: 'linear-gradient(155deg,#FFF6DA,#E8F3F3)' }}>
      <div aria-hidden className="absolute -top-10 left-[12%] h-36 w-36 rounded-full opacity-45" style={{ background: '#FFE38A', filter: 'blur(2px)' }} />
      <span className="relative inline-block rounded-full bg-white px-3.5 py-1.5 text-[13px] font-bold text-gold">{kicker}</span>
      <h1 className="relative mx-auto mt-4 max-w-3xl text-[32px] font-extrabold leading-[1.05] tracking-tight text-dteal md:text-[46px]">{title}</h1>
      {sub && <p className="relative mx-auto mt-3.5 max-w-[620px] text-base leading-relaxed text-soft md:text-lg">{sub}</p>}
    </section>
  );
}
