'use client';

/**
 * Clean line icons for the member sidebar / bottom nav.
 *
 * Deliberately plain single-stroke pictograms (Lucide-style geometry) rather
 * than the raster Captain CapIcon tiles: at 22px in the nav, a simple outline
 * reads instantly and inherits `currentColor`, so the same icon is dark ink on
 * the active yellow row and light teal when idle — no per-state art needed.
 * Captain artwork still carries the warm brand tone everywhere else.
 */

export type NavIconName =
  | 'home'
  | 'surveys'
  | 'rewards'
  | 'profile'
  | 'community'
  | 'help'
  | 'settings';

const PATHS: Record<NavIconName, React.ReactNode> = {
  home: (
    <>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5.5 9.5V20a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1V9.5" />
      <path d="M9.5 21v-6h5v6" />
    </>
  ),
  surveys: (
    <>
      <rect x="4.5" y="4.5" width="15" height="16" rx="2.2" />
      <path d="M9 4.5V3.8a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v.7" />
      <path d="M8.5 10.5h7M8.5 14h7M8.5 17.5h4" />
    </>
  ),
  rewards: (
    <>
      <path d="M4 11.5h16V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" />
      <path d="M3 7.5h18v4H3z" />
      <path d="M12 7.5V21" />
      <path d="M12 7.5S10.8 2.8 8 3.2A2.4 2.4 0 0 0 8 8c2.4.3 4 -.5 4 -.5z" />
      <path d="M12 7.5S13.2 2.8 16 3.2A2.4 2.4 0 0 1 16 8c-2.4.3-4-.5-4-.5z" />
    </>
  ),
  profile: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M5 21v-1.5A5.5 5.5 0 0 1 10.5 14h3A5.5 5.5 0 0 1 19 19.5V21" />
    </>
  ),
  community: (
    <>
      <circle cx="9" cy="8" r="3.4" />
      <path d="M3.5 20v-1A5 5 0 0 1 8.5 14h1A5 5 0 0 1 14.5 19v1" />
      <path d="M16 4.2a3.4 3.4 0 0 1 0 6.6" />
      <path d="M17.5 14.2A5 5 0 0 1 20.5 19v1" />
    </>
  ),
  help: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.3 9.2a2.8 2.8 0 0 1 5.4 1c0 1.9-2.7 2.3-2.7 3.8" />
      <path d="M12 17.2h.01" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2.5l1.4 2.3 2.6-.6.5 2.6 2.4 1.1-1 2.5 1 2.5-2.4 1.1-.5 2.6-2.6-.6L12 21.5l-1.4-2.3-2.6.6-.5-2.6L5.1 16l1-2.5-1-2.5 2.4-1.1.5-2.6 2.6.6z" />
    </>
  ),
};

export function NavIcon({
  name,
  className,
  size = 22,
}: {
  name: NavIconName;
  className?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}
