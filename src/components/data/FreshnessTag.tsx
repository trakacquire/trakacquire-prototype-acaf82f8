import React from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export type FreshnessLevel = 'fresh' | 'stale' | 'degraded';

interface FreshnessTagProps {
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
 * FreshnessTag — chip compacto (chip-honest). Tinta semântica segue o frescor.
 */
export function FreshnessTag({ ageSeconds, label, source, level, className }: FreshnessTagProps) {
  const resolvedLevel: FreshnessLevel =
    level ?? (ageSeconds === undefined ? 'fresh' : ageSeconds > 900 ? 'degraded' : ageSeconds > 300 ? 'stale' : 'fresh');

  const tint =
    resolvedLevel === 'degraded' ? 'hsl(var(--critical))'
    : resolvedLevel === 'stale' ? 'hsl(var(--warning))'
    : 'hsl(var(--stone))';

  const text =
    label ??
    (ageSeconds !== undefined
      ? `há ${formatAge(ageSeconds)}${source ? ` · ${source}` : ''}`
      : source
        ? source
        : 'ao vivo');

  return (
    <span className={cn('chip-honest', className)} style={{ color: tint }}>
      <Clock className="h-2.5 w-2.5" />
      {text}
    </span>
  );
}
