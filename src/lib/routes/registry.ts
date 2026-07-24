/**
 * Route Registry — Fase G.1
 *
 * Fonte única de verdade das rotas do protótipo. Cada entrada declara:
 *   • path (com params opcionais e um exemplo canônico do dataset)
 *   • grupo lógico (Public · Platform · Tenant · Utility)
 *   • jobs (a que pergunta a página responde — lei §0 do PRODUCT-MAP)
 *   • status na matriz CONFORMANCE (verde / amarelo / vermelho)
 *   • fase (P0-P8, E, F, R) que a levou ao estado atual
 *   • sidebar (se aparece na sidebar do tenant)
 *
 * Usado por:
 *   • /roadmap  — Roadmap alimentado por este registry (nada de listas paralelas)
 *   • CONFORMANCE.md — check físico de que toda rota tem uma linha na matriz
 *   • QA — varredura Playwright (executa no repositório de produção, ver DECISIONS)
 */

export type RouteStatus = 'verde' | 'amarelo' | 'vermelho' | 'redirect';
export type RouteGroup =
  | 'Public'
  | 'Platform'
  | 'Tenant · Overview'
  | 'Tenant · Connect'
  | 'Tenant · Observe'
  | 'Tenant · Operate'
  | 'Tenant · Prove'
  | 'Tenant · Settings'
  | 'Utility';

export interface RouteEntry {
  path: string;                // ex.: /media/:campaignId
  exampleHref: string;         // ex.: /media/camp_1 (usa dataset canônico)
  label: string;
  group: RouteGroup;
  job: string;                 // 1 linha — a que pergunta responde
  status: RouteStatus;
  phase: string;               // fase que a moveu ao estado atual
  inSidebar?: boolean;
  note?: string;
}

/**
 * Registry canônico. Referencia o dataset em src/lib/fake/db.ts:
 *   camp_1, p_001, d_1, l_1, evt_1, report_001, f_1
 */
export const ROUTE_REGISTRY: RouteEntry[] = [
  // — Public —
  { path: '/login',                 exampleHref: '/login',                 label: 'Login',                 group: 'Public',   job: 'Entrar no workspace',                                  status: 'verde',    phase: 'P7' },
  { path: '/signup',                exampleHref: '/signup',                label: 'Signup',                group: 'Public',   job: 'Criar workspace novo',                                 status: 'verde',    phase: 'P7' },
  { path: '/pricing',               exampleHref: '/pricing',               label: 'Pricing',               group: 'Public',   job: 'Comparar planos e limites',                            status: 'verde',    phase: 'P7' },
  { path: '/docs',                  exampleHref: '/docs',                  label: 'Docs',                  group: 'Public',   job: 'Consultar contratos, adapters e SDKs',                 status: 'verde',    phase: 'P7' },
  { path: '/status',                exampleHref: '/status',                label: 'Status público',        group: 'Public',   job: 'Ver disponibilidade em tempo real',                    status: 'verde',    phase: 'P7' },
  { path: '/legal/termos',          exampleHref: '/legal/termos',          label: 'Termos',                group: 'Public',   job: 'Termos de uso',                                        status: 'verde',    phase: 'P7' },
  { path: '/legal/privacidade',     exampleHref: '/legal/privacidade',     label: 'Privacidade',           group: 'Public',   job: 'Política de privacidade',                              status: 'verde',    phase: 'P7' },
  { path: '/legal/dpa',             exampleHref: '/legal/dpa',             label: 'DPA',                   group: 'Public',   job: 'Contrato de processamento de dados',                   status: 'verde',    phase: 'P7' },
  { path: '/legal/subprocessadores', exampleHref: '/legal/subprocessadores', label: 'Subprocessadores',    group: 'Public',   job: 'Lista de subprocessadores atuais',                     status: 'verde',    phase: 'P7' },
  { path: '/convite/:token',        exampleHref: '/convite/tok_demo',      label: 'Convite',               group: 'Public',   job: 'Aceitar convite de workspace',                         status: 'amarelo',  phase: 'P7' },
  { path: '/auth/callback',         exampleHref: '/auth/callback',         label: 'OAuth callback',        group: 'Public',   job: 'Retorno de OAuth',                                     status: 'verde',    phase: 'P7', note: 'sem UI — apenas troca token' },

  // — Tenant · Overview —
  { path: '/command',               exampleHref: '/command',               label: 'Command',               group: 'Tenant · Overview', job: 'O que devo olhar agora?',                     status: 'verde',    phase: 'P1', inSidebar: true },

  // — Tenant · Connect —
  { path: '/integrations',          exampleHref: '/integrations',          label: 'Integrações',           group: 'Tenant · Connect', job: 'Estado de cada adapter',                       status: 'verde',    phase: 'D',  inSidebar: true },
  { path: '/integrations/tap',      exampleHref: '/integrations/tap',      label: 'Setup TAP',             group: 'Tenant · Connect', job: 'Ligar provedor de receita',                    status: 'verde',    phase: 'D' },
  { path: '/integrations/meta',     exampleHref: '/integrations/meta',     label: 'Setup Meta CAPI',       group: 'Tenant · Connect', job: 'Ligar Meta CAPI (Purchase/Lead)',              status: 'verde',    phase: 'R',  note: 'CAPI shadow fundido em Meta 360' },
  { path: '/integrations/telegram', exampleHref: '/integrations/telegram', label: 'Setup Telegram',        group: 'Tenant · Connect', job: 'Ligar Telegram bot',                           status: 'verde',    phase: 'R' },
  { path: '/integrations/:slug',    exampleHref: '/integrations/tiktok',   label: 'Integration 360',       group: 'Tenant · Connect', job: '360º de um adapter específico',                status: 'verde',    phase: 'R' },
  { path: '/domains',               exampleHref: '/domains',               label: 'Domínios',              group: 'Tenant · Connect', job: 'Domínios verificados e postbacks',             status: 'amarelo',  phase: 'P5' },
  { path: '/domains/:id',           exampleHref: '/domains/d_1',           label: 'Domain 360',            group: 'Tenant · Connect', job: '360º de um domínio',                           status: 'amarelo',  phase: 'P5' },
  { path: '/tracking',              exampleHref: '/tracking',              label: 'Tracking',              group: 'Tenant · Connect', job: 'Diagnóstico de tracking',                      status: 'verde',    phase: 'R',  inSidebar: true },
  { path: '/tracking/sources',      exampleHref: '/tracking/sources',      label: 'Fontes de tracking',    group: 'Tenant · Connect', job: 'Fontes ativas por adapter',                    status: 'amarelo',  phase: 'P5' },
  { path: '/tracking/:id',          exampleHref: '/tracking/l_1',          label: 'Link 360',              group: 'Tenant · Connect', job: 'Constrói UTM completo + expert + slug',        status: 'verde',    phase: 'R' },

  // — Tenant · Observe —
  { path: '/ledger',                exampleHref: '/ledger',                label: 'Signal Ledger',         group: 'Tenant · Observe', job: 'Ver todo evento cronologicamente',             status: 'verde',    phase: 'F',  inSidebar: true, note: 'inclui modo Ao vivo · confidence-bar 4px' },
  { path: '/ledger/:eventId',       exampleHref: '/ledger/evt_1',          label: 'Event Detail',          group: 'Tenant · Observe', job: 'Auditar um evento específico',                 status: 'verde',    phase: 'P2' },
  { path: '/live',                  exampleHref: '/live',                  label: 'Live Events (fundido)', group: 'Utility',          job: 'redireciona para /ledger?live=1',              status: 'redirect', phase: 'E1' },
  { path: '/signals',               exampleHref: '/signals',               label: 'Signals (fundido)',     group: 'Utility',          job: 'redireciona para /integrations/meta',          status: 'redirect', phase: 'E1' },
  { path: '/monitoring',            exampleHref: '/monitoring',            label: 'Monitoring & DLQ',      group: 'Tenant · Observe', job: 'Alertas ativos e DLQ',                         status: 'verde',    phase: 'E' },
  { path: '/identity',              exampleHref: '/identity',              label: 'Identity',              group: 'Tenant · Observe', job: 'Resolver identidade cross-channel',            status: 'verde',    phase: 'F',  inSidebar: true, note: 'wire-fade + timeline de proveniência' },
  { path: '/identity/:personId',    exampleHref: '/identity/p_001',        label: 'Identity Detail',       group: 'Tenant · Observe', job: 'Grafo de uma person',                          status: 'verde',    phase: 'F' },
  { path: '/players',               exampleHref: '/players',               label: 'Players',               group: 'Tenant · Observe', job: 'Lista de pessoas com valor',                   status: 'verde',    phase: 'P3', inSidebar: true },
  { path: '/players/:id',           exampleHref: '/players/p_001',         label: 'Player 360',            group: 'Tenant · Observe', job: '360º de uma pessoa',                           status: 'verde',    phase: 'P3' },

  // — Tenant · Operate —
  { path: '/media',                 exampleHref: '/media',                 label: 'Mídia',                 group: 'Tenant · Operate', job: 'Campanhas ativas e diagnóstico',               status: 'verde',    phase: 'R',  inSidebar: true },
  { path: '/media/:campaignId',     exampleHref: '/media/camp_1',          label: 'Campanha 360',          group: 'Tenant · Operate', job: '360º de uma campanha + RecommendationCard',    status: 'verde',    phase: 'F' },
  { path: '/media/creatives',       exampleHref: '/media/creatives',       label: 'Criativos',             group: 'Tenant · Operate', job: 'Ranking de criativos por CPFTD',               status: 'amarelo',  phase: 'P5' },
  { path: '/automations',           exampleHref: '/automations',           label: 'Automations',           group: 'Tenant · Operate', job: 'Lista de flows',                               status: 'verde',    phase: 'P5', inSidebar: true },
  { path: '/automations/:id',       exampleHref: '/automations/f_1',       label: 'Flow Builder',          group: 'Tenant · Operate', job: 'Editar um flow com canvas',                    status: 'verde',    phase: 'F',  note: 'canvas-dot-grid + connector-flow gradient' },
  { path: '/segments',              exampleHref: '/segments',              label: 'Segments',              group: 'Tenant · Operate', job: 'Coortes operacionais',                         status: 'amarelo',  phase: 'P6' },
  { path: '/broadcasts',            exampleHref: '/broadcasts',            label: 'Broadcasts',            group: 'Tenant · Operate', job: 'Envio em massa (fase 2)',                      status: 'amarelo',  phase: 'P6', note: 'fora da sidebar — Bloco 4' },
  { path: '/inbox',                 exampleHref: '/inbox',                 label: 'Inbox',                 group: 'Tenant · Operate', job: 'Conversas (fase 2)',                           status: 'amarelo',  phase: 'P6', note: 'fora da sidebar — Bloco 4' },
  { path: '/inbox/settings',        exampleHref: '/inbox/settings',        label: 'Inbox settings',        group: 'Tenant · Operate', job: 'Configuração de canais da Inbox',              status: 'amarelo',  phase: 'P6' },
  { path: '/approvals',             exampleHref: '/approvals',             label: 'Aprovações',            group: 'Tenant · Operate', job: 'Fila de ações que precisam de dono',           status: 'verde',    phase: 'E1', note: 'contextual · Approval Center card' },

  // — Tenant · Prove —
  { path: '/revenue',               exampleHref: '/revenue',               label: 'Receita',               group: 'Tenant · Prove',   job: 'P&L reconciliado por dia',                     status: 'verde',    phase: 'P4', inSidebar: true },
  { path: '/revenue/reconciliation', exampleHref: '/revenue/reconciliation', label: 'Reconciliação',       group: 'Tenant · Prove',   job: 'Divergências e ajustes',                       status: 'verde',    phase: 'P4' },
  { path: '/revenue/cohorts',       exampleHref: '/revenue/cohorts',       label: 'Coortes',               group: 'Tenant · Prove',   job: 'Recompra por safra',                           status: 'verde',    phase: 'R' },
  { path: '/analytics',             exampleHref: '/analytics',             label: 'Analytics',             group: 'Tenant · Prove',   job: 'Painéis por dimensão',                         status: 'verde',    phase: 'P4', inSidebar: true },
  { path: '/reports',               exampleHref: '/reports',               label: 'Relatórios',            group: 'Tenant · Prove',   job: 'Relatórios prontos e agendados',               status: 'verde',    phase: 'P4', inSidebar: true },
  { path: '/reports/:id',           exampleHref: '/reports/report_001',    label: 'Report Detail',         group: 'Tenant · Prove',   job: 'Ver um relatório específico',                  status: 'verde',    phase: 'P4' },
  { path: '/governance',            exampleHref: '/governance',            label: 'Governança',            group: 'Tenant · Prove',   job: 'Aprovações · auditoria · políticas',           status: 'verde',    phase: 'P4', inSidebar: true },

  // — Tenant · Settings —
  { path: '/settings/general',      exampleHref: '/settings/general',      label: 'Configurações',         group: 'Tenant · Settings', job: 'Módulos ligáveis por workspace',              status: 'verde',    phase: 'R',  inSidebar: true },
  { path: '/settings/team',         exampleHref: '/settings/team',         label: 'Time',                  group: 'Tenant · Settings', job: 'Matriz perfil × ação',                        status: 'verde',    phase: 'R' },
  { path: '/settings/api',          exampleHref: '/settings/api',          label: 'API',                   group: 'Tenant · Settings', job: 'Tokens e webhooks',                           status: 'verde',    phase: 'P7' },
  { path: '/settings/billing',      exampleHref: '/settings/billing',      label: 'Billing',               group: 'Tenant · Settings', job: 'Plano e faturas',                             status: 'verde',    phase: 'P7' },
  { path: '/settings/notifications', exampleHref: '/settings/notifications', label: 'Notificações',        group: 'Tenant · Settings', job: 'Canais e limites de alerta',                  status: 'verde',    phase: 'P7' },
  { path: '/settings/audit',        exampleHref: '/settings/audit',        label: 'Auditoria',             group: 'Tenant · Settings', job: 'Log imutável de ações',                       status: 'verde',    phase: 'P7' },
  { path: '/profile',               exampleHref: '/profile',               label: 'Perfil',                group: 'Tenant · Settings', job: 'Dados do usuário atual',                      status: 'verde',    phase: 'P7' },

  // — Platform (Super Admin) —
  { path: '/platform',              exampleHref: '/platform',              label: 'Platform Command',      group: 'Platform', job: 'Visão global da plataforma',                          status: 'verde',    phase: 'P8' },
  { path: '/platform/tenants',      exampleHref: '/platform/tenants',      label: 'Tenants',               group: 'Platform', job: 'Lista de workspaces',                                 status: 'verde',    phase: 'P8' },
  { path: '/platform/tenants/new',  exampleHref: '/platform/tenants/new',  label: 'Novo tenant',           group: 'Platform', job: 'Provisionar novo workspace',                          status: 'verde',    phase: 'P8' },
  { path: '/platform/tenants/:id',  exampleHref: '/platform/tenants/t_1',  label: 'Tenant 360',            group: 'Platform', job: '360º de um workspace',                                status: 'verde',    phase: 'P8' },
  { path: '/platform/plans',        exampleHref: '/platform/plans',        label: 'Planos',                group: 'Platform', job: 'Definição de planos',                                 status: 'verde',    phase: 'P8' },
  { path: '/platform/entitlements', exampleHref: '/platform/entitlements', label: 'Entitlements',          group: 'Platform', job: 'Recursos habilitados por tenant',                     status: 'verde',    phase: 'P8' },
  { path: '/platform/usage',        exampleHref: '/platform/usage',        label: 'Usage',                 group: 'Platform', job: 'Consumo por tenant',                                  status: 'verde',    phase: 'P8' },
  { path: '/platform/invoices',     exampleHref: '/platform/invoices',     label: 'Invoices',              group: 'Platform', job: 'Faturas emitidas',                                    status: 'verde',    phase: 'P8' },
  { path: '/platform/ai/providers', exampleHref: '/platform/ai/providers', label: 'AI Providers',          group: 'Platform', job: 'Provedores de IA disponíveis',                        status: 'verde',    phase: 'P8' },
  { path: '/platform/ai/routing',   exampleHref: '/platform/ai/routing',   label: 'AI Routing',            group: 'Platform', job: 'Roteamento entre provedores',                         status: 'verde',    phase: 'P8' },
  { path: '/platform/ai/prompts',   exampleHref: '/platform/ai/prompts',   label: 'AI Prompts',            group: 'Platform', job: 'Prompts versionados',                                 status: 'verde',    phase: 'P8' },
  { path: '/platform/ai/cost',      exampleHref: '/platform/ai/cost',      label: 'AI Cost',               group: 'Platform', job: 'Custo de IA por tenant',                              status: 'verde',    phase: 'P8' },
  { path: '/platform/ai/guardrails', exampleHref: '/platform/ai/guardrails', label: 'AI Guardrails',       group: 'Platform', job: 'Regras de segurança de IA',                           status: 'verde',    phase: 'P8' },
  { path: '/platform/apis',         exampleHref: '/platform/apis',         label: 'APIs',                  group: 'Platform', job: 'Chaves e limites por API',                            status: 'verde',    phase: 'P8' },
  { path: '/platform/reliability',  exampleHref: '/platform/reliability',  label: 'Reliability',           group: 'Platform', job: 'SLOs e error budgets',                                status: 'verde',    phase: 'P8' },
  { path: '/platform/incidents',    exampleHref: '/platform/incidents',    label: 'Incidents',             group: 'Platform', job: 'Incidentes em andamento',                             status: 'verde',    phase: 'P8' },
  { path: '/platform/status',       exampleHref: '/platform/status',       label: 'Status interno',        group: 'Platform', job: 'Status page interno',                                 status: 'verde',    phase: 'P8' },
  { path: '/platform/releases',     exampleHref: '/platform/releases',     label: 'Releases',              group: 'Platform', job: 'Notas de release',                                    status: 'verde',    phase: 'P8' },
  { path: '/platform/support',      exampleHref: '/platform/support',      label: 'Support',               group: 'Platform', job: 'Fila de suporte',                                     status: 'verde',    phase: 'P8' },
  { path: '/platform/announcements', exampleHref: '/platform/announcements', label: 'Announcements',       group: 'Platform', job: 'Comunicados a tenants',                               status: 'verde',    phase: 'P8' },
  { path: '/platform/compliance',   exampleHref: '/platform/compliance',   label: 'Compliance',            group: 'Platform', job: 'DPO · LGPD · retenção',                               status: 'verde',    phase: 'P8' },
  { path: '/platform/staff',        exampleHref: '/platform/staff',        label: 'Staff',                 group: 'Platform', job: 'Membros internos',                                    status: 'verde',    phase: 'P8' },
  { path: '/platform/settings',     exampleHref: '/platform/settings',     label: 'Platform settings',     group: 'Platform', job: 'Configuração da plataforma',                          status: 'verde',    phase: 'P8' },

  // — Utility —
  { path: '/roadmap',               exampleHref: '/roadmap',               label: 'Roadmap',               group: 'Utility', job: 'Mapa vivo · gerado deste registry',                    status: 'verde',    phase: 'G',  note: 'consumidor do route-registry' },
];

/** Agrupamento estável para consumidores (Roadmap, CONFORMANCE). */
export function routesByGroup(): { group: RouteGroup; entries: RouteEntry[] }[] {
  const order: RouteGroup[] = [
    'Tenant · Overview', 'Tenant · Connect', 'Tenant · Observe',
    'Tenant · Operate', 'Tenant · Prove', 'Tenant · Settings',
    'Platform', 'Public', 'Utility',
  ];
  return order.map((g) => ({ group: g, entries: ROUTE_REGISTRY.filter((r) => r.group === g) }));
}

export const REGISTRY_COUNT = ROUTE_REGISTRY.length;
