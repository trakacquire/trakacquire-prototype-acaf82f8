import React, { useMemo, useState } from 'react';
import { useLocation, Link } from 'wouter';
import { AppShell, useEvidence } from '@/components/layout/AppShell';
import { PreviewBadge } from '@/components/data/PreviewBadge';
import { FreshnessTag } from '@/components/data/FreshnessTag';
import { MetricValue } from '@/components/data/MetricValue';
import { StatusChip } from '@/components/domain/StatusChip';
import { DataTable, ColumnDef } from '@/components/data/DataTable';
import { ScenarioStateGate, StateShowcase } from '@/components/state/ScenarioStateGate';
import { buildEvidence } from '@/lib/evidence';
import { LINKS, TrackingLink, metricsForPeriod, spendForPeriod } from '@/lib/fake/db';
import { DiagnosticPanel, DiagnosticItem } from '@/components/data/DiagnosticPanel';
import { useIsMobile } from '@/hooks/use-mobile';

const LOOP_LABEL: Record<string, string> = {
  camp_meta_001: 'presell → bot',
  camp_meta_002: 'presell → bot',
  camp_tik_001: 'presell → bot',
  undefined: 'bot → canal',
};

type Row = TrackingLink & { loop: string; cpftd: number; conv: number };

export default function TrackingPage() {
  const [, navigate] = useLocation();
  const { openEvidence } = useEvidence();
  const isMobile = useIsMobile();
  const [loop, setLoop] = useState<'all' | 'presell → bot' | 'bot → canal'>('all');
  const [diagnostic, setDiagnostic] = useState<string | null>(null);

  const totalSpend = spendForPeriod(30).total;
  const totalClicks = LINKS.reduce((s, l) => s + l.unique_clicks, 0) || 1;
  const rows: Row[] = useMemo(() => LINKS.map((l) => {
    const share = l.unique_clicks / totalClicks;
    const cpftd = l.ftds > 0 ? Math.round((totalSpend * share) / l.ftds) : 0;
    const conv = l.clicks > 0 ? (l.ftds / l.clicks) * 100 : 0;
    return { ...l, loop: LOOP_LABEL[l.campaign_id ?? 'undefined'] ?? 'bot → canal', cpftd, conv };
  }), [totalClicks, totalSpend]);

  // Diagnósticos — cor semântica (verified/warning/critical)
  const isSemEvento = (r: Row) => r.clicks === 0;
  const isQueda     = (r: Row) => r.clicks >= 50 && r.conv < 3;
  const isErro      = (r: Row) => r.status === 'archived';
  const isUtmIncompleta = (r: Row) => !r.campaign_id;

  const diagnostics: DiagnosticItem[] = [
    { key: 'sem_evento',  label: 'Sem evento',           description: 'Links criados sem cliques registrados.', count: rows.filter(isSemEvento).length, tone: rows.filter(isSemEvento).length ? 'warning' : 'verified' },
    { key: 'queda_conv',  label: 'Queda de conversão',   description: 'Conv. < 3% com volume mínimo.',          count: rows.filter(isQueda).length,     tone: rows.filter(isQueda).length ? 'warning' : 'verified' },
    { key: 'erro',        label: 'Com erro',             description: 'Links arquivados ou em falha.',           count: rows.filter(isErro).length,      tone: rows.filter(isErro).length ? 'critical' : 'verified' },
    { key: 'utm_incompl', label: 'UTMs incompletas',     description: 'Sem campanha vinculada.',                 count: rows.filter(isUtmIncompleta).length, tone: rows.filter(isUtmIncompleta).length ? 'warning' : 'verified' },
  ];

  const byDiagnostic = (r: Row): boolean => {
    switch (diagnostic) {
      case 'sem_evento':  return isSemEvento(r);
      case 'queda_conv':  return isQueda(r);
      case 'erro':        return isErro(r);
      case 'utm_incompl': return isUtmIncompleta(r);
      default:            return true;
    }
  };

  const filtered = rows
    .filter((r) => loop === 'all' ? true : r.loop === loop)
    .filter(byDiagnostic);
  const m30 = metricsForPeriod(30);

  const columns: ColumnDef<Row>[] = [
    { header: 'Link', accessorKey: 'name', cell: (r) => (
      <div className="flex flex-col">
        <span className="text-13 font-semibold text-eggshell truncate">{r.name}</span>
        <span className="text-11 font-mono text-stone truncate">{r.url}</span>
      </div>
    ) },
    { header: 'Elo', accessorKey: 'loop', cell: (r) => <span className="text-11 font-mono text-eggshell px-2 py-0.5 rounded border border-line bg-zinc/60">{r.loop}</span>, className: isMobile ? 'hidden' : '' },
    { header: 'Status', accessorKey: 'status', cell: (r) => <StatusChip status={r.status === 'active' ? 'Confirmed' : r.status === 'paused' ? 'Captured' : 'Orphan'} /> },
    { header: 'Cliques', accessorKey: 'clicks', cell: (r) => (
      <MetricValue value={r.clicks.toLocaleString('pt-BR')} size="sm" onOpenEvidence={() => openEvidence(buildEvidence({ label: `Cliques · ${r.name}`, value: r.clicks.toLocaleString('pt-BR'), formula: 'count(events.click) where link_id=?', source: 'Signal Ledger' }))} />
    ), className: 'text-right' },
    { header: 'FTDs', accessorKey: 'ftds', cell: (r) => (
      <MetricValue value={r.ftds.toLocaleString('pt-BR')} size="sm" onOpenEvidence={() => openEvidence(buildEvidence({ label: `FTDs · ${r.name}`, value: r.ftds.toLocaleString('pt-BR'), formula: 'count(persons.ftd_at) where first_click.link_id=?', source: 'TAP postback (reconciliado)', state: 'Reconciliado' }))} />
    ), className: 'text-right' },
    { header: 'Conv.', accessorKey: 'conv', cell: (r) => (
      <MetricValue value={`${r.conv.toFixed(1)}%`} size="sm" onOpenEvidence={() => openEvidence(buildEvidence({ label: `Conversão · ${r.name}`, value: `${r.conv.toFixed(1)}%`, formula: 'ftds / clicks', source: 'Signal Ledger + TAP' }))} />
    ), className: 'text-right' },
    { header: 'CPFTD', accessorKey: 'cpftd', cell: (r) => (
      <MetricValue value={r.cpftd > 0 ? `R$ ${r.cpftd.toLocaleString('pt-BR')}` : '—'} size="sm" onOpenEvidence={() => openEvidence(buildEvidence({ label: `CPFTD · ${r.name}`, value: `R$ ${r.cpftd.toLocaleString('pt-BR')}`, formula: '(total_spend × click_share) / ftds', source: 'Meta/TikTok spend × Signal Ledger' }))} />
    ), className: 'text-right' },
  ];

  return (
    <AppShell breadcrumb={[{ label: 'Connect', href: '/integrations' }, { label: 'Tracking &amp; links' }]}>
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span className="kicker">Connect · Tracking &amp; links</span>
              <PreviewBadge />
              <FreshnessTag ageSeconds={90} source="Signal Ledger · edge" />
              <StateShowcase />
            </div>
            <h1 className="text-eggshell font-sans font-semibold tracking-tight text-24">Um link por elo do loop.</h1>
            <p className="text-stone text-13 mt-2 max-w-xl">Cada elo (presell → bot, bot → canal, canal → casa) tem seu link, seu <span className="font-mono text-eggshell">click_id</span> opaco, split A/B, regras por device/geo/hora e snippet de instalação.</p>
          </div>
          <div className="flex gap-2">
            <Link href="/tracking/sources" className="text-13 border border-line rounded-md px-4 py-2 text-stone hover:text-eggshell hover:border-stone">Fontes &amp; custos</Link>
            <button className="bg-eggshell text-ink px-4 py-2 rounded-md font-medium text-13 hover:bg-white">Criar link</button>
          </div>
        </header>

        <ScenarioStateGate emptyTitle="Sem links no período" emptyDescription="Crie o primeiro link para começar a rastrear cliques.">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <KPI label="Cliques (30d)" value={m30.clicks.toLocaleString('pt-BR')} onOpenEvidence={() => openEvidence(buildEvidence({ label: 'Cliques 30d', value: m30.clicks.toLocaleString('pt-BR'), formula: 'metricsForPeriod(30).clicks', source: 'Signal Ledger' }))} />
            <KPI label="FTDs" value={m30.ftds.toLocaleString('pt-BR')} tone="verified" onOpenEvidence={() => openEvidence(buildEvidence({ label: 'FTDs 30d', value: m30.ftds.toLocaleString('pt-BR'), formula: 'metricsForPeriod(30).ftds', source: 'TAP postback (reconciliado)', state: 'Reconciliado' }))} />
            <KPI label="Investimento" value={`R$ ${m30.total_spend.toLocaleString('pt-BR')}`} onOpenEvidence={() => openEvidence(buildEvidence({ label: 'Investimento 30d', value: `R$ ${m30.total_spend.toLocaleString('pt-BR')}`, formula: 'meta_spend + tiktok_spend', source: 'Meta + TikTok spend' }))} />
            <KPI label="CPFTD" value={`R$ ${m30.cpftd.toLocaleString('pt-BR')}`} onOpenEvidence={() => openEvidence(buildEvidence({ label: 'Custo por FTD', value: `R$ ${m30.cpftd.toLocaleString('pt-BR')}`, formula: 'total_spend / ftds', source: 'Command dataset canônico' }))} />
          </div>

          {/* Diagnóstico dos links — clique filtra a tabela */}
          <section className="space-y-2">
            <div className="flex items-baseline justify-between">
              <h3 className="text-14 font-semibold text-eggshell">Diagnóstico</h3>
              <span className="text-11 font-mono text-stone tabular-nums">
                {diagnostic ? 'filtro ativo · clique novamente para limpar' : `${rows.length} links inspecionados`}
              </span>
            </div>
            <DiagnosticPanel items={diagnostics} active={diagnostic} onSelect={setDiagnostic} />
          </section>

          <div className="flex flex-wrap items-center gap-2 bg-graphite border border-line rounded-xl p-3">
            {(['all', 'presell → bot', 'bot → canal'] as const).map((o) => (
              <button key={o} onClick={() => setLoop(o)} className={`text-12 px-3 py-1 rounded-md border ${loop === o ? 'bg-zinc text-eggshell border-line' : 'text-stone border-transparent hover:text-eggshell'}`}>{o === 'all' ? 'Todos os elos' : o}</button>
            ))}
            <span className="ml-auto text-11 font-mono text-stone tabular-nums">{filtered.length} links</span>
          </div>

          <DataTable data={filtered} columns={columns} onRowClick={(r) => navigate(`/tracking/${r.id}`)} />

          <div className="bg-graphite border border-line rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-14 font-semibold text-eggshell">Snippet de instalação (edge)</h3>
              <span className="text-11 font-mono text-stone">1 script · zero cookies terceiros</span>
            </div>
            <pre className="bg-ink border border-line rounded-md p-3 overflow-x-auto text-11 font-mono text-eggshell">
{`<script async src="https://edge.trakacquire.com/t.js" data-tenant="op-br"></script>`}
            </pre>
          </div>
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
