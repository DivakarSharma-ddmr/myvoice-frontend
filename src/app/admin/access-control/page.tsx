'use client';

import { useState } from 'react';
import { useAdmin } from '@/components/admin/AdminProvider';
import { DataTable, type Column } from '@/components/admin/DataTable';
import { StatusPill } from '@/components/admin/StatusPill';
import { ActionMenu } from '@/components/admin/ActionMenu';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { TextField, Select } from '@/components/admin/Field';
import type { AdminUser } from '@/lib/adminMockData';

const STATUS_OPTS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'unsubscribed', label: 'Unsubscribed' },
];

const blank: AdminUser = { panelistId: '', firstName: '', lastName: '', email: '', status: 'active' };

export default function AccessControlPage() {
  const { data, addAdminUser, setAdminUserStatus } = useAdmin();
  const [form, setForm] = useState<AdminUser | null>(null);

  const columns: Column<AdminUser>[] = [
    { key: 'panelistId', header: 'Panelist Id', sortable: true },
    { key: 'firstName', header: 'First Name', filter: 'text' },
    { key: 'lastName', header: 'Last Name', filter: 'text' },
    { key: 'email', header: 'Email', filter: 'text' },
    {
      key: 'status', header: 'Status', filter: 'select', selectOptions: STATUS_OPTS,
      render: (r) => <StatusPill status={r.status} />,
    },
    {
      key: 'actions', header: 'Actions', align: 'right',
      render: (r) => (
        <ActionMenu
          items={[
            { label: 'Edit', onClick: () => setForm(r) },
            { label: 'Mark Inactive', disabled: r.status === 'inactive', onClick: () => setAdminUserStatus(r.panelistId, 'inactive') },
          ]}
        />
      ),
    },
  ];

  const save = () => {
    if (!form) return;
    addAdminUser({ ...form, panelistId: form.panelistId || String(Date.now()).slice(-7) });
    setForm(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button type="button" onClick={() => setForm(blank)} className="rounded-xl bg-teal px-4 py-2.5 text-sm font-bold text-white hover:bg-dteal">
          Add User
        </button>
      </div>

      <DataTable columns={columns} rows={data.adminUsers} getRowId={(r) => r.panelistId} />

      <ConfirmDialog
        open={form !== null}
        title={form?.panelistId && data.adminUsers.some((u) => u.panelistId === form.panelistId) ? 'Edit user' : 'Add user'}
        confirmLabel="Save"
        onConfirm={save}
        onCancel={() => setForm(null)}
        body={form && (
          <div className="space-y-3 pt-1 text-left">
            <TextField label="First Name" value={form.firstName} onChange={(v) => setForm({ ...form, firstName: v })} />
            <TextField label="Last Name" value={form.lastName} onChange={(v) => setForm({ ...form, lastName: v })} />
            <TextField label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
            <Select label="Status" value={form.status} onChange={(v) => setForm({ ...form, status: v as AdminUser['status'] })} options={STATUS_OPTS} />
          </div>
        )}
      />
    </div>
  );
}
