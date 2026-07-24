import React, { useMemo, useState } from 'react';
import { useLocation } from 'wouter';
import { AppShell, useEvidence } from '@/components/layout/AppShell';
import { PreviewBadge } from '@/components/data/PreviewBadge';
import { FreshnessTag } from '@/components/data/FreshnessTag';
import { ScenarioStateGate, StateShowcase } from '@/components/state/ScenarioStateGate';
import { buildEvidence } from '@/lib/evidence';
import { db } from '@/lib/fake/db';
import { StatusPill, CardFooter, MicroStatRow, type IntegrationPillState } from '@/components/ui/proofline';
import { Search } from 'lucide-react';
import { AppIcon, kindFromIntegrationId } from '@/components/brand/AppIcon';
import type { IntegrationState } from '@/lib/types';

/**
 * Integration Hub — Fase D. Grade por categoria (Revenue providers · Acquisition ·
 * Messaging · Infra · IA), com StatusPill enum-fechado no topo direito do card
 * e CardFooter com adapter version / accounts / ação "Configurar →".
 */
interface IntegrationRow {
  id: string;
  name: string;
  initials: string;
  category: 'Revenue providers' | 'Acquisition' | 'Messaging' | 'Infra' | 'IA';
  state: IntegrationState;
  pill?: IntegrationPillState;
  adapterVersion: string;
  eventType?: string;
  lastEventAt?: string;
  health: number;
  errors24h: number;
  p95: number;
  accounts: number;
  policyAware?: boolean;
  description: string;
}

const CATEGORY_META: Record<IntegrationRow['category'], { title: string; description: string }> = {
  'Revenue providers': { title: 'Revenue providers', description: 'A fonte da verdade financeira. Postback + Reporting API reconciliam a cada 15 min.' },
  'Acquisition':       { title: 'Acquisition',       description: 'Aquisição paga. Cada adapter carrega click_id opaco de volta para o Ledger.' },
  'Messaging':         { title: 'Messaging',         description: 'Canais de conversa. Consentimento validado antes do envio pelo Policy Engine.' },
  'Infra':             { title: 'Infra',             description: 'Peças de infraestrutura — proxies, edge, transporte.' },
  'IA':                { title: 'IA',                description: 'Copiloto e assistentes. Sempre rotulados como sugestão, nunca decisão.' },
};

const CATEGORY_ORDER: IntegrationRow['category'][] = [
  'Revenue providers', 'Acquisition', 'Messaging', 'Infra', 'IA',
];

function lastEventFor(type: string): string | undefined {
  return db.events.find((e) => e.type === type)?.timestamp;
}
function ageAgo(iso?: string): number {
  if (!iso) return 999999;
  return Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
}

function pillFor(state: IntegrationState): IntegrationPillState {
  if (state === 'production' || state === 'pilot') return 'active';
  if (state === 'sandbox' || state === 'disabled') return 'available';
  if (state === 'policy-blocked') return 'restricted';
  return 'error';
}

export default function IntegrationsPage() {
  const [, navigate] = useLocation();
  const { openEvidence } = useEvidence();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'all' | IntegrationRow['category']>('all');
  const [pillFilter, setPillFilter] = useState<'all' | IntegrationPillState>('all');

  const integrations: IntegrationRow[] = useMemo(() => [
    { id: 'tap',        name: 'TAP',                 initials: 'TA', category: 'Revenue providers', state: 'production',     adapterVersion: '2.1.0',      eventType: 'ftd',         lastEventAt: lastEventFor('ftd'),         health: 98.7,  errors24h: 2, p95: 412, accounts: 1, policyAware: true,  description: 'Provedor canônico de FTD e depósitos. Postback S2S + Reporting API.' },
    { id: 'betano',     name: 'Betano',              initials: 'BE', category: 'Revenue providers', state: 'sandbox',        adapterVersion: '1.0.0-rc.3', eventType: 'ftd',         lastEventAt: undefined,                  health: 100,   errors24h: 0, p95: 0,   accounts: 0, description: 'Segunda provedora em avaliação sandbox — 24/38 endpoints certificados.' },
    { id: 'meta',       name: 'Meta CAPI',           initials: 'MC', category: 'Acquisition',       state: 'production',     adapterVersion: '17.0.4',     eventType: 'capi',        lastEventAt: lastEventFor('capi'),        health: 99.2,  errors24h: 0, p95: 187, accounts: 1, policyAware: true,  description: 'Purchase / Lead / Subscribe deduplicados por event_id compartilhado.' },
    { id: 'tiktok',     name: 'TikTok Events',       initials: 'TT', category: 'Acquisition',       state: 'pilot',          adapterVersion: '1.3.2',      eventType: 'click',       lastEventAt: lastEventFor('click'),       health: 97.1,  errors24h: 5, p95: 341, accounts: 1, description: 'Aguardando 7 dias sem erros para promoção a Production.' },
    { id: 'google',     name: 'Google Ads Enhanced', initials: 'GA', category: 'Acquisition',       state: 'disabled',       adapterVersion: '0.9.0',                                lastEventAt: undefined,                  health: 0,     errors24h: 0, p95: 0,   accounts: 0, description: 'Enhanced Conversions parado — falta hash de e-mail habilitado.' },
    { id: 'telegram',   name: 'Telegram Bot',        initials: 'TG', category: 'Messaging',         state: 'production',     adapterVersion: '6.0.1',      eventType: 'bot_message', lastEventAt: lastEventFor('bot_message'), health: 99.9,  errors24h: 0, p95: 96,  accounts: 4, policyAware: true,  description: 'Deep links ?start= carregam click_id. Webhook validado com secret_token.' },
    { id: 'whatsapp',   name: 'WhatsApp Cloud',      initials: 'WA', category: 'Messaging',         state: 'policy-blocked', adapterVersion: '18.0.0',                               lastEventAt: undefined,                  health: 0,     errors24h: 0, p95: 0,   accounts: 0, policyAware: true,  description: 'Bloqueado pelo Policy Engine — política de opt-in ainda em revisão.' },
    { id: 'cloudflare', name: 'Cloudflare Proxy',    initials: 'CF', category: 'Infra',             state: 'production',     adapterVersion: '2024.11',                              lastEventAt: undefined,                  health: 99.98, errors24h: 0, p95: 22,  accounts: 1, description: 'Edge proxy para postbacks e redirects sem vazar UTM.' },
    { id: 'openai',     name: 'OpenAI (Copiloto)',   initials: 'AI', category: 'IA',                state: 'pilot',          adapterVersion: '2025.06',                              lastEventAt: undefined,                  health: 98.2,  errors24h: 1, p95: 812, accounts: 1, description: 'Copiloto operacional. Toda sugestão vai anotada e nunca decide sozinha.' },
  ], []);

  const filtered = integrations.filter((i) => {
    if (category !== 'all' && i.category !== category) return false;
    if (pillFilter !== 'all' && pillFor(i.state) !== pillFilter) return false;
    if (query.trim() && !`${i.name} ${i.category}`.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const grouped = CATEGORY_ORDER
    .map((cat) => ({ cat, items: filtered.filter((i) => i.category === cat) }))
    .filter((g) => g.items.length);

  const totalProd = integrations.filter((i) => i.state === 'production').length;
  const totalErrors = integrations.reduce((s, i) => s + i.errors24h, 0);

  return (
    <AppShell breadcrumb={[{ label: 'Connect', href: '/integrations' }, { label: 'Integrações' }]}>
      <div className="max-w-7xl mx-auto space-y-10 py-10 px-10">
        {/* Header: kicker / título / subtítulo */}
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-6">
          <div className="min-w-0">
            <div className="kicker mb-3">Connect · Integration hub</div>
            <h1 className="page-title">Cada fonte, com estado e adapter version.</h1>
            <p className="page-subtitle mt-2 max-w-2xl">
              O vocabulário é fechado — Ativa · Disponível · Restrita · Erro. Cada card carrega a versão do adapter, o número de contas ligadas e um botão único de ação. Nada de "conectado".
            </p>
            <div className="flex items-center gap-3 mt-4 flex-wrap">
              <PreviewBadge />
              <FreshnessTag ageSeconds={ageAgo(lastEventFor('ftd'))} source="TAP · Meta · Telegram" />
              <StateShowcase />
            </div>
          </div>
          <div className="hidden md:flex flex-col items-end gap-2 shrink-0">
            <span className="micro-label">Em produção · Erros 24h</span>
            <div className="flex items-baseline gap-3">
              <span className="mono-value text-24 text-eggshell tabular-nums leading-none">{totalProd}</span>
              <span className="text-stone">/</span>
              <span className={`mono-value text-24 tabular-nums leading-none ${totalErrors > 0 ? 'text-warning' : 'text-verified'}`}>{totalErrors}</span>
            </div>
          </div>
        </header>

        <ScenarioStateGate emptyTitle="Nenhuma integração configurada" emptyDescription="Comece pela provedora de receita." emptyPrerequisite="Um adapter em Production é pré-requisito para o Signal Ledger.">
          {/* Filtros */}
          <div className="surface-flat rounded-[12px] p-4 grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto_auto] gap-3 items-center">
            <label className="relative">
              <Search className="w-4 h-4 text-stone absolute left-3 top-1/2 -translate-y-1/2" aria-hidden />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar integração ou categoria…"
                className="w-full pl-9 pr-3 py-2 rounded-[8px] surface-inset text-13 text-eggshell placeholder:text-stone/70 focus:outline-none focus:ring-proof"
              />
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="rounded-[8px] surface-inset px-3 py-2 text-13 text-eggshell focus:outline-none focus:ring-proof"
            >
              <option value="all">Todos os tipos</option>
              {CATEGORY_ORDER.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select
              value={pillFilter}
              onChange={(e) => setPillFilter(e.target.value as any)}
              className="rounded-[8px] surface-inset px-3 py-2 text-13 text-eggshell focus:outline-none focus:ring-proof"
            >
              <option value="all">Todos os status</option>
              <option value="active">Ativa</option>
              <option value="available">Disponível</option>
              <option value="restricted">Restrita</option>
              <option value="error">Erro</option>
            </select>
          </div>

          {/* Grade agrupada por categoria */}
          <div className="space-y-10">
            {grouped.map(({ cat, items }) => {
              const meta = CATEGORY_META[cat];
              return (
                <section key={cat}>
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-4 mb-5">
                    <div className="min-w-0">
                      <h2 className="card-title text-eggshell">{meta.title}</h2>
                      <p className="card-body mt-1 max-w-2xl">{meta.description}</p>
                    </div>
                    <span className="mono-value text-stone tabular-nums text-13 shrink-0">{items.length} {items.length === 1 ? 'disponível' : 'disponíveis'}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((i) => {
                      const isActive = i.state === 'production' || i.state === 'pilot';
                      return (
                        <button
                          key={i.id}
                          type="button"
                          onClick={() => navigate(`/integrations/${i.id}`)}
                          className={`text-left rounded-[12px] p-6 surface-flat transition-colors hover:ring-hairline-strong focus:outline-none focus:ring-proof ${isActive ? 'ring-hairline-strong' : ''}`}
                        >
                          <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] gap-3 items-start">
                            <AppIcon kind={kindFromIntegrationId(i.id)} initials={i.initials} ariaLabel={i.name} />
                            <div className="min-w-0">
                              <div className="card-title truncate">{i.name}</div>
                              <div className="text-11 text-stone mt-0.5 truncate">{i.category}</div>
                            </div>
                            <StatusPill state={i.pill ?? pillFor(i.state)} />
                          </div>
                          <p className="card-body mt-4 line-clamp-2">{i.description}</p>
                          <MicroStatRow
                            items={[
                              { label: 'Adapter', value: `v${i.adapterVersion}` },
                              { label: 'Contas', value: i.accounts, tone: i.accounts > 0 ? 'default' : 'default' },
                              i.policyAware ? { label: 'Policy', value: 'aware', tone: 'proof' as const } : null,
                            ].filter(Boolean) as any}
                          />
                          <CardFooter
                            meta={i.state === 'production'
                              ? <>Saúde <span className="text-verified">{i.health.toFixed(1)}%</span> · P95 {i.p95}ms</>
                              : i.state === 'sandbox' ? 'Sandbox · aguardando promoção'
                              : i.state === 'policy-blocked' ? 'Bloqueado pelo Policy Engine'
                              : i.state === 'disabled' ? 'Desativado' : 'Piloto'}
                            actionLabel={isActive ? 'Configurar' : 'Ativar'}
                            onAction={() => {
                              openEvidence(buildEvidence({
                                label: `${i.name} · ${i.category}`,
                                value: `estado ${i.state} · v${i.adapterVersion}`,
                                formula: 'catalog(integrations) filter id',
                                source: 'Integration Registry',
                                state: isActive ? 'Reconciliado' : 'Provisório',
                              }));
                              navigate(`/integrations/${i.id}`);
                            }}
                          />
                        </button>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        </ScenarioStateGate>
      </div>
    </AppShell>
  );
}
