import React from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export type FreshnessLevel = 'fresh' | 'stale' | 'degraded';

interface FreshnessTagProps {
  /** Time reference in seconds since last update, or a preformatted label. */
  ageSeconds?: number;
  label?: string;
  source?: string;
  level?: FreshnessLevel;
  className?: string;
}

function formatAge(seconds: number): string {
  if (seconds < 60) return `${Math.max(1, Math.round(seconds))}s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)}h`;
  return `${Math.round(seconds / 86400)}d`;
}

/**
 * FreshnessTag — obrigatório em card/tabela cuja fonte pode atrasar.
 * Nunca esconder o frescor: se está velho, o operador precisa ver.
 */
export function FreshnessTag({ ageSeconds, label, source, level, className }: FreshnessTagProps) {
  const resolvedLevel: FreshnessLevel =
    level ?? (ageSeconds === undefined ? 'fresh' : ageSeconds > 900 ? 'degraded' : ageSeconds > 300 ? 'stale' : 'fresh');

  const tone =
    resolvedLevel === 'degraded'
      ? 'text-critical border-critical/25 bg-critical/5'
      : resolvedLevel === 'stale'
        ? 'text-warning border-warning/25 bg-warning/5'
        : 'text-stone border-line bg-iron/60';

  const text =
    label ??
    (ageSeconds !== undefined
      ? `atualizado há ${formatAge(ageSeconds)}${source ? ` · ${source}` : ''}`
      : source
        ? `fonte ${source}`
        : 'ao vivo');

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-[6px] border px-2 py-0.5 text-11 font-mono tabular-nums',
        tone,
        className,
      )}
    >
      <Clock className="h-3 w-3" />
      {text}
    </span>
  );
}
