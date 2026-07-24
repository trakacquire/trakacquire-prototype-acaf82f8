import React from 'react';
import { PlatformShell } from '@/components/layout/PlatformShell';
import { PlatformPageHeader } from '@/components/layout/PlatformPageHeader';

const prompts = [
  { id: 'p1', name: 'radar_analyzer',  version: 'v3', env: 'produção', author: 'sistema',               updated: '2026-07-20' },
  { id: 'p2', name: 'inbox_sentiment', version: 'v2', env: 'produção', author: 'sistema',               updated: '2026-07-15' },
  { id: 'p3', name: 'inbox_suggest',   version: 'v4', env: 'sandbox',  author: 'admin@trakacquire',     updated: '2026-07-22' },
  { id: 'p4', name: 'risk_analyzer',   version: 'v1', env: 'sandbox',  author: 'admin@trakacquire',     updated: '2026-07-18' },
  { id: 'p5', name: 'reply_generator', version: 'v2', env: 'produção', author: 'sistema',               updated: '2026-07-10' },
];

export default function PlatformAIPromptsPage() {
  return (
    <PlatformShell breadcrumb={[{ label: 'Registro de Prompts' }]}>
      <div className="max-w-7xl mx-auto space-y-6">
        <PlatformPageHeader kicker="Platform · AI Prompts" title="Registro de Prompts" />

        <div className="bg-graphite border border-line rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-13">
              <thead>
                <tr className="border-b border-line">
                  <th className="text-left text-11 text-stone font-medium px-4 py-3 uppercase">Nome</th>
                  <th className="text-left text-11 text-stone font-medium px-4 py-3 uppercase">Versão</th>
                  <th className="text-left text-11 text-stone font-medium px-4 py-3 uppercase">Ambiente</th>
                  <th className="text-left text-11 text-stone font-medium px-4 py-3 uppercase">Autor</th>
                  <th className="text-left text-11 text-stone font-medium px-4 py-3 uppercase">Atualizado</th>
                  <th className="text-left text-11 text-stone font-medium px-4 py-3 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody>
                {prompts.map(p => (
                  <tr key={p.id} className="border-b border-line/50 last:border-0 hover:bg-iron transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-mono text-13 text-eggshell">{p.name}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-12 px-2 py-0.5 bg-zinc border border-line rounded text-stone">
                        {p.version}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-12 px-2 py-0.5 rounded border font-medium ${
                        p.env === 'produção'
                          ? 'bg-verified/10 text-verified border-verified/20'
                          : 'bg-warning/10 text-warning border-warning/20'
                      }`}>
                        {p.env}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-12 font-mono text-stone">{p.author}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-12 text-stone">
                        {new Date(p.updated).toLocaleDateString('pt-BR')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <button className="text-12 text-proof-blue hover:underline">Editar</button>
                        <button className="text-12 text-stone hover:text-eggshell hover:underline transition-colors">Testar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PlatformShell>
  );
}
