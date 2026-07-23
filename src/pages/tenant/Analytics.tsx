import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { MetricCard } from '@/components/data/MetricCard';
import { StatusChip } from '@/components/domain/StatusChip';
import { db } from '@/lib/fake/db';
import { usePeriod } from '@/lib/context/PeriodContext';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

export default function AnalyticsPage() {
  const { period } = usePeriod();
  const m = db.metricsForPeriod(period);
  const [tab, setTab] = React.useState<'origem' | 'campanha' | 'criativo' | 'funil'>('origem');

  // Merge 3 series by date
  const clicksSeries = db.dailySeries(period, 'clicks');
  const regsSeries = db.dailySeries(period, 'registrations');
  const ftdsSeries = db.dailySeries(period, 'ftds');
  const chartData = clicksSeries.map((pt, i) => ({
    date: pt.date.slice(-5).replace('-', '/'),
    clicks: pt.value,
    registros: regsSeries[i]?.value ?? 0,
    ftds: ftdsSeries[i]?.value ?? 0,
  }));

  const tooltipStyle = {
    backgroundColor: 'hsl(var(--zinc))',
    border: '1px solid hsl(var(--line))',
    borderRadius: '8px',
    fontSize: 13,
  };

  // Tab data
  const sourceData = db.revenueBySource(period);

  // Campanha tab: group persons by campaign_id
  const campaignMap: Record<string, { name: string; ftds: number; spend: number }> = {};
  for (const p of db.persons) {
    if (p.campaign_id && p.ftd_at) {
      if (!campaignMap[p.campaign_id]) {
        const camp = db.campaigns.find(c => c.id === p.campaign_id);
        campaignMap[p.campaign_id] = { name: camp?.name ?? p.campaign_id, ftds: 0, spend: 0 };
      }
      campaignMap[p.campaign_id].ftds++;
    }
  }
  const campaignRows = Object.entries(campaignMap).map(([id, data]) => {
    const spend = db.spendForPeriod(period);
    const spendAmt = id.startsWith('camp_meta') ? Math.round(spend.meta * (data.ftds / Math.max(1, m.ftds))) : Math.round(spend.tiktok * (data.ftds / Math.max(1, m.ftds)));
    return { ...data, id, cpftd: data.ftds > 0 ? Math.round(spendAmt / data.ftds) : 0 };
  });

  // Criativo tab: group persons by creative_id
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

  // Funil tab
  const funnel = db.funnelData(period);
  const maxFunnelCount = Math.max(...funnel.map(f => f.count), 1);

  const tabs = [
    { key: 'origem', label: 'Origem' },
    { key: 'campanha', label: 'Campanha' },
    { key: 'criativo', label: 'Criativo' },
    { key: 'funil', label: 'Funil' },
  ] as const;

  return (
    <AppShell breadcrumb={[{ label: 'Analytics' }]}>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* 4 MetricCards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard label="Cliques" value={m.clicks.toLocaleString('pt-BR')} />
          <MetricCard label="Registros" value={m.registrations.toLocaleString('pt-BR')} />
          <MetricCard label="FTDs" value={m.ftds.toLocaleString('pt-BR')} />
          <MetricCard label="CPFTD" value={'R$ ' + m.cpftd.toLocaleString('pt-BR')} />
        </div>

        {/* Area Chart */}
        <div className="bg-graphite border border-line rounded-xl p-4">
          <h3 className="text-14 font-semibold text-eggshell mb-4">Cliques, Registros &amp; FTDs — últimos {period}d</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={chartData}>
              <XAxis dataKey="date" stroke="hsl(var(--stone))" style={{ fontSize: 11 }} />
              <YAxis stroke="hsl(var(--stone))" style={{ fontSize: 11 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="clicks" stroke="#7C91FF" fill="#7C91FF" fillOpacity={0.15} name="Cliques" dot={false} />
              <Area type="monotone" dataKey="registros" stroke="#A78BFA" fill="#A78BFA" fillOpacity={0.15} name="Registros" dot={false} />
              <Area type="monotone" dataKey="ftds" stroke="#72E6A6" fill="#72E6A6" fillOpacity={0.15} name="FTDs" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Tabs */}
        <div className="bg-graphite border border-line rounded-xl overflow-hidden">
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
            {tab === 'origem' && (
              <table className="w-full text-left">
                <thead className="border-b border-line">
                  <tr>
                    <th className="pb-3 text-12 font-bold text-stone uppercase">Origem</th>
                    <th className="pb-3 text-12 font-bold text-stone uppercase text-right">Spend</th>
                    <th className="pb-3 text-12 font-bold text-stone uppercase text-right">FTDs</th>
                    <th className="pb-3 text-12 font-bold text-stone uppercase text-right">CPFTD</th>
                    <th className="pb-3 text-12 font-bold text-stone uppercase text-right">Receita</th>
                    <th className="pb-3 text-12 font-bold text-stone uppercase text-right">Margem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {sourceData.map(row => (
                    <tr key={row.source} className="hover:bg-zinc transition-colors">
                      <td className="py-3 text-14 text-eggshell">{row.source}</td>
                      <td className="py-3 font-mono text-13 text-stone text-right">R$ {row.spend.toLocaleString('pt-BR')}</td>
                      <td className="py-3 font-mono text-13 text-verified text-right">{row.ftds}</td>
                      <td className="py-3 font-mono text-13 text-stone text-right">R$ {row.cpftd.toLocaleString('pt-BR')}</td>
                      <td className="py-3 font-mono text-13 text-proof-blue text-right">R$ {row.net.toLocaleString('pt-BR')}</td>
                      <td className="py-3 font-mono text-13 text-right">
                        <span className={row.margin_pct >= 60 ? 'text-verified' : row.margin_pct >= 30 ? 'text-warning' : 'text-critical'}>
                          {row.margin_pct}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {tab === 'campanha' && (
              <table className="w-full text-left">
                <thead className="border-b border-line">
                  <tr>
                    <th className="pb-3 text-12 font-bold text-stone uppercase">Campanha</th>
                    <th className="pb-3 text-12 font-bold text-stone uppercase text-right">FTDs</th>
                    <th className="pb-3 text-12 font-bold text-stone uppercase text-right">CPFTD Est.</th>
                    <th className="pb-3 text-12 font-bold text-stone uppercase text-right">ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {campaignRows.map(row => (
                    <tr key={row.id} className="hover:bg-zinc transition-colors">
                      <td className="py-3 text-14 text-eggshell">{row.name}</td>
                      <td className="py-3 font-mono text-13 text-verified text-right">{row.ftds}</td>
                      <td className="py-3 font-mono text-13 text-stone text-right">R$ {row.cpftd.toLocaleString('pt-BR')}</td>
                      <td className="py-3 font-mono text-11 text-stone text-right">{row.id}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {tab === 'criativo' && (
              <table className="w-full text-left">
                <thead className="border-b border-line">
                  <tr>
                    <th className="pb-3 text-12 font-bold text-stone uppercase">Criativo</th>
                    <th className="pb-3 text-12 font-bold text-stone uppercase text-right">FTDs</th>
                    <th className="pb-3 text-12 font-bold text-stone uppercase text-right">CPFTD</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {creativeRows.map(row => (
                    <tr key={row.id} className="hover:bg-zinc transition-colors">
                      <td className="py-3 text-14 text-eggshell">{row.name}</td>
                      <td className="py-3 font-mono text-13 text-verified text-right">{row.ftds}</td>
                      <td className="py-3 font-mono text-13 text-stone text-right">R$ {row.cpftd.toLocaleString('pt-BR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {tab === 'funil' && (
              <div className="space-y-3">
                {funnel.map(f => (
                  <div key={f.stage} className="flex items-center gap-3">
                    <div className="w-36 text-13 text-stone shrink-0">{f.stage}</div>
                    <div className="flex-1 h-7 bg-zinc rounded overflow-hidden">
                      <div
                        className="h-full bg-proof-blue rounded"
                        style={{ width: `${(f.count / maxFunnelCount) * 100}%` }}
                      />
                    </div>
                    <div className="w-16 text-right font-mono text-13 text-eggshell tabular-nums">{f.count}</div>
                    <div className="w-14 text-right font-mono text-12 text-stone">{f.pct_prev}%</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </AppShell>
  );
}
