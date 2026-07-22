'use client';
import { useState } from 'react';
import Link from 'next/link';
import { member } from '@/lib/mockData';
import { SettingsField } from '@/components/member/SettingsField';

// PLACEHOLDER (dev team): every group here is display-only. In the real build
// Edit swaps the group into a form bound to the account API. Nothing persists
// in this static mock — Save simply closes the group.
function Group({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  const [editing, setEditing] = useState(false);
  return (
    <section className="border-t border-bd pt-4 first:border-t-0 first:pt-0">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="text-sm font-extrabold text-dteal">{title}</h4>
          {note && <p className="mt-0.5 max-w-[46ch] text-[11px] leading-snug text-mute">{note}</p>}
        </div>
        <button
          onClick={() => setEditing((v) => !v)}
          className="shrink-0 rounded-[9px] border border-bd bg-white px-3.5 py-2 text-[13px] font-bold text-teal"
        >
          {editing ? 'Cancel' : 'Edit'}
        </button>
      </div>
      <div className="mt-1">{children}</div>
      {editing && (
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={() => setEditing(false)}
            className="rounded-[10px] bg-yel px-4 py-2.5 text-[13px] font-bold text-ink"
          >
            Save changes
          </button>
          <button
            onClick={() => setEditing(false)}
            className="rounded-[10px] border border-bd bg-white px-4 py-2.5 text-[13px] font-bold text-mute"
          >
            Cancel
          </button>
        </div>
      )}
    </section>
  );
}

const LEGAL_LINKS: [string, string][] = [
  ['Privacy policy', '/legal/privacy'],
  ['Cookie policy', '/legal/cookies'],
  ['Terms & conditions', '/legal/terms'],
];

export default function SettingsPage() {
  return (
    <div className="max-w-[780px] space-y-4">
      {/* Account details — anchor target for the Help Center "Account" card */}
      <div id="account" className="scroll-mt-24 rounded-2xl2 border border-bd bg-white p-5">
        <h3 className="text-base font-extrabold">Account details</h3>

        <div className="mt-4 space-y-5">
          <Group title="Personal details">
            <div className="flex items-center gap-3 border-t border-bd py-3">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-teal text-base font-extrabold text-white">
                {member.initials}
              </span>
              <div>
                <div className="text-[13px] font-semibold text-mute">Profile picture</div>
                {/* PLACEHOLDER (dev team): no upload is wired up. */}
                <label className="mt-1 inline-block cursor-pointer rounded-[9px] border border-bd px-3 py-1.5 text-[12px] font-bold text-teal">
                  Upload a photo
                  <input type="file" accept="image/*" className="sr-only" />
                </label>
              </div>
            </div>
            <SettingsField label="First name" value={member.firstName} />
            <SettingsField label="Last name" value={member.lastName} />
            <SettingsField
              label="Gender"
              value={member.gender}
              locked
              hint="Used to match you to the right surveys."
            />
            <SettingsField
              label="Year of birth"
              value={member.yearOfBirth}
              locked
              hint="Used to match you to the right surveys."
            />
          </Group>

          <Group title="Contact">
            <SettingsField label="Email" value={member.email} />
            <SettingsField label="Secondary email" value={member.secondaryEmail} />
            <SettingsField label="Phone number" value={member.phone} />
            <SettingsField label="Address" value={member.address} />
            <SettingsField label="Post code" value={member.postCode} />
            <SettingsField
              label="Country"
              value={`${member.countryFlag} ${member.country}`}
              locked
              hint="Surveys are matched to your country."
            />
            <SettingsField label="Language" value={member.language} />
          </Group>

          <Group
            title="Payments"
            note="Change your PayPal address and we send a confirmation link to it. Payouts keep going to your current address until you confirm."
          >
            <SettingsField label="PayPal email" value={member.paypalEmail} />
          </Group>

          <Group title="Security">
            <SettingsField label="Password" value="••••••••" />
          </Group>
        </div>
      </div>

      {/* Privacy — anchor target for the Help Center "Privacy" card */}
      <div id="privacy" className="scroll-mt-24 rounded-2xl2 border border-bd bg-white p-5">
        <h3 className="text-base font-extrabold">Privacy &amp; consent</h3>
        <p className="mt-1.5 text-[13px] leading-snug text-mute">
          Manage how your data is used. Your answers are only ever used for research, and you can
          delete your data anytime.
        </p>
        <div className="mt-3.5 flex flex-wrap gap-2.5">
          <button className="rounded-[10px] border border-teal bg-teal px-4 py-2.5 text-[13px] font-bold text-white">
            Manage consent
          </button>
          {LEGAL_LINKS.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="rounded-[10px] border border-teal bg-white px-4 py-2.5 text-[13px] font-bold text-teal"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Danger */}
      <div className="rounded-2xl2 border bg-white p-5" style={{ borderColor: '#F3D6D2' }}>
        <h3 className="text-base font-extrabold" style={{ color: '#B42318' }}>
          Delete account
        </h3>
        <p className="mt-1.5 text-[13px] leading-snug text-mute">
          Permanently remove your account, balance and data. This cannot be undone.
        </p>
        <button
          className="mt-3 rounded-[10px] border px-4 py-2.5 text-[13px] font-bold"
          style={{ borderColor: '#E5786D', color: '#B42318' }}
        >
          Delete my account
        </button>
      </div>
    </div>
  );
}
