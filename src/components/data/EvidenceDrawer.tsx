import React from 'react';
import { X, Clock, Database, CheckCircle2, ShieldAlert } from 'lucide-react';
import { StatusChip } from '../domain/StatusChip';

interface EvidenceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
}

export function EvidenceDrawer({ isOpen, onClose, data }: EvidenceDrawerProps) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-ink/80 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed top-0 right-0 w-full max-w-md h-full bg-graphite border-l border-line z-50 shadow-2xl flex flex-col animate-in slide-in-from-right-full duration-200 ease-out">
        <div className="h-14 border-b border-line flex items-center justify-between px-6 shrink-0">
          <h2 className="text-14 font-semibold text-eggshell">Evidence</h2>
          <button onClick={onClose} className="text-stone hover:text-eggshell transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {data && (
          <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">
            <div>
              <h3 className="text-24 font-mono font-bold mb-1">{data.label || 'Metric'}</h3>
              <div className="text-32 font-mono text-eggshell mb-4">{data.value}</div>
              
              <div className="flex gap-2">
                <StatusChip status={data.state === 'Provisório' ? 'Divergent' : 'Reconciled'} />
                <span className="inline-flex items-center px-2 py-0.5 rounded-[6px] border border-line bg-zinc text-11 font-medium text-stone">
                  <Clock className="w-3 h-3 mr-1" />
                  {data.freshness || 'atualizado há 5m'}
                </span>
              </div>
            </div>

            <div className="space-y-4 border-t border-line pt-6">
              <div>
                <div className="text-11 uppercase font-bold text-stone mb-1 flex items-center">
                  <Database className="w-3 h-3 mr-1.5" /> Fonte da Verdade
                </div>
                <div className="text-13 text-eggshell bg-iron p-3 rounded-md border border-line">
                  {data.source || 'TAP Postback (operacional)'}
                </div>
              </div>

              <div>
                <div className="text-11 uppercase font-bold text-stone mb-1">Fórmula</div>
                <div className="text-13 font-mono text-proof-blue bg-iron p-3 rounded-md border border-line">
                  {data.formula || 'Sum(events.value) where type = "first_deposit_confirmed"'}
                </div>
              </div>

              <div>
                <div className="text-11 uppercase font-bold text-stone mb-1 flex items-center">
                  <ShieldAlert className="w-3 h-3 mr-1.5" /> Modelo de Atribuição
                </div>
                <div className="text-13 text-eggshell bg-iron p-3 rounded-md border border-line">
                  Last Qualified Click, janela 30d, congelado no registro
                </div>
              </div>
            </div>

            <div className="mt-auto pt-6">
              <button className="w-full bg-zinc border border-line text-eggshell font-medium py-2 rounded-md hover:bg-line transition-colors">
                Ver no Ledger
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}