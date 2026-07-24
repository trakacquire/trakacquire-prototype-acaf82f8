import React from 'react';
import { PlatformShell } from '@/components/layout/PlatformShell';
import { PlatformPageHeader } from '@/components/layout/PlatformPageHeader';
import { DataTable } from '@/components/data/DataTable';

export default function PlatformReleasesPage() {
  const releases = [
    { tenant: 'Operação Brasil', schema: 'v4.2 (Latest)', rollout: '100%' },
    { tenant: 'Agency Demo', schema: 'v4.2 (Latest)', rollout: '100%' },
    { tenant: 'Teste MX', schema: 'v4.1', rollout: 'Pendente' }
  ];

  const columns = [
    { header: 'Tenant', accessorKey: 'tenant', cell: (r: any) => <span className="font-medium text-14">{r.tenant}</span> },
    { header: 'Database Schema', accessorKey: 'schema', cell: (r: any) => <span className="font-mono text-13 px-2 py-0.5 rounded bg-zinc">{r.schema}</span> },
    { header: 'Rollout', accessorKey: 'rollout', cell: (r: any) => <span className="text-13 text-stone">{r.rollout}</span> }
  ];

  return (
    <PlatformShell breadcrumb={[{ label: 'Release<PlatformPageHeader kicker="Platform · Releases" title="Releases" />e-y-6">
        <h1 className="text-24 font-bold text-eggshell">Releases</h1>
        <DataTable data={releases} columns={columns} />
      </div>
    </PlatformShell>
  );
}