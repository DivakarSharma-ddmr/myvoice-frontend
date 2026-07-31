'use client';

import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import {
  PANELS,
  DEFAULT_PANEL_ID,
  seed,
  approvalTotal,
  type Panel,
  type AdminUser,
  type Member,
  type MemberReward,
  type CatalogueReward,
  type PanelSettings,
  type PaymentEmailSettings,
  type AdminProfile,
} from '@/lib/adminMockData';
import { ToastViewport, type ToastMsg } from './Toast';

type SeedData = typeof seed;

type AdminContextValue = {
  panel: Panel;
  setPanel: (id: string) => void;
  data: SeedData;
  toast: (msg: string) => void;
  // mutations
  setRewardStatus: (id: string, status: MemberReward['status']) => void;
  bulkReward: (ids: string[], status: 'approved' | 'rejected') => void;
  setMemberStatus: (id: number, status: Member['status']) => void;
  deleteMember: (id: number) => void;
  addAdminUser: (u: AdminUser) => void;
  setAdminUserStatus: (panelistId: string, status: AdminUser['status']) => void;
  upsertCatalogue: (r: CatalogueReward) => void;
  saveTemplate: (id: string, subject: string, body: string) => void;
  savePanelSettings: (p: PanelSettings) => void;
  savePaymentEmail: (p: PaymentEmailSettings) => void;
  saveProfile: (p: AdminProfile) => void;
  addRecruitment: (name: string) => void;
  setRecruitmentStatus: (id: string, status: 'active' | 'inactive') => void;
  deleteCampaign: (id: number) => void;
  addReport: (name: string) => void;
  sendMessage: (threadId: string, text: string) => void;
};

const AdminContext = createContext<AdminContextValue | null>(null);

export function useAdmin(): AdminContextValue {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within <AdminProvider>');
  return ctx;
}

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [panelId, setPanelId] = useState(DEFAULT_PANEL_ID);
  const [data, setData] = useState<SeedData>(() => structuredClone(seed));
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  const nextId = useRef(1);

  const panel = useMemo(() => PANELS.find((p) => p.id === panelId) ?? PANELS[0], [panelId]);

  const dismiss = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  const toast = useCallback((text: string) => {
    const id = nextId.current++;
    setToasts((t) => [...t, { id, text }]);
    setTimeout(() => dismiss(id), 2600);
  }, [dismiss]);

  const value = useMemo<AdminContextValue>(() => ({
    panel,
    setPanel: setPanelId,
    data,
    toast,

    setRewardStatus: (id, status) => {
      setData((d) => ({ ...d, memberRewards: d.memberRewards.map((r) => (r.id === id ? { ...r, status } : r)) }));
      toast(`Reward marked ${status}.`);
    },

    bulkReward: (ids, status) => {
      const idSet = new Set(ids);
      const affected = data.memberRewards.filter((r) => idSet.has(r.id));
      setData((d) => ({ ...d, memberRewards: d.memberRewards.map((r) => (idSet.has(r.id) ? { ...r, status } : r)) }));
      if (status === 'approved') toast(`${ids.length} payout${ids.length === 1 ? '' : 's'} approved · €${approvalTotal(affected)}`);
      else toast(`${ids.length} payout${ids.length === 1 ? '' : 's'} rejected`);
    },

    setMemberStatus: (id, status) => {
      setData((d) => ({ ...d, members: d.members.map((m) => (m.id === id ? { ...m, status } : m)) }));
      toast(`Member #${id} marked ${status}.`);
    },

    deleteMember: (id) => {
      setData((d) => ({ ...d, members: d.members.filter((m) => m.id !== id) }));
      toast(`Member #${id} deleted.`);
    },

    addAdminUser: (u) => {
      setData((d) => ({ ...d, adminUsers: [u, ...d.adminUsers] }));
      toast(`User ${u.firstName} added.`);
    },

    setAdminUserStatus: (pid, status) => {
      setData((d) => ({ ...d, adminUsers: d.adminUsers.map((u) => (u.panelistId === pid ? { ...u, status } : u)) }));
      toast(`User marked ${status}.`);
    },

    upsertCatalogue: (r) => {
      setData((d) => {
        const exists = d.catalogue.some((c) => c.id === r.id);
        return { ...d, catalogue: exists ? d.catalogue.map((c) => (c.id === r.id ? r : c)) : [r, ...d.catalogue] };
      });
      toast(`Reward "${r.name}" saved.`);
    },

    saveTemplate: (id, subject, body) => {
      setData((d) => ({ ...d, templates: d.templates.map((t) => (t.id === id ? { ...t, subject, body } : t)) }));
      toast('Template saved.');
    },

    savePanelSettings: (p) => { setData((d) => ({ ...d, panelSettings: p })); toast('Panel settings saved.'); },
    savePaymentEmail: (p) => { setData((d) => ({ ...d, paymentEmail: p })); toast('Payment email settings saved.'); },
    saveProfile: (p) => { setData((d) => ({ ...d, profile: p })); toast('Profile saved.'); },

    addRecruitment: (name) => {
      const row = { id: `rec-${Date.now()}`, name, status: 'active' as const, trigger: '' as const };
      setData((d) => ({ ...d, recruitment: [row, ...d.recruitment] }));
      toast(`Source "${name}" added.`);
    },

    setRecruitmentStatus: (id, status) => {
      setData((d) => ({ ...d, recruitment: d.recruitment.map((s) => (s.id === id ? { ...s, status } : s)) }));
      toast(`Source marked ${status}.`);
    },

    deleteCampaign: (id) => {
      setData((d) => ({ ...d, campaigns: d.campaigns.filter((c) => c.id !== id) }));
      toast(`Campaign #${id} deleted.`);
    },

    addReport: (name) => {
      const row = { id: `rep-${Date.now()}`, name, status: 'complete' as const, createdAt: 'just now' };
      setData((d) => ({ ...d, reports: [row, ...d.reports] }));
      toast('Report generated.');
    },

    sendMessage: (threadId, text) => {
      setData((d) => ({
        ...d,
        threads: d.threads.map((th) =>
          th.id === threadId
            ? { ...th, messages: [...th.messages, { from: 'admin' as const, text, time: 'now' }] }
            : th
        ),
      }));
    },
  }), [panel, data, toast]);

  return (
    <AdminContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </AdminContext.Provider>
  );
}
