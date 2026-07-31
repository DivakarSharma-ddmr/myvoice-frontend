'use client';

import { useAdmin } from '@/components/admin/AdminProvider';
import { StatTile } from '@/components/admin/StatTile';
import { NeedsYouNow } from '@/components/admin-lab/NeedsYouNow';

export default function AdminLabHome() {
  const { data, panel } = useAdmin();
  const d = data.dashboard;

  return (
    <div className="space-y-7">
      <section>
        <h2 className="mb-3 font-sans text-base font-bold text-dteal">Needs you now</h2>
        <NeedsYouNow />
      </section>

      <section>
        <h2 className="mb-3 font-sans text-sm font-semibold uppercase tracking-wide text-soft">This month</h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatTile value={d.cintCompleted} label="Cint Surveys Completed" />
          <StatTile value={d.myvoiceCompleted} label="MyVoice Surveys Completed" />
          <StatTile value={d.emailInviteCompleted} label="From Email Invite" />
          <StatTile value={d.pendingRewards} label="Pending Rewards" />
        </div>
      </section>

      <section className="rounded-2xl border border-bd bg-white p-5 shadow-soft">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-sans text-base font-bold text-dteal">Recruitment Source</h2>
          <span className="text-xs text-soft">(Global | {panel.name})</span>
        </div>
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
    </div>
  );
}
