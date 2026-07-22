import Link from 'next/link';
import { asset } from '@/lib/asset';

// Deliberately outside both the (site) and member route groups: the public
// footer and the member platform both link here, so neither shell should wrap
// these documents.
export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-canvas">
      <header className="no-print border-b border-bd bg-white">
        <div className="mx-auto flex max-w-[1080px] items-center justify-between gap-4 px-5 py-4 md:px-8">
          <Link href="/" aria-label="MyVoice home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset('/assets/logo.webp')} alt="MyVoice" className="h-[22px]" />
          </Link>
          <Link
            href="/member/settings"
            className="text-[13px] font-bold text-teal hover:underline"
          >
            Back to my account
          </Link>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
