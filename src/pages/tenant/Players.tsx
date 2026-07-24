import React, { useState } from 'react';
import { Link } from 'wouter';
import { AppShell } from '@/components/layout/AppShell';
import { PreviewBadge } from '@/components/data/PreviewBadge';
import { StatusChip } from '@/components/domain/StatusChip';
import { ScenarioStateGate, StateShowcase } from '@/components/state/ScenarioStateGate';
import { db } from '@/lib/fake/db';
import { EXPERTS, expertForPerson } from '@/lib/fake/experts';

export default function PlayersPage() {
  const [search, setSearch] = useState('');
  const [srcFilter, setSrcFilter] = useState('all');
  const [expertFilter, setExpertFilter] = useState<'all' | string>('all');
  const [ftdOnly, setFtdOnly] = useState(false);
  const [page, setPage] = useState(0);

  const sources = ['all', 'meta', 'tiktok', 'organic', 'orphan'];

  const filtered = db.persons.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.id.includes(search);
    const matchSrc = srcFilter === 'all' || p.source === srcFilter;
    const matchFtd = !ftdOnly || !!p.ftd_at;
    const exp = expertForPerson(p.id);
    const matchExp = expertFilter === 'all' || exp?.id === expertFilter;
    return matchSearch && matchSrc && matchFtd && matchExp;
  });

  const pageSize = 25;
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice(page * pageSize, (page + 1) * pageSize);

  const srcBadgeClass = (src: string) => {
    switch (src) {
      case 'meta': return 'bg-proof-blue/10 text-proof-blue border border-proof-blue/20';
      case 'tiktok': return 'bg-warning/10 text-warning border border-warning/20';
      case 'organic': return 'bg-verified/10 text-verified border border-verified/20';
      default: return 'bg-critical/10 text-critical border border-critical/20';
    }
  };

  return (
    <AppShell breadcrumb={[{ label: 'Players' }]}>
      <div className="max-w-7xl mx-auto space-y-4">
        <header className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-13 font-serif italic text-stone leading-none">Observe · Players</span>
            <PreviewBadge />
            <StateShowcase />
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <h1 className="text-24 font-semibold text-eggshell font-sans">Cada jogador, sua trilha completa.</h1>
            <span className="text-13 text-stone font-mono tabular-nums">{filtered.length} resultados</span>
          </div>
        </header>

        <ScenarioStateGate
          emptyTitle="Sem jogadores no período"
          emptyDescription="Nenhum registro no recorte atual."
        >

        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-3 bg-graphite border border-line rounded-xl p-3">
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(0); }}
            placeholder="Buscar por nome ou ID..."
            className="bg-zinc border border-line text-eggshell rounded-md px-3 py-1.5 text-13 outline-none focus:border-proof-blue w-64"
          />
          <select
            value={srcFilter}
            onChange={e => { setSrcFilter(e.target.value); setPage(0); }}
            className="bg-zinc border border-line text-eggshell rounded-md px-3 py-1.5 text-13 outline-none focus:border-proof-blue"
          >
            {sources.map(s => <option key={s} value={s}>{s === 'all' ? 'Todas as origens' : s}</option>)}
          </select>
          <select
            value={expertFilter}
            onChange={e => { setExpertFilter(e.target.value); setPage(0); }}
            className="bg-zinc border border-line text-eggshell rounded-md px-3 py-1.5 text-13 outline-none focus:border-proof-blue"
          >
            <option value="all">Todos os Experts</option>
            {EXPERTS.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
          <label className="flex items-center gap-2 cursor-pointer text-13 text-stone">
            <input
              type="checkbox"
              checked={ftdOnly}
              onChange={e => { setFtdOnly(e.target.checked); setPage(0); }}
              className="accent-proof-blue"
            />
            FTD apenas
          </label>
        </div>

        {/* Table */}
        <div className="bg-graphite border border-line rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-line bg-iron">
                <tr>
                  <th className="px-4 py-3 text-12 font-bold text-stone uppercase">ID</th>
                  <th className="px-4 py-3 text-12 font-bold text-stone uppercase">Nome</th>
                  <th className="px-4 py-3 text-12 font-bold text-stone uppercase">Origem</th>
                  <th className="px-4 py-3 text-12 font-bold text-stone uppercase hidden md:table-cell">Expert</th>
                  <th className="px-4 py-3 text-12 font-bold text-stone uppercase text-right">Score</th>
                  <th className="px-4 py-3 text-12 font-bold text-stone uppercase">Status</th>
                  <th className="px-4 py-3 text-12 font-bold text-stone uppercase text-center">FTD</th>
                  <th className="px-4 py-3 text-12 font-bold text-stone uppercase text-right">Total</th>
                  <th className="px-4 py-3 text-12 font-bold text-stone uppercase"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {paged.map(p => {
                  const exp = expertForPerson(p.id);
                  return (
                  <tr key={p.id} className="hover:bg-zinc transition-colors">
                    <td className="px-4 py-3 font-mono text-11 text-stone">{p.id}</td>
                    <td className="px-4 py-3 text-13 text-eggshell">{p.name}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-11 font-medium ${srcBadgeClass(p.source)}`}>{p.source}</span>
                    </td>
                    <td className="px-4 py-3 text-12 text-eggshell hidden md:table-cell">
                      {exp ? exp.name : <span className="text-stone">—</span>}
                    </td>
                    <td className="px-4 py-3 font-mono text-13 text-stone text-right">{p.score}</td>
                    <td className="px-4 py-3"><StatusChip status={p.status} /></td>
                    <td className="px-4 py-3 text-center">
                      {p.ftd_at
                        ? <span className="text-verified font-bold">✓</span>
                        : <span className="text-stone">–</span>}
                    </td>
                    <td className="px-4 py-3 font-mono text-13 text-right text-eggshell">R$ {p.total_deposited.toLocaleString('pt-BR')}</td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/players/${p.id}`} className="text-[var(--proof-blue)] text-12 font-medium hover:underline">
                        Ver →
                      </Link>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-4 py-3 border-t border-line flex items-center justify-between bg-iron">
            <span className="text-12 text-stone font-mono">
              {filtered.length === 0 ? '0' : `${page * pageSize + 1}–${Math.min((page + 1) * pageSize, filtered.length)}`} de {filtered.length}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-3 py-1.5 bg-zinc border border-line text-eggshell text-13 rounded-md disabled:opacity-40 hover:border-stone transition-colors"
              >
                Anterior
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="px-3 py-1.5 bg-zinc border border-line text-eggshell text-13 rounded-md disabled:opacity-40 hover:border-stone transition-colors"
              >
                Próximo
              </button>
            </div>
          </div>
        </div>
        </ScenarioStateGate>
      </div>
    </AppShell>
  );
}
