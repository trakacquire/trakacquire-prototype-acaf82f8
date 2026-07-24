import React from 'react';
import { cn } from '@/lib/utils';
import { costSemaphore, type Semaphore } from '@/lib/fake/funnelSteps';

interface TargetKpiProps {
  label: string;
  value: number;                 // valor numérico (ex.: 288)
  format: (n: number) => string; // formatador (ex.: brl)
  target?: number;               // meta em R$ (opcional — sem meta = neutro)
  targetPrefix?: string;         // ex.: 'Meta: < '
  onOpenEvidence?: () => void;
  className?: string;
  /** Força o tom (para KPIs neutros como "FTDs") — se omitido, usa semáforo por custo. */
  toneOverride?: Semaphore;
}

const TONE_TEXT: Record<Semaphore, string> = {
  verified: 'text-verified',
  warning:  'text-warning',
  critical: 'text-critical',
  neutral:  'text-eggshell',
};

const TONE_DOT: Record<Semaphore, string> = {
  verified: 'bg-verified',
  warning:  'bg-warning',
  critical: 'bg-critical',
  neutral:  'bg-stone/60',
};

const TONE_META: Record<Semaphore, string> = {
  verified: 'text-verified',
  warning:  'text-warning',
  critical: 'text-critical',
  neutral:  'text-stone',
};

/**
 * TargetKpi — KPI de custo com meta declarada e semáforo semântico.
 * Regra Fase R (não decorativo): verified/warning/critical mapeiam ao status
 * frente à meta; nunca cor arbitrária por métrica.
 */
export function TargetKpi({
  label,
  value,
  format,
  target,
  targetPrefix = 'Meta: < ',
  onOpenEvidence,
  className,
  toneOverride,
}: TargetKpiProps) {
  const tone: Semaphore = toneOverride ?? (target ? costSemaphore(value, target) : 'neutral');

  return (
    <button
      type="button"
      onClick={onOpenEvidence}
      className={cn(
        'text-left rounded-xl border border-line bg-graphite hover:border-stone transition-colors p-4 w-full',
        className,
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', TONE_DOT[tone])} />
        <span className="text-11 font-mono uppercase tracking-wider text-stone">{label}</span>
      </div>
      <div className={cn('font-mono tabular-nums text-24 leading-none font-semibold', TONE_TEXT[tone])}>
        {format(value)}
      </div>
      {target ? (
        <div className={cn('text-11 font-mono tabular-nums mt-2', TONE_META[tone])}>
          {targetPrefix}{format(target)}
          {tone === 'critical' && ' · acima'}
          {tone === 'warning'  && ' · próximo'}
          {tone === 'verified' && ' · dentro'}
        </div>
      ) : null}
    </button>
  );
}
