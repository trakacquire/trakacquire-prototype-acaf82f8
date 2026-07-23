import React, { createContext, useContext, useState } from 'react';
export const PeriodContext = createContext<{period:number;setPeriod:(n:number)=>void}>({period:30,setPeriod:()=>{}});
export function PeriodProvider({children}:{children:React.ReactNode}) {
  const [period,setPeriod] = useState(30);
  return <PeriodContext.Provider value={{period,setPeriod}}>{children}</PeriodContext.Provider>;
}
export function usePeriod() { return useContext(PeriodContext); }
