import React, { useState } from 'react';
import { AppShell, useEvidence } from '@/components/layout/AppShell';
import { PreviewBadge } from '@/components/data/PreviewBadge';
import { MetricValue } from '@/components/data/MetricValue';
import { DataTable, ColumnDef } from '@/components/data/DataTable';
import { ScenarioStateGate, StateShowcase } from '@/components/state/ScenarioStateGate';
import { buildEvidence } from '@/lib/evidence';
import { db } from '@/lib/fake/db';
import { useAppState } from '@/lib/context/AppStateContext';
import { Plus, Filter, X } from 'lucide-react';
import { useLocation } from 'wouter';
import { toast } from 'sonner';

const fmt = { int: (n: number) => n.toLocaleString('pt-BR') };

interface Clause { field: string; op: string; value: string }
interface Group { op: 'AND' | 'OR'; clauses: Clause[]; groups: Group[] }

const EMPTY: Group = { op: 'AND', clauses: [{ field: 'ftd', op: '=', value: 'sim' }], groups: [] };

function GroupEditor({ group, onChange, depth = 0 }: { group: Group; onChange: (g: Group) => void; depth?: number }) {
  return (
    <div className={`rounded-lg p-3 space-y-2 ${depth > 0 ? 'border border-line/60 bg-iron/40' : ''}`}>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange({ ...group, op: group.op === 'AND' ? 'OR' : 'AND' })}
          className="px-2 py-1 rounded bg-proof-blue/10 text-proof-blue border border-proof-blue/20 font-mono text-11 font-bold"
        >
          {group.op}
        </button>
        <span className="text-11 font-mono uppercase tracking-wider text-stone">grupo · profundidade {depth}</span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {group.clauses.map((c, i) => (
          <span key={i} className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-zinc border border-line text-12 text-eggshell">
            <span className="font-mono text-stone">{c.field}</span>
            <span className="font-mono text-proof-blue">{c.op}</span>
            <span className="font-mono">{c.value}</span>
            <button onClick={() => onChange({ ...group, clauses: group.clauses.filter((_, j) => j !== i) })} className="text-stone hover:text-critical">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <button
          onClick={() => onChange({ ...group, clauses: [...group.clauses, { field: 'origem', op: '=', value: 'Meta' }] })}
          className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-line text-12 text-stone hover:text-eggshell"
        >
          <Plus className="w-3 h-3" /> Filtro
        </button>
        {depth < 2 && (
          <button
            onClick={() => onChange({ ...group, groups: [...group.groups, { op: 'AND', clauses: [{ field: 'stage', op: '=', value: 'VIP' }], groups: [] }] })}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-proof-blue/30 text-12 text-proof-blue hover:bg-proof-blue/10"
          >
            <Plus className="w-3 h-3" /> Grupo aninhado
          </button>
        )}
      </div>
      {group.groups.map((g, i) => (
        <GroupEditor
          key={i}
          group={g}
          depth={depth + 1}
          onChange={(ng) => onChange({ ...group, groups: group.groups.map((x, j) => (j === i ? ng : x)) })}
        />
      ))}
    </div>
  );
}

function serialize(g: Group): string {
  const parts = [
    ...g.clauses.map(c => `${c.field} ${c.op} ${c.value}`),
    ...g.groups.map(gg => `(${serialize(gg)})`),
  ];
  return parts.join(` ${g.op} `);
}

export default function SegmentsPage() {
  const { state, dispatch } = useAppState();
  const { openEvidence } = useEvidence();
  const [, setLocation] = useLocation();
  const [group, setGroup] = useState<Group>(EMPTY);
  const [queryResult, setQueryResult] = useState<number | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [newSegName, setNewSegName] = useState('');

  const allSegments = [
    ...db.segments.map(s => ({ ...s, is_dynamic: false })),
    ...state.customSegments.map(s => ({ id: s.id, name: s.name, rule_summary: s.rule, count: s.count, created_at: new Date().toISOString(), is_dynamic: true })),
  ];

  const totalCovered = allSegments.reduce((s, x) => s + x.count, 0);

  const handleVisualize = () => setQueryResult(10 + Math.floor(Math.random() * 41));

  const handleSave = () => {
    if (!newSegName.trim()) return;
    dispatch({
      type: 'ADD_SEGMENT',
      seg: { id: `seg_custom_${Date.now()}`, name: newSegName.trim(), rule: serialize(group), count: queryResult ?? 0 },
    });
    setNewSegName('');
    setShowSaveDialog(false);
    setQueryResult(null);
    toast('Segmento dinâmico salvo.');
  };

  const columns: ColumnDef<typeof allSegments[number]>[] = [
    { header: 'Nome', accessorKey: 'name', cell: (s) => (
      <div className="flex items-center gap-2">
        <span className="text-14 font-medium text-eggshell">{s.name}</span>
        {s.is_dynamic && <span className="px-1.5 py-0.5 rounded text-10 font-mono uppercase tracking-wider bg-proof-blue/10 text-proof-blue border border-proof-blue/20">dinâmico</span>}
      </div>
    )},
    { header: 'Regra', accessorKey: 'rule_summary', cell: (s) => <span className="font-mono text-12 text-stone">{s.rule_summary}</span> },
    { header: 'Players', accessorKey: 'count', className: 'text-right', cell: (s) => (
      <button
        onClick={(e) => { e.stopPropagation(); openEvidence(buildEvidence({
          label: `Contagem · ${s.name}`, value: fmt.int(s.count),
          formula: `count(persons) where ${s.rule_summary}`,
          source: 'Query Builder · avaliação materializada',
          freshness: 'atualizado há 12m',
        })); }}
        className="font-mono text-13 text-eggshell tabular-nums hover:text-proof-blue"
      >{fmt.int(s.count)}</button>
    )},
    { header: 'Ação', accessorKey: 'id', className: 'text-right', cell: (s) => (
      <button onClick={(e) => { e.stopPropagation(); setLocation(`/broadcasts?seg=${s.id}`); }} className="text-12 text-proof-blue hover:underline">Usar em Broadcast →</button>
    )},
  ];

  return (
    <AppShell breadcrumb={[{ label: 'Operate' }, { label: 'Broadcasts', href: '/broadcasts' }, { label: 'Segmentos' }]}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-11 font-serif italic text-stone mb-1">Operate · Broadcasts · Segmentos</div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-24 font-bold text-eggshell">Segmentos</h1>
              <PreviewBadge />
              <StateShowcase />
            </div>
            <p className="text-13 text-stone mt-1">Grupos dinâmicos com query builder AND/OR aninhado.</p>
          </div>
        </div>

        <ScenarioStateGate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button onClick={() => openEvidence(buildEvidence({
              label: 'Segmentos ativos', value: fmt.int(allSegments.length),
              formula: 'count(segments)', source: 'Query Builder',
            }))} className="text-left bg-graphite border border-line rounded-xl p-4 hover:border-stone transition-colors">
              <div className="text-11 uppercase tracking-wider text-stone font-mono">Segmentos ativos</div>
              <div className="mt-2"><MetricValue value={fmt.int(allSegments.length)} size="lg" /></div>
            </button>
            <button onClick={() => openEvidence(buildEvidence({
              label: 'Players cobertos', value: fmt.int(totalCovered),
              formula: 'sum(distinct segment.count)', source: 'Query Builder',
            }))} className="text-left bg-graphite border border-line rounded-xl p-4 hover:border-stone transition-colors">
              <div className="text-11 uppercase tracking-wider text-stone font-mono">Players cobertos</div>
              <div className="mt-2"><MetricValue value={fmt.int(totalCovered)} size="lg" /></div>
            </button>
          </div>

          <div className="bg-graphite border border-line rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-stone" />
              <h3 className="text-14 font-semibold text-eggshell">Query Builder · AND/OR aninhado</h3>
            </div>
            <GroupEditor group={group} onChange={setGroup} />
            <div className="font-mono text-11 text-stone bg-zinc border border-line rounded p-2">{serialize(group)}</div>
            <div className="flex items-center gap-3 flex-wrap">
              <button onClick={handleVisualize} className="bg-zinc border border-line text-eggshell px-4 py-2 rounded-md font-medium text-14 hover:border-stone">Visualizar resultado</button>
              <button onClick={() => { if (queryResult !== null) setShowSaveDialog(true); else handleVisualize(); }} className="bg-eggshell text-ink px-4 py-2 rounded-md font-medium text-14 hover:bg-white">Salvar segmento</button>
              {queryResult !== null && (
                <span className="text-13 font-mono text-eggshell tabular-nums">Resultado: <span className="text-proof-blue font-bold">{queryResult}</span> players</span>
              )}
            </div>
          </div>

          <DataTable data={allSegments} columns={columns} />
        </ScenarioStateGate>

        {showSaveDialog && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowSaveDialog(false)}>
            <div className="bg-graphite border border-line rounded-xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
              <h3 className="text-16 font-semibold text-eggshell mb-4">Salvar segmento dinâmico</h3>
              <input type="text" value={newSegName} onChange={e => setNewSegName(e.target.value)} placeholder="Nome do segmento…" className="w-full bg-zinc border border-line text-eggshell rounded-md px-3 py-2 text-14 outline-none focus:border-proof-blue mb-4" autoFocus />
              <div className="flex gap-3 justify-end">
                <button onClick={() => setShowSaveDialog(false)} className="px-4 py-2 text-stone hover:text-eggshell text-14">Cancelar</button>
                <button onClick={handleSave} className="bg-eggshell text-ink px-4 py-2 rounded-md font-medium text-14 hover:bg-white">Salvar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
