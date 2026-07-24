
# Rodada: Curadoria da navegação → Piso de coerência → P2

Princípio-guia: progressive disclosure. Nada é deletado; o que sai da sidebar continua roteável via links contextuais, ⌘K e `/roadmap`. Página só volta à sidebar quando a linha dela na matriz `CONFORMANCE.md` está verde.

---

## Etapa A — Sidebar curada (14 itens visíveis)

Reescrever `src/components/layout/Sidebar.tsx` para exibir SÓ:

- **Overview**: Command, Analytics
- **Connect**: Integrações, Tracking/Links, Domínios
- **Observe**: Eventos ao vivo, Signal Ledger, Players
- **Operate**: Automações, Mídia
- **Prove**: Receita, Governança
- **Rodapé**: Configurações, Perfil, **Em construção (`/roadmap`)**

Removidos da sidebar (permanecem roteáveis): Relatórios, Aprovações, Grafo de identidade, Saúde CAPI, Monitoramento, Reconciliação, Coortes, Segmentos, Broadcasts, Caixa de entrada, Fontes & Custos, Report/Player/Domain/Integration/Campaign 360, Setup TAP/Meta/Telegram, Inbox Settings, Media Creatives, Flow Builder, Link 360, Identity Detail, Settings (API/Team/Billing/Notifications/Audit).

## Etapa B — Página `/roadmap`

Criar `src/pages/tenant/Roadmap.tsx` (rota via wouter no `TrakacquireApp`) com:

- Kicker serif + H1 "Em construção" + `PreviewBadge`.
- Nota curta: "Roadmap vivo do protótipo. Página só entra na sidebar quando sua linha na matriz CONFORMANCE.md está verde."
- Seções agrupadas por fase (P2 → P8). Cada linha: título · rota (Link) · status resumido da matriz (colunas 8-ST/EVD/CHIP/TOK/MON/PRV/BRC/TBL/MOB reduzidas a % conformidade) · badge da fase.
- Fonte: array declarativo derivado da matriz do `CONFORMANCE.md` (hardcoded no componente, mantendo simplicidade da prototipação).

## Etapa C — Piso de coerência nos 14 visíveis

Auditar e ajustar as 14 páginas visíveis para atender ao mínimo obrigatório:

1. `PreviewBadge` próximo ao título.
2. Estados de **loading** e **empty** reais (dos 8, mínimo 2 — via `FeedbackStates`).
3. Dados vindos APENAS de `src/lib/fake/db.ts` (dataset canônico).
4. Zero link quebrado nos ctas visíveis (todos apontam para rotas existentes).
5. Se a página ainda é rasa (fora da fase corrente), banner "Esta tela será detalhada na fase PN" no topo.

Páginas visíveis a auditar:
- Command (já pronto — só verificar)
- Analytics (banner P4 + PreviewBadge + empty/loading)
- Integrações (banner P5)
- Tracking (banner P5)
- Domínios (banner P5)
- LiveEvents (P2 — será finalizada na etapa D)
- Ledger (P2 — será finalizada na etapa D)
- Players (banner P3)
- Automações (banner P6)
- Mídia (banner P5)
- Receita (banner P4)
- Governança (banner P4)
- SettingsGeneral (banner P7)
- Profile (banner P7)

Componente helper novo: `src/components/state/PhasePreviewBanner.tsx` — banner discreto "Esta tela será detalhada na fase PN" para reuso.

## Etapa D — P2: Signal Ledger + Live Events + Monitoring

Monitoring segue FORA da sidebar até terminar; entra depois via nova rodada.

Para as 3 páginas:

- **8 estados de UX** implementados (Loading, Empty, Partial, PermissionDenied, PolicyBlocked, Degraded, Error, Success) — via `FeedbackStates` + toggle de cenário no `ScenarioSelector` (já existe).
- **Evidence Drawer** em todo número: envolver `MetricValue`/valores com trigger que abre o `EvidenceDrawer` já existente.
- **StatusChip** só com enum fechado (já validado).
- **Tokens D1** — zero hex literal (varrer as 3 páginas).
- **Mono tabular** em ID, valor, timestamp (via `MetricValue` / classes `font-mono tabular-nums`).
- **PreviewBadge** perto do título.
- **Breadcrumb** com objeto atual e pai.
- **DataTable padrão** (`src/components/data/DataTable.tsx`) — substituir `<table>` avulso onde houver.
- **Mobile reordenado por prioridade** — usar `useIsMobile`; em telas pequenas, dropdown de filtros virá antes da tabela e colunas secundárias colapsam em subtexto da coluna primária.

Detalhes por página:

- **LiveEvents** (`src/pages/tenant/LiveEvents.tsx`): stream editorial já existe; adicionar 8 estados via cenário, breadcrumb "Observe / Eventos ao vivo", envolver valor/latência em Evidence Drawer trigger.
- **Ledger** (`src/pages/tenant/Ledger.tsx`): migrar para `DataTable`; breadcrumb "Observe / Signal Ledger"; drawer em cada linha (payload bruto do evento — já existe `EventDetail`, reaproveitar o drawer aqui).
- **Monitoring** (`src/pages/tenant/Monitoring.tsx`): mesmo tratamento; permanece acessível só por `/roadmap` e ⌘K.

## Etapa E — Atualizar `CONFORMANCE.md`

- Adicionar coluna **NAV** (visível/oculta) em todas as tabelas do tenant.
- Marcar as 14 visíveis com NAV=✅; demais NAV=❌.
- Atualizar as linhas do LiveEvents, Ledger e Monitoring conforme resultado real da P2 (marcar ✅ nas colunas atendidas).
- Atualizar o burn-down: P2 concluída.

## Etapa F — Screenshots de validação

Playwright headless (viewport 1280×1800 e 390×1800) → `/tmp/browser/p2/`:

- `command_desktop.png`, `command_mobile.png`
- `ledger_desktop.png`, `ledger_mobile.png`
- `liveevents_desktop.png`, `liveevents_mobile.png`
- `roadmap_desktop.png`, `roadmap_mobile.png`

Rodar `tsgo` no fim para garantir typecheck limpo.

---

## Detalhes técnicos

- `TrakacquireApp.tsx` (wouter) precisa registrar a rota `/roadmap` → `Roadmap.tsx`.
- `Sidebar.tsx` já usa wouter — só remover itens e adicionar link `/roadmap` no rodapé (ícone `Construction` ou `Map` do lucide).
- Nenhuma remoção de arquivos de página — só reduz surface na navegação.
- Não tocar em `src/pages/platform/*` (Super Admin preservado até P8).
- `PhasePreviewBanner` usa tokens D1 (`warning`, `line`, `stone`), sem hex literal.
- Evidence Drawer: o componente `EvidenceDrawer.tsx` já existe; wrapper `<button>` mono nos números que dispara `onOpenChange`.
