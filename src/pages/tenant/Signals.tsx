import React, { useMemo, useState } from 'react';
import { Link } from 'wouter';
import { AppShell, useEvidence } from '@/components/layout/AppShell';
import { PreviewBadge } from '@/components/data/PreviewBadge';
import { FreshnessTag } from '@/components/data/FreshnessTag';
import { MetricValue } from '@/components/data/MetricValue';
import { StatusChip } from '@/components/domain/StatusChip';
import { DataTable, ColumnDef } from '@/components/data/DataTable';
import { ScenarioStateGate, StateShowcase } from '@/components/state/ScenarioStateGate';
import { buildEvidence } from '@/lib/evidence';
import { db, SignalEvent } from '@/lib/fake/db';
import { useIsMobile } from '@/hooks/use-mobile';

/**
 * Signals — visão de saúde do stream (CAPI / postback / webhook).
 * Piso: 8 estados via ScenarioStateGate, Evidence Drawer em todo número,
 * StatusChip enum fechado, DataTable, mono tabular, mobile reordenado.
 */
export default function SignalsPage() {
  const { openEvidence } = useEvidence();
  const isMobile = useIsMobile();
  const [typeFilter, setTypeFilter] = useState<'all' | string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | string>('all');

  const eventTypes = ['all', 'click', 'register', 'ftd', 'deposit', 'withdrawal', 'postback', 'capi', 'webhook', 'bot_message', 'conversation_start'];
  const statusOptions = ['all', 'Captured', 'Linked', 'Confirmed', 'Reconciled', 'Divergent', 'Failed', 'Orphan', 'Synthetic'];

  const filtered = useMemo(() => db.events.filter((e) => (
    (typeFilter === 'all' || e.type === typeFilter) &&
    (statusFilter === 'all' || e.status === statusFilter)
  )).slice(0, 200), [typeFilter, statusFilter]);

  // ── KPIs (todos abrem Evidence Drawer) ──────────────────────────────────
  const total = db.events.length;
  const failed = db.events.filter((e) => e.status === 'Failed').length;
  const divergent = db.events.filter((e) => e.status === 'Divergent').length;
  const p95 = (() => {
    const sorted = [...db.events.map((e) => e.latency_ms)].sort((a, b) => a - b);
    return sorted[Math.floor(sorted.length * 0.95)] ?? 0;
  })();
  const successRate = total > 0 ? ((total - failed) / total) * 100 : 100;
  const lastAgo = db.events[0]
    ? Math.max(1, Math.round((Date.now() - new Date(db.events[0].timestamp).getTime()) / 1000))
    : 0;

  const columns: ColumnDef<SignalEvent>[] = [
    {
      header: 'ID / Timestamp',
      accessorKey: 'id',
      cell: (e) => (
        <div className="flex flex-col">
          <Link href={`/ledger/${e.id}`} className="font-mono text-11 text-proof-blue hover:underline">{e.id}</Link>
          <span className="font-mono text-11 text-stone tabular-nums">{e.timestamp.slice(0, 19).replace('T', ' ')}</span>
        </div>
      ),
    },
    {
      header: 'Tipo',
      accessorKey: 'type',
      cell: (e) => <span className="font-mono text-11 text-eggshell">{e.type}</span>,
    },
    {
      header: 'Pessoa',
      accessorKey: 'person_id',
      cell: (e) => (
        <Link href={`/identity/${e.person_id}`} className="font-mono text-11 text-proof-blue hover:underline">{e.person_id}</Link>
      ),
      className: isMobile ? 'hidden' : '',
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (e) => <StatusChip status={e.status} />,
    },
    {
      header: 'Valor',
      accessorKey: 'value',
      cell: (e) => (
        <MetricValue
          value={e.value != null ? `R$ ${e.value.toLocaleString('pt-BR')}` : '—'}
          size="sm"
          onOpenEvidence={() => openEvidence(buildEvidence({
            label: `Evento ${e.id}`,
            value: e.value != null ? `R$ ${e.value.toLocaleString('pt-BR')}` : '—',
            formula: 'events[id].value',
            source: `Adapter ${e.type} (v3.2.1)`,
            state: e.status === 'Divergent' ? 'Divergente' : e.status === 'Reconciled' ? 'Reconciliado' : 'Provisório',
            freshness: `latência ${e.latency_ms}ms`,
          }))}
        />
      ),
      className: 'text-right',
    },
    {
      header: 'Latência',
      accessorKey: 'latency_ms',
      cell: (e) => <span className="font-mono text-11 text-stone tabular-nums">{e.latency_ms}ms</span>,
      className: 'text-right',
    },
  ];

  return (
    <AppShell breadcrumb={[{ label: 'Observe', href: '/live' }, { label: 'Saúde do sinal' }]}>
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span className="text-14 font-serif italic text-stone leading-none">Observe · Saúde do sinal</span>
              <PreviewBadge />
              <FreshnessTag ageSeconds={lastAgo} source="stream ao vivo" />
              <StateShowcase />
            </div>
            <h1 className="text-eggshell font-sans font-semibold tracking-tight text-24">
              Onde cada sinal está parando.
            </h1>
            <p className="text-stone text-13 mt-2 max-w-xl">
              Fluxo imutável de eventos e projeções. Cada valor abre a fórmula, a fonte e o evento formador.
            </p>
          </div>
        </header>

        <ScenarioStateGate
          emptyTitle="Sem eventos no período"
          emptyDescription="Nenhum sinal chegou nas últimas horas."
          degradedIntegration="Signal Ingest"
        >
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <KpiTile
              label="Eventos"
              value={total.toLocaleString('pt-BR')}
              onClick={() => openEvidence(buildEvidence({
                label: 'Eventos totais',
                value: total.toLocaleString('pt-BR'),
                formula: 'count(events)',
                source: 'Signal Ingest (multi-adapter)',
              }))}
            />
            <KpiTile
              label="Sucesso"
              value={`${successRate.toFixed(1)}%`}
              tone="verified"
              onClick={() => openEvidence(buildEvidence({
                label: 'Taxa de sucesso',
                value: `${successRate.toFixed(1)}%`,
                formula: '(total − failed) / total',
                source: 'Signal Ingest',
              }))}
            />
            <KpiTile
              label="Divergentes"
              value={divergent.toLocaleString('pt-BR')}
              tone="warning"
              onClick={() => openEvidence(buildEvidence({
                label: 'Divergentes',
                value: divergent.toString(),
                formula: 'count(events) where status == "Divergent"',
                source: 'Reconciliation engine',
                state: 'Divergente',
              }))}
            />
            <KpiTile
              label="P95 latência"
              value={`${p95}ms`}
              tone={p95 > 800 ? 'critical' : 'default'}
              onClick={() => openEvidence(buildEvidence({
                label: 'Latência P95',
                value: `${p95}ms`,
                formula: 'percentile(events.latency_ms, 0.95)',
                source: 'Signal Ingest (adapter v3.2.1)',
              }))}
            />
          </div>

          {/* Filtros mobile-first */}
          <div className="flex flex-wrap items-center gap-3 bg-graphite border border-line rounded-xl p-3">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-zinc border border-line text-eggshell rounded-md px-3 py-1.5 text-13 outline-none focus:border-proof-blue"
            >
              {eventTypes.map((t) => <option key={t} value={t}>{t === 'all' ? 'Todos os tipos' : t}</option>)}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-zinc border border-line text-eggshell rounded-md px-3 py-1.5 text-13 outline-none focus:border-proof-blue"
            >
              {statusOptions.map((s) => <option key={s} value={s}>{s === 'all' ? 'Todos os status' : s}</option>)}
            </select>
            <span className="text-12 text-stone font-mono ml-auto tabular-nums">{filtered.length} eventos</span>
          </div>

          <DataTable data={filtered} columns={columns} />
        </ScenarioStateGate>
      </div>
    </AppShell>
  );
}

function KpiTile({ label, value, tone = 'default', onClick }: {
  label: string; value: string; tone?: 'default' | 'verified' | 'warning' | 'critical'; onClick?: () => void;
}) {
  const cls =
    tone === 'verified' ? 'text-verified'
    : tone === 'warning' ? 'text-warning'
    : tone === 'critical' ? 'text-critical'
    : 'text-eggshell';
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left rounded-xl border border-line bg-graphite hover:border-stone transition-colors p-4"
    >
      <div className="text-11 font-mono uppercase tracking-wider text-stone mb-2">{label}</div>
      <div className={`font-mono tabular-nums text-24 leading-none font-semibold ${cls}`}>{value}</div>
    </button>
  );
}
