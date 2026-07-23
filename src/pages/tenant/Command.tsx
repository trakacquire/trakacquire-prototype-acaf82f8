import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { MetricCard } from '@/components/data/MetricCard';
import { StatusChip } from '@/components/domain/StatusChip';
import { db } from '@/lib/fake/db';
import { usePeriod } from '@/lib/context/PeriodContext';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { ChevronRight } from 'lucide-react';

export default function CommandPage() {
  const { period } = usePeriod();
  const m = db.metricsForPeriod(period);
  const prevM = db.metricsForPeriod(period * 2);

  const ftdDelta = prevM.ftds > 0
    ? ((m.ftds - prevM.ftds / 2) / (prevM.ftds / 2) * 100).toFixed(1) + '%'
    : '—';
  const ftdTrend = prevM.ftds > 0 && m.ftds > prevM.ftds / 2 ? 'up' : 'down';

  // Merge clicks and ftds daily series
  const clicksSeries = db.dailySeries(period, 'clicks');
  const ftdsSeries = db.dailySeries(period, 'ftds');
  const chartData = clicksSeries.map((pt, i) => ({
    date: pt.date.slice(-5).replace('-', '/'),
    clicks: pt.value,
    ftds: ftdsSeries[i]?.value ?? 0,
  }));

  // JourneyStrip counts from db.persons
  const statusCounts: Record<string, number> = {};
  for (const p of db.persons) {
    statusCounts[p.status] = (statusCounts[p.status] ?? 0) + 1;
  }
  const journeyStages = [
    { label: 'Captured', colorClass: 'text-proof-blue border-proof-blue/30 bg-proof-blue/10' },
    { label: 'Linked', colorClass: 'text-proof-blue border-proof-blue/30 bg-proof-blue/10' },
    { label: 'Confirmed', colorClass: 'text-eggshell border-line bg-zinc' },
    { label: 'Reconciled', colorClass: 'text-verified border-verified/30 bg-verified/10' },
    { label: 'Divergent', colorClass: 'text-warning border-warning/30 bg-warning/10' },
  ];

  // Funnel bars
  const funnel = db.funnelData(period);
  const maxCount = Math.max(...funnel.map(f => f.count), 1);

  // LiveFeed: first 15 events
  const liveFeed = db.events.slice(0, 15).map(e => ({
    id: e.id,
    label: `${e.type}: ${e.person_id}`,
    timestamp: e.timestamp,
    status: e.status,
  }));

  const tooltipStyle = {
    backgroundColor: 'hsl(var(--zinc))',
    border: '1px solid hsl(var(--line))',
    borderRadius: '8px',
    fontSize: 13,
  };

  return (
    <AppShell breadcrumb={[{ label: 'Command' }]}>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* 4 MetricCards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard label="Cliques" value={m.clicks.toLocaleString('pt-BR')} />
          <MetricCard label="Registros" value={m.registrations.toLocaleString('pt-BR')} />
          <MetricCard label="FTDs" value={m.ftds.toLocaleString('pt-BR')} delta={{ value: ftdDelta, trend: ftdTrend }} />
          <MetricCard label="CPFTD" value={'R$ ' + m.cpftd.toLocaleString('pt-BR')} />
        </div>

        {/* Area Chart */}
        <div className="bg-graphite border border-line rounded-xl p-4">
          <h3 className="text-14 font-semibold text-eggshell mb-4">Cliques &amp; FTDs — últimos {period}d</h3>
          <ResponsiveContainer width="100%" height={224}>
            <AreaChart data={chartData}>
              <XAxis dataKey="date" stroke="hsl(var(--stone))" style={{ fontSize: 11 }} />
              <YAxis stroke="hsl(var(--stone))" style={{ fontSize: 11 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="clicks" stroke="#7C91FF" fill="#7C91FF" fillOpacity={0.15} name="Cliques" dot={false} />
              <Area type="monotone" dataKey="ftds" stroke="#72E6A6" fill="#72E6A6" fillOpacity={0.15} name="FTDs" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* JourneyStrip */}
        <div className="bg-graphite border border-line rounded-xl p-4 flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-0 w-full overflow-x-auto">
          {journeyStages.map((stage, idx) => (
            <React.Fragment key={stage.label}>
              <div className="flex flex-col flex-1 min-w-[120px] px-2 first:pl-0 last:pr-0">
                <div className="text-11 font-mono text-stone uppercase mb-1">{stage.label}</div>
                <div className={`px-3 py-2 rounded-lg border flex items-baseline justify-between ${stage.colorClass}`}>
                  <span className="text-18 font-mono font-bold tabular-nums">{statusCounts[stage.label] ?? 0}</span>
                  <StatusChip status={stage.label as any} className="ml-2 hidden" />
                </div>
              </div>
              {idx < journeyStages.length - 1 && (
                <div className="hidden md:flex items-center justify-center px-1 text-line">
                  <ChevronRight className="w-4 h-4" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Funnel mini */}
        <div className="bg-graphite border border-line rounded-xl p-4">
          <h3 className="text-14 font-semibold text-eggshell mb-4">Funil de Aquisição</h3>
          <div className="space-y-2">
            {funnel.map(f => (
              <div key={f.stage} className="flex items-center gap-3">
                <div className="w-32 text-13 text-stone shrink-0">{f.stage}</div>
                <div className="flex-1 h-6 bg-zinc rounded overflow-hidden">
                  <div
                    className="h-full bg-proof-blue rounded"
                    style={{ width: `${(f.count / maxCount) * 100}%` }}
                  />
                </div>
                <div className="w-16 text-right font-mono text-13 text-eggshell tabular-nums">{f.count}</div>
                <div className="w-12 text-right font-mono text-12 text-stone">{f.pct_prev}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* LiveFeed */}
        <div className="bg-graphite border border-line rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-line flex items-center justify-between bg-iron">
            <h3 className="text-14 font-semibold text-eggshell flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-verified animate-pulse" />
              Live Proof Feed
            </h3>
            <span className="text-11 font-mono text-stone">últimos {period}d</span>
          </div>
          <div className="divide-y divide-line">
            {liveFeed.map(evt => (
              <div key={evt.id} className="p-3 hover:bg-zinc transition-colors flex items-center justify-between gap-3">
                <span className="font-mono text-12 text-stone w-24 shrink-0">{evt.timestamp.slice(11, 19)}</span>
                <span className="text-13 text-eggshell flex-1 truncate">{evt.label}</span>
                <StatusChip status={evt.status} />
              </div>
            ))}
          </div>
        </div>

      </div>
    </AppShell>
  );
}
