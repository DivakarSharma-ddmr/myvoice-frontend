'use client';

import { useMemo, useState } from 'react';
import { useAdmin } from '@/components/admin/AdminProvider';
import { StatusPill } from '@/components/admin/StatusPill';
import { TextField, Select } from '@/components/admin/Field';
import { DetailDrawer } from '@/components/admin-lab/DetailDrawer';
import { RowActions } from '@/components/admin-lab/RowActions';
import type { AdminUser } from '@/lib/adminMockData';

const STATUS_OPTS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'unsubscribed', label: 'Unsubscribed' },
];
const blank: AdminUser = { panelistId: '', firstName: '', lastName: '', email: '', status: 'active' };

export default function LabAccessControl() {
  const { data, addAdminUser, setAdminUserStatus } = useAdmin();
  const [q, setQ] = useState('');
  const [form, setForm] = useState<AdminUser | null>(null);
  const [isNew, setIsNew] = useState(false);

  const rows = useMemo(() => data.adminUsers.filter((u) => {
    if (!q) return true;
    const s = q.toLowerCase();
    return u.firstName.toLowerCase().includes(s) || u.lastName.toLowerCase().includes(s) || u.email.toLowerCase().includes(s) || u.panelistId.includes(s);
  }), [data.adminUsers, q]);

  const openNew = () => { setForm(blank); setIsNew(true); };
  const openEdit = (u: AdminUser) => { setForm(u); setIsNew(false); };
  const save = () => { if (form && isNew) addAdminUser({ ...form, panelistId: form.panelistId || String(Date.now()).slice(-7) }); setForm(null); };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-bd bg-white p-3 shadow-soft">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, email, id…" aria-label="Search users" className="min-w-[220px] flex-1 rounded-lg border border-bd px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-teal/40" />
        <button type="button" onClick={openNew} className="rounded-xl bg-teal px-4 py-2 text-sm font-bold text-white hover:bg-dteal">Add User</button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-bd bg-white shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-lteal/50 text-left text-dteal">
              <tr>
                <th className="px-4 py-3 font-bold">Panelist Id</th>
                <th className="px-4 py-3 font-bold">Name</th>
                <th className="px-4 py-3 font-bold">Email</th>
                <th className="px-4 py-3 font-bold">Status</th>
                <th className="px-4 py-3 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((u) => (
                <tr key={u.panelistId} className="border-t border-bd/70 hover:bg-cream">
                  <td className="px-4 py-3 font-semibold text-ink">{u.panelistId}</td>
                  <td className="px-4 py-3 text-ink">{u.firstName} {u.lastName}</td>
                  <td className="px-4 py-3 text-soft">{u.email}</td>
                  <td className="px-4 py-3"><StatusPill status={u.status} /></td>
                  <td className="px-4 py-3 text-right">
                    <RowActions primary={{ label: 'Edit', onClick: () => openEdit(u) }} items={[{ label: 'Mark Inactive', disabled: u.status === 'inactive', onClick: () => setAdminUserStatus(u.panelistId, 'inactive') }]} />
                  </td>
                </tr>
              ))}
              {rows.length === 0 && <tr><td colSpan={5} className="px-4 py-12 text-center text-soft">No users match.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <DetailDrawer open={form !== null} title={isNew ? 'Add user' : 'Edit user'} subtitle={form?.email} onClose={() => setForm(null)}
        footer={<button type="button" onClick={save} className="w-full rounded-xl bg-teal px-4 py-2.5 text-sm font-bold text-white hover:bg-dteal">Save</button>}>
        {form && (
          <div className="space-y-3">
            <TextField label="First Name" value={form.firstName} onChange={(v) => setForm({ ...form, firstName: v })} />
            <TextField label="Last Name" value={form.lastName} onChange={(v) => setForm({ ...form, lastName: v })} />
            <TextField label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
            <Select label="Status" value={form.status} onChange={(v) => setForm({ ...form, status: v as AdminUser['status'] })} options={STATUS_OPTS} />
            {!isNew && <p className="text-xs text-soft">Editing is a mock — status changes apply; other fields reset on reload.</p>}
          </div>
        )}
      </DetailDrawer>
    </div>
  );
}
