import React, { useState } from 'react';
import { AppShell, useEvidence } from '@/components/layout/AppShell';
import { PreviewBadge } from '@/components/data/PreviewBadge';
import { MetricValue } from '@/components/data/MetricValue';
import { ScenarioStateGate, StateShowcase } from '@/components/state/ScenarioStateGate';
import { buildEvidence } from '@/lib/evidence';
import { conversations } from '@/lib/fake/extra';
import { Bot, User, Sparkles, StickyNote, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const fmt = {
  cur: (n: number) => 'R$ ' + n.toLocaleString('pt-BR', { maximumFractionDigits: 0 }),
};

export default function InboxPage() {
  const { openEvidence } = useEvidence();
  const [message, setMessage] = useState('');
  const [showNote, setShowNote] = useState(false);
  const collision = true;

  return (
    <AppShell breadcrumb={[{ label: 'Operate' }, { label: 'Caixa de Entrada' }]}>
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="text-11 font-serif italic text-stone">Operate · Caixa de Entrada</div>
          <PreviewBadge />
          <StateShowcase />
        </div>

        <ScenarioStateGate
          emptyTitle="Nenhuma conversa aberta"
          emptyDescription="Todas as filas estão vazias no momento."
          emptyPrerequisite="Configure Telegram/WhatsApp em Integrações."
        >
          <div className="h-[calc(100vh-180px)] flex -mx-4 -my-4 lg:-mx-6 lg:-my-6 bg-ink border-t border-line">
            {/* Filas */}
            <div className="w-80 bg-graphite border-r border-line flex flex-col">
              <div className="p-4 border-b border-line flex justify-between items-center bg-iron">
                <h3 className="text-14 font-semibold text-eggshell">Ativas</h3>
                <span className="text-12 bg-proof-blue text-ink px-2 py-0.5 rounded font-bold font-mono tabular-nums">2 não lidas</span>
              </div>
              <div className="flex-1 overflow-y-auto divide-y divide-line">
                {conversations.map((c, i) => (
                  <div key={c.id} className={`p-4 cursor-pointer hover:bg-zinc transition-colors ${i === 0 ? 'bg-zinc border-l-2 border-l-proof-blue' : ''}`}>
                    <div className="flex justify-between items-start mb-1">
                      <div className="font-medium text-14 text-eggshell flex items-center gap-2">
                        {c.unread && <span className="w-2 h-2 rounded-full bg-proof-blue" />}
                        {c.name}
                      </div>
                      <span className="text-11 text-stone font-mono tabular-nums">{c.time}</span>
                    </div>
                    <div className="text-13 text-stone line-clamp-1">{c.last_msg}</div>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-11 uppercase font-bold text-stone bg-iron inline-flex px-1.5 rounded border border-line">{c.channel}</span>
                      <span className="text-11 font-mono text-stone/70">fila: FTD Urgente</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Thread */}
            <div className="flex-1 flex flex-col bg-ink">
              <div className="h-16 border-b border-line flex items-center justify-between px-6 bg-iron">
                <div>
                  <h2 className="text-16 font-bold text-eggshell">João Silva</h2>
                  <div className="text-11 font-mono text-stone tabular-nums">conv_x91a · SLA resposta: 04:12 restantes</div>
                </div>
                <div className="flex items-center gap-2">
                  {collision && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded border border-warning/25 bg-warning/5 text-warning text-11 font-mono">
                      <AlertCircle className="w-3 h-3" /> Ana está digitando
                    </span>
                  )}
                  <button onClick={() => toast('Transferido com contexto para VIP · Ana.')} className="text-12 text-stone hover:text-eggshell px-2 py-1 border border-line rounded">Transferir</button>
                  <button onClick={() => toast('Handoff bot ↔ humano registrado no ledger.')} className="text-12 text-eggshell bg-zinc hover:bg-iron px-2 py-1 border border-line rounded flex items-center gap-1">
                    <Bot className="w-3 h-3" /><User className="w-3 h-3" /> Handoff
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="text-center text-11 font-mono text-stone">Ontem</div>
                <div className="flex justify-end">
                  <div className="bg-proof-blue/10 border border-proof-blue/30 text-eggshell p-3 rounded-l-xl rounded-br-xl max-w-md text-14">Olá João! Você fez o registro na plataforma?</div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-graphite border border-line text-eggshell p-3 rounded-r-xl rounded-bl-xl max-w-md text-14">Sim, fiz pelo link de vocês.</div>
                </div>
                <div className="text-center text-11 font-mono text-stone">Hoje</div>
                <div className="flex justify-start">
                  <div className="bg-graphite border border-line text-eggshell p-3 rounded-r-xl rounded-bl-xl max-w-md text-14">Já fiz o depósito, e agora?</div>
                </div>
                <div className="flex justify-start">
                  <div className="max-w-md bg-iron border border-proof-blue/30 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-1 text-11 font-mono uppercase tracking-wider text-proof-blue">
                      <Sparkles className="w-3 h-3" /> Sugestão IA · não enviada
                    </div>
                    <div className="text-13 text-eggshell">Parabéns pelo depósito, João! Seu bônus de boas-vindas foi liberado. Precisa de ajuda?</div>
                    <div className="mt-2 flex gap-2">
                      <button onClick={() => { setMessage('Parabéns pelo depósito, João! Seu bônus de boas-vindas foi liberado. Precisa de ajuda?'); toast('Sugestão inserida no editor.'); }} className="text-11 text-eggshell bg-zinc border border-line rounded px-2 py-1">Usar</button>
                      <button onClick={() => toast('Sugestão descartada.')} className="text-11 text-stone hover:text-eggshell">Descartar</button>
                    </div>
                  </div>
                </div>
                {showNote && (
                  <div className="flex justify-center">
                    <div className="max-w-md bg-warning/5 border border-warning/25 rounded-lg p-3 text-12 text-warning font-mono">
                      Nota interna: cliente tem histórico de saque rápido — recomendar bônus com rollover ×20.
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 bg-graphite border-t border-line space-y-2">
                <div className="flex items-center gap-2 text-11 font-mono text-stone">
                  <button onClick={() => setShowNote(v => !v)} className="inline-flex items-center gap-1 hover:text-eggshell"><StickyNote className="w-3 h-3" /> Nota interna</button>
                  <span>·</span>
                  <button onClick={() => setMessage('/boas-vindas ')} className="hover:text-eggshell">/macros</button>
                </div>
                <div className="bg-zinc border border-line rounded-lg flex items-center p-2">
                  <input value={message} onChange={e => setMessage(e.target.value)} type="text" placeholder="Escreva a resposta ou use / para macros…" className="flex-1 bg-transparent border-none text-14 text-eggshell outline-none px-2" />
                  <button onClick={() => { toast('Mensagem enviada · ledger conv_reply anexado.'); setMessage(''); }} className="bg-proof-blue text-ink px-4 py-1.5 rounded font-medium text-13">Enviar</button>
                </div>
              </div>
            </div>

            {/* Revenue Context */}
            <div className="w-80 bg-graphite border-l border-line flex flex-col p-6 overflow-y-auto">
              <h3 className="text-11 uppercase font-bold tracking-wider text-stone mb-4">Revenue context</h3>
              <div className="space-y-5">
                <button
                  onClick={() => openEvidence(buildEvidence({
                    label: 'Confiança de identidade', value: '94%',
                    formula: 'identity_graph.confidence(person=jsilva)',
                    source: 'Identity Graph · v2.3',
                    freshness: 'atualizado há 45s',
                  }))}
                  className="w-full text-left"
                >
                  <div className="text-12 text-stone mb-1">Identidade resolvida</div>
                  <div className="font-mono text-14 text-verified font-bold tabular-nums">✓ 94% match</div>
                </button>

                <div className="border border-line rounded-lg p-4 bg-iron">
                  <div className="text-11 font-mono text-stone uppercase mb-2">Aquisição atribuída</div>
                  <div className="text-14 text-eggshell font-medium">Meta Ads</div>
                  <div className="text-13 text-stone truncate mb-2">Campanha Brasil Quente</div>
                  <div className="font-mono text-12 text-proof-blue bg-proof-blue/10 inline-flex px-1.5 py-0.5 rounded">clk_8f72h</div>
                </div>

                <button
                  onClick={() => openEvidence(buildEvidence({
                    label: 'Total depositado · João Silva',
                    value: fmt.cur(1840),
                    formula: 'sum(deposits.confirmed) where person_id=jsilva',
                    source: 'TAP Postback',
                    state: 'Reconciliado',
                  }))}
                  className="w-full text-left border border-verified/30 rounded-lg p-4 bg-verified/5"
                >
                  <div className="text-11 font-mono text-stone uppercase mb-2">Estado financeiro</div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-13 text-eggshell">Estágio</span>
                    <span className="text-13 font-bold text-verified">Ativo pós-FTD</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-13 text-eggshell">Total depósitos</span>
                    <span className="font-mono text-13 font-bold text-verified tabular-nums">{fmt.cur(1840)}</span>
                  </div>
                </button>

                <button
                  onClick={() => openEvidence(buildEvidence({
                    label: 'Influência do atendente', value: '+R$ 320 · 2 FTDs',
                    formula: 'sum(revenue) where last_touch=agent within 24h',
                    source: 'Attribution engine · window=24h',
                  }))}
                  className="w-full text-left border border-line rounded-lg p-4 bg-iron"
                >
                  <div className="text-11 font-mono text-stone uppercase mb-2">Influência do atendente</div>
                  <div className="font-mono text-13 text-eggshell tabular-nums">+R$ 320 · 2 FTDs (30d)</div>
                </button>
              </div>
            </div>
          </div>
        </ScenarioStateGate>
      </div>
    </AppShell>
  );
}
