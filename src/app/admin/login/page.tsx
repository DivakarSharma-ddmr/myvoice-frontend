'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { asset } from '@/lib/asset';

/**
 * Mock admin login gate. Any credentials pass — this is a static prototype with
 * no real auth. It sets a cosmetic session flag and enters the console.
 */
export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signIn = (e: React.FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem('mv_admin', '1');
    router.push('/admin');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas p-4">
      <form onSubmit={signIn} className="w-full max-w-sm rounded-3xl border border-bd bg-white p-8 shadow-card">
        <div className="mb-6 flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset('/assets/logo.webp')} alt="MyVoice" className="h-10" />
        </div>
        <h1 className="text-center font-sans text-lg font-bold text-dteal">Panel Admin</h1>
        <p className="mb-6 mt-1 text-center text-sm text-soft">Sign in to manage your panel</p>

        <label className="mb-4 block">
          <span className="mb-1.5 block text-sm font-semibold text-dteal">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@datadiggers-mr.com"
            className="w-full rounded-xl border border-bd bg-white px-3.5 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-teal/40"
          />
        </label>
        <label className="mb-6 block">
          <span className="mb-1.5 block text-sm font-semibold text-dteal">Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-xl border border-bd bg-white px-3.5 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-teal/40"
          />
        </label>

        <button type="submit" className="w-full rounded-xl bg-yel px-5 py-3 text-sm font-bold text-ink transition hover:brightness-95">
          Sign in
        </button>
      </form>
    </div>
  );
}
