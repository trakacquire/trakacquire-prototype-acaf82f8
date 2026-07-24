import React from 'react';
import { PlatformShell } from '@/components/layout/PlatformShell';
import { PlatformPageHeader } from '@/components/layout/PlatformPageHeader';
import { Check } from 'lucide-react';

export default function PlatformPlansPage() {
  return (
    <PlatformShell breadcrumb={[{ label: 'Plans' }]}><PlatformPageHeader kicker="Platform · Billing" title="Plans & Pricing" />    <h1 className="text-24 font-bold text-eggshell mb-2">Plans & Pricing</h1>
          <p className="text-14 text-stone">Configuração dos pacotes oferecidos aos tenants.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-graphite border border-line rounded-xl p-6 flex flex-col">
            <h3 className="text-18 font-medium text-stone mb-2">Starter</h3>
            <div className="text-24 font-bold font-mono mb-4 text-eggshell">R$ 297/m</div>
            <div className="space-y-2 text-13 text-stone mb-6 flex-1">
              <div className="flex justify-between border-b border-line pb-1"><span>Quota Eventos</span><span className="font-mono text-eggshell">50k</span></div>
              <div className="flex justify-between border-b border-line pb-1"><span>Overage</span><span className="font-mono text-eggshell">R$ 10 / 10k</span></div>
              <div className="flex justify-between border-b border-line pb-1"><span>Workspaces</span><span className="font-mono text-eggshell">1</span></div>
            </div>
            <button className="w-full bg-zinc border border-line text-eggshell py-2 rounded-md hover:bg-line">Editar Plano</button>
          </div>

          <div className="bg-graphite border border-proof-blue/50 rounded-xl p-6 flex flex-col">
            <h3 className="text-18 font-medium text-proof-blue mb-2">Growth</h3>
            <div className="text-24 font-bold font-mono mb-4 text-eggshell">R$ 797/m</div>
            <div className="space-y-2 text-13 text-stone mb-6 flex-1">
              <div className="flex justify-between border-b border-line pb-1"><span>Quota Eventos</span><span className="font-mono text-eggshell">500k</span></div>
              <div className="flex justify-between border-b border-line pb-1"><span>Overage</span><span className="font-mono text-eggshell">R$ 8 / 10k</span></div>
              <div className="flex justify-between border-b border-line pb-1"><span>Workspaces</span><span className="font-mono text-eggshell">5</span></div>
            </div>
            <button className="w-full bg-zinc border border-line text-eggshell py-2 rounded-md hover:bg-line">Editar Plano</button>
          </div>

          <div className="bg-graphite border border-line rounded-xl p-6 flex flex-col">
            <h3 className="text-18 font-medium text-stone mb-2">Scale</h3>
            <div className="text-24 font-bold font-mono mb-4 text-eggshell">R$ 1.997/m</div>
            <div className="space-y-2 text-13 text-stone mb-6 flex-1">
              <div className="flex justify-between border-b border-line pb-1"><span>Quota Eventos</span><span className="font-mono text-eggshell">Ilimitado</span></div>
              <div className="flex justify-between border-b border-line pb-1"><span>Overage</span><span className="font-mono text-eggshell">-</span></div>
              <div className="flex justify-between border-b border-line pb-1"><span>Workspaces</span><span className="font-mono text-eggshell">Ilimitado</span></div>
            </div>
            <button className="w-full bg-zinc border border-line text-eggshell py-2 rounded-md hover:bg-line">Editar Plano</button>
          </div>
        </div>
      </div>
    </PlatformShell>
  );
}