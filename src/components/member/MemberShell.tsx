'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { asset } from '@/lib/asset';
import { clsx } from '@/lib/clsx';
import { CapIcon } from '@/components/ui/CapIcon';
import { useMember } from './MemberProvider';
import { Overlay } from './Overlay';
import { member } from '@/lib/mockData';

const NAV: [string, string, string][] = [
  ['Dashboard', 'u2-home', '/member/dashboard'],
  ['Surveys', 'u1-share', '/member/surveys'],
  ['Rewards', 'u2-gift', '/member/rewards'],
  ['Profile', 'u1-work', '/member/profile'],
  ['Community', 'u2-pets', '/member/community'],
  ['Help Center', 'u2-idea', '/member/help'],
  ['Settings', 'u2-gear', '/member/settings'],
];
const PRIMARY = NAV.slice(0, 4);
const MORE = NAV.slice(4);

const TITLES: Record<string, [string, string]> = {
  '/member/dashboard': ['Hey Ana, ready to play?', 'u2-target'],
  '/member/surveys': ['Available surveys', 'u1-share'],
  '/member/rewards': ['Rewards wallet', 'u2-gift'],
  '/member/profile': ['Your profile', 'u1-work'],
  '/member/community': ['Community', 'u2-pets'],
  '/member/referrals': ['Referrals', 'u2-handshake'],
  '/member/help': ['Help center', 'u2-idea'],
  '/member/settings': ['Settings', 'u2-gear'],
};

export function MemberShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { streak, tickets, available, fmt } = useMember();
  const [moreOpen, setMoreOpen] = useState(false);
  const isActive = (href: string) => pathname === href || pathname === href + '/';

  // Onboarding is a full-screen experience with no chrome.
  if (pathname?.includes('/member/welcome')) {
    return (
      <div className="min-h-screen">
        {children}
        <Overlay />
      </div>
    );
  }

  const [title, icon] = TITLES[pathname?.replace(/\/$/, '') ?? ''] ?? ['MyVoice', 'u2-home'];

  return (
    <div className="flex min-h-screen bg-cream">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-[216px] shrink-0 flex-col bg-dteal p-3 lg:flex">
        <div className="mb-4 self-start rounded-xl bg-white px-2.5 py-1.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset('/assets/logo.jpg')} alt="MyVoice" className="h-[22px]" />
        </div>
        <nav className="flex flex-1 flex-col gap-1">
          {NAV.map(([label, ic, href]) => {
            const a = isActive(href);
            return (
              <Link key={href} href={href}
                className={clsx('flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm', a ? 'bg-yel font-bold text-ink' : 'font-semibold text-[#BFE0E0] hover:bg-white/5')}>
                <span className={clsx('grid h-[34px] w-[34px] shrink-0 place-items-center rounded-[10px]', a ? 'bg-white' : 'bg-[#FBF7EC]')}>
                  <CapIcon name={ic} size={24} radius={7} />
                </span>
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="my-2 rounded-2xl bg-white/[.08] p-3">
          <div className="flex items-center gap-2">
            <span className="inline-block animate-qflame text-[15px]">🔥</span>
            <span className="text-[13px] font-bold text-white">{streak}-day streak</span>
          </div>
          <div className="mt-1 text-[11px] text-[#9FBDBD]">Keep it alive — answer today!</div>
        </div>
        <div className="flex items-center justify-between px-2 py-1">
          <span className="text-xs font-semibold text-[#9FBDBD]">🌍 {member.language}</span>
          <Link href="/login" className="text-xs font-bold text-[#9FBDBD]">Logout</Link>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <div className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-bd bg-cream px-4 py-3 md:px-6">
          <h1 className="flex items-center gap-2.5 truncate text-base font-extrabold tracking-tight md:text-xl">
            <span className="hidden sm:inline-flex"><CapIcon name={icon} size={30} radius={8} /></span>
            <span className="truncate">{title}</span>
          </h1>
          <div className="flex items-center gap-2">
            <Chip icon="🔥" val={String(streak)} bg="#FFF4CC" col="#8a6d12" />
            <Chip icon="🎟" val={String(tickets)} bg="#E8F3F3" col="#1F4F4F" className="hidden sm:flex" />
            <Chip icon="💰" val={fmt(available)} bg="#FFF4CC" col="#1C2526" />
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-teal font-extrabold text-white">{member.initials}</span>
          </div>
        </div>

        {/* Scroll area */}
        <main className="nice-scroll flex-1 overflow-y-auto px-4 pb-24 pt-5 md:px-6 lg:pb-6">{children}</main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-around border-t border-bd bg-white/95 px-2 py-1.5 backdrop-blur lg:hidden">
        {PRIMARY.map(([label, ic, href]) => {
          const a = isActive(href);
          return (
            <Link key={href} href={href} className="flex flex-col items-center gap-0.5 px-2 py-1">
              <span className={clsx('grid h-8 w-8 place-items-center rounded-lg', a ? 'bg-lteal' : '')}>
                <CapIcon name={ic} size={22} radius={6} />
              </span>
              <span className={clsx('text-[10px] font-bold', a ? 'text-teal' : 'text-mute')}>{label}</span>
            </Link>
          );
        })}
        <button onClick={() => setMoreOpen(true)} className="flex flex-col items-center gap-0.5 px-2 py-1">
          <span className="grid h-8 w-8 place-items-center rounded-lg text-lg">⋯</span>
          <span className="text-[10px] font-bold text-mute">More</span>
        </button>
      </nav>

      {/* More sheet */}
      {moreOpen && (
        <div className="fixed inset-0 z-40 flex items-end bg-black/40 lg:hidden" onClick={() => setMoreOpen(false)}>
          <div className="w-full rounded-t-3xl2 bg-white p-4" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-bd" />
            <div className="grid grid-cols-2 gap-2">
              {MORE.map(([label, ic, href]) => (
                <Link key={href} href={href} onClick={() => setMoreOpen(false)}
                  className="flex items-center gap-3 rounded-2xl border border-bd p-3 text-sm font-bold">
                  <CapIcon name={ic} size={28} radius={8} /> {label}
                </Link>
              ))}
            </div>
            <Link href="/login" className="mt-3 block rounded-2xl bg-canvas py-3 text-center text-sm font-bold text-mute">Logout</Link>
          </div>
        </div>
      )}

      <Overlay />
    </div>
  );
}

function Chip({ icon, val, bg, col, className }: { icon: string; val: string; bg: string; col: string; className?: string }) {
  return (
    <div className={clsx('flex items-center gap-1.5 rounded-full px-3 py-1.5', className)} style={{ background: bg }}>
      <span className="text-sm">{icon}</span>
      <span className="text-sm font-extrabold" style={{ color: col }}>{val}</span>
    </div>
  );
}
