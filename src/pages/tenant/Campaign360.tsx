import React, { useMemo, useState } from 'react';
import { useParams, Link } from 'wouter';
import { AppShell, useEvidence } from '@/components/layout/AppShell';
import { PreviewBadge } from '@/components/data/PreviewBadge';
import { FreshnessTag } from '@/components/data/FreshnessTag';
import { MetricValue } from '@/components/data/MetricValue';
import { StatusChip } from '@/components/domain/StatusChip';
import { ScenarioStateGate, StateShowcase } from '@/components/state/ScenarioStateGate';
import { buildEvidence } from '@/lib/evidence';
import { CAMPAIGNS, PERSONS, spendForPeriod } from '@/lib/fake/db';
import { ChevronRight, ChevronDown } from 'lucide-react';

interface ActionPlan {
  id: string;
  title: string;
  hypothesis: string;
  expected: string;
  risk: 'baixo' | 'médio' | 'alto';
  status: 'pending' | 'approved' | 'rejected';
}

export default function Campaign360Page() {
  const params = useParams<{ id: string }>();
  const { openEvidence } = useEvidence();
  const campaign = CAMPAIGNS.find((c) => c.id === params.id) ?? CAMPAIGNS[0];
  const [expanded, setExpanded] = useState<Set<string>>(new Set(campaign.adsets.map((a) => a.id)));
  const [plans, setPlans] = useState<ActionPlan[]>([
    { id: 'plan-1', title: 'Pausar adset "Retargeting 30d"', hypothesis: 'CPFTD 2.1× acima da média há 5d.', expected: '−R$ 40/dia · +2 FTDs realocados', risk: 'baixo', status: 'pending' },
    { id: 'plan-2', title: 'Aumentar orçamento "Lookalike 1% BR"', hypothesis: 'ROAS 3.4x consistente há 12d.', expected: '+R$ 60/dia · +8 FTDs projetados', risk: 'médio', status: 'pending' },
  ]);

  const totalSpend = spendForPeriod(30);
  const share = campaign.budget_daily / CAMPAIGNS.filter((c) => c.source === campaign.source).reduce((s, c) => s + c.budget_daily, 0);
  const spend30 = Math.round((campaign.source === 'meta' ? totalSpend.meta : totalSpend.tiktok) * share);
  const ps = PERSONS.filter((p) => p.campaign_id === campaign.id && p.ftd_at);
  const ftds = ps.length;
  const net = Math.round(ps.reduce((s, p) => s + p.net_deposit, 0));
  const cpftd = ftds > 0 ? Math.round(spend30 / ftds) : 0;
  const roi = spend30 > 0 ? Math.round(((net - spend30) / spend30) * 100) : 0;

  // Platform mock metrics
  const cpm = campaign.source === 'meta' ? 12.4 : 8.7;
  const ctr = campaign.source === 'meta' ? 1.8 : 2.4;

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  };

  const decide = (id: string, decision: 'approved' | 'rejected') => {
    setPlans((prev) => prev.map((p) => p.id === id ? { ...p, status: decision } : p));
  };

  return (
    <AppShell breadcrumb={[{ label: 'Operate', href: '/media' }, { label: 'Mídia', href: '/media' }, { label: campaign.name }]}>
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span className="text-14 font-serif italic text-stone leading-none">Operate · Campanha 360</span>
              <PreviewBadge />
              <StatusChip status={campaign.status === 'active' ? 'Confirmed' : 'Captured'} />
              <FreshnessTag ageSeconds={60 * 45} source={`${campaign.source === 'meta' ? 'Meta' : 'TikTok'} Ads · snapshot 45min`} />
              <StateShowcase />
            </div>
            <h1 className="text-eggshell font-sans font-semibold tracking-tight text-24">{campaign.name}</h1>
            <p className="text-stone text-13 mt-2 max-w-xl">Métricas da plataforma × TrakAcquire, lado a lado. Cada ação sugerida abre um <span className="font-mono text-eggshell">ApprovalCard</span> imutável.</p>
          </div>
        </header>

        <ScenarioStateGate emptyTitle="Sem atividade nesta campanha">
          {/* Cross-side KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-graphite border border-line rounded-xl p-5">
              <div className="text-11 font-mono uppercase tracking-wider text-stone mb-3">{campaign.source === 'meta' ? 'Meta Ads' : 'TikTok Ads'}</div>
              <div className="grid grid-cols-3 gap-3">
                <KPI label="Spend" value={`R$ ${spend30.toLocaleString('pt-BR')}`} onOpenEvidence={() => openEvidence(buildEvidence({ label: 'Spend', value: `R$ ${spend30.toLocaleString('pt-BR')}`, formula: 'source_spend × budget_share', source: `${campaign.source} Ads` }))} />
                <KPI label="CPM" value={`R$ ${cpm.toFixed(2)}`} onOpenEvidence={() => openEvidence(buildEvidence({ label: 'CPM', value: `R$ ${cpm.toFixed(2)}`, formula: 'spend / impressions × 1000', source: `${campaign.source} Ads` }))} />
                <KPI label="CTR" value={`${ctr.toFixed(2)}%`} onOpenEvidence={() => openEvidence(buildEvidence({ label: 'CTR', value: `${ctr.toFixed(2)}%`, formula: 'clicks / impressions', source: `${campaign.source} Ads` }))} />
              </div>
            </div>
            <div className="bg-graphite border border-line rounded-xl p-5">
              <div className="text-11 font-mono uppercase tracking-wider text-stone mb-3">TrakAcquire (reconciliado)</div>
              <div className="grid grid-cols-4 gap-3">
                <KPI label="FTDs" value={ftds.toLocaleString('pt-BR')} tone="verified" onOpenEvidence={() => openEvidence(buildEvidence({ label: 'FTDs', value: ftds.toLocaleString('pt-BR'), formula: 'count(persons.ftd_at) where campaign_id=?', source: 'TAP postback', state: 'Reconciliado' }))} />
                <KPI label="CPFTD" value={cpftd > 0 ? `R$ ${cpftd.toLocaleString('pt-BR')}` : '—'} onOpenEvidence={() => openEvidence(buildEvidence({ label: 'CPFTD', value: `R$ ${cpftd.toLocaleString('pt-BR')}`, formula: 'spend / ftds', source: 'Cross' }))} />
                <KPI label="Net" value={`R$ ${net.toLocaleString('pt-BR')}`} onOpenEvidence={() => openEvidence(buildEvidence({ label: 'Net deposit', value: `R$ ${net.toLocaleString('pt-BR')}`, formula: 'sum(persons.net_deposit)', source: 'TAP + saques' }))} />
                <KPI label="ROI" value={`${roi}%`} tone={roi >= 0 ? 'verified' : 'critical'} onOpenEvidence={() => openEvidence(buildEvidence({ label: 'ROI', value: `${roi}%`, formula: '(net - spend) / spend', source: 'P&L' }))} />
              </div>
            </div>
          </div>

          {/* Árvore campanha → adset → ad */}
          <div className="bg-graphite border border-line rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-line flex items-center justify-between">
              <h3 className="text-14 font-semibold text-eggshell">Estrutura</h3>
              <span className="text-11 font-mono text-stone">{campaign.adsets.length} adsets · {campaign.ads.length} anúncios</span>
            </div>
            <div className="divide-y divide-line">
              {campaign.adsets.map((ads) => {
                const ads_ads = campaign.ads.filter((a) => a.adset_id === ads.id);
                const open = expanded.has(ads.id);
                return (
                  <div key={ads.id}>
                    <button onClick={() => toggle(ads.id)} className="w-full flex items-center justify-between px-5 py-3 hover:bg-iron">
                      <div className="flex items-center gap-3">
                        {open ? <ChevronDown className="w-4 h-4 text-stone" /> : <ChevronRight className="w-4 h-4 text-stone" />}
                        <span className="text-13 font-semibold text-eggshell">{ads.name}</span>
                        <span className="text-11 font-mono text-stone">R$ {ads.budget_daily}/dia</span>
                      </div>
                      <span className="text-11 font-mono text-stone">{ads_ads.length} anúncios</span>
                    </button>
                    {open && (
                      <div className="bg-ink/40 divide-y divide-line/60">
                        {ads_ads.map((ad) => {
                          const cr = campaign.creatives.find((c) => c.id === ad.creative_id);
                          return (
                            <div key={ad.id} className="pl-14 pr-5 py-2 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`w-6 h-6 rounded flex items-center justify-center text-10 font-mono uppercase ${cr?.type === 'video' ? 'bg-proof-blue/10 text-proof-blue' : cr?.type === 'image' ? 'bg-warning/10 text-warning' : 'bg-verified/10 text-verified'}`}>{cr?.type[0] ?? '?'}</div>
                                <span className="text-12 text-eggshell">{ad.name}</span>
                              </div>
                              <Link href="/media/creatives" className="text-11 font-mono text-proof-blue hover:underline">Ver ranking →</Link>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action plans */}
          <div className="space-y-3">
            <h3 className="text-14 font-semibold text-eggshell">Action plans (aguardando dono)</h3>
            {plans.map((p) => (
              <div key={p.id} className={`bg-graphite border rounded-xl p-4 ${p.status === 'approved' ? 'border-verified/30' : p.status === 'rejected' ? 'border-critical/30' : 'border-line'}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-13 font-semibold text-eggshell">{p.title}</span>
                      <StatusChip status={p.status === 'approved' ? 'Confirmed' : p.status === 'rejected' ? 'Failed' : 'Captured'} />
                      <span className={`text-11 font-mono px-2 py-0.5 rounded border ${p.risk === 'baixo' ? 'text-verified border-verified/30' : p.risk === 'médio' ? 'text-warning border-warning/30' : 'text-critical border-critical/30'}`}>risco {p.risk}</span>
                    </div>
                    <p className="text-12 text-stone mt-1">{p.hypothesis}</p>
                    <p className="text-12 text-eggshell mt-1 font-mono">Impacto: {p.expected}</p>
                  </div>
                  {p.status === 'pending' && (
                    <div className="flex flex-col gap-2 shrink-0">
                      <button onClick={() => decide(p.id, 'approved')} className="text-11 border border-verified/30 text-verified rounded-md px-3 py-1 hover:bg-verified/10">Aprovar</button>
                      <button onClick={() => decide(p.id, 'rejected')} className="text-11 border border-critical/30 text-critical rounded-md px-3 py-1 hover:bg-critical/10">Rejeitar</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScenarioStateGate>
      </div>
    </AppShell>
  );
}

function KPI({ label, value, tone = 'default', onOpenEvidence }: { label: string; value: string; tone?: 'default' | 'verified' | 'warning' | 'critical'; onOpenEvidence?: () => void }) {
  const cls = tone === 'verified' ? 'text-verified' : tone === 'warning' ? 'text-warning' : tone === 'critical' ? 'text-critical' : 'text-eggshell';
  return (
    <button type="button" onClick={onOpenEvidence} className="text-left rounded-md border border-line/60 bg-zinc/40 hover:border-stone transition-colors p-3">
      <div className="text-10 font-mono uppercase tracking-wider text-stone mb-1">{label}</div>
      <div className={`font-mono tabular-nums text-16 leading-none font-semibold ${cls}`}>{value}</div>
    </button>
  );
}
