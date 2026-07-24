import React from 'react';
import { AppShell, useEvidence } from '@/components/layout/AppShell';
import { PreviewBadge } from '@/components/data/PreviewBadge';
import { MetricCard } from '@/components/data/MetricCard';
import { ScenarioStateGate, StateShowcase } from '@/components/state/ScenarioStateGate';
import { buildEvidence } from '@/lib/evidence';
import { db } from '@/lib/fake/db';

export default function CohortsPage() {
  const [tab, setTab] = React.useState<'semana' | 'origem' | 'campanha'>('semana');
  const cohorts = db.cohortData();
  const { openEvidence } = useEvidence();

  const totalEntered = cohorts.reduce((s, c) => s + c.entered, 0);
  const totalD30 = cohorts.reduce((s, c) => s + c.d30, 0);
  const avgLtv = Math.round(cohorts.reduce((s, c) => s + c.ltv, 0) / Math.max(1, cohorts.length));

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

  const originData = db.revenueBySource(30);

  return (
    <AppShell breadcrumb={[{ label: 'Prove' }, { label: 'Receita', href: '/revenue' }, { label: 'Coortes' }]}>
      <div className="max-w-7xl mx-auto space-y-6">

        <header>
          <div className="text-12 font-serif italic text-stone/80 mb-1">Prove / Coortes</div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-24 font-bold text-eggshell">Análise de coortes</h1>
            <PreviewBadge />
            <StateShowcase />
          </div>
          <p className="text-13 text-stone mt-1">Retenção e LTV por semana de entrada — soma bate com FTDs canônicos.</p>
        </header>

        <ScenarioStateGate
          emptyTitle="Sem coortes no recorte"
          emptyDescription="Nenhuma semana com jogadores registrados no período consultado."
          emptyPrerequisite="Aguarde a próxima janela de reconciliação ou amplie o período."
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard label="Registros (6 semanas)" value={totalEntered.toLocaleString('pt-BR')} evidenceData={buildEvidence({
              label: 'Registros nas 6 coortes',
              value: totalEntered,
              formula: 'sum(cohort.entered) across 6 weeks',
              source: 'TAP Postback',
              state: 'Reconciliado',
            })} />
            <MetricCard label="FTDs D30" value={totalD30.toLocaleString('pt-BR')} evidenceData={buildEvidence({
              label: 'FTDs até D30',
              value: totalD30,
              formula: 'sum(cohort.d30) where cohort_age >= 30d',
              source: 'Ledger derivado',
              state: 'Reconciliado',
            })} />
            <MetricCard label="LTV médio" value={'R$ ' + avgLtv.toLocaleString('pt-BR')} evidenceData={buildEvidence({
              label: 'LTV médio por coorte',
              value: 'R$ ' + avgLtv,
              formula: 'avg(cohort.ltv) across 6 weeks',
              source: 'Ledger derivado',
              state: 'Reconciliado',
            })} />
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
                      <th className="pb-3 px-3 text-12 font-bold text-stone uppercase text-right">LTV</th>
                      <th className="pb-3 px-3 text-12 font-bold text-stone uppercase text-right">Evidência</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cohorts.map((row, idx) => {
                      const isRecentD7 = idx >= cohorts.length - 1;
                      const isRecentD30 = idx >= cohorts.length - 4;
                      return (
                        <tr key={row.week} className="border-b border-line hover:bg-zinc transition-colors">
                          <td className="py-2 pr-4 text-13 text-eggshell font-medium tabular-nums">{row.week}</td>
                          <td className="py-2 px-3 font-mono text-13 text-stone text-right tabular-nums">{row.entered}</td>
                          <td className="py-2 px-3 font-mono text-13 text-right tabular-nums">{row.d0}</td>
                          <td className="py-2 px-3">
                            <div className={`text-center text-13 font-mono px-2 py-1 rounded tabular-nums ${getPctClass(row.d0pct, false)}`}>{row.d0pct}%</div>
                          </td>
                          <td className="py-2 px-3 font-mono text-13 text-right tabular-nums">{isRecentD7 && row.d7 === 0 ? <span className="text-stone">—</span> : row.d7}</td>
                          <td className="py-2 px-3">
                            {isRecentD7 && row.d7 === 0 ? (
                              <div className="text-center text-13 text-stone px-2 py-1">—</div>
                            ) : (
                              <div className={`text-center text-13 font-mono px-2 py-1 rounded tabular-nums ${getPctClass(row.d7pct, false)}`}>{row.d7pct}%</div>
                            )}
                          </td>
                          <td className="py-2 px-3 font-mono text-13 text-right tabular-nums">{isRecentD30 && row.d30 === 0 ? <span className="text-stone">—</span> : row.d30}</td>
                          <td className="py-2 px-3">
                            {isRecentD30 && row.d30 === 0 ? (
                              <div className="text-center text-13 text-stone px-2 py-1">—</div>
                            ) : (
                              <div className={`text-center text-13 font-mono px-2 py-1 rounded tabular-nums ${getPctClass(row.d30pct, false)}`}>{row.d30pct}%</div>
                            )}
                          </td>
                          <td className="py-2 px-3 font-mono text-13 text-right text-proof-blue tabular-nums">R$ {row.ltv.toLocaleString('pt-BR')}</td>
                          <td className="py-2 px-3 text-right">
                            <button
                              onClick={() => openEvidence(buildEvidence({
                                label: `Coorte ${row.week}`,
                                value: `${row.entered} → ${row.d30} FTD D30`,
                                formula: 'FTDs onde ftd_at ≤ registered_at + N dias',
                                source: 'TAP Postback',
                                state: 'Reconciliado',
                              }))}
                              className="text-11 font-mono uppercase text-stone hover:text-proof-blue"
                            >
                              ver
                            </button>
                          </td>
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
                        <td className="py-3 font-mono text-13 text-verified text-right tabular-nums">{row.ftds}</td>
                        <td className="py-3 font-mono text-13 text-proof-blue text-right tabular-nums">R$ {row.net.toLocaleString('pt-BR')}</td>
                        <td className="py-3 font-mono text-13 text-stone text-right tabular-nums">R$ {row.cpftd.toLocaleString('pt-BR')}</td>
                        <td className="py-3 font-mono text-13 text-right tabular-nums">
                          <span className={row.margin_pct >= 60 ? 'text-verified' : row.margin_pct >= 30 ? 'text-warning' : 'text-critical'}>{row.margin_pct}%</span>
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
                          <td className="py-3 font-mono text-13 text-verified text-right tabular-nums">{ftds}</td>
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

          <div className="text-12 text-stone text-center">Dados reconciliados até ontem 23:59</div>
        </ScenarioStateGate>

      </div>
    </AppShell>
  );
}
