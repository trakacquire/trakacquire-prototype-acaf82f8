
# Prototipação TrakAcquire — Plano Mestre (Proofline)

Escopo desta fase de trabalho: **apenas prototipação do SaaS** (UI navegável com dados mockados). Sem backend real, sem integrações vivas, sem Supabase. Cada tela deve *demonstrar* a lei Proofline e cumprir os 8 estados de UX, para que a construção real (Fases 0→7 do Master) tenha um alvo visual e comportamental congelado.

**Regras invioláveis herdadas dos documentos:**
- D1 Proofline: paleta e tipografia fixas. Sans no produto, mono em ID/valor/log, serifa **só** em marca e narrativa (não no chrome operacional).
- D2 Identidade: `person_id` canônico, `click_id` só toca clique. *Last qualified acquisition click, 30 dias, congelado no registro.*
- D3 Dados: event log append-only, TAP = verdade contábil, Meta API + snapshot = verdade de custo.
- D5 Governança: ação crítica → plano imutável + aprovação. Autor ≠ revisor ≠ release.
- **8 estados obrigatórios em toda página**: loading · empty · partial-data/freshness · permission-denied · policy-blocked · integration-degraded · error+retry · success+audit-ref. **Nada entra em "pronto" sem os 8.**
- Toda tabela financeira: números tabulares, mono, soma no rodapé, Evidence Drawer em cada número.
- **Super Admin (`/pages/platform/*`) preservada** — recebe apenas repaint Proofline, sem reestruturação.

---

## Diagnóstico do estado atual (o que fica, o que muda)

**Fica (base sólida):**
- Roteamento wouter dentro de `TrakacquireApp` sob catch-all TanStack.
- Tokens Proofline em `src/styles.css` (ink/iron/graphite/zinc/eggshell/stone + semânticas).
- Sidebar em 5 grupos, Topbar com ⌘K/Briefing/Copiloto, cards com superfície e hover-lift.
- Command redesenhada (KPIs Proofline, Journey embutido, Live feed editorial).
- Live Events editorial.
- Área **Super Admin** completa (`PlatformCommand`, `PlatformTenants`, `PlatformAI*`, `PlatformCompliance`, etc).

**Muda / falta (gaps vs Master + DECISIONS):**
1. **Tokens fora de spec** — hoje `panel` não existe, `line` está `#38383D` ok, mas `ink` deveria ser `#09090A` (temos `#0A0A0B`); amber é `#F4B860` (temos `#F1C778`); critical é `#FF6B74` (temos `#EF7D8B`). Alinhar ao Master §4.
2. **Serifa vazando no produto** — `Instrument Serif` está em H1 de Command. Master §4.1: "produto permanece funcional e direto". Serifa só em marca/narrativa externa/kicker curto. Rebaixar.
3. **Evidence Drawer** existe como componente mas **não está plugado em todos os números**. Regra: *todo número abre um*.
4. **StatusChip com vocabulário aberto** — precisa fechar em: `Captured` `Linked` `Confirmed` `Reconciled` `Divergent` `Failed` `Policy blocked` `Orphan` `Synthetic`.
5. **FreshnessTag ausente** em cards cuja fonte pode atrasar (Command KPIs, Reconciliation, Reports).
6. **IntegrationStateBadge** com vocabulário fixo (`disabled` `sandbox` `pilot` `production` `policy-blocked`) + versão do adapter — hoje inconsistente.
7. **8 estados de UX** não implementados em ~40 páginas.
8. **ApprovalCard + ConfirmDialog** existem como esqueleto — precisa aplicar em Media, Broadcasts, Merge/Unmerge, Meta write, kill switch.
9. **Signal Ledger** precisa virar a página-referência do Master §"log operacional legível": colunas horário · evento · identidade · status · latência · valor + filtros + replay/DLQ.
10. **Player 360 / Identity Graph** precisa das 7 camadas (identity · acquisition · provider · funnel · support · signals · derived) + timeline com fonte/confiança.
11. **CAPI Health, Provider Hub/TAP, Domain 360** faltam layouts editoriais do Master (págs 18–24).
12. **Approval Center + Policy Engine + PII Vault + Kill Switches** — hoje Governance é lista rasa, precisa virar hub com quatro cards ativos.
13. **Reports** — falta Semantic Metric Library, snapshots fechados, comparação de período com annotations.
14. **Flow Builder** — nós existem, mas falta métrica dentro do nó (passagem/queda/FTD/receita) e barra de versões.
15. **Command Bar (⌘K)** — hoje decorativa. Master exige busca universal por qualquer identificador + ações + copiloto.
16. **Mobile** — Master §4.3 exige barra inferior (Command · Connect · Signals · Media · Revenue) e tabela → cards. Hoje é desktop comprimido.
17. **Super Admin** — repaint Proofline (glass, hairlines, tokens corretos) sem tocar em estrutura/lógica.

---

## Fases da prototipação

Cada fase = 1 PR conceitual coeso. Anti-dispersão: ideia fora do escopo → BACKLOG.md, revista na fase seguinte.

### Fase P0 — Foundations Proofline (base normativa)
Objetivo: alinhar tokens, tipografia e primitivos ao Master antes de tocar telas.
- Ajustar tokens em `styles.css` para valores exatos do Master §4 (ink `#09090A`, panel `#171719`, amber `#F4B860`, critical `#FF6B74`).
- Rebaixar `Instrument Serif` para uso *apenas* em kicker/narrativa curta; H1 do produto volta a Inter Display.
- Consolidar `StatusChip` com enum fechado + cor semântica obrigatória.
- Criar/consolidar: `FreshnessTag`, `IntegrationStateBadge`, `AuditRef`, `MetricValue` (mono, tabular, com trigger de Evidence Drawer).
- Consolidar `EvidenceDrawer` como wrapper padrão de qualquer número.
- Criar os **8 componentes de estado** em `components/state/` (Loading · Empty · Partial · PermissionDenied · PolicyBlocked · IntegrationDegraded · Error · Success) e um HOC/hook `useUxStates()` para plugar em cada página.
- **Sem mudança de conteúdo funcional** — só primitivos.

### Fase P1 — Command Dashboard definitivo
Alinha à Master §11 e à referência visual página 17.
- KPIs Proofline com FreshnessTag + Evidence Drawer.
- Journey strip separado (Captured→Linked→Registered→Confirmed→Reconciled) com % de queda por etapa.
- Alertas com evidência/impacto/recomendação/responsável/silenciamento.
- 8 estados de UX plugados.
- Kicker serifa curta ("Every signal. One proof."), corpo em sans.

### Fase P2 — Signal Ledger + Live Events + Monitoring
Master §19 + página 10.
- Ledger: colunas horário · evento · identidade · status · latência · valor · fonte + filtros + soma no rodapé + Evidence Drawer por linha.
- DLQ visível com retry/replay/ignore/resolve.
- Monitoring: status por integração/domínio/fila/worker, SLO, P95/P99, freshness, error budget, runbook link.
- LiveFeed com marcação clara de sintéticos.
- 8 estados.

### Fase P3 — Tracking & Link Router + Domain 360
Master §12 + página 28.
- Link creation com token opaco, click_id, domínio, destino, split A/B, regras device/geo/hora.
- Domain 360: DNS, SSL, health, histórico.
- Custo por API + declarado.
- Drill-down campanha → conjunto → criativo → geo → device → hora.
- 8 estados.

### Fase P4 — Players & Identity Graph + Provider Hub/TAP + CAPI Health
Master §15, §17, §18. **Núcleo do produto.**
- Player 360 com 7 camadas + timeline + graph visual com evidência/confiança/proveniência.
- Merge/unmerge com ApprovalCard.
- Provider Hub: postbacks (Lead/Qualified/Register/FTD/QFTD/deposit/withdrawal/rollback), Reporting API, reconciliação postback×API, divergências acionáveis.
- CAPI Health: catálogo de eventos, coverage fbc/fbp/em/ph, delivery ledger, kill switch por workspace/pixel/evento.
- StatusChip vocabulário fechado em toda tabela.
- 8 estados.

### Fase P5 — Reports & Analytics + Reconciliation
Master §20.
- Operational / P&L / Cohorts D0/D7/D30 / Reconciliation / Custom builder.
- Semantic Metric Library com fórmula/fonte/versão exibidas.
- Snapshots fechados + reabertura versionada + freshness selado.
- Comparação de período + annotations + saved views.
- Export CSV/PDF/API com approval quando há PII.
- 8 estados.

### Fase P6 — Automations (Flow Builder) + Inbox + Broadcasts + Segments
Master §13, §14.
- Flow Builder: métrica dentro do nó (passagem, queda, FTD, receita), barra de versões, debug/test data.
- Inbox: ficha lateral (origem/estágio/FTD/depósitos/tags/consentimento/confiança), colisão, macros, IA sugerida com selo.
- Broadcasts com Policy Engine check + ApprovalCard.
- Segments com QueryBuilder AND/OR aninhado.
- 8 estados.

### Fase P7 — Media/Meta + Approval Center + Governance completa
Master §16, §21.
- Media: árvore campanha→adset→ad, métricas Meta×TrakPro lado a lado, criar/editar/pausar em estágio controlado.
- Simulação → ActionPlan (hash) → Approval → Execução → AuditRef.
- Governance vira hub: Policy Engine · Approval Center · PII Vault · Tenant Isolation · Kill Switches · Audit Log · Retention · Consent.
- ConfirmDialog com digitação do nome do objeto para ações irreversíveis.
- 8 estados.

### Fase P8 — Mobile-first pass + Super Admin repaint + QA final
- Aplicar Master §4.3: barra inferior (Command · Connect · Signals · Media · Revenue), tabelas → listas de cards, formulários empilhados, Flow Builder = visualização + intervenção simples.
- Super Admin: aplicar tokens finais, glass, hairlines, StatusChip/IntegrationStateBadge — **sem mexer em estrutura, rotas ou lógica das páginas `Platform*`**.
- Varredura visual Playwright em 60+ rotas × 3 viewports.
- Checklist: 8 estados presentes em todas as páginas · nenhum número sem Evidence Drawer · nenhum status fora do enum · nenhuma cor semântica fora de significado · nenhuma serifa em chrome operacional.

---

## Governança de execução

- **1 fase por vez**, na ordem. Fase pronta = screenshots das telas afetadas + checklist Proofline verde antes de abrir a próxima.
- Ideias fora do escopo da fase corrente → BACKLOG (não código no impulso).
- Guilhotina: se uma fase exceder ~150% do previsto, cortar escopo (não estender).
- Super Admin intocada em P0–P7; só recebe repaint em P8.

## Detalhes técnicos (referência do dev)

- Tokens em `src/styles.css` (@theme). Nunca cor hardcoded em componente.
- Primitivos em `components/ui`, dados em `components/data`, estado em `components/state`, layout em `components/layout`, negócio em `components/domain`.
- Toda tabela usa `DataTable` (proibido `<table>` avulso).
- Toda página exporta um objeto `uxStates: { loading, empty, partial, permissionDenied, policyBlocked, integrationDegraded, error, success }` consumido pelo shell.
- Mock data continua em `lib/fake/*` — expandir apenas o necessário por fase.

---

**Próximo passo se aprovado:** iniciar **Fase P0** (foundations). Nenhuma tela muda ainda — só primitivos e tokens. Ao final, screenshots comparando um card antes/depois para você validar antes de seguir para P1.
