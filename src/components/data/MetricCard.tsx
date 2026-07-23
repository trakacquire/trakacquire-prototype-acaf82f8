import React from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useEvidence } from '../layout/AppShell';

interface MetricCardProps {
  label: string;
  value: string | number;
  prefix?: string;
  suffix?: string;
  delta?: {
    value: string | number;
    trend: 'up' | 'down' | 'neutral';
  };
  evidenceData?: any;
  className?: string;
}

export function MetricCard({ label, value, prefix, suffix, delta, evidenceData, className }: MetricCardProps) {
  const { openEvidence } = useEvidence();

  const handleOpenEvidence = () => {
    openEvidence(evidenceData || { label, value, state: 'Reconciled', freshness: 'atualizado há 2h' });
  };

  return (
    <div 
      className={cn("bg-graphite border border-line rounded-xl p-4 flex flex-col gap-2 hover:border-stone transition-colors cursor-pointer group", className)}
      onClick={handleOpenEvidence}
    >
      <div className="text-12 font-mono text-stone uppercase tracking-wider">{label}</div>
      <div className="flex items-end gap-2">
        <div className="text-32 font-mono font-semibold text-eggshell tracking-tight tabular-nums group-hover:text-proof-blue transition-colors">
          {prefix && <span className="text-stone text-xl mr-1">{prefix}</span>}
          {value}
          {suffix && <span className="text-stone text-xl ml-1">{suffix}</span>}
        </div>
        
        {delta && (
          <div className={cn(
            "flex items-center text-12 font-medium mb-2",
            delta.trend === 'up' ? "text-verified" : delta.trend === 'down' ? "text-critical" : "text-stone"
          )}>
            {delta.trend === 'up' && <TrendingUp className="w-3 h-3 mr-1" />}
            {delta.trend === 'down' && <TrendingDown className="w-3 h-3 mr-1" />}
            {delta.trend === 'neutral' && <Minus className="w-3 h-3 mr-1" />}
            {delta.value}
          </div>
        )}
      </div>
    </div>
  );
}