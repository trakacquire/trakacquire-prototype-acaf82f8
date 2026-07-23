import React, { useState } from 'react';
import { PlatformShell } from '@/components/layout/PlatformShell';
import { toast } from 'sonner';

interface RoutingRow {
  id: string;
  feature: string;
  primary: string;
  fallback: string;
  timeout: string;
}

const INITIAL_ROUTING: RoutingRow[] = [
  { id: 'r1', feature: 'Copiloto de Atendimento', primary: 'gpt-4o',       fallback: 'claude-3-5-sonnet', timeout: '15s' },
  { id: 'r2', feature: 'Sentimento do Inbox',     primary: 'gpt-4o-mini',  fallback: 'gpt-4o',            timeout: '5s'  },
  { id: 'r3', feature: 'Analisador de Risco',     primary: 'gpt-4o',       fallback: 'nenhum',            timeout: '30s' },
  { id: 'r4', feature: 'Geração de Resposta',     primary: 'gpt-4o-mini',  fallback: 'claude-3-haiku',    timeout: '5s'  },
  { id: 'r5', feature: 'Moderação de Conteúdo',   primary: 'gpt-4o-mini',  fallback: 'nenhum',            timeout: '3s'  },
];

export default function PlatformAIRoutingPage() {
  const [routing, setRouting] = useState<RoutingRow[]>(INITIAL_ROUTING);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editBuf, setEditBuf] = useState<Partial<RoutingRow>>({});

  function startEdit(row: RoutingRow) {
    setEditingId(row.id);
    setEditBuf({ primary: row.primary, fallback: row.fallback, timeout: row.timeout });
  }

  function saveEdit(id: string) {
    setRouting(prev => prev.map(r => r.id === id ? { ...r, ...editBuf } : r));
    setEditingId(null);
    setEditBuf({});
  }

  function handleSaveAll() {
    toast.success('Roteamento de IA atualizado.');
  }

  return (
    <PlatformShell breadcrumb={[{ label: 'Roteamento de IA' }]}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-24 font-bold text-[var(--eggshell)]">Roteamento de Modelos de IA</h1>
          <button
            onClick={handleSaveAll}
            className="px-4 py-2 rounded-md text-14 font-medium bg-[var(--eggshell)] text-[var(--ink)] hover:bg-white transition-colors"
          >
            Salvar configuração
          </button>
        </div>

        <div className="bg-[var(--graphite)] border border-[var(--line)] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-13">
              <thead>
                <tr className="border-b border-[var(--line)]">
                  <th className="text-left text-11 text-[var(--stone)] font-medium px-4 py-3 uppercase">Funcionalidade</th>
                  <th className="text-left text-11 text-[var(--stone)] font-medium px-4 py-3 uppercase">Principal</th>
                  <th className="text-left text-11 text-[var(--stone)] font-medium px-4 py-3 uppercase">Reserva</th>
                  <th className="text-left text-11 text-[var(--stone)] font-medium px-4 py-3 uppercase">Tempo limite</th>
                  <th className="text-left text-11 text-[var(--stone)] font-medium px-4 py-3 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody>
                {routing.map(row => (
                  <tr key={row.id} className="border-b border-[var(--line)]/50 last:border-0 hover:bg-[var(--iron)] transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-medium text-13 text-[var(--eggshell)]">{row.feature}</span>
                    </td>
                    <td className="px-4 py-3">
                      {editingId === row.id ? (
                        <input
                          value={editBuf.primary ?? ''}
                          onChange={e => setEditBuf(b => ({ ...b, primary: e.target.value }))}
                          className="bg-[var(--zinc)] border border-[var(--line)] rounded px-2 py-1 text-12 font-mono text-[var(--eggshell)] w-40 focus:outline-none focus:border-[var(--proof-blue)]"
                        />
                      ) : (
                        <span className="font-mono text-12 text-[var(--proof-blue)] bg-[var(--proof-blue)]/10 px-2 py-1 rounded">
                          {row.primary}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editingId === row.id ? (
                        <input
                          value={editBuf.fallback ?? ''}
                          onChange={e => setEditBuf(b => ({ ...b, fallback: e.target.value }))}
                          className="bg-[var(--zinc)] border border-[var(--line)] rounded px-2 py-1 text-12 font-mono text-[var(--eggshell)] w-40 focus:outline-none focus:border-[var(--proof-blue)]"
                        />
                      ) : (
                        <span className="font-mono text-12 text-[var(--stone)]">{row.fallback}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editingId === row.id ? (
                        <input
                          value={editBuf.timeout ?? ''}
                          onChange={e => setEditBuf(b => ({ ...b, timeout: e.target.value }))}
                          className="bg-[var(--zinc)] border border-[var(--line)] rounded px-2 py-1 text-12 font-mono text-[var(--eggshell)] w-20 focus:outline-none focus:border-[var(--proof-blue)]"
                        />
                      ) : (
                        <span className="font-mono text-12 text-[var(--eggshell)]">{row.timeout}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editingId === row.id ? (
                        <button
                          onClick={() => saveEdit(row.id)}
                          className="text-12 text-[var(--verified)] hover:underline"
                        >
                          Salvar
                        </button>
                      ) : (
                        <button
                          onClick={() => startEdit(row)}
                          className="text-12 text-[var(--proof-blue)] hover:underline"
                        >
                          Editar
                        </button>
                      )}
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
