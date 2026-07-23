import React from 'react';
import { PlatformShell } from '@/components/layout/PlatformShell';

export default function PlatformAnnouncementsPage() {
  return (
    <PlatformShell breadcrumb={[{ label: 'Announcements' }]}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-end">
          <h1 className="text-24 font-bold text-eggshell">Avisos In-App</h1>
          <button className="bg-eggshell text-ink px-4 py-2 rounded-md font-medium text-14 hover:bg-white transition-colors">
            Novo Aviso
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="bg-graphite border border-line rounded-xl p-4 flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-verified/10 text-verified px-2 py-0.5 rounded text-11 uppercase font-bold">Publicado</span>
                <span className="text-16 font-medium text-eggshell">Nova feature: automação visual liberada!</span>
              </div>
              <p className="text-13 text-stone">Exibido para tenants do plano Growth e Scale.</p>
            </div>
            <button className="text-stone hover:text-eggshell text-14">Recolher</button>
          </div>
        </div>
      </div>
    </PlatformShell>
  );
}