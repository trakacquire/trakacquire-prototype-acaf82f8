import React from 'react';
import { PlatformShell } from '@/components/layout/PlatformShell';
import { PlatformPageHeader } from '@/components/layout/PlatformPageHeader';
import { DataTable } from '@/components/data/DataTable';
import { MessageSquare, Clock, CheckCircle2 } from 'lucide-react';

export default function PlatformSupportPage() {
  const [activeTab, setActiveTab] = React.useState('tickets');

  const tickets = [
    { id: 'tck_1', tenant: 'Operação Brasil', subject: 'Integração com Provider C', priority: 'Alta', status: 'Aberto', assignee: 'suporte@trakacquire.io', created: 'Há 2 horas', updated: 'Há 15 min' },
    { id: 'tck_2', tenant: 'Agency Demo', subject: 'Limite de quota atingido', priority: 'Média', status: 'Em andamento', assignee: 'suporte@trakacquire.io', created: 'Há 5 horas', updated: 'Há 1 hora' },
    { id: 'tck_3', tenant: 'iGaming PT', subject: 'Dúvida sobre reconciliação', priority: 'Baixa', status: 'Aguardando cliente', assignee: 'suporte@trakacquire.io', created: 'Há 1 dia', updated: 'Há 8 horas' },
    { id: 'tck_4', tenant: 'Operação MX', subject: 'Erro ao configurar webhook', priority: 'Alta', status: 'Resolvido', assignee: 'tech@trakacquire.io', created: 'Há 2 dias', updated: 'Há 1 dia' },
  ];

  const changelog = [
    { version: 'v2.3.0', date: '2025-07-05', changes: ['Novo dashboard de coortes', 'Melhoria na performance de queries', 'Correção de bug no flow builder'], type: 'Feature' },
    { version: 'v2.2.1', date: '2025-06-28', changes: ['Hotfix: resolver timeout em webhooks', 'Ajuste de timezone em relatórios'], type: 'Hotfix' },
    { version: 'v2.2.0', date: '2025-06-20', changes: ['Integração com WhatsApp Cloud API', 'Suporte a múltiplos domínios customizados', 'Nova UI para Inbox'], type: 'Feature' },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Alta': return 'text-critical';
      case 'Média': return 'text-warning';
      case 'Baixa': return 'text-stone';
      default: return 'text-stone';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Resolvido': return 'text-verified';
      case 'Em andamento': return 'text-proof-blue';
      case 'Aberto': return 'text-warning';
      default: return 'text-stone';
    }
  };

  const ticketColumns = [
    { header: 'ID', accessorKey: 'id', cell: (t: any) => <span className="font-mono text-13 text-proof-blue">{t.id}</span> },
    { header: 'Tenant', accessorKey: 'tenant', cell: (t: any) => <span className="text-14 text-eggshell">{t.tenant}</span> },
    { header: 'Assunto', accessorKey: 'subject', cell: (t: any) => <span className="text-13 text-stone">{t.subject}</span> },
    { 
      header: 'Prioridade', 
      accessorKey: 'priority', 
      cell: (t: any) => (
        <span className={`px-2 py-0.5 rounded text-11 uppercase font-bold bg-iron ${getPriorityColor(t.priority)}`}>
          {t.priority}
        </span>
      )
    },
    { 
      header: 'Status', 
      accessorKey: 'status', 
      cell: (t: any) => (
        <span className={`text-13 ${getStatusColor(t.status)}`}>
          {t.status}
        </span>
      )
    },
    { header: 'Responsável', accessorKey: 'assignee', cell: (t: any) => <span className="font-mono text-12 text-stone">{t.assignee}</span> },
    { header: 'Atualizado', accessorKey: 'updated', cell: (t: any) => <span className="text-13 text-stone">{t.updated}</span> },
  ];

  return (
    <PlatformShell breadcrumb={[{ label<PlatformPageHeader kicker="Platform · Support" title="Support & Changelog" />     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-graphite border border-line rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-warning" />
              </div>
              <div>
                <div className="text-12 text-stone">Tickets Abertos</div>
                <div className="text-18 font-mono text-eggshell">{tickets.filter(t => t.status !== 'Resolvido').length}</div>
              </div>
            </div>
          </div>

          <div className="bg-graphite border border-line rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-proof-blue/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-proof-blue" />
              </div>
              <div>
                <div className="text-12 text-stone">Tempo Médio Resposta</div>
                <div className="text-18 font-mono text-eggshell">2.3h</div>
              </div>
            </div>
          </div>

          <div className="bg-graphite border border-line rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-verified/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-verified" />
              </div>
              <div>
                <div className="text-12 text-stone">Taxa de Resolução</div>
                <div className="text-18 font-mono text-eggshell">94%</div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-line flex gap-6 px-2 overflow-x-auto">
          {[
            { key: 'tickets', label: 'Tickets' },
            { key: 'changelog', label: 'Changelog' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-3 text-14 font-medium whitespace-nowrap transition-colors border-b-2 ${
                activeTab === tab.key ? 'text-eggshell border-proof-blue' : 'text-stone border-transparent hover:text-eggshell'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'tickets' && (
          <>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Buscar tickets..." 
                className="flex-1 bg-zinc border border-line rounded-md px-3 py-2 text-14 text-eggshell outline-none focus:border-proof-blue"
              />
              <select className="bg-zinc border border-line text-eggshell rounded-md px-3 py-2 text-13 outline-none focus:border-proof-blue">
                <option>Todos os status</option>
                <option>Aberto</option>
                <option>Em andamento</option>
                <option>Aguardando cliente</option>
                <option>Resolvido</option>
              </select>
            </div>

            <DataTable data={tickets} columns={ticketColumns} />
          </>
        )}

        {activeTab === 'changelog' && (
          <div className="space-y-4">
            {changelog.map((release, idx) => (
              <div key={idx} className="bg-graphite border border-line rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <h2 className="text-18 font-bold text-eggshell font-mono">{release.version}</h2>
                    <span className={`px-2 py-0.5 rounded text-11 uppercase font-bold ${
                      release.type === 'Feature' ? 'bg-verified/10 text-verified' : 'bg-critical/10 text-critical'
                    }`}>
                      {release.type}
                    </span>
                  </div>
                  <span className="text-13 text-stone">{release.date}</span>
                </div>
                <ul className="list-disc list-inside text-14 text-stone space-y-2">
                  {release.changes.map((change, cidx) => (
                    <li key={cidx}>{change}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </PlatformShell>
  );
}