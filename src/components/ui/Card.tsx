import { clsx } from '@/lib/clsx';

export function Card({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx('rounded-2xl2 border border-bd bg-white p-5 md:p-6', className)} {...rest}>
      {children}
    </div>
  );
}
