'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/** /member → /member/dashboard */
export default function MemberIndex() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/member/dashboard');
  }, [router]);
  return null;
}
