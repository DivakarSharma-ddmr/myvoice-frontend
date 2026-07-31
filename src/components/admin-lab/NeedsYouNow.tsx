'use client';

import Link from 'next/link';
import { useAdmin } from '@/components/admin/AdminProvider';
import { approvalTotal } from '@/lib/adminMockData';

type Card = { n: number | string; label: string; hint: string; href: string; tone: string };

/** "Needs you now" — the operator's queue, derived live from mock data. */
export function NeedsYouNow() {
  const { data } = useAdmin();
  const pending = data.memberRewards.filter((r) => r.status === 'pending');
  const onhold = data.memberRewards.filter((r) => r.status === 'onhold');
  const unread = data.threads.filter((t) => t.messages.at(-1)?.from === 'member');
  const drafts = data.campaigns.filter((c) => c.status === 'draft');

  const cards: Card[] = [
    { n: pending.length, label: 'Pending payouts', hint: `€${approvalTotal(pending)} awaiting approval`, href: '/admin-lab/member-rewards', tone: 'border-amber/40 bg-amber/5' },
    { n: onhold.length, label: 'On hold', hint: 'Rewards paused for review', href: '/admin-lab/member-rewards', tone: 'border-gold/40 bg-gold/5' },
    { n: unread.length, label: 'Unread support', hint: 'Members awaiting a reply', href: '/admin-lab/messages', tone: 'border-teal/40 bg-lteal/40' },
    { n: drafts.length, label: 'Draft campaigns', hint: drafts.length ? 'Unsent campaigns' : 'All campaigns sent', href: '/admin-lab/email-tool', tone: 'border-bd bg-white' },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => (
        <Link key={c.label} href={c.href} className={`rounded-2xl border p-5 shadow-soft transition hover:shadow-card ${c.tone}`}>
          <div className="font-sans text-4xl font-extrabold text-dteal">{c.n}</div>
          <div className="mt-1 text-sm font-bold text-ink">{c.label}</div>
          <div className="mt-0.5 text-xs text-soft">{c.hint}</div>
        </Link>
      ))}
    </div>
  );
}
