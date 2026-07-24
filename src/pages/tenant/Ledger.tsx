import React, { useState, useMemo } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PreviewBadge } from '@/components/data/PreviewBadge';
import { StatusChip } from '@/components/domain/StatusChip';
import { DataTable, type ColumnDef } from '@/components/data/DataTable';
import { EvidenceDrawer } from '@/components/data/EvidenceDrawer';
import { MetricValue } from '@/components/data/MetricValue';
import { ScenarioStateGate, StateShowcase } from '@/components/state/ScenarioStateGate';
import { db, type SignalEvent, type EventStatus } from '@/lib/fake/db';
import { buildEvidence, type EvidencePayload } from '@/lib/evidence';
import { useIsMobile } from '@/hooks/use-mobile';
import { ChevronRight } from 'lucide-react';
import { Link } from 'wouter';

const LEDGER_TYPES = new Set(['register', 'ftd', 'deposit', 'withdrawal']);

export default function LedgerPage() {
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [evidence, setEvidence] = useState<EvidencePayload | null>(null);
  // E1 — modo "Ao vivo" (tail em tempo real). /live redireciona para /ledger?live=1.
  const [live, setLive] = useState<boolean>(() =>
    typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('live') === '1',
  );
  const isMobile = useIsMobile();

  const statusCounts = useMemo(() => {
    const acc: Record<string, number> = {};
    for (const p of db.persons) acc[p.status] = (acc[p.status] ?? 0) + 1;
    return acc;
  }, []);

  const statusLabels: { label: EventStatus; tone: string }[] = [
    { label: 'Captured', tone: 'text-proof-blue border-proof-blue/30 bg-proof-blue/10' },
    { label: 'Linked', tone: 'text-proof-blue border-proof-blue/30 bg-proof-blue/10' },
    { label: 'Confirmed', tone: 'text-eggshell border-line bg-zinc' },
    { label: 'Reconciled', tone: 'text-verified border-verified/30 bg-verified/10' },
    { label: 'Divergent', tone: 'text-warning border-warning/30 bg-warning/10' },
  ];

  const ledgerTypes = ['all', 'register', 'ftd', 'deposit', 'withdrawal'];
  const statusOptions: (EventStatus | 'all')[] = ['all', 'Captured', 'Linked', 'Confirmed', 'Reconciled', 'Divergent', 'Failed', 'Orphan'];

  const filteredEvts = db.events
    .filter(
      (e) =>
        LEDGER_TYPES.has(e.type) &&
        (typeFilter === 'all' || e.type === typeFilter) &&
        (statusFilter === 'all' || e.status === statusFilter),
    )
    .slice(0, 200);

  const openEvidenceFor = (evt: SignalEvent) =>
    setEvidence(
      buildEvidence({
        label: `${evt.type.toUpperCase()} · ${evt.id}`,
        value: evt.value != null ? `R$ ${evt.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '—',
        formula:
          evt.type === 'ftd'
            ? 'first(deposit) per person where confirmed = true'
            : 'sum(events.value) where person_id = ? and type = ?',
        source: evt.type === 'capi' ? 'Meta CAPI (sombra)' : 'TAP Postback (operacional)',
        state: evt.status === 'Reconciled' ? 'Reconciliado' : evt.status === 'Divergent' ? 'Divergente' : 'Provisório',
        freshness: `latência ${evt.latency_ms}ms`,
        formingEvents: [
          { id: evt.id, type: evt.type, timestamp: evt.timestamp, value: evt.value ?? undefined },
        ],
      }),
    );

  const typeBadgeClass = (type: string) => {
    switch (type) {
      case 'ftd':
        return 'bg-verified/10 text-verified border border-verified/20';
      case 'deposit':
        return 'bg-proof-blue/10 text-proof-blue border border-proof-blue/20';
      case 'register':
        return 'bg-stone/10 text-stone border border-stone/20';
      case 'withdrawal':
        return 'bg-critical/10 text-critical border border-critical/20';
      default:
        return 'bg-zinc text-stone border border-line';
    }
  };

  const columns: ColumnDef<SignalEvent>[] = isMobile
    ? [
        {
          header: 'Evento',
          accessorKey: 'id',
          cell: (e) => (
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-11 font-medium ${typeBadgeClass(e.type)}`}>{e.type}</span>
                <StatusChip status={e.status} />
              </div>
              <button onClick={() => openEvidenceFor(e)} className="text-left">
                <MetricValue
                  value={e.value != null ? `R$ ${e.value.toLocaleString('pt-BR')}` : '—'}
                  size="sm"
                  tone={e.status === 'Reconciled' ? 'verified' : 'default'}
                />
              </button>
              <span className="font-mono text-11 text-stone tabular-nums">{e.id}</span>
              <span className="font-mono text-11 text-stone tabular-nums">
                {e.timestamp.slice(0, 19).replace('T', ' ')} · {e.latency_ms}ms
              </span>
            </div>
          ),
        },
      ]
    : [
        {
          header: 'ID',
          accessorKey: 'id',
          cell: (e) => <span className="font-mono text-11 text-stone tabular-nums">{e.id}</span>,
        },
        {
          header: 'Tipo',
          accessorKey: 'type',
          cell: (e) => <span className={`px-2 py-0.5 rounded text-11 font-medium ${typeBadgeClass(e.type)}`}>{e.type}</span>,
        },
        {
          header: 'Pessoa',
          accessorKey: 'person_id',
          cell: (e) => (
            <Link href={`/players/${e.person_id}`} className="font-mono text-12 text-proof-blue hover:underline tabular-nums">
              {e.person_id}
            </Link>
          ),
        },
        { header: 'Status', accessorKey: 'status', cell: (e) => <StatusChip status={e.status} /> },
        {
          header: 'Valor',
          accessorKey: 'value',
          cell: (e) => (
            <button onClick={() => openEvidenceFor(e)} className="text-right w-full block">
              <MetricValue
                value={e.value != null ? `R$ ${e.value.toLocaleString('pt-BR')}` : '—'}
                size="sm"
                tone={e.status === 'Reconciled' ? 'verified' : e.status === 'Divergent' ? 'warning' : 'default'}
              />
            </button>
          ),
          className: 'text-right',
        },
        {
          header: 'Latência',
          accessorKey: 'latency_ms',
          cell: (e) => (
            <span className={`font-mono text-12 tabular-nums ${e.latency_ms > 500 ? 'text-warning' : 'text-stone'}`}>
              {e.latency_ms}ms
            </span>
          ),
          className: 'text-right',
        },
        {
          header: 'Timestamp',
          accessorKey: 'timestamp',
          cell: (e) => (
            <span className="font-mono text-12 text-stone tabular-nums">{e.timestamp.slice(0, 19).replace('T', ' ')}</span>
          ),
        },
      ];

  return (
    <AppShell breadcrumb={[{ label: 'Signal Ledger' }]}>
      <div className="max-w-7xl mx-auto space-y-6">
        <header>
          <div className="text-11 font-mono uppercase tracking-[0.18em] text-stone mb-2">Observe · Ledger</div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-24 font-bold text-eggshell">Signal Ledger</h1>
            <PreviewBadge />
            <StateShowcase />
            <button
              type="button"
              onClick={() => setLive((v) => !v)}
              className={`ml-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-11 font-mono uppercase tracking-wider transition-colors ${
                live
                  ? 'border-verified/40 bg-verified/10 text-verified'
                  : 'border-line bg-graphite text-stone hover:text-eggshell'
              }`}
              title="Modo ao vivo — tail em tempo real"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${live ? 'bg-verified animate-pulse' : 'bg-stone/50'}`} />
              {live ? 'Ao vivo' : 'Pausado'}
            </button>
          </div>
          <p className="text-14 text-stone mt-2">
            Registro cronológico e auditável de cadastros, FTDs, depósitos e saques — clique em qualquer valor para abrir a evidência.
          </p>
        </header>

        <ScenarioStateGate
          emptyTitle="Nenhum evento no recorte"
          emptyDescription="Ajuste os filtros ou amplie o período para ver registros."
          degradedIntegration="TAP Postback"
        >
          {/* JourneyStrip */}
          <div className="bg-graphite border border-line rounded-xl p-4 flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-0 w-full overflow-x-auto">
            {statusLabels.map((stage, idx) => (
              <React.Fragment key={stage.label}>
                <div className="flex flex-col flex-1 min-w-[120px] px-2 first:pl-0 last:pr-0">
                  <div className="text-11 font-mono text-stone uppercase mb-1">{stage.label}</div>
                  <div className={`px-3 py-2 rounded-lg border flex items-baseline justify-between ${stage.tone}`}>
                    <MetricValue
                      value={statusCounts[stage.label] ?? 0}
                      size="md"
                      tone={
                        stage.label === 'Reconciled'
                          ? 'verified'
                          : stage.label === 'Divergent'
                            ? 'warning'
                            : stage.label === 'Captured' || stage.label === 'Linked'
                              ? 'proof'
                              : 'default'
                      }
                      onOpenEvidence={() =>
                        setEvidence(
                          buildEvidence({
                            label: `Etapa ${stage.label}`,
                            value: `${statusCounts[stage.label] ?? 0} pessoas`,
                            formula: `count(persons) where status = "${stage.label}"`,
                            source: 'ledger canônico (seed determinística)',
                            state: 'Reconciliado',
                          }),
                        )
                      }
                    />
                  </div>
                </div>
                {idx < statusLabels.length - 1 && (
                  <div className="hidden md:flex items-center justify-center px-1 text-line">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Filter bar — no mobile, aparece ANTES da tabela (prioridade de operador) */}
          <div className="flex flex-wrap items-center gap-3 bg-graphite border border-line rounded-xl p-3">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-zinc border border-line text-eggshell rounded-md px-3 py-1.5 text-13 outline-none focus:border-proof-blue"
            >
              {ledgerTypes.map((t) => (
                <option key={t} value={t}>
                  {t === 'all' ? 'Todos os tipos' : t}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-zinc border border-line text-eggshell rounded-md px-3 py-1.5 text-13 outline-none focus:border-proof-blue"
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s === 'all' ? 'Todos os status' : s}
                </option>
              ))}
            </select>
            <span className="text-12 text-stone font-mono ml-auto tabular-nums">
              {filteredEvts.length} eventos
            </span>
          </div>

          {/* DataTable padrão */}
          <DataTable
            data={filteredEvts}
            columns={columns}
            searchPlaceholder="Buscar por ID ou pessoa..."
            onRowClick={(e) => openEvidenceFor(e)}
          />
        </ScenarioStateGate>
      </div>

      <EvidenceDrawer isOpen={!!evidence} onClose={() => setEvidence(null)} data={evidence} />
    </AppShell>
  );
}
