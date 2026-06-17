'use client';
import { Mascot } from '@/components/ui/Mascot';
import { CapIcon } from '@/components/ui/CapIcon';
import { member, helpCategories, helpTopics, helpTickets } from '@/lib/mockData';

export default function HelpPage() {
  return (
    <div className="space-y-4">
      {/* Search hero */}
      <div className="flex items-center gap-4 rounded-2xl2 p-6" style={{ background: 'linear-gradient(120deg,#E8F3F3,#FFF6DA)' }}>
        <div className="hidden sm:block"><Mascot size={88} pose="announce" /></div>
        <div className="flex-1">
          <h2 className="text-[22px] font-extrabold text-dteal">How can we help, {member.name}?</h2>
          <div className="mt-3 flex gap-2.5">
            <input placeholder="Search help articles…" className="flex-1 rounded-xl border border-bd bg-white px-4 py-3 text-sm outline-none focus:border-teal" />
            <button className="rounded-xl bg-teal px-5 py-3 text-sm font-bold text-white">Search</button>
          </div>
        </div>
      </div>

      {/* Topics */}
      <h2 className="text-[17px] font-extrabold">Browse by topic</h2>
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {helpCategories.map((c, i) => (
          <div key={i} className="cursor-pointer rounded-2xl border border-bd bg-white p-[18px]">
            <CapIcon name={c[0]} size={44} radius={11} />
            <div className="mt-2 text-[15px] font-bold">{c[1]}</div>
            <div className="mt-0.5 text-xs text-mute">{c[2]}</div>
          </div>
        ))}
      </div>

      {/* Contact + tickets */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.1fr_1fr]">
        <div className="rounded-2xl2 border border-bd bg-white p-5">
          <h3 className="text-base font-extrabold">Contact support</h3>
          <div className="mt-0.5 text-xs font-bold text-green">Typical reply within 1 business day</div>
          <div className="mt-3.5 flex flex-col gap-2.5">
            <select className="rounded-[11px] border border-bd bg-white px-3.5 py-3 text-sm outline-none focus:border-teal">
              {helpTopics.map((o, i) => <option key={i}>{o}</option>)}
            </select>
            <textarea placeholder="Describe your issue…" rows={3} className="resize-none rounded-[11px] border border-bd bg-white px-3.5 py-3 text-sm outline-none focus:border-teal" />
            <div className="cursor-pointer rounded-[11px] border-[1.5px] border-dashed border-bd p-3.5 text-center text-[13px] text-mute">📎 Attach a screenshot</div>
            <div className="text-xs text-[#98A2B3]">Account ID {member.accountId} · {member.email} · {member.countryFlag} {member.country}</div>
            <button className="rounded-[11px] bg-yel py-3 text-sm font-bold text-ink">Send message</button>
          </div>
        </div>
        <div className="rounded-2xl2 border border-bd bg-white p-5">
          <h3 className="mb-3 text-base font-extrabold">Your tickets</h3>
          {helpTickets.map((t, i) => (
            <div key={i} className="flex items-center justify-between py-3" style={{ borderTop: i ? '1px solid #F1ECDB' : 'none' }}>
              <div>
                <div className="text-sm font-bold">{t[1]}</div>
                <div className="text-xs text-[#98A2B3]">{t[0]}</div>
              </div>
              <span className="rounded-full px-2.5 py-1 text-xs font-bold" style={{ color: t[3], background: t[4] }}>{t[2]}</span>
            </div>
          ))}
          <div className="mt-3.5 rounded-xl bg-lteal p-3.5 text-[13px] leading-snug text-dteal">
            <b>Reward not received? </b>Approvals can take up to 48 hours — check your wallet’s “pending” balance first.
          </div>
        </div>
      </div>
    </div>
  );
}
