import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

interface Stage {
  label: string;
  count: number;
  percentage?: number;
  colorClass: string;
}

export function JourneyStrip() {
  const stages: Stage[] = [
    { label: 'Captured', count: 4821, colorClass: 'text-proof-blue border-proof-blue/30 bg-proof-blue/10' },
    { label: 'Linked', count: 3947, percentage: 82.0, colorClass: 'text-proof-blue border-proof-blue/30 bg-proof-blue/10' },
    { label: 'Registered', count: 234, percentage: 5.9, colorClass: 'text-eggshell border-line bg-zinc' },
    { label: 'Confirmed', count: 51, percentage: 21.8, colorClass: 'text-verified border-verified/30 bg-verified/10' },
    { label: 'Reconciled', count: 47, percentage: 92.2, colorClass: 'text-verified border-verified/50 bg-verified/20' },
  ];

  return (
    <div className="bg-graphite border border-line rounded-xl p-4 flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-0 w-full overflow-x-auto">
      {stages.map((stage, idx) => (
        <React.Fragment key={stage.label}>
          <div className="flex flex-col flex-1 min-w-[120px] px-2 first:pl-0 last:pr-0">
            <div className="text-11 font-mono text-stone uppercase mb-1">{stage.label}</div>
            <div className={cn("px-3 py-2 rounded-lg border flex items-baseline justify-between", stage.colorClass)}>
              <span className="text-18 font-mono font-bold tabular-nums">{stage.count}</span>
              {stage.percentage !== undefined && (
                <span className="text-11 font-medium opacity-80">{stage.percentage}%</span>
              )}
            </div>
          </div>
          {idx < stages.length - 1 && (
            <div className="hidden md:flex items-center justify-center px-1 text-line">
              <ChevronRight className="w-4 h-4" />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}