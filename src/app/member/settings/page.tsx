'use client';
import { useMember } from '@/components/member/MemberProvider';
import { member, notificationToggles } from '@/lib/mockData';

export default function SettingsPage() {
  const m = useMember();
  return (
    <div className="max-w-[780px] space-y-4">
      {/* Account details */}
      <div className="rounded-2xl2 border border-bd bg-white p-5">
        <h3 className="text-base font-extrabold">Account details</h3>
        {[
          ['Email', member.email],
          ['Password', '••••••••'],
          ['Country', `${member.countryFlag} ${member.country}`],
          ['Language', member.language],
        ].map((r, i) => (
          <div key={i} className="flex items-center justify-between border-t border-bd py-3">
            <div>
              <div className="text-[13px] font-semibold text-mute">{r[0]}</div>
              <div className="mt-0.5 text-sm font-bold">{r[1]}</div>
            </div>
            <button className="rounded-[9px] border border-bd bg-white px-3.5 py-2 text-[13px] font-bold text-teal">Edit</button>
          </div>
        ))}
      </div>

      {/* Notifications */}
      <div className="rounded-2xl2 border border-bd bg-white p-5">
        <h3 className="mb-0.5 text-base font-extrabold">Notification preferences</h3>
        {notificationToggles.map((t) => {
          const on = m.toggles[t.key];
          return (
            <div key={t.key} className="flex items-center justify-between border-t border-bd py-3">
              <div>
                <div className="text-sm font-bold">{t.label}</div>
                <div className="text-xs text-mute">{t.sub}</div>
              </div>
              <button onClick={() => m.toggle(t.key)} aria-pressed={on} aria-label={t.label}
                className="relative h-[26px] w-[46px] rounded-full transition-colors" style={{ background: on ? '#22A06B' : '#D9DCD6' }}>
                <span className="absolute top-[3px] h-5 w-5 rounded-full bg-white shadow transition-all" style={{ left: on ? 23 : 3 }} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Privacy */}
      <div className="rounded-2xl2 border border-bd bg-white p-5">
        <h3 className="text-base font-extrabold">Privacy &amp; consent</h3>
        <p className="mt-1.5 text-[13px] leading-snug text-mute">Manage how your data is used. Your answers are only ever used for research, and you can export or delete your data anytime.</p>
        <div className="mt-3.5 flex flex-wrap gap-2.5">
          {['Manage consent', 'Download my data', 'Privacy policy'].map((b, i) => (
            <button key={i} className="rounded-[10px] border border-teal px-4 py-2.5 text-[13px] font-bold"
              style={{ background: i === 0 ? '#336666' : '#fff', color: i === 0 ? '#fff' : '#336666' }}>{b}</button>
          ))}
        </div>
      </div>

      {/* Danger */}
      <div className="rounded-2xl2 border bg-white p-5" style={{ borderColor: '#F3D6D2' }}>
        <h3 className="text-base font-extrabold" style={{ color: '#B42318' }}>Delete account</h3>
        <p className="mt-1.5 text-[13px] leading-snug text-mute">Permanently remove your account, balance and data. This cannot be undone.</p>
        <button className="mt-3 rounded-[10px] border px-4 py-2.5 text-[13px] font-bold" style={{ borderColor: '#E5786D', color: '#B42318' }}>Delete my account</button>
      </div>
    </div>
  );
}
