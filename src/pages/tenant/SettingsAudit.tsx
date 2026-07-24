import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PreviewBadge } from '@/components/data/PreviewBadge';
import { useAppState } from '@/lib/context/AppStateContext';


const fmtDT = (iso: string) => {
  try {
    return new Date(iso).toLocaleString('pt-BR');
  } catch {
    return iso;
  }
};

const TYPE_OPTIONS = [
  { value: 'all', label: 'Todos' },
  { value: 'Integração', label: 'Integração' },
  { value: 'Convite', label: 'Convite' },
  { value: 'Kill Switch', label: 'Kill Switch' },
  { value: 'Aprovação', label: 'Aprovação' },
  { value: 'Exportação', label: 'Exportação' },
  { value: 'Reconciliação', label: 'Reconciliação' },
  { value: 'Sistema', label: 'Sistema' },
];

interface AuditEntryExtended { timestamp: string; user: string; action: string; object: string; detail: string; ip?: string; }

const historicalEntries: AuditEntryExtended[] = [
  { timestamp: '2026-07-22T14:23:00Z', user: 'João Oliveira', action: 'Integração criada', object: 'Meta CAPI', detail: 'Novo pixel configurado: pixel_001', ip: '189.x.x.x' },
  { timestamp: '2026-07-21T09:15:00Z', user: 'Maria Santos', action: 'Convite enviado', object: 'ana@operacaobrasil.com', detail: 'Função: Analista', ip: '177.x.x.x' },
  { timestamp: '2026-07-20T16:45:00Z', user: 'João Oliveira', action: 'Link criado', object: 'fb-lp-julho-v3', detail: 'Destino: /registro', ip: '189.x.x.x' },
  { timestamp: '2026-07-19T11:30:00Z', user: 'Carlos Lima', action: 'Relatório exportado', object: 'P&L Semanal', detail: 'Formato: CSV', ip: '200.x.x.x' },
  { timestamp: '2026-07-18T08:00:00Z', user: 'Sistema', action: 'Reconciliação automática', object: 'Período Jun/2026', detail: '89 eventos processados', ip: 'sistema' },
];

export default function SettingsAuditPage() {
  const { state } = useAppState();
  const [typeFilter, setTypeFilter] = useState('all');
  const [search, setSearch] = useState('');

  const allEntries: AuditEntryExtended[] = [...state.auditLog, ...historicalEntries].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const typeFilterLabel = TYPE_OPTIONS.find(o => o.value === typeFilter)?.label ?? '';

  const filtered = allEntries.filter(e => {
    const matchType = typeFilter === 'all' || e.action.includes(typeFilterLabel);
    const q = search.toLowerCase();
    const matchSearch = !search ||
      e.user.toLowerCase().includes(q) ||
      e.action.toLowerCase().includes(q) ||
      e.object.toLowerCase().includes(q);
    return matchType && matchSearch;
  });

  return (
    <AppShell breadcrumb={[{ label: 'Configurações' }, { label: 'Log de Auditoria' }]}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <div className="text-11 font-serif italic text-[var(--stone)] mb-1">Prova · Rastro imutável</div>
          <div className="flex items-center gap-3">
            <h1 className="text-24 font-bold text-[var(--eggshell)]">Log de Auditoria</h1>
            <PreviewBadge />
          </div>
          <p className="text-13 text-[var(--stone)] mt-1">Registro de todas as ações administrativas do workspace</p>
        </div>


        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Buscar por usuário, ação ou objeto…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-[var(--zinc)] border border-[var(--line)] rounded-md px-3 py-2 text-14 text-[var(--eggshell)] placeholder:text-[var(--stone)] outline-none focus:border-[var(--proof-blue)]"
          />
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="bg-[var(--zinc)] border border-[var(--line)] text-[var(--eggshell)] rounded-md px-3 py-2 text-13 outline-none focus:border-[var(--proof-blue)]"
          >
            {TYPE_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        <div className="bg-[var(--graphite)] border border-[var(--line)] rounded-xl overflow-hidden">
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-14 text-[var(--stone)]">Nenhum registro encontrado.</div>
          ) : (
            <table className="w-full text-14">
              <thead>
                <tr className="border-b border-[var(--line)]">
                  {['Timestamp', 'Usuário', 'Ação', 'Objeto', 'Detalhe', 'IP'].map(h => (
                    <th key={h} className="text-left text-11 font-semibold text-[var(--stone)] uppercase px-4 py-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((e, i) => (
                  <tr key={i} className="border-b border-[var(--line)] hover:bg-[var(--iron)] transition-colors">
                    <td className="px-4 py-3 font-mono text-12 text-[var(--stone)] whitespace-nowrap">{fmtDT(e.timestamp)}</td>
                    <td className="px-4 py-3 text-[var(--eggshell)] text-13">{e.user}</td>
                    <td className="px-4 py-3 text-[var(--eggshell)] text-13 font-medium">{e.action}</td>
                    <td className="px-4 py-3 font-mono text-12 text-[var(--eggshell)]">{e.object}</td>
                    <td className="px-4 py-3 text-13 text-[var(--stone)] max-w-xs truncate">{e.detail}</td>
                    <td className="px-4 py-3 font-mono text-[11px] text-[var(--stone)]">{e.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="text-12 text-[var(--stone)]">{filtered.length} registro(s) exibido(s)</div>
      </div>
    </AppShell>
  );
}
