import React from 'react';
import { X, Clock, Database, ShieldAlert, ArrowRight, Target, RotateCcw, FileCheck } from 'lucide-react';
import { Link } from 'wouter';
import { StatusChip } from '../domain/StatusChip';

interface EvidenceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
}

export function EvidenceDrawer({ isOpen, onClose, data }: EvidenceDrawerProps) {
  if (!isOpen) return null;

  const navigateTo: string | undefined = data?.navigateTo ?? data?.ledgerHref;
  const navigateLabel: string = data?.navigateLabel ?? 'Ver no Ledger';
  const confidencePct = typeof data?.confidence === 'number' ? Math.round(data.confidence * 100) : null;

  return (
    <>
      <div className="fixed inset-0 bg-ink/80 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed top-0 right-0 w-full max-w-md h-full bg-graphite border-l border-line z-50 shadow-2xl flex flex-col animate-in slide-in-from-right-full duration-200 ease-out">
        <div className="h-14 border-b border-line flex items-center justify-between px-6 shrink-0">
          <h2 className="text-14 font-semibold text-eggshell">Evidência</h2>
          <button onClick={onClose} className="text-stone hover:text-eggshell transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {data && (
          <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">
            <div>
              <h3 className="text-24 font-mono font-bold mb-1">{data.label || 'Métrica'}</h3>
              <div className="text-32 font-mono text-eggshell mb-4">{data.value}</div>

              <div className="flex gap-2 flex-wrap">
                <StatusChip status={data.state === 'Provisório' ? 'Divergent' : 'Reconciled'} />
                <span className="inline-flex items-center px-2 py-0.5 rounded-[6px] border border-line bg-zinc text-11 font-medium text-stone">
                  <Clock className="w-3 h-3 mr-1" />
                  {data.freshness || 'Dados atualizados há 5 min'}
                </span>
                {data.view && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-[6px] border border-line bg-zinc text-11 font-mono text-stone">
                    Vista: {data.view === 'journey_proof' ? 'Cadeia de prova' : data.view === 'acquisition_funnel' ? 'Funil de aquisição' : 'Operacional'}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-4 border-t border-line pt-6">
              <div>
                <div className="text-11 uppercase font-bold text-stone mb-1 flex items-center">
                  <Database className="w-3 h-3 mr-1.5" /> Fonte da verdade
                </div>
                <div className="text-13 text-eggshell bg-iron p-3 rounded-md border border-line">
                  {data.source || 'TAP Postback (operacional)'}
                </div>
              </div>

              <div>
                <div className="text-11 uppercase font-bold text-stone mb-1">Fórmula</div>
                <div className="text-13 font-mono text-proof-blue bg-iron p-3 rounded-md border border-line">
                  {data.formula || 'sum(events.value) where confirmed = true'}
                </div>
              </div>

              <div>
                <div className="text-11 uppercase font-bold text-stone mb-1 flex items-center">
                  <Target className="w-3 h-3 mr-1.5" /> Modelo de atribuição
                </div>
                <div className="text-13 text-eggshell bg-iron p-3 rounded-md border border-line">
                  <div>{data.attribution || 'Last Qualified Click · janela 30d · congelado no registro'}</div>
                  {confidencePct !== null && (
                    <div className="mt-2 flex items-center gap-2 text-11 text-stone">
                      <span className="font-mono uppercase tracking-wider">Confiança</span>
                      <div className="flex-1 h-1 rounded-full bg-line overflow-hidden">
                        <div className="h-full bg-proof-blue" style={{ width: `${confidencePct}%` }} />
                      </div>
                      <span className="font-mono tabular-nums text-eggshell">{confidencePct}%</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-11 uppercase font-bold text-stone mb-1 flex items-center">
                    <RotateCcw className="w-3 h-3 mr-1.5" /> Reversões
                  </div>
                  <div className="text-13 font-mono text-eggshell bg-iron p-3 rounded-md border border-line tabular-nums">
                    {typeof data.reversals === 'number' ? data.reversals : 0}
                  </div>
                </div>
                <div>
                  <div className="text-11 uppercase font-bold text-stone mb-1 flex items-center">
                    <FileCheck className="w-3 h-3 mr-1.5" /> Audit ref
                  </div>
                  <div className="text-13 font-mono text-proof-blue bg-iron p-3 rounded-md border border-line truncate">
                    {data.auditRef || 'aud_—'}
                  </div>
                </div>
              </div>

              {data.state === 'Provisório' && (
                <div className="text-11 text-warning bg-warning/8 border border-warning/25 rounded-md p-2 flex items-start gap-1.5">
                  <ShieldAlert className="w-3 h-3 mt-0.5 shrink-0" />
                  Estado provisório — número reconcilia em D+1.
                </div>
              )}
            </div>

            <div className="mt-auto pt-6">
              {navigateTo ? (
                <Link
                  href={navigateTo}
                  onClick={onClose}
                  className="w-full inline-flex items-center justify-center gap-1.5 bg-proof-blue/15 border border-proof-blue/40 text-proof-blue font-medium py-2 rounded-md hover:bg-proof-blue/25 transition-colors"
                >
                  {navigateLabel}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <button className="w-full bg-zinc border border-line text-eggshell font-medium py-2 rounded-md hover:bg-line transition-colors">
                  Ver no Ledger
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
