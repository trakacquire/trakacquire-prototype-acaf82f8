import React from 'react';
import { PlatformShell } from '@/components/layout/PlatformShell';
import { PlatformPageHeader } from '@/components/layout/PlatformPageHeader';

export default function PlatformAICostPage() {
  return (
    <PlatformShell breadcrumb={[{ label: 'AI Cost' }]}>
      <div className="max-w-7xl mx-auto space-y-6">
        <PlatformPageHeader kicker="Platform · AI Cost" title="AI Cost Monitoring" description="Custo agregado dos provedores de IA por tenant e cap global." />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-graphite border border-line rounded-xl p-6">
            <h2 className="text-14 font-medium text-stone mb-2">Custo Atual (Mês)</h2>
            <div className="text-32 font-bold font-mono text-eggshell mb-4">R$ 124,50</div>
            <div className="w-full bg-zinc h-2 rounded-full overflow-hidden">
              <div className="bg-proof-blue h-full" style={{ width: '25%' }}></div>
            </div>
            <div className="text-12 font-mono text-stone mt-2 text-right">Cap: R$ 500,00</div>
          </div>

          <div className="bg-graphite border border-line rounded-xl p-6 flex items-center justify-center text-stone text-14 italic">
            [Gráfico de barras de custo por tenant renderizado aqui]
          </div>
        </div>
      </div>
    </PlatformShell>
  );
}
