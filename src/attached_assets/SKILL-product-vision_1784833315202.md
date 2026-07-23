---
name: trakacquire-product-vision
description: Visão global do produto TrakAcquire — domínio, invariantes, módulos, dados e regras transversais. Carregue ANTES de planejar ou implementar qualquer módulo, tela ou migração, para evitar lacunas e decisões inventadas.
---

# SKILL — VISÃO GLOBAL DO PRODUTO

> Fonte da verdade sobre decisões: `DECISIONS.md`. Sobre páginas: `PRODUCT-MAP.md`.
> Sobre componentes: `UI-SYSTEM.md`. Esta skill dá o **entendimento** para não inventar.

## 1. O QUE O PRODUTO É (em uma frase que decide dúvidas)

TrakAcquire é **infraestrutura de atribuição de receita**: prova qual clique, conversa e campanha produziram registro, FTD e depósito — atravessando web, Telegram e WhatsApp sem perder a identidade — e devolve sinal enriquecido para a mídia.

**Consequência prática:** quando houver dúvida de escopo, pergunte *"isso ajuda a provar dinheiro ou a agir sobre a prova?"*. Se não, não entra.

## 2. GLOSSÁRIO CANÔNICO (use exatamente estes termos em código e UI)

| Termo | Significado | Nunca confundir com |
|---|---|---|
| `person` | Identidade canônica interna (`person_id`) | click, lead, usuário do app |
| `click` | Um toque de aquisição (`click_id`) | identidade; um person tem N clicks |
| `identity` | Alias tipado ligado ao person (telegram, phone token, customer_id) | person |
| `acquisition_click` | O clique atribuído, congelado no registro | último clique antes do depósito |
| `influence_click` | Clique posterior ao registro | acquisition_click |
| `registration` | Cadastro na casa (provider+brand+customer_id) | person |
| `event` | Fato imutável no ledger | projeção |
| `projection` | Estado derivado, recalculável | verdade |
| `transaction` | Depósito, saque, ajuste, payout | evento genérico |
| `attribution` | Resultado explicável (modelo+versão+confiança) | palpite |
| `workspace` | Tenant de isolamento | conta de usuário |
| `tenant` | Cliente do SaaS (1..N workspaces) | workspace |
| `orphan` | Sinal sem identidade resolvida | erro |
| `reconciled` | Confirmado contra a fonte contábil | recebido |

## 3. INVARIANTES QUE NUNCA SE VIOLAM

1. **Append-only.** `events` não sofre UPDATE/DELETE. Correção = evento compensatório com `reversal_of`.
2. **Idempotência no banco.** Toda ingestão externa tem chave natural com UNIQUE real. Reentrega = no-op silencioso; payload divergente com a mesma chave = conflito registrado, nunca descarte mudo.
3. **Isolamento provado.** `workspace_id` em toda tabela tenant-aware, RLS deny-by-default com FORCE, e suíte no CI que tenta vazar e falha o build se conseguir.
4. **PII apartada.** Telefone, email, nome, documento e IP no cofre; operação por token e hash. Abrir o cofre é exceção auditada.
5. **Replay não causa efeito externo.** Reprocessar projeção nunca reenvia CAPI, mensagem ou escrita de mídia.
6. **Dinheiro tem fonte declarada.** Operacional (postback, tempo real) ≠ contábil (Reporting API, fechado). A UI sempre diz qual está mostrando.
7. **Ação externa passa por plano imutável + política + aprovação + outbox.**
8. **Consentimento é evento**, verificado no segmento, na fila e imediatamente antes do envio.

## 4. MAPA MÓDULO → DADO → EFEITO (o que cada tela realmente faz)

| Módulo | Lê | Escreve | Efeito externo |
|---|---|---|---|
| Command/Analytics/Reports | projeções, métricas semânticas | nada | nenhum |
| Tracking/Links/Domains | links, domains, clicks | link, domain, click | redirect 302 |
| Signal Ledger | events, raw refs | nada | nenhum |
| Identity Graph | persons, identities, links | merge/unmerge (via plano) | nenhum |
| Players | projeções + identidade | tags, atributos, segmentos | nenhum |
| Automations | flows, persons, eventos | flow_executions, eventos | mensagens (outbox) |
| Inbox | conversas, contexto | mensagens, notas | mensagens (outbox) |
| Media | métricas Meta + nossas | action_plans | escrita Meta (aprovação) |
| Signals/CAPI | eventos elegíveis | delivery ledger | envio CAPI (outbox) |
| Provider/TAP | postbacks, reporting | events, transactions | nenhum (só recebe) |
| Governança | políticas, consents, audit | políticas, aprovações | kill switches |

**Regra de ouro:** todo efeito externo sai por **outbox**, nunca direto do handler da UI.

## 5. OS TRÊS PLANOS

- **Público**: marketing, docs, status, auth. Sem dado de tenant.
- **Tenant** (`app.`): tudo do workspace, sob RLS, papéis P1–P8.
- **Plataforma** (`admin.`): negócio do SaaS — tenants, planos, entitlements, metering, IA/APIs, confiabilidade, suporte, compliance. **Acesso a dado de tenant só por impersonação auditada.**

Nunca misture: componente de plataforma não importa de tenant e vice-versa; ambos consomem o mesmo design system.

## 6. TABELA DE DECISÃO PARA AMBIGUIDADES (consulte antes de perguntar)

| Situação | Decisão padrão |
|---|---|
| Métrica com fonte atrasada | Mostrar selo de frescor. **Nunca exibir zero** como se fosse dado. |
| Valor provisório vs reconciliado | Exibir separados, com selo. Nunca somar juntos. |
| Postback sem `click_id` | Gravar como **órfão** com evidência; nunca inventar atribuição. |
| Evento fora de ordem | Aceitar e reconciliar por `occurred_at`; a ordem de chegada não decide. |
| Depósito estornado | Evento compensatório negativo; original permanece; relatórios mostram bruto e líquido. |
| Usuário sem permissão | Estado "permission denied" explicando o papel necessário — não sumir com a página. |
| Ação bloqueada por política | Estado "policy blocked" com o motivo — **não** tratar como erro técnico. |
| Integração degradada | Página funciona com dado parcial + banner de estado. |
| Falta de dado para decidir (regra automática) | Bloquear por **amostra mínima** e frescor, não executar. |
| Conflito entre documentos | `DECISIONS.md` prevalece. |

## 7. CHECKLIST ANTI-LACUNA (rodar antes de dar um módulo por pronto)

- [ ] A página tem os **8 estados**? (loading, vazio, parcial, sem permissão, bloqueado, degradado, erro com correlation_id, sucesso com auditoria)
- [ ] Todo número abre **Evidence Drawer** com fórmula, fonte, frescor e modelo?
- [ ] Existe caminho de entrada por **menu** e por **busca universal**?
- [ ] Toda escrita tem **idempotência** e aparece no **audit log**?
- [ ] Toda leitura respeita **RLS** e o teste de isolamento cobre a nova tabela?
- [ ] Efeito externo passa por **outbox + política + (se aplicável) aprovação**?
- [ ] PII exibida respeita **máscara por papel** e registra abertura?
- [ ] Existe **mobile** pensado (não desktop comprimido)?
- [ ] Métrica nova entrou no **metric registry** versionado (nome, fórmula, fonte)?
- [ ] Evento novo entrou no **event catalog** com chave de idempotência declarada?
- [ ] Feature nova tem **entitlement/flag** e é medida no **billing meter**?
- [ ] Há **runbook** para a falha mais provável desse módulo?

## 8. NORTE DE PRODUTO (para decidir prioridade sozinho)

Ordem de valor: **provar o dinheiro** > **agir sobre a prova** > **automatizar a ação** > **embelezar**.
Se uma tarefa não avança um desses, ela vai para `BACKLOG.md` com data — não para o código.
