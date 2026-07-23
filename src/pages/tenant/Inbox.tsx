import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { conversations } from '@/lib/fake/extra';

export default function InboxPage() {
  return (
    <AppShell breadcrumb={[{ label: 'Caixa de Entrada' }]}>
      <div className="h-[calc(100vh-120px)] flex -mx-4 -my-4 lg:-mx-6 lg:-my-6 bg-ink border-t border-line">
        
        {/* Left Col: Fila/Conversas */}
        <div className="w-80 bg-graphite border-r border-line flex flex-col">
          <div className="p-4 border-b border-line flex justify-between items-center bg-iron">
            <h3 className="text-14 font-semibold text-eggshell">Ativas</h3>
            <span className="text-12 bg-proof-blue text-ink px-2 py-0.5 rounded font-bold">2 não lidas</span>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-line">
            {conversations.map((c, i) => (
              <div key={c.id} className={`p-4 cursor-pointer hover:bg-zinc transition-colors ${i === 0 ? 'bg-zinc border-l-2 border-l-proof-blue' : ''}`}>
                <div className="flex justify-between items-start mb-1">
                  <div className="font-medium text-14 text-eggshell flex items-center gap-2">
                    {c.unread && <span className="w-2 h-2 rounded-full bg-proof-blue"></span>}
                    {c.name}
                  </div>
                  <span className="text-11 text-stone font-mono">{c.time}</span>
                </div>
                <div className="text-13 text-stone line-clamp-1">{c.last_msg}</div>
                <div className="mt-2 text-11 uppercase font-bold text-stone bg-iron inline-flex px-1.5 rounded border border-line">{c.channel}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Center Col: Thread */}
        <div className="flex-1 flex flex-col bg-[#0E0E10]">
          <div className="h-16 border-b border-line flex items-center px-6 bg-iron">
            <h2 className="text-16 font-bold text-eggshell">João Silva</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="text-center text-11 font-mono text-stone my-4">Ontem</div>
            <div className="flex justify-end">
              <div className="bg-proof-blue/10 border border-proof-blue/30 text-eggshell p-3 rounded-l-xl rounded-br-xl max-w-md text-14">
                Olá João! Você fez o registro na plataforma?
              </div>
            </div>
            <div className="flex justify-start">
              <div className="bg-graphite border border-line text-eggshell p-3 rounded-r-xl rounded-bl-xl max-w-md text-14">
                Sim, fiz pelo link de vocês.
              </div>
            </div>
            <div className="text-center text-11 font-mono text-stone my-4">Hoje</div>
            <div className="flex justify-start">
              <div className="bg-graphite border border-line text-eggshell p-3 rounded-r-xl rounded-bl-xl max-w-md text-14">
                Já fiz o depósito, e agora?
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-graphite border-t border-line">
            <div className="bg-zinc border border-line rounded-lg flex items-center p-2">
              <input type="text" placeholder="Escreva a resposta ou use / para macros..." className="flex-1 bg-transparent border-none text-14 text-eggshell outline-none px-2" />
              <button className="bg-proof-blue text-ink px-4 py-1.5 rounded font-medium text-13">Enviar</button>
            </div>
          </div>
        </div>

        {/* Right Col: Revenue Context */}
        <div className="w-80 bg-graphite border-l border-line flex flex-col p-6">
          <h3 className="text-11 uppercase font-bold tracking-wider text-stone mb-4">Contexto de Receita</h3>
          
          <div className="space-y-6">
            <div>
              <div className="text-12 text-stone mb-1">Identidade Resolvida</div>
              <div className="font-mono text-14 text-verified font-bold flex items-center gap-2">
                ✓ 94% Match
              </div>
            </div>
            
            <div className="border border-line rounded-lg p-4 bg-iron">
              <div className="text-11 font-mono text-stone uppercase mb-2">Aquisição Atribuída</div>
              <div className="text-14 text-eggshell font-medium">Meta Ads</div>
              <div className="text-13 text-stone truncate mb-2">Campanha Brasil Quente</div>
              <div className="font-mono text-12 text-proof-blue bg-proof-blue/10 inline-flex px-1 rounded">clk_8f72h</div>
            </div>

            <div className="border border-verified/30 rounded-lg p-4 bg-verified/5">
              <div className="text-11 font-mono text-stone uppercase mb-2">Estado Financeiro</div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-13 text-eggshell">Estágio</span>
                <span className="text-13 font-bold text-verified">Ativo pós-FTD</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-13 text-eggshell">Total Depósitos</span>
                <span className="font-mono text-13 font-bold text-verified">R$ 1.840</span>
              </div>
            </div>
            
            <div className="pt-4 border-t border-line">
              <button className="w-full bg-zinc border border-line text-eggshell py-2 rounded-md font-medium text-13 hover:bg-line">
                Marcar Evento de Conversão
              </button>
            </div>
          </div>
        </div>

      </div>
    </AppShell>
  );
}