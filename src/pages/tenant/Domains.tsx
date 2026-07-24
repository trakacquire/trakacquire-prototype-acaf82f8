import React, { useMemo } from 'react';
import { useLocation } from 'wouter';
import { AppShell, useEvidence } from '@/components/layout/AppShell';
import { PreviewBadge } from '@/components/data/PreviewBadge';
import { FreshnessTag } from '@/components/data/FreshnessTag';
import { MetricValue } from '@/components/data/MetricValue';
import { StatusChip } from '@/components/domain/StatusChip';
import { DataTable, ColumnDef } from '@/components/data/DataTable';
import { ScenarioStateGate, StateShowcase } from '@/components/state/ScenarioStateGate';
import { buildEvidence } from '@/lib/evidence';
import { DOMAINS, Domain } from '@/lib/fake/db';
import { useIsMobile } from '@/hooks/use-mobile';

type Row = Domain & { role: string; p95: number; last_check: string };

const ROLE_BY_TYPE: Record<Domain['type'], string> = {
  presell: 'Principal · presell',
  track: 'Redirect · tracking',
  offer: 'Reserva · pool',
};

export default function DomainsPage() {
  const [, navigate] = useLocation();
  const { openEvidence } = useEvidence();
  const isMobile = useIsMobile();

  const rows: Row[] = useMemo(() => DOMAINS.map((d, i) => ({
    ...d,
    role: ROLE_BY_TYPE[d.type],
    p95: d.status === 'active' ? 42 + i * 6 : 0,
    last_check: d.status === 'active' ? '2min atrás' : 'nunca',
  })), []);

  const active = rows.filter((r) => r.status === 'active').length;
  const worstP95 = Math.max(...rows.map((r) => r.p95));
  const sslOk = rows.filter((r) => r.ssl).length;
  const totalClicks = rows.reduce((s, r) => s + r.clicks_30d, 0);

  const columns: ColumnDef<Row>[] = [
    { header: 'Domínio', accessorKey: 'domain', cell: (r) => (
      <div className="flex flex-col">
        <span className="text-13 font-semibold text-eggshell">{r.domain}</span>
        <span className="text-11 font-mono text-stone">{r.role}</span>
      </div>
    ) },
    { header: 'Status', accessorKey: 'status', cell: (r) => (
      <StatusChip status={r.status === 'active' ? 'Confirmed' : r.status === 'pending_dns' ? 'Captured' : 'Failed'} />
    ) },
    { header: 'SSL', accessorKey: 'ssl', cell: (r) => (
      <span className={`font-mono text-11 tabular-nums ${r.ssl ? 'text-verified' : 'text-warning'}`}>{r.ssl ? 'válido' : 'pendente'}</span>
    ), className: isMobile ? 'hidden' : '' },
    { header: 'P95 redirect', accessorKey: 'p95', cell: (r) => (
      <MetricValue value={r.p95 ? `${r.p95}ms` : '—'} size="sm" onOpenEvidence={() => openEvidence(buildEvidence({ label: `P95 · ${r.domain}`, value: `${r.p95}ms`, formula: 'percentile(redirect_latency_ms, 0.95)', source: 'Cloudflare Proxy · edge logs', state: r.p95 > 200 ? 'Provisório' : 'Reconciliado' }))} />
    ), className: 'text-right' },
    { header: 'Cliques (30d)', accessorKey: 'clicks_30d', cell: (r) => (
      <MetricValue value={r.clicks_30d.toLocaleString('pt-BR')} size="sm" onOpenEvidence={() => openEvidence(buildEvidence({ label: `Cliques · ${r.domain}`, value: r.clicks_30d.toLocaleString('pt-BR'), formula: 'count(events.click) where domain = ?', source: 'Signal Ledger' }))} />
    ), className: 'text-right' },
    { header: 'Último check', accessorKey: 'last_health', cell: (r) => (
      <span className="font-mono text-11 text-stone tabular-nums">{r.last_check}</span>
    ), className: isMobile ? 'hidden' : '' },
  ];

  return (
    <AppShell breadcrumb={[{ label: 'Connect', href: '/integrations' }, { label: 'Domínios' }]}>
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span className="kicker">Connect · Domínios &amp; redirect</span>
              <PreviewBadge />
              <FreshnessTag ageSeconds={120} source="Cloudflare edge · health probes" />
              <StateShowcase />
            </div>
            <h1 className="text-eggshell font-sans font-semibold tracking-tight text-24">Todo domínio tem função, DNS e P95.</h1>
            <p className="text-stone text-13 mt-2 max-w-xl">Nenhum "site conectado". Aqui tem função declarada, propagação verificada e uma latência de redirect que o Signal Ledger pode auditar.</p>
          </div>
          <button className="bg-eggshell text-ink px-4 py-2 rounded-md font-medium text-13 hover:bg-white transition-colors">Adicionar domínio</button>
        </header>

        <ScenarioStateGate emptyTitle="Sem domínios cadastrados" emptyDescription="Cadastre ao menos um domínio de tracking para começar a coletar cliques.">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <KPI label="Ativos" value={String(active)} onOpenEvidence={() => openEvidence(buildEvidence({ label: 'Domínios ativos', value: String(active), formula: 'count(domains) where status="active"', source: 'Domain registry' }))} />
            <KPI label="Pior P95" value={`${worstP95}ms`} tone={worstP95 > 200 ? 'warning' : 'default'} onOpenEvidence={() => openEvidence(buildEvidence({ label: 'Pior P95 redirect', value: `${worstP95}ms`, formula: 'max(p95_ms per domain)', source: 'Edge logs' }))} />
            <KPI label="SSL válido" value={`${sslOk}/${rows.length}`} tone={sslOk === rows.length ? 'verified' : 'warning'} onOpenEvidence={() => openEvidence(buildEvidence({ label: 'SSL válido', value: `${sslOk}/${rows.length}`, formula: 'count(ssl_valid)/count(*)', source: 'Certificate monitor' }))} />
            <KPI label="Cliques (30d)" value={totalClicks.toLocaleString('pt-BR')} onOpenEvidence={() => openEvidence(buildEvidence({ label: 'Cliques 30d', value: totalClicks.toLocaleString('pt-BR'), formula: 'sum(domain.clicks_30d)', source: 'Signal Ledger' }))} />
          </div>

          <DataTable data={rows} columns={columns} onRowClick={(r) => navigate(`/domains/${r.id}`)} />
        </ScenarioStateGate>
      </div>
    </AppShell>
  );
}

function KPI({ label, value, tone = 'default', onOpenEvidence }: { label: string; value: string; tone?: 'default' | 'verified' | 'warning' | 'critical'; onOpenEvidence?: () => void }) {
  const cls = tone === 'verified' ? 'text-verified' : tone === 'warning' ? 'text-warning' : tone === 'critical' ? 'text-critical' : 'text-eggshell';
  return (
    <button type="button" onClick={onOpenEvidence} className="text-left rounded-xl border border-line bg-graphite hover:border-stone transition-colors p-4">
      <div className="text-11 font-mono uppercase tracking-wider text-stone mb-2">{label}</div>
      <div className={`font-mono tabular-nums text-24 leading-none font-semibold ${cls}`}>{value}</div>
    </button>
  );
}
