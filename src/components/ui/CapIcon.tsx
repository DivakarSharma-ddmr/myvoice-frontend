import { capIcon } from '@/lib/asset';

/** Renders one of the Captain MyVoice icon-set PNGs (assets/cap/<name>.png). */
export function CapIcon({
  name,
  size = 24,
  radius = 12,
  className,
}: {
  name: string;
  size?: number;
  radius?: number;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={capIcon(name)}
      alt=""
      aria-hidden
      draggable={false}
      width={size}
      height={size}
      className={className}
      style={{ width: size, height: size, objectFit: 'cover', borderRadius: radius, display: 'block', flexShrink: 0 }}
    />
  );
}

/** Icon + label inline pairing used in member section headers. */
export function IconLabel({ name, text, size = 24 }: { name: string; text: string; size?: number }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <CapIcon name={name} size={size} radius={8} />
      <span>{text}</span>
    </span>
  );
}
