import Link from 'next/link';
import { clsx } from '@/lib/clsx';

type Variant = 'primary' | 'secondary' | 'dark' | 'ghost';
type Common = {
  variant?: Variant;
  pill?: boolean;
  className?: string;
  children: React.ReactNode;
};

const base =
  'inline-flex items-center justify-center gap-2 font-bold transition active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-60';
const variants: Record<Variant, string> = {
  primary: 'bg-yel text-ink hover:brightness-95',
  secondary: 'bg-white text-teal border border-teal hover:bg-lteal/40',
  dark: 'bg-teal text-white hover:bg-dteal',
  ghost: 'bg-white text-mute border border-bd hover:bg-canvas',
};

function classes(variant: Variant, pill: boolean, extra?: string) {
  return clsx(base, variants[variant], pill ? 'rounded-full px-6 py-3' : 'rounded-xl px-5 py-3', 'text-sm md:text-[15px]', extra);
}

export function Button({
  variant = 'primary',
  pill = false,
  className,
  children,
  ...rest
}: Common & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={classes(variant, pill, className)} {...rest}>
      {children}
    </button>
  );
}

export function LinkButton({
  variant = 'primary',
  pill = false,
  className,
  href,
  children,
}: Common & { href: string }) {
  return (
    <Link href={href} className={classes(variant, pill, className)}>
      {children}
    </Link>
  );
}
