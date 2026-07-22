import Link from 'next/link';
import { ProgressBar } from '@/components/ui/Progress';
import { BadgeTile } from '@/components/member/BadgeTile';
import { badges } from '@/lib/mockData';

// The full 27-badge set lives on its own route rather than in a dialog over the
// dashboard: it is a place a member visits, so it deserves a URL, the browser
// back button, and the full page width on a phone.
export default function BadgesPage() {
  const earned = badges.filter((b) => b.earned);
  const locked = badges.filter((b) => !b.earned);
  const pct = Math.round((earned.length / badges.length) * 100);

  return (
    <div className="max-w-[780px] space-y-4">
      <Link
        href="/member/dashboard"
        className="inline-block text-[13px] font-bold text-teal hover:underline"
      >
        <span aria-hidden="true">← </span>Back to dashboard
      </Link>

      <div className="rounded-2xl2 border border-bd bg-white p-5">
        {/* The page header above already says "Your badges", so this card
            leads with the number instead of repeating the title. */}
        <h3 className="text-base font-extrabold">
          {earned.length} of {badges.length} earned
        </h3>
        <p className="mt-1 max-w-[52ch] text-[13px] leading-snug text-mute">
          Badges mark the things you have done on MyVoice — verifying your account, building your
          profile, taking surveys, showing up. They are yours to keep.
        </p>
        <div className="mt-3.5">
          <ProgressBar pct={pct} color="linear-gradient(90deg,#336666,#22A06B)" height={10} />
        </div>
      </div>

      <section className="rounded-2xl2 border border-bd bg-white p-5">
        <h3 className="text-base font-extrabold">Earned ({earned.length})</h3>
        {earned.length ? (
          <div className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(116px,1fr))] gap-x-3 gap-y-5">
            {earned.map((b) => (
              <BadgeTile key={b.id} badge={b} size={84} />
            ))}
          </div>
        ) : (
          <p className="mt-2 text-[13px] leading-snug text-mute">
            Nothing here yet. Finish a profile section or take your first survey and your first
            badge lands here.
          </p>
        )}
      </section>

      {locked.length > 0 && (
        <section className="rounded-2xl2 border border-bd bg-white p-5">
          <h3 className="text-base font-extrabold">Still to earn ({locked.length})</h3>
          <p className="mt-1 max-w-[52ch] text-[13px] leading-snug text-mute">
            These unlock as you go. You do not have to chase them — taking part is what earns them.
          </p>
          <div className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(116px,1fr))] gap-x-3 gap-y-5">
            {locked.map((b) => (
              <BadgeTile key={b.id} badge={b} size={84} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
