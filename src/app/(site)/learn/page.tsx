import type { Metadata } from 'next';
import { PageHero } from '@/components/site/PillTitle';
import { blogFeatured, blogPosts, blogCategories } from '@/lib/mockData';

export const metadata: Metadata = {
  title: 'Learn',
  description: 'Honest guides about paid surveys, online research, privacy and getting the most from your membership.',
};

export default function LearnPage() {
  return (
    <>
      <PageHero kicker="Learn" title="The MyVoice Learn hub"
        sub="Honest guides about paid surveys, online research, privacy and getting the most from your membership." />
      <section className="mx-auto max-w-[1080px] px-6 py-6 md:px-11">
        <div className="mb-6 flex flex-wrap gap-2.5">
          {blogCategories.map((c, i) => (
            <span key={i} className={`cursor-pointer rounded-full border px-3.5 py-2 text-[13px] font-bold ${i === 0 ? 'border-teal bg-teal text-white' : 'border-bd bg-white text-mute'}`}>{c}</span>
          ))}
        </div>

        {/* Featured */}
        <div className="mb-5 grid overflow-hidden rounded-3xl2 border border-bd bg-white md:grid-cols-2">
          <div className="flex min-h-[200px] items-center justify-center md:min-h-[240px]" style={{ background: 'repeating-linear-gradient(135deg,#E8F3F3 0 16px,#DCEEEE 16px 32px)' }}>
            <span className="rounded-lg bg-white/80 px-3 py-1.5 font-mono text-xs text-[#5b7d7b]">article hero</span>
          </div>
          <div className="p-7 md:p-8">
            <span className="text-xs font-extrabold text-teal">{blogFeatured.category.toUpperCase()}</span>
            <h3 className="mt-2.5 text-2xl font-extrabold leading-tight text-dteal md:text-[26px]">{blogFeatured.title}</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-mute">{blogFeatured.body}</p>
            <div className="mt-4 text-sm font-bold text-teal">Read article →</div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-4 pb-8 sm:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((p, i) => (
            <div key={i} className="cursor-pointer overflow-hidden rounded-2xl2 border border-bd bg-white">
              <div className="h-[120px]" style={{ background: i % 2 ? 'repeating-linear-gradient(135deg,#FFF4CC 0 14px,#FBEBB8 14px 28px)' : 'repeating-linear-gradient(135deg,#E8F3F3 0 14px,#DCEEEE 14px 28px)' }} />
              <div className="p-[18px]">
                <span className="text-[11px] font-extrabold text-teal">{p.category.toUpperCase()}</span>
                <h4 className="mt-2 text-base font-bold leading-snug">{p.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
