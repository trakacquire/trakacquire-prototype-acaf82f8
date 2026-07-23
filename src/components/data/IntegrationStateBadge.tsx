import React from 'react';
import { cn } from '@/lib/utils';
import type { IntegrationState } from '@/lib/types';

interface IntegrationStateBadgeProps {
  state: IntegrationState;
  adapterVersion?: string;
  className?: string;
}

const LABEL: Record<IntegrationState, string> = {
  disabled: 'Disabled',
  sandbox: 'Sandbox',
  pilot: 'Pilot',
  production: 'Production',
  'policy-blocked': 'Policy blocked',
};

const TONE: Record<IntegrationState, string> = {
  disabled: 'text-stone border-line bg-zinc/60',
  sandbox: 'text-proof-blue border-proof-blue/25 bg-proof-blue/5',
  pilot: 'text-warning border-warning/25 bg-warning/5',
  production: 'text-verified border-verified/25 bg-verified/5',
  'policy-blocked': 'text-critical border-critical/25 bg-critical/5',
};

/**
 * IntegrationStateBadge — vocabulário fechado + versão do adapter obrigatória.
 * Nada de rótulo inventado. Cor semântica não decora.
 */
export function IntegrationStateBadge({ state, adapterVersion, className }: IntegrationStateBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-[6px] border px-2 py-0.5 text-11 font-medium whitespace-nowrap',
        TONE[state],
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
      {LABEL[state]}
      {adapterVersion && (
        <span className="ml-1 font-mono text-stone/80 text-[10px]">v{adapterVersion}</span>
      )}
    </span>
  );
}
