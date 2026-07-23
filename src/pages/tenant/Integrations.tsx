import React from 'react';
import { useLocation } from 'wouter';
import { AppShell } from '@/components/layout/AppShell';
import { db } from '@/lib/fake/db';
import { StatusChip } from '@/components/domain/StatusChip';

const fmtDate = (iso: string | undefined) =>
  iso ? new Date(iso).toLocaleDateString('pt-BR') : '—';

export default function IntegrationsPage() {
  const [, navigate] = useLocation();

  const integrationCards = [
    // Provedores de Receita
    {
      id: 'tap',
      name: 'TAP',
      category: 'Provedor de Receita',
      status: 'Confirmed',
      version: 'v2.1',
      lastEvent: db.events.filter(e => e.type === 'ftd').slice(-1)[0]?.timestamp,
    },
    {
      id: 'betano',
      name: 'Betano',
      category: 'Provedor de Receita',
      status: 'Pending',
      version: 'v1.0',
      lastEvent: undefined,
    },
    // Aquisição
    {
      id: 'meta',
      name: 'Meta CAPI',
      category: 'Aquisição',
      status: 'Confirmed',
      version: 'v17.0',
      lastEvent: db.events.filter(e => e.type === 'capi').slice(-1)[0]?.timestamp,
    },
    {
      id: 'tiktok',
      name: 'TikTok Events',
      category: 'Aquisição',
      status: 'Confirmed',
      version: 'v1.3',
      lastEvent: db.events.filter(e => e.type === 'click').slice(-1)[0]?.timestamp,
    },
    // Mensageria
    {
      id: 'telegram',
      name: 'Telegram Bot',
      category: 'Mensageria',
      status: 'Confirmed',
      version: 'v6.0',
      lastEvent: db.events.filter(e => e.type === 'bot_message').slice(-1)[0]?.timestamp,
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Cloud',
      category: 'Mensageria',
      status: 'Pending',
      version: 'v18.0',
      lastEvent: undefined,
    },
  ];

  const categoryOrder = ['Provedor de Receita', 'Aquisição', 'Mensageria'];
  const grouped = categoryOrder.map(cat => ({
    cat,
    items: integrationCards.filter(c => c.category === cat),
  }));

  return (
    <AppShell breadcrumb={[{ label: 'Integrações' }]}>
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-24 font-bold text-[var(--eggshell)] mb-2">Hub de Integrações</h1>
          <p className="text-14 text-[var(--stone)]">
            Conecte fontes de aquisição, canais de mensagem e provedores de receita.
          </p>
        </div>

        <div className="space-y-8">
          {grouped.map(({ cat, items }) => (
            <div key={cat}>
              <h2 className="text-16 font-semibold text-[var(--eggshell)] mb-4 border-b border-[var(--line)] pb-2">
                {cat}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map(item => (
                  <div
                    key={item.id}
                    onClick={() => navigate(`/integrations/${item.id}`)}
                    className="bg-[var(--graphite)] border border-[var(--line)] rounded-xl p-5 hover:border-[var(--stone)] transition-colors cursor-pointer group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="text-15 font-semibold text-[var(--eggshell)] group-hover:text-[var(--proof-blue)] transition-colors">
                          {item.name}
                        </div>
                        <div className="text-12 text-[var(--stone)] mt-0.5">{item.category}</div>
                      </div>
                      <StatusChip status={item.status as any} />
                    </div>
                    <div className="flex justify-between text-12 text-[var(--stone)] mt-4 pt-3 border-t border-[var(--line)]">
                      <span className="font-mono">Versão: {item.version}</span>
                      <span>
                        {item.lastEvent
                          ? `Último evento: ${fmtDate(item.lastEvent)}`
                          : 'Sem eventos'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
