import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { DataTable } from '@/components/data/DataTable';
import { flows } from '@/lib/fake/extra';
import { useLocation } from 'wouter';

export default function AutomationsPage() {
  const [, setLocation] = useLocation();

  const columns = [
    { header: 'Fluxo', accessorKey: 'name', cell: (f: any) => <span className="font-semibold text-14 text-eggshell">{f.name}</span> },
    { header: 'Status', accessorKey: 'status', cell: (f: any) => (
      <span className={`px-2 py-0.5 rounded text-11 uppercase font-bold ${f.status === 'published' ? 'bg-verified/10 text-verified' : f.status === 'draft' ? 'bg-zinc text-stone' : 'bg-warning/10 text-warning'}`}>
        {f.status}
      </span>
    )},
    { header: 'Entradas', accessorKey: 'entries', className: 'text-right', cell: (f: any) => <span className="font-mono text-13">{f.entries}</span> },
    { header: 'FTD Gerado', accessorKey: 'ftd_generated', className: 'text-right', cell: (f: any) => <span className="font-mono text-13 font-bold text-verified">{f.ftd_generated}</span> },
    { header: 'Receita', accessorKey: 'revenue', className: 'text-right', cell: (f: any) => <span className="font-mono text-13">R$ {f.revenue}</span> }
  ];

  return (
    <AppShell breadcrumb={[{ label: 'Automations' }]}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-end">
          <h1 className="text-24 font-bold text-eggshell">Automations & Flows</h1>
          <button className="bg-eggshell text-ink px-4 py-2 rounded-md font-medium text-14 hover:bg-white transition-colors">
            Criar Fluxo
          </button>
        </div>
        
        <DataTable 
          data={flows} 
          columns={columns} 
          onRowClick={(f) => setLocation(`/automations/${f.id}`)}
        />
      </div>
    </AppShell>
  );
}