import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { DataTable } from '@/components/data/DataTable';
import { StatusChip } from '@/components/domain/StatusChip';
import { db } from '@/lib/fake/db';
import type { EventStatus } from '@/lib/fake/db';

const fmtMoney = (v: number) =>
  'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const SOURCE_ICON: Record<string, string> = {
  meta: '📘',
  tiktok: '🎵',
  organic: '🌱',
  orphan: '👻',
};

export default function TrackingSourcesPage() {
  // Build source data dynamically from db
  const srcData = [
    {
      source: 'meta',
      label: 'Meta Ads',
      persons: db.persons.filter(p => p.source === 'meta'),
      links: db.links.filter(l =>
        db.persons.filter(p => p.source === 'meta').some(p => p.campaign_id === l.campaign_id)
      ),
    },
    {
      source: 'tiktok',
      label: 'TikTok Ads',
      persons: db.persons.filter(p => p.source === 'tiktok'),
      links: db.links.filter(l =>
        db.persons.filter(p => p.source === 'tiktok').some(p => p.campaign_id === l.campaign_id)
      ),
    },
    {
      source: 'organic',
      label: 'Orgânico',
      persons: db.persons.filter(p => p.source === 'organic'),
      links: [],
    },
    {
      source: 'orphan',
      label: 'Órfãos',
      persons: db.persons.filter(p => p.is_orphan),
      links: [],
    },
  ];

  // Summary table rows
  const summaryRows = srcData.map(s => {
    const ftdsCount = s.persons.filter(p => p.ftd_at).length;
    // Estimate spend for this source (meta/tiktok from spendForPeriod, others 0)
    const spend30 = s.source === 'meta'
      ? db.spendForPeriod(30).meta
      : s.source === 'tiktok'
      ? db.spendForPeriod(30).tiktok
      : 0;
    const cpftd = ftdsCount > 0 ? spend30 / ftdsCount : 0;
    const activeLinks = s.links.filter(l => l.status === 'active').length;
    const chipStatus: EventStatus = s.source === 'orphan' ? 'Orphan' : 'Confirmed';
    return {
      label: s.label,
      source: s.source,
      pessoas: s.persons.length,
      ftds: ftdsCount,
      linksAtivos: activeLinks,
      cpftd,
      chipStatus,
    };
  });

  const summaryCols = [
    {
      header: 'Origem',
      accessorKey: 'label' as const,
      cell: (r: typeof summaryRows[0]) => (
        <div className="flex items-center gap-2">
          <span className="text-18">{SOURCE_ICON[r.source] ?? '•'}</span>
          <span className="text-14 font-medium text-[var(--eggshell)]">{r.label}</span>
        </div>
      ),
    },
    {
      header: 'Pessoas',
      accessorKey: 'pessoas' as const,
      cell: (r: typeof summaryRows[0]) => (
        <span className="font-mono text-13">{r.pessoas.toLocaleString('pt-BR')}</span>
      ),
    },
    {
      header: 'FTDs',
      accessorKey: 'ftds' as const,
      cell: (r: typeof summaryRows[0]) => (
        <span className="font-mono text-13 text-[var(--verified)]">{r.ftds}</span>
      ),
    },
    {
      header: 'Links Ativos',
      accessorKey: 'linksAtivos' as const,
      cell: (r: typeof summaryRows[0]) => (
        <span className="font-mono text-13">{r.linksAtivos}</span>
      ),
    },
    {
      header: 'CPFTD',
      accessorKey: 'cpftd' as const,
      cell: (r: typeof summaryRows[0]) => (
        <span className="font-mono text-13">
          {r.cpftd > 0 ? fmtMoney(r.cpftd) : '—'}
        </span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'chipStatus' as const,
      cell: (r: typeof summaryRows[0]) => <StatusChip status={r.chipStatus} />,
    },
  ];

  // Links table
  type LinkRow = typeof db.links[0];

  const linkCols = [
    {
      header: 'ID',
      accessorKey: 'id' as const,
      cell: (l: LinkRow) => (
        <span className="font-mono text-12 text-[var(--stone)]">{l.id}</span>
      ),
    },
    {
      header: 'Nome',
      accessorKey: 'name' as const,
      cell: (l: LinkRow) => (
        <span className="text-14 text-[var(--eggshell)]">{l.name}</span>
      ),
    },
    {
      header: 'URL',
      accessorKey: 'url' as const,
      cell: (l: LinkRow) => (
        <span className="font-mono text-12 text-[var(--proof-blue)] truncate max-w-[180px] block">{l.url}</span>
      ),
    },
    {
      header: 'Cliques',
      accessorKey: 'clicks' as const,
      cell: (l: LinkRow) => (
        <span className="font-mono text-13">{l.clicks.toLocaleString('pt-BR')}</span>
      ),
    },
    {
      header: 'Registros',
      accessorKey: 'registrations' as const,
      cell: (l: LinkRow) => (
        <span className="font-mono text-13">{l.registrations.toLocaleString('pt-BR')}</span>
      ),
    },
    {
      header: 'FTDs',
      accessorKey: 'ftds' as const,
      cell: (l: LinkRow) => (
        <span className="font-mono text-13 text-[var(--verified)]">{l.ftds}</span>
      ),
    },
    {
      header: 'Criado',
      accessorKey: 'created_at' as const,
      cell: (l: LinkRow) => (
        <span className="text-13 text-[var(--stone)]">
          {new Date(l.created_at).toLocaleDateString('pt-BR')}
        </span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status' as const,
      cell: (l: LinkRow) => {
        const s =
          l.status === 'active' ? 'Confirmed'
          : l.status === 'paused' ? 'Divergent'
          : 'Orphan';
        return <StatusChip status={s as any} />;
      },
    },
  ];

  // Cards for each source
  return (
    <AppShell breadcrumb={[{ label: 'Rastreamento', href: '/tracking' }, { label: 'Origens' }]}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page title */}
        <div>
          <h1 className="text-24 font-bold text-[var(--eggshell)] mb-1">Origens de Rastreamento</h1>
          <p className="text-13 text-[var(--stone)]">Distribuição de pessoas, FTDs e links por origem de tráfego</p>
        </div>

        {/* Source cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {srcData.map(s => {
            const ftdsCount = s.persons.filter(p => p.ftd_at).length;
            const spend30 = s.source === 'meta'
              ? db.spendForPeriod(30).meta
              : s.source === 'tiktok'
              ? db.spendForPeriod(30).tiktok
              : 0;
            const cpftd = ftdsCount > 0 ? spend30 / ftdsCount : 0;
            return (
              <div key={s.source} className="bg-[var(--graphite)] border border-[var(--line)] rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-20">{SOURCE_ICON[s.source] ?? '•'}</span>
                  <span className="text-14 font-medium text-[var(--eggshell)]">{s.label}</span>
                </div>
                <div className="flex justify-between text-13">
                  <span className="text-[var(--stone)]">Pessoas</span>
                  <span className="font-mono text-[var(--eggshell)]">{s.persons.length.toLocaleString('pt-BR')}</span>
                </div>
                <div className="flex justify-between text-13">
                  <span className="text-[var(--stone)]">FTDs</span>
                  <span className="font-mono text-[var(--verified)]">{ftdsCount}</span>
                </div>
                <div className="flex justify-between text-13">
                  <span className="text-[var(--stone)]">CPFTD</span>
                  <span className="font-mono text-[var(--eggshell)]">{cpftd > 0 ? fmtMoney(cpftd) : '—'}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary table */}
        <div>
          <h2 className="text-16 font-medium text-[var(--eggshell)] mb-3">Resumo por Origem</h2>
          <DataTable data={summaryRows} columns={summaryCols} searchPlaceholder="Filtrar origens..." />
        </div>

        {/* All links table */}
        <div>
          <h2 className="text-16 font-medium text-[var(--eggshell)] mb-3">Links de Rastreamento</h2>
          {db.links.length > 0 ? (
            <DataTable data={db.links} columns={linkCols} searchPlaceholder="Buscar links..." />
          ) : (
            <div className="bg-[var(--graphite)] border border-[var(--line)] rounded-xl py-12 text-center">
              <p className="text-14 text-[var(--stone)]">Nenhum link de rastreamento cadastrado.</p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
