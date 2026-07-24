import React, { useMemo, useState } from 'react';
import { useLocation } from 'wouter';
import { AppShell, useEvidence } from '@/components/layout/AppShell';
import { PreviewBadge } from '@/components/data/PreviewBadge';
import { FreshnessTag } from '@/components/data/FreshnessTag';
import { MetricValue } from '@/components/data/MetricValue';
import { IntegrationStateBadge } from '@/components/data/IntegrationStateBadge';
import { DataTable, ColumnDef } from '@/components/data/DataTable';
import { ScenarioStateGate, StateShowcase } from '@/components/state/ScenarioStateGate';
import { buildEvidence } from '@/lib/evidence';
import { db } from '@/lib/fake/db';
import { useIsMobile } from '@/hooks/use-mobile';
import type { IntegrationState } from '@/lib/types';

/**
 * Integration Hub — catálogo por categoria (Provedor / Aquisição / Mensageria / Infra / IA).
 * Cada linha traz IntegrationStateBadge (enum fechado + adapter version), último evento,
 * saúde e latência derivados do dataset canônico. Todo número abre Evidence Drawer.
 */
interface IntegrationRow {
  id: string;
  name: string;
  category: 'Provedor de Receita' | 'Aquisição' | 'Mensageria' | 'Infra' | 'IA';
  state: IntegrationState;
  adapterVersion: string;
  eventType?: string;
  lastEventAt?: string;
  health: number;
  errors24h: number;
  p95: number;
}

const CATEGORY_ORDER: IntegrationRow['category'][] = [
  'Provedor de Receita', 'Aquisição', 'Mensageria', 'Infra', 'IA',
];

function lastEventFor(type: string): string | undefined {
  return db.events.find((e) => e.type === type)?.timestamp;
}
function ageAgo(iso?: string): number {
  if (!iso) return 999999;
  return Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
}

export default function IntegrationsPage() {
  const [, navigate] = useLocation();
  const { openEvidence } = useEvidence();
  const isMobile = useIsMobile();
  const [category, setCategory] = useState<'all' | IntegrationRow['category']>('all');

  const integrations: IntegrationRow[] = useMemo(() => [
    { id: 'tap', name: 'TAP', category: 'Provedor de Receita', state: 'production', adapterVersion: '2.1.0', eventType: 'ftd', lastEventAt: lastEventFor('ftd'), health: 98.7, errors24h: 2, p95: 412 },
    { id: 'betano', name: 'Betano', category: 'Provedor de Receita', state: 'sandbox', adapterVersion: '1.0.0-rc.3', eventType: 'ftd', lastEventAt: undefined, health: 100, errors24h: 0, p95: 0 },
    { id: 'meta', name: 'Meta CAPI', category: 'Aquisição', state: 'production', adapterVersion: '17.0.4', eventType: 'capi', lastEventAt: lastEventFor('capi'), health: 99.2, errors24h: 0, p95: 187 },
    { id: 'tiktok', name: 'TikTok Events', category: 'Aquisição', state: 'pilot', adapterVersion: '1.3.2', eventType: 'click', lastEventAt: lastEventFor('click'), health: 97.1, errors24h: 5, p95: 341 },
    { id: 'google', name: 'Google Ads Enhanced', category: 'Aquisição', state: 'disabled', adapterVersion: '0.9.0', health: 0, errors24h: 0, p95: 0 },
    { id: 'telegram', name: 'Telegram Bot', category: 'Mensageria', state: 'production', adapterVersion: '6.0.1', eventType: 'bot_message', lastEventAt: lastEventFor('bot_message'), health: 99.9, errors24h: 0, p95: 96 },
    { id: 'whatsapp', name: 'WhatsApp Cloud', category: 'Mensageria', state: 'policy-blocked', adapterVersion: '18.0.0', health: 0, errors24h: 0, p95: 0 },
    { id: 'cloudflare', name: 'Cloudflare Proxy', category: 'Infra', state: 'production', adapterVersion: '2024.11', health: 99.98, errors24h: 0, p95: 22 },
    { id: 'openai', name: 'OpenAI (Copiloto)', category: 'IA', state: 'pilot', adapterVersion: '2025.06', health: 98.2, errors24h: 1, p95: 812 },
  ], []);

  const filtered = category === 'all' ? integrations : integrations.filter((i) => i.category === category);
  const grouped = CATEGORY_ORDER.map((cat) => ({ cat, items: filtered.filter((i) => i.category === cat) })).filter((g) => g.items.length);

  // KPIs
  const totalProd = integrations.filter((i) => i.state === 'production').length;
  const totalErrors = integrations.reduce((s, i) => s + i.errors24h, 0);
  const avgHealth = integrations.filter((i) => i.state === 'production' || i.state === 'pilot').reduce((s, i, _, a) => s + i.health / a.length, 0);
  const worstP95 = Math.max(...integrations.map((i) => i.p95));

  return (
    <AppShell breadcrumb={[{ label: 'Connect', href: '/integrations' }, { label: 'Integrações' }]}>
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span className="text-14 font-serif italic text-stone leading-none">Connect · Hub de integrações</span>
              <PreviewBadge />
              <FreshnessTag ageSeconds={ageAgo(lastEventFor('ftd'))} source="TAP · Meta · Telegram" />
              <StateShowcase />
            </div>
            <h1 className="text-eggshell font-sans font-semibold tracking-tight text-24">Cada fonte, com estado e versão de adapter.</h1>
            <p className="text-stone text-13 mt-2 max-w-xl">Nada de "conectado". Aqui o vocabulário é fechado: Disabled · Sandbox · Pilot · Production · Policy blocked — cada linha traz a versão do adapter.</p>
          </div>
        </header>

        <ScenarioStateGate emptyTitle="Nenhuma integração configurada" emptyDescription="Comece pela provedora de receita." emptyPrerequisite="Um adapter em Production é pré-requisito para o Signal Ledger.">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <MetricCard label="Em produção" value={String(totalProd)} sub={`${integrations.length} totais`} onOpenEvidence={() => openEvidence(buildEvidence({ label: 'Integrações em Production', value: String(totalProd), formula: 'count(i) where state == "production"', source: 'Integration Registry' }))} />
            <MetricCard label="Erros (24h)" value={String(totalErrors)} tone={totalErrors > 0 ? 'warning' : 'verified'} onOpenEvidence={() => openEvidence(buildEvidence({ label: 'Erros 24h', value: String(totalErrors), formula: 'sum(i.errors_last_24h)', source: 'Adapter telemetry', state: totalErrors > 0 ? 'Provisório' : 'Reconciliado' }))} />
            <MetricCard label="Saúde média" value={`${avgHealth.toFixed(1)}%`} tone={avgHealth >= 99 ? 'verified' : avgHealth >= 95 ? 'warning' : 'critical'} onOpenEvidence={() => openEvidence(buildEvidence({ label: 'Saúde média (prod+pilot)', value: `${avgHealth.toFixed(1)}%`, formula: 'avg(i.health) where state in (prod, pilot)', source: 'Adapter telemetry' }))} />
            <MetricCard label="Pior P95" value={`${worstP95}ms`} tone={worstP95 > 800 ? 'critical' : 'default'} onOpenEvidence={() => openEvidence(buildEvidence({ label: 'Pior latência P95', value: `${worstP95}ms`, formula: 'max(i.p95_ms)', source: 'Adapter telemetry' }))} />
          </div>

          <div className="flex flex-wrap items-center gap-2 bg-graphite border border-line rounded-xl p-3">
            <button onClick={() => setCategory('all')} className={`text-12 px-3 py-1 rounded-md border ${category === 'all' ? 'bg-zinc text-eggshell border-line' : 'text-stone border-transparent hover:text-eggshell'}`}>Todas</button>
            {CATEGORY_ORDER.map((c) => (
              <button key={c} onClick={() => setCategory(c)} className={`text-12 px-3 py-1 rounded-md border ${category === c ? 'bg-zinc text-eggshell border-line' : 'text-stone border-transparent hover:text-eggshell'}`}>{c}</button>
            ))}
            <span className="ml-auto text-11 font-mono text-stone tabular-nums">{filtered.length} integrações</span>
          </div>

          <div className="space-y-8">
            {grouped.map(({ cat, items }) => {
              const columns: ColumnDef<IntegrationRow>[] = [
                { header: 'Integração', accessorKey: 'name', cell: (i) => (
                  <div className="flex flex-col">
                    <span className="text-13 font-semibold text-eggshell">{i.name}</span>
                    <span className="text-11 font-mono text-stone">v{i.adapterVersion}</span>
                  </div>
                ) },
                { header: 'Estado', accessorKey: 'state', cell: (i) => <IntegrationStateBadge state={i.state} adapterVersion={i.adapterVersion} /> },
                { header: 'Último evento', accessorKey: 'lastEventAt', cell: (i) => (
                  <span className="font-mono text-11 text-stone tabular-nums">{i.lastEventAt ? i.lastEventAt.slice(0, 19).replace('T', ' ') : '—'}</span>
                ), className: isMobile ? 'hidden' : '' },
                { header: 'Saúde', accessorKey: 'health', cell: (i) => (
                  <MetricValue value={`${i.health.toFixed(1)}%`} size="sm" onOpenEvidence={() => openEvidence(buildEvidence({ label: `Saúde · ${i.name}`, value: `${i.health.toFixed(1)}%`, formula: '1 - (errors_5m / total_5m)', source: `Adapter ${i.name} v${i.adapterVersion}`, state: i.health >= 99 ? 'Reconciliado' : 'Provisório', freshness: `latência P95 ${i.p95}ms · erros 24h ${i.errors24h}` }))} />
                ), className: 'text-right' },
                { header: 'P95', accessorKey: 'p95', cell: (i) => (
                  <span className="font-mono text-11 tabular-nums text-stone">{i.p95 ? `${i.p95}ms` : '—'}</span>
                ), className: 'text-right' },
              ];
              return (
                <div key={cat}>
                  <h2 className="text-14 font-semibold text-eggshell mb-3 flex items-center gap-2">
                    <span>{cat}</span>
                    <span className="text-11 font-mono text-stone">{items.length}</span>
                  </h2>
                  <DataTable data={items} columns={columns} onRowClick={(i) => navigate(`/integrations/${i.id}`)} />
                </div>
              );
            })}
          </div>
        </ScenarioStateGate>
      </div>
    </AppShell>
  );
}

function MetricCard({ label, value, sub, tone = 'default', onOpenEvidence }: {
  label: string; value: string; sub?: string; tone?: 'default' | 'verified' | 'warning' | 'critical'; onOpenEvidence?: () => void;
}) {
  const cls = tone === 'verified' ? 'text-verified' : tone === 'warning' ? 'text-warning' : tone === 'critical' ? 'text-critical' : 'text-eggshell';
  return (
    <button type="button" onClick={onOpenEvidence} className="text-left rounded-xl border border-line bg-graphite hover:border-stone transition-colors p-4">
      <div className="text-11 font-mono uppercase tracking-wider text-stone mb-2">{label}</div>
      <div className={`font-mono tabular-nums text-24 leading-none font-semibold ${cls}`}>{value}</div>
      {sub && <div className="text-11 font-mono text-stone mt-1">{sub}</div>}
    </button>
  );
}
