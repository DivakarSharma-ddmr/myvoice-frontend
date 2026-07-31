'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { asset } from '@/lib/asset';
import { clsx } from '@/lib/clsx';
import { PanelSwitcher } from '@/components/admin/PanelSwitcher';
import { LAB_NAV, LAB_ICONS } from './labNav';
import { useLabUI } from './LabUIProvider';
import { CommandPalette } from './CommandPalette';

function Icon({ icon }: { icon: string }) {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={LAB_ICONS[icon]} />
    </svg>
  );
}

export function AdminLabShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { setPaletteOpen } = useLabUI();
  const [collapsed, setCollapsed] = useState(false);
  const [ready, setReady] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem('mv_admin') !== '1') router.replace('/admin/login');
    else setReady(true);
  }, [router]);

  // Global ⌘K / Ctrl+K to open the command palette.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setPaletteOpen(true); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [setPaletteOpen]);

  useEffect(() => {
    if (!userOpen) return;
    const onDoc = (e: MouseEvent) => { if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [userOpen]);

  const norm = (p: string) => p.replace(/\/$/, '');
  const isActive = (href: string) => {
    const p = norm(pathname ?? '');
    if (href === '/admin-lab') return p === '/admin-lab';
    return p === href || p.startsWith(href + '/');
  };
  const active = LAB_NAV.find((n) => n.href !== '/admin-lab' && isActive(n.href)) ?? LAB_NAV[0];
  const logout = () => { sessionStorage.removeItem('mv_admin'); router.push('/admin/login'); };

  if (!ready) return <div className="min-h-screen bg-ink/5" />;

  return (
    <div className="flex min-h-screen bg-canvas">
      <aside className={clsx('sticky top-0 hidden h-screen shrink-0 flex-col bg-dteal text-white lg:flex', collapsed ? 'w-16' : 'w-60')}>
        <div className="flex h-16 items-center gap-2 px-4">
          <div className="rounded-lg bg-white/95 px-2 py-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset('/assets/logo.webp')} alt="MyVoice" className="h-6" />
          </div>
          {!collapsed && <span className="rounded bg-yel/20 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-yel">Lab</span>}
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-2">
          {LAB_NAV.map((n) => {
            const a = isActive(n.href);
            return (
              <Link key={n.href} href={n.href} title={collapsed ? n.label : undefined}
                className={clsx('flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition', a ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white', collapsed && 'justify-center')}>
                <Icon icon={n.icon} />
                {!collapsed && <span className="truncate">{n.label}</span>}
              </Link>
            );
          })}
        </nav>
        <button type="button" onClick={() => setCollapsed((c) => !c)} className="p-3 text-xs font-semibold text-white/60 hover:text-white">
          {collapsed ? '»' : '« Collapse'}
        </button>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-bd bg-white px-5">
          <div className="flex items-center gap-2 text-xs text-soft">
            <span className="hidden sm:inline">Global</span><span className="hidden sm:inline text-bd">|</span>
            <PanelSwitcher />
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setPaletteOpen(true)} className="flex items-center gap-2 rounded-lg border border-bd px-3 py-1.5 text-xs font-semibold text-soft hover:bg-cream">
              <span>Search</span>
              <kbd className="rounded bg-canvas px-1.5 py-0.5 text-[10px] font-bold text-mute">⌘K</kbd>
            </button>
            <div ref={userRef} className="relative">
              <button type="button" onClick={() => setUserOpen((o) => !o)} className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-cream">
                <span className="text-sm font-bold text-dteal">Divakar</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal text-sm font-bold text-white">D</span>
              </button>
              {userOpen && (
                <div className="absolute right-0 z-30 mt-1 w-44 overflow-hidden rounded-xl border border-bd bg-white py-1 shadow-card">
                  <Link href="/admin-lab/account" onClick={() => setUserOpen(false)} className="block px-3 py-2 text-sm text-ink hover:bg-cream">Account</Link>
                  <button type="button" onClick={logout} className="block w-full px-3 py-2 text-left text-sm text-danger hover:bg-cream">Logout</button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="min-w-0 flex-1 p-5 lg:p-7">
          <div className="mb-5">
            <h1 className="font-sans text-xl font-bold text-dteal">{active.label}</h1>
            <p className="mt-1 text-sm text-soft">
              <Link href="/admin-lab" className="hover:text-teal">Home</Link>
              {active.href !== '/admin-lab' && <> <span className="text-bd">•</span> {active.label}</>}
            </p>
          </div>
          {children}
        </main>
      </div>
      <CommandPalette />
    </div>
  );
}
