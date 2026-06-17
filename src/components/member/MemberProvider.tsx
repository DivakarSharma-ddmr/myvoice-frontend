'use client';
import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import {
  member as seedMember,
  wallet as seedWallet,
  quests as seedQuests,
  dashboardSurveys,
  type Quest,
  type Survey,
} from '@/lib/mockData';

/**
 * All member-platform state + actions live here, deliberately framework-light
 * so the same logic can be lifted into a React Native / Expo app later.
 * Swap the seed imports for real API calls when wiring the backend.
 */

type ConfettiPiece = { id: number; left: number; bg: string; d: number; delay: number; size: number; rad: string };
type Toast = { id: number; msg: string; kind: 'xp' | 'approve' };
type Modal =
  | { type: 'survey'; sv: { id: number; topic: string; reward: number; xp: number }; questId: number | null; choice: number | null }
  | { type: 'redeem'; step: number; method: number | null }
  | null;

type MemberState = {
  animated: boolean;
  level: number;
  rank: string;
  xp: number;
  xpMax: number;
  streak: number;
  tickets: number;
  available: number;
  pending: number;
  lifetime: number;
  quests: Quest[];
  surveys: Survey[];
  modal: Modal;
  confetti: number | null;
  toasts: Toast[];
  levelUp: boolean;
  redeemDone: boolean;
  poll: number | null;
  refCopied: boolean;
  toggles: Record<string, boolean>;
};

type MemberCtx = MemberState & {
  pieces: ConfettiPiece[];
  fmt: (n: number) => string;
  completeQuest: (q: Quest) => void;
  openSurvey: (sv: { id: number; topic: string; reward: number; xp: number }, questId: number | null) => void;
  setModal: (m: Modal) => void;
  submitSurvey: () => void;
  openRedeem: () => void;
  redeemNext: () => void;
  setPoll: (i: number) => void;
  toggle: (k: string) => void;
  copyRef: () => void;
  dismissLevelUp: () => void;
  dismissRedeemDone: () => void;
};

const Ctx = createContext<MemberCtx | null>(null);
export const useMember = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('useMember must be used inside <MemberProvider>');
  return c;
};

export function MemberProvider({ children }: { children: React.ReactNode }) {
  const [s, setS] = useState<MemberState>({
    animated: false,
    level: seedMember.level,
    rank: seedMember.rank,
    xp: seedMember.xp,
    xpMax: seedMember.xpMax,
    streak: seedMember.streak,
    tickets: seedMember.tickets,
    available: seedWallet.available,
    pending: seedWallet.pending,
    lifetime: seedWallet.lifetime,
    quests: seedQuests.map((q) => ({ ...q })),
    surveys: dashboardSurveys.map((sv) => ({ ...sv })),
    modal: null,
    confetti: null,
    toasts: [],
    levelUp: false,
    redeemDone: false,
    poll: null,
    refCopied: false,
    toggles: { surveys: true, rewards: true, profile: true, draws: false, updates: false },
  });
  const pieces = useRef<ConfettiPiece[]>([]);
  const tid = useRef(0);

  useEffect(() => {
    const t = setTimeout(() => setS((p) => ({ ...p, animated: true })), 140);
    return () => clearTimeout(t);
  }, []);

  const fmt = useCallback((n: number) => '€' + n.toFixed(2), []);

  const toast = useCallback((msg: string, kind: Toast['kind']) => {
    const id = ++tid.current;
    setS((p) => ({ ...p, toasts: [...p.toasts, { id, msg, kind }] }));
    setTimeout(() => setS((p) => ({ ...p, toasts: p.toasts.filter((t) => t.id !== id) })), 2800);
  }, []);

  const fireConfetti = useCallback(() => {
    const cols = ['#FFCC33', '#336666', '#22A06B', '#FFF4CC', '#1F4F4F', '#E8F3F3'];
    pieces.current = Array.from({ length: 54 }, (_, i) => ({
      id: i,
      left: 25 + Math.random() * 50,
      bg: cols[i % cols.length],
      d: 0.9 + Math.random() * 0.8,
      delay: Math.random() * 0.3,
      size: 7 + Math.random() * 8,
      rad: Math.random() > 0.5 ? '2px' : '50%',
    }));
    setS((p) => ({ ...p, confetti: Date.now() }));
    setTimeout(() => setS((p) => ({ ...p, confetti: null })), 2000);
  }, []);

  const addXp = useCallback((amount: number) => {
    setS((p) => {
      let { xp, xpMax, level } = p;
      xp += amount;
      if (xp >= xpMax) {
        xp -= xpMax;
        level += 1;
        xpMax += 100;
        setTimeout(fireConfetti, 0);
        return { ...p, xp, xpMax, level, levelUp: true };
      }
      return { ...p, xp };
    });
  }, [fireConfetti]);

  const openSurvey = useCallback((sv: { id: number; topic: string; reward: number; xp: number }, questId: number | null) => {
    setS((p) => ({ ...p, modal: { type: 'survey', sv, questId, choice: null } }));
  }, []);

  const completeQuest = useCallback((q: Quest) => {
    setS((p) => {
      const cur = p.quests.find((x) => x.id === q.id);
      if (cur && cur.done) return p;
      if (q.kind === 'survey') {
        const sv = p.surveys[0];
        if (sv) return { ...p, modal: { type: 'survey', sv: { id: sv.id, topic: sv.topic, reward: sv.reward, xp: sv.xp }, questId: q.id, choice: null } };
        return p;
      }
      setTimeout(() => { fireConfetti(); addXp(q.xp); toast('+' + q.xp + ' XP · ' + q.title + (q.kind === 'checkin' ? ' · +1 ticket 🎟' : ''), 'xp'); }, 0);
      return { ...p, quests: p.quests.map((x) => (x.id === q.id ? { ...x, done: true } : x)), tickets: q.kind === 'checkin' ? p.tickets + 1 : p.tickets };
    });
  }, [addXp, fireConfetti, toast]);

  const submitSurvey = useCallback(() => {
    setS((p) => {
      if (p.modal?.type !== 'survey') return p;
      const { sv, questId } = p.modal;
      setTimeout(() => {
        fireConfetti();
        addXp(sv.xp);
        toast('Nice! €' + sv.reward.toFixed(2) + ' pending · +' + sv.xp + ' XP', 'xp');
        setTimeout(() => {
          setS((q) => ({ ...q, pending: +(q.pending - sv.reward).toFixed(2), available: +(q.available + sv.reward).toFixed(2) }));
          toast('€' + sv.reward.toFixed(2) + ' approved ✓', 'approve');
        }, 2600);
      }, 0);
      return {
        ...p,
        modal: null,
        surveys: p.surveys.filter((x) => x.id !== sv.id),
        quests: questId ? p.quests.map((x) => (x.id === questId ? { ...x, done: true } : x)) : p.quests,
        pending: +(p.pending + sv.reward).toFixed(2),
      };
    });
  }, [addXp, fireConfetti, toast]);

  const openRedeem = useCallback(() => setS((p) => ({ ...p, modal: { type: 'redeem', step: 1, method: null } })), []);
  const redeemNext = useCallback(() => {
    setS((p) => {
      if (p.modal?.type !== 'redeem') return p;
      if (p.modal.step < 3) return { ...p, modal: { ...p.modal, step: p.modal.step + 1 } };
      setTimeout(fireConfetti, 0);
      return { ...p, modal: null, redeemDone: true, available: 0 };
    });
  }, [fireConfetti]);

  const setModal = useCallback((m: Modal) => setS((p) => ({ ...p, modal: m })), []);
  const setPoll = useCallback((i: number) => setS((p) => ({ ...p, poll: i })), []);
  const toggle = useCallback((k: string) => setS((p) => ({ ...p, toggles: { ...p.toggles, [k]: !p.toggles[k] } })), []);
  const copyRef = useCallback(() => {
    setS((p) => ({ ...p, refCopied: true }));
    if (typeof navigator !== 'undefined' && navigator.clipboard) navigator.clipboard.writeText('https://' + seedMember.referralLink).catch(() => {});
    toast('Referral link copied 🔗', 'xp');
    setTimeout(() => setS((p) => ({ ...p, refCopied: false })), 2000);
  }, [toast]);
  const dismissLevelUp = useCallback(() => setS((p) => ({ ...p, levelUp: false })), []);
  const dismissRedeemDone = useCallback(() => setS((p) => ({ ...p, redeemDone: false })), []);

  const value: MemberCtx = {
    ...s,
    pieces: pieces.current,
    fmt,
    completeQuest,
    openSurvey,
    setModal,
    submitSurvey,
    openRedeem,
    redeemNext,
    setPoll,
    toggle,
    copyRef,
    dismissLevelUp,
    dismissRedeemDone,
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
