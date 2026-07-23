import React from 'react';
import { useLocation } from 'wouter';
import { AppShell } from '@/components/layout/AppShell';
import { StatusChip } from '@/components/domain/StatusChip';
import { db } from '@/lib/fake/db';

export default function IdentityPage() {
  const [, setLocation] = useLocation();

  const persons = db.persons.filter(p => p.registered_at);

  const methodBadgeClass = (method?: string) => {
    switch (method) {
      case 'fbclid': return 'bg-proof-blue/10 text-proof-blue border border-proof-blue/20';
      case 'telegram_start': return 'bg-verified/10 text-verified border border-verified/20';
      case 'fingerprint': return 'bg-warning/10 text-warning border border-warning/20';
      default: return 'bg-zinc text-stone border border-line';
    }
  };

  const confidenceBarColor = (v: number) => {
    if (v > 75) return 'bg-verified';
    if (v >= 50) return 'bg-warning';
    return 'bg-critical';
  };

  return (
    <AppShell breadcrumb={[{ label: 'Identity Graph' }]}>
      <div className="max-w-7xl mx-auto space-y-4">

        <div>
          <h1 className="text-24 font-bold text-eggshell mb-1">Identity Graph</h1>
          <p className="text-13 text-stone">{persons.length} identidades registradas</p>
        </div>

        <div className="bg-graphite border border-line rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-line bg-iron">
                <tr>
                  <th className="px-4 py-3 text-12 font-bold text-stone uppercase">ID</th>
                  <th className="px-4 py-3 text-12 font-bold text-stone uppercase">Nome</th>
                  <th className="px-4 py-3 text-12 font-bold text-stone uppercase text-center">Telegram</th>
                  <th className="px-4 py-3 text-12 font-bold text-stone uppercase text-center">Phone</th>
                  <th className="px-4 py-3 text-12 font-bold text-stone uppercase text-center">CustomerID</th>
                  <th className="px-4 py-3 text-12 font-bold text-stone uppercase">Confiança</th>
                  <th className="px-4 py-3 text-12 font-bold text-stone uppercase">Método</th>
                  <th className="px-4 py-3 text-12 font-bold text-stone uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {persons.map(p => (
                  <tr
                    key={p.id}
                    className="hover:bg-zinc transition-colors cursor-pointer"
                    onClick={() => setLocation(`/identity/${p.id}`)}
                  >
                    <td className="px-4 py-2 font-mono text-11 text-stone">{p.id}</td>
                    <td className="px-4 py-2 text-13 text-eggshell">{p.name}</td>
                    <td className="px-4 py-2 text-center">
                      {p.telegram_id ? <span className="text-verified font-bold">✓</span> : <span className="text-stone">✗</span>}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {p.phone_token ? <span className="text-verified font-bold">✓</span> : <span className="text-stone">✗</span>}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {p.customer_id ? <span className="text-verified font-bold">✓</span> : <span className="text-stone">✗</span>}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-zinc rounded overflow-hidden max-w-[80px]">
                          <div
                            className={`h-full rounded ${confidenceBarColor(p.identity_confidence)}`}
                            style={{ width: `${p.identity_confidence}%` }}
                          />
                        </div>
                        <span className="font-mono text-12 text-stone w-8 text-right">{p.identity_confidence}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-0.5 rounded text-11 font-medium ${methodBadgeClass(p.identity_method)}`}>
                        {p.identity_method ?? 'manual'}
                      </span>
                    </td>
                    <td className="px-4 py-2"><StatusChip status={p.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AppShell>
  );
}
