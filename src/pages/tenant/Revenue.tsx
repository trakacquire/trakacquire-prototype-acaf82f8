import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { MetricCard } from '@/components/data/MetricCard';
import { db } from '@/lib/fake/db';
import { usePeriod } from '@/lib/context/PeriodContext';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';

export default function RevenuePage() {
  const { period } = usePeriod();
  const m = db.metricsForPeriod(period);

  const depositsSeries = db.dailySeries(period, 'deposits');
  const chartData = depositsSeries.map(pt => ({
    date: pt.date.slice(-5).replace('-', '/'),
    deposits: pt.value,
  }));

  const sourceData = db.revenueBySource(period);

  const tooltipStyle = {
    backgroundColor: 'hsl(var(--zinc))',
    border: '1px solid hsl(var(--line))',
    borderRadius: '8px',
    fontSize: 13,
  };

  return (
    <AppShell breadcrumb={[{ label: 'Revenue' }]}>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* 6 MetricCards: 2 rows × 3 */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <MetricCard label="Receita Bruta" value={'R$ ' + m.gross_deposits.toLocaleString('pt-BR')} />
          <MetricCard label="Deduções" value={'R$ ' + m.withdrawals.toLocaleString('pt-BR')} />
          <MetricCard label="Receita Líquida" value={'R$ ' + m.net_deposits.toLocaleString('pt-BR')} />
          <MetricCard label="Comissões" value={'R$ ' + m.payouts.toLocaleString('pt-BR')} />
          <MetricCard label="Lucro" value={'R$ ' + m.gross_margin.toLocaleString('pt-BR')} />
          <MetricCard label="CPFTD" value={'R$ ' + m.cpftd.toLocaleString('pt-BR')} />
        </div>

        {/* Bar Chart: deposits per day */}
        <div className="bg-graphite border border-line rounded-xl p-4">
          <h3 className="text-14 font-semibold text-eggshell mb-4">Depósitos Diários — últimos {period}d</h3>
          <ResponsiveContainer width="100%" height={256}>
            <BarChart data={chartData}>
              <XAxis dataKey="date" stroke="hsl(var(--stone))" style={{ fontSize: 11 }} />
              <YAxis stroke="hsl(var(--stone))" style={{ fontSize: 11 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="deposits" fill="#7C91FF" radius={[4, 4, 0, 0]} name="Depósitos (R$)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Table: revenue by source */}
        <div className="bg-graphite border border-line rounded-xl p-4 overflow-x-auto">
          <h3 className="text-14 font-semibold text-eggshell mb-4">Receita por Origem</h3>
          <table className="w-full text-left">
            <thead className="border-b border-line">
              <tr>
                <th className="pb-3 text-12 font-bold text-stone uppercase">Origem</th>
                <th className="pb-3 text-12 font-bold text-stone uppercase text-right">Spend</th>
                <th className="pb-3 text-12 font-bold text-stone uppercase text-right">FTDs</th>
                <th className="pb-3 text-12 font-bold text-stone uppercase text-right">CPFTD</th>
                <th className="pb-3 text-12 font-bold text-stone uppercase text-right">Receita Liq.</th>
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
                    <span className={
                      row.margin_pct >= 60 ? 'text-verified' :
                      row.margin_pct >= 30 ? 'text-warning' :
                      'text-critical'
                    }>
                      {row.margin_pct}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </AppShell>
  );
}
