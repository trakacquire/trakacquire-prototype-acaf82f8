import React from 'react';
import { ArrowRight, Clock, ShieldAlert } from 'lucide-react';
import { AuditRef } from './AuditRef';
import { cn } from '@/lib/utils';

export type ApprovalRisk = 'low' | 'medium' | 'high';

export interface ApprovalCardProps {
  id: string;
  title: string;
  requestedBy: string;
  requestedAt: string;
  risk?: ApprovalRisk;
  scope?: string;
  rationale?: string;
  auditRef?: string;
  onApprove?: () => void;
  onReject?: () => void;
  onOpen?: () => void;
  className?: string;
}

/**
 * ApprovalCard — Onda A · A6 canonical shape.
 *
 * Todo pedido de aprovação (mudança de fluxo, publicação de segmento, override
 * de política) renderiza nesta shell. Contém: título, quem/quando, risco,
 * escopo/rationale, audit ref, e as duas ações canônicas (Aprovar / Rejeitar).
 */
export function ApprovalCard({
  id,
  title,
  requestedBy,
  requestedAt,
  risk = 'low',
  scope,
  rationale,
  auditRef,
  onApprove,
  onReject,
  onOpen,
  className,
}: ApprovalCardProps) {
  const riskTint =
    risk === 'high' ? 'text-critical border-critical/30 bg-critical/8'
    : risk === 'medium' ? 'text-warning border-warning/30 bg-warning/8'
    : 'text-verified border-verified/25 bg-verified/8';

  const riskLabel = risk === 'high' ? 'Alto risco' : risk === 'medium' ? 'Risco moderado' : 'Baixo risco';

  return (
    <article
      className={cn(
        'surface-raised rounded-[12px] border border-line p-5 flex flex-col gap-4',
        className,
      )}
      aria-labelledby={`approval-${id}-title`}
    >
      <header className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="eyebrow mb-1.5">Aprovação · pendente</div>
          <h3 id={`approval-${id}-title`} className="text-15 font-semibold text-eggshell leading-tight">
            {title}
          </h3>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-11 text-stone">
            <span className="font-mono">{requestedBy}</span>
            <span aria-hidden>·</span>
            <span className="inline-flex items-center gap-1 font-mono tabular-nums">
              <Clock className="w-3 h-3" />
              {requestedAt}
            </span>
          </div>
        </div>
        <span className={cn('inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[6px] border text-11 font-medium whitespace-nowrap', riskTint)}>
          <ShieldAlert className="w-3 h-3" />
          {riskLabel}
        </span>
      </header>

      {(scope || rationale) && (
        <div className="grid gap-3 text-13 text-eggshell/90">
          {scope && (
            <div>
              <div className="text-11 uppercase font-bold text-stone mb-1">Escopo</div>
              <div className="bg-iron p-2.5 rounded-md border border-line font-mono text-12">{scope}</div>
            </div>
          )}
          {rationale && (
            <div>
              <div className="text-11 uppercase font-bold text-stone mb-1">Justificativa</div>
              <p className="leading-snug">{rationale}</p>
            </div>
          )}
        </div>
      )}

      <footer className="pt-3 border-t border-line/70 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {auditRef && <AuditRef id={auditRef} kind="aud" />}
        </div>
        <div className="flex items-center gap-1.5">
          {onOpen && (
            <button
              onClick={onOpen}
              className="inline-flex items-center gap-1 h-8 px-2.5 rounded-md text-12 text-stone hover:text-eggshell"
            >
              Detalhes
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
          <button
            onClick={onReject}
            className="h-8 px-3 rounded-md border border-line bg-graphite hover:bg-zinc text-12 text-eggshell transition-colors"
          >
            Rejeitar
          </button>
          <button
            onClick={onApprove}
            className="h-8 px-3 rounded-md bg-verified/15 border border-verified/40 text-verified hover:bg-verified/25 text-12 font-medium transition-colors"
          >
            Aprovar
          </button>
        </div>
      </footer>
    </article>
  );
}
