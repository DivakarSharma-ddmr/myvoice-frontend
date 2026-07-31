'use client';

import { useState } from 'react';
import { useAdmin } from '@/components/admin/AdminProvider';
import { SettingsNav } from '@/components/admin-lab/SettingsNav';
import { TextField, Toggle, DatePicker, FileUpload } from '@/components/admin/Field';
import type { AdminProfile } from '@/lib/adminMockData';

const NAV = [
  { id: 'info', label: 'Personal Info' },
  { id: 'picture', label: 'Change Picture' },
  { id: 'password', label: 'Change Password' },
];

export default function LabAccount() {
  const { data, saveProfile, toast } = useAdmin();
  const [nav, setNav] = useState('info');
  const [p, setP] = useState<AdminProfile>(data.profile);
  const set = (patch: Partial<AdminProfile>) => setP((c) => ({ ...c, ...patch }));
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });

  const savePassword = () => {
    if (!pw.next || pw.next !== pw.confirm) { toast('New passwords do not match.'); return; }
    setPw({ current: '', next: '', confirm: '' }); toast('Password updated.');
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[220px_1fr]">
      <SettingsNav items={NAV} active={nav} onChange={setNav} />
      <div className="max-w-2xl">
        {nav === 'info' && (
          <div className="space-y-4 rounded-2xl border border-bd bg-white p-6 shadow-soft">
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="First Name" value={p.firstName} onChange={(v) => set({ firstName: v })} />
              <TextField label="Last Name" value={p.lastName} onChange={(v) => set({ lastName: v })} />
            </div>
            <TextField label="Mobile Number" value={p.mobile} onChange={(v) => set({ mobile: v })} placeholder="+40722 222 222" />
            <Toggle label="Gender" value={p.gender} onChange={(v) => set({ gender: v as AdminProfile['gender'] })} options={['Male', 'Female']} />
            <DatePicker label="Date of Birth" value={p.dob} onChange={(v) => set({ dob: v })} />
            <TextField label="Address" value={p.address} onChange={(v) => set({ address: v })} placeholder="Street, Street number, …" />
            <TextField label="Postal Code" required value={p.postalCode} onChange={(v) => set({ postalCode: v })} />
            <div className="flex gap-2 pt-1">
              <button type="button" onClick={() => saveProfile(p)} className="rounded-xl bg-teal px-4 py-2.5 text-sm font-bold text-white hover:bg-dteal">Save Changes</button>
              <button type="button" onClick={() => setP(data.profile)} className="rounded-xl border border-bd bg-white px-4 py-2.5 text-sm font-semibold text-mute hover:bg-canvas">Cancel</button>
            </div>
          </div>
        )}
        {nav === 'picture' && (
          <div className="rounded-2xl border border-bd bg-white p-6 shadow-soft"><FileUpload label="Profile Picture" onFile={() => toast('Picture updated.')} /></div>
        )}
        {nav === 'password' && (
          <div className="max-w-md space-y-4 rounded-2xl border border-bd bg-white p-6 shadow-soft">
            <TextField label="Current Password" type="password" value={pw.current} onChange={(v) => setPw({ ...pw, current: v })} />
            <TextField label="New Password" type="password" value={pw.next} onChange={(v) => setPw({ ...pw, next: v })} />
            <TextField label="Confirm New Password" type="password" value={pw.confirm} onChange={(v) => setPw({ ...pw, confirm: v })} />
            <button type="button" onClick={savePassword} className="rounded-xl bg-teal px-4 py-2.5 text-sm font-bold text-white hover:bg-dteal">Save</button>
          </div>
        )}
      </div>
    </div>
  );
}
