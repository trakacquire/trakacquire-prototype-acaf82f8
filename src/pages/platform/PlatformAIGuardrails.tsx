import React, { useState } from 'react';
import { PlatformShell } from '@/components/layout/PlatformShell';
import { PlatformPageHeader } from '@/components/layout/PlatformPageHeader';
import { StatusChip } from '@/components/domain/StatusChip';
import type { EventStatus } from '@/lib/types';

interface GuardrailRule {
  id: string;
  name: string;
  type: string;
  pattern: string;
  action: string;
  active: boolean;
}

const INITIAL_RULES: GuardrailRule[] = [
  { id: 'g1', name: 'Mascarar E-mail',         type: 'Mascaramento', pattern: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$', action: 'Substituir por [EMAIL]',  active: true  },
  { id: 'g2', name: 'Mascarar Telefone',        type: 'Mascaramento', pattern: '\\+?[1-9][0-9]{7,14}',                  action: 'Substituir por [FONE]',   active: true  },
  { id: 'g3', name: 'Mascarar CPF',             type: 'Mascaramento', pattern: '\\d{3}\\.?\\d{3}\\.?\\d{3}-?\\d{2}',  action: 'Substituir por [CPF]',    active: true  },
  { id: 'g4', name: 'Injeção de Prompt',        type: 'Lista Negra',  pattern: 'ignore previous instructions',         action: 'Bloquear requisição',     active: true  },
  { id: 'g5', name: 'Bypass de Sistema',        type: 'Lista Negra',  pattern: 'act as (DAN|developer mode)',          action: 'Bloquear requisição',     active: false },
];

export default function PlatformAIGuardrailsPage() {
  const [rules, setRules] = useState<GuardrailRule[]>(INITIAL_RULES);

  function toggleRule(id: string) {
    setRules(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r));
  }

  return (
    <PlatformShell breadcrumb={[{ label: 'Guardrails de IA' }]}>
      <div className="max-w-7xl mx-auto space-y-6">
        <PlatformPageHeader kicker="Platform · AI Guardrails" title="Guardrails de IA e Mascaramento de PII" />

        {/* Stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-graphite border border-line rounded-xl p-5">
            <div className="text-11 font-mono text-stone uppercase mb-1">Regras Ativas</div>
            <div className="text-22 font-mono text-eggshell">{rules.filter(r => r.active).length}</div>
          </div>
          <div className="bg-graphite border border-line rounded-xl p-5">
            <div className="text-11 font-mono text-stone uppercase mb-1">Mascaramento</div>
            <div className="text-22 font-mono text-eggshell">{rules.filter(r => r.type === 'Mascaramento').length}</div>
          </div>
          <div className="bg-graphite border border-line rounded-xl p-5">
            <div className="text-11 font-mono text-stone uppercase mb-1">Lista Negra</div>
            <div className="text-22 font-mono text-eggshell">{rules.filter(r => r.type === 'Lista Negra').length}</div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-graphite border border-line rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-13">
              <thead>
                <tr className="border-b border-line">
                  <th className="text-left text-11 text-stone font-medium px-4 py-3 uppercase">Nome</th>
                  <th className="text-left text-11 text-stone font-medium px-4 py-3 uppercase">Tipo</th>
                  <th className="text-left text-11 text-stone font-medium px-4 py-3 uppercase">Padrão</th>
                  <th className="text-left text-11 text-stone font-medium px-4 py-3 uppercase">Ação</th>
                  <th className="text-left text-11 text-stone font-medium px-4 py-3 uppercase">Status</th>
                  <th className="text-left text-11 text-stone font-medium px-4 py-3 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody>
                {rules.map(rule => (
                  <tr key={rule.id} className="border-b border-line/50 last:border-0 hover:bg-iron transition-colors">
                    <td className="px-4 py-3">
                      <span className="text-13 font-medium text-eggshell">{rule.name}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-11 px-2 py-0.5 rounded font-bold uppercase ${
                        rule.type === 'Lista Negra'
                          ? 'bg-critical/10 text-critical'
                          : 'bg-proof-blue/10 text-proof-blue'
                      }`}>
                        {rule.type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-11 bg-iron px-2 py-1 rounded text-stone max-w-[200px] truncate block">
                        {rule.pattern}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-13 text-stone">{rule.action}</span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusChip status={(rule.active ? 'Confirmed' : 'Synthetic') as EventStatus} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <button className="text-12 text-proof-blue hover:underline">Editar</button>
                        <button
                          onClick={() => toggleRule(rule.id)}
                          className="text-12 text-stone hover:text-eggshell hover:underline transition-colors"
                        >
                          Alternar
                        </button>
                      </div>
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
