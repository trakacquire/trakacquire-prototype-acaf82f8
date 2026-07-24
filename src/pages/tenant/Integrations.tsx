import React, { useMemo, useState } from 'react';
import { useLocation } from 'wouter';
import { AppShell, useEvidence } from '@/components/layout/AppShell';
import { ScenarioStateGate } from '@/components/state/ScenarioStateGate';
import { useDemoScenario } from '@/components/domain/ScenarioSelector';

import { buildEvidence } from '@/lib/evidence';
import { db } from '@/lib/fake/db';
import { StatusPill, type IntegrationPillState } from '@/components/ui/proofline';
import { ArrowRight, Search } from 'lucide-react';
import { AppIcon, kindFromIntegrationId } from '@/components/brand/AppIcon';
import type { IntegrationState } from '@/lib/types';

/**
 * Integration Hub — fidelidade final (reference/preview-3.html).
 *
 * Anatomia do card (idêntica à referência):
 *   linha 1 · AppIcon 42px  ·······  StatusPill (sentence-case)
 *   linha 2 · nome COMPLETO  (15px / 600)
 *   linha 3 · descrição stone 12px, até 2 linhas
 *   rodapé · hairline · meta à esquerda (versão · contas · policy)
 *                     · ação à direita ("Abrir →" | "Configurar →" |
 *                                       "Conectar →" | "Revisar →")
 *
 * Health / P95 / erros ficam SÓ no title (tooltip nativo) — nunca no rodapé.
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
  'Revenue providers': { title: 'Revenue providers', description: 'Cadastros, FTDs, depósitos e payout oficial.' },
  'Acquisition':       { title: 'Acquisition',       description: 'Custos, campanhas, cliques e conversões de mídia.' },
  'Messaging':         { title: 'Messaging',         description: 'Canais, identidade e automações conversacionais.' },
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
function fmtAge(s: number): string {
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.round(s / 60)}m`;
  if (s < 86400) return `${Math.round(s / 3600)}h`;
  return `${Math.round(s / 86400)}d`;
}

function pillFor(state: IntegrationState): IntegrationPillState {
  if (state === 'production' || state === 'pilot') return 'active';
  if (state === 'sandbox' || state === 'disabled') return 'available';
  if (state === 'policy-blocked') return 'restricted';
  return 'error';
}

/** Ação do rodapé — varia por estado + categoria, como na referência. */
function actionFor(row: IntegrationRow): string {
  const p = row.pill ?? pillFor(row.state);
  if (p === 'restricted') return 'Revisar';
  if (p === 'available' || p === 'error') return 'Conectar';
  // active: revenue provider → "Configurar", demais → "Abrir"
  return row.category === 'Revenue providers' ? 'Configurar' : 'Abrir';
}

/** Rótulo curto do estado do cenário para o chip único. */
function scenarioLabel(s: string): string {
  const m: Record<string, string> = {
    normal: 'Success',
    degraded: 'Integration degraded',
    dlq_full: 'Partial data · DLQ',
    divergencias: 'Partial data · diverg.',
    sem_dados: 'Empty',
    erro_sistema: 'Error',
  };
  return m[s] ?? 'Success';
}

export default function IntegrationsPage() {
  const [, navigate] = useLocation();
  const { openEvidence } = useEvidence();
  const scenario = useDemoScenario();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'all' | IntegrationRow['category']>('all');
  const [pillFilter, setPillFilter] = useState<'all' | IntegrationPillState>('all');

  const integrations: IntegrationRow[] = useMemo(() => [
    { id: 'tap',        name: 'TAP Affiliate Platform', initials: 'TAP', category: 'Revenue providers', state: 'production',     adapterVersion: '3.2.1',      eventType: 'ftd',         lastEventAt: lastEventFor('ftd'),         health: 98.7,  errors24h: 2, p95: 412, accounts: 1, policyAware: true,  description: 'Postback em tempo real, Reporting API e reconciliação financeira.' },
    { id: 'betano',     name: 'Smartico',               initials: 'S',   category: 'Revenue providers', state: 'sandbox',        adapterVersion: '1.0.0-rc.3', eventType: 'ftd',         lastEventAt: undefined,                  health: 100,   errors24h: 0, p95: 0,   accounts: 0, description: 'CRM e automação para operadores e afiliados integrados.' },
    { id: 'meta',       name: 'Meta Ads',               initials: 'M',   category: 'Acquisition',       state: 'production',     adapterVersion: '17.0.4',     eventType: 'capi',        lastEventAt: lastEventFor('capi'),        health: 99.2,  errors24h: 0, p95: 187, accounts: 3, policyAware: true,  description: 'Leitura de mídia, CAPI e escrita com guardas operacionais.' },
    { id: 'tiktok',     name: 'TikTok Ads',             initials: 'TT',  category: 'Acquisition',       state: 'pilot',          adapterVersion: '1.3.2',      eventType: 'click',       lastEventAt: lastEventFor('click'),       health: 97.1,  errors24h: 5, p95: 341, accounts: 1, description: 'Custos, campanhas e click IDs com ingestão automática.' },
    { id: 'kwai',       name: 'Kwai Ads',               initials: 'KW',  category: 'Acquisition',       state: 'sandbox',        adapterVersion: '0.9.0-preview',                        lastEventAt: undefined,                  health: 0,     errors24h: 0, p95: 0,   accounts: 0, description: 'Adapter de mídia e macros padronizadas para tracking.' },
    { id: 'google',     name: 'Google Ads Enhanced',    initials: 'GA',  category: 'Acquisition',       state: 'disabled',       adapterVersion: '0.9.0',                                lastEventAt: undefined,                  health: 0,     errors24h: 0, p95: 0,   accounts: 0, description: 'Enhanced Conversions parado — falta hash de e-mail habilitado.' },
    { id: 'telegram',   name: 'Telegram Bot API',       initials: 'TG',  category: 'Messaging',         state: 'production',     adapterVersion: '6.0.1',      eventType: 'bot_message', lastEventAt: lastEventFor('bot_message'), health: 99.9,  errors24h: 0, p95: 96,  accounts: 2, policyAware: true,  description: 'Deep links, updates idempotentes, canais e inbox.' },
    { id: 'whatsapp',   name: 'WhatsApp Cloud',         initials: 'WA',  category: 'Messaging',         state: 'policy-blocked', adapterVersion: '18.0.0',                               lastEventAt: undefined,                  health: 0,     errors24h: 0, p95: 0,   accounts: 0, policyAware: true,  description: 'Cloud API oficial com Policy Engine e opt-in granular.' },
    { id: 'cloudflare', name: 'Cloudflare Proxy',       initials: 'CF',  category: 'Infra',             state: 'production',     adapterVersion: '2024.11',                              lastEventAt: undefined,                  health: 99.98, errors24h: 0, p95: 22,  accounts: 1, description: 'Edge proxy para postbacks e redirects sem vazar UTM.' },
    { id: 'openai',     name: 'OpenAI Copilot',         initials: 'AI',  category: 'IA',                state: 'pilot',          adapterVersion: '2025.06',                              lastEventAt: undefined,                  health: 98.2,  errors24h: 1, p95: 812, accounts: 1, description: 'Copiloto operacional. Toda sugestão vai anotada e nunca decide sozinha.' },
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
  const scenarioTone =
    scenario === 'erro_sistema' ? 'text-critical' :
    scenario === 'normal'       ? 'text-verified' :
                                  'text-warning';

  return (
    <AppShell breadcrumb={[{ label: 'Connect', href: '/integrations' }, { label: 'Integrações' }]}>
      <div className="max-w-7xl mx-auto space-y-10 py-10 px-10">
        {/* Header — chip único (F11): PRÉVIA · freshness · produção/erros · estado do cenário */}
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-6">
          <div className="min-w-0">
            <div className="eyebrow mb-2">Connect · Integrações</div>
            <h1 className="page-title">Integrações</h1>
            <p className="page-subtitle mt-1.5 max-w-2xl">
              Conecte mídia, mensageria, revenue providers e infraestrutura por contratos versionados e observáveis.
            </p>
            <div className="mt-3">
              <span className="chip-honest">
                <span className="w-1 h-1 rounded-full bg-warning" />
                Prévia
                <span className="chip-honest-sep" />
                ao vivo · há {fmtAge(ageAgo(lastEventFor('ftd')))}
                <span className="chip-honest-sep" />
                <span className={totalErrors > 0 ? 'text-warning' : 'text-verified'}>
                  {totalProd}/{integrations.length} em produção · {totalErrors} erros 24h
                </span>
                <span className="chip-honest-sep" />
                <span className={scenarioTone}>{scenarioLabel(scenario)}</span>
              </span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => navigate('/roadmap')}
              className="h-9 px-3 rounded-[9px] border border-line bg-graphite hover:bg-zinc text-13 text-eggshell transition-colors press"
            >
              Ver documentação
            </button>
            <button type="button" className="btn-eggshell h-9 px-4 text-13">
              + Nova integração
            </button>
          </div>
        </header>

        <ScenarioStateGate
          emptyTitle="Nenhuma integração configurada"
          emptyDescription="Comece pela provedora de receita."
          emptyPrerequisite="Um adapter em Production é pré-requisito para o Signal Ledger."
        >
          {/* Filtros — linha compacta sem container, como na referência */}
          <div className="flex flex-wrap items-center gap-2">
            <label className="relative flex-1 min-w-[220px] max-w-[330px]">
              <Search className="w-4 h-4 text-stone absolute left-3 top-1/2 -translate-y-1/2" aria-hidden />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar integrações"
                className="w-full h-[37px] pl-9 pr-3 rounded-[9px] border border-line bg-graphite text-13 text-eggshell placeholder:text-stone/70 focus:outline-none focus:ring-proof"
              />
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="h-[37px] rounded-[9px] border border-line bg-graphite px-3 text-13 text-eggshell focus:outline-none focus:ring-proof"
            >
              <option value="all">Todos os tipos</option>
              {CATEGORY_ORDER.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select
              value={pillFilter}
              onChange={(e) => setPillFilter(e.target.value as any)}
              className="h-[37px] rounded-[9px] border border-line bg-graphite px-3 text-13 text-eggshell focus:outline-none focus:ring-proof"
            >
              <option value="all">Todos os status</option>
              <option value="active">Ativa</option>
              <option value="available">Disponível</option>
              <option value="restricted">Restrita</option>
              <option value="error">Erro</option>
            </select>
          </div>

          {/* Grade agrupada por categoria */}
          <div className="space-y-8">
            {grouped.map(({ cat, items }) => {
              const meta = CATEGORY_META[cat];
              const availableCount = items.filter((i) => pillFor(i.state) !== 'active').length;
              const activeCount = items.length - availableCount;
              const counterLabel = availableCount > 0
                ? `${availableCount} ${availableCount === 1 ? 'disponível' : 'disponíveis'}`
                : `${activeCount} ${activeCount === 1 ? 'ativa' : 'ativas'}`;
              return (
                <section key={cat}>
                  <div className="flex items-end justify-between gap-4 mb-3">
                    <div className="min-w-0">
                      <h2 className="text-[14px] font-semibold text-eggshell leading-tight">{meta.title}</h2>
                      <p className="text-[11px] text-stone mt-0.5">{meta.description}</p>
                    </div>
                    <span className="inline-flex items-center h-[22px] px-2 rounded-full border border-line bg-graphite text-[10px] font-mono uppercase tracking-wider text-stone">
                      {counterLabel}
                    </span>
                  </div>
                  <div
                    className="grid gap-4 justify-start"
                    style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 320px))' }}
                  >
                    {items.map((i) => {
                      const pillState = i.pill ?? pillFor(i.state);
                      const isActive = pillState === 'active';
                      const action = actionFor(i);
                      const metaBits = [
                        `v${i.adapterVersion}`,
                        i.accounts > 0 ? `${i.accounts} conta${i.accounts > 1 ? 's' : ''}` : null,
                        i.policyAware ? 'Policy-aware' : null,
                      ].filter(Boolean) as string[];
                      const tooltip = isActive
                        ? `Saúde ${i.health.toFixed(1)}% · P95 ${i.p95}ms · ${i.errors24h} erros 24h`
                        : `Adapter v${i.adapterVersion}`;
                      return (
                        <div
                          key={i.id}
                          role="link"
                          tabIndex={0}
                          aria-label={`${i.name} · ${meta.title}`}
                          title={tooltip}
                          onClick={() => navigate(`/integrations/${i.id}`)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              navigate(`/integrations/${i.id}`);
                            }
                          }}
                          className={`group relative rounded-[12px] surface-flat cursor-pointer transition-all hover:-translate-y-0.5 hover:ring-hairline-strong focus:outline-none focus:ring-proof ${isActive ? 'ring-hairline-strong' : ''}`}
                          style={{ padding: 16, minHeight: 148 }}
                        >
                          {/* linha 1 · icon + status */}
                          <div className="flex items-start justify-between">
                            <AppIcon kind={kindFromIntegrationId(i.id)} initials={i.initials} ariaLabel={i.name} />
                            <StatusPill state={pillState} />
                          </div>
                          {/* linha 2 · nome completo */}
                          <h3 className="mt-4 text-[15px] font-semibold text-eggshell leading-tight">{i.name}</h3>
                          {/* linha 3 · descrição */}
                          <p className="mt-1.5 text-[12px] text-stone leading-snug line-clamp-2">{i.description}</p>
                          {/* rodapé · hairline · meta · ação */}
                          <div className="hairline-divider mt-4 pt-3 flex items-center justify-between gap-3 text-[11px]">
                            <span className="text-stone truncate">
                              {metaBits.map((m, idx) => (
                                <React.Fragment key={idx}>
                                  {idx > 0 && <span className="text-stone/50"> · </span>}
                                  {idx === 0 ? <span className="font-mono tabular-nums">{m}</span> : m}
                                </React.Fragment>
                              ))}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                openEvidence(buildEvidence({
                                  label: `${i.name} · ${meta.title}`,
                                  value: `estado ${i.state} · v${i.adapterVersion}`,
                                  formula: 'catalog(integrations) filter id',
                                  source: 'Integration Registry',
                                  state: isActive ? 'Reconciliado' : 'Provisório',
                                }));
                                navigate(`/integrations/${i.id}`);
                              }}
                              className="inline-flex items-center gap-1 font-medium text-proof-blue hover:text-eggshell transition-colors"
                            >
                              {action}
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
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
