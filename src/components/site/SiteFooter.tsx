import Link from 'next/link';
import { asset } from '@/lib/asset';

const COLS: [string, [string, string][]][] = [
  ['MyVoice', [['About', '/why-join'], ['How it works', '/how-it-works'], ['Rewards', '/rewards'], ['Why join', '/why-join']]],
  ['Help', [['FAQ', '/faq'], ['Contact support', '/faq'], ['Survey issues', '/faq'], ['Reward issues', '/faq']]],
  ['Trust', [['Privacy', '/trust-privacy'], ['Terms', '/trust-privacy'], ['Cookies', '/trust-privacy'], ['Data protection', '/trust-privacy']]],
];

export function SiteFooter() {
  return (
    <footer className="mt-2.5 border-t border-[#F0ECD9] bg-sand px-6 pb-9 pt-12 md:px-11">
      <div className="mx-auto grid max-w-[1080px] grid-cols-2 gap-8 md:grid-cols-4 md:gap-8">
        <div className="col-span-2 md:col-span-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset('/assets/logo.jpg')} alt="MyVoice" className="h-[30px] w-auto" />
          <p className="mt-3.5 max-w-[250px] text-sm leading-relaxed text-mute">
            A trusted global research community. Part of the DataDiggers ecosystem since 2015.
          </p>
        </div>
        {COLS.map(([head, items]) => (
          <div key={head}>
            <div className="mb-3.5 text-[13px] font-bold text-dteal">{head}</div>
            {items.map(([t, href], i) => (
              <Link key={i} href={href} className="mb-2.5 block text-sm text-mute hover:text-teal">
                {t}
              </Link>
            ))}
          </div>
        ))}
      </div>
      <div className="mx-auto mt-6 flex max-w-[1080px] flex-wrap justify-between gap-2 border-t border-[#F0ECD9] pt-5 text-[13px] text-[#98A2B3]">
        <span>© 2026 MyVoice · DataDiggers · GDPR compliant</span>
        <span>🌍 English · EUR</span>
      </div>
    </footer>
  );
}
