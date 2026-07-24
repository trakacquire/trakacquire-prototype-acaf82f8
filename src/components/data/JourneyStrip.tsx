import React from 'react';
import { cn } from '@/lib/utils';

interface Stage {
  label: string;
  count: number;
  percentage?: number;
  colorClass: string;
  dotClass?: string; // dot semantic + glow
}

/**
 * JourneyStrip — Fase F.3
 * Etapas do funil com conectores tracejados (::after) e dots com glow semântico.
 */
export function JourneyStrip() {
  const stages: Stage[] = [
    { label: 'Captured',   count: 4821, colorClass: 'text-proof-blue border-proof-blue/30 bg-proof-blue/10', dotClass: 'bg-proof-blue dot-glow-proof' },
    { label: 'Linked',     count: 3947, percentage: 82.0, colorClass: 'text-proof-blue border-proof-blue/30 bg-proof-blue/10', dotClass: 'bg-proof-blue dot-glow-proof' },
    { label: 'Registered', count: 234,  percentage: 5.9,  colorClass: 'text-eggshell border-line bg-zinc', dotClass: 'bg-stone' },
    { label: 'Confirmed',  count: 51,   percentage: 21.8, colorClass: 'text-verified border-verified/30 bg-verified/10', dotClass: 'bg-verified dot-glow-verified' },
    { label: 'Reconciled', count: 47,   percentage: 92.2, colorClass: 'text-verified border-verified/50 bg-verified/20', dotClass: 'bg-verified dot-glow-verified' },
  ];

  return (
    <div className="surface-flat rounded-xl p-4 flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-0 w-full overflow-x-auto">
      {stages.map((stage, idx) => (
        <div
          key={stage.label}
          className={cn(
            'flex flex-col flex-1 min-w-[120px] px-3 first:pl-0 last:pr-0 relative',
            idx < stages.length - 1 && 'md:journey-connector',
          )}
        >
          <div className="flex items-center gap-1.5 mb-1">
            {stage.dotClass && <span className={cn('w-1.5 h-1.5 rounded-full', stage.dotClass)} />}
            <div className="text-[10px] font-mono text-stone uppercase tracking-[0.14em]">{stage.label}</div>
          </div>
          <div className={cn('px-3 py-2 rounded-[10px] border flex items-baseline justify-between', stage.colorClass)}>
            <span className="text-18 font-mono font-bold tabular-nums">{stage.count.toLocaleString('pt-BR')}</span>
            {stage.percentage !== undefined && (
              <span className="text-11 font-mono opacity-80 tabular-nums">{stage.percentage}%</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
