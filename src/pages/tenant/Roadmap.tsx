import React from 'react';
import { Link } from 'wouter';
import { AppShell } from '@/components/layout/AppShell';
import { PreviewBadge } from '@/components/data/PreviewBadge';
import { ExternalLink } from 'lucide-react';

/**
 * Roadmap vivo do protótipo.
 * Regra: página só entra na sidebar quando a linha dela na matriz
 * CONFORMANCE.md está verde. Enquanto não estiver, mora aqui.
 */

type PageRow = {
  title: string;
  href: string;
  matrix: string; // resumo do estado (ex.: "3/9")
  note?: string;
};

type PhaseGroup = {
  phase: string;
  title: string;
  status: 'em-andamento' | 'planejada' | 'concluida';
  scope: string;
  pages: PageRow[];
};

const GROUPS: PhaseGroup[] = [
  {
    phase: 'P2',
    title: 'Signal Ledger + Observe',
    status: 'em-andamento',
    scope: 'Signal Ledger, Live Events, Monitoring, Reconciliation, EventDetail',
    pages: [
      { title: 'Eventos ao vivo', href: '/live', matrix: 'na sidebar', note: 'promovida na P2' },
      { title: 'Signal Ledger', href: '/ledger', matrix: 'na sidebar', note: 'promovida na P2' },
      { title: 'Monitoring & DLQ', href: '/monitoring', matrix: '2/9', note: 'oculto até fechar 8 estados + evidence' },
      { title: 'Reconciliação', href: '/revenue/reconciliation', matrix: '2/9' },
      { title: 'Event Detail', href: '/ledger/evt_1', matrix: '2/9' },
      { title: 'Saúde CAPI (Signals)', href: '/signals', matrix: '3/9' },
    ],
  },
  {
    phase: 'P3',
    title: 'Identity + Players',
    status: 'planejada',
    scope: 'Grafo de identidade e 360º de jogadores',
    pages: [
      { title: 'Grafo de identidade', href: '/identity', matrix: '1/9' },
      { title: 'Identity Detail', href: '/identity/p_001', matrix: '1/9' },
      { title: 'Player 360', href: '/players/p_001', matrix: '1/9' },
    ],
  },
  {
    phase: 'P4',
    title: 'Analytics + Revenue + Reports',
    status: 'planejada',
    scope: 'Coortes, relatórios, receita e governança',
    pages: [
      { title: 'Coortes', href: '/revenue/cohorts', matrix: '1/9' },
      { title: 'Relatórios', href: '/reports', matrix: '1/9' },
      { title: 'Report Detail', href: '/reports/r_1', matrix: '1/9' },
    ],
  },
  {
    phase: 'P5',
    title: 'Connect',
    status: 'planejada',
    scope: '360º de domínios, links, integrações, campanhas e mídia',
    pages: [
      { title: 'Domain 360', href: '/domains/d_1', matrix: '1/9' },
      { title: 'Link 360', href: '/tracking/l_1', matrix: '1/9' },
      { title: 'Fontes de tracking', href: '/tracking/sources', matrix: '1/9' },
      { title: 'Integration 360', href: '/integrations/tap', matrix: '1/9' },
      { title: 'Setup TAP', href: '/integrations/tap', matrix: '1/9' },
      { title: 'Setup Meta CAPI', href: '/integrations/meta', matrix: '1/9' },
      { title: 'Setup Telegram', href: '/integrations/telegram', matrix: '1/9' },
      { title: 'Campanha 360', href: '/media/camp_1', matrix: '1/9' },
      { title: 'Media Creatives', href: '/media/creatives', matrix: '1/9' },
    ],
  },
  {
    phase: 'P6',
    title: 'Operate',
    status: 'planejada',
    scope: 'Flow builder, segmentos, broadcasts, inbox, aprovações',
    pages: [
      { title: 'Flow Builder', href: '/automations/f_1', matrix: '1/9' },
      { title: 'Segmentos', href: '/segments', matrix: '1/9' },
      { title: 'Broadcasts', href: '/broadcasts', matrix: '1/9' },
      { title: 'Caixa de entrada', href: '/inbox', matrix: '1/9' },
      { title: 'Inbox Settings', href: '/inbox/settings', matrix: '1/9' },
      { title: 'Aprovações', href: '/approvals', matrix: '1/9' },
    ],
  },
  {
    phase: 'P7',
    title: 'Público + Settings',
    status: 'planejada',
    scope: 'Login, signup, pricing, docs, status, legal, settings, perfil',
    pages: [
      { title: 'Login', href: '/login', matrix: '1/9' },
      { title: 'Signup', href: '/signup', matrix: '1/9' },
      { title: 'Pricing', href: '/pricing', matrix: '1/9' },
      { title: 'Docs', href: '/docs', matrix: '1/9' },
      { title: 'Status (público)', href: '/status', matrix: '1/9' },
      { title: 'Legal — Termos', href: '/legal/termos', matrix: '1/9' },
      { title: 'Legal — Privacidade', href: '/legal/privacidade', matrix: '1/9' },
      { title: 'Legal — DPA', href: '/legal/dpa', matrix: '1/9' },
      { title: 'Legal — Subprocessadores', href: '/legal/subprocessadores', matrix: '1/9' },
      { title: 'Settings — Time', href: '/settings/team', matrix: '1/9' },
      { title: 'Settings — Billing', href: '/settings/billing', matrix: '1/9' },
      { title: 'Settings — API', href: '/settings/api', matrix: '1/9' },
      { title: 'Settings — Notificações', href: '/settings/notifications', matrix: '1/9' },
      { title: 'Settings — Auditoria', href: '/settings/audit', matrix: '1/9' },
    ],
  },
  {
    phase: 'P8',
    title: 'Super Admin (identidade visual)',
    status: 'planejada',
    scope: 'Só re-estilização visual — sem reestruturação',
    pages: [
      { title: 'Platform Command', href: '/platform', matrix: '1/9' },
      { title: 'Platform Tenants', href: '/platform/tenants', matrix: '1/9' },
      { title: 'Platform Usage', href: '/platform/usage', matrix: '1/9' },
      { title: 'Platform Incidents', href: '/platform/incidents', matrix: '1/9' },
      { title: 'Platform Status', href: '/platform/status', matrix: '1/9' },
      { title: 'Platform AI Cost', href: '/platform/ai/cost', matrix: '1/9' },
    ],
  },
];

function StatusChipRoadmap({ status }: { status: PhaseGroup['status'] }) {
  const cls =
    status === 'em-andamento'
      ? 'bg-proof-blue/10 text-proof-blue border-proof-blue/25'
      : status === 'concluida'
        ? 'bg-verified/10 text-verified border-verified/25'
        : 'bg-zinc text-stone border-line';
  const label = status === 'em-andamento' ? 'Em andamento' : status === 'concluida' ? 'Concluída' : 'Planejada';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-11 font-mono uppercase tracking-wider ${cls}`}>
      {label}
    </span>
  );
}

export default function RoadmapPage() {
  return (
    <AppShell breadcrumb={[{ label: 'Em construção' }]}>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header editorial */}
        <header className="pt-2">
          <div className="text-11 font-mono uppercase tracking-[0.18em] text-stone mb-3">
            Proofline · Roadmap vivo
          </div>
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <h1
              className="text-eggshell font-serif tracking-tight leading-[1.02]"
              style={{ fontSize: 'clamp(30px, 3.4vw, 44px)' }}
            >
              Em construção.
            </h1>
            <PreviewBadge />
          </div>
          <p className="text-stone text-14 max-w-2xl">
            Toda tela fora da navegação principal mora aqui. A regra é simples:{' '}
            <span className="text-eggshell">a página só entra na sidebar quando sua linha na matriz{' '}
              <span className="font-mono">CONFORMANCE.md</span> está verde
            </span>. A navegação cresce com a qualidade — nunca antes.
          </p>
        </header>

        <div className="space-y-6">
          {GROUPS.map((g) => (
            <section key={g.phase} className="bg-graphite border border-line rounded-xl overflow-hidden">
              <div className="flex flex-wrap items-baseline justify-between gap-3 px-5 py-4 border-b border-line bg-iron/40">
                <div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-11 font-mono uppercase tracking-[0.18em] text-stone">Fase</span>
                    <span className="font-mono text-13 text-eggshell tabular-nums">{g.phase}</span>
                    <h2 className="text-16 font-medium text-eggshell">{g.title}</h2>
                  </div>
                  <p className="text-12 text-stone mt-1">{g.scope}</p>
                </div>
                <StatusChipRoadmap status={g.status} />
              </div>

              <ul className="divide-y divide-line/60">
                {g.pages.map((p) => (
                  <li key={p.href + p.title}>
                    <Link
                      href={p.href}
                      className="flex items-center gap-4 px-5 py-2.5 hover:bg-zinc/40 transition-colors group"
                    >
                      <span className="flex-1 text-13 text-eggshell truncate">{p.title}</span>
                      <span className="hidden md:inline font-mono text-11 text-stone truncate">{p.href}</span>
                      <span className="font-mono text-11 text-stone/80 tabular-nums w-16 text-right">{p.matrix}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-stone group-hover:text-eggshell" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <p className="text-11 font-mono text-stone/70 pt-2">
          Fonte da verdade: <span className="text-eggshell">CONFORMANCE.md</span> · DECISIONS.md (D1) · UI-SYSTEM.md · PRODUCT-MAP.md.
        </p>
      </div>
    </AppShell>
  );
}
