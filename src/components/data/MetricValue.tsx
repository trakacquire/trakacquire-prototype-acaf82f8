import React from 'react';
import { cn } from '@/lib/utils';

interface MetricValueProps {
  value: React.ReactNode;
  unit?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  tone?: 'default' | 'verified' | 'warning' | 'critical' | 'proof';
  onOpenEvidence?: () => void;
  className?: string;
  ariaLabel?: string;
}

/**
 * MetricValue — todo número em Proofline é mono, tabular e abre Evidence Drawer.
 * Uso obrigatório: nada de <span>{value}</span> solto em card/kpi.
 */
export function MetricValue({
  value,
  unit,
  size = 'md',
  tone = 'default',
  onOpenEvidence,
  className,
  ariaLabel,
}: MetricValueProps) {
  const sizeCls = {
    sm: 'text-16',
    md: 'text-20',
    lg: 'text-24',
    xl: 'text-32',
  }[size];

  const toneCls = {
    default: 'text-eggshell',
    verified: 'text-verified',
    warning: 'text-warning',
    critical: 'text-critical',
    proof: 'text-proof-blue',
  }[tone];

  const Element: any = onOpenEvidence ? 'button' : 'span';

  return (
    <Element
      onClick={onOpenEvidence}
      aria-label={ariaLabel}
      className={cn(
        'font-mono tabular-nums font-semibold leading-none inline-flex items-baseline gap-1',
        sizeCls,
        toneCls,
        onOpenEvidence && 'cursor-pointer hover:opacity-90 transition-opacity',
        className,
      )}
    >
      {value}
      {unit && <span className="text-stone text-[0.55em] font-normal">{unit}</span>}
    </Element>
  );
}
