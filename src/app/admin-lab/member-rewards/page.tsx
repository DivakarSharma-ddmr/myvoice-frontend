'use client';

import { useMemo, useState } from 'react';
import { useAdmin } from '@/components/admin/AdminProvider';
import { StatusPill } from '@/components/admin/StatusPill';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { RowActions } from '@/components/admin-lab/RowActions';
import { approvalTotal, type MemberReward } from '@/lib/adminMockData';
import { clsx } from '@/lib/clsx';

type Seg = 'pending' | 'onhold' | 'approved' | 'rejected';
const SEGMENTS: { id: Seg; label: string }[] = [
  { id: 'pending', label: 'Pending' },
  { id: 'onhold', label: 'On Hold' },
  { id: 'approved', label: 'Approved' },
  { id: 'rejected', label: 'Rejected' },
];

export default function LabMemberRewards() {
  const { data, setRewardStatus, bulkReward } = useAdmin();
  const [seg, setSeg] = useState<Seg>('pending');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirm, setConfirm] = useState<null | 'approved' | 'rejected'>(null);

  const counts = useMemo(() => {
    const c: Record<Seg, number> = { pending: 0, onhold: 0, approved: 0, rejected: 0 };
    for (const r of data.memberRewards) c[r.status]++;
    return c;
  }, [data.memberRewards]);

  // Per-member context: how many total redemptions + their account status.
  const context = useMemo(() => {
    const byMember = new Map<number, number>();
    for (const r of data.memberRewards) byMember.set(r.memberId, (byMember.get(r.memberId) ?? 0) + 1);
    const statusOf = new Map<number, string>();
    for (const m of data.members) statusOf.set(m.id, m.status);
    return { byMember, statusOf };
  }, [data.memberRewards, data.members]);

  const rows = data.memberRewards.filter((r) => r.status === seg);
  const selectedRows = rows.filter((r) => selected.has(r.id));
  const total = approvalTotal(selectedRows);
  const ids = selectedRows.map((r) => r.id);

  const toggle = (id: string) => setSelected((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleAll = () => setSelected((s) => (rows.every((r) => s.has(r.id)) ? new Set() : new Set(rows.map((r) => r.id))));
  const runBulk = () => { if (confirm) { bulkReward(ids, confirm); setSelected(new Set()); } setConfirm(null); };

  return (
    <div className="space-y-4">
      {/* Segmented filter with counts */}
      <div className="flex flex-wrap gap-2">
        {SEGMENTS.map((s) => (
          <button key={s.id} type="button" onClick={() => { setSeg(s.id); setSelected(new Set()); }}
            className={clsx('rounded-full px-4 py-1.5 text-sm font-semibold transition', seg === s.id ? 'bg-dteal text-white' : 'border border-bd bg-white text-soft hover:bg-cream')}>
            {s.label} <span className={clsx('ml-1', seg === s.id ? 'text-white/70' : 'text-mute')}>{counts[s.id]}</span>
          </button>
        ))}
      </div>

      {selected.size > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-teal/30 bg-lteal/40 px-4 py-2.5">
          <span className="mr-auto text-sm font-semibold text-dteal">{selected.size} selected · €{total}</span>
          <button type="button" onClick={() => setConfirm('approved')} className="rounded-lg bg-yel px-3 py-1.5 text-sm font-bold text-ink hover:brightness-95">Approve</button>
          <button type="button" onClick={() => setConfirm('rejected')} className="rounded-lg border border-bd bg-white px-3 py-1.5 text-sm font-semibold text-mute hover:bg-canvas">Reject</button>
          <button type="button" onClick={() => setSelected(new Set())} className="rounded-lg px-3 py-1.5 text-sm font-semibold text-soft hover:bg-white">Clear</button>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-bd bg-white shadow-soft">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-lteal/50 text-left text-dteal">
            <tr>
              <th className="px-4 py-3 w-10"><input type="checkbox" aria-label="Select all" checked={rows.length > 0 && rows.every((r) => selected.has(r.id))} onChange={toggleAll} /></th>
              <th className="px-4 py-3 font-bold">Reward</th>
              <th className="px-4 py-3 font-bold">Member</th>
              <th className="px-4 py-3 text-right font-bold">Value</th>
              <th className="px-4 py-3 font-bold">Date</th>
              <th className="px-4 py-3 text-right font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan={6} className="px-4 py-12 text-center text-soft">Nothing {seg === 'onhold' ? 'on hold' : seg}.</td></tr>}
            {rows.map((r) => {
              const redemptions = context.byMember.get(r.memberId) ?? 1;
              const mStatus = context.statusOf.get(r.memberId);
              return (
                <tr key={r.id} className="border-t border-bd/70 hover:bg-cream">
                  <td className="px-4 py-3"><input type="checkbox" aria-label={`Select ${r.id}`} checked={selected.has(r.id)} onChange={() => toggle(r.id)} /></td>
                  <td className="px-4 py-3 font-semibold text-ink">{r.reward}</td>
                  <td className="px-4 py-3">
                    <div className="text-ink">{r.email}</div>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-soft">
                      <span>#{r.memberId}</span>
                      <span className="text-bd">·</span>
                      <span>{redemptions} redemption{redemptions === 1 ? '' : 's'}</span>
                      {mStatus && <><span className="text-bd">·</span><StatusPill status={mStatus} /></>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-ink">€{r.value}</td>
                  <td className="px-4 py-3 text-soft">{r.date}</td>
                  <td className="px-4 py-3 text-right">
                    <RowActions
                      primary={r.status !== 'approved' ? { label: 'Approve', onClick: () => setRewardStatus(r.id, 'approved') } : undefined}
                      items={[
                        { label: 'Reject', danger: true, onClick: () => setRewardStatus(r.id, 'rejected') },
                        { label: 'On Hold', onClick: () => setRewardStatus(r.id, 'onhold') },
                        { label: 'Mark Pending', onClick: () => setRewardStatus(r.id, 'pending') },
                      ]}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={confirm !== null}
        title={confirm === 'approved' ? `Approve ${ids.length} payout${ids.length === 1 ? '' : 's'}?` : `Reject ${ids.length} payout${ids.length === 1 ? '' : 's'}?`}
        tone={confirm === 'rejected' ? 'danger' : 'default'}
        confirmLabel={confirm === 'approved' ? `Approve · €${total}` : 'Reject'}
        body={confirm === 'approved' ? <>Total <strong>€{total}</strong> to {ids.length} member{ids.length === 1 ? '' : 's'}.</> : <>This rejects {ids.length} request{ids.length === 1 ? '' : 's'}.</>}
        onConfirm={runBulk}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
}
