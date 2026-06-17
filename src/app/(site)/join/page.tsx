import type { Metadata } from 'next';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { AuthShell, BenefitPanel, Field } from '@/components/site/AuthShell';
import { countries } from '@/lib/mockData';

export const metadata: Metadata = {
  title: 'Join free',
  description: 'Join 2M+ members sharing their opinions and earning real rewards — free, forever.',
};

export default function JoinPage() {
  return (
    <AuthShell
      benefit={
        <BenefitPanel
          title="Start earning in under two minutes."
          sub="Join 2M+ members sharing their opinions and earning real rewards — free, forever."
          bullets={['No fees, no catch', 'GDPR-compliant & ISO certified', 'Redeem from just €10']}
        />
      }
      form={
        <Card className="p-7 md:p-8">
          <div className="mb-4.5 flex gap-1.5" style={{ marginBottom: 18 }}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-1.5 flex-1 rounded-full" style={{ background: i === 1 ? '#336666' : '#EDEFEA' }} />
            ))}
          </div>
          <div className="text-xs font-extrabold tracking-wide text-teal">STEP 1 OF 3 · CREATE ACCOUNT</div>
          <h1 className="mt-1.5 text-[28px] font-extrabold tracking-tight text-dteal">Join MyVoice free</h1>
          <div className="mt-5">
            <Field label="Email" placeholder="you@email.com" type="email" />
            <Field label="Password" placeholder="Create a password" type="password" />
            <label className="mb-3.5 block">
              <span className="mb-1.5 block text-[13px] font-bold text-dteal">Country</span>
              <select className="w-full rounded-xl border border-bd bg-white px-3.5 py-3 text-sm text-ink outline-none focus:border-teal">
                {[...countries, 'Other'].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label className="mb-2 flex items-start gap-2.5 text-[13px] leading-snug text-mute">
              <input type="checkbox" className="mt-1" />
              <span>
                I accept the <Link href="/trust-privacy" className="font-bold text-teal">Terms</Link> and{' '}
                <Link href="/trust-privacy" className="font-bold text-teal">Privacy Policy</Link>.
              </span>
            </label>
            {/* Connect to POST /api/auth/register → email verification → onboarding */}
            <Link href="/member/welcome" className="mt-3 block w-full rounded-xl bg-yel py-3.5 text-center text-[15px] font-bold text-ink">Continue →</Link>
            <p className="mt-4 text-center text-sm text-mute">
              Already a member? <Link href="/login" className="font-bold text-teal">Log in</Link>
            </p>
          </div>
        </Card>
      }
    />
  );
}
