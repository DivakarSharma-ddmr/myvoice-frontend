'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { asset } from '@/lib/asset';
import { clsx } from '@/lib/clsx';
import { PanelSwitcher } from './PanelSwitcher';
import { useAdmin } from './AdminProvider';

type NavItem = { label: string; href: string; icon: string };

const NAV: NavItem[] = [
  { label: 'Home', href: '/admin', icon: 'home' },
  { label: 'Access Control', href: '/admin/access-control', icon: 'wrench' },
  { label: 'Members', href: '/admin/members', icon: 'list' },
  { label: "Member's Rewards", href: '/admin/member-rewards', icon: 'bag' },
  { label: 'Manage Rewards', href: '/admin/manage-rewards', icon: 'gift' },
  { label: 'Payment Email Settings', href: '/admin/payment-email', icon: 'mail' },
  { label: 'Panel Settings', href: '/admin/panel-settings', icon: 'gear' },
  { label: 'Account', href: '/admin/account', icon: 'user' },
  { label: 'Email Tool', href: '/admin/email-tool', icon: 'send' },
  { label: 'Report', href: '/admin/report', icon: 'doc' },
  { label: 'Recruitment', href: '/admin/recruitment', icon: 'users' },
  { label: 'MyVoice Message Center', href: '/admin/messages', icon: 'chat' },
];

const ICONS: Record<string, React.ReactNode> = {
  home: <path d="M3 10.5 12 3l9 7.5M5 9.5V21h14V9.5" />,
  wrench: <path d="M14.5 6a3.5 3.5 0 0 0 4.6 4.6L21 12l-9 9-3-3 9-9 1.4-1.9A3.5 3.5 0 0 0 14.5 6Z" />,
  list: <><path d="M8 6h13M8 12h13M8 18h13" /><path d="M3 6h.01M3 12h.01M3 18h.01" /></>,
  bag: <><path d="M6 7h12l1 13H5L6 7Z" /><path d="M9 7a3 3 0 0 1 6 0" /></>,
  gift: <><path d="M20 12v9H4v-9" /><path d="M2 7h20v5H2zM12 22V7M12 7S9 3 6.5 5 12 7 12 7Zm0 0s3-4 5.5-2S12 7 12 7Z" /></>,
  mail: <><path d="M3 6h18v12H3z" /><path d="m3 7 9 6 9-6" /></>,
  gear: <><circle cx="12" cy="12" r="3" /><path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.4-2.3 1a7 7 0 0 0-1.7-1L14.5 3h-5l-.4 2.6a7 7 0 0 0-1.7 1l-2.3-1-2 3.4L3.1 11a7 7 0 0 0 0 2l-2 1.5 2 3.4 2.3-1a7 7 0 0 0 1.7 1l.4 2.6h5l.4-2.6a7 7 0 0 0 1.7-1l2.3 1 2-3.4-2-1.5a7 7 0 0 0 .1-1Z" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  send: <path d="m22 2-7 20-4-9-9-4 20-7Z" />,
  doc: <><path d="M6 2h9l5 5v15H6z" /><path d="M15 2v5h5M9 13h6M9 17h6" /></>,
  users: <><circle cx="9" cy="8" r="3.5" /><path d="M2 21a7 7 0 0 1 14 0" /><path d="M17 5a3.5 3.5 0 0 1 0 7M22 21a7 7 0 0 0-5-6.7" /></>,
  chat: <path d="M21 12a8 8 0 0 1-11.5 7.2L3 21l1.8-6.5A8 8 0 1 1 21 12Z" />,
};

function NavIcon({ icon }: { icon: string }) {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[icon]}
    </svg>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { panel } = useAdmin();
  const [collapsed, setCollapsed] = useState(false);
  const [ready, setReady] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const userRef = useRef<HTMLDivElement>(null);

  // Cosmetic auth guard: block protected content until a mock session is present.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem('mv_admin') !== '1') router.replace('/admin/login');
    else setReady(true);
  }, [router]);

  useEffect(() => {
    if (!userOpen) return;
    const onDoc = (e: MouseEvent) => { if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [userOpen]);

  const norm = (p: string) => p.replace(/\/$/, '');
  const isActive = (href: string) => {
    const p = norm(pathname ?? '');
    if (href === '/admin') return p === '/admin';
    return p === href || p.startsWith(href + '/');
  };
  const active = NAV.find((n) => n.href !== '/admin' && isActive(n.href)) ?? NAV[0];

  const logout = () => { sessionStorage.removeItem('mv_admin'); router.push('/admin/login'); };

  if (!ready) return <div className="min-h-screen bg-canvas" />;

  return (
    <div className="flex min-h-screen bg-canvas">
      <aside className={clsx('sticky top-0 hidden h-screen shrink-0 flex-col border-r border-bd bg-white lg:flex', collapsed ? 'w-16' : 'w-64')}>
        <div className="flex h-16 items-center border-b border-bd px-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset('/assets/logo.webp')} alt="MyVoice" className={clsx('h-8', collapsed && 'mx-auto')} />
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-2">
          {NAV.map((n) => {
            const a = isActive(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                title={collapsed ? n.label : undefined}
                className={clsx(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition',
                  a ? 'bg-lteal text-dteal' : 'text-soft hover:bg-cream hover:text-teal',
                  collapsed && 'justify-center'
                )}
              >
                <NavIcon icon={n.icon} />
                {!collapsed && <span className="truncate">{n.label}</span>}
              </Link>
            );
          })}
        </nav>
        <button type="button" onClick={() => setCollapsed((c) => !c)} className="border-t border-bd p-3 text-xs font-semibold text-soft hover:text-teal">
          {collapsed ? '»' : '« Collapse'}
        </button>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-bd bg-white px-5">
          <div className="flex items-center gap-2 text-xs text-soft">
            <span className="hidden sm:inline">Global</span>
            <span className="hidden sm:inline text-bd">|</span>
            <PanelSwitcher />
          </div>
          <div ref={userRef} className="relative">
            <button type="button" onClick={() => setUserOpen((o) => !o)} className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-cream">
              <span className="text-sm font-bold text-dteal">Divakar</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal text-sm font-bold text-white">D</span>
            </button>
            {userOpen && (
              <div className="absolute right-0 z-30 mt-1 w-44 overflow-hidden rounded-xl border border-bd bg-white py-1 shadow-card">
                <Link href="/admin/account" onClick={() => setUserOpen(false)} className="block px-3 py-2 text-sm text-ink hover:bg-cream">Account</Link>
                <button type="button" onClick={logout} className="block w-full px-3 py-2 text-left text-sm text-danger hover:bg-cream">Logout</button>
              </div>
            )}
          </div>
        </header>

        <main className="min-w-0 flex-1 p-5 lg:p-7">
          <div className="mb-5">
            <h1 className="font-sans text-xl font-bold text-dteal">{active.label}</h1>
            <p className="mt-1 text-sm text-soft">
              <Link href="/admin" className="hover:text-teal">Home</Link>
              {active.href !== '/admin' && <> <span className="text-bd">•</span> {active.label}</>}
              <span className="ml-2 text-bd">· {panel.name}</span>
            </p>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
