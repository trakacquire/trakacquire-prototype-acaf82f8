import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { DataTable } from '@/components/data/DataTable';
import { events } from '@/lib/fake/index';
import { format } from 'date-fns';

export default function IntegrationTAPPage() {
  const tapEvents = events.slice(0, 5); // Just reuse fake events for the table prototype

  const columns = [
    { header: 'Time', accessorKey: 'timestamp', cell: (e: any) => <span className="font-mono text-12 text-stone">{format(new Date(e.timestamp), 'HH:mm:ss')}</span> },
    { header: 'Event', accessorKey: 'type', cell: (e: any) => <span className="text-13">{e.type}</span> },
    { header: 'Status', accessorKey: 'status', cell: (e: any) => <span className="text-13 text-verified">Processado</span> }
  ];

  return (
    <AppShell breadcrumb={[{ label: 'Integrations', href: '/integrations' }, { label: 'TAP' }]}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-graphite border border-line rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-zinc flex items-center justify-center text-2xl border border-line">🎰</div>
            <div>
              <h1 className="text-24 font-bold text-eggshell">The Affiliate Platform (TAP)</h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="bg-verified/10 text-verified border border-verified/20 px-2 py-0.5 rounded text-11 uppercase font-bold">Production</span>
                <span className="text-13 text-stone font-mono">Adapter v2.1.0</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="bg-zinc text-eggshell border border-line px-4 py-2 rounded-md font-medium text-14 hover:bg-iron transition-colors">
              Pausar Integração
            </button>
          </div>
        </div>

        <div className="border-b border-line flex gap-6 px-2 overflow-x-auto">
          {['Visão', 'Setup', 'Eventos', 'Saúde', 'Logs', 'Histórico'].map((tab, i) => (
            <button key={tab} className={`pb-3 text-14 font-medium whitespace-nowrap transition-colors border-b-2 ${i === 1 ? 'text-eggshell border-proof-blue' : 'text-stone border-transparent hover:text-eggshell'}`}>
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-graphite border border-line rounded-xl p-6">
              <h3 className="text-18 font-medium text-eggshell mb-4">Setup Guiado</h3>
              <div className="space-y-4">
                <div className="flex gap-3 text-14 text-eggshell"><span className="text-verified">✓</span> 1. Credenciais TAP</div>
                <div className="flex gap-3 text-14 text-eggshell"><span className="text-verified">✓</span> 2. URL Postback configurada</div>
                <div className="flex gap-3 text-14 text-eggshell"><span className="text-verified">✓</span> 3. Teste de postback</div>
                <div className="flex gap-3 text-14 text-eggshell"><span className="text-verified">✓</span> 4. Reporting API conectada</div>
              </div>
            </div>
            
            <div className="bg-graphite border border-line rounded-xl p-6">
              <h3 className="text-14 font-medium text-stone mb-2">Saúde (Última hora)</h3>
              <div className="flex justify-between items-center mb-2">
                <span className="text-13 text-eggshell">P95 Latência</span>
                <span className="font-mono text-14 text-eggshell">240ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-13 text-eggshell">Taxa de Sucesso</span>
                <span className="font-mono text-14 text-verified font-bold">99.7%</span>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <div className="bg-graphite border border-line rounded-xl overflow-hidden">
              <div className="p-4 border-b border-line bg-iron">
                <h3 className="text-14 font-medium text-eggshell">Últimos Eventos</h3>
              </div>
              <DataTable data={tapEvents} columns={columns} />
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}