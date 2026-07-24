import React from 'react';
import { PlatformShell } from '@/components/layout/PlatformShell';
import { PlatformPageHeader } from '@/components/layout/PlatformPageHeader';
import { DataTable } from '@/components/data/DataTable';

export default function PlatformStaffPage() {
  const staff = [
    { name: 'Admin Principal', email: 'admin@trakacquire.io', role: 'Super Admin', mfa: 'Sim' },
    { name: 'Suporte L2', email: 'support@trakacquire.io', role: 'Support', mfa: 'Sim' },
    { name: 'Finanças', email: 'finance@trakacquire.io', role: 'Finance', mfa: 'Sim' }
  ];

  const columns = [
    { header: 'Nome', accessorKey: 'name', cell: (s: any) => <span className="font-medium text-14 text-eggshell">{s.name}</span> },
    { header: 'Email', accessorKey: 'email', cell: (s: any) => <span className="font-mono text-13 text-stone">{s.email}</span> },
    { header: 'Papel', accessorKey: 'role', cell: (s: any) => <span className="font-mono text-12 px-2 py-0.5 bg-zinc rounded">{s.role}</span> },
    { header: 'MFA', accessorKey: 'mfa', cell: (s: any) => <span className="text-verified text-13">✓ {s.mfa}</span> }
  ];

  return (
    <PlatformShell breadcrumb={[{ label: 'Platform Staff' }]}>
      <div className="max-w-7xl mx-auto space-y-6">
        <PlatformPageHeader kicker="Platform · IAM" title="Equipe Plataforma" description="Contas com acesso ao Super Admin. Todas com MFA obrigatório." />
        <DataTable data={staff} columns={columns} />
      </div>
    </PlatformShell>
  );
}
