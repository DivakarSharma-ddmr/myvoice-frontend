'use client';

import { useState } from 'react';
import { useAdmin } from '@/components/admin/AdminProvider';
import { TextField } from '@/components/admin/Field';

export default function PaymentEmailPage() {
  const { data, savePaymentEmail } = useAdmin();
  const [email, setEmail] = useState(data.paymentEmail.email);
  const [additional, setAdditional] = useState(data.paymentEmail.additionalEmail);

  const reset = () => { setEmail(data.paymentEmail.email); setAdditional(data.paymentEmail.additionalEmail); };

  return (
    <div className="max-w-2xl rounded-2xl border border-bd bg-white p-6 shadow-soft">
      <h2 className="mb-1 font-sans text-base font-bold text-dteal">Payment Manager Email Settings</h2>
      <p className="mb-6 text-sm text-soft">Where payment notifications are sent.</p>
      <div className="space-y-4">
        <TextField label="Email" type="email" value={email} onChange={setEmail} />
        <TextField label="Additional Email" type="email" value={additional} onChange={setAdditional} />
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <button type="button" onClick={reset} className="rounded-xl border border-bd bg-white px-4 py-2.5 text-sm font-semibold text-mute hover:bg-canvas">Reset</button>
        <button type="button" onClick={() => savePaymentEmail({ email, additionalEmail: additional })} className="rounded-xl bg-teal px-4 py-2.5 text-sm font-bold text-white hover:bg-dteal">Save</button>
      </div>
    </div>
  );
}
