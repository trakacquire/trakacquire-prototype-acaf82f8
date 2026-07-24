import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { AppShell, useEvidence } from '@/components/layout/AppShell';
import { db } from '@/lib/fake/db';
import { useAppState } from '@/lib/context/AppStateContext';
import { toast } from 'sonner';
import ConfirmDialog from '@/components/domain/ConfirmDialog';
import { StatusChip } from '@/components/domain/StatusChip';
import { PreviewBadge } from '@/components/data/PreviewBadge';
import { ScenarioStateGate, StateShowcase } from '@/components/state/ScenarioStateGate';
import { buildEvidence } from '@/lib/evidence';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { AlertTriangle, XCircle, RefreshCw, BarChart3 } from 'lucide-react';

const fmt = (v: number) => 'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('pt-BR');

export default function ReconciliationPage() {
  const [, navigate] = useLocation();
  const { dispatch } = useAppState();
  const { openEvidence } = useEvidence();

  const [activeTab, setActiveTab] = useState<'divergencias' | 'periodos' | 'relatorio'>('divergencias');
  const [periods, setPeriods] = useState({ jul: 'open', jun: 'closed', mai: 'closed' });
  const [closePeriodOpen, setClosePeriodOpen] = useState(false);

  const divergent = db.getDivergent();
  const orphans = db.getOrphans();
  const chargebacks = db.persons.filter(p => p.has_chargeback);
  const duplicates = db.persons.filter(p => p.status === 'Synthetic');
  const m = db.metricsForPeriod(30);

  // Chart data: deposits vs FTDs over 30 days
  const depositSeries = db.dailySeries(30, 'deposits');
  const ftdSeries = db.dailySeries(30, 'ftds');
  const chartData = depositSeries.map((d, i) => ({
    date: new Date(d.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    depositos: d.value,
    ftds: ftdSeries[i]?.value ?? 0,
  }));

  // Tab Divergências table rows
  const divergentRows = [
    ...divergent.map(p => ({ ...p, tipo: 'divergent' as const })),
    ...chargebacks.filter(p => p.status !== 'Divergent').map(p => ({ ...p, tipo: 'chargeback' as const })),
    ...duplicates.filter(p => p.status === 'Synthetic').map(p => ({ ...p, tipo: 'duplicate' as const })),
  ].slice(0, 30);

  const tipoLabel = (tipo: 'divergent' | 'chargeback' | 'duplicate') => {
    if (tipo === 'divergent') return 'Divergente';
    if (tipo === 'chargeback') return 'Estorno';
    return 'Duplicata';
  };

  const tipoStatus = (tipo: 'divergent' | 'chargeback' | 'duplicate') => {
    if (tipo === 'divergent') return 'Divergent';
    if (tipo === 'chargeback') return 'Blocked';
    return 'Synthetic';
  };

  // Period rows
  const periodRows = [
    { key: 'jul', label: 'Julho 2026', eventos: m.ftds, receita: m.gross_deposits, status: periods.jul },
    { key: 'jun', label: 'Junho 2026', eventos: Math.round(m.ftds * 0.87), receita: Math.round(m.gross_deposits * 0.91), status: periods.jun },
    { key: 'mai', label: 'Maio 2026', eventos: Math.round(m.ftds * 0.74), receita: Math.round(m.gross_deposits * 0.82), status: periods.mai },
  ];

  const handleClosePeriod = (reason?: string) => {
    setPeriods(prev => ({ ...prev, jul: 'closed' }));
    toast.success('Período fechado com sucesso.');
    dispatch({
      type: 'APPEND_AUDIT',
      entry: {
        timestamp: new Date().toISOString(),
        user: 'João Oliveira',
        action: 'Período fechado',
        object: 'Julho 2026',
        detail: reason ?? 'Período encerrado manualmente.',
      },
    });
  };

  const tooltipStyle = {
    contentStyle: {
      background: 'var(--graphite)',
      border: '1px solid var(--line)',
      color: 'var(--eggshell)',
      borderRadius: '8px',
    },
  };

  const tabs = [
    { id: 'divergencias', label: 'Divergências' },
    { id: 'periodos', label: 'Períodos' },
    { id: 'relatorio', label: 'Relatório' },
  ] as const;

  return (
    <AppShell breadcrumb={[{ label: 'Prove', href: '/revenue' }, { label: 'Reconciliação' }]}>
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <span className="kicker">Prove · Reconciliação</span>
            <PreviewBadge />
            <StateShowcase />
          </div>
          <h1 className="text-24 font-semibold text-eggshell font-sans">Onde o operacional bate com o contábil.</h1>
          <p className="text-13 text-stone">Divergências, períodos e relatório financeiro — cada número abre a fórmula.</p>
        </header>

        <ScenarioStateGate
          emptyTitle="Nada a reconciliar"
          emptyDescription="Sem depósitos ou divergências no período."
          degradedIntegration="Reconciliation engine"
        >
        {/* Stat cards clicáveis (abrem Evidence Drawer) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            type="button"
            onClick={() => openEvidence(buildEvidence({
              label: 'Divergentes',
              value: String(divergent.length),
              formula: 'count(persons) where deposit.amount != provider_reported',
              source: 'Reconciliation engine',
              state: 'Divergente',
            }))}
            className="text-left bg-graphite border border-line rounded-xl p-4 flex items-center gap-3 hover:border-stone transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-warning" />
            </div>
            <div>
              <div className="text-12 text-stone">Divergentes</div>
              <div className="text-20 font-mono font-bold text-warning tabular-nums">{divergent.length}</div>
            </div>
          </button>
          <button
            type="button"
            onClick={() => openEvidence(buildEvidence({
              label: 'Órfãos',
              value: String(orphans.length),
              formula: 'count(persons) where click_id is null and source == "orphan"',
              source: 'Identity Graph',
              state: 'Provisório',
            }))}
            className="text-left bg-graphite border border-line rounded-xl p-4 flex items-center gap-3 hover:border-stone transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-stone/10 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-stone" />
            </div>
            <div>
              <div className="text-12 text-stone">Órfãos</div>
              <div className="text-20 font-mono font-bold text-stone tabular-nums">{orphans.length}</div>
            </div>
          </button>
          <button
            type="button"
            onClick={() => openEvidence(buildEvidence({
              label: 'Estornos',
              value: String(chargebacks.length),
              formula: 'count(persons) where has_chargeback == true',
              source: 'TAP Postback',
              state: 'Reconciliado',
            }))}
            className="text-left bg-graphite border border-line rounded-xl p-4 flex items-center gap-3 hover:border-stone transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-critical/10 flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-critical" />
            </div>
            <div>
              <div className="text-12 text-stone">Estornos</div>
              <div className="text-20 font-mono font-bold text-critical tabular-nums">{chargebacks.length}</div>
            </div>
          </button>
          <button
            type="button"
            onClick={() => openEvidence(buildEvidence({
              label: 'Duplicatas',
              value: String(duplicates.length),
              formula: 'count(persons) where status == "Synthetic"',
              source: 'Deduplication engine',
              state: 'Provisório',
            }))}
            className="text-left bg-graphite border border-line rounded-xl p-4 flex items-center gap-3 hover:border-stone transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-warning" />
            </div>
            <div>
              <div className="text-12 text-stone">Duplicatas</div>
              <div className="text-20 font-mono font-bold text-warning tabular-nums">{duplicates.length}</div>
            </div>
          </button>
        </div>

        {/* Chart */}
        <div className="bg-[var(--graphite)] border border-[var(--line)] rounded-xl p-6">
          <h2 className="text-16 font-medium text-[var(--eggshell)] mb-4">Operacional vs Contábil — 30 dias</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData}>
              <XAxis dataKey="date" tick={{ fill: 'var(--stone)', fontSize: 11 }} tickLine={false} axisLine={false} interval={4} />
              <YAxis tick={{ fill: 'var(--stone)', fontSize: 11 }} tickLine={false} axisLine={false} width={50} />
              <Tooltip {...tooltipStyle} />
              <Legend wrapperStyle={{ color: 'var(--stone)', fontSize: 12 }} />
              <Line type="monotone" dataKey="depositos" name="Depósitos (R$)" stroke="var(--proof-blue)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="ftds" name="FTDs" stroke="var(--verified)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Tabs */}
        <div className="border-b border-[var(--line)] flex gap-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-14 font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'text-[var(--eggshell)] border-[var(--proof-blue)]'
                  : 'text-[var(--stone)] border-transparent hover:text-[var(--eggshell)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab: Divergências */}
        {activeTab === 'divergencias' && (
          <div className="bg-[var(--graphite)] border border-[var(--line)] rounded-xl overflow-hidden">
            {divergentRows.length === 0 ? (
              <div className="p-12 text-center text-[var(--stone)] text-14">Nenhuma divergência encontrada.</div>
            ) : (
              <table className="w-full text-14">
                <thead>
                  <tr className="border-b border-[var(--line)]">
                    {['ID', 'Nome', 'Tipo', 'Valor', 'Data evento', 'Ação'].map(h => (
                      <th key={h} className="text-left text-11 font-semibold text-[var(--stone)] uppercase px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {divergentRows.map(row => {
                    const dep = row.deposits[0];
                    return (
                      <tr key={row.id} className="border-b border-[var(--line)] hover:bg-[var(--iron)] transition-colors">
                        <td className="px-4 py-3">
                          <a
                            href={`/identity/${row.id}`}
                            className="font-mono text-12 text-[var(--proof-blue)] hover:underline"
                            onClick={e => { e.preventDefault(); navigate(`/identity/${row.id}`); }}
                          >
                            {row.id}
                          </a>
                        </td>
                        <td className="px-4 py-3 text-[var(--eggshell)]">{row.name}</td>
                        <td className="px-4 py-3">
                          <StatusChip status={tipoStatus(row.tipo) as any} />
                          <span className="ml-2 text-12 text-[var(--stone)]">{tipoLabel(row.tipo)}</span>
                        </td>
                        <td className="px-4 py-3 font-mono text-13 text-[var(--eggshell)]">
                          {dep ? fmt(dep.amount) : '—'}
                        </td>
                        <td className="px-4 py-3 text-[var(--stone)] text-13">
                          {dep ? fmtDate(dep.at) : '—'}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => navigate(`/identity/${row.id}`)}
                            className="px-3 py-1.5 bg-[var(--zinc)] border border-[var(--line)] rounded-md text-12 text-[var(--eggshell)] hover:bg-[var(--iron)] transition-colors"
                          >
                            Analisar
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Tab: Períodos */}
        {activeTab === 'periodos' && (
          <div className="space-y-3">
            {periodRows.map(row => (
              <div key={row.key} className="bg-[var(--graphite)] border border-[var(--line)] rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                  <div>
                    <div className="text-15 font-semibold text-[var(--eggshell)]">{row.label}</div>
                    <div className="text-12 text-[var(--stone)] mt-0.5">{row.eventos} eventos</div>
                  </div>
                  <div>
                    <div className="text-12 text-[var(--stone)]">Receita Bruta</div>
                    <div className="font-mono text-14 text-[var(--eggshell)]">{fmt(row.receita)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusChip status={(row.status === 'open' ? 'Pending' : 'Reconciled') as any} />
                  {row.status === 'open' && (
                    <button
                      onClick={() => setClosePeriodOpen(true)}
                      className="px-3 py-1.5 bg-[var(--critical)] text-[var(--ink)] rounded-md text-13 font-medium hover:opacity-90 transition-opacity"
                    >
                      Fechar período
                    </button>
                  )}
                </div>
              </div>
            ))}
            <ConfirmDialog
              open={closePeriodOpen}
              onClose={() => setClosePeriodOpen(false)}
              onConfirm={handleClosePeriod}
              title="Fechar período julho/2026?"
              description="Esta ação é irreversível. O período será bloqueado para edições."
              confirmLabel="Fechar período"
              danger
              requireReason
            />
          </div>
        )}

        {/* Tab: Relatório */}
        {activeTab === 'relatorio' && (
          <div className="space-y-4">
            <div className="bg-[var(--graphite)] border border-[var(--line)] rounded-xl overflow-hidden">
              <table className="w-full text-14">
                <thead>
                  <tr className="border-b border-[var(--line)]">
                    {['Métrica', 'Valor (30 dias)'].map(h => (
                      <th key={h} className="text-left text-11 font-semibold text-[var(--stone)] uppercase px-5 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: 'Depósitos Brutos', value: fmt(m.gross_deposits) },
                    { label: 'Saques', value: fmt(m.withdrawals) },
                    { label: 'Depósitos Líquidos', value: fmt(m.net_deposits) },
                    { label: 'Pagamentos (Payouts)', value: fmt(m.payouts) },
                    { label: 'Margem Bruta', value: fmt(m.gross_margin) },
                    { label: 'FTDs', value: String(m.ftds) },
                    { label: 'Divergentes', value: String(m.divergent_count) },
                    { label: 'Órfãos', value: String(m.orphan_count) },
                  ].map((row, i) => (
                    <tr key={row.label} className={`border-b border-[var(--line)] ${i % 2 === 1 ? 'bg-[var(--iron)]/30' : ''}`}>
                      <td className="px-5 py-3 text-[var(--stone)]">{row.label}</td>
                      <td className="px-5 py-3 font-mono text-[var(--eggshell)]">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-13 text-[var(--stone)]">
              Para relatório completo de P&L, acesse{' '}
              <a href="/reports" className="text-[var(--proof-blue)] hover:underline">Relatórios</a>.
            </div>
          </div>
        )}
        </ScenarioStateGate>
      </div>
    </AppShell>
  );
}
