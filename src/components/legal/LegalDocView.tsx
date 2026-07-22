import type { LegalDoc, Block } from '@/content/types';

function BlockView({ block }: { block: Block }) {
  if (block.type === 'list') {
    return (
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-soft">
        {block.items.map((it, i) => (
          <li key={i}>{it}</li>
        ))}
      </ul>
    );
  }

  if (block.type === 'table') {
    // Wide legal tables scroll inside their own container so the page body
    // never scrolls horizontally.
    return (
      <div className="mt-4 overflow-x-auto rounded-xl border border-bd">
        <table className="w-full min-w-[560px] border-collapse text-left text-[13px]">
          <thead className="bg-lteal">
            <tr>
              {block.head.map((h, i) => (
                <th key={i} scope="col" className="p-3 font-bold text-dteal">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((r, i) => (
              <tr key={i} className="border-t border-bd align-top">
                {r.map((c, j) => (
                  <td key={j} className="p-3 leading-relaxed text-soft">
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return <p className="mt-3 text-sm leading-relaxed text-soft">{block.text}</p>;
}

export function LegalDocView({ doc }: { doc: LegalDoc }) {
  return (
    <div className="mx-auto max-w-[1080px] px-5 py-8 md:px-8">
      <h1
        className="max-w-[24ch] text-[28px] font-extrabold leading-tight text-dteal md:text-[34px]"
        style={{ textWrap: 'balance' } as React.CSSProperties}
      >
        {doc.title}
      </h1>

      {(doc.effective || doc.revised) && (
        <p className="mt-2 text-[13px] font-semibold text-soft">
          {doc.effective && <>Effective {doc.effective}</>}
          {doc.effective && doc.revised && <span aria-hidden="true"> · </span>}
          {doc.revised && <>Last revised {doc.revised}</>}
        </p>
      )}

      <div className="mt-7 gap-8 lg:grid lg:grid-cols-[220px_minmax(0,1fr)]">
        <nav
          aria-label="Sections"
          className="no-print mb-6 hidden lg:sticky lg:top-6 lg:mb-0 lg:block lg:self-start"
        >
          <ul className="space-y-1.5 border-l border-bd pl-4">
            {doc.sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="block text-[13px] leading-snug text-soft hover:text-teal"
                >
                  {s.heading}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          {doc.sections.map((s) => (
            <section
              key={s.id}
              id={s.id}
              className="scroll-mt-24 border-t border-bd py-6 first:border-t-0 first:pt-0"
            >
              <h2 className="text-lg font-extrabold text-ink">{s.heading}</h2>
              {s.blocks.map((b, i) => (
                <BlockView key={i} block={b} />
              ))}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
