import React, { createContext, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'proofline.period';
const ALLOWED = [1, 7, 30, 90];

export const PeriodContext = createContext<{ period: number; setPeriod: (n: number) => void }>({
  period: 30,
  setPeriod: () => {},
});

export function PeriodProvider({ children }: { children: React.ReactNode }) {
  const [period, setPeriod] = useState<number>(() => {
    if (typeof window === 'undefined') return 30;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const n = raw ? Number(raw) : 30;
    return Number.isFinite(n) && ALLOWED.includes(n) ? n : 30;
  });
  useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY, String(period)); } catch {}
  }, [period]);
  return (
    <PeriodContext.Provider value={{ period, setPeriod }}>{children}</PeriodContext.Provider>
  );
}

export function usePeriod() {
  return useContext(PeriodContext);
}
