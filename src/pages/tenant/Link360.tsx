import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { links } from '@/lib/fake/extra';

export default function Link360Page({ params }: { params: { id: string } }) {
  const link = links.find(l => l.id === params.id) || links[0];

  return (
    <AppShell breadcrumb={[{ label: 'Tracking', href: '/tracking' }, { label: link.name }]}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-graphite border border-line rounded-xl p-6 flex justify-between items-start">
          <div>
            <h1 className="text-24 font-bold text-eggshell mb-1">{link.name}</h1>
            <div className="text-13 text-stone font-mono">https://{link.domain}/go/abc123xyz</div>
          </div>
          <button className="bg-zinc border border-line text-eggshell px-3 py-1.5 rounded text-13 hover:bg-line">
            Copiar URL
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-graphite border border-line rounded-xl p-6">
            <h2 className="text-18 font-medium text-eggshell mb-4">Destino & Split A/B</h2>
            <div className="space-y-3 text-14 text-eggshell">
              <div className="flex justify-between p-2 bg-iron border border-line rounded">
                <span>Variante A (Default)</span>
                <span className="font-mono text-proof-blue">60%</span>
              </div>
              <div className="flex justify-between p-2 bg-iron border border-line rounded">
                <span>Variante B (Teste)</span>
                <span className="font-mono text-proof-blue">40%</span>
              </div>
            </div>
          </div>
          <div className="bg-graphite border border-line rounded-xl p-6 flex flex-col items-center justify-center">
            <div className="w-32 h-32 bg-white flex items-center justify-center mb-4">
              {/* Fake QR */}
              <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBkPSJNMCAwaDEwMHYxMDBIMHoiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNMTAgMTBoMzB2MzBIMTB6bTUwIDBoMzB2MzBoLTMwek0xMCA2MGgzMHYzMEgxMHptNTAgMGgzMHYzMGgtMzB6IiBmaWxsPSIjMDAwIi8+PC9zdmc+')] bg-cover"></div>
            </div>
            <button className="text-proof-blue text-13 hover:underline">Baixar QR Code</button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}