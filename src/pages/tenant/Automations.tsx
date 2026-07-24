import React from 'react';
import { useLocation } from 'wouter';
import { AppShell, useEvidence } from '@/components/layout/AppShell';
import { PreviewBadge } from '@/components/data/PreviewBadge';
import { MetricValue } from '@/components/data/MetricValue';
import { DataTable, ColumnDef } from '@/components/data/DataTable';
import { ScenarioStateGate, StateShowcase } from '@/components/state/ScenarioStateGate';
import { buildEvidence } from '@/lib/evidence';
import { FLOWS } from '@/lib/fake/db';
import { toast } from 'sonner';
import { GitBranch, RotateCcw, Eye } from 'lucide-react';

const fmt = {
  int: (n: number) => n.toLocaleString('pt-BR'),
  cur: (n: number) => 'R$ ' + n.toLocaleString('pt-BR', { maximumFractionDigits: 0 }),
};

type Row = (typeof FLOWS)[number] & { version: string; prevVersion: string; shadow: boolean };

const rows: Row[] = FLOWS.map((f, i) => ({
  ...f,
  version: `v${3 - (i % 2)}`,
  prevVersion: `v${2 - (i % 2)}`,
  shadow: i === 1,
}));

const statusStyle: Record<string, string> = {
  active: 'bg-verified/10 text-verified border-verified/20',
  draft: 'bg-stone/10 text-stone border-stone/20',
  paused: 'bg-warning/10 text-warning border-warning/20',
  archived: 'bg-zinc text-stone border-line',
};
const statusLabel: Record<string, string> = {
  active: 'Publicado', draft: 'Rascunho', paused: 'Pausado', archived: 'Arquivado',
};

export default function AutomationsPage() {
  const [, setLocation] = useLocation();
  const { openEvidence } = useEvidence();

  const activeFlows = rows.filter(r => r.status === 'active').length;
  const totalEntries = rows.reduce((s, r) => s + r.persons_total, 0);
  const totalFtds = rows.reduce((s, r) => s + r.ftds_generated, 0);
  const totalRevenue = rows.reduce((s, r) => s + r.revenue, 0);

  const columns: ColumnDef<Row>[] = [
    {
      header: 'Fluxo',
      accessorKey: 'name',
      cell: (f) => (
        <div className="flex flex-col">
          <span className="text-14 font-semibold text-eggshell">{f.name}</span>
          <span className="font-mono text-11 text-stone tabular-nums">{f.id} · {f.channel}</span>
        </div>
      ),
    },
    {
      header: 'Estado',
      accessorKey: 'status',
      cell: (f) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-[6px] border text-11 font-medium ${statusStyle[f.status] ?? statusStyle.draft}`}>
          {statusLabel[f.status] ?? f.status}
        </span>
      ),
    },
    {
      header: 'Versão',
      accessorKey: 'version',
      cell: (f) => (
        <div className="flex items-center gap-2">
          <span className="font-mono text-12 text-eggshell tabular-nums">{f.version}</span>
          <button
            onClick={(e) => { e.stopPropagation(); toast(`Rollback para ${f.prevVersion} — plano imutável enviado a Aprovações.`); }}
            className="inline-flex items-center gap-1 text-11 text-stone hover:text-eggshell font-mono"
            title={`Rollback para ${f.prevVersion}`}
          >
            <RotateCcw className="w-3 h-3" /> {f.prevVersion}
          </button>
          {f.shadow && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[4px] border border-proof-blue/25 bg-proof-blue/5 text-10 font-mono uppercase tracking-wider text-proof-blue">
              <Eye className="w-3 h-3" /> shadow
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'Entradas',
      accessorKey: 'persons_total',
      className: 'text-right',
      cell: (f) => (
        <button
          onClick={(e) => { e.stopPropagation(); openEvidence(buildEvidence({
            label: `Entradas · ${f.name}`,
            value: fmt.int(f.persons_total),
            formula: 'count(person_enter_flow) where flow_id = ' + f.id,
            source: 'FLOWS · engine de automação',
            freshness: 'atualizado há 2m',
          })); }}
          className="font-mono text-13 text-eggshell tabular-nums hover:text-proof-blue"
        >
          {fmt.int(f.persons_total)}
        </button>
      ),
    },
    {
      header: 'FTD gerado',
      accessorKey: 'ftds_generated',
      className: 'text-right',
      cell: (f) => (
        <button
          onClick={(e) => { e.stopPropagation(); openEvidence(buildEvidence({
            label: `FTDs · ${f.name}`,
            value: fmt.int(f.ftds_generated),
            formula: 'count(ftd) attributed to flow = ' + f.id,
            source: 'Signal Ledger · confirmados',
            state: 'Reconciliado',
          })); }}
          className="font-mono text-13 text-verified tabular-nums font-bold hover:underline"
        >
          {fmt.int(f.ftds_generated)}
        </button>
      ),
    },
    {
      header: 'Receita',
      accessorKey: 'revenue',
      className: 'text-right',
      cell: (f) => (
        <button
          onClick={(e) => { e.stopPropagation(); openEvidence(buildEvidence({
            label: `Receita · ${f.name}`,
            value: fmt.cur(f.revenue),
            formula: 'sum(net_deposit) where flow_id = ' + f.id,
            source: 'Revenue provider · TAP',
          })); }}
          className="font-mono text-13 text-eggshell tabular-nums hover:text-proof-blue"
        >
          {fmt.cur(f.revenue)}
        </button>
      ),
    },
  ];

  const kpis = [
    { label: 'Fluxos ativos', value: fmt.int(activeFlows), formula: 'count(flows.status="active")' },
    { label: 'Entradas 30d', value: fmt.int(totalEntries), formula: 'sum(persons_enter)' },
    { label: 'FTDs gerados', value: fmt.int(totalFtds), formula: 'sum(ftds_by_flow)' },
    { label: 'Receita atribuída', value: fmt.cur(totalRevenue), formula: 'sum(net_deposit_by_flow)' },
  ];

  return (
    <AppShell breadcrumb={[{ label: 'Operate' }, { label: 'Automações' }]}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="kicker mb-1">Operate · Automações</div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-24 font-bold text-eggshell">Fluxos & Automações</h1>
              <PreviewBadge />
              <StateShowcase />
            </div>
            <p className="text-13 text-stone mt-1">Cada fluxo é uma versão imutável. Rollback e shadow mode ficam registrados no ledger.</p>
          </div>
          <button
            onClick={() => toast('Criar fluxo: abre editor em Rascunho (v0).')}
            className="bg-eggshell text-ink px-4 py-2 rounded-md font-medium text-14 hover:bg-white transition-colors flex items-center gap-2"
          >
            <GitBranch className="w-4 h-4" /> Novo fluxo
          </button>
        </div>

        <ScenarioStateGate
          emptyTitle="Nenhum fluxo publicado"
          emptyDescription="Crie um fluxo para começar a operar."
          emptyPrerequisite="Configure ao menos um canal de mensageria em Integrações."
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {kpis.map(k => (
              <button
                key={k.label}
                onClick={() => openEvidence(buildEvidence({ label: k.label, value: k.value, formula: k.formula }))}
                className="text-left bg-graphite border border-line rounded-xl p-4 hover:border-stone transition-colors"
              >
                <div className="text-11 uppercase tracking-wider text-stone font-mono">{k.label}</div>
                <div className="mt-2">
                  <MetricValue value={k.value} size="lg" />
                </div>
              </button>
            ))}
          </div>

          <DataTable data={rows} columns={columns} onRowClick={(f) => setLocation(`/automations/${f.id}`)} />
        </ScenarioStateGate>
      </div>
    </AppShell>
  );
}
