import React from 'react';
import { AppShell } from '@/components/layout/AppShell';

export default function PlatformCommandPage() {
  return (
    <AppShell breadcrumb={[{ label: 'Platform Admin', href: '/platform' }, { label: 'Command' }]}>
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-24 font-bold text-eggshell mb-2">Platform Command</h1>
          <p className="text-14 text-stone">Visão global da infraestrutura SaaS.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-graphite border border-line rounded-xl p-4">
            <div className="text-12 font-mono text-stone uppercase mb-1">MRR</div>
            <div className="text-32 font-mono text-eggshell font-bold">R$ 18.640</div>
          </div>
          <div className="bg-graphite border border-line rounded-xl p-4">
            <div className="text-12 font-mono text-stone uppercase mb-1">Tenants Ativos</div>
            <div className="text-32 font-mono text-eggshell font-bold">4</div>
          </div>
          <div className="bg-graphite border border-critical/30 rounded-xl p-4">
            <div className="text-12 font-mono text-stone uppercase mb-1">Custo IA (Mês)</div>
            <div className="text-32 font-mono text-critical font-bold">R$ 124</div>
          </div>
          <div className="bg-graphite border border-line rounded-xl p-4">
            <div className="text-12 font-mono text-stone uppercase mb-1">Eventos / Dia</div>
            <div className="text-32 font-mono text-proof-blue font-bold">847k</div>
          </div>
        </div>

        <div className="bg-graphite border border-line rounded-xl p-6">
          <h2 className="text-18 font-medium text-eggshell mb-4">Saúde Global</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {['API Core', 'Signal Ingest', 'TAP Webhook', 'Telegram Gateway', 'Dashboard'].map(service => (
              <div key={service} className="flex items-center gap-3 p-3 bg-iron border border-verified/20 rounded-md">
                <span className="w-3 h-3 rounded-full bg-verified"></span>
                <span className="text-14 text-eggshell">{service}</span>
              </div>
            ))}
            <div className="flex items-center gap-3 p-3 bg-iron border border-warning/30 rounded-md">
              <span className="w-3 h-3 rounded-full bg-warning"></span>
              <span className="text-14 text-eggshell">Meta CAPI (Degradado)</span>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}