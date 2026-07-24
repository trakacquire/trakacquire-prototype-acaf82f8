import React from 'react';
import { PlatformShell } from '@/components/layout/PlatformShell';
import { PlatformPageHeader } from '@/components/layout/PlatformPageHeader';
import { AlertTriangle } from 'lucide-react';

export default function PlatformIncidentsPage() {
  return (
    <PlatformShell breadcrumb={[{ label: 'Incidents' }]}>
      <div className="max-w-7xl mx-auto space-y-6">
        <PlatformPageHeader
          kicker="Platform · Reliability"
          title="Incidentes"
          actions={
            <button className="bg-critical text-ink px-4 py-2 rounded-md font-medium text-14 hover:bg-critical/80 transition-colors">
              Declarar Incidente
            </button>
          }
        />

        <div className="bg-graphite border border-warning/50 rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-warning"></div>
          <div className="flex gap-4">
            <AlertTriangle className="w-6 h-6 text-warning shrink-0" />
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-18 font-bold text-eggshell">Meta CAPI Degradado (Rate Limits)</span>
                <span className="bg-warning/20 text-warning px-2 py-0.5 rounded text-11 uppercase font-bold">P2</span>
              </div>
              <p className="text-14 text-stone mb-4">Aberto há <span className="font-mono">47 min</span>. 3 tenants impactados. Eventos em fila de retry segura.</p>
              <div className="flex gap-2">
                <button className="bg-zinc text-eggshell border border-line px-3 py-1.5 rounded text-12 font-medium hover:bg-line">Atualizar Status</button>
                <button className="bg-zinc text-eggshell border border-line px-3 py-1.5 rounded text-12 font-medium hover:bg-line">Post-mortem</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PlatformShell>
  );
}
