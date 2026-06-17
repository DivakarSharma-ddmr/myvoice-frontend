import { trustStats } from '@/lib/mockData';

export function TrustBar() {
  return (
    <div className="mx-auto max-w-[1080px] px-6 md:px-11">
      <div className="flex flex-wrap justify-between gap-4 rounded-xl2 border border-bd bg-white px-5 py-4 md:px-7">
        {trustStats.map((it) => (
          <div key={it.label} className="min-w-[110px] flex-1 text-center">
            <div className="text-lg font-extrabold tracking-tight text-dteal md:text-xl">{it.value}</div>
            <div className="text-xs font-semibold text-mute">{it.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
