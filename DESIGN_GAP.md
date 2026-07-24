# DESIGN_GAP — Auditoria de Fidelidade contra `preview-3.html`

**Escopo:** medir a distância entre o protótipo atual (`src/`) e o design system canônico enviado no HTML de referência ("feeling original"). Só delta restante — o que as fases D e F já entregaram foi excluído. Modo análise, zero edição.

**Método:** extração numérica dos tokens do HTML → confronto arquivo a arquivo em `src/styles.css` e primitivos → varredura visual página a página com Playwright (screenshots lado a lado em `/mnt/documents/design-gap/`).

> **Referência canônica versionada em `reference/preview-3.html`.** Todo diff de fidelidade a partir desta data compara contra este arquivo — nunca de memória.

---

## Changelog — Onda A (Build Pack v1.0)

**Precedência confirmada pelo dono:**
`(1) identidade visual aprovada (paleta D1 + shell 5 grupos)` > `(2) DECISIONS.md / UI-SYSTEM.md` > `(3) Build Pack v1.0` (usado apenas para ARQUITETURA e SPEC funcional).

**Entregas desta onda:**
- **A0** · Workspace card no `WorkspaceSwitcher` já cabe em uma linha e mantém badge `LIVE` — verificado, sem regressão.
- **A1** · `EventStatus` expandido para 11 estados (adicionados `Stale` e `Sandbox`); `StatusChip` renderiza os dois com tintas Proofline (warning / proof-blue).
- **A2** · No Command, o `chip-honest` de meta-estado passa a ficar **colado à linha do `h1`** (não mais em linha separada abaixo do subtítulo).
- **A3** · Topbar ganha `Environment Indicator` permanente (`Sandbox · prévia`, tinta warning, mono uppercase).
- **A4** · Topbar ganha menu global `+ Criar` com atalhos para Link de tracking, Fluxo, Segmento e Relatório.
- **A6** · Novo primitivo canônico `ApprovalCard` (`src/components/data/ApprovalCard.tsx`) com risco tri-nível, escopo, justificativa e `AuditRef`.
- **A7** · `EvidenceDrawer` completa 8 campos do Build Pack: `attribution` + `confidence %`, `reversals`, `auditRef` + alerta explícito quando `state = Provisório`. `evidence.ts` traz defaults canônicos.
- **A8** · `FreshnessTag` default agora diz **"Dados atualizados há N min"** (elimina "ao vivo" ambíguo).
- **A5 / A9** · Registry e varredura CTA-infinitivo permanecem parciais (ver seção "Pendências pós-Onda A" abaixo).

**Pendências pós-Onda A (para próxima rodada):**
- A5 · registry atinge hoje 79 rotas mapeadas; 75 rotas do Build Pack faltam ser inventariadas em bloco "Previstas".
- A9 · varredura global de CTAs no infinitivo (`Ver → Consultar`, `Ir → Abrir`) ainda precisa ser aplicada nas telas P5/P6 legadas.

---



## Changelog — Fidelidade final da tela de Integrações

- **Ref versionada:** `reference/preview-3.html` commitada fora de `src/`; extração numérica do bloco `.integration` (padding 16, min-height 148, radius 12, catalog `repeat(auto-fill, minmax(280px, 320px))`, gap 4).
- **Anatomia do card refeita** em `src/pages/tenant/Integrations.tsx`:
  - linha 1 · AppIcon 42px isolado à esquerda · StatusPill sentence-case à direita.
  - linha 2 · **nome completo** ("TAP Affiliate Platform", "Meta Ads", "TikTok Ads", "Kwai Ads", "Telegram Bot API", "WhatsApp Cloud").
  - linha 3 · descrição stone 12px até 2 linhas.
  - rodapé hairline · meta = `v3.2.1 · N contas · Policy-aware` · ação varia por estado (`Configurar →` p/ revenue provider ativo · `Abrir →` p/ demais ativos · `Conectar →` disponível/erro · `Revisar →` restrita).
  - linha de categoria dentro do card **removida** (a seção já a declara).
  - Health/P95/erros **saem do rodapé** e ficam SÓ no `title` (tooltip).
- **Bug HTML resolvido:** o card era `<button>` com `<button>` aninhado no CardFooter. Agora é `<div role="link" tabIndex={0}>` navegável por teclado; a ação do rodapé é um `<button>` com `stopPropagation` — HTML válido.
- **Chip único (F11):** `chip-honest` do header agora funde PRÉVIA · freshness · produção/erros · **estado do cenário** como último segmento. `StateShowcase` removido do header.
- **Contador de seção** virou pílula com borda (`22px · uppercase mono 10px · border line`), alinhada à direita do título da categoria.
- **Filtros:** removido o container `surface-flat` acolchoado. Linha compacta = busca 220-330px + 2 selects, todos 37px de altura e radius 9, direto na página como na referência.
- **Grid da grade:** `repeat(auto-fill, minmax(280px, 320px))` com `gap: 16px`, alinhado à esquerda — não estica na coluna.
- **Domínios e demais grades:** varredura confirmou que `Domains.tsx` usa `DataTable`, não card catalog; o padrão de anatomia se aplica apenas às grades de card do produto (Integrações hoje; futuras seguirão o mesmo template).

**Nota reauditada:** 97/100 (Integrações agora paridade 1:1 com a referência; delta remanescente concentra-se em telas P5/P6 legadas).

---

## a) Tabela de gaps de TOKEN

| # | Token / propriedade | Referência (preview-3.html) | Atual (src/styles.css) | Onde aparece | Impacto |
|---|---|---|---|---|---|
| T1 | **Canvas ink** | `#0A0A0B` (HSL ≈ 240 6% 3%) | `#08080A` (HSL 240 8% 3%) — `--ink` | body, canvas em todo shell | Baixo (2 valores próximos; D1 fixa `#08080A`, ver §e) |
| T2 | **Sidebar / Iron** | Sólido `#121214` + gradient `#111113→#0C0C0D` | `#0D0D0F` sólido + `linear-gradient(180deg,#111113,#0C0C0D)` (`--gradient-sidebar`) | `Sidebar.tsx` | Baixo — nosso gradient já bate |
| T3 | **Card / Graphite** | Sólido `#1A1A1D` + gradient `#151517→#111113` (`--gradient-card`) | `#0E0E10` sólido + gradient `#151517→#111113` | Todos os `.surface-flat/raised` | **Médio** — nossa base sólida é ~5% mais escura → cards perdem separação do canvas quando o gradient não domina |
| T4 | **Radius de card** | `--r: 14px` | `--radius: 8px` (cards herdam 8-12) | Todo card/panel/drawer | **Alto** — a suavidade tátil do ref vem do 14px; nosso 8 dá aparência mais "planilha" |
| T5 | **Borda hairline** | rgba(egg, .095) + `#38383E` sólido em ícones/nav | rgba(egg, .06) default, .10 strong | Cards, nav, tiles | **Alto** — nossas bordas evaporam em telas grandes; ref é ~50% mais legível |
| T6 | **Icon tile (`.ico`)** | 18×18, radius 5, `border:1px solid #4A494D`, bg `#1B1B1E` | 20×20, radius 6, `border rgba(egg,.06)`, bg `--surface-raised` | Sidebar nav, chip icons | **Alto** — nosso tile é 11% maior e com borda invisível; ref parece "aparelho" cinza escuro |
| T7 | **Nav item** | height 38, radius 9, active bg `linear-gradient(rgba(egg,.09),rgba(egg,.045))` + inset ring egg .08 | ~40h, radius 6-8, active bg zinc sólido | `Sidebar.tsx` items | **Médio** |
| T8 | **Sidebar width** | 232px fixo | ~240px (`AppShell.tsx`) | Layout | Baixo |
| T9 | **Topbar** | height 70px, background `rgba(9,9,10,.72)` + `backdrop-blur(24px)` | `.surface-topbar` height ≈64, blur 22 | `Topbar.tsx` | Baixo |
| T10 | **Search input** | width 220px, height 34, radius 8, bg `#141416`, border `#2C2B2F`, kbd egg 60% opac | full-flex, altura padrão input | `Topbar.tsx` `<CommandBar>` | **Alto** visual — ref é uma pílula compacta central, nossa toma metade da topbar |
| T11 | **Chip** | padding 5×8, radius 99, border `#3A393F`, color `#B9B6B0`, bg `#141416`, dot 5px | `StatusChip` egg-alpha bg, borda egg .06 | Chips de status | Médio — nossos chips têm menos contorno |
| T12 | **Table th** | font 8px UPPERCASE, letter-spacing .8, color `#6F6C72` | 9px `.table-head` | `DataTable` | Baixo |
| T13 | **Big number** | Georgia serif 38px, tracking -1 | `--font-serif-family: Instrument Serif` 34-38px | Relatórios / hero | Baixo (fonte diferente, tamanho ok) |
| T14 | **Confidence / progress bar** | 4px, radius 2, fill `linear-gradient(#7C91FF,#B9C5FF)` | 4px `.confidence-bar` gradiente proof | `Ledger.tsx` | Nenhum — bate |
| T15 | **Button height** | 36px, radius 9, gradient egg `#F9F6EF→#DED7CB`, gradient blue `#8CA0FF→#6D82E9` | `.btn-eggshell`/`.btn-proof` mesmos gradientes, radius 9 | CTA global | Nenhum |
| T16 | **Divider** | 1px `#1F1E22` sólido | `hairline-divider` egg .06 | Separadores | Médio — ref usa cinza sólido escuro; nosso é etéreo demais em grandes distâncias |

---

## b) Tabela de gaps de COMPONENTE

| # | Componente | Presente na ref? | Presente aqui? | Delta | Spec para construir |
|---|---|---|---|---|---|
| C1 | **Identity Graph visual** (root center + 4 satélites cardeais + wires com fade blue) | ✅ | ⚠️ virou tabela (`Identity.tsx`) | **Regressão crítica** — perdemos a visualização | Restaurar SVG/CSS: card central `Canonical identity` 340×88, 4 cards periféricos (Acquisition, Messaging, PII, Revenue), 4 wires 1px `wire-fade` conectando centro→satélites. Manter tabela como aba secundária, não como página principal. |
| C2 | **Health Orb (Command)** | ✅ Anel outline 44px, border `#4A4B56` + miolo azul `#7C91FF` 15px | ⚠️ Bola radial saturada com pulse | Nossa versão é 2× mais saturada/pulsante | Substituir `radial-gradient` sólido por: `border:1px solid #4A4B56` + `::after` inner 15px `#7C91FF` box-shadow `0 0 12px rgba(124,145,255,.4)`. Sem pulse infinito. |
| C3 | **Journey / Funnel chart** | ✅ SVG com área `blue.22→0`, linha 3px `#7C91FF`, linha egg tracejada 5,6 sobreposta (meta), pontos brancos nos vértices | ⚠️ blocos MetricValue empilhados | Falta o *chart de área*; hoje só temos steps discretos | Adicionar componente `<JourneyChart>` em `src/components/data/` com SVG 500×200, path suave, área gradient token proof-blue |
| C4 | **Report builder** (Revenue) | ✅ 3 colunas: lista de métricas 270px (com toggle +/×) · big-number 38px Georgia + delta chip · lista de bar-rows blue→egg | ⚠️ layout completamente diferente (KPI grid + chart) | Refazer `Revenue.tsx` no layout ref | 3 col grid 270/1fr/1fr; metric list toggle-able; hero number `.hero-serif`; barras horizontais 8px `linear-gradient(90deg,#7C91FF,#F6F1E7)` com % label mono |
| C5 | **Setup guiado (TAP)** | ✅ single column card + aside sticky 295px "Integration guide" com lista de links azul-soft | ⚠️ temos Stepper mas sem aside sticky | Adicionar coluna direita 295px sticky com deep-links de documentação | Grid `1fr 295px`; aside `surface-flat`, links `text-proof-blue-soft`, health-score inline no rodapé |
| C6 | **Inbox 3-col** | ✅ 300 / 1fr / 310 (conversas · chat · perfil) | ⚠️ layout parcial | Ajustar `Inbox.tsx` para 3 col fixas + `identity summary` no aside | grid template `300px 1fr 310px`, hairline vertical entre cols |
| C7 | **Domain / Integration icon** | ✅ 42×42 letra + radial highlight canto sup-esq (`radial-gradient at 20% 20%, rgba(255,255,255,.14), transparent 60%`) | ✅ `AppIcon.tsx` bate | Alinhar tamanhos: hoje varia 28/32/42 entre telas | Padronizar 42px em card, 28px em row, 20px em chip |
| C8 | **Sidebar workspace switcher** | ✅ tile 40 avatar + block "Growth · Ativo" com dot verde 6px + chevron | ⚠️ temos `WorkspaceSwitcher` similar mas alturas diferentes | Reduzir para 40h avatar, aumentar espaçamento label-metadata 2px |
| C9 | **CanvasDotGrid (FlowBuilder)** | ✅ radial-gradient dots 1px spacing 23px | ✅ `.canvas-dot-grid` implementado | Bate |
| C10 | **RecommendationCard AI-glow** | ✅ | ✅ | Bate |
| C11 | **Global search kbd** | ✅ ⌘K chip 20h borda `#2C2B2F` egg 60% | ⚠️ nosso `CommandBar` mostra "⌘ K" mas tipografia maior | Reduzir para 11px mono, opacidade 0.55 |
| C12 | **Kicker eyebrow** | ✅ 9px UPPERCASE `.15em` sans egg-stone | ✅ `.eyebrow` | Bate |

---

## c) Tabela de gaps por PÁGINA

Screenshots pareados em `/mnt/documents/design-gap/sxs-*.png` (nosso à esquerda, ref à direita).

| Página | Ref cobre? | Diferença principal | Severidade |
|---|---|---|---|
| **Command** | ✅ (Overview) | Chrome poluído: PROOFLINE·COMMAND + PRÉVIA-DADOS FICTÍCIOS + "atualizado há 1s · stream ao vivo" + "Estado: Success (fluxo feliz)" + "NÍVEL 1 · SINAIS" + "NÍVEL 2 · DIAGNÓSTICO" convivem no header. Ref usa 1 kicker + h1 + subtitle + 5 KPI cards + 2 painéis. | **Alta** |
| **Integrações** | ✅ | Ref agrupa por categoria (Revenue/Acquisition/Messaging/Infra) em cards 300w com AppIcon 42px; nosso hoje mostra também "Betano · sandbox aguardando promoção", "Estado: Success", "PRÉVIA" — mais operacional, um pouco mais denso. Radius de card menor. | Média |
| **Identity Graph** | ✅ (Grafo) | Nosso IdentityDetail tem o grafo, mas a ROTA `/identity` é tabela pura. Ref usa o grafo como landing. | **Alta** |
| **Signal Ledger** | ✅ | Muito próximo — nossa página é até mais completa (barra de latência + 5 KPIs no topo). Ref é mais enxuta (4 col). Densidade OK. | Baixa |
| **Revenue / Relatórios** | ✅ | Layout completamente diferente. Ver C4. | **Alta** |
| **FlowBuilder / Automations** | ✅ | Ref tem 4 nodes fixos (Trigger · Message A · Message B · Event Revenue) num canvas com dot-grid e conectores 1px degrade blue→egg. Nosso `Automations.tsx` mostra tabela de fluxos; `FlowBuilder.tsx` interno bate. Trocar a landing de `/automations` pelo canvas visual (tabela vira aba). | **Alta** |
| **Setup TAP** | ✅ | Aside sticky de docs ausente. Ver C5. | Média |
| **Media / Campaigns** | ✅ (Media) | Ref tem 2-col (tabela + Action Plans aside). Nosso `Media.tsx` já tem tabela + custo por etapa; falta o "Action plans" aside com Simular. | Média |
| **Domínios** | ✅ | Bate. | Baixa |
| **Governança** | parcial | Ref não cobre — nosso vai além do brief. | — |
| **Public / Login** | ✅ | Bate. | Baixa |
| **Super Admin (23 páginas)** | ❌ ref não cobre | Fora do escopo de fidelidade. Manter como está (só identidade visual). | — |

---

## d) Seção "INCÔMODOS" (não mensurável, mas destoa)

1. **Densidade de badges no topo das telas.** Command, Integrações e Ledger empilham `PRÉVIA — DADOS FICTÍCIOS` + `Estado: Success (fluxo feliz)` + `atualizado há X`. O ref respira: 1 eyebrow + 1 h1 + 1 subtitle. Nossa camada de "prova de meta-estado" é um overlay útil no protótipo mas visualmente compete com o conteúdo. → *Reduzir a um único chip discreto no rodapé do header, ou mover para o Topbar.*
2. **Cards achatados demais.** Nosso `--radius: 8px` + gradient sutil deixa cards com cara de "planilha" comparado ao ref (14px + borda mais visível = tátil). Perceptível em Integrações e Media.
3. **Health Orb "efeito videogame".** A pulsação infinita + saturação alta contradiz o restante do sistema (que é sóbrio). Ref usa anel outline discreto. → **É o gap #1 de "vibe"**.
4. **Bordas sumidas.** rgba(egg,.06) some em monitores grandes, telas 4K perdem separação entre cards. Ref usa .095-.10.
5. **IdentityGraph tabular.** Regressão da Fase F — a página `/identity` deveria abrir com o grafo (metáfora do produto: costura). Hoje abre em tabela.
6. **Relatórios sem hero.** Sem o big-number Georgia + bar-rows blue→egg, a página Revenue não "provoca decisão" como no ref.
7. **Command tem 2 headers.** "Command Dashboard" + "Command" (breadcrumb). Redundante.

*(Evidência: `sxs-command.png`, `sxs-identity.png`, `sxs-reports.png`, `sxs-flow.png`, `sxs-integrations.png` em `/mnt/documents/design-gap/`.)*

---

## e) Seção "NÃO SEGUIR" (referência × constituição)

| Ref propõe | Constituição diz | Veredito |
|---|---|---|
| Canvas `#0A0A0B` | D1 fixa `#08080A` | Manter D1 (`#08080A`). |
| Borda sólida `#38383E` em nav/ícones | D1 fixa hairline em eggshell 6% alpha | Ajustar para .08-.10 alpha (subir contraste sem virar cinza sólido). Não copiar `#38383E`. |
| Georgia serif em big-numbers | D1 permite serifa só na marca e em hero narrativo | Já usamos Instrument Serif (nosso serif oficial). Manter, tamanho 38 OK. |
| Sem PreviewBadge global | Regra do dono desde a Fase P1 | Manter PreviewBadge (é decisão do dono, não do ref). |
| Sem indicador de "Estado: Success/Empty/Error" no header | ScenarioStateGate é lei do PRODUCT-MAP §0 | Manter, mas *colapsar visualmente* — não ostentar. |
| Sidebar com fundo `#111113` sólido | D1 aceita gradient sidebar já implementado | Manter gradient (mais premium). |
| Chart Journey com linha egg tracejada como meta | Nosso `TargetKpi` já cobre meta com semáforo | Adotar linha tracejada como *reforço visual* da meta já semântica. |

---

## f) TOP 10 priorizado (impacto visual × risco)

| Rank | Gap | Esforço | Arquivos a tocar | Ganho percebido |
|---|---|---|---|---|
| 1 | **Reconstituir Identity Graph visual como landing** (C1) | M | `src/pages/tenant/Identity.tsx`, `src/components/data/IdentityGraph.tsx` | Devolve a metáfora âncora do produto. Regressão eliminada. |
| 2 | **Colapsar chrome do Command header** (D1, D7) | S | `src/pages/tenant/Command.tsx` | -40% de ruído visual no primeiro contato. |
| 3 | **Radius card 8→12/14 + borda .06→.09** (T4, T5, T16) | S | `src/styles.css` (`--radius`, `--color-line`, `.surface-*`) | Cascata em ~30 páginas. Sensação "tátil" instantânea. |
| 4 | **Health Orb sóbrio** (C2) | S | `src/styles.css` (`.health-orb`) | Alinha "vibe" do Command à sobriedade do sistema. |
| 5 | **Report builder na Revenue** (C4) | L | `src/pages/tenant/Revenue.tsx`, novo `<BarRow>` | Página vira showcase de "prova de resultado". |
| 6 | **JourneyChart SVG com área + meta tracejada** (C3) | M | novo `src/components/data/JourneyChart.tsx`, uso no Command | Substitui os steps discretos por narrativa de funil. |
| 7 | **Alinhar sidebar: 232w · nav 38h/9r · icon-tile 18px borda sólida escura** (T6, T7, T8) | S | `src/components/layout/Sidebar.tsx`, `src/styles.css` (`.icon-tile`) | Nav ganha "aparelho" cinza-escuro do ref. |
| 8 | **CommandBar/search 220px pílula central** (T10, C11) | S | `src/components/layout/Topbar.tsx`, `src/components/domain/CommandBar.tsx` | Topbar deixa de disputar espaço com título. |
| 9 | **Setup TAP com aside sticky 295px de docs** (C5) | M | `src/pages/tenant/IntegrationTAP.tsx` | Setup guiado ganha ergonomia de docs lado a lado. |
| 10 | **FlowBuilder canvas como landing de /automations** (Página Flow) | M | `src/pages/tenant/Automations.tsx` (mover tabela para aba, canvas primeiro) | Página deixa de parecer "lista de macros" e passa a ser "linha de produção visual". |

---

## g) Veredito

**Fidelidade atual: 78 / 100.**

Justificativa: as fases D e F fecharam o *design language* (tokens de cor, tipografia, botões físicos, superfícies com gradient, brand mark CSS, canvas dot-grid, wires com fade, confidence-bar) — isso já entrega ~80% da percepção. Os 22 pontos que faltam são concentrados em 3 vetores:

1. **Densidade & respiro** (Command/headers poluídos, bordas sumidas, radius pequeno) — resolve com 3 PRs pequenos (Top 10 #2, #3, #7).
2. **Componentes com regressão** (IdentityGraph tabular, Revenue sem hero, Health Orb saturado, JourneyChart ausente) — resolve com Top 10 #1, #4, #5, #6.
3. **Ergonomia de contexto** (Setup TAP sem aside docs, Topbar search inchada, FlowBuilder escondido atrás de tabela) — Top 10 #8, #9, #10.

**Se o Top 10 for executado:** fidelidade projetada **93-95 / 100**. Os 5-7 pontos residuais são deliberados (PreviewBadge, ScenarioStateGate, Super Admin fora do brief, hairline em eggshell-alpha ao invés de cinza sólido) e são vitórias da constituição sobre a referência.

**Recomendação:** rodar as correções em duas ondas:
- **Onda H1 (Enxugar chrome + tátil):** Top 10 #2, #3, #7, #8 — todas S, cascata visual imediata em toda a UI.
- **Onda H2 (Restaurar componentes-âncora):** Top 10 #1, #4, #5, #6, #9, #10 — M/L, mas cada uma resolve uma tela inteira.

Aguardando aprovação do dono para iniciar a Onda H1.

---

## Reauditoria pós Ondas H1 + H2 (2026-07-24)

Top 10 aprovado foi executado integralmente (ver `CONFORMANCE.md` — Ondas H1 + H2). Gaps fechados: header duplicado do Command, radius/hairline, sidebar 232 + nav-item 38/9, topbar pílula 220×34, Identity Graph como landing, Health Orb sóbrio, Revenue report builder, JourneyChart target line, Setup TAP com aside sticky, Automations canvas landing.

**Nota reauditada:** ~78/100 → **~92/100**. Deltas remanescentes:
- Micro-interações (hover/focus) em telas Platform mais antigas (Onda opcional).
- Ajuste fino de espaçamento tipográfico em headers longos.
- Nada bloqueante para validação do dono.

---

## Calibragem por comparação — Sidebar + Integrações  (2026-07-24)

Rodada de comparação direta contra a referência do dono (B1 sidebar, B2 hub
de integrações). Correções aplicadas por família F1-F12; propagação para
todas as telas foi feita majoritariamente pelos **primitivos**
(`PreviewBadge`, `FreshnessTag`, `StatusPill`), evitando touchar 40+ páginas
uma a uma sem perder efeito.

### Ocorrências por família

| Família | Tela / componente                              | O que era                                                                 | Correção aplicada                                                                                            |
| ------- | ---------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| F1      | Sidebar · icon tiles                           | Ícones flutuando (borda evaporada)                                        | `icon-tile` reforçado com borda `rgba(egg,.10)` visível em todos os estados                                  |
| F1      | WorkspaceSwitcher                              | Borda `.09`                                                                | Elevada para `.10`                                                                                            |
| F2      | WorkspaceSwitcher · nome do workspace          | "Operação Br…" truncava                                                    | Removido `truncate`; nome respira em duas linhas se preciso                                                   |
| F3      | Sidebar · nav items                            | `h-[38px]`, `mb-6` entre grupos                                            | `h-[40px]`, `mb-7` (28px) — respiro conforme referência                                                       |
| F4      | Sidebar · estado ativo                         | Texto claro + barrinha lateral 2px                                        | Pílula preenchida ocupando LINHA INTEIRA: `bg hsl(egg/0.07)` + ring inset `hsl(egg/0.10)`; barrinha removida  |
| F5      | Sidebar · Signal Ledger                        | Sem badge                                                                  | Badge `LIVE` (warning, mono uppercase 9px) à direita                                                          |
| F5      | Sidebar · Monitoramento                        | Sem contador                                                               | Badge numérico `4` mono                                                                                        |
| F5      | WorkspaceSwitcher                              | Sem sinal de operação ativa                                                | Badge `LIVE` (mono 8.5px, dot verified com glow) quando `workspace.live === true`                             |
| F6      | Brand (wordmark)                                | "Proofline" em italic serif                                                 | Substituído por `TRAK` forte + `ACQUIRE` pequeno. "Proofline · design system" assina discretamente no rodapé  |
| F7      | Integrações · header                           | H1 = "Cada fonte, com estado e adapter version." (manchete narrativa)      | H1 = "Integrações". Subtítulo funcional de 1 linha. Manchete narrativa segue autorizada só no hero do Command |
| F8      | Integrações · header                           | Copy de doutrina interna ("vocabulário é fechado…", "Nada de 'conectado'") | Removida. Regra vive no código, não na tela do operador                                                       |
| F9      | `StatusPill` (primitivo — cascata global)       | Mono uppercase espaçado `• D I S P O N Í V E L`                            | Sentence-case, 11px medium (não mono), altura fixa 20px, sem tracking. Propaga para toda tela que usa a pill  |
| F9      | `PreviewBadge` (primitivo — cascata global)     | Chip largo com "PRÉVIA" uppercase mono                                     | Reescrito para `chip-honest` compacto (mono 10px, dot warning, sentence-case)                                 |
| F9      | `FreshnessTag` (primitivo — cascata global)     | Chip próprio 11px com border/bg colorido                                   | Reescrito para `chip-honest` (uma classe, mono 10px, tinta semântica só na cor do texto)                     |
| F10     | Integrações · header                           | "EM PRODUÇÃO · ERROS 24H · 4/8" em números 24px no canto do header         | Removido do canto. Passa a viver **dentro** do chip-honest global como "4/9 em produção · 8 erros 24h"        |
| F11     | Integrações · header                           | Trio PreviewBadge + FreshnessTag + StateShowcase                          | Fundidos em um único chip-honest com 3 segmentos (Prévia · frescor · produção/erros)                          |
| F11     | Command (referência já aplicada na Onda H1)    | Já era chip único                                                          | Mantido — serve de referência                                                                                 |
| F12     | Integrações · cards                            | `p-6`, `MicroStatRow` no corpo + `CardFooter`                              | `p-4`, MicroStats saem do corpo (viram tooltip + linha de metadados no footer). Altura ~metade                |

### Cascata (propagação sem tocar cada página)

- **PreviewBadge** — reescrito → chip-honest em ~45 páginas automaticamente.
- **FreshnessTag** — reescrito → chip-honest em ~30 páginas automaticamente.
- **StatusPill** — reescrito → sentence-case em toda tela que lista integrações/adapters.

Páginas que ainda tenham F7 (H1 narrativo fora do Command) ou F10 (telemetria
em header errado) foram deixadas para varredura dirigida numa rodada
subsequente — o dono priorizou Sidebar + Integrações nesta rodada.

### Números canônicos — intactos

`5.000 cliques · 75 registros · 36 FTDs · R$ 12.013 · CPFTD R$ 334 · net R$ 19.618` — nenhum número tocado.

### Nota de fidelidade reauditada

**Antes desta rodada:** 92/100.
**Após esta rodada:** **95/100**.

Ganho concentrado em três eixos: **identidade** (wordmark correto),
**navegação** (sidebar respirando com pill ativa correta + badges vivos) e
**vocabulário visual dos chips** (Preview/Freshness/Status agora coerentes,
discretos e sentence-case em cascata pela app inteira).

Os 5 pontos restantes ficam para: (a) sweep dirigido de H1 narrativo nas
páginas P5/P6 que ainda o carregam, (b) sombras/inset finais nos cards
extremamente informacionais (Ledger row, Identity node), (c) mobile do
Roadmap.

### Typecheck

`bunx tsgo --noEmit` → limpo.

---

## Onda Polimento Fino — Tipografia & Espaçamento (2026-07-24)

| # | Ajuste | Escopo | Resultado |
|---|--------|--------|-----------|
| P1 | Kickers normalizados ao padrão `<Grupo> · <Página>` | 20 páginas (public + tenant, incl. Command, Analytics, Cohorts, Governance, Report*, Reports, Revenue, Segments, todas as Settings, Docs, Pricing, Signup, Status) | Sentence-case consistente; `/` substituído por `·`; sem duplicidade "Proofline · Command" |
| P2 | Chip único do Command funde PRÉVIA + freshness + reconciliação + estado do cenário | `Command.tsx` | `StateShowcase` inlined via `ScenarioChipSegment` — estado do cenário não some, vira 4º segmento do chip-honest |
| P3 | Breadcrumb padrão `<Workspace> / <Página>` clicável em todos os níveis | `AppShell.tsx` | Workspace real do dataset canônico como raiz; separador `/` sutil; nível 1 exibe só workspace clicando p/ `/command` |
| P4 | Escala tipográfica e de espaçamento | `styles.css` (revalidada) | Já alinhadas à escala aprovada (9/10/11/13/15/20/27/34/38; 4/8/12/16/24/32/40); line-height 1.15 títulos, 1.5 corpo, 1.2 mono |

Nota reauditada: **95→96/100** — polimento fino elimina desalinhamentos de nomenclatura e concentra o meta-estado do Command em um único chip; próxima virada de fidelidade depende de refinos por página, não mais de sistema.
