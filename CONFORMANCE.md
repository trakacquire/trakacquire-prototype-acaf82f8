# CONFORMANCE — TrakAcquire Proofline

Matriz página × requisito. Atualizada a cada fase (P2 → P8). Célula = ✅ conforme · ❌ pendente · ➖ não se aplica · ⏳ prévia rasa (banner "Esta tela será detalhada na fase PN").

**Fonte da verdade da matriz:** DECISIONS.md (D1) > UI-SYSTEM.md > PRODUCT-MAP.md.

## Changelog

- **2026-07-24 · Fase P4 concluída (Analytics, Revenue, Cohorts, Reports, ReportDetail, Governance)** — Analytics reescrita com kicker serif, PreviewBadge, ScenarioStateGate, KPIs abrindo Evidence Drawer, toggle diário/horário, comparação vs período anterior (série tracejada), annotations na timeline (ReferenceLine) e visões salvas. Revenue virou P&L operacional com 6 KPIs clicáveis (fórmulas explícitas), aba de reconciliação contextual e link direto para /revenue/cohorts. Cohorts com PreviewBadge, gate, KPIs (registros/D30/LTV médio) e evidência linha-a-linha. Reports com biblioteca + agendados + snapshots congelados (v3 · v4 = nova execução, nunca sobrescreve). ReportDetail ganhou versão imutável, PreviewBadge e gate. Governance virou hub de 6 cards ativos (Policy Engine, Approval Center, PII Vault sempre mascarado, Kill Switches com ConfirmDialog+justificativa, Tenant Isolation, Audit Log). Sidebar: **Relatórios** entra em PROVE; Cohorts permanece contextual sob Receita (decisão do PRODUCT-MAP §1.2 para não inflar o menu).
- **2026-07-24 · Dívida da Command quitada + Backlog P2 (Signals/EventDetail/Reconciliation) + Fase P3 (Identity/IdentityDetail/Players/Player360)** — Command Dashboard ganhou `ScenarioStateGate` e Evidence Drawer em TODOS os KPIs e etapas do Journey (fórmula, fonte, frescor, estado). Signals refeita com `DataTable`, gate, `MetricValue` e evidência; EventDetail contextual do Ledger com gate + PreviewBadge + FreshnessTag; Reconciliation com gate, PreviewBadge e KPIs clicáveis que abrem evidência. P3: Identity reescrita (KPIs + DataTable com métodos e confiança + evidência), IdentityDetail usando `StatusChip` de domínio + tokens D1 (fim dos hex literais locais), Players com header serif/kicker + gate + StateShowcase, Player360 com PreviewBadge/StateShowcase/gate e `StatusChip` de domínio. Sidebar promovida: **Signals** e **Identity Graph** entram em OBSERVE.
- **2026-07-24 · P2 concluída (LiveEvents, Ledger, Monitoring)** — 8 estados via `ScenarioStateGate`, Evidence Drawer em todo número, breadcrumb "Observe / …", tokens D1, mono tabular. Monitoring promovida à sidebar em OBSERVE.
- Próximo: **P5 (Tracking + Domains + Integrations + Campaign360 + Media)**.


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
| Tracking | ❌ | ❌ | ❌ | ✅ | ⏳ | ❌ | ✅ | ✅ | ❌ | ✅ | P5 |
| TrackingSources | ❌ | ❌ | ❌ | ✅ | ⏳ | ❌ | ✅ | ✅ | ❌ | ❌ | P5 |
| Domains | ❌ | ➖ | ❌ | ✅ | ⏳ | ❌ | ✅ | ✅ | ❌ | ✅ | P5 |
| Domain360 | ❌ | ➖ | ❌ | ✅ | ⏳ | ❌ | ✅ | ➖ | ❌ | ❌ | P5 |
| Link360 | ❌ | ❌ | ❌ | ✅ | ⏳ | ❌ | ✅ | ➖ | ❌ | ❌ | P5 |
| Integrations | ❌ | ➖ | ❌ | ✅ | ⏳ | ❌ | ✅ | ✅ | ❌ | ✅ | P5 |
| Integration360 | ❌ | ➖ | ❌ | ✅ | ⏳ | ❌ | ✅ | ➖ | ❌ | ❌ | P5 |
| IntegrationMeta | ❌ | ➖ | ❌ | ✅ | ⏳ | ❌ | ✅ | ➖ | ❌ | ❌ | P5 |
| IntegrationTAP | ❌ | ➖ | ❌ | ✅ | ⏳ | ❌ | ✅ | ➖ | ❌ | ❌ | P5 |
| IntegrationTelegram | ❌ | ➖ | ❌ | ✅ | ⏳ | ❌ | ✅ | ➖ | ❌ | ❌ | P5 |

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
| Automations | ❌ | ❌ | ❌ | ✅ | ⏳ | ❌ | ✅ | ✅ | ❌ | ✅ | P6 |
| FlowBuilder | ❌ | ➖ | ❌ | ✅ | ⏳ | ❌ | ✅ | ➖ | ❌ | ❌ | P6 |
| Broadcasts | ❌ | ❌ | ❌ | ✅ | ⏳ | ❌ | ✅ | ✅ | ❌ | ❌ | P6 |
| Segments | ❌ | ❌ | ❌ | ✅ | ⏳ | ❌ | ✅ | ✅ | ❌ | ❌ | P6 |
| Cohorts | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ➖ | **P4 ✔** (contextual de Receita) |
| Campaign360 | ❌ | ❌ | ❌ | ✅ | ⏳ | ❌ | ✅ | ➖ | ❌ | ❌ | P5 |
| Media | ❌ | ❌ | ❌ | ✅ | ⏳ | ❌ | ✅ | ✅ | ❌ | ✅ | P5 |
| MediaCreatives | ❌ | ➖ | ❌ | ✅ | ⏳ | ❌ | ✅ | ✅ | ❌ | ❌ | P5 |
| Inbox | ❌ | ➖ | ❌ | ✅ | ⏳ | ❌ | ✅ | ➖ | ❌ | ❌ | P6 |
| InboxSettings | ❌ | ➖ | ❌ | ✅ | ⏳ | ❌ | ✅ | ➖ | ❌ | ❌ | P6 |
| Approvals | ❌ | ❌ | ❌ | ✅ | ⏳ | ❌ | ✅ | ✅ | ❌ | ❌ | P6 |

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
| P5 · Connect | Tracking, Domains, Integrations, Campaign360, Media | ⏸ |
| P6 · Operate | Automations, FlowBuilder, Broadcasts, Segments, Inbox, Approvals | ⏸ |
| P7 · Público + Settings | Login, Signup, Pricing, Docs, Status, Legal, Settings, Profile | ⏸ |
| P8 · Super Admin | Reestilização da plataforma (só identidade visual, sem reestruturar) | ⏸ |

**Regra de prévia rasa (Product-Map §0):** cada página fora da fase corrente exibe explicitamente o banner "Esta tela será detalhada na fase PN". Nenhuma tela finge estar pronta.
