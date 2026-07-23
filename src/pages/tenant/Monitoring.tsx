import React from 'react';
import { AppShell } from '@/components/layout/AppShell';

export default function MonitoringPage() {
  return (
    <AppShell breadcrumb={[{ label: 'Monitoramento' }]}>
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-24 font-bold text-eggshell mb-6">Monitoramento & DLQ</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-iron border border-verified/30 rounded-lg p-4">
            <div className="text-12 font-mono text-[var(--stone)] uppercase mb-2">API Core</div>
            <div className="text-18 font-mono text-verified font-bold">99.94%</div>
            <div className="text-11 text-[var(--stone)]">Meta: 99.9%</div>
          </div>
          <div className="bg-iron border border-verified/30 rounded-lg p-4">
            <div className="text-12 font-mono text-[var(--stone)] uppercase mb-2">Signal Ingest</div>
            <div className="text-18 font-mono text-verified font-bold">99.87%</div>
            <div className="text-11 text-[var(--stone)]">Meta: 99.5%</div>
          </div>
          <div className="bg-iron border border-warning/50 rounded-lg p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-warning"></div>
            <div className="text-12 font-mono text-[var(--stone)] uppercase mb-2">Meta CAPI</div>
            <div className="text-18 font-mono text-warning font-bold">97.20%</div>
            <div className="text-11 text-[var(--stone)]">Meta: 99.0%</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-graphite border border-line rounded-xl p-4">
            <div className="text-12 text-[var(--stone)] mb-1">Latência P95</div>
            <div className="text-20 font-mono text-eggshell font-bold">48ms</div>
            <div className="text-11 text-[var(--stone)]">Último: 1min atrás</div>
          </div>
          <div className="bg-graphite border border-line rounded-xl p-4">
            <div className="text-12 text-[var(--stone)] mb-1">Eventos (24h)</div>
            <div className="text-20 font-mono text-eggshell font-bold">14.820</div>
            <div className="text-11 text-verified">+12% vs ontem</div>
          </div>
          <div className="bg-graphite border border-line rounded-xl p-4">
            <div className="text-12 text-[var(--stone)] mb-1">Erros (24h)</div>
            <div className="text-20 font-mono text-warning font-bold">3</div>
            <div className="text-11 text-[var(--stone)]">2 na fila morta</div>
          </div>
        </div>

        <div className="bg-graphite border border-line rounded-xl p-6">
          <h2 className="text-18 font-medium text-eggshell mb-4">Fila de Mensagens Mortas (DLQ)</h2>
          <div className="text-14 text-[var(--stone)] bg-iron border border-line rounded p-4 text-center">
            3 mensagens mortas encontradas. Exibição da fila disponível aqui.
          </div>
        </div>
      </div>
    </AppShell>
  );
}
