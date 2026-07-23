import React from 'react';
import { cn } from '@/lib/utils';

interface PreviewBadgeProps {
  className?: string;
  label?: string;
}

/**
 * PreviewBadge — selo obrigatório perto do título em toda tela que
 * renderize números fictícios do mock. Nenhum número mock sem rótulo por perto.
 */
export function PreviewBadge({ className, label = 'Prévia — dados fictícios' }: PreviewBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-[6px] border border-warning/25 bg-warning/5 px-2 py-0.5 text-11 font-mono uppercase tracking-wider text-warning',
        className,
      )}
      aria-label="Conteúdo de prévia com dados fictícios"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-warning" />
      {label}
    </span>
  );
}
