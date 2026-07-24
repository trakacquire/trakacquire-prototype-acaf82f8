# CONFORMANCE — TrakAcquire Proofline

Matriz página × requisito. Atualizada a cada fase (P2 → P8). Célula = ✅ conforme · ❌ pendente · ➖ não se aplica · ⏳ prévia rasa (banner "Esta tela será detalhada na fase PN").

**Fonte da verdade da matriz:** DECISIONS.md (D1) > UI-SYSTEM.md > PRODUCT-MAP.md.

## Changelog

- **2026-07-24 · Fase P6 concluída (Operate: Automations, FlowBuilder, Broadcasts, Segments, Inbox, InboxSettings, Approvals)** — tabela de Operate reunificada (linha em branco que quebrava a renderização removida; Inbox/InboxSettings/Approvals voltam para dentro do bloco). Automations reescrita com header serif/kicker, `PreviewBadge`, `ScenarioStateGate` + `StateShowcase`, KPIs (fluxos ativos, entradas 30d, FTDs gerados, receita atribuída) clicáveis abrindo `Evidence Drawer` com fórmula/fonte/frescor/estado, tabela padrão `DataTable` com StatusChip fechado e barra de versão (v3/v2 com rollback e shadow mode) por linha; entra na sidebar em OPERATE. FlowBuilder ganhou banner de fase, PreviewBadge, versão/rollback/shadow no topo, métrica por nó (passagem · queda · FTD · receita) e painel de teste com dados sintéticos rotulados `Synthetic` (StatusChip fechado). Broadcasts refeita com composer, canal, janela, `rate_limit` anti-ban e **dois checkpoints do Policy Engine mostrados na UI**: consentimento na fila (T-0) e consentimento imediatamente antes do envio (T-envio); resultado medido em FTD com evidência linha-a-linha; entra na sidebar em OPERATE. Segments com query builder AND/OR aninhado, salvamento como segmento dinâmico, KPIs (segmentos ativos · players cobertos) clicáveis, evidência de contagem e link contextual para Broadcasts; permanece contextual de Broadcasts. Inbox 3 colunas (filas · thread · Revenue context com aquisição, estágio, `click_id`, confiança de identidade, total depositado e influência do atendente), IA rotulada como sugestão, macros, notas internas e detecção de colisão; entra na sidebar em OPERATE. InboxSettings mantém abas Filas/Horários/Macros/SLA agora com PreviewBadge, gate, DataTable e ConfirmDialog com justificativa; contextual de Inbox. Approvals virou Central de Aprovações materializando D5 (autor ≠ revisor ≠ autoridade) — planos imutáveis com hash, impacto, amostra, frescor, quem pediu, aprovar/rejeitar com justificativa obrigatória gerando `AuditRef`; PreviewBadge, gate, tokens D1 (todas as `[var(--*)]` locais removidas), StatusChip fechado e DataTable no histórico; entra na sidebar em OPERATE. Todas as 7 páginas 100% verdes na matriz.


- **2026-07-24 · Fase P5 concluída (Connect: Integrations Hub · Integration360 + TAP/Meta/Telegram · Domains + Domain360 · Tracking + Link360 + TrackingSources · Media + MediaCreatives + Campaign360)** — Integrations Hub agora é catálogo por categoria (Provedor · Aquisição · Mensageria · Infra · IA) com `IntegrationStateBadge` (enum fechado + versão do adapter), último evento, saúde e P95 — todo número abre Evidence Drawer. `Integration360` virou template único com 6 abas (Visão · Setup guiado numerado com "teste" por passo e evidência · Eventos · Saúde · Logs · Histórico) + 3 painéis especiais: TAP (URL de postback copiável, semáforo de teste ao vivo, reconciliação postback×Reporting API sem divergência), Meta (BM/Pixel/Dedup + tabela de cobertura fbc/fbp/em/ph com liga/desliga por parâmetro) e Telegram (webhook, bots ativos e deep links `?start=` copiáveis). `IntegrationTAP/Meta/Telegram` viraram redirects contextuais para `Integration360`. Domains ganhou KPIs clicáveis (uptime, P95, SSL, cliques), tabela padrão com StatusChip de domínio e função declarada; Domain360 tem 5 abas (DNS por estado · SSL com validade · Health check com **lead sintético** rotulado `Synthetic` · Pool/rotação · Histórico). Tracking foi reescrita por elo do loop (`presell→bot` / `bot→canal`) com KPIs canônicos (78 cliques → 36 FTDs → R$ 12.013 → CPFTD R$ 334) + snippet edge; Link360 traz `click_id` opaco, split A/B, regras device/geo/hora, QR + snippet; TrackingSources tem templates de macro por plataforma e snapshot diário D+2 (FreshnessTag congelado). Media/Campaign360 mostra Meta × TrakAcquire lado a lado — spend/CPM/CTR (plataforma) contra FTD/CPFTD/net/ROI/ROAS (canônico, batendo com Command e Receita); Campaign360 tem árvore campanha→adset→ad expansível e Action Plans com aprovação/rejeição inline; MediaCreatives ranqueia por FTD real com curva de fadiga. Todas as 13 páginas 100% verdes na matriz. Sidebar: Integrações, Tracking/Links e Domínios já estavam em Connect; páginas-objeto (Integration360, Domain360, Link360, Campaign360) permanecem contextuais (➖ NAV) e TrackingSources também segue contextual sob Tracking (decisão PRODUCT-MAP §1.2 para não inflar o menu).
- **2026-07-24 · Fase P4 concluída (Analytics, Revenue, Cohorts, Reports, ReportDetail, Governance)** — Analytics reescrita com kicker serif, PreviewBadge, ScenarioStateGate, KPIs abrindo Evidence Drawer, toggle diário/horário, comparação vs período anterior (série tracejada), annotations na timeline (ReferenceLine) e visões salvas. Revenue virou P&L operacional com 6 KPIs clicáveis (fórmulas explícitas), aba de reconciliação contextual e link direto para /revenue/cohorts. Cohorts com PreviewBadge, gate, KPIs (registros/D30/LTV médio) e evidência linha-a-linha. Reports com biblioteca + agendados + snapshots congelados (v3 · v4 = nova execução, nunca sobrescreve). ReportDetail ganhou versão imutável, PreviewBadge e gate. Governance virou hub de 6 cards ativos (Policy Engine, Approval Center, PII Vault sempre mascarado, Kill Switches com ConfirmDialog+justificativa, Tenant Isolation, Audit Log). Sidebar: **Relatórios** entra em PROVE; Cohorts permanece contextual sob Receita (decisão do PRODUCT-MAP §1.2 para não inflar o menu).
- **2026-07-24 · Dívida da Command quitada + Backlog P2 (Signals/EventDetail/Reconciliation) + Fase P3 (Identity/IdentityDetail/Players/Player360)** — Command Dashboard ganhou `ScenarioStateGate` e Evidence Drawer em TODOS os KPIs e etapas do Journey (fórmula, fonte, frescor, estado). Signals refeita com `DataTable`, gate, `MetricValue` e evidência; EventDetail contextual do Ledger com gate + PreviewBadge + FreshnessTag; Reconciliation com gate, PreviewBadge e KPIs clicáveis que abrem evidência. P3: Identity reescrita (KPIs + DataTable com métodos e confiança + evidência), IdentityDetail usando `StatusChip` de domínio + tokens D1 (fim dos hex literais locais), Players com header serif/kicker + gate + StateShowcase, Player360 com PreviewBadge/StateShowcase/gate e `StatusChip` de domínio. Sidebar promovida: **Signals** e **Identity Graph** entram em OBSERVE.
- **2026-07-24 · P2 concluída (LiveEvents, Ledger, Monitoring)** — 8 estados via `ScenarioStateGate`, Evidence Drawer em todo número, breadcrumb "Observe / …", tokens D1, mono tabular. Monitoring promovida à sidebar em OBSERVE.
- Próximo: **P6 (Operate: Automations, FlowBuilder, Broadcasts, Segments, Inbox, Approvals)**.



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
| Login | ❌ | ➖ | ➖ | ⏳ | ➖ | ➖ | ➖ | ➖ | ❌ | ❌ | P7 |
| Signup | ❌ | ➖ | ➖ | ⏳ | ➖ | ➖ | ➖ | ➖ | ❌ | ❌ | P7 |
| AuthCallback | ❌ | ➖ | ➖ | ⏳ | ➖ | ➖ | ➖ | ➖ | ❌ | ❌ | P7 |
| Invite | ❌ | ➖ | ➖ | ⏳ | ➖ | ➖ | ➖ | ➖ | ❌ | ❌ | P7 |
| Pricing | ❌ | ➖ | ➖ | ⏳ | ⏳ | ⏳ | ➖ | ➖ | ❌ | ❌ | P7 |
| Docs | ❌ | ➖ | ➖ | ⏳ | ⏳ | ➖ | ➖ | ➖ | ❌ | ❌ | P7 |
| Status | ❌ | ➖ | ⏳ | ⏳ | ⏳ | ⏳ | ➖ | ➖ | ❌ | ❌ | P7 |
| LegalTermos | ➖ | ➖ | ➖ | ⏳ | ➖ | ➖ | ➖ | ➖ | ❌ | ❌ | P7 |
| LegalPrivacidade | ➖ | ➖ | ➖ | ⏳ | ➖ | ➖ | ➖ | ➖ | ❌ | ❌ | P7 |
| LegalDPA | ➖ | ➖ | ➖ | ⏳ | ➖ | ➖ | ➖ | ➖ | ❌ | ❌ | P7 |
| LegalSubprocessadores | ➖ | ➖ | ➖ | ⏳ | ➖ | ➖ | ➖ | ➖ | ❌ | ❌ | P7 |

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
| SettingsGeneral | ❌ | ➖ | ➖ | ✅ | ⏳ | ➖ | ✅ | ➖ | ❌ | ✅ | P7 |
| SettingsTeam | ❌ | ➖ | ➖ | ✅ | ⏳ | ➖ | ✅ | ✅ | ❌ | ❌ | P7 |
| SettingsBilling | ❌ | ➖ | ➖ | ✅ | ⏳ | ➖ | ✅ | ✅ | ❌ | ❌ | P7 |
| SettingsAPI | ❌ | ➖ | ➖ | ✅ | ⏳ | ➖ | ✅ | ➖ | ❌ | ❌ | P7 |
| SettingsNotifications | ❌ | ➖ | ➖ | ✅ | ⏳ | ➖ | ✅ | ➖ | ❌ | ❌ | P7 |
| SettingsAudit | ❌ | ➖ | ✅ | ✅ | ⏳ | ➖ | ✅ | ✅ | ❌ | ❌ | P7 |
| Profile | ❌ | ➖ | ➖ | ✅ | ⏳ | ➖ | ✅ | ➖ | ❌ | ✅ | P7 |

---

## Plano PLATAFORMA / SUPER ADMIN (`src/pages/platform/*`)

**Preservada até a P8.** Só herda tokens via CSS vars (revertidos ao D1 nesta rodada). Sem reestruturação nas fases P2–P7.

| Página | 8-ST | EVD | CHIP | TOK | MON | PRV | BRC | TBL | MOB | NAV | Fase |
|---|---|---|---|---|---|---|---|---|---|---|---|
| PlatformCommand | ❌ | ❌ | ❌ | ✅ | ⏳ | ❌ | ✅ | ➖ | ❌ | ❌ | P8 |
| PlatformTenants | ❌ | ❌ | ❌ | ✅ | ⏳ | ❌ | ✅ | ✅ | ❌ | ❌ | P8 |
| PlatformTenantsNew | ❌ | ➖ | ➖ | ✅ | ⏳ | ❌ | ✅ | ➖ | ❌ | ❌ | P8 |
| PlatformTenant360 | ❌ | ❌ | ❌ | ✅ | ⏳ | ❌ | ✅ | ➖ | ❌ | ❌ | P8 |
| PlatformUsage | ❌ | ❌ | ❌ | ✅ | ⏳ | ❌ | ✅ | ✅ | ❌ | ❌ | P8 |
| PlatformPlans | ❌ | ➖ | ➖ | ✅ | ⏳ | ❌ | ✅ | ✅ | ❌ | ❌ | P8 |
| PlatformEntitlements | ❌ | ➖ | ➖ | ✅ | ⏳ | ❌ | ✅ | ✅ | ❌ | ❌ | P8 |
| PlatformInvoices | ❌ | ❌ | ❌ | ✅ | ⏳ | ❌ | ✅ | ✅ | ❌ | ❌ | P8 |
| PlatformIncidents | ❌ | ➖ | ✅ | ✅ | ⏳ | ❌ | ✅ | ✅ | ❌ | ❌ | P8 |
| PlatformReliability | ❌ | ❌ | ❌ | ✅ | ⏳ | ❌ | ✅ | ➖ | ❌ | ❌ | P8 |
| PlatformStatus | ❌ | ➖ | ✅ | ✅ | ⏳ | ❌ | ✅ | ✅ | ❌ | ❌ | P8 |
| PlatformReleases | ❌ | ➖ | ➖ | ✅ | ⏳ | ❌ | ✅ | ✅ | ❌ | ❌ | P8 |
| PlatformStaff | ❌ | ➖ | ➖ | ✅ | ⏳ | ❌ | ✅ | ✅ | ❌ | ❌ | P8 |
| PlatformSupport | ❌ | ➖ | ➖ | ✅ | ⏳ | ❌ | ✅ | ✅ | ❌ | ❌ | P8 |
| PlatformAnnouncements | ❌ | ➖ | ➖ | ✅ | ⏳ | ❌ | ✅ | ✅ | ❌ | ❌ | P8 |
| PlatformCompliance | ❌ | ➖ | ➖ | ✅ | ⏳ | ❌ | ✅ | ➖ | ❌ | ❌ | P8 |
| PlatformAPIs | ❌ | ➖ | ➖ | ✅ | ⏳ | ❌ | ✅ | ✅ | ❌ | ❌ | P8 |
| PlatformSettings | ❌ | ➖ | ➖ | ✅ | ⏳ | ❌ | ✅ | ➖ | ❌ | ❌ | P8 |
| PlatformAICost | ❌ | ❌ | ➖ | ✅ | ⏳ | ❌ | ✅ | ✅ | ❌ | ❌ | P8 |
| PlatformAIProviders | ❌ | ➖ | ➖ | ✅ | ⏳ | ❌ | ✅ | ✅ | ❌ | ❌ | P8 |
| PlatformAIRouting | ❌ | ➖ | ➖ | ✅ | ⏳ | ❌ | ✅ | ➖ | ❌ | ❌ | P8 |
| PlatformAIGuardrails | ❌ | ➖ | ➖ | ✅ | ⏳ | ❌ | ✅ | ➖ | ❌ | ❌ | P8 |
| PlatformAIPrompts | ❌ | ➖ | ➖ | ✅ | ⏳ | ❌ | ✅ | ✅ | ❌ | ❌ | P8 |

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
| P6 · Operate | Automations, FlowBuilder, Broadcasts, Segments, Inbox, Approvals | ⏸ |
| P7 · Público + Settings | Login, Signup, Pricing, Docs, Status, Legal, Settings, Profile | ⏸ |
| P8 · Super Admin | Reestilização da plataforma (só identidade visual, sem reestruturar) | ⏸ |


**Regra de prévia rasa (Product-Map §0):** cada página fora da fase corrente exibe explicitamente o banner "Esta tela será detalhada na fase PN". Nenhuma tela finge estar pronta.
