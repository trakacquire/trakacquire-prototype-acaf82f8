import React, { useState } from 'react';
import { AppShell, useEvidence } from '@/components/layout/AppShell';
import { PreviewBadge } from '@/components/data/PreviewBadge';
import { MetricValue } from '@/components/data/MetricValue';
import { AuditRef } from '@/components/data/AuditRef';
import { DataTable, ColumnDef } from '@/components/data/DataTable';
import { ScenarioStateGate, StateShowcase } from '@/components/state/ScenarioStateGate';
import { buildEvidence } from '@/lib/evidence';
import { useAppState } from '@/lib/context/AppStateContext';
import { toast } from 'sonner';
import { ShieldCheck, Clock } from 'lucide-react';

const HISTORY_ROWS = [
  { id: 'ap_h001', label: 'Escalar Budget TikTok +15%', hash: 'ap_h001', result: 'approved', when: '2026-07-17 09:22', user: 'jota@operacao.com', audit: 'aud_84a2f' },
  { id: 'ap_h002', label: 'Desativar Campanha Baixo ROAS', hash: 'ap_h002', result: 'rejected', when: '2026-07-10 15:41', user: 'ana@operacao.com', audit: 'aud_b13de' },
  { id: 'ap_h003', label: 'Aumentar Bid Lookalike 2%', hash: 'ap_h003', result: 'expired', when: '2026-07-03 21:07', user: '—', audit: 'aud_c92aa' },
];

function ResultBadge({ result }: { result: string }) {
  const cfg: Record<string, string> = {
    approved: 'bg-verified/10 text-verified border-verified/20',
    rejected: 'bg-critical/10 text-critical border-critical/20',
    expired: 'bg-stone/10 text-stone border-stone/20',
  };
  const label: Record<string, string> = { approved: 'Aprovado', rejected: 'Rejeitado', expired: 'Expirado' };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-[6px] border text-11 font-medium uppercase ${cfg[result]}`}>
      {label[result]}
    </span>
  );
}

export default function ApprovalsPage() {
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');
  const [rejectDialog, setRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [approveDialog, setApproveDialog] = useState(false);
  const [approveReason, setApproveReason] = useState('');
  const [lastAudit, setLastAudit] = useState<string | null>(null);
  const { state, dispatch } = useAppState();
  const { openEvidence } = useEvidence();

  const planStatus = state.actionPlans['ap_001'];
  const pendingCount = planStatus === 'pending' ? 1 : 0;

  const handleApprove = () => {
    if (!approveReason.trim()) { toast('Justificativa obrigatória.'); return; }
    const auditId = `aud_${Math.random().toString(36).slice(2, 8)}`;
    dispatch({ type: 'APPROVE_PLAN', id: 'ap_001' });
    dispatch({ type: 'APPEND_AUDIT', entry: { timestamp: new Date().toISOString(), user: 'jota@operacao.com', action: 'APPROVE_PLAN', object: 'ap_001', detail: approveReason.trim() } });
    setLastAudit(auditId);
    setApproveDialog(false);
    setApproveReason('');
    toast('Plano aprovado — AuditRef gerado.');
  };
  const handleReject = () => {
    if (!rejectReason.trim()) { toast('Justificativa obrigatória.'); return; }
    const auditId = `aud_${Math.random().toString(36).slice(2, 8)}`;
    dispatch({ type: 'REJECT_PLAN', id: 'ap_001' });
    dispatch({ type: 'APPEND_AUDIT', entry: { timestamp: new Date().toISOString(), user: 'jota@operacao.com', action: 'REJECT_PLAN', object: 'ap_001', detail: rejectReason.trim() } });
    setLastAudit(auditId);
    setRejectDialog(false);
    setRejectReason('');
    toast('Plano rejeitado — AuditRef gerado.');
  };

  const columns: ColumnDef<typeof HISTORY_ROWS[number]>[] = [
    { header: 'Plano', accessorKey: 'label', cell: (r) => (
      <div className="flex flex-col">
        <span className="text-13 text-eggshell">{r.label}</span>
        <span className="font-mono text-11 text-stone tabular-nums">{r.hash}</span>
      </div>
    )},
    { header: 'Resultado', accessorKey: 'result', cell: (r) => <ResultBadge result={r.result} /> },
    { header: 'Responsável', accessorKey: 'user', cell: (r) => <span className="text-13 text-stone">{r.user}</span> },
    { header: 'Quando', accessorKey: 'when', cell: (r) => <span className="font-mono text-12 text-stone tabular-nums">{r.when}</span> },
    { header: 'AuditRef', accessorKey: 'audit', cell: (r) => <AuditRef id={r.audit} kind="audit" /> },
  ];

  return (
    <AppShell breadcrumb={[{ label: 'Operate' }, { label: 'Aprovações' }]}>
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <div className="text-11 font-serif italic text-stone mb-1">Operate · Central de Aprovações</div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-24 font-bold text-eggshell">Central de Aprovações</h1>
            <PreviewBadge />
            <StateShowcase />
          </div>
          <p className="text-13 text-stone mt-1">Materialização do D5: autor ≠ revisor ≠ autoridade de release. Planos imutáveis com hash, impacto e amostra.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button onClick={() => openEvidence(buildEvidence({
            label: 'Planos pendentes', value: {(pendingCount).toLocaleString("pt-BR")},
            formula: 'count(action_plans.status="pending")', source: 'Approval Center',
          }))} className="text-left bg-graphite border border-line rounded-xl p-4 hover:border-stone transition-colors">
            <div className="text-11 uppercase tracking-wider text-stone font-mono">Pendentes</div>
            <div className="text-24 font-bold text-warning font-mono tabular-nums mt-2">{pendingCount}</div>
          </button>
          <button onClick={() => openEvidence(buildEvidence({
            label: 'Aprovações 30d', value: {(1).toLocaleString("pt-BR")},
            formula: 'count(audit_log.action="APPROVE_PLAN") window=30d', source: 'Audit Log',
          }))} className="text-left bg-graphite border border-line rounded-xl p-4 hover:border-stone transition-colors">
            <div className="text-11 uppercase tracking-wider text-stone font-mono">Aprovadas 30d</div>
            <div className="text-24 font-bold text-verified font-mono tabular-nums mt-2">1</div>
          </button>
          <button onClick={() => openEvidence(buildEvidence({
            label: 'Rejeitadas 30d', value: {(1).toLocaleString("pt-BR")},
            formula: 'count(audit_log.action="REJECT_PLAN") window=30d', source: 'Audit Log',
          }))} className="text-left bg-graphite border border-line rounded-xl p-4 hover:border-stone transition-colors">
            <div className="text-11 uppercase tracking-wider text-stone font-mono">Rejeitadas 30d</div>
            <div className="text-24 font-bold text-critical font-mono tabular-nums mt-2">1</div>
          </button>
        </div>

        <ScenarioStateGate>
          <div className="border-b border-line flex gap-6 px-2">
            {[
              { key: 'pending', label: 'Pendentes' },
              { key: 'history', label: 'Histórico' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as 'pending' | 'history')}
                className={`pb-3 text-14 font-medium border-b-2 transition-colors ${activeTab === tab.key ? 'text-eggshell border-proof-blue' : 'text-stone border-transparent hover:text-eggshell'}`}
              >
                {tab.label}
                {tab.key === 'pending' && pendingCount > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 rounded-full bg-warning/20 text-warning text-10 font-mono font-bold tabular-nums">{pendingCount}</span>
                )}
              </button>
            ))}
          </div>

          {activeTab === 'pending' && (
            <div>
              {planStatus === 'pending' ? (
                <div className="bg-graphite border border-line rounded-xl p-5 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <ShieldCheck className="w-4 h-4 text-proof-blue" />
                        <h3 className="text-16 font-bold text-eggshell">Escalar Budget Meta +20%</h3>
                      </div>
                      <div className="flex items-center gap-2 text-11 font-mono text-stone tabular-nums">
                        <span>ap_001</span><span>·</span>
                        <span>hash sha256:9f2a4b1c…</span><span>·</span>
                        <span>solicitado por ana@operacao.com</span>
                      </div>
                    </div>
                    <button
                      onClick={() => openEvidence(buildEvidence({
                        label: 'Impacto estimado', value: {`R$ ${(1200).toLocaleString("pt-BR",{maximumFractionDigits:0})}`},
                        formula: '(spend_uplift × ROAS_p50) − spend_uplift',
                        source: 'Attribution engine · janela 72h', state: 'Provisório',
                        freshness: 'amostra congelada às 2026-07-24 09:00',
                      }))}
                      className="text-right flex-shrink-0 group"
                    >
                      <div className="text-11 font-mono uppercase tracking-wider text-stone">impacto est.</div>
                      <div className="text-16 font-bold text-verified font-mono tabular-nums group-hover:underline">+R$ 1.200</div>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-line text-13">
                    <div><div className="text-11 font-mono uppercase text-stone">Amostra</div><div className="text-eggshell font-mono tabular-nums">72h · n=214 conv.</div></div>
                    <div><div className="text-11 font-mono uppercase text-stone">Frescor</div><div className="text-eggshell font-mono tabular-nums">há 12m</div></div>
                    <div><div className="text-11 font-mono uppercase text-stone">Autor</div><div className="text-eggshell">ana@…</div></div>
                    <div><div className="text-11 font-mono uppercase text-stone flex items-center gap-1"><Clock className="w-3 h-3" /> Expira</div><div className="text-warning font-mono tabular-nums">em 2h 04m</div></div>
                  </div>

                  <div className="flex items-center gap-3 pt-3 border-t border-line">
                    <button onClick={() => setApproveDialog(true)} className="px-4 py-2 rounded-md bg-eggshell text-ink text-14 font-medium hover:bg-white">Aprovar</button>
                    <button onClick={() => setRejectDialog(true)} className="px-4 py-2 rounded-md bg-critical/10 text-critical border border-critical/20 text-14 font-medium hover:bg-critical/20">Rejeitar</button>
                    <span className="text-11 font-mono text-stone">Justificativa obrigatória em ambos.</span>
                  </div>
                </div>
              ) : (
                <div className="bg-graphite border border-line rounded-xl p-8 text-center space-y-2">
                  <ResultBadge result={planStatus === 'approved' ? 'approved' : 'rejected'} />
                  <div className="text-13 text-stone">Plano ap_001 já foi resolvido.</div>
                  {lastAudit && <AuditRef id={lastAudit} kind="audit" className="mx-auto" />}
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && <DataTable data={HISTORY_ROWS} columns={columns} />}
        </ScenarioStateGate>

        {approveDialog && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setApproveDialog(false)}>
            <div className="bg-graphite border border-line rounded-xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
              <h3 className="text-16 font-semibold text-eggshell mb-2">Aprovar plano ap_001</h3>
              <p className="text-13 text-stone mb-4">A aprovação é imutável e gera um AuditRef.</p>
              <textarea rows={4} value={approveReason} onChange={e => setApproveReason(e.target.value)} placeholder="Justificativa (obrigatória)…" className="w-full bg-zinc border border-line text-eggshell rounded-md px-3 py-2 text-13 outline-none focus:border-proof-blue mb-4" autoFocus />
              <div className="flex gap-3 justify-end">
                <button onClick={() => setApproveDialog(false)} className="px-4 py-2 text-stone hover:text-eggshell text-14">Cancelar</button>
                <button onClick={handleApprove} className="bg-eggshell text-ink px-4 py-2 rounded-md font-medium text-14 hover:bg-white">Confirmar aprovação</button>
              </div>
            </div>
          </div>
        )}
        {rejectDialog && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setRejectDialog(false)}>
            <div className="bg-graphite border border-line rounded-xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
              <h3 className="text-16 font-semibold text-eggshell mb-2">Rejeitar plano ap_001</h3>
              <p className="text-13 text-stone mb-4">A rejeição é imutável e gera um AuditRef.</p>
              <textarea rows={4} value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="Justificativa (obrigatória)…" className="w-full bg-zinc border border-line text-eggshell rounded-md px-3 py-2 text-13 outline-none focus:border-proof-blue mb-4" autoFocus />
              <div className="flex gap-3 justify-end">
                <button onClick={() => setRejectDialog(false)} className="px-4 py-2 text-stone hover:text-eggshell text-14">Cancelar</button>
                <button onClick={handleReject} className="bg-critical/10 text-critical border border-critical/20 px-4 py-2 rounded-md font-medium text-14 hover:bg-critical/20">Confirmar rejeição</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
