import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { toast } from 'sonner';
import ConfirmDialog from '@/components/domain/ConfirmDialog';

type Tab = 'filas' | 'horarios' | 'macros' | 'sla';

const QUEUES = [
  { id: 'q1', nome: 'Suporte Geral', agentes: 3, roteamento: 'Round-robin', sla_resp: '5 min', sla_res: '2 h', ativo: true },
  { id: 'q2', nome: 'FTD Urgente', agentes: 2, roteamento: 'Carga balanceada', sla_resp: '2 min', sla_res: '30 min', ativo: true },
  { id: 'q3', nome: 'VIP', agentes: 1, roteamento: 'Habilidade', sla_resp: '1 min', sla_res: '15 min', ativo: true },
];

const MACROS_SEED = [
  {
    id: 'm1',
    nome: 'Boas-vindas',
    corpo: 'Olá, {nome}! Seja bem-vindo(a) à nossa plataforma. Como posso ajudar você hoje?',
    criador: 'joao@operacaobr.com',
    usos: 142,
  },
  {
    id: 'm2',
    nome: 'Depósito confirmado',
    corpo: 'Ótima notícia, {nome}! Seu depósito de {valor} foi confirmado com sucesso. Bônus aplicado automaticamente. 🎉',
    criador: 'ana@operacaobr.com',
    usos: 89,
  },
  {
    id: 'm3',
    nome: 'Reativação',
    corpo: 'Ei, {nome}! Sentimos sua falta. Temos uma oferta exclusiva esperando por você. Acesse agora e aproveite: {link}',
    criador: 'carlos@operacaobr.com',
    usos: 67,
  },
];

export default function InboxSettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('filas');
  const [deleteQueueOpen, setDeleteQueueOpen] = useState<string | null>(null);
  const [deleteMacroOpen, setDeleteMacroOpen] = useState<string | null>(null);
  const [queues, setQueues] = useState(QUEUES);
  const [macros, setMacros] = useState(MACROS_SEED);

  const tabs: { id: Tab; label: string }[] = [
    { id: 'filas', label: 'Filas' },
    { id: 'horarios', label: 'Horários' },
    { id: 'macros', label: 'Macros' },
    { id: 'sla', label: 'SLA' },
  ];

  return (
    <AppShell breadcrumb={[{ label: 'Inbox', href: '/inbox' }, { label: 'Configurações' }]}>
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-24 font-bold text-[var(--eggshell)]">Configurações do Inbox</h1>

        <div className="border-b border-[var(--line)] flex gap-6 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-14 font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'text-[var(--eggshell)] border-[var(--proof-blue)]'
                  : 'text-[var(--stone)] border-transparent hover:text-[var(--eggshell)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab: Filas */}
        {activeTab === 'filas' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button
                onClick={() => toast('Criar fila: funcionalidade em breve.')}
                className="bg-[var(--eggshell)] text-[var(--ink)] px-4 py-2 rounded-md font-medium text-14 hover:bg-white transition-colors"
              >
                Nova Fila
              </button>
            </div>
            <div className="bg-[var(--graphite)] border border-[var(--line)] rounded-xl overflow-hidden">
              <table className="w-full text-14">
                <thead>
                  <tr className="border-b border-[var(--line)]">
                    {['Fila', 'Agentes', 'Roteamento', 'SLA Resposta', 'SLA Resolução', 'Status', 'Ações'].map(h => (
                      <th key={h} className="text-left text-11 font-semibold text-[var(--stone)] uppercase px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {queues.map(q => (
                    <tr key={q.id} className="border-b border-[var(--line)] hover:bg-[var(--iron)] transition-colors">
                      <td className="px-4 py-3 font-semibold text-[var(--eggshell)]">{q.nome}</td>
                      <td className="px-4 py-3 font-mono text-[var(--eggshell)]">{q.agentes}</td>
                      <td className="px-4 py-3 text-[var(--stone)]">{q.roteamento}</td>
                      <td className="px-4 py-3 font-mono text-[var(--eggshell)]">{q.sla_resp}</td>
                      <td className="px-4 py-3 font-mono text-[var(--eggshell)]">{q.sla_res}</td>
                      <td className="px-4 py-3 text-[var(--verified)] text-13">● Ativo</td>
                      <td className="px-4 py-3 flex gap-2">
                        <button
                          onClick={() => toast('Configuração salva.')}
                          className="px-2 py-1 text-12 bg-[var(--zinc)] border border-[var(--line)] rounded-md text-[var(--eggshell)] hover:bg-[var(--iron)] transition-colors"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => setDeleteQueueOpen(q.id)}
                          className="px-2 py-1 text-12 bg-[var(--zinc)] border border-[var(--critical)]/30 rounded-md text-[var(--critical)] hover:bg-[var(--iron)] transition-colors"
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab: Horários */}
        {activeTab === 'horarios' && (
          <div className="bg-[var(--graphite)] border border-[var(--line)] rounded-xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-18 font-medium text-[var(--eggshell)]">Horário de Atendimento</h2>
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-13 text-[var(--stone)]">Atendimento 24h</span>
                <input type="checkbox" className="w-4 h-4 rounded border-[var(--line)] bg-[var(--zinc)]" />
              </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].map(day => (
                <div key={day} className="bg-[var(--iron)] border border-[var(--line)] rounded-lg p-4 flex justify-between items-center">
                  <span className="text-14 text-[var(--eggshell)] w-20">{day}</span>
                  <div className="flex gap-2 items-center text-13">
                    <input type="time" defaultValue="08:00" className="bg-[var(--zinc)] border border-[var(--line)] rounded px-2 py-1 text-[var(--eggshell)]" />
                    <span className="text-[var(--stone)]">até</span>
                    <input type="time" defaultValue="20:00" className="bg-[var(--zinc)] border border-[var(--line)] rounded px-2 py-1 text-[var(--eggshell)]" />
                  </div>
                </div>
              ))}
            </div>
            <div>
              <label className="block text-12 font-medium text-[var(--stone)] mb-1.5">Mensagem Fora do Horário</label>
              <textarea
                rows={3}
                defaultValue="Estamos fora do horário de atendimento. Responderemos em breve durante nosso horário comercial: Seg–Sex 08h–20h."
                className="w-full bg-[var(--zinc)] border border-[var(--line)] rounded-md px-3 py-2 text-14 text-[var(--eggshell)] outline-none focus:border-[var(--proof-blue)]"
              />
            </div>
            <div className="flex justify-end pt-4 border-t border-[var(--line)]">
              <button
                onClick={() => toast('Configuração salva.')}
                className="bg-[var(--eggshell)] text-[var(--ink)] px-6 py-2 rounded-md font-medium text-14 hover:bg-white transition-colors"
              >
                Salvar
              </button>
            </div>
          </div>
        )}

        {/* Tab: Macros */}
        {activeTab === 'macros' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button
                onClick={() => toast('Criar macro: funcionalidade em breve.')}
                className="bg-[var(--eggshell)] text-[var(--ink)] px-4 py-2 rounded-md font-medium text-14 hover:bg-white transition-colors"
              >
                Nova Macro
              </button>
            </div>
            <div className="space-y-3">
              {macros.map(macro => (
                <div key={macro.id} className="bg-[var(--graphite)] border border-[var(--line)] rounded-xl p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-15 text-[var(--eggshell)] mb-1">{macro.nome}</div>
                      <p className="text-13 text-[var(--stone)] truncate">{macro.corpo}</p>
                      <div className="flex items-center gap-4 mt-2 text-12 text-[var(--stone)]">
                        <span>Criado por <span className="font-mono">{macro.criador}</span></span>
                        <span>{macro.usos} uso(s) este mês</span>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => toast('Configuração salva.')}
                        className="px-3 py-1.5 text-12 bg-[var(--zinc)] border border-[var(--line)] rounded-md text-[var(--eggshell)] hover:bg-[var(--iron)] transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => setDeleteMacroOpen(macro.id)}
                        className="px-3 py-1.5 text-12 bg-[var(--zinc)] border border-[var(--critical)]/30 rounded-md text-[var(--critical)] hover:bg-[var(--iron)] transition-colors"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: SLA */}
        {activeTab === 'sla' && (
          <div className="bg-[var(--graphite)] border border-[var(--line)] rounded-xl p-6 space-y-6">
            <h2 className="text-18 font-medium text-[var(--eggshell)]">Configuração de SLA por Fila</h2>
            <div className="space-y-4">
              {[
                { nome: 'Suporte Geral', resp: 5, res: 120, esc: 15 },
                { nome: 'FTD Urgente', resp: 2, res: 30, esc: 5 },
                { nome: 'VIP', resp: 1, res: 15, esc: 3 },
              ].map(sla => (
                <div key={sla.nome} className="bg-[var(--iron)] border border-[var(--line)] rounded-lg p-4">
                  <h3 className="text-14 font-semibold text-[var(--eggshell)] mb-3">{sla.nome}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-12 text-[var(--stone)] mb-1.5">Primeira resposta</label>
                      <input type="number" defaultValue={sla.resp} className="w-full bg-[var(--zinc)] border border-[var(--line)] rounded-md px-3 py-2 text-14 text-[var(--eggshell)] outline-none" />
                      <span className="text-11 text-[var(--stone)]">minutos</span>
                    </div>
                    <div>
                      <label className="block text-12 text-[var(--stone)] mb-1.5">Resolução</label>
                      <input type="number" defaultValue={sla.res} className="w-full bg-[var(--zinc)] border border-[var(--line)] rounded-md px-3 py-2 text-14 text-[var(--eggshell)] outline-none" />
                      <span className="text-11 text-[var(--stone)]">minutos</span>
                    </div>
                    <div>
                      <label className="block text-12 text-[var(--stone)] mb-1.5">Escalada (sem resposta)</label>
                      <input type="number" defaultValue={sla.esc} className="w-full bg-[var(--zinc)] border border-[var(--line)] rounded-md px-3 py-2 text-14 text-[var(--eggshell)] outline-none" />
                      <span className="text-11 text-[var(--stone)]">minutos</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-4 border-t border-[var(--line)]">
              <button
                onClick={() => toast('Configuração salva.')}
                className="bg-[var(--eggshell)] text-[var(--ink)] px-6 py-2 rounded-md font-medium text-14 hover:bg-white transition-colors"
              >
                Salvar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete queue dialog */}
      <ConfirmDialog
        open={deleteQueueOpen !== null}
        onClose={() => setDeleteQueueOpen(null)}
        onConfirm={() => {
          setQueues(prev => prev.filter(q => q.id !== deleteQueueOpen));
          toast('Item excluído.');
        }}
        title="Excluir fila?"
        description="Esta ação removerá permanentemente a fila e não pode ser desfeita."
        confirmLabel="Excluir"
        danger
      />

      {/* Delete macro dialog */}
      <ConfirmDialog
        open={deleteMacroOpen !== null}
        onClose={() => setDeleteMacroOpen(null)}
        onConfirm={() => {
          setMacros(prev => prev.filter(m => m.id !== deleteMacroOpen));
          toast('Item excluído.');
        }}
        title="Excluir macro?"
        description="Esta ação removerá a macro permanentemente. Histórico de usos será mantido."
        confirmLabel="Excluir"
        danger
      />
    </AppShell>
  );
}
