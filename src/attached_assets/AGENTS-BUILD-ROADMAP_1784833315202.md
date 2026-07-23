# TRAKACQUIRE — AGENTS BUILD ROADMAP
### O farol do desenvolvimento em 3 fases. Leia junto com AGENTS.md.
*Ordem de precedência: DECISIONS.md → PRODUCT-MAP.md → esta roadmap → UI-SYSTEM.md.*

---

## 0. A DECISÃO QUE FAZ AS 3 FASES FUNCIONAREM: **CONTRACT-FIRST COM COSTURA DE DADOS**

O erro clássico é prototipar com dado falso espalhado pela UI e depois reescrever tudo. Aqui **não se joga nada fora**, porque a UI nunca fala com o banco: ela fala com **repositórios tipados**.

```
UI  →  hooks (react-query)  →  Repository<T> (interface)  →  impl
                                                             ├── FakeRepo   (Fase 1)
                                                             ├── HybridRepo (Fase 2)
                                                             └── PgRepo     (Fase 3)
```

**Regra que atravessa as 3 fases:** o mesmo `@trakacquire/contracts` define tipos, eventos, erros e métricas. Trocar de fase = trocar a implementação registrada no container. **A UI não muda uma linha.** Se um PR mudar a UI para acomodar o backend, o contrato estava errado — conserta o contrato, não a tela.

**Proibido em qualquer fase:** `fetch` direto em componente · dado mock fora do pacote de fakes · tipo `any` · string de status literal (só enum do contrato) · lógica de negócio dentro de componente React.

---

## 1. STACK (a melhor para este produto, não a da moda)

| Camada | Escolha | Por quê |
|---|---|---|
| App | **Next.js (App Router) + TypeScript strict** | SSR onde agrega, server actions, um só runtime |
| UI | **Tailwind + shadcn/ui + Radix** | acessibilidade de série, componível, sem CSS-in-JS pesado |
| Estado servidor | **TanStack Query** | cache, invalidação, offline-first, estados de loading/erro de série |
| Formulário | **react-hook-form + zod** | validação compartilhada com os contratos |
| Contratos | **zod + tipos gerados** | uma definição serve UI, API e testes |
| Banco | **Postgres (Supabase)** — RLS, partição, constraints | isolamento provável e SQL real |
| Auth | **Supabase Auth** (magic link + MFA) | integra com RLS via `auth.uid()` |
| Efeitos externos | **outbox em Postgres + workers** | replay seguro, sem broker no início |
| Analytics | Postgres → **ClickHouse** só no Gate 4+ | não antecipar escala inexistente |
| Deploy | **Vercel** (app) + Supabase (dados) | previews por PR = validação do dono |
| Testes | **Vitest** (unit/contract) · **Playwright** (E2E/visual) · **pgTAP ou suíte SQL** (RLS) | prova, não promessa |
| Observabilidade | **Sentry** + OpenTelemetry (Fase 3) | correlation_id ponta a ponta |
| Filas/agendamento | **pg_cron + workers** (Fase 3) | menos peças, mesma garantia |

---

## 2. HIERARQUIA DE ARQUIVOS (nasce na Fase 1 e não muda nas outras)

```
/apps
  /web                          Next.js — tenant app (app.)
    /app
      (public)/                 login, signup, convite, callback
      (tenant)/
        command/ analytics/ reports/
        integrations/[slug]/ domains/[id]/ tracking/[id]/
        ledger/ identity/[personId]/ players/[id]/ signals/ monitoring/
        automations/[id]/ segments/ broadcasts/ inbox/ media/[campaignId]/
        revenue/ governance/ settings/
      api/                      route handlers (webhooks, redirect, ingest)
    /components                 ver UI-SYSTEM §7
    /features                   por domínio: hooks + view-models + telas compostas
    /lib                        client de dados, auth, formatação, feature flags
  /admin                        Next.js — plano plataforma (admin.)
  /workers                      projectors, outbox, reconciliação, sintéticos (Fase 3)
/packages
  /contracts                    zod schemas: entidades, eventos, métricas, erros, DTOs
  /repositories                 interfaces + FakeRepo + PgRepo
  /ui                           design system Proofline (tokens + primitivos)
  /auth                         RBAC, contexto de workspace, guards
  /adapters                     tap, meta, telegram, whatsapp, sms (versionados)
  /testing                      fixtures, factories, contract tests, isolation suite
/supabase
  /migrations                   SQL versionado, expand-only
  /seed                         seeds determinísticos por ambiente
/docs                           ADRs, runbooks, event catalog, metric registry
```

---

## 3. FASE 1 — PROTÓTIPO COMPLETO E NAVEGÁVEL

**Objetivo:** o produto inteiro existe e se navega, com dados falsos **realistas e determinísticos**, para validar jornada, densidade e ausência de lacuna — antes de gastar backend.

**Entregáveis**
1. `@trakacquire/contracts` completo: entidades (person, click, identity, event, transaction, attribution, link, domain, flow, conversation, campaign, workspace, tenant, plan), enums de estado, **catálogo de eventos**, **registry de métricas** (nome, fórmula, fonte, unidade), tipos de erro.
2. `@trakacquire/repositories` com **interface por agregado** e `FakeRepo` gerando dados coerentes entre si (o FTD do feed é o mesmo do Player 360 e do Revenue — **coerência é requisito, não detalhe**).
3. `@trakacquire/ui` com todos os componentes do UI-SYSTEM, incluindo **os 8 estados** como componentes reais.
4. **Todas as páginas** do PRODUCT-MAP nos dois planos (tenant e admin), navegáveis, com menu, breadcrumb, busca ⌘K e drawers.
5. Cada página com os 8 estados **demonstráveis** via seletor de cenário em dev (`?state=empty|partial|denied|blocked|degraded|error`).
6. Playwright cobrindo os 8 user flows do PRODUCT-MAP + snapshots visuais desktop/mobile.
7. Feature flags locais e RBAC **já aplicado na UI** (papel muda o que aparece).

**Definition of Done da Fase 1**
- [ ] Zero página órfã: script que percorre rotas e falha se alguma não for alcançável por menu/link/busca
- [ ] Zero `any`, zero `fetch` em componente, zero cor hardcoded (lint custom falha o build)
- [ ] Todo número renderizado abre EvidenceDrawer (teste automatizado verifica)
- [ ] Os 8 flows passam no Playwright em desktop e mobile
- [ ] Nenhum arquivo de mock fora de `/repositories/fake`
- [ ] Lighthouse a11y ≥ 95 nas 10 páginas principais

**Instruções ao agente (Fase 1)**
> Trabalhe **página por página, em PR por grupo de navegação** (nunca "todas as telas" num PR). Ordem: AppShell → Command → Players/Player360 → Tracking/Domains → Integrations/Setup TAP → Ledger/Identity → Signals → Automations/Inbox → Media → Revenue/Governança → Settings → Admin.
> Antes de cada página: releia a entrada dela no PRODUCT-MAP e liste o que vai renderizar. Se faltar informação, **pergunte** — não invente conteúdo.
> Todo dado vem do repositório fake; se precisar de um campo que não existe no contrato, **adicione ao contrato primeiro** (PR de contrato separado se for grande).

---

## 4. FASE 2 — APROXIMAÇÃO DO BACKEND REAL

**Objetivo:** o esqueleto de dados real existe, os caminhos críticos deixam de ser falsos, e a costura provada — **sem quebrar a UI da Fase 1**.

**Entregáveis**
1. **Migrações Supabase** (expand-only): workspaces, membership, persons, identities, identity_links, clicks, links, domains, registrations, transactions, attributions, events (particionada) + event_idempotency, consent_events, audit_log, pii vault em schema apartado.
2. **RLS deny-by-default + FORCE** em tudo, `app.user_workspace_ids()` SECURITY DEFINER com `search_path=''`.
3. **Suíte de isolamento no CI** — para cada tabela: SELECT/INSERT/UPDATE/DELETE cross-tenant devem falhar; build vermelho se qualquer um passar.
4. **Ingestão real do caminho crítico:** redirect + click · webhook Telegram + costura no `/start` · postback TAP idempotente · projeção de atribuição (last qualified click, 30d, congelado no registro).
5. **TAP Simulator** no repo (FTD, duplicado 5x, fora de ordem, reversal, órfão) — o Gate é satisfazível sem depender da casa.
6. `PgRepo` implementando os mesmos contratos; **flag por agregado** decide fake vs real (migração gradual, sem big bang).
7. Auth real + RBAC no servidor (a UI nunca é a barreira).
8. Contract tests por adapter com fixtures sanitizadas.

**Definition of Done da Fase 2**
- [ ] **1 FTD real atribuído ponta a ponta**, visível no Command com evidência e reproduzível no Ledger
- [ ] Mesmo postback 5× = 1 evento de domínio; fora de ordem reconcilia; estorno gera compensatório
- [ ] Suíte de isolamento verde e obrigatória no merge
- [ ] `supabase db reset` aplica do zero sem erro (evidência no PR)
- [ ] Nenhuma alteração de UI foi necessária para trocar fake→real (se foi, o contrato mudou e está documentado)
- [ ] Replay de projeção não dispara efeito externo (teste prova)

**Instruções ao agente (Fase 2)**
> Uma migração por PR quando possível; **nunca destrutiva** (expand → migrate → contract em PRs separados).
> Antes de escrever SQL, declare no PR: chave de idempotência, política RLS e como o teste de isolamento cobre a tabela nova.
> Ao trocar um agregado de fake para real, **remova o fake correspondente no mesmo PR** — dois caminhos vivos é dívida.

---

## 5. FASE 3 — BACKEND COMPLETO, PRODUÇÃO E ESCALA

**Objetivo:** tudo que é efeito externo, confiabilidade, governança e plataforma — sem lacuna, pronto para cliente pagante.

**Entregáveis**
1. **Outbox + workers**: envio CAPI, mensagens Telegram/WhatsApp, escrita Meta, broadcasts. Retry com backoff, DLQ visível, idempotência por delivery.
2. **Policy Engine + Approval Center**: consentimento, elegibilidade, tetos, plano imutável com hash, aprovação, execução, audit.
3. **Reconciliação** postback × Reporting API × custo de mídia com snapshots fechados e versionados.
4. **Signals/CAPI Health**: cobertura de parâmetros, toggles, dedup por event_id, delivery ledger, EMQ observado, kill switches.
5. **Flow runtime** (execução, versionamento, sticky por person, loop guard) e **Inbox runtime** (roteamento, SLA, colisão, handoff).
6. **Media**: leitura Meta, action plans simuláveis, escrita com guardas e kill switch armado.
7. **Plataforma (admin)**: tenants, provisionamento, planos/entitlements, **metering desde o primeiro evento**, faturamento, **IA (providers, routing, prompts versionados, custo, guardrails)**, registry de APIs externas, incidentes, releases, impersonação auditada, DSR/compliance.
8. **Observabilidade**: OpenTelemetry com correlation_id, SLOs, alertas classificados (acorda / espera a manhã), runbooks, status page.
9. **Escala**: partições automatizadas, índices revisados por plano de consulta, ClickHouse para analytics se o volume exigir (ADR), cache e rate limit por workspace.

**Definition of Done da Fase 3 (pronto para vender)**
- [ ] 3 workspaces piloto com golden path real e reconciliação fechada
- [ ] Replay reconstrói projeções sem reenviar nada externo
- [ ] Backup restaurado em teste + simulação de incidente concluída
- [ ] Pentest independente antes do multi-tenant público
- [ ] Metering medindo desde o primeiro evento; quotas e kill switches testados
- [ ] Termos, privacidade, DPA e retenção publicados
- [ ] Todos os checklists do PRODUCT-MAP §7 e da SKILL §7 verdes

---

## 6. COMO O AGENTE TRABALHA (as 3 fases valem igual)

**Ciclo obrigatório:** ler contexto → **PLANO** → aprovação do dono → branch → implementar com testes no mesmo PR → CI verde → CodeRabbit → **bloco "Validação do dono"** → merge pelo dono.

**Bloco obrigatório no PR**
```md
## Validação do dono
O que testar: …
Onde clicar: …
O que esperar: …
O que NÃO deve acontecer: …
Evidência: (link do preview / print / log do CI)
```

**Regras de parada (STOP)**
- Premissa não verificada → **não construa**; diga o que falta.
- 3 tentativas sem progresso → pare e reporte.
- Suspeita de vazamento entre tenants → **stop ship** imediato.
- Cota acabando → pare em estado seguro **commitado**.
- Pedido conflita com DECISIONS.md → aponte o conflito antes de executar.

**Nunca**
Push direto na main · mock fora de `/repositories/fake` · segredo em código ou log · migração destrutiva sem ADR · desligar teste para o build passar · tratar demo de UI como prova de integração · concluir o que não verificou.

---

## 7. SEQUÊNCIA DE PRs (o backlog inicial, em ordem)

**Fase 1:** `contracts-base` → `ui-tokens-primitivos` → `appshell-navegacao` → `estados-8` → `fake-repos` → `command` → `players` → `tracking-domains` → `integrations-setup` → `ledger-identity` → `signals` → `automations` → `inbox` → `media-creatives` → `revenue-governanca` → `settings` → `admin-plataforma` → `e2e-flows`.

**Fase 2:** `migracao-tenancy-rls+isolation` → `migracao-identity` → `migracao-acquisition` → `migracao-events-idempotencia` → `migracao-finance-consent-audit` → `pii-vault` → `redirect-click-real` → `telegram-costura` → `tap-postback+simulator` → `attribution-projector` → `pgrepo-por-agregado` → `auth-rbac-servidor`.

**Fase 3:** `outbox-workers` → `policy-approval` → `capi-delivery` → `reconciliacao-snapshots` → `flow-runtime` → `inbox-runtime` → `media-read` → `media-write-guardas` → `admin-tenants-billing` → `admin-ia-apis` → `observabilidade-slo` → `hardening-escala`.

> Cada item vira um PR. Nenhum item começa antes do anterior estar mergeado, salvo independência declarada no plano.
