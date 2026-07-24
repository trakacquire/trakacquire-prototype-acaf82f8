import React, { useState } from 'react';
import { Link } from 'wouter';
import { AppShell } from '@/components/layout/AppShell';
import { PreviewBadge } from '@/components/data/PreviewBadge';
import { StatusChip } from '@/components/domain/StatusChip';
import { db } from '@/lib/fake/db';
import { ChevronRight } from 'lucide-react';

const LEDGER_TYPES = new Set(['register', 'ftd', 'deposit', 'withdrawal']);

export default function LedgerPage() {
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // JourneyStrip counts
  const statusLabels: { label: string; colorClass: string }[] = [
    { label: 'Captured', colorClass: 'text-proof-blue border-proof-blue/30 bg-proof-blue/10' },
    { label: 'Linked', colorClass: 'text-proof-blue border-proof-blue/30 bg-proof-blue/10' },
    { label: 'Confirmed', colorClass: 'text-eggshell border-line bg-zinc' },
    { label: 'Reconciled', colorClass: 'text-verified border-verified/30 bg-verified/10' },
    { label: 'Divergent', colorClass: 'text-warning border-warning/30 bg-warning/10' },
  ];
  const statusCounts: Record<string, number> = {};
  for (const p of db.persons) {
    statusCounts[p.status] = (statusCounts[p.status] ?? 0) + 1;
  }

  const ledgerTypes = ['all', 'register', 'ftd', 'deposit', 'withdrawal'];
  const statusOptions = ['all', 'Captured', 'Linked', 'Confirmed', 'Reconciled', 'Divergent', 'Failed', 'Orphan'];

  const filteredEvts = db.events
    .filter(e =>
      LEDGER_TYPES.has(e.type) &&
      (typeFilter === 'all' || e.type === typeFilter) &&
      (statusFilter === 'all' || e.status === statusFilter)
    )
    .slice(0, 200);

  const typeBadgeClass = (type: string) => {
    switch (type) {
      case 'ftd': return 'bg-verified/10 text-verified border border-verified/20';
      case 'deposit': return 'bg-proof-blue/10 text-proof-blue border border-proof-blue/20';
      case 'register': return 'bg-stone/10 text-stone border border-stone/20';
      case 'withdrawal': return 'bg-critical/10 text-critical border border-critical/20';
      default: return 'bg-zinc text-stone border border-line';
    }
  };

  return (
    <AppShell breadcrumb={[{ label: 'Ledger' }]}>
      <div className="max-w-7xl mx-auto space-y-4">

        <div>
          <div className="flex flex-wrap items-center gap-3"><h1 className="text-24 font-bold text-eggshell mb-2">Signal Ledger</h1><PreviewBadge /></div>
          <p className="text-14 text-stone">Registros financeiros: cadastros, FTDs, depósitos e saques.</p>
        </div>

        {/* JourneyStrip */}
        <div className="bg-graphite border border-line rounded-xl p-4 flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-0 w-full overflow-x-auto">
          {statusLabels.map((stage, idx) => (
            <React.Fragment key={stage.label}>
              <div className="flex flex-col flex-1 min-w-[120px] px-2 first:pl-0 last:pr-0">
                <div className="text-11 font-mono text-stone uppercase mb-1">{stage.label}</div>
                <div className={`px-3 py-2 rounded-lg border flex items-baseline justify-between ${stage.colorClass}`}>
                  <span className="text-18 font-mono font-bold tabular-nums">{statusCounts[stage.label] ?? 0}</span>
                </div>
              </div>
              {idx < statusLabels.length - 1 && (
                <div className="hidden md:flex items-center justify-center px-1 text-line">
                  <ChevronRight className="w-4 h-4" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-3 bg-graphite border border-line rounded-xl p-3">
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="bg-zinc border border-line text-eggshell rounded-md px-3 py-1.5 text-13 outline-none focus:border-proof-blue"
          >
            {ledgerTypes.map(t => <option key={t} value={t}>{t === 'all' ? 'Todos os tipos' : t}</option>)}
          </select>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-zinc border border-line text-eggshell rounded-md px-3 py-1.5 text-13 outline-none focus:border-proof-blue"
          >
            {statusOptions.map(s => <option key={s} value={s}>{s === 'all' ? 'Todos os status' : s}</option>)}
          </select>
          <span className="text-12 text-stone font-mono ml-auto">{filteredEvts.length} eventos</span>
        </div>

        {/* Table */}
        <div className="bg-graphite border border-line rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-line bg-iron">
                <tr>
                  <th className="px-4 py-3 text-12 font-bold text-stone uppercase">ID</th>
                  <th className="px-4 py-3 text-12 font-bold text-stone uppercase">Tipo</th>
                  <th className="px-4 py-3 text-12 font-bold text-stone uppercase">Pessoa</th>
                  <th className="px-4 py-3 text-12 font-bold text-stone uppercase">Status</th>
                  <th className="px-4 py-3 text-12 font-bold text-stone uppercase text-right">Valor</th>
                  <th className="px-4 py-3 text-12 font-bold text-stone uppercase text-right">Latência</th>
                  <th className="px-4 py-3 text-12 font-bold text-stone uppercase">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filteredEvts.map(evt => (
                  <tr key={evt.id} className="hover:bg-zinc transition-colors">
                    <td className="px-4 py-2 font-mono text-11 text-stone">{evt.id}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-0.5 rounded text-11 font-medium ${typeBadgeClass(evt.type)}`}>{evt.type}</span>
                    </td>
                    <td className="px-4 py-2">
                      <Link href={`/identity/${evt.person_id}`} className="font-mono text-12 text-proof-blue hover:underline">
                        {evt.person_id}
                      </Link>
                    </td>
                    <td className="px-4 py-2"><StatusChip status={evt.status} /></td>
                    <td className="px-4 py-2 font-mono text-13 text-right">
                      {evt.value != null ? `R$ ${evt.value.toLocaleString('pt-BR')}` : <span className="text-stone">—</span>}
                    </td>
                    <td className="px-4 py-2 font-mono text-12 text-stone text-right">{evt.latency_ms}ms</td>
                    <td className="px-4 py-2 font-mono text-12 text-stone">{evt.timestamp.slice(0, 19).replace('T', ' ')}</td>
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
