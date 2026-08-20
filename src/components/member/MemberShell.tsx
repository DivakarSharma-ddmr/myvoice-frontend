'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { asset } from '@/lib/asset';
import { clsx } from '@/lib/clsx';
import { CapIcon } from '@/components/ui/CapIcon';
import { NavIcon, type NavIconName } from '@/components/ui/NavIcon';
import { useMember } from './MemberProvider';
import { Overlay } from './Overlay';
import { member } from '@/lib/mockData';

// The sidebar splits into two groups: the primary destinations up top, then a
// hairline divider, then the support/config items. Clean line icons (NavIcon)
// replace the Captain tiles in the menu — see NavIcon.tsx.
const NAV_TOP: [string, NavIconName, string][] = [
  ['Dashboard', 'home', '/member/dashboard'],
  ['Surveys', 'surveys', '/member/surveys'],
  ['Rewards', 'rewards', '/member/rewards'],
  ['Profile', 'profile', '/member/profile'],
  ['Community', 'community', '/member/community'],
];
const NAV_BOTTOM: [string, NavIconName, string][] = [
  ['Help Center', 'help', '/member/help'],
  ['Settings', 'settings', '/member/settings'],
];
const NAV = [...NAV_TOP, ...NAV_BOTTOM];
// Mobile bottom nav: the four core destinations, everything else under "More".
const PRIMARY = NAV.slice(0, 4);
const MORE = NAV.slice(4);

const TITLES: Record<string, [string, string]> = {
  '/member/dashboard': ['Hey Ana, ready to play?', 'u2-target'],
  '/member/dashboard/badges': ['Your badges', 'r1-celebrate'],
  '/member/surveys': ['Available surveys', 'u1-share'],
  '/member/rewards': ['Rewards wallet', 'u2-gift'],
  '/member/profile': ['Your profile', 'u1-work'],
  '/member/community': ['Community', 'u2-pets'],
  '/member/community/winners': ['Click Draw winners', 'r1-celebrate'],
  '/member/referrals': ['Referrals', 'u2-handshake'],
  '/member/help': ['Help center', 'u2-idea'],
  '/member/settings': ['Settings', 'u2-gear'],
};

export function MemberShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { streak, tickets, available, fmt } = useMember();
  const [moreOpen, setMoreOpen] = useState(false);
  // Prefix match so a sub-route (e.g. /member/community/winners) still lights
  // up its parent nav item instead of leaving nothing selected.
  const isActive = (href: string) => {
    const p = pathname?.replace(/\/$/, '') ?? '';
    return p === href || p.startsWith(href + '/');
  };

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
      <aside className="sticky top-0 hidden h-screen w-[200px] shrink-0 flex-col bg-dgreen px-3.5 py-4 lg:flex">
        <div className="mb-6 self-start rounded-2xl bg-white px-3 py-2.5 shadow-soft">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset('/assets/logo.webp')} alt="MyVoice by DataDiggers" className="block h-14 w-auto" />
        </div>
        <nav className="flex flex-col gap-1">
          {NAV_TOP.map((item) => (
            <NavLink key={item[2]} item={item} active={isActive(item[2])} />
          ))}
        </nav>
        <div className="my-4 h-px bg-white/10" />
        <nav className="flex flex-col gap-1">
          {NAV_BOTTOM.map((item) => (
            <NavLink key={item[2]} item={item} active={isActive(item[2])} />
          ))}
        </nav>
        <div className="flex-1" />
        <div className="flex items-center justify-between px-2 py-1">
          <span className="text-xs font-semibold text-[#9FBDBD]">🌍 {member.language}</span>
          <Link href="/login" className="text-xs font-bold text-[#9FBDBD] hover:text-white">Logout</Link>
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
            <Chip icon="🔥" val={String(streak)} bg="#FFF4CC" col="#8a6d12"
              tip={`${streak}-day streak — answer a survey today to keep it going`} />
            <Chip icon="🎫" val={String(tickets)} bg="#E8F3F3" col="#1F4F4F" className="hidden sm:flex"
              tip={`Click Draw entries — you have ${tickets} for this month's prize draw`} />
            <Chip icon="💰" val={fmt(available)} bg="#FFF4CC" col="#1C2526"
              tip={`Available balance — ${fmt(available)} ready to withdraw`} />
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
              <span className={clsx('grid h-8 w-8 place-items-center rounded-lg', a ? 'bg-lteal text-teal' : 'text-mute')}>
                <NavIcon name={ic} size={21} />
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
                  className="flex items-center gap-3 rounded-2xl border border-bd p-3 text-sm font-bold text-ink">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-lteal text-teal"><NavIcon name={ic} size={20} /></span> {label}
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

function NavLink({ item, active }: { item: [string, NavIconName, string]; active: boolean }) {
  const [label, ic, href] = item;
  return (
    <Link
      href={href}
      className={clsx(
        'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm',
        active ? 'bg-yel font-bold text-ink' : 'font-semibold text-[#BFE0E0] hover:bg-white/5 hover:text-white',
      )}
    >
      <NavIcon name={ic} className="shrink-0" size={22} />
      {label}
    </Link>
  );
}

function Chip({ icon, val, bg, col, className, tip }: { icon: string; val: string; bg: string; col: string; className?: string; tip?: string }) {
  return (
    <div className={clsx('group relative flex items-center gap-1.5 rounded-full px-3 py-1.5', className)} style={{ background: bg }} aria-label={tip}>
      <span className="text-sm" aria-hidden="true">{icon}</span>
      <span className="text-sm font-extrabold" style={{ color: col }}>{val}</span>
      {tip && (
        <span
          role="tooltip"
          className="pointer-events-none absolute right-0 top-[calc(100%+9px)] z-30 w-max max-w-[230px] origin-top-right scale-90 whitespace-normal rounded-2xl border border-bd bg-cream px-3.5 py-2.5 text-left text-[11.5px] font-semibold leading-snug text-ink opacity-0 shadow-card transition duration-150 ease-out group-hover:scale-100 group-hover:opacity-100"
        >
          {/* Speech-bubble tail — a rotated square that borrows the bubble's own
              fill + border so only its two upper edges read as the pointer. */}
          <span aria-hidden="true" className="absolute -top-1.5 right-5 h-3 w-3 rotate-45 rounded-[3px] border-l border-t border-bd bg-cream" />
          {tip}
        </span>
      )}
    </div>
  );
}
