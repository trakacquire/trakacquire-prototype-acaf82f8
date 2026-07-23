import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { StatusChip } from '@/components/domain/StatusChip';
import { db } from '@/lib/fake/db';

function relativeTime(isoStr?: string): string {
  if (!isoStr) return '—';
  const diff = new Date('2026-07-23T12:00:00Z').getTime() - new Date(isoStr).getTime();
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor(diff / 3_600_000);
  if (days >= 1) return `há ${days}d`;
  if (hours >= 1) return `há ${hours}h`;
  return 'agora';
}

export default function BroadcastsPage() {
  const broadcasts = db.broadcasts;

  const channelBadgeClass = (ch: string) => {
    return ch === 'telegram'
      ? 'bg-proof-blue/10 text-proof-blue border border-proof-blue/20'
      : 'bg-verified/10 text-verified border border-verified/20';
  };

  // Map broadcast status to EventStatus for StatusChip
  const statusMap: Record<string, any> = {
    sent: 'Reconciled',
    sending: 'Confirmed',
    scheduled: 'Linked',
    draft: 'Captured',
  };

  return (
    <AppShell breadcrumb={[{ label: 'Broadcasts' }]}>
      <div className="max-w-7xl mx-auto space-y-6">

        <div className="flex justify-between items-end">
          <h1 className="text-24 font-bold text-eggshell">Broadcasts</h1>
          <button className="bg-eggshell text-ink px-4 py-2 rounded-md font-medium text-14 hover:bg-white transition-colors">
            Criar Broadcast
          </button>
        </div>

        <div className="bg-graphite border border-line rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-line bg-iron">
                <tr>
                  <th className="px-4 py-3 text-12 font-bold text-stone uppercase">Nome</th>
                  <th className="px-4 py-3 text-12 font-bold text-stone uppercase">Canal</th>
                  <th className="px-4 py-3 text-12 font-bold text-stone uppercase">Segmento</th>
                  <th className="px-4 py-3 text-12 font-bold text-stone uppercase text-right">Enviados</th>
                  <th className="px-4 py-3 text-12 font-bold text-stone uppercase text-right">Entrega</th>
                  <th className="px-4 py-3 text-12 font-bold text-stone uppercase text-right">Leitura</th>
                  <th className="px-4 py-3 text-12 font-bold text-stone uppercase text-right">FTDs</th>
                  <th className="px-4 py-3 text-12 font-bold text-stone uppercase">Status</th>
                  <th className="px-4 py-3 text-12 font-bold text-stone uppercase">Enviado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {broadcasts.map(b => {
                  const deliveredRate = b.sent > 0 ? (b.delivered / b.sent * 100).toFixed(1) + '%' : '—';
                  const readRate = b.sent > 0 ? (b.read / b.sent * 100).toFixed(1) + '%' : '—';
                  return (
                    <tr key={b.id} className="hover:bg-zinc transition-colors">
                      <td className="px-4 py-3 text-14 font-medium text-eggshell">{b.name}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-11 font-medium ${channelBadgeClass(b.channel)}`}>{b.channel}</span>
                      </td>
                      <td className="px-4 py-3 text-13 text-stone">{b.segment_name}</td>
                      <td className="px-4 py-3 font-mono text-13 text-eggshell text-right">{b.sent.toLocaleString('pt-BR')}</td>
                      <td className="px-4 py-3 font-mono text-13 text-stone text-right">{deliveredRate}</td>
                      <td className="px-4 py-3 font-mono text-13 text-stone text-right">{readRate}</td>
                      <td className="px-4 py-3 font-mono text-13 text-verified text-right">{b.ftds_generated}</td>
                      <td className="px-4 py-3"><StatusChip status={statusMap[b.status]} /></td>
                      <td className="px-4 py-3 font-mono text-12 text-stone">{relativeTime(b.sent_at ?? b.scheduled_at)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AppShell>
  );
}
