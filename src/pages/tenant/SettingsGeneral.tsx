import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PreviewBadge } from '@/components/data/PreviewBadge';
import { PhasePreviewBanner } from '@/components/state/PhasePreviewBanner';

export default function GeneralSettingsPage() {
  return (
    <AppShell breadcrumb={[{ label: 'Configurações' }, { label: 'Geral' }]}>
      <div className="max-w-3xl mx-auto space-y-6">
          <PhasePreviewBanner phase="P7" scope="Preferências, fuso, moeda, branding" />
        <div className="flex flex-wrap items-center gap-3"><h1 className="text-24 font-bold text-eggshell mb-6">Configurações Gerais</h1><PreviewBadge /></div>
        
        <div className="bg-graphite border border-line rounded-xl overflow-hidden">
          <div className="p-6 border-b border-line">
            <h2 className="text-18 font-medium text-eggshell mb-4">Informações do Workspace</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-12 font-medium text-stone mb-1.5">Nome da Operação</label>
                <input 
                  type="text" 
                  defaultValue="Operação Brasil"
                  className="w-full bg-zinc border border-line rounded-md px-3 py-2 text-14 text-eggshell focus:outline-none focus:border-proof-blue"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-12 font-medium text-stone mb-1.5">Fuso Horário</label>
                  <select className="w-full bg-zinc border border-line rounded-md px-3 py-2 text-14 text-eggshell focus:outline-none focus:border-proof-blue">
                    <option>America/Sao_Paulo (UTC-3)</option>
                    <option>Europe/London (UTC+1)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-12 font-medium text-stone mb-1.5">Moeda Principal</label>
                  <select className="w-full bg-zinc border border-line rounded-md px-3 py-2 text-14 text-eggshell focus:outline-none focus:border-proof-blue">
                    <option>BRL (R$)</option>
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-iron flex justify-end">
            <button className="bg-eggshell text-ink px-4 py-2 rounded-md font-medium text-14 hover:bg-white transition-colors">
              Salvar Alterações
            </button>
          </div>
        </div>

        <div className="bg-graphite border border-critical/30 rounded-xl overflow-hidden mt-8">
          <div className="p-6 border-b border-line">
            <h2 className="text-18 font-medium text-critical mb-2">Zona de Perigo</h2>
            <p className="text-14 text-stone mb-4">Ações destrutivas para este workspace. Não podem ser desfeitas.</p>
            <button className="bg-transparent border border-critical text-critical px-4 py-2 rounded-md font-medium text-14 hover:bg-critical/10 transition-colors">
              Apagar Workspace
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
