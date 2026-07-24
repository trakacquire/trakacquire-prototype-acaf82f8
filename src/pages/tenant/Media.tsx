import React, { useMemo, useState } from 'react';
import { useLocation, Link } from 'wouter';
import { AppShell, useEvidence } from '@/components/layout/AppShell';
import { PreviewBadge } from '@/components/data/PreviewBadge';
import { FreshnessTag } from '@/components/data/FreshnessTag';
import { MetricValue } from '@/components/data/MetricValue';
import { StatusChip } from '@/components/domain/StatusChip';
import { DataTable, ColumnDef } from '@/components/data/DataTable';
import { ScenarioStateGate, StateShowcase } from '@/components/state/ScenarioStateGate';
import { TargetKpi } from '@/components/data/TargetKpi';
import { buildEvidence } from '@/lib/evidence';
import { CAMPAIGNS, PERSONS, metricsForPeriod, spendForPeriod } from '@/lib/fake/db';
import { funnelSteps } from '@/lib/fake/funnelSteps';
import { EXPERTS, expertForPerson } from '@/lib/fake/experts';
import { useIsMobile } from '@/hooks/use-mobile';

interface CampRow {
  id: string;
  name: string;
  source: 'meta' | 'tiktok';
  status: 'active' | 'paused';
  budget_daily: number;
  spend30: number;
  ftds30: number;
  cpftd: number;
  net30: number;
  roi_pct: number;
  roas: number;
  expert: string;      // expert dominante
  expertId: string;
}

const brl = (n: number) => 'R$ ' + Math.round(n).toLocaleString('pt-BR');

export default function MediaPage() {
  const [, navigate] = useLocation();
  const { openEvidence } = useEvidence();
  const isMobile = useIsMobile();
  const [source, setSource] = useState<'all' | 'meta' | 'tiktok'>('all');
  const [expertFilter, setExpertFilter] = useState<'all' | string>('all');

  const totalSpend = spendForPeriod(30);
  const steps = funnelSteps(30);

  const rows: CampRow[] = useMemo(() => {
    return CAMPAIGNS.map((c) => {
      const ps = PERSONS.filter((p) => p.campaign_id === c.id && p.ftd_at);
      const ftds = ps.length;
      const net = ps.reduce((s, p) => s + p.net_deposit, 0);
      const sameSourceSum = CAMPAIGNS.filter((x) => x.source === c.source).reduce((s, x) => s + x.budget_daily, 0) || 1;
      const share = c.budget_daily / sameSourceSum;
      const spend = Math.round((c.source === 'meta' ? totalSpend.meta : totalSpend.tiktok) * share);
      const cpftd = ftds > 0 ? Math.round(spend / ftds) : 0;
      const roi = spend > 0 ? Math.round(((net - spend) / spend) * 100) : 0;
      const roas = spend > 0 ? +(net / spend).toFixed(2) : 0;
      // Expert dominante: primeiro expert de todas as pessoas dessa campanha
      const allPersons = PERSONS.filter((p) => p.campaign_id === c.id);
      const expertCounts = new Map<string, { name: string; count: number }>();
      allPersons.forEach((p) => {
        const e = expertForPerson(p.id);
        if (!e) return;
        const cur = expertCounts.get(e.id) ?? { name: e.name, count: 0 };
        cur.count++;
        expertCounts.set(e.id, cur);
      });
      const top = [...expertCounts.entries()].sort((a, b) => b[1].count - a[1].count)[0];
      return {
        id: c.id, name: c.name, source: c.source, status: c.status, budget_daily: c.budget_daily,
        spend30: spend, ftds30: ftds, cpftd, net30: Math.round(net), roi_pct: roi, roas,
        expert: top ? top[1].name : '—', expertId: top ? top[0] : '',
      };
    });
  }, [totalSpend]);

  const filtered = rows
    .filter((r) => source === 'all' || r.source === source)
    .filter((r) => expertFilter === 'all' || r.expertId === expertFilter);

  const m = metricsForPeriod(30);

  const columns: ColumnDef<CampRow>[] = [
    { header: 'Campanha', accessorKey: 'name', cell: (r) => (
      <div className="flex flex-col">
        <span className="text-13 font-semibold text-eggshell truncate">{r.name}</span>
        <span className="text-11 font-mono text-stone">{r.source.toUpperCase()}</span>
      </div>
    ) },
    { header: 'Expert', accessorKey: 'expert', cell: (r) => (
      <span className="text-12 text-eggshell truncate">{r.expert}</span>
    ), className: isMobile ? 'hidden' : '' },
    { header: 'Status', accessorKey: 'status', cell: (r) => <StatusChip status={r.status === 'active' ? 'Confirmed' : 'Captured'} /> },
    { header: 'Diário', accessorKey: 'budget_daily', cell: (r) => (
      <span className="font-mono text-12 tabular-nums text-stone">R$ {r.budget_daily.toLocaleString('pt-BR')}</span>
    ), className: isMobile ? 'hidden text-right' : 'text-right' },
    { header: 'Spend (30d)', accessorKey: 'spend30', cell: (r) => (
      <MetricValue value={`R$ ${r.spend30.toLocaleString('pt-BR')}`} size="sm" onOpenEvidence={() => openEvidence(buildEvidence({ label: `Spend · ${r.name}`, value: `R$ ${r.spend30.toLocaleString('pt-BR')}`, formula: 'source_spend × budget_share', source: r.source === 'meta' ? 'Meta Ads' : 'TikTok Ads' }))} />
    ), className: 'text-right' },
    { header: 'FTDs', accessorKey: 'ftds30', cell: (r) => (
      <MetricValue value={r.ftds30.toLocaleString('pt-BR')} size="sm" onOpenEvidence={() => openEvidence(buildEvidence({ label: `FTDs · ${r.name}`, value: r.ftds30.toLocaleString('pt-BR'), formula: 'count(persons) where campaign_id=? and ftd_at', source: 'TAP postback', state: 'Reconciliado' }))} />
    ), className: 'text-right' },
    { header: 'CPFTD', accessorKey: 'cpftd', cell: (r) => (
      <MetricValue value={r.cpftd > 0 ? `R$ ${r.cpftd.toLocaleString('pt-BR')}` : '—'} size="sm" onOpenEvidence={() => openEvidence(buildEvidence({ label: `CPFTD · ${r.name}`, value: `R$ ${r.cpftd.toLocaleString('pt-BR')}`, formula: 'spend / ftds', source: 'Cross' }))} />
    ), className: 'text-right' },
    { header: 'Net (30d)', accessorKey: 'net30', cell: (r) => (
      <MetricValue value={`R$ ${r.net30.toLocaleString('pt-BR')}`} size="sm" onOpenEvidence={() => openEvidence(buildEvidence({ label: `Net · ${r.name}`, value: `R$ ${r.net30.toLocaleString('pt-BR')}`, formula: 'sum(persons.net_deposit)', source: 'TAP + saques' }))} />
    ), className: 'text-right' },
    { header: 'ROAS', accessorKey: 'roas', cell: (r) => (
      <span className={`font-mono text-12 tabular-nums ${r.roas >= 2 ? 'text-verified' : r.roas >= 1 ? 'text-warning' : 'text-critical'}`}>{r.roas.toFixed(2)}x</span>
    ), className: 'text-right' },
  ];

  return (
    <AppShell breadcrumb={[{ label: 'Operate', href: '/media' }, { label: 'Mídia' }]}>
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span className="kicker">Operate · Mídia paga</span>
              <PreviewBadge />
              <FreshnessTag ageSeconds={60 * 60 * 32} source="Snapshot D+2 · Meta/TikTok" />
              <StateShowcase />
            </div>
            <h1 className="text-eggshell font-sans font-semibold tracking-tight text-24">Meta × TrakAcquire, lado a lado.</h1>
            <p className="text-stone text-13 mt-2 max-w-xl">Custo por etapa do funil (StartBot · Canal · Cadastro · FTD) com meta e semáforo semântico. Números batem com Command e Receita.</p>
          </div>
          <Link href="/media/creatives" className="text-13 border border-line rounded-md px-4 py-2 text-stone hover:text-eggshell hover:border-stone">Ranking de criativos →</Link>
        </header>

        <ScenarioStateGate emptyTitle="Sem campanhas ativas">
          {/* KPIs agregados */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <KPI label="Spend total" value={`R$ ${m.total_spend.toLocaleString('pt-BR')}`} onOpenEvidence={() => openEvidence(buildEvidence({ label: 'Investimento 30d', value: `R$ ${m.total_spend.toLocaleString('pt-BR')}`, formula: 'meta + tiktok', source: 'Cross plataformas' }))} />
            <KPI label="FTDs" value={m.ftds.toLocaleString('pt-BR')} tone="verified" onOpenEvidence={() => openEvidence(buildEvidence({ label: 'FTDs 30d', value: m.ftds.toLocaleString('pt-BR'), formula: 'metricsForPeriod(30).ftds', source: 'TAP', state: 'Reconciliado' }))} />
            <KPI label="Net (30d)" value={`R$ ${m.net_deposits.toLocaleString('pt-BR')}`} tone="verified" onOpenEvidence={() => openEvidence(buildEvidence({ label: 'Net 30d', value: `R$ ${m.net_deposits.toLocaleString('pt-BR')}`, formula: 'gross − withdrawals', source: 'TAP + saques' }))} />
            <KPI label="ROI" value={`${m.roi_pct}%`} tone={m.roi_pct >= 0 ? 'verified' : 'critical'} onOpenEvidence={() => openEvidence(buildEvidence({ label: 'ROI', value: `${m.roi_pct}%`, formula: '(gross_margin - spend) / spend', source: 'P&L operacional' }))} />
          </div>

          {/* Custo por etapa do funil — semáforo semântico contra meta */}
          <section className="space-y-3">
            <div className="flex items-baseline justify-between">
              <div>
                <h2 className="text-14 font-semibold text-eggshell">Custo por etapa do funil</h2>
                <p className="text-12 text-stone mt-0.5">Investimento ÷ eventos da etapa. Semáforo compara contra meta declarada.</p>
              </div>
              <span className="text-11 font-mono text-stone tabular-nums">período: 30d</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {steps.filter((s) => s.key !== 'click').map((s) => (
                <TargetKpi
                  key={s.key}
                  label={s.costLabel}
                  value={s.cost}
                  format={brl}
                  target={s.target}
                  onOpenEvidence={() => openEvidence(buildEvidence({
                    label: `${s.costLabel} (30d)`,
                    value: `${brl(s.cost)} · meta < ${brl(s.target)}`,
                    formula: `sum(spend.total) / count(events.${s.key})`,
                    source: 'Meta+TikTok spend ÷ funil canônico',
                    state: 'Reconciliado',
                    attribution: `Etapa: ${s.count.toLocaleString('pt-BR')} eventos · Semáforo: <80% meta=verified · 80–100%=warning · acima=critical`,
                  }))}
                />
              ))}
            </div>
          </section>

          {/* Filtros: fonte + expert */}
          <div className="flex flex-wrap items-center gap-2 bg-graphite border border-line rounded-xl p-3">
            {(['all', 'meta', 'tiktok'] as const).map((s) => (
              <button key={s} onClick={() => setSource(s)} className={`text-12 px-3 py-1 rounded-md border ${source === s ? 'bg-zinc text-eggshell border-line' : 'text-stone border-transparent hover:text-eggshell'}`}>{s === 'all' ? 'Todas as fontes' : s.toUpperCase()}</button>
            ))}
            <span className="w-px h-5 bg-line mx-1" />
            <select
              value={expertFilter}
              onChange={(e) => setExpertFilter(e.target.value)}
              className="bg-zinc border border-line text-eggshell rounded-md px-2 py-1 text-12 outline-none focus:border-proof-blue"
            >
              <option value="all">Todos os Experts</option>
              {EXPERTS.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
            <span className="ml-auto text-11 font-mono text-stone tabular-nums">{filtered.length} campanhas</span>
          </div>

          <DataTable data={filtered} columns={columns} onRowClick={(r) => navigate(`/media/campaigns/${r.id}`)} />
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
