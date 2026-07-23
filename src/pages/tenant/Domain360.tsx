import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { domains } from '@/lib/fake/extra';

export default function Domain360Page({ params }: { params: { id: string } }) {
  const domain = domains.find(d => d.id === params.id) || domains[0];

  return (
    <AppShell breadcrumb={[{ label: 'Domains', href: '/domains' }, { label: domain.name }]}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-graphite border border-line rounded-xl p-6 flex justify-between items-center">
          <div>
            <h1 className="text-24 font-bold text-eggshell">{domain.name}</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-13 text-stone">{domain.role}</span>
            </div>
          </div>
        </div>

        <div className="border-b border-line flex gap-6 px-2 overflow-x-auto">
          {['DNS Records', 'SSL', 'Roteamento', 'Health', 'Histórico'].map((tab, i) => (
            <button key={tab} className={`pb-3 text-14 font-medium whitespace-nowrap transition-colors border-b-2 ${i === 0 ? 'text-eggshell border-proof-blue' : 'text-stone border-transparent hover:text-eggshell'}`}>
              {tab}
            </button>
          ))}
        </div>

        <div className="bg-graphite border border-line rounded-xl p-6">
          <h2 className="text-18 font-medium text-eggshell mb-4">DNS Configuration</h2>
          <div className="bg-iron border border-line rounded-lg p-4 font-mono text-13 text-stone mb-4">
            CNAME | {domain.name} | proxy.trakacquire.io
          </div>
          <div className="text-14 text-verified font-medium">✓ Propagação concluída (última checagem {domain.last_check})</div>
        </div>
      </div>
    </AppShell>
  );
}