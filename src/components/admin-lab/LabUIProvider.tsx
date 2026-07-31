'use client';

import { createContext, useContext, useMemo, useState } from 'react';

type LabUIValue = {
  paletteOpen: boolean;
  setPaletteOpen: (v: boolean) => void;
  focusMemberId: number | null;
  setFocusMemberId: (id: number | null) => void;
};

const LabUIContext = createContext<LabUIValue | null>(null);

export function useLabUI(): LabUIValue {
  const ctx = useContext(LabUIContext);
  if (!ctx) throw new Error('useLabUI must be used within <LabUIProvider>');
  return ctx;
}

/** V2-only UI state: command palette visibility + a member to focus (palette → drawer). */
export function LabUIProvider({ children }: { children: React.ReactNode }) {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [focusMemberId, setFocusMemberId] = useState<number | null>(null);
  const value = useMemo(() => ({ paletteOpen, setPaletteOpen, focusMemberId, setFocusMemberId }), [paletteOpen, focusMemberId]);
  return <LabUIContext.Provider value={value}>{children}</LabUIContext.Provider>;
}
