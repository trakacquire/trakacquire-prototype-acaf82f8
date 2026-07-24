import React from 'react';
import { Construction } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PhasePreviewBannerProps {
  phase: string; // e.g. "P4"
  scope?: string; // curta descrição do que virá
  className?: string;
}

/**
 * Banner discreto e obrigatório no topo de toda página cuja fase de
 * detalhamento ainda não chegou. Nenhuma tela finge estar pronta.
 * (Product-Map §0, regra de "prévia rasa")
 */
export function PhasePreviewBanner({ phase, scope, className }: PhasePreviewBannerProps) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-lg border border-warning/25 bg-warning/5 px-4 py-2.5',
        className,
      )}
      role="status"
    >
      <Construction className="w-4 h-4 text-warning mt-0.5 shrink-0" />
      <div className="flex-1 text-13 text-eggshell/90">
        <span className="text-warning font-medium">Prévia rasa.</span>{' '}
        Esta tela será detalhada na fase{' '}
        <span className="font-mono text-eggshell">{phase}</span>.
        {scope && <span className="text-stone"> · {scope}</span>}
      </div>
    </div>
  );
}
