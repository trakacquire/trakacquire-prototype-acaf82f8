import React from 'react';
import { PlatformShell } from '@/components/layout/PlatformShell';
import { PlatformPageHeader } from '@/components/layout/PlatformPageHeader';
import { DataTable } from '@/components/data/DataTable';

export default function PlatformEntitlementsPage() {
  const flags = [
    { key: 'feat_automations', name: 'Automations Builder', starter: false, growth: true, scale: true, overrides: '0 tenants' },
    { key: 'feat_reporting_api', name: 'Custom Reporting API', starter: false, growth: false, scale: true, overrides: '2 tenants' },
    { key: 'feat_whatsapp', name: 'WhatsApp Integration', starter: false, growth: true, scale: true, overrides: '0 tenants' },
    { key: 'feat_ai_copilot', name: 'AI Copilot / Insights', starter: false, growth: false, scale: true, overrides: '1 tenant (pilot)' },
  ];

  const columns = [
    { header: 'Feature Flag', accessorKey: 'key', cell: (f: any) => <span className="font-mono text-12">{f.key}</span> },
    { header: 'Nome', accessorKey: 'name', cell: (f: any) => <span className="text-13 font-medium">{f.name}</span> },
    { header: 'Starter', accessorKey: 'starter', cell: (f: any) => f.starter ? <span className="text-verified">✓</span> : <span className="text-stone">-</span> },
    { header: 'Growth', accessorKey: 'growth', cell: (f: any) => f.growth ? <span className="text-verified">✓</span> : <span className="text-stone">-</span> },
    { header: 'Scale', accessorKey: 'scale', cell: (f: any) => f.scale ? <span className="text-verified">✓</span> : <span className="text-stone">-</span> },
    { header: 'Overrides', accessorKey: 'overrides', cell: (f: any) => <span className="text-13 text-proof-blue">{f.overrides}</span> },
  ];

  return (
    <PlatformShell breadcrumb={[{ label: 'Entitlements' }]}>
      <div className="max-w-7xl mx-auto space-y-6">
        <PlatformPageHeader
          kicker="Platform · Entitlements"
          title="Feature Entitlements"
          description="Controle de acesso a features por plano e overrides por tenant."
        />

        <DataTable data={flags} columns={columns} />
      </div>
    </PlatformShell>
  );
}