import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PreviewBadge } from '@/components/data/PreviewBadge';
import { PhasePreviewBanner } from '@/components/state/PhasePreviewBanner';
import { DataTable } from '@/components/data/DataTable';
import { domains } from '@/lib/fake/extra';
import { useLocation } from 'wouter';

export default function DomainsPage() {
  const [, setLocation] = useLocation();

  const columns = [
    { header: 'Domínio', accessorKey: 'name', cell: (d: any) => <span className="font-semibold text-14">{d.name}</span> },
    { header: 'Role', accessorKey: 'role', cell: (d: any) => <span className="text-13">{d.role}</span> },
    { header: 'Status', accessorKey: 'status', cell: (d: any) => (
      <span className={`px-2 py-0.5 rounded text-11 uppercase font-bold ${d.status === 'verificado' ? 'bg-verified/10 text-verified border border-verified/20' : 'bg-warning/10 text-warning border border-warning/20'}`}>
        {d.status}
      </span>
    )},
    { header: 'Latência (P95)', accessorKey: 'p95', cell: (d: any) => <span className="font-mono text-13">{d.p95 ? `${d.p95}ms` : '-'}</span> }
  ];

  return (
    <AppShell breadcrumb={[{ label: 'Domains' }]}>
      <div className="max-w-7xl mx-auto space-y-6">
          <PhasePreviewBanner phase="P5" scope="Verificação DNS, latência P95, redirects" />
        <div className="flex justify-between items-end">
          <div>
            <div className="flex flex-wrap items-center gap-3"><h1 className="text-24 font-bold text-eggshell mb-2">Domains</h1><PreviewBadge /></div>
            <p className="text-14 text-stone">Gerencie os domínios de tracking e redirects.</p>
          </div>
          <button className="bg-eggshell text-ink px-4 py-2 rounded-md font-medium text-14 hover:bg-white transition-colors">
            Adicionar Domínio
          </button>
        </div>
        
        <DataTable 
          data={domains} 
          columns={columns} 
          onRowClick={(d) => setLocation(`/domains/${d.id}`)}
        />
      </div>
    </AppShell>
  );
}