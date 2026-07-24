import React from 'react';
import { cn } from '@/lib/utils';

export interface DiagnosticItem {
  key: string;
  label: string;
  description: string;
  count: number;
  tone: 'verified' | 'warning' | 'critical' | 'neutral';
}

interface Props {
  items: DiagnosticItem[];
  active?: string | null;
  onSelect: (key: string | null) => void;
  className?: string;
}

const TONE_DOT: Record<DiagnosticItem['tone'], string> = {
  verified: 'bg-verified',
  warning:  'bg-warning',
  critical: 'bg-critical',
  neutral:  'bg-stone/60',
};

const TONE_TEXT: Record<DiagnosticItem['tone'], string> = {
  verified: 'text-verified',
  warning:  'text-warning',
  critical: 'text-critical',
  neutral:  'text-eggshell',
};

/**
 * DiagnosticPanel — painel de saúde de uma tabela.
 * Cada card mostra contagem e, ao clicar, filtra a tabela pai.
 * Cor semântica (verified/warning/critical), nunca decorativa.
 */
export function DiagnosticPanel({ items, active, onSelect, className }: Props) {
  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-4 gap-3', className)}>
      {items.map((it) => {
        const isActive = active === it.key;
        return (
          <button
            key={it.key}
            type="button"
            onClick={() => onSelect(isActive ? null : it.key)}
            className={cn(
              'text-left rounded-xl border bg-graphite p-4 transition-colors',
              isActive ? 'border-proof-blue' : 'border-line hover:border-stone',
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', TONE_DOT[it.tone])} />
              <span className="text-11 font-mono uppercase tracking-wider text-stone">
                {it.label}
              </span>
            </div>
            <div className={cn('font-mono tabular-nums text-24 leading-none font-semibold', TONE_TEXT[it.tone])}>
              {it.count.toLocaleString('pt-BR')}
            </div>
            <div className="text-11 text-stone mt-2 leading-snug">{it.description}</div>
            {isActive ? (
              <div className="text-[10px] font-mono uppercase tracking-wider text-proof-blue mt-2">
                Filtro ativo · clique para limpar
              </div>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
