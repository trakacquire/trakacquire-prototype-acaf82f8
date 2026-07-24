import React, { useMemo } from 'react';
import { AppShell, useEvidence } from '@/components/layout/AppShell';
import { PreviewBadge } from '@/components/data/PreviewBadge';
import { FreshnessTag } from '@/components/data/FreshnessTag';
import { MetricValue } from '@/components/data/MetricValue';
import { StatusChip } from '@/components/domain/StatusChip';
import { DataTable, ColumnDef } from '@/components/data/DataTable';
import { ScenarioStateGate, StateShowcase } from '@/components/state/ScenarioStateGate';
import { buildEvidence } from '@/lib/evidence';
import { revenueBySource, spendForPeriod, metricsForPeriod } from '@/lib/fake/db';
import { useIsMobile } from '@/hooks/use-mobile';

interface SourceRow {
  source: string;
  platform: 'meta' | 'tiktok' | 'organic' | 'orphan';
  macro: string;
  spend: number;
  ftds: number;
  cpftd: number;
  snapshotAt: string;
  status: 'Confirmed' | 'Captured' | 'Orphan';
}

export default function TrackingSourcesPage() {
  const { openEvidence } = useEvidence();
  const isMobile = useIsMobile();

  const rows: SourceRow[] = useMemo(() => {
    const rev = revenueBySource(30);
    const macros: Record<string, string> = {
      'Meta Ads': 'utm_source=meta&utm_campaign={{campaign.name}}&fbclid={{fbclid}}',
      'TikTok Ads': 'utm_source=tiktok&utm_campaign={{campaign.name}}&ttclid={{ttclid}}',
      'Orgânico': 'utm_source=organic&utm_medium=bio',
      'Orphan': '—',
    };
    const plat: Record<string, SourceRow['platform']> = { 'Meta Ads': 'meta', 'TikTok Ads': 'tiktok', 'Orgânico': 'organic', 'Orphan': 'orphan' };
    return rev.map((r) => ({
      source: r.source,
      platform: plat[r.source],
      macro: macros[r.source],
      spend: r.spend,
      ftds: r.ftds,
      cpftd: r.cpftd,
      snapshotAt: '2026-07-22 04:00',
      status: r.source === 'Orphan' ? 'Orphan' : r.ftds === 0 ? 'Captured' : 'Confirmed',
    }));
  }, []);

  const spend = spendForPeriod(30);
  const m30 = metricsForPeriod(30);

  const columns: ColumnDef<SourceRow>[] = [
    { header: 'Fonte', accessorKey: 'source', cell: (r) => (
      <div className="flex flex-col">
        <span className="text-13 font-semibold text-eggshell">{r.source}</span>
        <span className="text-11 font-mono text-stone">{r.platform}</span>
      </div>
    ) },
    { header: 'Template de macro', accessorKey: 'macro', cell: (r) => (
      <code className="font-mono text-11 text-eggshell truncate block max-w-[320px]">{r.macro}</code>
    ), className: isMobile ? 'hidden' : '' },
    { header: 'Status', accessorKey: 'status', cell: (r) => <StatusChip status={r.status} /> },
    { header: 'Investimento', accessorKey: 'spend', cell: (r) => (
      <MetricValue value={`R$ ${r.spend.toLocaleString('pt-BR')}`} size="sm" onOpenEvidence={() => openEvidence(buildEvidence({ label: `Spend · ${r.source}`, value: `R$ ${r.spend.toLocaleString('pt-BR')}`, formula: 'spendForPeriod(30).' + r.platform, source: 'Plataforma (snapshot D+2)', freshness: 'snapshot 2026-07-22 04:00 · congelado', state: 'Reconciliado' }))} />
    ), className: 'text-right' },
    { header: 'FTDs', accessorKey: 'ftds', cell: (r) => (
      <MetricValue value={r.ftds.toLocaleString('pt-BR')} size="sm" onOpenEvidence={() => openEvidence(buildEvidence({ label: `FTDs · ${r.source}`, value: r.ftds.toLocaleString('pt-BR'), formula: 'revenueBySource(30).ftds', source: 'TAP postback' }))} />
    ), className: 'text-right' },
    { header: 'CPFTD', accessorKey: 'cpftd', cell: (r) => (
      <MetricValue value={r.cpftd > 0 ? `R$ ${r.cpftd.toLocaleString('pt-BR')}` : '—'} size="sm" onOpenEvidence={() => openEvidence(buildEvidence({ label: `CPFTD · ${r.source}`, value: `R$ ${r.cpftd.toLocaleString('pt-BR')}`, formula: 'spend / ftds', source: 'Cross · plataforma × TAP' }))} />
    ), className: 'text-right' },
  ];

  return (
    <AppShell breadcrumb={[{ label: 'Connect', href: '/integrations' }, { label: 'Tracking', href: '/tracking' }, { label: 'Fontes &amp; custos' }]}>
      <div className="max-w-7xl mx-auto space-y-6">
        <header>
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <span className="kicker">Connect · Fontes &amp; custos</span>
            <PreviewBadge />
            <FreshnessTag ageSeconds={60 * 60 * 32} source="Snapshot D+2 · Meta/TikTok Ads" />
            <StateShowcase />
          </div>
          <h1 className="text-eggshell font-sans font-semibold tracking-tight text-24">Custo por fonte, com snapshot congelado.</h1>
          <p className="text-stone text-13 mt-2 max-w-xl">Templates de macro por plataforma e snapshot diário D+2. Não confunda com Analytics: aqui o número é o que a plataforma reportou, não o que reconciliamos com o Ledger.</p>
        </header>

        <ScenarioStateGate emptyTitle="Nenhuma fonte configurada">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <KPI label="Investimento total" value={`R$ ${spend.total.toLocaleString('pt-BR')}`} onOpenEvidence={() => openEvidence(buildEvidence({ label: 'Investimento 30d', value: `R$ ${spend.total.toLocaleString('pt-BR')}`, formula: 'meta + tiktok', source: 'Plataformas de mídia' }))} />
            <KPI label="Meta" value={`R$ ${spend.meta.toLocaleString('pt-BR')}`} onOpenEvidence={() => openEvidence(buildEvidence({ label: 'Meta spend', value: `R$ ${spend.meta.toLocaleString('pt-BR')}`, formula: 'sum(daily_spend.meta) 30d', source: 'Meta Ads API' }))} />
            <KPI label="TikTok" value={`R$ ${spend.tiktok.toLocaleString('pt-BR')}`} onOpenEvidence={() => openEvidence(buildEvidence({ label: 'TikTok spend', value: `R$ ${spend.tiktok.toLocaleString('pt-BR')}`, formula: 'sum(daily_spend.tiktok) 30d', source: 'TikTok Ads API' }))} />
            <KPI label="CPFTD global" value={`R$ ${m30.cpftd.toLocaleString('pt-BR')}`} onOpenEvidence={() => openEvidence(buildEvidence({ label: 'CPFTD global', value: `R$ ${m30.cpftd.toLocaleString('pt-BR')}`, formula: 'total_spend / ftds', source: 'Command canônico' }))} />
          </div>

          <DataTable data={rows} columns={columns} />
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
