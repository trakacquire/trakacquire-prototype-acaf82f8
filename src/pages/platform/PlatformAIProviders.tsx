import React from 'react';
import { PlatformShell } from '@/components/layout/PlatformShell';
import { db } from '@/lib/fake/db';
import { StatusChip } from '@/components/domain/StatusChip';
import type { EventStatus } from '@/lib/types';

const providers = [
  { id: 'openai',    name: 'OpenAI',             models: ['gpt-4o-mini', 'gpt-4o'],              env: 'produção', status: 'Ativo',        cost_per_1k: 0.002,  latency_p99: 820  },
  { id: 'anthropic', name: 'Anthropic',           models: ['claude-3-haiku', 'claude-3-5-sonnet'], env: 'produção', status: 'Ativo',        cost_per_1k: 0.0015, latency_p99: 950  },
  { id: 'local',     name: 'LLM Local (Ollama)',  models: ['llama-3.1-8b'],                        env: 'sandbox',  status: 'Desabilitado', cost_per_1k: 0,      latency_p99: 340  },
];

export default function PlatformAIProvidersPage() {
  const aiEvents = db.events.filter(e => e.type === 'bot_message').length;
  const estimatedCost = (aiEvents * 0.002 * 1.2).toFixed(2).replace('.', ',');

  function fmtNum(n: number) {
    return n.toLocaleString('pt-BR');
  }

  return (
    <PlatformShell breadcrumb={[{ label: 'Provedores de IA' }]}>
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-24 font-bold text-[var(--eggshell)]">Provedores de IA</h1>

        {/* Stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[var(--graphite)] border border-[var(--line)] rounded-xl p-5">
            <div className="text-11 font-mono text-[var(--stone)] uppercase mb-1">Chamadas este mês</div>
            <div className="text-22 font-mono text-[var(--eggshell)]">{fmtNum(aiEvents)}</div>
          </div>
          <div className="bg-[var(--graphite)] border border-[var(--line)] rounded-xl p-5">
            <div className="text-11 font-mono text-[var(--stone)] uppercase mb-1">Custo estimado</div>
            <div className="text-22 font-mono text-[var(--eggshell)]">R$ {estimatedCost}</div>
          </div>
          <div className="bg-[var(--graphite)] border border-[var(--line)] rounded-xl p-5">
            <div className="text-11 font-mono text-[var(--stone)] uppercase mb-1">Latência P99</div>
            <div className="text-22 font-mono text-[var(--eggshell)]">847ms</div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-[var(--graphite)] border border-[var(--line)] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-13">
              <thead>
                <tr className="border-b border-[var(--line)]">
                  <th className="text-left text-11 text-[var(--stone)] font-medium px-4 py-3 uppercase">Provedor</th>
                  <th className="text-left text-11 text-[var(--stone)] font-medium px-4 py-3 uppercase">Modelos</th>
                  <th className="text-left text-11 text-[var(--stone)] font-medium px-4 py-3 uppercase">Ambiente</th>
                  <th className="text-left text-11 text-[var(--stone)] font-medium px-4 py-3 uppercase">Status</th>
                  <th className="text-right text-11 text-[var(--stone)] font-medium px-4 py-3 uppercase">Custo/1k tokens</th>
                  <th className="text-right text-11 text-[var(--stone)] font-medium px-4 py-3 uppercase">Latência P99</th>
                </tr>
              </thead>
              <tbody>
                {providers.map(p => (
                  <tr key={p.id} className="border-b border-[var(--line)]/50 last:border-0 hover:bg-[var(--iron)] transition-colors">
                    <td className="px-4 py-3">
                      <span className="text-14 font-bold text-[var(--eggshell)]">{p.name}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-12 font-mono text-[var(--stone)]">{p.models.join(', ')}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-13 text-[var(--stone)]">{p.env}</span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusChip status={(p.status === 'Ativo' ? 'Confirmed' : 'Synthetic') as EventStatus} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-mono text-12 text-[var(--eggshell)]">
                        {p.cost_per_1k === 0 ? '—' : `$${p.cost_per_1k.toFixed(4)}`}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-mono text-12 text-[var(--eggshell)]">{p.latency_p99}ms</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PlatformShell>
  );
}
