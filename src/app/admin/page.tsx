'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAdmin } from '@/components/admin/AdminProvider';
import { StatTile } from '@/components/admin/StatTile';
import { StatusPill } from '@/components/admin/StatusPill';

export default function AdminHome() {
  const { data, panel } = useAdmin();
  const d = data.dashboard;
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  return (
    <div className="space-y-6">
      {/* Summary tiles */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile value={d.pendingRewards} label="Pending Rewards" />
        <StatTile value={d.cintCompleted} label="Cint Surveys Completed This Month" />
        <StatTile value={d.myvoiceCompleted} label="MyVoice Surveys Completed This Month" />
        <StatTile value={d.emailInviteCompleted} label="Survey Complete From Email Invite This Month" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recruitment source */}
        <section className="rounded-2xl border border-bd bg-white p-5 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-sans text-base font-bold text-dteal">Recruitment Source</h2>
            <span className="text-xs text-soft">Weekly Statistics</span>
          </div>
          <div className="mb-4 flex flex-wrap items-end gap-3">
            <label className="text-xs font-semibold text-soft">
              Start Date
              <input type="date" value={start} onChange={(e) => setStart(e.target.value)} className="mt-1 block rounded-lg border border-bd px-2 py-1.5 text-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-teal/40" />
            </label>
            <label className="text-xs font-semibold text-soft">
              End Date
              <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="mt-1 block rounded-lg border border-bd px-2 py-1.5 text-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-teal/40" />
            </label>
            <button type="button" className="rounded-lg bg-teal px-4 py-2 text-sm font-semibold text-white hover:bg-dteal">Submit</button>
            <button type="button" onClick={() => { setStart(''); setEnd(''); }} className="rounded-lg border border-bd px-4 py-2 text-sm font-semibold text-mute hover:bg-canvas">Clear</button>
          </div>
          <p className="mb-2 text-xs text-soft">(Global | {panel.name})</p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm">
              <thead className="text-left text-dteal">
                <tr className="border-b border-bd">
                  <th className="py-2 pr-3 font-bold">Source</th>
                  <th className="py-2 pr-3 font-bold">Hits</th>
                  <th className="py-2 pr-3 font-bold">Registered</th>
                  <th className="py-2 pr-3 font-bold">Verified</th>
                  <th className="py-2 font-bold">Conversion</th>
                </tr>
              </thead>
              <tbody>
                {d.recruitment.map((r) => (
                  <tr key={r.source} className="border-b border-bd/60">
                    <td className="py-2 pr-3 text-ink">{r.source}</td>
                    <td className="py-2 pr-3 text-soft">{r.hits}</td>
                    <td className="py-2 pr-3 text-soft">{r.registered}</td>
                    <td className="py-2 pr-3 text-soft">{r.verified}</td>
                    <td className="py-2 text-soft">{r.conversion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Feed */}
        <section className="rounded-2xl border border-bd bg-white p-5 shadow-soft">
          <h2 className="mb-4 font-sans text-base font-bold text-dteal">Feed</h2>
          <div className="flex h-40 items-center justify-center rounded-xl bg-cream text-sm text-soft">
            No recent events.
          </div>
        </section>
      </div>

      {/* Recent rewards */}
      <section className="rounded-2xl border border-bd bg-white p-5 shadow-soft">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-sans text-base font-bold text-dteal">Rewards</h2>
          <Link href="/admin/member-rewards" className="text-sm font-semibold text-teal hover:text-dteal">View All</Link>
        </div>
        {d.recentRewards.length === 0 ? (
          <div className="flex h-24 items-center justify-center rounded-xl bg-cream text-sm text-soft">No pending rewards.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-left text-dteal">
              <tr className="border-b border-bd">
                <th className="py-2 font-bold">Date</th>
                <th className="py-2 font-bold">Value</th>
                <th className="py-2 font-bold">Status</th>
              </tr>
            </thead>
            <tbody>
              {d.recentRewards.map((r, i) => (
                <tr key={i} className="border-b border-bd/60">
                  <td className="py-2 text-ink">{r.date}</td>
                  <td className="py-2 text-ink">€{r.value}</td>
                  <td className="py-2"><StatusPill status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
