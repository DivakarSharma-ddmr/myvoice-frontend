'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useAdmin } from '@/components/admin/AdminProvider';
import { Tabs, type Tab } from '@/components/admin/Tabs';
import { DataTable, type Column } from '@/components/admin/DataTable';
import { StatusPill } from '@/components/admin/StatusPill';
import { TextField, Select } from '@/components/admin/Field';
import { memberDetail, TXN_TYPES, TXN_STATUSES, type Member, type MemberTransaction, type MemberMessage } from '@/lib/adminMockData';

const TABS: Tab[] = [
  { id: 'details', label: 'User Details' },
  { id: 'meta', label: 'Extra/Meta Data' },
  { id: 'questions', label: 'Panel Questions' },
  { id: 'transactions', label: 'Transactions' },
  { id: 'consent', label: 'Consent' },
  { id: 'messages', label: 'Messages' },
];

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

/** Read-only fact row for the User Details left column. */
function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <>
      <dt className="text-soft">{label}</dt>
      <dd className="text-ink">{children}</dd>
    </>
  );
}

export function MemberEditor({ id }: { id: number }) {
  const d = useMemo(() => memberDetail(id), [id]);
  const { saveMemberDetails, saveMemberMeta, awardPoints, sendMemberMessage } = useAdmin();

  const [tab, setTab] = useState('details');

  // Editable — User Details
  const [status, setStatus] = useState<Member['status']>(d.status);
  const [memberIdField, setMemberIdField] = useState(d.memberIdField);
  const [email, setEmail] = useState(d.email);
  const [mobile, setMobile] = useState(d.mobile);
  const [gender, setGender] = useState<Member['gender']>(d.gender);
  const [birthYear, setBirthYear] = useState(String(d.birthYear));
  const [postalCode, setPostalCode] = useState(d.postalCode);
  const [daysBetweenMailouts, setDaysBetweenMailouts] = useState(d.daysBetweenMailouts);

  // Editable — Extra/Meta Data
  const [firstName, setFirstName] = useState(d.firstName);
  const [lastName, setLastName] = useState(d.lastName);
  const [username, setUsername] = useState(d.username);
  const [ssn, setSsn] = useState(d.ssn);
  const [bankClearing, setBankClearing] = useState(d.bankClearing);
  const [bankAccount, setBankAccount] = useState(d.bankAccount);
  const [streetAddress, setStreetAddress] = useState(d.streetAddress);
  const [secondaryEmail, setSecondaryEmail] = useState(d.secondaryEmail);
  const [paypalEmail, setPaypalEmail] = useState(d.paypalEmail);

  // Top bar + messages
  const [award, setAward] = useState('');
  const [reason, setReason] = useState('');
  const [msg, setMsg] = useState('');

  const txnColumns: Column<MemberTransaction>[] = [
    { key: 'created', header: 'Created' },
    { key: 'type', header: 'Transaction Type', filter: 'select', selectOptions: TXN_TYPES.map((t) => ({ value: t, label: t })) },
    { key: 'amount', header: 'Amount', render: (r) => `€${r.amount.toFixed(2)}` },
    { key: 'status', header: 'Status', filter: 'select', selectOptions: TXN_STATUSES.map((s) => ({ value: s, label: s })) },
    { key: 'projectNo', header: 'Project No.', filter: 'text' },
    { key: 'surveyNo', header: 'Survey No.', filter: 'text' },
    { key: 'token', header: 'Token', align: 'center' },
    { key: 'clickDraw', header: 'Click Draw', filter: 'text', align: 'center' },
    {
      key: 'action', header: 'Action', align: 'center',
      render: () => (
        <button type="button" aria-label="Edit transaction" className="text-teal hover:text-dteal" title="Edit transaction">
          <svg viewBox="0 0 24 24" className="mx-auto h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
        </button>
      ),
    },
  ];

  const msgColumns: Column<MemberMessage>[] = [
    { key: 'created', header: 'Created' },
    { key: 'message', header: 'Message' },
    { key: 'status', header: 'Status' },
  ];

  return (
    <div>
      <Link href="/admin/members" className="text-sm font-semibold text-teal hover:underline">‹ Back to members</Link>

      {/* Identity strip */}
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <h2 className="font-sans text-lg font-bold text-dteal">Member #{d.id}</h2>
        <span className="text-sm text-soft">{d.email}</span>
        <StatusPill status={status} />
      </div>

      {/* Award / Approve bar (Signal Yellow reserved for the money action) */}
      <div className="mt-4 flex flex-wrap items-end gap-4 border-b border-bd pb-5">
        <div className="text-sm">
          <span className="font-semibold text-dteal">Wallet Amount:</span>{' '}
          <span className="text-ink">€{d.walletAmount.toFixed(2)}</span>
        </div>
        <TextField label="Award Point" value={award} onChange={setAward} className="w-40" />
        <TextField label="Reason" value={reason} onChange={setReason} className="w-64" />
        <button
          type="button"
          onClick={() => awardPoints(d.id, Number(award) || 0, reason)}
          className="rounded-xl bg-yel px-5 py-2.5 text-sm font-bold text-ink hover:brightness-95"
        >
          Approve
        </button>
      </div>

      <div className="mt-5">
        <Tabs tabs={TABS} active={tab} onChange={setTab} />
      </div>

      <div className="pt-6">
        {/* ---------------------------- User Details ---------------------------- */}
        {tab === 'details' && (
          <div className="grid gap-8 lg:grid-cols-2">
            <dl className="grid h-max grid-cols-[max-content_1fr] gap-x-8 gap-y-2.5 text-sm">
              <Fact label="Id">{d.id}</Fact>
              <Fact label="Panel">{d.panel}</Fact>
              <Fact label="Cint ID">{d.cintId}</Fact>
              <Fact label="Created">{d.created}</Fact>
              <Fact label="Last sent">{d.lastSent}</Fact>
              <Fact label="Last answered">{d.lastAnswered}</Fact>
              <Fact label="Last updated">{d.lastUpdated}</Fact>
              <Fact label="Last Action">{d.lastAction}</Fact>
              <Fact label="Wallet Amount">€{d.walletAmount.toFixed(2)}</Fact>
              <Fact label="Recruitment source">{d.recruitmentSource || '—'}</Fact>
              <Fact label="Email Verification">{d.emailVerified ? 'Yes' : 'No'}</Fact>
              <Fact label="Reset Password Link">
                <a href={d.resetPasswordLink} className="break-all text-teal hover:underline" target="_blank" rel="noreferrer">{d.resetPasswordLink}</a>
              </Fact>
            </dl>

            <div className="space-y-4">
              <Select label="Status" value={status} onChange={(v) => setStatus(v as Member['status'])} options={STATUS_OPTS} />
              <TextField label="Member Id" value={memberIdField} onChange={setMemberIdField} />
              <TextField label="Email address" value={email} onChange={setEmail} />
              <TextField label="Mobile" value={mobile} onChange={setMobile} />
              <Select label="Gender" value={gender} onChange={(v) => setGender(v as Member['gender'])} options={GENDER_OPTS} />
              <TextField label="Year of birth" value={birthYear} onChange={setBirthYear} />
              <TextField label="Postal Code" value={postalCode} onChange={setPostalCode} />
              <TextField label="Days between mailouts" value={daysBetweenMailouts} onChange={setDaysBetweenMailouts} />
              <button
                type="button"
                onClick={() => saveMemberDetails(d.id, { status, email, gender, birthYear: Number(birthYear) || d.birthYear, postalCode })}
                className="rounded-xl bg-teal px-6 py-2.5 text-sm font-bold text-white hover:bg-dteal"
              >
                Submit
              </button>
            </div>
          </div>
        )}

        {/* --------------------------- Extra/Meta Data -------------------------- */}
        {tab === 'meta' && (
          <div className="max-w-3xl">
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="First name" value={firstName} onChange={setFirstName} />
              <TextField label="Last name" value={lastName} onChange={setLastName} />
              <TextField label="Username" value={username} onChange={setUsername} />
              <TextField label="SSN" value={ssn} onChange={setSsn} />
              <TextField label="Bank clearing" value={bankClearing} onChange={setBankClearing} />
              <TextField label="Bank account" value={bankAccount} onChange={setBankAccount} />
              <TextField label="Street address" value={streetAddress} onChange={setStreetAddress} />
              <TextField label="Secondary Email" value={secondaryEmail} onChange={setSecondaryEmail} />
              <TextField label="Paypal Email" value={paypalEmail} onChange={setPaypalEmail} />
            </div>
            <p className="mt-4 text-sm text-soft">Updated on: {d.metaUpdatedOn || '—'}</p>
            <button
              type="button"
              onClick={() => saveMemberMeta(d.id)}
              className="mt-4 rounded-xl bg-teal px-6 py-2.5 text-sm font-bold text-white hover:bg-dteal"
            >
              Submit
            </button>
          </div>
        )}

        {/* --------------------------- Panel Questions -------------------------- */}
        {tab === 'questions' && (
          <div className="space-y-6">
            {d.panelQuestions.map((g) => (
              <div key={g.group} className="overflow-hidden rounded-2xl border border-bd bg-white">
                <div className="bg-cream px-5 py-3 font-bold text-dteal">{g.group}</div>
                <div className="divide-y divide-bd/60">
                  {g.items.map((q, i) => (
                    <div key={i} className="flex flex-col gap-1 px-5 py-2.5 text-sm sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                      <span className="text-ink">{q.question}</span>
                      <span className="text-soft sm:text-right">* {q.answer}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ---------------------------- Transactions ---------------------------- */}
        {tab === 'transactions' && (
          <DataTable columns={txnColumns} rows={d.transactions} getRowId={(r) => r.id} />
        )}

        {/* ------------------------------- Consent ------------------------------ */}
        {tab === 'consent' && (
          <div className="overflow-hidden rounded-2xl border border-bd bg-white shadow-soft">
            <table className="w-full min-w-[560px] border-collapse text-sm">
              <thead className="bg-lteal/60 text-left text-dteal">
                <tr>
                  <th className="px-4 py-3 font-bold">Consent Name</th>
                  <th className="px-4 py-3 font-bold">Member Option</th>
                  <th className="px-4 py-3 font-bold">Collected</th>
                </tr>
              </thead>
              <tbody>
                {d.consents.map((c) => (
                  <tr key={c.name} className="border-t border-bd/70 hover:bg-cream">
                    <td className="px-4 py-3 text-ink">{c.name}</td>
                    <td className="px-4 py-3 text-ink">{c.option}</td>
                    <td className="px-4 py-3 text-ink">{c.collected}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ------------------------------ Messages ------------------------------ */}
        {tab === 'messages' && (
          <div className="space-y-6">
            <div className="max-w-2xl">
              <span className="mb-1.5 block text-sm font-semibold text-dteal">Message</span>
              <textarea
                value={msg}
                rows={5}
                placeholder="Type Message here…"
                onChange={(e) => setMsg(e.target.value)}
                className="w-full resize-y rounded-xl border border-bd bg-white px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-mute focus-visible:ring-2 focus-visible:ring-teal/40"
              />
              <div className="mt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => { sendMemberMessage(d.id, msg); setMsg(''); }}
                  className="rounded-xl bg-teal px-6 py-2.5 text-sm font-bold text-white hover:bg-dteal"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => setMsg('')}
                  className="rounded-xl border border-bd px-6 py-2.5 text-sm font-semibold text-soft hover:bg-canvas"
                >
                  Reset
                </button>
              </div>
            </div>
            <DataTable columns={msgColumns} rows={d.messages} getRowId={(r) => `${r.created}-${r.message}`} empty="No data available in table" />
          </div>
        )}
      </div>
    </div>
  );
}
