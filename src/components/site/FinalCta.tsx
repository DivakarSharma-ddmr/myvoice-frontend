import { LinkButton } from '@/components/ui/Button';

export function FinalCta() {
  return (
    <section className="mx-auto max-w-[1180px] px-6 pb-14 pt-2.5 md:px-11">
      <div className="relative overflow-hidden rounded-3xl2 bg-yel px-6 py-12 text-center md:px-14">
        <div aria-hidden className="absolute -top-8 left-[10%] h-28 w-28 rounded-full bg-white/40" style={{ filter: 'blur(2px)' }} />
        <h2 className="relative text-[28px] font-extrabold tracking-tight text-ink md:text-[40px]">
          Ready to make your voice count?
        </h2>
        <p className="relative mt-2.5 text-base font-medium text-[#5a4a12] md:text-[17px]">Join free in under two minutes.</p>
        <div className="relative mt-6 flex justify-center">
          <LinkButton href="/join" variant="dark" pill className="!bg-ink !text-white px-9 py-4 text-base">
            Join MyVoice free
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
