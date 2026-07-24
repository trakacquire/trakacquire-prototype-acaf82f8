import React, { useMemo } from 'react';
import { AppShell, useEvidence } from '@/components/layout/AppShell';
import { PreviewBadge } from '@/components/data/PreviewBadge';
import { FreshnessTag } from '@/components/data/FreshnessTag';
import { MetricValue } from '@/components/data/MetricValue';
import { StatusChip } from '@/components/domain/StatusChip';
import { DataTable, ColumnDef } from '@/components/data/DataTable';
import { ScenarioStateGate, StateShowcase } from '@/components/state/ScenarioStateGate';
import { buildEvidence } from '@/lib/evidence';
import { CAMPAIGNS, PERSONS } from '@/lib/fake/db';
import { useIsMobile } from '@/hooks/use-mobile';

interface CrRow {
  id: string;
  name: string;
  type: 'video' | 'image' | 'carousel';
  campaign: string;
  ftds: number;
  net: number;
  cpftd: number;
  fadigaPct: number; // 0..100, quanto mais alto mais fadigado
  status: 'Confirmed' | 'Captured' | 'Failed';
}

export default function MediaCreativesPage() {
  const { openEvidence } = useEvidence();
  const isMobile = useIsMobile();

  const rows: CrRow[] = useMemo(() => {
    const out: CrRow[] = [];
    CAMPAIGNS.forEach((c, ci) => {
      c.creatives.forEach((cr, i) => {
        const ad = c.ads.find((a) => a.creative_id === cr.id);
        const ps = PERSONS.filter((p) => p.creative_id === cr.id && p.ftd_at);
        const ftds = ps.length;
        const net = Math.round(ps.reduce((s, p) => s + p.net_deposit, 0));
        const cpftd = ftds > 0 ? Math.round((c.budget_daily * 30 / (c.creatives.length || 1)) / ftds) : 0;
        const fadiga = Math.min(100, 20 + (ci * 15 + i * 11) % 70);
        out.push({
          id: cr.id,
          name: cr.name,
          type: cr.type,
          campaign: c.name,
          ftds, net, cpftd, fadigaPct: fadiga,
          status: ftds > 0 ? 'Confirmed' : ad ? 'Captured' : 'Failed',
        });
      });
    });
    return out.sort((a, b) => b.ftds - a.ftds);
  }, []);

  const columns: ColumnDef<CrRow>[] = [
    { header: '#', accessorKey: 'id', cell: (_r, i?: number) => <span className="font-mono text-11 text-stone tabular-nums">#{(i ?? 0) + 1}</span> },
    { header: 'Criativo', accessorKey: 'name', cell: (r) => (
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded flex items-center justify-center text-11 font-mono uppercase ${r.type === 'video' ? 'bg-proof-blue/10 text-proof-blue' : r.type === 'image' ? 'bg-warning/10 text-warning' : 'bg-verified/10 text-verified'}`}>{r.type[0]}</div>
        <div>
          <div className="text-13 font-semibold text-eggshell">{r.name}</div>
          <div className="text-11 font-mono text-stone">{r.campaign}</div>
        </div>
      </div>
    ) },
    { header: 'Status', accessorKey: 'status', cell: (r) => <StatusChip status={r.status} />, className: isMobile ? 'hidden' : '' },
    { header: 'FTDs', accessorKey: 'ftds', cell: (r) => (
      <MetricValue value={r.ftds.toLocaleString('pt-BR')} size="sm" onOpenEvidence={() => openEvidence(buildEvidence({ label: `FTDs · ${r.name}`, value: r.ftds.toLocaleString('pt-BR'), formula: 'count(persons.ftd_at) where creative_id=?', source: 'TAP postback' }))} />
    ), className: 'text-right' },
    { header: 'Net', accessorKey: 'net', cell: (r) => (
      <MetricValue value={`R$ ${r.net.toLocaleString('pt-BR')}`} size="sm" onOpenEvidence={() => openEvidence(buildEvidence({ label: `Net · ${r.name}`, value: `R$ ${r.net.toLocaleString('pt-BR')}`, formula: 'sum(persons.net_deposit)', source: 'TAP + saques' }))} />
    ), className: 'text-right' },
    { header: 'CPFTD', accessorKey: 'cpftd', cell: (r) => (
      <MetricValue value={r.cpftd > 0 ? `R$ ${r.cpftd.toLocaleString('pt-BR')}` : '—'} size="sm" onOpenEvidence={() => openEvidence(buildEvidence({ label: `CPFTD · ${r.name}`, value: `R$ ${r.cpftd.toLocaleString('pt-BR')}`, formula: 'creative_spend / ftds', source: 'Meta/TikTok × TAP' }))} />
    ), className: 'text-right' },
    { header: 'Fadiga', accessorKey: 'fadigaPct', cell: (r) => (
      <div className="flex items-center gap-2 justify-end">
        <div className="w-24 h-1.5 rounded-full bg-zinc overflow-hidden">
          <div className={`h-full ${r.fadigaPct >= 70 ? 'bg-critical' : r.fadigaPct >= 40 ? 'bg-warning' : 'bg-verified'}`} style={{ width: `${r.fadigaPct}%` }} />
        </div>
        <span className="font-mono text-11 text-stone tabular-nums w-10 text-right">{r.fadigaPct}%</span>
      </div>
    ), className: 'text-right' },
  ];

  return (
    <AppShell breadcrumb={[{ label: 'Operate', href: '/media' }, { label: 'Mídia', href: '/media' }, { label: 'Criativos' }]}>
      <div className="max-w-7xl mx-auto space-y-6">
        <header>
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <span className="text-14 font-serif italic text-stone leading-none">Operate · Ranking de criativos</span>
            <PreviewBadge />
            <FreshnessTag ageSeconds={60 * 30} source="Meta/TikTok · frequência 30min" />
            <StateShowcase />
          </div>
          <h1 className="text-eggshell font-sans font-semibold tracking-tight text-24">Ranking por FTD real, com curva de fadiga.</h1>
          <p className="text-stone text-13 mt-2 max-w-xl">Não é CTR bonito. É FTD reconciliado e sinal de fadiga baseado em frequência × CPM × queda de conversão.</p>
        </header>

        <ScenarioStateGate emptyTitle="Sem criativos ativos">
          <DataTable data={rows} columns={columns.map((c) => c.header === '#' ? {
            ...c,
            cell: (r, i) => <span className="font-mono text-11 text-stone tabular-nums">#{(i ?? 0) + 1}</span>,
          } as ColumnDef<CrRow> : c)} />
        </ScenarioStateGate>
      </div>
    </AppShell>
  );
}
