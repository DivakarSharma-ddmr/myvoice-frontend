'use client';
import { useState } from 'react';
import Link from 'next/link';
import { member } from '@/lib/mockData';
import { SettingsField } from '@/components/member/SettingsField';

// PLACEHOLDER (dev team): every group here is display-only. In the real build
// Edit swaps the group into a form bound to the account API. Nothing persists
// in this static mock — Save simply closes the group.
//
// Fourteen account fields stacked open made this page a long scroll, so the
// groups collapse and only one opens at a time. The collapsed row still shows
// its own data in one line: a member checking which email we hold should not
// have to open anything, and an accordion that hides everything just trades
// scrolling for clicking.
function Group({
  id,
  title,
  summary,
  note,
  open,
  onToggle,
  children,
}: {
  id: string;
  title: string;
  summary: string;
  note?: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  const [editing, setEditing] = useState(false);

  return (
    <section className="border-t border-bd first:border-t-0">
      <h4>
        <button
          type="button"
          onClick={() => {
            if (open) setEditing(false);
            onToggle();
          }}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          className="flex w-full items-center gap-3 py-3.5 text-left"
        >
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-extrabold text-dteal">{title}</span>
            <span className="mt-0.5 block truncate text-[13px] text-mute">{summary}</span>
          </span>
          {/* The system's signature accordion glyph: + rotates 45° into ×. */}
          <span
            aria-hidden="true"
            className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-bd text-base font-bold text-teal transition-transform duration-200"
            style={{ transform: open ? 'rotate(45deg)' : 'none' }}
          >
            +
          </span>
        </button>
      </h4>

      {/* Collapsed groups are unmounted rather than visually hidden: a
          height-animated panel leaves its fields and links in the tab order,
          so a keyboard member tabs into controls they cannot see. The rotating
          glyph carries the state change instead. */}
      {open && (
        <div id={`${id}-panel`} className="pb-4">
          {note && <p className="max-w-[46ch] text-[11px] leading-snug text-mute">{note}</p>}
          {children}
          <div className="flex flex-wrap gap-2 pt-3">
            {editing ? (
              <>
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
              </>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="rounded-[9px] border border-bd bg-white px-3.5 py-2 text-[13px] font-bold text-teal"
              >
                Edit {title.toLowerCase()}
              </button>
            )}
          </div>
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
  // One open group at a time: opening a second closes the first, so the page
  // never grows back into the long scroll this replaced.
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const groupProps = (id: string) => ({
    id,
    open: openGroup === id,
    onToggle: () => setOpenGroup((cur) => (cur === id ? null : id)),
  });

  return (
    <div className="max-w-[780px] space-y-4">
      {/* Account details — anchor target for the Help Center "Account" card */}
      <div id="account" className="scroll-mt-24 rounded-2xl2 border border-bd bg-white p-5">
        <h3 className="text-base font-extrabold">Account details</h3>
        <p className="mt-1 text-[13px] leading-snug text-mute">
          Everything we hold on your account. Open a section to change it.
        </p>

        <div className="mt-3">
          <Group
            {...groupProps('personal')}
            title="Personal details"
            summary={`${member.firstName} ${member.lastName} · ${member.gender} · born ${member.yearOfBirth}`}
          >
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

          <Group
            {...groupProps('contact')}
            title="Contact"
            summary={`${member.email} · ${member.countryFlag} ${member.country}`}
          >
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
            {...groupProps('payments')}
            title="Payments"
            summary={member.paypalEmail || 'No PayPal address yet'}
            note="Change your PayPal address and we send a confirmation link to it. Payouts keep going to your current address until you confirm."
          >
            <SettingsField label="PayPal email" value={member.paypalEmail} />
          </Group>

          <Group {...groupProps('security')} title="Security" summary="Password">
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
