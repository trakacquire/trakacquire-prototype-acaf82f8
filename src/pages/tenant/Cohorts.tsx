import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { db } from '@/lib/fake/db';

export default function CohortsPage() {
  const [tab, setTab] = React.useState<'semana' | 'origem' | 'campanha'>('semana');
  const cohorts = db.cohortData();

  const getPctClass = (pct: number, isZero: boolean): string => {
    if (isZero) return 'text-stone';
    if (pct > 30) return 'bg-verified/15 text-verified';
    if (pct >= 15) return 'bg-proof-blue/15 text-proof-blue';
    return 'text-stone';
  };

  const tabs = [
    { key: 'semana', label: 'Por Semana' },
    { key: 'origem', label: 'Por Origem' },
    { key: 'campanha', label: 'Por Campanha' },
  ] as const;

  // "Por Origem" approximation from revenueBySource
  const originData = db.revenueBySource(30);

  return (
    <AppShell breadcrumb={[{ label: 'Cohorts' }]}>
      <div className="max-w-7xl mx-auto space-y-6">

        <div>
          <h1 className="text-24 font-bold text-eggshell mb-1">Análise de Coortes</h1>
          <p className="text-13 text-stone">Retenção e conversão de jogadores por semana de entrada</p>
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
            {tab === 'semana' && (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-line">
                    <th className="pb-3 pr-4 text-12 font-bold text-stone uppercase">Semana</th>
                    <th className="pb-3 px-3 text-12 font-bold text-stone uppercase text-right">Entradas</th>
                    <th className="pb-3 px-3 text-12 font-bold text-stone uppercase text-center">D0</th>
                    <th className="pb-3 px-3 text-12 font-bold text-stone uppercase text-center">D0%</th>
                    <th className="pb-3 px-3 text-12 font-bold text-stone uppercase text-center">D7</th>
                    <th className="pb-3 px-3 text-12 font-bold text-stone uppercase text-center">D7%</th>
                    <th className="pb-3 px-3 text-12 font-bold text-stone uppercase text-center">D30</th>
                    <th className="pb-3 px-3 text-12 font-bold text-stone uppercase text-center">D30%</th>
                    <th className="pb-3 px-3 text-12 font-bold text-stone uppercase text-right">LTV Médio</th>
                  </tr>
                </thead>
                <tbody>
                  {cohorts.map((row, idx) => {
                    const isRecentD7 = idx >= cohorts.length - 1;
                    const isRecentD30 = idx >= cohorts.length - 4;
                    return (
                      <tr key={row.week} className="border-b border-line hover:bg-zinc transition-colors">
                        <td className="py-2 pr-4 text-13 text-eggshell font-medium">{row.week}</td>
                        <td className="py-2 px-3 font-mono text-13 text-stone text-right">{row.entered}</td>
                        <td className="py-2 px-3 font-mono text-13 text-right">{row.d0}</td>
                        <td className="py-2 px-3">
                          <div className={`text-center text-13 font-mono px-2 py-1 rounded ${getPctClass(row.d0pct, false)}`}>
                            {row.d0pct}%
                          </div>
                        </td>
                        <td className="py-2 px-3 font-mono text-13 text-right">{isRecentD7 && row.d7 === 0 ? <span className="text-stone">—</span> : row.d7}</td>
                        <td className="py-2 px-3">
                          {isRecentD7 && row.d7 === 0 ? (
                            <div className="text-center text-13 text-stone px-2 py-1">—</div>
                          ) : (
                            <div className={`text-center text-13 font-mono px-2 py-1 rounded ${getPctClass(row.d7pct, false)}`}>
                              {row.d7pct}%
                            </div>
                          )}
                        </td>
                        <td className="py-2 px-3 font-mono text-13 text-right">{isRecentD30 && row.d30 === 0 ? <span className="text-stone">—</span> : row.d30}</td>
                        <td className="py-2 px-3">
                          {isRecentD30 && row.d30 === 0 ? (
                            <div className="text-center text-13 text-stone px-2 py-1">—</div>
                          ) : (
                            <div className={`text-center text-13 font-mono px-2 py-1 rounded ${getPctClass(row.d30pct, false)}`}>
                              {row.d30pct}%
                            </div>
                          )}
                        </td>
                        <td className="py-2 px-3 font-mono text-13 text-right text-proof-blue">R$ {row.ltv.toLocaleString('pt-BR')}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

            {tab === 'origem' && (
              <table className="w-full text-left">
                <thead className="border-b border-line">
                  <tr>
                    <th className="pb-3 text-12 font-bold text-stone uppercase">Origem</th>
                    <th className="pb-3 text-12 font-bold text-stone uppercase text-right">FTDs</th>
                    <th className="pb-3 text-12 font-bold text-stone uppercase text-right">Receita</th>
                    <th className="pb-3 text-12 font-bold text-stone uppercase text-right">CPFTD</th>
                    <th className="pb-3 text-12 font-bold text-stone uppercase text-right">Margem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {originData.map(row => (
                    <tr key={row.source} className="hover:bg-zinc transition-colors">
                      <td className="py-3 text-14 text-eggshell">{row.source}</td>
                      <td className="py-3 font-mono text-13 text-verified text-right">{row.ftds}</td>
                      <td className="py-3 font-mono text-13 text-proof-blue text-right">R$ {row.net.toLocaleString('pt-BR')}</td>
                      <td className="py-3 font-mono text-13 text-stone text-right">R$ {row.cpftd.toLocaleString('pt-BR')}</td>
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
                    <th className="pb-3 text-12 font-bold text-stone uppercase text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {db.campaigns.map(c => {
                    const ftds = db.persons.filter(p => p.campaign_id === c.id && p.ftd_at).length;
                    return (
                      <tr key={c.id} className="hover:bg-zinc transition-colors">
                        <td className="py-3 text-14 text-eggshell">{c.name}</td>
                        <td className="py-3 font-mono text-13 text-verified text-right">{ftds}</td>
                        <td className="py-3 text-13 text-right">
                          <span className={c.status === 'active' ? 'text-verified' : 'text-stone'}>{c.status}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="text-12 text-stone text-center">
          Dados reconciliados até ontem 23:59
        </div>

      </div>
    </AppShell>
  );
}
