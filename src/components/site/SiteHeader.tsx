'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { asset } from '@/lib/asset';
import { clsx } from '@/lib/clsx';

const NAV = [
  ['How it works', '/how-it-works'],
  ['Rewards', '/rewards'],
  ['Why join', '/why-join'],
  ['Trust', '/trust-privacy'],
  ['FAQ', '/faq'],
  ['Learn', '/learn'],
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const active = (href: string) => pathname === href || pathname === href + '/';

  return (
    <header className="sticky top-3.5 z-30 mx-3 mt-3.5 md:mx-4">
      <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-3 rounded-full border border-[#F0ECD9] bg-white/90 py-2.5 pl-5 pr-2.5 shadow-soft backdrop-blur-md">
        <Link href="/" className="flex items-center" onClick={() => setOpen(false)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset('/assets/logo.jpg')} alt="MyVoice by DataDiggers" className="h-[30px] w-auto" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 lg:flex">
          {NAV.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                'whitespace-nowrap text-sm transition',
                active(href) ? 'font-bold text-teal' : 'font-semibold text-[#33635f] hover:text-teal',
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <Link href="/login" className="hidden text-sm font-bold text-teal sm:block">
            Login
          </Link>
          <Link
            href="/join"
            className="rounded-full bg-yel px-4 py-2.5 text-sm font-bold text-ink md:px-5"
          >
            Join free
          </Link>
          {/* Hamburger */}
          <button
            className="grid h-10 w-10 place-items-center rounded-full border border-[#F0ECD9] text-ink lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <span className="text-lg leading-none">{open ? '✕' : '☰'}</span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="mx-auto mt-2 max-w-[1240px] rounded-3xl2 border border-[#F0ECD9] bg-white p-3 shadow-card lg:hidden">
          <nav className="flex flex-col">
            {NAV.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={clsx(
                  'rounded-2xl px-4 py-3 text-[15px]',
                  active(href) ? 'bg-lteal font-bold text-teal' : 'font-semibold text-[#33635f]',
                )}
              >
                {label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="rounded-2xl px-4 py-3 text-[15px] font-semibold text-[#33635f] sm:hidden"
            >
              Login
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
