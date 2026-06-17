/** Two-column auth layout: benefit panel + form card. Used by login & join. */
export function AuthShell({ benefit, form }: { benefit: React.ReactNode; form: React.ReactNode }) {
  return (
    <section className="mx-auto grid max-w-[1080px] items-center gap-8 px-6 pb-14 pt-8 md:grid-cols-2 md:px-11">
      <div className="order-2 md:order-1">{benefit}</div>
      <div className="order-1 md:order-2">{form}</div>
    </section>
  );
}

export function BenefitPanel({ title, sub, bullets }: { title: string; sub: string; bullets: string[] }) {
  return (
    <div className="relative overflow-hidden rounded-3xl2 p-8 md:p-10" style={{ background: 'linear-gradient(155deg,#FFF6DA,#E8F3F3)' }}>
      <div aria-hidden className="absolute -right-10 bottom-0 h-40 w-40 rounded-full opacity-50" style={{ background: '#CFE7E3', filter: 'blur(2px)' }} />
      <div className="relative">
        <h2 className="text-[26px] font-extrabold leading-tight tracking-tight text-dteal md:text-[30px]">{title}</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-soft">{sub}</p>
        <div className="mt-5 flex flex-col gap-3">
          {bullets.map((b, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <span className="grid h-[26px] w-[26px] place-items-center rounded-lg bg-white text-[13px] font-extrabold text-green">✓</span>
              <span className="text-sm font-semibold text-dteal">{b}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Field({ label, placeholder, type = 'text' }: { label: string; placeholder: string; type?: string }) {
  return (
    <label className="mb-3.5 block">
      <span className="mb-1.5 block text-[13px] font-bold text-dteal">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full rounded-xl border border-bd bg-white px-3.5 py-3 text-sm text-ink outline-none focus:border-teal"
      />
    </label>
  );
}
