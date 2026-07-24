import React, { useMemo, useState } from 'react';
import { useLocation, Link } from 'wouter';
import { AppShell, useEvidence } from '@/components/layout/AppShell';
import { StatusChip } from '@/components/domain/StatusChip';
import { PreviewBadge } from '@/components/data/PreviewBadge';
import { MetricValue } from '@/components/data/MetricValue';
import { DataTable, ColumnDef } from '@/components/data/DataTable';
import { ScenarioStateGate, StateShowcase } from '@/components/state/ScenarioStateGate';
import { IdentityGraph } from '@/components/data/IdentityGraph';
import { buildEvidence } from '@/lib/evidence';
import { db, Person } from '@/lib/fake/db';
import { useIsMobile } from '@/hooks/use-mobile';


/**
 * Identity Graph — lista de identidades registradas com confiança,
 * método de amarração e status. Piso completo (P3).
 */
export default function IdentityPage() {
  const [, setLocation] = useLocation();
  const { openEvidence } = useEvidence();
  const isMobile = useIsMobile();
  const [tab, setTab] = useState<'grafo' | 'tabela' | 'resolution'>('grafo');

  const persons = useMemo(() => db.persons.filter((p) => p.registered_at), []);
  // H2 · landing = grafo. Pega a identidade com maior sinal (mais tokens amarrados).
  const landingPerson = useMemo(() => {
    const scored = persons.map((p) => ({
      p,
      score: (p.click_id ? 1 : 0) + (p.telegram_id ? 1 : 0) + (p.phone_token ? 1 : 0) + (p.customer_id ? 1 : 0),
    }));
    return scored.sort((a, b) => b.score - a.score)[0]?.p ?? persons[0];
  }, [persons]);
  const totalRegistered = persons.length;
  const avgConfidence = persons.reduce((s, p) => s + p.identity_confidence, 0) / Math.max(1, persons.length);
  const highConfidence = persons.filter((p) => p.identity_confidence > 75).length;
  const orphans = db.persons.filter((p) => p.is_orphan).length;

  const methodBadgeClass = (method?: string) => {
    switch (method) {
      case 'fbclid': return 'bg-proof-blue/10 text-proof-blue border border-proof-blue/20';
      case 'telegram_start': return 'bg-verified/10 text-verified border border-verified/20';
      case 'fingerprint': return 'bg-warning/10 text-warning border border-warning/20';
      default: return 'bg-zinc text-stone border border-line';
    }
  };

  const columns: ColumnDef<Person>[] = [
    {
      header: 'ID',
      accessorKey: 'id',
      cell: (p) => (
        <Link href={`/identity/${p.id}`} className="font-mono text-11 text-proof-blue hover:underline">
          {p.id}
        </Link>
      ),
    },
    {
      header: 'Nome',
      accessorKey: 'name',
      cell: (p) => <span className="text-13 text-eggshell">{p.name}</span>,
    },
    {
      header: 'Sinais',
      accessorKey: 'telegram_id',
      cell: (p) => (
        <div className="flex items-center gap-1 font-mono text-11">
          <span className={p.telegram_id ? 'text-verified' : 'text-stone/40'} title="Telegram">TG</span>
          <span className={p.phone_token ? 'text-verified' : 'text-stone/40'} title="Phone">PH</span>
          <span className={p.customer_id ? 'text-verified' : 'text-stone/40'} title="Customer">CU</span>
        </div>
      ),
      className: isMobile ? 'hidden' : '',
    },
    {
      header: 'Confiança',
      accessorKey: 'identity_confidence',
      cell: (p) => (
        <MetricValue
          value={`${p.identity_confidence}`}
          unit="%"
          size="sm"
          tone={p.identity_confidence > 75 ? 'verified' : p.identity_confidence >= 50 ? 'warning' : 'critical'}
          onOpenEvidence={() => openEvidence(buildEvidence({
            label: `Confiança · ${p.name}`,
            value: `${p.identity_confidence}%`,
            formula: 'weighted_score(click_id, telegram_id, phone_hash, customer_id)',
            source: `Identity resolver · método ${p.identity_method ?? 'manual'}`,
            state: p.identity_confidence > 75 ? 'Reconciliado' : 'Provisório',
          }))}
        />
      ),
      className: 'text-right',
    },
    {
      header: 'Método',
      accessorKey: 'identity_method',
      cell: (p) => (
        <span className={`px-2 py-0.5 rounded text-11 font-medium ${methodBadgeClass(p.identity_method)}`}>
          {p.identity_method ?? 'manual'}
        </span>
      ),
      className: isMobile ? 'hidden' : '',
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (p) => <StatusChip status={p.status} />,
    },
  ];

  return (
    <AppShell breadcrumb={[{ label: 'Observe', href: '/players' }, { label: 'Identity Graph' }]}>
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <span className="kicker">Observe · Identity Graph</span>
            <PreviewBadge />
            <StateShowcase />
          </div>
          <h1 className="text-24 font-semibold text-eggshell font-sans">Cada identidade, sua costura.</h1>
          <p className="text-13 text-stone">{totalRegistered} identidades registradas · costura por click_id, telegram_start ou fingerprint.</p>
        </header>

        <ScenarioStateGate
          emptyTitle="Sem identidades no período"
          emptyDescription="Nenhum cadastro amarrado nas últimas horas."
        >
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <KpiTile
              label="Registradas"
              value={totalRegistered.toLocaleString('pt-BR')}
              onClick={() => openEvidence(buildEvidence({
                label: 'Identidades registradas',
                value: totalRegistered.toString(),
                formula: 'count(persons) where registered_at is not null',
                source: 'Identity Graph',
              }))}
            />
            <KpiTile
              label="Confiança média"
              value={`${avgConfidence.toFixed(1)}%`}
              tone="verified"
              onClick={() => openEvidence(buildEvidence({
                label: 'Confiança média',
                value: `${avgConfidence.toFixed(1)}%`,
                formula: 'avg(persons.identity_confidence)',
                source: 'Identity resolver',
              }))}
            />
            <KpiTile
              label="Alta confiança (>75%)"
              value={highConfidence.toLocaleString('pt-BR')}
              tone="verified"
              onClick={() => openEvidence(buildEvidence({
                label: 'Alta confiança',
                value: highConfidence.toString(),
                formula: 'count(persons) where identity_confidence > 75',
                source: 'Identity resolver',
              }))}
            />
            <KpiTile
              label="Órfãos"
              value={orphans.toLocaleString('pt-BR')}
              tone={orphans > 0 ? 'warning' : 'default'}
              onClick={() => openEvidence(buildEvidence({
                label: 'Identidades órfãs',
                value: orphans.toString(),
                formula: 'count(persons) where is_orphan == true',
                source: 'Identity Graph',
                state: 'Divergente',
              }))}
            />
          </div>

          <DataTable
            data={persons}
            columns={columns}
            onRowClick={(p) => setLocation(`/identity/${p.id}`)}
          />

          {/* Bloco R.3.13 — Tabela de Identity Resolution (complementa o grafo) */}
          <div className="mt-8 bg-graphite border border-line rounded-xl overflow-hidden">
            <div className="p-4 border-b border-line flex items-baseline justify-between">
              <div>
                <h2 className="text-16 font-medium text-eggshell">Identity Resolution</h2>
                <p className="text-12 text-stone mt-0.5">Uma linha por identidade: qual sinal amarrou qual pessoa a qual canal — clique em "Debug" para inspecionar a costura.</p>
              </div>
              <span className="font-mono text-11 text-stone">{persons.length} identidades</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-12">
                <thead>
                  <tr className="border-b border-line">
                    <th className="p-3 text-11 font-mono uppercase text-stone">Identidade</th>
                    <th className="p-3 text-11 font-mono uppercase text-stone">Session</th>
                    <th className="p-3 text-11 font-mono uppercase text-stone">User</th>
                    <th className="p-3 text-11 font-mono uppercase text-stone">Telegram</th>
                    <th className="p-3 text-11 font-mono uppercase text-stone">Canal</th>
                    <th className="p-3 text-11 font-mono uppercase text-stone">Player</th>
                    <th className="p-3 text-11 font-mono uppercase text-stone text-right">Eventos</th>
                    <th className="p-3 text-11 font-mono uppercase text-stone text-right">Debug</th>
                  </tr>
                </thead>
                <tbody>
                  {persons.slice(0, 24).map((p) => {
                    const sessionId = `sess_${p.id.slice(-6)}`;
                    const userId    = p.customer_id ? p.customer_id : '—';
                    const tg        = p.telegram_id ? `@${p.name.split(' ')[0].toLowerCase()}` : '—';
                    const canal     = p.telegram_id ? 'grupo_vip_bra' : p.source === 'tiktok' ? 'tt_bio' : p.source === 'organic' ? 'ig_bio' : 'presell_v2';
                    const player    = p.customer_id ?? '—';
                    const evCount   = db.events.filter((e) => e.person_id === p.id).length;
                    return (
                      <tr key={p.id} className="border-b border-line last:border-0 hover:bg-zinc/40">
                        <td className="p-3 font-mono text-11 text-proof-blue tabular-nums">{p.id}</td>
                        <td className="p-3 font-mono text-11 text-stone tabular-nums">{sessionId}</td>
                        <td className="p-3 font-mono text-11 text-stone tabular-nums">{userId}</td>
                        <td className="p-3 font-mono text-11 text-stone">{tg}</td>
                        <td className="p-3 font-mono text-11 text-stone">{canal}</td>
                        <td className="p-3 font-mono text-11 text-stone tabular-nums">{player}</td>
                        <td className="p-3 font-mono text-12 text-eggshell text-right tabular-nums">{evCount}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => openEvidence(buildEvidence({
                              label: `Debug identity · ${p.name}`,
                              value: `${evCount} evento(s)`,
                              formula: 'trace(events) group by identity_id → session → user → telegram → channel → player',
                              source: `Identity resolver · método ${p.identity_method ?? 'manual'} · confiança ${p.identity_confidence}%`,
                              state: p.identity_confidence > 75 ? 'Reconciliado' : 'Provisório',
                            }))}
                            className="text-11 font-mono uppercase text-stone hover:text-proof-blue"
                          >
                            debug
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </ScenarioStateGate>
      </div>
    </AppShell>
  );
}


function KpiTile({ label, value, tone = 'default', onClick }: {
  label: string; value: string; tone?: 'default' | 'verified' | 'warning' | 'critical'; onClick?: () => void;
}) {
  const cls =
    tone === 'verified' ? 'text-verified'
    : tone === 'warning' ? 'text-warning'
    : tone === 'critical' ? 'text-critical'
    : 'text-eggshell';
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left rounded-xl border border-line bg-graphite hover:border-stone transition-colors p-4"
    >
      <div className="text-11 font-mono uppercase tracking-wider text-stone mb-2">{label}</div>
      <div className={`font-mono tabular-nums text-24 leading-none font-semibold ${cls}`}>{value}</div>
    </button>
  );
}
