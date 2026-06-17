/**
 * Central palette — the single source of truth for brand colors used in
 * inline styles where a Tailwind class isn't convenient (gradients, SVG, etc).
 * Mirrors tailwind.config.ts and globals.css.
 */
export const C = {
  ink: '#1C2526',
  teal: '#336666',
  dteal: '#1F4F4F',
  teal2: '#2c6a64',
  yel: '#FFCC33',
  syel: '#FFF4CC',
  lteal: '#E8F3F3',
  green: '#22A06B',
  amber: '#F59E0B',
  danger: '#D92D20',
  mute: '#667085',
  soft: '#52706e',
  gold: '#8a6d12',
  cream: '#FFFDF6',
  sand: '#FBF4E6',
  bd: '#F1ECDB',
  canvas: '#EEEFEB',
} as const;

export type Palette = typeof C;
