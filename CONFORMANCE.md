# CONFORMANCE — TrakAcquire Proofline

Matriz página × requisito. Atualizada a cada fase (P2 → P8). Célula = ✅ conforme · ❌ pendente · ➖ não se aplica · ⏳ prévia rasa (banner "Esta tela será detalhada na fase PN").

**Fonte da verdade da matriz:** DECISIONS.md (D1) > UI-SYSTEM.md > PRODUCT-MAP.md.

## Changelog

- **2026-07-24 · Fase P2 concluída (LiveEvents, Ledger, Monitoring)** — as três páginas ganharam os 8 estados de UX via `ScenarioStateGate` (encaixa no ScenarioSelector já existente), Evidence Drawer em todo número (via `MetricValue` + payload `buildEvidence`), breadcrumb "Observe / …", tokens D1 sanitizados, mono tabular em ID/valor/timestamp/latência e (Ledger) mobile reordenado por prioridade — filtros antes da tabela, colunas secundárias colapsadas em subtexto da primária. Monitoring foi promovida à sidebar em OBSERVE (Command · Analytics · Integrações · Tracking · Domínios · **Live · Ledger · Monitoring · Players** · Automações · Mídia · Receita · Governança + rodapé). `Signals`, `EventDetail` e `Reconciliation` permanecem em `/roadmap` até fecharem suas linhas.
- **2026-07-24 · P2 em pausa entre iterações** — próximas rodadas retomam por **P3 (Identity Graph + Players + Player360 + IdentityDetail)** e seguem P4→P8. Guilhotina de 150%: qualquer estouro corta escopo da fase e segue.


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
| Command | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ➖ | ⏳ | ✅ | **P1 ✔** (banner de estados na P3) |
| Analytics | ❌ | ❌ | ❌ | ✅ | ⏳ | ❌ | ✅ | ❌ | ❌ | ✅ | P4 |
| Revenue | ❌ | ❌ | ❌ | ✅ | ⏳ | ❌ | ✅ | ❌ | ❌ | ✅ | P4 |

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
| Signals | ❌ | ❌ | ✅ | ✅ | ⏳ | ✅ | ✅ | ✅ | ❌ | ❌ | P2 |
| LiveEvents | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **P2 ✔** |
| EventDetail | ❌ | ❌ | ✅ | ✅ | ⏳ | ❌ | ✅ | ➖ | ❌ | ❌ | P2 (backlog) |
| Ledger | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **P2 ✔** |
| Monitoring | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **P2 ✔** |
| Reconciliation | ❌ | ❌ | ✅ | ✅ | ⏳ | ❌ | ✅ | ✅ | ❌ | ❌ | P2 |
| Identity | ❌ | ❌ | ❌ | ✅ | ⏳ | ❌ | ✅ | ✅ | ❌ | ❌ | P3 |
| IdentityDetail | ❌ | ❌ | ❌ | ✅ | ⏳ | ❌ | ✅ | ➖ | ❌ | ❌ | P3 |
| Players | ❌ | ❌ | ❌ | ✅ | ⏳ | ❌ | ✅ | ✅ | ❌ | ✅ | P3 |
| Player360 | ❌ | ❌ | ❌ | ✅ | ⏳ | ❌ | ✅ | ➖ | ❌ | ❌ | P3 |

### Operate

| Página | 8-ST | EVD | CHIP | TOK | MON | PRV | BRC | TBL | MOB | NAV | Fase |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Automations | ❌ | ❌ | ❌ | ✅ | ⏳ | ❌ | ✅ | ✅ | ❌ | ✅ | P6 |
| FlowBuilder | ❌ | ➖ | ❌ | ✅ | ⏳ | ❌ | ✅ | ➖ | ❌ | ❌ | P6 |
| Broadcasts | ❌ | ❌ | ❌ | ✅ | ⏳ | ❌ | ✅ | ✅ | ❌ | ❌ | P6 |
| Segments | ❌ | ❌ | ❌ | ✅ | ⏳ | ❌ | ✅ | ✅ | ❌ | ❌ | P6 |
| Cohorts | ❌ | ❌ | ❌ | ✅ | ⏳ | ❌ | ✅ | ✅ | ❌ | ❌ | P4 |
| Campaign360 | ❌ | ❌ | ❌ | ✅ | ⏳ | ❌ | ✅ | ➖ | ❌ | ❌ | P5 |
| Media | ❌ | ❌ | ❌ | ✅ | ⏳ | ❌ | ✅ | ✅ | ❌ | ✅ | P5 |
| MediaCreatives | ❌ | ➖ | ❌ | ✅ | ⏳ | ❌ | ✅ | ✅ | ❌ | ❌ | P5 |
| Inbox | ❌ | ➖ | ❌ | ✅ | ⏳ | ❌ | ✅ | ➖ | ❌ | ❌ | P6 |
| InboxSettings | ❌ | ➖ | ❌ | ✅ | ⏳ | ❌ | ✅ | ➖ | ❌ | ❌ | P6 |
| Approvals | ❌ | ❌ | ❌ | ✅ | ⏳ | ❌ | ✅ | ✅ | ❌ | ❌ | P6 |

### Prove

| Página | 8-ST | EVD | CHIP | TOK | MON | PRV | BRC | TBL | MOB | NAV | Fase |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Reports | ❌ | ➖ | ❌ | ✅ | ⏳ | ❌ | ✅ | ✅ | ❌ | ❌ | P4 |
| ReportDetail | ❌ | ❌ | ❌ | ✅ | ⏳ | ❌ | ✅ | ➖ | ❌ | ❌ | P4 |
| Governance | ❌ | ➖ | ❌ | ✅ | ⏳ | ❌ | ✅ | ✅ | ❌ | ✅ | P4 |

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
| P2 · Signal Ledger + Observe | LiveEvents e Ledger promovidos à sidebar; Monitoring/Reconciliation/Signals/EventDetail seguem em /roadmap até fecharem a matriz | 🟦 em andamento — LiveEvents+Ledger com PreviewBadge, breadcrumb, tokens D1 sanitizados |
| P3 · Identity + Players | Identity Graph, IdentityDetail, Players, Player360 | ⏸ |
| P4 · Analytics + Revenue + Reports | Analytics, Revenue, Cohorts, Reports, ReportDetail, Governance | ⏸ |
| P5 · Connect | Tracking, Domains, Integrations, Campaign360, Media | ⏸ |
| P6 · Operate | Automations, FlowBuilder, Broadcasts, Segments, Inbox, Approvals | ⏸ |
| P7 · Público + Settings | Login, Signup, Pricing, Docs, Status, Legal, Settings, Profile | ⏸ |
| P8 · Super Admin | Reestilização da plataforma (só identidade visual, sem reestruturar) | ⏸ |

**Regra de prévia rasa (Product-Map §0):** cada página fora da fase corrente exibe explicitamente o banner "Esta tela será detalhada na fase PN". Nenhuma tela finge estar pronta.
