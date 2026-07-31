/**
 * Admin status tokens — one map, reused everywhere via <StatusPill/>.
 * Self-contained (no @/ imports) so the node:test runner can load it directly.
 *
 * Colorblind-safe: every status pairs a colour tone with a DISTINCT icon, and
 * Active / Unsubscribed deliberately differ (the legacy admin coloured both blue).
 */
export type AdminStatus =
  | 'active' | 'inactive' | 'sleeping' | 'unsubscribed'
  | 'pending' | 'onhold' | 'approved' | 'rejected' | 'complete';

export type StatusIcon =
  | 'check' | 'dash' | 'moon' | 'bell-off' | 'clock' | 'pause' | 'x';

type Token = { label: string; tone: string; icon: StatusIcon };

// tone = Tailwind classes (bg + text) using existing design tokens.
export const STATUS_TOKENS: Record<AdminStatus, Token> = {
  active:       { label: 'Active',       tone: 'bg-green/15 text-green',   icon: 'check' },
  inactive:     { label: 'Inactive',     tone: 'bg-mute/15 text-mute',     icon: 'dash' },
  sleeping:     { label: 'Sleeping',     tone: 'bg-amber/15 text-amber',   icon: 'moon' },
  unsubscribed: { label: 'Unsubscribed', tone: 'bg-soft/15 text-soft',     icon: 'bell-off' },
  pending:      { label: 'Pending',      tone: 'bg-amber/15 text-amber',   icon: 'clock' },
  onhold:       { label: 'On Hold',      tone: 'bg-gold/15 text-gold',     icon: 'pause' },
  approved:     { label: 'Approved',     tone: 'bg-green/15 text-green',   icon: 'check' },
  rejected:     { label: 'Rejected',     tone: 'bg-danger/15 text-danger', icon: 'x' },
  complete:     { label: 'Complete',     tone: 'bg-teal/15 text-teal',     icon: 'check' },
};

const ALIASES: Record<string, AdminStatus> = { 'on hold': 'onhold' };

/** Map any raw status string (case-insensitive) to a token, with graceful fallback. */
export function statusToken(raw: string): Token {
  const key = raw.trim().toLowerCase().replace(/\s+/g, ' ');
  const norm = (ALIASES[key] ?? key.replace(/\s+/g, '')) as AdminStatus;
  if (STATUS_TOKENS[norm]) return STATUS_TOKENS[norm];
  const label = raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
  return { label, tone: 'bg-mute/15 text-mute', icon: 'dash' };
}
