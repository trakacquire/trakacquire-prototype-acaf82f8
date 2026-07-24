import React from 'react';
import { PlatformShell } from '@/components/layout/PlatformShell';
import { PlatformPageHeader } from '@/components/layout/PlatformPageHeader';

export default function PlatformPlansPage() {
  return (
    <PlatformShell breadcrumb={[{ label: 'Plans' }]}>
      <div className="max-w-7xl mx-auto space-y-6">
        <PlatformPageHeader kicker="Platform · Billing" title="Plans & Pricing" description="Configuração dos pacotes oferecidos aos tenants." />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Starter', price: 'R$ 297/m', quota: '50k', overage: 'R$ 10 / 10k', ws: '1', accent: 'border-line', title: 'text-stone' },
            { name: 'Growth', price: 'R$ 797/m', quota: '500k', overage: 'R$ 8 / 10k', ws: '5', accent: 'border-proof-blue/50', title: 'text-proof-blue' },
            { name: 'Scale', price: 'R$ 1.997/m', quota: 'Ilimitado', overage: '-', ws: 'Ilimitado', accent: 'border-line', title: 'text-stone' },
          ].map(p => (
            <div key={p.name} className={`bg-graphite border ${p.accent} rounded-xl p-6 flex flex-col`}>
              <h3 className={`text-18 font-medium ${p.title} mb-2`}>{p.name}</h3>
              <div className="text-24 font-bold font-mono mb-4 text-eggshell">{p.price}</div>
              <div className="space-y-2 text-13 text-stone mb-6 flex-1">
                <div className="flex justify-between border-b border-line pb-1"><span>Quota Eventos</span><span className="font-mono text-eggshell">{p.quota}</span></div>
                <div className="flex justify-between border-b border-line pb-1"><span>Overage</span><span className="font-mono text-eggshell">{p.overage}</span></div>
                <div className="flex justify-between border-b border-line pb-1"><span>Workspaces</span><span className="font-mono text-eggshell">{p.ws}</span></div>
              </div>
              <button className="w-full bg-zinc border border-line text-eggshell py-2 rounded-md hover:bg-line">Editar Plano</button>
            </div>
          ))}
        </div>
      </div>
    </PlatformShell>
  );
}
