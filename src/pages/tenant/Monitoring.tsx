import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PreviewBadge } from '@/components/data/PreviewBadge';
import { MetricValue } from '@/components/data/MetricValue';
import { DataTable, type ColumnDef } from '@/components/data/DataTable';
import { EvidenceDrawer } from '@/components/data/EvidenceDrawer';
import { ScenarioStateGate, StateShowcase } from '@/components/state/ScenarioStateGate';
import { IntegrationStateBadge } from '@/components/data/IntegrationStateBadge';
import { FreshnessTag } from '@/components/data/FreshnessTag';
import { StatusChip } from '@/components/domain/StatusChip';
import { db } from '@/lib/fake/db';
import { buildEvidence, type EvidencePayload } from '@/lib/evidence';

// Canonical DLQ derived from failed events in the seed dataset.
type DlqRow = {
  id: string;
  integration: string;
  reason: string;
  attempts: number;
  first_seen: string;
  status: 'Failed' | 'Orphan' | 'Policy blocked';
};

export default function MonitoringPage() {
  const [evidence, setEvidence] = useState<EvidencePayload | null>(null);

  const failed = db.events.filter((e) => e.status === 'Failed' || e.status === 'Orphan');
  const dlq: DlqRow[] = failed.slice(0, 12).map((e) => ({
    id: e.id,
    integration: e.type === 'capi' ? 'Meta CAPI' : e.type === 'postback' ? 'TAP Postback' : 'Signal Ingest',
    reason: e.status === 'Orphan' ? 'sem correlação de identidade' : 'timeout no downstream',
    attempts: 3,
    first_seen: e.timestamp.slice(0, 19).replace('T', ' '),
    status: e.status as DlqRow['status'],
  }));

  const total = db.events.length;
  const errorCount = failed.length;
  const availability = Math.round(((total - errorCount) / Math.max(total, 1)) * 10000) / 100;
  const p95 = 48;

  const openEvidence = (payload: EvidencePayload) => setEvidence(payload);

  const dlqColumns: ColumnDef<DlqRow>[] = [
    {
      header: 'ID',
      accessorKey: 'id',
      cell: (r) => <span className="font-mono text-11 text-stone tabular-nums">{r.id}</span>,
    },
    {
      header: 'Integração',
      accessorKey: 'integration',
      cell: (r) => (
        <div className="flex items-center gap-2">
          <span className="text-13 text-eggshell">{r.integration}</span>
          <IntegrationStateBadge state="pilot" adapterVersion="3.2.1" />
        </div>
      ),
    },
    { header: 'Motivo', accessorKey: 'reason', cell: (r) => <span className="text-13 text-stone">{r.reason}</span> },
    {
      header: 'Tentativas',
      accessorKey: 'attempts',
      cell: (r) => <span className="font-mono text-12 text-warning tabular-nums">{r.attempts}</span>,
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (r) => <StatusChip status={r.status} />,
    },
    {
      header: 'Primeiro registro',
      accessorKey: 'first_seen',
      cell: (r) => <span className="font-mono text-12 text-stone tabular-nums">{r.first_seen}</span>,
    },
  ];

  return (
    <AppShell breadcrumb={[{ label: 'Observe', href: '/live' }, { label: 'Monitoramento' }]}>
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <div className="text-11 font-mono uppercase tracking-[0.18em] text-stone mb-2">Observe · Reliability</div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-24 font-bold text-eggshell">Monitoramento & DLQ</h1>
              <PreviewBadge />
              <StateShowcase />
            </div>
            <p className="text-14 text-stone mt-2">
              Saúde das integrações críticas, latência ponta-a-ponta e fila morta de eventos.
            </p>
          </div>
          <FreshnessTag source="reliability-agent" label="há 1m" />
        </header>

        <ScenarioStateGate
          emptyTitle="Nenhum incidente ativo"
          emptyDescription="Todas as integrações reportaram health check verde no último ciclo."
          degradedIntegration="Meta CAPI"
        >
          {/* KPI row — todos os números abrem Evidence Drawer */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-graphite border border-line rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-11 font-mono uppercase text-stone">Disponibilidade (24h)</span>
                <IntegrationStateBadge state="production" adapterVersion="3.2.1" />
              </div>
              <MetricValue
                value={availability.toFixed(2)}
                unit="%"
                size="lg"
                tone={availability >= 99.5 ? 'verified' : 'warning'}
                onOpenEvidence={() =>
                  openEvidence(
                    buildEvidence({
                      label: 'Disponibilidade (24h)',
                      value: `${availability.toFixed(2)}%`,
                      formula: '(total_events - failed_events) / total_events',
                      source: 'reliability-agent (síntese das integrações)',
                      state: availability >= 99.5 ? 'Reconciliado' : 'Provisório',
                    }),
                  )
                }
              />
              <div className="text-11 text-stone mt-1">Meta: 99.5%</div>
            </div>

            <div className="bg-graphite border border-line rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-11 font-mono uppercase text-stone">Latência P95</span>
                <IntegrationStateBadge state="production" adapterVersion="3.2.1" />
              </div>
              <MetricValue
                value={p95}
                unit="ms"
                size="lg"
                tone={p95 < 200 ? 'verified' : 'warning'}
                onOpenEvidence={() =>
                  openEvidence(
                    buildEvidence({
                      label: 'Latência P95',
                      value: `${p95}ms`,
                      formula: 'percentile(events.latency_ms, 0.95) group by hour',
                      source: 'edge-ingress · janela 24h',
                      state: 'Reconciliado',
                    }),
                  )
                }
              />
              <div className="text-11 text-stone mt-1">Meta: &lt; 200ms</div>
            </div>

            <div className="bg-graphite border border-line rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-11 font-mono uppercase text-stone">Fila morta (DLQ)</span>
                <IntegrationStateBadge state={errorCount > 0 ? "policy-blocked" : "production"} adapterVersion="3.2.1" />
              </div>
              <MetricValue
                value={errorCount}
                size="lg"
                tone={errorCount === 0 ? 'verified' : 'critical'}
                onOpenEvidence={() =>
                  openEvidence(
                    buildEvidence({
                      label: 'Eventos em DLQ',
                      value: `${errorCount}`,
                      formula: 'count(events) where status in ("Failed", "Orphan")',
                      source: 'dlq · consulta direta ao ledger',
                      state: errorCount === 0 ? 'Reconciliado' : 'Divergente',
                      formingEvents: failed.slice(0, 3).map((e) => ({
                        id: e.id,
                        type: e.type,
                        timestamp: e.timestamp,
                        value: e.value ?? undefined,
                      })),
                    }),
                  )
                }
              />
              <div className="text-11 text-stone mt-1">Alvo: 0</div>
            </div>
          </div>

          {/* Bloco R.3.16 — Alertas ativos (acionáveis) */}
          {(() => {
            type Alert = { id: string; severity: 'Crítico' | 'Alto' | 'Médio' | 'Baixo'; status: 'Aberto' | 'Resolvido'; title: string; cause: string; action: string; at: string };
            const alerts: Alert[] = [
              { id: 'alr_9412', severity: 'Crítico', status: 'Aberto', title: 'Meta CAPI · Missing Permissions (#200)', cause: 'token sem ads_read — deixou de puxar campanhas.', action: 'Gerar token com ads_read em Business Manager → Usuários do sistema.', at: '2026-07-24 08:12' },
              { id: 'alr_9411', severity: 'Alto',    status: 'Aberto', title: 'TAP Postback · latência acima do SLO', cause: 'p95 subiu para 480ms (SLO 200ms) nos últimos 30min.',           action: 'Abrir DLQ e reprocessar lote alr_9411 antes de re-testar.',       at: '2026-07-24 07:41' },
              { id: 'alr_9408', severity: 'Médio',   status: 'Aberto', title: 'Domínio dev.operacaobr.com sem DNS',    cause: 'CNAME não propagou depois de 48h.',                             action: 'Rechecar zona no provedor ou remover domínio.',                    at: '2026-07-23 22:03' },
              { id: 'alr_9401', severity: 'Baixo',   status: 'Resolvido', title: 'TikTok Ads · rate-limit intermitente',cause: 'Bursts de 429 na sincronização das 15h.',                        action: 'Backoff aplicado automaticamente — sem ação necessária.',           at: '2026-07-23 15:22' },
            ];
            const abertos = alerts.filter((a) => a.status === 'Aberto');
            const sevTone = (s: Alert['severity']) => s === 'Crítico' ? 'text-critical border-critical/40 bg-critical/5' : s === 'Alto' ? 'text-warning border-warning/40 bg-warning/5' : s === 'Médio' ? 'text-proof-blue border-proof-blue/30 bg-proof-blue/5' : 'text-stone border-line bg-zinc';
            return (
              <div className="bg-graphite border border-line rounded-xl overflow-hidden">
                <div className="p-4 border-b border-line flex items-baseline justify-between">
                  <div>
                    <h2 className="text-16 font-medium text-eggshell">Alertas ativos</h2>
                    <p className="text-12 text-stone mt-0.5">Cada linha diz o que quebrou, por quê e o que fazer — não é feed decorativo.</p>
                  </div>
                  <span className="font-mono text-11 text-stone">{abertos.length} aberto(s) · {alerts.length - abertos.length} resolvido(s)</span>
                </div>
                <ul className="divide-y divide-line">
                  {alerts.map((a) => (
                    <li key={a.id} className="p-4 flex flex-col md:flex-row md:items-start gap-3">
                      <div className="flex items-center gap-2 md:w-40 flex-shrink-0">
                        <span className={`text-11 font-mono uppercase px-2 py-0.5 rounded border ${sevTone(a.severity)}`}>{a.severity}</span>
                        <span className={`text-11 font-mono uppercase ${a.status === 'Aberto' ? 'text-warning' : 'text-verified'}`}>{a.status}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-13 font-medium text-eggshell">{a.title}</div>
                        <div className="text-12 text-stone mt-1"><span className="text-stone/80">Causa:</span> {a.cause}</div>
                        <div className="text-12 text-eggshell mt-1"><span className="font-mono uppercase text-11 text-proof-blue">Ação:</span> {a.action}</div>
                      </div>
                      <div className="font-mono text-11 text-stone tabular-nums whitespace-nowrap md:text-right">{a.at}</div>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })()}

          {/* DLQ table */}
          <div>
            <div className="flex items-baseline justify-between mb-3">
              <h2 className="text-18 font-medium text-eggshell">Fila de eventos mortos</h2>
              <span className="text-11 font-mono text-stone">{dlq.length} evento(s)</span>
            </div>
            {dlq.length === 0 ? (
              <div className="bg-graphite border border-verified/30 rounded-xl p-8 text-center">
                <div className="text-14 text-verified font-medium">DLQ vazia — nenhum evento pendente.</div>
              </div>
            ) : (
              <DataTable data={dlq} columns={dlqColumns} searchPlaceholder="Buscar por ID ou integração..." />
            )}
          </div>

        </ScenarioStateGate>
      </div>

      <EvidenceDrawer isOpen={!!evidence} onClose={() => setEvidence(null)} data={evidence} />
    </AppShell>
  );
}
