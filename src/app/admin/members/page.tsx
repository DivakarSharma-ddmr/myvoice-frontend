'use client';

import { useState } from 'react';
import { useAdmin } from '@/components/admin/AdminProvider';
import { DataTable, type Column } from '@/components/admin/DataTable';
import { StatusPill } from '@/components/admin/StatusPill';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { PANELS, TOTALS, type Member } from '@/lib/adminMockData';

const STATUS_OPTS = [
  { value: 'active', label: 'Active' },
  { value: 'sleeping', label: 'Sleeping' },
  { value: 'unsubscribed', label: 'Unsubscribed' },
  { value: 'inactive', label: 'Inactive' },
];
const COUNTRY_OPTS = PANELS.map((p) => ({ value: p.name, label: p.name }));

export default function MembersPage() {
  const { data, deleteMember } = useAdmin();
  const [view, setView] = useState<Member | null>(null);
  const [login, setLogin] = useState<Member | null>(null);
  const [del, setDel] = useState<Member | null>(null);

  const columns: Column<Member>[] = [
    { key: 'id', header: 'Id', filter: 'text', sortable: true },
    { key: 'email', header: 'Email', filter: 'text' },
    { key: 'gender', header: 'Gender' },
    { key: 'birthYear', header: 'Birth Year' },
    { key: 'postalCode', header: 'Postal Code' },
    { key: 'status', header: 'Status', filter: 'select', selectOptions: STATUS_OPTS, render: (r) => <StatusPill status={r.status} /> },
    { key: 'country', header: 'Country', filter: 'select', selectOptions: COUNTRY_OPTS },
    {
      key: 'actions', header: 'Actions', align: 'center',
      render: (r) => (
        <button type="button" onClick={() => setView(r)} className="rounded-lg border border-bd px-3 py-1.5 text-xs font-semibold text-teal hover:bg-lteal/40">View</button>
      ),
    },
    {
      key: 'login', header: 'Login', align: 'center',
      render: (r) => (
        <button type="button" onClick={() => setLogin(r)} className="rounded-lg border border-bd px-3 py-1.5 text-xs font-semibold text-mute hover:bg-canvas">Login</button>
      ),
    },
    {
      key: 'delete', header: 'Delete', align: 'center',
      render: (r) => (
        <button type="button" onClick={() => setDel(r)} className="rounded-lg border border-bd px-3 py-1.5 text-xs font-semibold text-danger hover:bg-danger/10">Delete</button>
      ),
    },
  ];

  return (
    <div>
      <DataTable columns={columns} rows={data.members} getRowId={(r) => r.id} totalOverride={TOTALS.members} />

      <ConfirmDialog
        open={view !== null} title={`Member #${view?.id ?? ''}`} confirmLabel="Close" cancelLabel="Dismiss"
        onConfirm={() => setView(null)} onCancel={() => setView(null)}
        body={view && (
          <dl className="grid grid-cols-2 gap-y-2 pt-1 text-left text-sm">
            <dt className="text-soft">Email</dt><dd className="text-ink">{view.email}</dd>
            <dt className="text-soft">Gender</dt><dd className="text-ink">{view.gender}</dd>
            <dt className="text-soft">Birth Year</dt><dd className="text-ink">{view.birthYear}</dd>
            <dt className="text-soft">Postal Code</dt><dd className="text-ink">{view.postalCode}</dd>
            <dt className="text-soft">Status</dt><dd><StatusPill status={view.status} /></dd>
            <dt className="text-soft">Country</dt><dd className="text-ink">{view.country}</dd>
          </dl>
        )}
      />

      <ConfirmDialog
        open={login !== null} title="Login as member?" confirmLabel="Login as member"
        body={login && <>You are about to open the member platform as <strong>#{login.id}</strong> ({login.email}).</>}
        onConfirm={() => setLogin(null)} onCancel={() => setLogin(null)}
      />

      <ConfirmDialog
        open={del !== null} title="Delete member?" tone="danger" confirmLabel="Delete"
        body={del && <>This permanently removes member <strong>#{del.id}</strong> ({del.email}). This cannot be undone.</>}
        onConfirm={() => { if (del) deleteMember(del.id); setDel(null); }} onCancel={() => setDel(null)}
      />
    </div>
  );
}
