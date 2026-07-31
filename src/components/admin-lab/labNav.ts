/** V2 nav — shared by AdminLabShell and CommandPalette. */
export type LabNavItem = { label: string; href: string; icon: string };

export const LAB_NAV: LabNavItem[] = [
  { label: 'Home', href: '/admin-lab', icon: 'home' },
  { label: 'Access Control', href: '/admin-lab/access-control', icon: 'wrench' },
  { label: 'Members', href: '/admin-lab/members', icon: 'list' },
  { label: "Member's Rewards", href: '/admin-lab/member-rewards', icon: 'bag' },
  { label: 'Manage Rewards', href: '/admin-lab/manage-rewards', icon: 'gift' },
  { label: 'Payment Email Settings', href: '/admin-lab/payment-email', icon: 'mail' },
  { label: 'Panel Settings', href: '/admin-lab/panel-settings', icon: 'gear' },
  { label: 'Account', href: '/admin-lab/account', icon: 'user' },
  { label: 'Email Tool', href: '/admin-lab/email-tool', icon: 'send' },
  { label: 'Report', href: '/admin-lab/report', icon: 'doc' },
  { label: 'Recruitment', href: '/admin-lab/recruitment', icon: 'users' },
  { label: 'MyVoice Message Center', href: '/admin-lab/messages', icon: 'chat' },
];

export const LAB_ICONS: Record<string, string> = {
  home: 'M3 10.5 12 3l9 7.5M5 9.5V21h14V9.5',
  wrench: 'M14.5 6a3.5 3.5 0 0 0 4.6 4.6L21 12l-9 9-3-3 9-9 1.4-1.9A3.5 3.5 0 0 0 14.5 6Z',
  list: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
  bag: 'M6 7h12l1 13H5L6 7ZM9 7a3 3 0 0 1 6 0',
  gift: 'M20 12v9H4v-9M2 7h20v5H2zM12 22V7',
  mail: 'M3 6h18v12H3zM3 7l9 6 9-6',
  gear: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2V21a2 2 0 1 1-4 0v-.1A1.7 1.7 0 0 0 7 19.4a1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0-1.2-2.9H1a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 2.6 7',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21a8 8 0 0 1 16 0',
  send: 'm22 2-7 20-4-9-9-4 20-7Z',
  doc: 'M6 2h9l5 5v15H6zM15 2v5h5M9 13h6M9 17h6',
  users: 'M9 11.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM2 21a7 7 0 0 1 14 0M17 5a3.5 3.5 0 0 1 0 7M22 21a7 7 0 0 0-5-6.7',
  chat: 'M21 12a8 8 0 0 1-11.5 7.2L3 21l1.8-6.5A8 8 0 1 1 21 12Z',
};
