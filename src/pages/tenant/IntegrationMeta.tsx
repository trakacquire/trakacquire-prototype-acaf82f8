import React from 'react';
import { AppShell } from '@/components/layout/AppShell';

export default function IntegrationMetaPage() {
  return (
    <AppShell breadcrumb={[{ label: 'Integrations', href: '/integrations' }, { label: 'Meta Ads' }]}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-graphite border border-line rounded-xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-zinc flex items-center justify-center text-2xl border border-line font-bold text-proof-blue">M</div>
          <div>
            <h1 className="text-24 font-bold text-eggshell">Meta Ads (Pixel + CAPI)</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="bg-verified/10 text-verified border border-verified/20 px-2 py-0.5 rounded text-11 uppercase font-bold">Production</span>
            </div>
          </div>
        </div>

        <div className="bg-graphite border border-line rounded-xl p-6 text-stone text-14">
          Conteúdo Meta Integration (Tabs: Visão · Setup · Eventos · Saúde). Setup mostra status do Business Manager, Pixel e Token CAPI.
        </div>
      </div>
    </AppShell>
  );
}