import React, { useMemo, useState } from 'react';
import { useParams, Link } from 'wouter';
import { AppShell, useEvidence } from '@/components/layout/AppShell';
import { PreviewBadge } from '@/components/data/PreviewBadge';
import { FreshnessTag } from '@/components/data/FreshnessTag';
import { MetricValue } from '@/components/data/MetricValue';
import { IntegrationStateBadge } from '@/components/data/IntegrationStateBadge';
import { StatusChip } from '@/components/domain/StatusChip';
import { DataTable, ColumnDef } from '@/components/data/DataTable';
import { ScenarioStateGate, StateShowcase } from '@/components/state/ScenarioStateGate';
import { buildEvidence } from '@/lib/evidence';
import { db, SignalEvent } from '@/lib/fake/db';
import { useIsMobile } from '@/hooks/use-mobile';
import type { IntegrationState } from '@/lib/types';
import { TeachingError } from '@/components/data/TeachingError';
import { Copy, Check } from 'lucide-react';

type Tab = 'visao' | 'setup' | 'eventos' | 'saude' | 'logs' | 'historico';

interface IntegrationConfig {
  id: string;
  name: string;
  category: string;
  state: IntegrationState;
  adapterVersion: string;
  scopes: string[];
  endpoint: string;
  credentials: Array<{ label: string; masked: string }>;
  eventTypes: string[];
  setupSteps: Array<{ label: string; description: string; test: string; done: boolean; evidence?: string }>;
  special?: 'tap' | 'meta' | 'telegram';
}

const CONFIGS: Record<string, IntegrationConfig> = {
  tap: {
    id: 'tap', name: 'TAP', category: 'Provedor de Receita', state: 'production', adapterVersion: '2.1.0',
    scopes: ['deposits:read', 'withdrawals:read', 'reports:read', 'postbacks:write'],
    endpoint: 'https://api.tap.bet/v2',
    credentials: [
      { label: 'Client ID', masked: 'tap_cli_••••••••••••3f2a' },
      { label: 'Client Secret', masked: '••••••••••••••••••••7f11' },
      { label: 'Postback signing secret', masked: 'sig_••••••••••••••ce93' },
    ],
    eventTypes: ['ftd', 'deposit', 'withdrawal', 'postback'],
    setupSteps: [
      { label: 'Registrar aplicação no TAP', description: 'Criar OAuth app com escopo mínimo (deposits/withdrawals/reports).', test: 'Ping /v2/health', done: true, evidence: '200 OK · 87ms · 2026-07-22 09:11' },
      { label: 'Configurar URL de postback', description: 'Copiar a URL abaixo e colar no painel TAP → Webhooks.', test: 'Enviar postback de teste', done: true, evidence: 'Postback recebido e assinado · sig OK' },
      { label: 'Habilitar reconciliação com Reporting API', description: 'Cronjob a cada 15 min compara postback × Reporting API.', test: 'Job piloto (24h)', done: true, evidence: '96 batches · 0 divergências · última: 2026-07-23 11:52' },
      { label: 'Promover adapter a Production', description: 'Aprovação do Approval Center + trava de policy engine.', test: 'Policy check', done: true, evidence: 'Aprovado por João Oliveira · 2026-07-15' },
    ],
    special: 'tap',
  },
  meta: {
    id: 'meta', name: 'Meta CAPI', category: 'Aquisição', state: 'production', adapterVersion: '17.0.4',
    scopes: ['ads_management', 'business_management', 'catalog_management'],
    endpoint: 'https://graph.facebook.com/v17.0',
    credentials: [
      { label: 'Business Manager ID', masked: 'bm_••••••••7712' },
      { label: 'Pixel ID', masked: 'px_••••••••3401' },
      { label: 'System User Token', masked: 'EAAB••••••••••••••••••gZDZD' },
    ],
    eventTypes: ['capi', 'click'],
    setupSteps: [
      { label: 'Conectar Business Manager', description: 'OAuth com system user token de longa duração.', test: 'GET /me/businesses', done: true, evidence: 'BM identificado · 1 pixel ativo' },
      { label: 'Escolher pixel + Dataset', description: 'Pixel 340124… linkado ao Dataset CAPI.', test: 'Test event helper', done: true, evidence: 'Test event 200 · match quality 8.4/10' },
      { label: 'Mapear parâmetros de matching', description: 'fbc, fbp, em (SHA-256), ph (SHA-256) — liga/desliga por campo.', test: 'Cobertura por evento', done: true, evidence: '78 eventos · fbc 100% · em 92% · ph 61%' },
      { label: 'Deduplicação pixel × CAPI', description: 'event_id compartilhado nos dois canais.', test: 'Deduplication rate', done: true, evidence: 'Dedup 97.3% · sem eventos órfãos' },
    ],
    special: 'meta',
  },
  telegram: {
    id: 'telegram', name: 'Telegram Bot', category: 'Mensageria', state: 'production', adapterVersion: '6.0.1',
    scopes: ['bot:send', 'bot:receive', 'chat:members:read'],
    endpoint: 'https://api.telegram.org',
    credentials: [
      { label: 'Bot Token', masked: '78••••••••••••••••••••RcAB' },
      { label: 'Webhook Secret', masked: 'wh_••••••••••••••••bE21' },
    ],
    eventTypes: ['bot_message', 'conversation_start'],
    setupSteps: [
      { label: 'Criar bot no @BotFather', description: 'Nome, handle, comandos e privacidade.', test: 'GET /getMe', done: true, evidence: '@operacaobr_bot ativo' },
      { label: 'Registrar webhook', description: 'setWebhook com secret_token para validar chamadas.', test: 'GET /getWebhookInfo', done: true, evidence: 'pending_update_count = 0' },
      { label: 'Gerar deep links ?start=', description: 'Um link por campanha; carrega click_id opaco.', test: 'Deep link gerador', done: true, evidence: '4 links ativos · último gerado hoje' },
      { label: 'Habilitar reply automation', description: 'Fluxo Boas-vindas FTD assumindo a conversa.', test: 'Fluxo piloto (24h)', done: true, evidence: '312 conversas · CTR 41%' },
    ],
    special: 'telegram',
  },
  tiktok: {
    id: 'tiktok', name: 'TikTok Events', category: 'Aquisição', state: 'pilot', adapterVersion: '1.3.2',
    scopes: ['events:write', 'ads:read'],
    endpoint: 'https://business-api.tiktok.com/open_api/v1.3',
    credentials: [
      { label: 'Access Token', masked: 'tt_••••••••••••••••dd12' },
      { label: 'Pixel Code', masked: 'C0O••••••••••••7' },
    ],
    eventTypes: ['click'],
    setupSteps: [
      { label: 'Autorizar app', description: 'OAuth business API.', test: 'GET /oauth2/access_token', done: true, evidence: '200 OK' },
      { label: 'Configurar Pixel', description: 'Vincular pixel code ao adapter.', test: 'Ping /event/track/', done: true, evidence: '202 aceito' },
      { label: 'Mapear parâmetros', description: 'click_id (ttclid), user props.', test: 'Cobertura', done: true, evidence: 'ttclid 94%' },
      { label: 'Promover a Production', description: 'Depende de 7d sem erros.', test: 'Erros últimos 7d', done: false, evidence: '5 erros em 24h · aguardando 7d limpos' },
    ],
  },
  betano: {
    id: 'betano', name: 'Betano', category: 'Provedor de Receita', state: 'sandbox', adapterVersion: '1.0.0-rc.3',
    scopes: ['deposits:read'],
    endpoint: 'https://sandbox.betano.dev/v1',
    credentials: [{ label: 'API Key', masked: 'bn_sbx_••••••••••••abcd' }],
    eventTypes: ['ftd'],
    setupSteps: [
      { label: 'Solicitar credenciais sandbox', description: 'Formulário assinado enviado ao TAM.', test: 'E-mail confirmado', done: true, evidence: 'ticket #BN-1091' },
      { label: 'Rodar suíte de conformidade', description: '38 endpoints obrigatórios.', test: 'Suite v1.0', done: false, evidence: '24/38 verdes · 14 pendentes' },
      { label: 'Aprovação Approval Center', description: 'Promoção sandbox → pilot.', test: 'Aprovação', done: false },
      { label: 'Promoção a Production', description: 'Após 30d de pilot sem incidentes.', test: '—', done: false },
    ],
  },
};

function relativeTime(iso: string, now = new Date('2026-07-23T12:00:00.000Z')): string {
  const diff = (now.getTime() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s atrás`;
  if (diff < 3600) return `${Math.floor(diff / 60)}min atrás`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h atrás`;
  return `${Math.floor(diff / 86400)}d atrás`;
}

export default function Integration360Page() {
  const params = useParams<{ id: string }>();
  const { openEvidence } = useEvidence();
  const isMobile = useIsMobile();
  const config = CONFIGS[params.id || 'tap'] ?? CONFIGS.tap;
  const [tab, setTab] = useState<Tab>('visao');
  const [copied, setCopied] = useState<string | null>(null);

  const events = useMemo(() => db.events.filter((e) => config.eventTypes.includes(e.type)).slice(0, 40), [config]);
  const p95 = useMemo(() => {
    const s = events.map((e) => e.latency_ms).sort((a, b) => a - b);
    return s[Math.floor(s.length * 0.95)] ?? 0;
  }, [events]);
  const errors = events.filter((e) => e.status === 'Failed').length;
  const health = events.length ? ((events.length - errors) / events.length) * 100 : 100;

  const postbackUrl = `https://ingest.trakacquire.com/webhook/${config.id}/${'p_' + config.id.slice(0,3)}f1a2b3c4`;

  const copy = (v: string, key: string) => {
    navigator.clipboard.writeText(v);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  const eventColumns: ColumnDef<SignalEvent>[] = [
    { header: 'ID', accessorKey: 'id', cell: (e) => <Link href={`/ledger/${e.id}`} className="font-mono text-11 text-proof-blue hover:underline">{e.id}</Link> },
    { header: 'Tipo', accessorKey: 'type', cell: (e) => <span className="font-mono text-11 text-eggshell">{e.type}</span> },
    { header: 'Status', accessorKey: 'status', cell: (e) => <StatusChip status={e.status} /> },
    { header: 'Pessoa', accessorKey: 'person_id', cell: (e) => <Link href={`/identity/${e.person_id}`} className="font-mono text-11 text-proof-blue hover:underline">{e.person_id}</Link>, className: isMobile ? 'hidden' : '' },
    { header: 'Latência', accessorKey: 'latency_ms', cell: (e) => <span className="font-mono text-11 text-stone tabular-nums">{e.latency_ms}ms</span>, className: 'text-right' },
    { header: 'Quando', accessorKey: 'timestamp', cell: (e) => <span className="font-mono text-11 text-stone tabular-nums">{relativeTime(e.timestamp)}</span>, className: 'text-right' },
  ];

  const tabs: Array<{ id: Tab; label: string }> = [
    { id: 'visao', label: 'Visão' },
    { id: 'setup', label: 'Setup guiado' },
    { id: 'eventos', label: 'Eventos' },
    { id: 'saude', label: 'Saúde' },
    { id: 'logs', label: 'Logs' },
    { id: 'historico', label: 'Histórico' },
  ];

  return (
    <AppShell breadcrumb={[{ label: 'Connect', href: '/integrations' }, { label: 'Integrações', href: '/integrations' }, { label: config.name }]}>
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span className="text-14 font-serif italic text-stone leading-none">Connect · {config.category}</span>
              <PreviewBadge />
              <IntegrationStateBadge state={config.state} adapterVersion={config.adapterVersion} />
              <FreshnessTag ageSeconds={events[0] ? Math.max(1, Math.round((Date.now() - new Date(events[0].timestamp).getTime()) / 1000)) : 999999} source={`Adapter ${config.name}`} />
              <StateShowcase />
            </div>
            <h1 className="text-eggshell font-sans font-semibold tracking-tight text-24">{config.name}</h1>
            <p className="text-stone text-13 mt-2 max-w-xl">Um template só. Cada aba responde a um job: entender o estado, provar o setup, ler eventos, monitorar saúde, auditar mudanças.</p>
          </div>
        </header>

        <div className="border-b border-line flex gap-6 overflow-x-auto">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`pb-3 text-13 font-medium whitespace-nowrap border-b-2 transition-colors ${tab === t.id ? 'text-eggshell border-proof-blue' : 'text-stone border-transparent hover:text-eggshell'}`}>{t.label}</button>
          ))}
        </div>

        <ScenarioStateGate emptyTitle="Sem eventos deste adapter" emptyDescription={`${config.name} não recebeu chamadas no período.`} degradedIntegration={config.name}>
          {tab === 'visao' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <KPI label="Saúde" value={`${health.toFixed(1)}%`} tone={health >= 99 ? 'verified' : health >= 95 ? 'warning' : 'critical'} onOpenEvidence={() => openEvidence(buildEvidence({ label: `Saúde · ${config.name}`, value: `${health.toFixed(1)}%`, formula: '1 - (failed_events / total_events)', source: `Adapter ${config.name} v${config.adapterVersion}` }))} />
                <KPI label="Erros" value={String(errors)} tone={errors > 0 ? 'warning' : 'verified'} onOpenEvidence={() => openEvidence(buildEvidence({ label: 'Erros recentes', value: String(errors), formula: 'count(events) where status == "Failed"', source: config.name, state: errors > 0 ? 'Provisório' : 'Reconciliado' }))} />
                <KPI label="P95" value={`${p95}ms`} tone={p95 > 800 ? 'critical' : 'default'} onOpenEvidence={() => openEvidence(buildEvidence({ label: 'Latência P95', value: `${p95}ms`, formula: 'percentile(events.latency_ms, 0.95)', source: config.name }))} />
                <KPI label="Eventos (amostra)" value={String(events.length)} onOpenEvidence={() => openEvidence(buildEvidence({ label: 'Eventos amostrados', value: String(events.length), formula: 'events where type in adapter.eventTypes', source: config.name }))} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-graphite border border-line rounded-xl p-5">
                  <h3 className="text-12 font-mono uppercase tracking-wider text-stone mb-3">Credenciais (sempre mascaradas)</h3>
                  <div className="space-y-2">
                    {config.credentials.map((c) => (
                      <div key={c.label} className="flex items-center justify-between gap-2">
                        <span className="text-12 text-stone">{c.label}</span>
                        <span className="font-mono text-12 text-eggshell tabular-nums">{c.masked}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-graphite border border-line rounded-xl p-5">
                  <h3 className="text-12 font-mono uppercase tracking-wider text-stone mb-3">Escopos concedidos</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {config.scopes.map((s) => (
                      <span key={s} className="font-mono text-11 px-2 py-0.5 rounded border border-line bg-zinc/60 text-eggshell">{s}</span>
                    ))}
                  </div>
                  <div className="mt-4 text-11 text-stone">Endpoint: <span className="font-mono text-eggshell">{config.endpoint}</span></div>
                  <div className="mt-1 text-11 text-stone">Versão do adapter: <span className="font-mono text-eggshell">v{config.adapterVersion}</span></div>
                </div>
              </div>

              {config.special === 'tap' && (
                <SpecialTAP openEvidence={openEvidence} postbackUrl={postbackUrl} copied={copied} copy={copy} />
              )}
              {config.special === 'meta' && (
                <SpecialMeta openEvidence={openEvidence} />
              )}
              {config.special === 'telegram' && (
                <SpecialTelegram openEvidence={openEvidence} copied={copied} copy={copy} />
              )}
            </div>
          )}

          {tab === 'setup' && (
            <div className="space-y-3">
              {config.setupSteps.map((s, i) => (
                <div key={i} className={`bg-graphite border rounded-xl p-4 flex items-start gap-4 ${s.done ? 'border-verified/30' : 'border-line'}`}>
                  <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-mono text-13 font-semibold ${s.done ? 'bg-verified/10 text-verified border border-verified/30' : 'bg-zinc text-stone border border-line'}`}>{i + 1}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-14 font-semibold text-eggshell">{s.label}</span>
                      {s.done ? <StatusChip status="Confirmed" /> : <StatusChip status="Captured" />}
                    </div>
                    <p className="text-12 text-stone mt-1">{s.description}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-3">
                      <button className="text-11 font-mono border border-line rounded-md px-2 py-1 text-stone hover:text-eggshell hover:border-stone transition-colors">Testar: {s.test}</button>
                      {s.evidence && (
                        <span className="text-11 text-stone">Evidência: <span className="font-mono text-eggshell">{s.evidence}</span></span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'eventos' && (
            <DataTable data={events} columns={eventColumns} />
          )}

          {tab === 'saude' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-graphite border border-line rounded-xl p-5">
                <h3 className="text-12 font-mono uppercase tracking-wider text-stone mb-2">Latência (últimos {events.length} eventos)</h3>
                <MetricValue value={`${p95}ms`} size="lg" onOpenEvidence={() => openEvidence(buildEvidence({ label: 'Latência P95', value: `${p95}ms`, formula: 'percentile(latency_ms, 0.95)', source: config.name }))} />
                <div className="text-11 text-stone mt-2">Threshold: 800ms · Alerta: p95 &gt; 1200ms</div>
              </div>
              <div className="bg-graphite border border-line rounded-xl p-5">
                <h3 className="text-12 font-mono uppercase tracking-wider text-stone mb-2">Erros</h3>
                <MetricValue value={String(errors)} size="lg" onOpenEvidence={() => openEvidence(buildEvidence({ label: 'Erros', value: String(errors), formula: 'count(status="Failed")', source: config.name, state: errors > 0 ? 'Provisório' : 'Reconciliado' }))} />
                <div className="text-11 text-stone mt-2">Últimos 24h · retry automático em 3 tentativas</div>
              </div>
              <div className="bg-graphite border border-line rounded-xl p-5">
                <h3 className="text-12 font-mono uppercase tracking-wider text-stone mb-2">Rate limit</h3>
                <div className="font-mono text-eggshell text-18 tabular-nums">1000 <span className="text-11 text-stone">req/min</span></div>
                <div className="text-11 text-stone mt-2">Uso atual: <span className="font-mono text-eggshell tabular-nums">274/min</span></div>
              </div>
            </div>
          )}

          {tab === 'logs' && (
            <div className="bg-graphite border border-line rounded-xl overflow-hidden">
              <div className="max-h-[420px] overflow-y-auto divide-y divide-line">
                {events.slice(0, 20).map((e) => (
                  <div key={e.id} className="px-4 py-2 flex items-center gap-4 hover:bg-iron">
                    <span className="font-mono text-11 text-stone tabular-nums w-40">{e.timestamp.slice(0, 19).replace('T', ' ')}</span>
                    <StatusChip status={e.status} />
                    <span className="font-mono text-11 text-eggshell flex-1 truncate">{e.type} · {e.id} · latency={e.latency_ms}ms</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'historico' && (
            <div className="bg-graphite border border-line rounded-xl overflow-hidden">
              <table className="w-full text-13">
                <thead>
                  <tr className="border-b border-line">
                    {['Data', 'Ação', 'Detalhe', 'Autor'].map((h) => (
                      <th key={h} className="text-left text-11 font-mono uppercase text-stone px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { at: '2026-07-22 10:11', acao: 'Adapter promovido', detalhe: `${config.name} → ${config.state}`, autor: 'João Oliveira' },
                    { at: '2026-07-18 09:03', acao: 'Escopo adicionado', detalhe: config.scopes[0], autor: 'Ana Costa' },
                    { at: '2026-07-15 15:44', acao: 'Credenciais rotacionadas', detalhe: '••••7f11 → ••••ce93', autor: 'sistema' },
                    { at: '2026-07-10 08:00', acao: 'Adapter conectado', detalhe: `v${config.adapterVersion}`, autor: 'João Oliveira' },
                  ].map((r, i) => (
                    <tr key={i} className="border-b border-line last:border-0">
                      <td className="px-4 py-3 font-mono text-11 text-stone tabular-nums">{r.at}</td>
                      <td className="px-4 py-3 text-eggshell">{r.acao}</td>
                      <td className="px-4 py-3 text-stone">{r.detalhe}</td>
                      <td className="px-4 py-3 text-stone">{r.autor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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

/* ── Special panels ─────────────────────────────────────────────────────── */

/* ── TAP · Setup guiado (Fase R · Bloco 2) ─────────────────────────────── */

const TAP_MACROS: Array<{ macro: string; maps: string; desc: string }> = [
  { macro: '{{afp}}',                  maps: 'external_id',       desc: 'Identificador opaco do clique (AFP)' },
  { macro: '{{customer_id}}',          maps: 'player_id',         desc: 'ID do jogador na casa' },
  { macro: '{{registration_id}}',      maps: 'registration_id',   desc: 'ID do cadastro (idempotência)' },
  { macro: '{{first_deposit_amount}}', maps: 'ftd_amount',        desc: 'Valor do primeiro depósito (BRL)' },
  { macro: '{{deposit}}',              maps: 'deposit_amount',    desc: 'Valor de depósito subsequente' },
  { macro: '{{payout_currency}}',      maps: 'currency',          desc: 'ISO 4217 (BRL, USD, EUR)' },
  { macro: '{{campaign_id}}',          maps: 'campaign_id',       desc: 'ID da campanha atribuída' },
  { macro: '{{brand_id}}',             maps: 'brand_id',          desc: 'ID da marca no tenant' },
];

const TAP_EVENT_MAP: Array<{ external: string; internal: string; sample: string }> = [
  { external: 'tag: "lead"',           internal: 'lead_created',   sample: 'lead · tag=lead' },
  { external: 'bot start',             internal: 'bot_started',    sample: 'bot_start · session_id=…' },
  { external: 'depósito da casa',      internal: 'deposit_made',   sample: 'deposit · amount=250' },
  { external: 'first_deposit_confirmed', internal: 'ftd_confirmed', sample: 'ftd · amount=100' },
];

const META_CAPI_MAP: Array<{ from: string; to: string; hint: string }> = [
  { from: 'FTD',     to: 'Purchase',  hint: 'value = first_deposit_amount · currency = BRL' },
  { from: 'Lead',    to: 'Lead',      hint: 'em, ph SHA-256 quando disponíveis' },
  { from: 'Deposit', to: 'Subscribe', hint: 'value = deposit · currency = BRL' },
];

const TAP_SYNC_HISTORY: Array<{ at: string; platform: string; imported: number; errors: number; status: 'Sucesso' | 'Parcial' | 'Erro' }> = [
  { at: '2026-07-23 11:52', platform: 'TAP Reporting API', imported: 96, errors: 0, status: 'Sucesso' },
  { at: '2026-07-23 11:37', platform: 'TAP Reporting API', imported: 91, errors: 0, status: 'Sucesso' },
  { at: '2026-07-23 11:22', platform: 'TAP Postback',      imported: 84, errors: 2, status: 'Parcial' },
  { at: '2026-07-23 11:07', platform: 'TAP Reporting API', imported: 88, errors: 0, status: 'Sucesso' },
  { at: '2026-07-23 10:52', platform: 'TAP Reporting API', imported: 0,  errors: 3, status: 'Erro' },
];

interface TapTestEntry {
  at: string;
  event: string;
  received: number;
  code?: string;
}

function SpecialTAP({ openEvidence, postbackUrl, copied, copy }: { openEvidence: (d: any) => void; postbackUrl: string; copied: string | null; copy: (v: string, k: string) => void; }) {
  const [semaforo, setSemaforo] = useState<'idle' | 'testing' | 'ok'>('idle');
  const [capiOn, setCapiOn] = useState(true);
  const [testEvent, setTestEvent] = useState<'lead' | 'ftd' | 'deposit'>('ftd');
  const [testCode, setTestCode] = useState('');
  const [testLog, setTestLog] = useState<TapTestEntry[]>([
    { at: 'há 4min',  event: 'ftd',     received: 1, code: 'TEST12345' },
    { at: 'há 21min', event: 'deposit', received: 3 },
    { at: 'há 1h',    event: 'lead',    received: 1 },
  ]);
  const [mapping, setMapping] = useState(TAP_EVENT_MAP);

  const baseUrl = 'https://ingest.trakacquire.com/webhook/tap/{{brand_id}}';
  const templateAll = `${baseUrl}?event={{event}}&afp={{afp}}&customer_id={{customer_id}}&registration_id={{registration_id}}&amount={{first_deposit_amount}}&currency={{payout_currency}}&campaign_id={{campaign_id}}`;
  const templateLead    = `${baseUrl}?event=lead&afp={{afp}}&registration_id={{registration_id}}&campaign_id={{campaign_id}}`;
  const templateFtd     = `${baseUrl}?event=ftd&afp={{afp}}&customer_id={{customer_id}}&amount={{first_deposit_amount}}&currency={{payout_currency}}`;
  const templateDeposit = `${baseUrl}?event=deposit&afp={{afp}}&customer_id={{customer_id}}&amount={{deposit}}&currency={{payout_currency}}`;

  const runTest = () => {
    setSemaforo('testing');
    setTimeout(() => {
      setSemaforo('ok');
      setTestLog((prev) => [{ at: 'agora', event: testEvent, received: 1, code: testCode || undefined }, ...prev].slice(0, 8));
    }, 900);
  };

  return (
    <div className="space-y-4">
      {/* URL base + templates por evento */}
      <div className="bg-graphite border border-line rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-3">
          <h3 className="text-14 font-semibold text-eggshell">Setup guiado TAP · postback + reconciliação</h3>
          <StatusChip status="Reconciled" />
        </div>

        <div>
          <div className="text-11 font-mono uppercase tracking-wider text-stone mb-1">URL base de postback</div>
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-zinc border border-line rounded-md px-3 py-2 font-mono text-12 text-eggshell truncate">{postbackUrl}</code>
            <button onClick={() => copy(postbackUrl, 'pb')} className="border border-line rounded-md px-3 py-2 text-stone hover:text-eggshell hover:border-stone">
              {copied === 'pb' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <div className="text-11 font-mono uppercase tracking-wider text-stone mb-1">Template completo (todas as macros)</div>
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-zinc border border-line rounded-md px-3 py-2 font-mono text-11 text-eggshell truncate">{templateAll}</code>
            <button onClick={() => copy(templateAll, 'tpl_all')} className="border border-line rounded-md px-3 py-2 text-stone hover:text-eggshell hover:border-stone">
              {copied === 'tpl_all' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { label: 'Template · lead',    tpl: templateLead,    key: 'tpl_lead' },
            { label: 'Template · ftd',     tpl: templateFtd,     key: 'tpl_ftd' },
            { label: 'Template · deposit', tpl: templateDeposit, key: 'tpl_deposit' },
          ].map((t) => (
            <div key={t.key} className="border border-line rounded-md p-3 bg-zinc/40">
              <div className="text-11 font-mono uppercase text-stone mb-1">{t.label}</div>
              <code className="block font-mono text-11 text-eggshell break-all mb-2">{t.tpl}</code>
              <button onClick={() => copy(t.tpl, t.key)} className="text-11 border border-line rounded-md px-2 py-1 text-stone hover:text-eggshell hover:border-stone inline-flex items-center gap-1">
                {copied === t.key ? <><Check className="w-3 h-3" /> Copiado</> : <><Copy className="w-3 h-3" /> Copiar</>}
              </button>
            </div>
          ))}
        </div>

        {/* Passo a passo numerado */}
        <div className="border-t border-line pt-4">
          <div className="text-11 font-mono uppercase tracking-wider text-stone mb-3">Passo a passo · painel TAP</div>
          <ol className="space-y-2 text-13 text-stone">
            {[
              'Abra o painel TAP → Webhooks → Novo webhook.',
              'Cole a URL base acima no campo "Endpoint URL".',
              'Selecione os eventos: FTD, Deposit, Lead.',
              'Cole os templates de macros nos campos "Payload" de cada evento.',
              'Salve e clique em "Enviar postback de teste" abaixo para validar assinatura.',
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-zinc border border-line font-mono text-11 text-eggshell flex items-center justify-center tabular-nums">{i + 1}</span>
                <span className="pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Tabela de macros */}
      <div className="bg-graphite border border-line rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-line flex items-center justify-between">
          <h3 className="text-14 font-semibold text-eggshell">Macros disponíveis</h3>
          <span className="text-11 font-mono text-stone">{TAP_MACROS.length} macros</span>
        </div>
        <table className="w-full text-13">
          <thead>
            <tr className="border-b border-line bg-iron/50">
              {['Macro TAP', 'Campo interno', 'Descrição'].map((h) => (
                <th key={h} className="text-left text-11 font-mono uppercase text-stone px-5 py-2">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TAP_MACROS.map((m) => (
              <tr key={m.macro} className="border-b border-line last:border-0">
                <td className="px-5 py-2 font-mono text-12 text-eggshell">{m.macro}</td>
                <td className="px-5 py-2 font-mono text-12 text-proof-blue">{m.maps}</td>
                <td className="px-5 py-2 text-stone">{m.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Meta CAPI auto-fire toggle */}
      <div className="bg-graphite border border-line rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-14 font-semibold text-eggshell">Disparar Meta CAPI automaticamente</h3>
            <p className="text-12 text-stone mt-1">Cada postback TAP dispara o evento Meta correspondente com dedup por <span className="font-mono text-eggshell">event_id</span>.</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setCapiOn((v) => !v)} className={`px-3 py-1.5 rounded-md border text-12 font-mono ${capiOn ? 'bg-verified/10 text-verified border-verified/30' : 'bg-zinc text-stone border-line'}`}>
              {capiOn ? 'ON' : 'OFF'}
            </button>
            <button className="text-12 font-mono border border-line rounded-md px-3 py-1.5 text-stone hover:text-eggshell hover:border-stone">Rotacionar token</button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 border-t border-line pt-3">
          {META_CAPI_MAP.map((m) => (
            <div key={m.from} className="border border-line rounded-md p-3 bg-zinc/40">
              <div className="font-mono text-12 text-eggshell">{m.from} <span className="text-stone">→</span> <span className="text-proof-blue">{m.to}</span></div>
              <div className="text-11 text-stone mt-1">{m.hint}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Teste ao vivo */}
      <div className="bg-graphite border border-line rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-3">
          <h3 className="text-14 font-semibold text-eggshell">Teste ao vivo</h3>
          <StatusChip status={semaforo === 'ok' ? 'Confirmed' : semaforo === 'testing' ? 'Provisional' : 'Captured'} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <label className="flex flex-col gap-1 md:col-span-1">
            <span className="text-11 font-mono uppercase text-stone">Evento</span>
            <select value={testEvent} onChange={(e) => setTestEvent(e.target.value as any)} className="bg-zinc border border-line rounded-md px-3 py-2 text-13 text-eggshell">
              <option value="lead">lead</option>
              <option value="ftd">ftd</option>
              <option value="deposit">deposit</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 md:col-span-2">
            <span className="text-11 font-mono uppercase text-stone">test_event_code (opcional)</span>
            <input value={testCode} onChange={(e) => setTestCode(e.target.value)} placeholder="TEST12345" className="bg-zinc border border-line rounded-md px-3 py-2 font-mono text-12 text-eggshell placeholder:text-stone/60" />
          </label>
          <button onClick={runTest} className="self-end text-13 border border-line rounded-md px-4 py-2 bg-zinc text-eggshell hover:border-stone">Enviar teste</button>
        </div>
        <div className="flex items-center gap-2 text-12 font-mono">
          <span className={`w-2 h-2 rounded-full ${semaforo === 'ok' ? 'bg-verified' : semaforo === 'testing' ? 'bg-warning animate-pulse' : 'bg-stone'}`} />
          <span className={semaforo === 'ok' ? 'text-verified' : semaforo === 'testing' ? 'text-warning' : 'text-stone'}>
            {semaforo === 'ok' ? 'Postback recebido · assinatura OK · 87ms' : semaforo === 'testing' ? 'Enviando…' : 'Aguardando teste'}
          </span>
        </div>

        <div className="border-t border-line pt-3">
          <div className="text-11 font-mono uppercase tracking-wider text-stone mb-2">Histórico de testes</div>
          <div className="divide-y divide-line border border-line rounded-md overflow-hidden">
            {testLog.map((t, i) => (
              <button
                key={i}
                onClick={() => openEvidence(buildEvidence({
                  label: `Teste TAP · ${t.event}`,
                  value: `${t.received} evento(s)`,
                  formula: 'count(webhook.received) where signature = valid',
                  source: 'TAP webhook (test)',
                  freshness: t.at,
                  state: 'Reconciliado',
                  view: 'operational',
                }))}
                className="w-full text-left px-3 py-2 flex items-center gap-3 hover:bg-iron"
              >
                <StatusChip status="Confirmed" />
                <span className="font-mono text-12 text-eggshell">{t.event}</span>
                {t.code && <span className="font-mono text-11 text-stone">code={t.code}</span>}
                <span className="text-12 text-stone flex-1">Enviado · {t.received} evento(s) recebido(s)</span>
                <span className="font-mono text-11 text-stone tabular-nums">{t.at}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mapeamento evento externo → interno */}
      <div className="bg-graphite border border-line rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-line flex items-center justify-between">
          <h3 className="text-14 font-semibold text-eggshell">Mapeamento de eventos externos → internos</h3>
          <span className="text-11 font-mono text-stone">{mapping.length} regras</span>
        </div>
        <table className="w-full text-13">
          <thead>
            <tr className="border-b border-line bg-iron/50">
              {['Externo (TAP)', '→', 'Interno (Proofline)', 'Exemplo', 'Ação'].map((h) => (
                <th key={h} className="text-left text-11 font-mono uppercase text-stone px-4 py-2">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mapping.map((m, i) => (
              <tr key={m.internal} className="border-b border-line last:border-0">
                <td className="px-4 py-2 font-mono text-12 text-eggshell">{m.external}</td>
                <td className="px-4 py-2 text-stone">→</td>
                <td className="px-4 py-2">
                  <input
                    value={m.internal}
                    onChange={(e) => setMapping((prev) => prev.map((x, j) => j === i ? { ...x, internal: e.target.value } : x))}
                    className="bg-zinc border border-line rounded-md px-2 py-1 font-mono text-12 text-proof-blue w-56"
                  />
                </td>
                <td className="px-4 py-2 font-mono text-11 text-stone">{m.sample}</td>
                <td className="px-4 py-2">
                  <button onClick={() => setMapping((prev) => prev.filter((_, j) => j !== i))} className="text-11 font-mono text-stone hover:text-critical">Remover</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Histórico de sincronização */}
      <div className="bg-graphite border border-line rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-line flex items-center justify-between">
          <h3 className="text-14 font-semibold text-eggshell">Histórico de sincronização</h3>
          <span className="text-11 font-mono text-stone">últimos {TAP_SYNC_HISTORY.length} batches</span>
        </div>
        <table className="w-full text-13">
          <thead>
            <tr className="border-b border-line bg-iron/50">
              {['Data', 'Plataforma', 'Importados', 'Erros', 'Status'].map((h) => (
                <th key={h} className="text-left text-11 font-mono uppercase text-stone px-4 py-2">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TAP_SYNC_HISTORY.map((r, i) => (
              <tr key={i} className="border-b border-line last:border-0 hover:bg-iron cursor-pointer" onClick={() => openEvidence(buildEvidence({
                label: `Sync ${r.platform}`,
                value: `${r.imported} importados · ${r.errors} erros`,
                formula: 'sum(batch.rows_imported) · sum(batch.rows_error)',
                source: r.platform,
                freshness: r.at,
                state: r.status === 'Sucesso' ? 'Reconciliado' : r.status === 'Parcial' ? 'Provisório' : 'Divergente',
                view: 'operational',
              }))}>
                <td className="px-4 py-2 font-mono text-11 text-stone tabular-nums">{r.at}</td>
                <td className="px-4 py-2 text-eggshell">{r.platform}</td>
                <td className="px-4 py-2 font-mono text-12 text-eggshell tabular-nums text-right">{r.imported}</td>
                <td className="px-4 py-2 font-mono text-12 tabular-nums text-right"><span className={r.errors > 0 ? 'text-warning' : 'text-verified'}>{r.errors}</span></td>
                <td className="px-4 py-2">
                  <StatusChip status={r.status === 'Sucesso' ? 'Confirmed' : r.status === 'Parcial' ? 'Provisional' : 'Divergent'} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Erros que ensinam */}
      <TeachingError
        code="#200"
        cause="Missing Permissions"
        action="Gere um token com a permissão ads_read e atualize o Access Token na integração Meta."
        where="Business Manager → Usuários do sistema → Gerar token · escopo ads_read"
        hint="Tokens CAPI-only (como o atual) só servem para enviar eventos, não para puxar dados de campanha."
      />

      <div className="pt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <div className="text-11 font-mono uppercase text-stone mb-1">Postbacks (30d)</div>
          <MetricValue value="2.148" size="sm" onOpenEvidence={() => openEvidence(buildEvidence({ label: 'Postbacks TAP 30d', value: '2.148', formula: 'count(events where type in [ftd, deposit])', source: 'TAP webhook', view: 'operational' }))} />
        </div>
        <div>
          <div className="text-11 font-mono uppercase text-stone mb-1">Reporting API (30d)</div>
          <MetricValue value="2.148" size="sm" onOpenEvidence={() => openEvidence(buildEvidence({ label: 'Reporting API 30d', value: '2.148', formula: 'sum(reporting_api.deposits_count)', source: 'TAP Reporting API', view: 'operational' }))} />
        </div>
        <div>
          <div className="text-11 font-mono uppercase text-stone mb-1">Divergência</div>
          <MetricValue value="0" size="sm" onOpenEvidence={() => openEvidence(buildEvidence({ label: 'Divergência postback × Reporting', value: '0', formula: 'abs(postbacks - reporting)', source: 'Reconciliation engine', state: 'Reconciliado', view: 'operational' }))} />
        </div>
      </div>
    </div>
  );
}

function SpecialMeta({ openEvidence }: { openEvidence: (d: any) => void }) {
  const [flags, setFlags] = useState({ fbc: true, fbp: true, em: true, ph: false });
  const rows: Array<{ key: keyof typeof flags; label: string; coverage: number }> = [
    { key: 'fbc', label: 'fbc (click id)', coverage: 100 },
    { key: 'fbp', label: 'fbp (browser id)', coverage: 98 },
    { key: 'em', label: 'em (email SHA-256)', coverage: 92 },
    { key: 'ph', label: 'ph (phone SHA-256)', coverage: 61 },
  ];
  return (
    <div className="bg-graphite border border-line rounded-xl p-5 space-y-4">
      <div className="flex items-center gap-3">
        <h3 className="text-14 font-semibold text-eggshell">Meta · cobertura de parâmetros</h3>
        <StatusChip status="Confirmed" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="border border-line rounded-md p-3">
          <div className="text-11 font-mono uppercase text-stone">BM</div>
          <div className="font-mono text-13 text-eggshell mt-1">bm_7712</div>
        </div>
        <div className="border border-line rounded-md p-3">
          <div className="text-11 font-mono uppercase text-stone">Pixel</div>
          <div className="font-mono text-13 text-eggshell mt-1">px_3401</div>
        </div>
        <div className="border border-line rounded-md p-3">
          <div className="text-11 font-mono uppercase text-stone">Dedup CAPI × Pixel</div>
          <button onClick={() => openEvidence(buildEvidence({ label: 'Dedup rate', value: '97.3%', formula: 'shared_event_ids / total', source: 'Meta Test Events' }))} className="font-mono text-13 text-verified mt-1 hover:underline">97.3%</button>
        </div>
      </div>
      <table className="w-full text-13">
        <thead>
          <tr className="border-b border-line">
            <th className="text-left text-11 font-mono uppercase text-stone px-3 py-2">Parâmetro</th>
            <th className="text-right text-11 font-mono uppercase text-stone px-3 py-2">Cobertura</th>
            <th className="text-right text-11 font-mono uppercase text-stone px-3 py-2">Enviar</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.key} className="border-b border-line last:border-0">
              <td className="px-3 py-2 text-eggshell">{r.label}</td>
              <td className="px-3 py-2 text-right">
                <MetricValue value={`${r.coverage}%`} size="sm" onOpenEvidence={() => openEvidence(buildEvidence({ label: `Cobertura ${r.label}`, value: `${r.coverage}%`, formula: 'events_with_field / total_events', source: 'CAPI pipeline' }))} />
              </td>
              <td className="px-3 py-2 text-right">
                <button onClick={() => setFlags((f) => ({ ...f, [r.key]: !f[r.key] }))} className={`px-2 py-0.5 rounded-md border text-11 font-mono ${flags[r.key] ? 'bg-verified/10 text-verified border-verified/30' : 'bg-zinc text-stone border-line'}`}>{flags[r.key] ? 'ON' : 'OFF'}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SpecialTelegram({ openEvidence, copied, copy }: { openEvidence: (d: any) => void; copied: string | null; copy: (v: string, k: string) => void }) {
  const bots = [
    { handle: '@operacaobr_bot', purpose: 'Aquisição principal', deep: 'https://t.me/operacaobr_bot?start=cid_A19f2c' },
    { handle: '@operacaovip_bot', purpose: 'Fluxo VIP', deep: 'https://t.me/operacaovip_bot?start=cid_VIP1' },
  ];
  return (
    <div className="bg-graphite border border-line rounded-xl p-5 space-y-4">
      <div className="flex items-center gap-3">
        <h3 className="text-14 font-semibold text-eggshell">Telegram · bots + deep links</h3>
        <StatusChip status="Confirmed" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="border border-line rounded-md p-3">
          <div className="text-11 font-mono uppercase text-stone">Webhook</div>
          <div className="text-12 text-eggshell mt-1">Ativo · <span className="text-verified">pending_update_count = 0</span></div>
        </div>
        <div className="border border-line rounded-md p-3">
          <div className="text-11 font-mono uppercase text-stone">Bots ativos</div>
          <MetricValue value={String(bots.length)} size="sm" onOpenEvidence={() => openEvidence(buildEvidence({ label: 'Bots ativos', value: String(bots.length), formula: 'count(bots where status="production")', source: 'Telegram registry' }))} />
        </div>
      </div>
      <div className="space-y-2">
        {bots.map((b) => (
          <div key={b.handle} className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 border border-line rounded-md p-3 bg-zinc/60">
            <div className="flex-1 min-w-0">
              <div className="font-mono text-13 text-eggshell">{b.handle}</div>
              <div className="text-11 text-stone">{b.purpose}</div>
            </div>
            <code className="flex-1 min-w-0 font-mono text-11 text-stone truncate">{b.deep}</code>
            <button onClick={() => copy(b.deep, b.handle)} className="border border-line rounded-md px-3 py-1.5 text-stone hover:text-eggshell hover:border-stone text-11">
              {copied === b.handle ? 'Copiado' : 'Copiar link'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
