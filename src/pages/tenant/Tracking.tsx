import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { DataTable } from '@/components/data/DataTable';
import { links } from '@/lib/fake/extra';
import { useLocation } from 'wouter';

export default function TrackingPage() {
  const [, setLocation] = useLocation();

  const columns = [
    { header: 'Link Name', accessorKey: 'name', cell: (l: any) => <span className="font-semibold text-14 text-eggshell">{l.name}</span> },
    { header: 'Tipo', accessorKey: 'type', cell: (l: any) => <span className="text-12 px-2 py-0.5 rounded bg-zinc border border-line text-stone">{l.type}</span> },
    { header: 'Cliques', accessorKey: 'clicks', className: 'text-right', cell: (l: any) => <span className="font-mono text-13">{l.clicks}</span> },
    { header: 'Conversões', accessorKey: 'conversions', className: 'text-right', cell: (l: any) => <span className="font-mono text-13 text-verified">{l.conversions}</span> },
    { header: 'CPFTD', accessorKey: 'cpftd', className: 'text-right', cell: (l: any) => <span className="font-mono text-13">{l.cpftd ? `R$ ${l.cpftd}` : '-'}</span> },
    { header: 'Estado', accessorKey: 'state', cell: (l: any) => <span className="text-13 capitalize">{l.state}</span> }
  ];

  return (
    <AppShell breadcrumb={[{ label: 'Tracking Links' }]}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-24 font-bold text-eggshell mb-2">Links</h1>
            <p className="text-14 text-stone">Gerencie URLs rastreáveis e splits.</p>
          </div>
          <button className="bg-eggshell text-ink px-4 py-2 rounded-md font-medium text-14 hover:bg-white transition-colors">
            Criar Link
          </button>
        </div>
        
        <DataTable 
          data={links} 
          columns={columns} 
          onRowClick={(l) => setLocation(`/tracking/${l.id}`)}
        />
      </div>
    </AppShell>
  );
}