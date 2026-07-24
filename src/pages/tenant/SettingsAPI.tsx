import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PreviewBadge } from '@/components/data/PreviewBadge';
import { DataTable } from '@/components/data/DataTable';
import { FreshnessTag } from '@/components/data/FreshnessTag';

const apiKeys = [
  { name: 'Chave de Produção', prefix: 'sk_live_9F4a', createdAt: '2026-01-15', lastUsed: '2m atrás', scopes: ['read:events', 'write:events'] },
  { name: 'Chave de Ingest (TAP)', prefix: 'sk_live_2C7b', createdAt: '2026-03-02', lastUsed: '5s atrás', scopes: ['write:events'] },
  { name: 'Chave de Reporting', prefix: 'sk_live_A81d', createdAt: '2026-05-10', lastUsed: '1h atrás', scopes: ['read:reports'] },
];

const webhooks = [
  { url: 'https://ops.trakacquire.com/hook/postback', event: 'event.first_deposit', state: 'Ativo', last: '200 · 45ms' },
  { url: 'https://ops.trakacquire.com/hook/reconc', event: 'reconciliation.mismatch', state: 'Ativo', last: '200 · 78ms' },
  { url: 'https://legacy.example.com/hook', event: 'identity.merged', state: 'Falhando', last: '502 · 3.1s' },
];

export default function SettingsAPIPage() {
  const [reveal, setReveal] = useState<string | null>(null);

  return (
    <AppShell breadcrumb={[{ label: 'Configurações' }, { label: 'Chaves de API' }]}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <div className="text-11 font-serif italic text-stone mb-1">Integração · Credenciais</div>
          <div className="flex items-center gap-3">
            <h1 className="text-24 font-bold text-eggshell">Chaves de API & Webhooks</h1>
            <PreviewBadge />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-end mb-3">
            <h2 className="text-16 font-medium text-eggshell">Chaves de API</h2>
            <button className="bg-eggshell text-ink px-3 py-1.5 rounded-md font-medium text-13 hover:bg-white transition-colors">
              Nova chave
            </button>
          </div>
          <DataTable
            data={apiKeys}
            columns={[
              { header: 'Nome', accessorKey: 'name', cell: (r: any) => <span className="text-14 text-eggshell">{r.name}</span> },
              {
                header: 'Chave', accessorKey: 'prefix',
                cell: (r: any) => (
                  <div className="flex items-center gap-2">
                    <code className="font-mono text-12 text-stone">
                      {reveal === r.prefix ? `${r.prefix}_x9K4mB2pQ7` : `${r.prefix}_••••••••••`}
                    </code>
                    <button
                      onClick={() => setReveal(reveal === r.prefix ? null : r.prefix)}
                      className="text-11 text-proof-blue hover:underline"
                    >
                      {reveal === r.prefix ? 'Ocultar' : 'Revelar'}
                    </button>
                  </div>
                )
              },
              { header: 'Escopos', accessorKey: 'scopes', cell: (r: any) => (
                <div className="flex gap-1 flex-wrap">
                  {r.scopes.map((s: string) => (
                    <span key={s} className="font-mono text-11 px-2 py-0.5 bg-zinc rounded text-stone">{s}</span>
                  ))}
                </div>
              ) },
              { header: 'Criada em', accessorKey: 'createdAt', cell: (r: any) => <span className="font-mono text-12 text-stone">{r.createdAt}</span> },
              { header: 'Último uso', accessorKey: 'lastUsed', cell: (r: any) => <span className="text-12 text-stone">{r.lastUsed}</span> },
            ]}
          />
        </div>

        <div>
          <div className="flex justify-between items-end mb-3">
            <div>
              <h2 className="text-16 font-medium text-eggshell">Webhooks</h2>
              <div className="text-11 text-stone flex items-center gap-2 mt-1">
                Entrega monitorada · <FreshnessTag ageSeconds={60 * 3} />
              </div>
            </div>
            <button className="bg-zinc border border-line text-eggshell px-3 py-1.5 rounded-md font-medium text-13 hover:bg-iron transition-colors">
              Novo endpoint
            </button>
          </div>
          <DataTable
            data={webhooks}
            columns={[
              { header: 'Endpoint', accessorKey: 'url', cell: (r: any) => <code className="font-mono text-12 text-eggshell">{r.url}</code> },
              { header: 'Evento', accessorKey: 'event', cell: (r: any) => <span className="font-mono text-12 text-stone">{r.event}</span> },
              {
                header: 'Estado', accessorKey: 'state',
                cell: (r: any) => (
                  <span className={`px-2 py-0.5 rounded text-11 font-bold uppercase ${r.state === 'Ativo' ? 'bg-verified/10 text-verified' : 'bg-critical/10 text-critical'}`}>
                    {r.state}
                  </span>
                )
              },
              { header: 'Última entrega', accessorKey: 'last', cell: (r: any) => <span className="font-mono text-12 text-stone">{r.last}</span> },
            ]}
          />
        </div>
      </div>
    </AppShell>
  );
}
