import React from 'react';
import { PlatformShell } from '@/components/layout/PlatformShell';
import { PlatformPageHeader } from '@/components/layout/PlatformPageHeader';
import { DataTable } from '@/components/data/DataTable';

export default function PlatformCompliancePage() {
  const dsr = [
    { id: 'DSR-001', tenant: 'Operação Brasil', type: 'Exportar Dados (Portabilidade)', status: 'Pendente', deadline: '8 dias' }
  ];

  const columns = [
    { header: 'ID', accessorKey: 'id', cell: (d: any) => <span className="font-mono text-12">{d.id}</span> },
    { header: 'Tenant', accessorKey: 'tenant' },
    { header: 'Tipo de Solicitação', accessorKey: 'type' },
    { header: 'Status', accessorKey: 'status', cell: (d: any) => <span className="text-warning font-bold">{d.status}</span> },
    { header: 'Prazo Restante', accessorKey: 'deadline', cell: (d: any) => <span className="text-critical">{d.deadline}</span> }
  ];

  return (
    <PlatformShell breadcrumb={[{ label: 'Compli<PlatformPageHeader kicker="Platform · Compliance" title="Compliance" />y-6">
        <div>
          <h2 className="text-18 font-medium text-stone mb-4">Solicitações de Titular (DSR)</h2>
          <DataTable data={dsr} columns={columns} />
        </div>
      </div>
    </PlatformShell>
  );
}