'use client';

import { useRef, useState } from 'react';
import { PillTitle } from '@/components/site/PillTitle';
import { asset } from '@/lib/asset';
import { memberVideos, memberQuotes } from '@/lib/mockData';

/**
 * Auto-scrolling reel of REAL panel-member video testimonials.
 *
 * - Tiles show the clip's first frame (via the #t media fragment) + a play
 *   overlay; nothing streams until the visitor clicks (preload="metadata"),
 *   so the homepage stays light despite ~170MB of clips on disk.
 * - Click a tile to play that clip with sound; any other playing clip pauses
 *   and the marquee freezes so the video is easy to watch.
 * - Members are attributed generically ("Verified MyVoice member") — no
 *   names/locations, per consent/privacy. Quotes scroll separately below.
 */
export function TestimonialReel() {
  // Duplicate the list so the marquee can loop seamlessly.
  const reel = [...memberVideos, ...memberVideos];
  const band = [...memberQuotes, ...memberQuotes];

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [playing, setPlaying] = useState<number | null>(null);

  function toggle(idx: number) {
    const el = videoRefs.current[idx];
    if (!el) return;
    if (el.paused) {
      // Pause every other clip, then play this one with sound.
      videoRefs.current.forEach((v, i) => {
        if (v && i !== idx) v.pause();
      });
      el.muted = false;
      el.controls = true;
      void el.play();
      setPlaying(idx);
    } else {
      el.pause();
      setPlaying(null);
    }
  }

  return (
    <section className="py-10">
      <div className="px-6 md:px-11">
        <PillTitle
          kicker="From the community"
          title="Real members, real rewards"
          sub="Hear it straight from panelists across 30+ countries — unscripted clips from real MyVoice members."
        />
      </div>

      {/* Video reel — marquee pauses on hover or while a clip is playing */}
      <div
        className="group mt-8 overflow-hidden"
        style={{
          maskImage: 'linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)',
          WebkitMaskImage: 'linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)',
        }}
      >
        <div
          className="flex w-max animate-bmarq gap-[18px] px-6 group-hover:[animation-play-state:paused] md:px-11"
          style={{ animationDuration: '60s', animationPlayState: playing !== null ? 'paused' : undefined }}
        >
          {reel.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => toggle(i)}
              aria-label={playing === i ? 'Pause testimonial video' : 'Play testimonial video'}
              className="relative h-[340px] w-[200px] shrink-0 overflow-hidden rounded-2xl2 border border-bd bg-dteal shadow-card focus:outline-none focus-visible:ring-2 focus-visible:ring-yel"
            >
              <video
                ref={(el) => {
                  videoRefs.current[i] = el;
                }}
                src={asset(`${src}#t=0.5`)}
                preload="metadata"
                playsInline
                muted
                loop
                onEnded={() => setPlaying((p) => (p === i ? null : p))}
                className="absolute inset-0 h-full w-full object-cover"
              />
              {/* Bottom gradient + generic attribution (hidden while playing) */}
              {playing !== i && (
                <>
                  <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(180deg,rgba(31,79,79,0) 40%,rgba(31,79,79,.78) 100%)' }}
                  />
                  <div className="absolute left-3 top-3 rounded-md bg-white/85 px-2 py-0.5 font-mono text-[10px] text-[#5b7d7b]">
                    member video
                  </div>
                  <div className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 animate-bpulse place-items-center rounded-full bg-white/90 shadow-card">
                    <span className="ml-0.5 text-lg text-teal">▶</span>
                  </div>
                  <div className="absolute inset-x-3.5 bottom-3.5 text-left text-white">
                    <span className="inline-flex items-center gap-1 rounded-full bg-yel/95 px-2.5 py-0.5 text-[11px] font-extrabold text-ink">
                      ✓ Verified member
                    </span>
                    <div className="mt-2 text-sm font-extrabold leading-tight">MyVoice panelist</div>
                  </div>
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Quote banner — real member words, generic attribution */}
      <div
        className="mt-6 overflow-hidden bg-dteal"
        style={{
          paddingTop: 18,
          paddingBottom: 18,
          maskImage: 'linear-gradient(90deg,transparent,#000 5%,#000 95%,transparent)',
          WebkitMaskImage: 'linear-gradient(90deg,transparent,#000 5%,#000 95%,transparent)',
        }}
      >
        <div className="flex w-max animate-bmarq gap-14 pl-14" style={{ animationDuration: '90s' }}>
          {band.map((quote, i) => (
            <div key={i} className="flex shrink-0 items-center gap-4">
              <span className="whitespace-nowrap text-base font-semibold text-white">“{quote}”</span>
              <span className="whitespace-nowrap text-[13px] font-extrabold text-yel">— Verified MyVoice member</span>
              <span className="text-white/30">•</span>
            </div>
          ))}
        </div>
      </div>

      <p className="px-6 text-center text-[13px] text-[#98A2B3]" style={{ marginTop: 18 }}>
        Real, unscripted clips and quotes from MyVoice panel members. Tap any clip to play.
      </p>
    </section>
  );
}
