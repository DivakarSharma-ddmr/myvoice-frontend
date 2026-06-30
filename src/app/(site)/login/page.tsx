import type { Metadata } from 'next';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { AuthShell, BenefitPanel, Field } from '@/components/site/AuthShell';

export const metadata: Metadata = {
  title: 'Log in',
  description: 'Log in to take surveys and check your balance.',
};

export default function LoginPage() {
  return (
    <AuthShell
      benefit={
        <BenefitPanel
          title="Your voice, your rewards."
          sub="Pick up right where you left off — your balance, surveys and draw tickets are waiting."
          bullets={['€8.80 balance ready to grow', '3 surveys matched to you', '7-day streak going strong']}
        />
      }
      form={
        <Card className="p-7 md:p-8">
          <h1 className="text-[28px] font-extrabold tracking-tight text-dteal">Welcome back</h1>
          <p className="mt-1.5 text-sm text-mute">Log in to take surveys and check your balance.</p>
          <div className="mt-5">
            <Field label="Email" placeholder="you@email.com" type="email" />
            <Field label="Password" placeholder="••••••••" type="password" />
            <div className="mb-4.5 flex items-center justify-between text-[13px]" style={{ marginBottom: 18 }}>
              <label className="flex items-center gap-2 font-semibold text-mute">
                <input type="checkbox" defaultChecked /> Remember me
              </label>
              <Link href="#" className="font-bold text-teal">Forgot password?</Link>
            </div>
            {/* Connect to POST /api/auth/login */}
            <Link href="/member/dashboard" className="block w-full rounded-xl bg-yel py-3.5 text-center text-[15px] font-bold text-ink">Log in</Link>
            <p className="mt-4.5 text-center text-sm text-mute" style={{ marginTop: 18 }}>
              New here? <Link href="/join" className="font-bold text-teal">Join free</Link>
            </p>
          </div>
        </Card>
      }
    />
  );
}
