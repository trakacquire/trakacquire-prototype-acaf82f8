import React from 'react';
import { PlatformShell } from '@/components/layout/PlatformShell';
import { PlatformPageHeader } from '@/components/layout/PlatformPageHeader';
import { db } from '@/lib/fake/db';
import { StatusChip } from '@/components/domain/StatusChip';
import type { EventStatus } from '@/lib/types';

export default function PlatformAPIsPage() {
  const apis = [
    { id: 'meta',      name: 'Meta Graph API',      version: 'v17.0', status: 'Ativo',    deprecated: null,         events: db.events.filter(e => e.type === 'capi').length },
    { id: 'tap',       name: 'TAP Webhook',          version: 'v2.1',  status: 'Ativo',    deprecated: null,         events: db.events.filter(e => e.type === 'postback').length },
    { id: 'telegram',  name: 'Telegram Bot API',     version: 'v6.0',  status: 'Ativo',    deprecated: null,         events: db.events.filter(e => e.type === 'bot_message').length },
    { id: 'whatsapp',  name: 'WhatsApp Cloud API',   version: 'v18.0', status: 'Pendente', deprecated: null,         events: 0 },
  ];

  const totalEvents = db.events.length;

  function fmtNum(n: number) {
    return n.toLocaleString('pt-BR');
  }

  return (
    <PlatformShell breadcrumb={[{ label: 'Regist<PlatformPageHeader kicker="Platform · API Surface" title="Registro de APIs" />        <h1 className="text-24 font-bold text-eggshell">Registro de APIs</h1>

        {/* Stat card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-graphite border border-line rounded-xl p-5">
            <div className="text-11 font-mono text-stone uppercase mb-1">Total de Eventos via APIs</div>
            <div className="text-22 font-mono text-eggshell">{fmtNum(totalEvents)}</div>
          </div>
          <div className="bg-graphite border border-line rounded-xl p-5">
            <div className="text-11 font-mono text-stone uppercase mb-1">APIs Ativas</div>
            <div className="text-22 font-mono text-eggshell">{apis.filter(a => a.status === 'Ativo').length}</div>
          </div>
          <div className="bg-graphite border border-line rounded-xl p-5">
            <div className="text-11 font-mono text-stone uppercase mb-1">Integrações Registradas</div>
            <div className="text-22 font-mono text-eggshell">{apis.length}</div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-graphite border border-line rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-13">
              <thead>
                <tr className="border-b border-line">
                  <th className="text-left text-11 text-stone font-medium px-4 py-3 uppercase">API</th>
                  <th className="text-left text-11 text-stone font-medium px-4 py-3 uppercase">Versão</th>
                  <th className="text-left text-11 text-stone font-medium px-4 py-3 uppercase">Status</th>
                  <th className="text-right text-11 text-stone font-medium px-4 py-3 uppercase">Eventos</th>
                  <th className="text-left text-11 text-stone font-medium px-4 py-3 uppercase">Depreciação</th>
                </tr>
              </thead>
              <tbody>
                {apis.map(api => (
                  <tr key={api.id} className="border-b border-line/50 last:border-0 hover:bg-iron transition-colors">
                    <td className="px-4 py-3">
                      <span className="text-14 font-semibold text-eggshell">{api.name}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-12 px-2 py-0.5 bg-zinc border border-line rounded text-stone">
                        {api.version}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusChip status={(api.status === 'Ativo' ? 'Confirmed' : 'Divergent') as EventStatus} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-mono text-12 text-eggshell">{fmtNum(api.events)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-12 text-stone">
                        {api.deprecated ? new Date(api.deprecated).toLocaleDateString('pt-BR') : '—'}
                      </span>
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
