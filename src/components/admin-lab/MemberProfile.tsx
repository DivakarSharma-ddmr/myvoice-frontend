'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useAdmin } from '@/components/admin/AdminProvider';
import { StatusPill } from '@/components/admin/StatusPill';
import { DataTable, type Column } from '@/components/admin/DataTable';
import { TextField, Select } from '@/components/admin/Field';
import { memberDetail, TXN_TYPES, TXN_STATUSES, type Member, type MemberTransaction, type MemberMessage } from '@/lib/adminMockData';

const STATUS_OPTS = [
  { value: 'active', label: 'Active' },
  { value: 'sleeping', label: 'Sleeping' },
  { value: 'unsubscribed', label: 'Unsubscribed' },
  { value: 'inactive', label: 'Inactive' },
];
const GENDER_OPTS = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
];

const SECTIONS = [
  { id: 'account', label: 'Account & meta' },
  { id: 'questions', label: 'Panel questions' },
  { id: 'transactions', label: 'Transactions' },
  { id: 'consent', label: 'Consent' },
  { id: 'messages', label: 'Messages' },
];

/** Lightweight collapsible section card. */
function Section({ id, title, defaultOpen, children }: { id: string; title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  return (
    <details id={id} open={defaultOpen} className="group scroll-mt-24 overflow-hidden rounded-2xl border border-bd bg-white shadow-soft [&_summary::-webkit-details-marker]:hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-3.5 font-bold text-dteal">
        {title}
        <svg viewBox="0 0 24 24" className="h-4 w-4 text-soft transition-transform group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
      </summary>
      <div className="border-t border-bd px-5 py-5">{children}</div>
    </details>
  );
}

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-wide text-soft">{label}</dt>
      <dd className="mt-0.5 text-sm text-ink">{children}</dd>
    </div>
  );
}

export function MemberProfile({ id }: { id: number }) {
  const d = useMemo(() => memberDetail(id), [id]);
  const { saveMemberDetails, saveMemberMeta, awardPoints, sendMemberMessage } = useAdmin();

  const [status, setStatus] = useState<Member['status']>(d.status);
  const [email, setEmail] = useState(d.email);
  const [mobile, setMobile] = useState(d.mobile);
  const [gender, setGender] = useState<Member['gender']>(d.gender);
  const [birthYear, setBirthYear] = useState(String(d.birthYear));
  const [postalCode, setPostalCode] = useState(d.postalCode);

  const [firstName, setFirstName] = useState(d.firstName);
  const [lastName, setLastName] = useState(d.lastName);
  const [paypalEmail, setPaypalEmail] = useState(d.paypalEmail);
  const [secondaryEmail, setSecondaryEmail] = useState(d.secondaryEmail);
  const [streetAddress, setStreetAddress] = useState(d.streetAddress);

  const [award, setAward] = useState('');
  const [reason, setReason] = useState('');
  const [msg, setMsg] = useState('');

  const initials = (d.firstName || d.email).slice(0, 2).toUpperCase();

  const txnColumns: Column<MemberTransaction>[] = [
    { key: 'created', header: 'Created' },
    { key: 'type', header: 'Type', filter: 'select', selectOptions: TXN_TYPES.map((t) => ({ value: t, label: t })) },
    { key: 'amount', header: 'Amount', render: (r) => `€${r.amount.toFixed(2)}` },
    { key: 'status', header: 'Status', filter: 'select', selectOptions: TXN_STATUSES.map((s) => ({ value: s, label: s })) },
    { key: 'projectNo', header: 'Project', filter: 'text' },
    { key: 'surveyNo', header: 'Survey', filter: 'text' },
  ];
  const msgColumns: Column<MemberMessage>[] = [
    { key: 'created', header: 'Created' },
    { key: 'message', header: 'Message' },
    { key: 'status', header: 'Status' },
  ];

  const save = () => {
    saveMemberDetails(d.id, { status, email, gender, birthYear: Number(birthYear) || d.birthYear, postalCode });
    saveMemberMeta(d.id);
    if (Number(award) > 0) awardPoints(d.id, Number(award), reason);
  };

  return (
    <div className="space-y-5">
      <Link href="/admin-lab/members" className="text-sm font-semibold text-teal hover:underline">‹ All members</Link>

      {/* Sticky identity header + pinned action row */}
      <div className="sticky top-16 z-10 space-y-3">
        <div className="rounded-2xl bg-dgreen px-6 py-5 text-white shadow-lift">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-lg font-bold">{initials}</span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="font-sans text-lg font-bold">Member #{d.id}</h2>
                <StatusPill status={status} />
              </div>
              <p className="truncate text-sm text-white/70">{d.email}</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-xs text-white/70">
            <span>Panel {d.panel}</span>
            <span>Cint {d.cintId}</span>
            <span>Created {d.created}</span>
            <span>Wallet €{d.walletAmount.toFixed(2)}</span>
            <span>{d.emailVerified ? 'Email verified' : 'Email unverified'}</span>
          </div>
        </div>

        {/* Pinned action row */}
        <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-bd bg-white p-3 shadow-soft">
          <Select label="Status" value={status} onChange={(v) => setStatus(v as Member['status'])} options={STATUS_OPTS} className="w-40" />
          <TextField label="Award points" value={award} onChange={setAward} className="w-32" />
          <TextField label="Reason" value={reason} onChange={setReason} className="w-48" />
          <button type="button" onClick={save} className="rounded-xl bg-yel px-5 py-2.5 text-sm font-bold text-ink hover:brightness-95">Save</button>
          <button type="button" className="rounded-xl border border-teal bg-white px-5 py-2.5 text-sm font-semibold text-teal hover:bg-lteal/40">Login as</button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[180px_1fr]">
        {/* Section rail */}
        <nav className="hidden h-max xl:sticky xl:top-56 xl:block">
          <ul className="space-y-1 text-sm">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="block rounded-lg px-3 py-1.5 font-semibold text-soft hover:bg-cream hover:text-teal">{s.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="min-w-0 space-y-4">
          {/* Account & meta (User Details + Extra/Meta merged) */}
          <Section id="account" title="Account & meta" defaultOpen>
            <dl className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Fact label="Id">{d.id}</Fact>
              <Fact label="Last answered">{d.lastAnswered}</Fact>
              <Fact label="Last action">{d.lastAction}</Fact>
              <Fact label="Recruitment">{d.recruitmentSource || '—'}</Fact>
            </dl>
            <div className="grid gap-4 sm:grid-cols-2">
              <Select label="Status" value={status} onChange={(v) => setStatus(v as Member['status'])} options={STATUS_OPTS} />
              <TextField label="Email address" value={email} onChange={setEmail} />
              <TextField label="Mobile" value={mobile} onChange={setMobile} />
              <Select label="Gender" value={gender} onChange={(v) => setGender(v as Member['gender'])} options={GENDER_OPTS} />
              <TextField label="Year of birth" value={birthYear} onChange={setBirthYear} />
              <TextField label="Postal Code" value={postalCode} onChange={setPostalCode} />
              <TextField label="First name" value={firstName} onChange={setFirstName} />
              <TextField label="Last name" value={lastName} onChange={setLastName} />
              <TextField label="PayPal Email" value={paypalEmail} onChange={setPaypalEmail} />
              <TextField label="Secondary Email" value={secondaryEmail} onChange={setSecondaryEmail} />
              <TextField label="Street address" value={streetAddress} onChange={setStreetAddress} className="sm:col-span-2" />
            </div>
            <div className="mt-3 text-xs text-soft">
              Reset password: <a href={d.resetPasswordLink} target="_blank" rel="noreferrer" className="break-all text-teal hover:underline">{d.resetPasswordLink}</a>
            </div>
          </Section>

          {/* Panel questions */}
          <Section id="questions" title="Panel questions">
            <div className="space-y-5">
              {d.panelQuestions.map((g) => (
                <div key={g.group}>
                  <h3 className="mb-2 text-sm font-bold text-dteal">{g.group}</h3>
                  <div className="divide-y divide-bd/60 rounded-xl border border-bd">
                    {g.items.map((q, i) => (
                      <div key={i} className="flex flex-col gap-1 px-4 py-2 text-sm sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                        <span className="text-ink">{q.question}</span>
                        <span className="text-soft sm:text-right">{q.answer}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Transactions */}
          <Section id="transactions" title="Transactions">
            <DataTable columns={txnColumns} rows={d.transactions} getRowId={(r) => r.id} />
          </Section>

          {/* Consent */}
          <Section id="consent" title="Consent">
            <div className="overflow-hidden rounded-xl border border-bd">
              <table className="w-full min-w-[480px] border-collapse text-sm">
                <thead className="bg-lteal/50 text-left text-dteal">
                  <tr><th className="px-4 py-2.5 font-bold">Consent Name</th><th className="px-4 py-2.5 font-bold">Option</th><th className="px-4 py-2.5 font-bold">Collected</th></tr>
                </thead>
                <tbody>
                  {d.consents.map((c) => (
                    <tr key={c.name} className="border-t border-bd/70"><td className="px-4 py-2.5 text-ink">{c.name}</td><td className="px-4 py-2.5 text-ink">{c.option}</td><td className="px-4 py-2.5 text-soft">{c.collected}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          {/* Messages */}
          <Section id="messages" title="Messages">
            <div className="mb-5 max-w-2xl">
              <textarea
                value={msg}
                rows={4}
                placeholder="Type a message to this member…"
                onChange={(e) => setMsg(e.target.value)}
                className="w-full resize-y rounded-xl border border-bd bg-white px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-mute focus-visible:ring-2 focus-visible:ring-teal/40"
              />
              <button type="button" onClick={() => { sendMemberMessage(d.id, msg); setMsg(''); }} className="mt-3 rounded-xl bg-teal px-5 py-2.5 text-sm font-bold text-white hover:bg-dteal">Send</button>
            </div>
            <DataTable columns={msgColumns} rows={d.messages} getRowId={(r) => `${r.created}-${r.message}`} empty="No messages yet." />
          </Section>
        </div>
      </div>
    </div>
  );
}
