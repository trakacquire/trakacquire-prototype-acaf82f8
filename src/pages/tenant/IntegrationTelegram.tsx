import React from 'react';
import { AppShell } from '@/components/layout/AppShell';

export default function IntegrationTelegramPage() {
  return (
    <AppShell breadcrumb={[{ label: 'Integrations', href: '/integrations' }, { label: 'Telegram' }]}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-graphite border border-line rounded-xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-zinc flex items-center justify-center text-2xl border border-line text-proof-blue">✈️</div>
          <div>
            <h1 className="text-24 font-bold text-eggshell">Telegram Gateway</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="bg-verified/10 text-verified border border-verified/20 px-2 py-0.5 rounded text-11 uppercase font-bold">Production</span>
            </div>
          </div>
        </div>

        <div className="bg-graphite border border-line rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-iron border-b border-line">
              <tr>
                <th className="px-4 py-3 text-11 font-bold text-stone uppercase">Bot Name</th>
                <th className="px-4 py-3 text-11 font-bold text-stone uppercase">Status</th>
                <th className="px-4 py-3 text-11 font-bold text-stone uppercase">Usuários</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              <tr className="bg-graphite">
                <td className="px-4 py-3 text-14 text-eggshell">@operacaobot</td>
                <td className="px-4 py-3 text-13 text-verified">Ativo</td>
                <td className="px-4 py-3 font-mono text-13">847</td>
              </tr>
              <tr className="bg-graphite">
                <td className="px-4 py-3 text-14 text-eggshell">@testemxbot</td>
                <td className="px-4 py-3 text-13 text-warning">Sandbox</td>
                <td className="px-4 py-3 font-mono text-13">23</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}