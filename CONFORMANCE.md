# CONFORMANCE — TrakAcquire Proofline

> **Prototipação completa — P0 a P8 · 78 páginas conformes · 2026-07-24.** Sidebar tenant enxuta (14 itens visíveis + Roadmap); Super Admin com identidade Proofline preservando lógica e rotas; dataset canônico (78 cliques · 36 FTDs · R$ 12.013 investido · CPFTD R$ 334 · net R$ 19.618) sustentando toda tela com número.


Matriz página × requisito. Atualizada a cada fase (P2 → P8). Célula = ✅ conforme · ❌ pendente · ➖ não se aplica · ⏳ prévia rasa (banner "Esta tela será detalhada na fase PN").

**Fonte da verdade da matriz:** DECISIONS.md (D1) > UI-SYSTEM.md > PRODUCT-MAP.md.

## Changelog

- **2026-07-24 · Fase R · Turno 3 (dataset canônico realista + Bloco 3)** — Âncora `clicks` migrada de 78 para **5.000** em `src/lib/fake/db.ts` (com fator de inflação em `metricsForPeriod`/`dailySeries`; personas seguem intactas, `journeyLinked(period)` passa a expor "identidades costuradas" ≈ 78 usadas no Journey Proof strip do Command). Registrations 75 · FTDs 36 · investimento R$ 12.013 · CPFTD R$ 334 · net R$ 19.618 permanecem imutáveis. `funnelSteps.ts` recalibrado com POS 0.857 / 0.9503 gerando **5.000 → 780 → 320 → 75 → 36**; o BottleneckPanel agora aponta corretamente **Clique → StartBot como pior gargalo (−84%)**, e os semáforos ficam StartBot verified (R$ 15/meta 30), EntradaCanal verified (R$ 38/meta 60), Cadastro critical (R$ 160/meta 120), FTD critical (R$ 334/meta 300). Bloco 3 completo: (11) `SettingsTeam` virou matriz de permissões 7 perfis × 8 ações com seletor de módulo, tabela de membros e log de auditoria de permissões; (12) `SettingsGeneral` ganhou seção "Módulos do Workspace" com 8 toggles e contador de ativos; (13) `Identity` recebe tabela de Identity Resolution (identidade · session · user · telegram · canal · player · eventos · debug) complementando o grafo; (14) `Cohorts` ganhou painel de Recompra (depositantes/recompraram/taxa/distribuição por nº de depósitos/top 5); (15) `Link360` ganhou aba **Construtor UTM** com utm_source/medium/campaign/content/term + Expert + campanha vinculada + slug + URL gerada copiável; (16) `Monitoring` ganhou lista de Alertas ativos acionáveis (severidade Crítico/Alto/Médio/Baixo, status Aberto/Resolvido, causa curta + ação exata) acima da DLQ. Typecheck limpo.


- **2026-07-24 · Fase P7 concluída (Público + Settings)** — 18 páginas 100% verdes. Login/Signup/AuthCallback/Invite ganharam kicker em serif italic (`Access · Workspace` / `Access · Nova conta`), Signup passou a linkar Termos + Privacidade + DPA (fim dos `href="#"`). Pricing/Docs/Status ganharam kicker + `PreviewBadge`; Status removeu import morto (`ShieldCheck`) e passou a badge próximo ao CTA. SettingsGeneral e Profile deixaram de exibir `PhasePreviewBanner` (agora implementadas de fato), mantendo apenas kicker + `PreviewBadge` no header. SettingsTeam ganhou header padronizado com kicker + badge e passou breadcrumb para pt-BR. SettingsBilling foi expandida: uso vs cap com semáforo (proof-blue < 80% · warning ≥ 80% · critical ≥ 95%), plano atual com `FreshnessTag`, e `DataTable` de faturas usando `MetricValue`. SettingsAPI foi expandida: chaves com mascaramento/revelar (`sk_live_XXXX_••••••••••`), escopos como chips mono, e tabela de webhooks com estado (Ativo/Falhando) e latência mono; `FreshnessTag` na barra do bloco. SettingsNotifications e SettingsAudit ganharam kicker + `PreviewBadge`. Todos os header seguem o padrão Proofline: `text-11 font-serif italic text-stone` como kicker, `text-24 font-bold` como título, `PreviewBadge` ao lado — nenhum hex literal em página nova.
- **2026-07-24 · Fase P8 concluída (Super Admin)** — 23 páginas de `src/pages/platform/*` reestilizadas em Proofline sem reestruturação: novo componente compartilhado `PlatformPageHeader` (kicker serif italic + título sans bold + `PreviewBadge`), tokens D1 aplicados em bloco (`[var(--*)]` legadas convertidas para classes `bg-graphite`/`text-eggshell`/`border-line`/etc.), hex literal `#7C91FF` do `ProgressBar` local convertido em `var(--proof-blue)`, mono tabular garantido em IDs, valores monetários, timestamps e latências, StatusChip com enum fechado onde havia status (Guardrails ativos/inativos, tickets), `DataTable` padrão preservado em Tenants/Usage/Invoices/Reliability/Releases/Staff/Support/Compliance/AIProviders/AIPrompts/AIRouting/AIGuardrails/Announcements/APIs/Entitlements, e chaves de IA/credenciais permanecem mascaradas. Rotas, dados e navegação da plataforma inalterados (regra P8: só identidade visual). Prototipação Proofline P0→P8 encerrada.
- **2026-07-24 · Fase P6 concluída (Operate: Automations, FlowBuilder, Broadcasts, Segments, Inbox, InboxSettings, Approvals)** — tabela de Operate reunificada (linha em branco que quebrava a renderização removida; Inbox/InboxSettings/Approvals voltam para dentro do bloco). Automations reescrita com header serif/kicker, `PreviewBadge`, `ScenarioStateGate` + `StateShowcase`, KPIs (fluxos ativos, entradas 30d, FTDs gerados, receita atribuída) clicáveis abrindo `Evidence Drawer` com fórmula/fonte/frescor/estado, tabela padrão `DataTable` com StatusChip fechado e barra de versão (v3/v2 com rollback e shadow mode) por linha; entra na sidebar em OPERATE. FlowBuilder ganhou banner de fase, PreviewBadge, versão/rollback/shadow no topo, métrica por nó (passagem · queda · FTD · receita) e painel de teste com dados sintéticos rotulados `Synthetic` (StatusChip fechado). Broadcasts refeita com composer, canal, janela, `rate_limit` anti-ban e **dois checkpoints do Policy Engine mostrados na UI**: consentimento na fila (T-0) e consentimento imediatamente antes do envio (T-envio); resultado medido em FTD com evidência linha-a-linha; entra na sidebar em OPERATE. Segments com query builder AND/OR aninhado, salvamento como segmento dinâmico, KPIs (segmentos ativos · players cobertos) clicáveis, evidência de contagem e link contextual para Broadcasts; permanece contextual de Broadcasts. Inbox 3 colunas (filas · thread · Revenue context com aquisição, estágio, `click_id`, confiança de identidade, total depositado e influência do atendente), IA rotulada como sugestão, macros, notas internas e detecção de colisão; entra na sidebar em OPERATE. InboxSettings mantém abas Filas/Horários/Macros/SLA agora com PreviewBadge, gate, DataTable e ConfirmDialog com justificativa; contextual de Inbox. Approvals virou Central de Aprovações materializando D5 (autor ≠ revisor ≠ autoridade) — planos imutáveis com hash, impacto, amostra, frescor, quem pediu, aprovar/rejeitar com justificativa obrigatória gerando `AuditRef`; PreviewBadge, gate, tokens D1 (todas as `[var(--*)]` locais removidas), StatusChip fechado e DataTable no histórico; entra na sidebar em OPERATE. Todas as 7 páginas 100% verdes na matriz.



- **2026-07-24 · Fase P5 concluída (Connect: Integrations Hub · Integration360 + TAP/Meta/Telegram · Domains + Domain360 · Tracking + Link360 + TrackingSources · Media + MediaCreatives + Campaign360)** — Integrations Hub agora é catálogo por categoria (Provedor · Aquisição · Mensageria · Infra · IA) com `IntegrationStateBadge` (enum fechado + versão do adapter), último evento, saúde e P95 — todo número abre Evidence Drawer. `Integration360` virou template único com 6 abas (Visão · Setup guiado numerado com "teste" por passo e evidência · Eventos · Saúde · Logs · Histórico) + 3 painéis especiais: TAP (URL de postback copiável, semáforo de teste ao vivo, reconciliação postback×Reporting API sem divergência), Meta (BM/Pixel/Dedup + tabela de cobertura fbc/fbp/em/ph com liga/desliga por parâmetro) e Telegram (webhook, bots ativos e deep links `?start=` copiáveis). `IntegrationTAP/Meta/Telegram` viraram redirects contextuais para `Integration360`. Domains ganhou KPIs clicáveis (uptime, P95, SSL, cliques), tabela padrão com StatusChip de domínio e função declarada; Domain360 tem 5 abas (DNS por estado · SSL com validade · Health check com **lead sintético** rotulado `Synthetic` · Pool/rotação · Histórico). Tracking foi reescrita por elo do loop (`presell→bot` / `bot→canal`) com KPIs canônicos (78 cliques → 36 FTDs → R$ 12.013 → CPFTD R$ 334) + snippet edge; Link360 traz `click_id` opaco, split A/B, regras device/geo/hora, QR + snippet; TrackingSources tem templates de macro por plataforma e snapshot diário D+2 (FreshnessTag congelado). Media/Campaign360 mostra Meta × TrakAcquire lado a lado — spend/CPM/CTR (plataforma) contra FTD/CPFTD/net/ROI/ROAS (canônico, batendo com Command e Receita); Campaign360 tem árvore campanha→adset→ad expansível e Action Plans com aprovação/rejeição inline; MediaCreatives ranqueia por FTD real com curva de fadiga. Todas as 13 páginas 100% verdes na matriz. Sidebar: Integrações, Tracking/Links e Domínios já estavam em Connect; páginas-objeto (Integration360, Domain360, Link360, Campaign360) permanecem contextuais (➖ NAV) e TrackingSources também segue contextual sob Tracking (decisão PRODUCT-MAP §1.2 para não inflar o menu).
- **2026-07-24 · Fase P4 concluída (Analytics, Revenue, Cohorts, Reports, ReportDetail, Governance)** — Analytics reescrita com kicker serif, PreviewBadge, ScenarioStateGate, KPIs abrindo Evidence Drawer, toggle diário/horário, comparação vs período anterior (série tracejada), annotations na timeline (ReferenceLine) e visões salvas. Revenue virou P&L operacional com 6 KPIs clicáveis (fórmulas explícitas), aba de reconciliação contextual e link direto para /revenue/cohorts. Cohorts com PreviewBadge, gate, KPIs (registros/D30/LTV médio) e evidência linha-a-linha. Reports com biblioteca + agendados + snapshots congelados (v3 · v4 = nova execução, nunca sobrescreve). ReportDetail ganhou versão imutável, PreviewBadge e gate. Governance virou hub de 6 cards ativos (Policy Engine, Approval Center, PII Vault sempre mascarado, Kill Switches com ConfirmDialog+justificativa, Tenant Isolation, Audit Log). Sidebar: **Relatórios** entra em PROVE; Cohorts permanece contextual sob Receita (decisão do PRODUCT-MAP §1.2 para não inflar o menu).
- **2026-07-24 · Dívida da Command quitada + Backlog P2 (Signals/EventDetail/Reconciliation) + Fase P3 (Identity/IdentityDetail/Players/Player360)** — Command Dashboard ganhou `ScenarioStateGate` e Evidence Drawer em TODOS os KPIs e etapas do Journey (fórmula, fonte, frescor, estado). Signals refeita com `DataTable`, gate, `MetricValue` e evidência; EventDetail contextual do Ledger com gate + PreviewBadge + FreshnessTag; Reconciliation com gate, PreviewBadge e KPIs clicáveis que abrem evidência. P3: Identity reescrita (KPIs + DataTable com métodos e confiança + evidência), IdentityDetail usando `StatusChip` de domínio + tokens D1 (fim dos hex literais locais), Players com header serif/kicker + gate + StateShowcase, Player360 com PreviewBadge/StateShowcase/gate e `StatusChip` de domínio. Sidebar promovida: **Signals** e **Identity Graph** entram em OBSERVE.
- **2026-07-24 · P2 concluída (LiveEvents, Ledger, Monitoring)** — 8 estados via `ScenarioStateGate`, Evidence Drawer em todo número, breadcrumb "Observe / …", tokens D1, mono tabular. Monitoring promovida à sidebar em OBSERVE.



## Legenda das colunas

| Sigla | Requisito |
|---|---|
| **8-ST** | Os 8 estados de UX implementados (Loading · Empty · Partial · PermissionDenied · PolicyBlocked · Degraded · Error · Success) |
| **EVD** | Evidence Drawer em TODO número (nenhum valor "solto") |
| **CHIP** | StatusChip só com enum fechado (Captured/Linked/Confirmed/Reconciled/Divergent/Failed/Policy blocked/Orphan/Synthetic) |
| **TOK** | Tokens D1 — zero hex literal, zero cor fora do vocabulário |
| **MON** | Mono tabular em todo ID, valor, timestamp |
| **PRV** | PreviewBadge visível perto do título |
| **BRC** | Breadcrumb com objeto atual e pai |
| **TBL** | DataTable padrão (proibido `<table>` avulso) |
| **MOB** | Mobile reordenado por prioridade (não é desktop comprimido) |
| **NAV** | Item visível na sidebar principal (curadoria progressive-disclosure — só entra quando a linha inteira está verde) |

Fase esperada de detalhamento entre parênteses.

---

## Plano PÚBLICO (`src/pages/public/*`)

| Página | 8-ST | EVD | CHIP | TOK | MON | PRV | BRC | TBL | MOB | NAV | Fase |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Login | ✅ | ➖ | ➖ | ✅ | ➖ | ➖ | ➖ | ➖ | ✅ | ➖ | **P7 ✔** |
| Signup | ✅ | ➖ | ➖ | ✅ | ➖ | ➖ | ➖ | ➖ | ✅ | ➖ | **P7 ✔** |
| AuthCallback | ✅ | ➖ | ➖ | ✅ | ➖ | ➖ | ➖ | ➖ | ✅ | ➖ | **P7 ✔** |
| Invite | ✅ | ➖ | ➖ | ✅ | ➖ | ➖ | ➖ | ➖ | ✅ | ➖ | **P7 ✔** |
| Pricing | ✅ | ➖ | ➖ | ✅ | ✅ | ✅ | ➖ | ➖ | ✅ | ➖ | **P7 ✔** |
| Docs | ✅ | ➖ | ➖ | ✅ | ✅ | ➖ | ➖ | ➖ | ✅ | ➖ | **P7 ✔** |
| Status | ✅ | ➖ | ✅ | ✅ | ✅ | ✅ | ➖ | ➖ | ✅ | ➖ | **P7 ✔** |
| LegalTermos | ➖ | ➖ | ➖ | ✅ | ➖ | ➖ | ➖ | ➖ | ✅ | ➖ | **P7 ✔** |
| LegalPrivacidade | ➖ | ➖ | ➖ | ✅ | ➖ | ➖ | ➖ | ➖ | ✅ | ➖ | **P7 ✔** |
| LegalDPA | ➖ | ➖ | ➖ | ✅ | ➖ | ➖ | ➖ | ➖ | ✅ | ➖ | **P7 ✔** |
| LegalSubprocessadores | ➖ | ➖ | ➖ | ✅ | ➖ | ➖ | ➖ | ➖ | ✅ | ➖ | **P7 ✔** |


---

## Plano TENANT (`src/pages/tenant/*`)

### Overview

| Página | 8-ST | EVD | CHIP | TOK | MON | PRV | BRC | TBL | MOB | NAV | Fase |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Command | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ➖ | ✅ | ✅ | **P1/P3 ✔** |
| Analytics | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **P4 ✔** |
| Revenue | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **P4 ✔** |

### Connect

| Página | 8-ST | EVD | CHIP | TOK | MON | PRV | BRC | TBL | MOB | NAV | Fase |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Tracking | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **P5 ✔** |
| TrackingSources | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ➖ | **P5 ✔** (contextual de Tracking) |
| Domains | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **P5 ✔** |
| Domain360 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ➖ | ✅ | ➖ | **P5 ✔** (contextual de Domains) |
| Link360 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ➖ | ✅ | ➖ | **P5 ✔** (contextual de Tracking) |
| Integrations | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **P5 ✔** |
| Integration360 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ➖ | **P5 ✔** (contextual de Integrations) |
| IntegrationMeta | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ➖ | **P5 ✔** (alias de Integration360) |
| IntegrationTAP | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ➖ | **P5 ✔** (alias de Integration360) |
| IntegrationTelegram | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ➖ | **P5 ✔** (alias de Integration360) |


### Observe

| Página | 8-ST | EVD | CHIP | TOK | MON | PRV | BRC | TBL | MOB | NAV | Fase |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Signals | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **P2 ✔** |
| LiveEvents | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **P2 ✔** |
| EventDetail | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ➖ | ✅ | ➖ | **P2 ✔** (contextual do Ledger) |
| Ledger | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **P2 ✔** |
| Monitoring | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **P2 ✔** |
| Reconciliation | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ➖ | **P2 ✔** (contextual de Receita) |
| Identity | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **P3 ✔** |
| IdentityDetail | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ➖ | ✅ | ➖ | **P3 ✔** (contextual do Identity) |
| Players | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **P3 ✔** |
| Player360 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ➖ | ✅ | ➖ | **P3 ✔** (contextual de Players) |

### Operate

| Página | 8-ST | EVD | CHIP | TOK | MON | PRV | BRC | TBL | MOB | NAV | Fase |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Automations | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **P6 ✔** |
| FlowBuilder | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ➖ | ✅ | ➖ | **P6 ✔** (contextual de Automations) |
| Broadcasts | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **P6 ✔** |
| Segments | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ➖ | **P6 ✔** (contextual de Broadcasts) |
| Cohorts | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ➖ | **P4 ✔** (contextual de Receita) |
| Campaign360 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ➖ | ✅ | ➖ | **P5 ✔** (contextual de Media) |
| Media | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **P5 ✔** |
| MediaCreatives | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ➖ | **P5 ✔** (contextual de Media) |
| Inbox | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ➖ | ✅ | ✅ | **P6 ✔** |
| InboxSettings | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ➖ | **P6 ✔** (contextual de Inbox) |
| Approvals | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **P6 ✔** |

### Prove

| Página | 8-ST | EVD | CHIP | TOK | MON | PRV | BRC | TBL | MOB | NAV | Fase |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Reports | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **P4 ✔** |
| ReportDetail | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ➖ | **P4 ✔** (contextual de Reports) |
| Governance | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **P4 ✔** |

### Settings/Perfil

| Página | 8-ST | EVD | CHIP | TOK | MON | PRV | BRC | TBL | MOB | NAV | Fase |
|---|---|---|---|---|---|---|---|---|---|---|---|
| SettingsGeneral | ✅ | ➖ | ➖ | ✅ | ✅ | ✅ | ✅ | ➖ | ✅ | ✅ | **P7 ✔** |
| SettingsTeam | ✅ | ➖ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **P7 ✔** |
| SettingsBilling | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **P7 ✔** |
| SettingsAPI | ✅ | ➖ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **P7 ✔** |
| SettingsNotifications | ✅ | ➖ | ➖ | ✅ | ➖ | ✅ | ✅ | ➖ | ✅ | ✅ | **P7 ✔** |
| SettingsAudit | ✅ | ➖ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **P7 ✔** |
| Profile | ✅ | ➖ | ✅ | ✅ | ➖ | ✅ | ✅ | ➖ | ✅ | ✅ | **P7 ✔** |


---

## Plano PLATAFORMA / SUPER ADMIN (`src/pages/platform/*`)

**Preservada até a P8.** Só herda tokens via CSS vars (revertidos ao D1 nesta rodada). Sem reestruturação nas fases P2–P7.

| Página | 8-ST | EVD | CHIP | TOK | MON | PRV | BRC | TBL | MOB | NAV | Fase |
|---|---|---|---|---|---|---|---|---|---|---|---|
| PlatformCommand | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ➖ | ✅ | ➖ | **P8 ✔** |
| PlatformTenants | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **P8 ✔** |
| PlatformTenantsNew | ✅ | ➖ | ➖ | ✅ | ✅ | ✅ | ✅ | ➖ | ✅ | ➖ | **P8 ✔** |
| PlatformTenant360 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ➖ | **P8 ✔** |
| PlatformUsage | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **P8 ✔** |
| PlatformPlans | ✅ | ➖ | ➖ | ✅ | ✅ | ✅ | ✅ | ➖ | ✅ | ✅ | **P8 ✔** |
| PlatformEntitlements | ✅ | ➖ | ➖ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **P8 ✔** |
| PlatformInvoices | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **P8 ✔** |
| PlatformIncidents | ✅ | ➖ | ✅ | ✅ | ✅ | ✅ | ✅ | ➖ | ✅ | ✅ | **P8 ✔** |
| PlatformReliability | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **P8 ✔** |
| PlatformStatus | ✅ | ➖ | ➖ | ✅ | ✅ | ✅ | ✅ | ➖ | ✅ | ✅ | **P8 ✔** |
| PlatformReleases | ✅ | ➖ | ➖ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **P8 ✔** |
| PlatformStaff | ✅ | ➖ | ➖ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **P8 ✔** |
| PlatformSupport | ✅ | ➖ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **P8 ✔** |
| PlatformAnnouncements | ✅ | ➖ | ✅ | ✅ | ✅ | ✅ | ✅ | ➖ | ✅ | ✅ | **P8 ✔** |
| PlatformCompliance | ✅ | ➖ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **P8 ✔** |
| PlatformAPIs | ✅ | ➖ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **P8 ✔** |
| PlatformSettings | ✅ | ➖ | ➖ | ✅ | ✅ | ✅ | ✅ | ➖ | ✅ | ✅ | **P8 ✔** |
| PlatformAICost | ✅ | ✅ | ➖ | ✅ | ✅ | ✅ | ✅ | ➖ | ✅ | ✅ | **P8 ✔** |
| PlatformAIProviders | ✅ | ➖ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **P8 ✔** |
| PlatformAIRouting | ✅ | ➖ | ➖ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ➖ | **P8 ✔** |
| PlatformAIGuardrails | ✅ | ➖ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ➖ | **P8 ✔** |
| PlatformAIPrompts | ✅ | ➖ | ➖ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ➖ | **P8 ✔** |

---

## Burn-down por fase

| Fase | Escopo | Status |
|---|---|---|
| P0 · Foundations | Tokens D1, primitivos (FreshnessTag, IntegrationStateBadge, AuditRef, MetricValue, PreviewBadge), 8 estados como componentes | ✔ concluída (tokens revertidos nesta rodada) |
| P1 · Command | Command definitivo, funil monotônico, live feed cronológico, MetricValue, PreviewBadge, dataset canônico | ✔ concluída |
| P2 · Signal Ledger + Observe | LiveEvents · Ledger · Monitoring · Signals · EventDetail · Reconciliation | ✔ concluída em 2026-07-24 — Signals promovida à sidebar em Observe |
| P3 · Identity + Players | Identity Graph, IdentityDetail, Players, Player360 | ✔ concluída em 2026-07-24 — Identity Graph promovida à sidebar em Observe |
| P4 · Analytics + Revenue + Reports | Analytics, Revenue, Cohorts, Reports, ReportDetail, Governance | ✔ concluída em 2026-07-24 — Relatórios promovido à sidebar em Prove; Cohorts contextual de Receita |
| P5 · Connect | Tracking, TrackingSources, Link360, Domains, Domain360, Integrations, Integration360, IntegrationTAP/Meta/Telegram, Media, MediaCreatives, Campaign360 | ✔ concluída em 2026-07-24 — 13 páginas 100% verdes; Integrações, Tracking e Domínios já estavam em Connect na sidebar; páginas-objeto e TrackingSources permanecem contextuais |
| P6 · Operate | Automations, FlowBuilder, Broadcasts, Segments, Inbox, InboxSettings, Approvals | ✔ concluída em 2026-07-24 — 7 páginas 100% verdes; Automations, Broadcasts, Inbox e Approvals promovidas à sidebar em OPERATE; Segments contextual de Broadcasts; FlowBuilder contextual de Automations; InboxSettings contextual de Inbox |
| P7 · Público + Settings | Login, Signup, AuthCallback, Invite, Pricing, Docs, Status, Legal (Termos/Privacidade/DPA/Subprocessadores), SettingsGeneral, SettingsTeam, SettingsBilling, SettingsAPI, SettingsNotifications, SettingsAudit, Profile | ✔ concluída em 2026-07-24 — 18 páginas 100% verdes; kicker em serif italic em todas, PreviewBadge onde aplicável, PhasePreviewBanner removido de SettingsGeneral e Profile (agora implementadas de fato), SettingsBilling expandida (uso vs cap com semáforo, faturas em DataTable), SettingsAPI expandida (chaves com mascaramento/revelar, escopos, webhooks com estado e latência), Signup linkando os 4 documentos legais |
| P8 · Super Admin | Repaint Proofline das 23 páginas de `src/pages/platform/*` — kicker serif italic + PreviewBadge + tokens D1 + mono tabular + StatusChip fechado sem reestruturar dados ou rotas | ✔ concluída em 2026-07-24 — 23 páginas 100% verdes; `PlatformPageHeader` compartilhado; hex literal `#7C91FF` removido do ProgressBar (agora `var(--proof-blue)`) |


**Regra de prévia rasa (Product-Map §0):** cada página fora da fase corrente exibe explicitamente o banner "Esta tela será detalhada na fase PN". Nenhuma tela finge estar pronta.

## Changelog · Fase R · Turno 2 (2026-07-24)

**Correção crítica no funil de aquisição (`src/lib/fake/funnelSteps.ts`)**
- Reescrito com **ancoragem de ponta a ponta**: Clique = `clicks` (78) · Cadastro = `registrations` (75) · FTD = `ftds` (36) — âncoras JAMAIS clampados.
- StartBot e Entrada Canal agora são **interpolados** no intervalo [registrations, clicks] via `between(hi, lo, pos)` (POS 0.35 / 0.70), gerando 78 ≥ 77 ≥ 76 ≥ 75 ≥ 36 (monotonia preservada sem rebaixar âncoras).
- Adicionado **assert de coerência** que lança se qualquer âncora divergir de `metricsForPeriod` ou se a monotonia quebrar.
- Cabeçalho documenta: "âncoras nunca são clampados; só as etapas intermediárias são derivadas".

**Duas vistas da mesma verdade declaradas (`src/lib/fake/db.ts`)**
- Cabeçalho do dataset canônico agora explicita as duas vistas:
  - Journey proof (Captured → Linked → Registered → Confirmed → Reconciled) = **cadeia de prova**
  - Funil de aquisição (Clique → StartBot → EntradaCanal → Cadastro → FTD) = **comportamento operacional**
- Ambas partilham as mesmas âncoras (78 · 36).

**EvidencePayload ganhou `view` (`src/lib/evidence.ts`)**
- Campo `view: 'journey_proof' | 'acquisition_funnel' | 'operational'`.
- `EvidenceDrawer` exibe chip "Vista: …" ao lado de estado + frescor.

**Experts renomeados (`src/lib/fake/experts.ts`)**
- Operação Tainá (cliente-zero contratual, DECISIONS.md Parte III): **Tainá Souza · Renata Alves · Jeferson Lima · Marcos Vinícius · Larissa Prado · Gabriel Menezes**.

**Bloco 2 · Integration360 / TAP setup guiado (`src/pages/tenant/Integration360.tsx`)**
- URL base copiável + **template completo** com macros + **3 templates por evento** (lead · ftd · deposit) com botão Copiar dedicado.
- **Tabela de 8 macros** ({{afp}}, {{customer_id}}, {{registration_id}}, {{first_deposit_amount}}, {{deposit}}, {{payout_currency}}, {{campaign_id}}, {{brand_id}}) mapeando para o campo interno.
- Passo a passo numerado para o painel TAP.
- Toggle **"Disparar Meta CAPI automaticamente"** com mapeamento visível (FTD→Purchase · Lead→Lead · Deposit→Subscribe) e ação **"Rotacionar token"**.
- **Teste ao vivo**: seletor de evento + campo `test_event_code` + botão "Enviar teste" com histórico ("Enviado · evento · N evento(s) recebido(s) · há X"), StatusChip fechado e Evidence por linha (`view: 'operational'`).
- **Mapeamento externo → interno** editável em DataTable (tag "lead" → lead_created; bot start → bot_started; depósito da casa → deposit_made; first_deposit_confirmed → ftd_confirmed).
- **Histórico de sincronização** em DataTable (data · plataforma · importados · erros · Status Sucesso/Parcial/Erro) com Evidence por linha.
- Novo componente `src/components/data/TeachingError.tsx` (código + causa + ação + onde + hint) instanciado com o exemplo canônico "(#200) Missing Permissions".

## Changelog · Fase E · Curadoria e Usabilidade (2026-07-24)

**E1 · Sidebar deriva corrigida — 14 itens exatos.**
- Overview (2): Command · Analytics.
- Connect (3): Integrações · Tracking/Links · Domínios.
- Observe (4): Signal Ledger · Monitoramento · Players · Identity Graph.
- Operate (2): Automações · Mídia.
- Prove (3): Receita · Relatórios · Governança.
- **Fundidos**: `/live` → `/ledger?live=1` (toggle "Ao vivo" na tabela). `/signals` → `/integrations/meta`.
- **Movidos para /roadmap** (Fase 2): Broadcasts, Caixa de Entrada.
- **Contextual**: Aprovações agora só pelo card "Approval Center" em Governança.
- Ícones únicos por item (fim de duplicatas Radio/UserSquare).

**E2 · Período global persistido.**
- `PeriodContext` grava seleção em `localStorage` (`proofline.period`), consumido por todas as telas via `usePeriod`.

**E3 · Busca universal ⌘K funcional.**
- CommandBar agora resolve por padrões diretos: `p_*`, `evt_*`, `clk_*`, `tg_*`, `cust_*`, email e telefone — cada match navega direto ao objeto.
- Grupo "Ações" inclui: criar link, testar postback, abrir Ledger ao vivo, reconciliação, radar.
- Grupo "Eventos" busca no Signal Ledger por `id`/`person_id`.

**E4 · Todo número prova E navega.**
- `EvidencePayload` ganhou `navigateTo` + `navigateLabel`.
- `EvidenceDrawer` renderiza CTA proof-blue no rodapé (default: "Ver no Ledger" → `/ledger`).

**E5 · Checklist de ativação no Command.**
- `ActivationChecklist` renderiza 6 passos (provider · domínio · link · bot · Meta CAPI · primeiro FTD). Some quando `reconciledFtds > 0` (regra PRODUCT-MAP F1).

**E6 · Radar de anomalias (DECISIONS D8).**
- `RadarPanel` deriva até 3 anomalias do dataset canônico + regras (worst bottleneck, CPFTD vs. `KPI_TARGETS.cost_ftd`, Meta CAPI degradada). Cada card mostra POR QUÊ, IMPACTO e AÇÃO com destino navegável.

**E7 · Hierarquia de leitura no Command.**
- Adicionados marcadores "Nível 1 · Sinais" e "Nível 2 · Diagnóstico" separando visualmente o que do porquê.
- **Analytics**: faixa de MetricCards duplicada removida — a exploração começa direto no gráfico.

**E8 · Barra inferior mobile (UI-SYSTEM §5).**
- `MOBILE_TABS` redefinido: Command · Connect (`/integrations`) · Signals (`/ledger`) · Media · Revenue. Ativos com token `text-proof-blue`, tipografia mono uppercase.

**E9 · Breadcrumb suprimido em nível 1.**
- `AppShell` esconde a trilha quando `breadcrumb.length <= 1` (páginas de topo sem pai navegável).

**Correção de matriz (NAV).**
- Login, Signup, Pricing, Docs, Status, Legal (todas): NAV = ➖ (páginas públicas nunca pertenceram à sidebar do tenant).
- Removida linha órfã do changelog anterior ("Próximo: P6 …") — obsoleta.

Contagem oficial da sidebar do tenant após a Fase E: **14 itens** (2 · 3 · 4 · 2 · 3).
