import React from 'react';
import { cn } from '@/lib/utils';

interface PreviewBadgeProps {
  className?: string;
  label?: string;
}

/**
 * PreviewBadge — chip único compacto (chip-honest). Sinaliza "Prévia — dados
 * fictícios" em toda tela que renderize números do mock. Formato discreto,
 * mono 10px, dot warning. Sem uppercase gigante.
 */
export function PreviewBadge({ className, label = 'Prévia · dados fictícios' }: PreviewBadgeProps) {
  return (
    <span
      className={cn('chip-honest', className)}
      style={{ color: 'hsl(var(--warning))' }}
      aria-label="Conteúdo de prévia com dados fictícios"
    >
      <span className="w-1 h-1 rounded-full bg-warning" />
      {label}
    </span>
  );
}
