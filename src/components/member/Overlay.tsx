'use client';
import { useMember } from './MemberProvider';
import { Mascot } from '@/components/ui/Mascot';
import { CapIcon, IconLabel } from '@/components/ui/CapIcon';

const cardStyle = 'w-[420px] max-w-full rounded-3xl2 bg-white p-6 shadow-[0_30px_70px_-20px_rgba(0,0,0,.4)] animate-qpop';
const xBtn = 'h-[34px] w-[34px] rounded-[10px] border-none bg-[#F1F2EE] text-[13px] text-mute';

export function Overlay() {
  const m = useMember();

  return (
    <>
      {/* Confetti */}
      {m.confetti && (
        <div className="pointer-events-none fixed inset-0 z-[80] overflow-hidden">
          {m.pieces.map((p) => (
            <div key={p.id} style={{ position: 'absolute', top: '16%', left: p.left + '%', width: p.size, height: p.size, background: p.bg, borderRadius: p.rad, animation: `qconf ${p.d}s ${p.delay}s cubic-bezier(.3,.6,.6,1) forwards` }} />
          ))}
        </div>
      )}

      {/* Survey / Redeem modal */}
      {m.modal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[rgba(15,30,30,.45)] p-6 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) m.setModal(null); }}>
          {m.modal.type === 'survey' ? <SurveyModal /> : <RedeemModal />}
        </div>
      )}

      {/* Level up */}
      {m.levelUp && (
        <div className="fixed inset-0 z-[75] flex items-center justify-center bg-[rgba(15,30,30,.5)] p-6 backdrop-blur-sm" onClick={m.dismissLevelUp}>
          <div className={cardStyle + ' text-center'} style={{ background: 'linear-gradient(160deg,#FFFDF6,#FFF4CC)' }}>
            <div className="flex justify-center"><Mascot size={104} pose="cheer" /></div>
            <div className="mt-1.5 text-[13px] font-extrabold tracking-widest text-gold">LEVEL UP!</div>
            <h3 className="mt-1 text-3xl font-extrabold">You’re Level {m.level} 🎉</h3>
            <p className="mt-2 text-sm text-mute">New badge unlocked and a bonus draw ticket added.</p>
            <button onClick={m.dismissLevelUp} className="mt-4 rounded-xl bg-teal px-7 py-3 text-[15px] font-bold text-white">Keep playing</button>
          </div>
        </div>
      )}

      {/* Redeem done */}
      {m.redeemDone && (
        <div className="fixed inset-0 z-[75] flex items-center justify-center bg-[rgba(15,30,30,.5)] p-6 backdrop-blur-sm" onClick={m.dismissRedeemDone}>
          <div className={cardStyle + ' text-center'}>
            <div className="flex justify-center"><Mascot size={104} pose="winner" /></div>
            <h3 className="mt-2 text-[22px] font-extrabold">Reward request received</h3>
            <p className="mt-2 text-sm leading-relaxed text-mute">We’ll notify you when it’s processed — usually within 1–3 business days. Bonus ticket added!</p>
            <button onClick={m.dismissRedeemDone} className="mt-4 rounded-xl bg-teal px-7 py-3 text-[15px] font-bold text-white">Back to wallet</button>
          </div>
        </div>
      )}

      {/* Toasts */}
      {m.toasts.length > 0 && (
        <div className="fixed right-4 top-4 z-[90] flex flex-col gap-2.5 md:right-6 md:top-6">
          {m.toasts.map((t) => (
            <div key={t.id} className="flex max-w-[300px] animate-qtoast items-center gap-2.5 rounded-2xl bg-ink px-4 py-3 text-[13px] font-semibold text-white shadow-card">
              <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: t.kind === 'approve' ? '#22A06B' : '#FFCC33' }} />
              {t.msg}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function SurveyModal() {
  const m = useMember();
  if (m.modal?.type !== 'survey') return null;
  const { sv, choice } = m.modal;
  const opts = ['Strongly agree', 'Agree', 'Neutral', 'Disagree'];
  return (
    <div className={cardStyle}>
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-lteal px-2.5 py-1 text-xs font-bold text-teal">{sv.topic}</span>
        <button onClick={() => m.setModal(null)} className={xBtn}>✕</button>
      </div>
      <div className="mt-4 text-xs font-bold text-gold">{m.fmt(sv.reward)} · +{sv.xp} XP</div>
      <h3 className="mt-1.5 text-xl font-extrabold leading-snug">“I enjoy trying new products before my friends do.”</h3>
      <div className="mt-4 flex flex-col gap-2">
        {opts.map((o, i) => {
          const sel = choice === i;
          return (
            <button key={i} onClick={() => m.setModal({ ...m.modal!, choice: i } as any)}
              className="rounded-xl border-[1.5px] px-4 py-3 text-left text-sm font-semibold"
              style={{ borderColor: sel ? '#336666' : '#E5E7EB', background: sel ? '#E8F3F3' : '#fff' }}>
              {o}
            </button>
          );
        })}
      </div>
      <button onClick={choice != null ? m.submitSurvey : undefined} disabled={choice == null}
        className="mt-4 w-full rounded-xl py-3.5 text-[15px] font-bold disabled:cursor-not-allowed"
        style={{ background: choice != null ? '#FFCC33' : '#F1F2EE', color: choice != null ? '#1C2526' : '#B0B6BC' }}>
        Submit &amp; earn XP
      </button>
    </div>
  );
}

function RedeemModal() {
  const m = useMember();
  if (m.modal?.type !== 'redeem') return null;
  const { step, method } = m.modal;
  const methods: [string, string, string][] = [
    ['u2-money', 'PayPal', 'Cash to your PayPal'],
    ['u2-gift', 'Gift card', 'Choose from 20+ brands'],
    ['u2-calculator', 'Bank transfer', 'SEPA, 1–3 days'],
    ['n-heart', 'Charity', 'Donate your balance'],
  ];
  const stepNames = ['Choose method', 'Confirm amount', 'Confirm details'];
  const methodName = ['PayPal', 'Gift card', 'Bank transfer', 'Charity'][method ?? 0];
  return (
    <div className={cardStyle}>
      <div className="flex items-center justify-between">
        <h3 className="text-[19px] font-extrabold"><IconLabel name="u2-gift" text="Redeem reward" /></h3>
        <button onClick={() => m.setModal(null)} className={xBtn}>✕</button>
      </div>
      <div className="mt-3.5 flex gap-1.5">
        {stepNames.map((_, i) => (
          <div key={i} className="h-[5px] flex-1 rounded-full" style={{ background: i < step ? '#336666' : '#E5E7EB' }} />
        ))}
      </div>
      <div className="mt-2.5 text-xs font-bold text-[#98A2B3]">STEP {step} OF 3 · {stepNames[step - 1]}</div>

      {step === 1 && (
        <div className="mt-3.5 flex flex-col gap-2">
          {methods.map((mt, i) => {
            const sel = method === i;
            return (
              <button key={i} onClick={() => m.setModal({ ...m.modal!, method: i } as any)}
                className="flex items-center gap-3 rounded-xl border-[1.5px] px-3.5 py-3 text-left"
                style={{ borderColor: sel ? '#336666' : '#E5E7EB', background: sel ? '#E8F3F3' : '#fff' }}>
                <CapIcon name={mt[0]} size={38} radius={9} />
                <div>
                  <div className="text-sm font-bold">{mt[1]}</div>
                  <div className="text-xs text-mute">{mt[2]}</div>
                </div>
              </button>
            );
          })}
        </div>
      )}
      {step === 2 && (
        <div className="mt-4 text-center">
          <div className="text-[13px] text-mute">You are redeeming</div>
          <div className="text-[46px] font-extrabold text-dteal">€10.00</div>
          <div className="text-[13px] text-mute">via {methodName} · +1 bonus ticket 🎟</div>
        </div>
      )}
      {step === 3 && (
        <div className="mt-4 rounded-2xl bg-cream p-4">
          {[['Method', methodName], ['Amount', '€10.00'], ['Account', 'ana.m@email.com'], ['Processing', '1–3 business days']].map((r, i) => (
            <div key={i} className="flex justify-between border-t border-bd py-1.5 first:border-t-0" >
              <span className="text-[13px] text-mute">{r[0]}</span>
              <span className="text-[13px] font-bold">{r[1]}</span>
            </div>
          ))}
        </div>
      )}

      <button onClick={!(step === 1 && method == null) ? m.redeemNext : undefined} disabled={step === 1 && method == null}
        className="mt-4 w-full rounded-xl py-3.5 text-[15px] font-bold disabled:cursor-not-allowed"
        style={{ background: step === 1 && method == null ? '#F1F2EE' : '#FFCC33', color: step === 1 && method == null ? '#B0B6BC' : '#1C2526' }}>
        {step < 3 ? 'Continue' : 'Confirm redemption'}
      </button>
    </div>
  );
}
