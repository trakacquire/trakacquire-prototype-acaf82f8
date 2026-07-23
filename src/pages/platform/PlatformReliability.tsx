import React from 'react';
import { PlatformShell } from '@/components/layout/PlatformShell';
import { DataTable } from '@/components/data/DataTable';

export default function PlatformReliabilityPage() {
  const slos = [
    { service: 'API Core', target: 99.9, actual: 99.94, budget_remaining: '84%' },
    { service: 'Signal Ingest', target: 99.5, actual: 99.87, budget_remaining: '74%' },
    { service: 'Meta CAPI Delivery', target: 99.0, actual: 97.20, budget_remaining: '0% (Exhausted)' },
  ];

  const columns = [
    { header: 'Serviço', accessorKey: 'service', cell: (s: any) => <span className="font-medium text-14">{s.service}</span> },
    { header: 'Target SLO', accessorKey: 'target', cell: (s: any) => <span className="font-mono text-13">{s.target}%</span> },
    { header: 'Actual (30d)', accessorKey: 'actual', cell: (s: any) => <span className={`font-mono text-13 font-bold ${s.actual >= s.target ? 'text-verified' : 'text-critical'}`}>{s.actual}%</span> },
    { header: 'Error Budget', accessorKey: 'budget_remaining', cell: (s: any) => <span className="text-13 text-stone">{s.budget_remaining}</span> }
  ];

  return (
    <PlatformShell breadcrumb={[{ label: 'Reliability' }]}>
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-24 font-bold text-eggshell">Confiabilidade & SLOs</h1>
        <DataTable data={slos} columns={columns} />
      </div>
    </PlatformShell>
  );
}