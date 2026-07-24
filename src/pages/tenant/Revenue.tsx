import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PreviewBadge } from '@/components/data/PreviewBadge';
import { MetricCard } from '@/components/data/MetricCard';
import { DataTable } from '@/components/data/DataTable';
import { ScenarioStateGate, StateShowcase } from '@/components/state/ScenarioStateGate';
import { buildEvidence } from '@/lib/evidence';
import { db } from '@/lib/fake/db';
import { usePeriod } from '@/lib/context/PeriodContext';
import { Link } from 'wouter';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';

export default function RevenuePage() {
  const { period } = usePeriod();
  const m = db.metricsForPeriod(period);
  const [tab, setTab] = React.useState<'pnl' | 'origem' | 'reconciliation'>('pnl');

  const depositsSeries = db.dailySeries(period, 'deposits');
  const chartData = depositsSeries.map(pt => ({
    date: pt.date.slice(-5).replace('-', '/'),
    deposits: pt.value,
  }));

  const sourceData = db.revenueBySource(period);
  const divergent = db.getDivergent();

  const tooltipStyle = {
    backgroundColor: 'hsl(var(--zinc))',
    border: '1px solid hsl(var(--line))',
    borderRadius: '8px',
    fontSize: 13,
  };

  const evGross = buildEvidence({
    label: 'Receita Bruta',
    value: 'R$ ' + m.gross_deposits.toLocaleString('pt-BR'),
    formula: 'sum(deposits.amount) where in_period AND type != chargeback',
    source: 'TAP Postback',
    state: 'Reconciliado',
  });
  const evDeducoes = buildEvidence({
    label: 'Deduções (saques)',
    value: 'R$ ' + m.withdrawals.toLocaleString('pt-BR'),
    formula: 'sum(withdrawals.amount) where in_period',
    source: 'TAP Postback',
    state: 'Reconciliado',
  });
  const evNet = buildEvidence({
    label: 'Receita Líquida',
    value: 'R$ ' + m.net_deposits.toLocaleString('pt-BR'),
    formula: 'gross_deposits − withdrawals',
    source: 'Ledger derivado',
    state: 'Reconciliado',
  });
  const evPayout = buildEvidence({
    label: 'Comissões',
    value: 'R$ ' + m.payouts.toLocaleString('pt-BR'),
    formula: 'sum(persons.payout) where ftd_at in period',
    source: 'Adapter TAP',
    state: 'Reconciliado',
  });
  const evLucro = buildEvidence({
    label: 'Lucro operacional',
    value: 'R$ ' + m.gross_margin.toLocaleString('pt-BR'),
    formula: 'net_deposits − payouts',
    source: 'Ledger derivado',
    state: 'Reconciliado',
  });
  const evCpftd = buildEvidence({
    label: 'CPFTD',
    value: 'R$ ' + m.cpftd.toLocaleString('pt-BR'),
    formula: 'total_spend ÷ ftds',
    source: 'Meta + TikTok Ads',
    state: 'Reconciliado',
  });

  const sourceColumns = [
    { header: 'Origem', accessorKey: 'source', cell: (r: any) => <span className="text-14 text-eggshell">{r.source}</span> },
    { header: 'Spend', accessorKey: 'spend', className: 'text-right', cell: (r: any) => <span className="font-mono text-13 text-stone tabular-nums">R$ {r.spend.toLocaleString('pt-BR')}</span> },
    { header: 'FTDs', accessorKey: 'ftds', className: 'text-right', cell: (r: any) => <span className="font-mono text-13 text-verified tabular-nums">{r.ftds}</span> },
    { header: 'CPFTD', accessorKey: 'cpftd', className: 'text-right', cell: (r: any) => <span className="font-mono text-13 text-stone tabular-nums">R$ {r.cpftd.toLocaleString('pt-BR')}</span> },
    { header: 'Receita Líq.', accessorKey: 'net', className: 'text-right', cell: (r: any) => <span className="font-mono text-13 text-proof-blue tabular-nums">R$ {r.net.toLocaleString('pt-BR')}</span> },
    { header: 'Margem', accessorKey: 'margin_pct', className: 'text-right', cell: (r: any) => (
      <span className={`font-mono text-13 tabular-nums ${r.margin_pct >= 60 ? 'text-verified' : r.margin_pct >= 30 ? 'text-warning' : 'text-critical'}`}>{r.margin_pct}%</span>
    )},
  ];

  const divColumns = [
    { header: 'Pessoa', accessorKey: 'id', cell: (p: any) => <span className="font-mono text-12 text-proof-blue tabular-nums">{p.id}</span> },
    { header: 'Nome', accessorKey: 'name', cell: (p: any) => <span className="text-13 text-eggshell">{p.name}</span> },
    { header: 'Depósito', accessorKey: 'total_deposited', className: 'text-right', cell: (p: any) => <span className="font-mono text-13 text-eggshell tabular-nums">R$ {p.total_deposited.toLocaleString('pt-BR')}</span> },
    { header: 'Comissão', accessorKey: 'payout', className: 'text-right', cell: (p: any) => <span className="font-mono text-13 text-stone tabular-nums">R$ {p.payout.toLocaleString('pt-BR')}</span> },
    { header: 'Motivo', accessorKey: 'source', cell: () => <span className="text-13 text-warning">Divergência TAP × CAPI</span> },
  ];

  return (
    <AppShell breadcrumb={[{ label: 'Prove' }, { label: 'Receita' }]}>
      <div className="max-w-7xl mx-auto space-y-6">

        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <div className="text-12 font-serif italic text-stone/80 mb-1">Prove / Receita</div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-24 font-bold text-eggshell">P&amp;L operacional</h1>
              <PreviewBadge />
              <StateShowcase />
            </div>
            <p className="text-13 text-stone mt-1">Fecha com o Command · totais reconciliados até ontem 23:59.</p>
          </div>
          <Link href="/revenue/cohorts" className="text-13 text-proof-blue hover:underline">Ver coortes →</Link>
        </header>

        <ScenarioStateGate
          emptyTitle="Sem depósitos no período"
          emptyDescription="Nenhum depósito reconciliado dentro do recorte atual."
          emptyPrerequisite="Confirme se o adapter TAP está publicado e sincronizando."
        >
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <MetricCard label="Receita Bruta" value={'R$ ' + m.gross_deposits.toLocaleString('pt-BR')} evidenceData={evGross} />
            <MetricCard label="Deduções" value={'R$ ' + m.withdrawals.toLocaleString('pt-BR')} evidenceData={evDeducoes} />
            <MetricCard label="Receita Líquida" value={'R$ ' + m.net_deposits.toLocaleString('pt-BR')} evidenceData={evNet} />
            <MetricCard label="Comissões" value={'R$ ' + m.payouts.toLocaleString('pt-BR')} evidenceData={evPayout} />
            <MetricCard label="Lucro" value={'R$ ' + m.gross_margin.toLocaleString('pt-BR')} evidenceData={evLucro} />
            <MetricCard label="CPFTD" value={'R$ ' + m.cpftd.toLocaleString('pt-BR')} evidenceData={evCpftd} />
          </div>

          <div className="bg-graphite border border-line rounded-xl p-4 mt-6">
            <h3 className="text-14 font-semibold text-eggshell mb-4">Depósitos diários — últimos {period}d</h3>
            <ResponsiveContainer width="100%" height={256}>
              <BarChart data={chartData}>
                <XAxis dataKey="date" stroke="hsl(var(--stone))" style={{ fontSize: 11 }} />
                <YAxis stroke="hsl(var(--stone))" style={{ fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="deposits" fill="#7C91FF" radius={[4, 4, 0, 0]} name="Depósitos (R$)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-graphite border border-line rounded-xl overflow-hidden mt-6">
            <div className="flex border-b border-line overflow-x-auto">
              {([
                { key: 'pnl', label: 'P&L por origem' },
                { key: 'origem', label: 'Detalhamento' },
                { key: 'reconciliation', label: `Reconciliação (${divergent.length})` },
              ] as const).map(t => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`px-5 py-3 text-13 font-medium whitespace-nowrap transition-colors ${tab === t.key ? 'text-eggshell border-b-2 border-proof-blue -mb-px' : 'text-stone hover:text-eggshell'}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="p-4 overflow-x-auto">
              {(tab === 'pnl' || tab === 'origem') && <DataTable data={sourceData} columns={sourceColumns} />}
              {tab === 'reconciliation' && (
                divergent.length === 0 ? (
                  <div className="p-8 text-center text-13 text-stone">Sem divergências abertas no período.</div>
                ) : (
                  <DataTable data={divergent as any[]} columns={divColumns} />
                )
              )}
            </div>
          </div>
        </ScenarioStateGate>
      </div>
    </AppShell>
  );
}
