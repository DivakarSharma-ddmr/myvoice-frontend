'use client';
import { useEffect } from 'react';
import { asset } from '@/lib/asset';

/** Registers the service worker (basePath-aware) once on the client. */
export function PwaRegister() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
    const url = asset('/sw.js');
    navigator.serviceWorker.register(url).catch(() => {
      /* non-fatal: app still works without offline support */
    });
  }, []);
  return null;
}
