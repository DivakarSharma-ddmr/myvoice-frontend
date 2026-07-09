'use client';
import { Mascot } from '@/components/ui/Mascot';
import { CapIcon } from '@/components/ui/CapIcon';
import { member, helpCategories, helpTopics } from '@/lib/mockData';

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

      {/* Contact + live chat */}
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

        {/* PLACEHOLDER (dev team): swap this mock chat window for the existing chat
            widget from the old platform. Static demo only — nothing is wired up. */}
        <div className="flex flex-col rounded-2xl2 border border-bd bg-white p-5">
          <h3 className="text-base font-extrabold">Chat with us</h3>
          <div className="mt-3 flex flex-1 flex-col overflow-hidden rounded-xl border border-bd">
            <div className="flex items-center gap-2.5 border-b border-bd bg-lteal px-3.5 py-3">
              <div className="relative shrink-0">
                <Mascot size={34} pose="announce" />
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-green" />
              </div>
              <div className="leading-tight">
                <div className="text-sm font-bold text-dteal">MyVoice Support</div>
                <div className="text-[11px] font-semibold text-green">Drop us a message, we’ll get back to you soon</div>
              </div>
            </div>
            <div className="flex flex-col gap-2 px-3.5 py-4" style={{ background: '#FBFBF7' }} aria-hidden="true">
              <div className="max-w-[82%] self-start rounded-2xl rounded-tl-md bg-lteal px-3 py-2 text-[13px] leading-snug text-dteal">Hi {member.name} 👋 How can we help you today?</div>
              <div className="max-w-[82%] self-end rounded-2xl rounded-tr-md bg-teal px-3 py-2 text-[13px] leading-snug text-white">I have a question about my reward.</div>
              <div className="max-w-[82%] self-start rounded-2xl rounded-tl-md bg-lteal px-3 py-2 text-[13px] leading-snug text-dteal">Happy to help — let me pull up your account.</div>
            </div>
            <div className="flex items-center gap-2 border-t border-bd bg-white px-3 py-2.5">
              <input disabled placeholder="Type a message…" className="flex-1 cursor-not-allowed rounded-full border border-bd bg-canvas px-3.5 py-2 text-[13px] text-mute outline-none" />
              <button disabled className="cursor-not-allowed rounded-full bg-yel px-4 py-2 text-[13px] font-bold text-ink opacity-60">Send</button>
            </div>
          </div>
          <p className="mt-3 text-[11px] leading-snug text-mute">We will reply within standard business hours, 9 AM to 6 PM, Bucharest time.</p>
        </div>
      </div>
    </div>
  );
}
