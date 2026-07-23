import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useAppState } from '@/lib/context/AppStateContext';
import { toast } from 'sonner';

const HISTORY_ROWS = [
  { id: 'ap_h001', label: 'Escalar Budget TikTok +15%', hash: 'ap_h001', result: 'approved', when: 'Há 7 dias', user: 'jota@operacao.com' },
  { id: 'ap_h002', label: 'Desativar Campanha Baixo ROAS', hash: 'ap_h002', result: 'rejected', when: 'Há 14 dias', user: 'ana@operacao.com' },
  { id: 'ap_h003', label: 'Aumentar Bid Lookalike 2%', hash: 'ap_h003', result: 'expired', when: 'Há 21 dias', user: '—' },
];

function ResultBadge({ result }: { result: string }) {
  if (result === 'approved') return (
    <span className="px-2 py-0.5 rounded text-11 font-bold bg-[var(--verified)]/10 text-[var(--verified)] uppercase">Aprovado</span>
  );
  if (result === 'rejected') return (
    <span className="px-2 py-0.5 rounded text-11 font-bold bg-[var(--critical)]/10 text-[var(--critical)] uppercase">Rejeitado</span>
  );
  return (
    <span className="px-2 py-0.5 rounded text-11 font-bold bg-[var(--stone)]/10 text-[var(--stone)] uppercase">Expirado</span>
  );
}

export default function Approvals() {
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');
  const { state, dispatch } = useAppState();

  const planStatus = state.actionPlans['ap_001'];

  const handleApprove = () => {
    dispatch({ type: 'APPROVE_PLAN', id: 'ap_001' });
    dispatch({
      type: 'APPEND_AUDIT',
      entry: {
        timestamp: new Date().toISOString(),
        user: 'jota@operacao.com',
        action: 'APPROVE_PLAN',
        object: 'ap_001',
        detail: 'Plano de ação aprovado via página Aprovações',
      },
    });
    toast('Plano aprovado.');
  };

  const handleReject = () => {
    dispatch({ type: 'REJECT_PLAN', id: 'ap_001' });
    dispatch({
      type: 'APPEND_AUDIT',
      entry: {
        timestamp: new Date().toISOString(),
        user: 'jota@operacao.com',
        action: 'REJECT_PLAN',
        object: 'ap_001',
        detail: 'Plano de ação rejeitado via página Aprovações',
      },
    });
    toast('Plano rejeitado.');
  };

  return (
    <AppShell breadcrumb={[{ label: 'Aprovações' }]}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-24 font-bold text-eggshell mb-1">Central de Aprovações</h1>
          <p className="text-13 text-stone">Planos de ação e mudanças que requerem aprovação</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-line flex gap-6 px-2">
          {[
            { key: 'pending', label: 'Pendentes' },
            { key: 'history', label: 'Histórico' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as 'pending' | 'history')}
              className={`pb-3 text-14 font-medium whitespace-nowrap transition-colors border-b-2 ${
                activeTab === tab.key ? 'text-eggshell border-proof-blue' : 'text-stone border-transparent hover:text-eggshell'
              }`}
            >
              {tab.label}
              {tab.key === 'pending' && planStatus === 'pending' && (
                <span className="ml-2 px-1.5 py-0.5 rounded-full bg-[var(--warning)]/20 text-[var(--warning)] text-10 font-bold">1</span>
              )}
            </button>
          ))}
        </div>

        {activeTab === 'pending' && (
          <div>
            {/* Action Plan Card */}
            <div className="bg-graphite border border-line rounded-xl p-5 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-16 font-bold text-eggshell">Escalar Budget Meta +20%</h3>
                    {planStatus === 'approved' && (
                      <span className="px-2 py-0.5 rounded text-11 font-bold bg-[var(--verified)]/10 text-[var(--verified)] uppercase">Aprovado</span>
                    )}
                    {planStatus === 'rejected' && (
                      <span className="px-2 py-0.5 rounded text-11 font-bold bg-[var(--critical)]/10 text-[var(--critical)] uppercase">Rejeitado</span>
                    )}
                  </div>
                  <span className="font-mono text-11 text-stone">ap_001</span>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-14 font-bold text-[var(--verified)]">+R$1.200 est.</div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-13 text-stone">
                <span className="flex items-center gap-1">
                  <span className="text-[var(--verified)]">✓</span> Amostra: 72h
                </span>
                <span className="text-[var(--warning)]">⏱ Expira em 2h</span>
              </div>

              {planStatus === 'pending' && (
                <div className="flex items-center gap-3 pt-2 border-t border-line">
                  <button
                    onClick={handleApprove}
                    className="px-4 py-2 rounded-md bg-[var(--eggshell)] text-[var(--ink)] text-14 font-medium hover:bg-white transition-colors"
                  >
                    Aprovar
                  </button>
                  <button
                    onClick={handleReject}
                    className="px-4 py-2 rounded-md bg-[var(--critical)]/10 text-[var(--critical)] border border-[var(--critical)]/20 text-14 font-medium hover:bg-[var(--critical)]/20 transition-colors"
                  >
                    Rejeitar
                  </button>
                </div>
              )}
            </div>

            {planStatus !== 'pending' && (
              <p className="text-center text-stone text-13 mt-6">Nenhum plano pendente.</p>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-graphite border border-line rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-line">
                  <th className="px-4 py-3 text-left text-11 font-bold text-stone uppercase tracking-wider">Plano</th>
                  <th className="px-4 py-3 text-left text-11 font-bold text-stone uppercase tracking-wider">Resultado</th>
                  <th className="px-4 py-3 text-left text-11 font-bold text-stone uppercase tracking-wider">Responsável</th>
                  <th className="px-4 py-3 text-right text-11 font-bold text-stone uppercase tracking-wider">Quando</th>
                </tr>
              </thead>
              <tbody>
                {HISTORY_ROWS.map((row) => (
                  <tr key={row.id} className="border-b border-line last:border-0 hover:bg-[var(--zinc)]/20">
                    <td className="px-4 py-3">
                      <div className="text-13 text-eggshell">{row.label}</div>
                      <div className="font-mono text-11 text-stone">{row.hash}</div>
                    </td>
                    <td className="px-4 py-3">
                      <ResultBadge result={row.result} />
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-13 text-stone">{row.user}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-13 text-stone">{row.when}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppShell>
  );
}
