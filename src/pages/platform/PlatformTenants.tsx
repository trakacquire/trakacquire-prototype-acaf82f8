import React from 'react';
import { PlatformShell } from '@/components/layout/PlatformShell';
import { PlatformPageHeader } from '@/components/layout/PlatformPageHeader';
import { DataTable } from '@/components/data/DataTable';
import { tenants } from '@/lib/fake/extra';
import { useLocation } from 'wouter';

export default function PlatformTenantsPage() {
  const [, setLocation] = useLocation();

  const columns = [
    { header: 'Tenant', accessorKey: 'name', cell: (t: any) => <span className="font-semibold text-14">{t.name}</span> },
    { header: 'Plano', accessorKey: 'plan', cell: (t: any) => <span className="text-13 uppercase px-2 py-0.5 rounded border border-line bg-zinc">{t.plan}</span> },
    { header: 'MRR', accessorKey: 'mrr', className: 'text-right', cell: (t: any) => <span className="font-mono text-14">R$ {t.mrr}</span> },
    { header: 'Uso vs Quota', accessorKey: 'usage', className: 'text-right', cell: (t: any) => (
        <div className="flex flex-col items-end">
          <span className="font-mono text-12">{t.usage.toLocaleString()} / {t.quota === -1 ? '∞' : t.quota.toLocaleString()}</span>
        </div>
      )
    },
    { header: 'Saúde', accessorKey: 'health', cell: (t: any) => (
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${t.health === 'good' ? 'bg-verified' : t.health === 'warning' ? 'bg-warning' : 'bg-critical'}`}></span>
          <span className="text-13 capitalize">{t.health}</span>
        </div>
      )
    },
    { header: 'Estado', accessorKey: 'state', cell: (t: any) => <span className="text-13">{t.state}</span> }
  ];

  return (
    <PlatformShell breadcrumb={[{ label: 'Tenants' }]}>
      <div className="max-w-7xl mx-auto space-y-6">
        <PlatformPageHeader kicker="Platform · Tenants" title="Tenants" />            <p className="text-14 text-stone">Gerencie os clientes da plataforma SaaS.</p>
          </div>
          <button onClick={() => setLocation('/platform/tenants/new')} className="bg-eggshell text-ink px-4 py-2 rounded-md font-medium text-14 hover:bg-white transition-colors">
            Provisionar Tenant
          </button>
        </div>
        
        <DataTable 
          data={tenants} 
          columns={columns} 
          searchPlaceholder="Buscar por nome, plano, estado..."
          onRowClick={(t) => setLocation(`/platform/tenants/${t.id}`)}
        />
      </div>
    </PlatformShell>
  );
}