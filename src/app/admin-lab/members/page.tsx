'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useAdmin } from '@/components/admin/AdminProvider';
import { StatusPill } from '@/components/admin/StatusPill';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { DetailDrawer } from '@/components/admin-lab/DetailDrawer';
import { useLabUI } from '@/components/admin-lab/LabUIProvider';
import { PANELS, TOTALS, type Member } from '@/lib/adminMockData';
import { clsx } from '@/lib/clsx';

const STATUS_CHIPS = ['all', 'active', 'sleeping', 'unsubscribed', 'inactive'];

export default function LabMembers() {
  const { data, deleteMember } = useAdmin();
  const { focusMemberId, setFocusMemberId } = useLabUI();
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('all');
  const [country, setCountry] = useState('all');
  const [dense, setDense] = useState(false);
  const [view, setView] = useState<Member | null>(null);
  const [login, setLogin] = useState<Member | null>(null);
  const [del, setDel] = useState<Member | null>(null);

  // Command-palette jump: open the drawer for the focused member.
  useEffect(() => {
    if (focusMemberId != null) {
      const m = data.members.find((x) => x.id === focusMemberId);
      if (m) { setView(m); setQ(String(focusMemberId)); }
      setFocusMemberId(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusMemberId]);

  const rows = useMemo(() => data.members.filter((m) => {
    if (status !== 'all' && m.status !== status) return false;
    if (country !== 'all' && m.country !== country) return false;
    if (q) { const s = q.toLowerCase(); if (!String(m.id).includes(s) && !m.email.toLowerCase().includes(s)) return false; }
    return true;
  }), [data.members, status, country, q]);

  const shown = rows.slice(0, 25);
  const pad = dense ? 'px-4 py-2' : 'px-4 py-3';
  const redemptionsOf = (id: number) => data.memberRewards.filter((r) => r.memberId === id);

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-bd bg-white p-3 shadow-soft">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search id or email…" aria-label="Search members" className="min-w-[200px] flex-1 rounded-lg border border-bd px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-teal/40" />
        <div className="flex flex-wrap gap-1">
          {STATUS_CHIPS.map((s) => (
            <button key={s} type="button" onClick={() => setStatus(s)} className={clsx('rounded-full px-3 py-1.5 text-xs font-semibold capitalize', status === s ? 'bg-teal text-white' : 'border border-bd text-soft hover:bg-cream')}>{s}</button>
          ))}
        </div>
        <select value={country} onChange={(e) => setCountry(e.target.value)} aria-label="Country" className="rounded-lg border border-bd px-3 py-2 text-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-teal/40">
          <option value="all">All countries</option>
          {PANELS.map((p) => <option key={p.id} value={p.name}>{p.name}</option>)}
        </select>
        <button type="button" onClick={() => setDense((d) => !d)} className="rounded-lg border border-bd px-3 py-2 text-xs font-semibold text-soft hover:bg-cream">{dense ? 'Comfortable' : 'Compact'}</button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-bd bg-white shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="sticky top-0 bg-lteal/50 text-left text-dteal">
              <tr>
                <th className={clsx(pad, 'font-bold')}>Id</th>
                <th className={clsx(pad, 'font-bold')}>Email</th>
                <th className={clsx(pad, 'font-bold')}>Gender</th>
                <th className={clsx(pad, 'font-bold')}>Birth Year</th>
                <th className={clsx(pad, 'font-bold')}>Postal</th>
                <th className={clsx(pad, 'font-bold')}>Status</th>
                <th className={clsx(pad, 'font-bold')}>Country</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((m) => (
                <tr key={m.id} onClick={() => setView(m)} className="cursor-pointer border-t border-bd/70 hover:bg-cream">
                  <td className={clsx(pad, 'font-semibold text-ink')}>{m.id}</td>
                  <td className={clsx(pad, 'text-ink')}>{m.email}</td>
                  <td className={clsx(pad, 'text-soft')}>{m.gender}</td>
                  <td className={clsx(pad, 'text-soft')}>{m.birthYear}</td>
                  <td className={clsx(pad, 'text-soft')}>{m.postalCode}</td>
                  <td className={pad}><StatusPill status={m.status} /></td>
                  <td className={clsx(pad, 'text-soft')}>{m.country}</td>
                </tr>
              ))}
              {shown.length === 0 && <tr><td colSpan={7} className="px-4 py-12 text-center text-soft">No members match.</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="border-t border-bd px-4 py-3 text-sm text-soft">Showing {shown.length} of {rows.length.toLocaleString()} filtered · {TOTALS.members.toLocaleString()} total</div>
      </div>

      {/* Detail drawer */}
      <DetailDrawer
        open={view !== null}
        title={view ? `Member #${view.id}` : ''}
        subtitle={view?.email}
        onClose={() => setView(null)}
        footer={view && (
          <div className="flex gap-2">
            <button type="button" onClick={() => { setLogin(view); }} className="flex-1 rounded-xl border border-teal bg-white px-4 py-2.5 text-sm font-semibold text-teal hover:bg-lteal/40">Login as member</button>
            <button type="button" onClick={() => { setDel(view); }} className="rounded-xl border border-danger/40 px-4 py-2.5 text-sm font-semibold text-danger hover:bg-danger/10">Delete</button>
          </div>
        )}
      >
        {view && (
          <div className="space-y-5">
            <Link href={`/admin-lab/members/${view.id}`} className="inline-flex items-center gap-1 text-sm font-semibold text-teal hover:underline">Open full profile →</Link>
            <dl className="grid grid-cols-2 gap-y-2.5 text-sm">
              <dt className="text-soft">Status</dt><dd><StatusPill status={view.status} /></dd>
              <dt className="text-soft">Gender</dt><dd className="text-ink">{view.gender}</dd>
              <dt className="text-soft">Birth Year</dt><dd className="text-ink">{view.birthYear}</dd>
              <dt className="text-soft">Postal Code</dt><dd className="text-ink">{view.postalCode}</dd>
              <dt className="text-soft">Country</dt><dd className="text-ink">{view.country}</dd>
            </dl>
            <div>
              <h3 className="mb-2 text-sm font-bold text-dteal">Recent redemptions</h3>
              {redemptionsOf(view.id).length === 0 ? (
                <p className="text-sm text-soft">None on record.</p>
              ) : (
                <ul className="space-y-1.5">
                  {redemptionsOf(view.id).map((r) => (
                    <li key={r.id} className="flex items-center justify-between rounded-lg bg-cream px-3 py-2 text-sm">
                      <span className="text-ink">{r.reward} · €{r.value}</span>
                      <StatusPill status={r.status} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </DetailDrawer>

      <ConfirmDialog open={login !== null} title="Login as member?" confirmLabel="Login as member"
        body={login && <>Open the member platform as <strong>#{login.id}</strong> ({login.email}).</>}
        onConfirm={() => setLogin(null)} onCancel={() => setLogin(null)} />
      <ConfirmDialog open={del !== null} title="Delete member?" tone="danger" confirmLabel="Delete"
        body={del && <>Permanently remove member <strong>#{del.id}</strong>. This cannot be undone.</>}
        onConfirm={() => { if (del) deleteMember(del.id); setDel(null); setView(null); }} onCancel={() => setDel(null)} />
    </div>
  );
}
