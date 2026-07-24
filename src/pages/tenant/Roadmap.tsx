import React, { useMemo } from 'react';
import { Link } from 'wouter';
import { AppShell } from '@/components/layout/AppShell';
import { PreviewBadge } from '@/components/data/PreviewBadge';
import { ExternalLink } from 'lucide-react';
import { ROUTE_REGISTRY, routesByGroup, REGISTRY_COUNT, type RouteEntry, type RouteStatus } from '@/lib/routes/registry';

/**
 * Roadmap vivo — Fase G.2.
 *
 * Consome src/lib/routes/registry.ts como fonte única. Não mantém lista
 * paralela. Se uma rota some daqui, sumiu do produto.
 */

const STATUS_META: Record<RouteStatus, { label: string; cls: string }> = {
  verde:    { label: 'Verde',    cls: 'bg-verified/10 text-verified border-verified/25' },
  amarelo:  { label: 'Amarelo',  cls: 'bg-warning/10 text-warning border-warning/25' },
  vermelho: { label: 'Vermelho', cls: 'bg-critical/10 text-critical border-critical/25' },
  redirect: { label: 'Redirect', cls: 'bg-proof-blue-soft/10 text-proof-blue-soft border-proof-blue-soft/25' },
};

function StatusPill({ s }: { s: RouteStatus }) {
  const m = STATUS_META[s];
  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-11 font-mono uppercase tracking-wider ${m.cls}`}>
      {m.label}
    </span>
  );
}

function Row({ r }: { r: RouteEntry }) {
  return (
    <li>
      <Link
        href={r.exampleHref}
        className="flex items-center gap-4 px-5 py-2.5 hover:bg-zinc/40 transition-colors group"
      >
        <span className="flex-1 min-w-0">
          <span className="block text-13 text-eggshell truncate">{r.label}</span>
          {r.note && <span className="block text-11 text-stone/80 truncate">{r.note}</span>}
        </span>
        <span className="hidden lg:inline font-mono text-11 text-stone/70 truncate w-56">{r.path}</span>
        <span className="hidden md:inline font-mono text-11 text-stone/80 tabular-nums w-12 text-right">{r.phase}</span>
        <StatusPill s={r.status} />
        <ExternalLink className="w-3.5 h-3.5 text-stone group-hover:text-eggshell" />
      </Link>
    </li>
  );
}

export default function RoadmapPage() {
  const groups = useMemo(() => routesByGroup(), []);
  const counts = useMemo(() => {
    const c = { verde: 0, amarelo: 0, vermelho: 0, redirect: 0 };
    for (const r of ROUTE_REGISTRY) c[r.status]++;
    return c;
  }, []);
  const pctGreen = Math.round((counts.verde / REGISTRY_COUNT) * 100);

  return (
    <AppShell breadcrumb={[{ label: 'Em construção' }]}>
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="pt-2">
          <div className="text-11 font-mono uppercase tracking-[0.18em] text-stone mb-3">
            Proofline · Roadmap vivo · gerado do route-registry
          </div>
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <h1 className="text-eggshell tracking-tight leading-[1.02]" style={{ fontSize: 'clamp(30px, 3.4vw, 44px)' }}>
              Mapa de rotas.
            </h1>
            <PreviewBadge />
          </div>
          <p className="text-stone text-14 max-w-2xl">
            Toda rota do protótipo mora aqui. A regra é a mesma:{' '}
            <span className="text-eggshell">
              a página só entra na sidebar quando sua linha na matriz{' '}
              <span className="font-mono">CONFORMANCE.md</span> está verde.
            </span>{' '}
            Fonte única: <span className="font-mono text-eggshell">src/lib/routes/registry.ts</span>.
          </p>

          {/* Placar */}
          <div className="mt-5 grid grid-cols-2 md:grid-cols-5 gap-2">
            <div className="rounded-lg border border-line bg-graphite/60 px-3 py-2">
              <div className="text-11 uppercase tracking-wider text-stone">Total</div>
              <div className="font-mono tabular-nums text-18 text-eggshell">{REGISTRY_COUNT}</div>
            </div>
            <div className="rounded-lg border border-verified/30 bg-verified/5 px-3 py-2">
              <div className="text-11 uppercase tracking-wider text-verified">Verde</div>
              <div className="font-mono tabular-nums text-18 text-eggshell">{counts.verde} <span className="text-11 text-stone">· {pctGreen}%</span></div>
            </div>
            <div className="rounded-lg border border-warning/30 bg-warning/5 px-3 py-2">
              <div className="text-11 uppercase tracking-wider text-warning">Amarelo</div>
              <div className="font-mono tabular-nums text-18 text-eggshell">{counts.amarelo}</div>
            </div>
            <div className="rounded-lg border border-critical/30 bg-critical/5 px-3 py-2">
              <div className="text-11 uppercase tracking-wider text-critical">Vermelho</div>
              <div className="font-mono tabular-nums text-18 text-eggshell">{counts.vermelho}</div>
            </div>
            <div className="rounded-lg border border-proof-blue-soft/30 bg-proof-blue-soft/5 px-3 py-2">
              <div className="text-11 uppercase tracking-wider text-proof-blue-soft">Redirect</div>
              <div className="font-mono tabular-nums text-18 text-eggshell">{counts.redirect}</div>
            </div>
          </div>
        </header>

        <div className="space-y-6">
          {groups.map(({ group, entries }) => (
            entries.length === 0 ? null : (
              <section key={group} className="bg-graphite border border-line rounded-xl overflow-hidden">
                <div className="flex flex-wrap items-baseline justify-between gap-3 px-5 py-4 border-b border-line bg-iron/40">
                  <div>
                    <div className="flex items-baseline gap-3">
                      <span className="text-11 font-mono uppercase tracking-[0.18em] text-stone">Grupo</span>
                      <h2 className="text-16 font-medium text-eggshell">{group}</h2>
                    </div>
                    <p className="text-12 text-stone mt-1">{entries.length} rota{entries.length === 1 ? '' : 's'}.</p>
                  </div>
                </div>
                <ul className="divide-y divide-line/60">
                  {entries.map((r) => <Row key={r.path} r={r} />)}
                </ul>
              </section>
            )
          ))}
        </div>

        <p className="text-11 font-mono text-stone/70 pt-2">
          Fonte: <span className="text-eggshell">src/lib/routes/registry.ts</span> · CONFORMANCE.md · DECISIONS.md (D1) · UI-SYSTEM.md · PRODUCT-MAP.md.
        </p>
      </div>
    </AppShell>
  );
}
