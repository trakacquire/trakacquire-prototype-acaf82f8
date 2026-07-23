import React from 'react';
import { Link } from 'wouter';
import { AppShell } from '@/components/layout/AppShell';
import { StatusChip } from '@/components/domain/StatusChip';
import { db } from '@/lib/fake/db';

export default function MediaPage() {
  const campaigns = db.campaigns;
  const links = db.links;

  const srcBadgeClass = (src: string) => {
    switch (src) {
      case 'meta': return 'bg-proof-blue/10 text-proof-blue border border-proof-blue/20';
      case 'tiktok': return 'bg-warning/10 text-warning border border-warning/20';
      default: return 'bg-zinc text-stone border border-line';
    }
  };

  return (
    <AppShell breadcrumb={[{ label: 'Media' }]}>
      <div className="max-w-7xl mx-auto space-y-8">

        <div className="flex justify-between items-center">
          <h1 className="text-24 font-bold text-eggshell">Media Console</h1>
          <button className="bg-eggshell text-ink px-4 py-2 rounded-md font-medium text-14 hover:bg-white transition-colors">
            Gerenciar Conexões
          </button>
        </div>

        {/* Campaign Cards */}
        <div>
          <h2 className="text-16 font-semibold text-eggshell mb-4">Campanhas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {campaigns.map(camp => {
              const ftds = db.persons.filter(p => p.campaign_id === camp.id && p.ftd_at).length;
              return (
                <div key={camp.id} className="bg-graphite border border-line rounded-xl p-5 flex flex-col gap-3 hover:border-stone transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-14 font-semibold text-eggshell leading-tight">{camp.name}</h3>
                    <StatusChip status={camp.status === 'active' ? 'Confirmed' : 'Captured'} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-11 font-medium ${srcBadgeClass(camp.source)}`}>{camp.source}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="text-11 text-stone uppercase mb-1">Budget/dia</div>
                      <div className="font-mono text-13 text-eggshell">R$ {camp.budget_daily}</div>
                    </div>
                    <div>
                      <div className="text-11 text-stone uppercase mb-1">AdSets</div>
                      <div className="font-mono text-13 text-eggshell">{camp.adsets.length}</div>
                    </div>
                    <div>
                      <div className="text-11 text-stone uppercase mb-1">Ads</div>
                      <div className="font-mono text-13 text-eggshell">{camp.ads.length}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-line pt-3">
                    <div>
                      <div className="text-11 text-stone uppercase">FTDs atribuídos</div>
                      <div className="font-mono text-16 font-bold text-verified">{ftds}</div>
                    </div>
                    <Link href={`/media/${camp.id}`}>
                      <a className="text-proof-blue text-13 font-medium hover:underline">Ver detalhes →</a>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tracking Links */}
        <div>
          <h2 className="text-16 font-semibold text-eggshell mb-4">Links de Rastreamento</h2>
          <div className="bg-graphite border border-line rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-line bg-iron">
                  <tr>
                    <th className="px-4 py-3 text-12 font-bold text-stone uppercase">Nome</th>
                    <th className="px-4 py-3 text-12 font-bold text-stone uppercase">URL</th>
                    <th className="px-4 py-3 text-12 font-bold text-stone uppercase text-right">Cliques</th>
                    <th className="px-4 py-3 text-12 font-bold text-stone uppercase text-right">Registros</th>
                    <th className="px-4 py-3 text-12 font-bold text-stone uppercase text-right">FTDs</th>
                    <th className="px-4 py-3 text-12 font-bold text-stone uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {links.map(lnk => (
                    <tr key={lnk.id} className="hover:bg-zinc transition-colors">
                      <td className="px-4 py-3 text-13 text-eggshell">{lnk.name}</td>
                      <td className="px-4 py-3 font-mono text-12 text-stone">{lnk.url}</td>
                      <td className="px-4 py-3 font-mono text-13 text-stone text-right">{lnk.clicks.toLocaleString('pt-BR')}</td>
                      <td className="px-4 py-3 font-mono text-13 text-stone text-right">{lnk.registrations}</td>
                      <td className="px-4 py-3 font-mono text-13 text-verified text-right">{lnk.ftds}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-11 font-medium ${lnk.status === 'active' ? 'bg-verified/10 text-verified border border-verified/20' : lnk.status === 'paused' ? 'bg-warning/10 text-warning border border-warning/20' : 'bg-zinc text-stone border border-line'}`}>
                          {lnk.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </AppShell>
  );
}
