import React from 'react';
import { AppShell } from '@/components/layout/AppShell';

export default function SettingsAPIPage() {
  return (
    <AppShell breadcrumb={[{ label: 'Configurações' }, { label: 'Chaves de API' }]}>
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-24 font-bold text-eggshell mb-6">Chaves de API & Webhooks</h1>
        
        <div className="bg-graphite border border-line rounded-xl p-6">
          <h2 className="text-18 font-medium text-eggshell mb-4">Chaves de API</h2>
          <div className="bg-iron border border-line rounded p-4 flex justify-between items-center mb-4">
            <div>
              <div className="text-14 font-medium text-eggshell">Chave de Produção</div>
              <div className="text-12 text-stone font-mono">sk_live_••••••••••••••</div>
            </div>
            <button className="bg-zinc text-eggshell border border-line px-3 py-1.5 rounded text-12 hover:bg-line">Revelar</button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
