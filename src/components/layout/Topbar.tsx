import React from 'react';
import { cn } from '@/lib/utils';
import { usePeriod } from '@/lib/context/PeriodContext';

interface TopbarProps {
  breadcrumb: React.ReactNode;
}

export function Topbar({ breadcrumb }: TopbarProps) {
  const { period, setPeriod } = usePeriod();

  const periodOptions: { label: string; value: number }[] = [
    { label: 'Hoje', value: 1 },
    { label: 'Últimos 7 dias', value: 7 },
    { label: 'Últimos 30 dias', value: 30 },
    { label: 'Últimos 90 dias', value: 90 },
  ];

  return (
    <header className="h-14 bg-iron border-b border-line flex items-center justify-between px-4 lg:px-6 sticky top-0 z-20">
      <div className="flex items-center gap-4">
        {breadcrumb}
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(Number(e.target.value))}
            className="bg-zinc border border-line text-eggshell text-sm rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-proof-blue"
          >
            {periodOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="w-8 h-8 rounded-full bg-zinc border border-line flex items-center justify-center text-eggshell text-sm font-medium cursor-pointer hover:bg-line">
          JO
        </div>
      </div>
    </header>
  );
}
