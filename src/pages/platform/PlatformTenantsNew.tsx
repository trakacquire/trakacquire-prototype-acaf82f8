import React from 'react';
import { PlatformShell } from '@/components/layout/PlatformShell';
import { PlatformPageHeader } from '@/components/layout/PlatformPageHeader';
import { Check } from 'lucide-react';
import { useLocation } from 'wouter';

export default function PlatformTenantsNewPage() {
  const [, setLocation] = useLocation();

  return (
    <PlatformShell breadcrumb={[{ label: 'Tenants', href: '/platform/tenants' }, { label: 'Provisionar' }]}><PlatformPageHeader kicker="Platform · Provisioning" title="Provisionar Tenant" /> <h1 className="text-24 font-bold text-eggshell mb-2">Provisionar Tenant</h1>
          <p className="text-14 text-stone">Crie um novo ambiente isolado de workspace.</p>
        </div>

        <div className="flex items-center gap-4 mb-8 text-14 font-medium">
          <div className="flex items-center gap-2 text-eggshell">
            <div className="w-6 h-6 rounded-full bg-proof-blue text-ink flex items-center justify-center text-12"><Check className="w-3 h-3"/></div>
            Dados Básicos
          </div>
          <div className="w-12 h-px bg-line"></div>
          <div className="flex items-center gap-2 text-eggshell">
            <div className="w-6 h-6 rounded-full bg-zinc border border-line text-stone flex items-center justify-center text-12">2</div>
            Plano & Quotas
          </div>
          <div className="w-12 h-px bg-line"></div>
          <div className="flex items-center gap-2 text-stone">
            <div className="w-6 h-6 rounded-full bg-zinc border border-line text-stone flex items-center justify-center text-12">3</div>
            Owner
          </div>
        </div>

        <div className="bg-graphite border border-line rounded-xl p-6">
          <form className="space-y-6">
            <div>
              <label className="block text-12 font-medium text-stone mb-1.5">Nome do Tenant (Operação)</label>
              <input type="text" placeholder="Ex: BetMasters BR" className="w-full bg-zinc border border-line rounded-md px-3 py-2 text-14 text-eggshell focus:border-proof-blue outline-none" />
            </div>
            
            <div>
              <label className="block text-12 font-medium text-stone mb-1.5">Plano</label>
              <select className="w-full bg-zinc border border-line rounded-md px-3 py-2 text-14 text-eggshell focus:border-proof-blue outline-none">
                <option>Starter (R$ 297)</option>
                <option selected>Growth (R$ 797)</option>
                <option>Scale (R$ 1.997)</option>
              </select>
            </div>

            <div>
              <label className="block text-12 font-medium text-stone mb-1.5">Email do Owner (receberá o convite admin)</label>
              <input type="email" placeholder="ceo@betmasters.com" className="w-full bg-zinc border border-line rounded-md px-3 py-2 text-14 text-eggshell focus:border-proof-blue outline-none" />
            </div>

            <div>
              <label className="block text-12 font-medium text-stone mb-1.5">Seed Data (Opcional)</label>
              <select className="w-full bg-zinc border border-line rounded-md px-3 py-2 text-14 text-eggshell focus:border-proof-blue outline-none">
                <option>Workspace Limpo</option>
                <option>Mock Data V1 (Para demos)</option>
              </select>
            </div>

            <div className="flex justify-end pt-4 border-t border-line">
              <button type="button" onClick={() => setLocation('/platform/tenants')} className="bg-eggshell text-ink px-6 py-2 rounded-md font-medium text-14 hover:bg-white transition-colors">
                Criar e Enviar Convite
              </button>
            </div>
          </form>
        </div>
      </div>
    </PlatformShell>
  );
}