import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PreviewBadge } from '@/components/data/PreviewBadge';
import { MetricCard } from '@/components/data/MetricCard';
import { DataTable } from '@/components/data/DataTable';
import { ScenarioStateGate, StateShowcase } from '@/components/state/ScenarioStateGate';
import { buildEvidence } from '@/lib/evidence';
import { db } from '@/lib/fake/db';
import { Link } from 'wouter';
import { PlayCircle, Clock, FileText } from 'lucide-react';

const TYPE_LABEL: Record<string, string> = {
  pl: 'P&L',
  cohort: 'Coorte',
  reconciliation: 'Reconciliação',
  operational: 'Operacional',
  custom: 'Personalizado',
};

const TYPE_STYLE: Record<string, string> = {
  pl: 'bg-proof-blue/10 text-proof-blue',
  cohort: 'bg-verified/10 text-verified',
  reconciliation: 'bg-warning/10 text-warning',
  operational: 'bg-stone/10 text-stone',
  custom: 'bg-zinc text-stone',
};

export default function ReportsPage() {
  const [tab, setTab] = React.useState<'library' | 'scheduled' | 'snapshots'>('library');
  const reports = db.reports;
  const scheduled = reports.filter(r => r.scheduled);

  const snapshots = reports.map((r, i) => ({
    id: `${r.id}_v${i + 1}`,
    report: r.name,
    version: `v${i + 1}`,
    at: r.last_run_at,
    author: r.created_by,
    frozen: true,
  }));

  const columns = [
    { header: 'Relatório', accessorKey: 'name', cell: (r: any) => (
      <div className="flex items-center gap-2">
        <FileText className="w-4 h-4 text-stone" />
        <div>
          <Link href={`/reports/${r.id}`} className="font-medium text-14 text-eggshell hover:text-proof-blue">{r.name}</Link>
          <div className="text-11 font-mono text-stone tabular-nums">{r.id} · {r.period}</div>
        </div>
      </div>
    )},
    { header: 'Tipo', accessorKey: 'type', cell: (r: any) => (
      <span className={`px-2 py-0.5 rounded text-11 uppercase font-bold ${TYPE_STYLE[r.type] ?? TYPE_STYLE.custom}`}>{TYPE_LABEL[r.type] ?? r.type}</span>
    )},
    { header: 'Agendamento', accessorKey: 'schedule_cron', cell: (r: any) => (
      <div className="flex items-center gap-1.5 text-13 text-stone">
        <Clock className="w-3.5 h-3.5" />
        {r.scheduled ? (r.schedule_cron ?? 'Agendado') : 'Manual'}
      </div>
    )},
    { header: 'Destinatários', accessorKey: 'recipients', className: 'text-right', cell: (r: any) => (
      <span className="font-mono text-12 text-stone tabular-nums">{r.recipients.length}</span>
    )},
    { header: 'Ações', accessorKey: 'actions', cell: (r: any) => (
      <div className="flex gap-2">
        <Link href={`/reports/${r.id}`} className="text-proof-blue hover:text-eggshell transition-colors flex items-center gap-1 text-13">
          <PlayCircle className="w-4 h-4" /> Abrir
        </Link>
      </div>
    )}
  ];

  const snapshotColumns = [
    { header: 'Snapshot', accessorKey: 'id', cell: (s: any) => <span className="font-mono text-12 text-proof-blue tabular-nums">{s.id}</span> },
    { header: 'Relatório', accessorKey: 'report', cell: (s: any) => <span className="text-13 text-eggshell">{s.report}</span> },
    { header: 'Versão', accessorKey: 'version', cell: (s: any) => <span className="font-mono text-12 text-stone tabular-nums">{s.version}</span> },
    { header: 'Fechado em', accessorKey: 'at', cell: (s: any) => <span className="font-mono text-12 text-stone tabular-nums">{new Date(s.at).toLocaleString('pt-BR')}</span> },
    { header: 'Autor', accessorKey: 'author', cell: (s: any) => <span className="text-13 text-stone">{s.author}</span> },
    { header: 'Estado', accessorKey: 'frozen', cell: () => <span className="px-2 py-0.5 rounded text-11 uppercase font-bold bg-verified/10 text-verified">Congelado</span> },
  ];

  return (
    <AppShell breadcrumb={[{ label: 'Prove' }, { label: 'Relatórios' }]}>
      <div className="max-w-7xl mx-auto space-y-6">

        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <div className="kicker mb-1">Prove / Reports</div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-24 font-bold text-eggshell">Biblioteca de relatórios</h1>
              <PreviewBadge />
              <StateShowcase />
            </div>
            <p className="text-13 text-stone mt-1">Operacional, P&amp;L, coortes e reconciliação. Reabrir gera nova versão — nunca sobrescreve.</p>
          </div>
          <button className="bg-eggshell text-ink px-4 py-2 rounded-md font-medium text-14 hover:bg-white transition-colors">Criar Relatório</button>
        </header>

        <ScenarioStateGate emptyTitle="Sem relatórios cadastrados" emptyDescription="Crie o primeiro relatório para começar a bibliotecar snapshots." emptyPrerequisite="Você precisa de perfil Editor ou superior.">

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <MetricCard label="Relatórios" value={reports.length} evidenceData={buildEvidence({ label: 'Relatórios ativos', value: reports.length, formula: 'count(reports)', source: 'Reports catalog', state: 'Reconciliado' })} />
            <MetricCard label="Agendados" value={scheduled.length} evidenceData={buildEvidence({ label: 'Relatórios agendados', value: scheduled.length, formula: 'count(reports) where scheduled = true', source: 'Reports catalog', state: 'Reconciliado' })} />
            <MetricCard label="Snapshots congelados" value={snapshots.length} evidenceData={buildEvidence({ label: 'Snapshots imutáveis', value: snapshots.length, formula: 'count(snapshots) where frozen = true', source: 'Snapshot store', state: 'Reconciliado' })} />
          </div>

          <div className="bg-graphite border border-line rounded-xl overflow-hidden mt-6">
            <div className="flex border-b border-line">
              {([
                { key: 'library', label: 'Biblioteca' },
                { key: 'scheduled', label: `Agendados (${scheduled.length})` },
                { key: 'snapshots', label: `Snapshots (${snapshots.length})` },
              ] as const).map(t => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`px-5 py-3 text-13 font-medium transition-colors ${tab === t.key ? 'text-eggshell border-b-2 border-proof-blue -mb-px' : 'text-stone hover:text-eggshell'}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="p-4">
              {tab === 'library' && <DataTable data={reports} columns={columns} />}
              {tab === 'scheduled' && <DataTable data={scheduled} columns={columns} />}
              {tab === 'snapshots' && <DataTable data={snapshots} columns={snapshotColumns} />}
            </div>
          </div>
        </ScenarioStateGate>

      </div>
    </AppShell>
  );
}
