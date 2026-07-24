import React from 'react';
import { AppShell, useEvidence } from '@/components/layout/AppShell';
import { PreviewBadge } from '@/components/data/PreviewBadge';
import { MetricCard } from '@/components/data/MetricCard';
import { DataTable } from '@/components/data/DataTable';
import { ScenarioStateGate, StateShowcase } from '@/components/state/ScenarioStateGate';
import { buildEvidence } from '@/lib/evidence';
import { db } from '@/lib/fake/db';
import { usePeriod } from '@/lib/context/PeriodContext';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

type Granularity = 'daily' | 'hourly';
type Compare = 'off' | 'prev';

const ANNOTATIONS: Record<string, string> = {
  '07/22': 'Escalou budget Meta +20%',
  '07/18': 'Trocou criativo TikTok',
};

export default function AnalyticsPage() {
  const { period } = usePeriod();
  const m = db.metricsForPeriod(period);
  const mPrev = db.metricsForPeriod(period * 2);
  const { openEvidence } = useEvidence();

  const [tab, setTab] = React.useState<'origem' | 'campanha' | 'criativo' | 'funil'>('origem');
  const [granularity, setGranularity] = React.useState<Granularity>('daily');
  const [compare, setCompare] = React.useState<Compare>('off');
  const [savedView, setSavedView] = React.useState<string>('default');

  // Series
  const clicksSeries = db.dailySeries(period, 'clicks');
  const regsSeries = db.dailySeries(period, 'registrations');
  const ftdsSeries = db.dailySeries(period, 'ftds');

  const chartData = clicksSeries.map((pt, i) => {
    const date = pt.date.slice(-5).replace('-', '/');
    const row: any = {
      date,
      clicks: pt.value,
      registros: regsSeries[i]?.value ?? 0,
      ftds: ftdsSeries[i]?.value ?? 0,
    };
    if (granularity === 'hourly') {
      // Aproximação horária: distribui o valor diário em uma curva sino
      row.clicks = Math.round(pt.value / 24 * 8);
    }
    if (compare === 'prev') {
      row.clicks_prev = Math.round(pt.value * 0.82);
      row.ftds_prev = Math.round((ftdsSeries[i]?.value ?? 0) * 0.78);
    }
    return row;
  });

  const tooltipStyle = {
    backgroundColor: 'hsl(var(--zinc))',
    border: '1px solid hsl(var(--line))',
    borderRadius: '8px',
    fontSize: 13,
  };

  const sourceData = db.revenueBySource(period);

  const campaignMap: Record<string, { name: string; ftds: number }> = {};
  for (const p of db.persons) {
    if (p.campaign_id && p.ftd_at) {
      if (!campaignMap[p.campaign_id]) {
        const camp = db.campaigns.find(c => c.id === p.campaign_id);
        campaignMap[p.campaign_id] = { name: camp?.name ?? p.campaign_id, ftds: 0 };
      }
      campaignMap[p.campaign_id].ftds++;
    }
  }
  const campaignRows = Object.entries(campaignMap).map(([id, data]) => {
    const spend = db.spendForPeriod(period);
    const spendAmt = id.startsWith('camp_meta')
      ? Math.round(spend.meta * (data.ftds / Math.max(1, m.ftds)))
      : Math.round(spend.tiktok * (data.ftds / Math.max(1, m.ftds)));
    return { ...data, id, cpftd: data.ftds > 0 ? Math.round(spendAmt / data.ftds) : 0 };
  });

  const allCreatives = db.campaigns.flatMap(c => c.creatives);
  const creativeMap: Record<string, { name: string; ftds: number }> = {};
  for (const p of db.persons) {
    if (p.creative_id && p.ftd_at) {
      if (!creativeMap[p.creative_id]) {
        const cr = allCreatives.find(c => c.id === p.creative_id);
        creativeMap[p.creative_id] = { name: cr?.name ?? p.creative_id, ftds: 0 };
      }
      creativeMap[p.creative_id].ftds++;
    }
  }
  const creativeRows = Object.entries(creativeMap).map(([id, data]) => {
    const avgCpftd = m.ftds > 0 ? Math.round(m.total_spend / m.ftds) : 0;
    return { ...data, id, cpftd: avgCpftd };
  });

  const funnel = db.funnelData(period);
  const maxFunnelCount = Math.max(...funnel.map(f => f.count), 1);

  const tabs = [
    { key: 'origem', label: 'Origem' },
    { key: 'campanha', label: 'Campanha' },
    { key: 'criativo', label: 'Criativo' },
    { key: 'funil', label: 'Funil' },
  ] as const;

  const evClicks = buildEvidence({
    label: 'Cliques',
    value: m.clicks.toLocaleString('pt-BR'),
    formula: 'count(clicks) where in_period',
    source: 'Link Ingest · TAP',
    freshness: 'atualizado há 2m',
    state: 'Reconciliado',
  });
  const evRegs = buildEvidence({
    label: 'Registros',
    value: m.registrations.toLocaleString('pt-BR'),
    formula: 'count(persons) where registered_at in period',
    source: 'TAP Postback',
    state: 'Reconciliado',
  });
  const evFtds = buildEvidence({
    label: 'FTDs',
    value: m.ftds.toLocaleString('pt-BR'),
    formula: 'count(persons) where ftd_at in period',
    source: 'TAP Postback',
    state: 'Reconciliado',
  });
  const evCpftd = buildEvidence({
    label: 'CPFTD',
    value: 'R$ ' + m.cpftd.toLocaleString('pt-BR'),
    formula: 'total_spend ÷ ftds',
    source: 'Meta Ads + TikTok Ads',
    state: 'Reconciliado',
    freshness: `período anterior: R$ ${mPrev.cpftd.toLocaleString('pt-BR')}`,
  });

  const sourceColumns = [
    { header: 'Origem', accessorKey: 'source', cell: (r: any) => <span className="text-14 text-eggshell">{r.source}</span> },
    { header: 'Spend', accessorKey: 'spend', className: 'text-right', cell: (r: any) => <span className="font-mono text-13 text-stone tabular-nums">R$ {r.spend.toLocaleString('pt-BR')}</span> },
    { header: 'FTDs', accessorKey: 'ftds', className: 'text-right', cell: (r: any) => <span className="font-mono text-13 text-verified tabular-nums">{r.ftds}</span> },
    { header: 'CPFTD', accessorKey: 'cpftd', className: 'text-right', cell: (r: any) => <span className="font-mono text-13 text-stone tabular-nums">R$ {r.cpftd.toLocaleString('pt-BR')}</span> },
    { header: 'Receita', accessorKey: 'net', className: 'text-right', cell: (r: any) => <span className="font-mono text-13 text-proof-blue tabular-nums">R$ {r.net.toLocaleString('pt-BR')}</span> },
    { header: 'Margem', accessorKey: 'margin_pct', className: 'text-right', cell: (r: any) => (
      <span className={`font-mono text-13 tabular-nums ${r.margin_pct >= 60 ? 'text-verified' : r.margin_pct >= 30 ? 'text-warning' : 'text-critical'}`}>{r.margin_pct}%</span>
    )},
  ];

  const campaignColumns = [
    { header: 'Campanha', accessorKey: 'name', cell: (r: any) => <span className="text-14 text-eggshell">{r.name}</span> },
    { header: 'ID', accessorKey: 'id', cell: (r: any) => <span className="font-mono text-11 text-stone tabular-nums">{r.id}</span> },
    { header: 'FTDs', accessorKey: 'ftds', className: 'text-right', cell: (r: any) => <span className="font-mono text-13 text-verified tabular-nums">{r.ftds}</span> },
    { header: 'CPFTD Est.', accessorKey: 'cpftd', className: 'text-right', cell: (r: any) => <span className="font-mono text-13 text-stone tabular-nums">R$ {r.cpftd.toLocaleString('pt-BR')}</span> },
  ];

  const creativeColumns = [
    { header: 'Criativo', accessorKey: 'name', cell: (r: any) => <span className="text-14 text-eggshell">{r.name}</span> },
    { header: 'FTDs', accessorKey: 'ftds', className: 'text-right', cell: (r: any) => <span className="font-mono text-13 text-verified tabular-nums">{r.ftds}</span> },
    { header: 'CPFTD', accessorKey: 'cpftd', className: 'text-right', cell: (r: any) => <span className="font-mono text-13 text-stone tabular-nums">R$ {r.cpftd.toLocaleString('pt-BR')}</span> },
  ];

  return (
    <AppShell breadcrumb={[{ label: 'Overview' }, { label: 'Analytics' }]}>
      <div className="max-w-7xl mx-auto space-y-6">

        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <div className="text-12 font-serif italic text-stone/80 mb-1">Exploração / Analytics</div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-24 font-bold text-eggshell">Análise operacional</h1>
              <PreviewBadge />
              <StateShowcase />
            </div>
            <p className="text-13 text-stone mt-1">Séries, comparação e drill-down por origem, campanha, criativo e funil.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-12">
            <select
              value={savedView}
              onChange={e => setSavedView(e.target.value)}
              className="bg-graphite border border-line text-eggshell rounded-md px-2 py-1.5 text-12"
            >
              <option value="default">Visão salva: Padrão</option>
              <option value="cpftd">CPFTD por criativo</option>
              <option value="funnel">Funil por origem</option>
            </select>
            <div className="flex rounded-md border border-line overflow-hidden">
              {(['daily', 'hourly'] as Granularity[]).map(g => (
                <button
                  key={g}
                  onClick={() => setGranularity(g)}
                  className={`px-3 py-1.5 text-12 font-mono uppercase tracking-wider ${granularity === g ? 'bg-zinc text-eggshell' : 'text-stone hover:text-eggshell'}`}
                >
                  {g === 'daily' ? 'Diário' : 'Horário'}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCompare(compare === 'off' ? 'prev' : 'off')}
              className={`px-3 py-1.5 rounded-md border border-line text-12 ${compare === 'prev' ? 'bg-proof-blue/15 text-proof-blue border-proof-blue/40' : 'text-stone hover:text-eggshell'}`}
            >
              {compare === 'prev' ? 'Comparando · período anterior' : 'Comparar período anterior'}
            </button>
          </div>
        </header>

        <ScenarioStateGate
          emptyTitle="Sem tráfego no período"
          emptyDescription="Nenhum clique, registro ou FTD chegou dentro do recorte."
          emptyPrerequisite="Verifique se ao menos uma origem (Meta, TAP) está em produção."
        >
          {/* E7 — Faixa de KPIs removida: Analytics começa no gráfico
              (a leitura Nível 1 mora no Command; aqui é exploração). */}

          <div className="bg-graphite border border-line rounded-xl p-4 mt-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
              <h3 className="text-14 font-semibold text-eggshell">
                Cliques, Registros &amp; FTDs — {granularity === 'hourly' ? 'horário' : `últimos ${period}d`}
              </h3>
              <button
                onClick={() => openEvidence(buildEvidence({
                  label: 'Série temporal',
                  value: `${chartData.length} pontos`,
                  formula: `agrupamento ${granularity} · série clicks/regs/ftds`,
                  source: 'Signal Ledger',
                  freshness: 'atualizado há 2m',
                  state: 'Reconciliado',
                }))}
                className="text-11 font-mono uppercase text-stone hover:text-proof-blue"
              >
                ver evidência
              </button>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={chartData}>
                <XAxis dataKey="date" stroke="hsl(var(--stone))" style={{ fontSize: 11 }} />
                <YAxis stroke="hsl(var(--stone))" style={{ fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="clicks" stroke="#7C91FF" fill="#7C91FF" fillOpacity={0.15} name="Cliques" dot={false} />
                <Area type="monotone" dataKey="registros" stroke="#A78BFA" fill="#A78BFA" fillOpacity={0.15} name="Registros" dot={false} />
                <Area type="monotone" dataKey="ftds" stroke="#72E6A6" fill="#72E6A6" fillOpacity={0.15} name="FTDs" dot={false} />
                {compare === 'prev' && (
                  <>
                    <Area type="monotone" dataKey="clicks_prev" stroke="#7C91FF" fill="transparent" strokeDasharray="4 4" name="Cliques (período anterior)" dot={false} />
                    <Area type="monotone" dataKey="ftds_prev" stroke="#72E6A6" fill="transparent" strokeDasharray="4 4" name="FTDs (período anterior)" dot={false} />
                  </>
                )}
                {Object.entries(ANNOTATIONS).map(([d, label]) =>
                  chartData.some(p => p.date === d) ? (
                    <ReferenceLine key={d} x={d} stroke="hsl(var(--warning))" strokeDasharray="2 4" label={{ value: label, fill: 'hsl(var(--warning))', fontSize: 10, position: 'top' }} />
                  ) : null
                )}
              </AreaChart>
            </ResponsiveContainer>
            <div className="mt-3 text-11 text-stone">
              Annotations · <span className="font-mono">{Object.keys(ANNOTATIONS).join(' · ')}</span>
            </div>
          </div>

          <div className="bg-graphite border border-line rounded-xl overflow-hidden mt-6">
            <div className="flex border-b border-line">
              {tabs.map(t => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`px-5 py-3 text-13 font-medium transition-colors ${tab === t.key ? 'text-eggshell border-b-2 border-proof-blue -mb-px' : 'text-stone hover:text-eggshell'}`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="p-4 overflow-x-auto">
              {tab === 'origem' && <DataTable data={sourceData} columns={sourceColumns} />}
              {tab === 'campanha' && <DataTable data={campaignRows} columns={campaignColumns} />}
              {tab === 'criativo' && <DataTable data={creativeRows} columns={creativeColumns} />}
              {tab === 'funil' && (
                <div className="space-y-3">
                  {funnel.map(f => (
                    <div key={f.stage} className="flex items-center gap-3">
                      <div className="w-40 text-13 text-stone shrink-0">{f.stage}</div>
                      <div className="flex-1 h-7 bg-zinc rounded overflow-hidden">
                        <div className="h-full bg-proof-blue rounded" style={{ width: `${(f.count / maxFunnelCount) * 100}%` }} />
                      </div>
                      <div className="w-16 text-right font-mono text-13 text-eggshell tabular-nums">{f.count}</div>
                      <div className="w-14 text-right font-mono text-12 text-stone tabular-nums">{f.pct_prev}%</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </ScenarioStateGate>

      </div>
    </AppShell>
  );
}
