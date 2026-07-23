import React from 'react';
import { PlatformShell } from '@/components/layout/PlatformShell';

export default function PlatformStatusPage() {
  return (
    <PlatformShell breadcrumb={[{ label: 'Status Page Control' }]}>
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-24 font-bold text-eggshell mb-6">Status Page Control</h1>
        
        <div className="bg-graphite border border-line rounded-xl p-6">
          <h2 className="text-18 font-medium text-eggshell mb-4">Publicar Atualização Pública</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-12 font-medium text-stone mb-1.5">Título do Aviso</label>
              <input type="text" className="w-full bg-zinc border border-line rounded-md px-3 py-2 text-14 text-eggshell outline-none focus:border-proof-blue" />
            </div>
            <div>
              <label className="block text-12 font-medium text-stone mb-1.5">Mensagem</label>
              <textarea rows={4} className="w-full bg-zinc border border-line rounded-md px-3 py-2 text-14 text-eggshell outline-none focus:border-proof-blue"></textarea>
            </div>
            <button type="button" className="bg-eggshell text-ink px-4 py-2 rounded-md font-medium text-14">Publicar na Status Page</button>
          </form>
        </div>
      </div>
    </PlatformShell>
  );
}