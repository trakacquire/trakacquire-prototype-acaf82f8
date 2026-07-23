import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { AppShell } from '@/components/layout/AppShell';
import { StatusChip } from '@/components/domain/StatusChip';
import { db } from '@/lib/fake/db';

export default function SignalsPage() {
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [live, setLive] = useState(false);
  const [liveIndicator, setLiveIndicator] = useState(false);

  useEffect(() => {
    if (!live) return;
    const interval = setInterval(() => {
      setLiveIndicator(v => !v);
    }, 4000);
    return () => clearInterval(interval);
  }, [live]);

  const eventTypes = ['all', 'click', 'register', 'ftd', 'deposit', 'withdrawal', 'postback', 'capi', 'webhook', 'bot_message', 'conversation_start'];
  const statusOptions = ['all', 'Captured', 'Linked', 'Confirmed', 'Reconciled', 'Divergent', 'Failed', 'Orphan', 'Synthetic'];

  const filteredEvts = db.events
    .filter(e => (typeFilter === 'all' || e.type === typeFilter) && (statusFilter === 'all' || e.status === statusFilter))
    .slice(0, 100);

  const typeBadgeClass = (type: string) => {
    switch (type) {
      case 'ftd': return 'bg-verified/10 text-verified border border-verified/20';
      case 'click': return 'bg-proof-blue/10 text-proof-blue border border-proof-blue/20';
      case 'register': return 'bg-stone/10 text-stone border border-stone/20';
      case 'deposit': return 'bg-warning/10 text-warning border border-warning/20';
      default: return 'bg-zinc text-stone border border-line';
    }
  };

  return (
    <AppShell breadcrumb={[{ label: 'Signals' }]}>
      <div className="max-w-7xl mx-auto space-y-4">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div>
            <h1 className="text-24 font-bold text-eggshell">Signal Ledger</h1>
            <p className="text-13 text-stone">Fluxo imutável de eventos e projeções.</p>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-13 text-stone">Live</span>
            <div className="relative">
              <input type="checkbox" className="sr-only" checked={live} onChange={e => setLive(e.target.checked)} />
              <div className={`block w-10 h-6 rounded-full transition-colors ${live ? 'bg-proof-blue' : 'bg-zinc border border-line'}`} />
              <div className={`dot absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${live ? 'translate-x-5' : 'translate-x-1'}`} />
            </div>
            {live && liveIndicator && <span className="w-2 h-2 rounded-full bg-verified animate-pulse" />}
          </label>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-3 bg-graphite border border-line rounded-xl p-3">
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="bg-zinc border border-line text-eggshell rounded-md px-3 py-1.5 text-13 outline-none focus:border-proof-blue"
          >
            {eventTypes.map(t => <option key={t} value={t}>{t === 'all' ? 'Todos os tipos' : t}</option>)}
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
                  <tr key={evt.id} className={`hover:bg-zinc transition-colors ${live ? 'animate-pulse-subtle' : ''}`}>
                    <td className="px-4 py-2 font-mono text-11 text-stone">{evt.id}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-0.5 rounded text-11 font-medium ${typeBadgeClass(evt.type)}`}>{evt.type}</span>
                    </td>
                    <td className="px-4 py-2">
                      <Link href={`/identity/${evt.person_id}`}>
                        <a className="font-mono text-12 text-proof-blue hover:underline">{evt.person_id}</a>
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
