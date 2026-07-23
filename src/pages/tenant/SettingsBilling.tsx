import React from 'react';
import { AppShell } from '@/components/layout/AppShell';

export default function SettingsBillingPage() {
  return (
    <AppShell breadcrumb={[{ label: 'Settings' }, { label: 'Billing' }]}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-end">
          <h1 className="text-24 font-bold text-eggshell">Billing & Usage</h1>
          <button className="bg-proof-blue text-ink px-4 py-2 rounded-md font-medium text-14 hover:opacity-90 transition-colors">
            Upgrade para Scale
          </button>
        </div>
        
        <div className="bg-graphite border border-line rounded-xl p-6">
          <h2 className="text-18 font-medium text-eggshell mb-4">Plano Atual: Growth (R$ 797/mês)</h2>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-13 mb-2">
                <span className="text-stone">Eventos Ingeridos</span>
                <span className="font-mono text-eggshell">127.450 / 500.000</span>
              </div>
              <div className="w-full bg-iron h-2 rounded-full overflow-hidden">
                <div className="bg-proof-blue h-full" style={{ width: '25.5%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}